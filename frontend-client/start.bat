@echo off
cd /d "%~dp0"
set PORT=3000
set TITLE=frontend-client (port %PORT%)

echo Freeing port %PORT% if busy...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":%PORT% " ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1

start "%TITLE%" cmd /k npm run dev -- --strictPort

echo Waiting for dev server on port %PORT%...
set /a tries=0
:waitloop
curl -s -o nul http://localhost:%PORT%
if not errorlevel 1 goto ready
set /a tries+=1
if %tries% GEQ 30 (
    echo Dev server did not come up on port %PORT% - check the "%TITLE%" window.
    goto :eof
)
timeout /t 1 /nobreak >nul
goto waitloop

:ready
start http://localhost:%PORT%
exit /b
