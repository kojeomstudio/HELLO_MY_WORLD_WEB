@echo off
echo === HelloMyWorld Protocol Test Runner ===
echo.

echo [1/3] Building server...
dotnet build web\server\WebGameServer.csproj -c Release -v q
if %ERRORLEVEL% neq 0 (
    echo FAIL: Server build failed
    exit /b 1
)

echo [2/3] Building client...
call npm run build --prefix web\client
if %ERRORLEVEL% neq 0 (
    echo FAIL: Client build failed
    exit /b 1
)

echo [3/3] Starting server and running protocol tests...
echo Starting server in background...
start /B dotnet run --project web\server\WebGameServer.csproj --no-build -c Release > nul 2>&1

echo Waiting for server to be ready...
set WAIT_COUNT=0
:CHECK_SERVER
curl -s http://localhost:5266/api/status > nul 2>&1
if %ERRORLEVEL% equ 0 goto SERVER_READY
set /a WAIT_COUNT+=1
if %WAIT_COUNT% geq 30 (
    echo FAIL: Server did not start within 30 seconds
    taskkill /F /IM WebGameServer.dll 2> nul
    exit /b 1
)
timeout /t 1 /nobreak > nul
goto CHECK_SERVER
:SERVER_READY

echo Server is ready. Running protocol tests...
node test-protocol.mjs
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
