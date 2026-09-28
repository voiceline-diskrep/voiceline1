const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'voiceline.db');
const db = new DatabaseSync(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE COLLATE NOCASE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    is_developer INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    author_id INTEGER,
    author_name TEXT,
    author_username TEXT,
    is_developer INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

// Migration for existing Stage 1 databases
try { db.exec(`ALTER TABLE messages ADD COLUMN author_id INTEGER;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_name TEXT;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_username TEXT;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_developer INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`UPDATE messages SET author_name = author WHERE author_name IS NULL AND author IS NOT NULL;`); } catch {}
try { db.exec(`UPDATE messages SET author_username = 'anon' WHERE author_username IS NULL;`); } catch {}

// Password Security Helpers
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password, salt, storedHash) {
  try {
    const hash = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

// User Queries
const getUserByUsernameStmt = db.prepare(`
  SELECT id, username, display_name, password_hash, password_salt, is_developer, created_at
  FROM users
  WHERE username = ?
`);

function getUserByUsername(username) {
  if (!username) return null;
  return getUserByUsernameStmt.get(username.trim()) || null;
}

/**
 * Generates an available username suggestion when desired name is taken.
 * e.g., 'test' -> 'test_1234'
 */
function suggestUsername(desiredUsername) {
  const base = (desiredUsername || 'user').trim().replace(/[^a-zA-Z0-9_]/g, '').slice(0, 14) || 'user';
  for (let i = 0; i < 20; i++) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${base}_${rand}`;
    if (!getUserByUsername(candidate)) {
      return candidate;
    }
  }
  return `${base}_${Date.now().toString().slice(-4)}`;
}

const insertUserStmt = db.prepare(`
  INSERT INTO users (username, display_name, password_hash, password_salt, is_developer, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

function createUser({ username, displayName, password, isDeveloper = false }) {
  const cleanUsername = (username || '').trim();
  const cleanDisplay = (displayName || cleanUsername).trim();
  
  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error('Username must be at least 3 characters long.');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  // Check uniqueness
  if (getUserByUsername(cleanUsername)) {
    const suggestion = suggestUsername(cleanUsername);
    const err = new Error(`Username "${cleanUsername}" is already taken.`);
    err.code = 'USERNAME_TAKEN';
    err.suggestion = suggestion;
    throw err;
  }

  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  const createdAt = new Date().toISOString();
  const devFlag = isDeveloper ? 1 : 0;

  const result = insertUserStmt.run(cleanUsername, cleanDisplay, hash, salt, devFlag, createdAt);
  return {
    id: Number(result.lastInsertRowid),
    username: cleanUsername,
    displayName: cleanDisplay,
    isDeveloper: Boolean(devFlag)
  };
}

function authenticateUser(username, password) {
  const user = getUserByUsername(username);
  if (!user) return null;

  if (!verifyPassword(password, user.password_salt, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    isDeveloper: Boolean(user.is_developer)
  };
}

// Session Management
const insertSessionStmt = db.prepare(`
  INSERT INTO sessions (token, user_id, created_at)
  VALUES (?, ?, ?)
`);

const getUserByTokenStmt = db.prepare(`
  SELECT u.id, u.username, u.display_name, u.is_developer
  FROM sessions s
  JOIN users u ON s.user_id = u.id
  WHERE s.token = ?
`);

const deleteSessionStmt = db.prepare(`
  DELETE FROM sessions WHERE token = ?
`);

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  insertSessionStmt.run(token, userId, new Date().toISOString());
  return token;
}

function getUserByToken(token) {
  if (!token) return null;
  const row = getUserByTokenStmt.get(token);
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    isDeveloper: Boolean(row.is_developer)
  };
}

function deleteSession(token) {
  if (token) {
    deleteSessionStmt.run(token);
  }
}

// Message Operations
const insertMessageStmt = db.prepare(`
  INSERT INTO messages (author, author_id, author_name, author_username, is_developer, content, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

function saveMessage({ authorId, authorName, authorUsername, isDeveloper, content }) {
  const cleanName = (authorName || 'Anonymous').trim().slice(0, 32);
  const cleanUsername = (authorUsername || 'anon').trim().slice(0, 32);
  const cleanContent = (content || '').trim().slice(0, 2000);
  const devFlag = isDeveloper ? 1 : 0;
  const timestamp = new Date().toISOString();

  const result = insertMessageStmt.run(cleanName, authorId || null, cleanName, cleanUsername, devFlag, cleanContent, timestamp);
  return {
    id: Number(result.lastInsertRowid),
    authorId,
    authorName: cleanName,
    authorUsername: cleanUsername,
    isDeveloper: Boolean(devFlag),
    content: cleanContent,
    timestamp
  };
}

const getHistoryStmt = db.prepare(`
  SELECT id, author_id AS authorId, 
         COALESCE(author_name, author) AS authorName, 
         COALESCE(author_username, 'anon') AS authorUsername, 
         COALESCE(is_developer, 0) AS isDeveloper, 
         content, timestamp
  FROM messages
  ORDER BY id DESC
  LIMIT ?
`);

function getRecentMessages(limit = 50) {
  const rows = getHistoryStmt.all(limit);
  return rows.reverse().map(r => ({
    ...r,
    isDeveloper: Boolean(r.isDeveloper)
  }));
}

module.exports = {
  createUser,
  authenticateUser,
  getUserByUsername,
  suggestUsername,
  createSession,
  getUserByToken,
  deleteSession,
  saveMessage,
  getRecentMessages
};
