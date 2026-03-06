@echo off
cd /d "%~dp0"
echo ========================================
echo   Exoplanet AI - First time setup
echo ========================================
echo.

REM Backend
echo [1/2] Backend: creating venv and installing packages...
cd backend
if not exist venv (
    python -m venv venv
    if errorlevel 1 (
        echo Install Python from https://www.python.org/ and add to PATH.
        cd ..
        pause
        exit /b 1
    )
)
call venv\Scripts\activate
pip install -r requirements.txt
cd ..
echo Backend setup done.
echo.

REM Frontend
echo [2/2] Frontend: installing npm packages...
cd frontend
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo Install Node.js from https://nodejs.org/
        cd ..
        pause
        exit /b 1
    )
)
cd ..
echo Frontend setup done.
echo.
echo Now double-click RUN-EVERYTHING.bat to start the app.
pause
