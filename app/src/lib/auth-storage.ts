import * as SecureStore from 'expo-secure-store';

import type { AuthUser } from '@/redux/slices/authSlice';

const AUTH_KEY = 'astra_auth';

export interface StoredAuth {
  token: string;
  user: AuthUser;
}

/** Persist the auth session (token + user) to the device keystore. */
export async function saveAuth(data: StoredAuth): Promise<void> {
  try {
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(data));
  } catch (e) {
    // Non-fatal: persistence is best-effort (e.g. unsupported on web).
    console.warn('[auth-storage] saveAuth failed', e);
  }
}

/** Read the persisted auth session, or null if none / unreadable. */
export async function loadAuth(): Promise<StoredAuth | null> {
  try {
    const raw = await SecureStore.getItemAsync(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (parsed?.token && parsed?.user) return parsed;
    return null;
  } catch (e) {
    console.warn('[auth-storage] loadAuth failed', e);
    return null;
  }
}

/** Clear the persisted auth session (on logout). */
export async function clearAuth(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  } catch (e) {
    console.warn('[auth-storage] clearAuth failed', e);
  }
}
