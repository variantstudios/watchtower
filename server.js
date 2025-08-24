import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const RECORDINGS_DIR = path.join(__dirname, "public/recordings");

// Create directories if they don't exist
if (!fs.existsSync(path.join(__dirname, "public"))) {
  fs.mkdirSync(path.join(__dirname, "public"), { recursive: true });
}
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

// Web Push configuration
let webPushConfigured = false;
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_EMAIL) {
  try {
    webpush.setVapidDetails(
      `mailto:${process.env.VAPID_EMAIL}`,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    webPushConfigured = true;
    console.log('✅ Web Push configured successfully');
  } catch (err) {
    console.error('❌ Web Push configuration failed:', err.message);
  }
} else {
  console.log('⚠️  VAPID keys not configured. Push notifications disabled.');
}

const app = express();
const server = app.listen(PORT, () => {
  console.log(`🔹 Watchtower Live server running on http://localhost:${PORT}`);
  console.log(`📁 Recordings saved to: ${RECORDINGS_DIR}`);
});

const wss = new WebSocketServer({ server });

let showBoxes = true;
let subscribers = new Set(); // Store push notification subscriptions

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: '10mb' })); // Increase limit for image data

// Serve the main page
app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "index.html"), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading page');
    }

    // Replace the VAPID key placeholder with the actual key
    const updatedHtml = data.replace(
      'VAPID_PUBLIC_KEY_PLACEHOLDER',
      process.env.VAPID_PUBLIC_KEY || ''
    );

    res.send(updatedHtml);
  });
});

// Get VAPID public key
app.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});

// Toggle detection boxes
app.get("/toggle-boxes", (req, res) => {
  showBoxes = !showBoxes;
  console.log(`🔘 Detection boxes: ${showBoxes ? 'ON' : 'OFF'}`);
  res.json({ showBoxes });
});

// Get recordings list for gallery
app.get("/recordings.json", (req, res) => {
  fs.readdir(RECORDINGS_DIR, (err, files) => {
    if (err) {
      console.error("Error reading recordings directory:", err);
      return res.json([]);
    }
    const jpgs = files
      .filter(f => f.endsWith(".jpg"))
      .sort((a, b) => {
        // Sort by timestamp in filename (newest first)
        const timeA = parseInt(a.split('-')[1]?.split('.')[0] || '0');
        const timeB = parseInt(b.split('-')[1]?.split('.')[0] || '0');
        return timeB - timeA;
      });
    res.json(jpgs);
  });
});

// Delete specific image
app.delete("/delete-image/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(RECORDINGS_DIR, filename);

  // Security check - ensure filename is safe
  if (filename.includes('..') || !filename.endsWith('.jpg')) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ error: "Failed to delete file" });
    }
    console.log(`🗑️ Deleted: ${filename}`);
    res.json({ success: true });
  });
});

// Clear all images
app.post("/clear-all", (req, res) => {
  fs.readdir(RECORDINGS_DIR, (err, files) => {
    if (err) {
      console.error("Error reading recordings directory:", err);
      return res.status(500).json({ error: "Failed to read directory" });
    }

    const jpgFiles = files.filter(f => f.endsWith('.jpg'));

    if (jpgFiles.length === 0) {
      return res.json({ success: true, deleted: 0 });
    }

    let deletedCount = 0;
    let processedCount = 0;
    let responseSent = false;

    jpgFiles.forEach(file => {
      fs.unlink(path.join(RECORDINGS_DIR, file), (err) => {
        if (!err) deletedCount++;
        processedCount++;

        // Check if all files have been processed and response hasn't been sent
        if (processedCount === jpgFiles.length && !responseSent) {
          responseSent = true;
          console.log(`🗑️ Deleted ${deletedCount} images`);
          res.json({ success: true, deleted: deletedCount });
        }
      });
    });
  });
});

// Push notification subscription
app.post("/subscribe", (req, res) => {
  try {
    const subscription = req.body;
    console.log('📱 New subscription received:', JSON.stringify(subscription, null, 2));

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    subscribers.add(JSON.stringify(subscription));
    console.log(`🔔 Total subscribers: ${subscribers.size}`);
    res.status(201).json({ success: true, message: 'Subscription saved' });
  } catch (err) {
    console.error('❌ Subscription error:', err);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Send test notification
app.post("/test-notification", (req, res) => {
  console.log('🧪 Test notification requested');

  if (!webPushConfigured) {
    console.log('❌ Web Push not configured');
    return res.status(500).json({ error: 'Web Push not configured' });
  }

  if (subscribers.size === 0) {
    console.log('❌ No subscribers found');
    return res.status(400).json({ error: 'No subscribers found' });
  }

  const result = sendNotification("🧪 Test Notification", "This is a test from Watchtower Live!");

  if (result) {
    res.json({ success: true, message: 'Test notification sent' });
  } else {
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Object detected notification trigger
app.post("/object-detected", (req, res) => {
  const { objects } = req.body;
  const timestamp = new Date().toLocaleString();
  const objectList = objects || 'Unknown object';

  sendNotification(
    `🔍 ${objectList} Detected!`,
    `${objectList} detected by Watchtower Live at ${timestamp}`
  );
  res.json({ success: true });
});

// Person detected notification trigger (legacy support)
app.post("/person-detected", (req, res) => {
  const timestamp = new Date().toLocaleString();
  sendNotification(
    "Person Detected!",
    `Motion detected by Watchtower Live at ${timestamp}`
  );
  res.json({ success: true });
});

// Send push notification to all subscribers
function sendNotification(title, body) {
  if (!webPushConfigured) {
    console.log('❌ Cannot send notification: Web Push not configured');
    return false;
  }

  if (subscribers.size === 0) {
    console.log('📭 No subscribers to send notification to');
    return false;
  }

  const payload = JSON.stringify({ title, body });
  console.log(`📤 Sending notification to ${subscribers.size} subscribers:`, { title, body });

  let successCount = 0;
  let errorCount = 0;

  const promises = Array.from(subscribers).map(async (sub) => {
    try {
      const subscription = JSON.parse(sub);
      console.log('📡 Sending to:', subscription.endpoint.substring(0, 50) + '...');

      const result = await webpush.sendNotification(subscription, payload);
      console.log('✅ Notification sent successfully:', result.statusCode);
      successCount++;
      return true;
    } catch (err) {
      console.error('❌ Error sending notification:', err.message);
      errorCount++;

      // Remove invalid subscriptions
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log('🗑️ Removing invalid subscription');
        subscribers.delete(sub);
      }
      return false;
    }
  });

  Promise.allSettled(promises).then(() => {
    console.log(`📊 Notification results: ${successCount} sent, ${errorCount} failed`);
  });

  return true;
}

// Save snapshot helper with throttling
function saveSnapshot(base64Data, personDetected = false) {
  const timestamp = Date.now();
  const fileName = `snapshot-${timestamp}.jpg`;
  const filePath = path.join(RECORDINGS_DIR, fileName);

  try {
    const data = base64Data.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFileSync(filePath, Buffer.from(data, "base64"));

    if (personDetected) {
      console.log(`📸 Person detected - saved: ${fileName}`);
    }

    return fileName;
  } catch (err) {
    console.error("Error saving snapshot:", err);
    return null;
  }
}

// Cleanup old files (keep only last 1000 images)
function cleanupOldFiles() {
  fs.readdir(RECORDINGS_DIR, (err, files) => {
    if (err) return;

    const jpgFiles = files
      .filter(f => f.endsWith('.jpg'))
      .sort((a, b) => {
        const timeA = parseInt(a.split('-')[1]?.split('.')[0] || '0');
        const timeB = parseInt(b.split('-')[1]?.split('.')[0] || '0');
        return timeB - timeA; // Newest first
      });

    if (jpgFiles.length > 1000) {
      const filesToDelete = jpgFiles.slice(1000);
      filesToDelete.forEach(file => {
        fs.unlink(path.join(RECORDINGS_DIR, file), (err) => {
          if (!err) console.log(`🧹 Cleaned up old file: ${file}`);
        });
      });
    }
  });
}

// Run cleanup every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);

// WebSocket handling
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.imageData) {
        // Save the snapshot
        const fileName = saveSnapshot(data.imageData, data.personDetected);

        if (fileName) {
          // Broadcast to all connected clients (for real-time updates)
          wss.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(JSON.stringify({
                newSnapshot: fileName,
                personDetected: data.personDetected
              }));
            }
          });
        }
      }
    } catch (err) {
      console.error("Error processing WebSocket message:", err);
    }
  });

  ws.on("close", () => {
    console.log("🔗 Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

// Graceful shutdown
let isShuttingDown = false;

process.on('SIGINT', () => {
  if (isShuttingDown) {
    console.log('\n💥 Force closing...');
    process.exit(1);
  }

  isShuttingDown = true;
  console.log('\n🛑 Shutting down Watchtower Live server...');

  // Close WebSocket server first
  console.log('📡 Closing WebSocket connections...');
  wss.clients.forEach(client => {
    client.terminate();
  });

  wss.close((err) => {
    if (err) console.error('WebSocket server close error:', err);
    else console.log('✅ WebSocket server closed');

    // Then close HTTP server
    console.log('🌐 Closing HTTP server...');
    server.close((err) => {
      if (err) {
        console.error('❌ HTTP server close error:', err);
        process.exit(1);
      } else {
        console.log('✅ HTTP server closed');
        console.log('✅ Server stopped');
        process.exit(0);
      }
    });
  });

  // Force exit after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.log('⏰ Force closing after timeout...');
    process.exit(1);
  }, 5000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down...');
  process.kill(process.pid, 'SIGINT');
});