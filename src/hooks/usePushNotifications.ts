/**
 * usePushNotifications Hook
 * Manages push notification registration, permissions, and token lifecycle
 * Supports both FCM (Chrome/Firefox/Edge/Android) and APNs (Safari iOS)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { getMessagingInstance, isMessagingReady } from '@/config/firebase.config';
import { detectBrowser, getPushProvider } from '@/utils/browserDetection';
import { savePushToken } from '@/controllers/pushNotificationController';

export interface PushNotificationState {
  /** Is push notification supported in this browser? */
  supported: boolean;
  /** Current notification permission status */
  permission: NotificationPermission;
  /** Current push token (FCM or APNs) */
  token: string | null;
  /** Error message if registration failed */
  error: string | null;
  /** Is token generation in progress? */
  loading: boolean;
}

export interface PushNotificationHookReturn extends PushNotificationState {
  /** Request notification permission and register for push */
  requestPermission: () => Promise<void>;
  /** Unsubscribe from push notifications */
  unsubscribe: () => Promise<void>;
}

/**
 * Hook to manage push notification registration and lifecycle
 * @returns Push notification state and control functions
 */
export function usePushNotifications(): PushNotificationHookReturn {
  const [state, setState] = useState<PushNotificationState>({
    supported: false,
    permission: typeof window !== 'undefined' ? Notification.permission : 'default',
    token: null,
    error: null,
    loading: true,
  });

  const browserInfo = detectBrowser();
  const provider = getPushProvider();

  // Check initial support on mount
  useEffect(() => {
    const checkSupport = async () => {
      setState((prev) => ({
        ...prev,
        supported: browserInfo.supportsPush,
        permission: 'Notification' in window ? Notification.permission : 'denied',
        loading: false,
      }));
    };

    checkSupport();
  }, [browserInfo.supportsPush]);

  /**
   * Generate FCM token for Chrome, Firefox, Edge, Android
   */
  const generateFCMToken = useCallback(async (): Promise<string> => {
    console.log('[usePushNotifications] Generating FCM token...');

    // Wait for messaging to be ready
    const messagingReady = await isMessagingReady();
    if (!messagingReady) {
      throw new Error('Firebase Messaging is not supported or not ready');
    }

    const messaging = getMessagingInstance();
    if (!messaging) {
      throw new Error('Firebase Messaging not initialized');
    }

    try {
      // Register service worker
      console.log('[usePushNotifications] Registering service worker...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('[usePushNotifications] Service Worker registered:', registration.scope);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Get FCM token using VAPID key
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        throw new Error('VAPID key not configured. Please add NEXT_PUBLIC_FIREBASE_VAPID_KEY to environment variables.');
      }

      console.log('[usePushNotifications] Requesting FCM token...');
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        throw new Error('Failed to generate FCM token');
      }

      console.log('[usePushNotifications] FCM token generated successfully');
      return token;
    } catch (error: any) {
      console.error('[usePushNotifications] Error generating FCM token:', error);
      throw new Error(error.message || 'Failed to generate FCM token');
    }
  }, []);

  /**
   * Generate Safari APNs token for Safari iOS
   */
  const generateSafariToken = useCallback(async (): Promise<string> => {
    console.log('[usePushNotifications] Generating Safari APNs token...');

    return new Promise((resolve, reject) => {
      // Check if Safari push notification API is available
      if (!('safari' in window) || !(window as any).safari.pushNotification) {
        reject(new Error('Safari push notifications not supported on this device'));
        return;
      }

      const pushId = process.env.NEXT_PUBLIC_SAFARI_WEB_PUSH_ID || 'web.sa.labass.doctor';
      const webServiceURL = `${process.env.NEXT_PUBLIC_API_URL}/safari-push`;

      console.log('[usePushNotifications] Checking Safari push permission for:', pushId);

      // Check current permission state
      const permissionData = (window as any).safari.pushNotification.permission(pushId);

      if (permissionData.permission === 'default') {
        // Permission not yet requested, request it now
        console.log('[usePushNotifications] Requesting Safari push permission...');

        const userId = localStorage.getItem('labass_doctor_userId');
        (window as any).safari.pushNotification.requestPermission(
          webServiceURL,
          pushId,
          { userId: userId || '' },
          (permission: any) => {
            if (permission.permission === 'granted') {
              console.log('[usePushNotifications] Safari permission granted, deviceToken:', permission.deviceToken);
              resolve(permission.deviceToken);
            } else if (permission.permission === 'denied') {
              reject(new Error('Safari push permission denied by user'));
            } else {
              reject(new Error('Safari push permission request failed'));
            }
          }
        );
      } else if (permissionData.permission === 'granted') {
        // Permission already granted, return existing token
        console.log('[usePushNotifications] Safari permission already granted, deviceToken:', permissionData.deviceToken);
        resolve(permissionData.deviceToken);
      } else {
        // Permission denied
        reject(new Error('Safari push permission was previously denied'));
      }
    });
  }, []);

  /**
   * Request notification permission and register for push
   */
  const requestPermission = useCallback(async () => {
    console.log('[usePushNotifications] Requesting notification permission...');
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Request notification permission (standard Web API)
      const permission = await Notification.requestPermission();
      console.log('[usePushNotifications] Notification permission:', permission);

      if (permission !== 'granted') {
        setState((prev) => ({
          ...prev,
          permission,
          loading: false,
          error: 'Notification permission denied. Please enable notifications in browser settings.',
        }));
        return;
      }

      // Generate token based on browser type
      let token: string;
      if (provider === 'fcm') {
        token = await generateFCMToken();
      } else if (provider === 'apns') {
        token = await generateSafariToken();
      } else {
        throw new Error('Push notifications are not supported in this browser');
      }

      // Save token to backend
      const userId = localStorage.getItem('labass_doctor_userId');
      if (!userId) {
        throw new Error('User not authenticated. Please login first.');
      }

      console.log('[usePushNotifications] Saving token to backend...');
      await savePushToken({
        userId: parseInt(userId),
        token,
        provider,
        browser: browserInfo.name,
        platform: browserInfo.platform,
        role: 'doctor',
      });

      // Update state with success
      setState({
        supported: true,
        permission: 'granted',
        token,
        error: null,
        loading: false,
      });

      console.log('[usePushNotifications] Push notification registration successful');

      // Set up foreground message listener for FCM
      if (provider === 'fcm') {
        setupForegroundMessageListener();
      }
    } catch (error: any) {
      console.error('[usePushNotifications] Error requesting push permission:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to enable notifications. Please try again.',
      }));
    }
  }, [provider, browserInfo, generateFCMToken, generateSafariToken]);

  /**
   * Set up listener for foreground messages (when app is open)
   */
  const setupForegroundMessageListener = useCallback(() => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('[usePushNotifications] Foreground message received:', payload);

      // Show notification even when app is in foreground
      if (payload.notification) {
        const notificationTitle = payload.notification.title || 'Labass Doctor';
        const notificationOptions: NotificationOptions = {
          body: payload.notification.body || '',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: payload.data?.type || 'default',
          data: payload.data,
          requireInteraction: payload.data?.type === 'INCOMING_CALL',
        };

        // Check if we have permission to show notification
        if (Notification.permission === 'granted') {
          new Notification(notificationTitle, notificationOptions);
        }
      }

      // Emit custom event for app to handle
      if (payload.data?.type === 'INCOMING_CALL') {
        const event = new CustomEvent('push-notification-incoming-call', {
          detail: payload.data,
        });
        window.dispatchEvent(event);
      }

      // Emit custom event for new message
      if (payload.data?.type === 'NEW_MESSAGE') {
        const event = new CustomEvent('push-notification-new-message', {
          detail: payload.data,
        });
        window.dispatchEvent(event);
      }

      // Emit custom event for new consultation
      if (payload.data?.type === 'NEW_CONSULTATION') {
        const event = new CustomEvent('push-notification-new-consultation', {
          detail: payload.data,
        });
        window.dispatchEvent(event);
      }
    });

    console.log('[usePushNotifications] Foreground message listener set up');
  }, []);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = useCallback(async () => {
    console.log('[usePushNotifications] Unsubscribing from push notifications...');

    try {
      // Note: We don't delete the token from backend here
      // Backend will handle token cleanup based on delivery failures
      // We just reset local state

      setState({
        supported: browserInfo.supportsPush,
        permission: 'default',
        token: null,
        error: null,
        loading: false,
      });

      console.log('[usePushNotifications] Unsubscribed successfully');
    } catch (error: any) {
      console.error('[usePushNotifications] Error unsubscribing:', error);
    }
  }, [browserInfo.supportsPush]);

  return {
    ...state,
    requestPermission,
    unsubscribe,
  };
}

/**
 * Get current notification permission status
 * @returns Current notification permission ('granted', 'denied', or 'default')
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Check if notifications are enabled (permission granted)
 * @returns true if notification permission is granted
 */
export function areNotificationsEnabled(): boolean {
  return getNotificationPermission() === 'granted';
}
