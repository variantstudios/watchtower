# 🍓 Watchtower Live - Raspberry Pi Setup Guide

## Hardware Requirements

- Raspberry Pi 3 B+ (or newer)
- USB Webcam (any standard USB webcam)
- MicroSD Card (16GB+ recommended)
- Power Supply (5V/2.5A)
- Network Connection (WiFi or Ethernet)

## Step 1: Prepare Raspberry Pi OS

### Install Raspberry Pi OS

1. Download **Raspberry Pi OS Lite** (no desktop needed) from [raspberrypi.org](https://www.raspberrypi.org/software/)
2. Flash to microSD card using Raspberry Pi Imager
3. Enable SSH and set WiFi credentials during imaging

### Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nodejs npm git python3-pip

# Install Node.js 18+ (required for modern features)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be 18.x or higher
npm --version
```

## Step 2: Install Webcam Support

### Test Webcam

```bash
# Install webcam tools
sudo apt install -y fswebcam v4l-utils

# List connected cameras
lsusb | grep -i camera
v4l2-ctl --list-devices

# Test webcam (creates test image)
fswebcam test.jpg
```

### Enable Camera Interface

```bash
# Enable camera interface
sudo raspi-config

# Navigate to: Interface Options → Camera → Enable
# Reboot when prompted
sudo reboot
```

## Step 3: Install Watchtower Live

### Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone the repository
git clone <your-repo-url> watchtower
cd watchtower

# Install dependencies
npm install
```

### Configure for Pi

```bash
# Create Pi-specific configuration
cat > pi-config.js << 'EOF'
// Pi-specific optimizations
module.exports = {
  // Reduce video resolution for better performance
  videoWidth: 640,
  videoHeight: 480,

  // Lower detection frequency to reduce CPU usage
  detectionInterval: 1000, // 1 second between detections

  // Reduce image quality for faster processing
  imageQuality: 0.6,

  // Enable hardware acceleration if available
  enableHardwareAcceleration: true
};
EOF
```

## Step 4: Optimize for Pi Performance

### Memory and CPU Optimizations

```bash
# Add to /boot/config.txt for better performance
sudo nano /boot/config.txt

# Add these lines:
gpu_mem=128
over_voltage=2
arm_freq=1400
```

### Disable Unnecessary Services

```bash
# Disable desktop and unnecessary services
sudo systemctl disable lightdm
sudo systemctl disable bluetooth
sudo systemctl disable hciuart

# Disable WiFi power management
sudo iwconfig wlan0 power off
```

### Increase Swap Space

```bash
# Increase swap for better memory management
sudo nano /etc/dphys-swapfile

# Change CONF_SWAPSIZE=100 to:
CONF_SWAPSIZE=1024

# Restart swap service
sudo systemctl restart dphys-swapfile
```

## Step 5: Configure Auto-Start

### Create Systemd Service

```bash
sudo nano /etc/systemd/system/watchtower.service
```

Add this content:

```ini
[Unit]
Description=Watchtower Live
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/watchtower
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service

```bash
# Enable service to start on boot
sudo systemctl enable watchtower

# Start service
sudo systemctl start watchtower

# Check status
sudo systemctl status watchtower
```

## Step 6: Network Configuration

### Static IP (Optional but Recommended)

```bash
sudo nano /etc/dhcpcd.conf

# Add at the end:
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
```

### Port Forwarding (if accessing from internet)

Configure your router to forward port 3000 to the Pi's IP address.

## Step 7: Performance Monitoring

### Monitor System Resources

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Monitor CPU and memory
htop

# Monitor disk I/O
iotop
```

### Check Logs

```bash
# View application logs
sudo journalctl -u watchtower -f

# View system logs
sudo journalctl -f
```

## Step 8: Webcam Troubleshooting

### Common Issues and Solutions

**Webcam not detected:**

```bash
# Check USB devices
lsusb

# Check video devices
ls /dev/video*

# Install additional drivers if needed
sudo apt install -y v4l-utils
```

**Permission issues:**

```bash
# Add pi user to video group
sudo usermod -a -G video pi

# Reboot to apply changes
sudo reboot
```

**Low frame rate:**

```bash
# Reduce video resolution in pi-config.js
videoWidth: 320,
videoHeight: 240,
```

## Performance Tips

### For Better Performance:

1. **Use wired Ethernet** instead of WiFi when possible
2. **Reduce video resolution** to 640x480 or lower
3. **Increase detection interval** to 2-3 seconds
4. **Use a fast microSD card** (Class 10 or better)
5. **Keep Pi cool** - add a heatsink/fan if needed

### For Better Detection:

1. **Ensure good lighting** in the monitored area
2. **Position camera** at optimal height and angle
3. **Reduce motion** in the background
4. **Use higher confidence threshold** (0.5-0.7)

## Accessing the Application

### Local Access:

- Open browser on any device on the same network
- Navigate to: `http://192.168.1.100:3000` (replace with Pi's IP)

### Remote Access:

- Set up port forwarding on your router
- Access via: `http://your-public-ip:3000`

## Security Considerations

### Basic Security:

```bash
# Change default password
passwd

# Update regularly
sudo apt update && sudo apt upgrade

# Configure firewall
sudo ufw enable
sudo ufw allow 3000
sudo ufw allow ssh
```

### Advanced Security:

- Use HTTPS with Let's Encrypt
- Set up VPN for remote access
- Regular security updates
- Monitor system logs

## Troubleshooting

### Common Issues:

**High CPU Usage:**

- Reduce video resolution
- Increase detection interval
- Close unnecessary processes

**Memory Issues:**

- Increase swap space
- Reduce image quality
- Restart service periodically

**Network Issues:**

- Check WiFi signal strength
- Use wired connection if possible
- Check router settings

**Detection Issues:**

- Improve lighting
- Adjust camera position
- Lower confidence threshold

## Support

For issues specific to Raspberry Pi setup:

1. Check system logs: `sudo journalctl -u watchtower -f`
2. Monitor resources: `htop`
3. Test webcam: `fswebcam test.jpg`
4. Check network: `ping google.com`

---

**Happy Monitoring! 🍓📹**
