import { GoogleGenerativeAI } from "@google/generative-ai";
import { HARPER_CONTEXT } from "../../harper-context";
import outputService from '../../services/outputService.js';
import { db, queries } from '../../data/db.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

const safetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
];

const generationConfig = {
    temperature: 0.7,
    topP: 0.7,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// export const handler = async (event, context) => {
//     if (event.httpMethod !== "POST") {
//         return { statusCode: 405, body: "Method Not Allowed" };
//     }

//     try {
//         const { message, history = [] } = JSON.parse(event.body);
//         console.log('Incoming message:', message);

//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.0-flash-exp",
//             safetySettings,
//             generationConfig
//         });

//         const chat = model.startChat({ generationConfig, history });

//         const result = await chat.sendMessage(`${HARPER_CONTEXT}\n\nUser message: ${message}`);
//         const response = await result.response.text();
//         console.log('Harper response:', response);

//         if (isSoundEngineeringContent(message) || isSoundEngineeringContent(response)) {
//             const metadata = {
//                 userMessage: message,
//                 timestamp: new Date().toISOString(),
//                 context: history.slice(-5)
//             };

//             await outputService.saveOutput('sound_engineering', response, metadata);
//             console.log('Sound engineering output saved.');
//         }

//         const updatedHistory = [...history, 
//             { role: "user", parts: [{ text: message }] },
//             { role: "model", parts: [{ text: response }] }
//         ];

//         // Save to chat history
//         queries.insertChatMessage.run('user', message, 'default-session');
//         queries.insertChatMessage.run('assistant', response, 'default-session');

//         return {
//             statusCode: 200,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ response, history: updatedHistory }),
//         };

//     } catch (error) {
//         console.error("Chat error:", error);
//         return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
//     }
// };

export const handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { message, history = [] } = JSON.parse(event.body);
        console.log("[DEBUG] Incoming message:", message); // Log the user's message
        console.log("[DEBUG] Current history:", history); // Log the current chat history

        // Create the generative model with safety settings
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            safetySettings,
            generationConfig
        });

        console.log("[DEBUG] Model initialized with safety settings.");

        // Start a chat and send the user message
        const chat = model.startChat({ generationConfig, history });
        console.log("[DEBUG] Chat started.");

        const result = await chat.sendMessage(`${HARPER_CONTEXT}\n\nUser message: ${message}`);
        console.log("[DEBUG] Result received:", result);

        const response = await result.response.text();
        console.log("[DEBUG] Harper response:", response);

        // Check for sound engineering content
        if (isSoundEngineeringContent(message) || isSoundEngineeringContent(response)) {
            const metadata = {
                userMessage: message,
                timestamp: new Date().toISOString(),
                context: history.slice(-5)
            };

            await outputService.saveOutput('sound_engineering', response, metadata);
            console.log("[DEBUG] Sound engineering output saved.");
        }

        // Update the chat history
        const updatedHistory = [...history, 
            { role: "user", parts: [{ text: message }] },
            { role: "model", parts: [{ text: response }] }
        ];

        console.log("[DEBUG] Updated history:", updatedHistory);

        // Save messages to the database
        queries.insertChatMessage.run('user', message, 'default-session');
        queries.insertChatMessage.run('assistant', response, 'default-session');
        console.log("[DEBUG] Messages saved to database.");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ response, history: updatedHistory }),
        };

    } catch (error) {
        console.error("[DEBUG] Chat error:", error); // Log errors
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
