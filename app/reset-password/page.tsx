'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Building2, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <Card variant="elevated" padding="lg">
            <CardContent>
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[var(--error-bg)] flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-[var(--error)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Invalid Reset Link
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link href="/forgot-password">
                  <Button variant="primary" size="lg" fullWidth>
                    Request New Link
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-[var(--bg-primary)]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">LIMIT</span>
          </div>

          <Card variant="elevated" padding="lg">
            <CardContent>
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Password Reset Successful
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                  Your password has been updated. You can now log in with your new password.
                </p>
                <Link href="/login">
                  <Button variant="primary" size="lg" fullWidth>
                    Go to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-[var(--bg-primary)]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">LIMIT</span>
        </div>

        <Card variant="elevated" padding="lg">
          <CardHeader spacing="lg">
            <CardTitle size="lg">Create new password</CardTitle>
            <CardDescription>
              Enter your new password below. Make sure it's at least 8 characters.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--error-bg)] border border-[var(--error)]/20">
                  <AlertCircle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--error)]">{error}</p>
                </div>
              )}

              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  icon={<Lock className="w-5 h-5" />}
                  autoComplete="new-password"
                  required
                />
                {password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met
                              ? 'bg-[var(--success-bg)]'
                              : 'bg-[var(--bg-hover)]'
                          }`}
                        >
                          {req.met ? (
                            <CheckCircle2 className="w-3 h-3 text-[var(--success)]" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            req.met
                              ? 'text-[var(--success)]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                icon={<Lock className="w-5 h-5" />}
                autoComplete="new-password"
                error={
                  confirmPassword && password !== confirmPassword
                    ? 'Passwords do not match'
                    : undefined
                }
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Reset Password
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
