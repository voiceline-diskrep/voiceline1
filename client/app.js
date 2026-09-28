// DOM Elements - Auth
const authOverlay = document.getElementById('authOverlay');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabSignupBtn = document.getElementById('tabSignupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const signupDisplayName = document.getElementById('signupDisplayName');
const signupUsername = document.getElementById('signupUsername');
const signupPassword = document.getElementById('signupPassword');
const signupIsDev = document.getElementById('signupIsDev');
const devPasswordGroup = document.getElementById('devPasswordGroup');
const signupDevPassword = document.getElementById('signupDevPassword');
const signupError = document.getElementById('signupError');
const suggestionBox = document.getElementById('suggestionBox');
const useSuggestionBtn = document.getElementById('useSuggestionBtn');

// DOM Elements - Header & User Capsule
const connectionStatus = document.getElementById('connectionStatus');
const statusDot = connectionStatus.querySelector('.status-dot');
const statusText = connectionStatus.querySelector('.status-text');
const developerPanel = document.getElementById('developerPanel');
const shutdownServerBtn = document.getElementById('shutdownServerBtn');
const currentUserAvatar = document.getElementById('currentUserAvatar');
const currentUserName = document.getElementById('currentUserName');
const currentUserHandle = document.getElementById('currentUserHandle');
const currentUserDevBadge = document.getElementById('currentUserDevBadge');
const logoutBtn = document.getElementById('logoutBtn');

// DOM Elements - Chat & Modals
const messagesContainer = document.getElementById('messagesContainer');
const messagesList = document.getElementById('messagesList');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const shutdownNoticeOverlay = document.getElementById('shutdownNoticeOverlay');
const shutdownNoticeMessage = document.getElementById('shutdownNoticeMessage');

// State
let currentUser = null;
let token = localStorage.getItem('voiceline_token');
let socket = null;
let reconnectTimer = null;
let isIntentionalDisconnect = false;

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
  div.textContent = str || '';
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

// ==========================================
// AUTH TABS & CONTROLS
// ==========================================
tabLoginBtn.addEventListener('click', () => {
  tabLoginBtn.classList.add('active');
  tabSignupBtn.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  loginError.textContent = '';
});

tabSignupBtn.addEventListener('click', () => {
  tabSignupBtn.classList.add('active');
  tabLoginBtn.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  signupError.textContent = '';
  suggestionBox.classList.add('hidden');
});

signupIsDev.addEventListener('change', () => {
  if (signupIsDev.checked) {
    devPasswordGroup.classList.remove('hidden');
    signupDevPassword.setAttribute('required', 'true');
  } else {
    devPasswordGroup.classList.add('hidden');
    signupDevPassword.removeAttribute('required');
    signupDevPassword.value = '';
  }
});

useSuggestionBtn.addEventListener('click', () => {
  signupUsername.value = useSuggestionBtn.textContent;
  suggestionBox.classList.add('hidden');
  signupUsername.focus();
});

// ==========================================
// AUTH SUBMISSIONS
// ==========================================
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  signupError.textContent = '';
  suggestionBox.classList.add('hidden');

  const payload = {
    displayName: signupDisplayName.value.trim(),
    username: signupUsername.value.trim(),
    password: signupPassword.value,
    isDeveloper: signupIsDev.checked,
    devPassword: signupDevPassword.value
  };

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409 && data.suggestion) {
        useSuggestionBtn.textContent = data.suggestion;
        suggestionBox.classList.remove('hidden');
      }
      signupError.textContent = data.error || 'Registration failed.';
      return;
    }

    loginSuccess(data.token, data.user);
  } catch (err) {
    signupError.textContent = 'Could not reach server. Is it running?';
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const payload = {
    username: loginUsername.value.trim(),
    password: loginPassword.value
  };

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.error || 'Login failed.';
      return;
    }

    loginSuccess(data.token, data.user);
  } catch (err) {
    loginError.textContent = 'Could not reach server. Is it running?';
  }
});

function loginSuccess(newToken, user) {
  token = newToken;
  currentUser = user;
  localStorage.setItem('voiceline_token', token);

  authOverlay.classList.add('hidden');
  applyUserProfile(user);
  connectWebSocket();
}

function applyUserProfile(user) {
  currentUserName.textContent = user.displayName;
  currentUserHandle.textContent = `@${user.username}`;
  currentUserAvatar.textContent = (user.displayName || user.username).charAt(0).toUpperCase();
  currentUserAvatar.style.backgroundColor = getAvatarColor(user.username);

  if (user.isDeveloper) {
    currentUserDevBadge.classList.remove('hidden');
    developerPanel.classList.remove('hidden');
  } else {
    currentUserDevBadge.classList.add('hidden');
    developerPanel.classList.add('hidden');
  }
}

// Log Out
logoutBtn.addEventListener('click', async () => {
  if (token) {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch {}
  }

  isIntentionalDisconnect = true;
  localStorage.removeItem('voiceline_token');
  token = null;
  currentUser = null;

  if (socket) {
    socket.close();
  }

  authOverlay.classList.remove('hidden');
  tabLoginBtn.click();
});

// Check existing session on boot
async function checkCurrentSession() {
  if (!token) {
    authOverlay.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      authOverlay.classList.add('hidden');
      applyUserProfile(currentUser);
      connectWebSocket();
    } else {
      localStorage.removeItem('voiceline_token');
      token = null;
      authOverlay.classList.remove('hidden');
    }
  } catch {
    authOverlay.classList.remove('hidden');
  }
}

// ==========================================
// DEVELOPER CONTROLS
// ==========================================
shutdownServerBtn.addEventListener('click', async () => {
  const confirmShutdown = confirm(
    'Are you sure you want to turn off the server?\n\nThis will disconnect all users and save everything to SQLite.'
  );

  if (!confirmShutdown) return;

  try {
    const res = await fetch('/api/server/shutdown', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const data = await res.json();
      alert('Error: ' + (data.error || 'Failed to shut down server.'));
    }
  } catch (err) {
    console.error('Shutdown request sent.');
  }
});

// ==========================================
// WEBSOCKET & LIVE CHAT
// ==========================================
function setStatus(state, text) {
  connectionStatus.className = 'status-indicator ' + state;
  statusText.textContent = text;
}

function connectWebSocket() {
  if (!token) return;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/?token=${encodeURIComponent(token)}`;

  setStatus('connecting', 'Connecting...');
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    setStatus('connected', 'Connected');
    isIntentionalDisconnect = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === 'history') {
        messagesList.innerHTML = '';
        if (Array.isArray(msg.data)) {
          msg.data.forEach(m => appendMessage(m, false));
          scrollToBottom();
        }
      } else if (msg.type === 'chat') {
        appendMessage(msg.data, true);
      } else if (msg.type === 'system_shutdown') {
        isIntentionalDisconnect = true;
        if (msg.message) {
          shutdownNoticeMessage.textContent = msg.message;
        }
        shutdownNoticeOverlay.classList.remove('hidden');
        setStatus('disconnected', 'Server Stopped');
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  };

  socket.onclose = (e) => {
    setStatus('disconnected', 'Disconnected');
    if (!isIntentionalDisconnect && token) {
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(connectWebSocket, 2000);
      }
    }
  };

  socket.onerror = () => {
    setStatus('disconnected', 'Connection Error');
  };
}

function appendMessage(msg, shouldScroll = true) {
  const authorName = msg.authorName || 'Anonymous';
  const authorUsername = msg.authorUsername ? `@${msg.authorUsername}` : '';
  const initial = authorName.charAt(0).toUpperCase();
  const color = getAvatarColor(msg.authorUsername || authorName);
  const timeFormatted = formatTime(msg.timestamp);
  const devBadgeHtml = msg.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';

  const item = document.createElement('div');
  item.className = 'message-item';
  item.innerHTML = `
    <div class="message-avatar" style="background-color: ${color}">${escapeHtml(initial)}</div>
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author">${escapeHtml(authorName)}</span>
        ${devBadgeHtml}
        <span class="message-username">${escapeHtml(authorUsername)}</span>
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

// Sending chat messages
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();

  if (!content) return;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    alert('Not connected to the chat server. Please ensure the server is running.');
    return;
  }

  socket.send(JSON.stringify({
    type: 'chat',
    content: content
  }));

  messageInput.value = '';
  messageInput.focus();
});

// Boot check
checkCurrentSession();
