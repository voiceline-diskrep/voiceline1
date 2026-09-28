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

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to parse JSON body
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
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function getTokenFromReq(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

// 1. Create HTTP Server & REST API
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    try {
      // POST /api/signup
      if (req.method === 'POST' && pathname === '/api/signup') {
        const { username, displayName, password, isDeveloper, devPassword } = await readJsonBody(req);

        // Check developer credentials if requested
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

      // POST /api/server/shutdown (Developer only)
      if (req.method === 'POST' && pathname === '/api/server/shutdown') {
        const token = getTokenFromReq(req);
        const user = db.getUserByToken(token);
        if (!user || !user.isDeveloper) {
          return sendJson(res, 403, { error: 'Only developer accounts can shut down the server.' });
        }

        console.log(`[Voiceline] Shutdown initiated by developer @${user.username}`);
        sendJson(res, 200, { success: true, message: 'Server shutdown initiated.' });

        // Broadcast shutdown alert to all connected users
        broadcast({
          type: 'system_shutdown',
          message: 'The server is being stopped by the developer. All messages are safely saved.'
        });

        // Shutdown cleanly after short delay
        setTimeout(stopServerGracefully, 1000);
        return;
      }

      return sendJson(res, 404, { error: 'API endpoint not found' });
    } catch (apiErr) {
      console.error('[Voiceline API Error]', apiErr);
      return sendJson(res, 500, { error: apiErr.message || 'Server error' });
    }
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

// 2. WebSocket Server
const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const messageStr = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  }
}

wss.on('connection', (ws, req) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const token = urlObj.searchParams.get('token');
  const user = db.getUserByToken(token);

  if (!user) {
    // Unauthenticated connection
    ws.send(JSON.stringify({ type: 'auth_required', message: 'Please log in to participate in chat.' }));
    ws.close(4001, 'Unauthorized');
    return;
  }

  ws.user = user;
  console.log(`[Voiceline] @${user.username} (${user.displayName}) connected. Dev: ${user.isDeveloper}`);

  // Send message history
  try {
    const history = db.getRecentMessages(50);
    ws.send(JSON.stringify({ type: 'history', data: history }));
  } catch (err) {
    console.error('[Voiceline] Error fetching history:', err);
  }

  ws.on('message', (raw) => {
    try {
      const parsed = JSON.parse(raw.toString());

      if (parsed.type === 'chat') {
        const content = (parsed.content || '').trim();
        if (!content) return;

        // Save message to SQLite
        const savedMessage = db.saveMessage({
          authorId: ws.user.id,
          authorName: ws.user.displayName,
          authorUsername: ws.user.username,
          isDeveloper: ws.user.isDeveloper,
          content: content
        });

        // Broadcast to everyone
        broadcast({ type: 'chat', data: savedMessage });
      } else if (parsed.type === 'server_shutdown') {
        if (!ws.user.isDeveloper) {
          ws.send(JSON.stringify({ type: 'error', message: 'Forbidden' }));
          return;
        }
        console.log(`[Voiceline] Shutdown initiated via WebSocket by @${ws.user.username}`);
        broadcast({
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
