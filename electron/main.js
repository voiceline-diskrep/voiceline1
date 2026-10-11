const { app, BrowserWindow, ipcMain, session, Menu, dialog, shell, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const updater = require('./updater');

let mainWindow = null;
const DEFAULT_REMOTE_URL = 'https://appointments-earthquake-vote-outlined.trycloudflare.com';

function getLocalConfigPath() {
  return path.join(app.getPath('userData'), 'server_url.txt');
}

function resolveServerUrl() {
  // 1. Check server.txt alongside the executable (or in dev root)
  const exeDir = path.dirname(process.execPath);
  const localTxtCandidates = [
    path.join(exeDir, 'server.txt'),
    path.join(process.resourcesPath || '', 'server.txt'),
    path.join(__dirname, '..', 'server.txt'),
    path.join(__dirname, '..', 'dist', 'server.txt')
  ];

  for (const candidate of localTxtCandidates) {
    if (fs.existsSync(candidate)) {
      const val = fs.readFileSync(candidate, 'utf8').trim();
      if (val) return sanitizeUrl(val);
    }
  }

  // 2. Check saved server_url.txt in AppData
  const configPath = getLocalConfigPath();
  if (fs.existsSync(configPath)) {
    const val = fs.readFileSync(configPath, 'utf8').trim();
    if (val) return sanitizeUrl(val);
  }

  // 3. Fallback to default Cloudflare tunnel
  return DEFAULT_REMOTE_URL;
}

function sanitizeUrl(url) {
  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url.replace(/\/+$/, '');
}

function saveServerUrl(url) {
  try {
    const dir = app.getPath('userData');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(getLocalConfigPath(), sanitizeUrl(url), 'utf8');
  } catch (err) {
    console.error('Failed to save server URL:', err);
  }
}

const GITHUB_RAW_SERVER_TXT = 'https://raw.githubusercontent.com/voiceline-diskrep/voiceline1/main/server.txt';
const GITHUB_API_SERVER_TXT = 'https://api.github.com/repos/voiceline-diskrep/voiceline1/contents/server.txt';

async function testServerAlive(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${url}/api/servers`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeout);
    // Any HTTP status from voiceline server (e.g. 401 unauthenticated) means it is alive and valid
    return res.status >= 200 && res.status < 500;
  } catch (e) {
    return false;
  }
}

async function fetchLiveServerUrlFromGitHub() {
  let candidate = null;

  // Method 1: Fast raw fetch with cache buster
  try {
    const rawRes = await fetch(`${GITHUB_RAW_SERVER_TXT}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'User-Agent': 'Voiceline-App' }
    });
    if (rawRes.ok) {
      const text = (await rawRes.text()).trim();
      if (text && text !== 'OFFLINE' && (text.startsWith('http://') || text.startsWith('https://'))) {
        candidate = sanitizeUrl(text);
      }
    }
  } catch (err) {
    console.warn('[GitHub Discovery] Raw fetch failed, attempting API fallback:', err.message);
  }

  // Method 2: GitHub Contents API fallback (base64)
  if (!candidate) {
    try {
      const apiRes = await fetch(GITHUB_API_SERVER_TXT, {
        headers: { 'User-Agent': 'Voiceline-App' }
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.content) {
          const decoded = Buffer.from(data.content, 'base64').toString('utf8').trim();
          if (decoded && decoded !== 'OFFLINE' && (decoded.startsWith('http://') || decoded.startsWith('https://'))) {
            candidate = sanitizeUrl(decoded);
          }
        }
      }
    } catch (err) {
      console.warn('[GitHub Discovery] API fallback failed:', err.message);
    }
  }

  if (candidate) {
    const isAlive = await testServerAlive(candidate);
    if (isAlive) return candidate;
    console.warn('[GitHub Discovery] Discovered server link is unresponsive or expired:', candidate);
  }

  return null;
}

let currentServerUrl = resolveServerUrl();

// IPC Handlers
ipcMain.on('get-server-url-sync', (event) => {
  event.returnValue = currentServerUrl;
});

ipcMain.handle('get-server-url', () => {
  return currentServerUrl;
});

ipcMain.handle('refresh-server-from-github', async () => {
  const liveUrl = await fetchLiveServerUrlFromGitHub();
  if (liveUrl) {
    currentServerUrl = liveUrl;
    return { success: true, url: liveUrl };
  }
  return { success: false, currentUrl: currentServerUrl };
});

ipcMain.handle('set-server-url', (event, newUrl) => {
  if (newUrl) {
    currentServerUrl = sanitizeUrl(newUrl);
    saveServerUrl(currentServerUrl);
    if (mainWindow) {
      mainWindow.webContents.reload();
    }
    return true;
  }
  return false;
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', async () => {
  try {
    const res = await updater.checkForGitHubUpdates();
    return res;
  } catch (err) {
    return { hasUpdate: false, currentVersion: app.getVersion(), error: err.message };
  }
});

let activeDownloadedInstallerPath = null;

ipcMain.handle('start-update-download', async (event, downloadUrl) => {
  try {
    if (!downloadUrl) throw new Error('Missing download URL');
    activeDownloadedInstallerPath = await updater.downloadUpdate(downloadUrl, (progress) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('update-download-progress', progress);
      }
    });
    return { success: true, filePath: activeDownloadedInstallerPath };
  } catch (err) {
    console.error('Update download error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('install-update', async (event, customPath) => {
  try {
    const installerPath = customPath || activeDownloadedInstallerPath;
    if (!installerPath) throw new Error('No downloaded installer available');
    updater.installAndQuit(installerPath);
    return { success: true };
  } catch (err) {
    console.error('Install error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-external-url', (event, url) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    shell.openExternal(url);
    return true;
  }
  return false;
});

let activeScreenSourceId = null;

ipcMain.handle('get-desktop-sources', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 360, height: 200 },
      fetchWindowIcons: true
    });
    return sources.map(s => ({
      id: s.id,
      name: s.name,
      display_id: s.display_id,
      thumbnail: s.thumbnail ? s.thumbnail.toDataURL() : null,
      appIcon: s.appIcon ? s.appIcon.toDataURL() : null
    }));
  } catch (err) {
    console.error('get-desktop-sources error:', err);
    return [];
  }
});

ipcMain.handle('set-selected-screen-source', (event, sourceId) => {
  activeScreenSourceId = sourceId || null;
  return true;
});

async function createWindow() {
  // Check if user has a custom manual override in AppData
  let hasManualOverride = false;
  const configPath = getLocalConfigPath();
  if (fs.existsSync(configPath)) {
    const val = fs.readFileSync(configPath, 'utf8').trim();
    if (val && val !== 'AUTO' && val !== 'http://localhost:3000') {
      hasManualOverride = true;
    }
  }

  // If no manual override, discover live server URL from GitHub
  if (!hasManualOverride) {
    try {
      const liveUrl = await Promise.race([
        fetchLiveServerUrlFromGitHub(),
        new Promise(r => setTimeout(() => r(null), 2500))
      ]);
      if (liveUrl) {
        currentServerUrl = liveUrl;
        console.log('[Voiceline Discovery] Auto-connected to live server from GitHub:', currentServerUrl);
      }
    } catch (e) {
      console.warn('[Voiceline Discovery] Startup fetch error:', e.message);
    }
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 840,
    minHeight: 560,
    backgroundColor: '#1e1f22',
    icon: path.join(__dirname, 'icon.png'),
    title: 'Voiceline',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1e1f22',
      symbolColor: '#dbdee1',
      height: 32
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false // Allows connecting to remote server over websockets from local file://
    }
  });

  // Automatically approve media permissions (Microphone, Camera, Notifications)
  session.defaultSession.setPermissionCheckHandler(() => true);
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);
  });

  // Enable Screen Sharing via navigator.mediaDevices.getDisplayMedia() in Electron
  if (session.defaultSession.setDisplayMediaRequestHandler) {
    session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {
      try {
        const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
        if (sources && sources.length > 0) {
          let chosen = sources[0];
          if (activeScreenSourceId) {
            const match = sources.find(s => s.id === activeScreenSourceId);
            if (match) chosen = match;
            activeScreenSourceId = null;
          }
          callback({ video: chosen });
        } else {
          callback({});
        }
      } catch (err) {
        console.error('Display media request error:', err);
        callback({});
      }
    });
  }

  // Load the client directly from local disk (0ms load, offline-first)
  const clientHtmlPath = path.join(__dirname, '..', 'client', 'index.html');
  mainWindow.loadFile(clientHtmlPath);

  // Automatically check for updates on startup
  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(async () => {
      try {
        const updateInfo = await updater.checkForGitHubUpdates();
        if (updateInfo && updateInfo.hasUpdate && mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update-available', updateInfo);
        }
      } catch (err) {
        console.warn('Startup update check failed:', err.message);
      }
    }, 2500);
  });

  // In-app Menu / Shortcuts
  const template = [
    {
      label: 'Voiceline',
      submenu: [
        {
          label: 'Check for Updates...',
          click: async () => {
            if (mainWindow) {
              mainWindow.webContents.send('trigger-check-updates');
            }
          }
        },
        {
          label: 'Change Server URL (F2)',
          accelerator: 'F2',
          click: () => promptChangeServer()
        },
        {
          label: 'Reload App',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.webContents.reload()
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.toggleDevTools()
        },
        { type: 'separator' },
        { role: 'quit', label: 'Quit Voiceline' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function promptChangeServer() {
  if (!mainWindow) return;
  mainWindow.webContents.executeJavaScript(`
    (function() {
      const current = window.VOICELINE_SERVER_URL || '';
      const input = prompt('Enter Voiceline Host Server Address:\\n(e.g. https://xxxx.trycloudflare.com or http://localhost:3000)', current);
      if (input && input.trim()) {
        if (window.electronDesktop) {
          window.electronDesktop.setServerUrl(input.trim());
        }
      }
    })();
  `);
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
