'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Building2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      // Always show success to prevent email enumeration
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-[var(--bg-primary)]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">LIMIT</span>
        </div>

        <Card variant="elevated" padding="lg">
          <CardHeader spacing="lg">
            <CardTitle size="lg">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Check your email
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                  If an account exists for {email}, you will receive a password reset link shortly.
                </p>
                <Link href="/login">
                  <Button variant="primary" size="lg" fullWidth>
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Send Reset Link
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
            )}
          </CardContent>
        </Card>

        <p className="mt-8 text-xs text-[var(--text-muted)] text-center">
          Reset links expire after 1 hour for security.
        </p>
      </div>
    </div>
  );
}
