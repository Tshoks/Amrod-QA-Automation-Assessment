@echo off
setlocal

echo Installing dependencies...
call npm install
if errorlevel 1 exit /b %errorlevel%

echo Running build, lint, and format checks...
call npm run build
if errorlevel 1 exit /b %errorlevel%
call npm run lint
if errorlevel 1 exit /b %errorlevel%
call npm run format:check
if errorlevel 1 exit /b %errorlevel%

echo Stopping any previous Allure report server...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'io\.qameta\.allure\.CommandLine' -and $_.CommandLine -match '\bserve\b' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"

echo Cleaning previous Allure artifacts...
if exist ".\allure-results" rmdir /s /q ".\allure-results"
if exist ".\allure-report" rmdir /s /q ".\allure-report"

echo Running Playwright smoke tests...
call npm run test:smoke > smoke-output.txt 2>&1
set SMOKE_EXIT=%ERRORLEVEL%
type smoke-output.txt
findstr /C:"No tests found" smoke-output.txt >nul
if not errorlevel 1 (
    echo No tests found; skipping...
)
if %SMOKE_EXIT% neq 0 exit /b %SMOKE_EXIT%

echo Starting Allure report server...
call npx allure serve .\allure-results
if errorlevel 1 exit /b %errorlevel%