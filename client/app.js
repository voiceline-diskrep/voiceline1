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
const openBrowseServersBtn = document.getElementById('openBrowseServersBtn');
const browseServerModalOverlay = document.getElementById('browseServerModalOverlay');
const joinServerForm = document.getElementById('joinServerForm');
const joinServerCodeInput = document.getElementById('joinServerCodeInput');
const joinServerError = document.getElementById('joinServerError');
const cancelJoinServerBtn = document.getElementById('cancelJoinServerBtn');

const openCreateServerBtn = document.getElementById('openCreateServerBtn');
const createServerModalOverlay = document.getElementById('createServerModalOverlay');
const createServerForm = document.getElementById('createServerForm');
const serverNameInput = document.getElementById('serverNameInput');
const createServerError = document.getElementById('createServerError');
const cancelCreateServerBtn = document.getElementById('cancelCreateServerBtn');

// DOM Elements - Channel Sidebar & Modals
const channelSidebar = document.getElementById('channelSidebar');
const currentServerTitle = document.getElementById('currentServerTitle');
const developerServerCodeBadge = document.getElementById('developerServerCodeBadge');
const displayedJoinCode = document.getElementById('displayedJoinCode');
const copyServerCodeBtn = document.getElementById('copyServerCodeBtn');
const regenServerCodeBtn = document.getElementById('regenServerCodeBtn');
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

const dmHeaderFriendInfo = document.getElementById('dmHeaderFriendInfo');
const dmHeaderAvatar = document.getElementById('dmHeaderAvatar');
const dmUserCapsule = document.getElementById('dmUserCapsule');
const friendsUserCapsule = document.getElementById('friendsUserCapsule');

// DOM Elements - Profile Modals
const myProfileModalOverlay = document.getElementById('myProfileModalOverlay');
const myProfileForm = document.getElementById('myProfileForm');
const myProfileAvatarPreview = document.getElementById('myProfileAvatarPreview');
const profilePfpInput = document.getElementById('profilePfpInput');
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
const removeAvatarBtn = document.getElementById('removeAvatarBtn');
const profileUsernameDisplay = document.getElementById('profileUsernameDisplay');
const profileDisplayNameInput = document.getElementById('profileDisplayNameInput');
const profileBioInput = document.getElementById('profileBioInput');
const bioCharCount = document.getElementById('bioCharCount');
const myProfileError = document.getElementById('myProfileError');
const cancelMyProfileBtn = document.getElementById('cancelMyProfileBtn');

const userProfileModalOverlay = document.getElementById('userProfileModalOverlay');
const viewUserAvatar = document.getElementById('viewUserAvatar');
const viewUserDisplayName = document.getElementById('viewUserDisplayName');
const viewUserDevBadge = document.getElementById('viewUserDevBadge');
const viewUserHandle = document.getElementById('viewUserHandle');
const viewUserMutualRow = document.getElementById('viewUserMutualRow');
const viewUserMutualText = document.getElementById('viewUserMutualText');
const viewUserBio = document.getElementById('viewUserBio');
const viewUserMessageBtn = document.getElementById('viewUserMessageBtn');
const closeUserProfileBtn = document.getElementById('closeUserProfileBtn');

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

let pendingAvatarBase64 = null;
let pendingRemoveAvatar = false;
let viewedUserProfile = null;

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

function renderAvatarInto(element, user) {
  if (!element || !user) return;
  element.innerHTML = '';
  if (user.avatarUrl) {
    element.style.backgroundColor = 'transparent';
    const img = document.createElement('img');
    img.src = user.avatarUrl;
    img.alt = user.displayName || user.username || 'Avatar';
    img.className = 'avatar-img';
    element.appendChild(img);
  } else {
    const initial = (user.displayName || user.username || '?').charAt(0).toUpperCase();
    element.style.backgroundColor = getColor(user.username || user.displayName || '');
    element.textContent = initial;
  }
}

function createAvatarHtml({ avatarUrl, displayName, username, className = 'user-avatar' }) {
  if (avatarUrl) {
    return `<div class="${className}" style="background-color: transparent;"><img src="${escapeHtml(avatarUrl)}" class="avatar-img" alt="${escapeHtml(displayName || username || '')}" /></div>`;
  }
  const initial = (displayName || username || '?').charAt(0).toUpperCase();
  const color = getColor(username || displayName || '');
  return `<div class="${className}" style="background-color: ${color};">${escapeHtml(initial)}</div>`;
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

  currentUserName.textContent = dName;
  currentUserHandle.textContent = handle;
  renderAvatarInto(currentUserAvatar, user);

  if (currentUserName2) {
    currentUserName2.textContent = dName;
    currentUserHandle2.textContent = handle;
    renderAvatarInto(currentUserAvatar2, user);
  }

  if (currentUserName3) {
    currentUserName3.textContent = dName;
    currentUserHandle3.textContent = handle;
    renderAvatarInto(currentUserAvatar3, user);
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

// Open My Profile modal when clicking user capsule
document.querySelectorAll('.user-capsule').forEach(capsule => {
  capsule.addEventListener('click', (e) => {
    if (e.target.closest('.logout-btn')) return;
    openMyProfileModal();
  });
});

['userCapsule', 'friendsUserCapsule', 'dmUserCapsule'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.logout-btn')) return;
      openMyProfileModal();
    });
  }
});

function openMyProfileModal() {
  if (!currentUser) return;
  pendingAvatarBase64 = null;
  pendingRemoveAvatar = false;
  if (profilePfpInput) profilePfpInput.value = '';
  myProfileError.textContent = '';

  profileUsernameDisplay.value = currentUser.username;
  profileDisplayNameInput.value = currentUser.displayName || currentUser.username;
  if (profileBioInput) {
    profileBioInput.value = currentUser.bio || '';
    if (bioCharCount) bioCharCount.textContent = (currentUser.bio || '').length;
  }

  renderAvatarInto(myProfileAvatarPreview, currentUser);

  if (currentUser.avatarUrl) {
    removeAvatarBtn.classList.remove('hidden');
  } else {
    removeAvatarBtn.classList.add('hidden');
  }

  myProfileModalOverlay.classList.remove('hidden');
  profileDisplayNameInput.focus();
}

if (profileBioInput) {
  profileBioInput.addEventListener('input', () => {
    if (bioCharCount) bioCharCount.textContent = profileBioInput.value.length;
  });
}

cancelMyProfileBtn.addEventListener('click', () => {
  myProfileModalOverlay.classList.add('hidden');
});

myProfileModalOverlay.addEventListener('click', (e) => {
  if (e.target === myProfileModalOverlay) {
    myProfileModalOverlay.classList.add('hidden');
  }
});

changeAvatarBtn.addEventListener('click', () => {
  profilePfpInput.click();
});

profilePfpInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    myProfileError.textContent = 'Image file too large. Maximum size is 2MB.';
    profilePfpInput.value = '';
    return;
  }

  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    myProfileError.textContent = 'Unsupported image format. Allowed: PNG, JPG, WebP, GIF.';
    profilePfpInput.value = '';
    return;
  }

  myProfileError.textContent = '';
  const reader = new FileReader();
  reader.onload = (event) => {
    pendingAvatarBase64 = event.target.result;
    pendingRemoveAvatar = false;
    renderAvatarInto(myProfileAvatarPreview, {
      avatarUrl: pendingAvatarBase64,
      displayName: profileDisplayNameInput.value || currentUser.displayName,
      username: currentUser.username
    });
    removeAvatarBtn.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

removeAvatarBtn.addEventListener('click', () => {
  pendingAvatarBase64 = null;
  pendingRemoveAvatar = true;
  profilePfpInput.value = '';
  removeAvatarBtn.classList.add('hidden');
  renderAvatarInto(myProfileAvatarPreview, {
    avatarUrl: null,
    displayName: profileDisplayNameInput.value || currentUser.displayName,
    username: currentUser.username
  });
});

myProfileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  myProfileError.textContent = '';

  const newDisplayName = profileDisplayNameInput.value.trim();
  if (!newDisplayName) {
    myProfileError.textContent = 'Display name cannot be empty.';
    return;
  }

  const payload = {
    displayName: newDisplayName,
    bio: profileBioInput ? profileBioInput.value.trim() : ''
  };

  if (pendingRemoveAvatar) {
    payload.removeAvatar = true;
  } else if (pendingAvatarBase64) {
    payload.avatarBase64 = pendingAvatarBase64;
  }

  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      myProfileError.textContent = data.error || 'Failed to update profile.';
      return;
    }

    currentUser = data.user;
    applyUserProfile(currentUser);
    myProfileModalOverlay.classList.add('hidden');

    await loadFriends();
  } catch (err) {
    myProfileError.textContent = 'Could not contact server.';
  }
});

// View User Profile Modal
async function openUserProfile(userId, fallbackInfo = null) {
  if (!userId) return;

  if (currentUser && Number(userId) === currentUser.id) {
    openMyProfileModal();
    return;
  }

  let user = fallbackInfo;
  let mutualFriends = [];
  let mutualServers = [];
  try {
    const res = await fetch(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) user = data.user;
      if (data.mutualFriends) mutualFriends = data.mutualFriends;
      if (data.mutualServers) mutualServers = data.mutualServers;
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
  }

  if (!user) return;
  viewedUserProfile = user;

  renderAvatarInto(viewUserAvatar, user);
  viewUserDisplayName.textContent = user.displayName || user.username;
  viewUserHandle.textContent = `@${user.username}`;

  if (user.isDeveloper) {
    viewUserDevBadge.classList.remove('hidden');
  } else {
    viewUserDevBadge.classList.add('hidden');
  }

  if (viewUserMutualText) {
    const friendCount = (mutualFriends || []).length;
    const serverCount = (mutualServers || []).length;
    const friendText = friendCount === 1 ? '1 Mutual Friend' : `${friendCount} Mutual Friends`;
    const serverText = serverCount === 1 ? '1 Mutual Server' : `${serverCount} Mutual Servers`;
    viewUserMutualText.textContent = `${friendText} • ${serverText}`;
  }

  if (viewUserBio) {
    viewUserBio.textContent = (user.bio && user.bio.trim()) ? user.bio : 'No bio yet.';
  }

  userProfileModalOverlay.classList.remove('hidden');
}

closeUserProfileBtn.addEventListener('click', () => {
  userProfileModalOverlay.classList.add('hidden');
  viewedUserProfile = null;
});

userProfileModalOverlay.addEventListener('click', (e) => {
  if (e.target === userProfileModalOverlay) {
    userProfileModalOverlay.classList.add('hidden');
    viewedUserProfile = null;
  }
});

viewUserMessageBtn.addEventListener('click', () => {
  if (!viewedUserProfile) return;
  const target = viewedUserProfile;
  userProfileModalOverlay.classList.add('hidden');
  viewedUserProfile = null;
  switchToDmView(target);
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

function switchToFriendsView(tab = currentFriendsTab) {
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

  switchFriendsTab(tab);
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
  if (dmHeaderAvatar) {
    renderAvatarInto(dmHeaderAvatar, friend);
  }

  if (dmHeaderFriendInfo) {
    dmHeaderFriendInfo.onclick = () => openUserProfile(friend.id, friend);
  }

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

friendsNavAllBtn.addEventListener('click', () => switchToFriendsView('all'));
friendsNavPendingBtn.addEventListener('click', () => switchToFriendsView('pending'));
friendsNavAddBtn.addEventListener('click', () => switchToFriendsView('add'));

fTabAllBtn.addEventListener('click', () => { switchFriendsTab('all'); loadFriends(); });
fTabPendingBtn.addEventListener('click', () => { switchFriendsTab('pending'); loadFriends(); });
fTabAddBtn.addEventListener('click', () => switchFriendsTab('add'));

async function loadFriends() {
  if (!token) return;

  try {
    const res = await fetch(`/api/friends?_t=${Date.now()}`, {
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
        const devBadgeHtml = f.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';
        const avatarHtml = createAvatarHtml({
          avatarUrl: f.avatarUrl,
          displayName: f.displayName,
          username: f.username,
          className: 'dm-item-avatar'
        });

        item.innerHTML = `
          ${avatarHtml}
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
      const avatarHtml = createAvatarHtml({
        avatarUrl: f.avatarUrl,
        displayName: f.displayName,
        username: f.username,
        className: 'friend-avatar'
      });

      card.innerHTML = `
        <div class="friend-card-left" title="Click to view profile">
          ${avatarHtml}
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

      card.querySelector('.friend-card-left').addEventListener('click', () => {
        openUserProfile(f.id, f);
      });

      card.querySelector('.btn-message-friend').addEventListener('click', (e) => {
        e.stopPropagation();
        switchToDmView(f);
      });

      card.querySelector('.btn-remove-friend').addEventListener('click', (e) => {
        e.stopPropagation();
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
      const avatarHtml = createAvatarHtml({
        avatarUrl: req.avatarUrl,
        displayName: req.displayName,
        username: req.username,
        className: 'friend-avatar'
      });

      card.innerHTML = `
        <div class="friend-card-left" title="Click to view profile">
          ${avatarHtml}
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

      card.querySelector('.friend-card-left').addEventListener('click', () => {
        openUserProfile(req.id, req);
      });

      card.querySelector('.btn-accept-friend').addEventListener('click', (e) => {
        e.stopPropagation();
        handleRespondFriend(req.friendshipId, 'accept');
      });

      card.querySelector('.btn-decline-friend').addEventListener('click', (e) => {
        e.stopPropagation();
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
      const avatarHtml = createAvatarHtml({
        avatarUrl: req.avatarUrl,
        displayName: req.displayName,
        username: req.username,
        className: 'friend-avatar'
      });

      card.innerHTML = `
        <div class="friend-card-left" title="Click to view profile">
          ${avatarHtml}
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

      card.querySelector('.friend-card-left').addEventListener('click', () => {
        openUserProfile(req.id, req);
      });

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
      if (action === 'accept') {
        switchFriendsTab('all');
      }
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

  if (developerServerCodeBadge) {
    if (currentUser && currentUser.isDeveloper && curServer.joinCode) {
      displayedJoinCode.textContent = curServer.joinCode;
      developerServerCodeBadge.classList.remove('hidden');
    } else {
      developerServerCodeBadge.classList.add('hidden');
    }
  }

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

// Developer Join Code Actions (Copy & Regenerate)
if (copyServerCodeBtn) {
  copyServerCodeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const curServer = servers.find(s => s.id === activeServerId);
    if (!curServer || !curServer.joinCode) return;

    try {
      await navigator.clipboard.writeText(curServer.joinCode);
      showToast({
        icon: '📋',
        title: 'Join Code Copied',
        body: `Copied join code "${curServer.joinCode}" for ${curServer.name} to clipboard!`,
        duration: 3000
      });
    } catch {
      prompt('Copy server join code:', curServer.joinCode);
    }
  });
}

if (regenServerCodeBtn) {
  regenServerCodeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const curServer = servers.find(s => s.id === activeServerId);
    if (!curServer) return;

    const confirmRegen = confirm(
      `Are you sure you want to regenerate the join code for "${curServer.name}"?\n\nThe previous code (${curServer.joinCode || 'none'}) will stop working immediately.`
    );
    if (!confirmRegen) return;

    try {
      const res = await fetch(`/api/servers/${activeServerId}/regen-code`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to regenerate join code.');
        return;
      }

      curServer.joinCode = data.joinCode;
      if (displayedJoinCode) displayedJoinCode.textContent = data.joinCode;
      showToast({
        icon: '🔄',
        title: 'New Join Code Generated',
        body: `New code for ${curServer.name} is "${data.joinCode}".`,
        duration: 4000
      });
    } catch (err) {
      alert('Could not contact server to regenerate code.');
    }
  });
}

// Join Server Modal
if (openBrowseServersBtn) {
  openBrowseServersBtn.addEventListener('click', () => {
    browseServerModalOverlay.classList.remove('hidden');
    joinServerCodeInput.value = '';
    joinServerError.textContent = '';
    joinServerCodeInput.focus();
  });
}

if (cancelJoinServerBtn) {
  cancelJoinServerBtn.addEventListener('click', () => {
    browseServerModalOverlay.classList.add('hidden');
  });
}

if (browseServerModalOverlay) {
  browseServerModalOverlay.addEventListener('click', (e) => {
    if (e.target === browseServerModalOverlay) {
      browseServerModalOverlay.classList.add('hidden');
    }
  });
}

if (joinServerCodeInput) {
  joinServerCodeInput.addEventListener('input', () => {
    joinServerCodeInput.value = joinServerCodeInput.value.toUpperCase();
  });
}

if (joinServerForm) {
  joinServerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    joinServerError.textContent = '';

    const code = joinServerCodeInput.value.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetch('/api/servers/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (!res.ok) {
        joinServerError.textContent = data.error || 'Failed to join server.';
        return;
      }

      browseServerModalOverlay.classList.add('hidden');
      await loadServers();

      if (data.server && data.server.id) {
        switchToServerView(data.server.id);
      }

      showToast({
        icon: '🎉',
        title: data.alreadyMember ? 'Already in Server' : 'Joined Server!',
        body: data.alreadyMember
          ? `You are already a member of "${data.server.name}". Opened server.`
          : `Successfully joined "${data.server.name}"!`,
        duration: 4000
      });
    } catch (err) {
      joinServerError.textContent = 'Could not reach server.';
    }
  });
}

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
      } else if (msg.type === 'profile_updated') {
        if (currentUser && msg.user && msg.user.id === currentUser.id) {
          currentUser = { ...currentUser, ...msg.user };
          applyUserProfile(currentUser);
        }
        if (activeDmFriend && msg.user && activeDmFriend.id === msg.user.id) {
          activeDmFriend = { ...activeDmFriend, ...msg.user };
          dmActiveFriendName.textContent = activeDmFriend.displayName || activeDmFriend.username;
          dmWelcomeTitle.textContent = activeDmFriend.displayName || activeDmFriend.username;
          if (dmHeaderAvatar) renderAvatarInto(dmHeaderAvatar, activeDmFriend);
        }
        loadFriends();
      } else if (msg.type === 'server_code_updated') {
        const s = servers.find(srv => srv.id === msg.serverId);
        if (s) {
          s.joinCode = msg.joinCode;
          if (activeServerId === msg.serverId && currentUser && currentUser.isDeveloper && displayedJoinCode) {
            displayedJoinCode.textContent = msg.joinCode;
          }
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
  const timeFormatted = formatTime(msg.timestamp);
  const devBadgeHtml = msg.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';

  const avatarHtml = createAvatarHtml({
    avatarUrl: msg.authorAvatarUrl,
    displayName: authorName,
    username: msg.authorUsername,
    className: 'message-avatar clickable-user'
  });

  const item = document.createElement('div');
  item.className = 'message-item';
  item.innerHTML = `
    ${avatarHtml}
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author clickable-user">${escapeHtml(authorName)}</span>
        ${devBadgeHtml}
        <span class="message-username clickable-user">${escapeHtml(authorUsername)}</span>
        <span class="message-time">${escapeHtml(timeFormatted)}</span>
      </div>
      <div class="message-text">${escapeHtml(msg.content)}</div>
    </div>
  `;

  if (msg.authorId) {
    item.querySelectorAll('.clickable-user').forEach(el => {
      el.addEventListener('click', () => {
        openUserProfile(msg.authorId, {
          id: msg.authorId,
          displayName: authorName,
          username: msg.authorUsername,
          avatarUrl: msg.authorAvatarUrl,
          isDeveloper: msg.isDeveloper
        });
      });
    });
  }

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
  const timeFormatted = formatTime(msg.timestamp);
  const devBadgeHtml = msg.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';

  const avatarHtml = createAvatarHtml({
    avatarUrl: msg.authorAvatarUrl,
    displayName: authorName,
    username: msg.authorUsername,
    className: 'message-avatar clickable-user'
  });

  const item = document.createElement('div');
  item.className = 'message-item';
  item.innerHTML = `
    ${avatarHtml}
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author clickable-user">${escapeHtml(authorName)}</span>
        ${devBadgeHtml}
        <span class="message-username clickable-user">${escapeHtml(authorUsername)}</span>
        <span class="message-time">${escapeHtml(timeFormatted)}</span>
      </div>
      <div class="message-text">${escapeHtml(msg.content)}</div>
    </div>
  `;

  const authorId = msg.authorId || msg.senderId;
  if (authorId) {
    item.querySelectorAll('.clickable-user').forEach(el => {
      el.addEventListener('click', () => {
        openUserProfile(authorId, {
          id: authorId,
          displayName: authorName,
          username: msg.authorUsername,
          avatarUrl: msg.authorAvatarUrl,
          isDeveloper: msg.isDeveloper
        });
      });
    });
  }

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
