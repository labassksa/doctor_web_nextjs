/**
 * Browser Detection Utility
 * Detects browser type, platform, and push notification support
 * Critical for routing to correct push provider (FCM vs APNs)
 */

export interface BrowserInfo {
  /** Browser name (Chrome, Safari, Firefox, Edge, etc.) */
  name: string;
  /** Browser version */
  version: string;
  /** Is this Safari browser? */
  isSafari: boolean;
  /** Is this an iOS device? */
  isIOS: boolean;
  /** Platform/OS (Windows, iOS, Android, Mac, etc.) */
  platform: string;
  /** Does this browser support push notifications? */
  supportsPush: boolean;
  /** Which push provider to use (fcm, apns, or none) */
  pushProvider: 'fcm' | 'apns' | 'none';
}

/**
 * Detect browser type, platform, and push notification capabilities
 * @returns BrowserInfo object with detection results
 */
export function detectBrowser(): BrowserInfo {
  // Server-side rendering check
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      name: 'Unknown',
      version: 'Unknown',
      isSafari: false,
      isIOS: false,
      platform: 'Unknown',
      supportsPush: false,
      pushProvider: 'none',
    };
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // Safari detection
  // Safari has 'Safari' in UA but NOT 'Chrome' or 'Chromium'
  const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(userAgent);

  // iOS detection
  // Check for iPad, iPhone, iPod in userAgent
  // Also check for iPadOS 13+ which reports as Mac
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Detailed browser detection
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (isSafari) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Firefox/.test(userAgent)) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Edg/.test(userAgent)) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (/Opera|OPR/.test(userAgent)) {
    browserName = 'Opera';
    const match = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }

  // Platform detection
  let platformName = 'Unknown';
  if (isIOS) {
    platformName = 'iOS';
  } else if (/Android/.test(userAgent)) {
    platformName = 'Android';
  } else if (/Windows/.test(userAgent)) {
    platformName = 'Windows';
  } else if (/Mac/.test(userAgent)) {
    platformName = 'MacOS';
  } else if (/Linux/.test(userAgent)) {
    platformName = 'Linux';
  }

  // Check push notification support
  const hasNotificationAPI = 'Notification' in window;
  const hasServiceWorkerAPI = 'serviceWorker' in navigator;
  const hasSafariPushAPI =
    isSafari &&
    'safari' in window &&
    typeof (window as any).safari === 'object' &&
    'pushNotification' in (window as any).safari;

  const supportsPush = hasNotificationAPI && (hasServiceWorkerAPI || hasSafariPushAPI);

  // Determine push provider
  let pushProvider: 'fcm' | 'apns' | 'none' = 'none';

  if (supportsPush) {
    // Safari uses APNs Web Push
    if (isSafari && hasSafariPushAPI) {
      pushProvider = 'apns';
    }
    // All other browsers use FCM (including Chrome, Firefox, Edge, Opera)
    else if (hasServiceWorkerAPI) {
      pushProvider = 'fcm';
    }
  }

  return {
    name: browserName,
    version: browserVersion,
    isSafari,
    isIOS,
    platform: platformName,
    supportsPush,
    pushProvider,
  };
}

/**
 * Check if push notifications are supported in current browser
 * @returns true if push notifications are supported
 */
export function canUsePushNotifications(): boolean {
  const browser = detectBrowser();
  return browser.supportsPush;
}

/**
 * Get the push provider for current browser
 * @returns 'fcm' for Firebase Cloud Messaging, 'apns' for Apple Push Notification Service, or 'none'
 */
export function getPushProvider(): 'fcm' | 'apns' | 'none' {
  const browser = detectBrowser();
  return browser.pushProvider;
}

/**
 * Check if current browser is Safari
 * @returns true if browser is Safari
 */
export function isSafariBrowser(): boolean {
  const browser = detectBrowser();
  return browser.isSafari;
}

/**
 * Check if current device is iOS
 * @returns true if device is iOS (iPhone, iPad, iPod)
 */
export function isIOSDevice(): boolean {
  const browser = detectBrowser();
  return browser.isIOS;
}

/**
 * Get human-readable browser name and version
 * @returns Browser name and version string (e.g., "Chrome 120.0")
 */
export function getBrowserDisplayName(): string {
  const browser = detectBrowser();
  return `${browser.name} ${browser.version}`;
}

/**
 * Get platform/OS name
 * @returns Platform name (e.g., "iOS", "Android", "Windows")
 */
export function getPlatformName(): string {
  const browser = detectBrowser();
  return browser.platform;
}

/**
 * Check if browser supports Service Worker API
 * Required for FCM push notifications
 * @returns true if Service Worker API is supported
 */
export function supportsServiceWorker(): boolean {
  if (typeof navigator === 'undefined') return false;
  return 'serviceWorker' in navigator;
}

/**
 * Check if browser supports Notification API
 * @returns true if Notification API is supported
 */
export function supportsNotificationAPI(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window;
}
