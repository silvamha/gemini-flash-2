// // db.js - Our safe and reliable database connection
// import sqlite3 from 'better-sqlite3';
// import path from 'path';
// import fs from 'fs';

// // Make sure our database directory exists
// const DB_DIR = path.join(process.cwd(), 'data');
// if (!fs.existsSync(DB_DIR)) {
//     fs.mkdirSync(DB_DIR, { recursive: true });
// }

// // Database file path
// const DB_PATH = path.join(DB_DIR, 'harper.db');

// // Create database connection with WAL mode for better reliability
// const db = sqlite3(DB_PATH, {
//     // WAL mode prevents database locks and is more reliable
//     fileMustExist: false,
//     verbose: console.log
// });

// // Enable Write-Ahead Logging for better performance and reliability
// db.pragma('journal_mode = WAL');


// // Create our tables if they don't exist
// const initDb = () => {
//     // Outputs table - for Harper's valuable sound engineering data
//     db.exec(`
//         CREATE TABLE IF NOT EXISTS outputs (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             timestamp TEXT NOT NULL,
//             type TEXT NOT NULL,
//             content TEXT NOT NULL,
//             metadata TEXT,
//             created_at TEXT DEFAULT CURRENT_TIMESTAMP
//         );
//     `);

//     // Chat history table - for context and reference
//     db.exec(`
//         CREATE TABLE IF NOT EXISTS chat_history (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             role TEXT NOT NULL,
//             content TEXT NOT NULL,
//             timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
//             session_id TEXT NOT NULL
//         );
//     `);
// };


// // Initialize database
// try {
//     initDb();
//     console.log('Database initialized successfully');
// } catch (error) {
//     console.error('Database initialization error:', error);
//     throw error;
// }

// // Prepare some common queries for better performance
// const queries = {
//     insertOutput: db.prepare(`
//         INSERT INTO outputs (timestamp, type, content, metadata)
//         VALUES (?, ?, ?, ?)
//     `),

//     insertChatMessage: db.prepare(`
//         INSERT INTO chat_history (role, content, session_id)
//         VALUES (?, ?, ?)
//     `),

//     getRecentOutputs: db.prepare(`
//         SELECT * FROM outputs 
//         ORDER BY timestamp DESC 
//         LIMIT ?
//     `),

//     getOutputsByType: db.prepare(`
//         SELECT * FROM outputs 
//         WHERE type = ? 
//         ORDER BY timestamp DESC
//     `),

//     getChatHistory: db.prepare(`
//         SELECT * FROM chat_history 
//         WHERE session_id = ? 
//         ORDER BY timestamp ASC
//     `)
// };

// export { db, queries };

import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'harper.db');

const db = sqlite3(DB_PATH, { verbose: console.log });

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS outputs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        session_id TEXT NOT NULL
    );
`);

const queries = {
    insertOutput: db.prepare(`
        INSERT INTO outputs (timestamp, type, content, metadata)
        VALUES (?, ?, ?, ?)
    `),
    insertChatMessage: db.prepare(`
        INSERT INTO chat_history (role, content, session_id)
        VALUES (?, ?, ?)
    `),
    getRecentOutputs: db.prepare(`
        SELECT * FROM outputs ORDER BY timestamp DESC LIMIT ?
    `),
    getChatHistory: db.prepare(`
        SELECT * FROM chat_history WHERE session_id = ? ORDER BY timestamp ASC
    `)
};

export { db, queries };
