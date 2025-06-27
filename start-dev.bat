@echo off
echo Starting development environment...
echo.

REM Start npm run dev in a new window
echo Starting Next.js development server...
start "Next.js Dev Server" cmd /k "npm run dev"

REM Wait a moment for the first process to start
timeout /t 2 /nobreak > nul

REM Start the telegram polling script in another window
echo Starting Telegram polling script...
start "Telegram Polling" cmd /k "node test-telegram-polling.js"

echo.
echo Both processes have been started in separate windows.
echo - Next.js dev server should be running on http://localhost:3000
echo - Telegram polling script is running in the background
echo.
echo Press any key to close this window...
pause > nul 