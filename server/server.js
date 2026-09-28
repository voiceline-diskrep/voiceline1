const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');
const db = require('./db');

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '..', 'client');

// Content-type lookup for serving static files
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

// 1. Create HTTP server to serve the frontend client
const server = http.createServer((req, res) => {
  // Normalize the URL path
  let safePath = path.normalize(req.url.split('?')[0]);
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(CLIENT_DIR, safePath);

  // Security check: prevent directory traversal outside client folder
  if (!filePath.startsWith(CLIENT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access denied');
    return;
  }

  // Check if file exists
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

// 2. Set up WebSocket server on top of HTTP server
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
  const clientIp = req.socket.remoteAddress;
  console.log(`[Voiceline] New connection from ${clientIp} (Total active: ${wss.clients.size})`);

  // Immediately send the most recent message history to the newly connected user
  try {
    const history = db.getRecentMessages(50);
    ws.send(JSON.stringify({ type: 'history', data: history }));
  } catch (err) {
    console.error('[Voiceline] Failed to fetch message history:', err);
  }

  // Listen for incoming messages from this client
  ws.on('message', (raw) => {
    try {
      const parsed = JSON.parse(raw.toString());

      if (parsed.type === 'chat') {
        const author = (parsed.author || 'Anonymous').trim();
        const content = (parsed.content || '').trim();

        if (!content) return; // Do not save or broadcast blank messages

        // Save to SQLite
        const savedMessage = db.saveMessage(author, content);

        // Broadcast to all connected users (including the sender)
        broadcast({ type: 'chat', data: savedMessage });
      }
    } catch (err) {
      console.error('[Voiceline] Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`[Voiceline] Connection closed (Total active: ${wss.clients.size})`);
  });

  ws.on('error', (err) => {
    console.error('[Voiceline] Client error:', err.message);
  });
});

// 3. Start the server
server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`  Voiceline server is running!`);
  console.log(`  Open in your browser: http://localhost:${PORT}`);
  console.log(`  Press Ctrl + C to stop the server.`);
  console.log('====================================================');
});

// 4. Graceful shutdown
function shutdown() {
  console.log('\n[Voiceline] Shutting down gracefully...');
  wss.close(() => {
    server.close(() => {
      console.log('[Voiceline] Server stopped cleanly. Goodbye!');
      process.exit(0);
    });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
