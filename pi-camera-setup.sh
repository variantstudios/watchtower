#!/bin/bash
# 🍓 Raspberry Pi Camera Module v1 Setup Script

echo "🍓 Setting up Raspberry Pi Camera Module v1..."

# Enable camera interface
echo "📷 Enabling camera interface..."
sudo raspi-config nonint do_camera 0

# Install camera tools
echo "📦 Installing camera tools..."
sudo apt update
sudo apt install -y python3-picamera2 python3-picamera2-docs libcamera-tools

# Check camera status
echo "🔍 Checking camera status..."
vcgencmd get_camera

# Test camera detection
echo "📹 Testing camera detection..."
ls -la /dev/video*

# Test legacy camera
echo "📸 Testing legacy camera (raspistill)..."
if command -v raspistill &> /dev/null; then
    raspistill -o test_legacy.jpg -t 1000
    if [ -f test_legacy.jpg ]; then
        echo "✅ Legacy camera test successful"
        ls -la test_legacy.jpg
    else
        echo "❌ Legacy camera test failed"
    fi
else
    echo "⚠️ raspistill not available"
fi

# Test new camera stack
echo "📸 Testing new camera stack (libcamera)..."
if command -v libcamera-still &> /dev/null; then
    libcamera-still -o test_libcamera.jpg -t 1000
    if [ -f test_libcamera.jpg ]; then
        echo "✅ New camera stack test successful"
        ls -la test_libcamera.jpg
    else
        echo "❌ New camera stack test failed"
    fi
else
    echo "⚠️ libcamera-still not available"
fi

# List available cameras
echo "📋 Available cameras:"
libcamera-hello --list-cameras 2>/dev/null || echo "No cameras found with libcamera"

echo "✅ Camera setup complete!"
echo "🔧 Next steps:"
echo "   1. Reboot: sudo reboot"
echo "   2. Test camera: libcamera-still -o test.jpg"
echo "   3. Run Watchtower: ./pi-start.sh"
