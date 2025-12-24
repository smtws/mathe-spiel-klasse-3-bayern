#!/bin/sh
# Dschungel-Mathe-Expedition Starter
# Math learning game for 3rd graders

GAME_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=3000

# Load nvm and use correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 >/dev/null 2>&1

cd "$GAME_DIR" || exit 1

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Kill any existing process on port 3000
kill_port_process() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -t -i:"$1" 2>/dev/null
    elif command -v fuser >/dev/null 2>&1; then
        fuser "$1/tcp" 2>/dev/null | tr -s ' '
    elif command -v ss >/dev/null 2>&1; then
        ss -tlnp 2>/dev/null | grep ":$1 " | sed -n 's/.*pid=\([0-9]*\).*/\1/p'
    fi
}

OLD_PID=$(kill_port_process $PORT)
if [ -n "$OLD_PID" ]; then
    echo "Stopping existing server on port $PORT..."
    kill $OLD_PID 2>/dev/null
    sleep 1
fi

echo "Starting Dschungel-Mathe-Expedition on port $PORT..."

# Start the dev server in background
npm run dev -- --port $PORT &
SERVER_PID=$!

# Wait for server to be ready (check every second, max 30 seconds)
echo "Waiting for server to start..."
i=0
while [ $i -lt 30 ]; do
    if curl -s "http://localhost:$PORT" >/dev/null 2>&1; then
        echo "Server is ready!"
        break
    fi
    sleep 1
    printf "."
    i=$((i + 1))
done
echo ""

# Open in default browser
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:$PORT"
elif command -v open >/dev/null 2>&1; then
    open "http://localhost:$PORT"
elif command -v firefox >/dev/null 2>&1; then
    firefox "http://localhost:$PORT"
elif command -v chromium >/dev/null 2>&1; then
    chromium "http://localhost:$PORT"
elif command -v google-chrome >/dev/null 2>&1; then
    google-chrome "http://localhost:$PORT"
fi

echo ""
echo "==================================="
echo "Dschungel-Mathe-Expedition läuft!"
echo "URL: http://localhost:$PORT"
echo "Zum Beenden: Ctrl+C"
echo "==================================="

# Wait for server process
wait $SERVER_PID
