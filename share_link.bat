@echo off
title Voiceline - Share Link for Friends
cd /d "%~dp0"
node server/tunnel.js
pause
