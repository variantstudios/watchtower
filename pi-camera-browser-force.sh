#!/bin/bash
# 🍓 Force Camera Detection Browser Launch Script

echo "🍓 Launching Watchtower Live with Force Camera Detection..."

# Get the Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
URL="http://${PI_IP}:3000"

echo "📍 Accessing: $URL"

# Kill any existing browser processes
pkill -f chromium-browser 2>/dev/null
sleep 2

# Create a custom preferences directory
PREFS_DIR="/tmp/chrome-force-camera"
rm -rf "$PREFS_DIR"
mkdir -p "$PREFS_DIR"

# Create custom preferences file to force camera permissions
cat > "$PREFS_DIR/Default/Preferences" << 'EOF'
{
  "profile": {
    "default_content_setting_values": {
      "media_stream_camera": 1,
      "media_stream_mic": 1
    }
  },
  "media": {
    "device_id_salt": "force_camera_detection"
  }
}
EOF

# Launch Chromium with aggressive camera detection flags
echo "🚀 Launching Chromium with Force Camera Detection..."
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
    --user-data-dir="$PREFS_DIR" \
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
    --enable-logging \
    --v=1 \
    --enable-media-stream \
    --enable-usermedia-screen-capturing \
    --allow-file-access-from-files \
    --allow-file-access \
    --disable-features=WebRtcHideLocalIpsWithMdns \
    "$URL" &

echo "✅ Chromium launched with Force Camera Detection!"
echo "🔧 If camera still doesn't work:"
echo "   1. Check browser console for camera API errors"
echo "   2. Try: testCameraAccess() in browser console"
echo "   3. Check: chrome://settings/content/camera"
echo "   4. Restart browser with: pkill chromium && ./pi-camera-browser-force.sh"
