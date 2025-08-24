#!/bin/bash
# 🍓 Advanced Raspberry Pi Browser Launch Script
# This script launches Chromium with maximum camera permissions

echo "🍓 Launching Watchtower Live with advanced camera permissions..."

# Get the Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
URL="http://${PI_IP}:3000"

echo "📍 Accessing: $URL"

# Kill any existing Chromium processes
pkill -f chromium-browser 2>/dev/null
sleep 2

# Launch Chromium with maximum camera permissions
echo "🚀 Launching Chromium with advanced camera access..."
chromium-browser \
    --use-fake-ui-for-media-stream \
    --use-fake-device-for-media-stream \
    --allow-running-insecure-content \
    --disable-web-security \
    --disable-features=VizDisplayCompositor \
    --disable-gpu-sandbox \
    --no-sandbox \
    --disable-dev-shm-usage \
    --disable-background-timer-throttling \
    --disable-renderer-backgrounding \
    --disable-backgrounding-occluded-windows \
    --disable-ipc-flooding-protection \
    --disable-background-networking \
    --disable-default-apps \
    --disable-extensions \
    --disable-sync \
    --disable-translate \
    --hide-scrollbars \
    --mute-audio \
    --no-first-run \
    --no-default-browser-check \
    --disable-component-update \
    --disable-domain-reliability \
    --disable-features=TranslateUI \
    --disable-ipc-flooding-protection \
    --disable-background-timer-throttling \
    --disable-renderer-backgrounding \
    --disable-backgrounding-occluded-windows \
    --disable-background-networking \
    --disable-default-apps \
    --disable-extensions \
    --disable-sync \
    --disable-translate \
    --hide-scrollbars \
    --mute-audio \
    --no-first-run \
    --no-default-browser-check \
    --disable-component-update \
    --disable-domain-reliability \
    --disable-features=TranslateUI \
    --user-data-dir=/tmp/chrome-watchtower-advanced \
    "$URL" &

echo "✅ Advanced Chromium launched!"
echo "🔧 If camera still doesn't work, try:"
echo "   1. Check if webcam is detected: lsusb | grep -i camera"
echo "   2. Test webcam: fswebcam --no-banner --device /dev/video1 test.jpg"
echo "   3. Check browser permissions: chrome://settings/content/camera"
