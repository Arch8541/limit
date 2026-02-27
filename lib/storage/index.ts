// LocalStorage utilities for MVP

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'limit_auth_token',
  USER: 'limit_user',
  PROJECTS: 'limit_projects',
} as const;

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Generic storage functions
export function setItem<T>(key: string, value: T): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Silently fail - localStorage not available
  }
}

export function getItem<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function removeItem(key: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

export function clearStorage(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch {
    // Silently fail
  }
}

// Auth token helper
export function getAuthToken(): string | null {
  return getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
}
