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

try {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
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
  '.ico': 'image/x-icon'
};

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

        const user = db.authenticateUser(username, password);
        if (!user) {
          return sendJson(res, 401, { error: 'Invalid username or password.' });
        }

        const token = db.createSession(user.id);
        return sendJson(res, 200, { success: true, token, user });
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
          broadcastAll({
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
          broadcastAll({
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
          broadcastAll({
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
          broadcastAll({
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
      // GET /api/friends
      if (req.method === 'GET' && pathname === '/api/friends') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user) {
          return sendJson(res, 401, { error: 'Not authenticated' });
        }
        const data = db.getFriendships(user.id);
        return sendJson(res, 200, { success: true, ...data });
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
          }

          if (result.autoAccepted && result.friend?.id) {
            broadcastToUsers([result.friend.id], {
              type: 'friend_request_accepted',
              friendId: user.id,
              friendUsername: user.username,
              friendDisplayName: user.displayName
            });
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

        const { displayName, avatarBase64, avatarFilename, removeAvatar } = await readJsonBody(req);
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
          avatarUrl: newAvatarUrl
        });

        broadcastAll({
          type: 'profile_updated',
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            displayName: updatedUser.displayName,
            avatarUrl: updatedUser.avatarUrl,
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

        return sendJson(res, 200, {
          success: true,
          user: {
            id: targetUser.id,
            username: targetUser.username,
            displayName: targetUser.displayName,
            avatarUrl: targetUser.avatarUrl,
            isDeveloper: targetUser.isDeveloper
          }
        });
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
    res.writeHead(200, { 'Content-Type': contentType });
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

function broadcastToChannel(channelId, payload) {
  const messageStr = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.currentChannelId === channelId) {
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
  const initialServerId = Number(urlObj.searchParams.get('serverId')) || 1;
  const initialChannelId = Number(urlObj.searchParams.get('channelId')) || 1;

  ws.currentServerId = initialServerId;
  ws.currentChannelId = initialChannelId;

  console.log(`[Voiceline] @${user.username} connected`);

  // Send message history for the active channel
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

  ws.on('message', (raw) => {
    try {
      const parsed = JSON.parse(raw.toString());

      // Switch active channel
      if (parsed.type === 'join_channel') {
        const targetServerId = Number(parsed.serverId) || 1;
        const targetChannelId = Number(parsed.channelId) || 1;
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
        if (!content) return;

        const serverId = ws.currentServerId || 1;
        const channelId = ws.currentChannelId || 1;

        const savedMessage = db.saveMessage({
          serverId: serverId,
          channelId: channelId,
          authorId: ws.user.id,
          authorName: ws.user.displayName,
          authorUsername: ws.user.username,
          isDeveloper: ws.user.isDeveloper,
          content: content
        });

        broadcastToChannel(channelId, {
          type: 'chat',
          serverId: serverId,
          channelId: channelId,
          data: savedMessage
        });
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
        if (!friendId || !content) return;

        const savedMessage = db.saveDirectMessage({
          senderId: ws.user.id,
          receiverId: friendId,
          content: content
        });

        broadcastToUsers([ws.user.id, friendId], {
          type: 'direct_message',
          senderId: ws.user.id,
          receiverId: friendId,
          data: savedMessage
        });
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
