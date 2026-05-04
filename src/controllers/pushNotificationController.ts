/**
 * Push Notification API Controller
 * Handles all API calls related to push notification tokens
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.test.labass.sa/api_labass';

/**
 * Push token payload for registration
 */
export interface PushTokenPayload {
  userId: number;
  token: string;
  provider: 'fcm' | 'apns';
  browser: string;
  platform: string;
  role: string;
}

/**
 * Push token update payload
 */
export interface PushTokenUpdatePayload {
  enabled?: boolean;
  token?: string;
}

/**
 * Push token response from backend
 */
export interface PushTokenResponse {
  id: number;
  userId: number;
  token: string;
  provider: 'fcm' | 'apns';
  browser: string | null;
  platform: string | null;
  role: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

/**
 * Save push token to backend
 * Creates new token or updates existing token
 * @param payload Push token data
 * @returns Promise that resolves when token is saved
 */
export async function savePushToken(payload: PushTokenPayload): Promise<void> {
  try {
    // Get authentication token (doctor app uses different key)
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('labass_doctor_token') : null;

    if (!authToken) {
      throw new Error('Authentication token not found. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/push-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to save push token: ${response.status}`);
    }

    console.log('[PushNotification] Token saved successfully:', {
      provider: payload.provider,
      browser: payload.browser,
      platform: payload.platform,
    });
  } catch (error: any) {
    console.error('[PushNotification] Error saving push token:', error);
    throw new Error(error.message || 'Failed to save push token');
  }
}

/**
 * Update push token settings
 * @param token Push token string
 * @param updates Updates to apply (enabled status, etc.)
 * @returns Promise that resolves when token is updated
 */
export async function updatePushToken(
  token: string,
  updates: PushTokenUpdatePayload
): Promise<void> {
  try {
    // Get authentication token
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('labass_doctor_token') : null;

    if (!authToken) {
      throw new Error('Authentication token not found. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/push-tokens/${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update push token: ${response.status}`);
    }

    console.log('[PushNotification] Token updated successfully');
  } catch (error: any) {
    console.error('[PushNotification] Error updating push token:', error);
    throw new Error(error.message || 'Failed to update push token');
  }
}

/**
 * Get user's push tokens
 * @param userId User ID
 * @returns Promise that resolves to array of push tokens
 */
export async function getUserPushTokens(userId: number): Promise<PushTokenResponse[]> {
  try {
    // Get authentication token
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('labass_doctor_token') : null;

    if (!authToken) {
      throw new Error('Authentication token not found. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/push-tokens/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch push tokens: ${response.status}`);
    }

    const tokens: PushTokenResponse[] = await response.json();
    console.log('[PushNotification] Fetched user tokens:', tokens.length);
    return tokens;
  } catch (error: any) {
    console.error('[PushNotification] Error fetching push tokens:', error);
    throw new Error(error.message || 'Failed to fetch push tokens');
  }
}

/**
 * Delete push token
 * @param token Push token string
 * @returns Promise that resolves when token is deleted
 */
export async function deletePushToken(token: string): Promise<void> {
  try {
    // Get authentication token
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('labass_doctor_token') : null;

    if (!authToken) {
      throw new Error('Authentication token not found. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/push-tokens/${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete push token: ${response.status}`);
    }

    console.log('[PushNotification] Token deleted successfully');
  } catch (error: any) {
    console.error('[PushNotification] Error deleting push token:', error);
    throw new Error(error.message || 'Failed to delete push token');
  }
}
