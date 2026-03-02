import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'email' | 'invite' | null

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: Parameters<typeof cookieStore.set>[2] }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Guard: if env vars are missing, give a clear error
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[auth/callback] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    return NextResponse.redirect(`${origin}/login?error=supabase_not_configured`)
  }

  // Handle PKCE flow (code exchange) — used by OAuth and some email flows
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message, error.status)
    // If code exchange fails, expose reason for easier debugging
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_error&reason=${encodeURIComponent(error.message)}`
    )
  }

  // Handle OTP / token_hash flow — used by email confirmation and magic links
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
    console.error('[auth/callback] verifyOtp failed:', error.message, error.status)
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_error&reason=${encodeURIComponent(error.message)}`
    )
  }

  // Neither code nor token_hash present
  console.error('[auth/callback] No code or token_hash in URL. Params:', Object.fromEntries(searchParams))
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error&reason=missing_params`)
}
