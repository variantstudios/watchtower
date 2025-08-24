#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import webpush from 'web-push';

console.log('🔹 Watchtower Live Setup Script\n');

// Generate VAPID keys
console.log('🔑 Generating VAPID keys...');
const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID keys generated!\n');

// Create .env file content
const envContent = `# Watchtower Live Environment Configuration

# Server Configuration
PORT=3000

# VAPID Keys for Web Push Notifications
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
VAPID_EMAIL=your-email@example.com

# Optional: Database configuration (for future use)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=watchtower
# DB_USER=watchtower_user
# DB_PASS=your_password
`;

// Write .env file
const envPath = '.env';
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Creating .env.example instead...');
    fs.writeFileSync('.env.example', envContent);
    console.log('✅ Created .env.example with your VAPID keys');
    console.log('📝 Please copy the VAPID keys to your existing .env file\n');
} else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with VAPID keys\n');
}

// Create public directory
const publicDir = 'public';
const recordingsDir = path.join(publicDir, 'recordings');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('📁 Created public directory');
}

if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
    console.log('📁 Created public/recordings directory');
}

// Create a simple icon if it doesn't exist
const iconPath = path.join(publicDir, 'icon.png');
if (!fs.existsSync(iconPath)) {
    console.log('🖼️  No icon.png found. You can add a 192x192 PNG icon to public/icon.png for better notifications.');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update the VAPID_EMAIL in your .env file with your actual email');
console.log('2. Run: npm start');
console.log('3. Open: http://localhost:3000');
console.log('4. Test notifications by clicking the "Test Notification" button\n');

console.log('📋 Your VAPID Keys:');
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
console.log('\n⚠️  Keep your private key secret! Never commit it to version control.\n');