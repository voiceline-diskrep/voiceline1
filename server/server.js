const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');
const db = require('./db');

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;
const DEV_PASSWORD = process.env.DEV_PASSWORD || 'admin123';
const CLIENT_DIR = path.join(__dirname, '..', 'client');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');
const ATTACHMENTS_DIR = path.join(UPLOADS_DIR, 'attachments');

try {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
  fs.mkdirSync(path.join(ATTACHMENTS_DIR, 'servers'), { recursive: true });
  fs.mkdirSync(path.join(ATTACHMENTS_DIR, 'dms'), { recursive: true });
} catch {}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function isImageMime(mime, filename) {
  if (mime && mime.startsWith('image/')) return true;
  const ext = path.extname(filename || '').toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.ico'].includes(ext);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
  });
  res.end(JSON.stringify(data));
}

function getTokenFromReq(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

// 1. HTTP Server & REST API
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  if (pathname.startsWith('/api/')) {
    try {
      // POST /api/upload (Stream file upload up to 100MB)
      if (req.method === 'POST' && pathname === '/api/upload') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const MAX_BYTES = 100 * 1024 * 1024; // 100MB limit
        const contentLength = Number(req.headers['content-length']);
        if (contentLength && contentLength > MAX_BYTES) {
          return sendJson(res, 413, { error: 'File size exceeds maximum allowed limit of 100MB.' });
        }

        const serverId = req.headers['x-server-id'] ? Number(req.headers['x-server-id']) : null;
        const channelId = req.headers['x-channel-id'] ? Number(req.headers['x-channel-id']) : null;
        const dmFriendId = req.headers['x-dm-friend-id'] ? Number(req.headers['x-dm-friend-id']) : null;

        let targetDir = '';
        let urlPrefix = '';

        if (serverId && channelId) {
          if (!db.canAccessServer(user, serverId)) {
            return sendJson(res, 403, { error: 'You are not a member of this server.' });
          }
          const channel = db.getChannelById(channelId);
          if (!channel || channel.serverId !== serverId) {
            return sendJson(res, 404, { error: 'Channel not found in this server.' });
          }
          targetDir = path.join(ATTACHMENTS_DIR, 'servers', `server_${serverId}`, `channel_${channelId}`);
          urlPrefix = `/uploads/attachments/servers/server_${serverId}/channel_${channelId}`;
        } else if (dmFriendId) {
          const friend = db.getUserById(dmFriendId);
          if (!friend) {
            return sendJson(res, 404, { error: 'User not found.' });
          }
          targetDir = path.join(ATTACHMENTS_DIR, 'dms');
          urlPrefix = `/uploads/attachments/dms`;
        } else {
          return sendJson(res, 400, { error: 'Missing destination (server/channel or DM friend).' });
        }

        try {
          fs.mkdirSync(targetDir, { recursive: true });
        } catch {}

        let rawFileName = req.headers['x-file-name'] || 'attachment';
        try {
          rawFileName = decodeURIComponent(rawFileName);
        } catch {}
        const safeBaseName = path.basename(rawFileName).replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniquePrefix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const diskFileName = `${uniquePrefix}_${safeBaseName}`;
        const filePath = path.join(targetDir, diskFileName);

        const writeStream = fs.createWriteStream(filePath);
        let bytesWritten = 0;
        let isAborted = false;

        req.on('data', chunk => {
          if (isAborted) return;
          bytesWritten += chunk.length;
          if (bytesWritten > MAX_BYTES) {
            isAborted = true;
            req.destroy();
            writeStream.destroy();
            try {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch {}
            if (!res.headersSent) {
              sendJson(res, 413, { error: 'File size exceeds maximum allowed limit of 100MB.' });
            }
          }
        });

        req.on('error', err => {
          if (isAborted) return;
          isAborted = true;
          writeStream.destroy();
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch {}
          if (!res.headersSent) {
            sendJson(res, 500, { error: 'Upload failed: ' + err.message });
          }
        });

        writeStream.on('finish', () => {
          if (isAborted) return;
          const mimeType = req.headers['content-type'] || 'application/octet-stream';
          const fileData = {
            url: `${urlPrefix}/${diskFileName}`,
            name: rawFileName,
            size: bytesWritten,
            type: mimeType
          };
          return sendJson(res, 200, { success: true, file: fileData });
        });

        writeStream.on('error', err => {
          if (isAborted) return;
          isAborted = true;
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch {}
          if (!res.headersSent) {
            sendJson(res, 500, { error: 'File save failed: ' + err.message });
          }
        });

        req.pipe(writeStream);
        return;
      }

      // POST /api/signup
      if (req.method === 'POST' && pathname === '/api/signup') {
        const { username, displayName, password, isDeveloper, devPassword } = await readJsonBody(req);

        if (isDeveloper) {
          if (!devPassword || devPassword !== DEV_PASSWORD) {
            return sendJson(res, 403, { 
              error: 'Invalid developer password. Please verify the developer password in your .env file.' 
            });
          }
        }

        try {
          const user = db.createUser({
            username,
            displayName,
            password,
            isDeveloper: Boolean(isDeveloper)
          });
          const token = db.createSession(user.id);
          return sendJson(res, 200, { success: true, token, user });
        } catch (err) {
          if (err.code === 'USERNAME_TAKEN') {
            return sendJson(res, 409, { error: err.message, suggestion: err.suggestion });
          }
          return sendJson(res, 400, { error: err.message });
        }
      }

      // POST /api/login
      if (req.method === 'POST' && pathname === '/api/login') {
        const { username, password } = await readJsonBody(req);
        if (!username || !password) {
          return sendJson(res, 400, { error: 'Please enter both username and password.' });
        }

        try {
          const user = db.authenticateUser(username, password);
          if (!user) {
            return sendJson(res, 401, { error: 'Invalid username or password.' });
          }

          const token = db.createSession(user.id);
          return sendJson(res, 200, { success: true, token, user });
        } catch (err) {
          if (err.code === 'ACCOUNT_DELETED') {
            return sendJson(res, 403, { error: err.message });
          }
          return sendJson(res, 400, { error: err.message });
        }
      }

      // GET /api/me
      if (req.method === 'GET' && pathname === '/api/me') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }
        return sendJson(res, 200, { user });
      }

      // POST /api/logout
      if (req.method === 'POST' && pathname === '/api/logout') {
        const token = getTokenFromReq(req);
        if (token) db.deleteSession(token);
        return sendJson(res, 200, { success: true });
      }

      // GET /api/servers (List user servers, or all servers if developer)
      if (req.method === 'GET' && pathname === '/api/servers') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }
        const servers = db.getUserServers(user.id, user.isDeveloper);
        return sendJson(res, 200, { servers });
      }

      // POST /api/servers (Create new server - Developer only)
      if (req.method === 'POST' && pathname === '/api/servers') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can create new servers.' });
        }

        const { name } = await readJsonBody(req);
        try {
          const newServer = db.createServer({ name, createdBy: user.id });
          broadcastToDevelopers({
            type: 'server_created',
            server: { id: newServer.id, name: newServer.name }
          });
          return sendJson(res, 200, { success: true, server: newServer });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // POST /api/servers/join (Join a server via 6-character code)
      if (req.method === 'POST' && pathname === '/api/servers/join') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { code } = await readJsonBody(req);
        try {
          const result = db.joinServerByCode({ userId: user.id, code });
          return sendJson(res, 200, { success: true, ...result });
        } catch (err) {
          const status = err.message.includes('No server found') ? 404 : 400;
          return sendJson(res, status, { error: err.message });
        }
      }

      // POST /api/servers/:serverId/regen-code (Regenerate server join code - Developer only)
      const regenCodeMatch = pathname.match(/^\/api\/servers\/(\d+)\/regen-code$/);
      if (req.method === 'POST' && regenCodeMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can regenerate server join codes.' });
        }

        const serverId = Number(regenCodeMatch[1]);
        try {
          const result = db.regenerateServerJoinCode(serverId);
          broadcastToDevelopers({
            type: 'server_code_updated',
            serverId: result.serverId,
            joinCode: result.joinCode
          });
          return sendJson(res, 200, { success: true, ...result });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // GET /api/servers/:serverId/channels (List channels in server)
      const channelsMatch = pathname.match(/^\/api\/servers\/(\d+)\/channels$/);
      if (req.method === 'GET' && channelsMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }
        const serverId = Number(channelsMatch[1]);
        if (!db.canAccessServer(user, serverId)) {
          return sendJson(res, 403, { error: 'You are not a member of this server.' });
        }
        const channels = db.getChannelsByServerId(serverId);
        return sendJson(res, 200, { channels });
      }

      // POST /api/servers/:serverId/channels (Create channel - Developer only)
      if (req.method === 'POST' && channelsMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can create channels.' });
        }

        const serverId = Number(channelsMatch[1]);
        const { name } = await readJsonBody(req);
        try {
          const channel = db.createChannel({ serverId, name });
          broadcastToServer(serverId, {
            type: 'channel_created',
            serverId: serverId,
            channel: channel
          });
          return sendJson(res, 200, { success: true, channel });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // DELETE /api/servers/:serverId/channels/:channelId (Delete channel - Developer only)
      const deleteChannelMatch = pathname.match(/^\/api\/servers\/(\d+)\/channels\/(\d+)$/);
      if (req.method === 'DELETE' && deleteChannelMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can delete channels.' });
        }

        const serverId = Number(deleteChannelMatch[1]);
        const channelId = Number(deleteChannelMatch[2]);
        try {
          db.deleteChannel({ serverId, channelId });
          broadcastToServer(serverId, {
            type: 'channel_deleted',
            serverId: serverId,
            channelId: channelId
          });
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // ==========================================
      // FRIEND SYSTEM API ROUTES
      // ==========================================
      // ==========================================
      // GET /api/friends
      if (req.method === 'GET' && pathname === '/api/friends') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }
        const data = db.getFriendships(user.id);
        const friendsWithPres = data.friends.map(f => {
          const pres = getUserPublicPresence(f.id);
          return {
            ...f,
            status: pres.status,
            customStatus: pres.customStatus
          };
        });
        return sendJson(res, 200, {
          success: true,
          friends: friendsWithPres,
          pendingIncoming: data.pendingIncoming,
          pendingOutgoing: data.pendingOutgoing
        });
      }

      // POST /api/friends/request
      if (req.method === 'POST' && pathname === '/api/friends/request') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { username } = await readJsonBody(req);
        try {
          const result = db.sendFriendRequest(user.id, username);
          const notifyIds = [user.id];
          if (result.targetId) notifyIds.push(result.targetId);
          if (result.friend?.id) notifyIds.push(result.friend.id);

          broadcastToUsers(notifyIds, { type: 'friends_updated' });

          if (result.targetId) {
            broadcastToUsers([result.targetId], {
              type: 'friend_request_notification',
              fromId: user.id,
              fromUsername: user.username,
              fromDisplayName: user.displayName
            });
            try {
              const notif = db.createNotification({
                userId: result.targetId,
                type: 'friend_request',
                title: `Friend request from ${user.displayName || user.username}`,
                body: `@${user.username} sent you a friend request.`,
                priority: 'yellow',
                data: { senderId: user.id, senderUsername: user.username, senderDisplayName: user.displayName, senderAvatarUrl: user.avatarUrl }
              });
              broadcastToUsers([result.targetId], {
                type: 'notification_created',
                notification: notif
              });
            } catch (notifErr) { console.error('Error creating friend request notification:', notifErr); }
          }

          if (result.autoAccepted && result.friend?.id) {
            broadcastToUsers([result.friend.id], {
              type: 'friend_request_accepted',
              friendId: user.id,
              friendUsername: user.username,
              friendDisplayName: user.displayName
            });
            try {
              const notif = db.createNotification({
                userId: result.friend.id,
                type: 'friend_accepted',
                title: 'Friend Request Accepted',
                body: `${user.displayName || user.username} accepted your friend request.`,
                priority: 'green',
                data: { friendId: user.id, friendUsername: user.username, friendDisplayName: user.displayName, friendAvatarUrl: user.avatarUrl }
              });
              broadcastToUsers([result.friend.id], {
                type: 'notification_created',
                notification: notif
              });
            } catch (notifErr) { console.error('Error creating friend accepted notification:', notifErr); }
          }

          return sendJson(res, 200, { success: true, ...result });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // POST /api/friends/respond
      if (req.method === 'POST' && pathname === '/api/friends/respond') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { friendshipId, action } = await readJsonBody(req);
        try {
          const result = db.respondToFriendRequest(user.id, friendshipId, action);
          broadcastToUsers([user.id, result.senderId], { type: 'friends_updated' });

          if (action === 'accept') {
            broadcastToUsers([result.senderId], {
              type: 'friend_request_accepted',
              friendId: user.id,
              friendUsername: user.username,
              friendDisplayName: user.displayName
            });
            try {
              const notif = db.createNotification({
                userId: result.senderId,
                type: 'friend_accepted',
                title: 'Friend Request Accepted',
                body: `${user.displayName || user.username} accepted your friend request.`,
                priority: 'green',
                data: { friendId: user.id, friendUsername: user.username, friendDisplayName: user.displayName, friendAvatarUrl: user.avatarUrl }
              });
              broadcastToUsers([result.senderId], {
                type: 'notification_created',
                notification: notif
              });
            } catch (notifErr) { console.error('Error creating friend accepted notification:', notifErr); }
          }

          return sendJson(res, 200, { success: true, ...result });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // GET /api/dm/:friendId (Fetch direct message history)
      const dmMatch = pathname.match(/^\/api\/dm\/(\d+)$/);
      if (req.method === 'GET' && dmMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const friendId = Number(dmMatch[1]);
        const friendUser = db.getUserById(friendId);
        if (!friendUser) {
          return sendJson(res, 404, { error: 'User not found' });
        }

        const messages = db.getDirectMessagesHistory(user.id, friendId, 50);
        return sendJson(res, 200, {
          success: true,
          friend: {
            id: friendUser.id,
            username: friendUser.username,
            displayName: friendUser.display_name,
            isDeveloper: Boolean(friendUser.is_developer)
          },
          messages
        });
      }

      // DELETE /api/friends/:friendUserId
      const deleteFriendMatch = pathname.match(/^\/api\/friends\/(\d+)$/);
      if (req.method === 'DELETE' && deleteFriendMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const friendUserId = Number(deleteFriendMatch[1]);
        db.removeFriend(user.id, friendUserId);
        broadcastToUsers([user.id, friendUserId], { type: 'friends_updated' });
        return sendJson(res, 200, { success: true });
      }

      // POST /api/profile (Update display name and avatar)
      if (req.method === 'POST' && pathname === '/api/profile') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { displayName, avatarBase64, avatarFilename, removeAvatar, bio } = await readJsonBody(req);
        const cleanDisplay = (displayName || '').trim();
        if (!cleanDisplay || cleanDisplay.length > 32) {
          return sendJson(res, 400, { error: 'Display name must be between 1 and 32 characters.' });
        }

        let newAvatarUrl = user.avatarUrl || null;

        if (removeAvatar) {
          if (user.avatarUrl && user.avatarUrl.startsWith('/uploads/avatars/')) {
            const oldFile = path.join(UPLOADS_DIR, user.avatarUrl.replace(/^\/uploads\//, ''));
            try { if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile); } catch {}
          }
          newAvatarUrl = null;
        } else if (avatarBase64) {
          const matches = avatarBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          const mimeType = matches ? matches[1].toLowerCase() : '';
          const rawData = matches ? matches[2] : avatarBase64;

          const extFromName = (avatarFilename || '').split('.').pop().toLowerCase();
          let ext = 'png';
          if (mimeType.includes('jpeg') || mimeType.includes('jpg') || extFromName === 'jpg' || extFromName === 'jpeg') {
            ext = 'jpg';
          } else if (mimeType.includes('webp') || extFromName === 'webp') {
            ext = 'webp';
          } else if (mimeType.includes('gif') || extFromName === 'gif') {
            ext = 'gif';
          } else if (mimeType.includes('png') || extFromName === 'png') {
            ext = 'png';
          } else {
            return sendJson(res, 400, { error: 'Invalid image format. Supported formats: PNG, JPEG, WebP, GIF.' });
          }

          const buffer = Buffer.from(rawData, 'base64');
          if (buffer.length > 2 * 1024 * 1024) {
            return sendJson(res, 400, { error: 'Image file too large. Maximum size is 2 MB.' });
          }

          if (user.avatarUrl && user.avatarUrl.startsWith('/uploads/avatars/')) {
            const oldFile = path.join(UPLOADS_DIR, user.avatarUrl.replace(/^\/uploads\//, ''));
            try { if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile); } catch {}
          }

          const newFilename = `avatar_${user.id}_${Date.now()}.${ext}`;
          const newFilePath = path.join(AVATARS_DIR, newFilename);
          fs.writeFileSync(newFilePath, buffer);
          newAvatarUrl = `/uploads/avatars/${newFilename}`;
        }

        const updatedUser = db.updateUserProfile({
          userId: user.id,
          displayName: cleanDisplay,
          avatarUrl: newAvatarUrl,
          bio: bio !== undefined ? bio : (user.bio || '')
        });

        broadcastAll({
          type: 'profile_updated',
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            displayName: updatedUser.displayName,
            avatarUrl: updatedUser.avatarUrl,
            bio: updatedUser.bio,
            isDeveloper: updatedUser.isDeveloper
          }
        });

        return sendJson(res, 200, { success: true, user: updatedUser });
      }

      // GET /api/users/:userId (Public profile info)
      const userProfileMatch = pathname.match(/^\/api\/users\/(\d+)$/);
      if (req.method === 'GET' && userProfileMatch) {
        const token = getTokenFromReq(req);
        const authUser = db.getUserByToken(token);
        if (!authUser) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const targetId = Number(userProfileMatch[1]);
        const targetUser = db.getUserById(targetId);
        if (!targetUser) {
          return sendJson(res, 404, { error: 'User not found' });
        }

        const mutualFriends = db.getMutualFriends(authUser.id, targetId);
        const mutualServers = db.getMutualServers(authUser.id, targetId);

        const pres = getUserPublicPresence(targetId);

        return sendJson(res, 200, {
          success: true,
          user: {
            id: targetUser.id,
            username: targetUser.username,
            displayName: targetUser.displayName,
            avatarUrl: targetUser.avatarUrl,
            bio: targetUser.bio || '',
            isDeveloper: targetUser.isDeveloper,
            status: pres.status,
            customStatus: pres.customStatus
          },
          mutualFriends,
          mutualServers
        });
      }

      // GET /api/developer/accounts (List all registered accounts - Developer only)
      if (req.method === 'GET' && pathname === '/api/developer/accounts') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can view registered accounts.' });
        }

        const accounts = db.getAllUsersForAdmin();
        return sendJson(res, 200, { success: true, accounts });
      }

      // DELETE /api/developer/accounts/:userId (Remove registered account - Developer only)
      const deleteAccountMatch = pathname.match(/^\/api\/developer\/accounts\/(\d+)$/);
      if (req.method === 'DELETE' && deleteAccountMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can remove accounts.' });
        }

        const targetUserId = Number(deleteAccountMatch[1]);
        if (targetUserId === user.id) {
          return sendJson(res, 400, { error: 'You cannot remove your own developer account.' });
        }

        try {
          const result = db.deleteUserAccount({ userId: targetUserId, adminUserId: user.id });

          // Immediately disconnect that user if currently online
          for (const client of wss.clients) {
            if (client.readyState === WebSocket.OPEN && client.user && client.user.id === targetUserId) {
              try {
                client.send(JSON.stringify({
                  type: 'account_terminated',
                  message: 'Your account has been removed by the developer.'
                }));
              } catch {}
              client.close(4003, 'Account Removed');
            }
          }

          // Broadcast updates to all connected clients
          broadcastAll({ type: 'friends_updated' });
          broadcastAll({ type: 'user_removed', userId: targetUserId });

          return sendJson(res, 200, { success: true, ...result });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // GET /api/server/storage-stats (Developer only)
      if (req.method === 'GET' && pathname === '/api/server/storage-stats') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can view storage stats.' });
        }

        const stats = db.getStorageStats(UPLOADS_DIR);
        return sendJson(res, 200, { success: true, stats });
      }

      // POST /api/server/shutdown (Developer only)
      if (req.method === 'POST' && pathname === '/api/server/shutdown') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can shut down the server.' });
        }

        console.log(`[Voiceline] Shutdown initiated by developer @${user.username}`);
        sendJson(res, 200, { success: true, message: 'Server shutdown initiated.' });

        broadcastAll({
          type: 'system_shutdown',
          message: 'The server is being stopped by the developer. All messages are safely saved.'
        });

        setTimeout(stopServerGracefully, 1000);
        return;
      }

      // ==========================================
      // FEEDBACK & COMMUNITY FORUM API ENDPOINTS
      // ==========================================

      // GET /api/feedback (List all community feedback & check user submission status)
      if (req.method === 'GET' && pathname === '/api/feedback') {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        const feedbackList = db.getAllFeedback();
        const hasSubmitted = user ? db.hasUserSubmittedFeedback(user.id) : false;

        return sendJson(res, 200, {
          success: true,
          feedback: feedbackList,
          hasSubmitted
        });
      }

      // POST /api/feedback (Submit new community feedback)
      if (req.method === 'POST' && pathname === '/api/feedback') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'You must be logged in to submit feedback.' });
        }

        const { content } = await readJsonBody(req);
        const cleanContent = String(content || '').trim();
        if (!cleanContent) {
          return sendJson(res, 400, { error: 'Feedback message cannot be empty.' });
        }
        if (cleanContent.length > 2000) {
          return sendJson(res, 400, { error: 'Feedback message must be 2000 characters or fewer.' });
        }

        try {
          const newFeedback = db.createFeedback({
            userId: user.id,
            authorName: user.displayName,
            authorUsername: user.username,
            authorAvatarUrl: user.avatarUrl,
            content: cleanContent
          });

          broadcastAll({
            type: 'feedback_created',
            feedback: newFeedback
          });

          return sendJson(res, 200, {
            success: true,
            feedback: newFeedback,
            hasSubmitted: true
          });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // PATCH /api/feedback/:id/status (Developer only - Update feedback status and response)
      const feedbackStatusMatch = pathname.match(/^\/api\/feedback\/(\d+)\/status$/);
      if (req.method === 'PATCH' && feedbackStatusMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated.' });
        }
        if (!user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can change feedback status.' });
        }

        const feedbackId = Number(feedbackStatusMatch[1]);
        const { status, devResponse } = await readJsonBody(req);

        try {
          const updatedFeedback = db.updateFeedbackStatus({
            feedbackId,
            status,
            devResponse,
            devUserId: user.id
          });

          if (!updatedFeedback) {
            return sendJson(res, 404, { error: 'Feedback post not found.' });
          }

          broadcastAll({
            type: 'feedback_updated',
            feedback: updatedFeedback
          });

          if (updatedFeedback && updatedFeedback.userId && updatedFeedback.userId !== user.id) {
            const statusLabels = {
              accepted: 'Accepted 🎉',
              considering: 'Considering 🤔',
              denied: 'Closed / Denied ❌',
              accepted_already_exists: 'Already Exists ✨',
              already_exists: 'Already Exists ✨',
              pending: 'Under Review'
            };
            try {
              const notif = db.createNotification({
                userId: updatedFeedback.userId,
                type: 'feedback',
                title: `Feedback Status Updated: ${statusLabels[updatedFeedback.status] || updatedFeedback.status}`,
                body: `Your feedback #${updatedFeedback.id} status was updated to "${statusLabels[updatedFeedback.status] || updatedFeedback.status}".${updatedFeedback.devResponse ? ` Developer reply: ${updatedFeedback.devResponse}` : ''}`,
                priority: updatedFeedback.status === 'accepted' ? 'green' : 'yellow',
                data: { feedbackId: updatedFeedback.id, status: updatedFeedback.status }
              });
              broadcastToUsers([updatedFeedback.userId], {
                type: 'notification_created',
                notification: notif
              });
            } catch (notifErr) { console.error('Error creating feedback status notification:', notifErr); }
          }

          return sendJson(res, 200, {
            success: true,
            feedback: updatedFeedback
          });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // DELETE /api/feedback/:id (Developer only - Remove spam/inappropriate feedback)
      const deleteFeedbackMatch = pathname.match(/^\/api\/feedback\/(\d+)$/);
      if (req.method === 'DELETE' && deleteFeedbackMatch) {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated.' });
        }
        if (!user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can delete feedback.' });
        }

        const feedbackId = Number(deleteFeedbackMatch[1]);
        try {
          db.deleteFeedback({ feedbackId });

          broadcastAll({
            type: 'feedback_deleted',
            feedbackId
          });

          return sendJson(res, 200, {
            success: true,
            feedbackId
          });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      // ==========================================
      // USER STATUS & PRESENCE API ENDPOINTS (Stage 3d.6)
      // ==========================================

      // PATCH /api/status (Update status and/or custom status)
      if (req.method === 'PATCH' && pathname === '/api/status') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { status, customStatusText, customStatusEmoji, customStatusExpiresAt, updateCustomStatus } = await readJsonBody(req);
        userAutoIdle.delete(user.id);

        const updatedUser = db.updateUserStatus(user.id, {
          status,
          customStatusText,
          customStatusEmoji,
          customStatusExpiresAt,
          updateCustomStatus: Boolean(updateCustomStatus)
        });

        broadcastUserPresence(user.id);

        const presence = getUserPublicPresence(user.id);
        return sendJson(res, 200, {
          success: true,
          presence: {
            status: updatedUser.status || 'online',
            manualStatus: updatedUser.status || 'online',
            customStatus: presence.customStatus
          }
        });
      }

      // POST /api/status/custom (Set custom status with duration)
      if (req.method === 'POST' && pathname === '/api/status/custom') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { text, emoji, duration } = await readJsonBody(req);
        let expiresAt = null;

        if (duration === '30m') {
          expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        } else if (duration === '1h') {
          expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        } else if (duration === '4h') {
          expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
        } else if (duration === 'today') {
          const eod = new Date();
          eod.setHours(23, 59, 59, 999);
          expiresAt = eod.toISOString();
        } else if (typeof duration === 'number' && duration > 0) {
          expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();
        }

        const updatedUser = db.updateUserStatus(user.id, {
          customStatusText: text || '',
          customStatusEmoji: emoji || '',
          customStatusExpiresAt: expiresAt,
          updateCustomStatus: true
        });

        broadcastUserPresence(user.id);

        const presence = getUserPublicPresence(user.id);
        return sendJson(res, 200, {
          success: true,
          presence: {
            status: updatedUser.status || 'online',
            manualStatus: updatedUser.status || 'online',
            customStatus: presence.customStatus
          }
        });
      }

      // DELETE /api/status/custom (Clear custom status)
      if (req.method === 'DELETE' && pathname === '/api/status/custom') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const updatedUser = db.clearUserCustomStatus(user.id);
        broadcastUserPresence(user.id);

        return sendJson(res, 200, {
          success: true,
          presence: {
            status: updatedUser.status || 'online',
            manualStatus: updatedUser.status || 'online',
            customStatus: null
          }
        });
      }

      // POST /api/status/activity (Report user activity / reset auto-idle)
      if (req.method === 'POST' && pathname === '/api/status/activity') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        if (userAutoIdle.has(user.id)) {
          userAutoIdle.delete(user.id);
          broadcastUserPresence(user.id);
        }

        return sendJson(res, 200, { success: true });
      }

      // POST /api/status/idle (Report user inactive / enter auto-idle)
      if (req.method === 'POST' && pathname === '/api/status/idle') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        if (user.status === 'online' && !userAutoIdle.has(user.id)) {
          userAutoIdle.add(user.id);
          broadcastUserPresence(user.id);
        }

        return sendJson(res, 200, { success: true });
      }

      // ==========================================
      // NOTIFICATIONS API ENDPOINTS (Stage 3d.5)
      // ==========================================

      // GET /api/notifications (List notifications with optional filtering & pagination)
      if (req.method === 'GET' && pathname === '/api/notifications') {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const unreadOnly = urlObj.searchParams.get('unreadOnly') === 'true' || urlObj.searchParams.get('unreadOnly') === '1';
        const type = urlObj.searchParams.get('type') || null;
        const limit = Number(urlObj.searchParams.get('limit')) || 50;
        const offset = Number(urlObj.searchParams.get('offset')) || 0;

        const notifications = db.getUserNotifications(user.id, { unreadOnly, type, limit, offset });
        const unreadCount = db.getUnreadNotificationCount(user.id);

        return sendJson(res, 200, {
          success: true,
          notifications,
          unreadCount
        });
      }

      // PATCH /api/notifications/:id/read (Mark single notification as read)
      const readNotifMatch = pathname.match(/^\/api\/notifications\/(\d+)\/read$/);
      if (req.method === 'PATCH' && readNotifMatch) {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const notifId = Number(readNotifMatch[1]);
        const updated = db.markNotificationAsRead(notifId, user.id);
        const unreadCount = db.getUnreadNotificationCount(user.id);

        return sendJson(res, 200, {
          success: true,
          notification: updated,
          unreadCount
        });
      }

      // POST /api/notifications/mark-all-read (Mark all notifications as read)
      if (req.method === 'POST' && pathname === '/api/notifications/mark-all-read') {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        db.markAllNotificationsAsRead(user.id);
        return sendJson(res, 200, {
          success: true,
          unreadCount: 0
        });
      }

      // DELETE /api/notifications/:id (Delete single notification)
      const deleteNotifMatch = pathname.match(/^\/api\/notifications\/(\d+)$/);
      if (req.method === 'DELETE' && deleteNotifMatch) {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const notifId = Number(deleteNotifMatch[1]);
        db.deleteNotification(notifId, user.id);
        const unreadCount = db.getUnreadNotificationCount(user.id);

        return sendJson(res, 200, {
          success: true,
          id: notifId,
          unreadCount
        });
      }

      // DELETE /api/notifications (Clear all notifications for user)
      if (req.method === 'DELETE' && pathname === '/api/notifications') {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        db.clearAllNotifications(user.id);
        return sendJson(res, 200, {
          success: true,
          unreadCount: 0
        });
      }

      // POST /api/notifications (Create a custom notification)
      if (req.method === 'POST' && pathname === '/api/notifications') {
        const token = getTokenFromReq(req);
        const user = token ? db.getUserByToken(token) : null;
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }

        const { type, title, body, priority, data, targetUserId } = await readJsonBody(req);
        const recipientId = targetUserId ? Number(targetUserId) : user.id;

        const newNotif = db.createNotification({
          userId: recipientId,
          type: type || 'system',
          title: title || 'Notification',
          body: body || '',
          priority: priority || 'yellow',
          data: data || {}
        });

        broadcastToUsers([recipientId], {
          type: 'notification_created',
          notification: newNotif
        });

        return sendJson(res, 200, {
          success: true,
          notification: newNotif
        });
      }

      return sendJson(res, 404, { error: 'API endpoint not found' });
    } catch (apiErr) {
      console.error('[Voiceline API Error]', apiErr);
      return sendJson(res, 500, { error: apiErr.message || 'Server error' });
    }
  }

  // Static Uploads Serving
  if (pathname.startsWith('/uploads/')) {
    const relPath = path.normalize(pathname.replace(/^\/uploads\//, ''));
    const fullPath = path.join(UPLOADS_DIR, relPath);

    if (!fullPath.startsWith(UPLOADS_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied');
      return;
    }

    fs.stat(fullPath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }

      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      });
      fs.createReadStream(fullPath).pipe(res);
    });
    return;
  }

  // Static File Serving
  let safePath = path.normalize(pathname);
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(CLIENT_DIR, safePath);

  if (!filePath.startsWith(CLIENT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// 2. WebSockets & Channel Broadcasting
const wss = new WebSocketServer({ server });

function broadcastAll(payload) {
  const messageStr = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  }
}

function broadcastToChannel(channelId, serverId, payload) {
  const messageStr = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (
      client.readyState === WebSocket.OPEN &&
      client.user &&
      client.currentChannelId === channelId &&
      db.canAccessServer(client.user, serverId)
    ) {
      client.send(messageStr);
    }
  }
}

// Send only to accounts that can access the given server (members + developers)
function broadcastToServer(serverId, payload) {
  const messageStr = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.user && db.canAccessServer(client.user, serverId)) {
      client.send(messageStr);
    }
  }
}

function broadcastToDevelopers(payload) {
  const messageStr = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.user && client.user.isDeveloper) {
      client.send(messageStr);
    }
  }
}

function broadcastToUsers(userIds, payload) {
  const messageStr = JSON.stringify(payload);
  const targetSet = new Set(userIds.filter(Boolean).map(Number));
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.user && targetSet.has(client.user.id)) {
      client.send(messageStr);
    }
  }
}

// WebRTC 1-to-1 Voice Signaling
// Key: userId (Number) -> { callId: string, partnerId: number, role: 'caller'|'callee', status: 'ringing'|'connected' }
const activeVoiceCalls = new Map();

function getClientByUserId(userId) {
  const targetId = Number(userId);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.user && client.user.id === targetId) {
      return client;
    }
  }
  return null;
}

// Returns the channel if this account may use it inside the given server, otherwise null
function resolveAccessibleChannel(user, serverId, channelId) {
  const sId = Number(serverId);
  const cId = Number(channelId);
  if (!sId || !cId) return null;
  const channel = db.getChannelById(cId);
  if (!channel || Number(channel.serverId) !== sId) return null;
  if (!db.canAccessServer(user, sId)) return null;
  return channel;
}

// Stage 3d.6: Presence & User Status Tracking
const userSocketCounts = new Map();
const userAutoIdle = new Set();

function getUserPublicPresence(userId) {
  const uId = Number(userId);
  const u = db.getUserById(uId);
  if (!u) return { status: 'offline', customStatus: null };

  if (u.customStatusExpiresAt && new Date(u.customStatusExpiresAt).getTime() <= Date.now()) {
    db.clearUserCustomStatus(uId);
    u.customStatusText = '';
    u.customStatusEmoji = '';
    u.customStatusExpiresAt = null;
  }

  const isConnected = (userSocketCounts.get(uId) || 0) > 0;
  const manualStatus = u.status || 'online';

  let effectiveStatus = 'offline';
  if (isConnected) {
    if (manualStatus === 'invisible') {
      effectiveStatus = 'offline';
    } else if (userAutoIdle.has(uId) && manualStatus === 'online') {
      effectiveStatus = 'idle';
    } else {
      effectiveStatus = manualStatus;
    }
  }

  const customStatus = (u.customStatusText || u.customStatusEmoji) ? {
    text: u.customStatusText || '',
    emoji: u.customStatusEmoji || '',
    expiresAt: u.customStatusExpiresAt || null
  } : null;

  return {
    userId: uId,
    status: effectiveStatus,
    customStatus
  };
}

function broadcastUserPresence(userId) {
  const uId = Number(userId);
  const u = db.getUserById(uId);
  if (!u || !wss) return;

  const publicPresence = getUserPublicPresence(uId);

  const publicMsg = JSON.stringify({
    type: 'presence_updated',
    userId: uId,
    status: publicPresence.status,
    customStatus: publicPresence.customStatus
  });

  const selfMsg = JSON.stringify({
    type: 'presence_updated',
    userId: uId,
    status: u.status || 'online',
    manualStatus: u.status || 'online',
    customStatus: publicPresence.customStatus,
    isSelf: true
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.user) {
      if (client.user.id === uId) {
        client.send(selfMsg);
      } else {
        client.send(publicMsg);
      }
    }
  }
}

// Clear expired custom statuses periodically
setInterval(() => {
  try {
    const expiredIds = db.clearExpiredCustomStatuses();
    if (Array.isArray(expiredIds) && expiredIds.length > 0) {
      expiredIds.forEach(id => broadcastUserPresence(id));
    }
  } catch (err) {
    console.error('[Voiceline] Error checking expired custom statuses:', err);
  }
}, 30000);

wss.on('connection', (ws, req) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const token = urlObj.searchParams.get('token');
  const user = db.getUserByToken(token);

  if (!user) {
    ws.send(JSON.stringify({ type: 'auth_required', message: 'Please log in to participate in chat.' }));
    ws.close(4001, 'Unauthorized');
    return;
  }

  ws.user = user;
  ws.currentServerId = null;
  ws.currentChannelId = null;

  console.log(`[Voiceline] @${user.username} connected`);

  const currentCount = userSocketCounts.get(user.id) || 0;
  userSocketCounts.set(user.id, currentCount + 1);
  if (currentCount === 0) {
    broadcastUserPresence(user.id);
  }

  // Send connecting client its own presence state
  const selfPresence = getUserPublicPresence(user.id);
  ws.send(JSON.stringify({
    type: 'presence_updated',
    userId: user.id,
    status: user.status || 'online',
    manualStatus: user.status || 'online',
    customStatus: selfPresence.customStatus,
    isSelf: true
  }));

  // Only join + send history if this account is actually allowed in the requested channel
  const initialServerId = Number(urlObj.searchParams.get('serverId'));
  const initialChannelId = Number(urlObj.searchParams.get('channelId'));
  const initialChannel = resolveAccessibleChannel(user, initialServerId, initialChannelId);
  if (initialChannel) {
    ws.currentServerId = initialServerId;
    ws.currentChannelId = initialChannelId;
    try {
      const history = db.getRecentMessages(ws.currentChannelId, 50);
      ws.send(JSON.stringify({
        type: 'history',
        serverId: ws.currentServerId,
        channelId: ws.currentChannelId,
        data: history
      }));
    } catch (err) {
      console.error('[Voiceline] Error fetching history:', err);
    }
  }

  ws.on('message', (raw) => {
    try {
      const parsed = JSON.parse(raw.toString());

      // Stage 3d.6 User Status realtime events
      if (parsed.type === 'set_status') {
        const valid = ['online', 'idle', 'dnd', 'invisible'];
        if (valid.includes(parsed.status)) {
          userAutoIdle.delete(ws.user.id);
          db.updateUserStatus(ws.user.id, { status: parsed.status });
          ws.user.status = parsed.status;
          broadcastUserPresence(ws.user.id);
        }
        return;
      }

      if (parsed.type === 'set_custom_status') {
        db.updateUserStatus(ws.user.id, {
          customStatusText: parsed.text || '',
          customStatusEmoji: parsed.emoji || '',
          customStatusExpiresAt: parsed.expiresAt || null,
          updateCustomStatus: true
        });
        broadcastUserPresence(ws.user.id);
        return;
      }

      if (parsed.type === 'clear_custom_status') {
        db.clearUserCustomStatus(ws.user.id);
        broadcastUserPresence(ws.user.id);
        return;
      }

      if (parsed.type === 'user_active') {
        if (userAutoIdle.has(ws.user.id)) {
          userAutoIdle.delete(ws.user.id);
          broadcastUserPresence(ws.user.id);
        }
        return;
      }

      if (parsed.type === 'user_idle') {
        const u = db.getUserById(ws.user.id);
        if (u && (u.status || 'online') === 'online' && !userAutoIdle.has(ws.user.id)) {
          userAutoIdle.add(ws.user.id);
          broadcastUserPresence(ws.user.id);
        }
        return;
      }

      // Switch active channel
      if (parsed.type === 'join_channel') {
        const targetServerId = Number(parsed.serverId);
        const targetChannelId = Number(parsed.channelId);
        const channel = resolveAccessibleChannel(ws.user, targetServerId, targetChannelId);

        if (!channel) {
          ws.currentServerId = null;
          ws.currentChannelId = null;
          ws.send(JSON.stringify({
            type: 'channel_access_denied',
            serverId: targetServerId,
            channelId: targetChannelId,
            message: 'You do not have access to this channel.'
          }));
          return;
        }

        ws.currentServerId = targetServerId;
        ws.currentChannelId = targetChannelId;

        const history = db.getRecentMessages(targetChannelId, 50);
        ws.send(JSON.stringify({
          type: 'history',
          serverId: targetServerId,
          channelId: targetChannelId,
          data: history
        }));
        return;
      }

      // New chat message
      if (parsed.type === 'chat') {
        const content = (parsed.content || '').trim();
        const file = parsed.file && typeof parsed.file === 'object' ? parsed.file : null;
        if (!content && !file) return;

        const serverId = ws.currentServerId;
        const channelId = ws.currentChannelId;

        // Re-check on every send: membership may have changed since the channel was joined
        const channel = resolveAccessibleChannel(ws.user, serverId, channelId);
        if (!channel) {
          ws.currentServerId = null;
          ws.currentChannelId = null;
          ws.send(JSON.stringify({
            type: 'channel_access_denied',
            serverId,
            channelId,
            message: 'You cannot send messages here because you are not a member of this server.'
          }));
          return;
        }

        const savedMessage = db.saveMessage({
          serverId: serverId,
          channelId: channelId,
          authorId: ws.user.id,
          authorName: ws.user.displayName,
          authorUsername: ws.user.username,
          isDeveloper: ws.user.isDeveloper,
          content: content,
          fileUrl: file?.url || null,
          fileName: file?.name || null,
          fileSize: file?.size || null,
          fileType: file?.type || null
        });

        broadcastToChannel(channelId, serverId, {
          type: 'chat',
          serverId: serverId,
          channelId: channelId,
          data: savedMessage
        });

        // Mention notifications
        if (Array.isArray(parsed.mentions) && parsed.mentions.length > 0) {
          const srvObj = db.getServerById(serverId);
          const serverName = srvObj ? srvObj.name : 'Server';
          const chanName = channel ? channel.name : 'general';
          for (const m of parsed.mentions) {
            const uName = typeof m === 'string' ? m : (m && m.username);
            const prio = typeof m === 'object' && m.priority ? m.priority : (parsed.pingLevel || 'yellow');
            if (!uName) continue;
            try {
              const targetUser = db.getUserByUsername(uName);
              if (targetUser && targetUser.id !== ws.user.id) {
                const notif = db.createNotification({
                  userId: targetUser.id,
                  type: 'mention',
                  title: `@${ws.user.displayName || ws.user.username} mentioned you in #${chanName}`,
                  body: content ? content.slice(0, 250) : (file ? `Attached file: ${file.name}` : 'Mentioned you in chat'),
                  priority: prio,
                  data: {
                    serverId,
                    serverName,
                    channelId,
                    channelName: chanName,
                    messageId: savedMessage.id,
                    authorId: ws.user.id,
                    authorUsername: ws.user.username,
                    authorDisplayName: ws.user.displayName,
                    authorAvatarUrl: ws.user.avatarUrl
                  }
                });
                broadcastToUsers([targetUser.id], {
                  type: 'notification_created',
                  notification: notif
                });
              }
            } catch (notifErr) {
              console.error('Error creating mention notification:', notifErr);
            }
          }
        }
      } else if (parsed.type === 'join_dm') {
        const friendId = Number(parsed.friendId);
        ws.currentDmFriendId = friendId;
        const messages = db.getDirectMessagesHistory(ws.user.id, friendId, 50);
        ws.send(JSON.stringify({
          type: 'dm_history',
          friendId: friendId,
          data: messages
        }));
        return;
      } else if (parsed.type === 'direct_message') {
        const friendId = Number(parsed.friendId);
        const content = (parsed.content || '').trim();
        const file = parsed.file && typeof parsed.file === 'object' ? parsed.file : null;
        if (!friendId || (!content && !file)) return;

        const savedMessage = db.saveDirectMessage({
          senderId: ws.user.id,
          receiverId: friendId,
          content: content,
          fileUrl: file?.url || null,
          fileName: file?.name || null,
          fileSize: file?.size || null,
          fileType: file?.type || null
        });

        broadcastToUsers([ws.user.id, friendId], {
          type: 'direct_message',
          senderId: ws.user.id,
          receiverId: friendId,
          data: savedMessage
        });

        // DM notification for recipient
        if (friendId !== ws.user.id) {
          try {
            const notif = db.createNotification({
              userId: friendId,
              type: 'dm',
              title: `Direct message from ${ws.user.displayName || ws.user.username}`,
              body: content ? content.slice(0, 250) : (file ? `Sent attachment: ${file.name}` : 'New message'),
              priority: parsed.pingLevel === 'red' ? 'red' : 'yellow',
              data: {
                friendId: ws.user.id,
                friendUsername: ws.user.username,
                friendDisplayName: ws.user.displayName,
                friendAvatarUrl: ws.user.avatarUrl,
                messageId: savedMessage.id
              }
            });
            broadcastToUsers([friendId], {
              type: 'notification_created',
              notification: notif
            });
          } catch (notifErr) {
            console.error('Error creating DM notification:', notifErr);
          }
        }
        return;
      } else if (parsed.type === 'call_user') {
        const targetUserId = Number(parsed.targetUserId);
        if (!targetUserId || targetUserId === ws.user.id) {
          ws.send(JSON.stringify({ type: 'call_error', message: 'Invalid target user.' }));
          return;
        }

        if (activeVoiceCalls.has(ws.user.id)) {
          ws.send(JSON.stringify({ type: 'call_error', message: 'You are already in a voice call.' }));
          return;
        }

        const targetUser = db.getUserById(targetUserId);
        if (!targetUser || targetUser.isDeleted) {
          ws.send(JSON.stringify({ type: 'call_error', message: 'User not found or unavailable.' }));
          return;
        }

        const targetClient = getClientByUserId(targetUserId);
        if (!targetClient) {
          ws.send(JSON.stringify({ type: 'call_error', message: `@${targetUser.username} is currently offline.` }));
          return;
        }

        if (activeVoiceCalls.has(targetUserId)) {
          ws.send(JSON.stringify({ type: 'call_error', message: `@${targetUser.username} is currently busy on another call.` }));
          return;
        }

        const callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        activeVoiceCalls.set(ws.user.id, { callId, partnerId: targetUserId, role: 'caller', status: 'ringing' });
        activeVoiceCalls.set(targetUserId, { callId, partnerId: ws.user.id, role: 'callee', status: 'ringing' });

        targetClient.send(JSON.stringify({
          type: 'incoming_call',
          callId,
          caller: {
            id: ws.user.id,
            username: ws.user.username,
            displayName: ws.user.displayName,
            avatarUrl: ws.user.avatarUrl
          }
        }));

        try {
          const notif = db.createNotification({
            userId: targetUserId,
            type: 'call',
            title: `Incoming ${parsed.callType === 'video' ? 'Video' : 'Voice'} Call`,
            body: `${ws.user.displayName || ws.user.username} is calling you.`,
            priority: 'red',
            data: {
              callerId: ws.user.id,
              callerUsername: ws.user.username,
              callerDisplayName: ws.user.displayName,
              callerAvatarUrl: ws.user.avatarUrl,
              callId,
              callType: parsed.callType || 'voice'
            }
          });
          broadcastToUsers([targetUserId], {
            type: 'notification_created',
            notification: notif
          });
        } catch (notifErr) { console.error('Error creating call notification:', notifErr); }

        ws.send(JSON.stringify({
          type: 'call_outgoing',
          callId,
          target: {
            id: targetUser.id,
            username: targetUser.username,
            displayName: targetUser.displayName,
            avatarUrl: targetUser.avatarUrl
          }
        }));
        return;
      } else if (parsed.type === 'call_decline') {
        const active = activeVoiceCalls.get(ws.user.id);
        if (active) {
          const partnerClient = getClientByUserId(active.partnerId);
          if (partnerClient) {
            partnerClient.send(JSON.stringify({
              type: 'call_declined',
              callId: active.callId,
              message: `@${ws.user.username} declined the call.`
            }));
          }
          activeVoiceCalls.delete(ws.user.id);
          activeVoiceCalls.delete(active.partnerId);
        }
        return;
      } else if (parsed.type === 'call_accept') {
        const active = activeVoiceCalls.get(ws.user.id);
        if (active && active.callId === parsed.callId) {
          active.status = 'connected';
          const partnerActive = activeVoiceCalls.get(active.partnerId);
          if (partnerActive) partnerActive.status = 'connected';

          const partnerClient = getClientByUserId(active.partnerId);
          if (partnerClient) {
            partnerClient.send(JSON.stringify({
              type: 'call_accepted',
              callId: active.callId,
              partner: {
                id: ws.user.id,
                username: ws.user.username,
                displayName: ws.user.displayName,
                avatarUrl: ws.user.avatarUrl
              }
            }));
          }
          ws.send(JSON.stringify({
            type: 'call_connected',
            callId: active.callId
          }));
        }
        return;
      } else if (parsed.type === 'webrtc_offer') {
        const targetUserId = Number(parsed.targetUserId);
        const targetClient = getClientByUserId(targetUserId);
        if (targetClient) {
          targetClient.send(JSON.stringify({
            type: 'webrtc_offer',
            callId: parsed.callId,
            fromUserId: ws.user.id,
            sdp: parsed.sdp
          }));
        }
        return;
      } else if (parsed.type === 'webrtc_answer') {
        const targetUserId = Number(parsed.targetUserId);
        const targetClient = getClientByUserId(targetUserId);
        if (targetClient) {
          targetClient.send(JSON.stringify({
            type: 'webrtc_answer',
            callId: parsed.callId,
            fromUserId: ws.user.id,
            sdp: parsed.sdp
          }));
        }
        return;
      } else if (parsed.type === 'webrtc_ice_candidate') {
        const targetUserId = Number(parsed.targetUserId);
        const targetClient = getClientByUserId(targetUserId);
        if (targetClient) {
          targetClient.send(JSON.stringify({
            type: 'webrtc_ice_candidate',
            callId: parsed.callId,
            fromUserId: ws.user.id,
            candidate: parsed.candidate
          }));
        }
        return;
      } else if (parsed.type === 'video_state') {
        const targetUserId = Number(parsed.targetUserId);
        const targetClient = getClientByUserId(targetUserId);
        if (targetClient) {
          targetClient.send(JSON.stringify({
            type: 'video_state',
            callId: parsed.callId,
            fromUserId: ws.user.id,
            enabled: Boolean(parsed.enabled)
          }));
        }
        return;
      } else if (parsed.type === 'call_end') {
        const active = activeVoiceCalls.get(ws.user.id);
        if (active) {
          if (active.status === 'ringing' && active.role === 'caller') {
            try {
              const notif = db.createNotification({
                userId: active.partnerId,
                type: 'call',
                title: 'Missed Call',
                body: `Missed call from ${ws.user.displayName || ws.user.username}.`,
                priority: 'yellow',
                data: { callerId: ws.user.id, callerUsername: ws.user.username, callerDisplayName: ws.user.displayName, callerAvatarUrl: ws.user.avatarUrl }
              });
              broadcastToUsers([active.partnerId], {
                type: 'notification_created',
                notification: notif
              });
            } catch {}
          }

          const partnerClient = getClientByUserId(active.partnerId);
          if (partnerClient) {
            partnerClient.send(JSON.stringify({
              type: 'call_ended',
              callId: active.callId,
              reason: 'hangup'
            }));
          }
          ws.send(JSON.stringify({
            type: 'call_ended',
            callId: active.callId,
            reason: 'hangup'
          }));
          activeVoiceCalls.delete(ws.user.id);
          activeVoiceCalls.delete(active.partnerId);
        }
        return;
      } else if (parsed.type === 'server_shutdown') {
        if (!ws.user.isDeveloper) return;
        console.log(`[Voiceline] Shutdown initiated via WebSocket by @${ws.user.username}`);
        broadcastAll({
          type: 'system_shutdown',
          message: 'The server is being stopped by the developer. All messages are safely saved.'
        });
        setTimeout(stopServerGracefully, 1000);
      }
    } catch (err) {
      console.error('[Voiceline] Message error:', err);
    }
  });

  ws.on('close', () => {
    console.log(`[Voiceline] Connection closed for @${ws.user?.username || 'user'}`);
    if (ws.user) {
      const currentCount = (userSocketCounts.get(ws.user.id) || 1) - 1;
      if (currentCount <= 0) {
        userSocketCounts.delete(ws.user.id);
        userAutoIdle.delete(ws.user.id);
        broadcastUserPresence(ws.user.id);
      } else {
        userSocketCounts.set(ws.user.id, currentCount);
      }
    }

    if (ws.user && activeVoiceCalls.has(ws.user.id)) {
      const active = activeVoiceCalls.get(ws.user.id);
      const partnerClient = getClientByUserId(active.partnerId);
      if (partnerClient) {
        partnerClient.send(JSON.stringify({
          type: 'call_ended',
          callId: active.callId,
          reason: 'partner_disconnected'
        }));
      }
      activeVoiceCalls.delete(ws.user.id);
      activeVoiceCalls.delete(active.partnerId);
    }
  });
});

function stopServerGracefully() {
  console.log('\n[Voiceline] Saving all data and stopping server...');
  wss.close(() => {
    server.close(() => {
      console.log('[Voiceline] Server has stopped safely. Goodbye!');
      process.exit(0);
    });
  });
}

process.on('SIGINT', stopServerGracefully);
process.on('SIGTERM', stopServerGracefully);

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`  Voiceline server is running!`);
  console.log(`  Open in your browser: http://localhost:${PORT}`);
  console.log(`  Developer Password: Set in .env file`);
  console.log(`  Press Ctrl + C to stop the server.`);
  console.log('====================================================');
});
