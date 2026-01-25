/**
 * PushNotificationProvider Component
 * Automatically manages push notification permission requests after user authentication
 */

'use client';

import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export function PushNotificationProvider({ children }: PushNotificationProviderProps) {
  const { supported, permission, requestPermission } = usePushNotifications();

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Check if user is authenticated (doctor app uses different token key)
    const isAuthenticated = localStorage.getItem('labass_doctor_token');
    if (!isAuthenticated) {
      console.log('[PushNotificationProvider] User not authenticated, skipping permission request');
      return;
    }

    // Check if we've already requested permission
    const hasRequestedPermission = localStorage.getItem('push_permission_requested_doctor');
    if (hasRequestedPermission === 'true') {
      console.log('[PushNotificationProvider] Permission already requested, skipping');
      return;
    }

    // Check if push is supported and permission is default
    if (!supported) {
      console.log('[PushNotificationProvider] Push notifications not supported');
      return;
    }

    if (permission !== 'default') {
      console.log('[PushNotificationProvider] Permission already set:', permission);
      // Mark as requested so we don't ask again
      localStorage.setItem('push_permission_requested_doctor', 'true');
      return;
    }

    // Wait 3 seconds after login before requesting permission
    // This gives the user time to settle in before being prompted
    const timeoutId = setTimeout(() => {
      console.log('[PushNotificationProvider] Requesting push notification permission...');
      requestPermission()
        .then(() => {
          // Mark as requested regardless of outcome
          localStorage.setItem('push_permission_requested_doctor', 'true');
          console.log('[PushNotificationProvider] Permission request completed');
        })
        .catch((error) => {
          console.error('[PushNotificationProvider] Permission request failed:', error);
          // Still mark as requested to avoid repeated prompts
          localStorage.setItem('push_permission_requested_doctor', 'true');
        });
    }, 3000); // 3 second delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [supported, permission, requestPermission]);

  // This provider doesn't render any UI, just manages permission lifecycle
  return <>{children}</>;
}
