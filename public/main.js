// // DOM Elements
// const themeToggle = document.getElementById('theme-toggle');
// const userInput = document.getElementById('user-input');
// const sendButton = document.getElementById('send-button');
// const clearButton = document.getElementById('clear-chat');
// const messagesContainer = document.getElementById('chat-messages');
// const loadingIndicator = document.getElementById('loading');

// // Chat history
// let chatHistory = [];
// try {
//     const saved = localStorage.getItem('chatHistory');
//     chatHistory = saved ? JSON.parse(saved) : [];
// } catch (e) {
//     console.error('Error loading chat history:', e);
//     chatHistory = [];
// }

// document.addEventListener('DOMContentLoaded', () => {
//     loadTheme();
    
//     // Load chat history from localStorage
//     const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
//     savedHistory.forEach(({ parts, role }) => {
//         addMessage(parts[0].text, role === "user");
//     });
// });


// // Theme Toggle
// function toggleTheme() {
//     document.body.classList.toggle('dark-theme');
//     const isDark = document.body.classList.contains('dark-theme');
//     localStorage.setItem('darkTheme', isDark);
// }

// // Load saved theme
// function loadTheme() {
//     const isDark = localStorage.getItem('darkTheme') === 'true';
//     if (isDark) {
//         document.body.classList.add('dark-theme');
//     }
// }

// // Add a message to the chat
// // function addMessage(text, isUser = false) {
// //     const messageDiv = document.createElement('div');
// //     messageDiv.className = isUser ? 'message user-message' : 'message harper-message';
// //     messageDiv.textContent = text;
// //     messagesContainer.appendChild(messageDiv);
// //     messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
// //     // Add to history with consistent format
// //     const message = {
// //         role: isUser ? "user" : "model",
// //         parts: [{ text }]
// //     };
// //     chatHistory.push(message);
// //     localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
// // }

// function addMessage(text, isUser = false) {
//     const message = {
//         role: isUser ? "user" : "model",
//         parts: [{ text }]
//     };

//     console.log(`[DEBUG] addMessage called for: ${text}, isUser: ${isUser}`); // Debugging

//     // Prevent duplicates for user messages
//     if (isUser) {
//         const isDuplicate = chatHistory.some(
//             (msg) => JSON.stringify(msg.parts) === JSON.stringify(message.parts)
//         );
//         if (isDuplicate) {
//             console.log(`[DEBUG] Duplicate user message ignored: ${text}`);
//             return;
//         }
//     }

//     // Add message to UI
//     const messageDiv = document.createElement('div');
//     messageDiv.className = isUser ? 'message user-message' : 'message harper-message';
//     messageDiv.textContent = text;
//     messagesContainer.appendChild(messageDiv);
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;

//     // Add to history and save to localStorage
//     chatHistory.push(message);
//     localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
// }





// // Show/hide loading indicator
// function setLoading(isLoading) {
//     loadingIndicator.className = isLoading ? '' : 'hidden';
// }

// // Send message to Harper
// // async function sendMessage() {
// //     const message = userInput.value.trim();
// //     if (!message) return;

// //     // Add user message to chat
// //     addMessage(message, true);
// //     userInput.value = '';

// //     // Show loading indicator
// //     setLoading(true);

// //     try {
// //         const response = await fetch('/.netlify/functions/chat', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({ message, history: chatHistory }),
// //         });

// //         const data = await response.json();
        
// //         if (response.ok) {
// //             chatHistory = data.history;
// //             localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
// //             addMessage(data.response);
// //         } else {
// //             addMessage('Sorry, I had trouble processing that. Please try again! ');
// //         }
// //     } catch (error) {
// //         console.error('Error:', error);
// //         addMessage('Oops! Something went wrong. Please try again! ');
// //     }

// //     setLoading(false);
// // }

// async function sendMessage() {
//     const message = userInput.value.trim(); // Get the user's input from the text box.
//     if (!message) return; // Stop if the input is empty.

//     addMessage(message, true); // Display the user's message in the UI.
//     userInput.value = ''; // Clear the text box.

//     setLoading(true); // Show the "loading" indicator.

//     try {
//         const response = await fetch('/.netlify/functions/chat', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ message, history: chatHistory }), // Send user input and chat history.
//         });

//         const data = await response.json(); // Parse the response from the server.
//         if (response.ok) {
//             addMessage(data.response); // Display the server's response in the UI.
//         } else {
//             addMessage('An error occurred. Please try again.'); // Show an error message.
//         }
//     } catch (error) {
//         console.error('Error:', error); // Log any unexpected issues.
//         addMessage('Oops! Something went wrong.'); // Display a fallback error message.
//     }

//     setLoading(false); // Hide the "loading" indicator.
//     console.log("[DEBUG] Sending request to chat.js with message:", message);

// }


// // Clear chat history
// function clearChat() {
//     messagesContainer.innerHTML = '';
//     chatHistory = [];
//     localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
// }

// // Event Listeners
// themeToggle.addEventListener('click', toggleTheme);
// document.addEventListener('DOMContentLoaded', loadTheme);
// sendButton.addEventListener('click', sendMessage);
// clearButton.addEventListener('click', clearChat);

// // Handle Enter key
// userInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         sendMessage();
//     }
// });

// console.log('History to save:', chatHistory);

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-chat');
const messagesContainer = document.getElementById('chat-messages');
const loadingIndicator = document.getElementById('loading');

// Chat history
let chatHistory = [];
try {
    const saved = localStorage.getItem('chatHistory');
    chatHistory = saved ? JSON.parse(saved) : [];
} catch (e) {
    console.error('Error loading chat history:', e);
    chatHistory = [];
}

// Add a message to the chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message harper-message';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const message = { role: isUser ? "user" : "model", parts: [{ text }] };
    chatHistory.push(message);

    // Prevent chat history from growing indefinitely
    if (chatHistory.length > 50) {
        chatHistory.shift();
    }

    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Show/hide loading indicator
function setLoading(isLoading) {
    loadingIndicator.className = isLoading ? '' : 'hidden';
}

// Send message to Harper
async function sendMessage() {
    const message = userInput.value.trim(); // Get the user's input
    if (!message) {
        console.error("[DEBUG] Empty user input detected.");
        addMessage("Oops! You need to type something before sending.", false);
        return;
    }

    console.log("[DEBUG] Sending request to chat.js with message:", message);
    addMessage(message, true); // Add user message to the chat
    userInput.value = ''; // Clear the input box
    setLoading(true); // Show loading indicator

    try {
        console.log("[DEBUG] Message before sending to backend:", message);
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: chatHistory }), // Send user input and chat history
        });

        const data = await response.json(); // Parse the response
        if (response.ok) {
            addMessage(data.response); // Display agent's response
        } else {
            console.error("[DEBUG] Server returned an error:", data);
            addMessage('An error occurred. Please try again.');
        }
    } catch (error) {
        console.error("[DEBUG] Error during fetch:", error);
        addMessage('Oops! Something went wrong.');
    } finally {
        setLoading(false); // Hide the loading indicator
    }
}

// Clear chat history
function clearChat() {
    messagesContainer.innerHTML = '';
    chatHistory = [];
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Load saved theme
function loadTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
document.addEventListener('DOMContentLoaded', loadTheme);
sendButton.addEventListener('click', sendMessage);
clearButton.addEventListener('click', clearChat);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

console.log("[DEBUG] History to save:", chatHistory);
