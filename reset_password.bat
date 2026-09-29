@echo off
title Voiceline - Reset Account Password
echo ====================================================
echo   Voiceline Password Reset Tool
echo ====================================================
cd /d "%~dp0"
set /p TARGET_USER="Enter the username to reset: "
if "%TARGET_USER%"=="" goto end
set /p NEW_PASS="Enter the new password: "
if "%NEW_PASS%"=="" goto end

node -e "
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
try {
  const db = new DatabaseSync('voiceline.db');
  const user = db.prepare('SELECT id, username FROM users WHERE username = ? COLLATE NOCASE').get(process.env.TARGET_USER);
  if (!user) {
    console.log('\n[Error] Username not found: ' + process.env.TARGET_USER);
    process.exit(1);
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(process.env.NEW_PASS, salt, 64).toString('hex');
  db.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').run(hash, salt, user.id);
  console.log('\n[Success] Password successfully updated for @' + user.username + '!');
} catch (e) {
  console.log('\n[Error] ' + e.message);
}
"
:end
echo.
pause
