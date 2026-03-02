import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };

  const health: {
    status: string;
    timestamp: string;
    environment: typeof envVars;
    checks: { database: string };
    errors: string[];
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envVars,
    checks: { database: 'unknown' },
    errors: [],
  };

  if (!process.env.DATABASE_URL) {
    health.errors.push('DATABASE_URL is not set');
    health.status = 'error';
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    health.errors.push('Supabase env vars not set');
    health.status = 'error';
  }

  try {
    const { prisma } = await import('@/lib/db/prisma');
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'connected';
  } catch (error) {
    health.status = 'error';
    health.checks.database = 'error';
    health.errors.push(`Database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return NextResponse.json(health, { status: health.status === 'ok' ? 200 : 503 });
}
