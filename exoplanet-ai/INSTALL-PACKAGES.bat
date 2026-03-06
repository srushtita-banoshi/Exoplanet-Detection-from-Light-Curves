@echo off
cd /d "%~dp0frontend"
title Installing packages...
echo.
echo Installing framer-motion and other packages...
echo This may take 1-2 minutes. Please wait.
echo.
call npm install
echo.
if errorlevel 1 (
    echo Installation failed. Make sure Node.js is installed from nodejs.org
) else (
    echo.
    echo SUCCESS! Packages installed.
    echo Now run OPEN-APP.bat to start the website.
)
echo.
pause
