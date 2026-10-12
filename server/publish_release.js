const fs = require('fs');
const path = require('path');
const https = require('https');

function getGitHubToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const { execSync } = require('child_process');
    const out = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n\n',
      encoding: 'utf8'
    });
    const match = out.match(/password=(.+)/);
    if (match) return match[1].trim();
  } catch (e) {}
  return '';
}

const GITHUB_TOKEN = getGitHubToken();
const OWNER = 'voiceline-diskrep';
const REPO = 'voiceline1';
const TAG = 'v1.0.8';

function apiRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function uploadAsset(uploadUrlTemplate, filePath, fileName) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(filePath);
    const cleanUrl = uploadUrlTemplate.replace(/\{.*?\}$/, '') + `?name=${encodeURIComponent(fileName)}`;
    const urlObj = new URL(cleanUrl);

    console.log(`  Uploading ${fileName} (${(stat.size / 1024 / 1024).toFixed(1)} MB)...`);

    const req = https.request({
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Voiceline-Uploader',
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size
      }
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`  ✔ Successfully uploaded ${fileName}!`);
          resolve(true);
        } else {
          console.error(`  ✖ Failed to upload ${fileName} (${res.statusCode}):`, body);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`  ✖ Network error uploading ${fileName}:`, err.message);
      reject(err);
    });

    const fileStream = fs.createReadStream(filePath);
    let uploadedBytes = 0;
    let lastPercent = 0;
    fileStream.on('data', (chunk) => {
      uploadedBytes += chunk.length;
      const percent = Math.floor((uploadedBytes / stat.size) * 100);
      if (percent >= lastPercent + 20) {
        lastPercent = percent;
        process.stdout.write(`    progress: ${percent}%\n`);
      }
    });
    fileStream.pipe(req);
  });
}

async function main() {
  console.log('====================================================');
  console.log(`  Publishing Voiceline ${TAG} to GitHub Releases`);
  console.log('====================================================\n');

  // 1. Check if release already exists
  console.log('[1/3] Checking existing releases...');
  const existingRes = await apiRequest({
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/releases/tags/${TAG}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'Voiceline-Uploader',
      'Accept': 'application/vnd.github+json'
    }
  });

  let release = null;
  if (existingRes.status === 200 && existingRes.data && existingRes.data.id) {
    console.log(`  Found existing release: ${existingRes.data.html_url}`);
    release = existingRes.data;
  } else {
    console.log('[2/3] Creating new release on GitHub...');
    const createRes = await apiRequest({
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}/releases`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Voiceline-Uploader',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({
      tag_name: TAG,
      target_commitish: 'main',
      name: `Voiceline ${TAG}`,
      body: `### Voiceline ${TAG}\n\n- **Window Movement & Draggable Titlebar**: Added a dedicated top window drag titlebar and header drag regions with \`-webkit-app-region: drag\` so the desktop window can be moved freely across monitors and screens.\n- **Top Controls Clearance (No More Overlapping Caption Buttons)**: All app headers, user profile capsules, search bars, and action buttons are now lowered cleanly below the Windows titlebar strip, completely preventing the minimize, maximize, and close buttons from overlapping the user capsule or action buttons.\n- **Fixed Auto-Update System & False Positive Badge**: Resolved a CSS specificity bug where the update button was stuck visible even when no update existed. Fixed the version detector so the update badge and modal ONLY appear when an actual newer release is published on GitHub, correctly displaying current and latest versions.\n\nDownload **Voiceline Setup 1.0.8.exe** to install, or **Voiceline 1.0.8.exe** for portable use.`,
      draft: false,
      prerelease: false
    }));

    if (createRes.status >= 200 && createRes.status < 300) {
      console.log(`  ✔ Release created: ${createRes.data.html_url}`);
      release = createRes.data;
    } else {
      console.error('  ✖ Could not create release:', createRes.data);
      return;
    }
  }

  // 2. Upload assets
  console.log('\n[3/3] Uploading binary files to GitHub Releases...');
  const distDir = path.join(__dirname, '..', 'dist-electron');
  const ver = TAG.replace(/^v/, '');
  const filesToUpload = [
    `Voiceline Setup ${ver}.exe`,
    `Voiceline ${ver}.exe`,
    'latest.yml'
  ];

  for (const file of filesToUpload) {
    const fullPath = path.join(distDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  File not found, skipping: ${file}`);
      continue;
    }

    // If asset with same name exists, delete it first so upload succeeds
    const existingAsset = (release.assets || []).find(a => a.name === file);
    if (existingAsset) {
      console.log(`  Removing older asset: ${file}...`);
      await apiRequest({
        hostname: 'api.github.com',
        path: `/repos/${OWNER}/${REPO}/releases/assets/${existingAsset.id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'Voiceline-Uploader',
          'Accept': 'application/vnd.github+json'
        }
      });
    }

    await uploadAsset(release.upload_url, fullPath, file);
  }

  console.log('\n====================================================');
  console.log('  SUCCESS! VOICELINE IS PUBLISHED ON GITHUB');
  console.log(`  Download Link: ${release.html_url}`);
  console.log('====================================================\n');
}

main().catch(console.error);
