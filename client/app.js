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
const openManageAccountsBtn = document.getElementById('openManageAccountsBtn');

// DOM Elements - Developer Account Management
const manageAccountsModalOverlay = document.getElementById('manageAccountsModalOverlay');
const closeManageAccountsBtn = document.getElementById('closeManageAccountsBtn');
const accountsTotalPill = document.getElementById('accountsTotalPill');
const accountsSearchInput = document.getElementById('accountsSearchInput');
const accountsLoading = document.getElementById('accountsLoading');
const accountsList = document.getElementById('accountsList');

const confirmRemoveAccountModalOverlay = document.getElementById('confirmRemoveAccountModalOverlay');
const confirmRemoveAccountMessage = document.getElementById('confirmRemoveAccountMessage');
const cancelConfirmRemoveAccountBtn = document.getElementById('cancelConfirmRemoveAccountBtn');
const submitConfirmRemoveAccountBtn = document.getElementById('submitConfirmRemoveAccountBtn');

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

// DOM Elements - Attachments & Pre-Shutdown Storage Check
const attachFileBtn = document.getElementById('attachFileBtn');
const fileInput = document.getElementById('fileInput');
const pendingAttachmentBar = document.getElementById('pendingAttachmentBar');
const pendingFileName = document.getElementById('pendingFileName');
const pendingFileSize = document.getElementById('pendingFileSize');
const removeAttachmentBtn = document.getElementById('removeAttachmentBtn');

const dmAttachFileBtn = document.getElementById('dmAttachFileBtn');
const dmFileInput = document.getElementById('dmFileInput');
const dmPendingAttachmentBar = document.getElementById('dmPendingAttachmentBar');
const dmPendingFileName = document.getElementById('dmPendingFileName');
const dmPendingFileSize = document.getElementById('dmPendingFileSize');
const dmRemoveAttachmentBtn = document.getElementById('dmRemoveAttachmentBtn');

const shutdownConfirmModalOverlay = document.getElementById('shutdownConfirmModalOverlay');
const shutdownStorageLoading = document.getElementById('shutdownStorageLoading');
const shutdownStorageBreakdown = document.getElementById('shutdownStorageBreakdown');
const storageDbSize = document.getElementById('storageDbSize');
const storageUploadsSize = document.getElementById('storageUploadsSize');
const storageTotalSize = document.getElementById('storageTotalSize');
const cancelShutdownBtn = document.getElementById('cancelShutdownBtn');
const confirmShutdownBtn = document.getElementById('confirmShutdownBtn');

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

// DOM Elements - Voice Calling (Stage 3c-1)
const dmStartCallBtn = document.getElementById('dmStartCallBtn');
const incomingCallModalOverlay = document.getElementById('incomingCallModalOverlay');
const incomingCallAvatar = document.getElementById('incomingCallAvatar');
const incomingCallName = document.getElementById('incomingCallName');
const incomingCallHandle = document.getElementById('incomingCallHandle');
const acceptCallBtn = document.getElementById('acceptCallBtn');
const declineCallBtn = document.getElementById('declineCallBtn');

const activeCallWidget = document.getElementById('activeCallWidget');
const callPartnerAvatar = document.getElementById('callPartnerAvatar');
const callPartnerName = document.getElementById('callPartnerName');
const callStatusText = document.getElementById('callStatusText');
const callTimerText = document.getElementById('callTimerText');
const callMuteBtn = document.getElementById('callMuteBtn');
const callMuteBtnLabel = document.getElementById('callMuteBtnLabel');
const micIconUnmuted = document.getElementById('micIconUnmuted');
const micIconMuted = document.getElementById('micIconMuted');
const callHangupBtn = document.getElementById('callHangupBtn');
const remoteVoiceAudio = document.getElementById('remoteVoiceAudio');

// Video Calling DOM Elements (Stage 3c-2)
const callCameraBtn = document.getElementById('callCameraBtn');
const callCameraBtnLabel = document.getElementById('callCameraBtnLabel');
const cameraIconOff = document.getElementById('cameraIconOff');
const cameraIconOn = document.getElementById('cameraIconOn');
const callExpandTheaterBtn = document.getElementById('callExpandTheaterBtn');

const activeCallTheaterOverlay = document.getElementById('activeCallTheaterOverlay');
const theaterPartnerName = document.getElementById('theaterPartnerName');
const theaterPartnerHandle = document.getElementById('theaterPartnerHandle');
const theaterStatusBadge = document.getElementById('theaterStatusBadge');
const theaterTimerText = document.getElementById('theaterTimerText');
const theaterPartnerAvatar = document.getElementById('theaterPartnerAvatar');
const theaterCamOffTitle = document.getElementById('theaterCamOffTitle');
const theaterCamOffSub = document.getElementById('theaterCamOffSub');
const remoteVideoFeed = document.getElementById('remoteVideoFeed');
const remoteCameraOffState = document.getElementById('remoteCameraOffState');
const selfPipContainer = document.getElementById('selfPipContainer');
const localVideoFeed = document.getElementById('localVideoFeed');
const selfCameraOffState = document.getElementById('selfCameraOffState');
const selfPipAvatar = document.getElementById('selfPipAvatar');
const theaterMuteBtn = document.getElementById('theaterMuteBtn');
const theaterMuteBtnLabel = document.getElementById('theaterMuteBtnLabel');
const theaterMicIconUnmuted = document.getElementById('theaterMicIconUnmuted');
const theaterMicIconMuted = document.getElementById('theaterMicIconMuted');
const theaterCameraBtn = document.getElementById('theaterCameraBtn');
const theaterCameraBtnLabel = document.getElementById('theaterCameraBtnLabel');
const theaterCameraIconOff = document.getElementById('theaterCameraIconOff');
const theaterCameraIconOn = document.getElementById('theaterCameraIconOn');
const theaterHangupBtn = document.getElementById('theaterHangupBtn');
const theaterMinimizeBtn = document.getElementById('theaterMinimizeBtn');
const viewUserCallBtn = document.getElementById('viewUserCallBtn');

// State
let currentUser = null;
let token = localStorage.getItem('voiceline_token');
let servers = [];
let channels = [];
let activeServerId = null;
let activeChannelId = null;
let currentView = 'server'; // 'server' or 'friends'
let currentFriendsTab = 'all'; // 'all', 'pending', 'add'
let friendsData = { friends: [], pendingIncoming: [], pendingOutgoing: [] };
let activeDmFriend = null;

let pendingAvatarBase64 = null;
let pendingRemoveAvatar = false;
let viewedUserProfile = null;

let pendingChannelFile = null;
let pendingDmFile = null;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100MB

let allAccounts = [];
let accountToRemove = null;

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

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isImageFile(type, filename) {
  if (type && type.startsWith('image/')) return true;
  const ext = (filename || '').split('.').pop().toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext);
}

function renderAttachmentHtml(msg) {
  if (!msg.fileUrl) return '';

  const isImg = isImageFile(msg.fileType, msg.fileName);
  if (isImg) {
    return `
      <div class="message-attachment-wrap">
        <div class="message-attachment-image-wrap">
          <a href="${escapeHtml(msg.fileUrl)}" target="_blank" rel="noopener noreferrer">
            <img class="message-attachment-image" src="${escapeHtml(msg.fileUrl)}" alt="${escapeHtml(msg.fileName || 'Attachment')}" loading="lazy" />
          </a>
        </div>
      </div>
    `;
  }

  const safeFileName = escapeHtml(msg.fileName || 'Attachment');
  const sizeFormatted = msg.fileSize ? formatBytes(msg.fileSize) : '';
  return `
    <div class="message-attachment-wrap">
      <div class="message-file-card">
        <div class="message-file-icon">📄</div>
        <div class="message-file-info">
          <a class="message-file-name" href="${escapeHtml(msg.fileUrl)}" download="${safeFileName}" target="_blank" rel="noopener noreferrer">
            ${safeFileName}
          </a>
          <span class="message-file-size">${escapeHtml(sizeFormatted)}</span>
        </div>
        <a class="message-file-download-btn" href="${escapeHtml(msg.fileUrl)}" download="${safeFileName}" title="Download">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
          </svg>
        </a>
      </div>
    </div>
  `;
}

async function uploadFileStream(file, { serverId, channelId, dmFriendId }) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-File-Name': encodeURIComponent(file.name),
    'Content-Type': file.type || 'application/octet-stream'
  };

  if (serverId && channelId) {
    headers['X-Server-Id'] = String(serverId);
    headers['X-Channel-Id'] = String(channelId);
  } else if (dmFriendId) {
    headers['X-Dm-Friend-Id'] = String(dmFriendId);
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers,
    body: file
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload file');
  }
  return data.file;
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
    if (typeof checkFeedbackStatus === 'function') {
      checkFeedbackStatus();
    }
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

async function handleLogout() {
  try { endVoiceCall(true); } catch {}
  const oldToken = token;

  isIntentionalDisconnect = true;
  localStorage.removeItem('voiceline_token');
  token = null;
  currentUser = null;

  if (socket) {
    socket.close();
  }

  if (oldToken) {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${oldToken}` }
      });
    } catch {}
  }

  // Full reload wipes ALL in-memory state (servers, channels, messages, friends, DMs)
  // so nothing from this account can leak into the next account that logs in here.
  window.location.reload();
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

if (viewUserCallBtn) {
  viewUserCallBtn.addEventListener('click', () => {
    if (!viewedUserProfile) return;
    const target = viewedUserProfile;
    userProfileModalOverlay.classList.add('hidden');
    viewedUserProfile = null;
    initiateVoiceCall(target);
  });
}

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
      if (typeof checkFeedbackStatus === 'function') {
        checkFeedbackStatus();
      }
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

  if (dmStartCallBtn) {
    if (friend.isDeleted) {
      dmStartCallBtn.classList.add('hidden');
    } else {
      dmStartCallBtn.classList.remove('hidden');
      dmStartCallBtn.disabled = false;
      dmStartCallBtn.onclick = () => {
        initiateVoiceCall(friend);
      };
    }
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
          <button type="button" class="btn-friend-icon-action btn-call-icon" title="Voice or Video Call">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.61c0-.55-.45-1-1-1z"/>
            </svg>
          </button>
          <button type="button" class="btn-friend-icon-action btn-msg-icon" title="Direct Message">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
          <button type="button" class="btn-friend-icon-action btn-remove-icon" title="Remove Friend">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      `;

      card.querySelector('.friend-card-left').addEventListener('click', () => {
        openUserProfile(f.id, f);
      });

      card.querySelector('.btn-call-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        initiateVoiceCall(f);
      });

      card.querySelector('.btn-msg-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        switchToDmView(f);
      });

      card.querySelector('.btn-remove-icon').addEventListener('click', (e) => {
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
      // Only servers the CURRENTLY logged-in account belongs to (server enforces this)
      servers = data.servers || [];
      renderServerList();

      if (currentView === 'server') {
        if (servers.length === 0) {
          showNoServersState();
        } else if (!servers.some(s => s.id === activeServerId)) {
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

// Shown when the logged-in account has not joined any servers (or lost access)
function showNoServersState() {
  activeServerId = null;
  activeChannelId = null;
  channels = [];

  document.querySelectorAll('.server-item:not(#homeBtn)').forEach(el => el.classList.remove('active'));
  currentServerTitle.textContent = 'No servers yet';
  if (developerServerCodeBadge) developerServerCodeBadge.classList.add('hidden');
  channelList.innerHTML = `<div style="padding: 8px 10px; font-size: 12px; color: var(--text-muted);">Join a server to see its channels.</div>`;

  activeChannelName.textContent = 'no-server';
  activeChannelDesc.textContent = '';
  welcomeTitle.textContent = "You haven't joined any servers yet";
  welcomeDesc.textContent = 'Click the compass button on the left and enter a join code to join a server.';
  messagesList.innerHTML = '';
  messageInput.value = '';
  messageInput.disabled = true;
  messageInput.placeholder = 'Join a server to start chatting';
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
  const targetId = Number(serverId);
  // Never open a server that isn't in this account's own server list
  if (!targetId || !servers.some(s => s.id === targetId)) {
    if (servers.length > 0) {
      return selectServer(servers[0].id);
    }
    showNoServersState();
    return;
  }

  activeServerId = targetId;

  document.querySelectorAll('.server-item:not(#homeBtn)').forEach(el => {
    el.classList.toggle('active', Number(el.getAttribute('data-id')) === activeServerId);
  });

  const curServer = servers.find(s => s.id === activeServerId);
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

    if (res.status === 403) {
      // This account is not (or no longer) a member: refresh its own server list
      servers = servers.filter(s => s.id !== Number(serverId));
      renderServerList();
      if (servers.length > 0) {
        await selectServer(servers[0].id);
      } else {
        showNoServersState();
      }
      return;
    }

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
  messageInput.disabled = false;
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

// Developer Server Shutdown - Pre-Shutdown Storage Check Modal
shutdownServerBtn.addEventListener('click', async () => {
  if (!shutdownConfirmModalOverlay) return;

  shutdownConfirmModalOverlay.classList.remove('hidden');
  shutdownStorageLoading.classList.remove('hidden');
  shutdownStorageBreakdown.classList.add('hidden');
  confirmShutdownBtn.disabled = true;

  try {
    const res = await fetch('/api/server/storage-stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to fetch storage stats');
      shutdownConfirmModalOverlay.classList.add('hidden');
      return;
    }

    const { stats } = data;
    storageDbSize.textContent = stats.databaseFormatted;
    storageUploadsSize.textContent = stats.uploadsFormatted;
    storageTotalSize.textContent = stats.totalFormatted;

    shutdownStorageLoading.classList.add('hidden');
    shutdownStorageBreakdown.classList.remove('hidden');
    confirmShutdownBtn.disabled = false;
  } catch (err) {
    alert('Could not retrieve storage statistics: ' + err.message);
    shutdownConfirmModalOverlay.classList.add('hidden');
  }
});

if (cancelShutdownBtn) {
  cancelShutdownBtn.addEventListener('click', () => {
    shutdownConfirmModalOverlay.classList.add('hidden');
  });
}

if (shutdownConfirmModalOverlay) {
  shutdownConfirmModalOverlay.addEventListener('click', (e) => {
    if (e.target === shutdownConfirmModalOverlay) {
      shutdownConfirmModalOverlay.classList.add('hidden');
    }
  });
}

if (confirmShutdownBtn) {
  confirmShutdownBtn.addEventListener('click', async () => {
    confirmShutdownBtn.disabled = true;
    confirmShutdownBtn.textContent = 'Stopping...';

    try {
      const res = await fetch('/api/server/shutdown', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        alert('Error: ' + (data.error || 'Failed to shut down server.'));
        confirmShutdownBtn.disabled = false;
        confirmShutdownBtn.textContent = 'Turn Off Server';
      }
    } catch (err) {
      console.log('Shutdown initiated.');
    }
  });
}

// ==========================================
// DEVELOPER ACCOUNT MANAGEMENT
// ==========================================
function formatJoinDate(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Unknown';
  }
}

async function loadAccounts() {
  if (!token || !currentUser || !currentUser.isDeveloper) return;

  accountsLoading.classList.remove('hidden');
  accountsList.innerHTML = '';

  try {
    const res = await fetch('/api/developer/accounts', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) {
      accountsLoading.textContent = data.error || 'Failed to load accounts.';
      return;
    }

    allAccounts = data.accounts || [];
    accountsTotalPill.textContent = `${allAccounts.length} ${allAccounts.length === 1 ? 'Account' : 'Accounts'}`;
    accountsLoading.classList.add('hidden');
    renderAccountsList(accountsSearchInput ? accountsSearchInput.value : '');
  } catch (err) {
    accountsLoading.textContent = 'Could not reach server.';
  }
}

function renderAccountsList(filterText = '') {
  if (!accountsList) return;
  accountsList.innerHTML = '';

  const cleanFilter = (filterText || '').trim().toLowerCase();
  const filtered = allAccounts.filter(acc => {
    if (!cleanFilter) return true;
    return (acc.username || '').toLowerCase().includes(cleanFilter) ||
           (acc.displayName || '').toLowerCase().includes(cleanFilter);
  });

  if (filtered.length === 0) {
    accountsList.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">No accounts found matching "${escapeHtml(cleanFilter)}".</div>`;
    return;
  }

  filtered.forEach(acc => {
    const row = document.createElement('div');
    row.className = 'account-row';

    const isSelf = currentUser && acc.id === currentUser.id;
    const isDeleted = Boolean(acc.isDeleted);
    const devBadgeHtml = acc.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';

    const avatarHtml = createAvatarHtml({
      avatarUrl: acc.avatarUrl,
      displayName: acc.displayName,
      username: acc.username,
      className: 'account-row-avatar'
    });

    let actionHtml = '';
    if (isSelf) {
      actionHtml = '<span class="self-tag">You</span>';
    } else if (isDeleted) {
      actionHtml = '<span class="removed-tag">Removed</span>';
    } else {
      actionHtml = '<button type="button" class="btn-remove-account">Remove Account</button>';
    }

    row.innerHTML = `
      <div class="account-row-left">
        ${avatarHtml}
        <div class="account-row-meta">
          <div class="account-row-title-row">
            <span class="account-row-display">${escapeHtml(acc.displayName)}</span>
            ${devBadgeHtml}
            <span class="account-row-handle">@${escapeHtml(acc.username)}</span>
          </div>
          <span class="account-row-joined">Joined ${formatJoinDate(acc.createdAt)}</span>
        </div>
      </div>
      <div class="account-row-right">
        ${actionHtml}
      </div>
    `;

    const removeBtn = row.querySelector('.btn-remove-account');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        openConfirmRemoveModal(acc);
      });
    }

    accountsList.appendChild(row);
  });
}

function openConfirmRemoveModal(acc) {
  accountToRemove = acc;
  confirmRemoveAccountMessage.innerHTML = `Are you sure you want to remove <strong>${escapeHtml(acc.displayName)} (@${escapeHtml(acc.username)})</strong>?`;
  confirmRemoveAccountModalOverlay.classList.remove('hidden');
}

if (openManageAccountsBtn) {
  openManageAccountsBtn.addEventListener('click', () => {
    manageAccountsModalOverlay.classList.remove('hidden');
    if (accountsSearchInput) accountsSearchInput.value = '';
    loadAccounts();
  });
}

if (closeManageAccountsBtn) {
  closeManageAccountsBtn.addEventListener('click', () => {
    manageAccountsModalOverlay.classList.add('hidden');
  });
}

if (manageAccountsModalOverlay) {
  manageAccountsModalOverlay.addEventListener('click', (e) => {
    if (e.target === manageAccountsModalOverlay) {
      manageAccountsModalOverlay.classList.add('hidden');
    }
  });
}

if (accountsSearchInput) {
  accountsSearchInput.addEventListener('input', () => {
    renderAccountsList(accountsSearchInput.value);
  });
}

if (cancelConfirmRemoveAccountBtn) {
  cancelConfirmRemoveAccountBtn.addEventListener('click', () => {
    confirmRemoveAccountModalOverlay.classList.add('hidden');
    accountToRemove = null;
  });
}

if (confirmRemoveAccountModalOverlay) {
  confirmRemoveAccountModalOverlay.addEventListener('click', (e) => {
    if (e.target === confirmRemoveAccountModalOverlay) {
      confirmRemoveAccountModalOverlay.classList.add('hidden');
      accountToRemove = null;
    }
  });
}

if (submitConfirmRemoveAccountBtn) {
  submitConfirmRemoveAccountBtn.addEventListener('click', async () => {
    if (!accountToRemove) return;
    submitConfirmRemoveAccountBtn.disabled = true;
    submitConfirmRemoveAccountBtn.textContent = 'Removing...';

    try {
      const res = await fetch(`/api/developer/accounts/${accountToRemove.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to remove account.');
        submitConfirmRemoveAccountBtn.disabled = false;
        submitConfirmRemoveAccountBtn.textContent = 'Yes, Remove Account';
        return;
      }

      showToast({
        icon: '🗑️',
        title: 'Account Removed',
        body: `@${accountToRemove.username} has been permanently removed.`,
        duration: 4000
      });

      confirmRemoveAccountModalOverlay.classList.add('hidden');
      submitConfirmRemoveAccountBtn.disabled = false;
      submitConfirmRemoveAccountBtn.textContent = 'Yes, Remove Account';
      accountToRemove = null;

      await loadAccounts();
      loadFriends();
    } catch (err) {
      alert('Error removing account: ' + err.message);
      submitConfirmRemoveAccountBtn.disabled = false;
      submitConfirmRemoveAccountBtn.textContent = 'Yes, Remove Account';
    }
  });
}

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
  const wsUrl = `${protocol}//${window.location.host}/?token=${encodeURIComponent(token)}&serverId=${activeServerId || ''}&channelId=${activeChannelId || ''}`;

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
      } else if (msg.type === 'channel_access_denied') {
        if (currentView === 'server' && msg.channelId === activeChannelId) {
          messagesList.innerHTML = '';
          loadServers();
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
      } else if (msg.type === 'account_terminated') {
        isIntentionalDisconnect = true;
        localStorage.removeItem('voiceline_token');
        token = null;
        currentUser = null;
        alert(msg.message || 'Your account has been removed by the developer.');
        window.location.reload();
      } else if (msg.type === 'user_removed') {
        loadFriends();
        if (currentUser && currentUser.isDeveloper && !manageAccountsModalOverlay.classList.contains('hidden')) {
          loadAccounts();
        }
        if (activeDmFriend && activeDmFriend.id === msg.userId) {
          activeDmFriend.isDeleted = true;
          dmActiveFriendName.textContent = 'Deleted User';
          dmWelcomeTitle.textContent = 'Deleted User';
        }
      } else if (msg.type === 'incoming_call') {
        handleIncomingCall(msg);
      } else if (msg.type === 'call_outgoing') {
        handleCallOutgoing(msg);
      } else if (msg.type === 'call_accepted') {
        handleCallAccepted(msg);
      } else if (msg.type === 'call_connected') {
        handleCallConnected(msg);
      } else if (msg.type === 'call_declined') {
        handleCallDeclined(msg);
      } else if (msg.type === 'call_ended') {
        handleCallEnded(msg);
      } else if (msg.type === 'call_error') {
        handleCallError(msg);
      } else if (msg.type === 'webrtc_offer') {
        handleWebRtcOffer(msg);
      } else if (msg.type === 'webrtc_answer') {
        handleWebRtcAnswer(msg);
      } else if (msg.type === 'webrtc_ice_candidate') {
        handleWebRtcIceCandidate(msg);
      } else if (msg.type === 'video_state') {
        handleRemoteVideoState(msg);
      } else if (msg.type === 'feedback_created') {
        if (typeof handleFeedbackCreatedEvent === 'function') {
          handleFeedbackCreatedEvent(msg.feedback);
        }
      } else if (msg.type === 'feedback_updated') {
        if (typeof handleFeedbackUpdatedEvent === 'function') {
          handleFeedbackUpdatedEvent(msg.feedback);
        }
      } else if (msg.type === 'feedback_deleted') {
        if (typeof handleFeedbackDeletedEvent === 'function') {
          handleFeedbackDeletedEvent(msg.feedbackId);
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

// File Attachment Event Listeners - Channel Chat
if (attachFileBtn && fileInput) {
  attachFileBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      alert(`File "${file.name}" is too large (${formatBytes(file.size)}).\n\nMaximum allowed file size is 100MB.`);
      fileInput.value = '';
      return;
    }

    pendingChannelFile = file;
    pendingFileName.textContent = file.name;
    pendingFileSize.textContent = `(${formatBytes(file.size)})`;
    pendingAttachmentBar.classList.remove('hidden');
    messageInput.focus();
  });
}

if (removeAttachmentBtn) {
  removeAttachmentBtn.addEventListener('click', () => {
    pendingChannelFile = null;
    if (fileInput) fileInput.value = '';
    pendingAttachmentBar.classList.add('hidden');
  });
}

// File Attachment Event Listeners - DM Chat
if (dmAttachFileBtn && dmFileInput) {
  dmAttachFileBtn.addEventListener('click', () => {
    dmFileInput.click();
  });

  dmFileInput.addEventListener('change', () => {
    const file = dmFileInput.files[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      alert(`File "${file.name}" is too large (${formatBytes(file.size)}).\n\nMaximum allowed file size is 100MB.`);
      dmFileInput.value = '';
      return;
    }

    pendingDmFile = file;
    dmPendingFileName.textContent = file.name;
    dmPendingFileSize.textContent = `(${formatBytes(file.size)})`;
    dmPendingAttachmentBar.classList.remove('hidden');
    dmMessageInput.focus();
  });
}

if (dmRemoveAttachmentBtn) {
  dmRemoveAttachmentBtn.addEventListener('click', () => {
    pendingDmFile = null;
    if (dmFileInput) dmFileInput.value = '';
    dmPendingAttachmentBar.classList.add('hidden');
  });
}

function appendMessage(msg, shouldScroll = true) {
  const isDeleted = Boolean(msg.isDeleted || msg.authorName === 'Deleted User');
  const authorName = isDeleted ? 'Deleted User' : (msg.authorName || 'Anonymous');
  const authorUsername = isDeleted ? '@deleted' : (msg.authorUsername ? `@${msg.authorUsername}` : '');
  const timeFormatted = formatTime(msg.timestamp);
  const devBadgeHtml = (msg.isDeveloper && !isDeleted) ? '<span class="dev-badge">DEV</span>' : '';
  const userClass = isDeleted ? '' : ' clickable-user';

  const avatarHtml = createAvatarHtml({
    avatarUrl: isDeleted ? null : msg.authorAvatarUrl,
    displayName: isDeleted ? '?' : authorName,
    username: isDeleted ? 'deleted' : msg.authorUsername,
    className: 'message-avatar' + userClass
  });

  const textHtml = msg.content ? `<div class="message-text">${escapeHtml(msg.content)}</div>` : '';
  const attachmentHtml = renderAttachmentHtml(msg);

  const item = document.createElement('div');
  item.className = 'message-item';
  item.innerHTML = `
    ${avatarHtml}
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author${userClass}">${escapeHtml(authorName)}</span>
        ${devBadgeHtml}
        <span class="message-username${userClass}">${escapeHtml(authorUsername)}</span>
        <span class="message-time">${escapeHtml(timeFormatted)}</span>
      </div>
      ${textHtml}
      ${attachmentHtml}
    </div>
  `;

  if (msg.authorId && !isDeleted) {
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

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  const fileToUpload = pendingChannelFile;

  if (!content && !fileToUpload) return;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    alert('Not connected to the chat server. Please ensure the server is running.');
    return;
  }

  const sendBtn = chatForm.querySelector('#sendBtn');
  if (sendBtn) sendBtn.disabled = true;

  try {
    let fileMeta = null;
    if (fileToUpload) {
      fileMeta = await uploadFileStream(fileToUpload, {
        serverId: activeServerId,
        channelId: activeChannelId
      });
      pendingChannelFile = null;
      if (fileInput) fileInput.value = '';
      pendingAttachmentBar.classList.add('hidden');
    }

    socket.send(JSON.stringify({
      type: 'chat',
      content: content,
      file: fileMeta
    }));

    messageInput.value = '';
    messageInput.focus();
  } catch (err) {
    alert('Upload failed: ' + err.message);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
});

function appendDmMessage(msg, shouldScroll = true) {
  const isDeleted = Boolean(msg.isDeleted || msg.authorName === 'Deleted User');
  const authorName = isDeleted ? 'Deleted User' : (msg.authorName || 'User');
  const authorUsername = isDeleted ? '@deleted' : (msg.authorUsername ? `@${msg.authorUsername}` : '');
  const timeFormatted = formatTime(msg.timestamp);
  const devBadgeHtml = (msg.isDeveloper && !isDeleted) ? '<span class="dev-badge">DEV</span>' : '';
  const userClass = isDeleted ? '' : ' clickable-user';

  const avatarHtml = createAvatarHtml({
    avatarUrl: isDeleted ? null : msg.authorAvatarUrl,
    displayName: isDeleted ? '?' : authorName,
    username: isDeleted ? 'deleted' : msg.authorUsername,
    className: 'message-avatar' + userClass
  });

  const textHtml = msg.content ? `<div class="message-text">${escapeHtml(msg.content)}</div>` : '';
  const attachmentHtml = renderAttachmentHtml(msg);

  const item = document.createElement('div');
  item.className = 'message-item';
  item.innerHTML = `
    ${avatarHtml}
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author${userClass}">${escapeHtml(authorName)}</span>
        ${devBadgeHtml}
        <span class="message-username${userClass}">${escapeHtml(authorUsername)}</span>
        <span class="message-time">${escapeHtml(timeFormatted)}</span>
      </div>
      ${textHtml}
      ${attachmentHtml}
    </div>
  `;

  const authorId = msg.authorId || msg.senderId;
  if (authorId && !isDeleted) {
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
  dmChatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = dmMessageInput.value.trim();
    const fileToUpload = pendingDmFile;

    if ((!content && !fileToUpload) || !activeDmFriend) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('Not connected to the chat server. Please ensure the server is running.');
      return;
    }

    const sendBtn = dmChatForm.querySelector('#dmSendBtn');
    if (sendBtn) sendBtn.disabled = true;

    try {
      let fileMeta = null;
      if (fileToUpload) {
        fileMeta = await uploadFileStream(fileToUpload, {
          dmFriendId: activeDmFriend.id
        });
        pendingDmFile = null;
        if (dmFileInput) dmFileInput.value = '';
        dmPendingAttachmentBar.classList.add('hidden');
      }

      socket.send(JSON.stringify({
        type: 'direct_message',
        friendId: activeDmFriend.id,
        content: content,
        file: fileMeta
      }));

      dmMessageInput.value = '';
      dmMessageInput.focus();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  });
}

// Lightweight periodic sync fallback (every 4s) to ensure instant updates even on brief WS sleep
setInterval(() => {
  if (token && currentUser) {
    loadFriends();
  }
}, 4000);

// ==========================================
// STAGE 3c-1: 1-ON-1 WEBRTC VOICE CALLING
// ==========================================

// Web Audio sound synthesizer (Zero external dependencies)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

let ringInterval = null;

function startOutgoingRingtone() {
  stopAllRingtones();
  const ctx = getAudioContext();
  if (!ctx) return;
  const playBeep = () => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  };
  playBeep();
  ringInterval = setInterval(playBeep, 2800);
}

function startIncomingRingtone() {
  stopAllRingtones();
  const ctx = getAudioContext();
  if (!ctx) return;
  const playRing = () => {
    try {
      const now = ctx.currentTime;
      [440, 480].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
      });
    } catch {}
  };
  playRing();
  ringInterval = setInterval(playRing, 2500);
}

function stopAllRingtones() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
}

function playCallChime(type) {
  stopAllRingtones();
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    gain.connect(ctx.destination);
    osc.connect(gain);

    if (type === 'connect') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'end') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {}
}

// WebRTC Configuration
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

let currentCall = {
  callId: null,
  partner: null,
  role: null,
  status: 'idle', // 'idle' | 'calling' | 'ringing' | 'connected'
  peerConnection: null,
  localStream: null,
  localVideoTrack: null,
  videoSender: null,
  isVideoEnabled: false,
  remoteVideoEnabled: false,
  isMuted: false,
  isTheaterOpen: false,
  timerInterval: null,
  seconds: 0
};

let pendingIceCandidates = [];

// Start an outgoing voice/video call
async function initiateVoiceCall(friend) {
  if (!friend || !friend.id) return;

  if (currentCall.status !== 'idle') {
    alert('You are already in a call.');
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Voice and video calling requires device access, which is not supported in this browser or over insecure HTTP. Use localhost or HTTPS.');
    return;
  }

  try {
    currentCall.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch (err) {
    alert('Could not access microphone: ' + (err.message || err.name) + '\nPlease ensure microphone permissions are granted in your browser settings.');
    return;
  }

  currentCall.partner = friend;
  currentCall.role = 'caller';
  currentCall.status = 'calling';
  currentCall.isMuted = false;
  currentCall.isVideoEnabled = false;
  currentCall.remoteVideoEnabled = false;
  pendingIceCandidates = [];

  // Show active call widget in "Calling..." state
  renderAvatarInto(callPartnerAvatar, friend);
  callPartnerName.textContent = friend.displayName || friend.username;
  callStatusText.textContent = 'Calling...';
  callTimerText.textContent = '00:00';
  updateMuteButtonUI();
  updateCameraButtonsUI();
  activeCallWidget.classList.remove('hidden');

  startOutgoingRingtone();

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'call_user',
      targetUserId: friend.id
    }));
  } else {
    endVoiceCall(false);
    alert('Not connected to the chat server.');
  }
}

// Server confirmed the target is ringing
function handleCallOutgoing(msg) {
  currentCall.callId = msg.callId;
  currentCall.partner = msg.target;
  callStatusText.textContent = 'Ringing...';
}

// Callee receives incoming call notification
function handleIncomingCall(msg) {
  // If already in a call, automatically decline with busy
  if (currentCall.status !== 'idle') {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'call_decline', callId: msg.callId }));
    }
    return;
  }

  currentCall.callId = msg.callId;
  currentCall.partner = msg.caller;
  currentCall.role = 'callee';
  currentCall.status = 'ringing';
  currentCall.isVideoEnabled = false;
  currentCall.remoteVideoEnabled = false;
  pendingIceCandidates = [];

  renderAvatarInto(incomingCallAvatar, msg.caller);
  incomingCallName.textContent = msg.caller.displayName || msg.caller.username;
  incomingCallHandle.textContent = '@' + msg.caller.username;
  incomingCallModalOverlay.classList.remove('hidden');

  startIncomingRingtone();
}

// Callee clicks Accept
async function acceptIncomingCall() {
  if (!currentCall.callId) return;

  stopAllRingtones();
  incomingCallModalOverlay.classList.add('hidden');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Calling requires microphone access, which is not supported in this browser or over insecure HTTP.');
    declineIncomingCall();
    return;
  }

  try {
    currentCall.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch (err) {
    alert('Could not access microphone: ' + (err.message || err.name));
    declineIncomingCall();
    return;
  }

  // Show active call widget
  renderAvatarInto(callPartnerAvatar, currentCall.partner);
  callPartnerName.textContent = currentCall.partner.displayName || currentCall.partner.username;
  callStatusText.textContent = 'Connecting...';
  callTimerText.textContent = '00:00';
  updateMuteButtonUI();
  updateCameraButtonsUI();
  activeCallWidget.classList.remove('hidden');

  setupPeerConnection(false);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'call_accept',
      callId: currentCall.callId
    }));
  }
}

// Callee clicks Decline
function declineIncomingCall() {
  stopAllRingtones();
  incomingCallModalOverlay.classList.add('hidden');

  if (currentCall.callId && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'call_decline',
      callId: currentCall.callId
    }));
  }

  currentCall.callId = null;
  currentCall.partner = null;
  currentCall.role = null;
  currentCall.status = 'idle';
}

// Caller receives notification that Callee accepted
async function handleCallAccepted(msg) {
  stopAllRingtones();
  playCallChime('connect');

  callStatusText.textContent = 'Connecting...';
  setupPeerConnection(true);

  try {
    const offer = await currentCall.peerConnection.createOffer();
    await currentCall.peerConnection.setLocalDescription(offer);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'webrtc_offer',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        sdp: offer
      }));
    }
  } catch (err) {
    console.error('Error creating WebRTC offer:', err);
    endVoiceCall(true);
  }
}

// Callee receives call_connected confirmation
function handleCallConnected(msg) {
  stopAllRingtones();
  callStatusText.textContent = 'Connecting...';
}

// Caller receives notification that Callee declined
function handleCallDeclined(msg) {
  stopAllRingtones();
  playCallChime('end');
  showToast({
    icon: '📞',
    title: 'Call Declined',
    body: msg.message || 'Call was declined.',
    duration: 3500
  });
  endVoiceCall(false);
}

// Either side receives call ended (hangup or disconnect)
function handleCallEnded(msg) {
  stopAllRingtones();
  playCallChime('end');
  showToast({
    icon: '📞',
    title: 'Call Ended',
    body: msg.reason === 'partner_disconnected' ? 'Friend disconnected.' : 'Call ended.',
    duration: 3000
  });
  endVoiceCall(false);
}

// Error initiating or during call
function handleCallError(msg) {
  stopAllRingtones();
  playCallChime('end');
  alert(msg.message || 'Could not place call.');
  endVoiceCall(false);
}

// Setup RTCPeerConnection and audio/video streams
function setupPeerConnection(isCaller = true) {
  if (currentCall.peerConnection) {
    try { currentCall.peerConnection.close(); } catch {}
  }

  const pc = new RTCPeerConnection(rtcConfig);
  currentCall.peerConnection = pc;

  if (isCaller) {
    // Caller adds transceivers for both audio and video upfront so they appear in Offer
    const audioTransceiver = pc.addTransceiver('audio', { direction: 'sendrecv' });
    const videoTransceiver = pc.addTransceiver('video', { direction: 'sendrecv' });
    currentCall.videoSender = videoTransceiver.sender;

    if (currentCall.localStream) {
      const audioTrack = currentCall.localStream.getAudioTracks()[0];
      if (audioTrack && audioTransceiver.sender) {
        audioTransceiver.sender.replaceTrack(audioTrack);
      }
    }

    if (currentCall.localVideoTrack && currentCall.videoSender) {
      currentCall.videoSender.replaceTrack(currentCall.localVideoTrack);
    }
  }

  pc.onicecandidate = (event) => {
    if (event.candidate && currentCall.callId && currentCall.partner && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'webrtc_ice_candidate',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        candidate: event.candidate
      }));
    }
  };

  pc.ontrack = (event) => {
    if (event.track.kind === 'audio') {
      const stream = (event.streams && event.streams[0]) ? event.streams[0] : new MediaStream([event.track]);
      currentCall.remoteAudioStream = stream;
      if (remoteVoiceAudio) {
        remoteVoiceAudio.srcObject = stream;
        remoteVoiceAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
      }
    } else if (event.track.kind === 'video') {
      currentCall.remoteVideoTrack = event.track;
      let stream = (event.streams && event.streams[0]) ? event.streams[0] : null;
      if (!stream) {
        stream = new MediaStream([event.track]);
      }
      currentCall.remoteVideoStream = stream;
      attachRemoteVideoFeed();

      event.track.onunmute = () => {
        attachRemoteVideoFeed();
      };
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      onCallEstablished();
    } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
      console.warn('WebRTC peer connection state:', pc.connectionState);
    }
  };
}

// Safely attach and play remote video feed
function attachRemoteVideoFeed() {
  if (!remoteVideoFeed || !currentCall.peerConnection) return;

  let stream = currentCall.remoteVideoStream;
  if (!stream) {
    const videoReceiver = currentCall.peerConnection.getReceivers().find(r => r.track && r.track.kind === 'video');
    if (videoReceiver && videoReceiver.track) {
      currentCall.remoteVideoTrack = videoReceiver.track;
      stream = new MediaStream([videoReceiver.track]);
      currentCall.remoteVideoStream = stream;
    }
  }

  if (stream) {
    if (remoteVideoFeed.srcObject !== stream) {
      remoteVideoFeed.srcObject = stream;
    }
    remoteVideoFeed.muted = true;
    const playPromise = remoteVideoFeed.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => console.warn('[Voiceline] Remote video play error:', e));
    }
  }
}

// Callee handles Offer from Caller
async function handleWebRtcOffer(msg) {
  if (!currentCall.peerConnection) {
    setupPeerConnection(false);
  }

  try {
    await currentCall.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    await flushPendingIceCandidates();

    // On Callee, match the transceivers created by setRemoteDescription from the Offer
    const audioTransceiver = currentCall.peerConnection.getTransceivers().find(t => t.receiver && t.receiver.track && t.receiver.track.kind === 'audio');
    const videoTransceiver = currentCall.peerConnection.getTransceivers().find(t => t.receiver && t.receiver.track && t.receiver.track.kind === 'video');

    if (audioTransceiver) {
      audioTransceiver.direction = 'sendrecv';
      if (currentCall.localStream) {
        const audioTrack = currentCall.localStream.getAudioTracks()[0];
        if (audioTrack && audioTransceiver.sender) {
          await audioTransceiver.sender.replaceTrack(audioTrack);
        }
      }
    }

    if (videoTransceiver) {
      videoTransceiver.direction = 'sendrecv';
      currentCall.videoSender = videoTransceiver.sender;
      if (currentCall.localVideoTrack && videoTransceiver.sender) {
        await videoTransceiver.sender.replaceTrack(currentCall.localVideoTrack);
      }
    }

    const answer = await currentCall.peerConnection.createAnswer();
    await currentCall.peerConnection.setLocalDescription(answer);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'webrtc_answer',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        sdp: answer
      }));
    }

    attachRemoteVideoFeed();
    playCallChime('connect');
    onCallEstablished();
  } catch (err) {
    console.error('Error handling WebRTC offer:', err);
    endVoiceCall(true);
  }
}

// Caller handles Answer from Callee
async function handleWebRtcAnswer(msg) {
  if (!currentCall.peerConnection) return;

  try {
    await currentCall.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    await flushPendingIceCandidates();
    attachRemoteVideoFeed();
    onCallEstablished();
  } catch (err) {
    console.error('Error handling WebRTC answer:', err);
    endVoiceCall(true);
  }
}

// Handling ICE candidates with queueing
async function handleWebRtcIceCandidate(msg) {
  if (!currentCall.peerConnection) return;

  if (!currentCall.peerConnection.remoteDescription || !currentCall.peerConnection.remoteDescription.type) {
    pendingIceCandidates.push(msg.candidate);
    return;
  }

  try {
    await currentCall.peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
  } catch (err) {
    console.error('Error adding ICE candidate:', err);
  }
}

async function flushPendingIceCandidates() {
  if (!currentCall.peerConnection || !currentCall.peerConnection.remoteDescription) return;
  while (pendingIceCandidates.length > 0) {
    const candidate = pendingIceCandidates.shift();
    try {
      await currentCall.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error flushing ICE candidate:', err);
    }
  }
}

// Call is officially connected
function onCallEstablished() {
  currentCall.status = 'connected';
  callStatusText.textContent = 'Connected';
  if (theaterStatusBadge) theaterStatusBadge.textContent = 'Connected';

  if (!currentCall.timerInterval) {
    currentCall.seconds = 0;
    currentCall.timerInterval = setInterval(() => {
      currentCall.seconds++;
      const mins = String(Math.floor(currentCall.seconds / 60)).padStart(2, '0');
      const secs = String(currentCall.seconds % 60).padStart(2, '0');
      const timeStr = `${mins}:${secs}`;
      callTimerText.textContent = timeStr;
      if (theaterTimerText) theaterTimerText.textContent = timeStr;
    }, 1000);
  }
}

// Toggle Camera (Turn video on/off dynamically via replaceTrack)
async function toggleCamera() {
  if (currentCall.status !== 'connected' && currentCall.status !== 'calling' && currentCall.status !== 'ringing') {
    return;
  }

  if (currentCall.isVideoEnabled) {
    // Turn camera OFF
    if (currentCall.localVideoTrack) {
      try { currentCall.localVideoTrack.stop(); } catch {}
      currentCall.localVideoTrack = null;
    }

    currentCall.isVideoEnabled = false;

    let sender = currentCall.videoSender;
    if (!sender && currentCall.peerConnection) {
      const vt = currentCall.peerConnection.getTransceivers().find(t => t.sender && (t.sender.track?.kind === 'video' || t.receiver?.track?.kind === 'video'));
      if (vt) {
        sender = vt.sender;
        currentCall.videoSender = sender;
      }
    }
    if (sender) {
      try { await sender.replaceTrack(null); } catch {}
    }

    if (localVideoFeed) {
      localVideoFeed.srcObject = null;
      localVideoFeed.classList.add('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.remove('hidden');

    updateCameraButtonsUI();

    if (socket && socket.readyState === WebSocket.OPEN && currentCall.callId && currentCall.partner) {
      socket.send(JSON.stringify({
        type: 'video_state',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        enabled: false
      }));
    }
  } else {
    // Turn camera ON
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported by your browser in this context (requires localhost or HTTPS). Audio call continues normally.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const track = stream.getVideoTracks()[0];
      if (!track) throw new Error('No video track available');

      currentCall.localVideoTrack = track;
      currentCall.isVideoEnabled = true;

      if (localVideoFeed) {
        localVideoFeed.srcObject = stream;
        localVideoFeed.muted = true;
        localVideoFeed.play().catch(e => console.warn('Local preview play error:', e));
        localVideoFeed.classList.remove('hidden');
      }
      if (selfCameraOffState) selfCameraOffState.classList.add('hidden');

      let sender = currentCall.videoSender;
      if (!sender && currentCall.peerConnection) {
        const vt = currentCall.peerConnection.getTransceivers().find(t => t.sender && (t.sender.track?.kind === 'video' || t.receiver?.track?.kind === 'video'));
        if (vt) {
          sender = vt.sender;
          currentCall.videoSender = sender;
        }
      }

      if (sender) {
        await sender.replaceTrack(track);
      }

      updateCameraButtonsUI();

      if (socket && socket.readyState === WebSocket.OPEN && currentCall.callId && currentCall.partner) {
        socket.send(JSON.stringify({
          type: 'video_state',
          callId: currentCall.callId,
          targetUserId: currentCall.partner.id,
          enabled: true
        }));
      }

      // Automatically open the video theater mode when turning on camera
      openVideoTheater();
    } catch (err) {
      console.warn('Camera access failed:', err);
      alert('Could not access camera (' + (err.message || 'no camera found or permission denied') + ').\n\nAudio call continues normally.');
    }
  }
}

// Handle remote peer toggling camera on or off
function handleRemoteVideoState(msg) {
  currentCall.remoteVideoEnabled = Boolean(msg.enabled);
  if (msg.enabled) {
    attachRemoteVideoFeed();
    if (remoteVideoFeed) remoteVideoFeed.classList.remove('hidden');
    if (remoteCameraOffState) remoteCameraOffState.classList.add('hidden');
    openVideoTheater();
  } else {
    if (remoteVideoFeed) remoteVideoFeed.classList.add('hidden');
    if (remoteCameraOffState) remoteCameraOffState.classList.remove('hidden');
  }
}

// Open Video Theater Modal
function openVideoTheater() {
  if (!currentCall.partner || !activeCallTheaterOverlay) return;
  activeCallTheaterOverlay.classList.remove('hidden');
  currentCall.isTheaterOpen = true;

  theaterPartnerName.textContent = currentCall.partner.displayName || currentCall.partner.username;
  theaterPartnerHandle.textContent = '@' + currentCall.partner.username;
  theaterCamOffTitle.textContent = currentCall.partner.displayName || currentCall.partner.username;
  renderAvatarInto(theaterPartnerAvatar, currentCall.partner);
  if (currentUser && selfPipAvatar) renderAvatarInto(selfPipAvatar, currentUser);

  // Sync remote video vs placeholder
  if (currentCall.remoteVideoEnabled) {
    attachRemoteVideoFeed();
    if (remoteVideoFeed) remoteVideoFeed.classList.remove('hidden');
    if (remoteCameraOffState) remoteCameraOffState.classList.add('hidden');
  } else {
    if (remoteVideoFeed) remoteVideoFeed.classList.add('hidden');
    if (remoteCameraOffState) remoteCameraOffState.classList.remove('hidden');
  }

  // Sync self preview vs placeholder
  if (currentCall.isVideoEnabled && currentCall.localVideoTrack) {
    if (localVideoFeed) {
      localVideoFeed.muted = true;
      localVideoFeed.play().catch(e => console.warn('Local preview play error:', e));
      localVideoFeed.classList.remove('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.add('hidden');
  } else {
    if (localVideoFeed) localVideoFeed.classList.add('hidden');
    if (selfCameraOffState) selfCameraOffState.classList.remove('hidden');
  }
}

function closeVideoTheater() {
  if (activeCallTheaterOverlay) activeCallTheaterOverlay.classList.add('hidden');
  currentCall.isTheaterOpen = false;
}

// Toggle Mute / Unmute
function toggleMute() {
  if (!currentCall.localStream) return;
  const audioTrack = currentCall.localStream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    currentCall.isMuted = !audioTrack.enabled;
    updateMuteButtonUI();
  }
}

function updateMuteButtonUI() {
  const muted = currentCall.isMuted;
  if (muted) {
    if (callMuteBtn) {
      callMuteBtn.classList.add('is-muted');
      micIconUnmuted.classList.add('hidden');
      micIconMuted.classList.remove('hidden');
      callMuteBtnLabel.textContent = 'Unmute';
    }
    if (theaterMuteBtn) {
      theaterMuteBtn.classList.add('is-muted');
      theaterMicIconUnmuted.classList.add('hidden');
      theaterMicIconMuted.classList.remove('hidden');
      theaterMuteBtnLabel.textContent = 'Unmute';
    }
  } else {
    if (callMuteBtn) {
      callMuteBtn.classList.remove('is-muted');
      micIconUnmuted.classList.remove('hidden');
      micIconMuted.classList.add('hidden');
      callMuteBtnLabel.textContent = 'Mute';
    }
    if (theaterMuteBtn) {
      theaterMuteBtn.classList.remove('is-muted');
      theaterMicIconUnmuted.classList.remove('hidden');
      theaterMicIconMuted.classList.add('hidden');
      theaterMuteBtnLabel.textContent = 'Mute';
    }
  }
}

function updateCameraButtonsUI() {
  const on = currentCall.isVideoEnabled;
  if (on) {
    if (callCameraBtn) {
      callCameraBtn.classList.add('is-active');
      cameraIconOff.classList.add('hidden');
      cameraIconOn.classList.remove('hidden');
      callCameraBtnLabel.textContent = 'Camera On';
    }
    if (theaterCameraBtn) {
      theaterCameraBtn.classList.add('is-active');
      theaterCameraIconOff.classList.add('hidden');
      theaterCameraIconOn.classList.remove('hidden');
      theaterCameraBtnLabel.textContent = 'Turn Off Camera';
    }
  } else {
    if (callCameraBtn) {
      callCameraBtn.classList.remove('is-active');
      cameraIconOff.classList.remove('hidden');
      cameraIconOn.classList.add('hidden');
      callCameraBtnLabel.textContent = 'Camera';
    }
    if (theaterCameraBtn) {
      theaterCameraBtn.classList.remove('is-active');
      theaterCameraIconOff.classList.remove('hidden');
      theaterCameraIconOn.classList.add('hidden');
      theaterCameraBtnLabel.textContent = 'Turn On Camera';
    }
  }
}

// Cleanly terminate call
function endVoiceCall(shouldNotify = true) {
  stopAllRingtones();

  if (shouldNotify && currentCall.callId && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'call_end',
      callId: currentCall.callId
    }));
  }

  if (currentCall.localStream) {
    currentCall.localStream.getTracks().forEach(track => {
      try { track.stop(); } catch {}
    });
    currentCall.localStream = null;
  }

  if (currentCall.localVideoTrack) {
    try { currentCall.localVideoTrack.stop(); } catch {}
    currentCall.localVideoTrack = null;
  }

  if (currentCall.peerConnection) {
    try { currentCall.peerConnection.close(); } catch {}
    currentCall.peerConnection = null;
  }

  if (remoteVoiceAudio) remoteVoiceAudio.srcObject = null;
  if (remoteVideoFeed) remoteVideoFeed.srcObject = null;
  if (localVideoFeed) localVideoFeed.srcObject = null;

  if (currentCall.timerInterval) {
    clearInterval(currentCall.timerInterval);
    currentCall.timerInterval = null;
  }

  currentCall.callId = null;
  currentCall.partner = null;
  currentCall.role = null;
  currentCall.status = 'idle';
  currentCall.isMuted = false;
  currentCall.isVideoEnabled = false;
  currentCall.remoteVideoEnabled = false;
  currentCall.remoteVideoStream = null;
  currentCall.remoteVideoTrack = null;
  currentCall.videoSender = null;
  currentCall.isTheaterOpen = false;
  currentCall.seconds = 0;
  pendingIceCandidates = [];

  updateMuteButtonUI();
  updateCameraButtonsUI();

  if (activeCallWidget) activeCallWidget.classList.add('hidden');
  if (activeCallTheaterOverlay) activeCallTheaterOverlay.classList.add('hidden');
  if (incomingCallModalOverlay) incomingCallModalOverlay.classList.add('hidden');
}

// Voice & Video Calling Event Listeners
if (acceptCallBtn) {
  acceptCallBtn.addEventListener('click', acceptIncomingCall);
}

if (declineCallBtn) {
  declineCallBtn.addEventListener('click', declineIncomingCall);
}

if (callMuteBtn) {
  callMuteBtn.addEventListener('click', toggleMute);
}

if (theaterMuteBtn) {
  theaterMuteBtn.addEventListener('click', toggleMute);
}

if (callCameraBtn) {
  callCameraBtn.addEventListener('click', toggleCamera);
}

if (theaterCameraBtn) {
  theaterCameraBtn.addEventListener('click', toggleCamera);
}

if (callExpandTheaterBtn) {
  callExpandTheaterBtn.addEventListener('click', openVideoTheater);
}

if (theaterMinimizeBtn) {
  theaterMinimizeBtn.addEventListener('click', closeVideoTheater);
}

if (callHangupBtn) {
  callHangupBtn.addEventListener('click', () => {
    playCallChime('end');
    endVoiceCall(true);
  });
}

if (theaterHangupBtn) {
  theaterHangupBtn.addEventListener('click', () => {
    playCallChime('end');
    endVoiceCall(true);
  });
}

// ==========================================
// TOP PROMOTIONAL BANNER & NITRO EASTER EGG
// ==========================================
const globalPromoBanner = document.getElementById('globalPromoBanner');
const promoClaimBtn = document.getElementById('promoClaimBtn');
const promoCloseBtn = document.getElementById('promoCloseBtn');
const easterEggOfferModalOverlay = document.getElementById('easterEggOfferModalOverlay');
const closeEasterEggBtn = document.getElementById('closeEasterEggBtn');
const dismissEasterEggBtn = document.getElementById('dismissEasterEggBtn');

function closeEasterEgg() {
  if (easterEggOfferModalOverlay) {
    easterEggOfferModalOverlay.classList.add('hidden');
  }
}

function initPromoBanner() {
  if (!globalPromoBanner) return;

  const isDismissed = localStorage.getItem('voiceline_promo_banner_dismissed') === 'true';
  if (isDismissed) {
    globalPromoBanner.classList.add('dismissed');
    document.documentElement.classList.add('promo-dismissed');
  }

  if (promoCloseBtn) {
    promoCloseBtn.addEventListener('click', () => {
      localStorage.setItem('voiceline_promo_banner_dismissed', 'true');
      document.documentElement.classList.add('promo-dismissed');
      globalPromoBanner.classList.add('dismissed');
    });
  }

  if (promoClaimBtn) {
    promoClaimBtn.addEventListener('click', () => {
      if (easterEggOfferModalOverlay) {
        easterEggOfferModalOverlay.classList.remove('hidden');
      }
    });
  }

  if (closeEasterEggBtn) closeEasterEggBtn.addEventListener('click', closeEasterEgg);
  if (dismissEasterEggBtn) dismissEasterEggBtn.addEventListener('click', closeEasterEgg);
  if (easterEggOfferModalOverlay) {
    easterEggOfferModalOverlay.addEventListener('click', (e) => {
      if (e.target === easterEggOfferModalOverlay) closeEasterEgg();
    });
  }
}

// ==========================================
// COMMUNITY FEEDBACK FORUM & COMPOSER
// ==========================================
const feedbackModalOverlay = document.getElementById('feedbackModalOverlay');
const closeFeedbackModalBtn = document.getElementById('closeFeedbackModalBtn');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackContentInput = document.getElementById('feedbackContentInput');
const feedbackCharCount = document.getElementById('feedbackCharCount');
const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
const feedbackSubmitSpinner = document.getElementById('feedbackSubmitSpinner');
const feedbackSubmitSuccess = document.getElementById('feedbackSubmitSuccess');
const feedbackSubmitError = document.getElementById('feedbackSubmitError');
const refreshFeedbackBtn = document.getElementById('refreshFeedbackBtn');
const feedbackItemsList = document.getElementById('feedbackItemsList');
const feedbackEmptyState = document.getElementById('feedbackEmptyState');
const feedbackLoadingState = document.getElementById('feedbackLoadingState');

const feedbackCountAll = document.getElementById('feedbackCountAll');
const feedbackCountPending = document.getElementById('feedbackCountPending');
const feedbackCountConsidering = document.getElementById('feedbackCountConsidering');
const feedbackCountAccepted = document.getElementById('feedbackCountAccepted');
const feedbackCountDenied = document.getElementById('feedbackCountDenied');
const feedbackCountAcceptedAlreadyExists = document.getElementById('feedbackCountAcceptedAlreadyExists');
const feedbackCountAlreadyExists = document.getElementById('feedbackCountAlreadyExists');

let communityFeedbackList = [];
let userHasSubmittedFeedback = false;
let currentFeedbackFilter = 'all';
let isSubmittingFeedback = false;

function formatRelativeTime(isoString) {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 45) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

function updateFeedbackButtonGlow() {
  const btns = document.querySelectorAll('.top-feedback-btn');
  const shouldGlow = Boolean(token && currentUser && !userHasSubmittedFeedback);
  btns.forEach(btn => {
    if (btn) {
      btn.classList.toggle('has-unsubmitted-glow', shouldGlow);
    }
  });
}

async function checkFeedbackStatus() {
  if (!token) {
    updateFeedbackButtonGlow();
    return;
  }
  try {
    const res = await fetch('/api/feedback', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      communityFeedbackList = Array.isArray(data.feedback) ? data.feedback : [];
      userHasSubmittedFeedback = Boolean(data.hasSubmitted);
      updateFeedbackButtonGlow();
      if (feedbackModalOverlay && !feedbackModalOverlay.classList.contains('hidden')) {
        renderFeedbackList();
      }
    }
  } catch (err) {
    console.error('Failed to check feedback status:', err);
  }
}

function openFeedbackModal() {
  if (!feedbackModalOverlay) return;
  feedbackModalOverlay.classList.remove('hidden');
  if (feedbackSubmitSuccess) feedbackSubmitSuccess.classList.add('hidden');
  if (feedbackSubmitError) feedbackSubmitError.classList.add('hidden');
  renderFeedbackList();
  if (token) {
    checkFeedbackStatus();
  }
  if (feedbackContentInput) {
    setTimeout(() => feedbackContentInput.focus(), 100);
  }
}

function closeFeedbackModal() {
  if (feedbackModalOverlay) {
    feedbackModalOverlay.classList.add('hidden');
  }
}

function updateFilterCounts() {
  const counts = {
    all: communityFeedbackList.length,
    pending: 0,
    considering: 0,
    accepted: 0,
    denied: 0,
    accepted_already_exists: 0,
    already_exists: 0
  };
  communityFeedbackList.forEach(item => {
    const st = (item.status || 'pending').toLowerCase();
    if (counts[st] !== undefined) counts[st]++;
  });
  if (feedbackCountAll) feedbackCountAll.textContent = counts.all;
  if (feedbackCountPending) feedbackCountPending.textContent = counts.pending;
  if (feedbackCountConsidering) feedbackCountConsidering.textContent = counts.considering;
  if (feedbackCountAccepted) feedbackCountAccepted.textContent = counts.accepted;
  if (feedbackCountDenied) feedbackCountDenied.textContent = counts.denied;
  if (feedbackCountAcceptedAlreadyExists) feedbackCountAcceptedAlreadyExists.textContent = counts.accepted_already_exists;
  if (feedbackCountAlreadyExists) feedbackCountAlreadyExists.textContent = counts.already_exists;
}

function renderFeedbackList() {
  if (!feedbackItemsList) return;

  if (feedbackLoadingState) feedbackLoadingState.classList.add('hidden');
  updateFilterCounts();

  let filtered = communityFeedbackList;
  if (currentFeedbackFilter !== 'all') {
    filtered = communityFeedbackList.filter(f => (f.status || 'pending').toLowerCase() === currentFeedbackFilter);
  }

  if (filtered.length === 0) {
    feedbackItemsList.innerHTML = '';
    if (feedbackEmptyState) feedbackEmptyState.classList.remove('hidden');
    return;
  }

  if (feedbackEmptyState) feedbackEmptyState.classList.add('hidden');
  feedbackItemsList.innerHTML = '';

  const isDev = Boolean(currentUser && (currentUser.isDeveloper || currentUser.isDev));

  filtered.forEach(f => {
    const card = document.createElement('div');
    card.className = 'feedback-card';
    card.setAttribute('data-id', f.id);

    const st = (f.status || 'pending').toLowerCase();
    const stLabels = {
      pending: '🟡 Pending',
      considering: '🟠 Considering',
      accepted: '🟢 Accepted',
      denied: '🔴 Denied',
      accepted_already_exists: '✨ Accepted & Already Exists',
      already_exists: '💡 Already Exists'
    };
    const stBadgeText = stLabels[st] || '🟡 Pending';
    const relativeTime = formatRelativeTime(f.createdAt);

    const avatarHtml = createAvatarHtml({
      avatarUrl: f.authorAvatarUrl,
      displayName: f.authorName,
      username: f.authorUsername,
      className: 'feedback-author-avatar'
    });

    const devResponseHtml = f.devResponse ? `
      <div class="feedback-dev-response-box">
        <div class="feedback-dev-response-header">
          <span class="feedback-dev-badge">DEVELOPER RESPONSE</span>
          <span class="feedback-dev-author">${escapeHtml(f.devAuthorName || 'Developer')}</span>
        </div>
        <p class="feedback-dev-reply-text">${escapeHtml(f.devResponse)}</p>
      </div>
    ` : '';

    const devActionsHtml = isDev ? `
      <div class="feedback-dev-actions">
        <span class="dev-action-label">Dev Controls:</span>
        <select class="feedback-status-select" data-id="${f.id}">
          <option value="pending" ${st === 'pending' ? 'selected' : ''}>🟡 Pending</option>
          <option value="considering" ${st === 'considering' ? 'selected' : ''}>🟠 Considering</option>
          <option value="accepted" ${st === 'accepted' ? 'selected' : ''}>🟢 Accepted</option>
          <option value="denied" ${st === 'denied' ? 'selected' : ''}>🔴 Denied</option>
          <option value="accepted_already_exists" ${st === 'accepted_already_exists' ? 'selected' : ''}>✨ Accepted & Already Exists</option>
          <option value="already_exists" ${st === 'already_exists' ? 'selected' : ''}>💡 Already Exists</option>
        </select>
        <button type="button" class="dev-action-btn btn-toggle-reply" data-id="${f.id}">
          ${f.devResponse ? 'Edit Response' : 'Reply as Dev'}
        </button>
        <button type="button" class="dev-action-btn danger-action btn-delete-feedback" data-id="${f.id}">
          Delete
        </button>
      </div>
      <div class="feedback-dev-reply-form hidden" id="devReplyForm_${f.id}">
        <textarea class="feedback-dev-reply-textarea" placeholder="Write developer response...">${escapeHtml(f.devResponse || '')}</textarea>
        <div class="feedback-dev-reply-actions">
          <button type="button" class="dev-action-btn btn-cancel-dev-reply" data-id="${f.id}">Cancel</button>
          <button type="button" class="primary-btn btn-sm btn-save-dev-reply" data-id="${f.id}">Save Response</button>
        </div>
      </div>
    ` : '';

    card.innerHTML = `
      <div class="feedback-card-header">
        <div class="feedback-author-row">
          ${avatarHtml}
          <div class="feedback-author-meta">
            <div class="feedback-author-name-row">
              <span class="feedback-author-name">${escapeHtml(f.authorName || 'User')}</span>
              <span class="feedback-author-handle">@${escapeHtml(f.authorUsername || 'user')}</span>
              ${f.isDeveloper ? '<span class="dev-badge">DEV</span>' : ''}
            </div>
            <span class="feedback-timestamp">${escapeHtml(relativeTime)}</span>
          </div>
        </div>
        <div class="status-pill status-${st}">${stBadgeText}</div>
      </div>
      <p class="feedback-card-text">${escapeHtml(f.content)}</p>
      ${devResponseHtml}
      ${devActionsHtml}
    `;

    feedbackItemsList.appendChild(card);
  });

  // Attach Developer listeners
  if (isDev) {
    feedbackItemsList.querySelectorAll('.feedback-status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const id = Number(e.target.getAttribute('data-id'));
        const newStatus = e.target.value;
        const currentItem = communityFeedbackList.find(x => x.id === id);
        await saveFeedbackStatusAndResponse(id, newStatus, currentItem ? currentItem.devResponse : null);
      });
    });

    feedbackItemsList.querySelectorAll('.btn-toggle-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.getAttribute('data-id'));
        const form = document.getElementById(`devReplyForm_${id}`);
        if (form) {
          form.classList.toggle('hidden');
          if (!form.classList.contains('hidden')) {
            const ta = form.querySelector('.feedback-dev-reply-textarea');
            if (ta) ta.focus();
          }
        }
      });
    });

    feedbackItemsList.querySelectorAll('.btn-cancel-dev-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.getAttribute('data-id'));
        const form = document.getElementById(`devReplyForm_${id}`);
        if (form) form.classList.add('hidden');
      });
    });

    feedbackItemsList.querySelectorAll('.btn-save-dev-reply').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.currentTarget.getAttribute('data-id'));
        const form = document.getElementById(`devReplyForm_${id}`);
        if (!form) return;
        const ta = form.querySelector('.feedback-dev-reply-textarea');
        const replyText = ta ? ta.value.trim() : '';
        const currentItem = communityFeedbackList.find(x => x.id === id);
        const st = currentItem ? currentItem.status : 'pending';
        btn.disabled = true;
        await saveFeedbackStatusAndResponse(id, st, replyText || null);
        btn.disabled = false;
        form.classList.add('hidden');
      });
    });

    feedbackItemsList.querySelectorAll('.btn-delete-feedback').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.currentTarget.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this feedback post?')) {
          await deleteFeedbackItem(id);
        }
      });
    });
  }
}

async function saveFeedbackStatusAndResponse(id, status, devResponse) {
  if (!token) return;
  try {
    const res = await fetch(`/api/feedback/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, devResponse })
    });
    if (res.ok) {
      const data = await res.json();
      const updated = data.feedback;
      const idx = communityFeedbackList.findIndex(x => x.id === id);
      if (idx !== -1) {
        communityFeedbackList[idx] = updated;
      }
      renderFeedbackList();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to update feedback status.');
    }
  } catch (err) {
    console.error('Error updating feedback:', err);
    alert('Network error while updating feedback.');
  }
}

async function deleteFeedbackItem(id) {
  if (!token) return;
  try {
    const res = await fetch(`/api/feedback/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      communityFeedbackList = communityFeedbackList.filter(x => x.id !== id);
      renderFeedbackList();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete feedback.');
    }
  } catch (err) {
    console.error('Error deleting feedback:', err);
    alert('Network error while deleting feedback.');
  }
}

async function handleFeedbackSubmit(e) {
  if (e) e.preventDefault();
  if (isSubmittingFeedback) return;

  const content = feedbackContentInput ? feedbackContentInput.value.trim() : '';
  if (!content) {
    if (feedbackSubmitError) {
      feedbackSubmitError.textContent = 'Please enter your feedback before submitting.';
      feedbackSubmitError.classList.remove('hidden');
    }
    return;
  }

  isSubmittingFeedback = true;
  if (submitFeedbackBtn) submitFeedbackBtn.disabled = true;
  if (feedbackSubmitSpinner) feedbackSubmitSpinner.classList.remove('hidden');
  if (feedbackSubmitError) feedbackSubmitError.classList.add('hidden');
  if (feedbackSubmitSuccess) feedbackSubmitSuccess.classList.add('hidden');

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      userHasSubmittedFeedback = true;
      updateFeedbackButtonGlow();

      if (feedbackContentInput) {
        feedbackContentInput.value = '';
      }
      if (feedbackCharCount) {
        feedbackCharCount.textContent = '0';
      }

      if (feedbackSubmitSuccess) {
        feedbackSubmitSuccess.classList.remove('hidden');
        setTimeout(() => {
          if (feedbackSubmitSuccess) feedbackSubmitSuccess.classList.add('hidden');
        }, 5000);
      }

      if (data.feedback) {
        const existingIdx = communityFeedbackList.findIndex(x => x.id === data.feedback.id);
        if (existingIdx === -1) {
          communityFeedbackList.unshift(data.feedback);
        }
      }
      renderFeedbackList();
    } else {
      if (feedbackSubmitError) {
        feedbackSubmitError.textContent = data.error || 'Failed to submit feedback.';
        feedbackSubmitError.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (feedbackSubmitError) {
      feedbackSubmitError.textContent = 'Network error while submitting feedback. Please try again.';
      feedbackSubmitError.classList.remove('hidden');
    }
  } finally {
    isSubmittingFeedback = false;
    if (submitFeedbackBtn) submitFeedbackBtn.disabled = false;
    if (feedbackSubmitSpinner) feedbackSubmitSpinner.classList.add('hidden');
  }
}

function handleFeedbackCreatedEvent(feedback) {
  if (!feedback) return;
  const idx = communityFeedbackList.findIndex(x => x.id === feedback.id);
  if (idx === -1) {
    communityFeedbackList.unshift(feedback);
  } else {
    communityFeedbackList[idx] = feedback;
  }
  if (currentUser && Number(feedback.userId) === Number(currentUser.id)) {
    userHasSubmittedFeedback = true;
    updateFeedbackButtonGlow();
  }
  if (feedbackModalOverlay && !feedbackModalOverlay.classList.contains('hidden')) {
    renderFeedbackList();
  }
}

function handleFeedbackUpdatedEvent(feedback) {
  if (!feedback) return;
  const idx = communityFeedbackList.findIndex(x => x.id === feedback.id);
  if (idx !== -1) {
    communityFeedbackList[idx] = feedback;
  } else {
    communityFeedbackList.unshift(feedback);
  }
  if (feedbackModalOverlay && !feedbackModalOverlay.classList.contains('hidden')) {
    renderFeedbackList();
  }
}

function handleFeedbackDeletedEvent(feedbackId) {
  communityFeedbackList = communityFeedbackList.filter(x => x.id !== Number(feedbackId));
  if (feedbackModalOverlay && !feedbackModalOverlay.classList.contains('hidden')) {
    renderFeedbackList();
  }
}

function bindFeedbackForumControls() {
  // Top feedback buttons click
  document.querySelectorAll('.top-feedback-btn').forEach(btn => {
    btn.addEventListener('click', openFeedbackModal);
  });

  // Modal close button
  if (closeFeedbackModalBtn) {
    closeFeedbackModalBtn.addEventListener('click', closeFeedbackModal);
  }
  if (feedbackModalOverlay) {
    feedbackModalOverlay.addEventListener('click', (e) => {
      if (e.target === feedbackModalOverlay) closeFeedbackModal();
    });
  }

  // Textarea input character count
  if (feedbackContentInput) {
    feedbackContentInput.addEventListener('input', () => {
      if (feedbackCharCount) {
        feedbackCharCount.textContent = feedbackContentInput.value.length;
      }
      if (feedbackSubmitError) feedbackSubmitError.classList.add('hidden');
    });
  }

  // Form submit
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
  }

  // Filter chips
  document.querySelectorAll('.feedback-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.feedback-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFeedbackFilter = chip.getAttribute('data-filter') || 'all';
      renderFeedbackList();
    });
  });

  // Refresh button
  if (refreshFeedbackBtn) {
    refreshFeedbackBtn.addEventListener('click', async () => {
      refreshFeedbackBtn.style.transform = 'rotate(180deg)';
      setTimeout(() => { refreshFeedbackBtn.style.transform = ''; }, 300);
      await checkFeedbackStatus();
    });
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (feedbackModalOverlay && !feedbackModalOverlay.classList.contains('hidden')) {
      closeFeedbackModal();
    }
    if (easterEggOfferModalOverlay && !easterEggOfferModalOverlay.classList.contains('hidden')) {
      closeEasterEgg();
    }
  }
});

initPromoBanner();
bindFeedbackForumControls();

// Boot check
checkCurrentSession();

