// Firebase Cloud Messaging Service Worker
// Handles background push notifications when the app is closed or in background

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
// These values will be replaced with actual environment variables
const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
  authDomain: "FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
  projectId: "FIREBASE_PROJECT_ID_PLACEHOLDER",
  storageBucket: "FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: "FIREBASE_APP_ID_PLACEHOLDER"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Labass Doctor';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.data?.type || 'default',
    data: payload.data || {},
    requireInteraction: payload.data?.type === 'INCOMING_CALL',
    actions: generateNotificationActions(payload.data?.type),
    vibrate: payload.data?.type === 'INCOMING_CALL' ? [200, 100, 200, 100, 200] : [200, 100, 200],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Generate notification actions based on type
function generateNotificationActions(type) {
  if (type === 'INCOMING_CALL') {
    return [
      { action: 'answer', title: 'Answer', icon: '/icons/icon-72x72.png' },
      { action: 'decline', title: 'Decline', icon: '/icons/icon-72x72.png' }
    ];
  }
  return [];
}

// Get URL to open based on notification type
function getUrlForNotificationType(data) {
  const baseUrl = self.location.origin;

  switch (data?.type) {
    case 'NEW_MESSAGE':
    case 'INCOMING_CALL':
    case 'MISSED_CALL':
      if (data.consultationId) {
        return `${baseUrl}/chat/${data.consultationId}`;
      }
      return baseUrl;
    case 'NEW_CONSULTATION':
      return `${baseUrl}/myConsultations`;
    default:
      return baseUrl;
  }
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification.tag, event.action);

  event.notification.close();

  const notificationData = event.notification.data || {};

  // Handle specific actions
  if (event.action === 'answer') {
    // User wants to answer the call
    event.waitUntil(
      clients.openWindow(getUrlForNotificationType(notificationData) + '?autoAnswer=true')
    );
    return;
  }

  if (event.action === 'decline') {
    // User declined the call
    // Send decline signal to backend
    fetch(`${self.location.origin}/api/video-calls/decline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consultationId: notificationData.consultationId,
      }),
    }).catch(error => {
      console.error('[firebase-messaging-sw.js] Failed to send decline signal:', error);
    });
    return;
  }

  // Default click action - open or focus window
  const urlToOpen = getUrlForNotificationType(notificationData);

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open with this URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // Check if there's a window open for the same consultation
        if (notificationData.consultationId) {
          const consultationUrl = `/chat/${notificationData.consultationId}`;
          for (const client of clientList) {
            if (client.url.includes(consultationUrl) && 'focus' in client) {
              return client.focus();
            }
          }
        }

        // No matching window found, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle push event (alternative to onBackgroundMessage)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received:', event);

  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[firebase-messaging-sw.js] Push data:', data);

      // This is handled by onBackgroundMessage above
      // but keeping this listener for debugging
    } catch (error) {
      console.error('[firebase-messaging-sw.js] Error parsing push data:', error);
    }
  }
});

// Service worker installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker activating...');
  // Claim all clients immediately
  event.waitUntil(clients.claim());
});

console.log('[firebase-messaging-sw.js] Service worker loaded');
