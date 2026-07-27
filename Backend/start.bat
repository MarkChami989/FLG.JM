@echo off
cd /d "%~dp0"
set PORT=5000
set TITLE=backend (port %PORT%)

echo Freeing port %PORT% if busy...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":%PORT% " ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1

start "%TITLE%" cmd /k npm run dev
exit /b
