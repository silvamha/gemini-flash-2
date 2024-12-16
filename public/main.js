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

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
}

// Load saved theme
function loadTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
    }
}

// Add a message to the chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message harper-message';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to history with consistent format
    const message = {
        role: isUser ? "user" : "model",
        parts: [{ text }]
    };
    chatHistory.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Show/hide loading indicator
function setLoading(isLoading) {
    loadingIndicator.className = isLoading ? '' : 'hidden';
}

// Send message to Harper
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';

    // Show loading indicator
    setLoading(true);

    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history: chatHistory }),
        });

        const data = await response.json();
        
        if (response.ok) {
            chatHistory = data.history;
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            addMessage(data.response);
        } else {
            addMessage('Sorry, I had trouble processing that. Please try again! ');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Oops! Something went wrong. Please try again! ');
    }

    setLoading(false);
}

// Clear chat history
function clearChat() {
    messagesContainer.innerHTML = '';
    chatHistory = [];
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
document.addEventListener('DOMContentLoaded', loadTheme);
sendButton.addEventListener('click', sendMessage);
clearButton.addEventListener('click', clearChat);

// Handle Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

console.log('History to save:', chatHistory);