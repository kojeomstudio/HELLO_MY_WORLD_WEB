#!/bin/bash
set -e

echo "========================================"
echo " HelloMyWorld Web Game - Production"
echo "========================================"
echo ""

command -v dotnet >/dev/null 2>&1 || { echo "ERROR: dotnet SDK not found. Please install .NET 8.0 SDK."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js not found. Please install Node.js 18+."; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[1/3] Building client..."
if [ ! -d "$SCRIPT_DIR/web/client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd "$SCRIPT_DIR/web/client" && npm install
fi
cd "$SCRIPT_DIR/web/client" && npm run build
cd "$SCRIPT_DIR"

echo "[2/3] Building server..."
dotnet build "$SCRIPT_DIR/web/server/WebGameServer.csproj" --configuration Release

echo "[3/3] Starting server (serves client at http://localhost:5266)..."
echo ""
echo "========================================"
echo " Game is running!"
echo " Open: http://localhost:5266"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop..."

trap 'echo "Server stopped."; exit 0' INT TERM

dotnet run --project "$SCRIPT_DIR/web/server/WebGameServer.csproj" --no-build -c Release
