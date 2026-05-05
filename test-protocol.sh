#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== HelloMyWorld Protocol Test Runner ==="
echo ""

if ! command -v node &>/dev/null; then
    echo "ERROR: Node.js not found."
    exit 1
fi

if ! command -v dotnet &>/dev/null; then
    echo "ERROR: dotnet SDK not found."
    exit 1
fi

echo "[1/3] Building server..."
dotnet build web/server/WebGameServer.csproj -c Release -v q

echo "[2/3] Building client..."
npm run build --prefix web/client

echo "[3/3] Starting server and running protocol tests..."
echo "Starting server in background..."
dotnet run --project web/server/WebGameServer.csproj --no-build -c Release &>/dev/null &
SERVER_PID=$!

cleanup() {
    echo ""
    echo "Stopping server (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Waiting for server to be ready..."
for i in $(seq 1 30); do
    if curl -s http://localhost:5266/api/status &>/dev/null; then
        echo "Server is ready."
        break
    fi
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "FAIL: Server failed to start."
        exit 1
    fi
    sleep 1
done

if ! curl -s http://localhost:5266/api/status &>/dev/null; then
    echo "FAIL: Server did not start within timeout."
    exit 1
fi

echo "Server is ready. Running protocol tests..."
SERVER_URL="http://localhost:5266" node test-protocol.mjs
TEST_RESULT=$?

echo ""
if [ $TEST_RESULT -eq 0 ]; then
    echo "=== ALL TESTS PASSED ==="
else
    echo "=== SOME TESTS FAILED ==="
fi

exit $TEST_RESULT
