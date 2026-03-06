@echo off
cd /d "%~dp0"
title Exoplanet AI

echo.
echo ========================================
echo   Exoplanet AI - Starting...
echo ========================================
echo.

if not exist "frontend" (
    echo ERROR: "frontend" folder not found.
    echo Run this from the exoplanet-ai folder.
    echo.
    pause
    exit /b 1
)

set "FRONTEND=%~dp0frontend"

echo Opening new window...
echo.
start "Exoplanet AI" cmd /k "cd /d "%FRONTEND%" && (if not exist node_modules npm install) && echo. && echo Open browser: http://localhost:3000 && echo. && npm run dev"

echo.
echo A new window opened. Use that window - keep it open.
echo You can close this window now.
echo.
pause
