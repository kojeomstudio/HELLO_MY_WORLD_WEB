#!/bin/bash
trap 'kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo "Servers stopped."' EXIT INT TERM

echo "========================================"
echo " HelloMyWorld Web Game - Starting"
echo "========================================"
echo ""

echo "Starting C# server..."
cd "$(dirname "$0")/web/server"
dotnet run --project WebGameServer.csproj &
SERVER_PID=$!
cd - > /dev/null

sleep 5

echo "Starting Vite client dev server..."
cd "$(dirname "$0")/web/client"
npm run dev &
CLIENT_PID=$!
cd - > /dev/null

echo ""
echo "========================================"
echo " Game is starting!"
echo " Server: http://localhost:5266"
echo " Client: http://localhost:5173"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers..."
wait
