@echo off
echo ========================================
echo  HelloMyWorld Web Game - Starting Server
echo ========================================
echo.

echo Starting C# server...
start "WebGameServer" cmd /c "cd /d %~dp0web\server && dotnet run --project WebGameServer.csproj"
timeout /t 5 /nobreak >nul

echo Starting Vite client dev server...
start "WebGameClient" cmd /c "cd /d %~dp0web\client && npm run dev"

echo.
echo ========================================
echo  Game is starting!
echo  Server: http://localhost:5266
echo  Client: http://localhost:5173
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /F /FI "WINDOWTITLE eq WebGameServer" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq WebGameClient" >nul 2>&1
echo Servers stopped.
