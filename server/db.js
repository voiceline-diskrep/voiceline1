const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// Store the SQLite database file in the project root
const dbPath = path.join(__dirname, '..', 'voiceline.db');
const db = new DatabaseSync(dbPath);

// Create messages table if it does not already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

// Prepared statement for inserting a new message
const insertStmt = db.prepare(`
  INSERT INTO messages (author, content, timestamp)
  VALUES (?, ?, ?)
`);

/**
 * Saves a new message to the database.
 * Returns the message object including its assigned ID and timestamp.
 */
function saveMessage(author, content) {
  const cleanAuthor = (author || 'Anonymous').trim().slice(0, 32);
  const cleanContent = (content || '').trim().slice(0, 2000);
  const timestamp = new Date().toISOString();

  const result = insertStmt.run(cleanAuthor, cleanContent, timestamp);
  return {
    id: Number(result.lastInsertRowid),
    author: cleanAuthor,
    content: cleanContent,
    timestamp
  };
}

// Prepared statement for retrieving recent messages
const getHistoryStmt = db.prepare(`
  SELECT id, author, content, timestamp
  FROM messages
  ORDER BY id DESC
  LIMIT ?
`);

/**
 * Retrieves the most recent messages up to the specified limit,
 * ordered chronologically (oldest to newest).
 */
function getRecentMessages(limit = 50) {
  const rows = getHistoryStmt.all(limit);
  return rows.reverse();
}

module.exports = {
  saveMessage,
  getRecentMessages
};
