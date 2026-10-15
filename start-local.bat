@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Install Node.js 22 or newer first.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing project dependencies for the first launch...
  call npm ci
  if errorlevel 1 goto :error
)

if /i "%~1"=="--check" (
  echo Local startup check passed.
  exit /b 0
)

echo.
echo Starting Skeleton Playground...
echo The browser will open automatically. Press Ctrl+C to stop.
echo.
call npm run dev -- --open /skeleton-playground/
if errorlevel 1 goto :error
exit /b 0

:error
echo.
echo [ERROR] The local site could not start. Review the message above.
pause
exit /b 1

pause