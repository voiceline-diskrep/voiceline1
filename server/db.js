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

  CREATE TABLE IF NOT EXISTS friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_friendships_pair ON friendships(sender_id, receiver_id);

  CREATE TABLE IF NOT EXISTS direct_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_dm_pair ON direct_messages(sender_id, receiver_id);
`);

// Migrations
try { db.exec(`ALTER TABLE messages ADD COLUMN server_id INTEGER DEFAULT 1;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN channel_id INTEGER DEFAULT 1;`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL;`); } catch {}
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
  SELECT id, username, display_name, avatar_url, password_hash, password_salt, is_developer, created_at
  FROM users
  WHERE username = ?
`);

function getUserByUsername(username) {
  if (!username) return null;
  const row = getUserByUsernameStmt.get(username.trim());
  if (!row) return null;
  return {
    ...row,
    avatarUrl: row.avatar_url || null,
    isDeveloper: Boolean(row.is_developer)
  };
}

const getUserByIdStmt = db.prepare(`
  SELECT id, username, display_name, avatar_url, is_developer, created_at
  FROM users
  WHERE id = ?
`);

function getUserById(id) {
  if (!id) return null;
  const row = getUserByIdStmt.get(Number(id));
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url || null,
    isDeveloper: Boolean(row.is_developer),
    createdAt: row.created_at
  };
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
    avatarUrl: user.avatarUrl || null,
    isDeveloper: Boolean(user.is_developer)
  };
}

// Session Operations
const insertSessionStmt = db.prepare(`
  INSERT INTO sessions (token, user_id, created_at)
  VALUES (?, ?, ?)
`);

const getUserByTokenStmt = db.prepare(`
  SELECT u.id, u.username, u.display_name, u.avatar_url, u.is_developer
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
    avatarUrl: row.avatar_url || null,
    isDeveloper: Boolean(row.is_developer)
  };
}

const updateUserProfileStmt = db.prepare(`
  UPDATE users SET display_name = ?, avatar_url = ? WHERE id = ?
`);

function updateUserProfile({ userId, displayName, avatarUrl }) {
  const cleanDisplay = (displayName || '').trim().slice(0, 32);
  if (!cleanDisplay) {
    throw new Error('Display name cannot be empty.');
  }
  updateUserProfileStmt.run(cleanDisplay, avatarUrl !== undefined ? avatarUrl : null, Number(userId));
  return getUserById(userId);
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

// Friend System Operations
const findExistingFriendshipStmt = db.prepare(`
  SELECT id, sender_id, receiver_id, status
  FROM friendships
  WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
`);

const insertFriendshipStmt = db.prepare(`
  INSERT INTO friendships (sender_id, receiver_id, status, created_at, updated_at)
  VALUES (?, ?, 'pending', ?, ?)
`);

const updateFriendshipStatusStmt = db.prepare(`
  UPDATE friendships SET status = ?, updated_at = ? WHERE id = ?
`);

function sendFriendRequest(senderId, targetUsername) {
  const sId = Number(senderId);
  const cleanUsername = (targetUsername || '').trim();

  if (!cleanUsername) {
    throw new Error('Please enter a username.');
  }

  const target = getUserByUsername(cleanUsername);
  if (!target) {
    throw new Error(`User "@${cleanUsername}" does not exist.`);
  }

  if (target.id === sId) {
    throw new Error('You cannot add yourself as a friend.');
  }

  const existing = findExistingFriendshipStmt.get(sId, target.id, target.id, sId);
  const now = new Date().toISOString();

  if (existing) {
    if (existing.status === 'accepted') {
      throw new Error(`You are already friends with @${target.username}.`);
    }

    if (existing.sender_id === sId) {
      throw new Error(`Friend request to @${target.username} is already pending.`);
    }

    // Target user had already sent request to sender -> auto accept!
    updateFriendshipStatusStmt.run('accepted', now, existing.id);
    return {
      success: true,
      autoAccepted: true,
      friend: {
        id: target.id,
        username: target.username,
        displayName: target.display_name,
        isDeveloper: Boolean(target.is_developer)
      }
    };
  }

  // Create new pending friend request
  const result = insertFriendshipStmt.run(sId, target.id, now, now);
  return {
    success: true,
    friendshipId: Number(result.lastInsertRowid),
    targetId: target.id,
    targetUsername: target.username
  };
}

const getAcceptedFriendsStmt = db.prepare(`
  SELECT 
    f.id AS friendshipId,
    f.created_at AS friendsSince,
    CASE WHEN f.sender_id = ? THEN u2.id ELSE u1.id END AS id,
    CASE WHEN f.sender_id = ? THEN u2.username ELSE u1.username END AS username,
    CASE WHEN f.sender_id = ? THEN u2.display_name ELSE u1.display_name END AS displayName,
    CASE WHEN f.sender_id = ? THEN u2.avatar_url ELSE u1.avatar_url END AS avatarUrl,
    CASE WHEN f.sender_id = ? THEN u2.is_developer ELSE u1.is_developer END AS isDeveloper
  FROM friendships f
  JOIN users u1 ON f.sender_id = u1.id
  JOIN users u2 ON f.receiver_id = u2.id
  WHERE (f.sender_id = ? OR f.receiver_id = ?) AND f.status = 'accepted'
  ORDER BY displayName COLLATE NOCASE ASC
`);

const getPendingIncomingStmt = db.prepare(`
  SELECT 
    f.id AS friendshipId,
    f.created_at AS createdAt,
    u.id AS fromId,
    u.username,
    u.display_name AS displayName,
    u.avatar_url AS avatarUrl,
    u.is_developer AS isDeveloper
  FROM friendships f
  JOIN users u ON f.sender_id = u.id
  WHERE f.receiver_id = ? AND f.status = 'pending'
  ORDER BY f.id DESC
`);

const getPendingOutgoingStmt = db.prepare(`
  SELECT 
    f.id AS friendshipId,
    f.created_at AS createdAt,
    u.id AS toId,
    u.username,
    u.display_name AS displayName,
    u.avatar_url AS avatarUrl,
    u.is_developer AS isDeveloper
  FROM friendships f
  JOIN users u ON f.receiver_id = u.id
  WHERE f.sender_id = ? AND f.status = 'pending'
  ORDER BY f.id DESC
`);

function getFriendships(userId) {
  const uId = Number(userId);
  const friends = getAcceptedFriendsStmt.all(uId, uId, uId, uId, uId, uId, uId).map(f => ({
    ...f,
    avatarUrl: f.avatarUrl || null,
    isDeveloper: Boolean(f.isDeveloper)
  }));
  const pendingIncoming = getPendingIncomingStmt.all(uId).map(f => ({
    ...f,
    avatarUrl: f.avatarUrl || null,
    isDeveloper: Boolean(f.isDeveloper)
  }));
  const pendingOutgoing = getPendingOutgoingStmt.all(uId).map(f => ({
    ...f,
    avatarUrl: f.avatarUrl || null,
    isDeveloper: Boolean(f.isDeveloper)
  }));

  return {
    friends,
    pendingIncoming,
    pendingOutgoing
  };
}

const getFriendshipByIdStmt = db.prepare(`
  SELECT id, sender_id, receiver_id, status FROM friendships WHERE id = ?
`);

const deleteFriendshipByIdStmt = db.prepare(`DELETE FROM friendships WHERE id = ?`);

function respondToFriendRequest(userId, friendshipId, action) {
  const uId = Number(userId);
  const fId = Number(friendshipId);

  const row = getFriendshipByIdStmt.get(fId);
  if (!row || row.receiver_id !== uId || row.status !== 'pending') {
    throw new Error('Friend request not found or already handled.');
  }

  const now = new Date().toISOString();
  if (action === 'accept') {
    updateFriendshipStatusStmt.run('accepted', now, fId);
    return { success: true, action: 'accepted', senderId: row.sender_id };
  } else if (action === 'decline') {
    deleteFriendshipByIdStmt.run(fId);
    return { success: true, action: 'declined', senderId: row.sender_id };
  } else {
    throw new Error('Invalid response action.');
  }
}

const deleteFriendPairStmt = db.prepare(`
  DELETE FROM friendships 
  WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
`);

function removeFriend(userId, friendUserId) {
  const uId = Number(userId);
  const fId = Number(friendUserId);
  deleteFriendPairStmt.run(uId, fId, fId, uId);
  return { success: true };
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
  const sender = authorId ? getUserById(authorId) : null;
  return {
    id: Number(result.lastInsertRowid),
    serverId: sId,
    channelId: cId,
    authorId,
    authorName: sender ? sender.displayName : cleanName,
    authorUsername: sender ? sender.username : cleanUsername,
    authorAvatarUrl: sender ? sender.avatarUrl : null,
    isDeveloper: sender ? Boolean(sender.isDeveloper) : Boolean(devFlag),
    content: cleanContent,
    timestamp
  };
}

const getHistoryByChannelStmt = db.prepare(`
  SELECT m.id, m.server_id AS serverId, m.channel_id AS channelId, m.author_id AS authorId, 
         COALESCE(u.display_name, m.author_name, m.author) AS authorName, 
         COALESCE(u.username, m.author_username, 'anon') AS authorUsername, 
         u.avatar_url AS authorAvatarUrl,
         COALESCE(u.is_developer, m.is_developer, 0) AS isDeveloper, 
         m.content, m.timestamp
  FROM messages m
  LEFT JOIN users u ON m.author_id = u.id
  WHERE m.channel_id = ?
  ORDER BY m.id DESC
  LIMIT ?
`);

function getRecentMessages(channelId = 1, limit = 50) {
  const rows = getHistoryByChannelStmt.all(Number(channelId) || 1, limit);
  return rows.reverse().map(r => ({
    ...r,
    authorAvatarUrl: r.authorAvatarUrl || null,
    isDeveloper: Boolean(r.isDeveloper)
  }));
}

// Direct Messages Operations
const insertDirectMessageStmt = db.prepare(`
  INSERT INTO direct_messages (sender_id, receiver_id, content, timestamp)
  VALUES (?, ?, ?, ?)
`);

function saveDirectMessage({ senderId, receiverId, content }) {
  const sId = Number(senderId);
  const rId = Number(receiverId);
  const cleanContent = (content || '').trim().slice(0, 2000);
  const timestamp = new Date().toISOString();

  const sender = getUserById(sId);
  const result = insertDirectMessageStmt.run(sId, rId, cleanContent, timestamp);

  return {
    id: Number(result.lastInsertRowid),
    senderId: sId,
    receiverId: rId,
    authorName: sender ? sender.displayName : 'Unknown',
    authorUsername: sender ? sender.username : 'user',
    authorAvatarUrl: sender ? sender.avatarUrl : null,
    isDeveloper: sender ? Boolean(sender.isDeveloper) : false,
    content: cleanContent,
    timestamp
  };
}

const getDirectMessagesStmt = db.prepare(`
  SELECT 
    dm.id,
    dm.sender_id AS senderId,
    dm.receiver_id AS receiverId,
    u.display_name AS authorName,
    u.username AS authorUsername,
    u.avatar_url AS authorAvatarUrl,
    u.is_developer AS isDeveloper,
    dm.content,
    dm.timestamp
  FROM direct_messages dm
  JOIN users u ON dm.sender_id = u.id
  WHERE (dm.sender_id = ? AND dm.receiver_id = ?) OR (dm.sender_id = ? AND dm.receiver_id = ?)
  ORDER BY dm.id DESC
  LIMIT ?
`);

function getDirectMessagesHistory(userId, friendId, limit = 50) {
  const uId = Number(userId);
  const fId = Number(friendId);
  const rows = getDirectMessagesStmt.all(uId, fId, fId, uId, limit);
  return rows.reverse().map(r => ({
    ...r,
    authorAvatarUrl: r.authorAvatarUrl || null,
    isDeveloper: Boolean(r.isDeveloper)
  }));
}

module.exports = {
  createUser,
  authenticateUser,
  getUserByUsername,
  getUserById,
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
  sendFriendRequest,
  getFriendships,
  respondToFriendRequest,
  removeFriend,
  updateUserProfile,
  saveDirectMessage,
  getDirectMessagesHistory,
  saveMessage,
  getRecentMessages
};
