#!/bin/bash
# 🍓 Raspberry Pi Browser Launch Script for Watchtower Live
# This script launches Chromium with proper camera permissions

echo "🍓 Launching Watchtower Live in Chromium with camera permissions..."

# Get the Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
URL="http://${PI_IP}:3000"

echo "📍 Accessing: $URL"

# Check if Chromium is installed
if ! command -v chromium-browser &> /dev/null; then
    echo "📦 Installing Chromium browser..."
    sudo apt update
    sudo apt install -y chromium-browser
fi

# Launch Chromium with camera permissions
echo "🚀 Launching Chromium with camera access..."
chromium-browser \
    --use-fake-ui-for-media-stream \
    --use-fake-device-for-media-stream \
    --allow-running-insecure-content \
    --disable-web-security \
    --user-data-dir=/tmp/chrome-watchtower \
    --no-first-run \
    --no-default-browser-check \
    "$URL" &

echo "✅ Chromium launched! Camera should now work."
echo "🔧 If camera still doesn't work, try:"
echo "   1. Check camera permissions in browser"
echo "   2. Make sure webcam is connected: lsusb | grep -i camera"
echo "   3. Test webcam: fswebcam --no-banner --device /dev/video1 test.jpg"
