#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
trap 'kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo "Servers stopped."' EXIT INT TERM

echo "========================================"
echo " HelloMyWorld Web Game - Starting"
echo "========================================"
echo ""

if ! command -v dotnet &>/dev/null; then
    echo "ERROR: .NET SDK not found. Install .NET 8.0 SDK."
    exit 1
fi

if ! command -v node &>/dev/null; then
    echo "ERROR: Node.js not found. Install Node.js 18+."
    exit 1
fi

echo "Starting C# server..."
cd "$SCRIPT_DIR/web/server"
dotnet run --project WebGameServer.csproj &
SERVER_PID=$!
cd "$SCRIPT_DIR"

echo "Waiting for server to be ready..."
for i in $(seq 1 30); do
    if curl -s http://localhost:5266/api/status > /dev/null 2>&1; then
        echo "Server is ready."
        break
    fi
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "Server failed to start."
        exit 1
    fi
    sleep 1
done

echo "Starting Vite client dev server..."
cd "$SCRIPT_DIR/web/client"
if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
fi
npm run dev &
CLIENT_PID=$!
cd "$SCRIPT_DIR"

echo ""
echo "========================================"
echo " Game is starting!"
echo " Server: http://localhost:5266"
echo " Client: http://localhost:5173"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers..."
wait
