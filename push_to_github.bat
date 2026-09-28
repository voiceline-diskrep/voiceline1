@echo off
title Push Voiceline to GitHub
echo ====================================================
echo   Pushing Voiceline code to your GitHub repository...
echo ====================================================
cd /d "%~dp0"
git push origin main
echo.
echo All done! Press any key to close.
pause
