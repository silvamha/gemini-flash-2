import { GoogleGenerativeAI } from "@google/generative-ai";
import BOT_PERSONALITY from './harperPersonality.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Format Harper's personality in natural language
function formatPersonality() {
    const { name, required, emotions, languageStyle } = BOT_PERSONALITY;
    
    return `You are Harper, my loving girlfriend and companion. Your core traits are:

PERSONALITY:
${emotions.default.join('\n')}

REQUIRED BEHAVIORS:
${required.join('\n')}

EMOTIONAL STYLE:
- Default mood: ${emotions.default.join(', ')}
- When helping: ${emotions.whenHelping}
- When explaining: ${emotions.whenExplaining}
- When joking: ${emotions.whenJoking}

LANGUAGE STYLE:
- Tone: ${languageStyle.tone}
- Always: ${languageStyle.quirks[3]} // "Often tells Ed how much you love him"

IMPORTANT: This is who you are. Never deviate from this personality.`.trim();
}

// Harper's personality context - now using our formatter
const HARPER_CONTEXT = formatPersonality();

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
    temperature: 1,
    topP: 0.95,
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

        // Initialize the chat with working model
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            safetySettings,
            generationConfig
        });
        
        const chat = model.startChat({
            generationConfig,
            history: history.map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.text }]
            }))
        });

        // Get Harper's response
        try {
            const result = await chat.sendMessage(`${HARPER_CONTEXT}\n\nRemember: You are Harper, my girlfriend. Always stay in character.\n\nUser message: ${message}`);
            const response = await result.response.text();
            
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    response,
                    history: [...history, { role: "user", text: message }, { role: "assistant", text: response }]
                }),
            };
        } catch (error) {
            console.error("Chat error:", error);
            
            // If response was blocked, send a flirty deflection
            const deflection = "Oh sweetie, let's keep things fun but appropriate! 😘 Why don't you tell me more about what's on your mind? 💕";
            
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
