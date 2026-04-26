@echo off
setlocal

echo === HelloMyWorld CLI Test Runner ===
echo.

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js not found.
    exit /b 1
)

where dotnet >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: dotnet SDK not found.
    exit /b 1
)

echo [1/3] Building server...
dotnet build web\server\WebGameServer.csproj -c Release -v q
if %ERRORLEVEL% neq 0 (
    echo FAIL: Server build failed
    exit /b 1
)

echo [2/3] Installing SignalR client dependency...
if not exist "node_modules\@microsoft\signalr" (
    echo Installing @microsoft/signalr for test runner...
    npm install --no-save @microsoft/signalr
)

echo [3/3] Starting server and running tests...
echo Starting server in background...
start /B dotnet run --project web\server\WebGameServer.csproj --no-build -c Release > nul 2>&1

echo Waiting for server to be ready...
timeout /t 8 /nobreak > nul

:CHECK_SERVER
curl -s http://localhost:5266/api/status > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Server not ready, waiting...
    timeout /t 3 /nobreak > nul
    curl -s http://localhost:5266/api/status > nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo FAIL: Server did not start
        taskkill /F /IM WebGameServer.dll 2> nul
        exit /b 1
    )
)

echo Server is ready.
echo.

set "TEST_ARGS=%*"
if "%TEST_ARGS%"=="" set "TEST_ARGS=all"

echo Running: node cli-test.mjs %TEST_ARGS%
echo.
node cli-test.mjs %TEST_ARGS%
set TEST_RESULT=%ERRORLEVEL%

echo.
echo Stopping server...
taskkill /F /IM WebGameServer.dll 2> nul

if %TEST_RESULT% equ 0 (
    echo === ALL TESTS PASSED ===
) else (
    echo === SOME TESTS FAILED ===
)

exit /b %TEST_RESULT%
