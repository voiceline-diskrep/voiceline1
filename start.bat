@echo off
title Voiceline Server & Cloudflare Auto-Publisher
echo ====================================================
echo   Starting Voiceline Chat Server + Cloudflare Tunnel...
echo   Live link will be published to GitHub automatically!
echo ====================================================
cd /d "%~dp0"

:: Start the Cloudflare Tunnel & GitHub Publisher in a companion window
start "Voiceline Tunnel & GitHub Publisher" cmd /c "node server/tunnel.js"

:: Start the Voiceline Node Server
node server/server.js
pause
