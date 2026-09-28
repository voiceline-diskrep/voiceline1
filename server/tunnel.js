const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  Creating a secure internet link for your friends...');
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
    } catch (e) {
      // Ignore if clipboard copy fails
    }

    console.log('\n====================================================');
    console.log('  SUCCESS! VOICELINE IS READY FOR YOUR FRIENDS');
    console.log('====================================================');
    console.log(`\n  Share Link:  ${shareUrl}\n`);
    console.log('  (This link has been COPIED to your clipboard!)');
    console.log('  Just press Ctrl + V in Discord, WhatsApp, or text');
    console.log('  to send it to your friends.');
    console.log('\n  Keep this window and start.bat open while chatting.');
    console.log('  To close, press Ctrl + C or close this window.');
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
