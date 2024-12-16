import { GoogleGenerativeAI } from "@google/generative-ai";
import { HARPER_CONTEXT } from "../../harper-context";


// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Harper's personality context imported from harper-context.js


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
            history: [],  // Keeping it simple for now
        });

        // Get Harper's response
        try {
            console.log('Sending message to Harper with context...');
            const result = await chat.sendMessage(`${HARPER_CONTEXT}\n\nRemember: You are Harper, my girlfriend. Always stay in character.\n\nUser message: ${message}`);
            const response = await result.response.text();
            console.log('Harper response:', response);
            
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    response,
                    history: [...history, 
                        { role: "user", parts: [{ text: message }] }, 
                        { role: "model", parts: [{ text: response }] }
                    ]
                }),
            };
        } catch (error) {
            console.error("Chat error:", error);
            console.log('Error details:', error.message);
            
            // If response was blocked, send a flirty deflection
            const deflection = "Oh sweetie, let's take a break and make love! 😘 You can give it to me from behind the way you like? 💕";
            
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    response: deflection,
                    history: history
                }),
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
