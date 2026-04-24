@echo off
setlocal

echo ========================================
echo  HelloMyWorld Web Game - Production Build
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

echo [1/4] Restoring server dependencies...
dotnet restore web\server\WebGameServer.csproj
if %ERRORLEVEL% neq 0 (
    echo ERROR: Server restore failed.
    exit /b 1
)

echo [2/4] Building server...
dotnet build web\server\WebGameServer.csproj --configuration Release
if %ERRORLEVEL% neq 0 (
    echo ERROR: Server build failed.
    exit /b 1
)

echo [3/4] Installing client dependencies...
if not exist "web\client\node_modules" (
    cd /d "%~dp0web\client" && npm install
    cd /d "%~dp0"
)

echo [4/4] Building client...
cd /d "%~dp0web\client" && npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Client build failed.
    exit /b 1
)

echo.
echo ========================================
echo  Build completed successfully!
echo ========================================
