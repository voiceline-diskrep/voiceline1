@echo off
title Voiceline - Registered Accounts
echo ====================================================
echo   Voiceline Registered Accounts
echo ====================================================
cd /d "%~dp0"
node -e "
const { DatabaseSync } = require('node:sqlite');
try {
  const db = new DatabaseSync('voiceline.db');
  const users = db.prepare('SELECT id, username, display_name, (CASE WHEN is_developer = 1 THEN \"YES\" ELSE \"NO\" END) AS developer, created_at FROM users').all();
  if (users.length === 0) {
    console.log('No accounts created yet.');
  } else {
    console.table(users);
  }
} catch (e) {
  console.log('Database not found or empty.');
}
"
echo.
pause
