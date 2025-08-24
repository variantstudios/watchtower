#!/bin/bash

# 🍓 Watchtower Live - Raspberry Pi Startup Script

echo "🍓 Starting Watchtower Live on Raspberry Pi..."

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo; then
    echo "❌ This script is designed for Raspberry Pi only"
    exit 1
fi

# Get Pi model
PI_MODEL=$(grep "Model" /proc/cpuinfo | cut -d: -f2 | xargs)
echo "🍓 Running on: $PI_MODEL"

# Check system resources
echo "🍓 Checking system resources..."
MEMORY=$(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
CPU_TEMP=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null | awk '{printf "%.1f°C", $1/1000}')
echo "🍓 Memory usage: $MEMORY"
echo "🍓 CPU temperature: $CPU_TEMP"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "🍓 Run: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "🍓 Node.js version: $NODE_VERSION"

# Check if webcam is connected
if ! ls /dev/video* &> /dev/null; then
    echo "⚠️  No webcam detected. Please connect a USB webcam."
    echo "🍓 Run: lsusb | grep -i camera"
fi

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found. Please run this script from the Watchtower Live directory."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "🍓 Installing dependencies..."
    npm install
fi

# Set Pi-specific environment variables
export NODE_ENV=production
export PI_OPTIMIZED=true

# Apply Pi optimizations
echo "🍓 Applying Pi optimizations..."

# Increase swap if needed
SWAP_SIZE=$(free | grep Swap | awk '{print $2}')
if [ $SWAP_SIZE -lt 1048576 ]; then
    echo "🍓 Increasing swap space..."
    sudo sed -i 's/CONF_SWAPSIZE=100/CONF_SWAPSIZE=1024/' /etc/dphys-swapfile
    sudo systemctl restart dphys-swapfile
fi

# Disable WiFi power management
sudo iwconfig wlan0 power off 2>/dev/null || true

# Set process priority
echo "🍓 Setting process priority..."

# Start the application
echo "🍓 Starting Watchtower Live..."
echo "🍓 Access the application at: http://$(hostname -I | awk '{print $1}'):3000"

# Run with garbage collection enabled
node --expose-gc server.js

echo "🍓 Watchtower Live stopped."
