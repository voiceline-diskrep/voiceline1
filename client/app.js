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

// DOM Elements - Server Rail & Modals
const serverList = document.getElementById('serverList');
const openCreateServerBtn = document.getElementById('openCreateServerBtn');
const createServerModalOverlay = document.getElementById('createServerModalOverlay');
const createServerForm = document.getElementById('createServerForm');
const serverNameInput = document.getElementById('serverNameInput');
const createServerError = document.getElementById('createServerError');
const cancelCreateServerBtn = document.getElementById('cancelCreateServerBtn');

// DOM Elements - Channel Sidebar & Modals
const currentServerTitle = document.getElementById('currentServerTitle');
const channelList = document.getElementById('channelList');
const openCreateChannelBtn = document.getElementById('openCreateChannelBtn');
const createChannelModalOverlay = document.getElementById('createChannelModalOverlay');
const createChannelForm = document.getElementById('createChannelForm');
const channelNameInput = document.getElementById('channelNameInput');
const createChannelError = document.getElementById('createChannelError');
const cancelCreateChannelBtn = document.getElementById('cancelCreateChannelBtn');

// DOM Elements - Header & User Capsule
const activeChannelName = document.getElementById('activeChannelName');
const activeChannelDesc = document.getElementById('activeChannelDesc');
const connectionStatus = document.getElementById('connectionStatus');
const developerPanel = document.getElementById('developerPanel');
const shutdownServerBtn = document.getElementById('shutdownServerBtn');
const currentUserAvatar = document.getElementById('currentUserAvatar');
const currentUserName = document.getElementById('currentUserName');
const currentUserHandle = document.getElementById('currentUserHandle');
const currentUserDevBadge = document.getElementById('currentUserDevBadge');
const logoutBtn = document.getElementById('logoutBtn');

// DOM Elements - Chat & Notifications
const messagesContainer = document.getElementById('messagesContainer');
const messagesList = document.getElementById('messagesList');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeDesc = document.getElementById('welcomeDesc');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const shutdownNoticeOverlay = document.getElementById('shutdownNoticeOverlay');
const shutdownNoticeMessage = document.getElementById('shutdownNoticeMessage');

// State
let currentUser = null;
let token = localStorage.getItem('voiceline_token');
let servers = [];
let channels = [];
let activeServerId = 1;
let activeChannelId = 1;
let socket = null;
let reconnectTimer = null;
let isIntentionalDisconnect = false;

// Avatar Palette
const PALETTE = [
  '#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245',
  '#3ba55d', '#00aff4', '#faa81a', '#9b59b6', '#1abc9c'
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
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

function getServerInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ==========================================
// AUTH TABS & SUBMISSIONS
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
  loadServers().then(() => {
    connectWebSocket();
  });
}

function applyUserProfile(user) {
  currentUserName.textContent = user.displayName;
  currentUserHandle.textContent = `@${user.username}`;
  currentUserAvatar.textContent = (user.displayName || user.username).charAt(0).toUpperCase();
  currentUserAvatar.style.backgroundColor = getColor(user.username);

  if (user.isDeveloper) {
    currentUserDevBadge.classList.remove('hidden');
    developerPanel.classList.remove('hidden');
    openCreateServerBtn.classList.remove('hidden');
    openCreateChannelBtn.classList.remove('hidden');
  } else {
    currentUserDevBadge.classList.add('hidden');
    developerPanel.classList.add('hidden');
    openCreateServerBtn.classList.add('hidden');
    openCreateChannelBtn.classList.add('hidden');
  }
}

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

// Check session on boot
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
      await loadServers();
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
// SERVERS & CHANNELS
// ==========================================
async function loadServers() {
  if (!token) return;

  try {
    const res = await fetch('/api/servers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      servers = data.servers || [];
      renderServerList();

      if (!servers.some(s => s.id === activeServerId) && servers.length > 0) {
        await selectServer(servers[0].id);
      } else {
        await selectServer(activeServerId);
      }
    }
  } catch (err) {
    console.error('Failed to load servers:', err);
  }
}

function renderServerList() {
  serverList.innerHTML = '';

  servers.forEach(server => {
    const item = document.createElement('div');
    item.className = 'server-item' + (server.id === activeServerId ? ' active' : '');
    item.setAttribute('data-id', server.id);
    item.title = server.name;

    const initials = getServerInitials(server.name);
    item.innerHTML = `
      <div class="server-pill"></div>
      <button type="button" class="server-icon" aria-label="${escapeHtml(server.name)}">${escapeHtml(initials)}</button>
    `;

    item.addEventListener('click', () => {
      selectServer(server.id);
    });

    serverList.appendChild(item);
  });
}

async function selectServer(serverId) {
  activeServerId = Number(serverId);

  // Update active state in server rail
  document.querySelectorAll('.server-item').forEach(el => {
    el.classList.toggle('active', Number(el.getAttribute('data-id')) === activeServerId);
  });

  const curServer = servers.find(s => s.id === activeServerId) || { name: 'Voiceline' };
  currentServerTitle.textContent = curServer.name;

  await loadChannels(activeServerId);
}

async function loadChannels(serverId) {
  if (!token) return;

  try {
    const res = await fetch(`/api/servers/${serverId}/channels`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      channels = data.channels || [];
      renderChannelList();

      if (!channels.some(c => c.id === activeChannelId) && channels.length > 0) {
        selectChannel(channels[0].id);
      } else if (channels.length > 0) {
        selectChannel(activeChannelId);
      }
    }
  } catch (err) {
    console.error('Failed to load channels:', err);
  }
}

function renderChannelList() {
  channelList.innerHTML = '';

  channels.forEach(ch => {
    const item = document.createElement('div');
    item.className = 'channel-item' + (ch.id === activeChannelId ? ' active' : '');
    item.setAttribute('data-id', ch.id);

    const deleteBtnHtml = (currentUser && currentUser.isDeveloper && channels.length > 1) 
      ? `<button type="button" class="channel-delete-btn" title="Delete Channel" aria-label="Delete">?</button>` 
      : '';

    item.innerHTML = `
      <div class="channel-item-left">
        <span class="channel-hash-icon">#</span>
        <span class="channel-item-name">${escapeHtml(ch.name)}</span>
      </div>
      ${deleteBtnHtml}
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.channel-delete-btn')) {
        e.stopPropagation();
        handleDeleteChannel(ch.id, ch.name);
        return;
      }
      selectChannel(ch.id);
    });

    channelList.appendChild(item);
  });
}

function selectChannel(channelId) {
  activeChannelId = Number(channelId);

  // Update active state in channels sidebar
  document.querySelectorAll('.channel-item').forEach(el => {
    el.classList.toggle('active', Number(el.getAttribute('data-id')) === activeChannelId);
  });

  const curServer = servers.find(s => s.id === activeServerId) || { name: 'Server' };
  const curChannel = channels.find(c => c.id === activeChannelId) || { name: 'general' };

  activeChannelName.textContent = curChannel.name;
  activeChannelDesc.textContent = `in ${curServer.name}`;
  welcomeTitle.textContent = `Welcome to #${curChannel.name}!`;
  welcomeDesc.textContent = `This is the start of the #${curChannel.name} channel in ${curServer.name}. Messages here are saved safely in SQLite.`;
  messageInput.placeholder = `Message #${curChannel.name}... (Press Enter to send)`;
  messageInput.focus();

  // Clear messages list while waiting for channel history
  messagesList.innerHTML = '';

  // Inform WebSocket to tune into this channel
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'join_channel',
      serverId: activeServerId,
      channelId: activeChannelId
    }));
  }
}

// Developer Create Server Modal
openCreateServerBtn.addEventListener('click', () => {
  createServerModalOverlay.classList.remove('hidden');
  serverNameInput.value = '';
  createServerError.textContent = '';
  serverNameInput.focus();
});

cancelCreateServerBtn.addEventListener('click', () => {
  createServerModalOverlay.classList.add('hidden');
});

createServerModalOverlay.addEventListener('click', (e) => {
  if (e.target === createServerModalOverlay) {
    createServerModalOverlay.classList.add('hidden');
  }
});

createServerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  createServerError.textContent = '';
  const name = serverNameInput.value.trim();

  if (!name) return;

  try {
    const res = await fetch('/api/servers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    if (!res.ok) {
      createServerError.textContent = data.error || 'Failed to create server.';
      return;
    }

    createServerModalOverlay.classList.add('hidden');
    await loadServers();
    selectServer(data.server.id);
  } catch (err) {
    createServerError.textContent = 'Could not contact server.';
  }
});

// Developer Create Channel Modal
openCreateChannelBtn.addEventListener('click', () => {
  createChannelModalOverlay.classList.remove('hidden');
  channelNameInput.value = '';
  createChannelError.textContent = '';
  channelNameInput.focus();
});

cancelCreateChannelBtn.addEventListener('click', () => {
  createChannelModalOverlay.classList.add('hidden');
});

createChannelModalOverlay.addEventListener('click', (e) => {
  if (e.target === createChannelModalOverlay) {
    createChannelModalOverlay.classList.add('hidden');
  }
});

createChannelForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  createChannelError.textContent = '';
  const name = channelNameInput.value.trim();

  if (!name) return;

  try {
    const res = await fetch(`/api/servers/${activeServerId}/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    if (!res.ok) {
      createChannelError.textContent = data.error || 'Failed to create channel.';
      return;
    }

    createChannelModalOverlay.classList.add('hidden');
    await loadChannels(activeServerId);
    selectChannel(data.channel.id);
  } catch (err) {
    createChannelError.textContent = 'Could not contact server.';
  }
});

// Developer Delete Channel
async function handleDeleteChannel(channelId, channelName) {
  const confirmDelete = confirm(`Are you sure you want to delete #${channelName}?\n\nAll messages in this channel will be permanently removed.`);
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/servers/${activeServerId}/channels/${channelId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to delete channel.');
      return;
    }

    await loadChannels(activeServerId);
  } catch (err) {
    alert('Failed to delete channel.');
  }
}

// Developer Server Shutdown
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
  const statusText = connectionStatus.querySelector('.status-text');
  if (statusText) statusText.textContent = text;
}

function connectWebSocket() {
  if (!token) return;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/?token=${encodeURIComponent(token)}&serverId=${activeServerId}&channelId=${activeChannelId}`;

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
        if (msg.channelId === activeChannelId) {
          messagesList.innerHTML = '';
          if (Array.isArray(msg.data)) {
            msg.data.forEach(m => appendMessage(m, false));
            scrollToBottom();
          }
        }
      } else if (msg.type === 'chat') {
        if (msg.channelId === activeChannelId) {
          appendMessage(msg.data, true);
        }
      } else if (msg.type === 'server_created') {
        loadServers();
      } else if (msg.type === 'channel_created') {
        if (msg.serverId === activeServerId) {
          loadChannels(activeServerId);
        }
      } else if (msg.type === 'channel_deleted') {
        if (msg.serverId === activeServerId) {
          loadChannels(activeServerId);
        }
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

  socket.onclose = () => {
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
  const color = getColor(msg.authorUsername || authorName);
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
