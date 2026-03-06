@echo off
cd /d "%~dp0"
title Exoplanet AI
echo Starting server and opening app...
start /B python -m http.server 8080 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start http://127.0.0.1:8080
echo.
echo App opened at: http://127.0.0.1:8080
echo Keep this window open. Close to stop server.
pause
