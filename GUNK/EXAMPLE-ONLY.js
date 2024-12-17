import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function simpleTest() {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Start a chat
    const chat = model.startChat();
    
    try {
        // Send a simple message
        const result = await chat.sendMessage("Hi! How are you?");
        const response = await result.response.text();
        console.log("Response:", response);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the test
simpleTest();
