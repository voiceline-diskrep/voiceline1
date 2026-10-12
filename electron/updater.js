const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const { app } = require('electron');

const GITHUB_OWNER = 'voiceline-diskrep';
const GITHUB_REPO = 'voiceline1';

function parseSemver(v) {
  if (!v) return [0, 0, 0];
  const clean = v.replace(/^v/i, '').trim();
  const parts = clean.split('.').map(p => parseInt(p, 10) || 0);
  while (parts.length < 3) parts.push(0);
  return parts.slice(0, 3);
}

function isNewerVersion(latest, current) {
  const [lMaj, lMin, lPat] = parseSemver(latest);
  const [cMaj, cMin, cPat] = parseSemver(current);

  if (lMaj > cMaj) return true;
  if (lMaj < cMaj) return false;
  if (lMin > cMin) return true;
  if (lMin < cMin) return false;
  return lPat > cPat;
}

function getAppVersion() {
  if (app && typeof app.getVersion === 'function') {
    return app.getVersion();
  }
  try {
    const pkg = require('../package.json');
    return pkg.version || '1.0.8';
  } catch {
    return '1.0.8';
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'http:' ? http : https;

    const req = client.get(url, {
      headers: {
        'User-Agent': `Voiceline-Desktop/${getAppVersion()} (Windows)`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode === 404) {
        return resolve(null); // No releases published yet
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`GitHub API error: HTTP ${res.statusCode} ${res.statusMessage}`));
      }

      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('GitHub connection timed out'));
    });
  });
}

/**
 * Checks GitHub for newer releases.
 */
async function checkForGitHubUpdates() {
  const currentVersion = getAppVersion();
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

  try {
    const release = await fetchJson(apiUrl);
    if (!release || !release.tag_name) {
      return {
        hasUpdate: false,
        currentVersion,
        latestVersion: currentVersion,
        message: 'You are on the latest version of Voiceline! (No GitHub releases published yet)'
      };
    }

    const latestTag = release.tag_name;
    const hasUpdate = isNewerVersion(latestTag, currentVersion);

    if (!hasUpdate) {
      return {
        hasUpdate: false,
        currentVersion,
        latestVersion: latestTag.replace(/^v/i, ''),
        message: 'Voiceline is up to date!'
      };
    }

    // Find best installer asset
    const assets = Array.isArray(release.assets) ? release.assets : [];
    let downloadAsset = assets.find(a => /setup.*\.exe$/i.test(a.name));
    if (!downloadAsset) {
      downloadAsset = assets.find(a => /\.exe$/i.test(a.name));
    }

    const downloadUrl = downloadAsset ? downloadAsset.browser_download_url : release.html_url;

    return {
      hasUpdate: true,
      currentVersion,
      latestVersion: latestTag.replace(/^v/i, ''),
      releaseName: release.name || latestTag,
      releaseNotes: release.body || 'No release notes provided.',
      publishedAt: release.published_at,
      downloadUrl,
      assetName: downloadAsset ? downloadAsset.name : 'Voiceline Update',
      isDirectExe: Boolean(downloadAsset && downloadAsset.browser_download_url),
      githubReleaseUrl: release.html_url
    };
  } catch (err) {
    console.warn('[Voiceline Updater] Error checking GitHub releases:', err.message);
    return {
      hasUpdate: false,
      currentVersion,
      error: err.message,
      message: `Could not reach GitHub: ${err.message}`
    };
  }
}

/**
 * Downloads update asset with streaming progress
 */
function downloadFileWithProgress(url, targetPath, onProgress) {
  return new Promise((resolve, reject) => {
    function makeRequest(currentUrl) {
      const parsedUrl = new URL(currentUrl);
      const client = parsedUrl.protocol === 'http:' ? http : https;

      const req = client.get(currentUrl, {
        headers: {
          'User-Agent': 'Voiceline-Desktop-Updater'
        }
      }, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return makeRequest(res.headers.location);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed: HTTP ${res.statusCode}`));
        }

        const totalBytes = parseInt(res.headers['content-length'], 10) || 0;
        let downloadedBytes = 0;

        const fileStream = fs.createWriteStream(targetPath);

        res.on('data', chunk => {
          downloadedBytes += chunk.length;
          if (typeof onProgress === 'function') {
            const percent = totalBytes > 0 ? Math.round((downloadedBytes / totalBytes) * 100) : 0;
            onProgress({
              percent,
              transferred: downloadedBytes,
              total: totalBytes
            });
          }
        });

        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close(() => resolve(targetPath));
        });

        fileStream.on('error', err => {
          fs.unlink(targetPath, () => {});
          reject(err);
        });
      });

      req.on('error', reject);
    }

    makeRequest(url);
  });
}

/**
 * Downloads the update to temp dir
 */
async function downloadUpdate(downloadUrl, onProgress) {
  const fileName = `Voiceline_Update_${Date.now()}.exe`;
  const destPath = path.join(os.tmpdir(), fileName);
  await downloadFileWithProgress(downloadUrl, destPath, onProgress);
  return destPath;
}

/**
 * Executes installer and closes the current app
 */
function installAndQuit(installerPath) {
  if (!fs.existsSync(installerPath)) {
    throw new Error('Installer file not found at: ' + installerPath);
  }

  // Launch installer detached
  const child = spawn(installerPath, [], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  // Quit current application immediately
  setTimeout(() => {
    app.quit();
  }, 500);
}

module.exports = {
  GITHUB_OWNER,
  GITHUB_REPO,
  checkForGitHubUpdates,
  downloadUpdate,
  installAndQuit,
  isNewerVersion
};
