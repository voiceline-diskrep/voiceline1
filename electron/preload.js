const { contextBridge, ipcRenderer } = require('electron');

// Expose server configuration and desktop capabilities to client
const serverUrl = ipcRenderer.sendSync('get-server-url-sync');
window.VOICELINE_SERVER_URL = serverUrl;
window.IS_ELECTRON = true;

const desktopApi = {
  getServerUrl: () => ipcRenderer.invoke('get-server-url'),
  setServerUrl: (url, reload) => ipcRenderer.invoke('set-server-url', url, reload),
  testServerUrl: (url) => ipcRenderer.invoke('test-server-url', url),
  refreshServerFromGitHub: () => ipcRenderer.invoke('refresh-server-from-github'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  startUpdateDownload: (downloadUrl) => ipcRenderer.invoke('start-update-download', downloadUrl),
  installUpdate: (filePath) => ipcRenderer.invoke('install-update', filePath),
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  setSelectedScreenSource: (sourceId) => ipcRenderer.invoke('set-selected-screen-source', sourceId),
  onUpdateAvailable: (cb) => {
    ipcRenderer.on('update-available', (e, data) => cb(data));
  },
  onUpdateDownloadProgress: (cb) => {
    ipcRenderer.on('update-download-progress', (e, progress) => cb(progress));
  },
  onTriggerCheckUpdates: (cb) => {
    ipcRenderer.on('trigger-check-updates', () => cb());
  },
  isElectron: true
};

window.electronDesktop = desktopApi;

if (typeof contextBridge !== 'undefined' && contextBridge.exposeInMainWorld) {
  try {
    contextBridge.exposeInMainWorld('electronDesktop', desktopApi);
  } catch {}
}
