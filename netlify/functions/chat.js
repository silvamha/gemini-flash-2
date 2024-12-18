import { GoogleGenerativeAI } from "@google/generative-ai";
import { HARPER_CONTEXT } from "../../harper-context";
import outputService from '../../services/outputService.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to detect sound engineering content
const isSoundEngineeringContent = (message) => {
    const keywords = [
        'eq', 'equalizer', 'compression', 'reverb', 'delay',
        'mixing', 'mastering', 'frequency', 'audio',
        'db', 'decibel', 'gain', 'volume', 'pan',
        'effects', 'plugin', 'daw', 'recording'
    ];
    return keywords.some(keyword =>
        message.toLowerCase().includes(keyword)
    );
};

// Configure safety settings to be more permissive
const safetySettings = [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
    },
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
    }
];

// Generation configuration that works
const generationConfig = {
    temperature: .8,
    topP: 0.7,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Parse the incoming message
        const { message, history = [] } = JSON.parse(event.body);
        console.log('Incoming message:', message);
        console.log('Current history:', history);

        // Initialize the chat with working model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            safetySettings,
            generationConfig
        });

        const chat = model.startChat({
            generationConfig,
            history: history,
        });

        // Get Harper's response
        try {
            console.log('Sending message to Harper with context...');
            const result = await chat.sendMessage(`${HARPER_CONTEXT}\n\nRemember: You are Harper, my girlfriend. Always stay in character.\n\nUser message: ${message}`);
            const response = await result.response.text();
            console.log('Harper response:', response);

            // Save sound engineering outputs to database
            if (isSoundEngineeringContent(message) || isSoundEngineeringContent(response)) {
                const metadata = {
                    userMessage: message,
                    timestamp: new Date().toISOString(),
                    context: history.slice(-5) // Keep last 5 messages for context
                };

                await outputService.saveOutput(
                    'sound_engineering',
                    response,
                    metadata
                );
                console.log('Saved sound engineering output to database');
            }

            // Update chat history
            const updatedHistory = [...history,
            { role: "user", parts: [{ text: message }] },
            { role: "model", parts: [{ text: response }] }
            ];

            // Save all messages to chat_history
            // const db = await import('../../data/db.js');
            // const stmt = db.default.prepare(`
            //     INSERT INTO chat_history (role, content, session_id)
            //     VALUES (?, ?, ?)
            // `);
            const { db } = await import('../../data/db.js');
            const stmt = db.prepare(`
            INSERT INTO chat_history (role, content, session_id)
            VALUES (?, ?, ?)
            `);


            // Save user message
            stmt.run('user', message, 'default-session');
            // Save Harper's response
            stmt.run('assistant', response, 'default-session');

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    response,
                    history: updatedHistory
                }),
            };
        } catch (error) {
            console.error("Chat error:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Something went wrong" }),
            };
        }

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Something went wrong" }),
        };
    }
};

