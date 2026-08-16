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

echo Running Playwright tests...
call npx playwright test
if errorlevel 1 exit /b %errorlevel%

echo Starting Allure report server...
call npx allure serve .\allure-results
if errorlevel 1 exit /b %errorlevel%
