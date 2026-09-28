// Elements
const statusIndicator = document.getElementById('connectionStatus');
const statusDot = statusIndicator.querySelector('.status-dot');
const statusText = statusIndicator.querySelector('.status-text');
const messagesContainer = document.getElementById('messagesContainer');
const messagesList = document.getElementById('messagesList');
const chatForm = document.getElementById('chatForm');
const nicknameInput = document.getElementById('nicknameInput');
const messageInput = document.getElementById('messageInput');

// Avatar colors palette
const AVATAR_COLORS = [
  '#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245',
  '#3ba55d', '#00aff4', '#faa81a', '#9b59b6', '#1abc9c'
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatTime(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Persist Nickname
const savedNickname = localStorage.getItem('voiceline_nickname');
if (savedNickname) {
  nicknameInput.value = savedNickname;
}

nicknameInput.addEventListener('input', () => {
  const name = nicknameInput.value.trim() || 'Russell';
  localStorage.setItem('voiceline_nickname', name);
});

// Render a single message
function appendMessage(msg, shouldScroll = true) {
  const author = msg.author || 'Anonymous';
  const initial = author.charAt(0).toUpperCase();
  const color = getAvatarColor(author);
  const timeFormatted = formatTime(msg.timestamp);

  const item = document.createElement('div');
  item.className = 'message-item';
  item.innerHTML = `
    <div class="message-avatar" style="background-color: ${color}">${escapeHtml(initial)}</div>
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author">${escapeHtml(author)}</span>
        <span class="message-time">${escapeHtml(timeFormatted)}</span>
      </div>
      <div class="message-text">${escapeHtml(msg.content)}</div>
    </div>
  `;

  messagesList.appendChild(item);

  if (shouldScroll) {
    scrollToBottom();
  }
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// WebSocket Connection Management
let socket = null;
let reconnectTimer = null;

function setStatus(state, text) {
  statusIndicator.className = 'status-indicator ' + state;
  statusText.textContent = text;
}

function connect() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;

  setStatus('connecting', 'Connecting...');
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    setStatus('connected', 'Connected');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === 'history') {
        messagesList.innerHTML = '';
        if (Array.isArray(message.data)) {
          message.data.forEach(msg => appendMessage(msg, false));
          scrollToBottom();
        }
      } else if (message.type === 'chat') {
        appendMessage(message.data, true);
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  };

  socket.onclose = () => {
    setStatus('disconnected', 'Disconnected');
    // Try to reconnect every 2 seconds
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(connect, 2000);
    }
  };

  socket.onerror = () => {
    setStatus('disconnected', 'Connection Error');
    socket.close();
  };
}

// Sending messages
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  const author = nicknameInput.value.trim() || 'Russell';

  if (!content) return;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    alert('Not connected to the Voiceline server. Please ensure the server is running.');
    return;
  }

  socket.send(JSON.stringify({
    type: 'chat',
    author: author,
    content: content
  }));

  messageInput.value = '';
  messageInput.focus();
});

// Initial connection
connect();
messageInput.focus();
