'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now login.');
    } else if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! You can now login to your account.');
    }

    const verifyError = searchParams.get('error');
    if (verifyError === 'invalid_token') {
      setError('Invalid or expired verification link. Please register again.');
    } else if (verifyError === 'token_expired') {
      setError('Verification link has expired. Please register again.');
    } else if (verifyError === 'verification_failed') {
      setError('Email verification failed. Please try again or contact support.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('EMAIL_NOT_VERIFIED')) {
          setError('Please verify your email address before logging in.');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Blueprint grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-20" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 via-transparent to-[var(--blueprint)]/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-[var(--bg-primary)]" />
            </div>
            <span className="text-2xl font-bold tracking-tight">LIMIT</span>
          </Link>

          {/* Headline */}
          <div className="max-w-md">
            <h1 className="font-display text-5xl italic text-[var(--text-primary)] mb-4 leading-tight">
              Building Regulation,{' '}
              <span className="text-gradient">Simplified</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Professional GDCR 2017 compliance analysis for architects and developers in Gujarat.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <div className="text-3xl font-bold text-gradient">500+</div>
              <div className="text-sm text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
                Projects Analyzed
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">5 min</div>
              <div className="text-sm text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
                Average Time
              </div>
            </div>
          </div>
        </div>

        {/* Decorative architectural lines */}
        <svg
          className="absolute bottom-0 right-0 w-96 h-96 text-[var(--border-default)] opacity-40"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path d="M0 400L400 0" stroke="currentColor" strokeWidth="1" />
          <path d="M100 400L400 100" stroke="currentColor" strokeWidth="1" />
          <path d="M200 400L400 200" stroke="currentColor" strokeWidth="1" />
          <path d="M300 400L400 300" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-[var(--bg-primary)]" />
            </div>
            <span className="text-2xl font-bold tracking-tight">LIMIT</span>
          </div>

          <Card variant="elevated" padding="lg">
            <CardHeader spacing="lg">
              <Badge variant="accent" className="mb-4 w-fit">Welcome Back</Badge>
              <CardTitle size="lg">Sign in to your account</CardTitle>
              <CardDescription>
                Access your projects and continue analyzing building regulations.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Success message */}
                {successMessage && (
                  <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--success-bg)] border border-[var(--success)]/20">
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[var(--success)]">{successMessage}</p>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--error-bg)] border border-[var(--error)]/20">
                    <AlertCircle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[var(--error)]">{error}</p>
                  </div>
                )}

                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  icon={<Mail className="w-5 h-5" />}
                  autoComplete="email"
                  required
                />

                {/* Password */}
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<Lock className="w-5 h-5" />}
                  autoComplete="current-password"
                  required
                />

                {/* Forgot password link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-subtle)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-[var(--text-muted)] bg-[var(--bg-elevated)]">
                    New to LIMIT?
                  </span>
                </div>
              </div>

              {/* Register link */}
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => router.push('/register')}
              >
                Create an Account
              </Button>

              {/* Back to home */}
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-[var(--text-muted)] text-center leading-relaxed">
            By signing in, you agree that all reports are advisory only and
            should be verified with local authorities.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center animate-pulse">
            <Building2 className="w-6 h-6 text-[var(--bg-primary)]" />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
