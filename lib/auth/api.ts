'use client';

import { User } from '@/types';
import { STORAGE_KEYS, getItem, setItem, removeItem } from '@/lib/storage';

// Register new user via API
export async function register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

// Login user via API
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User; token?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    // Save to storage
    setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    setItem(STORAGE_KEYS.USER, data.user);

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Logout user
export function logout(): void {
  removeItem(STORAGE_KEYS.AUTH_TOKEN);
  removeItem(STORAGE_KEYS.USER);
}

// Get current user
export function getCurrentUser(): User | null {
  return getItem<User>(STORAGE_KEYS.USER);
}

// Get current token
export function getAuthToken(): string | null {
  return getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
}
