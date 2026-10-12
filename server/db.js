const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.VOICELINE_DB_PATH || path.join(__dirname, '..', 'voiceline.db');
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

  CREATE TABLE IF NOT EXISTS server_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_server_members_pair ON server_members(server_id, user_id);
`);

// Migrations
try { db.exec(`ALTER TABLE messages ADD COLUMN server_id INTEGER DEFAULT 1;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN channel_id INTEGER DEFAULT 1;`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_id INTEGER;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_name TEXT;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN author_username TEXT;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_developer INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`UPDATE messages SET author_name = author WHERE author_name IS NULL AND author IS NOT NULL;`); } catch {}
try { db.exec(`UPDATE messages SET author_username = 'anon' WHERE author_username IS NULL;`); } catch {}
try { db.exec(`UPDATE messages SET server_id = 1 WHERE server_id IS NULL;`); } catch {}
try { db.exec(`UPDATE messages SET channel_id = 1 WHERE channel_id IS NULL;`); } catch {}
try { db.exec(`ALTER TABLE servers ADD COLUMN join_code TEXT;`); } catch {}
try { db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_servers_join_code ON servers(join_code);`); } catch {}
try { db.exec(`ALTER TABLE channels ADD COLUMN type TEXT DEFAULT 'text';`); } catch {}

// Stage 3a-1: File attachments
try { db.exec(`ALTER TABLE messages ADD COLUMN file_url TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN file_name TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN file_size INTEGER DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN file_type TEXT DEFAULT NULL;`); } catch {}

try { db.exec(`ALTER TABLE direct_messages ADD COLUMN file_url TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN file_name TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN file_size INTEGER DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN file_type TEXT DEFAULT NULL;`); } catch {}

// Stage 3b-1: Account removal & soft-delete
try { db.exec(`ALTER TABLE users ADD COLUMN is_deleted INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN deleted_at TEXT DEFAULT NULL;`); } catch {}

// Version 5e-server settings: Tables & Migrations
try { db.exec(`ALTER TABLE servers ADD COLUMN description TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE servers ADD COLUMN icon_url TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE servers ADD COLUMN default_channel_id INTEGER DEFAULT NULL;`); } catch {}

try { db.exec(`ALTER TABLE channels ADD COLUMN topic TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE channels ADD COLUMN position INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE channels ADD COLUMN is_private INTEGER DEFAULT 0;`); } catch {}

// Version 5f: Stickers & Custom Emojis column migrations
try { db.exec(`ALTER TABLE stickers ADD COLUMN description TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE stickers ADD COLUMN tags TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE stickers ADD COLUMN file_format TEXT DEFAULT 'png';`); } catch {}
try { db.exec(`ALTER TABLE stickers ADD COLUMN status TEXT DEFAULT 'approved';`); } catch {}

// Message Upgrades: Reply, Forward, Pin, Edit, Soft-delete
try { db.exec(`ALTER TABLE messages ADD COLUMN reply_to_id INTEGER DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN reply_to_data TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_pinned INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN pinned_at TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN pinned_by INTEGER DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_forwarded INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_edited INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN edited_at TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN is_deleted INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE messages ADD COLUMN deleted_at TEXT DEFAULT NULL;`); } catch {}

try { db.exec(`ALTER TABLE direct_messages ADD COLUMN reply_to_id INTEGER DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN reply_to_data TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN is_pinned INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN pinned_at TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN pinned_by INTEGER DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN is_forwarded INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN is_edited INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN edited_at TEXT DEFAULT NULL;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN is_deleted INTEGER DEFAULT 0;`); } catch {}
try { db.exec(`ALTER TABLE direct_messages ADD COLUMN deleted_at TEXT DEFAULT NULL;`); } catch {}

// Message Reports System (for Developer Review)
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter_id INTEGER NOT NULL,
      reported_user_id INTEGER,
      message_id INTEGER NOT NULL,
      message_type TEXT NOT NULL DEFAULT 'channel',
      server_id INTEGER DEFAULT NULL,
      channel_id INTEGER DEFAULT NULL,
      channel_name TEXT DEFAULT NULL,
      reason TEXT NOT NULL,
      message_content TEXT NOT NULL,
      message_author_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      action_taken TEXT DEFAULT NULL,
      reviewed_by INTEGER DEFAULT NULL,
      reviewed_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(reporter_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_reports_status ON message_reports(status, created_at DESC);
  `);
} catch {}


db.exec(`
  CREATE TABLE IF NOT EXISTS server_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#99aab5',
    position INTEGER DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    is_default INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_server_roles_server ON server_roles(server_id, position);

  CREATE TABLE IF NOT EXISTS server_member_roles (
    server_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    assigned_at TEXT NOT NULL,
    PRIMARY KEY (server_id, user_id, role_id),
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES server_roles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS server_bans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    banned_by INTEGER NOT NULL,
    reason TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    UNIQUE(server_id, user_id),
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(banned_by) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS server_timeouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    timed_out_by INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    reason TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    UNIQUE(server_id, user_id),
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(timed_out_by) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS server_warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    warned_by INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(warned_by) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS server_audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    target_id INTEGER DEFAULT NULL,
    target_type TEXT DEFAULT NULL,
    reason TEXT DEFAULT '',
    changes_json TEXT DEFAULT '{}',
    created_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(actor_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_server_audit_logs_server ON server_audit_logs(server_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS stickers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER DEFAULT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    file_url TEXT NOT NULL,
    file_format TEXT NOT NULL DEFAULT 'png',
    created_by INTEGER DEFAULT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS idx_stickers_server ON stickers(server_id);

  CREATE TABLE IF NOT EXISTS custom_emojis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER DEFAULT NULL,
    code TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_by INTEGER DEFAULT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(server_id) REFERENCES servers(id) ON DELETE CASCADE,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS idx_custom_emojis_server ON custom_emojis(server_id);
`);


// Join Code Helpers
const JOIN_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateJoinCode() {
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += JOIN_CODE_CHARS[bytes[i] % JOIN_CODE_CHARS.length];
  }
  return code;
}

function getUniqueJoinCode() {
  let code;
  let attempts = 0;
  while (attempts < 100) {
    code = generateJoinCode();
    const existing = db.prepare(`SELECT id FROM servers WHERE join_code = ?`).get(code);
    if (!existing) return code;
    attempts++;
  }
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// Ensure default "General" server exists
const getDefaultServerStmt = db.prepare(`SELECT id, name, join_code FROM servers WHERE id = 1`);
const defaultServer = getDefaultServerStmt.get();
if (!defaultServer) {
  const insertDefaultServerStmt = db.prepare(`
    INSERT INTO servers (id, name, created_by, created_at, join_code)
    VALUES (1, 'General', NULL, ?, ?)
  `);
  insertDefaultServerStmt.run(new Date().toISOString(), getUniqueJoinCode());
}

// Backfill join codes for existing servers that do not have one
const serversNeedingCode = db.prepare(`SELECT id FROM servers WHERE join_code IS NULL`).all();
const updateServerCodeMigrationStmt = db.prepare(`UPDATE servers SET join_code = ? WHERE id = ?`);
for (const s of serversNeedingCode) {
  updateServerCodeMigrationStmt.run(getUniqueJoinCode(), s.id);
}

// One-time migration (schema version 1): accounts are no longer auto-added to
// Server 1 (General). Remove memberships that were created automatically.
// Auto-added rows were stamped with joined_at = the user's created_at, whereas
// real joins via join code are stamped with the actual join time.
const schemaVersion = Number(db.prepare(`PRAGMA user_version`).get().user_version) || 0;
if (schemaVersion < 1) {
  try {
    const removed = db.prepare(`
      DELETE FROM server_members
      WHERE server_id = 1
        AND joined_at = (SELECT u.created_at FROM users u WHERE u.id = server_members.user_id)
    `).run();
    console.log(`[Voiceline] Migration: removed ${removed.changes} automatic General memberships.`);
  } catch (err) {
    console.error('[Voiceline] Migration (auto General membership cleanup) failed:', err);
  }
  db.exec(`PRAGMA user_version = 1`);
}

// Backfill server creators to their own servers
try {
  db.prepare(`
    INSERT OR IGNORE INTO server_members (server_id, user_id, joined_at)
    SELECT id, created_by, created_at FROM servers WHERE created_by IS NOT NULL
  `).run();
} catch {}

// Ensure every server has default text ('general') and voice ('lounge') channels
const allServers = db.prepare(`SELECT id FROM servers`).all();
const checkTextChannelStmt = db.prepare(`SELECT id FROM channels WHERE server_id = ? AND (type IS NULL OR type = 'text') LIMIT 1`);
const checkVoiceChannelStmt = db.prepare(`SELECT id FROM channels WHERE server_id = ? AND type = 'voice' LIMIT 1`);
const insertChannelStmt = db.prepare(`
  INSERT INTO channels (server_id, name, type, created_at)
  VALUES (?, ?, ?, ?)
`);

for (const s of allServers) {
  if (!checkTextChannelStmt.get(s.id)) {
    insertChannelStmt.run(s.id, 'general', 'text', new Date().toISOString());
  }
  if (!checkVoiceChannelStmt.get(s.id)) {
    insertChannelStmt.run(s.id, 'lounge', 'voice', new Date().toISOString());
  }
}

// Backfill default @everyone role for all servers if missing
const checkEveryoneRoleStmt = db.prepare(`SELECT id FROM server_roles WHERE server_id = ? AND is_default = 1`);
const insertEveryoneRoleStmt = db.prepare(`
  INSERT INTO server_roles (server_id, name, color, position, permissions, is_default, created_at)
  VALUES (?, '@everyone', '#99aab5', 0, ?, 1, ?)
`);
// Default @everyone permissions: VIEW_CHANNELS | SEND_MESSAGES | ATTACH_FILES | ADD_REACTIONS | CONNECT_VOICE | SPEAK_VOICE
const INITIAL_EVERYONE_PERMS = (1 << 10) | (1 << 11) | (1 << 12) | (1 << 13) | (1 << 14) | (1 << 15);
for (const s of allServers) {
  if (!checkEveryoneRoleStmt.get(s.id)) {
    try {
      insertEveryoneRoleStmt.run(s.id, INITIAL_EVERYONE_PERMS, new Date().toISOString());
    } catch {}
  }
}


// Feedback & Community Forum System
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      author_username TEXT NOT NULL,
      author_avatar_url TEXT DEFAULT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      dev_response TEXT DEFAULT NULL,
      dev_response_by INTEGER DEFAULT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id, is_deleted);
  `);
} catch {}

// Stage 3d.6: User Status & Custom Status
try { db.exec(`ALTER TABLE feedback ADD COLUMN category TEXT DEFAULT 'qol';`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'online';`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN custom_status_text TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN custom_status_emoji TEXT DEFAULT '';`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN custom_status_expires_at TEXT DEFAULT NULL;`); } catch {}

// Stage 3d.5: Notifications Center System
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      priority TEXT DEFAULT 'yellow',
      data TEXT DEFAULT '{}',
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
  `);
} catch {}

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
  SELECT id, username, display_name, avatar_url, bio, password_hash, password_salt, is_developer, created_at,
         COALESCE(is_deleted, 0) AS is_deleted, deleted_at
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
    bio: row.bio || '',
    isDeveloper: Boolean(row.is_developer),
    isDeleted: Boolean(row.is_deleted),
    deletedAt: row.deleted_at || null
  };
}

const getUserByIdStmt = db.prepare(`
  SELECT id, username, display_name, avatar_url, bio, is_developer, created_at,
         COALESCE(is_deleted, 0) AS is_deleted, deleted_at,
         COALESCE(status, 'online') AS status,
         COALESCE(custom_status_text, '') AS custom_status_text,
         COALESCE(custom_status_emoji, '') AS custom_status_emoji,
         custom_status_expires_at
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
    bio: row.bio || '',
    isDeveloper: Boolean(row.is_developer),
    createdAt: row.created_at,
    isDeleted: Boolean(row.is_deleted),
    deletedAt: row.deleted_at || null,
    status: row.status || 'online',
    customStatusText: row.custom_status_text || '',
    customStatusEmoji: row.custom_status_emoji || '',
    customStatusExpiresAt: row.custom_status_expires_at || null,
    customStatus: row.custom_status_text ? {
      text: row.custom_status_text,
      emoji: row.custom_status_emoji || '',
      expiresAt: row.custom_status_expires_at || null
    } : null
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

  const existing = getUserByUsername(cleanUsername);
  if (existing) {
    if (existing.isDeleted) {
      throw new Error(`Username "${cleanUsername}" is no longer available.`);
    }
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
  const userId = Number(result.lastInsertRowid);
  return {
    id: userId,
    username: cleanUsername,
    displayName: cleanDisplay,
    isDeveloper: Boolean(devFlag)
  };
}

function authenticateUser(username, password) {
  const user = getUserByUsername(username);
  if (!user) return null;

  if (user.isDeleted) {
    const err = new Error('This account has been removed.');
    err.code = 'ACCOUNT_DELETED';
    throw err;
  }

  if (!verifyPassword(password, user.password_salt, user.password_hash)) {
    return null;
  }

  return getUserById(user.id);
}

// Admin User Operations
const getAllUsersForAdminStmt = db.prepare(`
  SELECT id, username, display_name AS displayName, avatar_url AS avatarUrl,
         is_developer AS isDeveloper, created_at AS createdAt,
         COALESCE(is_deleted, 0) AS isDeleted, deleted_at AS deletedAt
  FROM users
  ORDER BY id ASC
`);

function getAllUsersForAdmin() {
  const rows = getAllUsersForAdminStmt.all();
  return rows.map(r => ({
    id: r.id,
    username: r.username,
    displayName: r.displayName,
    avatarUrl: r.avatarUrl || null,
    isDeveloper: Boolean(r.isDeveloper),
    createdAt: r.createdAt,
    isDeleted: Boolean(r.isDeleted),
    deletedAt: r.deletedAt || null
  }));
}

const softDeleteUserStmt = db.prepare(`
  UPDATE users
  SET display_name = 'Deleted User',
      avatar_url = NULL,
      bio = '',
      password_hash = '',
      password_salt = '',
      is_deleted = 1,
      deleted_at = ?
  WHERE id = ?
`);

const deleteUserSessionsStmt = db.prepare(`DELETE FROM sessions WHERE user_id = ?`);
const deleteUserFriendshipsStmt = db.prepare(`DELETE FROM friendships WHERE sender_id = ? OR receiver_id = ?`);
const deleteUserServerMembershipsStmt = db.prepare(`DELETE FROM server_members WHERE user_id = ?`);

function deleteUserAccount({ userId, adminUserId }) {
  const targetId = Number(userId);
  const adminId = Number(adminUserId);

  if (!targetId) {
    throw new Error('Invalid user ID.');
  }

  if (targetId === adminId) {
    throw new Error('You cannot remove your own account.');
  }

  const target = getUserById(targetId);
  if (!target) {
    throw new Error('User not found.');
  }

  if (target.isDeleted) {
    throw new Error('Account is already removed.');
  }

  const now = new Date().toISOString();

  // If user had an avatar file on disk, remove it
  if (target.avatarUrl && target.avatarUrl.startsWith('/uploads/avatars/')) {
    const avatarPath = path.join(__dirname, '..', target.avatarUrl.replace(/^\//, ''));
    try {
      if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    } catch {}
  }

  softDeleteUserStmt.run(now, targetId);
  deleteUserSessionsStmt.run(targetId);
  deleteUserFriendshipsStmt.run(targetId, targetId);
  deleteUserServerMembershipsStmt.run(targetId);

  return {
    success: true,
    removedUser: {
      id: target.id,
      username: target.username,
      displayName: target.displayName
    }
  };
}

// Session Operations
const insertSessionStmt = db.prepare(`
  INSERT INTO sessions (token, user_id, created_at)
  VALUES (?, ?, ?)
`);

const getUserByTokenStmt = db.prepare(`
  SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, u.is_developer,
         COALESCE(u.is_deleted, 0) AS is_deleted,
         COALESCE(u.status, 'online') AS status,
         COALESCE(u.custom_status_text, '') AS custom_status_text,
         COALESCE(u.custom_status_emoji, '') AS custom_status_emoji,
         u.custom_status_expires_at
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
  if (!row || row.is_deleted) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url || null,
    bio: row.bio || '',
    isDeveloper: Boolean(row.is_developer),
    status: row.status || 'online',
    customStatusText: row.custom_status_text || '',
    customStatusEmoji: row.custom_status_emoji || '',
    customStatusExpiresAt: row.custom_status_expires_at || null,
    customStatus: row.custom_status_text ? {
      text: row.custom_status_text,
      emoji: row.custom_status_emoji || '',
      expiresAt: row.custom_status_expires_at || null
    } : null
  };
}

const updateUserProfileStmt = db.prepare(`
  UPDATE users SET display_name = ?, avatar_url = ?, bio = ? WHERE id = ?
`);

function updateUserProfile({ userId, displayName, avatarUrl, bio }) {
  const cleanDisplay = (displayName || '').trim().slice(0, 32);
  if (!cleanDisplay) {
    throw new Error('Display name cannot be empty.');
  }
  const cleanBio = (bio !== undefined && bio !== null) ? String(bio).trim().slice(0, 300) : '';
  updateUserProfileStmt.run(cleanDisplay, avatarUrl !== undefined ? avatarUrl : null, cleanBio, Number(userId));
  return getUserById(userId);
}

function deleteSession(token) {
  if (token) {
    deleteSessionStmt.run(token);
  }
}

// Server (Chat Room) Operations
const addServerMemberStmt = db.prepare(`
  INSERT OR IGNORE INTO server_members (server_id, user_id, joined_at)
  VALUES (?, ?, ?)
`);

const isServerMemberStmt = db.prepare(`
  SELECT id FROM server_members
  WHERE server_id = ? AND user_id = ?
`);

function isServerMember(serverId, userId) {
  if (!serverId || !userId) return false;
  return Boolean(isServerMemberStmt.get(Number(serverId), Number(userId)));
}

// Single source of truth for "may this account see this server's channels and messages?"
// Members only; developer accounts keep their admin view of every server.
function canAccessServer(user, serverId) {
  if (!user || !serverId) return false;
  if (!getServerByIdStmt.get(Number(serverId))) return false;
  if (user.isDeveloper) return true;
  return isServerMember(serverId, user.id);
}

const getAllServersStmt = db.prepare(`
  SELECT id, name, description, icon_url AS iconUrl, default_channel_id AS defaultChannelId,
         created_by AS createdBy, created_at AS createdAt, join_code AS joinCode
  FROM servers
  ORDER BY id ASC
`);

function getAllServers() {
  return getAllServersStmt.all();
}

const getUserServersStmt = db.prepare(`
  SELECT s.id, s.name, s.description, s.icon_url AS iconUrl, s.default_channel_id AS defaultChannelId,
         s.created_by AS createdBy, s.created_at AS createdAt
  FROM servers s
  JOIN server_members sm ON s.id = sm.server_id
  WHERE sm.user_id = ?
  ORDER BY s.id ASC
`);

function getUserServers(userId, isDeveloper = false) {
  if (isDeveloper) {
    return getAllServersStmt.all();
  }
  return getUserServersStmt.all(Number(userId));
}

const getServerByIdStmt = db.prepare(`
  SELECT id, name, description, icon_url AS iconUrl, default_channel_id AS defaultChannelId,
         created_by AS createdBy, created_at AS createdAt, join_code AS joinCode
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

const getServerByJoinCodeStmt = db.prepare(`
  SELECT id, name, created_by AS createdBy, created_at AS createdAt, join_code AS joinCode
  FROM servers
  WHERE UPPER(join_code) = ?
`);

function getServerByJoinCode(code) {
  if (!code) return null;
  return getServerByJoinCodeStmt.get(code.trim().toUpperCase()) || null;
}

const insertServerStmt = db.prepare(`
  INSERT INTO servers (name, created_by, created_at, join_code)
  VALUES (?, ?, ?, ?)
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
  const joinCode = getUniqueJoinCode();
  const result = insertServerStmt.run(cleanName, createdBy || null, createdAt, joinCode);
  const serverId = Number(result.lastInsertRowid);

  insertChannelStmt.run(serverId, 'general', 'text', createdAt);
  insertChannelStmt.run(serverId, 'lounge', 'voice', createdAt);

  if (createdBy) {
    addServerMemberStmt.run(serverId, Number(createdBy), createdAt);
  }

  return {
    id: serverId,
    name: cleanName,
    createdBy,
    createdAt,
    joinCode
  };
}

function joinServerByCode({ userId, code }) {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) {
    throw new Error('Please enter a server join code.');
  }

  const server = getServerByJoinCode(cleanCode);
  if (!server) {
    throw new Error('No server found with that join code. Please check the code and try again.');
  }

  const existing = isServerMemberStmt.get(server.id, Number(userId));
  if (existing) {
    return {
      server: {
        id: server.id,
        name: server.name,
        createdBy: server.createdBy,
        createdAt: server.createdAt
      },
      alreadyMember: true
    };
  }

  addServerMemberStmt.run(server.id, Number(userId), new Date().toISOString());
  return {
    server: {
      id: server.id,
      name: server.name,
      createdBy: server.createdBy,
      createdAt: server.createdAt
    },
    alreadyMember: false
  };
}

const updateServerJoinCodeStmt = db.prepare(`
  UPDATE servers SET join_code = ? WHERE id = ?
`);

function regenerateServerJoinCode(serverId) {
  const server = getServerById(serverId);
  if (!server) {
    throw new Error('Server not found.');
  }

  const newCode = getUniqueJoinCode();
  updateServerJoinCodeStmt.run(newCode, Number(serverId));
  return {
    serverId: Number(serverId),
    joinCode: newCode
  };
}

// Channel Operations
const getChannelsByServerStmt = db.prepare(`
  SELECT id, server_id AS serverId, name, COALESCE(type, 'text') AS type,
         COALESCE(topic, '') AS topic, COALESCE(position, 0) AS position,
         COALESCE(is_private, 0) AS isPrivate, created_at AS createdAt
  FROM channels
  WHERE server_id = ?
  ORDER BY position ASC, CASE WHEN type = 'voice' THEN 1 ELSE 0 END ASC, id ASC
`);

function getChannelsByServerId(serverId) {
  return getChannelsByServerStmt.all(Number(serverId));
}

const getChannelByIdStmt = db.prepare(`
  SELECT id, server_id AS serverId, name, COALESCE(type, 'text') AS type,
         COALESCE(topic, '') AS topic, COALESCE(position, 0) AS position,
         COALESCE(is_private, 0) AS isPrivate, created_at AS createdAt
  FROM channels
  WHERE id = ?
`);

function getChannelById(id) {
  if (!id) return null;
  return getChannelByIdStmt.get(Number(id)) || null;
}

const getChannelByNameStmt = db.prepare(`
  SELECT id, server_id AS serverId, name, COALESCE(type, 'text') AS type,
         COALESCE(topic, '') AS topic, COALESCE(position, 0) AS position,
         COALESCE(is_private, 0) AS isPrivate
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

function createChannel({ serverId, name, type = 'text' }) {
  const cleanType = (type === 'voice') ? 'voice' : 'text';
  const clean = cleanChannelName(name);
  if (!clean || clean.length < 2) {
    throw new Error('Channel name must be at least 2 characters long.');
  }

  const sId = Number(serverId);
  if (!getServerById(sId)) {
    throw new Error('Server not found.');
  }

  if (getChannelByName(sId, clean)) {
    throw new Error(`Channel ${cleanType === 'voice' ? '🔊' : '#'}${clean} already exists in this server.`);
  }

  const createdAt = new Date().toISOString();
  const res = insertChannelStmt.run(sId, clean, cleanType, createdAt);
  return {
    id: Number(res.lastInsertRowid),
    serverId: sId,
    name: clean,
    type: cleanType,
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

// ----------------------------------------------------
// Version 5e-server settings: Server Management
// ----------------------------------------------------
const updateServerStmt = db.prepare(`
  UPDATE servers
  SET name = COALESCE(?, name),
      description = COALESCE(?, description),
      icon_url = COALESCE(?, icon_url),
      default_channel_id = COALESCE(?, default_channel_id)
  WHERE id = ?
`);

function updateServer(serverId, { name, description, iconUrl, defaultChannelId }) {
  const sId = Number(serverId);
  const server = getServerById(sId);
  if (!server) throw new Error('Server not found.');

  const cleanName = name !== undefined ? String(name).trim() : null;
  if (cleanName !== null && (cleanName.length < 2 || cleanName.length > 32)) {
    throw new Error('Server name must be between 2 and 32 characters long.');
  }

  const cleanDesc = description !== undefined ? String(description).trim().slice(0, 500) : null;
  const cleanIcon = iconUrl !== undefined ? (iconUrl ? String(iconUrl).trim() : '') : null;
  const defChan = defaultChannelId !== undefined ? (defaultChannelId ? Number(defaultChannelId) : null) : null;

  updateServerStmt.run(cleanName, cleanDesc, cleanIcon, defChan, sId);
  return getServerById(sId);
}

const deleteServerStmt = db.prepare(`DELETE FROM servers WHERE id = ?`);
const deleteServerChannelsStmt = db.prepare(`DELETE FROM channels WHERE server_id = ?`);
const deleteServerMessagesStmt = db.prepare(`DELETE FROM messages WHERE server_id = ?`);
const deleteServerMembersStmt = db.prepare(`DELETE FROM server_members WHERE server_id = ?`);
const deleteServerRolesStmt = db.prepare(`DELETE FROM server_roles WHERE server_id = ?`);
const deleteServerMemberRolesStmt = db.prepare(`DELETE FROM server_member_roles WHERE server_id = ?`);
const deleteServerBansStmt = db.prepare(`DELETE FROM server_bans WHERE server_id = ?`);
const deleteServerTimeoutsStmt = db.prepare(`DELETE FROM server_timeouts WHERE server_id = ?`);
const deleteServerWarningsStmt = db.prepare(`DELETE FROM server_warnings WHERE server_id = ?`);
const deleteServerAuditLogsStmt = db.prepare(`DELETE FROM server_audit_logs WHERE server_id = ?`);

function deleteServer(serverId) {
  const sId = Number(serverId);
  if (sId === 1) {
    throw new Error('Cannot delete the default General server.');
  }
  const server = getServerById(sId);
  if (!server) throw new Error('Server not found.');

  deleteServerMessagesStmt.run(sId);
  deleteServerChannelsStmt.run(sId);
  deleteServerMemberRolesStmt.run(sId);
  deleteServerRolesStmt.run(sId);
  deleteServerBansStmt.run(sId);
  deleteServerTimeoutsStmt.run(sId);
  deleteServerWarningsStmt.run(sId);
  deleteServerAuditLogsStmt.run(sId);
  deleteServerMembersStmt.run(sId);
  deleteServerStmt.run(sId);
  return true;
}

const removeServerMemberStmt = db.prepare(`DELETE FROM server_members WHERE server_id = ? AND user_id = ?`);

function leaveServer(serverId, userId) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const server = getServerById(sId);
  if (!server) throw new Error('Server not found.');
  if (server.createdBy && Number(server.createdBy) === uId) {
    throw new Error('Server owners cannot leave their own server. You must transfer ownership or delete the server.');
  }
  removeMemberAllRolesStmt.run(sId, uId);
  removeServerMemberStmt.run(sId, uId);
  return true;
}

const updateChannelStmt = db.prepare(`
  UPDATE channels
  SET name = COALESCE(?, name),
      topic = COALESCE(?, topic),
      position = COALESCE(?, position),
      is_private = COALESCE(?, is_private)
  WHERE id = ? AND server_id = ?
`);

function updateChannel(serverId, channelId, { name, topic, position, isPrivate }) {
  const sId = Number(serverId);
  const cId = Number(channelId);
  const channel = getChannelById(cId);
  if (!channel || channel.serverId !== sId) {
    throw new Error('Channel not found in this server.');
  }

  let cleanName = null;
  if (name !== undefined) {
    cleanName = cleanChannelName(name);
    if (!cleanName || cleanName.length < 2) {
      throw new Error('Channel name must be at least 2 characters long.');
    }
    const existing = getChannelByName(sId, cleanName);
    if (existing && existing.id !== cId) {
      throw new Error(`Channel #${cleanName} already exists in this server.`);
    }
  }

  const cleanTopic = topic !== undefined ? String(topic).trim().slice(0, 1024) : null;
  const cleanPos = position !== undefined ? Number(position) : null;
  const cleanPriv = isPrivate !== undefined ? (isPrivate ? 1 : 0) : null;

  updateChannelStmt.run(cleanName, cleanTopic, cleanPos, cleanPriv, cId, sId);
  return getChannelById(cId);
}

// ----------------------------------------------------
// Version 5e-server settings: Roles & Permissions
// ----------------------------------------------------
const PERMISSION_FLAGS = {
  ADMINISTRATOR:   1 << 0,
  MANAGE_SERVER:   1 << 1,
  MANAGE_CHANNELS: 1 << 2,
  MANAGE_ROLES:    1 << 3,
  MANAGE_MEMBERS:  1 << 4,
  VIEW_AUDIT_LOG:  1 << 5,
  KICK_MEMBERS:    1 << 6,
  BAN_MEMBERS:     1 << 7,
  TIMEOUT_MEMBERS: 1 << 8,
  MANAGE_MESSAGES: 1 << 9,
  VIEW_CHANNELS:   1 << 10,
  SEND_MESSAGES:   1 << 11,
  ATTACH_FILES:    1 << 12,
  ADD_REACTIONS:   1 << 13,
  CONNECT_VOICE:   1 << 14,
  SPEAK_VOICE:     1 << 15
};

const ALL_PERMISSIONS = Object.values(PERMISSION_FLAGS).reduce((acc, flag) => acc | flag, 0);

const getServerRolesStmt = db.prepare(`
  SELECT id, server_id AS serverId, name, color, position, permissions,
         COALESCE(is_default, 0) AS isDefault, created_at AS createdAt
  FROM server_roles
  WHERE server_id = ?
  ORDER BY position DESC, id ASC
`);

function getServerRoles(serverId) {
  const sId = Number(serverId);
  ensureDefaultServerRoles(sId);
  return getServerRolesStmt.all(sId);
}

function getRoleById(roleId) {
  return db.prepare(`
    SELECT id, server_id AS serverId, name, color, position, permissions,
           COALESCE(is_default, 0) AS isDefault, created_at AS createdAt
    FROM server_roles WHERE id = ?
  `).get(Number(roleId)) || null;
}

function ensureDefaultServerRoles(serverId) {
  const sId = Number(serverId);
  const existing = db.prepare(`SELECT id FROM server_roles WHERE server_id = ? AND is_default = 1`).get(sId);
  if (!existing) {
    const defaultPerms = PERMISSION_FLAGS.VIEW_CHANNELS | PERMISSION_FLAGS.SEND_MESSAGES |
                         PERMISSION_FLAGS.ATTACH_FILES | PERMISSION_FLAGS.ADD_REACTIONS |
                         PERMISSION_FLAGS.CONNECT_VOICE | PERMISSION_FLAGS.SPEAK_VOICE;
    db.prepare(`
      INSERT INTO server_roles (server_id, name, color, position, permissions, is_default, created_at)
      VALUES (?, '@everyone', '#99aab5', 0, ?, 1, ?)
    `).run(sId, defaultPerms, new Date().toISOString());
  }
}

function createRole({ serverId, name, color = '#99aab5', permissions = 0 }) {
  const sId = Number(serverId);
  const cleanName = String(name || 'New Role').trim().slice(0, 32);
  if (!cleanName) throw new Error('Role name cannot be empty.');

  // Find max position
  const maxPosRow = db.prepare(`SELECT MAX(position) AS maxPos FROM server_roles WHERE server_id = ?`).get(sId);
  const nextPos = (maxPosRow && maxPosRow.maxPos !== null) ? Number(maxPosRow.maxPos) + 1 : 1;

  const now = new Date().toISOString();
  const res = db.prepare(`
    INSERT INTO server_roles (server_id, name, color, position, permissions, is_default, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(sId, cleanName, color || '#99aab5', nextPos, Number(permissions) || 0, now);

  return getRoleById(Number(res.lastInsertRowid));
}

function updateRole(serverId, roleId, { name, color, position, permissions }) {
  const sId = Number(serverId);
  const rId = Number(roleId);
  const role = getRoleById(rId);
  if (!role || role.serverId !== sId) throw new Error('Role not found.');

  let cleanName = role.name;
  if (name !== undefined) {
    if (role.isDefault) {
      cleanName = '@everyone'; // protect default role name
    } else {
      cleanName = String(name).trim().slice(0, 32);
      if (!cleanName) throw new Error('Role name cannot be empty.');
    }
  }

  const cleanColor = color !== undefined ? String(color).trim() : role.color;
  const cleanPos = position !== undefined ? (role.isDefault ? 0 : Number(position)) : role.position;
  const cleanPerms = permissions !== undefined ? Number(permissions) : role.permissions;

  db.prepare(`
    UPDATE server_roles
    SET name = ?, color = ?, position = ?, permissions = ?
    WHERE id = ? AND server_id = ?
  `).run(cleanName, cleanColor, cleanPos, cleanPerms, rId, sId);

  return getRoleById(rId);
}

function deleteRole(serverId, roleId) {
  const sId = Number(serverId);
  const rId = Number(roleId);
  const role = getRoleById(rId);
  if (!role || role.serverId !== sId) throw new Error('Role not found.');
  if (role.isDefault) throw new Error('Cannot delete the default @everyone role.');

  db.prepare(`DELETE FROM server_member_roles WHERE role_id = ?`).run(rId);
  db.prepare(`DELETE FROM server_roles WHERE id = ?`).run(rId);
  return true;
}

const getMemberRolesStmt = db.prepare(`
  SELECT r.id, r.name, r.color, r.position, r.permissions, r.is_default AS isDefault
  FROM server_member_roles smr
  JOIN server_roles r ON smr.role_id = r.id
  WHERE smr.server_id = ? AND smr.user_id = ?
  ORDER BY r.position DESC
`);

function getMemberRoles(serverId, userId) {
  return getMemberRolesStmt.all(Number(serverId), Number(userId));
}

function assignMemberRole(serverId, userId, roleId) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const rId = Number(roleId);
  const role = getRoleById(rId);
  if (!role || role.serverId !== sId) throw new Error('Role not found.');
  if (role.isDefault) return true; // everyone already has @everyone implicitly

  db.prepare(`
    INSERT OR IGNORE INTO server_member_roles (server_id, user_id, role_id, assigned_at)
    VALUES (?, ?, ?, ?)
  `).run(sId, uId, rId, new Date().toISOString());
  return true;
}

function removeMemberRole(serverId, userId, roleId) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const rId = Number(roleId);
  db.prepare(`
    DELETE FROM server_member_roles
    WHERE server_id = ? AND user_id = ? AND role_id = ?
  `).run(sId, uId, rId);
  return true;
}

const removeMemberAllRolesStmt = db.prepare(`
  DELETE FROM server_member_roles WHERE server_id = ? AND user_id = ?
`);

function computeUserPermissions(userId, serverId) {
  const sId = Number(serverId);
  const uId = Number(userId);

  const server = getServerById(sId);
  if (!server) return 0;

  // Server Owner always receives ALL permissions
  if (server.createdBy && Number(server.createdBy) === uId) {
    return ALL_PERMISSIONS;
  }

  // Developer accounts receive ALL permissions
  const user = getUserById(uId);
  if (user && user.isDeveloper) {
    return ALL_PERMISSIONS;
  }

  // If not a member, 0
  if (!isServerMember(sId, uId)) {
    return 0;
  }

  // Start with default @everyone permissions
  ensureDefaultServerRoles(sId);
  const everyoneRole = db.prepare(`SELECT permissions FROM server_roles WHERE server_id = ? AND is_default = 1`).get(sId);
  let perms = everyoneRole ? Number(everyoneRole.permissions) : 0;

  // Union all assigned roles
  const memberRoles = getMemberRoles(sId, uId);
  for (const r of memberRoles) {
    perms |= Number(r.permissions);
  }

  // Administrator bit grants everything
  if ((perms & PERMISSION_FLAGS.ADMINISTRATOR) !== 0) {
    return ALL_PERMISSIONS;
  }

  return perms;
}

function hasPermission(userId, serverId, flag) {
  const perms = computeUserPermissions(userId, serverId);
  return (perms & flag) !== 0 || (perms & PERMISSION_FLAGS.ADMINISTRATOR) !== 0;
}

function getHighestRolePosition(userId, serverId) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const server = getServerById(sId);
  if (server && server.createdBy && Number(server.createdBy) === uId) {
    return 999999; // Owner is always top
  }
  const user = getUserById(uId);
  if (user && user.isDeveloper) {
    return 999998; // Developer is top
  }
  const roles = getMemberRoles(sId, uId);
  if (!roles || roles.length === 0) return 0;
  return Math.max(...roles.map(r => Number(r.position)));
}

// ----------------------------------------------------
// Version 5e-server settings: Moderation (Timeouts, Bans, Warnings)
// ----------------------------------------------------
const insertTimeoutStmt = db.prepare(`
  INSERT INTO server_timeouts (server_id, user_id, timed_out_by, expires_at, reason, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(server_id, user_id) DO UPDATE SET
    timed_out_by = excluded.timed_out_by,
    expires_at = excluded.expires_at,
    reason = excluded.reason,
    created_at = excluded.created_at
`);

function timeoutMember({ serverId, userId, timedOutBy, durationSeconds, reason = '' }) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const byId = Number(timedOutBy);
  const seconds = Number(durationSeconds) || 60;
  const expiresAt = new Date(Date.now() + seconds * 1000).toISOString();
  const now = new Date().toISOString();

  insertTimeoutStmt.run(sId, uId, byId, expiresAt, String(reason || '').trim().slice(0, 500), now);
  return { serverId: sId, userId: uId, expiresAt, reason };
}

const deleteTimeoutStmt = db.prepare(`DELETE FROM server_timeouts WHERE server_id = ? AND user_id = ?`);

function removeTimeout(serverId, userId) {
  deleteTimeoutStmt.run(Number(serverId), Number(userId));
  return true;
}

function isMemberTimedOut(serverId, userId) {
  const row = db.prepare(`SELECT expires_at FROM server_timeouts WHERE server_id = ? AND user_id = ?`).get(Number(serverId), Number(userId));
  if (!row) return false;
  const isExpired = new Date(row.expires_at).getTime() <= Date.now();
  if (isExpired) {
    deleteTimeoutStmt.run(Number(serverId), Number(userId));
    return false;
  }
  return true;
}

const insertBanStmt = db.prepare(`
  INSERT INTO server_bans (server_id, user_id, banned_by, reason, created_at)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(server_id, user_id) DO UPDATE SET
    banned_by = excluded.banned_by,
    reason = excluded.reason,
    created_at = excluded.created_at
`);

function banMember({ serverId, userId, bannedBy, reason = '' }) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const byId = Number(bannedBy);
  const now = new Date().toISOString();

  // Remove from server members
  removeServerMemberStmt.run(sId, uId);
  removeMemberAllRolesStmt.run(sId, uId);
  deleteTimeoutStmt.run(sId, uId);

  insertBanStmt.run(sId, uId, byId, String(reason || '').trim().slice(0, 500), now);
  return { serverId: sId, userId: uId, reason };
}

const deleteBanStmt = db.prepare(`DELETE FROM server_bans WHERE server_id = ? AND user_id = ?`);

function unbanMember(serverId, userId) {
  deleteBanStmt.run(Number(serverId), Number(userId));
  return true;
}

function isUserBanned(serverId, userId) {
  const row = db.prepare(`SELECT id FROM server_bans WHERE server_id = ? AND user_id = ?`).get(Number(serverId), Number(userId));
  return Boolean(row);
}

function getServerBans(serverId) {
  const sId = Number(serverId);
  return db.prepare(`
    SELECT sb.id, sb.server_id AS serverId, sb.user_id AS userId, sb.banned_by AS bannedBy,
           sb.reason, sb.created_at AS createdAt,
           u.username, u.display_name AS displayName, u.avatar_url AS avatarUrl,
           mod.display_name AS bannedByName, mod.username AS bannedByUsername
    FROM server_bans sb
    JOIN users u ON sb.user_id = u.id
    LEFT JOIN users mod ON sb.banned_by = mod.id
    WHERE sb.server_id = ?
    ORDER BY sb.id DESC
  `).all(sId);
}

function warnMember({ serverId, userId, warnedBy, reason }) {
  const sId = Number(serverId);
  const uId = Number(userId);
  const byId = Number(warnedBy);
  const cleanReason = String(reason || 'Warning issued').trim().slice(0, 500);
  const now = new Date().toISOString();

  const res = db.prepare(`
    INSERT INTO server_warnings (server_id, user_id, warned_by, reason, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(sId, uId, byId, cleanReason, now);

  return { id: Number(res.lastInsertRowid), serverId: sId, userId: uId, reason: cleanReason, createdAt: now };
}

// ----------------------------------------------------
// Version 5e-server settings: Audit Logs
// ----------------------------------------------------
const insertAuditLogStmt = db.prepare(`
  INSERT INTO server_audit_logs (server_id, actor_id, action, target_id, target_type, reason, changes_json, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

function logServerAudit({ serverId, actorId, action, targetId = null, targetType = null, reason = '', changes = {} }) {
  const sId = Number(serverId);
  const aId = Number(actorId);
  const now = new Date().toISOString();
  const changesStr = typeof changes === 'string' ? changes : JSON.stringify(changes || {});

  insertAuditLogStmt.run(
    sId, aId, String(action || 'UNKNOWN'),
    targetId ? Number(targetId) : null,
    targetType ? String(targetType) : null,
    String(reason || '').trim().slice(0, 500),
    changesStr,
    now
  );
}

function getServerAuditLogs(serverId, limit = 100) {
  const sId = Number(serverId);
  const rows = db.prepare(`
    SELECT sal.id, sal.server_id AS serverId, sal.actor_id AS actorId,
           sal.action, sal.target_id AS targetId, sal.target_type AS targetType,
           sal.reason, sal.changes_json AS changesJson, sal.created_at AS createdAt,
           u.display_name AS actorDisplayName, u.username AS actorUsername, u.avatar_url AS actorAvatarUrl
    FROM server_audit_logs sal
    LEFT JOIN users u ON sal.actor_id = u.id
    WHERE sal.server_id = ?
    ORDER BY sal.id DESC
    LIMIT ?
  `).all(sId, limit);

  return rows.map(r => {
    let parsedChanges = {};
    try { parsedChanges = JSON.parse(r.changesJson || '{}'); } catch {}
    return {
      ...r,
      changes: parsedChanges
    };
  });
}

// ----------------------------------------------------
// Stickers & Custom Emojis Operations
// ----------------------------------------------------
function getStickers(serverId = null) {
  let rows;
  if (serverId) {
    rows = db.prepare(`
      SELECT s.id, s.server_id AS serverId, s.name, s.description, s.tags,
             s.file_url AS fileUrl, s.file_format AS fileFormat,
             s.created_by AS createdBy, s.created_at AS createdAt,
             u.username AS creatorUsername
      FROM stickers s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.server_id = ? OR s.server_id IS NULL
      ORDER BY s.server_id IS NOT NULL DESC, s.name ASC
    `).all(Number(serverId));
  } else {
    rows = db.prepare(`
      SELECT s.id, s.server_id AS serverId, s.name, s.description, s.tags,
             s.file_url AS fileUrl, s.file_format AS fileFormat,
             s.created_by AS createdBy, s.created_at AS createdAt,
             u.username AS creatorUsername
      FROM stickers s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.server_id IS NULL
      ORDER BY s.name ASC
    `).all();
  }
  return rows;
}

function getStickerById(stickerId) {
  return db.prepare(`
    SELECT s.id, s.server_id AS serverId, s.name, s.description, s.tags,
           s.file_url AS fileUrl, s.file_format AS fileFormat,
           s.created_by AS createdBy, s.created_at AS createdAt,
           u.username AS creatorUsername
    FROM stickers s
    LEFT JOIN users u ON s.created_by = u.id
    WHERE s.id = ?
  `).get(Number(stickerId)) || null;
}

function createSticker({ serverId = null, name, description = '', tags = '', fileUrl, fileFormat = 'png', createdBy = null }) {
  const cleanName = String(name || '').trim().slice(0, 32);
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Sticker name must be between 2 and 32 characters.');
  }
  if (!fileUrl) throw new Error('Sticker image is required.');

  const now = new Date().toISOString();
  const res = db.prepare(`
    INSERT INTO stickers (server_id, name, description, tags, file_url, file_format, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    serverId ? Number(serverId) : null,
    cleanName,
    String(description || '').trim().slice(0, 128),
    String(tags || '').trim().slice(0, 200),
    String(fileUrl).trim(),
    String(fileFormat || 'png').toLowerCase(),
    createdBy ? Number(createdBy) : null,
    now
  );

  return getStickerById(Number(res.lastInsertRowid));
}

function deleteSticker(stickerId) {
  const res = db.prepare(`DELETE FROM stickers WHERE id = ?`).run(Number(stickerId));
  return res.changes > 0;
}

function getCustomEmojis(serverId = null) {
  let rows;
  if (serverId) {
    rows = db.prepare(`
      SELECT ce.id, ce.server_id AS serverId, ce.code, ce.image_url AS imageUrl,
             ce.created_by AS createdBy, ce.created_at AS createdAt
      FROM custom_emojis ce
      WHERE ce.server_id = ? OR ce.server_id IS NULL
      ORDER BY ce.code ASC
    `).all(Number(serverId));
  } else {
    rows = db.prepare(`
      SELECT ce.id, ce.server_id AS serverId, ce.code, ce.image_url AS imageUrl,
             ce.created_by AS createdBy, ce.created_at AS createdAt
      FROM custom_emojis ce
      WHERE ce.server_id IS NULL
      ORDER BY ce.code ASC
    `).all();
  }
  return rows;
}

function createCustomEmoji({ serverId = null, code, imageUrl, createdBy = null }) {
  const cleanCode = String(code || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 32);
  if (!cleanCode || cleanCode.length < 2) {
    throw new Error('Emoji code must be alphanumeric and between 2 and 32 characters.');
  }
  if (!imageUrl) throw new Error('Emoji image is required.');

  const now = new Date().toISOString();
  const res = db.prepare(`
    INSERT INTO custom_emojis (server_id, code, image_url, created_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(serverId ? Number(serverId) : null, cleanCode, String(imageUrl).trim(), createdBy ? Number(createdBy) : null, now);

  return db.prepare(`SELECT * FROM custom_emojis WHERE id = ?`).get(Number(res.lastInsertRowid));
}

function deleteCustomEmoji(emojiId) {
  const res = db.prepare(`DELETE FROM custom_emojis WHERE id = ?`).run(Number(emojiId));
  return res.changes > 0;
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
    CASE WHEN f.sender_id = ? THEN u2.is_developer ELSE u1.is_developer END AS isDeveloper,
    CASE WHEN f.sender_id = ? THEN COALESCE(u2.status, 'online') ELSE COALESCE(u1.status, 'online') END AS status,
    CASE WHEN f.sender_id = ? THEN COALESCE(u2.custom_status_text, '') ELSE COALESCE(u1.custom_status_text, '') END AS customStatusText,
    CASE WHEN f.sender_id = ? THEN COALESCE(u2.custom_status_emoji, '') ELSE COALESCE(u1.custom_status_emoji, '') END AS customStatusEmoji,
    CASE WHEN f.sender_id = ? THEN u2.custom_status_expires_at ELSE u1.custom_status_expires_at END AS customStatusExpiresAt
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
    u.is_developer AS isDeveloper,
    COALESCE(u.status, 'online') AS status,
    COALESCE(u.custom_status_text, '') AS customStatusText,
    COALESCE(u.custom_status_emoji, '') AS customStatusEmoji,
    u.custom_status_expires_at AS customStatusExpiresAt
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
    u.is_developer AS isDeveloper,
    COALESCE(u.status, 'online') AS status,
    COALESCE(u.custom_status_text, '') AS customStatusText,
    COALESCE(u.custom_status_emoji, '') AS customStatusEmoji,
    u.custom_status_expires_at AS customStatusExpiresAt
  FROM friendships f
  JOIN users u ON f.receiver_id = u.id
  WHERE f.sender_id = ? AND f.status = 'pending'
  ORDER BY f.id DESC
`);

function getFriendships(userId) {
  const uId = Number(userId);
  const friends = getAcceptedFriendsStmt.all(uId, uId, uId, uId, uId, uId, uId, uId, uId, uId, uId).map(f => ({
    ...f,
    avatarUrl: f.avatarUrl || null,
    isDeveloper: Boolean(f.isDeveloper),
    status: f.status || 'online',
    customStatus: (f.customStatusText || f.customStatusEmoji) ? {
      text: f.customStatusText || '',
      emoji: f.customStatusEmoji || '',
      expiresAt: f.customStatusExpiresAt || null
    } : null
  }));
  const pendingIncoming = getPendingIncomingStmt.all(uId).map(f => ({
    ...f,
    avatarUrl: f.avatarUrl || null,
    isDeveloper: Boolean(f.isDeveloper),
    status: f.status || 'online',
    customStatus: (f.customStatusText || f.customStatusEmoji) ? {
      text: f.customStatusText || '',
      emoji: f.customStatusEmoji || '',
      expiresAt: f.customStatusExpiresAt || null
    } : null
  }));
  const pendingOutgoing = getPendingOutgoingStmt.all(uId).map(f => ({
    ...f,
    avatarUrl: f.avatarUrl || null,
    isDeveloper: Boolean(f.isDeveloper),
    status: f.status || 'online',
    customStatus: (f.customStatusText || f.customStatusEmoji) ? {
      text: f.customStatusText || '',
      emoji: f.customStatusEmoji || '',
      expiresAt: f.customStatusExpiresAt || null
    } : null
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
  INSERT INTO messages (server_id, channel_id, author, author_id, author_name, author_username, is_developer, content, timestamp, file_url, file_name, file_size, file_type, reply_to_id, reply_to_data, is_forwarded)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function saveMessage({ serverId = 1, channelId = 1, authorId, authorName, authorUsername, isDeveloper, content, fileUrl = null, fileName = null, fileSize = null, fileType = null, replyToId = null, replyToData = null, isForwarded = false }) {
  const cleanName = (authorName || 'Anonymous').trim().slice(0, 32);
  const cleanUsername = (authorUsername || 'anon').trim().slice(0, 32);
  const cleanContent = (content || '').trim().slice(0, 2000);
  const devFlag = isDeveloper ? 1 : 0;
  const timestamp = new Date().toISOString();
  const sId = Number(serverId) || 1;
  const cId = Number(channelId) || 1;
  const replyJson = replyToData ? (typeof replyToData === 'string' ? replyToData : JSON.stringify(replyToData)) : null;

  const result = insertMessageStmt.run(
    sId, cId, cleanName, authorId || null, cleanName, cleanUsername, devFlag, cleanContent, timestamp,
    fileUrl || null, fileName || null, fileSize ? Number(fileSize) : null, fileType || null,
    replyToId ? Number(replyToId) : null, replyJson, isForwarded ? 1 : 0
  );
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
    timestamp,
    fileUrl: fileUrl || null,
    fileName: fileName || null,
    fileSize: fileSize ? Number(fileSize) : null,
    fileType: fileType || null,
    replyToId: replyToId ? Number(replyToId) : null,
    replyToData: replyToData || null,
    isForwarded: Boolean(isForwarded),
    isPinned: false,
    isEdited: false
  };
}

const getHistoryByChannelStmt = db.prepare(`
  SELECT m.id, m.server_id AS serverId, m.channel_id AS channelId, m.author_id AS authorId, 
         COALESCE(u.display_name, m.author_name, m.author) AS authorName, 
         COALESCE(u.username, m.author_username, 'anon') AS authorUsername, 
         u.avatar_url AS authorAvatarUrl,
         COALESCE(u.is_developer, m.is_developer, 0) AS isDeveloper, 
         COALESCE(u.is_deleted, 0) AS isAuthorDeleted,
         m.content, m.timestamp,
         m.file_url AS fileUrl, m.file_name AS fileName, m.file_size AS fileSize, m.file_type AS fileType,
         m.reply_to_id AS replyToId, m.reply_to_data AS replyToData,
         COALESCE(m.is_pinned, 0) AS isPinned, m.pinned_at AS pinnedAt, m.pinned_by AS pinnedBy,
         COALESCE(m.is_forwarded, 0) AS isForwarded,
         COALESCE(m.is_edited, 0) AS isEdited, m.edited_at AS editedAt,
         COALESCE(m.is_deleted, 0) AS isDeleted, m.deleted_at AS deletedAt
  FROM messages m
  LEFT JOIN users u ON m.author_id = u.id
  WHERE m.channel_id = ? AND COALESCE(m.is_deleted, 0) = 0
  ORDER BY m.id DESC
  LIMIT ?
`);

function getRecentMessages(channelId = 1, limit = 50) {
  const rows = getHistoryByChannelStmt.all(Number(channelId) || 1, limit);
  return rows.reverse().map(r => {
    const isDeleted = Boolean(r.isAuthorDeleted);
    let replyParsed = null;
    if (r.replyToData) {
      try { replyParsed = JSON.parse(r.replyToData); } catch {}
    }
    return {
      ...r,
      authorName: isDeleted ? 'Deleted User' : (r.authorName || 'Anonymous'),
      authorUsername: isDeleted ? 'deleted' : (r.authorUsername || 'anon'),
      authorAvatarUrl: isDeleted ? null : (r.authorAvatarUrl || null),
      isDeveloper: isDeleted ? false : Boolean(r.isDeveloper),
      isDeleted,
      replyToData: replyParsed,
      isPinned: Boolean(r.isPinned),
      isForwarded: Boolean(r.isForwarded),
      isEdited: Boolean(r.isEdited)
    };
  });
}

// Direct Messages Operations
const insertDirectMessageStmt = db.prepare(`
  INSERT INTO direct_messages (sender_id, receiver_id, content, timestamp, file_url, file_name, file_size, file_type, reply_to_id, reply_to_data, is_forwarded)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function saveDirectMessage({ senderId, receiverId, content, fileUrl = null, fileName = null, fileSize = null, fileType = null, replyToId = null, replyToData = null, isForwarded = false }) {
  const sId = Number(senderId);
  const rId = Number(receiverId);
  const cleanContent = (content || '').trim().slice(0, 2000);
  const timestamp = new Date().toISOString();
  const replyJson = replyToData ? (typeof replyToData === 'string' ? replyToData : JSON.stringify(replyToData)) : null;

  const sender = getUserById(sId);
  const result = insertDirectMessageStmt.run(
    sId, rId, cleanContent, timestamp,
    fileUrl || null, fileName || null, fileSize ? Number(fileSize) : null, fileType || null,
    replyToId ? Number(replyToId) : null, replyJson, isForwarded ? 1 : 0
  );

  return {
    id: Number(result.lastInsertRowid),
    senderId: sId,
    receiverId: rId,
    authorId: sId,
    authorName: sender ? sender.displayName : 'Unknown',
    authorUsername: sender ? sender.username : 'user',
    authorAvatarUrl: sender ? sender.avatarUrl : null,
    isDeveloper: sender ? Boolean(sender.isDeveloper) : false,
    content: cleanContent,
    timestamp,
    fileUrl: fileUrl || null,
    fileName: fileName || null,
    fileSize: fileSize ? Number(fileSize) : null,
    fileType: fileType || null,
    replyToId: replyToId ? Number(replyToId) : null,
    replyToData: replyToData || null,
    isForwarded: Boolean(isForwarded),
    isPinned: false,
    isEdited: false
  };
}

const getDirectMessagesStmt = db.prepare(`
  SELECT 
    dm.id,
    dm.sender_id AS senderId,
    dm.sender_id AS authorId,
    dm.receiver_id AS receiverId,
    COALESCE(u.display_name, 'Deleted User') AS authorName,
    COALESCE(u.username, 'deleted') AS authorUsername,
    u.avatar_url AS authorAvatarUrl,
    COALESCE(u.is_developer, 0) AS isDeveloper,
    COALESCE(u.is_deleted, 0) AS isAuthorDeleted,
    dm.content,
    dm.timestamp,
    dm.file_url AS fileUrl,
    dm.file_name AS fileName,
    dm.file_size AS fileSize,
    dm.file_type AS fileType,
    dm.reply_to_id AS replyToId,
    dm.reply_to_data AS replyToData,
    COALESCE(dm.is_pinned, 0) AS isPinned,
    dm.pinned_at AS pinnedAt,
    dm.pinned_by AS pinnedBy,
    COALESCE(dm.is_forwarded, 0) AS isForwarded,
    COALESCE(dm.is_edited, 0) AS isEdited,
    dm.edited_at AS editedAt,
    COALESCE(dm.is_deleted, 0) AS isDeleted,
    dm.deleted_at AS deletedAt
  FROM direct_messages dm
  LEFT JOIN users u ON dm.sender_id = u.id
  WHERE ((dm.sender_id = ? AND dm.receiver_id = ?) OR (dm.sender_id = ? AND dm.receiver_id = ?))
    AND COALESCE(dm.is_deleted, 0) = 0
  ORDER BY dm.id DESC
  LIMIT ?
`);

function getDirectMessagesHistory(userId, friendId, limit = 50) {
  const uId = Number(userId);
  const fId = Number(friendId);
  const rows = getDirectMessagesStmt.all(uId, fId, fId, uId, limit);
  return rows.reverse().map(r => {
    const isDeleted = Boolean(r.isAuthorDeleted);
    let replyParsed = null;
    if (r.replyToData) {
      try { replyParsed = JSON.parse(r.replyToData); } catch {}
    }
    return {
      ...r,
      authorName: isDeleted ? 'Deleted User' : (r.authorName || 'User'),
      authorUsername: isDeleted ? 'deleted' : (r.authorUsername || 'user'),
      authorAvatarUrl: isDeleted ? null : (r.authorAvatarUrl || null),
      isDeveloper: isDeleted ? false : Boolean(r.isDeveloper),
      isDeleted,
      replyToData: replyParsed,
      isPinned: Boolean(r.isPinned),
      isForwarded: Boolean(r.isForwarded),
      isEdited: Boolean(r.isEdited)
    };
  });
}

// Single Message Fetching
const getMessageByIdStmt = db.prepare(`
  SELECT m.id, m.server_id AS serverId, m.channel_id AS channelId, m.author_id AS authorId,
         COALESCE(u.display_name, m.author_name, m.author) AS authorName,
         COALESCE(u.username, m.author_username, 'anon') AS authorUsername,
         u.avatar_url AS authorAvatarUrl,
         COALESCE(u.is_developer, m.is_developer, 0) AS isDeveloper,
         m.content, m.timestamp,
         m.file_url AS fileUrl, m.file_name AS fileName, m.file_size AS fileSize, m.file_type AS fileType,
         m.reply_to_id AS replyToId, m.reply_to_data AS replyToData,
         COALESCE(m.is_pinned, 0) AS isPinned, m.pinned_at AS pinnedAt, m.pinned_by AS pinnedBy,
         COALESCE(m.is_forwarded, 0) AS isForwarded,
         COALESCE(m.is_edited, 0) AS isEdited, m.edited_at AS editedAt,
         COALESCE(m.is_deleted, 0) AS isDeleted, m.deleted_at AS deletedAt
  FROM messages m
  LEFT JOIN users u ON m.author_id = u.id
  WHERE m.id = ?
`);

function getMessageById(messageId) {
  const r = getMessageByIdStmt.get(Number(messageId));
  if (!r) return null;
  let replyParsed = null;
  if (r.replyToData) {
    try { replyParsed = JSON.parse(r.replyToData); } catch {}
  }
  return {
    ...r,
    replyToData: replyParsed,
    isPinned: Boolean(r.isPinned),
    isForwarded: Boolean(r.isForwarded),
    isEdited: Boolean(r.isEdited),
    isDeleted: Boolean(r.isDeleted)
  };
}

const getDirectMessageByIdStmt = db.prepare(`
  SELECT dm.id, dm.sender_id AS senderId, dm.sender_id AS authorId, dm.receiver_id AS receiverId,
         COALESCE(u.display_name, 'User') AS authorName,
         COALESCE(u.username, 'user') AS authorUsername,
         u.avatar_url AS authorAvatarUrl,
         COALESCE(u.is_developer, 0) AS isDeveloper,
         dm.content, dm.timestamp,
         dm.file_url AS fileUrl, dm.file_name AS fileName, dm.file_size AS fileSize, dm.file_type AS fileType,
         dm.reply_to_id AS replyToId, dm.reply_to_data AS replyToData,
         COALESCE(dm.is_pinned, 0) AS isPinned, dm.pinned_at AS pinnedAt, dm.pinned_by AS pinnedBy,
         COALESCE(dm.is_forwarded, 0) AS isForwarded,
         COALESCE(dm.is_edited, 0) AS isEdited, dm.edited_at AS editedAt,
         COALESCE(dm.is_deleted, 0) AS isDeleted, dm.deleted_at AS deletedAt
  FROM direct_messages dm
  LEFT JOIN users u ON dm.sender_id = u.id
  WHERE dm.id = ?
`);

function getDirectMessageById(messageId) {
  const r = getDirectMessageByIdStmt.get(Number(messageId));
  if (!r) return null;
  let replyParsed = null;
  if (r.replyToData) {
    try { replyParsed = JSON.parse(r.replyToData); } catch {}
  }
  return {
    ...r,
    replyToData: replyParsed,
    isPinned: Boolean(r.isPinned),
    isForwarded: Boolean(r.isForwarded),
    isEdited: Boolean(r.isEdited),
    isDeleted: Boolean(r.isDeleted)
  };
}

// Edit Message
function editMessage({ messageId, newContent, userId, isDeveloper = false, isDm = false }) {
  const mId = Number(messageId);
  const clean = String(newContent || '').trim().slice(0, 2000);
  if (!clean) throw new Error('Message content cannot be empty.');
  const now = new Date().toISOString();

  if (isDm) {
    const msg = getDirectMessageById(mId);
    if (!msg) throw new Error('Direct message not found.');
    if (msg.senderId !== Number(userId) && !isDeveloper) {
      throw new Error('You can only edit your own messages.');
    }
    db.prepare(`UPDATE direct_messages SET content = ?, is_edited = 1, edited_at = ? WHERE id = ?`).run(clean, now, mId);
    return getDirectMessageById(mId);
  } else {
    const msg = getMessageById(mId);
    if (!msg) throw new Error('Message not found.');
    if (msg.authorId !== Number(userId) && !isDeveloper) {
      throw new Error('You can only edit your own messages.');
    }
    db.prepare(`UPDATE messages SET content = ?, is_edited = 1, edited_at = ? WHERE id = ?`).run(clean, now, mId);
    return getMessageById(mId);
  }
}

// Delete Message (Soft delete)
function deleteMessage({ messageId, userId, isDeveloper = false, isDm = false }) {
  const mId = Number(messageId);
  const now = new Date().toISOString();

  if (isDm) {
    const msg = getDirectMessageById(mId);
    if (!msg) throw new Error('Direct message not found.');
    if (msg.senderId !== Number(userId) && !isDeveloper) {
      throw new Error('You can only delete your own messages.');
    }
    db.prepare(`UPDATE direct_messages SET is_deleted = 1, deleted_at = ? WHERE id = ?`).run(now, mId);
    return { id: mId, isDm: true, senderId: msg.senderId, receiverId: msg.receiverId };
  } else {
    const msg = getMessageById(mId);
    if (!msg) throw new Error('Message not found.');
    const canDelete = msg.authorId === Number(userId) || isDeveloper || hasPermission(userId, msg.serverId, PERMISSION_FLAGS.MANAGE_MESSAGES);
    if (!canDelete) {
      throw new Error('You do not have permission to delete this message.');
    }
    db.prepare(`UPDATE messages SET is_deleted = 1, deleted_at = ? WHERE id = ?`).run(now, mId);
    return { id: mId, isDm: false, serverId: msg.serverId, channelId: msg.channelId };
  }
}

// Pin / Unpin Message
function togglePinMessage({ messageId, userId, isDeveloper = false, isDm = false }) {
  const mId = Number(messageId);
  const now = new Date().toISOString();

  if (isDm) {
    const msg = getDirectMessageById(mId);
    if (!msg) throw new Error('Direct message not found.');
    const newPinned = msg.isPinned ? 0 : 1;
    db.prepare(`UPDATE direct_messages SET is_pinned = ?, pinned_at = ?, pinned_by = ? WHERE id = ?`)
      .run(newPinned, newPinned ? now : null, newPinned ? Number(userId) : null, mId);
    return getDirectMessageById(mId);
  } else {
    const msg = getMessageById(mId);
    if (!msg) throw new Error('Message not found.');
    const canPin = isDeveloper || hasPermission(userId, msg.serverId, PERMISSION_FLAGS.MANAGE_MESSAGES);
    if (!canPin) {
      throw new Error('You need Manage Messages permission to pin messages in this channel.');
    }
    const newPinned = msg.isPinned ? 0 : 1;
    db.prepare(`UPDATE messages SET is_pinned = ?, pinned_at = ?, pinned_by = ? WHERE id = ?`)
      .run(newPinned, newPinned ? now : null, newPinned ? Number(userId) : null, mId);
    return getMessageById(mId);
  }
}

// Get Pinned Messages
function getPinnedMessages({ channelId = null, serverId = null, userId = null, friendId = null, isDm = false }) {
  if (isDm) {
    const uId = Number(userId);
    const fId = Number(friendId);
    const rows = db.prepare(`
      SELECT dm.id, dm.sender_id AS senderId, dm.sender_id AS authorId, dm.receiver_id AS receiverId,
             COALESCE(u.display_name, 'User') AS authorName,
             COALESCE(u.username, 'user') AS authorUsername,
             u.avatar_url AS authorAvatarUrl,
             COALESCE(u.is_developer, 0) AS isDeveloper,
             dm.content, dm.timestamp, dm.file_url AS fileUrl, dm.file_name AS fileName,
             dm.pinned_at AS pinnedAt, dm.pinned_by AS pinnedBy
      FROM direct_messages dm
      LEFT JOIN users u ON dm.sender_id = u.id
      WHERE ((dm.sender_id = ? AND dm.receiver_id = ?) OR (dm.sender_id = ? AND dm.receiver_id = ?))
        AND dm.is_pinned = 1 AND COALESCE(dm.is_deleted, 0) = 0
      ORDER BY dm.pinned_at DESC
    `).all(uId, fId, fId, uId);
    return rows;
  } else {
    const cId = Number(channelId);
    const rows = db.prepare(`
      SELECT m.id, m.server_id AS serverId, m.channel_id AS channelId, m.author_id AS authorId,
             COALESCE(u.display_name, m.author_name, m.author) AS authorName,
             COALESCE(u.username, m.author_username, 'anon') AS authorUsername,
             u.avatar_url AS authorAvatarUrl,
             COALESCE(u.is_developer, m.is_developer, 0) AS isDeveloper,
             m.content, m.timestamp, m.file_url AS fileUrl, m.file_name AS fileName,
             m.pinned_at AS pinnedAt, m.pinned_by AS pinnedBy
      FROM messages m
      LEFT JOIN users u ON m.author_id = u.id
      WHERE m.channel_id = ? AND m.is_pinned = 1 AND COALESCE(m.is_deleted, 0) = 0
      ORDER BY m.pinned_at DESC
    `).all(cId);
    return rows;
  }
}

// Message Reports Operations (for Developer Dashboard)
function createMessageReport({ reporterId, messageId, messageType = 'channel', reason = 'inappropriate' }) {
  const repId = Number(reporterId);
  const mId = Number(messageId);
  const now = new Date().toISOString();
  let content = '';
  let authorName = '';
  let reportedUserId = null;
  let serverId = null;
  let channelId = null;
  let channelName = '';

  if (messageType === 'dm') {
    const msg = getDirectMessageById(mId);
    if (!msg) throw new Error('Reported message not found.');
    content = msg.content || (msg.fileName ? `[Attachment: ${msg.fileName}]` : '[Empty message]');
    authorName = msg.authorName || msg.authorUsername || 'User';
    reportedUserId = msg.senderId;
    channelName = 'Direct Message';
  } else {
    const msg = getMessageById(mId);
    if (!msg) throw new Error('Reported message not found.');
    content = msg.content || (msg.fileName ? `[Attachment: ${msg.fileName}]` : '[Empty message]');
    authorName = msg.authorName || msg.authorUsername || 'User';
    reportedUserId = msg.authorId;
    serverId = msg.serverId;
    channelId = msg.channelId;
    const ch = getChannelById(channelId);
    channelName = ch ? ch.name : 'channel';
  }

  const res = db.prepare(`
    INSERT INTO message_reports (
      reporter_id, reported_user_id, message_id, message_type,
      server_id, channel_id, channel_name, reason,
      message_content, message_author_name, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(
    repId, reportedUserId, mId, messageType,
    serverId, channelId, channelName, String(reason).trim().slice(0, 500),
    content.slice(0, 2000), authorName.slice(0, 50), now
  );

  return getMessageReportById(Number(res.lastInsertRowid));
}

function getMessageReportById(reportId) {
  const row = db.prepare(`
    SELECT r.*,
           rep.username AS reporterUsername, rep.display_name AS reporterDisplayName,
           tgt.username AS reportedUsername, tgt.display_name AS reportedDisplayName
    FROM message_reports r
    LEFT JOIN users rep ON r.reporter_id = rep.id
    LEFT JOIN users tgt ON r.reported_user_id = tgt.id
    WHERE r.id = ?
  `).get(Number(reportId));
  return row || null;
}

function getAllMessageReports() {
  const rows = db.prepare(`
    SELECT r.*,
           rep.username AS reporterUsername, rep.display_name AS reporterDisplayName,
           tgt.username AS reportedUsername, tgt.display_name AS reportedDisplayName
    FROM message_reports r
    LEFT JOIN users rep ON r.reporter_id = rep.id
    LEFT JOIN users tgt ON r.reported_user_id = tgt.id
    ORDER BY CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END ASC, r.id DESC
  `).all();
  return rows;
}

function updateMessageReportStatus({ reportId, status, actionTaken = null, devUserId = null }) {
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE message_reports
    SET status = ?, action_taken = ?, reviewed_by = ?, reviewed_at = ?
    WHERE id = ?
  `).run(status, actionTaken, devUserId ? Number(devUserId) : null, now, Number(reportId));
  return getMessageReportById(reportId);
}

// Mutual Friends and Mutual Servers
const getMutualFriendsStmt = db.prepare(`
  SELECT u.id, u.username, u.display_name AS displayName, u.avatar_url AS avatarUrl
  FROM users u
  WHERE u.id != ? AND u.id != ?
    AND u.id IN (
      SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
      FROM friendships WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'
    )
    AND u.id IN (
      SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
      FROM friendships WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'
    )
  ORDER BY u.display_name ASC
`);

function getMutualFriends(userId1, userId2) {
  const u1 = Number(userId1);
  const u2 = Number(userId2);
  if (!u1 || !u2 || u1 === u2) return [];
  return getMutualFriendsStmt.all(u1, u2, u1, u1, u1, u2, u2, u2).map(r => ({
    id: r.id,
    username: r.username,
    displayName: r.displayName,
    avatarUrl: r.avatarUrl || null
  }));
}

const getMutualServersStmt = db.prepare(`
  SELECT s.id, s.name
  FROM servers s
  JOIN server_members sm1 ON s.id = sm1.server_id AND sm1.user_id = ?
  JOIN server_members sm2 ON s.id = sm2.server_id AND sm2.user_id = ?
  ORDER BY s.id ASC
`);

function getMutualServers(userId1, userId2) {
  const u1 = Number(userId1);
  const u2 = Number(userId2);
  if (!u1 || !u2 || u1 === u2) return [];
  return getMutualServersStmt.all(u1, u2);
}

// Storage Statistics (Pre-Shutdown Check)
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  let total = 0;
  if (!fs.existsSync(dirPath)) return 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        total += getDirectorySize(fullPath);
      } else if (entry.isFile()) {
        try {
          total += fs.statSync(fullPath).size;
        } catch {}
      }
    }
  } catch {}
  return total;
}

function getStorageStats(uploadsDir) {
  let dbBytes = 0;
  try {
    if (fs.existsSync(dbPath)) {
      dbBytes = fs.statSync(dbPath).size;
    }
  } catch {}

  const upDir = uploadsDir || path.join(__dirname, '..', 'uploads');
  const uploadsBytes = getDirectorySize(upDir);
  const totalBytes = dbBytes + uploadsBytes;

  return {
    databaseBytes: dbBytes,
    databaseFormatted: formatBytes(dbBytes),
    uploadsBytes: uploadsBytes,
    uploadsFormatted: formatBytes(uploadsBytes),
    totalBytes: totalBytes,
    totalFormatted: formatBytes(totalBytes)
  };
}

// ==========================================
// FEEDBACK & COMMUNITY FORUM HELPERS
// ==========================================

const insertFeedbackStmt = db.prepare(`
  INSERT INTO feedback (user_id, author_name, author_username, author_avatar_url, content, category, status, dev_response, dev_response_by, created_at, updated_at, is_deleted)
  VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL, NULL, ?, ?, 0)
`);

const getFeedbackByIdStmt = db.prepare(`
  SELECT f.id, f.user_id AS userId, f.content, COALESCE(f.category, 'qol') AS category, f.status, f.dev_response AS devResponse,
         f.dev_response_by AS devResponseBy, f.created_at AS createdAt, f.updated_at AS updatedAt,
         COALESCE(u.display_name, f.author_name) AS authorName,
         COALESCE(u.username, f.author_username) AS authorUsername,
         COALESCE(u.avatar_url, f.author_avatar_url) AS authorAvatarUrl,
         COALESCE(u.is_developer, 0) AS isDeveloper,
         dev.display_name AS devAuthorName,
         dev.username AS devAuthorUsername,
         dev.avatar_url AS devAuthorAvatarUrl
  FROM feedback f
  LEFT JOIN users u ON f.user_id = u.id
  LEFT JOIN users dev ON f.dev_response_by = dev.id
  WHERE f.id = ? AND f.is_deleted = 0
`);

function getFeedbackById(id) {
  const row = getFeedbackByIdStmt.get(Number(id));
  if (!row) return null;
  return {
    ...row,
    isDeveloper: Boolean(row.isDeveloper)
  };
}

function createFeedback({ userId, authorName, authorUsername, authorAvatarUrl, content, category = 'qol' }) {
  const cleanContent = String(content || '').trim().slice(0, 2000);
  if (!cleanContent) throw new Error('Feedback content cannot be empty.');
  const validCategories = ['fun_option', 'qol', 'bugfix', 'prefer_this_way'];
  const cleanCategory = validCategories.includes(category) ? category : 'qol';
  const now = new Date().toISOString();
  const res = insertFeedbackStmt.run(
    Number(userId),
    String(authorName || 'User').trim().slice(0, 32),
    String(authorUsername || 'user').trim().slice(0, 32),
    authorAvatarUrl || null,
    cleanContent,
    cleanCategory,
    now,
    now
  );
  return getFeedbackById(Number(res.lastInsertRowid));
}

const getAllFeedbackStmt = db.prepare(`
  SELECT f.id, f.user_id AS userId, f.content, COALESCE(f.category, 'qol') AS category, f.status, f.dev_response AS devResponse,
         f.dev_response_by AS devResponseBy, f.created_at AS createdAt, f.updated_at AS updatedAt,
         COALESCE(u.display_name, f.author_name) AS authorName,
         COALESCE(u.username, f.author_username) AS authorUsername,
         COALESCE(u.avatar_url, f.author_avatar_url) AS authorAvatarUrl,
         COALESCE(u.is_developer, 0) AS isDeveloper,
         dev.display_name AS devAuthorName,
         dev.username AS devAuthorUsername,
         dev.avatar_url AS devAuthorAvatarUrl
  FROM feedback f
  LEFT JOIN users u ON f.user_id = u.id
  LEFT JOIN users dev ON f.dev_response_by = dev.id
  WHERE f.is_deleted = 0
  ORDER BY f.id DESC
`);

function getAllFeedback() {
  const rows = getAllFeedbackStmt.all();
  return rows.map(r => ({
    ...r,
    isDeveloper: Boolean(r.isDeveloper)
  }));
}

const updateFeedbackStatusStmt = db.prepare(`
  UPDATE feedback
  SET status = ?, dev_response = ?, dev_response_by = ?, updated_at = ?
  WHERE id = ? AND is_deleted = 0
`);

function updateFeedbackStatus({ feedbackId, status, devResponse = null, devUserId = null }) {
  const validStatuses = ['accepted', 'in_progress', 'considering', 'denied', 'pending', 'accepted_already_exists', 'already_exists'];
  const cleanStatus = validStatuses.includes(status) ? status : 'pending';
  const cleanResponse = (devResponse !== undefined && devResponse !== null && String(devResponse).trim().length > 0)
    ? String(devResponse).trim().slice(0, 1000)
    : null;
  const now = new Date().toISOString();
  updateFeedbackStatusStmt.run(
    cleanStatus,
    cleanResponse,
    devUserId ? Number(devUserId) : null,
    now,
    Number(feedbackId)
  );
  return getFeedbackById(feedbackId);
}

const deleteFeedbackStmt = db.prepare(`
  UPDATE feedback SET is_deleted = 1 WHERE id = ?
`);

function deleteFeedback({ feedbackId }) {
  deleteFeedbackStmt.run(Number(feedbackId));
  return { id: Number(feedbackId) };
}

const hasUserSubmittedFeedbackStmt = db.prepare(`
  SELECT COUNT(*) AS count FROM feedback WHERE user_id = ? AND is_deleted = 0
`);

function hasUserSubmittedFeedback(userId) {
  if (!userId) return false;
  const row = hasUserSubmittedFeedbackStmt.get(Number(userId));
  return Boolean(row && row.count > 0);
}

function getServerMembers(serverId) {
  const sId = Number(serverId);
  const server = getServerById(sId);
  const rows = db.prepare(`
    SELECT u.id, u.username, u.display_name AS displayName, u.avatar_url AS avatarUrl,
           u.is_developer AS isDeveloper, sm.role AS role, sm.joined_at AS joinedAt,
           s.created_by AS ownerId,
           COALESCE(u.status, 'online') AS status,
           COALESCE(u.custom_status_text, '') AS customStatusText,
           COALESCE(u.custom_status_emoji, '') AS customStatusEmoji,
           u.custom_status_expires_at AS customStatusExpiresAt
    FROM server_members sm
    JOIN users u ON sm.user_id = u.id
    JOIN servers s ON sm.server_id = s.id
    WHERE sm.server_id = ? AND u.is_deleted = 0 AND LOWER(u.username) != 'rsl1310'
    ORDER BY 
      CASE WHEN u.id = s.created_by THEN 0 WHEN sm.role = 'admin' THEN 1 ELSE 2 END ASC,
      u.display_name ASC
  `).all(sId);

  return rows.map(r => {
    const isOwner = Boolean(server && server.createdBy && Number(server.createdBy) === r.id);
    const assignedRoles = getMemberRoles(sId, r.id);
    const timedOut = isMemberTimedOut(sId, r.id);
    const highestPos = isOwner ? 999999 : (r.isDeveloper ? 999998 : (assignedRoles.length > 0 ? Math.max(...assignedRoles.map(x => Number(x.position))) : 0));

    return {
      id: r.id,
      username: r.username,
      displayName: r.displayName,
      avatarUrl: r.avatarUrl,
      isDeveloper: Boolean(r.isDeveloper),
      role: (isOwner || r.role === 'admin') ? 'admin' : 'member',
      isOwner,
      roles: assignedRoles,
      highestRolePosition: highestPos,
      isTimedOut: timedOut,
      status: r.status || 'online',
      customStatus: (r.customStatusText || r.customStatusEmoji) ? {
        text: r.customStatusText || '',
        emoji: r.customStatusEmoji || '',
        expiresAt: r.customStatusExpiresAt || null
      } : null
    };
  });
}


// ==========================================
// NOTIFICATIONS SYSTEM
// ==========================================
const insertNotificationStmt = db.prepare(`
  INSERT INTO notifications (user_id, type, title, body, priority, data, is_read, created_at)
  VALUES (?, ?, ?, ?, ?, ?, 0, ?)
`);

const getNotificationByIdStmt = db.prepare(`
  SELECT id, user_id AS userId, type, title, body, priority, data, is_read AS isRead, created_at AS createdAt
  FROM notifications
  WHERE id = ?
`);

function getNotificationById(id) {
  const row = getNotificationByIdStmt.get(Number(id));
  if (!row) return null;
  let parsedData = {};
  try { parsedData = JSON.parse(row.data || '{}'); } catch {}
  return {
    ...row,
    isRead: Boolean(row.isRead),
    is_read: row.isRead ? 1 : 0,
    createdAt: row.createdAt,
    created_at: row.createdAt,
    data: parsedData
  };
}

function createNotification({ userId, type, title, body, priority = 'yellow', data = {} }) {
  const cleanType = String(type || 'system').trim();
  const cleanTitle = String(title || 'Notification').trim().slice(0, 150);
  const cleanBody = String(body || '').trim().slice(0, 500);
  const cleanPriority = ['urgent', 'red'].includes(priority) ? 'red' : (['low', 'green'].includes(priority) ? 'green' : 'yellow');
  const now = new Date().toISOString();
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data || {});

  const res = insertNotificationStmt.run(
    Number(userId),
    cleanType,
    cleanTitle,
    cleanBody,
    cleanPriority,
    dataStr,
    now
  );

  return getNotificationById(Number(res.lastInsertRowid));
}

function getUserNotifications(userId, { unreadOnly = false, type = null, limit = 50, offset = 0 } = {}) {
  let query = `
    SELECT id, user_id AS userId, type, title, body, priority, data, is_read AS isRead, created_at AS createdAt
    FROM notifications
    WHERE user_id = ?
  `;
  const params = [Number(userId)];

  if (unreadOnly) {
    query += ` AND is_read = 0`;
  }
  if (type && type !== 'all') {
    if (type === 'mentions' || type === 'mention') {
      query += ` AND type = 'mention'`;
    } else if (type === 'dms' || type === 'dm') {
      query += ` AND type = 'dm'`;
    } else if (type === 'friends' || type === 'friend') {
      query += ` AND type IN ('friend_request', 'friend_accepted')`;
    } else if (type === 'calls' || type === 'call') {
      query += ` AND type = 'call'`;
    } else if (type === 'system') {
      query += ` AND type IN ('system', 'server', 'scheduled')`;
    } else {
      query += ` AND type = ?`;
      params.push(type);
    }
  }

  query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
  params.push(Math.min(Math.max(Number(limit) || 50, 1), 100));
  params.push(Math.max(Number(offset) || 0, 0));

  const rows = db.prepare(query).all(...params);
  return rows.map(r => {
    let parsedData = {};
    try { parsedData = JSON.parse(r.data || '{}'); } catch {}
    return {
      ...r,
      isRead: Boolean(r.isRead),
      is_read: r.isRead ? 1 : 0,
      createdAt: r.createdAt,
      created_at: r.createdAt,
      data: parsedData
    };
  });
}

const getUnreadNotificationCountStmt = db.prepare(`
  SELECT COUNT(*) AS count
  FROM notifications
  WHERE user_id = ? AND is_read = 0
`);

function getUnreadNotificationCount(userId) {
  const row = getUnreadNotificationCountStmt.get(Number(userId));
  return row ? row.count : 0;
}

const markNotificationAsReadStmt = db.prepare(`
  UPDATE notifications
  SET is_read = 1
  WHERE id = ? AND user_id = ?
`);

function markNotificationAsRead(id, userId) {
  markNotificationAsReadStmt.run(Number(id), Number(userId));
  return getNotificationById(id);
}

const markAllNotificationsAsReadStmt = db.prepare(`
  UPDATE notifications
  SET is_read = 1
  WHERE user_id = ? AND is_read = 0
`);

function markAllNotificationsAsRead(userId) {
  markAllNotificationsAsReadStmt.run(Number(userId));
  return true;
}

const deleteNotificationStmt = db.prepare(`
  DELETE FROM notifications
  WHERE id = ? AND user_id = ?
`);

function deleteNotification(id, userId) {
  deleteNotificationStmt.run(Number(id), Number(userId));
  return true;
}

const clearAllNotificationsStmt = db.prepare(`
  DELETE FROM notifications
  WHERE user_id = ?
`);

function clearAllNotifications(userId) {
  clearAllNotificationsStmt.run(Number(userId));
  return true;
}

function updateUserStatus(userId, opts = {}) {
  const uId = Number(userId);
  let status = null;
  let customStatusText = '';
  let customStatusEmoji = '';
  let customStatusExpiresAt = null;
  let updateCustomStatus = false;

  if (typeof opts === 'string') {
    status = opts;
    if (arguments[2] && typeof arguments[2] === 'object') {
      const extra = arguments[2];
      customStatusText = extra.text !== undefined ? extra.text : extra.customStatusText;
      customStatusEmoji = extra.emoji !== undefined ? extra.emoji : extra.customStatusEmoji;
      customStatusExpiresAt = extra.expiresAt !== undefined ? extra.expiresAt : extra.customStatusExpiresAt;
      updateCustomStatus = true;
    }
  } else if (opts && typeof opts === 'object') {
    status = opts.status;
    customStatusText = opts.customStatusText !== undefined ? opts.customStatusText : opts.text;
    customStatusEmoji = opts.customStatusEmoji !== undefined ? opts.customStatusEmoji : opts.emoji;
    customStatusExpiresAt = opts.customStatusExpiresAt !== undefined ? opts.customStatusExpiresAt : opts.expiresAt;
    updateCustomStatus = Boolean(opts.updateCustomStatus || opts.text !== undefined || opts.customStatusText !== undefined);
  }

  const validStatuses = ['online', 'idle', 'dnd', 'invisible'];
  const cleanStatus = (status && validStatuses.includes(status)) ? status : null;

  if (cleanStatus && updateCustomStatus) {
    const cleanText = customStatusText !== undefined ? String(customStatusText || '').trim().slice(0, 128) : '';
    const cleanEmoji = customStatusEmoji !== undefined ? String(customStatusEmoji || '').trim().slice(0, 16) : '';
    const cleanExpires = customStatusExpiresAt ? new Date(customStatusExpiresAt).toISOString() : null;
    db.prepare(`
      UPDATE users
      SET status = ?,
          custom_status_text = ?,
          custom_status_emoji = ?,
          custom_status_expires_at = ?
      WHERE id = ?
    `).run(cleanStatus, cleanText, cleanEmoji, cleanExpires, uId);
  } else if (cleanStatus) {
    db.prepare(`
      UPDATE users
      SET status = ?
      WHERE id = ?
    `).run(cleanStatus, uId);
  } else if (updateCustomStatus) {
    const cleanText = customStatusText !== undefined ? String(customStatusText || '').trim().slice(0, 128) : '';
    const cleanEmoji = customStatusEmoji !== undefined ? String(customStatusEmoji || '').trim().slice(0, 16) : '';
    const cleanExpires = customStatusExpiresAt ? new Date(customStatusExpiresAt).toISOString() : null;
    db.prepare(`
      UPDATE users
      SET custom_status_text = ?,
          custom_status_emoji = ?,
          custom_status_expires_at = ?
      WHERE id = ?
    `).run(cleanText, cleanEmoji, cleanExpires, uId);
  }

  return getUserById(uId);
}

function clearUserCustomStatus(userId) {
  const uId = Number(userId);
  db.prepare(`
    UPDATE users
    SET custom_status_text = '',
        custom_status_emoji = '',
        custom_status_expires_at = NULL
    WHERE id = ?
  `).run(uId);
  return getUserById(uId);
}

function clearExpiredCustomStatuses() {
  try {
    const now = new Date().toISOString();
    const rows = db.prepare(`
      SELECT id FROM users
      WHERE custom_status_expires_at IS NOT NULL AND custom_status_expires_at <= ?
    `).all(now);
    if (rows.length > 0) {
      db.prepare(`
        UPDATE users
        SET custom_status_text = '',
            custom_status_emoji = '',
            custom_status_expires_at = NULL
        WHERE custom_status_expires_at IS NOT NULL AND custom_status_expires_at <= ?
      `).run(now);
      return rows.map(r => r.id);
    }
  } catch (err) {
    console.error('Error clearing expired custom statuses:', err);
  }
  return [];
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
  getUserServers,
  getServerById,
  getServerByName,
  getServerByJoinCode,
  isServerMember,
  canAccessServer,
  createServer,
  joinServerByCode,
  regenerateServerJoinCode,
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
  getMutualFriends,
  getMutualServers,
  getServerMembers,
  saveMessage,
  getRecentMessages,
  getStorageStats,
  formatBytes,
  getAllUsersForAdmin,
  deleteUserAccount,
  createFeedback,
  getFeedbackById,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  hasUserSubmittedFeedback,
  createNotification,
  getNotificationById,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  updateUserStatus,
  clearUserCustomStatus,
  clearExpiredCustomStatuses,
  // Version 5e-server settings exports
  PERMISSION_FLAGS,
  ALL_PERMISSIONS,
  updateServer,
  deleteServer,
  leaveServer,
  updateChannel,
  getServerRoles,
  getRoleById,
  ensureDefaultServerRoles,
  createRole,
  updateRole,
  deleteRole,
  getMemberRoles,
  assignMemberRole,
  removeMemberRole,
  computeUserPermissions,
  hasPermission,
  getHighestRolePosition,
  timeoutMember,
  removeTimeout,
  isMemberTimedOut,
  banMember,
  unbanMember,
  isUserBanned,
  getServerBans,
  warnMember,
  logServerAudit,
  getServerAuditLogs,
  // Stickers & Custom Emojis
  getStickers,
  getStickerById,
  createSticker,
  deleteSticker,
  getCustomEmojis,
  createCustomEmoji,
  deleteCustomEmoji,
  // Message Upgrades: Edit, Delete, Pin, Report
  getMessageById,
  getDirectMessageById,
  editMessage,
  deleteMessage,
  togglePinMessage,
  getPinnedMessages,
  createMessageReport,
  getMessageReportById,
  getAllMessageReports,
  updateMessageReportStatus
};

