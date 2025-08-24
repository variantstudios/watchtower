// 🍓 Raspberry Pi Optimizations for Watchtower Live

// Pi-specific configuration
const PI_CONFIG = {
  // Reduced video resolution for better performance
  videoWidth: 640,
  videoHeight: 480,

  // Lower frame rate to reduce CPU usage
  frameRate: 15,

  // Reduced image quality for faster processing
  imageQuality: 0.6,

  // Longer detection intervals to reduce CPU load
  detectionInterval: 2000, // 2 seconds between detections

  // Higher confidence threshold to reduce false positives
  confidenceThreshold: 0.5,

  // Reduced notification frequency
  notificationThrottle: 60000, // 1 minute between notifications

  // Reduced save frequency
  saveThrottle: 10000, // 10 seconds between saves

  // Enable hardware acceleration if available
  enableHardwareAcceleration: true,

  // Memory management
  maxStoredImages: 50, // Limit stored images to save space

  // Network optimizations
  enableCompression: true,
  maxImageSize: 1024 * 1024 // 1MB max image size
};

// Performance monitoring
class PiPerformanceMonitor {
  constructor() {
    this.startTime = Date.now();
    this.frameCount = 0;
    this.detectionCount = 0;
    this.lastReport = Date.now();
  }

  recordFrame() {
    this.frameCount++;
    this.reportPerformance();
  }

  recordDetection() {
    this.detectionCount++;
  }

  reportPerformance() {
    const now = Date.now();
    if (now - this.lastReport > 30000) { // Report every 30 seconds
      const uptime = (now - this.startTime) / 1000;
      const fps = this.frameCount / uptime;
      const detectionsPerMinute = (this.detectionCount / uptime) * 60;

      console.log(`🍓 Pi Performance: ${fps.toFixed(1)} FPS, ${detectionsPerMinute.toFixed(1)} detections/min`);

      // Reset counters
      this.frameCount = 0;
      this.detectionCount = 0;
      this.lastReport = now;
    }
  }

  getSystemInfo() {
    // Get CPU and memory usage (requires additional packages on Pi)
    return {
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };
  }
}

// Memory management for Pi
class PiMemoryManager {
  constructor() {
    this.storedImages = [];
    this.maxImages = PI_CONFIG.maxStoredImages;
  }

  addImage(imageData) {
    this.storedImages.push({
      data: imageData,
      timestamp: Date.now()
    });

    // Remove old images if we exceed the limit
    if (this.storedImages.length > this.maxImages) {
      const removed = this.storedImages.shift();
      console.log(`🍓 Removed old image to save memory`);
    }
  }

  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    this.storedImages = this.storedImages.filter(img =>
      now - img.timestamp < maxAge
    );
  }
}

// Optimized detection loop for Pi
class PiDetectionLoop {
  constructor(video, model, callback) {
    this.video = video;
    this.model = model;
    this.callback = callback;
    this.isRunning = false;
    this.performanceMonitor = new PiPerformanceMonitor();
    this.lastDetection = 0;
  }

  start() {
    this.isRunning = true;
    this.detect();
  }

  stop() {
    this.isRunning = false;
  }

  async detect() {
    if (!this.isRunning) return;

    try {
      const now = Date.now();

      // Throttle detections to reduce CPU usage
      if (now - this.lastDetection < PI_CONFIG.detectionInterval) {
        setTimeout(() => this.detect(), 100);
        return;
      }

      this.lastDetection = now;
      this.performanceMonitor.recordFrame();

      const predictions = await this.model.detect(this.video);

      if (predictions.length > 0) {
        this.performanceMonitor.recordDetection();
      }

      this.callback(predictions);

    } catch (error) {
      console.error('🍓 Detection error:', error);
    }

    // Use setTimeout instead of requestAnimationFrame for better Pi performance
    setTimeout(() => this.detect(), 100);
  }
}

// Network optimizations for Pi
class PiNetworkOptimizer {
  constructor() {
    this.compressionEnabled = PI_CONFIG.enableCompression;
    this.maxImageSize = PI_CONFIG.maxImageSize;
  }

  optimizeImage(imageData) {
    // Reduce image quality for faster transmission
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Create a smaller canvas for Pi
    canvas.width = PI_CONFIG.videoWidth;
    canvas.height = PI_CONFIG.videoHeight;

    // Draw and compress
    ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', PI_CONFIG.imageQuality);
  }

  shouldSendImage(imageData) {
    // Check if image size is within limits
    const size = this.getImageSize(imageData);
    return size <= this.maxImageSize;
  }

  getImageSize(imageData) {
    // Estimate image size
    return imageData.length * 0.75; // Base64 is ~33% larger
  }
}

// Pi-specific utility functions
const PiUtils = {
  // Check if running on Raspberry Pi
  isRaspberryPi() {
    return process.platform === 'linux' &&
           require('fs').existsSync('/proc/cpuinfo') &&
           require('fs').readFileSync('/proc/cpuinfo', 'utf8').includes('Raspberry Pi');
  },

  // Get Pi model
  getPiModel() {
    if (!this.isRaspberryPi()) return null;

    const cpuinfo = require('fs').readFileSync('/proc/cpuinfo', 'utf8');
    const modelMatch = cpuinfo.match(/Model\s+:\s+(.+)/);
    return modelMatch ? modelMatch[1].trim() : 'Unknown';
  },

  // Get system temperature (requires additional setup)
  getTemperature() {
    try {
      const temp = require('fs').readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
      return parseInt(temp) / 1000; // Convert to Celsius
    } catch (error) {
      return null;
    }
  },

  // Check available memory
  getMemoryInfo() {
    const meminfo = require('fs').readFileSync('/proc/meminfo', 'utf8');
    const totalMatch = meminfo.match(/MemTotal:\s+(\d+)/);
    const availableMatch = meminfo.match(/MemAvailable:\s+(\d+)/);

    return {
      total: totalMatch ? parseInt(totalMatch[1]) * 1024 : 0,
      available: availableMatch ? parseInt(availableMatch[1]) * 1024 : 0
    };
  },

  // Optimize for Pi performance
  optimizeForPi() {
    if (!this.isRaspberryPi()) {
      console.log('🍓 Not running on Raspberry Pi, skipping optimizations');
      return;
    }

    console.log(`🍓 Running on ${this.getPiModel()}`);
    console.log('🍓 Applying Pi-specific optimizations...');

    // Set lower priority for Node.js process
    try {
      process.setPriority(10); // Lower priority
    } catch (error) {
      console.log('🍓 Could not set process priority');
    }

    // Enable garbage collection hints
    if (global.gc) {
      setInterval(() => global.gc(), 30000); // Force GC every 30 seconds
    }
  }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PI_CONFIG,
    PiPerformanceMonitor,
    PiMemoryManager,
    PiDetectionLoop,
    PiNetworkOptimizer,
    PiUtils
  };
}
