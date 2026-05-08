#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo " HelloMyWorld Web Game - Production Build"
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

echo "[1/4] Restoring server dependencies..."
dotnet restore web/server/WebGameServer.csproj

echo "[2/4] Building server..."
dotnet build web/server/WebGameServer.csproj --configuration Release

echo "[3/4] Installing client dependencies..."
if [ ! -d "web/client/node_modules" ]; then
    npm install --prefix web/client
fi

echo "[4/4] Building client..."
npm run build --prefix web/client

echo ""
echo "========================================"
echo " Build completed successfully!"
echo "========================================"
