import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl
      ? `SET — ${supabaseUrl.slice(0, 40)}...`
      : 'NOT SET ❌',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey
      ? `SET — ${supabaseKey.slice(0, 12)}... (${supabaseKey.length} chars)`
      : 'NOT SET ❌',
    NEXT_PUBLIC_APP_URL: appUrl || 'NOT SET ❌',
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };

  const health: {
    status: string;
    timestamp: string;
    environment: typeof envVars;
    checks: {
      database: string;
      supabase_auth: string;
      supabase_url_reachable: string;
      redirect_url: string;
    };
    errors: string[];
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envVars,
    checks: {
      database: 'unknown',
      supabase_auth: 'unknown',
      supabase_url_reachable: 'unknown',
      redirect_url: appUrl ? `${appUrl}/auth/callback` : 'MISSING — NEXT_PUBLIC_APP_URL not set',
    },
    errors: [],
  };

  // Check required env vars
  if (!process.env.DATABASE_URL) {
    health.errors.push('DATABASE_URL is not set');
    health.status = 'error';
  }
  if (!supabaseUrl || !supabaseKey) {
    health.errors.push('Supabase env vars not set — NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
    health.status = 'error';
  }
  if (!appUrl) {
    health.errors.push('NEXT_PUBLIC_APP_URL is not set — email confirmation redirects will break');
    health.status = 'error';
  }

  // Check 1: Supabase HTTP reachability (ping the health endpoint)
  if (supabaseUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        signal: controller.signal,
        headers: { apikey: supabaseKey || '' },
      });
      clearTimeout(timeout);
      health.checks.supabase_url_reachable = res.ok ? `reachable (HTTP ${res.status})` : `HTTP ${res.status} error`;
      if (!res.ok) {
        health.status = 'error';
        health.errors.push(`Supabase auth endpoint returned HTTP ${res.status}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTimeout = msg.includes('abort') || msg.includes('timeout');
      health.checks.supabase_url_reachable = isTimeout
        ? 'TIMEOUT — project may be paused or URL is wrong'
        : `UNREACHABLE — ${msg}`;
      health.status = 'error';
      health.errors.push(
        isTimeout
          ? 'Supabase connection timed out. Go to supabase.com/dashboard — project may be PAUSED. Click Restore.'
          : `Supabase unreachable: ${msg}`
      );
    }
  } else {
    health.checks.supabase_url_reachable = 'skipped — NEXT_PUBLIC_SUPABASE_URL not set';
  }

  // Check 2: Supabase Auth API (anon key validity)
  if (supabaseUrl && supabaseKey && health.checks.supabase_url_reachable.startsWith('reachable')) {
    try {
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.auth.getSession();
      health.checks.supabase_auth = error
        ? `error — ${error.message}`
        : 'ok — anon key valid';
      if (error) {
        health.status = 'error';
        health.errors.push(`Supabase auth: ${error.message}`);
      }
    } catch (err) {
      health.checks.supabase_auth = `error — ${err instanceof Error ? err.message : String(err)}`;
    }
  } else if (health.checks.supabase_url_reachable !== 'unknown') {
    health.checks.supabase_auth = 'skipped — Supabase not reachable';
  }

  // Check 3: Prisma DB connection
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
