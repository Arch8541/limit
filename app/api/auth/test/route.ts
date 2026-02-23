import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Auth test - Starting');

  try {
    const session = await auth();
    console.log('Auth test - Session:', session ? JSON.stringify(session) : 'null');

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found',
        cookies: 'Check browser cookies',
      });
    }

    if (!session.user?.id) {
      return NextResponse.json({
        authenticated: false,
        message: 'Session exists but no user ID',
        session: {
          user: session.user,
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    console.error('Auth test - Error:', error);
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
