// 🍓 Raspberry Pi Camera Configuration
// This file contains Pi-specific optimizations for camera setup

const PI_CAMERA_CONFIG = {
  // Video constraints optimized for Pi performance
  videoConstraints: [
    {
      width: { ideal: 640 },
      height: { ideal: 480 }
    },
    {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user'
    },
    {
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'user'
    }
  ],

  // Detection settings optimized for Pi
  detectionSettings: {
    confidenceThreshold: 0.5,
    detectionInterval: 2000, // 2 seconds between detections
    saveInterval: 5000, // 5 seconds between saves
    notificationInterval: 30000 // 30 seconds between notifications
  },

  // Performance settings
  performance: {
    maxFPS: 15,
    imageQuality: 0.6,
    enableHardwareAcceleration: true
  }
};

// Helper function to get Pi-optimized video constraints
function getPiVideoConstraints() {
  return PI_CAMERA_CONFIG.videoConstraints;
}

// Helper function to check if running on Pi
function isRaspberryPi() {
  return navigator.userAgent.includes('Linux') &&
         (navigator.userAgent.includes('ARM') ||
          navigator.userAgent.includes('Raspberry'));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PI_CAMERA_CONFIG,
    getPiVideoConstraints,
    isRaspberryPi
  };
}
