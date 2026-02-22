'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      console.error('Registration error:', err);
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
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blueprint)]/20 via-transparent to-[var(--accent-primary)]/20" />

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
              Start Analyzing{' '}
              <span className="text-gradient">Today</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              Join architects and developers using LIMIT for faster, more accurate GDCR compliance analysis.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Instant GDCR 2017 calculations',
                'Professional PDF reports',
                'Transparent methodology',
                '5 free analyses to start',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--success-bg)] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[var(--success)]" />
                  </div>
                  <span className="text-[var(--text-secondary)]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm rounded-[var(--radius-xl)] p-6 border border-[var(--border-subtle)]">
            <p className="text-[var(--text-secondary)] italic mb-4">
              "LIMIT has transformed how we handle GDCR compliance. What used to take hours now takes minutes."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-sm">
                PS
              </div>
              <div>
                <div className="font-medium text-sm">Priya Sharma</div>
                <div className="text-xs text-[var(--text-muted)]">Principal Architect</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative architectural lines */}
        <svg
          className="absolute bottom-0 left-0 w-96 h-96 text-[var(--border-default)] opacity-40 transform -scale-x-100"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path d="M0 400L400 0" stroke="currentColor" strokeWidth="1" />
          <path d="M100 400L400 100" stroke="currentColor" strokeWidth="1" />
          <path d="M200 400L400 200" stroke="currentColor" strokeWidth="1" />
          <path d="M300 400L400 300" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Right panel - Register form */}
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
              <Badge variant="blueprint" className="mb-4 w-fit">Get Started</Badge>
              <CardTitle size="lg">Create your account</CardTitle>
              <CardDescription>
                Start analyzing building regulations in minutes.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--error-bg)] border border-[var(--error)]/20">
                    <AlertCircle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[var(--error)]">{error}</p>
                  </div>
                )}

                {/* Full name */}
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  icon={<User className="w-5 h-5" />}
                  autoComplete="name"
                  required
                />

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
                <div>
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    icon={<Lock className="w-5 h-5" />}
                    autoComplete="new-password"
                    required
                  />
                  {/* Password requirements */}
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

                {/* Confirm password */}
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

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Create Account
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
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login link */}
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => router.push('/login')}
              >
                Sign In Instead
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
            By creating an account, you agree to use LIMIT as an advisory tool only.
            All calculations should be verified with local authorities.
          </p>
        </div>
      </div>
    </div>
  );
}
