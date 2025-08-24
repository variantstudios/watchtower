// Service Worker for Watchtower Live
const CACHE_NAME = 'watchtower-live-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push data:', data);

    const options = {
      body: data.body || 'Motion detected!',
      icon: '/icon.png',
      badge: '/icon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Camera',
          icon: '/icon.png'
        },
        {
          action: 'close',
          title: 'Dismiss',
          icon: '/icon.png'
        }
      ],
      requireInteraction: true,
      tag: 'watchtower-notification'
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Watchtower Live', options)
    );
  } catch (err) {
    console.error('Error processing push notification:', err);

    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Watchtower Live', {
        body: 'Motion detected!',
        icon: '/icon.png'
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app when "View Camera" is clicked
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        // Check if the app is already open
        const client = clients.find(c => c.url === self.location.origin + '/');
        if (client) {
          return client.focus();
        } else {
          return self.clients.openWindow('/');
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification (already handled above)
    console.log('Notification dismissed');
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        const client = clients.find(c => c.url === self.location.origin + '/');
        if (client) {
          return client.focus();
        } else {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync for offline functionality (optional)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement any background sync logic here
  return Promise.resolve();
}

// Message handler for communication between main thread and service worker
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Send response back to main thread
  event.ports[0].postMessage({ success: true });
});

// Fetch event handler for caching (optional)
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip caching for WebSocket upgrades, API calls, and dynamic content
  if (event.request.url.includes('/recordings/') ||
      event.request.url.includes('ws://') ||
      event.request.url.includes('wss://') ||
      event.request.url.includes('/api/') ||
      event.request.url.includes('.json') ||
      event.request.url.includes('recordings.json')) {
    return;
  }

  // Only handle navigation requests and static assets
  if (event.request.destination === 'document' ||
      event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      event.request.destination === 'image') {

    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request).catch(() => {
            // Only fallback for document requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            return new Response('', { status: 404 });
          });
        })
        .catch(() => {
          // Fallback for offline scenarios
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          return new Response('', { status: 404 });
        })
    );
  }
});