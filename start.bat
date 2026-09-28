@echo off
title Voiceline Server
echo ====================================================
echo   Starting Voiceline Chat Server...
echo ====================================================
cd /d "%~dp0"
node server/server.js
pause
