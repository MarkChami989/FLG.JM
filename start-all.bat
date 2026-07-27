@echo off
cd /d "%~dp0"

call "%~dp0Backend\start.bat"
call "%~dp0Frontend\start.bat"
call "%~dp0frontend-client\start.bat"
