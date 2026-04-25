@echo off
echo Starting HelloMyWorld Web Game (Production)...
echo.

echo Building client...
cd /d %~dp0web\client
call npm run build
cd /d %~dp0

echo Starting C# server...
start "Game Server" cmd /c "cd /d %~dp0web\server && dotnet run --project WebGameServer.csproj"

timeout /t 2 /nobreak >nul

echo.
echo Server starting on http://localhost:5266
echo Press any key to stop...
pause >nul

taskkill /f /fi "WINDOWTITLE eq Game Server" >nul 2>&1
echo Server stopped.
