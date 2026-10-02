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

  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE COLLATE NOCASE NOT NULL,
    created_by INTEGER,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER DEFAULT 1,
    channel_id INTEGER DEFAULT 1,
    author TEXT,
    author_id INTEGER,
    author_name TEXT,
    author_username TEXT,
    is_developer INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

// Migrations
try { db.exec(`ALTER TABLE messages ADD COLUMN server_id INTEGER DEFAULT 1;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN channel_id INTEGER DEFAULT 1;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_id INTEGER;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_name TEXT;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_username TEXT;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_developer INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`UPDATE messages SET author_name = author WHERE author_name IS NULL AND author IS NOT NULL;`); } catch {}
try { db.exec(`UPDATE messages SET author_username = 'anon' WHERE author_username IS NULL;`); } catch {}
try { db.exec(`UPDATE messages SET server_id = 1 WHERE server_id IS NULL;`); } catch {}
try { db.exec(`UPDATE messages SET channel_id = 1 WHERE channel_id IS NULL;`); } catch {}

// Ensure default "General" server exists
const getDefaultServerStmt = db.prepare(`SELECT id, name FROM servers WHERE id = 1`);
if (!getDefaultServerStmt.get()) {
  const insertDefaultServerStmt = db.prepare(`
    INSERT INTO servers (id, name, created_by, created_at)
    VALUES (1, 'General', NULL, ?)
  `);
  insertDefaultServerStmt.run(new Date().toISOString());
}

// Ensure every server has at least one default channel: 'general'
const allServers = db.prepare(`SELECT id FROM servers`).all();
const checkChannelStmt = db.prepare(`SELECT id FROM channels WHERE server_id = ? LIMIT 1`);
const insertChannelStmt = db.prepare(`
  INSERT INTO channels (server_id, name, created_at)
  VALUES (?, ?, ?)
`);

for (const s of allServers) {
  if (!checkChannelStmt.get(s.id)) {
    insertChannelStmt.run(s.id, 'general', new Date().toISOString());
  }
}

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

// User Operations
const getUserByUsernameStmt = db.prepare(`
  SELECT id, username, display_name, password_hash, password_salt, is_developer, created_at
  FROM users
  WHERE username = ?
`);

function getUserByUsername(username) {
  if (!username) return null;
  return getUserByUsernameStmt.get(username.trim()) || null;
}

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

// Session Operations
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

// Server (Chat Room) Operations
const getAllServersStmt = db.prepare(`
  SELECT id, name, created_by AS createdBy, created_at AS createdAt
  FROM servers
  ORDER BY id ASC
`);

function getAllServers() {
  return getAllServersStmt.all();
}

const getServerByIdStmt = db.prepare(`
  SELECT id, name, created_by AS createdBy, created_at AS createdAt
  FROM servers
  WHERE id = ?
`);

function getServerById(id) {
  if (!id) return null;
  return getServerByIdStmt.get(Number(id)) || null;
}

const getServerByNameStmt = db.prepare(`
  SELECT id, name
  FROM servers
  WHERE name = ?
`);

function getServerByName(name) {
  if (!name) return null;
  return getServerByNameStmt.get(name.trim()) || null;
}

const insertServerStmt = db.prepare(`
  INSERT INTO servers (name, created_by, created_at)
  VALUES (?, ?, ?)
`);

function createServer({ name, createdBy }) {
  const cleanName = (name || '').trim();
  if (!cleanName || cleanName.length < 2 || cleanName.length > 32) {
    throw new Error('Server name must be between 2 and 32 characters long.');
  }

  if (getServerByName(cleanName)) {
    throw new Error(`A server named "${cleanName}" already exists.`);
  }

  const createdAt = new Date().toISOString();
  const result = insertServerStmt.run(cleanName, createdBy || null, createdAt);
  const serverId = Number(result.lastInsertRowid);

  // Automatically create default 'general' channel for new server
  insertChannelStmt.run(serverId, 'general', createdAt);

  return {
    id: serverId,
    name: cleanName,
    createdBy,
    createdAt
  };
}

// Channel Operations
const getChannelsByServerStmt = db.prepare(`
  SELECT id, server_id AS serverId, name, created_at AS createdAt
  FROM channels
  WHERE server_id = ?
  ORDER BY id ASC
`);

function getChannelsByServerId(serverId) {
  return getChannelsByServerStmt.all(Number(serverId));
}

const getChannelByIdStmt = db.prepare(`
  SELECT id, server_id AS serverId, name, created_at AS createdAt
  FROM channels
  WHERE id = ?
`);

function getChannelById(id) {
  if (!id) return null;
  return getChannelByIdStmt.get(Number(id)) || null;
}

const getChannelByNameStmt = db.prepare(`
  SELECT id, server_id AS serverId, name
  FROM channels
  WHERE server_id = ? AND name = ? COLLATE NOCASE
`);

function getChannelByName(serverId, name) {
  if (!serverId || !name) return null;
  return getChannelByNameStmt.get(Number(serverId), name.trim()) || null;
}

function cleanChannelName(rawName) {
  return (rawName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 32);
}

function createChannel({ serverId, name }) {
  const clean = cleanChannelName(name);
  if (!clean || clean.length < 2) {
    throw new Error('Channel name must be at least 2 characters long.');
  }

  const sId = Number(serverId);
  if (!getServerById(sId)) {
    throw new Error('Server not found.');
  }

  if (getChannelByName(sId, clean)) {
    throw new Error(`Channel #${clean} already exists in this server.`);
  }

  const createdAt = new Date().toISOString();
  const res = insertChannelStmt.run(sId, clean, createdAt);
  return {
    id: Number(res.lastInsertRowid),
    serverId: sId,
    name: clean,
    createdAt
  };
}

const deleteChannelStmt = db.prepare(`DELETE FROM channels WHERE id = ? AND server_id = ?`);
const deleteChannelMessagesStmt = db.prepare(`DELETE FROM messages WHERE channel_id = ?`);

function deleteChannel({ serverId, channelId }) {
  const sId = Number(serverId);
  const cId = Number(channelId);

  const channels = getChannelsByServerId(sId);
  if (channels.length <= 1) {
    throw new Error('Cannot delete channel. A server must keep at least one channel.');
  }

  const target = getChannelById(cId);
  if (!target || target.serverId !== sId) {
    throw new Error('Channel not found in this server.');
  }

  deleteChannelMessagesStmt.run(cId);
  deleteChannelStmt.run(cId, sId);
  return true;
}

// Message Operations
const insertMessageStmt = db.prepare(`
  INSERT INTO messages (server_id, channel_id, author, author_id, author_name, author_username, is_developer, content, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function saveMessage({ serverId = 1, channelId = 1, authorId, authorName, authorUsername, isDeveloper, content }) {
  const cleanName = (authorName || 'Anonymous').trim().slice(0, 32);
  const cleanUsername = (authorUsername || 'anon').trim().slice(0, 32);
  const cleanContent = (content || '').trim().slice(0, 2000);
  const devFlag = isDeveloper ? 1 : 0;
  const timestamp = new Date().toISOString();
  const sId = Number(serverId) || 1;
  const cId = Number(channelId) || 1;

  const result = insertMessageStmt.run(sId, cId, cleanName, authorId || null, cleanName, cleanUsername, devFlag, cleanContent, timestamp);
  return {
    id: Number(result.lastInsertRowid),
    serverId: sId,
    channelId: cId,
    authorId,
    authorName: cleanName,
    authorUsername: cleanUsername,
    isDeveloper: Boolean(devFlag),
    content: cleanContent,
    timestamp
  };
}

const getHistoryByChannelStmt = db.prepare(`
  SELECT id, server_id AS serverId, channel_id AS channelId, author_id AS authorId, 
         COALESCE(author_name, author) AS authorName, 
         COALESCE(author_username, 'anon') AS authorUsername, 
         COALESCE(is_developer, 0) AS isDeveloper, 
         content, timestamp
  FROM messages
  WHERE channel_id = ?
  ORDER BY id DESC
  LIMIT ?
`);

function getRecentMessages(channelId = 1, limit = 50) {
  const rows = getHistoryByChannelStmt.all(Number(channelId) || 1, limit);
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
  getAllServers,
  getServerById,
  getServerByName,
  createServer,
  getChannelsByServerId,
  getChannelById,
  getChannelByName,
  createChannel,
  deleteChannel,
  saveMessage,
  getRecentMessages
};
