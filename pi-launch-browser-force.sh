#!/bin/bash
# 🍓 Force Camera Access Browser Launch Script
# This script launches Chromium with maximum camera permissions and security bypass

echo "🍓 Force launching Watchtower Live with camera access..."

# Get the Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
URL="http://${PI_IP}:3000"

echo "📍 Accessing: $URL"

# Kill any existing Chromium processes
echo "🔄 Killing existing Chromium processes..."
pkill -f chromium-browser 2>/dev/null
sleep 3

# Clear any existing user data
echo "🧹 Clearing browser data..."
rm -rf /tmp/chrome-watchtower-force 2>/dev/null
rm -rf ~/.config/chromium/Default/Preferences 2>/dev/null

# Create a custom preferences file that enables camera
mkdir -p /tmp/chrome-watchtower-force/Default
cat > /tmp/chrome-watchtower-force/Default/Preferences << 'EOF'
{
  "profile": {
    "default_content_setting_values": {
      "media_stream_camera": 1,
      "media_stream_mic": 1
    },
    "content_settings": {
      "exceptions": {
        "media_stream_camera": {
          "http://10.10.10.85:3000,*": {
            "setting": 1
          }
        },
        "media_stream_mic": {
          "http://10.10.10.85:3000,*": {
            "setting": 1
          }
        }
      }
    }
  }
}
EOF

echo "🚀 Launching Chromium with forced camera access..."
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
    --user-data-dir=/tmp/chrome-watchtower-force \
    --force-device-scale-factor=1 \
    --disable-high-dpi-support \
    --disable-software-rasterizer \
    --disable-gpu-memory-buffer-video-frames \
    --disable-gpu-memory-buffer-compositor-resources \
    --disable-gpu-memory-buffer-video-capture \
    --disable-gpu-memory-buffer-camera-resources \
    --disable-gpu-memory-buffer-scanout-buffers \
    --disable-gpu-memory-buffer-shared-images \
    --disable-gpu-memory-buffer-video-frames \
    --disable-gpu-memory-buffer-compositor-resources \
    --disable-gpu-memory-buffer-video-capture \
    --disable-gpu-memory-buffer-camera-resources \
    --disable-gpu-memory-buffer-scanout-buffers \
    --disable-gpu-memory-buffer-shared-images \
    "$URL" &

echo "✅ Force Chromium launched!"
echo "🔧 If camera still doesn't work:"
echo "   1. Check browser console for camera API status"
echo "   2. Try: testCameraAccess() in browser console"
echo "   3. Check: chrome://settings/content/camera"
echo "   4. Verify webcam: fswebcam --no-banner --device /dev/video1 test.jpg"
