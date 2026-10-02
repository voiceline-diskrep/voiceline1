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
const homeBtn = document.getElementById('homeBtn');
const serverList = document.getElementById('serverList');
const openCreateServerBtn = document.getElementById('openCreateServerBtn');
const createServerModalOverlay = document.getElementById('createServerModalOverlay');
const createServerForm = document.getElementById('createServerForm');
const serverNameInput = document.getElementById('serverNameInput');
const createServerError = document.getElementById('createServerError');
const cancelCreateServerBtn = document.getElementById('cancelCreateServerBtn');

// DOM Elements - Channel Sidebar & Modals
const channelSidebar = document.getElementById('channelSidebar');
const currentServerTitle = document.getElementById('currentServerTitle');
const channelList = document.getElementById('channelList');
const openCreateChannelBtn = document.getElementById('openCreateChannelBtn');
const createChannelModalOverlay = document.getElementById('createChannelModalOverlay');
const createChannelForm = document.getElementById('createChannelForm');
const channelNameInput = document.getElementById('channelNameInput');
const createChannelError = document.getElementById('createChannelError');
const cancelCreateChannelBtn = document.getElementById('cancelCreateChannelBtn');

// DOM Elements - Friends Sidebar & Views
const friendsSidebar = document.getElementById('friendsSidebar');
const friendsLayout = document.getElementById('friendsLayout');
const chatLayout = document.getElementById('chatLayout');

const friendsNavAllBtn = document.getElementById('friendsNavAllBtn');
const friendsNavPendingBtn = document.getElementById('friendsNavPendingBtn');
const friendsNavAddBtn = document.getElementById('friendsNavAddBtn');
const sidebarFriendsCount = document.getElementById('sidebarFriendsCount');
const sidebarPendingCount = document.getElementById('sidebarPendingCount');

const fTabAllBtn = document.getElementById('fTabAllBtn');
const fTabPendingBtn = document.getElementById('fTabPendingBtn');
const fTabAddBtn = document.getElementById('fTabAddBtn');

const viewAllFriends = document.getElementById('viewAllFriends');
const allFriendsList = document.getElementById('allFriendsList');
const allFriendsCountText = document.getElementById('allFriendsCountText');

const viewPendingFriends = document.getElementById('viewPendingFriends');
const pendingIncomingList = document.getElementById('pendingIncomingList');
const pendingOutgoingList = document.getElementById('pendingOutgoingList');
const pendingIncomingCountText = document.getElementById('pendingIncomingCountText');
const pendingOutgoingCountText = document.getElementById('pendingOutgoingCountText');

const viewAddFriend = document.getElementById('viewAddFriend');
const addFriendForm = document.getElementById('addFriendForm');
const addFriendInput = document.getElementById('addFriendInput');
const addFriendAlert = document.getElementById('addFriendAlert');

// DOM Elements - Header & User Capsules
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

const currentUserAvatar2 = document.getElementById('currentUserAvatar2');
const currentUserName2 = document.getElementById('currentUserName2');
const currentUserHandle2 = document.getElementById('currentUserHandle2');
const currentUserDevBadge2 = document.getElementById('currentUserDevBadge2');
const logoutBtn2 = document.getElementById('logoutBtn2');

// DOM Elements - Chat & Shutdown
const messagesContainer = document.getElementById('messagesContainer');
const messagesList = document.getElementById('messagesList');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeDesc = document.getElementById('welcomeDesc');
const chatForm = document.getElementById('chatForm');
const homePendingBadge = document.getElementById('homePendingBadge');
const dmSidebarList = document.getElementById('dmSidebarList');
const dmLayout = document.getElementById('dmLayout');
const dmActiveFriendName = document.getElementById('dmActiveFriendName');
const dmFriendDevBadge = document.getElementById('dmFriendDevBadge');
const dmActiveFriendUsername = document.getElementById('dmActiveFriendUsername');
const currentUserAvatar3 = document.getElementById('currentUserAvatar3');
const currentUserName3 = document.getElementById('currentUserName3');
const currentUserHandle3 = document.getElementById('currentUserHandle3');
const currentUserDevBadge3 = document.getElementById('currentUserDevBadge3');
const logoutBtn3 = document.getElementById('logoutBtn3');
const dmMessagesContainer = document.getElementById('dmMessagesContainer');
const dmWelcomeTitle = document.getElementById('dmWelcomeTitle');
const dmWelcomeDesc = document.getElementById('dmWelcomeDesc');
const dmMessagesList = document.getElementById('dmMessagesList');
const dmChatForm = document.getElementById('dmChatForm');
const dmMessageInput = document.getElementById('dmMessageInput');
const toastContainer = document.getElementById('toastContainer');
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
let currentView = 'server'; // 'server' or 'friends'
let currentFriendsTab = 'all'; // 'all', 'pending', 'add'
let friendsData = { friends: [], pendingIncoming: [], pendingOutgoing: [] };
let activeDmFriend = null;

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
    loadFriends();
  });
}

function showToast({ icon = '👋', title, body, actionText, onAction, duration = 6000 }) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';

  const actionBtnHtml = actionText ? `<button type="button" class="toast-action-btn">${escapeHtml(actionText)}</button>` : '';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-body">${escapeHtml(body)}</div>
    </div>
    ${actionBtnHtml}
    <button type="button" class="toast-close-btn" title="Dismiss">&times;</button>
  `;

  const removeToast = () => {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  };

  if (actionText && onAction) {
    const actionBtn = toast.querySelector('.toast-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        onAction();
        removeToast();
      });
    }
  }

  toast.querySelector('.toast-close-btn').addEventListener('click', removeToast);
  toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}

function applyUserProfile(user) {
  const dName = user.displayName;
  const handle = `@${user.username}`;
  const initial = (user.displayName || user.username).charAt(0).toUpperCase();
  const avatarColor = getColor(user.username);

  currentUserName.textContent = dName;
  currentUserHandle.textContent = handle;
  currentUserAvatar.textContent = initial;
  currentUserAvatar.style.backgroundColor = avatarColor;

  if (currentUserName2) {
    currentUserName2.textContent = dName;
    currentUserHandle2.textContent = handle;
    currentUserAvatar2.textContent = initial;
    currentUserAvatar2.style.backgroundColor = avatarColor;
  }

  if (currentUserName3) {
    currentUserName3.textContent = dName;
    currentUserHandle3.textContent = handle;
    currentUserAvatar3.textContent = initial;
    currentUserAvatar3.style.backgroundColor = avatarColor;
  }

  if (user.isDeveloper) {
    currentUserDevBadge.classList.remove('hidden');
    if (currentUserDevBadge2) currentUserDevBadge2.classList.remove('hidden');
    if (currentUserDevBadge3) currentUserDevBadge3.classList.remove('hidden');
    developerPanel.classList.remove('hidden');
    openCreateServerBtn.classList.remove('hidden');
    openCreateChannelBtn.classList.remove('hidden');
  } else {
    currentUserDevBadge.classList.add('hidden');
    if (currentUserDevBadge2) currentUserDevBadge2.classList.add('hidden');
    if (currentUserDevBadge3) currentUserDevBadge3.classList.add('hidden');
    developerPanel.classList.add('hidden');
    openCreateServerBtn.classList.add('hidden');
    openCreateChannelBtn.classList.add('hidden');
  }
}

function handleLogout() {
  if (token) {
    try {
      fetch('/api/logout', {
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
}

logoutBtn.addEventListener('click', handleLogout);
if (logoutBtn2) logoutBtn2.addEventListener('click', handleLogout);
if (logoutBtn3) logoutBtn3.addEventListener('click', handleLogout);

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
      await loadFriends();
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
// VIEW NAVIGATION (SERVERS vs FRIENDS)
// ==========================================
homeBtn.addEventListener('click', () => {
  switchToFriendsView();
});

function switchToFriendsView() {
  currentView = 'friends';
  activeDmFriend = null;

  // Highlight Home button, unhighlight servers
  homeBtn.classList.add('active');
  document.querySelectorAll('.server-item:not(#homeBtn)').forEach(el => el.classList.remove('active'));

  // Switch Sidebars
  channelSidebar.classList.add('hidden');
  friendsSidebar.classList.remove('hidden');

  // Switch Layouts
  chatLayout.classList.add('hidden');
  dmLayout.classList.add('hidden');
  friendsLayout.classList.remove('hidden');

  document.querySelectorAll('.dm-item').forEach(el => el.classList.remove('active'));

  switchFriendsTab(currentFriendsTab);
  loadFriends();
}

function switchToServerView(serverId) {
  currentView = 'server';
  activeDmFriend = null;

  homeBtn.classList.remove('active');
  friendsSidebar.classList.add('hidden');
  channelSidebar.classList.remove('hidden');

  friendsLayout.classList.add('hidden');
  dmLayout.classList.add('hidden');
  chatLayout.classList.remove('hidden');

  selectServer(serverId);
}

function switchToDmView(friend) {
  currentView = 'dm';
  activeDmFriend = friend;

  // Highlight Home button, unhighlight servers
  homeBtn.classList.add('active');
  document.querySelectorAll('.server-item:not(#homeBtn)').forEach(el => el.classList.remove('active'));

  // Keep friends sidebar visible so user can see DM list
  channelSidebar.classList.add('hidden');
  friendsSidebar.classList.remove('hidden');

  // Deactivate friends nav buttons
  friendsNavAllBtn.classList.remove('active');
  friendsNavPendingBtn.classList.remove('active');
  friendsNavAddBtn.classList.remove('active');

  // Layouts
  chatLayout.classList.add('hidden');
  friendsLayout.classList.add('hidden');
  dmLayout.classList.remove('hidden');

  // Update header & welcome
  dmActiveFriendName.textContent = friend.displayName || friend.username;
  dmActiveFriendUsername.textContent = '@' + friend.username;
  if (friend.isDeveloper) {
    dmFriendDevBadge.classList.remove('hidden');
  } else {
    dmFriendDevBadge.classList.add('hidden');
  }

  dmWelcomeTitle.textContent = friend.displayName || friend.username;
  dmWelcomeDesc.textContent = `This is the start of your direct message history with @${friend.username}.`;
  dmMessageInput.placeholder = `Message @${friend.username}... (Press Enter to send)`;

  // Update active item in sidebar
  document.querySelectorAll('.dm-item').forEach(el => {
    el.classList.toggle('active', Number(el.getAttribute('data-id')) === friend.id);
  });

  dmMessagesList.innerHTML = '';
  loadDmHistory(friend.id);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'join_dm',
      friendId: friend.id
    }));
  }

  dmMessageInput.focus();
}

async function loadDmHistory(friendId) {
  if (!token) return;
  try {
    const res = await fetch(`/api/dm/${friendId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      dmMessagesList.innerHTML = '';
      if (Array.isArray(data.messages)) {
        data.messages.forEach(m => appendDmMessage(m, false));
        scrollDmToBottom();
      }
    }
  } catch (err) {
    console.error('Failed to load DM history:', err);
  }
}

// ==========================================
// FRIENDS SYSTEM
// ==========================================
function switchFriendsTab(tab) {
  currentFriendsTab = tab;

  // Sidebar buttons
  friendsNavAllBtn.classList.toggle('active', tab === 'all');
  friendsNavPendingBtn.classList.toggle('active', tab === 'pending');
  friendsNavAddBtn.classList.toggle('active', tab === 'add');

  // Header tab buttons
  fTabAllBtn.classList.toggle('active', tab === 'all');
  fTabPendingBtn.classList.toggle('active', tab === 'pending');
  fTabAddBtn.classList.toggle('active', tab === 'add');

  // Sections
  viewAllFriends.classList.toggle('hidden', tab !== 'all');
  viewPendingFriends.classList.toggle('hidden', tab !== 'pending');
  viewAddFriend.classList.toggle('hidden', tab !== 'add');

  if (tab === 'add') {
    addFriendInput.focus();
    addFriendAlert.classList.add('hidden');
  }
}

friendsNavAllBtn.addEventListener('click', () => switchFriendsTab('all'));
friendsNavPendingBtn.addEventListener('click', () => switchFriendsTab('pending'));
friendsNavAddBtn.addEventListener('click', () => switchFriendsTab('add'));

fTabAllBtn.addEventListener('click', () => switchFriendsTab('all'));
fTabPendingBtn.addEventListener('click', () => switchFriendsTab('pending'));
fTabAddBtn.addEventListener('click', () => switchFriendsTab('add'));

async function loadFriends() {
  if (!token) return;

  try {
    const res = await fetch('/api/friends', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      friendsData = {
        friends: data.friends || [],
        pendingIncoming: data.pendingIncoming || [],
        pendingOutgoing: data.pendingOutgoing || []
      };
      renderFriendsUI();
    }
  } catch (err) {
    console.error('Failed to load friends:', err);
  }
}

function renderFriendsUI() {
  const { friends, pendingIncoming, pendingOutgoing } = friendsData;

  // Counts
  sidebarFriendsCount.textContent = friends.length;
  allFriendsCountText.textContent = friends.length;

  const totalPending = pendingIncoming.length;
  sidebarPendingCount.textContent = totalPending;
  sidebarPendingCount.classList.toggle('hidden', totalPending === 0);

  if (homePendingBadge) {
    homePendingBadge.textContent = totalPending;
    homePendingBadge.classList.toggle('hidden', totalPending === 0);
  }

  pendingIncomingCountText.textContent = pendingIncoming.length;
  pendingOutgoingCountText.textContent = pendingOutgoing.length;

  // Render Direct Messages Sidebar
  if (dmSidebarList) {
    dmSidebarList.innerHTML = '';
    if (friends.length === 0) {
      dmSidebarList.innerHTML = `<div style="padding: 8px 10px; font-size: 12px; color: var(--text-muted);">No friends yet</div>`;
    } else {
      friends.forEach(f => {
        const item = document.createElement('div');
        const isActive = currentView === 'dm' && activeDmFriend && activeDmFriend.id === f.id;
        item.className = 'dm-item' + (isActive ? ' active' : '');
        item.setAttribute('data-id', f.id);
        const avatarColor = getColor(f.username);
        const initial = (f.displayName || f.username).charAt(0).toUpperCase();
        const devBadgeHtml = f.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';

        item.innerHTML = `
          <div class="dm-item-avatar" style="background-color: ${avatarColor}">${escapeHtml(initial)}</div>
          <span class="dm-item-name">${escapeHtml(f.displayName || f.username)}</span>
          ${devBadgeHtml}
        `;

        item.addEventListener('click', () => {
          switchToDmView(f);
        });

        dmSidebarList.appendChild(item);
      });
    }
  }

  // 1. Render All Friends
  allFriendsList.innerHTML = '';
  if (friends.length === 0) {
    allFriendsList.innerHTML = `<div class="empty-friends-state">No friends yet. Add a friend using the "Add Friend" tab!</div>`;
  } else {
    friends.forEach(f => {
      const card = document.createElement('div');
      card.className = 'friend-card';
      const devBadgeHtml = f.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';
      const avatarColor = getColor(f.username);
      const initial = (f.displayName || f.username).charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="friend-card-left">
          <div class="friend-avatar" style="background-color: ${avatarColor}">${escapeHtml(initial)}</div>
          <div class="friend-card-meta">
            <div class="friend-card-name-row">
              <span class="friend-card-name">${escapeHtml(f.displayName)}</span>
              ${devBadgeHtml}
            </div>
            <span class="friend-card-handle">@${escapeHtml(f.username)}</span>
          </div>
        </div>
        <div class="friend-actions">
          <button type="button" class="btn-friend-action btn-message-friend" title="Message Friend">Message</button>
          <button type="button" class="btn-friend-action btn-remove-friend" title="Remove Friend">Remove</button>
        </div>
      `;

      card.querySelector('.btn-message-friend').addEventListener('click', () => {
        switchToDmView(f);
      });

      card.querySelector('.btn-remove-friend').addEventListener('click', () => {
        handleRemoveFriend(f.id, f.displayName || f.username);
      });

      allFriendsList.appendChild(card);
    });
  }

  // 2. Render Incoming Pending Requests
  pendingIncomingList.innerHTML = '';
  if (pendingIncoming.length === 0) {
    pendingIncomingList.innerHTML = `<div class="empty-friends-state">No pending incoming requests.</div>`;
  } else {
    pendingIncoming.forEach(req => {
      const card = document.createElement('div');
      card.className = 'friend-card';
      const devBadgeHtml = req.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';
      const avatarColor = getColor(req.username);
      const initial = (req.displayName || req.username).charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="friend-card-left">
          <div class="friend-avatar" style="background-color: ${avatarColor}">${escapeHtml(initial)}</div>
          <div class="friend-card-meta">
            <div class="friend-card-name-row">
              <span class="friend-card-name">${escapeHtml(req.displayName)}</span>
              ${devBadgeHtml}
            </div>
            <span class="friend-card-handle">@${escapeHtml(req.username)}</span>
          </div>
        </div>
        <div class="friend-actions">
          <button type="button" class="btn-friend-action btn-accept-friend" title="Accept Request">Accept</button>
          <button type="button" class="btn-friend-action btn-decline-friend" title="Decline Request">Decline</button>
        </div>
      `;

      card.querySelector('.btn-accept-friend').addEventListener('click', () => {
        handleRespondFriend(req.friendshipId, 'accept');
      });

      card.querySelector('.btn-decline-friend').addEventListener('click', () => {
        handleRespondFriend(req.friendshipId, 'decline');
      });

      pendingIncomingList.appendChild(card);
    });
  }

  // 3. Render Outgoing Pending Requests
  pendingOutgoingList.innerHTML = '';
  if (pendingOutgoing.length === 0) {
    pendingOutgoingList.innerHTML = `<div class="empty-friends-state">No pending outgoing requests.</div>`;
  } else {
    pendingOutgoing.forEach(req => {
      const card = document.createElement('div');
      card.className = 'friend-card';
      const devBadgeHtml = req.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';
      const avatarColor = getColor(req.username);
      const initial = (req.displayName || req.username).charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="friend-card-left">
          <div class="friend-avatar" style="background-color: ${avatarColor}">${escapeHtml(initial)}</div>
          <div class="friend-card-meta">
            <div class="friend-card-name-row">
              <span class="friend-card-name">${escapeHtml(req.displayName)}</span>
              ${devBadgeHtml}
            </div>
            <span class="friend-card-handle">@${escapeHtml(req.username)}</span>
          </div>
        </div>
        <div class="friend-actions">
          <span class="outgoing-tag">Request Sent</span>
        </div>
      `;
      pendingOutgoingList.appendChild(card);
    });
  }
}

// Add Friend Form Submission
addFriendForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  addFriendAlert.classList.add('hidden');
  addFriendAlert.className = 'add-friend-alert';

  const targetUsername = addFriendInput.value.trim();
  if (!targetUsername) return;

  try {
    const res = await fetch('/api/friends/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: targetUsername })
    });

    const data = await res.json();
    if (!res.ok) {
      addFriendAlert.textContent = data.error || 'Failed to send friend request.';
      addFriendAlert.classList.add('error');
      addFriendAlert.classList.remove('hidden');
      return;
    }

    addFriendAlert.textContent = data.autoAccepted 
      ? `Success! You and @${data.friend.username} are now friends!`
      : `Success! Friend request sent to @${data.targetUsername}.`;
    addFriendAlert.classList.add('success');
    addFriendAlert.classList.remove('hidden');
    addFriendInput.value = '';

    await loadFriends();
  } catch (err) {
    addFriendAlert.textContent = 'Could not contact server.';
    addFriendAlert.classList.add('error');
    addFriendAlert.classList.remove('hidden');
  }
});

async function handleRespondFriend(friendshipId, action) {
  try {
    const res = await fetch('/api/friends/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ friendshipId, action })
    });
    if (res.ok) {
      await loadFriends();
    }
  } catch (err) {
    console.error('Failed to respond to friend request:', err);
  }
}

async function handleRemoveFriend(friendUserId, friendName) {
  const confirmRemove = confirm(`Are you sure you want to remove ${friendName} from your friends list?`);
  if (!confirmRemove) return;

  try {
    const res = await fetch(`/api/friends/${friendUserId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      await loadFriends();
    }
  } catch (err) {
    console.error('Failed to remove friend:', err);
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

      if (currentView === 'server') {
        if (!servers.some(s => s.id === activeServerId) && servers.length > 0) {
          await selectServer(servers[0].id);
        } else {
          await selectServer(activeServerId);
        }
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
    item.className = 'server-item' + (currentView === 'server' && server.id === activeServerId ? ' active' : '');
    item.setAttribute('data-id', server.id);
    item.title = server.name;

    const initials = getServerInitials(server.name);
    item.innerHTML = `
      <div class="server-pill"></div>
      <button type="button" class="server-icon" aria-label="${escapeHtml(server.name)}">${escapeHtml(initials)}</button>
    `;

    item.addEventListener('click', () => {
      switchToServerView(server.id);
    });

    serverList.appendChild(item);
  });
}

async function selectServer(serverId) {
  activeServerId = Number(serverId);

  document.querySelectorAll('.server-item:not(#homeBtn)').forEach(el => {
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
      ? `<button type="button" class="channel-delete-btn" title="Delete Channel" aria-label="Delete">✕</button>` 
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

  messagesList.innerHTML = '';

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
    switchToServerView(data.server.id);
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
      } else if (msg.type === 'dm_history') {
        if (activeDmFriend && msg.friendId === activeDmFriend.id) {
          dmMessagesList.innerHTML = '';
          if (Array.isArray(msg.messages)) {
            msg.messages.forEach(m => appendDmMessage(m, false));
            scrollDmToBottom();
          }
        }
      } else if (msg.type === 'direct_message') {
        const dm = msg.data;
        if (activeDmFriend && (dm.senderId === activeDmFriend.id || dm.receiverId === activeDmFriend.id)) {
          appendDmMessage(dm, true);
        } else if (currentUser && dm.senderId !== currentUser.id) {
          showToast({
            icon: '💬',
            title: `New DM from ${dm.authorName}`,
            body: dm.content,
            actionText: 'View',
            onAction: () => {
              const friend = friendsData.friends.find(f => f.id === dm.senderId) || {
                id: dm.senderId,
                displayName: dm.authorName,
                username: dm.authorUsername,
                isDeveloper: dm.isDeveloper
              };
              switchToDmView(friend);
            }
          });
        }
      } else if (msg.type === 'friends_updated') {
        loadFriends();
      } else if (msg.type === 'friend_request_notification') {
        loadFriends();
        showToast({
          icon: '👋',
          title: 'Friend Request Received',
          body: `@${msg.fromUsername} (${msg.fromDisplayName}) sent you a friend request!`,
          actionText: 'View Pending',
          onAction: () => {
            switchToFriendsView();
            switchFriendsTab('pending');
          }
        });
      } else if (msg.type === 'friend_request_accepted') {
        loadFriends();
        showToast({
          icon: '🎉',
          title: 'Friend Request Accepted',
          body: `You and @${msg.friendUsername} are now friends!`,
          actionText: 'Say Hi',
          onAction: () => {
            const friend = friendsData.friends.find(f => f.id === msg.friendId) || {
              id: msg.friendId,
              displayName: msg.friendDisplayName,
              username: msg.friendUsername
            };
            switchToDmView(friend);
          }
        });
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

function appendDmMessage(msg, shouldScroll = true) {
  const authorName = msg.authorName || 'User';
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

  dmMessagesList.appendChild(item);
  if (shouldScroll) {
    scrollDmToBottom();
  }
}

function scrollDmToBottom() {
  dmMessagesContainer.scrollTop = dmMessagesContainer.scrollHeight;
}

if (dmChatForm) {
  dmChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = dmMessageInput.value.trim();
    if (!content || !activeDmFriend) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('Not connected to the chat server. Please ensure the server is running.');
      return;
    }

    socket.send(JSON.stringify({
      type: 'direct_message',
      friendId: activeDmFriend.id,
      content: content
    }));

    dmMessageInput.value = '';
    dmMessageInput.focus();
  });
}

// Lightweight periodic sync fallback (every 4s) to ensure instant updates even on brief WS sleep
setInterval(() => {
  if (token && currentUser) {
    loadFriends();
  }
}, 4000);

// Boot check
checkCurrentSession();
