#!/bin/bash
# 🍓 Pi Camera Module Browser Launch Script

echo "🍓 Launching Watchtower Live with Pi Camera Module..."

# Get the Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
URL="http://${PI_IP}:3000"

echo "📍 Accessing: $URL"

# Kill any existing browser processes
pkill -f chromium-browser 2>/dev/null
sleep 2

# Launch Chromium with Pi Camera optimizations
echo "🚀 Launching Chromium with Pi Camera access..."
chromium-browser \
    --use-fake-ui-for-media-stream \
    --use-fake-device-for-media-stream \
    --allow-running-insecure-content \
    --disable-web-security \
    --no-sandbox \
    --disable-gpu-sandbox \
    --disable-dev-shm-usage \
    --disable-features=VizDisplayCompositor \
    --force-device-scale-factor=1 \
    --disable-high-dpi-support \
    --disable-software-rasterizer \
    --disable-gpu-memory-buffer-video-frames \
    --disable-gpu-memory-buffer-compositor-resources \
    --disable-gpu-memory-buffer-video-capture \
    --disable-gpu-memory-buffer-camera-resources \
    --disable-gpu-memory-buffer-scanout-buffers \
    --disable-gpu-memory-buffer-shared-images \
    --user-data-dir=/tmp/chrome-pi-camera \
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
    "$URL" &

echo "✅ Chromium launched with Pi Camera support!"
echo "🔧 If camera doesn't work:"
echo "   1. Check camera: vcgencmd get_camera"
echo "   2. Test camera: libcamera-still -o test.jpg"
echo "   3. Check browser: chrome://settings/content/camera"
