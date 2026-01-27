'use client';

import { User } from '@/types';
import { STORAGE_KEYS, getItem, setItem, removeItem } from '@/lib/storage';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || 'limit-secret-key-change-in-production'
);

// Simple user database (in localStorage for MVP)
const USERS_KEY = 'limit_users_db';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

// Get all users from storage
function getAllUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const users = getItem<StoredUser[]>(USERS_KEY);
  return users || [];
}

// Save users to storage
function saveUsers(users: StoredUser[]): void {
  setItem(USERS_KEY, users);
}

// Register new user
export async function register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  try {
    const users = getAllUsers();

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

// Login user
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User; token?: string }> {
  try {
    const users = getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Return user without password
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    // Save to storage
    setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setItem(STORAGE_KEYS.USER, userData);

    return { success: true, user: userData, token };
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

// Verify token
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
}
