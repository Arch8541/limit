import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const result: {
    timestamp: string;
    env: {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NODE_ENV: string;
    };
    connectivity: {
      health: string;
      auth_settings: string;
      signup_endpoint: string;
    };
    errors: string[];
    verdict: string;
  } = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl
        ? `${supabaseUrl.slice(0, 30)}... (${supabaseUrl.length} chars)`
        : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey
        ? `${supabaseKey.slice(0, 12)}... (${supabaseKey.length} chars)`
        : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    },
    connectivity: {
      health: 'untested',
      auth_settings: 'untested',
      signup_endpoint: 'untested',
    },
    errors: [],
    verdict: 'unknown',
  };

  // Validate env vars exist
  if (!supabaseUrl) {
    result.errors.push('CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not set — Supabase client will fail');
  }
  if (!supabaseKey) {
    result.errors.push('CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — all requests will be rejected');
  }

  // Validate URL format
  if (supabaseUrl) {
    if (!supabaseUrl.startsWith('https://')) {
      result.errors.push(`URL format wrong: expected https://xxxxx.supabase.co, got: ${supabaseUrl}`);
    } else if (!supabaseUrl.includes('.supabase.co')) {
      result.errors.push(`URL might be wrong — does not contain .supabase.co: ${supabaseUrl}`);
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    result.verdict = 'FAIL — env vars missing, all auth calls will throw exceptions';
    return NextResponse.json(result, { status: 503 });
  }

  // Test 1: Supabase project health ping
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      signal: AbortSignal.timeout(8000),
    });
    result.connectivity.health = `HTTP ${res.status} ${res.statusText}`;
    if (res.status === 404 || res.status >= 500) {
      result.errors.push(`Supabase REST endpoint returned ${res.status} — project may be paused or URL is wrong`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.connectivity.health = `FAILED: ${msg}`;
    result.errors.push(`Cannot reach Supabase REST: ${msg}`);
  }

  // Test 2: Auth settings endpoint (tests auth service is running)
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.text();
    result.connectivity.auth_settings = `HTTP ${res.status}`;
    if (res.status !== 200) {
      result.errors.push(`Auth settings endpoint returned ${res.status}: ${body.slice(0, 200)}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.connectivity.auth_settings = `FAILED: ${msg}`;
    result.errors.push(`Cannot reach Supabase Auth: ${msg}`);
  }

  // Test 3: Check signup endpoint is reachable (don't actually sign up — just check it responds)
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty body — will get validation error, but confirms endpoint is reachable
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.text();
    // Expect 400 or 422 (validation error) — that's fine, it means the service is UP
    if (res.status === 400 || res.status === 422) {
      result.connectivity.signup_endpoint = `HTTP ${res.status} — endpoint reachable (validation error expected)`;
    } else if (res.status === 401) {
      result.connectivity.signup_endpoint = `HTTP 401 — anon key rejected`;
      result.errors.push(`Signup endpoint rejected anon key (401): ${body.slice(0, 200)}`);
    } else {
      result.connectivity.signup_endpoint = `HTTP ${res.status}: ${body.slice(0, 100)}`;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    result.connectivity.signup_endpoint = `FAILED: ${msg}`;
    result.errors.push(`Signup endpoint unreachable: ${msg}`);
  }

  if (result.errors.length === 0) {
    result.verdict = 'OK — Supabase is reachable and env vars look correct';
  } else {
    result.verdict = `FAIL — ${result.errors.length} issue(s) found`;
  }

  return NextResponse.json(result, {
    status: result.errors.length === 0 ? 200 : 503,
  });
}
