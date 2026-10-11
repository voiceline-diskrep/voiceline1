const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const serverTxtPath = path.join(projectRoot, 'server.txt');

console.log('====================================================');
console.log('  Voiceline Cloudflare Tunnel & GitHub Publisher');
console.log('  Starting secure tunnel & linking with GitHub...');
console.log('====================================================\n');

// 1. Locate cloudflared binary
let cloudflaredBin = 'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe';
if (!fs.existsSync(cloudflaredBin)) {
  try {
    const found = execSync('where cloudflared', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim().split('\r\n')[0];
    if (found && fs.existsSync(found)) cloudflaredBin = found;
  } catch (e) {
    cloudflaredBin = 'cloudflared';
  }
}

// 2. Start tunnel process
const tunnel = spawn(cloudflaredBin, ['tunnel', '--url', 'http://localhost:3000'], { stdio: ['pipe', 'pipe', 'pipe'] });

let foundLink = false;

function publishToGitHub(url) {
  try {
    fs.writeFileSync(serverTxtPath, url.trim(), 'utf8');
    console.log('  [1/3] Saved live URL to server.txt');

    // Pull remote changes first to avoid push rejections
    try {
      execSync('git pull --rebase origin main', { cwd: projectRoot, stdio: 'ignore' });
    } catch (e) {}

    // Stage and commit
    execSync('git add server.txt', { cwd: projectRoot, stdio: 'ignore' });
    try {
      execSync(`git commit -m "chore(live): update server URL to ${url.trim()} [skip ci]"`, { cwd: projectRoot, stdio: 'ignore' });
      console.log('  [2/3] Committed server URL update');
    } catch (commitErr) {
      console.log('  [2/3] URL unchanged or already committed');
    }

    // Push to GitHub
    execSync('git push origin main', { cwd: projectRoot, stdio: 'ignore' });
    console.log('  [3/3] Pushed to GitHub repository (voiceline-diskrep/voiceline1)!\n');
    return true;
  } catch (err) {
    console.warn('\n  [GitHub Warning] Auto-push to GitHub encountered an issue:', err.message);
    console.warn('  (Friends can still connect using the direct Share Link below)\n');
    return false;
  }
}

function processOutput(data) {
  const text = data.toString();
  
  // Look for the trycloudflare URL
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && !foundLink) {
    foundLink = true;
    const shareUrl = match[0];

    // Try copying to clipboard automatically on Windows
    try {
      execSync(`powershell -command "Set-Clipboard -Value '${shareUrl}'"`);
    } catch (e) {}

    console.log('====================================================');
    console.log('  SUCCESS! VOICELINE IS LIVE & CONNECTED');
    console.log('====================================================');
    console.log(`\n  Share Link:  ${shareUrl}\n`);
    console.log('  [GitHub Auto-Discovery] Publishing live URL to GitHub...');
    const pushed = publishToGitHub(shareUrl);

    if (pushed) {
      console.log('====================================================');
      console.log('  * GITHUB DYNAMIC DISCOVERY: ACTIVE');
      console.log('  * Friends opening Voiceline will fetch this link');
      console.log('    and connect AUTOMATICALLY with ZERO pasting!');
      console.log('====================================================');
    }

    console.log('\n  Keep this window and start.bat open while chatting.');
    console.log('  To stop the tunnel, press Ctrl + C or close this window.');
    console.log('====================================================\n');
  }
}

tunnel.stderr.on('data', processOutput);
tunnel.stdout.on('data', processOutput);

tunnel.on('error', (err) => {
  console.error('\n[Error] Could not start cloudflared:', err.message);
  console.log('Please ensure cloudflared is installed or restart the app.');
});

tunnel.on('close', (code) => {
  console.log(`\nTunnel closed. (code ${code})`);
});

// Mark as offline when user terminates tunnel
let isExiting = false;
function handleExit() {
  if (isExiting) return;
  isExiting = true;
  try {
    fs.writeFileSync(serverTxtPath, 'OFFLINE', 'utf8');
    execSync('git add server.txt', { cwd: projectRoot, stdio: 'ignore' });
    execSync('git commit -m "chore(live): server offline [skip ci]"', { cwd: projectRoot, stdio: 'ignore' });
    execSync('git push origin main', { cwd: projectRoot, stdio: 'ignore' });
  } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
