import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Check if token is expired (24 hours)
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.redirect(new URL('/login?error=token_expired', request.url));
    }

    // Find user by email (identifier is the email)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.redirect(new URL('/login?verified=true', request.url));
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Send welcome email (async, don't wait)
    sendWelcomeEmail({
      to: user.email,
      name: user.name || 'User',
    }).catch(err => console.error('Failed to send welcome email:', err));

    // Redirect to login with success message
    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
  }
}
