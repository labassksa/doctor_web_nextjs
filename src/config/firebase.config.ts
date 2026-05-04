/**
 * Firebase Client Configuration
 * Initializes Firebase app and messaging for push notifications
 *
 * IMPORTANT: This file should only be used on the client-side
 * Service worker uses its own Firebase initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app
// Only initialize once to avoid duplicate app errors
let app: FirebaseApp;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} else {
  // Server-side: Create a dummy app (won't be used)
  app = {} as FirebaseApp;
}

// Initialize Firebase Cloud Messaging
// Only available on client-side and in supported browsers
let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  // Check if messaging is supported before initializing
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
        console.log('[Firebase] Messaging initialized successfully');
      } else {
        console.warn('[Firebase] Messaging is not supported in this browser');
      }
    })
    .catch((error) => {
      console.error('[Firebase] Error checking messaging support:', error);
    });
}

/**
 * Get Firebase Messaging instance
 * Returns null if messaging is not supported or not yet initialized
 */
export function getMessagingInstance(): Messaging | null {
  return messaging;
}

/**
 * Check if Firebase Messaging is ready
 * @returns Promise that resolves to true if messaging is supported and ready
 */
export async function isMessagingReady(): Promise<boolean> {
  try {
    const supported = await isSupported();
    return supported && messaging !== null;
  } catch (error) {
    console.error('[Firebase] Error checking if messaging is ready:', error);
    return false;
  }
}

export { app, messaging };
export default app;
