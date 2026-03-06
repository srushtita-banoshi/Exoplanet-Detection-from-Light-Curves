@echo off
cd /d "%~dp0"
title Exoplanet AI - Launcher
echo.
echo ========================================
echo   Exoplanet AI - Starting both servers
echo ========================================
echo.

if not exist "backend\main.py" (
    echo ERROR: Run this from the exoplanet-ai folder.
    pause
    exit /b 1
)
if not exist "backend\venv" (
    echo First time? Run FIRST-TIME-SETUP.bat before RUN-EVERYTHING.bat
    pause
    exit /b 1
)
if not exist "frontend\node_modules" (
    echo First time? Run FIRST-TIME-SETUP.bat before RUN-EVERYTHING.bat
    pause
    exit /b 1
)

REM Start backend in new window
echo Starting BACKEND on port 8000...
start "Backend (port 8000)" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000"

echo Waiting 4 seconds...
timeout /t 4 /nobreak >nul

REM Start frontend in new window
echo Starting FRONTEND on port 3000...
start "Frontend (port 3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Waiting 10 seconds for frontend to be ready...
timeout /t 10 /nobreak >nul

echo Opening http://localhost:3000
start http://localhost:3000

echo.
echo Keep both "Backend" and "Frontend" windows OPEN.
echo If backend says "No module named..." run FIRST-TIME-SETUP.bat
echo.
pause
