#!/bin/bash
# 🦊 Firefox Browser Launch Script for Watchtower Live
# Alternative to Chromium for camera access

echo "🦊 Launching Watchtower Live with Firefox..."

# Get the Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
URL="http://${PI_IP}:3000"

echo "📍 Accessing: $URL"

# Install Firefox if not present
if ! command -v firefox-esr &> /dev/null; then
    echo "📦 Installing Firefox ESR..."
    sudo apt update
    sudo apt install -y firefox-esr
fi

# Kill any existing Firefox processes
pkill -f firefox 2>/dev/null
sleep 2

# Launch Firefox with camera permissions
echo "🚀 Launching Firefox with camera access..."
firefox-esr \
    --new-window \
    --kiosk \
    "$URL" &

echo "✅ Firefox launched!"
echo "🔧 Firefox camera tips:"
echo "   1. Allow camera permissions when prompted"
echo "   2. Check: about:preferences#privacy (camera permissions)"
echo "   3. Test camera: http://10.10.10.85:3000/camera-test.html"
