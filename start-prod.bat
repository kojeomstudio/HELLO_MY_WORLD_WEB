@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  HelloMyWorld Web Game - Production
echo ========================================
echo.

where dotnet >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: dotnet SDK not found.
    exit /b 1
)

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js not found.
    exit /b 1
)

echo [1/3] Building client...
if not exist "web\client\node_modules" (
    echo Installing client dependencies...
    cd /d "%~dp0web\client" && npm install
    cd /d "%~dp0"
)
cd /d "%~dp0web\client" && call npm run build
cd /d "%~dp0"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Client build failed.
    exit /b 1
)

echo [2/3] Building server...
dotnet build web\server\WebGameServer.csproj --configuration Release
if %ERRORLEVEL% neq 0 (
    echo ERROR: Server build failed.
    exit /b 1
)

echo [3/3] Starting server (serves client at http://localhost:5266)...
echo.
echo ========================================
echo  Game is running!
echo  Open: http://localhost:5266
echo ========================================
echo.
echo Press any key to stop...
start "" /B dotnet run --project web\server\WebGameServer.csproj --no-build -c Release
pause >nul

taskkill /F /IM WebGameServer.dll 2> nul
echo Server stopped.
