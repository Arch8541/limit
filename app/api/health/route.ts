import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    checks: {
      database: string;
      env: string;
    };
    error?: string;
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      env: 'unknown',
    },
  };

  // Check environment variables
  health.checks.env = process.env.DATABASE_URL ? 'ok' : 'missing DATABASE_URL';

  try {
    // Dynamic import to catch any Prisma initialization errors
    const { prisma } = await import('@/lib/db/prisma');
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.status = 'error';
    health.checks.database = 'error';
    health.error = error instanceof Error ? error.message : 'Unknown database error';
    console.error('Health check - Database error:', error);
  }

  const statusCode = health.status === 'ok' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
