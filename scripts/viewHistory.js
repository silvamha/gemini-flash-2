import sqlite3 from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database file path (going up one directory to reach project root)
const DB_PATH = path.join(__dirname, '..', 'data', 'harper.db');

// Create database connection
const db = sqlite3(DB_PATH, {
    fileMustExist: true,
    verbose: console.log
});

// Function to format timestamp
const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

// Get all chat history
const getChatHistory = () => {
    const query = db.prepare(`
        SELECT role, content, timestamp 
        FROM chat_history 
        ORDER BY timestamp DESC
        LIMIT 50
    `);
    
    return query.all();
};

// Display chat history
console.log('\n=== Chat History (Last 50 Messages) ===\n');
const history = getChatHistory();

history.forEach((msg) => {
    console.log(`[${formatDate(msg.timestamp)}] ${msg.role}:`);
    console.log(msg.content);
    console.log('-------------------\n');
});

// Close the database connection
db.close();