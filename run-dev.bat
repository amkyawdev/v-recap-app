@echo off
REM V Recap App - Development Script (Windows)
REM Usage: Run this file to start development server

echo ========================================
echo   V Recap App - Development Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo Starting development server...
echo.

REM Start the development server
npm run dev

echo.
echo Server stopped.
pause