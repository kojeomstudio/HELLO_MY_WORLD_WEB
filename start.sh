#!/bin/bash
echo "========================================"
echo "  HelloMyWorld Web Game Launcher"
echo "========================================"
echo ""

echo "Starting server..."
gnome-terminal -- bash -c "dotnet run --project web/server; exec bash" 2>/dev/null || \
xterm -e "dotnet run --project web/server; bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && dotnet run --project web/server"' 2>/dev/null || \
echo "Could not open new terminal. Starting server in background..."

sleep 5

echo "Starting client..."
gnome-terminal -- bash -c "npm run dev --prefix web/client; exec bash" 2>/dev/null || \
xterm -e "npm run dev --prefix web/client; bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev --prefix web/client"' 2>/dev/null || \
echo "Could not open new terminal. Starting client..."

sleep 3

echo "Opening browser..."
xdg-open http://localhost:5173 2>/dev/null || open http://localhost:5173 2>/dev/null || \
echo "Please open http://localhost:5173 manually"

echo ""
echo "Game is ready! Close server/client windows to stop."
