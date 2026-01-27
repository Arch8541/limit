'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { login } from '@/lib/auth';
import { Building2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <span className="text-4xl font-extrabold gradient-text tracking-tight">LIMIT</span>
        </div>

        <Card glass className="border border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Login to access your building compliance projects
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Login
              </Button>
            </form>

            <div className="mt-8 text-center text-base text-slate-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors">
                Register here
              </Link>
            </div>

            <div className="mt-5 text-center">
              <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          By logging in, you agree to verify all reports with local authorities
        </div>
      </div>
    </div>
  );
}
