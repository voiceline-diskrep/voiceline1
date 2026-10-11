// Native Desktop / Remote Server Redirection
const _originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string') {
    const serverBase = window.VOICELINE_SERVER_URL || '';
    if (serverBase && (url.startsWith('/api/') || url.startsWith('/uploads/') || url.startsWith('/stickers/'))) {
      url = serverBase.replace(/\/+$/, '') + url;
    }
  }
  return _originalFetch.call(this, url, options);
};

window.resolveAssetUrl = function(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const serverBase = window.VOICELINE_SERVER_URL || '';
  if (serverBase && url.startsWith('/')) {
    return serverBase.replace(/\/+$/, '') + url;
  }
  return url;
};

window.fetchLiveServerUrlFromGitHub = async function() {
  if (window.electronDesktop && window.electronDesktop.refreshServerFromGitHub) {
    try {
      const res = await window.electronDesktop.refreshServerFromGitHub();
      if (res && res.success && res.url) {
        window.VOICELINE_SERVER_URL = res.url;
        return res.url;
      }
    } catch (e) {}
  }

  // Fallback direct raw fetch from GitHub
  try {
    const rawUrl = 'https://raw.githubusercontent.com/voiceline-diskrep/voiceline1/main/server.txt?t=' + Date.now();
    const res = await _originalFetch(rawUrl, { cache: 'no-store' });
    if (res.ok) {
      const text = (await res.text()).trim();
      if (text && text !== 'OFFLINE' && (text.startsWith('http://') || text.startsWith('https://'))) {
        const candidate = text.replace(/\/+$/, '');
        try {
          const testRes = await _originalFetch(candidate + '/api/servers', { method: 'GET' });
          if (testRes.status >= 200 && testRes.status < 500) {
            window.VOICELINE_SERVER_URL = candidate;
            return window.VOICELINE_SERVER_URL;
          }
        } catch (pingErr) {}
      }
    }
  } catch (e) {}

  return window.VOICELINE_SERVER_URL || '';
};

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

// Voice Channels & Server Voice Elements
const voiceChannelSection = document.getElementById('voiceChannelSection');
const voiceChannelList = document.getElementById('voiceChannelList');
const openCreateVoiceChannelBtn = document.getElementById('openCreateVoiceChannelBtn');
const channelTypeOptionText = document.getElementById('channelTypeOptionText');
const channelTypeOptionVoice = document.getElementById('channelTypeOptionVoice');
const createChannelPrefix = document.getElementById('createChannelPrefix');
const createChannelModalTitle = document.getElementById('createChannelModalTitle');

// Server Voice Dock Elements
const serverVoiceDock = document.getElementById('serverVoiceDock');
const serverVoiceDockChannelName = document.getElementById('serverVoiceDockChannelName');
const serverVoiceDisconnectBtn = document.getElementById('serverVoiceDisconnectBtn');
const serverVoiceMuteBtn = document.getElementById('serverVoiceMuteBtn');
const serverVoiceDeafenBtn = document.getElementById('serverVoiceDeafenBtn');
const serverVoiceCameraBtn = document.getElementById('serverVoiceCameraBtn');
const serverVoiceScreenShareBtn = document.getElementById('serverVoiceScreenShareBtn');
const serverVoiceOpenStageBtn = document.getElementById('serverVoiceOpenStageBtn');

// Voice Stage View Elements
const voiceStageLayout = document.getElementById('voiceStageLayout');
const voiceStageChannelName = document.getElementById('voiceStageChannelName');
const voiceStageCount = document.getElementById('voiceStageCount');
const voiceStageToggleChatBtn = document.getElementById('voiceStageToggleChatBtn');
const voiceStageDisconnectBtn = document.getElementById('voiceStageDisconnectBtn');
const voiceStageGrid = document.getElementById('voiceStageGrid');
const stageMuteBtn = document.getElementById('stageMuteBtn');
const stageDeafenBtn = document.getElementById('stageDeafenBtn');
const stageCameraBtn = document.getElementById('stageCameraBtn');
const stageScreenBtn = document.getElementById('stageScreenBtn');
const stageLeaveBtn = document.getElementById('stageLeaveBtn');

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

// Screen Sharing DOM Elements
const dmStartScreenShareBtn = document.getElementById('dmStartScreenShareBtn');
const callScreenShareBtn = document.getElementById('callScreenShareBtn');
const callScreenShareBtnLabel = document.getElementById('callScreenShareBtnLabel');
const callScreenShareIconOff = document.getElementById('callScreenShareIconOff');
const callScreenShareIconOn = document.getElementById('callScreenShareIconOn');
const theaterScreenShareBtn = document.getElementById('theaterScreenShareBtn');
const theaterScreenShareBtnLabel = document.getElementById('theaterScreenShareBtnLabel');
const theaterScreenShareIconOff = document.getElementById('theaterScreenShareIconOff');
const theaterScreenShareIconOn = document.getElementById('theaterScreenShareIconOn');
const theaterScreenBadge = document.getElementById('theaterScreenBadge');
const theaterScreenBadgeText = document.getElementById('theaterScreenBadgeText');
const theaterScreenFitBtn = document.getElementById('theaterScreenFitBtn');

// State
let currentUser = null;
let token = localStorage.getItem('voiceline_token');
let servers = [];
let channels = [];
let activeServerId = null;
let activeChannelId = null;
let serverVoiceStates = {}; // channelId -> array of participants
let isViewingVoiceStage = false;
let selectedChannelType = 'text'; // 'text' or 'voice'
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

window.VoicelineState = {
  getToken: () => token || localStorage.getItem('voiceline_token'),
  getActiveServerId: () => activeServerId,
  getActiveChannelId: () => activeChannelId,
  getActiveDmFriend: () => activeDmFriend,
  getCurrentUser: () => currentUser,
  getSocket: () => socket,
  getServers: () => (typeof servers !== 'undefined' && Array.isArray(servers) ? servers : []),
  playSound: (type) => { if (typeof playNotificationSound === 'function') playNotificationSound(type); }
};

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
    img.src = resolveAssetUrl(user.avatarUrl);
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
    return `<div class="${className}" style="background-color: transparent;"><img src="${escapeHtml(resolveAssetUrl(avatarUrl))}" class="avatar-img" alt="${escapeHtml(displayName || username || '')}" /></div>`;
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

function isGifMedia(url, fileType, fileName) {
  if (fileType === 'image/gif') return true;
  if (fileName && /\.gif$/i.test(fileName)) return true;
  const target = String(url || fileName || '').trim();
  if (/\.gif(\?|$)/i.test(target)) return true;
  if (/^https?:\/\/(media\d*|i)\.giphy\.com\//i.test(target)) return true;
  if (/^https?:\/\/media\.tenor\.com\//i.test(target)) return true;
  return false;
}

function getFavoriteGifStorageKey() {
  const uid = (currentUser && currentUser.id) ? currentUser.id : 'global';
  return `voiceline_favorite_gifs_${uid}`;
}

function getFavoriteGifs() {
  try {
    const raw = localStorage.getItem(getFavoriteGifStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavoriteGifs(list) {
  try {
    localStorage.setItem(getFavoriteGifStorageKey(), JSON.stringify(list));
  } catch (e) {}
}

function isGifFavorited(gif) {
  if (!gif) return false;
  const list = getFavoriteGifs();
  const matchId = String(gif.id || '');
  const matchUrl = String(gif.url || gif.previewUrl || '');
  return list.some(item => {
    if (matchId && String(item.id) === matchId) return true;
    if (matchUrl && (item.url === matchUrl || item.previewUrl === matchUrl)) return true;
    return false;
  });
}

function toggleGifFavorite(gif) {
  if (!gif || (!gif.url && !gif.previewUrl && !gif.id)) return false;
  const list = getFavoriteGifs();
  const matchId = String(gif.id || '');
  const matchUrl = String(gif.url || gif.previewUrl || '');
  const existingIdx = list.findIndex(item => {
    if (matchId && String(item.id) === matchId) return true;
    if (matchUrl && (item.url === matchUrl || item.previewUrl === matchUrl)) return true;
    return false;
  });

  let isFav = false;
  if (existingIdx >= 0) {
    list.splice(existingIdx, 1);
    isFav = false;
  } else {
    list.unshift({
      id: gif.id || `fav_${Date.now()}`,
      title: gif.title || 'Favorite GIF',
      url: gif.url || gif.previewUrl,
      previewUrl: gif.previewUrl || gif.url,
      width: gif.width || 200,
      height: gif.height || 200,
      favoritedAt: Date.now()
    });
    isFav = true;
  }
  saveFavoriteGifs(list);
  return isFav;
}

function renderStarIconSvg(isFav) {
  if (isFav) {
    return `<svg viewBox="0 0 24 24" width="15" height="15" fill="#f1c40f" stroke="#f1c40f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }
  return `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
}

function renderAttachmentHtml(msg) {
  if (msg.fileType === 'sticker' || (msg.fileUrl && msg.fileUrl.includes('/stickers/'))) {
    const stickerName = escapeHtml(msg.fileName || 'Sticker');
    return `
      <div class="message-sticker-wrap" title="${stickerName}">
        <img class="message-sticker-image" src="${escapeHtml(resolveAssetUrl(msg.fileUrl))}" alt="${stickerName}" loading="lazy" />
      </div>
    `;
  }

  if (!msg.fileUrl) {
    if (msg.content) {
      const trimmed = msg.content.trim();
      if (/^https?:\/\/\S+\.(gif|png|jpe?g|webp)(\?\S*)?$/i.test(trimmed) || /^https?:\/\/(media\d*|i)\.giphy\.com\/\S+$/i.test(trimmed) || /^https?:\/\/media\.tenor\.com\/\S+$/i.test(trimmed)) {
        const isGif = isGifMedia(trimmed, null, null);
        const isFav = isGif && isGifFavorited({ url: trimmed });
        const favBtnHtml = isGif ? `
          <button type="button" class="message-gif-fav-btn ${isFav ? 'is-favorited' : ''}" data-gif-url="${escapeHtml(trimmed)}" data-gif-title="Favorite GIF" title="${isFav ? 'Remove from favorites' : 'Favorite GIF'}">
            ${renderStarIconSvg(isFav)}
          </button>
        ` : '';

        return `
          <div class="message-attachment-wrap">
            <div class="message-attachment-image-wrap">
              <a href="${escapeHtml(trimmed)}" target="_blank" rel="noopener noreferrer">
                <img class="message-attachment-image" src="${escapeHtml(trimmed)}" alt="GIF" loading="lazy" referrerpolicy="no-referrer" />
              </a>
              ${favBtnHtml}
            </div>
          </div>
        `;
      }
    }
    return '';
  }

  const isImg = isImageFile(msg.fileType, msg.fileName);
  if (isImg) {
    const isGif = isGifMedia(msg.fileUrl, msg.fileType, msg.fileName);
    const isFav = isGif && isGifFavorited({ url: msg.fileUrl });
    const favBtnHtml = isGif ? `
      <button type="button" class="message-gif-fav-btn ${isFav ? 'is-favorited' : ''}" data-gif-url="${escapeHtml(msg.fileUrl)}" data-gif-title="${escapeHtml(msg.fileName || 'Favorite GIF')}" title="${isFav ? 'Remove from favorites' : 'Favorite GIF'}">
        ${renderStarIconSvg(isFav)}
      </button>
    ` : '';

    const resolvedUrl = resolveAssetUrl(msg.fileUrl);
    return `
      <div class="message-attachment-wrap">
        <div class="message-attachment-image-wrap">
          <a href="${escapeHtml(resolvedUrl)}" target="_blank" rel="noopener noreferrer">
            <img class="message-attachment-image" src="${escapeHtml(resolvedUrl)}" alt="${escapeHtml(msg.fileName || 'Attachment')}" loading="lazy" referrerpolicy="no-referrer" />
          </a>
          ${favBtnHtml}
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
    if (typeof initNotificationCenter === 'function') {
      initNotificationCenter();
    }
    if (typeof initUserStatusSystem === 'function') {
      initUserStatusSystem();
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
    if (developerPanel) developerPanel.classList.remove('hidden');
    openCreateServerBtn.classList.remove('hidden');
    openCreateChannelBtn.classList.remove('hidden');
    const devSidebarGrp = document.getElementById('settingsDevSidebarGroup');
    if (devSidebarGrp) devSidebarGrp.classList.remove('hidden');
  } else {
    currentUserDevBadge.classList.add('hidden');
    if (currentUserDevBadge2) currentUserDevBadge2.classList.add('hidden');
    if (currentUserDevBadge3) currentUserDevBadge3.classList.add('hidden');
    if (developerPanel) developerPanel.classList.add('hidden');
    openCreateServerBtn.classList.add('hidden');
    openCreateChannelBtn.classList.add('hidden');
    const devSidebarGrp = document.getElementById('settingsDevSidebarGroup');
    if (devSidebarGrp) devSidebarGrp.classList.add('hidden');
  }

  if (typeof updateCurrentUserStatusUI === 'function') {
    updateCurrentUserStatusUI();
  }
}

async function handleLogout() {
  try { endVoiceCall(true); } catch {}
  try { leaveServerVoiceChannel(false); } catch {}
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

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (logoutBtn2) logoutBtn2.addEventListener('click', handleLogout);
if (logoutBtn3) logoutBtn3.addEventListener('click', handleLogout);

// Open My Profile modal when clicking user capsule
document.querySelectorAll('.user-capsule').forEach(capsule => {
  capsule.addEventListener('click', (e) => {
    if (e.target.closest('.logout-btn') || e.target.closest('.call-capsule-participants') || e.target.closest('.user-capsule-settings-btn')) return;
    e.stopPropagation();
    if (typeof toggleUserStatusMenuPopout === 'function') {
      toggleUserStatusMenuPopout(capsule);
    } else {
      openMyProfileModal('profile');
    }
  });
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
    const rawDataUrl = event.target.result;
    
    // Auto-compress avatar into a clean square thumbnail (max 256x256)
    const img = new Image();
    img.onload = () => {
      const maxDim = 256;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      pendingAvatarBase64 = canvas.toDataURL(mimeType, 0.88);
      pendingRemoveAvatar = false;

      renderAvatarInto(myProfileAvatarPreview, {
        avatarUrl: pendingAvatarBase64,
        displayName: profileDisplayNameInput.value || currentUser.displayName,
        username: currentUser.username
      });
      removeAvatarBtn.classList.remove('hidden');
    };
    img.onerror = () => {
      pendingAvatarBase64 = rawDataUrl;
      pendingRemoveAvatar = false;
      renderAvatarInto(myProfileAvatarPreview, {
        avatarUrl: pendingAvatarBase64,
        displayName: profileDisplayNameInput.value || currentUser.displayName,
        username: currentUser.username
      });
      removeAvatarBtn.classList.remove('hidden');
    };
    img.src = rawDataUrl;
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
    myProfileError.textContent = err.message ? `Error: ${err.message}` : 'Could not contact server.';
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

  // Status Badge, Pill and Custom Status on Profile View
  const targetStatus = user.status || 'offline';
  const statusBadgeEl = document.getElementById('viewUserStatusBadge');
  if (statusBadgeEl && typeof getStatusBadgeClass === 'function') {
    statusBadgeEl.className = `user-status-badge status-large ${getStatusBadgeClass(targetStatus)}`;
    statusBadgeEl.title = typeof getStatusLabel === 'function' ? getStatusLabel(targetStatus) : targetStatus;
  }
  const statusPillEl = document.getElementById('viewUserStatusPill');
  if (statusPillEl && typeof getStatusPillClass === 'function') {
    statusPillEl.className = `user-status-pill ${getStatusPillClass(targetStatus)}`;
    statusPillEl.textContent = typeof getStatusLabel === 'function' ? getStatusLabel(targetStatus) : targetStatus;
  }
  const customStatusBox = document.getElementById('viewUserCustomStatusBox');
  const customStatusEmoji = document.getElementById('viewUserCustomStatusEmoji');
  const customStatusText = document.getElementById('viewUserCustomStatusText');
  if (customStatusBox && customStatusEmoji && customStatusText) {
    if (user.customStatus && user.customStatus.text) {
      customStatusEmoji.textContent = user.customStatus.emoji || '';
      customStatusText.textContent = user.customStatus.text;
      customStatusBox.classList.remove('hidden');
    } else {
      customStatusBox.classList.add('hidden');
    }
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
      if (typeof initNotificationCenter === 'function') {
        initNotificationCenter();
      }
      if (typeof initUserStatusSystem === 'function') {
        initUserStatusSystem();
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

  if (dmStartScreenShareBtn) {
    if (friend.isDeleted) {
      dmStartScreenShareBtn.classList.add('hidden');
    } else {
      dmStartScreenShareBtn.classList.remove('hidden');
      dmStartScreenShareBtn.disabled = false;
      dmStartScreenShareBtn.onclick = () => {
        if (currentCall.status === 'connected' && currentCall.partner && currentCall.partner.id === friend.id) {
          toggleScreenShare();
        } else {
          initiateVoiceCall(friend, true);
        }
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

  if (window.innerWidth > 768) {
    dmMessageInput.focus();
  } else if (typeof closeMobileNav === 'function') {
    closeMobileNav();
  }
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

friendsNavAllBtn.addEventListener('click', () => {
  switchToFriendsView('all');
  if (window.innerWidth <= 768 && typeof closeMobileNav === 'function') closeMobileNav();
});
friendsNavPendingBtn.addEventListener('click', () => {
  switchToFriendsView('pending');
  if (window.innerWidth <= 768 && typeof closeMobileNav === 'function') closeMobileNav();
});
friendsNavAddBtn.addEventListener('click', () => {
  switchToFriendsView('add');
  if (window.innerWidth <= 768 && typeof closeMobileNav === 'function') closeMobileNav();
});

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

        const statusBadgeClass = typeof getStatusBadgeClass === 'function' ? getStatusBadgeClass(f.status) : 'status-offline';
        const statusLabel = typeof getStatusLabel === 'function' ? getStatusLabel(f.status) : (f.status || 'Offline');
        const customStatusText = (f.customStatus && f.customStatus.text)
          ? `<span class="dm-card-custom-status" title="${escapeHtml(f.customStatus.text)}">${escapeHtml(f.customStatus.emoji || '')} ${escapeHtml(f.customStatus.text)}</span>`
          : '';

        item.innerHTML = `
          <div class="user-avatar-wrap">
            ${avatarHtml}
            <div class="user-status-badge status-md ${statusBadgeClass}" title="${statusLabel}"></div>
          </div>
          <div class="dm-item-meta" style="min-width:0; display:flex; flex-direction:column;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="dm-item-name">${escapeHtml(f.displayName || f.username)}</span>
              ${devBadgeHtml}
            </div>
            ${customStatusText}
          </div>
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

      const statusBadgeClass = typeof getStatusBadgeClass === 'function' ? getStatusBadgeClass(f.status) : 'status-offline';
      const statusLabel = typeof getStatusLabel === 'function' ? getStatusLabel(f.status) : (f.status || 'Offline');
      const customStatusRow = (f.customStatus && f.customStatus.text)
        ? `<div class="friend-card-custom-status" title="${escapeHtml(f.customStatus.text)}">${escapeHtml(f.customStatus.emoji || '')} ${escapeHtml(f.customStatus.text)}</div>`
        : '';

      card.innerHTML = `
        <div class="friend-card-left" title="Click to view profile">
          <div class="user-avatar-wrap">
            ${avatarHtml}
            <div class="user-status-badge status-md ${statusBadgeClass}" title="${statusLabel}"></div>
          </div>
          <div class="friend-card-meta">
            <div class="friend-card-name-row">
              <span class="friend-card-name">${escapeHtml(f.displayName)}</span>
              ${devBadgeHtml}
            </div>
            ${customStatusRow}
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
    const resolvedIcon = server.iconUrl ? resolveAssetUrl(server.iconUrl) : '';
    const iconStyle = resolvedIcon ? `style="background-image: url('${escapeHtml(resolvedIcon)}'); background-size: cover; background-position: center; color: transparent;"` : '';
    item.innerHTML = `
      <div class="server-pill"></div>
      <button type="button" class="server-icon" ${iconStyle} aria-label="${escapeHtml(server.name)}">${server.iconUrl ? '' : escapeHtml(initials)}</button>
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

  const serverBannerIconThumb = document.getElementById('serverBannerIconThumb');
  if (serverBannerIconThumb) {
    if (curServer.iconUrl) {
      serverBannerIconThumb.style.backgroundImage = `url('${resolveAssetUrl(curServer.iconUrl)}')`;
      serverBannerIconThumb.classList.remove('hidden');
    } else {
      serverBannerIconThumb.style.backgroundImage = 'none';
      serverBannerIconThumb.classList.add('hidden');
    }
  }

  // Update header dropdown menu controls for current permissions
  updateServerDropdownMenuState();

  if (displayedJoinCode && curServer.joinCode) {
    displayedJoinCode.textContent = curServer.joinCode;
  }
  const inviteCodeInput = document.getElementById('serverInviteCodeInput');
  if (inviteCodeInput && curServer.joinCode) {
    inviteCodeInput.value = curServer.joinCode;
  }
  if (developerServerCodeBadge) {
    developerServerCodeBadge.classList.add('hidden');
  }

  await loadChannels(activeServerId);
  loadServerMembers(activeServerId);
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
      await loadServerVoiceStates(serverId);
      renderChannelList();

      const textChannels = channels.filter(c => c.type !== 'voice');
      if (!isViewingVoiceStage) {
        if (!textChannels.some(c => c.id === activeChannelId) && textChannels.length > 0) {
          selectChannel(textChannels[0].id);
        } else if (textChannels.length > 0 && activeChannelId) {
          selectChannel(activeChannelId);
        }
      }
    }
  } catch (err) {
    console.error('Failed to load channels:', err);
  }
}

async function loadServerVoiceStates(serverId) {
  if (!token || !serverId) return;
  try {
    const res = await fetch(`/api/servers/${serverId}/voice-states`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      serverVoiceStates = data.states || {};
    }
  } catch (err) {
    console.error('Failed to load server voice states:', err);
  }
}

function renderChannelList() {
  channelList.innerHTML = '';
  if (voiceChannelList) voiceChannelList.innerHTML = '';

  const curServer = servers.find(s => s.id === activeServerId);
  const canManageServer = currentUser && (currentUser.isDeveloper || (curServer && Number(curServer.createdBy) === Number(currentUser.id)));

  if (openCreateChannelBtn) {
    openCreateChannelBtn.classList.toggle('hidden', !canManageServer);
  }
  if (openCreateVoiceChannelBtn) {
    openCreateVoiceChannelBtn.classList.toggle('hidden', !canManageServer);
  }

  const textChannels = channels.filter(c => c.type !== 'voice');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  textChannels.forEach(ch => {
    const item = document.createElement('div');
    item.className = 'channel-item' + (ch.id === activeChannelId && !isViewingVoiceStage ? ' active' : '');
    item.setAttribute('data-id', ch.id);

    const deleteBtnHtml = (canManageServer && channels.length > 1) 
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
      switchToTextChannel(ch.id);
    });

    channelList.appendChild(item);
  });

  if (voiceChannelList) {
    voiceChannels.forEach(ch => {
      const isConnectedHere = serverVoiceState.channelId === ch.id;
      const item = document.createElement('div');
      item.className = 'channel-item voice-channel' + (isConnectedHere ? ' connected' : '') + (isConnectedHere && isViewingVoiceStage ? ' active' : '');
      item.setAttribute('data-id', ch.id);

      const deleteBtnHtml = (canManageServer && channels.length > 1) 
        ? `<button type="button" class="channel-delete-btn" title="Delete Channel" aria-label="Delete">✕</button>` 
        : '';

      item.innerHTML = `
        <div class="channel-item-left">
          <span class="voice-channel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 3v18l-5-5H3V8h4l5-5zm6.5 9c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16 4.07v2.02c3.11.83 5.5 3.66 5.5 6.91s-2.39 6.08-5.5 6.91v2.02c4.23-.88 7.5-4.63 7.5-8.93s-3.27-8.05-7.5-8.93z"/>
            </svg>
          </span>
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
        handleVoiceChannelClick(ch.id, ch.name);
      });

      voiceChannelList.appendChild(item);

      // Render nested participants under this voice channel
      const participants = serverVoiceStates[ch.id] || [];
      if (participants.length > 0) {
        const usersContainer = document.createElement('div');
        usersContainer.className = 'voice-channel-users';

        participants.forEach(p => {
          const userRow = document.createElement('div');
          userRow.className = 'voice-user-row';
          userRow.setAttribute('data-user-id', p.userId);
          const isSpeaking = serverVoiceState.speakingUsers.has(p.userId);

          let avatarContent = (p.displayName || p.username || 'U')[0].toUpperCase();
          if (p.avatarUrl) {
            avatarContent = `<img src="${resolveAssetUrl(p.avatarUrl)}" alt="${escapeHtml(p.username)}" />`;
          }

          let badgesHtml = '';
          if (p.isMuted) {
            badgesHtml += `<span class="voice-badge-icon" title="Muted"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c1.33-.19 2.53-.78 3.53-1.62l3.2 3.2 1.27-1.27L4.27 3z"/></svg></span>`;
          }
          if (p.isDeafened) {
            badgesHtml += `<span class="voice-badge-icon" title="Deafened"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M4.27 3L3 4.27l3.28 3.28C4.19 8.92 3 10.82 3 13v7c0 1.1.9 2 2 2h4v-8H5v-1c0-1.51.52-2.9 1.4-4L12 14.6V21h2v-4.4l4.73 4.73 1.27-1.27L4.27 3zM19 13v-1a7 7 0 0 0-11.83-5.11l1.45 1.45A4.97 4.97 0 0 1 19 12v1h-2v3.17l2 2V13z"/></svg></span>`;
          }
          if (p.isVideo) {
            badgesHtml += `<span class="voice-badge-icon" title="Video" style="color: #23a55a;"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg></span>`;
          }
          if (p.isScreenShare) {
            badgesHtml += `<span class="voice-badge-icon" title="Live" style="color: #5865F2;"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 5h16v11H4V5zm6 8l5-3-5-3v6z"/></svg></span>`;
          }

          userRow.innerHTML = `
            <div class="voice-user-left">
              <div class="voice-user-avatar ${isSpeaking ? 'speaking' : ''}">${avatarContent}</div>
              <span class="voice-user-name">${escapeHtml(p.displayName || p.username)}</span>
            </div>
            <div class="voice-user-badges">${badgesHtml}</div>
          `;
          usersContainer.appendChild(userRow);
        });

        voiceChannelList.appendChild(usersContainer);
      }
    });
  }
}

function switchToTextChannel(channelId) {
  isViewingVoiceStage = false;
  if (voiceStageLayout) voiceStageLayout.classList.add('hidden');

  const chatHeader = document.querySelector('#chatLayout .chat-header');
  if (chatHeader) chatHeader.classList.remove('hidden');
  const chatBodyContainer = document.getElementById('chatBodyContainer');
  if (chatBodyContainer) chatBodyContainer.classList.remove('hidden');

  messagesContainer.classList.remove('hidden');
  const chatFooter = document.querySelector('.chat-footer');
  if (chatFooter) chatFooter.classList.remove('hidden');

  if (channelId) {
    selectChannel(channelId);
  } else {
    renderChannelList();
  }
}

async function handleVoiceChannelClick(channelId, channelName) {
  if (serverVoiceState.channelId === channelId) {
    openVoiceStageView();
    return;
  }
  await joinServerVoiceChannel(channelId, channelName);
}

function openVoiceStageView() {
  isViewingVoiceStage = true;

  // Make sure chat layout is active and friends tab is hidden
  if (chatLayout) chatLayout.classList.remove('hidden');
  if (friendsLayout) friendsLayout.classList.add('hidden');

  // Hide the server text chat header and message body container completely so voice stage owns the full screen
  const chatHeader = document.querySelector('#chatLayout .chat-header');
  if (chatHeader) chatHeader.classList.add('hidden');
  const chatBodyContainer = document.getElementById('chatBodyContainer');
  if (chatBodyContainer) chatBodyContainer.classList.add('hidden');

  if (voiceStageLayout) {
    voiceStageLayout.classList.remove('hidden');
    if (voiceStageChannelName) voiceStageChannelName.textContent = serverVoiceState.channelName || 'Lounge';
    if (voiceStageCount) voiceStageCount.textContent = `${serverVoiceState.participants.length} Connected`;
  }
  renderVoiceStageGrid();
  renderChannelList();
}

function selectChannel(channelId) {
  activeChannelId = Number(channelId);

  // If returning from Voice Stage view, restore normal chat view
  if (isViewingVoiceStage) {
    isViewingVoiceStage = false;
    if (voiceStageLayout) voiceStageLayout.classList.add('hidden');
    const chatHeader = document.querySelector('#chatLayout .chat-header');
    if (chatHeader) chatHeader.classList.remove('hidden');
    const chatBodyContainer = document.getElementById('chatBodyContainer');
    if (chatBodyContainer) chatBodyContainer.classList.remove('hidden');
    messagesContainer.classList.remove('hidden');
    const chatFooter = document.querySelector('.chat-footer');
    if (chatFooter) chatFooter.classList.remove('hidden');
  }

  document.querySelectorAll('.channel-item').forEach(el => {
    el.classList.toggle('active', Number(el.getAttribute('data-id')) === activeChannelId && !isViewingVoiceStage);
  });

  const curServer = servers.find(s => s.id === activeServerId) || { name: 'Server' };
  const curChannel = channels.find(c => c.id === activeChannelId) || { name: 'general' };

  activeChannelName.textContent = curChannel.name;
  activeChannelDesc.textContent = `in ${curServer.name}`;
  welcomeTitle.textContent = `Welcome to #${curChannel.name}!`;
  welcomeDesc.textContent = `This is the start of the #${curChannel.name} channel in ${curServer.name}. Messages here are saved safely in SQLite.`;
  messageInput.disabled = false;
  messageInput.placeholder = `Message #${curChannel.name}... (Press Enter to send)`;
  if (window.innerWidth > 768) {
    messageInput.focus();
  } else if (typeof closeMobileNav === 'function') {
    closeMobileNav();
  }

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

function setCreateChannelType(type) {
  selectedChannelType = type;
  if (channelTypeOptionText) {
    channelTypeOptionText.classList.toggle('active', type === 'text');
    const radio = channelTypeOptionText.querySelector('input');
    if (radio) radio.checked = type === 'text';
  }
  if (channelTypeOptionVoice) {
    channelTypeOptionVoice.classList.toggle('active', type === 'voice');
    const radio = channelTypeOptionVoice.querySelector('input');
    if (radio) radio.checked = type === 'voice';
  }
  if (createChannelPrefix) {
    createChannelPrefix.innerHTML = type === 'text' 
      ? '#' 
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M12 3v18l-5-5H3V8h4l5-5zm6.5 9c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16 4.07v2.02c3.11.83 5.5 3.66 5.5 6.91s-2.39 6.08-5.5 6.91v2.02c4.23-.88 7.5-4.63 7.5-8.93s-3.27-8.05-7.5-8.93z"/></svg>';
  }
  if (createChannelModalTitle) {
    createChannelModalTitle.textContent = type === 'text' ? 'Create Text Channel' : 'Create Voice Channel';
  }
}

if (openCreateChannelBtn) {
  openCreateChannelBtn.addEventListener('click', () => {
    setCreateChannelType('text');
    createChannelModalOverlay.classList.remove('hidden');
    channelNameInput.value = '';
    createChannelError.textContent = '';
    channelNameInput.focus();
  });
}

if (openCreateVoiceChannelBtn) {
  openCreateVoiceChannelBtn.addEventListener('click', () => {
    setCreateChannelType('voice');
    createChannelModalOverlay.classList.remove('hidden');
    channelNameInput.value = '';
    createChannelError.textContent = '';
    channelNameInput.focus();
  });
}

if (channelTypeOptionText) {
  channelTypeOptionText.addEventListener('click', () => setCreateChannelType('text'));
}
if (channelTypeOptionVoice) {
  channelTypeOptionVoice.addEventListener('click', () => setCreateChannelType('voice'));
}

if (cancelCreateChannelBtn) {
  cancelCreateChannelBtn.addEventListener('click', () => {
    createChannelModalOverlay.classList.add('hidden');
  });
}

if (createChannelModalOverlay) {
  createChannelModalOverlay.addEventListener('click', (e) => {
    if (e.target === createChannelModalOverlay) {
      createChannelModalOverlay.classList.add('hidden');
    }
  });
}

if (createChannelForm) {
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
        body: JSON.stringify({ name, type: selectedChannelType })
      });

      const data = await res.json();
      if (!res.ok) {
        createChannelError.textContent = data.error || 'Failed to create channel.';
        return;
      }

      createChannelModalOverlay.classList.add('hidden');
      await loadChannels(activeServerId);
      if (typeof loadServerChannelsTable === 'function') {
        loadServerChannelsTable();
      }
      if (data.channel.type === 'voice') {
        await handleVoiceChannelClick(data.channel.id, data.channel.name);
      } else {
        switchToTextChannel(data.channel.id);
      }
    } catch (err) {
      createChannelError.textContent = 'Could not contact server.';
    }
  });
}

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
async function triggerServerShutdownModal() {
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
}

if (shutdownServerBtn) {
  shutdownServerBtn.addEventListener('click', triggerServerShutdownModal);
}

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
    if ((acc.username || '').toLowerCase() === 'rsl1310') return false;
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

  let wsHost = window.location.host;
  let wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  if (window.VOICELINE_SERVER_URL) {
    try {
      const parsed = new URL(window.VOICELINE_SERVER_URL);
      wsHost = parsed.host;
      wsProto = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
    } catch (e) {}
  }
  const wsUrl = `${wsProto}//${wsHost}/?token=${encodeURIComponent(token)}&serverId=${activeServerId || ''}&channelId=${activeChannelId || ''}`;

  setStatus('connecting', 'Connecting...');
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    setStatus('connected', 'Connected');
    isIntentionalDisconnect = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (typeof loadServers === 'function') loadServers();
    if (typeof loadFriends === 'function') loadFriends();
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
          if (activeServerId === msg.serverId) {
            if (displayedJoinCode) displayedJoinCode.textContent = msg.joinCode;
            const inviteCodeInput = document.getElementById('serverInviteCodeInput');
            if (inviteCodeInput) inviteCodeInput.value = msg.joinCode;
          }
        }
      } else if (msg.type === 'server_updated') {
        const s = servers.find(srv => srv.id === msg.server.id);
        if (s) {
          s.name = msg.server.name;
          s.description = msg.server.description;
          s.iconUrl = msg.server.iconUrl;
        }
        renderServerList();
        if (activeServerId === msg.server.id) {
          currentServerTitle.textContent = msg.server.name;
          const serverBannerIconThumb = document.getElementById('serverBannerIconThumb');
          if (serverBannerIconThumb) {
            if (msg.server.iconUrl) {
              serverBannerIconThumb.style.backgroundImage = `url('${msg.server.iconUrl}')`;
              serverBannerIconThumb.classList.remove('hidden');
            } else {
              serverBannerIconThumb.style.backgroundImage = 'none';
              serverBannerIconThumb.classList.add('hidden');
            }
          }
        }
      } else if (msg.type === 'server_deleted') {
        servers = servers.filter(srv => srv.id !== msg.serverId);
        renderServerList();
        if (activeServerId === msg.serverId) {
          if (servers.length > 0) {
            selectServer(servers[0].id);
          } else {
            showNoServersState();
          }
        }
        closeServerSettingsModal();
      } else if (msg.type === 'server_kicked_notice') {
        showToast({
          icon: '⚠️',
          title: 'Removed from Server',
          body: `You were kicked from ${msg.serverName || 'the server'}. ${msg.reason ? 'Reason: ' + msg.reason : ''}`
        });
        loadServers();
      } else if (msg.type === 'server_banned_notice') {
        showToast({
          icon: '🚫',
          title: 'Banned from Server',
          body: `You have been banned from ${msg.serverName || 'the server'}. ${msg.reason ? 'Reason: ' + msg.reason : ''}`
        });
        loadServers();
      } else if (msg.type === 'server_warned_notice') {
        showToast({
          icon: '⚠️',
          title: `Warning from ${msg.serverName || 'Server'}`,
          body: `Reason: ${msg.reason || 'No reason provided.'}`
        });
      } else if (msg.type === 'member_kicked' || msg.type === 'member_banned' || msg.type === 'member_roles_updated' || msg.type === 'member_timed_out' || msg.type === 'member_timeout_removed') {
        if (activeServerId === msg.serverId) {
          // If server settings members panel is open, refresh members
          const membersPanel = document.getElementById('serverPanelMembers');
          if (membersPanel && !membersPanel.classList.contains('hidden')) {
            loadServerMembers(activeServerId);
          }
        }
      } else if (msg.type === 'role_created' || msg.type === 'role_updated' || msg.type === 'role_deleted') {
        if (activeServerId === msg.serverId) {
          const rolesPanel = document.getElementById('serverPanelRoles');
          if (rolesPanel && !rolesPanel.classList.contains('hidden')) {
            loadServerRoles(activeServerId);
          }
        }
      } else if (msg.type === 'member_timed_out_error') {
        showToast({
          icon: '⏳',
          title: 'Timed Out',
          body: msg.message || 'You are currently timed out and cannot perform this action.'
        });
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
      } else if (msg.type === 'server_voice_joined') {
        handleServerVoiceJoined(msg);
      } else if (msg.type === 'server_voice_left') {
        leaveServerVoiceChannel(false);
      } else if (msg.type === 'server_voice_state_update') {
        handleServerVoiceStateUpdate(msg);
      } else if (msg.type === 'server_voice_media_state') {
        handleServerVoiceMediaState(msg);
      } else if (msg.type === 'server_voice_speaking') {
        updateSpeakingUI(msg.userId, msg.speaking);
      } else if (msg.type === 'server_voice_signal') {
        handleServerVoiceSignal(msg);
      } else if (msg.type === 'server_voice_error') {
        showToast({
          icon: '⚠️',
          title: 'Voice Error',
          body: msg.message || 'Error connecting to voice channel.'
        });
        leaveServerVoiceChannel(false);
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
      } else if (msg.type === 'notification_created') {
        if (typeof handleNotificationCreatedEvent === 'function') {
          handleNotificationCreatedEvent(msg.notification);
        }
      } else if (msg.type === 'presence_updated') {
        if (typeof handlePresenceUpdatedEvent === 'function') {
          handlePresenceUpdatedEvent(msg);
        }
      } else if (msg.type === 'message_edited') {
        if (typeof handleMessageEditedEvent === 'function') {
          handleMessageEditedEvent(msg);
        }
      } else if (msg.type === 'message_deleted') {
        if (typeof handleMessageDeletedEvent === 'function') {
          handleMessageDeletedEvent(msg);
        }
      } else if (msg.type === 'message_pinned') {
        if (typeof handleMessagePinnedEvent === 'function') {
          handleMessagePinnedEvent(msg);
        }
      } else if (msg.type === 'new_message_report' || msg.type === 'message_report_updated') {
        if (typeof handleDevReportEvent === 'function') {
          handleDevReportEvent(msg);
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

  socket.onclose = async () => {
    setStatus('disconnected', 'Disconnected');
    if (!isIntentionalDisconnect && token) {
      if (!reconnectTimer) {
        if (typeof window.fetchLiveServerUrlFromGitHub === 'function') {
          try {
            await window.fetchLiveServerUrlFromGitHub();
          } catch (e) {}
        }
        reconnectTimer = setTimeout(connectWebSocket, 2500);
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

// ==========================================
// MESSAGE ACTIONS & INTERACTION STATE
// ==========================================

let activeChannelReply = null; // { id, author, snippet }
let activeDmReply = null;      // { id, author, snippet }
let messageToForward = null;   // { id, content, authorName, isDm }
let messageToReport = null;    // { id, content, authorName, isDm }

// Setup Reply Banner UI Listeners
const channelReplyBar = document.getElementById('channelReplyBar');
const channelReplyAuthor = document.getElementById('channelReplyAuthor');
const channelReplySnippet = document.getElementById('channelReplySnippet');
const channelCancelReplyBtn = document.getElementById('channelCancelReplyBtn');

if (channelCancelReplyBtn) {
  channelCancelReplyBtn.addEventListener('click', () => {
    activeChannelReply = null;
    if (channelReplyBar) channelReplyBar.classList.add('hidden');
  });
}

const dmReplyBar = document.getElementById('dmReplyBar');
const dmReplyAuthor = document.getElementById('dmReplyAuthor');
const dmReplySnippet = document.getElementById('dmReplySnippet');
const dmCancelReplyBtn = document.getElementById('dmCancelReplyBtn');

if (dmCancelReplyBtn) {
  dmCancelReplyBtn.addEventListener('click', () => {
    activeDmReply = null;
    if (dmReplyBar) dmReplyBar.classList.add('hidden');
  });
}

function setReplyTarget(msg, isDm = false) {
  const author = msg.authorName || (msg.authorUsername ? `@${msg.authorUsername}` : 'User');
  const snippet = msg.content || (msg.fileName ? `[File: ${msg.fileName}]` : 'Message');

  if (isDm) {
    activeDmReply = { id: msg.id, author, snippet };
    if (dmReplyAuthor) dmReplyAuthor.textContent = author;
    if (dmReplySnippet) dmReplySnippet.textContent = snippet;
    if (dmReplyBar) dmReplyBar.classList.remove('hidden');
    if (dmMessageInput) dmMessageInput.focus();
  } else {
    activeChannelReply = { id: msg.id, author, snippet };
    if (channelReplyAuthor) channelReplyAuthor.textContent = author;
    if (channelReplySnippet) channelReplySnippet.textContent = snippet;
    if (channelReplyBar) channelReplyBar.classList.remove('hidden');
    if (messageInput) messageInput.focus();
  }
}

function startInlineEdit(messageId, currentText, isDm = false) {
  const container = isDm ? dmMessagesList : messagesList;
  if (!container) return;
  const msgItem = container.querySelector(`.message-item[data-message-id="${messageId}"]`);
  if (!msgItem) return;

  const bodyEl = msgItem.querySelector('.message-body');
  const textEl = msgItem.querySelector('.message-text');
  if (!bodyEl || !textEl) return;

  // If already editing, ignore
  if (bodyEl.querySelector('.inline-edit-box')) return;

  const originalDisplay = textEl.style.display;
  textEl.style.display = 'none';

  const editBox = document.createElement('div');
  editBox.className = 'inline-edit-box';
  editBox.innerHTML = `
    <input type="text" class="inline-edit-input" value="${escapeHtml(currentText)}" maxlength="2000" />
    <div class="inline-edit-actions">
      <span>escape to <a class="edit-cancel-link">cancel</a> • enter to <a class="edit-save-link">save</a></span>
    </div>
  `;

  const inputEl = editBox.querySelector('.inline-edit-input');
  const cancelLink = editBox.querySelector('.edit-cancel-link');
  const saveLink = editBox.querySelector('.edit-save-link');

  const cancel = () => {
    editBox.remove();
    textEl.style.display = originalDisplay;
  };

  const save = () => {
    const val = inputEl.value.trim();
    if (!val || val === currentText.trim()) {
      cancel();
      return;
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'edit_message',
        messageId: Number(messageId),
        content: val,
        isDm
      }));
    }
    cancel();
  };

  cancelLink.addEventListener('click', cancel);
  saveLink.addEventListener('click', save);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });

  bodyEl.appendChild(editBox);
  inputEl.focus();
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

  // Reply spine header
  let replyHeaderHtml = '';
  if (msg.replyToData && typeof msg.replyToData === 'object') {
    replyHeaderHtml = `
      <div class="message-reply-quote" data-reply-id="${escapeHtml(String(msg.replyToId || ''))}">
        <div class="reply-spine"></div>
        <span class="reply-quote-author">@${escapeHtml(msg.replyToData.author || 'User')}</span>
        <span class="reply-quote-text">${escapeHtml(msg.replyToData.snippet || '')}</span>
      </div>
    `;
  }

  // Forwarded Pill
  let forwardedHtml = '';
  if (msg.isForwarded) {
    forwardedHtml = `
      <div class="message-forwarded-pill">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/>
        </svg>
        <span>Forwarded</span>
      </div>
    `;
  }

  // Edited Tag
  const editedTagHtml = msg.isEdited ? '<span class="message-edited-tag">(edited)</span>' : '';

  const textHtml = msg.content ? `<div class="message-text">${escapeHtml(msg.content)}${editedTagHtml}</div>` : '';
  const attachmentHtml = renderAttachmentHtml(msg);

  const item = document.createElement('div');
  item.className = 'message-item';
  if (msg.id) item.setAttribute('data-message-id', String(msg.id));

  // Determine permissions for actions
  const authorId = msg.authorId !== undefined ? msg.authorId : (msg.author_id !== undefined ? msg.author_id : msg.senderId);
  const isMine = currentUser && authorId === currentUser.id;
  const isDev = Boolean(currentUser && currentUser.isDeveloper);

  let hoverActionsHtml = '';
  if (!isDeleted) {
    hoverActionsHtml = `
      <div class="message-hover-actions">
        <button type="button" class="msg-action-btn reply-btn" title="Reply">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
        </button>
        <button type="button" class="msg-action-btn forward-btn" title="Forward">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>
        </button>
        <button type="button" class="msg-action-btn pin-btn${msg.isPinned ? ' pinned-active' : ''}" title="${msg.isPinned ? 'Unpin Message' : 'Pin Message'}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z"/></svg>
        </button>
        ${(isMine || isDev) && msg.content ? `
          <button type="button" class="msg-action-btn edit-btn" title="Edit Message">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
        ` : ''}
        ${(isMine || isDev) ? `
          <button type="button" class="msg-action-btn delete-btn" title="Delete Message">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        ` : ''}
        <button type="button" class="msg-action-btn report-btn" title="Report to Developer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
        </button>
      </div>
    `;
  }

  // Mention detection & ping handling
  const isNewlyReceived = shouldScroll;
  if (currentUser && isNewlyReceived && authorId !== currentUser.id && msg.mentions && Array.isArray(msg.mentions)) {
    const myUsername = (currentUser.username || '').toLowerCase();
    const myMention = msg.mentions.find(m => (m.username || '').toLowerCase() === myUsername);
    if (myMention) {
      const priority = myMention.priority || 'yellow';
      if (priority === 'red') {
        item.classList.add('flash-5');
        playNotificationSound('red');
      } else {
        playNotificationSound(priority);
      }
    }
  }

  item.innerHTML = `
    ${hoverActionsHtml}
    ${avatarHtml}
    <div class="message-body">
      ${replyHeaderHtml}
      ${forwardedHtml}
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

  // Wire hover action listeners
  const replyBtn = item.querySelector('.reply-btn');
  if (replyBtn) {
    replyBtn.addEventListener('click', () => setReplyTarget(msg, false));
  }

  const forwardBtn = item.querySelector('.forward-btn');
  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => openForwardModal(msg, false));
  }

  const pinBtn = item.querySelector('.pin-btn');
  if (pinBtn) {
    pinBtn.addEventListener('click', () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'pin_message',
          messageId: msg.id,
          isDm: false
        }));
      }
    });
  }

  const editBtn = item.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => startInlineEdit(msg.id, msg.content, false));
  }

  const deleteBtn = item.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this message?')) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'delete_message',
            messageId: msg.id,
            isDm: false
          }));
        }
      }
    });
  }

  const reportBtn = item.querySelector('.report-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => openReportModal(msg, false));
  }

  // Jump to reply on quote click
  const quoteEl = item.querySelector('.message-reply-quote');
  if (quoteEl) {
    quoteEl.addEventListener('click', () => {
      const repId = quoteEl.getAttribute('data-reply-id');
      if (repId) {
        const target = messagesList.querySelector(`.message-item[data-message-id="${repId}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('flash-active');
          setTimeout(() => target.classList.remove('flash-active'), 2000);
        }
      }
    });
  }

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

    const payload = {
      type: 'chat',
      content: content,
      file: fileMeta
    };

    if (activeChannelReply) {
      payload.replyToId = activeChannelReply.id;
      payload.replyToData = {
        author: activeChannelReply.author,
        snippet: activeChannelReply.snippet
      };
      activeChannelReply = null;
      if (channelReplyBar) channelReplyBar.classList.add('hidden');
    }

    socket.send(JSON.stringify(payload));

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

  // Reply spine header
  let replyHeaderHtml = '';
  if (msg.replyToData && typeof msg.replyToData === 'object') {
    replyHeaderHtml = `
      <div class="message-reply-quote" data-reply-id="${escapeHtml(String(msg.replyToId || ''))}">
        <div class="reply-spine"></div>
        <span class="reply-quote-author">@${escapeHtml(msg.replyToData.author || 'User')}</span>
        <span class="reply-quote-text">${escapeHtml(msg.replyToData.snippet || '')}</span>
      </div>
    `;
  }

  // Forwarded Pill
  let forwardedHtml = '';
  if (msg.isForwarded) {
    forwardedHtml = `
      <div class="message-forwarded-pill">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/>
        </svg>
        <span>Forwarded</span>
      </div>
    `;
  }

  // Edited Tag
  const editedTagHtml = msg.isEdited ? '<span class="message-edited-tag">(edited)</span>' : '';

  const textHtml = msg.content ? `<div class="message-text">${escapeHtml(msg.content)}${editedTagHtml}</div>` : '';
  const attachmentHtml = renderAttachmentHtml(msg);

  const item = document.createElement('div');
  item.className = 'message-item';
  if (msg.id) item.setAttribute('data-message-id', String(msg.id));

  // Determine permissions
  const senderId = msg.senderId || msg.authorId;
  const isMine = currentUser && senderId === currentUser.id;
  const isDev = Boolean(currentUser && currentUser.isDeveloper);

  let hoverActionsHtml = '';
  if (!isDeleted) {
    hoverActionsHtml = `
      <div class="message-hover-actions">
        <button type="button" class="msg-action-btn reply-btn" title="Reply">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
        </button>
        <button type="button" class="msg-action-btn forward-btn" title="Forward">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>
        </button>
        <button type="button" class="msg-action-btn pin-btn${msg.isPinned ? ' pinned-active' : ''}" title="${msg.isPinned ? 'Unpin Message' : 'Pin Message'}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z"/></svg>
        </button>
        ${(isMine || isDev) && msg.content ? `
          <button type="button" class="msg-action-btn edit-btn" title="Edit Message">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
        ` : ''}
        ${(isMine || isDev) ? `
          <button type="button" class="msg-action-btn delete-btn" title="Delete Message">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        ` : ''}
        <button type="button" class="msg-action-btn report-btn" title="Report to Developer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
        </button>
      </div>
    `;
  }

  item.innerHTML = `
    ${hoverActionsHtml}
    ${avatarHtml}
    <div class="message-body">
      ${replyHeaderHtml}
      ${forwardedHtml}
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

  // Wire hover action listeners
  const replyBtn = item.querySelector('.reply-btn');
  if (replyBtn) {
    replyBtn.addEventListener('click', () => setReplyTarget(msg, true));
  }

  const forwardBtn = item.querySelector('.forward-btn');
  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => openForwardModal(msg, true));
  }

  const pinBtn = item.querySelector('.pin-btn');
  if (pinBtn) {
    pinBtn.addEventListener('click', () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'pin_message',
          messageId: msg.id,
          isDm: true
        }));
      }
    });
  }

  const editBtn = item.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => startInlineEdit(msg.id, msg.content, true));
  }

  const deleteBtn = item.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this direct message?')) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'delete_message',
            messageId: msg.id,
            isDm: true
          }));
        }
      }
    });
  }

  const reportBtn = item.querySelector('.report-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => openReportModal(msg, true));
  }

  // Jump to reply on quote click
  const quoteEl = item.querySelector('.message-reply-quote');
  if (quoteEl) {
    quoteEl.addEventListener('click', () => {
      const repId = quoteEl.getAttribute('data-reply-id');
      if (repId) {
        const target = dmMessagesList.querySelector(`.message-item[data-message-id="${repId}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('flash-active');
          setTimeout(() => target.classList.remove('flash-active'), 2000);
        }
      }
    });
  }

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

      const payload = {
        type: 'direct_message',
        friendId: activeDmFriend.id,
        content: content,
        file: fileMeta
      };

      if (activeDmReply) {
        payload.replyToId = activeDmReply.id;
        payload.replyToData = {
          author: activeDmReply.author,
          snippet: activeDmReply.snippet
        };
        activeDmReply = null;
        if (dmReplyBar) dmReplyBar.classList.add('hidden');
      }

      socket.send(JSON.stringify(payload));

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
  remoteVideoStream: null,
  remoteVideoTrack: null,
  isScreenSharing: false,
  localScreenStream: null,
  localScreenTrack: null,
  wasCameraOnBeforeScreenShare: false,
  remoteIsScreenShare: false,
  pendingStartScreenShare: false,
  isMuted: false,
  isTheaterOpen: false,
  timerInterval: null,
  seconds: 0
};

let pendingIceCandidates = [];

// Start an outgoing voice/video call
async function initiateVoiceCall(friend, startWithScreenShare = false) {
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
    currentCall.localStream = await navigator.mediaDevices.getUserMedia({ audio: getAudioInputConstraints(), video: false });
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
  currentCall.isScreenSharing = false;
  currentCall.remoteIsScreenShare = false;
  currentCall.pendingStartScreenShare = Boolean(startWithScreenShare);
  pendingIceCandidates = [];

  // Show active call widget in "Calling..." state
  renderAvatarInto(callPartnerAvatar, friend);
  callPartnerName.textContent = friend.displayName || friend.username;
  callStatusText.textContent = startWithScreenShare ? 'Calling (Screen Share)...' : 'Calling...';
  callTimerText.textContent = '00:00';
  updateMuteButtonUI();
  updateCameraButtonsUI();
  updateScreenShareButtonsUI();
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
    currentCall.localStream = await navigator.mediaDevices.getUserMedia({ audio: getAudioInputConstraints(), video: false });
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

  if (currentCall.pendingStartScreenShare) {
    currentCall.pendingStartScreenShare = false;
    setTimeout(() => {
      startScreenShare();
    }, 400);
  }

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

    // Only replaceTrack with null if not currently sharing screen
    if (sender && !currentCall.isScreenSharing) {
      try { await sender.replaceTrack(null); } catch {}
    }

    if (!currentCall.isScreenSharing) {
      if (localVideoFeed) {
        localVideoFeed.srcObject = null;
        localVideoFeed.classList.add('hidden');
      }
      if (selfCameraOffState) selfCameraOffState.classList.remove('hidden');
    }

    updateCameraButtonsUI();

    if (socket && socket.readyState === WebSocket.OPEN && currentCall.callId && currentCall.partner && !currentCall.isScreenSharing) {
      socket.send(JSON.stringify({
        type: 'video_state',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        enabled: false,
        isScreen: false
      }));
    }
  } else {
    // Turn camera ON
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported by your browser in this context (requires localhost or HTTPS). Audio call continues normally.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: getVideoInputConstraints(), audio: false });
      const track = stream.getVideoTracks()[0];
      if (!track) throw new Error('No video track available');

      currentCall.localVideoTrack = track;
      currentCall.isVideoEnabled = true;

      // If screen sharing was active, stop screen sharing first so camera takes over
      if (currentCall.isScreenSharing) {
        if (currentCall.localScreenTrack) {
          try { currentCall.localScreenTrack.stop(); } catch {}
          currentCall.localScreenTrack = null;
        }
        if (currentCall.localScreenStream) {
          try { currentCall.localScreenStream.getTracks().forEach(t => t.stop()); } catch {}
          currentCall.localScreenStream = null;
        }
        currentCall.isScreenSharing = false;
        updateScreenShareButtonsUI();
      }

      if (localVideoFeed) {
        localVideoFeed.classList.remove('is-screen-share');
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
          enabled: true,
          isScreen: false
        }));
      }

      // Automatically open the video theater mode when turning on camera
      openVideoTheater();
      updateTheaterScreenBadge();
    } catch (err) {
      console.warn('Camera access failed:', err);
      alert('Could not access camera (' + (err.message || 'no camera found or permission denied') + ').\n\nAudio call continues normally.');
    }
  }
}

// =======================================================
// SCREEN SHARING SYSTEM (WebRTC getDisplayMedia & Desktop Picker)
// =======================================================

// Interactive Discord-style screen picker for Electron / Desktop
function openScreenSharePicker() {
  return new Promise((resolve, reject) => {
    // If not running in Electron with getDesktopSources, fallback directly to native browser getDisplayMedia
    if (!window.electronDesktop || typeof window.electronDesktop.getDesktopSources !== 'function') {
      acquireDisplayMediaStream().then(resolve).catch(reject);
      return;
    }

    const modalOverlay = document.getElementById('screenPickerModalOverlay');
    const sourcesGrid = document.getElementById('screenPickerSourcesGrid');
    const tabScreensBtn = document.getElementById('screenTabScreensBtn');
    const tabWindowsBtn = document.getElementById('screenTabWindowsBtn');
    const confirmBtn = document.getElementById('confirmScreenPickerBtn');
    const cancelBtn = document.getElementById('cancelScreenPickerModalBtn');
    const closeBtn = document.getElementById('closeScreenPickerModalBtn');

    if (!modalOverlay || !sourcesGrid) {
      acquireDisplayMediaStream().then(resolve).catch(reject);
      return;
    }

    let allSources = [];
    let activeTab = 'screens'; // 'screens' | 'windows'
    let selectedSourceId = null;

    const cleanup = () => {
      modalOverlay.classList.add('hidden');
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.onclick = null;
      }
      if (cancelBtn) cancelBtn.onclick = null;
      if (closeBtn) closeBtn.onclick = null;
      if (tabScreensBtn) tabScreensBtn.onclick = null;
      if (tabWindowsBtn) tabWindowsBtn.onclick = null;
    };

    const renderSources = () => {
      sourcesGrid.innerHTML = '';
      const filtered = allSources.filter(s => {
        if (activeTab === 'screens') return s.id.startsWith('screen:');
        return s.id.startsWith('window:');
      });

      if (filtered.length === 0) {
        sourcesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 30px 10px;">
            No ${activeTab === 'screens' ? 'screens' : 'windows'} detected.
          </div>
        `;
        return;
      }

      filtered.forEach(source => {
        const item = document.createElement('div');
        item.className = 'screen-source-item' + (selectedSourceId === source.id ? ' selected' : '');
        item.dataset.sourceId = source.id;

        const thumbWrap = document.createElement('div');
        thumbWrap.className = 'screen-source-thumb-wrap';
        if (source.thumbnail) {
          const thumbImg = document.createElement('img');
          thumbImg.src = source.thumbnail;
          thumbImg.alt = source.name;
          thumbWrap.appendChild(thumbImg);
        } else {
          thumbWrap.innerHTML = '<span style="color:#666;font-size:24px;">🖥️</span>';
        }

        const meta = document.createElement('div');
        meta.className = 'screen-source-meta';
        if (source.appIcon) {
          const icon = document.createElement('img');
          icon.className = 'screen-source-app-icon';
          icon.src = source.appIcon;
          meta.appendChild(icon);
        }
        const title = document.createElement('span');
        title.className = 'screen-source-title';
        title.textContent = source.name || 'Screen';
        title.title = source.name || '';
        meta.appendChild(title);

        item.appendChild(thumbWrap);
        item.appendChild(meta);

        item.addEventListener('click', () => {
          selectedSourceId = source.id;
          sourcesGrid.querySelectorAll('.screen-source-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          if (confirmBtn) confirmBtn.disabled = false;
        });

        // Double click to instantly pick and stream
        item.addEventListener('dblclick', () => {
          selectedSourceId = source.id;
          handleConfirm();
        });

        sourcesGrid.appendChild(item);
      });
    };

    const handleConfirm = async () => {
      if (!selectedSourceId) return;
      cleanup();
      try {
        if (window.electronDesktop.setSelectedScreenSource) {
          await window.electronDesktop.setSelectedScreenSource(selectedSourceId);
        }
        const stream = await acquireDisplayMediaStream();
        resolve(stream);
      } catch (err) {
        reject(err);
      }
    };

    const handleCancel = () => {
      cleanup();
      reject(new DOMException('User cancelled screen selection', 'NotAllowedError'));
    };

    if (cancelBtn) cancelBtn.onclick = handleCancel;
    if (closeBtn) closeBtn.onclick = handleCancel;
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.onclick = handleConfirm;
    }

    if (tabScreensBtn) {
      tabScreensBtn.onclick = () => {
        activeTab = 'screens';
        tabScreensBtn.classList.add('active');
        if (tabWindowsBtn) tabWindowsBtn.classList.remove('active');
        renderSources();
      };
    }

    if (tabWindowsBtn) {
      tabWindowsBtn.onclick = () => {
        activeTab = 'windows';
        tabWindowsBtn.classList.add('active');
        if (tabScreensBtn) tabScreensBtn.classList.remove('active');
        renderSources();
      };
    }

    // Fetch sources from Electron desktopCapturer
    modalOverlay.classList.remove('hidden');
    sourcesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; display:flex; align-items:center; justify-content:center; gap:10px; color:var(--text-muted); padding:40px 10px;">
        <div class="spinner"></div>
        <span>Loading screen previews...</span>
      </div>
    `;

    window.electronDesktop.getDesktopSources().then(sources => {
      allSources = sources || [];
      if (tabScreensBtn) tabScreensBtn.classList.add('active');
      if (tabWindowsBtn) tabWindowsBtn.classList.remove('active');
      activeTab = 'screens';
      // Default select the first screen if available
      if (allSources.length > 0) {
        selectedSourceId = allSources[0].id;
        if (confirmBtn) confirmBtn.disabled = false;
      }
      renderSources();
    }).catch(err => {
      console.warn('Failed to get desktop sources, falling back to native capture:', err);
      cleanup();
      acquireDisplayMediaStream().then(resolve).catch(reject);
    });
  });
}

async function acquireDisplayMediaStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error('Screen sharing requires browser displayMedia support.');
  }
  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always', frameRate: { ideal: 30, max: 60 } },
      audio: true
    });
  } catch (eWithAudio) {
    return await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always', frameRate: { ideal: 30, max: 60 } },
      audio: false
    });
  }
}

async function toggleScreenShare() {
  if (currentCall.status !== 'connected' && currentCall.status !== 'calling') {
    if (activeDmFriend) {
      initiateVoiceCall(activeDmFriend, true);
      return;
    }
    alert('You need to be in a voice or video call to share your screen.');
    return;
  }

  if (currentCall.isScreenSharing) {
    await stopScreenShare();
  } else {
    await startScreenShare();
  }
}

async function startScreenShare() {
  try {
    const screenStream = await openScreenSharePicker();
    const screenTrack = screenStream.getVideoTracks()[0];
    if (!screenTrack) throw new Error('No screen video track captured.');

    // Save previous camera status
    currentCall.wasCameraOnBeforeScreenShare = Boolean(currentCall.isVideoEnabled && currentCall.localVideoTrack);
    currentCall.localScreenStream = screenStream;
    currentCall.localScreenTrack = screenTrack;
    currentCall.isScreenSharing = true;

    // Listen to browser / stream's native "Stop Sharing" button
    screenTrack.onended = () => {
      stopScreenShare();
    };

    let sender = currentCall.videoSender;
    if (!sender && currentCall.peerConnection) {
      const vt = currentCall.peerConnection.getTransceivers().find(t => t.sender && (t.sender.track?.kind === 'video' || t.receiver?.track?.kind === 'video'));
      if (vt) {
        sender = vt.sender;
        currentCall.videoSender = sender;
      }
    }

    if (sender) {
      await sender.replaceTrack(screenTrack);
    } else if (currentCall.peerConnection) {
      currentCall.videoSender = currentCall.peerConnection.addTrack(screenTrack, screenStream);
    }

    // Local preview in PiP
    if (localVideoFeed) {
      localVideoFeed.srcObject = screenStream;
      localVideoFeed.muted = true;
      localVideoFeed.classList.add('is-screen-share');
      localVideoFeed.play().catch(e => console.warn('Screen preview play error:', e));
      localVideoFeed.classList.remove('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.add('hidden');

    updateScreenShareButtonsUI();
    updateCameraButtonsUI();

    // Notify peer via WebSocket
    if (socket && socket.readyState === WebSocket.OPEN && currentCall.callId && currentCall.partner) {
      socket.send(JSON.stringify({
        type: 'video_state',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        enabled: true,
        isScreen: true
      }));
    }

    openVideoTheater();
    updateTheaterScreenBadge();

    showToast({
      icon: '🖥️',
      title: 'Screen Sharing Active',
      body: 'You are now sharing your screen with your friend.',
      duration: 3500
    });
  } catch (err) {
    if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied') || err.message?.includes('cancelled')) {
      return; // User clicked "Cancel" in picker
    }
    console.warn('Screen share failed:', err);
    alert('Could not start screen sharing: ' + (err.message || err.name));
  }
}

async function stopScreenShare() {
  if (!currentCall.isScreenSharing) return;

  if (currentCall.localScreenTrack) {
    try { currentCall.localScreenTrack.stop(); } catch {}
    currentCall.localScreenTrack = null;
  }
  if (currentCall.localScreenStream) {
    try {
      currentCall.localScreenStream.getTracks().forEach(t => t.stop());
    } catch {}
    currentCall.localScreenStream = null;
  }

  currentCall.isScreenSharing = false;

  let sender = currentCall.videoSender;
  if (!sender && currentCall.peerConnection) {
    const vt = currentCall.peerConnection.getTransceivers().find(t => t.sender && (t.sender.track?.kind === 'video' || t.receiver?.track?.kind === 'video'));
    if (vt) {
      sender = vt.sender;
      currentCall.videoSender = sender;
    }
  }

  // Restore camera if user had it on before screen sharing
  if (currentCall.wasCameraOnBeforeScreenShare && currentCall.localVideoTrack) {
    if (sender) {
      try { await sender.replaceTrack(currentCall.localVideoTrack); } catch {}
    }
    currentCall.isVideoEnabled = true;

    if (localVideoFeed) {
      localVideoFeed.classList.remove('is-screen-share');
      localVideoFeed.srcObject = new MediaStream([currentCall.localVideoTrack]);
      localVideoFeed.play().catch(e => console.warn(e));
      localVideoFeed.classList.remove('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.add('hidden');

    if (socket && socket.readyState === WebSocket.OPEN && currentCall.callId && currentCall.partner) {
      socket.send(JSON.stringify({
        type: 'video_state',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        enabled: true,
        isScreen: false
      }));
    }
  } else {
    if (sender) {
      try { await sender.replaceTrack(null); } catch {}
    }
    currentCall.isVideoEnabled = false;

    if (localVideoFeed) {
      localVideoFeed.classList.remove('is-screen-share');
      localVideoFeed.srcObject = null;
      localVideoFeed.classList.add('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.remove('hidden');

    if (socket && socket.readyState === WebSocket.OPEN && currentCall.callId && currentCall.partner) {
      socket.send(JSON.stringify({
        type: 'video_state',
        callId: currentCall.callId,
        targetUserId: currentCall.partner.id,
        enabled: false,
        isScreen: false
      }));
    }
  }

  currentCall.wasCameraOnBeforeScreenShare = false;
  updateScreenShareButtonsUI();
  updateCameraButtonsUI();
  updateTheaterScreenBadge();

  showToast({
    icon: '🖥️',
    title: 'Screen Sharing Ended',
    body: 'You stopped sharing your screen.',
    duration: 2500
  });
}

function updateScreenShareButtonsUI() {
  const isSharing = currentCall.isScreenSharing;

  if (callScreenShareBtn) {
    callScreenShareBtn.classList.toggle('is-active', isSharing);
    if (callScreenShareBtnLabel) callScreenShareBtnLabel.textContent = isSharing ? 'Stop' : 'Screen';
    if (callScreenShareIconOff) callScreenShareIconOff.classList.toggle('hidden', isSharing);
    if (callScreenShareIconOn) callScreenShareIconOn.classList.toggle('hidden', !isSharing);
    callScreenShareBtn.title = isSharing ? 'Stop Sharing Screen' : 'Share Screen';
  }

  if (theaterScreenShareBtn) {
    theaterScreenShareBtn.classList.toggle('is-active', isSharing);
    if (theaterScreenShareBtnLabel) theaterScreenShareBtnLabel.textContent = isSharing ? 'Stop Sharing' : 'Share Screen';
    if (theaterScreenShareIconOff) theaterScreenShareIconOff.classList.toggle('hidden', isSharing);
    if (theaterScreenShareIconOn) theaterScreenShareIconOn.classList.toggle('hidden', !isSharing);
    theaterScreenShareBtn.title = isSharing ? 'Stop Sharing Screen' : 'Share Screen';
  }

  if (dmStartScreenShareBtn) {
    const isCurrentFriendCall = currentCall.partner && activeDmFriend && currentCall.partner.id === activeDmFriend.id;
    if (isCurrentFriendCall && isSharing) {
      dmStartScreenShareBtn.classList.add('is-active');
      const span = dmStartScreenShareBtn.querySelector('span');
      if (span) span.textContent = 'Stop Sharing';
    } else {
      dmStartScreenShareBtn.classList.remove('is-active');
      const span = dmStartScreenShareBtn.querySelector('span');
      if (span) span.textContent = 'Share Screen';
    }
  }
}

function updateTheaterScreenBadge() {
  if (!theaterScreenBadge) return;

  if (currentCall.isScreenSharing) {
    theaterScreenBadge.classList.remove('hidden');
    if (theaterScreenBadgeText) theaterScreenBadgeText.textContent = 'You are sharing your screen';
  } else if (currentCall.remoteVideoEnabled && currentCall.remoteIsScreenShare && currentCall.partner) {
    theaterScreenBadge.classList.remove('hidden');
    const name = currentCall.partner.displayName || currentCall.partner.username;
    if (theaterScreenBadgeText) theaterScreenBadgeText.textContent = `${name}'s Screen`;
  } else {
    theaterScreenBadge.classList.add('hidden');
  }
}

// Handle remote peer toggling camera or screen sharing on or off
function handleRemoteVideoState(msg) {
  currentCall.remoteVideoEnabled = Boolean(msg.enabled);
  currentCall.remoteIsScreenShare = Boolean(msg.isScreen);

  if (msg.enabled) {
    attachRemoteVideoFeed();
    if (remoteVideoFeed) {
      remoteVideoFeed.classList.remove('hidden');
      if (currentCall.remoteIsScreenShare) {
        remoteVideoFeed.classList.add('is-screen-share');
      } else {
        remoteVideoFeed.classList.remove('is-screen-share');
      }
    }
    if (remoteCameraOffState) remoteCameraOffState.classList.add('hidden');
    openVideoTheater();
  } else {
    if (remoteVideoFeed) {
      remoteVideoFeed.classList.add('hidden');
      remoteVideoFeed.classList.remove('is-screen-share');
    }
    if (remoteCameraOffState) remoteCameraOffState.classList.remove('hidden');
  }
  updateTheaterScreenBadge();
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
    if (remoteVideoFeed) {
      remoteVideoFeed.classList.remove('hidden');
      if (currentCall.remoteIsScreenShare) {
        remoteVideoFeed.classList.add('is-screen-share');
      } else {
        remoteVideoFeed.classList.remove('is-screen-share');
      }
    }
    if (remoteCameraOffState) remoteCameraOffState.classList.add('hidden');
  } else {
    if (remoteVideoFeed) {
      remoteVideoFeed.classList.add('hidden');
      remoteVideoFeed.classList.remove('is-screen-share');
    }
    if (remoteCameraOffState) remoteCameraOffState.classList.remove('hidden');
  }

  // Sync self preview vs placeholder
  if (currentCall.isScreenSharing && currentCall.localScreenStream) {
    if (localVideoFeed) {
      localVideoFeed.srcObject = currentCall.localScreenStream;
      localVideoFeed.muted = true;
      localVideoFeed.classList.add('is-screen-share');
      localVideoFeed.play().catch(e => console.warn(e));
      localVideoFeed.classList.remove('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.add('hidden');
  } else if (currentCall.isVideoEnabled && currentCall.localVideoTrack) {
    if (localVideoFeed) {
      localVideoFeed.classList.remove('is-screen-share');
      localVideoFeed.muted = true;
      localVideoFeed.play().catch(e => console.warn('Local preview play error:', e));
      localVideoFeed.classList.remove('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.add('hidden');
  } else {
    if (localVideoFeed) {
      localVideoFeed.classList.remove('is-screen-share');
      localVideoFeed.classList.add('hidden');
    }
    if (selfCameraOffState) selfCameraOffState.classList.remove('hidden');
  }

  updateTheaterScreenBadge();
  updateScreenShareButtonsUI();
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

  if (currentCall.localScreenTrack) {
    try { currentCall.localScreenTrack.stop(); } catch {}
    currentCall.localScreenTrack = null;
  }
  if (currentCall.localScreenStream) {
    try {
      currentCall.localScreenStream.getTracks().forEach(t => t.stop());
    } catch {}
    currentCall.localScreenStream = null;
  }

  if (currentCall.peerConnection) {
    try { currentCall.peerConnection.close(); } catch {}
    currentCall.peerConnection = null;
  }

  if (remoteVoiceAudio) remoteVoiceAudio.srcObject = null;
  if (remoteVideoFeed) {
    remoteVideoFeed.srcObject = null;
    remoteVideoFeed.classList.remove('is-screen-share', 'fill-mode');
  }
  if (localVideoFeed) {
    localVideoFeed.srcObject = null;
    localVideoFeed.classList.remove('is-screen-share');
  }

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
  currentCall.isScreenSharing = false;
  currentCall.remoteIsScreenShare = false;
  currentCall.wasCameraOnBeforeScreenShare = false;
  currentCall.pendingStartScreenShare = false;
  currentCall.videoSender = null;
  currentCall.isTheaterOpen = false;
  currentCall.seconds = 0;
  pendingIceCandidates = [];

  updateMuteButtonUI();
  updateCameraButtonsUI();
  updateScreenShareButtonsUI();
  updateTheaterScreenBadge();

  if (activeCallWidget) activeCallWidget.classList.add('hidden');
  if (activeCallTheaterOverlay) activeCallTheaterOverlay.classList.add('hidden');
  if (incomingCallModalOverlay) incomingCallModalOverlay.classList.add('hidden');
}

// Voice, Video & Screen Share Calling Event Listeners
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

if (callScreenShareBtn) {
  callScreenShareBtn.addEventListener('click', toggleScreenShare);
}

if (theaterScreenShareBtn) {
  theaterScreenShareBtn.addEventListener('click', toggleScreenShare);
}

if (theaterScreenFitBtn && remoteVideoFeed) {
  theaterScreenFitBtn.addEventListener('click', () => {
    const isFill = remoteVideoFeed.classList.toggle('fill-mode');
    theaterScreenFitBtn.textContent = isFill ? 'Aspect: Fill' : 'Aspect: Fit';
  });
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
// SERVER VOICE CHANNELS & WEBRTC MESH ENGINE
// ==========================================

const serverVoiceState = {
  serverId: null,
  channelId: null,
  channelName: '',
  participants: [],
  localStream: null,
  cameraStream: null,
  screenStream: null,
  peerConnections: new Map(), // targetUserId -> RTCPeerConnection
  remoteStreams: new Map(), // targetUserId -> MediaStream
  remoteAudioElements: new Map(), // targetUserId -> HTMLAudioElement
  isMuted: false,
  isDeafened: false,
  isVideo: false,
  isScreenShare: false,
  audioContext: null,
  analyser: null,
  speakingAnimFrame: null,
  isSpeaking: false,
  speakingUsers: new Set()
};

async function joinServerVoiceChannel(channelId, channelName) {
  if (!token) return;

  // End any 1-to-1 voice call if active
  if (typeof currentCall !== 'undefined' && currentCall.callId) {
    endVoiceCall(true);
  }

  // If already in another voice channel, leave it first
  if (serverVoiceState.channelId && serverVoiceState.channelId !== channelId) {
    leaveServerVoiceChannel(false);
  }

  let micObtained = false;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      serverVoiceState.localStream = await navigator.mediaDevices.getUserMedia({ audio: getAudioInputConstraints(), video: false });
      micObtained = true;
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err.message);
      showToast({
        icon: '🎧',
        title: 'Joined Voice (Listen Only)',
        body: 'Microphone not detected or permission denied. You can still listen and watch!'
      });
    }
  } else {
    showToast({
      icon: '🎧',
      title: 'Joined Voice (Listen Only)',
      body: 'WebRTC microphone API not available. Listening mode active.'
    });
  }

  serverVoiceState.serverId = activeServerId;
  serverVoiceState.channelId = channelId;
  serverVoiceState.channelName = channelName;
  serverVoiceState.isMuted = !micObtained;
  serverVoiceState.isDeafened = false;
  serverVoiceState.isVideo = false;
  serverVoiceState.isScreenShare = false;

  // Optimistically register current user so the stage card renders immediately
  if (currentUser) {
    serverVoiceState.participants = [{
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      isMuted: false,
      isDeafened: false,
      isVideo: false,
      isScreenShare: false,
      joinedAt: new Date().toISOString()
    }];
    serverVoiceStates[channelId] = serverVoiceState.participants;
  }

  setupVoiceSpeakingDetector();
  playCallChime('connect');

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'server_voice_join',
      serverId: activeServerId,
      channelId: channelId,
      isMuted: false,
      isDeafened: false,
      isVideo: false,
      isScreenShare: false
    }));
  }

  updateServerVoiceDockUI();
  updateServerVoiceControlsUI();
  openVoiceStageView();
}

function setupVoiceSpeakingDetector() {
  if (!serverVoiceState.localStream) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const source = ctx.createMediaStreamSource(serverVoiceState.localStream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    serverVoiceState.audioContext = ctx;
    serverVoiceState.analyser = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let silenceTimer = null;

    function checkAudio() {
      if (!serverVoiceState.analyser || !serverVoiceState.localStream) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length;

      const isTalking = avg > 12 && !serverVoiceState.isMuted && !serverVoiceState.isDeafened;

      if (isTalking) {
        if (!serverVoiceState.isSpeaking) {
          serverVoiceState.isSpeaking = true;
          if (currentUser) serverVoiceState.speakingUsers.add(currentUser.id);
          sendVoiceSpeaking(true);
          updateSpeakingUI(currentUser?.id, true);
        }
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      } else if (serverVoiceState.isSpeaking && !silenceTimer) {
        silenceTimer = setTimeout(() => {
          serverVoiceState.isSpeaking = false;
          if (currentUser) serverVoiceState.speakingUsers.delete(currentUser.id);
          sendVoiceSpeaking(false);
          updateSpeakingUI(currentUser?.id, false);
          silenceTimer = null;
        }, 350);
      }

      serverVoiceState.speakingAnimFrame = requestAnimationFrame(checkAudio);
    }

    serverVoiceState.speakingAnimFrame = requestAnimationFrame(checkAudio);
  } catch (err) {
    console.warn('AudioAnalyser setup failed:', err);
  }
}

function sendVoiceSpeaking(speaking) {
  if (socket && socket.readyState === WebSocket.OPEN && serverVoiceState.channelId) {
    socket.send(JSON.stringify({
      type: 'server_voice_speaking',
      channelId: serverVoiceState.channelId,
      speaking
    }));
  }
}

function updateSpeakingUI(userId, speaking) {
  if (!userId) return;
  const uId = Number(userId);
  if (speaking) {
    serverVoiceState.speakingUsers.add(uId);
  } else {
    serverVoiceState.speakingUsers.delete(uId);
  }

  // Update card in stage grid
  const card = document.querySelector(`.voice-stage-card[data-user-id="${uId}"]`);
  if (card) {
    card.classList.toggle('speaking', speaking);
  }

  // Update avatar in sidebar
  const avatar = document.querySelector(`.voice-user-row[data-user-id="${uId}"] .voice-user-avatar`);
  if (avatar) {
    avatar.classList.toggle('speaking', speaking);
  }
}

function handleServerVoiceJoined(msg) {
  serverVoiceState.serverId = msg.serverId;
  serverVoiceState.channelId = msg.channelId;
  serverVoiceState.channelName = msg.channelName;
  serverVoiceState.participants = msg.participants || [];

  serverVoiceStates[msg.channelId] = serverVoiceState.participants;

  updateServerVoiceDockUI();
  updateServerVoiceControlsUI();
  renderVoiceStageGrid();
  renderChannelList();

  // Connect to every other participant already in the channel
  serverVoiceState.participants.forEach(p => {
    if (currentUser && p.userId !== currentUser.id) {
      initiatePeerConnection(p.userId);
    }
  });
}

function initiatePeerConnection(targetUserId) {
  const pc = getOrCreatePeerConnection(targetUserId);
  pc.createOffer().then(offer => {
    return pc.setLocalDescription(offer);
  }).then(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'server_voice_signal',
        channelId: serverVoiceState.channelId,
        targetUserId,
        signal: { type: 'offer', sdp: pc.localDescription }
      }));
    }
  }).catch(err => console.error('Error creating voice offer to peer:', err));
}

function getOrCreatePeerConnection(targetUserId) {
  const uId = Number(targetUserId);
  if (serverVoiceState.peerConnections.has(uId)) {
    return serverVoiceState.peerConnections.get(uId);
  }

  const pc = new RTCPeerConnection(rtcConfig || { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

  // Add local stream tracks
  if (serverVoiceState.localStream) {
    serverVoiceState.localStream.getTracks().forEach(track => {
      pc.addTrack(track, serverVoiceState.localStream);
    });
  }
  if (serverVoiceState.cameraStream) {
    serverVoiceState.cameraStream.getTracks().forEach(track => {
      pc.addTrack(track, serverVoiceState.cameraStream);
    });
  }
  if (serverVoiceState.screenStream) {
    serverVoiceState.screenStream.getTracks().forEach(track => {
      pc.addTrack(track, serverVoiceState.screenStream);
    });
  }

  pc.onicecandidate = (event) => {
    if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'server_voice_signal',
        channelId: serverVoiceState.channelId,
        targetUserId: uId,
        signal: { type: 'candidate', candidate: event.candidate }
      }));
    }
  };

  pc.ontrack = (event) => {
    const stream = event.streams[0] || new MediaStream([event.track]);
    serverVoiceState.remoteStreams.set(uId, stream);

    if (event.track.kind === 'audio') {
      let audioEl = serverVoiceState.remoteAudioElements.get(uId);
      if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.autoplay = true;
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);
        serverVoiceState.remoteAudioElements.set(uId, audioEl);
      }
      audioEl.srcObject = stream;
      audioEl.volume = serverVoiceState.isDeafened ? 0 : 1;
    } else if (event.track.kind === 'video') {
      attachRemoteVideoToCard(uId, stream);
    }
  };

  serverVoiceState.peerConnections.set(uId, pc);
  return pc;
}

function attachRemoteVideoToCard(userId, stream) {
  const card = document.querySelector(`.voice-stage-card[data-user-id="${userId}"]`);
  if (!card) return;
  card.classList.add('has-video');
  let videoEl = card.querySelector('.voice-card-video');
  if (!videoEl) {
    videoEl = document.createElement('video');
    videoEl.className = 'voice-card-video';
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    card.insertBefore(videoEl, card.firstChild);
  }
  videoEl.srcObject = stream;
  videoEl.play().catch(e => console.warn('Remote video playback error:', e));
}

async function handleServerVoiceSignal(msg) {
  const fromUserId = Number(msg.fromUserId);
  const signal = msg.signal;
  if (!signal) return;

  const pc = getOrCreatePeerConnection(fromUserId);

  if (signal.type === 'offer') {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'server_voice_signal',
          channelId: serverVoiceState.channelId,
          targetUserId: fromUserId,
          signal: { type: 'answer', sdp: pc.localDescription }
        }));
      }
    } catch (err) {
      console.error('Error handling voice offer signal:', err);
    }
  } else if (signal.type === 'answer') {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    } catch (err) {
      console.error('Error setting remote description for voice answer:', err);
    }
  } else if (signal.type === 'candidate' && signal.candidate) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
    } catch (err) {
      console.error('Error adding voice ICE candidate:', err);
    }
  }
}

function handleServerVoiceStateUpdate(msg) {
  if (msg.serverId !== activeServerId) return;

  // Update in-memory states
  serverVoiceStates[msg.channelId] = msg.participants || [];

  if (serverVoiceState.channelId === msg.channelId) {
    serverVoiceState.participants = msg.participants || [];

    if (msg.action === 'leave' && msg.userId) {
      closeVoicePeerConnection(msg.userId);
    }

    renderVoiceStageGrid();
    updateServerVoiceDockUI();
  }

  renderChannelList();
  if (typeof renderServerMembersSidebar === 'function') renderServerMembersSidebar();
}

function handleServerVoiceMediaState(msg) {
  if (msg.serverId !== activeServerId) return;

  const list = serverVoiceStates[msg.channelId];
  if (list) {
    const p = list.find(x => x.userId === msg.userId);
    if (p) {
      p.isMuted = msg.isMuted;
      p.isDeafened = msg.isDeafened;
      p.isVideo = msg.isVideo;
      p.isScreenShare = msg.isScreenShare;
    }
  }

  if (serverVoiceState.channelId === msg.channelId) {
    const p = serverVoiceState.participants.find(x => x.userId === msg.userId);
    if (p) {
      p.isMuted = msg.isMuted;
      p.isDeafened = msg.isDeafened;
      p.isVideo = msg.isVideo;
      p.isScreenShare = msg.isScreenShare;
    }
    renderVoiceStageGrid();
  }

  renderChannelList();
}

function closeVoicePeerConnection(userId) {
  const uId = Number(userId);
  const pc = serverVoiceState.peerConnections.get(uId);
  if (pc) {
    try { pc.close(); } catch {}
    serverVoiceState.peerConnections.delete(uId);
  }
  const audioEl = serverVoiceState.remoteAudioElements.get(uId);
  if (audioEl) {
    try { audioEl.remove(); } catch {}
    serverVoiceState.remoteAudioElements.delete(uId);
  }
  serverVoiceState.remoteStreams.delete(uId);
  serverVoiceState.speakingUsers.delete(uId);
}

function leaveServerVoiceChannel(shouldSend = true) {
  if (!serverVoiceState.channelId) return;

  playCallChime('end');

  if (shouldSend && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'server_voice_leave',
      channelId: serverVoiceState.channelId
    }));
  }

  // Stop local audio track
  if (serverVoiceState.localStream) {
    serverVoiceState.localStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
    serverVoiceState.localStream = null;
  }
  // Stop camera track
  if (serverVoiceState.cameraStream) {
    serverVoiceState.cameraStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
    serverVoiceState.cameraStream = null;
  }
  // Stop screenshare track
  if (serverVoiceState.screenStream) {
    serverVoiceState.screenStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
    serverVoiceState.screenStream = null;
  }

  // Stop analyser
  if (serverVoiceState.speakingAnimFrame) {
    cancelAnimationFrame(serverVoiceState.speakingAnimFrame);
    serverVoiceState.speakingAnimFrame = null;
  }
  if (serverVoiceState.audioContext) {
    try { serverVoiceState.audioContext.close(); } catch {}
    serverVoiceState.audioContext = null;
  }
  serverVoiceState.analyser = null;

  // Close all peer connections
  serverVoiceState.peerConnections.forEach((pc) => {
    try { pc.close(); } catch {}
  });
  serverVoiceState.peerConnections.clear();

  // Remove remote audio elements
  serverVoiceState.remoteAudioElements.forEach((el) => {
    try { el.remove(); } catch {}
  });
  serverVoiceState.remoteAudioElements.clear();
  serverVoiceState.remoteStreams.clear();
  serverVoiceState.speakingUsers.clear();

  const prevChannelId = serverVoiceState.channelId;
  serverVoiceState.serverId = null;
  serverVoiceState.channelId = null;
  serverVoiceState.channelName = '';
  serverVoiceState.participants = [];
  serverVoiceState.isMuted = false;
  serverVoiceState.isDeafened = false;
  serverVoiceState.isVideo = false;
  serverVoiceState.isScreenShare = false;
  serverVoiceState.isSpeaking = false;

  if (prevChannelId && serverVoiceStates[prevChannelId] && currentUser) {
    serverVoiceStates[prevChannelId] = serverVoiceStates[prevChannelId].filter(p => p.userId !== currentUser.id);
  }

  // Hide voice dock
  if (serverVoiceDock) serverVoiceDock.classList.add('hidden');

  // If viewing voice stage, return to active text channel
  if (isViewingVoiceStage) {
    switchToTextChannel(activeChannelId);
  } else {
    renderChannelList();
  }
}

function updateServerVoiceDockUI() {
  if (!serverVoiceDock) return;
  if (!serverVoiceState.channelId) {
    serverVoiceDock.classList.add('hidden');
    return;
  }

  serverVoiceDock.classList.remove('hidden');
  if (serverVoiceDockChannelName) {
    serverVoiceDockChannelName.textContent = serverVoiceState.channelName || 'Lounge';
  }

  // Mute button in dock
  if (serverVoiceMuteBtn) {
    serverVoiceMuteBtn.classList.toggle('active-danger', serverVoiceState.isMuted);
    const unmutedIcon = serverVoiceMuteBtn.querySelector('.dock-unmuted-icon');
    const mutedIcon = serverVoiceMuteBtn.querySelector('.dock-muted-icon');
    if (unmutedIcon) unmutedIcon.classList.toggle('hidden', serverVoiceState.isMuted);
    if (mutedIcon) mutedIcon.classList.toggle('hidden', !serverVoiceState.isMuted);
  }

  // Deafen button in dock
  if (serverVoiceDeafenBtn) {
    serverVoiceDeafenBtn.classList.toggle('active-danger', serverVoiceState.isDeafened);
    const undeafenedIcon = serverVoiceDeafenBtn.querySelector('.dock-undeafened-icon');
    const deafenedIcon = serverVoiceDeafenBtn.querySelector('.dock-deafened-icon');
    if (undeafenedIcon) undeafenedIcon.classList.toggle('hidden', serverVoiceState.isDeafened);
    if (deafenedIcon) deafenedIcon.classList.toggle('hidden', !serverVoiceState.isDeafened);
  }

  // Camera button in dock
  if (serverVoiceCameraBtn) {
    serverVoiceCameraBtn.classList.toggle('active-success', serverVoiceState.isVideo);
    const camOffIcon = serverVoiceCameraBtn.querySelector('.dock-cam-off-icon');
    const camOnIcon = serverVoiceCameraBtn.querySelector('.dock-cam-on-icon');
    if (camOffIcon) camOffIcon.classList.toggle('hidden', serverVoiceState.isVideo);
    if (camOnIcon) camOnIcon.classList.toggle('hidden', !serverVoiceState.isVideo);
  }

  // Screen Share button in dock
  if (serverVoiceScreenShareBtn) {
    serverVoiceScreenShareBtn.classList.toggle('active-success', serverVoiceState.isScreenShare);
    const screenOffIcon = serverVoiceScreenShareBtn.querySelector('.dock-screen-off-icon');
    const screenOnIcon = serverVoiceScreenShareBtn.querySelector('.dock-screen-on-icon');
    if (screenOffIcon) screenOffIcon.classList.toggle('hidden', serverVoiceState.isScreenShare);
    if (screenOnIcon) screenOnIcon.classList.toggle('hidden', !serverVoiceState.isScreenShare);
  }
}

function updateServerVoiceControlsUI() {
  updateServerVoiceDockUI();

  // Stage Mute button
  if (stageMuteBtn) {
    stageMuteBtn.classList.toggle('active-danger', serverVoiceState.isMuted);
    const unmutedIcon = stageMuteBtn.querySelector('.stage-unmuted-icon');
    const mutedIcon = stageMuteBtn.querySelector('.stage-muted-icon');
    if (unmutedIcon) unmutedIcon.classList.toggle('hidden', serverVoiceState.isMuted);
    if (mutedIcon) mutedIcon.classList.toggle('hidden', !serverVoiceState.isMuted);
    const label = stageMuteBtn.querySelector('span');
    if (label) label.textContent = serverVoiceState.isMuted ? 'Unmute' : 'Mute';
  }

  // Stage Deafen button
  if (stageDeafenBtn) {
    stageDeafenBtn.classList.toggle('active-danger', serverVoiceState.isDeafened);
    const undeafenedIcon = stageDeafenBtn.querySelector('.stage-undeafened-icon');
    const deafenedIcon = stageDeafenBtn.querySelector('.stage-deafened-icon');
    if (undeafenedIcon) undeafenedIcon.classList.toggle('hidden', serverVoiceState.isDeafened);
    if (deafenedIcon) deafenedIcon.classList.toggle('hidden', !serverVoiceState.isDeafened);
    const label = stageDeafenBtn.querySelector('span');
    if (label) label.textContent = serverVoiceState.isDeafened ? 'Undeafen' : 'Deafen';
  }

  // Stage Camera button
  if (stageCameraBtn) {
    stageCameraBtn.classList.toggle('active-success', serverVoiceState.isVideo);
    const camOffIcon = stageCameraBtn.querySelector('.stage-cam-off-icon');
    const camOnIcon = stageCameraBtn.querySelector('.stage-cam-on-icon');
    if (camOffIcon) camOffIcon.classList.toggle('hidden', serverVoiceState.isVideo);
    if (camOnIcon) camOnIcon.classList.toggle('hidden', !serverVoiceState.isVideo);
    const label = stageCameraBtn.querySelector('span');
    if (label) label.textContent = serverVoiceState.isVideo ? 'Stop Video' : 'Camera';
  }

  // Stage Screen Share button
  if (stageScreenBtn) {
    stageScreenBtn.classList.toggle('active-success', serverVoiceState.isScreenShare);
    const screenOffIcon = stageScreenBtn.querySelector('.stage-screen-off-icon');
    const screenOnIcon = stageScreenBtn.querySelector('.stage-screen-on-icon');
    if (screenOffIcon) screenOffIcon.classList.toggle('hidden', serverVoiceState.isScreenShare);
    if (screenOnIcon) screenOnIcon.classList.toggle('hidden', !serverVoiceState.isScreenShare);
    const label = stageScreenBtn.querySelector('span');
    if (label) label.textContent = serverVoiceState.isScreenShare ? 'Stop Share' : 'Share Screen';
  }
}

function renderVoiceStageGrid() {
  if (!voiceStageGrid) return;
  voiceStageGrid.innerHTML = '';

  const participants = (serverVoiceState.participants && serverVoiceState.participants.length > 0)
    ? [...serverVoiceState.participants]
    : (serverVoiceState.channelId && currentUser ? [{
        userId: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        isMuted: serverVoiceState.isMuted,
        isDeafened: serverVoiceState.isDeafened,
        isVideo: serverVoiceState.isVideo,
        isScreenShare: serverVoiceState.isScreenShare
      }] : []);

  if (voiceStageCount) {
    voiceStageCount.textContent = `${participants.length} Connected`;
  }

  if (participants.length === 0) {
    voiceStageGrid.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); gap: 12px; margin: auto;">
        <span style="font-size: 48px;">🔊</span>
        <h3 style="font-size: 18px; color: var(--text-header); margin: 0;">Voice Channel is Empty</h3>
        <p style="font-size: 14px; margin: 0;">Waiting for participants to join...</p>
      </div>
    `;
    return;
  }

  participants.forEach(p => {
    const isSpeaking = serverVoiceState.speakingUsers.has(p.userId);
    const isLocal = currentUser && p.userId === currentUser.id;
    const localVideoActive = isLocal && Boolean(serverVoiceState.screenStream || serverVoiceState.cameraStream);
    const remoteVideoActive = !isLocal && Boolean(serverVoiceState.remoteStreams.get(p.userId)?.getVideoTracks().length > 0);
    const hasVideo = localVideoActive || remoteVideoActive;

    const card = document.createElement('div');
    card.className = 'voice-stage-card' + (isSpeaking ? ' speaking' : '') + (hasVideo ? ' has-video' : '');
    card.setAttribute('data-user-id', p.userId);

    const displayName = p.displayName || p.username || 'User';
    const initial = displayName.charAt(0) ? displayName.charAt(0).toUpperCase() : 'U';
    let avatarContent = `<span class="voice-card-initial">${initial}</span>`;
    if (p.avatarUrl) {
      avatarContent = `<img src="${resolveAssetUrl(p.avatarUrl)}" alt="${escapeHtml(displayName)}" onerror="this.remove();" /><span class="voice-card-initial">${initial}</span>`;
    }

    let badgeIcons = '';
    if (p.isMuted) {
      badgeIcons += `<span title="Muted"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c1.33-.19 2.53-.78 3.53-1.62l3.2 3.2 1.27-1.27L4.27 3z"/></svg></span>`;
    }
    if (p.isDeafened) {
      badgeIcons += `<span title="Deafened"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4.27 3L3 4.27l3.28 3.28C4.19 8.92 3 10.82 3 13v7c0 1.1.9 2 2 2h4v-8H5v-1c0-1.51.52-2.9 1.4-4L12 14.6V21h2v-4.4l4.73 4.73 1.27-1.27L4.27 3zM19 13v-1a7 7 0 0 0-11.83-5.11l1.45 1.45A4.97 4.97 0 0 1 19 12v1h-2v3.17l2 2V13z"/></svg></span>`;
    }

    card.innerHTML = `
      <div class="voice-card-avatar">${avatarContent}</div>
      <div class="voice-card-meta">
        <span class="voice-card-name">${escapeHtml(displayName)}</span>
        <div class="voice-card-icons">${badgeIcons}</div>
      </div>
    `;

    // Attach video stream if active
    if (localVideoActive) {
      const activeStream = serverVoiceState.screenStream || serverVoiceState.cameraStream;
      const video = document.createElement('video');
      video.className = 'voice-card-video';
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.srcObject = activeStream;
      card.insertBefore(video, card.firstChild);
    } else if (remoteVideoActive) {
      const remoteStream = serverVoiceState.remoteStreams.get(p.userId);
      const video = document.createElement('video');
      video.className = 'voice-card-video';
      video.autoplay = true;
      video.playsInline = true;
      video.srcObject = remoteStream;
      card.insertBefore(video, card.firstChild);
    }

    voiceStageGrid.appendChild(card);
  });
}

function toggleServerVoiceMute() {
  if (!serverVoiceState.localStream) return;
  serverVoiceState.isMuted = !serverVoiceState.isMuted;
  serverVoiceState.localStream.getAudioTracks().forEach(t => {
    t.enabled = !serverVoiceState.isMuted;
  });

  if (serverVoiceState.isMuted && serverVoiceState.isSpeaking) {
    serverVoiceState.isSpeaking = false;
    if (currentUser) serverVoiceState.speakingUsers.delete(currentUser.id);
    sendVoiceSpeaking(false);
    updateSpeakingUI(currentUser?.id, false);
  }

  sendServerVoiceMediaState();
  updateServerVoiceControlsUI();
}

function toggleServerVoiceDeafen() {
  serverVoiceState.isDeafened = !serverVoiceState.isDeafened;
  if (serverVoiceState.isDeafened) {
    serverVoiceState.isMuted = true;
    if (serverVoiceState.localStream) {
      serverVoiceState.localStream.getAudioTracks().forEach(t => t.enabled = false);
    }
  }

  // Mute or unmute all remote audio elements
  serverVoiceState.remoteAudioElements.forEach(el => {
    el.volume = serverVoiceState.isDeafened ? 0 : 1;
  });

  sendServerVoiceMediaState();
  updateServerVoiceControlsUI();
}

async function toggleServerVoiceCamera() {
  if (!serverVoiceState.channelId) return;

  if (serverVoiceState.isVideo) {
    // Turn off camera
    if (serverVoiceState.cameraStream) {
      serverVoiceState.cameraStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
      serverVoiceState.cameraStream = null;
    }
    serverVoiceState.isVideo = false;
    // Remove video track from peer connections
    serverVoiceState.peerConnections.forEach(pc => {
      const senders = pc.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video');
      if (videoSender) pc.removeTrack(videoSender);
    });
    sendServerVoiceMediaState();
    updateServerVoiceControlsUI();
    renderVoiceStageGrid();
  } else {
    // Turn on camera
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: getVideoInputConstraints(), audio: false });
      serverVoiceState.cameraStream = camStream;
      serverVoiceState.isVideo = true;
      const videoTrack = camStream.getVideoTracks()[0];

      // Add video track to all peer connections
      serverVoiceState.peerConnections.forEach(pc => {
        pc.addTrack(videoTrack, camStream);
      });

      sendServerVoiceMediaState();
      updateServerVoiceControlsUI();
      renderVoiceStageGrid();

      // Trigger renegotiation offers
      serverVoiceState.peerConnections.forEach((pc, targetUserId) => {
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'server_voice_signal',
              channelId: serverVoiceState.channelId,
              targetUserId,
              signal: { type: 'offer', sdp: pc.localDescription }
            }));
          }
        }).catch(err => console.error('Renegotiation error on camera add:', err));
      });
    } catch (err) {
      showToast({ icon: '📷', title: 'Camera Error', body: 'Could not access camera: ' + (err.message || err.name) });
    }
  }
}

async function toggleServerVoiceScreenShare() {
  if (!serverVoiceState.channelId) return;

  if (serverVoiceState.isScreenShare) {
    // Stop screen share
    if (serverVoiceState.screenStream) {
      serverVoiceState.screenStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
      serverVoiceState.screenStream = null;
    }
    serverVoiceState.isScreenShare = false;

    // Restore camera track if camera was active, or remove/null video sender
    serverVoiceState.peerConnections.forEach(pc => {
      const senders = pc.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video') || senders.find(s => s.track === null);
      if (videoSender) {
        if (serverVoiceState.isVideo && serverVoiceState.cameraStream) {
          const camTrack = serverVoiceState.cameraStream.getVideoTracks()[0];
          if (camTrack) videoSender.replaceTrack(camTrack).catch(() => {});
        } else {
          try { videoSender.replaceTrack(null); } catch {}
          try { pc.removeTrack(videoSender); } catch {}
        }
      }
    });

    sendServerVoiceMediaState();
    updateServerVoiceControlsUI();
    renderVoiceStageGrid();

    // Trigger renegotiation on stop
    serverVoiceState.peerConnections.forEach((pc, targetUserId) => {
      pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'server_voice_signal',
            channelId: serverVoiceState.channelId,
            targetUserId,
            signal: { type: 'offer', sdp: pc.localDescription }
          }));
        }
      }).catch(err => console.warn('Renegotiation error on screenshare remove:', err));
    });
  } else {
    // Start screen share
    try {
      const screenStream = await openScreenSharePicker();
      serverVoiceState.screenStream = screenStream;
      serverVoiceState.isScreenShare = true;
      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) throw new Error('No screen video track captured.');

      screenTrack.onended = () => {
        if (serverVoiceState.isScreenShare) {
          toggleServerVoiceScreenShare();
        }
      };

      serverVoiceState.peerConnections.forEach(pc => {
        const senders = pc.getSenders();
        const videoSender = senders.find(s => s.track && s.track.kind === 'video') || senders.find(s => s.track === null);
        if (videoSender) {
          videoSender.replaceTrack(screenTrack).catch(err => {
            console.warn('replaceTrack failed, adding track directly:', err);
            pc.addTrack(screenTrack, screenStream);
          });
        } else {
          pc.addTrack(screenTrack, screenStream);
        }
      });

      sendServerVoiceMediaState();
      updateServerVoiceControlsUI();
      renderVoiceStageGrid();

      serverVoiceState.peerConnections.forEach((pc, targetUserId) => {
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'server_voice_signal',
              channelId: serverVoiceState.channelId,
              targetUserId,
              signal: { type: 'offer', sdp: pc.localDescription }
            }));
          }
        }).catch(err => console.error('Renegotiation error on screenshare add:', err));
      });
    } catch (err) {
      if (err.name !== 'NotAllowedError' && !err.message?.includes('cancelled')) {
        showToast({ icon: '🖥️', title: 'Screen Share Error', body: 'Could not share screen: ' + (err.message || err.name) });
      }
    }
  }
}

function sendServerVoiceMediaState() {
  if (socket && socket.readyState === WebSocket.OPEN && serverVoiceState.channelId) {
    socket.send(JSON.stringify({
      type: 'server_voice_media_state',
      channelId: serverVoiceState.channelId,
      isMuted: serverVoiceState.isMuted,
      isDeafened: serverVoiceState.isDeafened,
      isVideo: serverVoiceState.isVideo,
      isScreenShare: serverVoiceState.isScreenShare
    }));
  }
}

// Wire Server Voice Event Listeners
if (serverVoiceMuteBtn) serverVoiceMuteBtn.addEventListener('click', toggleServerVoiceMute);
if (stageMuteBtn) stageMuteBtn.addEventListener('click', toggleServerVoiceMute);
if (serverVoiceDeafenBtn) serverVoiceDeafenBtn.addEventListener('click', toggleServerVoiceDeafen);
if (stageDeafenBtn) stageDeafenBtn.addEventListener('click', toggleServerVoiceDeafen);
if (serverVoiceCameraBtn) serverVoiceCameraBtn.addEventListener('click', toggleServerVoiceCamera);
if (stageCameraBtn) stageCameraBtn.addEventListener('click', toggleServerVoiceCamera);
if (serverVoiceScreenShareBtn) serverVoiceScreenShareBtn.addEventListener('click', toggleServerVoiceScreenShare);
if (stageScreenBtn) stageScreenBtn.addEventListener('click', toggleServerVoiceScreenShare);
if (serverVoiceDisconnectBtn) serverVoiceDisconnectBtn.addEventListener('click', () => leaveServerVoiceChannel(true));
if (stageLeaveBtn) stageLeaveBtn.addEventListener('click', () => leaveServerVoiceChannel(true));
if (voiceStageDisconnectBtn) voiceStageDisconnectBtn.addEventListener('click', () => leaveServerVoiceChannel(true));
if (serverVoiceOpenStageBtn) serverVoiceOpenStageBtn.addEventListener('click', openVoiceStageView);
if (voiceStageToggleChatBtn) {
  voiceStageToggleChatBtn.addEventListener('click', () => {
    switchToTextChannel(activeChannelId);
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
  feedbackModalOverlay.classList.remove('is-closing');
  const card = feedbackModalOverlay.querySelector('.feedback-forum-modal-card');
  if (card) card.classList.remove('is-closing');
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
    closeModalWithDynamicIsland(feedbackModalOverlay, '.feedback-forum-modal-card');
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

// ==========================================================================
// STAGE 3d.5: NOTIFICATION CENTER & INBOX
// ==========================================================================

const NOTIF_SETTINGS_KEY = 'voiceline_notif_settings';
let notificationsList = [];
let unreadNotificationsCount = 0;
let currentNotifFilter = 'all';

function defaultNotifSettings() {
  return {
    soundsEnabled: true,
    urgentAlwaysAlert: true,
    mentions: true,
    dms: true,
    friends: true,
    calls: true,
    feedback: true,
    scheduled: true,
    servers: true
  };
}

function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(NOTIF_SETTINGS_KEY);
    if (raw) return { ...defaultNotifSettings(), ...JSON.parse(raw) };
  } catch {}
  return defaultNotifSettings();
}

function saveNotificationSettings(settings) {
  try {
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save notification settings:', err);
  }
}

function bindNotificationSettingsUI() {
  const s = getNotificationSettings();

  const toggleSounds = document.getElementById('notifToggleSounds') || document.getElementById('notifSoundsEnableToggle');
  const toggleUrgent = document.getElementById('notifToggleUrgentAlert') || document.getElementById('notifUrgentAlwaysAlertToggle');
  const toggleMentions = document.getElementById('notifToggleMentions') || document.getElementById('notifCategoryMentionsToggle');
  const toggleDms = document.getElementById('notifToggleDms') || document.getElementById('notifCategoryDmsToggle');
  const toggleFriends = document.getElementById('notifToggleFriends') || document.getElementById('notifCategoryFriendsToggle');
  const toggleCalls = document.getElementById('notifToggleCalls') || document.getElementById('notifCategoryCallsToggle');
  const toggleFeedback = document.getElementById('notifToggleFeedback');
  const toggleScheduled = document.getElementById('notifCategoryScheduledToggle');
  const toggleServers = document.getElementById('notifCategoryServersToggle');
  const clearSettingsBtn = document.getElementById('clearAllNotifsSettingsBtn');

  if (toggleSounds) {
    toggleSounds.checked = s.soundsEnabled !== false;
    toggleSounds.onchange = () => {
      const cur = getNotificationSettings();
      cur.soundsEnabled = toggleSounds.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleUrgent) {
    toggleUrgent.checked = s.urgentAlwaysAlert !== false;
    toggleUrgent.onchange = () => {
      const cur = getNotificationSettings();
      cur.urgentAlwaysAlert = toggleUrgent.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleMentions) {
    toggleMentions.checked = s.mentions !== false;
    toggleMentions.onchange = () => {
      const cur = getNotificationSettings();
      cur.mentions = toggleMentions.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleDms) {
    toggleDms.checked = s.dms !== false;
    toggleDms.onchange = () => {
      const cur = getNotificationSettings();
      cur.dms = toggleDms.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleFriends) {
    toggleFriends.checked = s.friends !== false;
    toggleFriends.onchange = () => {
      const cur = getNotificationSettings();
      cur.friends = toggleFriends.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleCalls) {
    toggleCalls.checked = s.calls !== false;
    toggleCalls.onchange = () => {
      const cur = getNotificationSettings();
      cur.calls = toggleCalls.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleFeedback) {
    toggleFeedback.checked = s.feedback !== false;
    toggleFeedback.onchange = () => {
      const cur = getNotificationSettings();
      cur.feedback = toggleFeedback.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleScheduled) {
    toggleScheduled.checked = s.scheduled !== false;
    toggleScheduled.onchange = () => {
      const cur = getNotificationSettings();
      cur.scheduled = toggleScheduled.checked;
      saveNotificationSettings(cur);
    };
  }

  if (toggleServers) {
    toggleServers.checked = s.servers !== false;
    toggleServers.onchange = () => {
      const cur = getNotificationSettings();
      cur.servers = toggleServers.checked;
      saveNotificationSettings(cur);
    };
  }

  if (clearSettingsBtn) {
    clearSettingsBtn.onclick = () => {
      if (confirm('Are you sure you want to clear all notifications?')) {
        clearAllNotifs();
      }
    };
  }
}

// Notification chime synthesizer
function playNotificationSound(pingLevel = 'yellow') {
  const settings = getNotificationSettings();
  const isRed = pingLevel === 'red';

  if (!settings.soundsEnabled && !(isRed && settings.urgentAlwaysAlert)) {
    return;
  }

  // DND suppression: casual notifications muted unless urgent red with urgent override
  if (currentUser && currentUser.status === 'dnd') {
    if (!isRed || !settings.urgentAlwaysAlert) {
      return;
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    if (pingLevel === 'green') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (pingLevel === 'red') {
      [0, 0.075, 0.15].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = 'square';
        const freq = idx === 2 ? 1046.5 : 880;
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.08);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now + delay);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.09);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    console.error('Failed to play notification audio chime:', err);
  }
}

async function loadNotifications() {
  if (!token) return;
  const loadingEl = document.getElementById('notifLoadingState');
  if (loadingEl && (!notificationsList || notificationsList.length === 0)) {
    loadingEl.classList.remove('hidden');
  }
  try {
    const res = await fetch('/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      notificationsList = Array.isArray(data.notifications) ? data.notifications : [];
      unreadNotificationsCount = typeof data.unreadCount === 'number'
        ? data.unreadCount
        : notificationsList.filter(n => !n.is_read).length;
      updateNotifBadge(unreadNotificationsCount);
      renderNotificationsList();
    }
  } catch (err) {
    console.error('Failed to load notifications:', err);
  } finally {
    if (loadingEl) loadingEl.classList.add('hidden');
  }
}

function updateNotifBadge(count, animate = false) {
  unreadNotificationsCount = Math.max(0, count);
  const badges = [
    document.getElementById('chatNotifBadge'),
    document.getElementById('friendsNotifBadge'),
    document.getElementById('dmNotifBadge')
  ];
  const unreadPill = document.getElementById('notifPanelUnreadPill');

  badges.forEach(b => {
    if (!b) return;
    if (unreadNotificationsCount > 0) {
      b.textContent = unreadNotificationsCount > 99 ? '99+' : String(unreadNotificationsCount);
      b.classList.remove('hidden');
      if (animate) {
        b.classList.remove('pop-anim');
        void b.offsetWidth;
        b.classList.add('pop-anim');
      }
    } else {
      b.classList.add('hidden');
      b.textContent = '0';
    }
  });

  if (unreadPill) {
    if (unreadNotificationsCount > 0) {
      unreadPill.textContent = `${unreadNotificationsCount} unread`;
      unreadPill.classList.remove('hidden');
    } else {
      unreadPill.classList.add('hidden');
    }
  }
}

function formatNotifTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now - date.getTime()) / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getNotifMeta(type, priority) {
  let icon = '🔔';
  let iconClass = 'icon-blue';
  switch (type) {
    case 'mention':
      icon = '@';
      iconClass = priority === 'red' ? 'icon-red' : (priority === 'green' ? 'icon-green' : 'icon-yellow');
      break;
    case 'dm':
      icon = '💬';
      iconClass = 'icon-blue';
      break;
    case 'friend_request':
      icon = '👥';
      iconClass = 'icon-yellow';
      break;
    case 'friend_accepted':
      icon = '🎉';
      iconClass = 'icon-green';
      break;
    case 'call':
      icon = '📞';
      iconClass = 'icon-red';
      break;
    case 'scheduled':
      icon = '⏰';
      iconClass = 'icon-green';
      break;
    case 'feedback':
      icon = '💡';
      iconClass = 'icon-yellow';
      break;
    case 'server':
      icon = '📢';
      iconClass = 'icon-yellow';
      break;
    default:
      icon = '✨';
      iconClass = 'icon-blue';
      break;
  }
  return { icon, iconClass };
}

const expandedNotifGroups = new Set();

function getNotificationGroupKey(notif) {
  let p = notif.data;
  if (typeof p === 'string') {
    try { p = JSON.parse(p); } catch { p = {}; }
  }
  p = p || {};
  if (notif.type === 'dm') {
    const fid = p.friendId || p.friend_id || p.senderId || p.sender_id;
    return fid ? `dm:${fid}` : `notif:${notif.id}`;
  }
  if (notif.type === 'mention' || notif.type === 'message' || notif.type === 'reply') {
    const sId = p.serverId || p.server_id;
    const cId = p.channelId || p.channel_id;
    return (sId && cId) ? `channel:${sId}:${cId}` : (sId ? `server:${sId}` : `notif:${notif.id}`);
  }
  if (notif.type && notif.type.startsWith('friend')) {
    const fid = p.friendId || p.friend_id || p.senderId || p.sender_id;
    return fid ? `friend:${fid}` : `notif:${notif.id}`;
  }
  return `single:${notif.id}`;
}

function getNotificationGroupTitle(notif, count) {
  let p = notif.data;
  if (typeof p === 'string') {
    try { p = JSON.parse(p); } catch { p = {}; }
  }
  p = p || {};
  if (notif.type === 'dm') {
    const name = p.friendDisplayName || p.friendUsername || notif.title.replace('Direct message from ', '');
    return `@${name} (Direct Message)`;
  }
  if (notif.type === 'mention' || notif.type === 'message' || notif.type === 'reply') {
    const chan = p.channelName ? `#${p.channelName}` : 'Channel';
    const srv = p.serverName ? ` in ${p.serverName}` : '';
    return `${chan}${srv}`;
  }
  if (notif.type && notif.type.startsWith('friend')) {
    const name = p.friendDisplayName || p.friendUsername || 'Friend';
    return `Friend Activity with @${name}`;
  }
  return notif.title || 'Notification Group';
}

function createNotificationItemEl(notif) {
  const isUnread = !notif.is_read;
  const priority = notif.priority || 'yellow';
  const meta = getNotifMeta(notif.type, priority);

  const itemEl = document.createElement('div');
  itemEl.className = `notif-card-item ${isUnread ? 'unread' : ''} priority-${priority}`;
  itemEl.setAttribute('data-id', String(notif.id));

  let priorityBadgeHtml = '';
  if (priority === 'red') {
    priorityBadgeHtml = '<span class="notif-priority-tag tag-red">URGENT</span>';
  } else if (priority === 'green') {
    priorityBadgeHtml = '<span class="notif-priority-tag tag-green">INFO</span>';
  }

  itemEl.innerHTML = `
    <div class="notif-item-unread-dot"></div>
    <div class="notif-item-icon-box ${meta.iconClass}">${meta.icon}</div>
    <div class="notif-item-content">
      <div class="notif-item-top">
        <div class="notif-item-title-group">
          <span class="notif-item-title" title="${escapeHtml(notif.title)}">${escapeHtml(notif.title)}</span>
          ${priorityBadgeHtml}
        </div>
        <span class="notif-item-time">${escapeHtml(formatNotifTimeAgo(notif.created_at))}</span>
      </div>
      <div class="notif-item-body">${escapeHtml(notif.body || '')}</div>
    </div>
    <div class="notif-item-actions">
      ${isUnread ? `<button type="button" class="notif-item-action-btn btn-read" title="Mark as read">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </button>` : ''}
      <button type="button" class="notif-item-action-btn btn-del" title="Delete notification">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </button>
    </div>
  `;

  itemEl.addEventListener('click', (e) => {
    if (e.target.closest('.notif-item-action-btn')) return;
    handleNotificationClick(notif);
  });

  const readBtn = itemEl.querySelector('.btn-read');
  if (readBtn) {
    readBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      markNotifRead(notif.id);
    });
  }

  const delBtn = itemEl.querySelector('.btn-del');
  if (delBtn) {
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNotif(notif.id);
    });
  }

  return itemEl;
}

function renderNotificationsList() {
  const listEl = document.getElementById('notifItemsList');
  const emptyEl = document.getElementById('notifEmptyState');
  if (!listEl) return;

  let filtered = [...notificationsList];
  if (currentNotifFilter === 'unread') {
    filtered = filtered.filter(n => !n.is_read);
  } else if (currentNotifFilter === 'mentions') {
    filtered = filtered.filter(n => n.type === 'mention');
  } else if (currentNotifFilter === 'dms') {
    filtered = filtered.filter(n => n.type === 'dm');
  } else if (currentNotifFilter === 'friends') {
    filtered = filtered.filter(n => n.type && n.type.startsWith('friend'));
  } else if (currentNotifFilter === 'system') {
    filtered = filtered.filter(n => n.type === 'call' || n.type === 'system' || n.type === 'scheduled' || n.type === 'server' || n.type === 'feedback');
  }

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) {
      emptyEl.classList.remove('hidden');
      const emptyDesc = emptyEl.querySelector('.notif-empty-desc');
      if (emptyDesc) {
        emptyDesc.textContent = currentNotifFilter === 'unread'
          ? "You don't have any unread notifications."
          : "You don't have any notifications in this filter.";
      }
    }
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  listEl.innerHTML = '';

  const groupsMap = new Map();
  filtered.forEach(notif => {
    const key = getNotificationGroupKey(notif);
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key).push(notif);
  });

  groupsMap.forEach((items, groupKey) => {
    if (items.length === 1) {
      const itemEl = createNotificationItemEl(items[0]);
      listEl.appendChild(itemEl);
      return;
    }

    const firstNotif = items[0];
    const unreadCount = items.filter(n => !n.is_read).length;
    const isExpanded = expandedNotifGroups.has(groupKey);
    const highestPriority = items.some(n => n.priority === 'red') ? 'red' : (items.some(n => n.priority === 'green') ? 'green' : 'yellow');
    const meta = getNotifMeta(firstNotif.type, highestPriority);
    const groupTitle = getNotificationGroupTitle(firstNotif, items.length);

    const groupCard = document.createElement('div');
    groupCard.className = `notif-group-card ${isExpanded ? 'expanded' : ''}`;

    const groupHeader = document.createElement('div');
    groupHeader.className = `notif-group-header ${unreadCount > 0 ? 'has-unread' : ''}`;
    groupHeader.innerHTML = `
      <div class="notif-item-icon-box ${meta.iconClass}">${meta.icon}</div>
      <div class="notif-item-content">
        <div class="notif-item-top">
          <div class="notif-item-title-group" style="display:flex;align-items:center;gap:6px;">
            <span class="notif-item-title" style="font-weight:700;">${escapeHtml(groupTitle)}</span>
            <span class="notif-group-count-badge">🔴 ${unreadCount > 0 ? unreadCount : items.length}</span>
          </div>
          <span class="notif-item-time">${escapeHtml(formatNotifTimeAgo(firstNotif.created_at))}</span>
        </div>
        <div class="notif-item-body" style="font-size:12px;color:var(--text-muted);">${escapeHtml(firstNotif.body || firstNotif.title)}</div>
      </div>
      <div class="notif-item-actions">
        ${unreadCount > 0 ? `
        <button type="button" class="notif-item-action-btn btn-group-read" title="Mark all in group as read">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </button>` : ''}
        <button type="button" class="notif-item-action-btn btn-group-del" title="Delete all in group">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
      <div class="notif-group-toggle-icon" title="${isExpanded ? 'Collapse' : 'Expand'}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
      </div>
    `;

    groupHeader.addEventListener('click', (e) => {
      if (e.target.closest('.notif-item-action-btn')) return;
      if (expandedNotifGroups.has(groupKey)) {
        expandedNotifGroups.delete(groupKey);
      } else {
        expandedNotifGroups.add(groupKey);
      }
      renderNotificationsList();
    });

    const readAllBtn = groupHeader.querySelector('.btn-group-read');
    if (readAllBtn) {
      readAllBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        for (const it of items) {
          if (!it.is_read) {
            it.is_read = 1;
            markNotifRead(it.id);
          }
        }
        renderNotificationsList();
      });
    }

    const delAllBtn = groupHeader.querySelector('.btn-group-del');
    if (delAllBtn) {
      delAllBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        for (const it of items) {
          deleteNotif(it.id);
        }
      });
    }

    groupCard.appendChild(groupHeader);

    if (isExpanded) {
      const subitemsEl = document.createElement('div');
      subitemsEl.className = 'notif-group-subitems';
      items.forEach(it => {
        const itemEl = createNotificationItemEl(it);
        subitemsEl.appendChild(itemEl);
      });
      groupCard.appendChild(subitemsEl);
    }

    listEl.appendChild(groupCard);
  });
}

async function markNotifRead(id) {
  const item = notificationsList.find(n => n.id === id);
  if (item && !item.is_read) {
    item.is_read = 1;
    updateNotifBadge(unreadNotificationsCount - 1);
    renderNotificationsList();
  }
  try {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Failed to mark notification read:', err);
  }
}

async function markAllNotifsRead() {
  if (notificationsList.length === 0) return;
  notificationsList.forEach(n => { n.is_read = 1; });
  updateNotifBadge(0);
  renderNotificationsList();
  try {
    await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Failed to mark all notifications read:', err);
  }
}

async function deleteNotif(id) {
  const idx = notificationsList.findIndex(n => n.id === id);
  if (idx !== -1) {
    const wasUnread = !notificationsList[idx].is_read;
    notificationsList.splice(idx, 1);
    if (wasUnread) updateNotifBadge(unreadNotificationsCount - 1);
    renderNotificationsList();
  }
  try {
    await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Failed to delete notification:', err);
  }
}

async function clearAllNotifs() {
  notificationsList = [];
  updateNotifBadge(0);
  renderNotificationsList();
  try {
    await fetch('/api/notifications', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    showToast({ icon: '🗑️', title: 'Notifications Cleared', body: 'All notifications have been removed.' });
  } catch (err) {
    console.error('Failed to clear notifications:', err);
  }
}

function handleNotificationClick(notif) {
  if (!notif) return;
  if (!notif.is_read) {
    markNotifRead(notif.id);
  }
  closeNotifPanel();

  let payload = notif.data;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch { payload = {}; }
  }
  payload = payload || {};

  if (notif.type === 'mention') {
    const serverId = payload.serverId || payload.server_id;
    const channelId = payload.channelId || payload.channel_id;
    const messageId = payload.messageId || payload.message_id;

    if (serverId) {
      switchToServerView(serverId);
    }
    if (channelId) {
      setTimeout(() => {
        selectChannel(channelId);
        if (messageId) {
          setTimeout(() => {
            const msgEl = document.querySelector(`.message-item[data-message-id="${messageId}"]`);
            if (msgEl) {
              msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              msgEl.classList.remove('message-highlight-pulse');
              void msgEl.offsetWidth;
              msgEl.classList.add('message-highlight-pulse');
            }
          }, 400);
        }
      }, 150);
    }
  } else if (notif.type === 'dm') {
    const senderId = payload.senderId || payload.sender_id || payload.friendId || payload.friend_id;
    if (senderId && friendsData && Array.isArray(friendsData.friends)) {
      const friend = friendsData.friends.find(f => f.id === senderId) || {
        id: senderId,
        username: payload.senderUsername || 'Friend',
        displayName: payload.senderDisplayName || payload.senderUsername || 'Friend'
      };
      switchToDmView(friend);
    }
  } else if (notif.type === 'friend_request') {
    switchToFriendsView('pending');
  } else if (notif.type === 'friend_accepted') {
    switchToFriendsView('all');
  } else if (notif.type === 'call') {
    const callerId = payload.callerId || payload.caller_id || payload.senderId || payload.sender_id;
    if (callerId && friendsData && Array.isArray(friendsData.friends)) {
      const friend = friendsData.friends.find(f => f.id === callerId) || {
        id: callerId,
        username: payload.callerUsername || 'Friend',
        displayName: payload.callerDisplayName || payload.callerUsername || 'Friend'
      };
      switchToDmView(friend);
    }
  } else if (notif.type === 'feedback') {
    if (typeof openFeedbackForumModal === 'function') {
      openFeedbackForumModal();
    }
  } else if (notif.type === 'scheduled') {
    const serverId = payload.serverId || payload.server_id;
    const channelId = payload.channelId || payload.channel_id;
    const friendId = payload.friendId || payload.friend_id;
    if (serverId && channelId) {
      switchToServerView(serverId);
      setTimeout(() => selectChannel(channelId), 150);
    } else if (friendId && friendsData && Array.isArray(friendsData.friends)) {
      const friend = friendsData.friends.find(f => f.id === friendId);
      if (friend) switchToDmView(friend);
    }
  } else if (notif.type === 'server') {
    const serverId = payload.serverId || payload.server_id;
    const channelId = payload.channelId || payload.channel_id;
    if (serverId) {
      switchToServerView(serverId);
      if (channelId) setTimeout(() => selectChannel(channelId), 150);
    }
  }
}

function handleNotificationCreatedEvent(notif) {
  if (!notif) return;
  const s = getNotificationSettings();

  // Check category permission
  if (notif.type === 'mention' && !s.mentions) return;
  if (notif.type === 'dm' && !s.dms) return;
  if ((notif.type === 'friend_request' || notif.type === 'friend_accepted') && !s.friends) return;
  if (notif.type === 'call' && !s.calls) return;
  if (notif.type === 'feedback' && !s.feedback) return;
  if (notif.type === 'scheduled' && !s.scheduled) return;
  if (notif.type === 'server' && !s.servers) return;

  // Sound triggering
  const isRed = notif.priority === 'red';
  const shouldPlay = s.soundsEnabled || (s.urgentAlwaysAlert && isRed);
  if (shouldPlay) {
    playNotificationSound(notif.priority || 'yellow');
  }

  // Add to list and update badge with subtle animation
  if (!notificationsList.some(n => n.id === notif.id)) {
    notificationsList.unshift(notif);
    updateNotifBadge(unreadNotificationsCount + 1, true);
    renderNotificationsList();
  }

  // Discord-style alert toast
  const meta = getNotifMeta(notif.type, notif.priority);
  const grpKey = getNotificationGroupKey(notif);
  showToast({
    icon: meta.icon,
    title: notif.title,
    body: notif.body,
    actionText: 'View',
    groupKey: grpKey,
    onAction: () => handleNotificationClick(notif)
  });
}

function openNotifPanel(triggerBtn = null) {
  const overlay = document.getElementById('notifPanelOverlay');
  const card = document.getElementById('notifPanelCard');
  if (!overlay) return;
  if (triggerBtn && card) {
    const rect = triggerBtn.getBoundingClientRect();
    if (window.innerWidth <= 640) {
      card.style.top = '54px';
      card.style.left = '8px';
      card.style.right = '8px';
    } else {
      card.style.top = `${rect.bottom + 8}px`;
      card.style.right = `${Math.max(16, window.innerWidth - rect.right - 10)}px`;
      card.style.left = 'auto';
    }
  }
  overlay.classList.remove('hidden');
  loadNotifications();
}

function closeNotifPanel() {
  const overlay = document.getElementById('notifPanelOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function toggleNotifPanel(triggerBtn = null) {
  const overlay = document.getElementById('notifPanelOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('hidden')) {
    openNotifPanel(triggerBtn);
  } else {
    closeNotifPanel();
  }
}

function bindNotificationCenterControls() {
  const chatNotifBtn = document.getElementById('chatNotifBtn');
  const friendsNotifBtn = document.getElementById('friendsNotifBtn');
  const dmNotifBtn = document.getElementById('dmNotifBtn');

  if (chatNotifBtn) chatNotifBtn.addEventListener('click', () => toggleNotifPanel(chatNotifBtn));
  if (friendsNotifBtn) friendsNotifBtn.addEventListener('click', () => toggleNotifPanel(friendsNotifBtn));
  if (dmNotifBtn) dmNotifBtn.addEventListener('click', () => toggleNotifPanel(dmNotifBtn));

  const closeNotifPanelBtn = document.getElementById('closeNotifPanelBtn');
  if (closeNotifPanelBtn) {
    closeNotifPanelBtn.addEventListener('click', closeNotifPanel);
  }

  const notifPanelOverlay = document.getElementById('notifPanelOverlay');
  if (notifPanelOverlay) {
    notifPanelOverlay.addEventListener('click', (e) => {
      if (e.target === notifPanelOverlay) {
        closeNotifPanel();
      }
    });
  }

  const notifMarkAllReadBtn = document.getElementById('notifMarkAllReadBtn');
  if (notifMarkAllReadBtn) {
    notifMarkAllReadBtn.addEventListener('click', markAllNotifsRead);
  }

  const notifClearAllBtn = document.getElementById('notifClearAllBtn');
  if (notifClearAllBtn) {
    notifClearAllBtn.addEventListener('click', () => {
      if (confirm('Clear all notifications?')) {
        clearAllNotifs();
      }
    });
  }

  // Settings shortcut button -> open notification settings modal
  const notifSettingsBtn = document.getElementById('notifSettingsBtn');
  const notifSettingsModalOverlay = document.getElementById('notifSettingsModalOverlay');
  const closeNotifSettingsModalBtn = document.getElementById('closeNotifSettingsModalBtn');

  if (notifSettingsBtn) {
    notifSettingsBtn.addEventListener('click', () => {
      closeNotifPanel();
      if (notifSettingsModalOverlay) {
        notifSettingsModalOverlay.classList.remove('hidden');
      } else {
        openMyProfileModal('notifications');
      }
    });
  }

  if (closeNotifSettingsModalBtn && notifSettingsModalOverlay) {
    closeNotifSettingsModalBtn.addEventListener('click', () => {
      notifSettingsModalOverlay.classList.add('hidden');
    });
    notifSettingsModalOverlay.addEventListener('click', (e) => {
      if (e.target === notifSettingsModalOverlay) {
        notifSettingsModalOverlay.classList.add('hidden');
      }
    });
  }

  // Filter tabs
  document.querySelectorAll('.notif-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.notif-filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentNotifFilter = tab.getAttribute('data-filter') || 'all';
      renderNotificationsList();
    });
  });

  bindNotificationSettingsUI();
}

function initNotificationCenter() {
  bindNotificationSettingsUI();
  loadNotifications();
}

// ==========================================================================
// STAGE 3d.6: USER STATUS SYSTEM (CLIENT LOGIC)
// ==========================================================================

let isUserAutoIdle = false;
let userActivityTimer = null;
let lastReportedActivityTime = 0;
const INACTIVITY_IDLE_DELAY_MS = 5 * 60 * 1000; // 5 minutes

function getStatusBadgeClass(status) {
  switch (status) {
    case 'online': return 'status-online';
    case 'idle': return 'status-idle';
    case 'dnd': return 'status-dnd';
    case 'invisible':
    case 'offline':
    default:
      return 'status-offline';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'online': return 'Online';
    case 'idle': return 'Idle';
    case 'dnd': return 'Do Not Disturb';
    case 'invisible': return 'Invisible';
    case 'offline':
    default:
      return 'Offline';
  }
}

function getStatusPillClass(status) {
  switch (status) {
    case 'online': return 'status-pill-online';
    case 'idle': return 'status-pill-idle';
    case 'dnd': return 'status-pill-dnd';
    case 'invisible':
    case 'offline':
    default:
      return 'status-pill-offline';
  }
}

function updateCurrentUserStatusUI() {
  if (!currentUser) return;
  const rawStatus = currentUser.status || 'online';
  const effectiveStatus = (isUserAutoIdle && rawStatus === 'online') ? 'idle' : rawStatus;
  const badgeClass = getStatusBadgeClass(effectiveStatus);
  const label = getStatusLabel(effectiveStatus);

  // 1. Capsules (3 headers)
  ['currentUserStatusBadge', 'currentUserStatusBadge2', 'currentUserStatusBadge3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.className = `user-status-badge ${badgeClass}`;
      el.title = label;
    }
  });

  // Custom status in capsules
  const custom = currentUser.customStatus;
  const hasCustom = Boolean(custom && custom.text && custom.text.trim());
  ['currentUserCapsuleCustomStatus', 'currentUserCapsuleCustomStatus2', 'currentUserCapsuleCustomStatus3'].forEach(id => {
    const row = document.getElementById(id);
    if (row) {
      if (hasCustom) {
        const emojiEl = row.querySelector('.capsule-status-emoji');
        const textEl = row.querySelector('.capsule-status-text');
        if (emojiEl) emojiEl.textContent = custom.emoji || '💬';
        if (textEl) textEl.textContent = custom.text;
        row.title = `${custom.emoji ? custom.emoji + ' ' : ''}${custom.text}`;
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    }
  });

  // 2. Popout UI
  const popoutAvatar = document.getElementById('statusPopoutAvatar');
  const popoutBadge = document.getElementById('statusPopoutBadge');
  const popoutName = document.getElementById('statusPopoutDisplayName');
  const popoutHandle = document.getElementById('statusPopoutHandle');
  if (popoutAvatar) renderAvatarInto(popoutAvatar, currentUser);
  if (popoutBadge) {
    popoutBadge.className = `user-status-badge ${badgeClass}`;
    popoutBadge.title = label;
  }
  if (popoutName) popoutName.textContent = currentUser.displayName || currentUser.username;
  if (popoutHandle) popoutHandle.textContent = `@${currentUser.username}`;

  const popoutCustomEmoji = document.getElementById('statusPopoutCustomEmoji');
  const popoutCustomText = document.getElementById('statusPopoutCustomText');
  const popoutClearBtn = document.getElementById('statusPopoutClearCustomBtn');
  if (popoutCustomEmoji && popoutCustomText) {
    if (hasCustom) {
      popoutCustomEmoji.textContent = custom.emoji || '💬';
      popoutCustomText.textContent = custom.text;
      if (popoutClearBtn) popoutClearBtn.classList.remove('hidden');
    } else {
      popoutCustomEmoji.textContent = '💭';
      popoutCustomText.textContent = 'Set a custom status';
      if (popoutClearBtn) popoutClearBtn.classList.add('hidden');
    }
  }

  // Checkmarks on popout options
  const checks = {
    online: document.getElementById('statusCheckOnline'),
    idle: document.getElementById('statusCheckIdle'),
    dnd: document.getElementById('statusCheckDnd'),
    invisible: document.getElementById('statusCheckInvisible')
  };
  Object.keys(checks).forEach(k => {
    if (checks[k]) {
      checks[k].classList.toggle('hidden', rawStatus !== k);
    }
  });

  // 3. User Settings Profile Tab Card
  syncSettingsProfileStatusUI();
}

function syncSettingsProfileStatusUI() {
  if (!currentUser) return;
  const rawStatus = currentUser.status || 'online';
  const custom = currentUser.customStatus;
  const hasCustom = Boolean(custom && custom.text && custom.text.trim());

  document.querySelectorAll('.settings-status-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-status') === rawStatus);
  });

  const emojiDisplay = document.getElementById('settingsCustomStatusEmojiDisplay');
  const textDisplay = document.getElementById('settingsCustomStatusTextDisplay');
  const clearBtn = document.getElementById('settingsClearCustomStatusBtn');
  if (emojiDisplay) emojiDisplay.textContent = hasCustom ? (custom.emoji || '💬') : '💬';
  if (textDisplay) textDisplay.textContent = hasCustom ? custom.text : 'None set';
  if (clearBtn) clearBtn.classList.toggle('hidden', !hasCustom);
}

// Set manual status
async function setUserStatus(newStatus) {
  if (!currentUser) return;
  const valid = ['online', 'idle', 'dnd', 'invisible'];
  if (!valid.includes(newStatus)) return;

  isUserAutoIdle = false;
  currentUser.status = newStatus;
  updateCurrentUserStatusUI();

  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({
        type: 'set_status',
        status: newStatus
      }));
    } catch {}
  }

  try {
    const res = await fetch('/api/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        currentUser.status = data.user.status;
        currentUser.customStatus = data.user.customStatus;
        updateCurrentUserStatusUI();
      }
    }
  } catch (err) {
    console.error('Failed to persist status change:', err);
  }

  showToast({
    icon: '✨',
    title: 'Status Updated',
    body: `Your status is now ${getStatusLabel(newStatus)}.`
  });
}

// Set custom status
async function setCustomStatus(text, emoji, duration, durationMinutes) {
  if (!currentUser) return;
  const trimmed = (text || '').trim();
  if (!trimmed) return;

  try {
    const res = await fetch('/api/status/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text: trimmed,
        emoji: emoji || '',
        duration: duration || 'today',
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update custom status');
    }

    currentUser.customStatus = data.customStatus;
    updateCurrentUserStatusUI();

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({
          type: 'set_custom_status',
          text: trimmed,
          emoji: emoji || '',
          duration: duration || 'today',
          durationMinutes: durationMinutes ? Number(durationMinutes) : undefined
        }));
      } catch {}
    }

    closeCustomStatusModal();
    showToast({
      icon: emoji || '💬',
      title: 'Custom Status Set',
      body: trimmed
    });
  } catch (err) {
    const errEl = document.getElementById('customStatusError');
    if (errEl) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  }
}

// Clear custom status
async function clearUserCustomStatus() {
  if (!currentUser) return;
  try {
    const res = await fetch('/api/status/custom', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      currentUser.customStatus = null;
      updateCurrentUserStatusUI();
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: 'clear_custom_status' }));
        } catch {}
      }
      closeCustomStatusModal();
      showToast({
        icon: '🗑️',
        title: 'Custom Status Cleared',
        body: 'Your custom status was removed.'
      });
    }
  } catch (err) {
    console.error('Failed to clear custom status:', err);
  }
}

// Popout toggle
function toggleUserStatusMenuPopout(anchorEl) {
  const popout = document.getElementById('userStatusMenuPopout');
  if (!popout) return;

  if (!popout.classList.contains('hidden')) {
    popout.classList.add('hidden');
    return;
  }

  updateCurrentUserStatusUI();
  if (anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    if (rect.top > 300) {
      popout.style.bottom = `${window.innerHeight - rect.top + 8}px`;
      popout.style.top = 'auto';
    } else {
      popout.style.top = `${rect.bottom + 8}px`;
      popout.style.bottom = 'auto';
    }
    const popoutWidth = 290;
    if (rect.left + popoutWidth > window.innerWidth - 12) {
      popout.style.left = 'auto';
      popout.style.right = '12px';
    } else {
      popout.style.left = `${Math.max(12, rect.left)}px`;
      popout.style.right = 'auto';
    }
  }
  popout.classList.remove('hidden');
}

function closeUserStatusMenuPopout() {
  const popout = document.getElementById('userStatusMenuPopout');
  if (popout) popout.classList.add('hidden');
}

// Custom Status Modal
function openCustomStatusModal() {
  closeUserStatusMenuPopout();
  const modal = document.getElementById('customStatusModalOverlay');
  if (!modal) return;

  const current = currentUser ? currentUser.customStatus : null;
  const textInput = document.getElementById('customStatusTextInput');
  const emojiDisplay = document.getElementById('customStatusSelectedEmoji');
  const durationSelect = document.getElementById('customStatusDurationSelect');
  const minutesGroup = document.getElementById('customStatusMinutesGroup');
  const clearBtn = document.getElementById('modalClearCustomStatusBtn');
  const errEl = document.getElementById('customStatusError');

  if (errEl) errEl.classList.add('hidden');
  if (textInput) textInput.value = (current && current.text) ? current.text : '';
  if (emojiDisplay) emojiDisplay.textContent = (current && current.emoji) ? current.emoji : '💬';
  if (durationSelect) durationSelect.value = 'today';
  if (minutesGroup) minutesGroup.classList.add('hidden');
  if (clearBtn) clearBtn.classList.toggle('hidden', !(current && current.text));

  document.querySelectorAll('.quick-emoji-btn').forEach(btn => {
    btn.classList.toggle('active', current && btn.getAttribute('data-emoji') === current.emoji);
  });

  modal.classList.remove('hidden');
  if (textInput) setTimeout(() => textInput.focus(), 50);
}

function closeCustomStatusModal() {
  const modal = document.getElementById('customStatusModalOverlay');
  if (modal) modal.classList.add('hidden');
}

// Inactivity & Auto-Idle
function resetInactivityTimer() {
  if (userActivityTimer) {
    clearTimeout(userActivityTimer);
  }

  if (isUserAutoIdle) {
    isUserAutoIdle = false;
    updateCurrentUserStatusUI();
    const now = Date.now();
    if (now - lastReportedActivityTime > 10000) {
      lastReportedActivityTime = now;
      if (socket && socket.readyState === WebSocket.OPEN) {
        try { socket.send(JSON.stringify({ type: 'user_active' })); } catch {}
      }
      fetch('/api/status/activity', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
  }

  userActivityTimer = setTimeout(onUserInactivityTriggered, INACTIVITY_IDLE_DELAY_MS);
}

function onUserInactivityTriggered() {
  if (!currentUser) return;
  if (currentUser.status === 'online') {
    isUserAutoIdle = true;
    updateCurrentUserStatusUI();
    if (socket && socket.readyState === WebSocket.OPEN) {
      try { socket.send(JSON.stringify({ type: 'user_idle' })); } catch {}
    }
    fetch('/api/status/idle', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
  }
}

// Realtime Presence Broadcast handler from WebSocket
function handlePresenceUpdatedEvent(msg) {
  if (!msg || !msg.userId) return;
  const { userId, status, customStatus, isSelf } = msg;

  // 1. If self update
  if (isSelf || (currentUser && currentUser.id === userId)) {
    if (currentUser) {
      if (status) currentUser.status = status;
      if (customStatus !== undefined) currentUser.customStatus = customStatus;
      updateCurrentUserStatusUI();
      if (typeof renderServerMembersSidebar === 'function') renderServerMembersSidebar();
    }
    return;
  }

  // 2. Update friends cache
  if (friendsData && Array.isArray(friendsData.friends)) {
    const friend = friendsData.friends.find(f => f.id === userId);
    if (friend) {
      if (status) friend.status = status;
      if (customStatus !== undefined) friend.customStatus = customStatus;
      if (typeof renderFriendsUI === 'function') {
        renderFriendsUI();
      }
    }
  }

  // 3. Update active DM view header
  if (activeDmFriend && activeDmFriend.id === userId) {
    if (status) activeDmFriend.status = status;
    if (customStatus !== undefined) activeDmFriend.customStatus = customStatus;
    if (dmActiveFriendUsername) {
      let desc = `@${activeDmFriend.username}`;
      if (customStatus && customStatus.text) {
        desc += ` • ${(customStatus.emoji ? customStatus.emoji + ' ' : '')}${customStatus.text}`;
      }
      dmActiveFriendUsername.textContent = desc;
    }
  }

  // 4. Update viewed user profile modal if currently open for this user
  if (viewedUserProfile && viewedUserProfile.id === userId) {
    if (status) viewedUserProfile.status = status;
    if (customStatus !== undefined) viewedUserProfile.customStatus = customStatus;
    const badgeEl = document.getElementById('viewUserStatusBadge');
    if (badgeEl) {
      badgeEl.className = `user-status-badge status-large ${getStatusBadgeClass(status)}`;
      badgeEl.title = getStatusLabel(status);
    }
    const pillEl = document.getElementById('viewUserStatusPill');
    if (pillEl) {
      pillEl.className = `user-status-pill ${getStatusPillClass(status)}`;
      pillEl.textContent = getStatusLabel(status);
    }
    const boxEl = document.getElementById('viewUserCustomStatusBox');
    const emojiEl = document.getElementById('viewUserCustomStatusEmoji');
    const textEl = document.getElementById('viewUserCustomStatusText');
    if (boxEl && emojiEl && textEl) {
      if (customStatus && customStatus.text) {
        emojiEl.textContent = customStatus.emoji || '💬';
        textEl.textContent = customStatus.text;
        boxEl.classList.remove('hidden');
      } else {
        boxEl.classList.add('hidden');
      }
    }
  }

  // 5. Update server member list
  if (currentServerMembers && currentServerMembers.length > 0) {
    const mem = currentServerMembers.find(m => m.id === userId);
    if (mem) {
      if (status) mem.status = status;
      if (customStatus !== undefined) mem.customStatus = customStatus;
      if (typeof renderServerMembersSidebar === 'function') renderServerMembersSidebar();
    }
  }
}

function bindUserStatusSystemControls() {
  const choices = [
    { btn: document.getElementById('statusChoiceOnline'), status: 'online' },
    { btn: document.getElementById('statusChoiceIdle'), status: 'idle' },
    { btn: document.getElementById('statusChoiceDnd'), status: 'dnd' },
    { btn: document.getElementById('statusChoiceInvisible'), status: 'invisible' }
  ];
  choices.forEach(({ btn, status }) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeUserStatusMenuPopout();
        setUserStatus(status);
      });
    }
  });

  const setCustomBtn = document.getElementById('statusPopoutSetCustomBtn');
  if (setCustomBtn) {
    setCustomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCustomStatusModal();
    });
  }

  const clearCustomBtn = document.getElementById('statusPopoutClearCustomBtn');
  if (clearCustomBtn) {
    clearCustomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeUserStatusMenuPopout();
      clearUserCustomStatus();
    });
  }

  const openProfileBtn = document.getElementById('statusPopoutOpenProfileBtn');
  if (openProfileBtn) {
    openProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeUserStatusMenuPopout();
      openMyProfileModal('profile');
    });
  }

  document.querySelectorAll('.settings-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const st = btn.getAttribute('data-status');
      if (st) setUserStatus(st);
    });
  });

  const settingsOpenCustomBtn = document.getElementById('settingsOpenCustomStatusModalBtn');
  if (settingsOpenCustomBtn) {
    settingsOpenCustomBtn.addEventListener('click', () => openCustomStatusModal());
  }

  const settingsClearCustomBtn = document.getElementById('settingsClearCustomStatusBtn');
  if (settingsClearCustomBtn) {
    settingsClearCustomBtn.addEventListener('click', () => clearUserCustomStatus());
  }

  const closeCustomModalBtn = document.getElementById('closeCustomStatusModalBtn');
  if (closeCustomModalBtn) {
    closeCustomModalBtn.addEventListener('click', closeCustomStatusModal);
  }

  const cancelCustomModalBtn = document.getElementById('modalCancelCustomStatusBtn');
  if (cancelCustomModalBtn) {
    cancelCustomModalBtn.addEventListener('click', closeCustomStatusModal);
  }

  const clearModalBtn = document.getElementById('modalClearCustomStatusBtn');
  if (clearModalBtn) {
    clearModalBtn.addEventListener('click', clearUserCustomStatus);
  }

  const saveModalBtn = document.getElementById('modalSaveCustomStatusBtn');
  if (saveModalBtn) {
    saveModalBtn.addEventListener('click', () => {
      const textInput = document.getElementById('customStatusTextInput');
      const emojiDisplay = document.getElementById('customStatusSelectedEmoji');
      const durationSelect = document.getElementById('customStatusDurationSelect');
      const minutesInput = document.getElementById('customStatusMinutesInput');
      const errEl = document.getElementById('customStatusError');

      const text = textInput ? textInput.value.trim() : '';
      if (!text) {
        if (errEl) {
          errEl.textContent = 'Please enter a status message.';
          errEl.classList.remove('hidden');
        }
        return;
      }

      const emoji = emojiDisplay ? emojiDisplay.textContent.trim() : '💬';
      const duration = durationSelect ? durationSelect.value : 'today';
      const durationMinutes = minutesInput ? Number(minutesInput.value) : 120;

      setCustomStatus(text, emoji, duration, durationMinutes);
    });
  }

  const textInput = document.getElementById('customStatusTextInput');
  if (textInput) {
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (saveModalBtn) saveModalBtn.click();
      }
    });
  }

  document.querySelectorAll('.quick-emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      const emojiDisplay = document.getElementById('customStatusSelectedEmoji');
      if (emojiDisplay && emoji) {
        emojiDisplay.textContent = emoji;
        document.querySelectorAll('.quick-emoji-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  const durationSelect = document.getElementById('customStatusDurationSelect');
  const minutesGroup = document.getElementById('customStatusMinutesGroup');
  if (durationSelect && minutesGroup) {
    durationSelect.addEventListener('change', () => {
      minutesGroup.classList.toggle('hidden', durationSelect.value !== 'custom');
    });
  }

  document.addEventListener('click', (e) => {
    const popout = document.getElementById('userStatusMenuPopout');
    if (!popout || popout.classList.contains('hidden')) return;
    if (e.target.closest('#userStatusMenuPopout') || e.target.closest('.user-capsule')) return;
    closeUserStatusMenuPopout();
  });

  const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
  activityEvents.forEach(evtName => {
    window.addEventListener(evtName, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
}

function initUserStatusSystem() {
  bindUserStatusSystemControls();
  updateCurrentUserStatusUI();
}

// Global escape key handler update
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const appSettingsModal = document.getElementById('appSettingsModalOverlay');
    if (appSettingsModal && !appSettingsModal.classList.contains('hidden')) {
      closeAppSettingsModal();
      return;
    }
    closeMobileNav();
    const notifOverlay = document.getElementById('notifPanelOverlay');
    if (notifOverlay && !notifOverlay.classList.contains('hidden')) {
      closeNotifPanel();
    }
    const notifSettingsModal = document.getElementById('notifSettingsModalOverlay');
    if (notifSettingsModal && !notifSettingsModal.classList.contains('hidden')) {
      notifSettingsModal.classList.add('hidden');
    }
    closeUserStatusMenuPopout();
    closeCustomStatusModal();
  }
});

// =======================================================
// MOBILE & TABLET DRAWER NAVIGATION
// =======================================================
function openMobileNav() {
  const sidebarWrapper = document.getElementById('sidebarWrapper');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (sidebarWrapper) {
    sidebarWrapper.classList.add('mobile-open');
  }
  if (backdrop) {
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => backdrop.classList.add('active'));
  }
}

function closeMobileNav() {
  const sidebarWrapper = document.getElementById('sidebarWrapper');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (sidebarWrapper) {
    sidebarWrapper.classList.remove('mobile-open');
  }
  if (backdrop) {
    backdrop.classList.remove('active');
    setTimeout(() => {
      const sw = document.getElementById('sidebarWrapper');
      if (!sw || !sw.classList.contains('mobile-open')) {
        backdrop.classList.add('hidden');
      }
    }, 250);
  }
}

function toggleMobileNav() {
  const sidebarWrapper = document.getElementById('sidebarWrapper');
  if (sidebarWrapper && sidebarWrapper.classList.contains('mobile-open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

function bindMobileNavControls() {
  const chatToggle = document.getElementById('chatMobileNavBtn');
  const friendsToggle = document.getElementById('friendsMobileNavBtn');
  const dmToggle = document.getElementById('dmMobileNavBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const sidebarWrapper = document.getElementById('sidebarWrapper');

  if (chatToggle) chatToggle.addEventListener('click', toggleMobileNav);
  if (friendsToggle) friendsToggle.addEventListener('click', toggleMobileNav);
  if (dmToggle) dmToggle.addEventListener('click', toggleMobileNav);
  if (backdrop) backdrop.addEventListener('click', closeMobileNav);

  // Close drawer if window is resized above tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });

  // Touch swipe gesture support for tablets and mobile devices
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > 60 && Math.abs(diffY) < 50) {
      const isOpen = sidebarWrapper && sidebarWrapper.classList.contains('mobile-open');
      if (isOpen && diffX < -50) {
        // Swiped left on open drawer -> close
        closeMobileNav();
      } else if (!isOpen && diffX > 60 && touchStartX < 35 && window.innerWidth <= 768) {
        // Swiped right from left edge of screen -> open drawer
        openMobileNav();
      }
    }
  }, { passive: true });
}

// =======================================================
// DISCORD-STYLE SETTINGS MODAL SYSTEM (DYNAMIC ISLAND ANIMATION)
// =======================================================
function closeModalWithDynamicIsland(overlayEl, cardSelector = '.modal-card, .settings-modal-window, .feedback-forum-modal-card') {
  if (!overlayEl || overlayEl.classList.contains('hidden')) return;

  if (document.body.classList.contains('no-animations') || document.body.classList.contains('disable-pop-in')) {
    overlayEl.classList.add('hidden');
    return;
  }

  if (overlayEl.classList.contains('is-closing')) return;

  overlayEl.classList.add('is-closing');
  const card = overlayEl.querySelector(cardSelector);
  if (card) card.classList.add('is-closing');

  const durationMs = (typeof currentAnimSettings !== 'undefined' && currentAnimSettings.enabled)
    ? Math.max(80, Math.min(5200, currentAnimSettings.durationMs))
    : 230;

  setTimeout(() => {
    overlayEl.classList.remove('is-closing');
    if (card) card.classList.remove('is-closing');
    overlayEl.classList.add('hidden');
  }, durationMs);
}

function openAppSettingsModal(initialTab = 'account') {
  closeUserStatusMenuPopout();
  closeNotifPanel();
  closeMobileNav();
  const overlay = document.getElementById('appSettingsModalOverlay');
  if (!overlay) return;

  overlay.classList.remove('is-closing');
  const win = overlay.querySelector('.settings-modal-window');
  if (win) win.classList.remove('is-closing');

  updateAppSettingsUI();
  switchSettingsTab(initialTab);
  overlay.classList.remove('hidden');
}

function closeAppSettingsModal() {
  if (typeof cleanupVoiceSettingsTests === 'function') cleanupVoiceSettingsTests();
  const overlay = document.getElementById('appSettingsModalOverlay');
  closeModalWithDynamicIsland(overlay, '.settings-modal-window');
}

function switchSettingsTab(tabKey) {
  const titles = {
    account: { title: 'My Account', desc: 'Manage your account information and credentials.' },
    profiles: { title: 'Profiles', desc: 'Customize how you look across all servers and direct messages.' },
    status: { title: 'User Status', desc: 'Set your presence to let friends know when you are available.' },
    appearance: { title: 'Appearance', desc: 'Choose how Voiceline looks for you.' },
    animations: { title: 'Animations & Motion', desc: 'Customize UI animation duration, speed presets, and smooth motion effects.' },
    sounds: { title: 'Sounds & Typing Noise', desc: 'Customize typing keyboard noises, sound profiles, and synthesize custom acoustic clicks.' },
    notifications: { title: 'Notifications', desc: 'Fine-tune sounds, notification center badges, and urgent priority mentions.' },
    voice: { title: 'Voice & Video', desc: 'Configure microphone input, speaker output, and camera testing.' },
    updates: { title: 'App Updates', desc: 'Inspect desktop version, check GitHub releases, and configure server host connection.' },
    feedback: { title: 'Feedback', desc: 'Share feedback, report bugs, and vote on upcoming features with developers.' },
    developer: { title: 'Developer Settings', desc: 'Manage host server lifecycle, toggle safety mode, and control accounts.' }
  };

  const navBars = document.querySelectorAll('.settings-nav-bar[data-tab]');
  navBars.forEach(bar => {
    bar.classList.toggle('active', bar.getAttribute('data-tab') === tabKey);
  });

  const sections = {
    account: document.getElementById('settingsSecAccount'),
    profiles: document.getElementById('settingsSecProfiles'),
    status: document.getElementById('settingsSecStatus'),
    appearance: document.getElementById('settingsSecAppearance'),
    animations: document.getElementById('settingsSecAnimations'),
    sounds: document.getElementById('settingsSecSounds'),
    notifications: document.getElementById('settingsSecNotifications'),
    voice: document.getElementById('settingsSecVoice'),
    updates: document.getElementById('settingsSecUpdates'),
    feedback: document.getElementById('settingsSecFeedback'),
    developer: document.getElementById('settingsSecDeveloper')
  };

  Object.keys(sections).forEach(key => {
    const el = sections[key];
    if (el) {
      if (key === tabKey) {
        el.classList.remove('hidden');
        el.classList.add('active');
      } else {
        el.classList.add('hidden');
        el.classList.remove('active');
      }
    }
  });

  if (tabKey === 'updates' && typeof renderUpdatesSettingsUI === 'function') {
    renderUpdatesSettingsUI();
  }

  if (tabKey === 'voice' && typeof initVoiceSettingsUI === 'function') {
    initVoiceSettingsUI();
  } else if (typeof cleanupVoiceSettingsTests === 'function') {
    cleanupVoiceSettingsTests();
  }

  if (tabKey === 'developer') {
    if (typeof loadDevAccounts === 'function') loadDevAccounts();
    if (typeof loadDevReportedMessages === 'function') loadDevReportedMessages();
  }

  const titleEl = document.getElementById('settingsPaneTitle');
  const descEl = document.getElementById('settingsPaneDesc');
  if (titleEl && titles[tabKey]) titleEl.textContent = titles[tabKey].title;
  if (descEl && titles[tabKey]) descEl.textContent = titles[tabKey].desc;
}

function updateAppSettingsUI() {
  if (!currentUser) return;
  const avatarEl = document.getElementById('settingsAvatarDisplay');
  const badgeEl = document.getElementById('settingsStatusBadgeDisplay');
  const nameEl = document.getElementById('settingsDisplayNameText');
  const handleEl = document.getElementById('settingsHandleText');
  const devBadgeEl = document.getElementById('settingsDevBadge');
  const infoName = document.getElementById('settingsInfoDisplayName');
  const infoUsername = document.getElementById('settingsInfoUsername');
  const infoRole = document.getElementById('settingsInfoRole');

  if (avatarEl) renderAvatarInto(avatarEl, currentUser);
  if (badgeEl) {
    const st = currentUser.status || 'online';
    badgeEl.className = `user-status-badge status-${st} settings-avatar-badge`;
  }
  if (nameEl) nameEl.textContent = currentUser.displayName || currentUser.username;
  if (handleEl) handleEl.textContent = '@' + currentUser.username;
  if (devBadgeEl) devBadgeEl.classList.toggle('hidden', !currentUser.isDeveloper);

  if (infoName) infoName.textContent = currentUser.displayName || currentUser.username;
  if (infoUsername) infoUsername.textContent = '@' + currentUser.username;
  if (infoRole) infoRole.textContent = currentUser.isDeveloper ? 'Developer & Administrator' : 'Standard Member';
}

function bindAppSettingsControls() {
  // Popout Gear Button
  const popoutGear = document.getElementById('statusPopoutGearBtn');
  if (popoutGear) {
    popoutGear.addEventListener('click', (e) => {
      e.stopPropagation();
      openAppSettingsModal('account');
    });
  }

  // Popout Footer Settings Button
  const popoutFooterSettings = document.getElementById('statusPopoutOpenSettingsBtn');
  if (popoutFooterSettings) {
    popoutFooterSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      openAppSettingsModal('account');
    });
  }

  // Header User Capsule Settings Buttons
  const headerSettingsBtns = [
    document.getElementById('chatHeaderSettingsBtn'),
    document.getElementById('friendsHeaderSettingsBtn'),
    document.getElementById('dmHeaderSettingsBtn')
  ];
  headerSettingsBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAppSettingsModal('account');
      });
    }
  });

  // Modal Close Button (ESC circle button)
  const closeBtn = document.getElementById('closeAppSettingsModalBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeAppSettingsModal);

  // Backdrop overlay click
  const overlay = document.getElementById('appSettingsModalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAppSettingsModal();
    });
  }

  // Category navigation bars
  document.querySelectorAll('.settings-nav-bar[data-tab]').forEach(bar => {
    bar.addEventListener('click', () => {
      const tabKey = bar.getAttribute('data-tab');
      if (tabKey) switchSettingsTab(tabKey);
    });
  });

  // Logout button in settings sidebar
  const logoutBar = document.getElementById('settingsTabLogout');
  if (logoutBar) {
    logoutBar.addEventListener('click', () => {
      closeAppSettingsModal();
      handleLogout();
    });
  }

  // Quick Action Buttons inside Settings Panes
  const editProfileQuickBtn = document.getElementById('settingsEditProfileQuickBtn');
  if (editProfileQuickBtn) {
    editProfileQuickBtn.addEventListener('click', () => {
      closeAppSettingsModal();
      openMyProfileModal('profile');
    });
  }

  const openFullProfileBtn = document.getElementById('settingsOpenFullProfileBtn');
  if (openFullProfileBtn) {
    openFullProfileBtn.addEventListener('click', () => {
      closeAppSettingsModal();
      openMyProfileModal('profile');
    });
  }

  const customStatusQuickBtn = document.getElementById('settingsCustomStatusQuickBtn');
  if (customStatusQuickBtn) {
    customStatusQuickBtn.addEventListener('click', () => {
      closeAppSettingsModal();
      openCustomStatusModal();
    });
  }

  const openNotifModalBtn = document.getElementById('settingsOpenNotifModalBtn');
  if (openNotifModalBtn) {
    openNotifModalBtn.addEventListener('click', () => {
      closeAppSettingsModal();
      const notifSettingsModal = document.getElementById('notifSettingsModalOverlay');
      if (notifSettingsModal) notifSettingsModal.classList.remove('hidden');
    });
  }

  const openFeedbackForumBtn = document.getElementById('settingsOpenFeedbackForumBtn');
  if (openFeedbackForumBtn) {
    openFeedbackForumBtn.addEventListener('click', () => {
      closeAppSettingsModal();
      openFeedbackModal();
    });
  }
}

// =======================================================
// DEVELOPER SETTINGS CONTROLLER (Stage 4)
// =======================================================
let devSafetyMode = true;
let devAccountsFilter = 'all';

function isDevSafetyModeEnabled() {
  return devSafetyMode;
}

function updateDevSafetyModeUI() {
  const toggle = document.getElementById('devSafetyModeToggle');
  const notice = document.getElementById('devSafetyStatusNotice');
  const text = document.getElementById('devSafetyStatusText');
  const card = document.querySelector('.dev-safety-card');

  if (toggle) toggle.checked = devSafetyMode;
  if (notice && text) {
    const dot = notice.querySelector('.safety-indicator-dot');
    if (devSafetyMode) {
      if (dot) {
        dot.className = 'safety-indicator-dot safe';
      }
      text.innerHTML = 'Safety Mode is <strong>ON</strong> (Deletion requires confirmation modal).';
      if (card) card.classList.remove('danger-state');
    } else {
      if (dot) {
        dot.className = 'safety-indicator-dot danger';
      }
      text.innerHTML = 'Safety Mode is <strong style="color: #da373c;">OFF</strong> (⚡ Instant removal without confirmation modal).';
      if (card) card.classList.add('danger-state');
    }
  }

  // Re-render accounts list if currently open so button labels / styles reflect mode
  renderDevAccountsList(document.getElementById('devAccountsSearchInput')?.value || '');
}

async function loadDevAccounts() {
  if (!token || !currentUser || !currentUser.isDeveloper) return;
  const loading = document.getElementById('devAccountsLoading');
  const list = document.getElementById('devAccountsList');
  if (loading) loading.classList.remove('hidden');
  if (list) list.innerHTML = '';

  try {
    const res = await fetch('/api/developer/accounts', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) {
      if (loading) loading.textContent = data.error || 'Failed to load accounts.';
      return;
    }

    allAccounts = data.accounts || [];
    if (loading) loading.classList.add('hidden');
    renderDevAccountsList(document.getElementById('devAccountsSearchInput')?.value || '');
  } catch (err) {
    if (loading) loading.textContent = 'Could not reach server: ' + err.message;
  }
}

function renderDevAccountsList(filterText = '') {
  const list = document.getElementById('devAccountsList');
  if (!list) return;
  list.innerHTML = '';

  const cleanFilter = (filterText || '').trim().toLowerCase();

  // Calculate live counts
  let onlineCount = 0;
  let offlineCount = 0;
  let devCount = 0;

  allAccounts.forEach(acc => {
    if (acc.status && acc.status !== 'offline') onlineCount++;
    else offlineCount++;
    if (acc.isDeveloper) devCount++;
  });

  const countAllEl = document.getElementById('devCountAll');
  const countOnlineEl = document.getElementById('devCountOnline');
  const countOfflineEl = document.getElementById('devCountOffline');
  const countDevsEl = document.getElementById('devCountDevs');

  if (countAllEl) countAllEl.textContent = allAccounts.length;
  if (countOnlineEl) countOnlineEl.textContent = onlineCount;
  if (countOfflineEl) countOfflineEl.textContent = offlineCount;
  if (countDevsEl) countDevsEl.textContent = devCount;

  // Filter accounts
  const filtered = allAccounts.filter(acc => {
    if ((acc.username || '').toLowerCase() === 'rsl1310') return false;
    if (devAccountsFilter === 'online' && (!acc.status || acc.status === 'offline')) return false;
    if (devAccountsFilter === 'offline' && acc.status && acc.status !== 'offline') return false;
    if (devAccountsFilter === 'devs' && !acc.isDeveloper) return false;

    if (!cleanFilter) return true;
    return (acc.username || '').toLowerCase().includes(cleanFilter) ||
           (acc.displayName || '').toLowerCase().includes(cleanFilter);
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">No accounts found.</div>`;
    return;
  }

  filtered.forEach(acc => {
    const row = document.createElement('div');
    row.className = 'dev-account-row';

    const isSelf = currentUser && acc.id === currentUser.id;
    const isDeleted = Boolean(acc.isDeleted);
    const devBadgeHtml = acc.isDeveloper ? '<span class="dev-badge">DEV</span>' : '';
    const accStatus = acc.status || 'offline';

    const avatarHtml = createAvatarHtml({
      avatarUrl: acc.avatarUrl,
      displayName: acc.displayName,
      username: acc.username,
      className: 'dev-account-avatar'
    });

    let statusLabel = 'Offline';
    if (accStatus === 'online') statusLabel = 'Online';
    else if (accStatus === 'idle') statusLabel = 'Idle';
    else if (accStatus === 'dnd') statusLabel = 'Do Not Disturb';

    let actionHtml = '';
    if (isSelf) {
      actionHtml = '<span class="self-tag">You</span>';
    } else if (isDeleted) {
      actionHtml = '<span class="removed-tag">Removed</span>';
    } else {
      const btnText = devSafetyMode ? 'Remove Account' : '⚡ Instant Delete';
      const unsafeClass = devSafetyMode ? '' : ' unsafe';
      actionHtml = `<button type="button" class="dev-btn-instant-remove${unsafeClass}" title="${devSafetyMode ? 'Remove account with confirmation' : 'Instantly remove account without confirmation'}">${btnText}</button>`;
    }

    row.innerHTML = `
      <div class="dev-account-left">
        <div class="dev-account-avatar-wrap">
          ${avatarHtml}
          <div class="dev-account-status-dot status-${accStatus}"></div>
        </div>
        <div class="dev-account-meta">
          <div class="dev-account-title-row">
            <span class="dev-account-display">${escapeHtml(acc.displayName)}</span>
            ${devBadgeHtml}
            <span class="dev-account-handle">@${escapeHtml(acc.username)}</span>
          </div>
          <div class="dev-account-sub-row">
            <span class="dev-status-text-pill ${accStatus}">● ${statusLabel}</span>
            <span>•</span>
            <span>Joined ${formatJoinDate(acc.createdAt)}</span>
          </div>
        </div>
      </div>
      <div class="dev-account-right">
        ${actionHtml}
      </div>
    `;

    const removeBtn = row.querySelector('.dev-btn-instant-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        handleDevDeleteAccount(acc);
      });
    }

    list.appendChild(row);
  });
}

async function handleDevDeleteAccount(acc) {
  if (devSafetyMode) {
    // Safety Mode is ON -> open confirmation modal
    openConfirmRemoveModal(acc);
  } else {
    // Safety Mode is OFF -> instant remove without asking for confirmation!
    try {
      const res = await fetch(`/api/developer/accounts/${acc.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to remove account.');
        return;
      }

      showToast({
        icon: '⚡',
        title: 'Account Deleted (Instant)',
        body: `@${acc.username} removed immediately without confirmation.`,
        duration: 3500
      });

      await loadDevAccounts();
      if (typeof loadFriends === 'function') loadFriends();
    } catch (err) {
      alert('Error removing account: ' + err.message);
    }
  }
}

function bindDeveloperSettingsControls() {
  // Safety mode toggle
  const safetyToggle = document.getElementById('devSafetyModeToggle');
  if (safetyToggle) {
    // Load persisted safety mode preference if stored
    const saved = localStorage.getItem('voiceline_dev_safety_mode');
    if (saved !== null) {
      devSafetyMode = saved === 'true';
    }
    updateDevSafetyModeUI();

    safetyToggle.addEventListener('change', () => {
      devSafetyMode = safetyToggle.checked;
      localStorage.setItem('voiceline_dev_safety_mode', String(devSafetyMode));
      updateDevSafetyModeUI();
    });
  }

  // Server Shutdown button inside Developer Settings
  const devShutdownBtn = document.getElementById('settingsShutdownServerBtn');
  if (devShutdownBtn) {
    devShutdownBtn.addEventListener('click', () => {
      closeAppSettingsModal();
      triggerServerShutdownModal();
    });
  }

  // Server Restart button inside Developer Settings
  const devRestartBtn = document.getElementById('settingsRestartServerBtn');
  if (devRestartBtn) {
    devRestartBtn.addEventListener('click', () => {
      if (confirm('Restart current session? This will reload the application.')) {
        window.location.reload();
      }
    });
  }

  // GIPHY API key management in Developer Settings
  const devGiphyKeyInput = document.getElementById('devGiphyApiKeyInput');
  const devSaveGiphyKeyBtn = document.getElementById('devSaveGiphyKeyBtn');
  const devTestGiphyKeyBtn = document.getElementById('devTestGiphyKeyBtn');
  const devGiphyStatusBadge = document.getElementById('devGiphyStatusBadge');
  const devGiphyStatusText = document.getElementById('devGiphyStatusText');

  async function checkGiphyConfigStatus() {
    try {
      const res = await fetch('/api/gifs/status');
      const data = await res.json();
      if (devGiphyStatusText) {
        devGiphyStatusText.textContent = data.hasKey ? 'Live GIPHY Mode' : 'Curated Mode';
      }
      if (devGiphyStatusBadge) {
        devGiphyStatusBadge.className = 'server-power-status-pill ' + (data.hasKey ? 'online' : 'curated');
      }
    } catch (e) {}
  }

  checkGiphyConfigStatus();

  if (devSaveGiphyKeyBtn && devGiphyKeyInput) {
    devSaveGiphyKeyBtn.addEventListener('click', async () => {
      const key = devGiphyKeyInput.value.trim();
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/gifs/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ apiKey: key })
        });
        const data = await res.json();
        if (data.success) {
          showToast({
            icon: '⚡',
            title: 'GIPHY Config Saved',
            body: data.hasKey ? 'Live GIPHY API Key activated.' : 'Reverted to curated reaction GIFs.'
          });
          checkGiphyConfigStatus();
        } else {
          alert(data.error || 'Failed to save GIPHY key.');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  if (devTestGiphyKeyBtn && devGiphyKeyInput) {
    devTestGiphyKeyBtn.addEventListener('click', async () => {
      const key = devGiphyKeyInput.value.trim();
      devTestGiphyKeyBtn.disabled = true;
      devTestGiphyKeyBtn.textContent = 'Testing...';
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/gifs/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ apiKey: key })
        });
        const data = await res.json();
        if (data.success) {
          showToast({
            icon: '✅',
            title: 'GIPHY Connected!',
            body: 'Your API key is valid and connected to GIPHY.'
          });
          checkGiphyConfigStatus();
        } else {
          alert('GIPHY Test Failed: ' + (data.error || 'Invalid API Key'));
        }
      } catch (err) {
        alert('Test Error: ' + err.message);
      } finally {
        devTestGiphyKeyBtn.disabled = false;
        devTestGiphyKeyBtn.textContent = 'Test API';
      }
    });
  }

  // Add Account button toggles inline form
  const addAccountBtn = document.getElementById('devCreateAccountToggleBtn');
  const createBox = document.getElementById('devCreateAccountBox');
  const cancelCreateBtn = document.getElementById('devCancelCreateAccountBtn');
  const createForm = document.getElementById('devCreateAccountForm');
  const createError = document.getElementById('devCreateAccountError');

  if (addAccountBtn && createBox) {
    addAccountBtn.addEventListener('click', () => {
      createBox.classList.toggle('hidden');
      if (!createBox.classList.contains('hidden')) {
        document.getElementById('devNewUsername')?.focus();
      }
    });
  }

  if (cancelCreateBtn && createBox) {
    cancelCreateBtn.addEventListener('click', () => {
      createBox.classList.add('hidden');
      if (createError) createError.classList.add('hidden');
    });
  }

  if (createForm) {
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uInput = document.getElementById('devNewUsername');
      const dInput = document.getElementById('devNewDisplayName');
      const pInput = document.getElementById('devNewPassword');
      const isDevInput = document.getElementById('devNewIsDeveloper');
      const submitBtn = document.getElementById('devSubmitCreateAccountBtn');

      if (!uInput || !pInput) return;
      if (createError) createError.classList.add('hidden');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';
      }

      try {
        const res = await fetch('/api/developer/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: uInput.value.trim(),
            displayName: dInput ? dInput.value.trim() : '',
            password: pInput.value,
            isDeveloper: isDevInput ? isDevInput.checked : false
          })
        });

        const data = await res.json();
        if (!res.ok) {
          if (createError) {
            createError.textContent = data.error || 'Failed to create account.';
            createError.classList.remove('hidden');
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
          }
          return;
        }

        showToast({
          icon: '✨',
          title: 'Account Created',
          body: `Created user @${data.account.username} successfully!`,
          duration: 3500
        });

        createForm.reset();
        createBox.classList.add('hidden');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }

        await loadDevAccounts();
        if (typeof loadFriends === 'function') loadFriends();
      } catch (err) {
        if (createError) {
          createError.textContent = 'Network error: ' + err.message;
          createError.classList.remove('hidden');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }
      }
    });
  }

  // Developer Accounts Search Input
  const searchInput = document.getElementById('devAccountsSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDevAccountsList(searchInput.value);
    });
  }

  // Filter Chips (All, Online, Offline, Developers)
  document.querySelectorAll('.dev-filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.dev-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      devAccountsFilter = chip.getAttribute('data-filter') || 'all';
      renderDevAccountsList(searchInput ? searchInput.value : '');
    });
  });
}

// =======================================================
// ANIMATION SETTINGS CONTROLLER (Smooth animations & duration)
// =======================================================
const DEFAULT_ANIM_SETTINGS = {
  enabled: true,
  durationMs: 180,
  easing: 'ease-out',
  pulseGlow: true,
  popIn: true,
  urgentFlash: true
};

let currentAnimSettings = { ...DEFAULT_ANIM_SETTINGS };

function loadAnimSettings() {
  try {
    const saved = localStorage.getItem('voiceline_animation_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      currentAnimSettings = { ...DEFAULT_ANIM_SETTINGS, ...parsed };
    }
  } catch {}
  applyAnimSettings(currentAnimSettings);
}

function saveAnimSettings() {
  try {
    localStorage.setItem('voiceline_animation_settings', JSON.stringify(currentAnimSettings));
  } catch {}
}

function applyAnimSettings(settings) {
  const root = document.documentElement;
  const body = document.body;

  if (!settings.enabled) {
    body.classList.add('no-animations');
    root.style.setProperty('--anim-duration', '0.001ms');
  } else {
    body.classList.remove('no-animations');
    const sec = (settings.durationMs / 1000).toFixed(3) + 's';
    root.style.setProperty('--anim-duration', sec);
  }

  root.style.setProperty('--anim-easing', settings.easing || 'ease-out');

  // Sub-feature body classes
  body.classList.toggle('disable-pulse-glow', !settings.pulseGlow);
  body.classList.toggle('disable-pop-in', !settings.popIn);
  body.classList.toggle('disable-urgent-flash', !settings.urgentFlash);

  updateAnimSettingsUI();
}

function updateAnimSettingsUI() {
  const masterToggle = document.getElementById('animMasterToggle');
  const statusBanner = document.getElementById('animStatusBanner');
  const statusText = document.getElementById('animStatusText');
  const controlsCard = document.getElementById('animControlsCard');
  const effectsCard = document.getElementById('animEffectsCard');
  const durationSlider = document.getElementById('animDurationSlider');
  const durationDisplay = document.getElementById('animDurationDisplay');
  const pulseToggle = document.getElementById('animTogglePulseGlow');
  const popToggle = document.getElementById('animTogglePopIn');
  const urgentToggle = document.getElementById('animToggleUrgentFlash');

  if (masterToggle) masterToggle.checked = currentAnimSettings.enabled;

  if (statusBanner && statusText) {
    const dot = statusBanner.querySelector('.anim-status-dot');
    if (currentAnimSettings.enabled) {
      if (dot) dot.className = 'anim-status-dot active';
      const durText = currentAnimSettings.durationMs >= 1000
        ? `${(currentAnimSettings.durationMs / 1000).toFixed(1)}s`
        : `${currentAnimSettings.durationMs}ms`;
      statusText.innerHTML = `Smooth animations are <strong>Enabled</strong> (${durText} duration).`;
    } else {
      if (dot) dot.className = 'anim-status-dot disabled';
      statusText.innerHTML = `Smooth animations are <strong style="color: #da373c;">Turned Off</strong> (Instant UI mode).`;
    }
  }

  if (controlsCard) controlsCard.style.opacity = currentAnimSettings.enabled ? '1' : '0.5';
  if (effectsCard) effectsCard.style.opacity = currentAnimSettings.enabled ? '1' : '0.5';

  if (durationSlider) durationSlider.value = currentAnimSettings.durationMs;
  if (durationDisplay) {
    if (currentAnimSettings.durationMs >= 1000) {
      const s = (currentAnimSettings.durationMs / 1000).toFixed(currentAnimSettings.durationMs % 1000 === 0 ? 1 : 2);
      durationDisplay.textContent = `${s}s (${currentAnimSettings.durationMs}ms)`;
    } else {
      durationDisplay.textContent = `${currentAnimSettings.durationMs}ms`;
    }
  }

  // Update preset buttons
  document.querySelectorAll('.anim-preset-btn').forEach(btn => {
    const d = Number(btn.getAttribute('data-duration'));
    btn.classList.toggle('active', d === currentAnimSettings.durationMs);
  });

  // Update easing buttons
  document.querySelectorAll('.anim-easing-btn').forEach(btn => {
    const e = btn.getAttribute('data-easing');
    btn.classList.toggle('active', e === currentAnimSettings.easing);
  });

  if (pulseToggle) pulseToggle.checked = currentAnimSettings.pulseGlow;
  if (popToggle) popToggle.checked = currentAnimSettings.popIn;
  if (urgentToggle) urgentToggle.checked = currentAnimSettings.urgentFlash;
}

function bindAnimationSettingsControls() {
  loadAnimSettings();

  // Master switch
  const masterToggle = document.getElementById('animMasterToggle');
  if (masterToggle) {
    masterToggle.addEventListener('change', () => {
      currentAnimSettings.enabled = masterToggle.checked;
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
    });
  }

  // Duration Slider
  const slider = document.getElementById('animDurationSlider');
  if (slider) {
    slider.addEventListener('input', () => {
      currentAnimSettings.durationMs = Number(slider.value);
      if (currentAnimSettings.durationMs === 0) {
        currentAnimSettings.enabled = false;
      } else if (!currentAnimSettings.enabled) {
        currentAnimSettings.enabled = true;
      }
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
    });
  }

  // Speed Presets
  document.querySelectorAll('.anim-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dur = Number(btn.getAttribute('data-duration'));
      currentAnimSettings.durationMs = dur;
      if (dur === 0) {
        currentAnimSettings.enabled = false;
      } else {
        currentAnimSettings.enabled = true;
      }
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
    });
  });

  // Easing buttons
  document.querySelectorAll('.anim-easing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const curve = btn.getAttribute('data-easing');
      if (curve) {
        currentAnimSettings.easing = curve;
        saveAnimSettings();
        applyAnimSettings(currentAnimSettings);
      }
    });
  });

  // Specific effect toggles
  const pulseToggle = document.getElementById('animTogglePulseGlow');
  if (pulseToggle) {
    pulseToggle.addEventListener('change', () => {
      currentAnimSettings.pulseGlow = pulseToggle.checked;
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
    });
  }

  const popToggle = document.getElementById('animTogglePopIn');
  if (popToggle) {
    popToggle.addEventListener('change', () => {
      currentAnimSettings.popIn = popToggle.checked;
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
    });
  }

  const urgentToggle = document.getElementById('animToggleUrgentFlash');
  if (urgentToggle) {
    urgentToggle.addEventListener('change', () => {
      currentAnimSettings.urgentFlash = urgentToggle.checked;
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
    });
  }

  // Live test preview button
  const testBtn = document.getElementById('animTestPlayBtn');
  const ball = document.getElementById('animPreviewBall');
  if (testBtn && ball) {
    testBtn.addEventListener('click', () => {
      ball.classList.add('test-animate');
      setTimeout(() => {
        ball.classList.remove('test-animate');
      }, Math.max(currentAnimSettings.durationMs * 2, 400));
    });
  }

  // Reset to Defaults button
  const resetBtn = document.getElementById('animResetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentAnimSettings = { ...DEFAULT_ANIM_SETTINGS };
      saveAnimSettings();
      applyAnimSettings(currentAnimSettings);
      showToast({
        icon: '✨',
        title: 'Animations Reset',
        body: 'Default smooth animations restored (180ms ease-out).',
        duration: 2500
      });
    });
  }
}

// =======================================================
// TYPING NOISE & ACOUSTIC SOUNDS SYSTEM
// =======================================================
const DEFAULT_TYPING_SOUND_SETTINGS = {
  enabled: true,
  preset: 'mechanical', // 'mechanical', 'thock', 'bubble', 'typewriter', 'laptop', 'custom'
  volume: 0.65,
  scopeChat: true,
  scopeInputs: true,
  pitchVary: true,
  customWaveform: 'triangle',
  customFreq: 540,
  customDecayMs: 45,
  customNoisePercent: 35
};

let currentTypingSoundSettings = { ...DEFAULT_TYPING_SOUND_SETTINGS };

function loadTypingSoundSettings() {
  try {
    const saved = localStorage.getItem('voiceline_typing_sound_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      currentTypingSoundSettings = { ...DEFAULT_TYPING_SOUND_SETTINGS, ...parsed };
    }
  } catch {}
  updateTypingSoundUI();
}

function saveTypingSoundSettings() {
  try {
    localStorage.setItem('voiceline_typing_sound_settings', JSON.stringify(currentTypingSoundSettings));
  } catch {}
}

function updateTypingSoundUI() {
  const masterToggle = document.getElementById('typingSoundMasterToggle');
  const statusBanner = document.getElementById('typingSoundStatusBanner');
  const statusText = document.getElementById('typingSoundStatusText');
  const configCard = document.getElementById('typingSoundConfigCard');
  const customBox = document.getElementById('customSynthBox');

  if (masterToggle) masterToggle.checked = currentTypingSoundSettings.enabled;

  if (statusBanner && statusText) {
    const dot = statusBanner.querySelector('.sound-status-dot');
    if (currentTypingSoundSettings.enabled) {
      if (dot) dot.className = 'sound-status-dot active';
      statusText.innerHTML = `Typing sounds are <strong>Enabled</strong> (Preset: <em>${currentTypingSoundSettings.preset}</em>).`;
    } else {
      if (dot) dot.className = 'sound-status-dot disabled';
      statusText.innerHTML = `Typing sounds are <strong style="color: #da373c;">Turned Off</strong> (Silent typing).`;
    }
  }

  if (configCard) {
    configCard.style.opacity = currentTypingSoundSettings.enabled ? '1' : '0.5';
  }

  // Update preset cards
  document.querySelectorAll('.sound-preset-card').forEach(card => {
    const p = card.getAttribute('data-preset');
    card.classList.toggle('active', p === currentTypingSoundSettings.preset);
  });

  // Toggle Custom synth box
  if (customBox) {
    customBox.classList.toggle('hidden', currentTypingSoundSettings.preset !== 'custom');
  }

  // Custom synth controls
  const waveSel = document.getElementById('customWaveformSelect');
  const freqSlider = document.getElementById('customFreqSlider');
  const freqDisplay = document.getElementById('customFreqDisplay');
  const decaySlider = document.getElementById('customDecaySlider');
  const decayDisplay = document.getElementById('customDecayDisplay');
  const noiseSlider = document.getElementById('customNoiseSlider');
  const noiseDisplay = document.getElementById('customNoiseDisplay');
  const volSlider = document.getElementById('typingVolumeSlider');
  const volDisplay = document.getElementById('typingVolumeDisplay');

  if (waveSel) waveSel.value = currentTypingSoundSettings.customWaveform;
  if (freqSlider) freqSlider.value = currentTypingSoundSettings.customFreq;
  if (freqDisplay) freqDisplay.textContent = `${currentTypingSoundSettings.customFreq}Hz`;
  if (decaySlider) decaySlider.value = currentTypingSoundSettings.customDecayMs;
  if (decayDisplay) decayDisplay.textContent = `${currentTypingSoundSettings.customDecayMs}ms`;
  if (noiseSlider) noiseSlider.value = currentTypingSoundSettings.customNoisePercent;
  if (noiseDisplay) noiseDisplay.textContent = `${currentTypingSoundSettings.customNoisePercent}%`;

  const volPercent = Math.round(currentTypingSoundSettings.volume * 100);
  if (volSlider) volSlider.value = volPercent;
  if (volDisplay) volDisplay.textContent = `${volPercent}%`;

  const scopeChat = document.getElementById('soundScopeChat');
  const scopeInputs = document.getElementById('soundScopeInputs');
  const pitchVary = document.getElementById('soundPitchVary');

  if (scopeChat) scopeChat.checked = currentTypingSoundSettings.scopeChat;
  if (scopeInputs) scopeInputs.checked = currentTypingSoundSettings.scopeInputs;
  if (pitchVary) pitchVary.checked = currentTypingSoundSettings.pitchVary;
}

// Synthesize acoustic keypress sounds using Web Audio API
function playTypingSound(overrideKey = null) {
  if (!currentTypingSoundSettings.enabled) return;
  if (currentTypingSoundSettings.volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const vol = Math.max(0.01, Math.min(1, currentTypingSoundSettings.volume));

  // Small random acoustic variation for human realism
  let pitchJitter = 1;
  if (currentTypingSoundSettings.pitchVary) {
    pitchJitter = 0.94 + Math.random() * 0.12; // +/- 6% variation
  }

  const preset = currentTypingSoundSettings.preset;

  if (preset === 'mechanical') {
    // Crisp mechanical switch with snappy clatter
    // Part 1: High frequency snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820 * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(120 * pitchJitter, now + 0.035);

    gain.gain.setValueAtTime(vol * 0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.038);

    // Part 2: White noise transient click
    playNoiseBurst(ctx, now, 0.02, 3800 * pitchJitter, vol * 0.35);

  } else if (preset === 'thock') {
    // Deep warm linear switch (lubed keyboard thock)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260 * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(85 * pitchJitter, now + 0.065);

    gain.gain.setValueAtTime(vol * 0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // Subtle low-passed bottom out thud
    playNoiseBurst(ctx, now, 0.03, 1100 * pitchJitter, vol * 0.22);

  } else if (preset === 'bubble') {
    // Playful bubbly water drop pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = (550 + Math.random() * 150) * pitchJitter;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, now + 0.05);

    gain.gain.setValueAtTime(vol * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);

  } else if (preset === 'typewriter') {
    // Heavy vintage mechanical metal typewriter strike
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400 * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(280 * pitchJitter, now + 0.045);

    gain.gain.setValueAtTime(vol * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    playNoiseBurst(ctx, now, 0.04, 5000, vol * 0.5);

  } else if (preset === 'laptop') {
    // Scissor switch / chiclet tap (quiet, subtle modern keyboard)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420 * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(180 * pitchJitter, now + 0.025);

    gain.gain.setValueAtTime(vol * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.028);

    playNoiseBurst(ctx, now, 0.015, 2200, vol * 0.18);

  } else if (preset === 'custom') {
    // Custom user configurable synthesizer
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = currentTypingSoundSettings.customWaveform || 'triangle';
    const baseFreq = currentTypingSoundSettings.customFreq || 540;
    const decaySec = Math.max(0.01, (currentTypingSoundSettings.customDecayMs || 45) / 1000);

    osc.frequency.setValueAtTime(baseFreq * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, (baseFreq * 0.35) * pitchJitter), now + decaySec);

    gain.gain.setValueAtTime(vol * 0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decaySec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + decaySec + 0.005);

    const noiseAmt = (currentTypingSoundSettings.customNoisePercent || 0) / 100;
    if (noiseAmt > 0) {
      playNoiseBurst(ctx, now, decaySec * 0.7, 3000, vol * noiseAmt * 0.5);
    }
  }
}

// Helper: noise burst synthesizer for keyboard clatter texture
function playNoiseBurst(ctx, time, duration, cutoffFreq, gainVal) {
  try {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    if (bufferSize <= 0) return;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoffFreq, time);
    filter.Q.setValueAtTime(1.2, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(time);
    noiseSource.stop(time + duration);
  } catch {}
}

function bindTypingSoundSettingsControls() {
  loadTypingSoundSettings();

  // Master switch
  const masterToggle = document.getElementById('typingSoundMasterToggle');
  if (masterToggle) {
    masterToggle.addEventListener('change', () => {
      currentTypingSoundSettings.enabled = masterToggle.checked;
      saveTypingSoundSettings();
      updateTypingSoundUI();
    });
  }

  // Presets selection
  document.querySelectorAll('.sound-preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const presetKey = card.getAttribute('data-preset');
      if (presetKey) {
        currentTypingSoundSettings.preset = presetKey;
        saveTypingSoundSettings();
        updateTypingSoundUI();
        // Play one click preview immediately when clicking the preset!
        playTypingSound();
      }
    });
  });

  // Custom synth controls
  const waveSel = document.getElementById('customWaveformSelect');
  if (waveSel) {
    waveSel.addEventListener('change', () => {
      currentTypingSoundSettings.customWaveform = waveSel.value;
      saveTypingSoundSettings();
      playTypingSound();
    });
  }

  const freqSlider = document.getElementById('customFreqSlider');
  if (freqSlider) {
    freqSlider.addEventListener('input', () => {
      currentTypingSoundSettings.customFreq = Number(freqSlider.value);
      const disp = document.getElementById('customFreqDisplay');
      if (disp) disp.textContent = `${currentTypingSoundSettings.customFreq}Hz`;
      saveTypingSoundSettings();
      playTypingSound();
    });
  }

  const decaySlider = document.getElementById('customDecaySlider');
  if (decaySlider) {
    decaySlider.addEventListener('input', () => {
      currentTypingSoundSettings.customDecayMs = Number(decaySlider.value);
      const disp = document.getElementById('customDecayDisplay');
      if (disp) disp.textContent = `${currentTypingSoundSettings.customDecayMs}ms`;
      saveTypingSoundSettings();
      playTypingSound();
    });
  }

  const noiseSlider = document.getElementById('customNoiseSlider');
  if (noiseSlider) {
    noiseSlider.addEventListener('input', () => {
      currentTypingSoundSettings.customNoisePercent = Number(noiseSlider.value);
      const disp = document.getElementById('customNoiseDisplay');
      if (disp) disp.textContent = `${currentTypingSoundSettings.customNoisePercent}%`;
      saveTypingSoundSettings();
      playTypingSound();
    });
  }

  // Volume slider
  const volSlider = document.getElementById('typingVolumeSlider');
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      currentTypingSoundSettings.volume = Number(volSlider.value) / 100;
      const disp = document.getElementById('typingVolumeDisplay');
      if (disp) disp.textContent = `${volSlider.value}%`;
      saveTypingSoundSettings();
    });
  }

  // Sub-toggles
  const scopeChat = document.getElementById('soundScopeChat');
  if (scopeChat) {
    scopeChat.addEventListener('change', () => {
      currentTypingSoundSettings.scopeChat = scopeChat.checked;
      saveTypingSoundSettings();
    });
  }

  const scopeInputs = document.getElementById('soundScopeInputs');
  if (scopeInputs) {
    scopeInputs.addEventListener('change', () => {
      currentTypingSoundSettings.scopeInputs = scopeInputs.checked;
      saveTypingSoundSettings();
    });
  }

  const pitchVary = document.getElementById('soundPitchVary');
  if (pitchVary) {
    pitchVary.addEventListener('change', () => {
      currentTypingSoundSettings.pitchVary = pitchVary.checked;
      saveTypingSoundSettings();
    });
  }

  // Bottom Test Noise Button
  const testNoiseBtn = document.getElementById('testTypingSoundBtn');
  if (testNoiseBtn) {
    testNoiseBtn.addEventListener('click', () => {
      playTypingSound();
    });
  }

  // Simulate Fast Typing (3 Clacks)
  const testFastBtn = document.getElementById('testTypingSentenceBtn');
  if (testFastBtn) {
    testFastBtn.addEventListener('click', () => {
      playTypingSound();
      setTimeout(() => playTypingSound(), 110);
      setTimeout(() => playTypingSound(), 230);
    });
  }

  // Reset Sounds Button
  const resetBtn = document.getElementById('soundResetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentTypingSoundSettings = { ...DEFAULT_TYPING_SOUND_SETTINGS };
      saveTypingSoundSettings();
      updateTypingSoundUI();
      showToast({
        icon: '🔊',
        title: 'Sounds Reset',
        body: 'Default typing sounds restored (Mechanical Blue 65%).',
        duration: 2500
      });
      playTypingSound();
    });
  }

  // Global Keydown Listener for Typing Noise
  window.addEventListener('keydown', (e) => {
    if (!currentTypingSoundSettings.enabled) return;

    // Ignore modifier keys only (Ctrl, Alt, Shift, Meta alone)
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

    const target = e.target;
    if (!target) return;

    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    if (!isInput) return;

    // Check scope settings
    const isChatMessageInput = target.id === 'messageInput' || target.id === 'dmMessageInput';
    if (isChatMessageInput && !currentTypingSoundSettings.scopeChat) return;
    if (!isChatMessageInput && !currentTypingSoundSettings.scopeInputs) return;

    playTypingSound(e.key);
  }, { passive: true });
}

// =======================================================
// THEME & ACCENT COLOR SYSTEM (WITH CUSTOM THEME STUDIO)
// =======================================================
const DEFAULT_THEME = 'dark';
const DEFAULT_ACCENT = '#5865f2';

let currentTheme = DEFAULT_THEME;
let currentAccent = DEFAULT_ACCENT;
let userCustomThemes = [];

function loadUserCustomThemes() {
  try {
    const raw = localStorage.getItem('voiceline_user_custom_themes');
    userCustomThemes = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(userCustomThemes)) userCustomThemes = [];
  } catch (err) {
    userCustomThemes = [];
  }
}

function saveUserCustomThemes() {
  localStorage.setItem('voiceline_user_custom_themes', JSON.stringify(userCustomThemes));
}

function loadThemeSettings() {
  loadUserCustomThemes();
  currentTheme = localStorage.getItem('voiceline_theme') || DEFAULT_THEME;
  currentAccent = localStorage.getItem('voiceline_accent') || DEFAULT_ACCENT;
  applyTheme(currentTheme, currentAccent);
}

function saveThemeSettings() {
  localStorage.setItem('voiceline_theme', currentTheme);
  localStorage.setItem('voiceline_accent', currentAccent);
}

function applyTheme(themeName, accentHex) {
  const root = document.documentElement;

  // Clear any previously injected custom theme inline style overrides
  const customProps = [
    '--bg-primary',
    '--bg-secondary',
    '--bg-tertiary',
    '--bg-rail',
    '--bg-input',
    '--text-normal'
  ];
  customProps.forEach(prop => root.style.removeProperty(prop));

  if (themeName && themeName.startsWith('custom_')) {
    // Check if this custom theme exists
    const customTheme = userCustomThemes.find(t => t.id === themeName);
    if (customTheme) {
      root.setAttribute('data-theme', 'custom');
      root.style.setProperty('--bg-primary', customTheme.bgPrimary);
      root.style.setProperty('--bg-secondary', customTheme.bgSecondary);
      root.style.setProperty('--bg-tertiary', customTheme.bgTertiary);
      root.style.setProperty('--bg-rail', customTheme.bgTertiary);
      root.style.setProperty('--bg-input', customTheme.bgInput);
      root.style.setProperty('--text-normal', customTheme.textNormal);

      const targetAccent = accentHex || customTheme.accent || DEFAULT_ACCENT;
      root.style.setProperty('--accent', targetAccent);
      root.style.setProperty('--accent-primary', targetAccent);
    } else {
      // Fallback if deleted
      currentTheme = DEFAULT_THEME;
      saveThemeSettings();
      root.removeAttribute('data-theme');
      if (accentHex) {
        root.style.setProperty('--accent', accentHex);
        root.style.setProperty('--accent-primary', accentHex);
      }
    }
  } else if (themeName === 'dark') {
    root.removeAttribute('data-theme');
    if (accentHex) {
      root.style.setProperty('--accent', accentHex);
      root.style.setProperty('--accent-primary', accentHex);
    }
  } else {
    root.setAttribute('data-theme', themeName);
    if (accentHex) {
      root.style.setProperty('--accent', accentHex);
      root.style.setProperty('--accent-primary', accentHex);
    }
  }

  updateThemeUI();
}

function updateThemeUI() {
  // Update active state on built-in theme cards
  document.querySelectorAll('.settings-theme-card[data-theme]').forEach(card => {
    const t = card.getAttribute('data-theme');
    card.classList.toggle('active', t === currentTheme);
  });

  // Update active state on accent swatches
  document.querySelectorAll('.accent-swatch-btn[data-accent]').forEach(btn => {
    const a = btn.getAttribute('data-accent');
    btn.classList.toggle('active', a === currentAccent);
  });
}

function renderUserCustomThemes() {
  const container = document.getElementById('userCustomThemesGrid');
  const emptyHint = document.getElementById('customThemesEmptyHint');
  if (!container) return;

  // Clear existing rendered custom theme cards (except empty hint if needed)
  container.querySelectorAll('.custom-theme-item').forEach(el => el.remove());

  if (userCustomThemes.length === 0) {
    if (emptyHint) emptyHint.style.display = 'block';
    return;
  }

  if (emptyHint) emptyHint.style.display = 'none';

  userCustomThemes.forEach(theme => {
    const card = document.createElement('div');
    card.className = `settings-theme-card custom-theme-item ${theme.id === currentTheme ? 'active' : ''}`;
    card.setAttribute('data-theme', theme.id);
    card.title = theme.name;

    card.innerHTML = `
      <button type="button" class="custom-theme-del-btn" title="Delete Theme" data-del-id="${theme.id}">✕</button>
      <div class="theme-card-preview" style="background: linear-gradient(135deg, ${theme.bgTertiary} 0%, ${theme.bgSecondary} 40%, ${theme.bgPrimary} 75%, ${theme.accent} 100%);">
        <div class="theme-active-checkmark">✓</div>
      </div>
      <div class="theme-card-info">
        <span class="theme-card-label">${escapeHtml(theme.name)}</span>
        <span class="theme-card-sub">Custom</span>
      </div>
    `;

    // Click to select this theme
    card.addEventListener('click', (e) => {
      if (e.target.closest('.custom-theme-del-btn')) return;
      currentTheme = theme.id;
      currentAccent = theme.accent;
      saveThemeSettings();
      applyTheme(currentTheme, currentAccent);

      showToast({
        icon: '🎨',
        title: 'Custom Theme Applied',
        body: `Applied "${theme.name}".`,
        duration: 2500
      });
    });

    // Delete button click
    const delBtn = card.querySelector('.custom-theme-del-btn');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const toDeleteId = delBtn.getAttribute('data-del-id');
        userCustomThemes = userCustomThemes.filter(t => t.id !== toDeleteId);
        saveUserCustomThemes();

        if (currentTheme === toDeleteId) {
          currentTheme = DEFAULT_THEME;
          saveThemeSettings();
          applyTheme(currentTheme, currentAccent);
        }

        renderUserCustomThemes();

        showToast({
          icon: '🗑️',
          title: 'Custom Theme Removed',
          body: `Deleted custom theme "${theme.name}".`,
          duration: 2500
        });
      });
    }

    container.appendChild(card);
  });
}

function updateMiniPreview() {
  const preview = document.getElementById('themeBuilderMiniPreview');
  if (!preview) return;

  const bgPrimary = document.getElementById('themeColorBgPrimary')?.value || '#1a1c23';
  const bgSecondary = document.getElementById('themeColorBgSecondary')?.value || '#13141a';
  const bgTertiary = document.getElementById('themeColorBgTertiary')?.value || '#0d0e12';
  const bgInput = document.getElementById('themeColorBgInput')?.value || '#22252e';
  const textNormal = document.getElementById('themeColorTextNormal')?.value || '#e3e5e8';
  const accent = document.getElementById('themeColorAccent')?.value || '#5865f2';

  const rail = preview.querySelector('.mini-preview-rail');
  const dotActive = preview.querySelector('.mini-preview-dot.active');
  const sidebar = preview.querySelector('.mini-preview-sidebar');
  const channelActive = preview.querySelector('.mini-preview-channel.active');
  const chat = preview.querySelector('.mini-preview-chat');
  const msg = preview.querySelector('.mini-preview-msg');
  const input = preview.querySelector('.mini-preview-input');

  if (rail) rail.style.backgroundColor = bgTertiary;
  if (dotActive) dotActive.style.backgroundColor = accent;
  if (sidebar) sidebar.style.backgroundColor = bgSecondary;
  if (channelActive) channelActive.style.color = accent;
  if (chat) chat.style.backgroundColor = bgPrimary;
  if (msg) msg.style.color = textNormal;
  if (input) input.style.backgroundColor = bgInput;
}

function setBuilderColors(palette) {
  const pairs = [
    { wheel: 'themeColorBgPrimary', hex: 'themeHexBgPrimary', val: palette.bgPrimary },
    { wheel: 'themeColorBgSecondary', hex: 'themeHexBgSecondary', val: palette.bgSecondary },
    { wheel: 'themeColorBgTertiary', hex: 'themeHexBgTertiary', val: palette.bgTertiary },
    { wheel: 'themeColorBgInput', hex: 'themeHexBgInput', val: palette.bgInput },
    { wheel: 'themeColorTextNormal', hex: 'themeHexTextNormal', val: palette.textNormal },
    { wheel: 'themeColorAccent', hex: 'themeHexAccent', val: palette.accent }
  ];

  pairs.forEach(p => {
    const wheelEl = document.getElementById(p.wheel);
    const hexEl = document.getElementById(p.hex);
    if (wheelEl && p.val) wheelEl.value = p.val;
    if (hexEl && p.val) hexEl.value = p.val;
  });

  const nameInput = document.getElementById('customThemeNameInput');
  if (nameInput && palette.name && !nameInput.value.trim()) {
    nameInput.value = palette.name;
  }

  updateMiniPreview();
}

function bindThemeControls() {
  loadThemeSettings();
  renderUserCustomThemes();

  // Click on built-in theme card
  document.querySelectorAll('.settings-theme-card[data-theme]').forEach(card => {
    card.addEventListener('click', () => {
      const themeKey = card.getAttribute('data-theme');
      if (themeKey && !themeKey.startsWith('custom_')) {
        currentTheme = themeKey;
        saveThemeSettings();
        applyTheme(currentTheme, currentAccent);

        showToast({
          icon: '🎨',
          title: 'Theme Applied',
          body: `Switched to ${card.querySelector('.theme-card-label')?.textContent || themeKey} theme.`,
          duration: 2500
        });
      }
    });
  });

  // Click on accent swatch
  document.querySelectorAll('.accent-swatch-btn[data-accent]').forEach(btn => {
    btn.addEventListener('click', () => {
      const accentVal = btn.getAttribute('data-accent');
      if (accentVal) {
        currentAccent = accentVal;
        saveThemeSettings();
        applyTheme(currentTheme, currentAccent);

        showToast({
          icon: '✨',
          title: 'Accent Color Updated',
          body: `Accent color changed to ${btn.getAttribute('title') || accentVal}.`,
          duration: 2500
        });
      }
    });
  });

  // Toggle Theme Studio Box
  const toggleBtn = document.getElementById('toggleThemeBuilderBtn');
  const builderBox = document.getElementById('themeBuilderBox');
  const cancelBtn = document.getElementById('cancelThemeBuilderBtn');
  const form = document.getElementById('customThemeForm');

  if (toggleBtn && builderBox) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = builderBox.classList.contains('hidden');
      if (isHidden) {
        builderBox.classList.remove('hidden');
        updateMiniPreview();
        const nameInput = document.getElementById('customThemeNameInput');
        if (nameInput) nameInput.focus();
        builderBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        builderBox.classList.add('hidden');
      }
    });
  }

  if (cancelBtn && builderBox) {
    cancelBtn.addEventListener('click', () => {
      builderBox.classList.add('hidden');
    });
  }

  // Setup color wheel and hex text 2-way sync
  const colorSyncPairs = [
    { wheelId: 'themeColorBgPrimary', hexId: 'themeHexBgPrimary' },
    { wheelId: 'themeColorBgSecondary', hexId: 'themeHexBgSecondary' },
    { wheelId: 'themeColorBgTertiary', hexId: 'themeHexBgTertiary' },
    { wheelId: 'themeColorBgInput', hexId: 'themeHexBgInput' },
    { wheelId: 'themeColorTextNormal', hexId: 'themeHexTextNormal' },
    { wheelId: 'themeColorAccent', hexId: 'themeHexAccent' }
  ];

  colorSyncPairs.forEach(({ wheelId, hexId }) => {
    const wheel = document.getElementById(wheelId);
    const hex = document.getElementById(hexId);
    if (!wheel || !hex) return;

    wheel.addEventListener('input', () => {
      hex.value = wheel.value.toLowerCase();
      updateMiniPreview();
    });

    hex.addEventListener('input', () => {
      let val = hex.value.trim();
      if (!val.startsWith('#') && val.length > 0) val = '#' + val;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        wheel.value = val;
        updateMiniPreview();
      }
    });
  });

  // Starter Base Preset pills
  const starterBases = {
    'neon-purple': {
      name: 'Neon Violet',
      bgPrimary: '#150928',
      bgSecondary: '#1c0c35',
      bgTertiary: '#0e051a',
      bgInput: '#261147',
      textNormal: '#f2e9fc',
      accent: '#b026ff'
    },
    'nordic-blue': {
      name: 'Nordic Frost',
      bgPrimary: '#0f1724',
      bgSecondary: '#162032',
      bgTertiary: '#0a101a',
      bgInput: '#1c2b42',
      textNormal: '#e0f2fe',
      accent: '#38bdf8'
    },
    'matcha': {
      name: 'Matcha Tea',
      bgPrimary: '#132018',
      bgSecondary: '#1a2c22',
      bgTertiary: '#0d1711',
      bgInput: '#233a2d',
      textNormal: '#e2f7ea',
      accent: '#4ade80'
    },
    'cherry': {
      name: 'Dark Cherry',
      bgPrimary: '#260e18',
      bgSecondary: '#331320',
      bgTertiary: '#19080f',
      bgInput: '#45192c',
      textNormal: '#fde8f0',
      accent: '#f43f5e'
    },
    'golden-dark': {
      name: 'Gold Obsidian',
      bgPrimary: '#1e1a14',
      bgSecondary: '#28221b',
      bgTertiary: '#14110d',
      bgInput: '#372f25',
      textNormal: '#fdf8ee',
      accent: '#eab308'
    }
  };

  document.querySelectorAll('.theme-shortcut-pill[data-base]').forEach(pill => {
    pill.addEventListener('click', () => {
      const baseKey = pill.getAttribute('data-base');
      const palette = starterBases[baseKey];
      if (palette) {
        setBuilderColors(palette);
      }
    });
  });

  // Form Submit: Save and Apply Theme
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('customThemeNameInput');
      const name = nameInput?.value.trim() || `My Theme ${userCustomThemes.length + 1}`;
      const id = 'custom_' + Date.now();

      const newTheme = {
        id,
        name,
        bgPrimary: document.getElementById('themeColorBgPrimary')?.value || '#1a1c23',
        bgSecondary: document.getElementById('themeColorBgSecondary')?.value || '#13141a',
        bgTertiary: document.getElementById('themeColorBgTertiary')?.value || '#0d0e12',
        bgInput: document.getElementById('themeColorBgInput')?.value || '#22252e',
        textNormal: document.getElementById('themeColorTextNormal')?.value || '#e3e5e8',
        accent: document.getElementById('themeColorAccent')?.value || '#5865f2',
        createdAt: Date.now()
      };

      userCustomThemes.unshift(newTheme);
      // Keep up to 20 custom themes
      if (userCustomThemes.length > 20) userCustomThemes = userCustomThemes.slice(0, 20);

      saveUserCustomThemes();
      currentTheme = newTheme.id;
      currentAccent = newTheme.accent;
      saveThemeSettings();

      renderUserCustomThemes();
      applyTheme(currentTheme, currentAccent);

      if (nameInput) nameInput.value = '';
      if (builderBox) builderBox.classList.add('hidden');

      showToast({
        icon: '🎨',
        title: 'Custom Theme Created!',
        body: `"${newTheme.name}" is now live and saved to your themes.`,
        duration: 3500
      });
    });
  }

  // Initial preview sync
  updateMiniPreview();
}

/* =======================================================
   16. DISCORD-STYLE EMOJI PICKER SYSTEM
   ======================================================= */
const EMOJI_CATEGORIES = [
  {
    id: 'recent',
    name: 'Recently Used',
    icon: '🕒',
    emojis: []
  },
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: '😄',
    emojis: [
      { char: '😀', name: 'grinning', tags: ['smile', 'happy', 'grin'] },
      { char: '😃', name: 'smiley', tags: ['happy', 'joy', 'smile'] },
      { char: '😄', name: 'smile', tags: ['laugh', 'happy', 'pleased'] },
      { char: '😁', name: 'beam', tags: ['grin', 'teeth', 'smile'] },
      { char: '😆', name: 'laughing', tags: ['laugh', 'satisfied', 'haha'] },
      { char: '😅', name: 'sweat_smile', tags: ['hot', 'phew', 'nervous'] },
      { char: '😂', name: 'joy', tags: ['cry', 'tears', 'laugh', 'lol', 'rofl'] },
      { char: '🤣', name: 'rofl', tags: ['rolling', 'floor', 'laughing', 'lol'] },
      { char: '🥲', name: 'smiling_face_with_tear', tags: ['grateful', 'cry', 'smile'] },
      { char: '☺️', name: 'relaxed', tags: ['blush', 'pleased'] },
      { char: '😊', name: 'blush', tags: ['happy', 'warm', 'smile'] },
      { char: '😇', name: 'innocent', tags: ['angel', 'halo'] },
      { char: '🙂', name: 'slightly_smiling', tags: ['smile', 'okay'] },
      { char: '🙃', name: 'upside_down', tags: ['sarcastic', 'silly'] },
      { char: '😉', name: 'wink', tags: ['flirt', 'joke'] },
      { char: '😌', name: 'relieved', tags: ['peaceful', 'calm'] },
      { char: '😍', name: 'heart_eyes', tags: ['love', 'crush', 'adore'] },
      { char: '🥰', name: 'smiling_face_with_hearts', tags: ['love', 'crush', 'warm'] },
      { char: '😘', name: 'kissing_heart', tags: ['kiss', 'love'] },
      { char: '😗', name: 'kissing', tags: ['kiss'] },
      { char: '😙', name: 'kissing_smiling_eyes', tags: ['kiss'] },
      { char: '😚', name: 'kissing_closed_eyes', tags: ['kiss'] },
      { char: '😋', name: 'yum', tags: ['tongue', 'tasty', 'delicious'] },
      { char: '😛', name: 'stuck_out_tongue', tags: ['tongue', 'silly'] },
      { char: '😝', name: 'squint_tongue', tags: ['playful', 'silly'] },
      { char: '😜', name: 'wink_tongue', tags: ['joke', 'crazy', 'winking'] },
      { char: '🤪', name: 'zany', tags: ['crazy', 'wild', 'goofy'] },
      { char: '🤨', name: 'raised_eyebrow', tags: ['skeptic', 'sus', 'doubt'] },
      { char: '🧐', name: 'monocle', tags: ['thinking', 'classy', 'inspect'] },
      { char: '🤓', name: 'nerd', tags: ['geek', 'glasses', 'smart'] },
      { char: '😎', name: 'sunglasses', tags: ['cool', 'shades'] },
      { char: '🥸', name: 'disguise', tags: ['mustache', 'incognito'] },
      { char: '🤩', name: 'star_struck', tags: ['eyes', 'stars', 'amazed'] },
      { char: '🥳', name: 'partying', tags: ['party', 'celebrate', 'hat'] },
      { char: '😏', name: 'smirk', tags: ['flirt', 'smug'] },
      { char: '😒', name: 'unamused', tags: ['meh', 'annoyed', 'bored'] },
      { char: '😞', name: 'disappointed', tags: ['sad', 'down'] },
      { char: '😔', name: 'pensive', tags: ['sad', 'reflective'] },
      { char: '😟', name: 'worried', tags: ['concern', 'nervous'] },
      { char: '😕', name: 'confused', tags: ['puzzled', 'doubt'] },
      { char: '🙁', name: 'slight_frown', tags: ['sad'] },
      { char: '☹️', name: 'frowning', tags: ['unhappy', 'sad'] },
      { char: '😣', name: 'persevere', tags: ['struggle', 'trying'] },
      { char: '😖', name: 'confounded', tags: ['distressed'] },
      { char: '😫', name: 'tired_face', tags: ['exhausted', 'ugh'] },
      { char: '😩', name: 'weary', tags: ['tired', 'frustrated'] },
      { char: '🥺', name: 'pleading', tags: ['puppy_eyes', 'beg', 'please', 'cute'] },
      { char: '😢', name: 'cry', tags: ['tear', 'sad', 'mourn'] },
      { char: '😭', name: 'sob', tags: ['crying', 'tears', 'bawling', 'sad'] },
      { char: '😤', name: 'triumph', tags: ['proud', 'steam', 'frustrated'] },
      { char: '😠', name: 'angry', tags: ['mad', 'annoyed'] },
      { char: '😡', name: 'rage', tags: ['furious', 'red', 'angry'] },
      { char: '🤬', name: 'swearing', tags: ['curse', 'mad', 'censor'] },
      { char: '🤯', name: 'exploding_head', tags: ['mindblown', 'shock', 'boom'] },
      { char: '😳', name: 'flushed', tags: ['embarrassed', 'blush', 'shock'] },
      { char: '🥵', name: 'hot_face', tags: ['heat', 'sweat', 'summer'] },
      { char: '🥶', name: 'cold_face', tags: ['freezing', 'ice', 'winter'] },
      { char: '😱', name: 'scream', tags: ['shock', 'horror', 'fear'] },
      { char: '😨', name: 'fearful', tags: ['scared', 'nervous'] },
      { char: '😰', name: 'anxious', tags: ['cold_sweat', 'nervous'] },
      { char: '😥', name: 'sad_relieved', tags: ['phew', 'sweat'] },
      { char: '😓', name: 'downcast_sweat', tags: ['tired'] },
      { char: '🤗', name: 'hugs', tags: ['hug', 'warmth', 'welcome'] },
      { char: '🤔', name: 'thinking', tags: ['ponder', 'wonder', 'hmmm'] },
      { char: '🤭', name: 'hand_over_mouth', tags: ['oops', 'giggle'] },
      { char: '🤫', name: 'shushing', tags: ['quiet', 'secret', 'shh'] },
      { char: '🤥', name: 'lying_face', tags: ['pinocchio', 'lie'] },
      { char: '😶', name: 'no_mouth', tags: ['silent', 'speechless'] },
      { char: '😐', name: 'neutral_face', tags: ['blank', 'indifferent'] },
      { char: '😑', name: 'expressionless', tags: ['unimpressed'] },
      { char: '😬', name: 'grimacing', tags: ['awkward', 'cringe', 'yikes'] },
      { char: '🙄', name: 'rolling_eyes', tags: ['eye_roll', 'whatever'] },
      { char: '😯', name: 'hushed', tags: ['surprised', 'oh'] },
      { char: '😦', name: 'frowning_open_mouth', tags: ['gasp'] },
      { char: '😮', name: 'open_mouth', tags: ['surprise', 'wow'] },
      { char: '😲', name: 'astonished', tags: ['shock', 'amazed'] },
      { char: '🥱', name: 'yawning', tags: ['bored', 'tired', 'sleepy'] },
      { char: '😴', name: 'sleeping', tags: ['zzz', 'bed', 'sleep'] },
      { char: '🤤', name: 'drooling', tags: ['hungry', 'sleepy'] },
      { char: '😪', name: 'sleepy', tags: ['tired'] },
      { char: '😵', name: 'dizzy_face', tags: ['ko', 'knockout'] },
      { char: '🤐', name: 'zipper_mouth', tags: ['shut', 'secret'] },
      { char: '🥴', name: 'woozy', tags: ['drunk', 'dizzy'] },
      { char: '🤢', name: 'nauseated', tags: ['sick', 'green'] },
      { char: '🤮', name: 'vomiting', tags: ['puke', 'gross'] },
      { char: '🤧', name: 'sneezing', tags: ['sick', 'tissue'] },
      { char: '😷', name: 'mask', tags: ['sick', 'doctor'] },
      { char: '🤒', name: 'thermometer', tags: ['sick', 'fever'] },
      { char: '🤕', name: 'head_bandage', tags: ['hurt', 'injured'] },
      { char: '🤑', name: 'money_face', tags: ['rich', 'cash', 'dollar'] },
      { char: '🤠', name: 'cowboy', tags: ['hat', 'western'] },
      { char: '😈', name: 'smiling_imp', tags: ['devil', 'evil'] },
      { char: '👿', name: 'imp', tags: ['devil', 'angry'] },
      { char: '👹', name: 'ogre', tags: ['monster', 'japan'] },
      { char: '👺', name: 'goblin', tags: ['tengu'] },
      { char: '🤡', name: 'clown', tags: ['circus', 'fool'] },
      { char: '💩', name: 'poop', tags: ['turd', 'shit', 'crap'] },
      { char: '👻', name: 'ghost', tags: ['spooky', 'halloween', 'boo'] },
      { char: '💀', name: 'skull', tags: ['dead', 'skeleton', 'danger', 'rip'] },
      { char: '☠️', name: 'skull_crossbones', tags: ['poison', 'danger', 'pirate'] },
      { char: '👽', name: 'alien', tags: ['ufo', 'extraterrestrial'] },
      { char: '👾', name: 'space_invader', tags: ['retro', 'game', 'arcade'] },
      { char: '🤖', name: 'robot', tags: ['bot', 'ai', 'machine'] },
      { char: '🎃', name: 'jack_o_lantern', tags: ['pumpkin', 'halloween'] }
    ]
  },
  {
    id: 'people',
    name: 'People & Body',
    icon: '👋',
    emojis: [
      { char: '👋', name: 'wave', tags: ['hello', 'bye', 'hi'] },
      { char: '🤚', name: 'raised_back_of_hand', tags: ['hand'] },
      { char: '🖐️', name: 'raised_hand_fingers', tags: ['hand', 'five'] },
      { char: '✋', name: 'raised_hand', tags: ['stop', 'highfive'] },
      { char: '🖖', name: 'vulcan', tags: ['spock', 'star_trek'] },
      { char: '👌', name: 'ok_hand', tags: ['perfect', 'good'] },
      { char: '🤌', name: 'pinched_fingers', tags: ['italian', 'gesture'] },
      { char: '🤏', name: 'pinching_hand', tags: ['little', 'small'] },
      { char: '✌️', name: 'peace', tags: ['victory', 'v'] },
      { char: '🤞', name: 'crossed_fingers', tags: ['luck', 'hope'] },
      { char: '🫰', name: 'finger_heart', tags: ['kpop', 'love'] },
      { char: '🤟', name: 'love_you_gesture', tags: ['ily', 'rock'] },
      { char: '🤘', name: 'metal', tags: ['rock_on', 'horns'] },
      { char: '🤙', name: 'call_me', tags: ['shaka', 'phone'] },
      { char: '👈', name: 'point_left', tags: ['left'] },
      { char: '👉', name: 'point_right', tags: ['right'] },
      { char: '👆', name: 'point_up', tags: ['up', 'this'] },
      { char: '🖕', name: 'middle_finger', tags: ['fu'] },
      { char: '👇', name: 'point_down', tags: ['down', 'below'] },
      { char: '☝️', name: 'index_pointing_up', tags: ['one', 'first'] },
      { char: '👍', name: 'thumbs_up', tags: ['yes', 'agree', 'like', 'approve'] },
      { char: '👎', name: 'thumbs_down', tags: ['no', 'dislike'] },
      { char: '✊', name: 'fist', tags: ['power', 'strength'] },
      { char: '👊', name: 'punch', tags: ['fist_bump'] },
      { char: '🤛', name: 'left_facing_fist', tags: ['bump'] },
      { char: '🤜', name: 'right_facing_fist', tags: ['bump'] },
      { char: '👏', name: 'clap', tags: ['applause', 'bravo', 'congrats'] },
      { char: '🙌', name: 'raised_hands', tags: ['celebrate', 'hooray'] },
      { char: '👐', name: 'open_hands', tags: ['hug'] },
      { char: '🤲', name: 'palms_up', tags: ['prayer', 'cupped'] },
      { char: '🤝', name: 'handshake', tags: ['deal', 'agreement', 'partner'] },
      { char: '🙏', name: 'pray', tags: ['please', 'thanks', 'namaste', 'hope'] },
      { char: '✍️', name: 'writing_hand', tags: ['write', 'pen'] },
      { char: '💅', name: 'nail_polish', tags: ['slay', 'beauty', 'care'] },
      { char: '🤳', name: 'selfie', tags: ['phone', 'photo'] },
      { char: '💪', name: 'muscle', tags: ['flex', 'strong', 'gym', 'bicep'] },
      { char: '🦾', name: 'mechanical_arm', tags: ['cyborg', 'robot'] },
      { char: '👀', name: 'eyes', tags: ['look', 'see', 'peek', 'sus'] },
      { char: '👁️', name: 'eye', tags: ['watch', 'vision'] },
      { char: '👅', name: 'tongue', tags: ['taste', 'mouth'] },
      { char: '👄', name: 'lips', tags: ['kiss', 'mouth'] },
      { char: '💋', name: 'kiss_mark', tags: ['lipstick', 'love'] },
      { char: '🧠', name: 'brain', tags: ['smart', 'think', 'mind', 'intellect'] }
    ]
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    icon: '🐶',
    emojis: [
      { char: '🐶', name: 'dog', tags: ['puppy', 'pet', 'canine'] },
      { char: '🐱', name: 'cat', tags: ['kitty', 'pet', 'meow'] },
      { char: '🐭', name: 'mouse', tags: ['rodent'] },
      { char: '🐹', name: 'hamster', tags: ['pet'] },
      { char: '🐰', name: 'rabbit', tags: ['bunny'] },
      { char: '🦊', name: 'fox', tags: ['clever', 'wild'] },
      { char: '🐻', name: 'bear', tags: ['grizzly'] },
      { char: '🐼', name: 'panda', tags: ['cute'] },
      { char: '🐨', name: 'koala', tags: ['australia'] },
      { char: '🐯', name: 'tiger', tags: ['wild'] },
      { char: '🦁', name: 'lion', tags: ['king'] },
      { char: '🐮', name: 'cow', tags: ['moo'] },
      { char: '🐷', name: 'pig', tags: ['oink'] },
      { char: '🐸', name: 'frog', tags: ['pepe', 'ribbit', 'toad'] },
      { char: '🐵', name: 'monkey', tags: ['ape', 'chimp'] },
      { char: '🐔', name: 'chicken', tags: ['bird'] },
      { char: '🐧', name: 'penguin', tags: ['bird', 'ice'] },
      { char: '🐦', name: 'bird', tags: ['fly'] },
      { char: '🐤', name: 'baby_chick', tags: ['cute'] },
      { char: '🦆', name: 'duck', tags: ['quack'] },
      { char: '🦅', name: 'eagle', tags: ['bird'] },
      { char: '🦉', name: 'owl', tags: ['wise'] },
      { char: '🦇', name: 'bat', tags: ['spooky'] },
      { char: '🐺', name: 'wolf', tags: ['howl'] },
      { char: '🦄', name: 'unicorn', tags: ['magic', 'fantasy'] },
      { char: '🐝', name: 'bee', tags: ['honey', 'insect'] },
      { char: '🐛', name: 'bug', tags: ['caterpillar'] },
      { char: '🦋', name: 'butterfly', tags: ['beauty'] },
      { char: '🐌', name: 'snail', tags: ['slow'] },
      { char: '🐞', name: 'ladybug', tags: ['beetle'] },
      { char: '🐢', name: 'turtle', tags: ['slow'] },
      { char: '🐍', name: 'snake', tags: ['reptile'] },
      { char: '🐙', name: 'octopus', tags: ['tentacles'] },
      { char: '🦑', name: 'squid', tags: ['sea'] },
      { char: '🦐', name: 'shrimp', tags: ['prawn'] },
      { char: '🦀', name: 'crab', tags: ['crustacean'] },
      { char: '🐡', name: 'blowfish', tags: ['fish'] },
      { char: '🐠', name: 'tropical_fish', tags: ['sea'] },
      { char: '🐟', name: 'fish', tags: ['swim'] },
      { char: '🐬', name: 'dolphin', tags: ['sea'] },
      { char: '🐳', name: 'whale', tags: ['ocean'] },
      { char: '🦈', name: 'shark', tags: ['ocean'] },
      { char: '🐊', name: 'crocodile', tags: ['alligator'] },
      { char: '🌲', name: 'tree', tags: ['pine', 'forest'] },
      { char: '🌱', name: 'seedling', tags: ['sprout', 'grow', 'plant'] },
      { char: '🌿', name: 'herb', tags: ['plant', 'leaf'] },
      { char: '☘️', name: 'shamrock', tags: ['clover', 'luck'] },
      { char: '🍀', name: 'four_leaf_clover', tags: ['lucky', 'fortune'] },
      { char: '🍁', name: 'maple_leaf', tags: ['autumn', 'canada'] },
      { char: '🍄', name: 'mushroom', tags: ['fungus'] },
      { char: '🌸', name: 'cherry_blossom', tags: ['flower', 'sakura', 'pink'] },
      { char: '🌹', name: 'rose', tags: ['flower', 'love', 'red'] },
      { char: '🌻', name: 'sunflower', tags: ['flower', 'summer'] },
      { char: '🌞', name: 'sun_face', tags: ['sunny', 'warm'] },
      { char: '⭐', name: 'star', tags: ['shine', 'gold', 'rating'] },
      { char: '🌟', name: 'glowing_star', tags: ['sparkle'] },
      { char: '✨', name: 'sparkles', tags: ['magic', 'shine', 'clean', 'special'] },
      { char: '⚡', name: 'zap', tags: ['lightning', 'thunder', 'fast', 'electric'] },
      { char: '🔥', name: 'fire', tags: ['flame', 'lit', 'hot', 'hype'] },
      { char: '🌈', name: 'rainbow', tags: ['pride', 'colors'] },
      { char: '☀️', name: 'sunny', tags: ['weather', 'bright'] },
      { char: '⛅', name: 'partly_cloudy', tags: ['weather'] },
      { char: '🌧️', name: 'rain', tags: ['weather', 'drops'] },
      { char: '❄️', name: 'snowflake', tags: ['cold', 'snow', 'winter'] },
      { char: '🌊', name: 'wave_water', tags: ['ocean', 'sea', 'surf'] }
    ]
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍕',
    emojis: [
      { char: '🍏', name: 'green_apple', tags: ['fruit'] },
      { char: '🍎', name: 'apple', tags: ['fruit', 'red'] },
      { char: '🍐', name: 'pear', tags: ['fruit'] },
      { char: '🍊', name: 'tangerine', tags: ['orange', 'citrus'] },
      { char: '🍋', name: 'lemon', tags: ['citrus', 'sour'] },
      { char: '🍌', name: 'banana', tags: ['fruit', 'yellow'] },
      { char: '🍉', name: 'watermelon', tags: ['summer', 'melon'] },
      { char: '🍇', name: 'grapes', tags: ['fruit', 'wine'] },
      { char: '🍓', name: 'strawberry', tags: ['fruit', 'berry'] },
      { char: '🫐', name: 'blueberries', tags: ['berry'] },
      { char: '🍒', name: 'cherries', tags: ['fruit'] },
      { char: '🍑', name: 'peach', tags: ['fruit', 'booty'] },
      { char: '🥭', name: 'mango', tags: ['fruit'] },
      { char: '🍍', name: 'pineapple', tags: ['tropical'] },
      { char: '🥥', name: 'coconut', tags: ['tropical'] },
      { char: '🥑', name: 'avocado', tags: ['guacamole'] },
      { char: '🍆', name: 'eggplant', tags: ['aubergine'] },
      { char: '🌽', name: 'corn', tags: ['maize'] },
      { char: '🌶️', name: 'hot_pepper', tags: ['spicy', 'chili'] },
      { char: '🥐', name: 'croissant', tags: ['pastry', 'french', 'bread'] },
      { char: '🍞', name: 'bread', tags: ['toast', 'loaf'] },
      { char: '🥖', name: 'baguette', tags: ['french', 'bread'] },
      { char: '🥨', name: 'pretzel', tags: ['snack'] },
      { char: '🧀', name: 'cheese', tags: ['cheddar'] },
      { char: '🥩', name: 'meat', tags: ['steak', 'beef'] },
      { char: '🍗', name: 'poultry_leg', tags: ['chicken', 'drumstick'] },
      { char: '🥓', name: 'bacon', tags: ['pork', 'breakfast'] },
      { char: '🍔', name: 'hamburger', tags: ['burger', 'fastfood'] },
      { char: '🍟', name: 'fries', tags: ['french_fries', 'potato'] },
      { char: '🍕', name: 'pizza', tags: ['slice', 'cheese'] },
      { char: '🌭', name: 'hotdog', tags: ['frankfurter'] },
      { char: '🥪', name: 'sandwich', tags: ['lunch'] },
      { char: '🌮', name: 'taco', tags: ['mexican'] },
      { char: '🌯', name: 'burrito', tags: ['mexican', 'wrap'] },
      { char: '🥗', name: 'salad', tags: ['healthy', 'green'] },
      { char: '🍝', name: 'spaghetti', tags: ['pasta', 'italian'] },
      { char: '🍜', name: 'ramen', tags: ['noodles', 'soup'] },
      { char: '🍲', name: 'stew', tags: ['soup', 'pot'] },
      { char: '🍛', name: 'curry', tags: ['rice', 'indian'] },
      { char: '🍣', name: 'sushi', tags: ['japanese', 'fish'] },
      { char: '🍱', name: 'bento', tags: ['japanese', 'lunch'] },
      { char: '🥟', name: 'dumpling', tags: ['gyoza', 'dimsum'] },
      { char: '🍤', name: 'fried_shrimp', tags: ['tempura'] },
      { char: '🍙', name: 'rice_ball', tags: ['onigiri'] },
      { char: '🍚', name: 'rice', tags: ['bowl'] },
      { char: '🍰', name: 'shortcake', tags: ['cake', 'dessert'] },
      { char: '🎂', name: 'birthday_cake', tags: ['party', 'celebrate'] },
      { char: '🧁', name: 'cupcake', tags: ['sweet', 'baking'] },
      { char: '🥧', name: 'pie', tags: ['baking'] },
      { char: '🍦', name: 'ice_cream', tags: ['soft_serve'] },
      { char: '🍧', name: 'shaved_ice', tags: ['dessert'] },
      { char: '🍨', name: 'icecream', tags: ['dessert'] },
      { char: '🍩', name: 'doughnut', tags: ['donut', 'sweet'] },
      { char: '🍪', name: 'cookie', tags: ['chocolate_chip', 'biscuit'] },
      { char: '🍫', name: 'chocolate_bar', tags: ['candy', 'sweet'] },
      { char: '🍬', name: 'candy', tags: ['sweet'] },
      { char: '🍭', name: 'lollipop', tags: ['candy'] },
      { char: '🍿', name: 'popcorn', tags: ['movie', 'snack'] },
      { char: '☕', name: 'coffee', tags: ['cafe', 'espresso', 'caffeine'] },
      { char: '🍵', name: 'tea', tags: ['green_tea', 'matcha'] },
      { char: '🧃', name: 'juice_box', tags: ['drink'] },
      { char: '🧋', name: 'boba', tags: ['bubble_tea', 'milk_tea'] },
      { char: '🥤', name: 'cup_with_straw', tags: ['soda'] },
      { char: '🍺', name: 'beer', tags: ['drink', 'pub', 'cheers'] },
      { char: '🍻', name: 'beers', tags: ['cheers', 'toast'] },
      { char: '🍷', name: 'wine_glass', tags: ['drink', 'alcohol'] },
      { char: '🍸', name: 'cocktail', tags: ['martini'] },
      { char: '🍹', name: 'tropical_drink', tags: ['cocktail'] },
      { char: '🍾', name: 'champagne', tags: ['sparkling', 'celebrate'] },
      { char: '🧊', name: 'ice_cube', tags: ['cold'] }
    ]
  },
  {
    id: 'activities',
    name: 'Activities & Gaming',
    icon: '⚽',
    emojis: [
      { char: '⚽', name: 'soccer', tags: ['football', 'ball', 'sports'] },
      { char: '🏀', name: 'basketball', tags: ['ball', 'nba'] },
      { char: '🏈', name: 'american_football', tags: ['nfl'] },
      { char: '⚾', name: 'baseball', tags: ['ball'] },
      { char: '🎾', name: 'tennis', tags: ['racket'] },
      { char: '🏐', name: 'volleyball', tags: ['ball'] },
      { char: '🎱', name: '8ball', tags: ['pool', 'billiards'] },
      { char: '🏓', name: 'ping_pong', tags: ['table_tennis'] },
      { char: '🏸', name: 'badminton', tags: ['racket'] },
      { char: '🥊', name: 'boxing_glove', tags: ['fight', 'punch'] },
      { char: '🥋', name: 'martial_arts_uniform', tags: ['karate', 'judo'] },
      { char: '🎯', name: 'dart', tags: ['target', 'bullseye'] },
      { char: '⛳', name: 'golf', tags: ['hole'] },
      { char: '🛹', name: 'skateboard', tags: ['skate'] },
      { char: '🛼', name: 'roller_skate', tags: ['skating'] },
      { char: '🏆', name: 'trophy', tags: ['winner', 'first', 'champion', 'cup'] },
      { char: '🥇', name: 'first_place', tags: ['gold', 'winner'] },
      { char: '🥈', name: 'second_place', tags: ['silver'] },
      { char: '🥉', name: 'third_place', tags: ['bronze'] },
      { char: '🏅', name: 'medal', tags: ['award'] },
      { char: '🎪', name: 'circus_tent', tags: ['festival'] },
      { char: '🎨', name: 'art', tags: ['palette', 'painting', 'draw'] },
      { char: '🎬', name: 'clapper', tags: ['movie', 'film', 'cinema'] },
      { char: '🎤', name: 'microphone', tags: ['sing', 'karaoke'] },
      { char: '🎧', name: 'headphones', tags: ['music', 'listen', 'audio'] },
      { char: '🎼', name: 'musical_score', tags: ['music'] },
      { char: '🎹', name: 'piano', tags: ['keyboard', 'music'] },
      { char: '🥁', name: 'drum', tags: ['music'] },
      { char: '🎷', name: 'saxophone', tags: ['jazz', 'music'] },
      { char: '🎺', name: 'trumpet', tags: ['brass', 'music'] },
      { char: '🎸', name: 'guitar', tags: ['rock', 'music'] },
      { char: '🎻', name: 'violin', tags: ['classical', 'music'] },
      { char: '🎲', name: 'dice', tags: ['game', 'random', 'roll'] },
      { char: '♟️', name: 'chess_pawn', tags: ['chess', 'boardgame'] },
      { char: '🎳', name: 'bowling', tags: ['strike'] },
      { char: '🎮', name: 'video_game', tags: ['controller', 'gamer', 'play', 'console'] },
      { char: '🎰', name: 'slot_machine', tags: ['casino', 'gamble', '777'] },
      { char: '🧩', name: 'jigsaw', tags: ['puzzle', 'piece'] }
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: '🚀',
    emojis: [
      { char: '🚗', name: 'car', tags: ['automobile', 'drive'] },
      { char: '🚕', name: 'taxi', tags: ['cab'] },
      { char: '🚙', name: 'suv', tags: ['car'] },
      { char: '🚌', name: 'bus', tags: ['transit'] },
      { char: '🏎️', name: 'racing_car', tags: ['f1', 'speed'] },
      { char: '🚓', name: 'police_car', tags: ['cop'] },
      { char: '🚑', name: 'ambulance', tags: ['hospital'] },
      { char: '🚒', name: 'fire_engine', tags: ['firetruck'] },
      { char: '🚲', name: 'bicycle', tags: ['bike'] },
      { char: '🛵', name: 'scooter', tags: ['moped'] },
      { char: '🏍️', name: 'motorcycle', tags: ['bike'] },
      { char: '🚨', name: 'police_beacon', tags: ['siren', 'emergency', 'alert'] },
      { char: '🚆', name: 'train', tags: ['railway'] },
      { char: '✈️', name: 'airplane', tags: ['flight', 'travel'] },
      { char: '🛫', name: 'flight_departure', tags: ['takeoff'] },
      { char: '🛬', name: 'flight_arrival', tags: ['landing'] },
      { char: '🚀', name: 'rocket', tags: ['space', 'launch', 'moon', 'fast'] },
      { char: '🛸', name: 'ufo', tags: ['flying_saucer', 'alien'] },
      { char: '🚁', name: 'helicopter', tags: ['copter'] },
      { char: '⛵', name: 'sailboat', tags: ['boat'] },
      { char: '🚢', name: 'ship', tags: ['cruise', 'boat'] },
      { char: '⚓', name: 'anchor', tags: ['nautical'] },
      { char: '⛽', name: 'fuelpump', tags: ['gas', 'petrol'] },
      { char: '🚦', name: 'traffic_light', tags: ['signal'] },
      { char: '🛑', name: 'stop_sign', tags: ['halt', 'red'] },
      { char: '🗺️', name: 'map', tags: ['world', 'travel'] },
      { char: '🗿', name: 'moai', tags: ['easter_island', 'stone', 'chad', 'statue'] },
      { char: '🗽', name: 'statue_of_liberty', tags: ['nyc', 'america'] },
      { char: '🗼', name: 'tokyo_tower', tags: ['japan'] },
      { char: '🏰', name: 'castle', tags: ['fortress'] },
      { char: '🎡', name: 'ferris_wheel', tags: ['fair', 'park'] },
      { char: '🎢', name: 'roller_coaster', tags: ['park'] },
      { char: '🏖️', name: 'beach', tags: ['sand', 'vacation', 'ocean'] },
      { char: '🏝️', name: 'desert_island', tags: ['tropical'] },
      { char: '🌋', name: 'volcano', tags: ['lava', 'eruption'] },
      { char: '⛰️', name: 'mountain', tags: ['climb'] },
      { char: '🏕️', name: 'camping', tags: ['tent', 'outdoor'] },
      { char: '🏠', name: 'house', tags: ['home'] },
      { char: '🏢', name: 'office_building', tags: ['city'] }
    ]
  },
  {
    id: 'objects',
    name: 'Objects & Symbols',
    icon: '💡',
    emojis: [
      { char: '💡', name: 'bulb', tags: ['light', 'idea', 'bright'] },
      { char: '🔦', name: 'flashlight', tags: ['torch'] },
      { char: '🕯️', name: 'candle', tags: ['flame'] },
      { char: '🪙', name: 'coin', tags: ['money', 'gold'] },
      { char: '💵', name: 'dollar', tags: ['cash', 'money'] },
      { char: '💳', name: 'credit_card', tags: ['payment'] },
      { char: '💎', name: 'gem', tags: ['diamond', 'crystal', 'shiny'] },
      { char: '📦', name: 'package', tags: ['box', 'parcel'] },
      { char: '📬', name: 'mailbox', tags: ['post', 'mail'] },
      { char: '✉️', name: 'envelope', tags: ['email', 'letter'] },
      { char: '📊', name: 'chart', tags: ['graph', 'stats'] },
      { char: '📈', name: 'chart_up', tags: ['stonks', 'growth'] },
      { char: '📉', name: 'chart_down', tags: ['not_stonks', 'fall'] },
      { char: '📅', name: 'calendar', tags: ['date', 'schedule'] },
      { char: '📁', name: 'folder', tags: ['directory'] },
      { char: '📰', name: 'newspaper', tags: ['news'] },
      { char: '📖', name: 'book', tags: ['read'] },
      { char: '🔖', name: 'bookmark', tags: ['save'] },
      { char: '🔗', name: 'link', tags: ['url'] },
      { char: '📌', name: 'pushpin', tags: ['pin'] },
      { char: '📍', name: 'round_pushpin', tags: ['location'] },
      { char: '✂️', name: 'scissors', tags: ['cut'] },
      { char: '🖊️', name: 'pen', tags: ['write'] },
      { char: '📝', name: 'memo', tags: ['note', 'document'] },
      { char: '🔍', name: 'search', tags: ['magnifying_glass', 'find'] },
      { char: '🔒', name: 'lock', tags: ['security', 'private'] },
      { char: '🔓', name: 'unlock', tags: ['open'] },
      { char: '🔑', name: 'key', tags: ['password', 'secret'] },
      { char: '🔔', name: 'bell', tags: ['notification', 'alert', 'ring'] },
      { char: '🔕', name: 'bell_slash', tags: ['mute', 'silent'] },
      { char: '📢', name: 'loudspeaker', tags: ['announce', 'shout'] },
      { char: '💬', name: 'speech_balloon', tags: ['chat', 'message'] },
      { char: '💭', name: 'thought_balloon', tags: ['thinking'] },
      { char: '❤️', name: 'heart', tags: ['love', 'red_heart', 'like'] },
      { char: '🧡', name: 'orange_heart', tags: ['love'] },
      { char: '💛', name: 'yellow_heart', tags: ['love'] },
      { char: '💚', name: 'green_heart', tags: ['love'] },
      { char: '💙', name: 'blue_heart', tags: ['love'] },
      { char: '💜', name: 'purple_heart', tags: ['love'] },
      { char: '🖤', name: 'black_heart', tags: ['dark', 'love'] },
      { char: '🤍', name: 'white_heart', tags: ['pure', 'love'] },
      { char: '🤎', name: 'brown_heart', tags: ['love'] },
      { char: '💔', name: 'broken_heart', tags: ['breakup', 'sad'] },
      { char: '❤️‍🔥', name: 'heart_on_fire', tags: ['passion'] },
      { char: '💖', name: 'sparkling_heart', tags: ['love', 'glitter'] },
      { char: '💯', name: '100', tags: ['hundred', 'perfect', 'score'] },
      { char: '💢', name: 'anger_symbol', tags: ['mad', 'anime'] },
      { char: '💥', name: 'collision', tags: ['boom', 'blast', 'explosion'] },
      { char: '💤', name: 'zzz', tags: ['sleep', 'tired'] },
      { char: '⚠️', name: 'warning', tags: ['alert', 'caution'] },
      { char: '⛔', name: 'no_entry', tags: ['stop', 'forbidden'] },
      { char: '🚫', name: 'prohibited', tags: ['forbidden', 'ban'] },
      { char: '✅', name: 'check_mark', tags: ['done', 'yes', 'correct', 'ok'] },
      { char: '❌', name: 'cross_mark', tags: ['no', 'wrong', 'fail'] },
      { char: '❓', name: 'question', tags: ['help', 'what'] },
      { char: '❗', name: 'exclamation', tags: ['alert', 'important'] }
    ]
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: '🏁',
    emojis: [
      { char: '🏁', name: 'chequered_flag', tags: ['race', 'finish'] },
      { char: '🚩', name: 'triangular_flag', tags: ['red_flag', 'mark'] },
      { char: '🎌', name: 'crossed_flags', tags: ['japan'] },
      { char: '🏴‍☠️', name: 'pirate_flag', tags: ['skull', 'jolly_roger'] },
      { char: '🏳️‍🌈', name: 'rainbow_flag', tags: ['pride', 'lgbt'] },
      { char: '🏳️‍⚧️', name: 'transgender_flag', tags: ['pride'] },
      { char: '🇺🇸', name: 'flag_us', tags: ['usa', 'america', 'united_states'] },
      { char: '🇬🇧', name: 'flag_gb', tags: ['uk', 'britain', 'england'] },
      { char: '🇨🇦', name: 'flag_ca', tags: ['canada'] },
      { char: '🇦🇺', name: 'flag_au', tags: ['australia'] },
      { char: '🇯🇵', name: 'flag_jp', tags: ['japan'] },
      { char: '🇩🇪', name: 'flag_de', tags: ['germany'] },
      { char: '🇫🇷', name: 'flag_fr', tags: ['france'] },
      { char: '🇮🇹', name: 'flag_it', tags: ['italy'] },
      { char: '🇪🇸', name: 'flag_es', tags: ['spain'] },
      { char: '🇧🇷', name: 'flag_br', tags: ['brazil'] },
      { char: '🇲🇽', name: 'flag_mx', tags: ['mexico'] },
      { char: '🇰🇷', name: 'flag_kr', tags: ['korea'] },
      { char: '🇨🇳', name: 'flag_cn', tags: ['china'] },
      { char: '🇮🇳', name: 'flag_in', tags: ['india'] },
      { char: '🇷🇺', name: 'flag_ru', tags: ['russia'] },
      { char: '🇮🇩', name: 'flag_id', tags: ['indonesia'] },
      { char: '🇸🇬', name: 'flag_sg', tags: ['singapore'] },
      { char: '🇵🇭', name: 'flag_ph', tags: ['philippines'] },
      { char: '🇻🇳', name: 'flag_vn', tags: ['vietnam'] },
      { char: '🇹🇭', name: 'flag_th', tags: ['thailand'] },
      { char: '🇲🇾', name: 'flag_my', tags: ['malaysia'] }
    ]
  }
];

const RECENT_EMOJIS_KEY = 'voiceline_recent_emojis';
const DEFAULT_RECENT_EMOJIS = ['😂', '❤️', '🔥', '👍', '✨', '💀', '🥺', '😊', '🚀', '🎉', '👀', '💯', '🙏', '😭', '😍', '👏'];

function loadRecentEmojis() {
  try {
    const raw = localStorage.getItem(RECENT_EMOJIS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...DEFAULT_RECENT_EMOJIS];
}

function saveRecentEmoji(emojiChar) {
  try {
    let recent = loadRecentEmojis();
    recent = [emojiChar, ...recent.filter(e => e !== emojiChar)].slice(0, 24);
    localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(recent));
  } catch (e) {}
}

function findEmojiMeta(emojiChar) {
  for (const cat of EMOJI_CATEGORIES) {
    const found = cat.emojis.find(e => e.char === emojiChar);
    if (found) return found;
  }
  return { char: emojiChar, name: 'emoji', tags: [] };
}

function insertEmojiAtCursor(inputEl, emojiChar) {
  if (!inputEl) return;
  const start = (typeof inputEl.selectionStart === 'number') ? inputEl.selectionStart : inputEl.value.length;
  const end = (typeof inputEl.selectionEnd === 'number') ? inputEl.selectionEnd : inputEl.value.length;
  const val = inputEl.value;
  inputEl.value = val.substring(0, start) + emojiChar + val.substring(end);
  const newPos = start + emojiChar.length;
  inputEl.setSelectionRange(newPos, newPos);
  inputEl.focus();
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
}

function bindEmojiPickerControls() {
  const popover = document.getElementById('emojiPickerPopover');
  const chatEmojiBtn = document.getElementById('chatEmojiBtn');
  const dmChatEmojiBtn = document.getElementById('dmChatEmojiBtn');
  const searchInput = document.getElementById('emojiSearchInput');
  const searchClearBtn = document.getElementById('emojiSearchClearBtn');
  const categoryNav = document.getElementById('emojiCategoryNav');
  const scrollArea = document.getElementById('emojiScrollArea');
  const previewIcon = document.getElementById('emojiPreviewIcon');
  const previewName = document.getElementById('emojiPreviewName');

  if (!popover || !scrollArea) return;

  let activeTriggerBtn = null;
  let activeTargetInput = null;
  let isClosing = false;

  function positionPopover(triggerBtn) {
    if (!popover || !triggerBtn) return;
    const rect = triggerBtn.getBoundingClientRect();
    const popWidth = Math.min(380, window.innerWidth - 24);
    const popHeight = Math.min(440, window.innerHeight - 120);

    let right = window.innerWidth - rect.right;
    let bottom = window.innerHeight - rect.top + 8;

    if (right < 12) right = 12;
    if (right + popWidth > window.innerWidth - 12) right = window.innerWidth - popWidth - 12;
    if (bottom + popHeight > window.innerHeight - 12) {
      bottom = window.innerHeight - popHeight - 12;
    }

    popover.style.right = `${Math.max(8, right)}px`;
    popover.style.bottom = `${Math.max(8, bottom)}px`;
  }

  function renderPickerContent(filterQuery = '') {
    scrollArea.innerHTML = '';
    const query = filterQuery.trim().toLowerCase();

    if (query) {
      // Filter across all categories
      const matching = [];
      const seen = new Set();

      for (const cat of EMOJI_CATEGORIES) {
        if (cat.id === 'recent') continue;
        for (const item of cat.emojis) {
          if (seen.has(item.char)) continue;
          const matchName = item.name.toLowerCase().includes(query);
          const matchTag = item.tags.some(t => t.toLowerCase().includes(query));
          if (matchName || matchTag) {
            seen.add(item.char);
            matching.push(item);
          }
        }
      }

      const section = document.createElement('div');
      section.className = 'emoji-category-section';

      const header = document.createElement('div');
      header.className = 'emoji-category-header';
      header.textContent = `Search Results (${matching.length})`;
      section.appendChild(header);

      if (matching.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'emoji-empty-search';
        empty.innerHTML = `
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>No emojis found for "${escapeHtml(query)}"</span>
        `;
        section.appendChild(empty);
      } else {
        const grid = document.createElement('div');
        grid.className = 'emoji-category-grid';

        matching.forEach(item => {
          const btn = createEmojiButton(item);
          grid.appendChild(btn);
        });

        section.appendChild(grid);
      }

      scrollArea.appendChild(section);
      return;
    }

    // Normal full render with categories
    const recentChars = loadRecentEmojis();
    const recentItems = recentChars.map(findEmojiMeta);

    EMOJI_CATEGORIES.forEach(cat => {
      const items = (cat.id === 'recent') ? recentItems : cat.emojis;
      if (items.length === 0) return;

      const section = document.createElement('div');
      section.className = 'emoji-category-section';
      section.id = `emojiCatSection_${cat.id}`;
      section.setAttribute('data-category-id', cat.id);

      const header = document.createElement('div');
      header.className = 'emoji-category-header';
      header.textContent = cat.name.toUpperCase();
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'emoji-category-grid';

      items.forEach(item => {
        const btn = createEmojiButton(item);
        grid.appendChild(btn);
      });

      section.appendChild(grid);
      scrollArea.appendChild(section);
    });
  }

  function createEmojiButton(item) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-item-btn';
    btn.textContent = item.char;
    btn.setAttribute('data-char', item.char);
    btn.setAttribute('data-name', item.name);
    btn.setAttribute('title', `:${item.name}:`);

    btn.addEventListener('mouseenter', () => {
      if (previewIcon) previewIcon.textContent = item.char;
      if (previewName) previewName.textContent = `:${item.name}:`;
    });

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectEmoji(item.char);
    });

    return btn;
  }

  function selectEmoji(emojiChar) {
    saveRecentEmoji(emojiChar);
    if (activeTargetInput) {
      insertEmojiAtCursor(activeTargetInput, emojiChar);
    }
    // Re-render picker so recent updates immediately
    renderPickerContent(searchInput ? searchInput.value : '');
  }

  function openPicker(triggerBtn, targetInput) {
    const gifPopover = document.getElementById('gifPickerPopover');
    if (gifPopover && !gifPopover.classList.contains('hidden')) {
      gifPopover.classList.add('hidden');
      document.querySelectorAll('.chat-gif-btn').forEach(b => b.classList.remove('active'));
    }
    const stickerPopover = document.getElementById('stickerPickerPopover');
    if (stickerPopover && !stickerPopover.classList.contains('hidden')) {
      stickerPopover.classList.add('hidden');
      document.querySelectorAll('.chat-sticker-btn').forEach(b => b.classList.remove('active'));
    }

    activeTriggerBtn = triggerBtn;
    activeTargetInput = targetInput;
    if (activeTriggerBtn) activeTriggerBtn.classList.add('active');

    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.add('hidden');

    positionPopover(triggerBtn);
    renderPickerContent('');

    popover.classList.remove('hidden', 'is-closing');
    if (searchInput && window.innerWidth > 768) {
      setTimeout(() => searchInput.focus(), 50);
    }
  }

  function closePicker() {
    if (popover.classList.contains('hidden') || isClosing) return;

    if (document.body.classList.contains('no-animations')) {
      popover.classList.add('hidden');
      if (activeTriggerBtn) activeTriggerBtn.classList.remove('active');
      activeTriggerBtn = null;
      return;
    }

    isClosing = true;
    popover.classList.add('is-closing');
    if (activeTriggerBtn) activeTriggerBtn.classList.remove('active');

    const dur = (typeof currentAnimSettings !== 'undefined' && currentAnimSettings.enabled)
      ? Math.max(80, Math.min(5000, currentAnimSettings.durationMs))
      : 180;

    setTimeout(() => {
      popover.classList.add('hidden');
      popover.classList.remove('is-closing');
      isClosing = false;
      activeTriggerBtn = null;
    }, dur);
  }

  // Trigger button binds
  if (chatEmojiBtn) {
    chatEmojiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!popover.classList.contains('hidden') && activeTriggerBtn === chatEmojiBtn) {
        closePicker();
      } else {
        openPicker(chatEmojiBtn, messageInput);
      }
    });
  }

  if (dmChatEmojiBtn) {
    dmChatEmojiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!popover.classList.contains('hidden') && activeTriggerBtn === dmChatEmojiBtn) {
        closePicker();
      } else {
        openPicker(dmChatEmojiBtn, dmMessageInput);
      }
    });
  }

  // Search input events
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value;
      if (searchClearBtn) searchClearBtn.classList.toggle('hidden', !val);
      renderPickerContent(val);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.classList.add('hidden');
      renderPickerContent('');
    });
  }

  // Category navigation tabs
  if (categoryNav) {
    categoryNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.emoji-cat-nav-btn');
      if (!btn) return;
      const catId = btn.getAttribute('data-category');
      if (!catId) return;

      // Clear search if navigating categories
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
        renderPickerContent('');
      }

      categoryNav.querySelectorAll('.emoji-cat-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetSection = document.getElementById(`emojiCatSection_${catId}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Scroll spy on scrollArea to highlight category tab
  scrollArea.addEventListener('scroll', () => {
    if (searchInput && searchInput.value.trim()) return;
    const sections = scrollArea.querySelectorAll('.emoji-category-section');
    const scrollPos = scrollArea.scrollTop + 30;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        const catId = sec.getAttribute('data-category-id');
        if (catId && categoryNav) {
          categoryNav.querySelectorAll('.emoji-cat-nav-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-category') === catId);
          });
        }
      }
    });
  });

  // Reposition on window resize
  window.addEventListener('resize', () => {
    if (!popover.classList.contains('hidden') && activeTriggerBtn) {
      positionPopover(activeTriggerBtn);
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (popover.classList.contains('hidden')) return;
    if (popover.contains(e.target)) return;
    if (activeTriggerBtn && activeTriggerBtn.contains(e.target)) return;
    closePicker();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popover.classList.contains('hidden')) {
      closePicker();
      if (activeTargetInput) activeTargetInput.focus();
    }
  });
}

/* =======================================================
   17. DISCORD-STYLE GIPHY GIF PICKER SYSTEM
   ======================================================= */
function bindGifPickerControls() {
  const popover = document.getElementById('gifPickerPopover');
  const chatGifBtn = document.getElementById('chatGifBtn');
  const dmChatGifBtn = document.getElementById('dmChatGifBtn');
  const searchInput = document.getElementById('gifSearchInput');
  const searchClearBtn = document.getElementById('gifSearchClearBtn');
  const categoryPills = document.getElementById('gifCategoryPills');
  const scrollArea = document.getElementById('gifScrollArea');
  const gifGrid = document.getElementById('gifGrid');
  const loadingIndicator = document.getElementById('gifLoadingIndicator');
  const emptyState = document.getElementById('gifEmptyState');

  if (!popover || !gifGrid) return;

  let activeTriggerBtn = null;
  let activeGifContext = 'channel';
  let isClosing = false;
  let searchDebounceTimer = null;
  let currentQuery = 'trending';

  function positionPopover(triggerBtn) {
    if (!popover || !triggerBtn) return;
    const rect = triggerBtn.getBoundingClientRect();
    const popWidth = Math.min(420, window.innerWidth - 24);
    const popHeight = Math.min(480, window.innerHeight - 120);

    let right = window.innerWidth - rect.right;
    let bottom = window.innerHeight - rect.top + 8;

    if (right < 12) right = 12;
    if (right + popWidth > window.innerWidth - 12) right = window.innerWidth - popWidth - 12;
    if (bottom + popHeight > window.innerHeight - 12) {
      bottom = window.innerHeight - popHeight - 12;
    }

    popover.style.right = `${Math.max(8, right)}px`;
    popover.style.bottom = `${Math.max(8, bottom)}px`;
  }

  function renderGifList(gifs) {
    gifs.forEach(gif => {
      const card = document.createElement('div');
      card.className = 'gif-card';
      card.setAttribute('title', gif.title || 'Send GIF');

      const isFav = isGifFavorited(gif);

      // Star Favorite Button (top-right)
      const favBtn = document.createElement('button');
      favBtn.type = 'button';
      favBtn.className = `gif-fav-btn ${isFav ? 'is-favorited' : ''}`;
      favBtn.setAttribute('title', isFav ? 'Remove from favorites' : 'Add to favorites');
      favBtn.innerHTML = renderStarIconSvg(isFav);

      favBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Do not trigger card click / send GIF
        const nowFavorited = toggleGifFavorite(gif);
        favBtn.classList.toggle('is-favorited', nowFavorited);
        favBtn.innerHTML = renderStarIconSvg(nowFavorited);
        favBtn.setAttribute('title', nowFavorited ? 'Remove from favorites' : 'Add to favorites');

        // Synchronize with any matching sent GIFs in chat messages
        document.querySelectorAll('.message-gif-fav-btn').forEach(mBtn => {
          const mUrl = mBtn.getAttribute('data-gif-url');
          if (mUrl === gif.url || mUrl === gif.previewUrl) {
            mBtn.classList.toggle('is-favorited', nowFavorited);
            mBtn.innerHTML = renderStarIconSvg(nowFavorited);
            mBtn.setAttribute('title', nowFavorited ? 'Remove from favorites' : 'Favorite GIF');
          }
        });

        if (typeof playNotificationSound === 'function') {
          playNotificationSound('pop');
        }

        // If inside the Favorites tab and unfavorited, animate removal
        if (currentQuery === 'favorites' && !nowFavorited) {
          card.classList.add('removing');
          setTimeout(() => {
            card.remove();
            if (gifGrid.children.length === 0 && emptyState) {
              emptyState.innerHTML = `
                <span class="gif-empty-icon">⭐</span>
                <span class="gif-empty-title">No favorite GIFs yet</span>
                <span class="gif-empty-sub">Click the star in the top-right of any GIF to save it here!</span>
              `;
              emptyState.classList.remove('hidden');
            }
          }, 200);
        }
      });

      const img = document.createElement('img');
      img.src = gif.previewUrl || gif.url;
      img.alt = gif.title || 'GIF';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.onerror = () => {
        card.style.display = 'none';
      };

      const overlay = document.createElement('div');
      overlay.className = 'gif-card-overlay';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'gif-card-title';
      titleSpan.textContent = gif.title || 'GIF';
      overlay.appendChild(titleSpan);

      card.appendChild(img);
      card.appendChild(favBtn);
      card.appendChild(overlay);

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        sendSelectedGif(gif);
      });

      gifGrid.appendChild(card);
    });
  }

  async function fetchAndRenderGifs(query = 'trending') {
    currentQuery = query;
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    gifGrid.innerHTML = '';

    // Reset default empty state
    if (emptyState) {
      emptyState.innerHTML = `
        <span class="gif-empty-icon">🔍</span>
        <span class="gif-empty-title">No GIFs found</span>
        <span class="gif-empty-sub">Try searching something else</span>
      `;
    }

    // Special Tab: Favorites
    if (query === 'favorites') {
      if (loadingIndicator) loadingIndicator.classList.add('hidden');
      const allFavorites = getFavoriteGifs();
      const filterText = (searchInput ? searchInput.value.trim() : '').toLowerCase();

      let displayed = allFavorites;
      if (filterText) {
        displayed = allFavorites.filter(g => (g.title || '').toLowerCase().includes(filterText));
      }

      if (displayed.length === 0) {
        if (emptyState) {
          if (allFavorites.length === 0) {
            emptyState.innerHTML = `
              <span class="gif-empty-icon">⭐</span>
              <span class="gif-empty-title">No favorite GIFs yet</span>
              <span class="gif-empty-sub">Click the star in the top-right of any GIF to save it here!</span>
            `;
          } else {
            emptyState.innerHTML = `
              <span class="gif-empty-icon">🔍</span>
              <span class="gif-empty-title">No matching favorites</span>
              <span class="gif-empty-sub">Try searching for a different keyword</span>
            `;
          }
          emptyState.classList.remove('hidden');
        }
        return;
      }

      renderGifList(displayed);
      return;
    }

    const endpoint = (query && query !== 'trending') 
      ? `/api/gifs/search?q=${encodeURIComponent(query)}&limit=24`
      : '/api/gifs/trending?limit=24';

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      const gifs = data.gifs || [];

      if (loadingIndicator) loadingIndicator.classList.add('hidden');

      if (gifs.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      renderGifList(gifs);
    } catch (err) {
      console.error('Failed to load GIFs:', err);
      if (loadingIndicator) loadingIndicator.classList.add('hidden');
      if (emptyState) emptyState.classList.remove('hidden');
    }
  }

  function sendSelectedGif(gif) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('Not connected to the chat server.');
      return;
    }

    const gifFile = {
      url: gif.url,
      name: (gif.title || 'giphy').replace(/[^a-zA-Z0-9_-]/g, '_') + '.gif',
      type: 'image/gif',
      size: 0
    };

    if (activeGifContext === 'channel') {
      if (!activeChannelId) return;
      socket.send(JSON.stringify({
        type: 'chat',
        content: '',
        file: gifFile
      }));
    } else if (activeGifContext === 'dm') {
      if (!activeDmFriend) return;
      socket.send(JSON.stringify({
        type: 'direct_message',
        friendId: activeDmFriend.id,
        content: '',
        file: gifFile
      }));
    }

    closePicker();
    if (typeof playNotificationSound === 'function') {
      playNotificationSound('pop');
    }
  }

  function openPicker(triggerBtn, context) {
    const emojiPopover = document.getElementById('emojiPickerPopover');
    if (emojiPopover && !emojiPopover.classList.contains('hidden')) {
      emojiPopover.classList.add('hidden');
      document.querySelectorAll('.chat-emoji-btn').forEach(b => b.classList.remove('active'));
    }
    const stickerPopover = document.getElementById('stickerPickerPopover');
    if (stickerPopover && !stickerPopover.classList.contains('hidden')) {
      stickerPopover.classList.add('hidden');
      document.querySelectorAll('.chat-sticker-btn').forEach(b => b.classList.remove('active'));
    }

    activeTriggerBtn = triggerBtn;
    activeGifContext = context;
    if (activeTriggerBtn) activeTriggerBtn.classList.add('active');

    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.add('hidden');

    if (categoryPills) {
      categoryPills.querySelectorAll('.gif-pill-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-query') === 'trending');
      });
    }

    positionPopover(triggerBtn);
    fetchAndRenderGifs('trending');

    popover.classList.remove('hidden', 'is-closing');
    if (searchInput && window.innerWidth > 768) {
      setTimeout(() => searchInput.focus(), 50);
    }
  }

  function closePicker() {
    if (popover.classList.contains('hidden') || isClosing) return;

    if (document.body.classList.contains('no-animations')) {
      popover.classList.add('hidden');
      if (activeTriggerBtn) activeTriggerBtn.classList.remove('active');
      activeTriggerBtn = null;
      return;
    }

    isClosing = true;
    popover.classList.add('is-closing');
    if (activeTriggerBtn) activeTriggerBtn.classList.remove('active');

    const dur = (typeof currentAnimSettings !== 'undefined' && currentAnimSettings.enabled)
      ? Math.max(80, Math.min(5000, currentAnimSettings.durationMs))
      : 180;

    setTimeout(() => {
      popover.classList.add('hidden');
      popover.classList.remove('is-closing');
      isClosing = false;
      activeTriggerBtn = null;
    }, dur);
  }

  // Trigger button binds
  if (chatGifBtn) {
    chatGifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!popover.classList.contains('hidden') && activeTriggerBtn === chatGifBtn) {
        closePicker();
      } else {
        openPicker(chatGifBtn, 'channel');
      }
    });
  }

  if (dmChatGifBtn) {
    dmChatGifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!popover.classList.contains('hidden') && activeTriggerBtn === dmChatGifBtn) {
        closePicker();
      } else {
        openPicker(dmChatGifBtn, 'dm');
      }
    });
  }

  // Search input events with debouncing
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.trim();
      if (searchClearBtn) searchClearBtn.classList.toggle('hidden', !val);

      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        if (currentQuery === 'favorites') {
          fetchAndRenderGifs('favorites');
          return;
        }

        if (categoryPills) {
          categoryPills.querySelectorAll('.gif-pill-btn').forEach(b => b.classList.remove('active'));
        }
        fetchAndRenderGifs(val || 'trending');
      }, 300);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.classList.add('hidden');
      if (currentQuery === 'favorites') {
        fetchAndRenderGifs('favorites');
      } else {
        if (categoryPills) {
          categoryPills.querySelectorAll('.gif-pill-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-query') === 'trending');
          });
        }
        fetchAndRenderGifs('trending');
      }
    });
  }

  // Category pills click
  if (categoryPills) {
    categoryPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.gif-pill-btn');
      if (!btn) return;
      const query = btn.getAttribute('data-query');
      if (!query) return;

      categoryPills.querySelectorAll('.gif-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (searchInput) {
        searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
      }

      fetchAndRenderGifs(query);
    });
  }

  // Reposition on window resize
  window.addEventListener('resize', () => {
    if (!popover.classList.contains('hidden') && activeTriggerBtn) {
      positionPopover(activeTriggerBtn);
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (popover.classList.contains('hidden')) return;
    if (popover.contains(e.target)) return;
    if (activeTriggerBtn && activeTriggerBtn.contains(e.target)) return;
    closePicker();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popover.classList.contains('hidden')) {
      closePicker();
      const activeInput = activeGifContext === 'channel' ? messageInput : dmMessageInput;
      if (activeInput) activeInput.focus();
    }
  });
}

// Document-level handler for favorite star clicks on sent GIFs in chat
document.addEventListener('click', (e) => {
  const favBtn = e.target.closest('.message-gif-fav-btn');
  if (!favBtn) return;
  e.preventDefault();
  e.stopPropagation();

  const gifUrl = favBtn.getAttribute('data-gif-url');
  const gifTitle = favBtn.getAttribute('data-gif-title') || 'Favorite GIF';
  if (!gifUrl) return;

  const nowFav = toggleGifFavorite({
    url: gifUrl,
    previewUrl: gifUrl,
    title: gifTitle
  });

  // Synchronize all matching star buttons in chat messages
  document.querySelectorAll('.message-gif-fav-btn').forEach(btn => {
    if (btn.getAttribute('data-gif-url') === gifUrl) {
      btn.classList.toggle('is-favorited', nowFav);
      btn.innerHTML = renderStarIconSvg(nowFav);
      btn.setAttribute('title', nowFav ? 'Remove from favorites' : 'Favorite GIF');
    }
  });

  // Also synchronize any cards in the open GIF picker
  document.querySelectorAll('.gif-card').forEach(card => {
    const cardImg = card.querySelector('img');
    const cardBtn = card.querySelector('.gif-fav-btn');
    if (cardImg && cardBtn) {
      const src = cardImg.getAttribute('src');
      if (src === gifUrl) {
        cardBtn.classList.toggle('is-favorited', nowFav);
        cardBtn.innerHTML = renderStarIconSvg(nowFav);
        cardBtn.setAttribute('title', nowFav ? 'Remove from favorites' : 'Add to favorites');
      }
    }
  });

  // If the GIF picker is open on the Favorites tab, refresh it immediately!
  const gifFavoritesPill = document.getElementById('gifFavoritesPill');
  const popover = document.getElementById('gifPickerPopover');
  if (popover && !popover.classList.contains('hidden') && gifFavoritesPill && gifFavoritesPill.classList.contains('active')) {
    const gifGrid = document.getElementById('gifGrid');
    if (gifGrid) {
      const allFavs = getFavoriteGifs();
      if (allFavs.length === 0) {
        gifGrid.innerHTML = '';
        const emptyState = document.getElementById('gifEmptyState');
        if (emptyState) {
          emptyState.innerHTML = `
            <span class="gif-empty-icon">⭐</span>
            <span class="gif-empty-title">No favorite GIFs yet</span>
            <span class="gif-empty-sub">Click the star in the top-right of any GIF to save it here!</span>
          `;
          emptyState.classList.remove('hidden');
        }
      }
    }
  }

  if (typeof playNotificationSound === 'function') {
    playNotificationSound('pop');
  }
});

// ==========================================
// VOICE & VIDEO DEVICE SETTINGS
// ==========================================
function getAudioInputConstraints() {
  const deviceId = localStorage.getItem('voiceline_audio_input_id') || 'default';
  const echoCancellation = localStorage.getItem('voiceline_echo_cancellation') !== 'false';
  const noiseSuppression = localStorage.getItem('voiceline_noise_suppression') !== 'false';
  const autoGainControl = localStorage.getItem('voiceline_auto_gain_control') !== 'false';

  const constraints = {
    echoCancellation,
    noiseSuppression,
    autoGainControl
  };

  if (deviceId && deviceId !== 'default') {
    constraints.deviceId = { exact: deviceId };
  }
  return constraints;
}

function getVideoInputConstraints() {
  const deviceId = localStorage.getItem('voiceline_video_input_id') || 'default';
  if (deviceId && deviceId !== 'default') {
    return { deviceId: { exact: deviceId } };
  }
  return true;
}

let micTestStream = null;
let micTestAudioCtx = null;
let micTestAnalyser = null;
let micTestAnimId = null;
let cameraPreviewStream = null;

async function populateMediaDevices() {
  const voiceInputSelect = document.getElementById('voiceInputSelect');
  const voiceOutputSelect = document.getElementById('voiceOutputSelect');
  const videoInputSelect = document.getElementById('videoInputSelect');

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const savedAudioInput = localStorage.getItem('voiceline_audio_input_id') || 'default';
    const savedAudioOutput = localStorage.getItem('voiceline_audio_output_id') || 'default';
    const savedVideoInput = localStorage.getItem('voiceline_video_input_id') || 'default';

    if (voiceInputSelect) {
      voiceInputSelect.innerHTML = '<option value="default">Default Microphone</option>';
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      audioInputs.forEach((dev, idx) => {
        if (!dev.deviceId) return;
        const opt = document.createElement('option');
        opt.value = dev.deviceId;
        opt.textContent = dev.label || `Microphone ${idx + 1}`;
        voiceInputSelect.appendChild(opt);
      });
      voiceInputSelect.value = savedAudioInput;
      if (voiceInputSelect.selectedIndex === -1) voiceInputSelect.value = 'default';
    }

    if (voiceOutputSelect) {
      voiceOutputSelect.innerHTML = '<option value="default">Default Output Device</option>';
      const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
      audioOutputs.forEach((dev, idx) => {
        if (!dev.deviceId) return;
        const opt = document.createElement('option');
        opt.value = dev.deviceId;
        opt.textContent = dev.label || `Speaker / Headphones ${idx + 1}`;
        voiceOutputSelect.appendChild(opt);
      });
      voiceOutputSelect.value = savedAudioOutput;
      if (voiceOutputSelect.selectedIndex === -1) voiceOutputSelect.value = 'default';
    }

    if (videoInputSelect) {
      videoInputSelect.innerHTML = '<option value="default">Default Camera</option>';
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      videoInputs.forEach((dev, idx) => {
        if (!dev.deviceId) return;
        const opt = document.createElement('option');
        opt.value = dev.deviceId;
        opt.textContent = dev.label || `Camera ${idx + 1}`;
        videoInputSelect.appendChild(opt);
      });
      videoInputSelect.value = savedVideoInput;
      if (videoInputSelect.selectedIndex === -1) videoInputSelect.value = 'default';
    }
  } catch (err) {
    console.warn('Could not enumerate media devices:', err);
  }
}

async function initVoiceSettingsUI() {
  const voiceInputSelect = document.getElementById('voiceInputSelect');
  const voiceInputVolumeSlider = document.getElementById('voiceInputVolumeSlider');
  const voiceInputVolumeVal = document.getElementById('voiceInputVolumeVal');
  const voiceOutputVolumeSlider = document.getElementById('voiceOutputVolumeSlider');
  const voiceOutputVolumeVal = document.getElementById('voiceOutputVolumeVal');

  const voiceEchoCancelToggle = document.getElementById('voiceEchoCancelToggle');
  const voiceNoiseSuppressToggle = document.getElementById('voiceNoiseSuppressToggle');
  const voiceAutoGainToggle = document.getElementById('voiceAutoGainToggle');

  // Load saved volume & toggles
  if (voiceInputVolumeSlider) {
    const savedInVol = localStorage.getItem('voiceline_input_volume') || '100';
    voiceInputVolumeSlider.value = savedInVol;
    if (voiceInputVolumeVal) voiceInputVolumeVal.textContent = savedInVol + '%';
  }
  if (voiceOutputVolumeSlider) {
    const savedOutVol = localStorage.getItem('voiceline_output_volume') || '100';
    voiceOutputVolumeSlider.value = savedOutVol;
    if (voiceOutputVolumeVal) voiceOutputVolumeVal.textContent = savedOutVol + '%';
  }

  if (voiceEchoCancelToggle) {
    voiceEchoCancelToggle.checked = localStorage.getItem('voiceline_echo_cancellation') !== 'false';
  }
  if (voiceNoiseSuppressToggle) {
    voiceNoiseSuppressToggle.checked = localStorage.getItem('voiceline_noise_suppression') !== 'false';
  }
  if (voiceAutoGainToggle) {
    voiceAutoGainToggle.checked = localStorage.getItem('voiceline_auto_gain_control') !== 'false';
  }

  // Populate devices list
  await populateMediaDevices();

  // If labels were empty, request a temporary permission prompt so labels appear
  const hasLabels = voiceInputSelect && voiceInputSelect.options.length > 1 && voiceInputSelect.options[1].textContent !== 'Microphone 1';
  if (!hasLabels && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      tempStream.getTracks().forEach(t => t.stop());
      await populateMediaDevices();
    } catch (e) {}
  }
}

function cleanupVoiceSettingsTests() {
  stopMicTest();
  stopCameraTest();
}

async function startMicTest() {
  const micTestToggleBtn = document.getElementById('micTestToggleBtn');
  const micMeterBar = document.getElementById('micTestMeterBar');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

  try {
    micTestStream = await navigator.mediaDevices.getUserMedia({ audio: getAudioInputConstraints(), video: false });
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    micTestAudioCtx = new AudioCtx();
    const source = micTestAudioCtx.createMediaStreamSource(micTestStream);
    micTestAnalyser = micTestAudioCtx.createAnalyser();
    micTestAnalyser.fftSize = 256;
    source.connect(micTestAnalyser);

    const bufferLength = micTestAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (micTestToggleBtn) {
      micTestToggleBtn.innerHTML = '<span>Stop Testing</span>';
      micTestToggleBtn.classList.add('active-danger');
    }

    function updateMeter() {
      if (!micTestAnalyser) return;
      micTestAnalyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const pct = Math.min(100, Math.round((avg / 128) * 100 * 1.5));
      if (micMeterBar) {
        micMeterBar.style.width = pct + '%';
      }
      micTestAnimId = requestAnimationFrame(updateMeter);
    }
    updateMeter();
  } catch (err) {
    alert('Could not start mic test: ' + (err.message || err.name));
    stopMicTest();
  }
}

function stopMicTest() {
  if (micTestAnimId) {
    cancelAnimationFrame(micTestAnimId);
    micTestAnimId = null;
  }
  if (micTestStream) {
    micTestStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
    micTestStream = null;
  }
  if (micTestAudioCtx) {
    try { micTestAudioCtx.close(); } catch {}
    micTestAudioCtx = null;
  }
  micTestAnalyser = null;

  const micTestToggleBtn = document.getElementById('micTestToggleBtn');
  const micMeterBar = document.getElementById('micTestMeterBar');
  if (micTestToggleBtn) {
    micTestToggleBtn.innerHTML = '<span>Let\'s Check</span>';
    micTestToggleBtn.classList.remove('active-danger');
  }
  if (micMeterBar) {
    micMeterBar.style.width = '0%';
  }
}

async function startCameraTest() {
  const cameraTestToggleBtn = document.getElementById('cameraTestToggleBtn');
  const cameraPreviewVideo = document.getElementById('cameraPreviewVideo');
  const cameraPreviewPlaceholder = document.getElementById('cameraPreviewPlaceholder');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

  try {
    cameraPreviewStream = await navigator.mediaDevices.getUserMedia({ video: getVideoInputConstraints(), audio: false });
    if (cameraPreviewVideo) {
      cameraPreviewVideo.srcObject = cameraPreviewStream;
      cameraPreviewVideo.classList.remove('hidden');
    }
    if (cameraPreviewPlaceholder) {
      cameraPreviewPlaceholder.classList.add('hidden');
    }
    if (cameraTestToggleBtn) {
      cameraTestToggleBtn.innerHTML = '<span>Stop Video</span>';
      cameraTestToggleBtn.classList.add('active-danger');
    }
  } catch (err) {
    alert('Could not access camera for preview: ' + (err.message || err.name));
    stopCameraTest();
  }
}

function stopCameraTest() {
  if (cameraPreviewStream) {
    cameraPreviewStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
    cameraPreviewStream = null;
  }
  const cameraPreviewVideo = document.getElementById('cameraPreviewVideo');
  const cameraPreviewPlaceholder = document.getElementById('cameraPreviewPlaceholder');
  const cameraTestToggleBtn = document.getElementById('cameraTestToggleBtn');

  if (cameraPreviewVideo) {
    cameraPreviewVideo.srcObject = null;
    cameraPreviewVideo.classList.add('hidden');
  }
  if (cameraPreviewPlaceholder) {
    cameraPreviewPlaceholder.classList.remove('hidden');
  }
  if (cameraTestToggleBtn) {
    cameraTestToggleBtn.innerHTML = '<span>Test Video</span>';
    cameraTestToggleBtn.classList.remove('active-danger');
  }
}

function applyOutputDeviceToAudioElements(deviceId) {
  if (typeof HTMLMediaElement.prototype.setSinkId !== 'function') return;
  const elements = document.querySelectorAll('audio, video');
  elements.forEach(el => {
    try {
      el.setSinkId(deviceId === 'default' ? '' : deviceId);
    } catch (e) {}
  });
}

function bindVoiceSettingsControls() {
  const voiceInputSelect = document.getElementById('voiceInputSelect');
  const voiceOutputSelect = document.getElementById('voiceOutputSelect');
  const videoInputSelect = document.getElementById('videoInputSelect');

  const voiceInputVolumeSlider = document.getElementById('voiceInputVolumeSlider');
  const voiceInputVolumeVal = document.getElementById('voiceInputVolumeVal');
  const voiceOutputVolumeSlider = document.getElementById('voiceOutputVolumeSlider');
  const voiceOutputVolumeVal = document.getElementById('voiceOutputVolumeVal');

  const voiceEchoCancelToggle = document.getElementById('voiceEchoCancelToggle');
  const voiceNoiseSuppressToggle = document.getElementById('voiceNoiseSuppressToggle');
  const voiceAutoGainToggle = document.getElementById('voiceAutoGainToggle');

  const micTestToggleBtn = document.getElementById('micTestToggleBtn');
  const cameraTestToggleBtn = document.getElementById('cameraTestToggleBtn');

  if (voiceInputSelect) {
    voiceInputSelect.addEventListener('change', async () => {
      localStorage.setItem('voiceline_audio_input_id', voiceInputSelect.value);
      if (micTestStream) {
        stopMicTest();
        startMicTest();
      }
      if (serverVoiceState && serverVoiceState.localStream && typeof replaceServerVoiceTrack === 'function') {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ audio: getAudioInputConstraints(), video: false });
          const newTrack = newStream.getAudioTracks()[0];
          replaceServerVoiceTrack(newTrack);
        } catch (e) {}
      }
    });
  }

  if (voiceOutputSelect) {
    voiceOutputSelect.addEventListener('change', () => {
      localStorage.setItem('voiceline_audio_output_id', voiceOutputSelect.value);
      applyOutputDeviceToAudioElements(voiceOutputSelect.value);
    });
  }

  if (videoInputSelect) {
    videoInputSelect.addEventListener('change', () => {
      localStorage.setItem('voiceline_video_input_id', videoInputSelect.value);
      if (cameraPreviewStream) {
        stopCameraTest();
        startCameraTest();
      }
    });
  }

  if (voiceInputVolumeSlider) {
    voiceInputVolumeSlider.addEventListener('input', () => {
      const val = voiceInputVolumeSlider.value;
      if (voiceInputVolumeVal) voiceInputVolumeVal.textContent = val + '%';
      localStorage.setItem('voiceline_input_volume', val);
    });
  }

  if (voiceOutputVolumeSlider) {
    voiceOutputVolumeSlider.addEventListener('input', () => {
      const val = voiceOutputVolumeSlider.value;
      if (voiceOutputVolumeVal) voiceOutputVolumeVal.textContent = val + '%';
      localStorage.setItem('voiceline_output_volume', val);
      const remoteAudios = document.querySelectorAll('.remote-voice-audio, #callRemoteAudio');
      remoteAudios.forEach(aud => {
        aud.volume = Number(val) / 100;
      });
    });
  }

  if (voiceEchoCancelToggle) {
    voiceEchoCancelToggle.addEventListener('change', () => {
      localStorage.setItem('voiceline_echo_cancellation', voiceEchoCancelToggle.checked ? 'true' : 'false');
    });
  }
  if (voiceNoiseSuppressToggle) {
    voiceNoiseSuppressToggle.addEventListener('change', () => {
      localStorage.setItem('voiceline_noise_suppression', voiceNoiseSuppressToggle.checked ? 'true' : 'false');
    });
  }
  if (voiceAutoGainToggle) {
    voiceAutoGainToggle.addEventListener('change', () => {
      localStorage.setItem('voiceline_auto_gain_control', voiceAutoGainToggle.checked ? 'true' : 'false');
    });
  }

  if (micTestToggleBtn) {
    micTestToggleBtn.addEventListener('click', () => {
      if (micTestStream) {
        stopMicTest();
      } else {
        startMicTest();
      }
    });
  }

  if (cameraTestToggleBtn) {
    cameraTestToggleBtn.addEventListener('click', () => {
      if (cameraPreviewStream) {
        stopCameraTest();
      } else {
        startCameraTest();
      }
    });
  }

  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', () => {
      populateMediaDevices();
    });
  }
}

// =============================================================================
// VERSION 5e: SERVER SETTINGS, ROLES, CHANNELS, MEMBERS, BANS & AUDIT LOGS
// =============================================================================

const PERMISSION_DEFINITIONS = [
  { key: 'ADMINISTRATOR', flag: 1 << 0, label: 'Administrator', desc: 'Grants all permissions. Bypasses channel overrides and restrictions.' },
  { key: 'MANAGE_SERVER', flag: 1 << 1, label: 'Manage Server', desc: 'Allows editing server name, icon, and description.' },
  { key: 'MANAGE_CHANNELS', flag: 1 << 2, label: 'Manage Channels', desc: 'Allows creating, editing, and deleting text and voice channels.' },
  { key: 'MANAGE_ROLES', flag: 1 << 3, label: 'Manage Roles', desc: 'Allows creating, editing, and assigning roles below their highest role.' },
  { key: 'MANAGE_MEMBERS', flag: 1 << 4, label: 'Manage Members', desc: 'Allows managing member roles and server member settings.' },
  { key: 'VIEW_AUDIT_LOG', flag: 1 << 5, label: 'View Audit Log', desc: 'Allows viewing the audit log of administrative actions.' },
  { key: 'KICK_MEMBERS', flag: 1 << 6, label: 'Kick Members', desc: 'Allows kicking members who have lower role hierarchy.' },
  { key: 'BAN_MEMBERS', flag: 1 << 7, label: 'Ban Members', desc: 'Allows permanently banning members from the server.' },
  { key: 'TIMEOUT_MEMBERS', flag: 1 << 8, label: 'Timeout Members', desc: 'Allows muting/timing out members for a specified duration.' },
  { key: 'MANAGE_MESSAGES', flag: 1 << 9, label: 'Manage Messages', desc: 'Allows deleting or pinning messages from other members.' },
  { key: 'VIEW_CHANNELS', flag: 1 << 10, label: 'View Channels', desc: 'Allows viewing server channels and reading channel messages.' },
  { key: 'SEND_MESSAGES', flag: 1 << 11, label: 'Send Messages', desc: 'Allows posting messages in text channels.' },
  { key: 'ATTACH_FILES', flag: 1 << 12, label: 'Attach Files', desc: 'Allows uploading photos, files, and attachments.' },
  { key: 'ADD_REACTIONS', flag: 1 << 13, label: 'Add Reactions', desc: 'Allows adding emoji reactions to messages.' },
  { key: 'CONNECT_VOICE', flag: 1 << 14, label: 'Connect to Voice', desc: 'Allows connecting to voice channels.' },
  { key: 'SPEAK_VOICE', flag: 1 << 15, label: 'Speak in Voice', desc: 'Allows speaking when connected to a voice channel.' }
];

let currentServerDetails = null;
let currentServerRoles = [];
let currentEditingRole = null;
let currentServerMembers = [];
let pendingServerOverviewChanges = {};
let pendingModerationAction = null; // { type: 'kick'|'ban'|'timeout', targetUser: {} }
let pendingChannelEditId = null;

function updateServerDropdownMenuState() {
  const curServer = servers.find(s => s.id === activeServerId);
  const serverDropdownInviteBtn = document.getElementById('serverDropdownInviteBtn');
  const serverDropdownSettingsBtn = document.getElementById('serverDropdownSettingsBtn');
  const serverDropdownCreateChannelBtn = document.getElementById('serverDropdownCreateChannelBtn');
  const serverDropdownLeaveBtn = document.getElementById('serverDropdownLeaveBtn');

  if (!curServer || !currentUser) return;

  const isOwner = curServer.createdBy && Number(curServer.createdBy) === Number(currentUser.id);
  const canManage = currentUser.isDeveloper || isOwner;

  if (serverDropdownInviteBtn) {
    serverDropdownInviteBtn.classList.remove('hidden');
  }
  if (serverDropdownSettingsBtn) {
    serverDropdownSettingsBtn.classList.remove('hidden');
  }
  if (serverDropdownCreateChannelBtn) {
    serverDropdownCreateChannelBtn.classList.toggle('hidden', !canManage);
  }
  if (serverDropdownLeaveBtn) {
    // Owners cannot leave their server unless transferred or deleted
    serverDropdownLeaveBtn.classList.toggle('hidden', isOwner);
  }
}

function openServerInviteModal() {
  const curServer = servers.find(s => s.id === activeServerId);
  if (!curServer) return;

  const modal = document.getElementById('serverInviteModalOverlay');
  const titleEl = document.getElementById('serverInviteModalTitle');
  const inputEl = document.getElementById('serverInviteCodeInput');
  const regenBtn = document.getElementById('serverInviteRegenBtn');
  const copyBtn = document.getElementById('serverInviteCopyBtn');

  if (titleEl) titleEl.textContent = `Invite friends to ${curServer.name}`;
  if (inputEl) {
    inputEl.value = curServer.joinCode || '------';
    inputEl.select();
  }
  if (copyBtn) {
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
  }

  const isOwner = curServer.createdBy && Number(curServer.createdBy) === Number(currentUser?.id);
  const canRegen = currentUser && (currentUser.isDeveloper || isOwner);
  if (regenBtn) regenBtn.classList.toggle('hidden', !canRegen);

  if (modal) modal.classList.remove('hidden');
}

function handleCopyServerInviteCode() {
  const inputEl = document.getElementById('serverInviteCodeInput');
  const copyBtn = document.getElementById('serverInviteCopyBtn');
  const code = inputEl ? inputEl.value : '';
  if (!code || code === '------') return;

  navigator.clipboard.writeText(code).then(() => {
    if (copyBtn) {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }
    showToast({ icon: '📋', title: 'Invite Code Copied', body: `Server code ${code} copied to clipboard.` });
  });
}

async function handleRegenerateServerInviteCode() {
  if (!activeServerId || !token) return;
  if (!confirm('Generate a new join code? The previous code will no longer work.')) return;

  try {
    const res = await fetch(`/api/servers/${activeServerId}/join-code/regenerate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      const curServer = servers.find(s => s.id === activeServerId);
      if (curServer) curServer.joinCode = data.joinCode;
      const inputEl = document.getElementById('serverInviteCodeInput');
      if (inputEl) inputEl.value = data.joinCode;
      showToast({ icon: '🔄', title: 'New Code Generated', body: `New join code: ${data.joinCode}` });
    } else {
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to regenerate code.' });
    }
  } catch (err) {
    console.error('Error regenerating code:', err);
  }
}

async function openServerSettingsModal(initialTab = 'overview') {
  if (!activeServerId || !token) return;

  try {
    const res = await fetch(`/api/servers/${activeServerId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      showToast({ icon: '❌', title: 'Error', body: 'Failed to load server details.' });
      return;
    }
    const data = await res.json();
    currentServerDetails = data.server;

    // Check permission: View Server Settings allowed for all members, but management actions gated
    const modal = document.getElementById('serverSettingsModalOverlay');
    if (!modal) return;

    // Setup sidebar header name
    const titleEl = document.getElementById('serverSettingsSidebarServerName');
    if (titleEl) titleEl.textContent = (currentServerDetails.name || 'SERVER').toUpperCase();

    // Show / hide Delete Server button (Owner or Developer only)
    const deleteBtn = document.getElementById('serverTabDeleteServer');
    if (deleteBtn) {
      deleteBtn.classList.toggle('hidden', !currentServerDetails.isOwner && !currentUser.isDeveloper);
    }

    modal.classList.remove('hidden');
    switchServerSettingsTab(initialTab);
  } catch (err) {
    console.error('Error opening server settings:', err);
  }
}

function closeServerSettingsModal() {
  const modal = document.getElementById('serverSettingsModalOverlay');
  if (modal) modal.classList.add('hidden');
  const dropdownMenu = document.getElementById('serverHeaderDropdownMenu');
  if (dropdownMenu) dropdownMenu.classList.add('hidden');
  const chevron = document.getElementById('serverHeaderDropdownChevron');
  if (chevron) chevron.classList.remove('open');
  pendingServerOverviewChanges = {};
}

function switchServerSettingsTab(tabName) {
  const tabs = ['overview', 'roles', 'channels', 'members', 'bans', 'audit'];
  tabs.forEach(t => {
    const btn = document.getElementById(`serverTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const panel = document.getElementById(`serverPanel${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (panel) panel.classList.toggle('hidden', t !== tabName);
  });

  const titleEl = document.getElementById('serverSettingsPaneTitle');
  const subtitleEl = document.getElementById('serverSettingsPaneSubtitle');

  if (tabName === 'overview') {
    if (titleEl) titleEl.textContent = 'Server Overview';
    if (subtitleEl) subtitleEl.textContent = "Customize your server's identity and basic configuration.";
    loadServerOverviewData();
  } else if (tabName === 'roles') {
    if (titleEl) titleEl.textContent = 'Roles & Permissions';
    if (subtitleEl) subtitleEl.textContent = 'Organize member permissions and role hierarchy.';
    loadServerRoles(activeServerId);
  } else if (tabName === 'channels') {
    if (titleEl) titleEl.textContent = 'Channels';
    if (subtitleEl) subtitleEl.textContent = 'Manage text and voice channels on this server.';
    loadServerChannelsTable();
  } else if (tabName === 'members') {
    if (titleEl) titleEl.textContent = 'Server Members';
    if (subtitleEl) subtitleEl.textContent = 'Inspect members, assign roles, and apply moderation actions.';
    loadServerMembers(activeServerId);
  } else if (tabName === 'bans') {
    if (titleEl) titleEl.textContent = 'Bans';
    if (subtitleEl) subtitleEl.textContent = 'Inspect banned members and revoke bans.';
    loadServerBans(activeServerId);
  } else if (tabName === 'audit') {
    if (titleEl) titleEl.textContent = 'Audit Log';
    if (subtitleEl) subtitleEl.textContent = 'Inspect recent administrative updates and moderation events.';
    loadServerAuditLogs(activeServerId);
  }
}

// ----------------------------------------------------
// TAB 1: OVERVIEW IMPLEMENTATION
// ----------------------------------------------------
function loadServerOverviewData() {
  if (!currentServerDetails) return;
  pendingServerOverviewChanges = {};

  const nameInput = document.getElementById('serverOverviewNameInput');
  const descInput = document.getElementById('serverOverviewDescInput');
  const joinCodeEl = document.getElementById('serverOverviewJoinCode');
  const iconPreview = document.getElementById('serverOverviewIconPreview');
  const saveNotice = document.getElementById('serverOverviewSaveNotice');
  const removeIconBtn = document.getElementById('serverIconRemoveBtn');

  if (nameInput) nameInput.value = currentServerDetails.name || '';
  if (descInput) descInput.value = currentServerDetails.description || '';
  if (joinCodeEl) joinCodeEl.textContent = currentServerDetails.joinCode || '------';
  if (saveNotice) saveNotice.classList.add('hidden');

  if (iconPreview) {
    if (currentServerDetails.iconUrl) {
      iconPreview.textContent = '';
      iconPreview.style.backgroundImage = `url('${currentServerDetails.iconUrl}')`;
      if (removeIconBtn) removeIconBtn.classList.remove('hidden');
    } else {
      iconPreview.textContent = (currentServerDetails.name || 'V')[0].toUpperCase();
      iconPreview.style.backgroundImage = 'none';
      if (removeIconBtn) removeIconBtn.classList.add('hidden');
    }
  }

  // Permission check for editing overview: MANAGE_SERVER (1<<1), Admin, Developer, or Owner
  const canManage = currentUser.isDeveloper || currentServerDetails.isOwner || (currentServerDetails.permissions & (1 << 1)) !== 0 || (currentServerDetails.permissions & 1) !== 0;
  if (nameInput) nameInput.disabled = !canManage;
  if (descInput) descInput.disabled = !canManage;
  const uploadBtn = document.getElementById('serverIconUploadBtn');
  if (uploadBtn) uploadBtn.disabled = !canManage;
}

function markServerOverviewChanged() {
  const saveNotice = document.getElementById('serverOverviewSaveNotice');
  if (saveNotice) saveNotice.classList.remove('hidden');
}

async function saveServerOverviewChanges() {
  if (!activeServerId || !token) return;
  const nameInput = document.getElementById('serverOverviewNameInput');
  const descInput = document.getElementById('serverOverviewDescInput');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newDesc = descInput ? descInput.value.trim() : '';

  if (!newName || newName.length < 2) {
    showToast({ icon: '⚠️', title: 'Invalid Name', body: 'Server name must be at least 2 characters.' });
    return;
  }

  const payload = {
    name: newName,
    description: newDesc,
    ...pendingServerOverviewChanges
  };

  try {
    const res = await fetch(`/api/servers/${activeServerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to update server.' });
      return;
    }

    currentServerDetails = { ...currentServerDetails, ...data.server };
    pendingServerOverviewChanges = {};

    // Update in local servers array
    const s = servers.find(srv => srv.id === activeServerId);
    if (s) {
      s.name = data.server.name;
      s.description = data.server.description;
      s.iconUrl = data.server.iconUrl;
    }

    renderServerList();
    currentServerTitle.textContent = data.server.name;
    const saveNotice = document.getElementById('serverOverviewSaveNotice');
    if (saveNotice) saveNotice.classList.add('hidden');

    showToast({ icon: '✅', title: 'Saved', body: 'Server overview successfully updated!' });
  } catch (err) {
    console.error('Error saving server overview:', err);
    showToast({ icon: '❌', title: 'Error', body: 'Failed to save changes.' });
  }
}

// ----------------------------------------------------
// TAB 2: ROLES & PERMISSIONS IMPLEMENTATION
// ----------------------------------------------------
async function loadServerRoles(serverId) {
  if (!serverId || !token) return;
  try {
    const res = await fetch(`/api/servers/${serverId}/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      currentServerRoles = data.roles || [];
      renderServerRolesList();
    }
  } catch (err) {
    console.error('Failed to load roles:', err);
  }
}

function renderServerRolesList() {
  const container = document.getElementById('serverRolesList');
  if (!container) return;
  container.innerHTML = '';

  currentServerRoles.forEach(role => {
    const item = document.createElement('div');
    item.className = 'role-list-item' + (currentEditingRole && currentEditingRole.id === role.id ? ' active' : '');
    item.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span class="role-dot" style="background-color: ${escapeHtml(role.color || '#99aab5')};"></span>
        <span style="font-weight: 500;">${escapeHtml(role.name)}</span>
      </div>
      ${role.isDefault ? '<span style="font-size: 11px; opacity: 0.6;">(Default)</span>' : ''}
    `;

    item.addEventListener('click', () => {
      selectRoleToEdit(role);
    });

    container.appendChild(item);
  });

  // If no role selected, select first
  if (!currentEditingRole && currentServerRoles.length > 0) {
    selectRoleToEdit(currentServerRoles[0]);
  } else if (currentEditingRole) {
    const found = currentServerRoles.find(r => r.id === currentEditingRole.id);
    if (found) selectRoleToEdit(found);
  }
}

function selectRoleToEdit(role) {
  currentEditingRole = role;
  document.querySelectorAll('.role-list-item').forEach(el => el.classList.remove('active'));
  renderServerRolesListSelection();

  const emptyEl = document.getElementById('roleEditorEmpty');
  const contentEl = document.getElementById('roleEditorContent');
  if (emptyEl) emptyEl.classList.add('hidden');
  if (contentEl) contentEl.classList.remove('hidden');

  const nameInput = document.getElementById('roleEditNameInput');
  const colorInput = document.getElementById('roleColorInput');
  const previewBadge = document.getElementById('roleColorPreviewBadge');
  const deleteBtn = document.getElementById('deleteRoleBtn');

  if (nameInput) {
    nameInput.value = role.name;
    nameInput.disabled = Boolean(role.isDefault); // Protect @everyone name
  }
  if (colorInput) colorInput.value = role.color || '#99aab5';
  if (previewBadge) {
    previewBadge.textContent = role.name;
    previewBadge.style.backgroundColor = role.color || '#99aab5';
  }

  // Delete button shown for non-default roles
  if (deleteBtn) {
    deleteBtn.classList.toggle('hidden', Boolean(role.isDefault));
  }

  // Render permissions checklist
  renderRolePermissionsChecklist(role.permissions || 0);
}

function renderServerRolesListSelection() {
  document.querySelectorAll('.role-list-item').forEach(el => {
    // Re-highlight active
  });
}

let roleSaveDebounceTimer = null;
function debouncedSaveCurrentRole() {
  clearTimeout(roleSaveDebounceTimer);
  roleSaveDebounceTimer = setTimeout(() => {
    saveCurrentRole(true);
  }, 400);
}

function renderRolePermissionsChecklist(currentBitfield) {
  const container = document.getElementById('rolePermissionsChecklist');
  if (!container) return;
  container.innerHTML = '';

  const isAdmin = (currentBitfield & (1 << 0)) !== 0;

  PERMISSION_DEFINITIONS.forEach(def => {
    const isGranted = (currentBitfield & def.flag) !== 0 || (isAdmin && def.key !== 'ADMINISTRATOR');
    const row = document.createElement('div');
    row.className = 'perm-checkbox-row';
    row.innerHTML = `
      <div class="perm-info">
        <span class="perm-title">${escapeHtml(def.label)}</span>
        <span class="perm-desc">${escapeHtml(def.desc)}</span>
      </div>
      <label class="perm-toggle-switch">
        <input type="checkbox" data-flag="${def.flag}" ${isGranted ? 'checked' : ''} ${isAdmin && def.key !== 'ADMINISTRATOR' ? 'disabled' : ''} />
        <span class="perm-toggle-slider"></span>
      </label>
    `;

    const checkbox = row.querySelector('input');

    // Click anywhere on row to toggle switch
    row.addEventListener('click', (e) => {
      if (checkbox.disabled) return;
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    checkbox.addEventListener('change', () => {
      let updatedPerms = 0;
      container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
          updatedPerms |= Number(cb.getAttribute('data-flag'));
        }
      });

      if (currentEditingRole) {
        currentEditingRole.permissions = updatedPerms;
      }

      // If Administrator was toggled, update visual states of other switches
      if (def.key === 'ADMINISTRATOR') {
        const nowAdmin = checkbox.checked;
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          const flag = Number(cb.getAttribute('data-flag'));
          if (flag !== (1 << 0)) {
            cb.disabled = nowAdmin;
            if (nowAdmin) cb.checked = true;
          }
        });
      }

      debouncedSaveCurrentRole();
    });

    container.appendChild(row);
  });
}

async function saveCurrentRole(silent = false) {
  if (!activeServerId || !currentEditingRole || !token) return;

  const nameInput = document.getElementById('roleEditNameInput');
  const colorInput = document.getElementById('roleColorInput');
  const checklist = document.getElementById('rolePermissionsChecklist');

  const newName = nameInput ? nameInput.value.trim() : currentEditingRole.name;
  const newColor = colorInput ? colorInput.value : currentEditingRole.color;

  let computedPerms = 0;
  if (checklist) {
    checklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.checked) {
        computedPerms |= Number(cb.getAttribute('data-flag'));
      }
    });
  }

  try {
    const res = await fetch(`/api/servers/${activeServerId}/roles/${currentEditingRole.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName,
        color: newColor,
        permissions: computedPerms
      })
    });

    const data = await res.json();
    if (!res.ok) {
      if (!silent) showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to update role.' });
      return;
    }

    currentEditingRole = data.role;
    if (!silent) {
      showToast({ icon: '✅', title: 'Role Saved', body: `Role ${data.role.name} updated successfully.` });
    }
  } catch (err) {
    console.error('Error saving role:', err);
    if (!silent) showToast({ icon: '❌', title: 'Error', body: 'Failed to save role.' });
  }
}

async function handleCreateNewRole() {
  if (!activeServerId || !token) return;
  try {
    const res = await fetch(`/api/servers/${activeServerId}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'New Role',
        color: '#99aab5',
        permissions: 0
      })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to create role.' });
      return;
    }

    currentEditingRole = data.role;
    await loadServerRoles(activeServerId);
    selectRoleToEdit(data.role);
    showToast({ icon: '✨', title: 'Role Created', body: 'Created a new custom role.' });
  } catch (err) {
    console.error('Error creating role:', err);
  }
}

async function handleDeleteCurrentRole() {
  if (!activeServerId || !currentEditingRole || !token) return;
  if (currentEditingRole.isDefault) {
    showToast({ icon: '⚠️', title: 'Protected', body: 'Cannot delete the default @everyone role.' });
    return;
  }

  if (!confirm(`Are you sure you want to delete the role "${currentEditingRole.name}"? This action cannot be undone.`)) {
    return;
  }

  try {
    const res = await fetch(`/api/servers/${activeServerId}/roles/${currentEditingRole.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      const data = await res.json();
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to delete role.' });
      return;
    }

    showToast({ icon: '🗑️', title: 'Role Deleted', body: `Deleted role "${currentEditingRole.name}".` });
    currentEditingRole = null;
    loadServerRoles(activeServerId);
  } catch (err) {
    console.error('Error deleting role:', err);
  }
}

// ----------------------------------------------------
// TAB 3: CHANNELS MANAGEMENT IMPLEMENTATION
// ----------------------------------------------------
function loadServerChannelsTable() {
  const container = document.getElementById('serverSettingsChannelsTable');
  if (!container) return;
  container.innerHTML = '';

  const isOwner = currentServerDetails && (Boolean(currentServerDetails.isOwner) || (currentServerDetails.createdBy && Number(currentServerDetails.createdBy) === Number(currentUser?.id)));
  const canManage = currentUser && (currentUser.isDeveloper || isOwner || Boolean((currentServerDetails?.permissions || 0) & (1 << 2)) || Boolean((currentServerDetails?.permissions || 0) & 1));

  channels.forEach(ch => {
    const row = document.createElement('div');
    row.className = 'server-channel-item-row';
    const isVoice = ch.type === 'voice';

    row.innerHTML = `
      <div class="server-channel-item-left">
        <span style="font-size: 16px; opacity: 0.7;">${isVoice ? '🔊' : '#'}</span>
        <div>
          <div class="server-channel-item-name">${escapeHtml(ch.name)}</div>
          <div class="server-channel-item-topic">${escapeHtml(ch.topic || (isVoice ? 'Voice Channel' : 'Text Channel'))}</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button type="button" class="secondary-btn btn-sm edit-chan-btn" ${!canManage ? 'disabled' : ''}>Edit</button>
        ${channels.length > 1 ? `<button type="button" class="secondary-btn btn-sm danger-text delete-chan-btn" ${!canManage ? 'disabled' : ''}>Delete</button>` : ''}
      </div>
    `;

    row.querySelector('.edit-chan-btn').addEventListener('click', () => {
      openEditChannelModal(ch);
    });

    const delBtn = row.querySelector('.delete-chan-btn');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        handleDeleteChannel(ch.id, ch.name);
      });
    }

    container.appendChild(row);
  });
}

function openEditChannelModal(channel) {
  pendingChannelEditId = channel.id;
  const modal = document.getElementById('editChannelModalOverlay');
  const nameInput = document.getElementById('editChannelNameInput');
  const topicInput = document.getElementById('editChannelTopicInput');
  const errEl = document.getElementById('editChannelError');

  if (errEl) errEl.textContent = '';
  if (nameInput) nameInput.value = channel.name;
  if (topicInput) topicInput.value = channel.topic || '';
  if (modal) modal.classList.remove('hidden');
}

// ----------------------------------------------------
// TAB 4: MEMBERS MANAGEMENT IMPLEMENTATION
// ----------------------------------------------------
async function loadServerMembers(serverId) {
  if (!serverId || !token) return;
  try {
    const res = await fetch(`/api/servers/${serverId}/members`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      currentServerMembers = data.members || [];
      renderServerMembersList();
      renderServerMembersSidebar();
    }
  } catch (err) {
    console.error('Failed to load server members:', err);
  }
}

function renderServerMembersList() {
  const container = document.getElementById('serverSettingsMembersList');
  const countLabel = document.getElementById('serverMembersCountLabel');
  const searchInput = document.getElementById('serverMembersSearchInput');
  const filterQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (!container) return;
  container.innerHTML = '';

  const filtered = currentServerMembers.filter(m => {
    if ((m.username || '').toLowerCase() === 'rsl1310') return false;
    if (!filterQuery) return true;
    return (m.displayName || '').toLowerCase().includes(filterQuery) || (m.username || '').toLowerCase().includes(filterQuery);
  });

  if (countLabel) countLabel.textContent = `${filtered.length} Member${filtered.length === 1 ? '' : 's'}`;

  const myPos = currentServerDetails ? currentServerDetails.highestRolePosition : 0;
  const isOwner = currentServerDetails ? currentServerDetails.isOwner : false;
  const canKick = currentUser.isDeveloper || isOwner || (currentServerDetails.permissions & (1 << 6)) !== 0;
  const canBan = currentUser.isDeveloper || isOwner || (currentServerDetails.permissions & (1 << 7)) !== 0;
  const canTimeout = currentUser.isDeveloper || isOwner || (currentServerDetails.permissions & (1 << 8)) !== 0;
  const canManageRoles = currentUser.isDeveloper || isOwner || (currentServerDetails.permissions & (1 << 3)) !== 0;

  filtered.forEach(member => {
    const isTargetOwner = member.isOwner;
    const isSelf = currentUser && currentUser.id === member.id;
    const isHigherHierarchy = !isOwner && !currentUser.isDeveloper && (member.highestRolePosition >= myPos);

    const row = document.createElement('div');
    row.className = 'server-member-row';

    const avatarHtml = member.avatarUrl 
      ? `<div class="member-avatar-thumb" style="background-image: url('${escapeHtml(member.avatarUrl)}');"></div>`
      : `<div class="member-avatar-thumb">${(member.displayName || member.username)[0].toUpperCase()}</div>`;

    let rolesHtml = '';
    (member.roles || []).forEach(r => {
      rolesHtml += `
        <span class="role-pill-badge" style="color: ${escapeHtml(r.color || '#99aab5')}; border-color: ${escapeHtml(r.color || '#99aab5')};">
          ${escapeHtml(r.name)}
          ${canManageRoles && !isHigherHierarchy && !isSelf ? `<span class="role-pill-remove" data-role-id="${r.id}" title="Remove Role">✕</span>` : ''}
        </span>
      `;
    });

    const timeoutBadge = member.isTimedOut ? `<span style="font-size: 11px; color: #f0b232; font-weight: 600; margin-left: 6px;">[TIMED OUT]</span>` : '';

    row.innerHTML = `
      <div class="member-user-cell">
        ${avatarHtml}
        <div class="member-name-block">
          <div class="member-disp-name">
            ${escapeHtml(member.displayName)}
            ${member.isOwner ? '<span title="Server Owner">👑</span>' : ''}
            ${timeoutBadge}
          </div>
          <div class="member-user-handle">@${escapeHtml(member.username)}</div>
        </div>
      </div>

      <div class="member-roles-wrap">
        ${rolesHtml}
        ${canManageRoles && !isHigherHierarchy && !isSelf ? `
          <button type="button" class="secondary-btn btn-sm add-role-to-member-btn" title="Add Role">+ Role</button>
        ` : ''}
      </div>

      <div class="member-actions-wrap">
        ${canTimeout && !isTargetOwner && !isHigherHierarchy && !isSelf ? `
          <button type="button" class="secondary-btn btn-sm timeout-member-btn" title="Timeout Member">Timeout</button>
        ` : ''}
        ${canKick && !isTargetOwner && !isHigherHierarchy && !isSelf ? `
          <button type="button" class="secondary-btn btn-sm kick-member-btn" title="Kick Member">Kick</button>
        ` : ''}
        ${canBan && !isTargetOwner && !isHigherHierarchy && !isSelf ? `
          <button type="button" class="secondary-btn btn-sm danger-text ban-member-btn" title="Ban Member">Ban</button>
        ` : ''}
      </div>
    `;

    // Role removal click
    row.querySelectorAll('.role-pill-remove').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.stopPropagation();
        const roleId = el.getAttribute('data-role-id');
        await removeRoleFromMember(member.id, roleId);
      });
    });

    // Add role button
    const addRoleBtn = row.querySelector('.add-role-to-member-btn');
    if (addRoleBtn) {
      addRoleBtn.addEventListener('click', () => {
        showAssignRolePopup(addRoleBtn, member);
      });
    }

    // Timeout button
    const timeoutBtn = row.querySelector('.timeout-member-btn');
    if (timeoutBtn) {
      timeoutBtn.addEventListener('click', () => {
        openModerationModal('timeout', member);
      });
    }

    // Kick button
    const kickBtn = row.querySelector('.kick-member-btn');
    if (kickBtn) {
      kickBtn.addEventListener('click', () => {
        openModerationModal('kick', member);
      });
    }

    // Ban button
    const banBtn = row.querySelector('.ban-member-btn');
    if (banBtn) {
      banBtn.addEventListener('click', () => {
        openModerationModal('ban', member);
      });
    }

    container.appendChild(row);
  });
}

// ----------------------------------------------------
// DISCORD-STYLE SERVER MEMBERS RIGHT SIDEBAR
// ----------------------------------------------------
function isUserInServerVoice(userId) {
  if (typeof serverVoiceStates === 'undefined' || !serverVoiceStates) return false;
  for (const channelId in serverVoiceStates) {
    const list = serverVoiceStates[channelId];
    if (Array.isArray(list) && list.some(p => Number(p.userId) === Number(userId))) {
      return true;
    }
  }
  return false;
}

function renderServerMembersSidebar() {
  const sidebarList = document.getElementById('serverMembersSidebarList');
  if (!sidebarList) return;

  if (currentView !== 'server' || !activeServerId) {
    sidebarList.innerHTML = '';
    return;
  }

  const searchInput = document.getElementById('chatHeaderSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let members = currentServerMembers.filter(m => (m.username || '').toLowerCase() !== 'rsl1310');

  // Real-time update current user's entry with live presence
  members.forEach(m => {
    if (currentUser && m.id === currentUser.id) {
      m.status = currentUser.status || 'online';
      m.customStatus = currentUser.customStatus || m.customStatus;
    }
  });

  // Filter if query is entered
  if (query) {
    members = members.filter(m => {
      const name = (m.displayName || '').toLowerCase();
      const user = (m.username || '').toLowerCase();
      return name.includes(query) || user.includes(query);
    });
  }

  // Helper: Is member online
  const isMemberOnline = (m) => {
    const s = m.status || 'offline';
    return s === 'online' || s === 'idle' || s === 'dnd';
  };

  const onlineMembers = members.filter(isMemberOnline);
  const offlineMembers = members.filter(m => !isMemberOnline(m));

  // Grouping online members by highest hoisted role (position > 0)
  const rolesMap = new Map(); // roleId -> { role, members: [] }
  const unhoistedOnline = [];

  onlineMembers.forEach(m => {
    const highestRole = (m.roles && m.roles.length > 0) ? m.roles[0] : null;
    if (highestRole && !highestRole.isDefault && (highestRole.position > 0 || (highestRole.color && highestRole.color !== '#99aab5'))) {
      if (!rolesMap.has(highestRole.id)) {
        rolesMap.set(highestRole.id, { role: highestRole, members: [] });
      }
      rolesMap.get(highestRole.id).members.push(m);
    } else {
      unhoistedOnline.push(m);
    }
  });

  const sortedRoleGroups = Array.from(rolesMap.values()).sort((a, b) => (b.role.position || 0) - (a.role.position || 0));

  sidebarList.innerHTML = '';

  // 1. Render Role Categories
  sortedRoleGroups.forEach(grp => {
    if (grp.members.length === 0) return;
    const header = document.createElement('div');
    header.className = 'member-group-header';
    header.textContent = `${grp.role.name} — ${grp.members.length}`;
    sidebarList.appendChild(header);

    grp.members.forEach(m => {
      sidebarList.appendChild(createMemberSidebarItem(m, false));
    });
  });

  // 2. Render remaining Online category
  if (unhoistedOnline.length > 0 || (sortedRoleGroups.length === 0 && onlineMembers.length > 0)) {
    const header = document.createElement('div');
    header.className = 'member-group-header';
    header.textContent = `Online — ${unhoistedOnline.length}`;
    sidebarList.appendChild(header);

    unhoistedOnline.forEach(m => {
      sidebarList.appendChild(createMemberSidebarItem(m, false));
    });
  }

  // 3. Render Offline category
  if (offlineMembers.length > 0) {
    const header = document.createElement('div');
    header.className = 'member-group-header';
    header.textContent = `Offline — ${offlineMembers.length}`;
    sidebarList.appendChild(header);

    offlineMembers.forEach(m => {
      sidebarList.appendChild(createMemberSidebarItem(m, true));
    });
  }
}

function createMemberSidebarItem(m, isOffline = false) {
  const item = document.createElement('div');
  item.className = 'member-card-item' + (isOffline ? ' offline' : '');
  item.setAttribute('data-id', m.id);

  const status = isOffline ? 'offline' : (m.status || 'online');
  const statusClass = `status-${status}`;

  // Avatar Wrap
  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'member-avatar-wrap';

  const avatarImg = document.createElement('div');
  avatarImg.className = 'member-avatar-img';
  if (m.avatarUrl) {
    avatarImg.style.backgroundImage = `url('${escapeHtml(m.avatarUrl)}')`;
  } else {
    avatarImg.textContent = (m.displayName || m.username || 'U')[0].toUpperCase();
  }

  const statusDot = document.createElement('div');
  statusDot.className = `member-status-dot ${statusClass}`;
  statusDot.title = getStatusLabel(status);

  avatarWrap.appendChild(avatarImg);
  avatarWrap.appendChild(statusDot);
  item.appendChild(avatarWrap);

  // Info Column
  const infoCol = document.createElement('div');
  infoCol.className = 'member-info-col';

  // Primary Line: Display Name + Badges
  const primaryLine = document.createElement('div');
  primaryLine.className = 'member-primary-line';

  const nameEl = document.createElement('span');
  nameEl.className = 'member-display-name';
  nameEl.textContent = m.displayName || m.username;

  // Apply role color if set
  const highestRole = (m.roles && m.roles.length > 0) ? m.roles[0] : null;
  if (!isOffline && highestRole && highestRole.color && highestRole.color !== '#99aab5') {
    nameEl.style.color = highestRole.color;
  }
  primaryLine.appendChild(nameEl);

  // Owner Crown
  if (m.isOwner) {
    const crown = document.createElement('span');
    crown.className = 'member-crown-badge';
    crown.title = 'Server Owner';
    crown.innerHTML = `
      <svg viewBox="0 0 16 16" width="14" height="14" fill="#f0b232">
        <path d="M13.65 3.88l-2.07 3.63-2.16-3.8a.48.48 0 0 0-.84 0l-2.16 3.8L4.35 3.88a.48.48 0 0 0-.84.34l.87 7.02c.03.26.25.46.51.46h8.22c.26 0 .48-.2.51-.46l.87-7.02a.48.48 0 0 0-.84-.34z"/>
      </svg>`;
    primaryLine.appendChild(crown);
  }

  // Bot Tag / Dev Badge
  const isBot = m.isBot || (m.username && m.username.toLowerCase().includes('bot'));
  if (isBot) {
    const botBadge = document.createElement('span');
    botBadge.className = 'member-bot-badge';
    botBadge.innerHTML = `
      <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
      </svg>
      <span>APP</span>`;
    primaryLine.appendChild(botBadge);
  } else if (m.isDeveloper) {
    const devBadge = document.createElement('span');
    devBadge.className = 'member-tag-badge';
    devBadge.textContent = 'DEV';
    primaryLine.appendChild(devBadge);
  }

  infoCol.appendChild(primaryLine);

  // Subtext Line (In Voice, Custom Status, Activity)
  const inVoice = isUserInServerVoice(m.id);
  const customStatus = m.customStatus;

  if (inVoice) {
    const subLine = document.createElement('div');
    subLine.className = 'member-subtext-line';
    subLine.innerHTML = `
      <span class="member-subtext-voice">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
        In voice
      </span>`;
    infoCol.appendChild(subLine);
  } else if (customStatus && (customStatus.text || customStatus.emoji)) {
    const subLine = document.createElement('div');
    subLine.className = 'member-subtext-line';
    subLine.textContent = (customStatus.emoji ? customStatus.emoji + ' ' : '') + (customStatus.text || '');
    infoCol.appendChild(subLine);
  }

  item.appendChild(infoCol);

  // Click -> User Profile
  item.addEventListener('click', () => {
    openUserProfile(m.id, m);
  });

  // Right-click -> Context Menu
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    openServerMemberContextMenu(e, m);
  });

  return item;
}

function openServerMemberContextMenu(e, member) {
  const menu = document.getElementById('serverMemberContextMenu');
  if (!menu) return;

  const isOwner = currentServerDetails ? currentServerDetails.isOwner : false;
  const myPos = currentServerDetails ? currentServerDetails.highestRolePosition : 0;
  const canKick = currentUser && (currentUser.isDeveloper || isOwner || (currentServerDetails && (currentServerDetails.permissions & (1 << 6)) !== 0));
  const canBan = currentUser && (currentUser.isDeveloper || isOwner || (currentServerDetails && (currentServerDetails.permissions & (1 << 7)) !== 0));
  const canTimeout = currentUser && (currentUser.isDeveloper || isOwner || (currentServerDetails && (currentServerDetails.permissions & (1 << 8)) !== 0));

  const isSelf = currentUser && currentUser.id === member.id;
  const isTargetOwner = member.isOwner;
  const canModerate = !isSelf && !isTargetOwner && (currentUser && (currentUser.isDeveloper || isOwner || member.highestRolePosition < myPos));

  menu.innerHTML = `
    <button type="button" class="member-context-item" id="ctxMentionBtn">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
      <span>Mention</span>
    </button>
    ${!isSelf ? `
    <button type="button" class="member-context-item" id="ctxMessageBtn">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
      <span>Message</span>
    </button>
    ` : ''}
    <button type="button" class="member-context-item" id="ctxProfileBtn">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h10.35c-.22-.63-.35-1.3-.35-2 0-1.47.6-2.79 1.57-3.74C14.35 14.1 13.2 14 12 14zm8 1v-3h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg>
      <span>Profile</span>
    </button>
    ${canModerate && (canTimeout || canKick || canBan) ? `
      <div class="member-context-divider"></div>
      ${canTimeout ? `
      <button type="button" class="member-context-item" id="ctxTimeoutBtn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>
        <span>Timeout Member</span>
      </button>` : ''}
      ${canKick ? `
      <button type="button" class="member-context-item danger" id="ctxKickBtn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Kick Member</span>
      </button>` : ''}
      ${canBan ? `
      <button type="button" class="member-context-item danger" id="ctxBanBtn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>
        <span>Ban Member</span>
      </button>` : ''}
    ` : ''}
  `;

  menu.style.display = 'flex';
  menu.classList.remove('hidden');

  const x = Math.min(e.clientX, window.innerWidth - 210);
  const y = Math.min(e.clientY, window.innerHeight - 260);
  menu.style.left = `${Math.max(10, x)}px`;
  menu.style.top = `${Math.max(10, y)}px`;

  document.getElementById('ctxMentionBtn')?.addEventListener('click', () => {
    closeServerMemberContextMenu();
    const input = document.getElementById('messageInput');
    if (input) {
      input.value += `@${member.displayName || member.username} `;
      input.focus();
    }
  });

  document.getElementById('ctxMessageBtn')?.addEventListener('click', () => {
    closeServerMemberContextMenu();
    if (typeof switchToDmView === 'function') switchToDmView(member);
  });

  document.getElementById('ctxProfileBtn')?.addEventListener('click', () => {
    closeServerMemberContextMenu();
    openUserProfile(member.id, member);
  });

  document.getElementById('ctxTimeoutBtn')?.addEventListener('click', () => {
    closeServerMemberContextMenu();
    if (typeof openModerationModal === 'function') openModerationModal('timeout', member);
  });

  document.getElementById('ctxKickBtn')?.addEventListener('click', () => {
    closeServerMemberContextMenu();
    if (typeof openModerationModal === 'function') openModerationModal('kick', member);
  });

  document.getElementById('ctxBanBtn')?.addEventListener('click', () => {
    closeServerMemberContextMenu();
    if (typeof openModerationModal === 'function') openModerationModal('ban', member);
  });
}

function closeServerMemberContextMenu() {
  const menu = document.getElementById('serverMemberContextMenu');
  if (menu) {
    menu.style.display = 'none';
    menu.classList.add('hidden');
  }
}

function showAssignRolePopup(triggerEl, member) {
  // Simple prompt/picker of available roles
  const assignable = currentServerRoles.filter(r => !r.isDefault && !(member.roles || []).some(mr => mr.id === r.id));
  if (assignable.length === 0) {
    showToast({ icon: 'ℹ️', title: 'Roles', body: 'No other roles available to assign.' });
    return;
  }

  const roleNames = assignable.map((r, i) => `${i + 1}. ${r.name}`).join('\n');
  const pick = prompt(`Select a role to assign to @${member.username}:\n\n${roleNames}\n\nEnter number:`);
  const idx = parseInt(pick, 10) - 1;
  if (!isNaN(idx) && assignable[idx]) {
    assignRoleToMember(member.id, assignable[idx].id);
  }
}

async function assignRoleToMember(userId, roleId) {
  if (!activeServerId || !token) return;
  try {
    const res = await fetch(`/api/servers/${activeServerId}/members/${userId}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roleId })
    });
    if (!res.ok) {
      const data = await res.json();
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to assign role.' });
      return;
    }
    showToast({ icon: '✅', title: 'Role Assigned', body: 'Role updated successfully.' });
    loadServerMembers(activeServerId);
  } catch (err) {
    console.error('Error assigning role:', err);
  }
}

async function removeRoleFromMember(userId, roleId) {
  if (!activeServerId || !token) return;
  try {
    const res = await fetch(`/api/servers/${activeServerId}/members/${userId}/roles/${roleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const data = await res.json();
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to remove role.' });
      return;
    }
    showToast({ icon: '🗑️', title: 'Role Removed', body: 'Role removed from member.' });
    loadServerMembers(activeServerId);
  } catch (err) {
    console.error('Error removing role:', err);
  }
}

// ----------------------------------------------------
// TAB 5 & 6: BANS & AUDIT LOGS IMPLEMENTATION
// ----------------------------------------------------
async function loadServerBans(serverId) {
  if (!serverId || !token) return;
  const container = document.getElementById('serverSettingsBansList');
  if (!container) return;
  container.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">Loading banned users...</div>';

  try {
    const res = await fetch(`/api/servers/${serverId}/bans`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      container.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">You lack permission to view server bans.</div>';
      return;
    }
    const data = await res.json();
    const bans = data.bans || [];

    if (bans.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">No members are currently banned from this server.</div>';
      return;
    }

    container.innerHTML = '';
    bans.forEach(ban => {
      const row = document.createElement('div');
      row.className = 'server-member-row';
      row.innerHTML = `
        <div class="member-user-cell">
          <div class="member-avatar-thumb">${(ban.displayName || ban.username || 'U')[0].toUpperCase()}</div>
          <div class="member-name-block">
            <div class="member-disp-name">${escapeHtml(ban.displayName || ban.username)}</div>
            <div class="member-user-handle">@${escapeHtml(ban.username)} &bull; Reason: ${escapeHtml(ban.reason || 'None provided')}</div>
          </div>
        </div>
        <div>
          <button type="button" class="secondary-btn btn-sm unban-btn">Unban</button>
        </div>
      `;

      row.querySelector('.unban-btn').addEventListener('click', async () => {
        if (confirm(`Revoke ban for @${ban.username}?`)) {
          await unbanServerMember(ban.userId);
        }
      });

      container.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading bans:', err);
  }
}

async function unbanServerMember(userId) {
  if (!activeServerId || !token) return;
  try {
    const res = await fetch(`/api/servers/${activeServerId}/bans/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const data = await res.json();
      showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to unban user.' });
      return;
    }
    showToast({ icon: '✅', title: 'Unbanned', body: 'Member has been unbanned.' });
    loadServerBans(activeServerId);
  } catch (err) {
    console.error('Error unbanning user:', err);
  }
}

async function loadServerAuditLogs(serverId) {
  if (!serverId || !token) return;
  const container = document.getElementById('serverSettingsAuditList');
  if (!container) return;
  container.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">Loading audit entries...</div>';

  try {
    const res = await fetch(`/api/servers/${serverId}/audit-logs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      container.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">You lack permission to view the audit log.</div>';
      return;
    }
    const data = await res.json();
    const logs = data.logs || [];

    if (logs.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">No audit entries recorded yet.</div>';
      return;
    }

    container.innerHTML = '';
    logs.forEach(log => {
      const item = document.createElement('div');
      item.className = 'audit-log-item';
      const timeStr = new Date(log.createdAt).toLocaleString();

      item.innerHTML = `
        <span class="audit-action-tag">${escapeHtml(log.action)}</span>
        <div class="audit-details-wrap">
          <div class="audit-actor-line">
            <strong>${escapeHtml(log.actorDisplayName || log.actorUsername || 'System')}</strong> performed action ${escapeHtml(log.action)}
            ${log.reason ? ` &bull; <em>Reason: ${escapeHtml(log.reason)}</em>` : ''}
          </div>
          <div class="audit-time-line">${timeStr}</div>
          ${log.changes && Object.keys(log.changes).length > 0 ? `<div class="audit-changes-json">${escapeHtml(JSON.stringify(log.changes, null, 2))}</div>` : ''}
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading audit log:', err);
  }
}

// ----------------------------------------------------
// MODERATION MODAL (TIMEOUT / KICK / BAN)
// ----------------------------------------------------
function openModerationModal(actionType, targetMember) {
  pendingModerationAction = { type: actionType, targetUser: targetMember };
  const modal = document.getElementById('serverModerationModalOverlay');
  const titleEl = document.getElementById('serverModerationModalTitle');
  const targetEl = document.getElementById('serverModerationModalTarget');
  const durationGroup = document.getElementById('serverTimeoutDurationGroup');
  const reasonInput = document.getElementById('serverModerationReasonInput');
  const errEl = document.getElementById('serverModerationError');

  if (errEl) errEl.textContent = '';
  if (reasonInput) reasonInput.value = '';

  if (actionType === 'timeout') {
    if (titleEl) titleEl.textContent = 'Timeout Member';
    if (targetEl) targetEl.textContent = `Temporarily prevent @${targetMember.username} from chatting and speaking.`;
    if (durationGroup) durationGroup.classList.remove('hidden');
  } else if (actionType === 'kick') {
    if (titleEl) titleEl.textContent = 'Kick Member';
    if (targetEl) targetEl.textContent = `Remove @${targetMember.username} from this server. They may rejoin with a code.`;
    if (durationGroup) durationGroup.classList.add('hidden');
  } else if (actionType === 'ban') {
    if (titleEl) titleEl.textContent = 'Ban Member';
    if (targetEl) targetEl.textContent = `Permanently ban @${targetMember.username} from this server.`;
    if (durationGroup) durationGroup.classList.add('hidden');
  }

  if (modal) modal.classList.remove('hidden');
}

async function submitModerationAction() {
  if (!activeServerId || !pendingModerationAction || !token) return;
  const { type, targetUser } = pendingModerationAction;
  const reasonInput = document.getElementById('serverModerationReasonInput');
  const durationSelect = document.getElementById('serverTimeoutDurationSelect');
  const reason = reasonInput ? reasonInput.value.trim() : '';

  try {
    let url = `/api/servers/${activeServerId}/members/${targetUser.id}/${type}`;
    let bodyData = { reason };
    if (type === 'timeout') {
      bodyData.durationSeconds = durationSelect ? parseInt(durationSelect.value, 10) : 300;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();
    if (!res.ok) {
      const errEl = document.getElementById('serverModerationError');
      if (errEl) errEl.textContent = data.error || 'Moderation action failed.';
      return;
    }

    showToast({ icon: '🛡️', title: 'Moderation Action Applied', body: `Successfully executed ${type} for @${targetUser.username}.` });
    const modal = document.getElementById('serverModerationModalOverlay');
    if (modal) modal.classList.add('hidden');
    pendingModerationAction = null;
    loadServerMembers(activeServerId);
  } catch (err) {
    console.error('Moderation error:', err);
  }
}

// ----------------------------------------------------
// BIND ALL SERVER SETTINGS EVENT CONTROLS
// ----------------------------------------------------
function bindServerSettingsControls() {
  // Server header banner dropdown trigger
  const trigger = document.getElementById('serverBannerDropdownTrigger');
  const dropdownMenu = document.getElementById('serverHeaderDropdownMenu');
  const chevron = document.getElementById('serverHeaderDropdownChevron');

  if (trigger && dropdownMenu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdownMenu.classList.contains('hidden');
      dropdownMenu.classList.toggle('hidden', !isHidden);
      if (chevron) chevron.classList.toggle('open', isHidden);
    });

    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
        if (chevron) chevron.classList.remove('open');
      }
    });
  }

  // Dropdown buttons
  const dropdownSettingsBtn = document.getElementById('serverDropdownSettingsBtn');
  if (dropdownSettingsBtn) {
    dropdownSettingsBtn.addEventListener('click', () => {
      if (dropdownMenu) dropdownMenu.classList.add('hidden');
      if (chevron) chevron.classList.remove('open');
      openServerSettingsModal('overview');
    });
  }

  const dropdownCreateChanBtn = document.getElementById('serverDropdownCreateChannelBtn');
  if (dropdownCreateChanBtn) {
    dropdownCreateChanBtn.addEventListener('click', () => {
      if (dropdownMenu) dropdownMenu.classList.add('hidden');
      if (chevron) chevron.classList.remove('open');
      const createChanModal = document.getElementById('createChannelModalOverlay');
      if (createChanModal) createChanModal.classList.remove('hidden');
    });
  }

  // Quick Invite button in header
  const headerInviteBtn = document.getElementById('serverHeaderInviteBtn');
  if (headerInviteBtn) {
    headerInviteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdownMenu) dropdownMenu.classList.add('hidden');
      if (chevron) chevron.classList.remove('open');
      openServerInviteModal();
    });
  }

  // Dropdown Invite People button
  const dropdownInviteBtn = document.getElementById('serverDropdownInviteBtn');
  if (dropdownInviteBtn) {
    dropdownInviteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdownMenu) dropdownMenu.classList.add('hidden');
      if (chevron) chevron.classList.remove('open');
      openServerInviteModal();
    });
  }

  // Invite Modal Controls
  const inviteModal = document.getElementById('serverInviteModalOverlay');
  const closeInviteBtn = document.getElementById('closeServerInviteModalBtn');
  const copyInviteBtn = document.getElementById('serverInviteCopyBtn');
  const regenInviteBtn = document.getElementById('serverInviteRegenBtn');

  if (closeInviteBtn && inviteModal) {
    closeInviteBtn.addEventListener('click', () => {
      inviteModal.classList.add('hidden');
    });
  }

  if (copyInviteBtn) {
    copyInviteBtn.addEventListener('click', handleCopyServerInviteCode);
  }

  if (regenInviteBtn) {
    regenInviteBtn.addEventListener('click', handleRegenerateServerInviteCode);
  }

  if (inviteModal) {
    inviteModal.addEventListener('click', (e) => {
      if (e.target === inviteModal) {
        inviteModal.classList.add('hidden');
      }
    });
  }

  const dropdownCopyCodeBtn = document.getElementById('serverDropdownCopyCodeBtn');
  if (dropdownCopyCodeBtn) {
    dropdownCopyCodeBtn.addEventListener('click', () => {
      const curServer = servers.find(s => s.id === activeServerId);
      if (curServer && curServer.joinCode) {
        navigator.clipboard.writeText(curServer.joinCode).then(() => {
          showToast({ icon: '📋', title: 'Code Copied', body: `Server join code ${curServer.joinCode} copied!` });
        });
      }
      if (dropdownMenu) dropdownMenu.classList.add('hidden');
      if (chevron) chevron.classList.remove('open');
    });
  }

  const dropdownLeaveBtn = document.getElementById('serverDropdownLeaveBtn');
  if (dropdownLeaveBtn) {
    dropdownLeaveBtn.addEventListener('click', async () => {
      if (dropdownMenu) dropdownMenu.classList.add('hidden');
      if (chevron) chevron.classList.remove('open');
      if (!activeServerId || !token) return;
      if (!confirm('Are you sure you want to leave this server?')) return;

      try {
        const res = await fetch(`/api/servers/${activeServerId}/leave`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showToast({ icon: '👋', title: 'Left Server', body: 'You have left the server.' });
          servers = servers.filter(s => s.id !== activeServerId);
          renderServerList();
          if (servers.length > 0) selectServer(servers[0].id);
          else showNoServersState();
        } else {
          const data = await res.json();
          showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to leave server.' });
        }
      } catch (err) {
        console.error('Error leaving server:', err);
      }
    });
  }

  // Server Settings Modal Close & ESC
  const closeBtn = document.getElementById('closeServerSettingsBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeServerSettingsModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('serverSettingsModalOverlay');
      if (modal && !modal.classList.contains('hidden')) {
        closeServerSettingsModal();
      }
      const modModal = document.getElementById('serverModerationModalOverlay');
      if (modModal && !modModal.classList.contains('hidden')) {
        modModal.classList.add('hidden');
      }
      const editChanModal = document.getElementById('editChannelModalOverlay');
      if (editChanModal && !editChanModal.classList.contains('hidden')) {
        editChanModal.classList.add('hidden');
      }
    }
  });

  // Settings Sidebar Tab Navigation
  ['Overview', 'Roles', 'Channels', 'Members', 'Bans', 'Audit'].forEach(t => {
    const btn = document.getElementById(`serverTab${t}`);
    if (btn) {
      btn.addEventListener('click', () => {
        switchServerSettingsTab(t.toLowerCase());
      });
    }
  });

  // Delete Server tab button
  const deleteServerBtn = document.getElementById('serverTabDeleteServer');
  if (deleteServerBtn) {
    deleteServerBtn.addEventListener('click', async () => {
      if (!activeServerId || !token) return;
      if (!confirm(`Are you absolutely sure you want to delete "${currentServerDetails.name}"? All channels, messages, and roles will be permanently deleted.`)) {
        return;
      }

      try {
        const res = await fetch(`/api/servers/${activeServerId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showToast({ icon: '🗑️', title: 'Server Deleted', body: 'The server has been permanently deleted.' });
          closeServerSettingsModal();
          servers = servers.filter(s => s.id !== activeServerId);
          renderServerList();
          if (servers.length > 0) selectServer(servers[0].id);
          else showNoServersState();
        } else {
          const data = await res.json();
          showToast({ icon: '❌', title: 'Error', body: data.error || 'Failed to delete server.' });
        }
      } catch (err) {
        console.error('Error deleting server:', err);
      }
    });
  }

  // Overview inputs & Save Notice
  const nameInput = document.getElementById('serverOverviewNameInput');
  const descInput = document.getElementById('serverOverviewDescInput');
  if (nameInput) nameInput.addEventListener('input', markServerOverviewChanged);
  if (descInput) descInput.addEventListener('input', markServerOverviewChanged);

  const resetBtn = document.getElementById('serverOverviewResetBtn');
  if (resetBtn) resetBtn.addEventListener('click', loadServerOverviewData);

  const saveBtn = document.getElementById('serverOverviewSaveBtn');
  if (saveBtn) saveBtn.addEventListener('click', saveServerOverviewChanges);

  // Icon upload & remove
  const uploadIconBtn = document.getElementById('serverIconUploadBtn');
  const fileInput = document.getElementById('serverIconFileInput');
  if (uploadIconBtn && fileInput) {
    uploadIconBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast({ icon: '⚠️', title: 'File Too Large', body: 'Maximum server icon size is 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        pendingServerOverviewChanges.iconBase64 = base64;
        pendingServerOverviewChanges.iconFilename = file.name;
        delete pendingServerOverviewChanges.removeIcon;

        const preview = document.getElementById('serverOverviewIconPreview');
        if (preview) {
          preview.textContent = '';
          preview.style.backgroundImage = `url('${base64}')`;
        }
        const removeBtn = document.getElementById('serverIconRemoveBtn');
        if (removeBtn) removeBtn.classList.remove('hidden');
        markServerOverviewChanged();
      };
      reader.readAsDataURL(file);
    });
  }

  const removeIconBtn = document.getElementById('serverIconRemoveBtn');
  if (removeIconBtn) {
    removeIconBtn.addEventListener('click', () => {
      pendingServerOverviewChanges.removeIcon = true;
      delete pendingServerOverviewChanges.iconBase64;
      delete pendingServerOverviewChanges.iconFilename;

      const preview = document.getElementById('serverOverviewIconPreview');
      if (preview) {
        preview.textContent = (currentServerDetails.name || 'V')[0].toUpperCase();
        preview.style.backgroundImage = 'none';
      }
      removeIconBtn.classList.add('hidden');
      markServerOverviewChanged();
    });
  }

  // Copy code inside Overview
  const copyCodeBtn = document.getElementById('serverOverviewCopyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      if (currentServerDetails && currentServerDetails.joinCode) {
        navigator.clipboard.writeText(currentServerDetails.joinCode).then(() => {
          showToast({ icon: '📋', title: 'Code Copied', body: 'Join code copied to clipboard!' });
        });
      }
    });
  }

  // Roles Tab Actions
  const createRoleBtn = document.getElementById('createRoleBtn');
  if (createRoleBtn) createRoleBtn.addEventListener('click', handleCreateNewRole);

  const saveRoleBtn = document.getElementById('saveRoleBtn');
  if (saveRoleBtn) saveRoleBtn.addEventListener('click', saveCurrentRole);

  const delRoleBtn = document.getElementById('deleteRoleBtn');
  if (delRoleBtn) delRoleBtn.addEventListener('click', handleDeleteCurrentRole);

  const roleNameInput = document.getElementById('roleEditNameInput');
  const roleColorInput = document.getElementById('roleColorInput');
  const previewBadge = document.getElementById('roleColorPreviewBadge');

  if (roleNameInput && previewBadge) {
    roleNameInput.addEventListener('input', () => {
      previewBadge.textContent = roleNameInput.value || 'Role Preview';
    });
  }

  if (roleColorInput && previewBadge) {
    roleColorInput.addEventListener('input', () => {
      previewBadge.style.backgroundColor = roleColorInput.value;
    });
  }

  // Channels Tab: Add Channel Button
  const addChanBtn = document.getElementById('serverSettingsAddChannelBtn');
  if (addChanBtn) {
    addChanBtn.addEventListener('click', () => {
      const createChanModal = document.getElementById('createChannelModalOverlay');
      if (createChanModal) {
        createChanModal.classList.remove('hidden');
        selectedChannelType = 'text';
        const typeTextBtn = document.getElementById('typeTextBtn');
        const typeVoiceBtn = document.getElementById('typeVoiceBtn');
        if (typeTextBtn) typeTextBtn.classList.add('active');
        if (typeVoiceBtn) typeVoiceBtn.classList.remove('active');
        const chanInput = document.getElementById('channelNameInput');
        if (chanInput) {
          chanInput.value = '';
          chanInput.focus();
        }
      }
    });
  }

  // Edit Channel Modal
  const editChanForm = document.getElementById('editChannelForm');
  const cancelEditChanBtn = document.getElementById('cancelEditChannelBtn');
  if (cancelEditChanBtn) {
    cancelEditChanBtn.addEventListener('click', () => {
      const modal = document.getElementById('editChannelModalOverlay');
      if (modal) modal.classList.add('hidden');
      pendingChannelEditId = null;
    });
  }

  if (editChanForm) {
    editChanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!activeServerId || !pendingChannelEditId || !token) return;

      const nameInput = document.getElementById('editChannelNameInput');
      const topicInput = document.getElementById('editChannelTopicInput');
      const errEl = document.getElementById('editChannelError');

      const name = nameInput ? nameInput.value.trim() : '';
      const topic = topicInput ? topicInput.value.trim() : '';

      try {
        const res = await fetch(`/api/servers/${activeServerId}/channels/${pendingChannelEditId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, topic })
        });

        const data = await res.json();
        if (!res.ok) {
          if (errEl) errEl.textContent = data.error || 'Failed to update channel.';
          return;
        }

        const modal = document.getElementById('editChannelModalOverlay');
        if (modal) modal.classList.add('hidden');
        pendingChannelEditId = null;

        showToast({ icon: '✅', title: 'Channel Updated', body: `Channel #${data.channel.name} updated.` });
        loadChannels(activeServerId).then(loadServerChannelsTable);
      } catch (err) {
        console.error('Error saving channel:', err);
      }
    });
  }

  // Members search input
  const membersSearch = document.getElementById('serverMembersSearchInput');
  if (membersSearch) {
    membersSearch.addEventListener('input', renderServerMembersList);
  }

  // Moderation form
  const modForm = document.getElementById('serverModerationForm');
  const cancelModBtn = document.getElementById('cancelServerModerationBtn');
  if (cancelModBtn) {
    cancelModBtn.addEventListener('click', () => {
      const modal = document.getElementById('serverModerationModalOverlay');
      if (modal) modal.classList.add('hidden');
      pendingModerationAction = null;
    });
  }

  if (modForm) {
    modForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitModerationAction();
    });
  }
}

initPromoBanner();
bindFeedbackForumControls();
bindNotificationCenterControls();
bindUserStatusSystemControls();
bindMobileNavControls();
bindAppSettingsControls();
bindDeveloperSettingsControls();
bindAnimationSettingsControls();
bindTypingSoundSettingsControls();
bindThemeControls();
bindEmojiPickerControls();
bindGifPickerControls();
bindVoiceSettingsControls();
bindServerSettingsControls();

function bindServerMembersSidebarControls() {
  const toggleBtn = document.getElementById('chatMemberListToggleBtn');
  const sidebar = document.getElementById('serverMembersSidebar');
  const searchInput = document.getElementById('chatHeaderSearchInput');

  // Load saved preference (defaults to true/visible)
  const savedVisible = localStorage.getItem('voiceline_member_sidebar_visible');
  if (savedVisible === 'false' && sidebar && toggleBtn) {
    sidebar.classList.add('hidden');
    toggleBtn.classList.remove('active');
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = sidebar.classList.toggle('hidden');
      toggleBtn.classList.toggle('active', !isHidden);
      localStorage.setItem('voiceline_member_sidebar_visible', (!isHidden).toString());
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderServerMembersSidebar();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        renderServerMembersSidebar();
        searchInput.blur();
      }
    });
  }

  // Dismiss context menu
  window.addEventListener('click', (e) => {
    const menu = document.getElementById('serverMemberContextMenu');
    if (menu && !menu.contains(e.target)) {
      closeServerMemberContextMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeServerMemberContextMenu();
    }
  });
}
bindServerMembersSidebarControls();

// Boot check
checkCurrentSession();

// ====================================================
// VOICELINE GITHUB AUTO-UPDATE & DESKTOP SYSTEM
// ====================================================
let appLatestUpdateInfo = null;
let appUpdateDownloadInProgress = false;
let appUpdateDownloadedFilePath = null;
let lastCheckedUpdateTime = null;
const CURRENT_APP_VERSION = '1.0.0';
const GITHUB_REPO_URL = 'https://github.com/voiceline-diskrep/voiceline1';

function formatUpdateCheckTime(d) {
  if (!d) return 'Never checked';
  try {
    return 'Checked ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Checked moments ago';
  }
}

function handleUpdateDetected(info) {
  if (!info || !info.hasUpdate) return;
  appLatestUpdateInfo = info;
  lastCheckedUpdateTime = new Date();

  // Show top-right update indicator buttons across all layouts
  const updateBtns = [
    document.getElementById('chatUpdateBtn'),
    document.getElementById('friendsUpdateBtn'),
    document.getElementById('dmUpdateBtn')
  ];

  updateBtns.forEach(btn => {
    if (btn) {
      btn.classList.remove('hidden');
      btn.title = `Update Ready: v${info.latestVersion}! Click to install`;
      const textEl = btn.querySelector('.top-update-text');
      if (textEl) textEl.textContent = `v${info.latestVersion} Ready`;
    }
  });

  // Show dot on settings tab
  const settingsDot = document.getElementById('settingsUpdateDot');
  if (settingsDot) settingsDot.classList.remove('hidden');

  // Update Settings UI if currently visible
  renderUpdatesSettingsUI();

  // Show toast notification
  if (typeof showToast === 'function') {
    showToast({
      icon: '🚀',
      title: 'Update Available',
      body: `Voiceline v${info.latestVersion} is ready to install! Click the top-right button to update.`
    });
  }
}

async function checkAppUpdates(isManual = false) {
  const checkBtn = document.getElementById('settingsCheckUpdatesBtn');
  if (checkBtn) {
    checkBtn.disabled = true;
    checkBtn.textContent = 'Checking GitHub...';
  }

  try {
    let result = null;
    if (window.electronDesktop && window.electronDesktop.checkForUpdates) {
      result = await window.electronDesktop.checkForUpdates();
    } else {
      // Direct Web Fallback (checks GitHub Releases API directly)
      const res = await fetch('https://api.github.com/repos/voiceline-diskrep/voiceline1/releases/latest', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (res.status === 404) {
        result = { hasUpdate: false, currentVersion: CURRENT_APP_VERSION, message: 'You are on the latest version of Voiceline!' };
      } else if (res.ok) {
        const release = await res.json();
        const tag = (release.tag_name || '').replace(/^v/i, '');
        const hasUpdate = isNewerClientVersion(tag, CURRENT_APP_VERSION);
        const assets = Array.isArray(release.assets) ? release.assets : [];
        const exeAsset = assets.find(a => /\.exe$/i.test(a.name));
        result = {
          hasUpdate,
          currentVersion: CURRENT_APP_VERSION,
          latestVersion: tag,
          releaseNotes: release.body || '',
          downloadUrl: exeAsset ? exeAsset.browser_download_url : release.html_url,
          isDirectExe: Boolean(exeAsset),
          githubReleaseUrl: release.html_url
        };
      }
    }

    lastCheckedUpdateTime = new Date();

    if (result && result.hasUpdate) {
      handleUpdateDetected(result);
      if (isManual) {
        openAppUpdateModal();
      }
    } else {
      renderUpdatesSettingsUI();
      if (isManual && typeof showToast === 'function') {
        showToast({
          icon: '✅',
          title: 'Up to Date',
          body: `Voiceline is already running the latest version (v${(result && result.currentVersion) || CURRENT_APP_VERSION}).`
        });
      }
    }
  } catch (err) {
    console.warn('Update check failed:', err);
    if (isManual && typeof showToast === 'function') {
      showToast({
        icon: '⚠️',
        title: 'Check Failed',
        body: 'Could not reach GitHub. Please check your internet connection.'
      });
    }
  } finally {
    if (checkBtn) {
      checkBtn.disabled = false;
      checkBtn.textContent = 'Check for Updates';
    }
  }
}

function isNewerClientVersion(latest, current) {
  if (!latest || !current) return false;
  const l = latest.replace(/^v/i, '').split('.').map(Number);
  const c = current.replace(/^v/i, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const lPart = l[i] || 0;
    const cPart = c[i] || 0;
    if (lPart > cPart) return true;
    if (lPart < cPart) return false;
  }
  return false;
}

function openAppUpdateModal() {
  const overlay = document.getElementById('appUpdateModalOverlay');
  if (!overlay) return;

  const currentPill = document.getElementById('updateCurrentVersionPill');
  const latestPill = document.getElementById('updateLatestVersionPill');
  const notesContent = document.getElementById('updateNotesContent');
  const progressWrap = document.getElementById('updateProgressWrap');
  const startBtn = document.getElementById('startUpdateBtn');
  const restartBtn = document.getElementById('restartUpdateBtn');

  const curVer = (appLatestUpdateInfo && appLatestUpdateInfo.currentVersion) || CURRENT_APP_VERSION;
  const latVer = (appLatestUpdateInfo && appLatestUpdateInfo.latestVersion) || curVer;

  if (currentPill) currentPill.textContent = `Current: v${curVer}`;
  if (latestPill) latestPill.textContent = `Latest: v${latVer}`;
  if (notesContent) {
    notesContent.textContent = (appLatestUpdateInfo && appLatestUpdateInfo.releaseNotes) || 'Bug fixes, performance improvements, and real-time updates.';
  }

  if (progressWrap) progressWrap.classList.add('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
  if (startBtn) {
    startBtn.classList.remove('hidden');
    startBtn.disabled = false;
    startBtn.textContent = 'Download & Install';
  }

  overlay.classList.remove('hidden');
}

function closeAppUpdateModal() {
  const overlay = document.getElementById('appUpdateModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

async function startAppUpdateDownload() {
  if (!appLatestUpdateInfo || !appLatestUpdateInfo.downloadUrl) {
    window.open(`${GITHUB_REPO_URL}/releases/latest`, '_blank');
    return;
  }

  const startBtn = document.getElementById('startUpdateBtn');
  const progressWrap = document.getElementById('updateProgressWrap');
  const progressLabel = document.getElementById('updateProgressLabel');
  const progressFill = document.getElementById('updateProgressBarFill');
  const progressPercent = document.getElementById('updateProgressPercent');
  const restartBtn = document.getElementById('restartUpdateBtn');

  // If in web browser or not direct exe, open in external browser
  if (!window.electronDesktop || !appLatestUpdateInfo.isDirectExe) {
    if (window.electronDesktop && window.electronDesktop.openExternalUrl) {
      window.electronDesktop.openExternalUrl(appLatestUpdateInfo.downloadUrl);
    } else {
      window.open(appLatestUpdateInfo.downloadUrl, '_blank');
    }
    closeAppUpdateModal();
    return;
  }

  // Native Electron download
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = 'Downloading...';
  }
  if (progressWrap) progressWrap.classList.remove('hidden');
  if (progressFill) progressFill.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
  if (progressLabel) progressLabel.textContent = 'Downloading update from GitHub...';

  appUpdateDownloadInProgress = true;

  try {
    const res = await window.electronDesktop.startUpdateDownload(appLatestUpdateInfo.downloadUrl);
    if (res && res.success) {
      appUpdateDownloadedFilePath = res.filePath;
      if (progressFill) progressFill.style.width = '100%';
      if (progressPercent) progressPercent.textContent = '100%';
      if (progressLabel) progressLabel.textContent = 'Download complete! Ready to restart.';
      if (startBtn) startBtn.classList.add('hidden');
      if (restartBtn) restartBtn.classList.remove('hidden');
    } else {
      throw new Error((res && res.error) || 'Failed to download installer');
    }
  } catch (err) {
    console.error('Download error:', err);
    if (progressLabel) progressLabel.textContent = `Error: ${err.message}`;
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = 'Retry Download';
    }
  } finally {
    appUpdateDownloadInProgress = false;
  }
}

function handleUpdateDownloadProgress(progress) {
  if (!progress) return;
  const progressFill = document.getElementById('updateProgressBarFill');
  const progressPercent = document.getElementById('updateProgressPercent');
  const progressLabel = document.getElementById('updateProgressLabel');

  const percent = progress.percent || 0;
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressPercent) progressPercent.textContent = `${percent}%`;

  if (progressLabel && progress.total > 0) {
    const mbDownloaded = (progress.transferred / 1048576).toFixed(1);
    const mbTotal = (progress.total / 1048576).toFixed(1);
    progressLabel.textContent = `Downloading: ${mbDownloaded} MB / ${mbTotal} MB (${percent}%)`;
  }
}

async function restartAndInstallAppUpdate() {
  if (!window.electronDesktop || !window.electronDesktop.installUpdate) return;
  try {
    await window.electronDesktop.installUpdate(appUpdateDownloadedFilePath);
  } catch (err) {
    alert('Failed to launch installer: ' + err.message);
  }
}

async function renderUpdatesSettingsUI() {
  const versionDisplay = document.getElementById('settingsCurrentVersionDisplay');
  const statusBox = document.getElementById('settingsUpdateStatusBox');
  const statusText = document.getElementById('settingsUpdateStatusText');
  const checkTime = document.getElementById('settingsUpdateCheckTime');
  const addressInput = document.getElementById('settingsServerAddressInput');
  const connPill = document.getElementById('settingsServerConnPill');

  let curVer = CURRENT_APP_VERSION;
  if (window.electronDesktop && window.electronDesktop.getAppVersion) {
    try {
      curVer = await window.electronDesktop.getAppVersion();
    } catch {}
  }

  if (versionDisplay) versionDisplay.textContent = `v${curVer}`;
  if (checkTime) checkTime.textContent = formatUpdateCheckTime(lastCheckedUpdateTime);

  // Status box text
  if (statusText) {
    if (appLatestUpdateInfo && appLatestUpdateInfo.hasUpdate) {
      statusText.innerHTML = `
        <span class="status-choice-dot status-idle"></span>
        <span style="color: #23a55a; font-weight: 600;">Update Available: v${escapeHtml(appLatestUpdateInfo.latestVersion)}</span>
        <button type="button" class="primary-btn green-btn" id="settingsInlineUpdateBtn" style="padding: 2px 10px; font-size: 11px; margin-left: 8px;">View Update</button>
      `;
      const inlineBtn = document.getElementById('settingsInlineUpdateBtn');
      if (inlineBtn) inlineBtn.addEventListener('click', openAppUpdateModal);
    } else {
      statusText.innerHTML = `
        <span class="status-choice-dot status-online"></span>
        <span>You are currently running the latest version!</span>
      `;
    }
  }

  // Populate Server Address
  if (addressInput && !addressInput.value) {
    if (window.electronDesktop && window.electronDesktop.getServerUrl) {
      try {
        const sUrl = await window.electronDesktop.getServerUrl();
        if (sUrl) addressInput.value = sUrl;
      } catch {}
    } else if (window.VOICELINE_SERVER_URL) {
      addressInput.value = window.VOICELINE_SERVER_URL;
    } else {
      addressInput.value = window.location.origin;
    }
  }

  if (connPill) {
    const isOnline = Boolean(window.ws && window.ws.readyState === WebSocket.OPEN);
    if (isOnline) {
      connPill.className = 'settings-conn-pill connected';
      connPill.textContent = '🟢 Connected';
    } else {
      connPill.className = 'settings-conn-pill error';
      connPill.textContent = '🔴 Disconnected';
    }
  }
}

function bindAppUpdateControls() {
  // 1. Top-Right Update Badges
  const topUpdateBtns = [
    document.getElementById('chatUpdateBtn'),
    document.getElementById('friendsUpdateBtn'),
    document.getElementById('dmUpdateBtn')
  ];

  topUpdateBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        openAppUpdateModal();
      });
    }
  });

  // 2. Update Modal Controls
  const closeBtn = document.getElementById('closeUpdateModalBtn');
  const cancelBtn = document.getElementById('cancelUpdateModalBtn');
  const startBtn = document.getElementById('startUpdateBtn');
  const restartBtn = document.getElementById('restartUpdateBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeAppUpdateModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeAppUpdateModal);
  if (startBtn) startBtn.addEventListener('click', startAppUpdateDownload);
  if (restartBtn) restartBtn.addEventListener('click', restartAndInstallAppUpdate);

  // Close modal when clicking backdrop
  const modalOverlay = document.getElementById('appUpdateModalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeAppUpdateModal();
    });
  }

  // 3. Settings Updates Controls
  const checkBtn = document.getElementById('settingsCheckUpdatesBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      checkAppUpdates(true);
    });
  }

  const viewReleasesBtn = document.getElementById('settingsViewReleasesBtn');
  if (viewReleasesBtn) {
    viewReleasesBtn.addEventListener('click', () => {
      const url = `${GITHUB_REPO_URL}/releases`;
      if (window.electronDesktop && window.electronDesktop.openExternalUrl) {
        window.electronDesktop.openExternalUrl(url);
      } else {
        window.open(url, '_blank');
      }
    });
  }

  // 4. Save Server Address Control
  const saveServerBtn = document.getElementById('settingsSaveServerAddressBtn');
  const addressInput = document.getElementById('settingsServerAddressInput');
  if (saveServerBtn && addressInput) {
    saveServerBtn.addEventListener('click', async () => {
      const val = addressInput.value.trim();
      if (!val) {
        alert('Please enter a valid server address.');
        return;
      }

      saveServerBtn.disabled = true;
      saveServerBtn.textContent = 'Saving...';

      if (window.electronDesktop && window.electronDesktop.setServerUrl) {
        await window.electronDesktop.setServerUrl(val);
      } else {
        localStorage.setItem('voiceline_server_override', val);
        window.location.reload();
      }
    });
  }

  const fetchGitHubBtn = document.getElementById('settingsFetchGitHubServerBtn');
  if (fetchGitHubBtn && addressInput) {
    fetchGitHubBtn.addEventListener('click', async () => {
      fetchGitHubBtn.disabled = true;
      fetchGitHubBtn.textContent = 'Detecting...';
      try {
        const liveUrl = await window.fetchLiveServerUrlFromGitHub();
        if (liveUrl) {
          addressInput.value = liveUrl;
          if (window.electronDesktop && window.electronDesktop.setServerUrl) {
            await window.electronDesktop.setServerUrl(liveUrl);
          } else {
            localStorage.setItem('voiceline_server_override', liveUrl);
            window.location.reload();
          }
          fetchGitHubBtn.textContent = '✅ Connected!';
          setTimeout(() => {
            fetchGitHubBtn.textContent = '🔄 Auto-Detect from GitHub';
            fetchGitHubBtn.disabled = false;
          }, 2000);
          return;
        }
        alert('Server link not found or host appears to be offline on GitHub.\nPlease ensure the host has started the server.');
      } catch (e) {
        alert('Could not fetch from GitHub: ' + e.message);
      }
      fetchGitHubBtn.textContent = '🔄 Auto-Detect from GitHub';
      fetchGitHubBtn.disabled = false;
    });
  }

  // 5. Electron IPC listeners
  if (window.electronDesktop) {
    if (window.electronDesktop.onUpdateAvailable) {
      window.electronDesktop.onUpdateAvailable((info) => {
        handleUpdateDetected(info);
      });
    }

    if (window.electronDesktop.onUpdateDownloadProgress) {
      window.electronDesktop.onUpdateDownloadProgress((progress) => {
        handleUpdateDownloadProgress(progress);
      });
    }

    if (window.electronDesktop.onTriggerCheckUpdates) {
      window.electronDesktop.onTriggerCheckUpdates(() => {
        if (typeof openAppSettingsModal === 'function') {
          openAppSettingsModal('updates');
        }
        checkAppUpdates(true);
      });
    }
  }

  // 6. Automatic check on launch (3 seconds after start)
  setTimeout(() => {
    checkAppUpdates(false);
  }, 2500);
}

// Initialize updater system
bindAppUpdateControls();

// ==========================================
// PINNED MESSAGES CONTROLLER
// ==========================================
const pinnedMessagesModalOverlay = document.getElementById('pinnedMessagesModalOverlay');
const closePinnedModalBtn = document.getElementById('closePinnedModalBtn');
const pinnedMessagesList = document.getElementById('pinnedMessagesList');
const pinnedMessagesLoading = document.getElementById('pinnedMessagesLoading');
const pinnedMessagesEmpty = document.getElementById('pinnedMessagesEmpty');
const pinnedModalTitle = document.getElementById('pinnedModalTitle');
const chatPinnedBtn = document.getElementById('chatPinnedBtn');
const dmPinnedBtn = document.getElementById('dmPinnedBtn');

let currentPinnedContext = { isDm: false, targetId: null };

async function openPinnedMessagesModal(isDm = false) {
  if (!pinnedMessagesModalOverlay) return;
  currentPinnedContext = {
    isDm,
    targetId: isDm ? (activeDmFriend ? activeDmFriend.id : null) : activeChannelId
  };

  if (!currentPinnedContext.targetId) {
    showToast({ icon: '📌', title: 'Pins', body: 'Please select a channel or direct message first.' });
    return;
  }

  if (pinnedModalTitle) {
    pinnedModalTitle.textContent = isDm
      ? `Pinned Messages - @${activeDmFriend.displayName || activeDmFriend.username}`
      : `Pinned Messages - #${currentChannelName || 'channel'}`;
  }

  pinnedMessagesModalOverlay.classList.remove('hidden');
  await loadPinnedMessages();
}

function closePinnedMessagesModal() {
  if (pinnedMessagesModalOverlay) {
    pinnedMessagesModalOverlay.classList.add('hidden');
  }
}

async function loadPinnedMessages() {
  if (!pinnedMessagesList) return;
  if (pinnedMessagesLoading) pinnedMessagesLoading.classList.remove('hidden');
  if (pinnedMessagesEmpty) pinnedMessagesEmpty.classList.add('hidden');
  pinnedMessagesList.innerHTML = '';

  const { isDm, targetId } = currentPinnedContext;
  const url = isDm ? `/api/dms/${targetId}/pins` : `/api/channels/${targetId}/pins`;

  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (pinnedMessagesLoading) pinnedMessagesLoading.classList.add('hidden');

    if (!res.ok) {
      pinnedMessagesList.innerHTML = `<div class="pinned-empty"><p style="color:var(--text-danger);">${escapeHtml(data.error || 'Failed to load pinned messages.')}</p></div>`;
      return;
    }

    const pins = data.pinned || [];
    if (pins.length === 0) {
      if (pinnedMessagesEmpty) pinnedMessagesEmpty.classList.remove('hidden');
      return;
    }

    pins.forEach(pin => {
      const pinCard = document.createElement('div');
      pinCard.className = 'pinned-message-card';
      pinCard.setAttribute('data-pin-id', pin.id);

      const authorName = pin.authorName || 'User';
      const timeStr = formatTime(pin.timestamp);

      pinCard.innerHTML = `
        <div class="pinned-card-header">
          <div class="pinned-card-author">
            <span class="pinned-author-name">${escapeHtml(authorName)}</span>
            <span class="pinned-timestamp">${escapeHtml(timeStr)}</span>
          </div>
          <button type="button" class="pinned-unpin-btn" title="Unpin message">Unpin</button>
        </div>
        <div class="pinned-card-content">${escapeHtml(pin.content || '')}</div>
      `;

      const unpinBtn = pinCard.querySelector('.pinned-unpin-btn');
      if (unpinBtn) {
        unpinBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'pin_message',
              messageId: pin.id,
              isDm
            }));
            pinCard.remove();
            if (pinnedMessagesList.children.length === 0 && pinnedMessagesEmpty) {
              pinnedMessagesEmpty.classList.remove('hidden');
            }
          }
        });
      }

      // Jump to message in chat
      pinCard.addEventListener('click', () => {
        closePinnedMessagesModal();
        const container = isDm ? dmMessagesList : messagesList;
        if (container) {
          const target = container.querySelector(`.message-item[data-message-id="${pin.id}"]`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('flash-active');
            setTimeout(() => target.classList.remove('flash-active'), 2000);
          }
        }
      });

      pinnedMessagesList.appendChild(pinCard);
    });
  } catch (err) {
    if (pinnedMessagesLoading) pinnedMessagesLoading.classList.add('hidden');
    pinnedMessagesList.innerHTML = `<div class="pinned-empty"><p style="color:var(--text-danger);">Connection error: ${escapeHtml(err.message)}</p></div>`;
  }
}

if (chatPinnedBtn) {
  chatPinnedBtn.addEventListener('click', () => openPinnedMessagesModal(false));
}
if (dmPinnedBtn) {
  dmPinnedBtn.addEventListener('click', () => openPinnedMessagesModal(true));
}
if (closePinnedModalBtn) {
  closePinnedModalBtn.addEventListener('click', closePinnedMessagesModal);
}
if (pinnedMessagesModalOverlay) {
  pinnedMessagesModalOverlay.addEventListener('click', (e) => {
    if (e.target === pinnedMessagesModalOverlay) closePinnedMessagesModal();
  });
}

// ==========================================
// FORWARD MESSAGE CONTROLLER
// ==========================================
const forwardMessageModalOverlay = document.getElementById('forwardMessageModalOverlay');
const closeForwardModalBtn = document.getElementById('closeForwardModalBtn');
const cancelForwardBtn = document.getElementById('cancelForwardBtn');
const forwardPreviewAuthor = document.getElementById('forwardPreviewAuthor');
const forwardPreviewText = document.getElementById('forwardPreviewText');
const forwardTargetsList = document.getElementById('forwardTargetsList');

let pendingForwardMessage = null;

function openForwardModal(msg, isDm = false) {
  if (!forwardMessageModalOverlay || !msg) return;
  pendingForwardMessage = { ...msg, sourceIsDm: isDm };

  if (forwardPreviewAuthor) {
    forwardPreviewAuthor.textContent = msg.authorName || 'Anonymous';
  }
  if (forwardPreviewText) {
    forwardPreviewText.textContent = msg.content || (msg.file ? `[Attachment: ${msg.file.filename}]` : '');
  }

  renderForwardTargets();
  forwardMessageModalOverlay.classList.remove('hidden');
}

function closeForwardModal() {
  if (forwardMessageModalOverlay) {
    forwardMessageModalOverlay.classList.add('hidden');
  }
  pendingForwardMessage = null;
}

function renderForwardTargets() {
  if (!forwardTargetsList) return;
  forwardTargetsList.innerHTML = '';

  // 1. Current server text channels
  if (channels && channels.length > 0) {
    const sGroup = document.createElement('div');
    sGroup.className = 'forward-group-title';
    sGroup.textContent = 'Server Channels';
    forwardTargetsList.appendChild(sGroup);

    channels.filter(c => c.type === 'text').forEach(chan => {
      const item = document.createElement('div');
      item.className = 'forward-target-item';
      item.innerHTML = `
        <span class="forward-target-icon">#</span>
        <span class="forward-target-name">${escapeHtml(chan.name)}</span>
        <button type="button" class="forward-send-btn">Send</button>
      `;

      item.querySelector('.forward-send-btn').addEventListener('click', () => {
        executeForward({ type: 'channel', channelId: chan.id, serverId: activeServerId, targetName: `#${chan.name}` });
      });
      forwardTargetsList.appendChild(item);
    });
  }

  // 2. Friends (DMs)
  if (friendsData && Array.isArray(friendsData.friends) && friendsData.friends.length > 0) {
    const fGroup = document.createElement('div');
    fGroup.className = 'forward-group-title mt-10';
    fGroup.textContent = 'Direct Messages';
    forwardTargetsList.appendChild(fGroup);

    friendsData.friends.forEach(fr => {
      const item = document.createElement('div');
      item.className = 'forward-target-item';
      item.innerHTML = `
        <span class="forward-target-icon">@</span>
        <span class="forward-target-name">${escapeHtml(fr.displayName || fr.username)}</span>
        <button type="button" class="forward-send-btn">Send</button>
      `;

      item.querySelector('.forward-send-btn').addEventListener('click', () => {
        executeForward({ type: 'dm', friendId: fr.id, targetName: `@${fr.displayName || fr.username}` });
      });
      forwardTargetsList.appendChild(item);
    });
  }
}

function executeForward(destination) {
  if (!pendingForwardMessage || !socket || socket.readyState !== WebSocket.OPEN) return;

  const contentText = pendingForwardMessage.content || '';
  const fileMeta = pendingForwardMessage.file || null;

  if (destination.type === 'channel') {
    socket.send(JSON.stringify({
      type: 'chat',
      channelId: destination.channelId,
      serverId: destination.serverId,
      content: contentText,
      file: fileMeta,
      isForwarded: true
    }));
  } else if (destination.type === 'dm') {
    socket.send(JSON.stringify({
      type: 'direct_message',
      friendId: destination.friendId,
      content: contentText,
      file: fileMeta,
      isForwarded: true
    }));
  }

  showToast({
    icon: '↗️',
    title: 'Forwarded',
    body: `Message forwarded to ${destination.targetName}`
  });
  closeForwardModal();
}

if (closeForwardModalBtn) closeForwardModalBtn.addEventListener('click', closeForwardModal);
if (cancelForwardBtn) cancelForwardBtn.addEventListener('click', closeForwardModal);
if (forwardMessageModalOverlay) {
  forwardMessageModalOverlay.addEventListener('click', (e) => {
    if (e.target === forwardMessageModalOverlay) closeForwardModal();
  });
}

// ==========================================
// REPORT MESSAGE CONTROLLER
// ==========================================
const reportMessageModalOverlay = document.getElementById('reportMessageModalOverlay');
const closeReportModalBtn = document.getElementById('closeReportModalBtn');
const cancelReportBtn = document.getElementById('cancelReportBtn');
const submitReportBtn = document.getElementById('submitReportBtn');
const reportAuthorName = document.getElementById('reportAuthorName');
const reportMessageSnippet = document.getElementById('reportMessageSnippet');
const reportReasonSelect = document.getElementById('reportReasonSelect');
const reportDetailsInput = document.getElementById('reportDetailsInput');

let pendingReportMessage = null;

function openReportModal(msg, isDm = false) {
  if (!reportMessageModalOverlay || !msg) return;
  pendingReportMessage = { ...msg, isDm };

  if (reportAuthorName) {
    reportAuthorName.textContent = msg.authorName || 'User';
  }
  if (reportMessageSnippet) {
    reportMessageSnippet.textContent = msg.content ? `"${msg.content.slice(0, 140)}"` : '[Attachment]';
  }
  if (reportDetailsInput) reportDetailsInput.value = '';
  if (reportReasonSelect) reportReasonSelect.selectedIndex = 0;

  reportMessageModalOverlay.classList.remove('hidden');
}

function closeReportModal() {
  if (reportMessageModalOverlay) {
    reportMessageModalOverlay.classList.add('hidden');
  }
  pendingReportMessage = null;
}

if (closeReportModalBtn) closeReportModalBtn.addEventListener('click', closeReportModal);
if (cancelReportBtn) cancelReportBtn.addEventListener('click', closeReportModal);
if (reportMessageModalOverlay) {
  reportMessageModalOverlay.addEventListener('click', (e) => {
    if (e.target === reportMessageModalOverlay) closeReportModal();
  });
}

if (submitReportBtn) {
  submitReportBtn.addEventListener('click', async () => {
    if (!pendingReportMessage || !token) return;
    const reasonCategory = reportReasonSelect ? reportReasonSelect.value : 'Inappropriate Content';
    const extraDetails = reportDetailsInput ? reportDetailsInput.value.trim() : '';
    const fullReason = extraDetails ? `${reasonCategory} - ${extraDetails}` : reasonCategory;

    submitReportBtn.disabled = true;
    submitReportBtn.textContent = 'Submitting...';

    try {
      const res = await fetch('/api/messages/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messageId: pendingReportMessage.id,
          messageType: pendingReportMessage.isDm ? 'direct' : 'channel',
          reason: fullReason
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to submit report.');
        return;
      }

      closeReportModal();
      showToast({
        icon: '🛡️',
        title: 'Report Submitted',
        body: 'Thank you for keeping Voiceline safe. The developer will review this report.'
      });
    } catch (err) {
      alert('Error submitting report: ' + err.message);
    } finally {
      submitReportBtn.disabled = false;
      submitReportBtn.textContent = 'Submit Report';
    }
  });
}

// ==========================================
// DEVELOPER SETTINGS: REPORTED MESSAGES REVIEW
// ==========================================
const devReportsList = document.getElementById('devReportsList');
const devReportsLoading = document.getElementById('devReportsLoading');
const devReportsEmpty = document.getElementById('devReportsEmpty');
const devRefreshReportsBtn = document.getElementById('devRefreshReportsBtn');
const devPendingReportsBadge = document.getElementById('devPendingReportsBadge');

async function loadDevReportedMessages() {
  if (!token || !currentUser || !currentUser.isDeveloper) return;
  if (devReportsLoading) devReportsLoading.classList.remove('hidden');
  if (devReportsEmpty) devReportsEmpty.classList.add('hidden');
  if (devReportsList) devReportsList.innerHTML = '';

  try {
    const res = await fetch('/api/developer/reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (devReportsLoading) devReportsLoading.classList.add('hidden');

    if (!res.ok) {
      if (devReportsList) {
        devReportsList.innerHTML = `<div style="color:var(--text-danger); padding:16px;">${escapeHtml(data.error || 'Failed to load reports.')}</div>`;
      }
      return;
    }

    const reports = data.reports || [];
    renderDevReportedMessages(reports);
  } catch (err) {
    if (devReportsLoading) devReportsLoading.classList.add('hidden');
    if (devReportsList) {
      devReportsList.innerHTML = `<div style="color:var(--text-danger); padding:16px;">Connection error: ${escapeHtml(err.message)}</div>`;
    }
  }
}

function renderDevReportedMessages(reports) {
  if (!devReportsList) return;
  devReportsList.innerHTML = '';

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  if (devPendingReportsBadge) {
    if (pendingCount > 0) {
      devPendingReportsBadge.textContent = pendingCount;
      devPendingReportsBadge.classList.remove('hidden');
    } else {
      devPendingReportsBadge.classList.add('hidden');
    }
  }

  if (reports.length === 0) {
    if (devReportsEmpty) devReportsEmpty.classList.remove('hidden');
    return;
  }
  if (devReportsEmpty) devReportsEmpty.classList.add('hidden');

  reports.forEach(r => {
    const card = document.createElement('div');
    card.className = `dev-report-card status-${r.status || 'pending'}`;
    card.setAttribute('data-report-id', r.id);

    const isPending = r.status === 'pending';
    const locTag = r.messageType === 'direct'
      ? `<span class="report-loc-tag dm">Direct Message</span>`
      : `<span class="report-loc-tag channel">#${escapeHtml(r.channelName || 'channel')}</span>`;

    const statusBadge = isPending
      ? `<span class="report-badge pending">Pending</span>`
      : `<span class="report-badge resolved">${escapeHtml(r.status || 'resolved')}</span>`;

    card.innerHTML = `
      <div class="dev-report-header">
        <div class="dev-report-meta-row">
          ${locTag}
          <span class="report-id-text">Report #${r.id}</span>
          ${statusBadge}
        </div>
        <span class="report-time-text">${formatTime(r.createdAt)}</span>
      </div>

      <div class="dev-report-details">
        <div class="report-field-line">
          <strong>Flagged User:</strong> <span>${escapeHtml(r.messageAuthorName || 'Unknown')} (ID: ${r.reportedUserId})</span>
        </div>
        <div class="report-field-line">
          <strong>Reported By:</strong> <span>${escapeHtml(r.reporterName || 'User')} (ID: ${r.reporterId})</span>
        </div>
        <div class="report-reason-box">
          <span class="report-reason-label">Reason:</span>
          <span>${escapeHtml(r.reason || 'No reason provided')}</span>
        </div>
      </div>

      <div class="dev-report-msg-preview">
        <div class="msg-preview-label">REPORTED MESSAGE CONTENT</div>
        <div class="msg-preview-content">${escapeHtml(r.messageContent || '[No text content / attachment]')}</div>
      </div>

      ${isPending ? `
        <div class="dev-report-actions">
          <button type="button" class="dev-report-btn dismiss-btn">Dismiss Report</button>
          <button type="button" class="dev-report-btn resolve-btn">Mark Resolved</button>
          <button type="button" class="dev-report-btn delete-msg-btn">Delete Message</button>
        </div>
      ` : `
        <div class="dev-report-resolved-info">
          <span>Action: ${escapeHtml(r.actionTaken || 'None')}</span>
          ${r.reviewedAt ? `<span>Reviewed: ${formatTime(r.reviewedAt)}</span>` : ''}
        </div>
      `}
    `;

    if (isPending) {
      const dismissBtn = card.querySelector('.dismiss-btn');
      const resolveBtn = card.querySelector('.resolve-btn');
      const deleteMsgBtn = card.querySelector('.delete-msg-btn');

      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => handleReportDevAction(r.id, 'dismissed', 'Dismissed by Developer'));
      }
      if (resolveBtn) {
        resolveBtn.addEventListener('click', () => handleReportDevAction(r.id, 'resolved', 'Marked Resolved'));
      }
      if (deleteMsgBtn) {
        deleteMsgBtn.addEventListener('click', async () => {
          if (confirm('Delete this reported message immediately from chat?')) {
            // Delete message via WebSocket
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: 'delete_message',
                messageId: r.messageId,
                isDm: r.messageType === 'direct'
              }));
            }
            await handleReportDevAction(r.id, 'resolved', 'Message Deleted by Developer');
          }
        });
      }
    }

    devReportsList.appendChild(card);
  });
}

async function handleReportDevAction(reportId, status, actionTaken) {
  if (!token) return;
  try {
    const res = await fetch(`/api/developer/reports/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, actionTaken })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to update report.');
      return;
    }
    showToast({
      icon: '✅',
      title: 'Report Updated',
      body: `Report #${reportId} set to ${status}.`
    });
    loadDevReportedMessages();
  } catch (err) {
    alert('Error updating report: ' + err.message);
  }
}

if (devRefreshReportsBtn) {
  devRefreshReportsBtn.addEventListener('click', () => loadDevReportedMessages());
}

// Real-time developer report notification
function handleDevReportEvent(msg) {
  if (!currentUser || !currentUser.isDeveloper) return;
  if (msg.type === 'new_message_report') {
    showToast({
      icon: '🚨',
      title: 'New Message Report',
      body: `Report received for ${msg.report.messageAuthorName || 'User'}: "${msg.report.reason}"`,
      actionText: 'Review',
      onAction: () => {
        if (typeof openAppSettingsModal === 'function') {
          openAppSettingsModal('developer');
        }
      }
    });
  }
  loadDevReportedMessages();
}

// Real-time message update listeners
function handleMessageEditedEvent(msg) {
  const container = msg.isDm ? dmMessagesList : messagesList;
  if (!container || !msg.data) return;
  const item = container.querySelector(`.message-item[data-message-id="${msg.data.id}"]`);
  if (!item) return;

  const textEl = item.querySelector('.message-text');
  if (textEl) {
    textEl.innerHTML = formatMessageContent(msg.data.content || '') + ' <span class="message-edited-tag">(edited)</span>';
  }
}

function handleMessageDeletedEvent(msg) {
  const container = msg.isDm ? dmMessagesList : messagesList;
  if (!container) return;
  const item = container.querySelector(`.message-item[data-message-id="${msg.messageId}"]`);
  if (!item) return;

  item.classList.add('message-deleted-state');
  const textEl = item.querySelector('.message-text');
  if (textEl) {
    textEl.innerHTML = '<span class="deleted-msg-placeholder">[Message deleted]</span>';
  }
  const actionsEl = item.querySelector('.message-hover-actions');
  if (actionsEl) actionsEl.remove();
}

function handleMessagePinnedEvent(msg) {
  const container = msg.isDm ? dmMessagesList : messagesList;
  if (!container || !msg.data) return;
  const item = container.querySelector(`.message-item[data-message-id="${msg.data.id}"]`);
  if (item) {
    if (msg.data.isPinned) {
      item.classList.add('message-pinned');
    } else {
      item.classList.remove('message-pinned');
    }
  }

  showToast({
    icon: '📌',
    title: msg.data.isPinned ? 'Message Pinned' : 'Message Unpinned',
    body: msg.data.isPinned ? 'A message was pinned in this chat.' : 'A message was unpinned.'
  });

  // If pinned modal is open, refresh it
  if (pinnedMessagesModalOverlay && !pinnedMessagesModalOverlay.classList.contains('hidden')) {
    loadPinnedMessages();
  }
}










