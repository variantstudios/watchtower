# Watchtower Live 🔹

A real-time AI-powered surveillance system that uses your webcam to detect objects and automatically capture images when specific objects are detected.

## Features

- **Real-time Object Detection**: Uses TensorFlow.js and COCO-SSD model to detect objects in real-time
- **Automatic Image Capture**: Saves images when detected objects meet confidence thresholds
- **Customizable Settings**: Adjust confidence thresholds, save intervals, and notification intervals
- **Push Notifications**: Get notified when objects are detected (requires VAPID keys)
- **WebSocket Support**: Real-time communication between client and server
- **Image Gallery**: View and manage captured images
- **Responsive Design**: Works on desktop and mobile devices

## Recent Fixes

The following issues have been resolved:

1. **JavaScript Errors**: Fixed null reference errors by adding proper null checks for DOM elements
2. **Missing Settings Panel**: Added the complete settings panel HTML that was referenced in JavaScript
3. **Camera Access**: Improved error handling for camera access issues
4. **Favicon 404**: Added inline SVG favicon to prevent 404 errors
5. **Initialization**: Enhanced initialization process with better error handling and logging

## Installation

### For Desktop/Development:

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Set up VAPID keys for push notifications:

   ```bash
   # Generate VAPID keys using web-push
   npx web-push generate-vapid-keys
   ```

   Then create a `.env` file with:

   ```
   VAPID_PUBLIC_KEY=your_public_key_here
   VAPID_PRIVATE_KEY=your_private_key_here
   VAPID_EMAIL=your_email@example.com
   ```

### For Raspberry Pi:

See [PI_SETUP.md](PI_SETUP.md) for detailed Raspberry Pi setup instructions.

**Quick Pi Setup:**

```bash
# Install on Pi
git clone <repository-url>
cd watchtower
npm install

# Run with Pi optimizations
./pi-start.sh
```

## Usage

1. Start the server:

   ```bash
   node server.js
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Allow camera access when prompted

4. Configure your settings:

   - **Confidence Threshold**: Minimum confidence level for object detection (10-90%)
   - **Save Interval**: How often to save images (1-10 seconds)
   - **Notification Interval**: How often to send notifications (10-60 seconds)
   - **Objects to Detect**: Select which objects to monitor (person, car, dog, cat, cell phone, laptop, bicycle, motorcycle, truck, bus)

5. Use the controls:
   - **Toggle Detection Boxes**: Show/hide bounding boxes around detected objects
   - **Toggle Recording**: Enable/disable automatic image capture
   - **Test Notification**: Send a test push notification
   - **Clear All Images**: Delete all captured images

## How It Works

1. **Camera Setup**: The application requests access to your webcam
2. **AI Model Loading**: TensorFlow.js loads the COCO-SSD object detection model
3. **Real-time Detection**: The model analyzes video frames to detect objects
4. **Image Capture**: When detected objects meet your criteria, images are automatically saved
5. **Notifications**: Push notifications are sent when objects are detected
6. **WebSocket Communication**: Real-time updates are sent between client and server

## File Structure

```
watchtower/
├── server.js              # Main server file
├── package.json           # Dependencies
├── public/
│   ├── index.html         # Main application page
│   ├── sw.js             # Service worker for notifications
│   └── recordings/       # Directory for captured images
└── README.md             # This file
```

## Troubleshooting

### Camera Not Working

- Ensure your browser supports `getUserMedia`
- Check that camera permissions are granted
- Try refreshing the page

### No Video Preview

- Check browser console for errors
- Ensure camera is not being used by another application
- Try a different browser

### Push Notifications Not Working

- Ensure VAPID keys are properly configured
- Check that notifications are enabled in browser settings
- Verify service worker is registered

### JavaScript Errors

- Clear browser cache and refresh
- Check browser console for specific error messages
- Ensure all dependencies are properly loaded

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari (limited support)
- Edge

## Security Notes

- This application runs locally and does not send video data to external servers
- Images are stored locally in the `public/recordings/` directory
- Push notifications require VAPID keys for security
- Camera access is required for functionality

## License

This project is open source and available under the MIT License.
