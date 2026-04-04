@echo off
echo ========================================
echo   HelloMyWorld Web Game Launcher
echo ========================================
echo.

echo Starting server...
start "HelloMyWorld Server" cmd /k "dotnet run --project web\server"
echo Server starting on http://localhost:5266

timeout /t 5 /nobreak >nul

echo Starting client...
start "HelloMyWorld Client" cmd /k "npm run dev --prefix web\client"

timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo Game is ready! Close server/client windows to stop.
echo Press any key to close this launcher...
pause >nul
