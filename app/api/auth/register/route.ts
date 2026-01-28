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
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (not verified yet)
    const user = await prisma.user.create({
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

    // Generate verification token (UUID)
    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours expiry

    // Save verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

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
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
