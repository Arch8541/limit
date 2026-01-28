import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendVerificationEmail } from '@/lib/email';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      );
    }

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      console.log('Validation error:', validation.error.issues);
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    console.log('Processing registration for:', email);

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError);
      throw new Error('Database connection error');
    }

    if (existingUser) {
      console.log('Email already registered:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    let passwordHash;
    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      throw new Error('Password hashing failed');
    }

    // Create user (not verified yet)
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
          emailVerified: null, // Not verified yet
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      console.log('User created successfully:', user.id);
    } catch (createError) {
      console.error('Database error creating user:', createError);
      throw new Error('Failed to create user account');
    }

    // Generate verification token (UUID) - using Web Crypto API for Edge Runtime compatibility
    let token;
    try {
      token = globalThis.crypto.randomUUID();
    } catch (cryptoError) {
      console.error('Crypto error generating token:', cryptoError);
      // Fallback to simple random string if crypto is not available
      token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }

    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours expiry

    // Save verification token
    try {
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });
      console.log('Verification token created for:', email);
    } catch (tokenError) {
      console.error('Database error creating verification token:', tokenError);
      // Don't fail registration if token creation fails
      console.warn('Continuing without verification token');
    }

    // Send verification email (async, don't wait for it)
    sendVerificationEmail({
      to: email,
      name,
      token,
    }).catch(err => console.error('Failed to send verification email:', err));

    return NextResponse.json(
      {
        user,
        message: 'Registration successful. Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Provide more specific error messages in development
    const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'Registration failed. Please try again.';

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
