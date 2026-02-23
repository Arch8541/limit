import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Health check - Starting');

  const envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
    AUTH_URL: process.env.AUTH_URL || 'not set',
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };

  console.log('Health check - Environment:', JSON.stringify(envVars));

  const health: {
    status: string;
    timestamp: string;
    environment: typeof envVars;
    checks: {
      database: string;
      auth: string;
    };
    errors: string[];
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envVars,
    checks: {
      database: 'unknown',
      auth: 'unknown',
    },
    errors: [],
  };

  // Check environment variables
  if (!process.env.DATABASE_URL) {
    health.errors.push('DATABASE_URL is not set');
    health.status = 'error';
  }

  if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    health.errors.push('NEXTAUTH_SECRET/AUTH_SECRET is not set');
    health.status = 'error';
  }

  // Check database connection
  try {
    const { prisma } = await import('@/lib/db/prisma');
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'connected';
    console.log('Health check - Database connected');
  } catch (error) {
    health.status = 'error';
    health.checks.database = 'error';
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    health.errors.push(`Database: ${errorMessage}`);
    console.error('Health check - Database error:', error);
  }

  // Check auth
  try {
    const { auth } = await import('@/auth');
    // Just check if auth module loads
    health.checks.auth = 'module loaded';
    console.log('Health check - Auth module loaded');
  } catch (error) {
    health.status = 'error';
    health.checks.auth = 'error';
    const errorMessage = error instanceof Error ? error.message : 'Unknown auth error';
    health.errors.push(`Auth: ${errorMessage}`);
    console.error('Health check - Auth error:', error);
  }

  const statusCode = health.status === 'ok' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
