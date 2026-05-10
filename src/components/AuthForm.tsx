'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Eye, EyeOff, Box } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (form.password !== form.confirm_password) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.full_name,
              phone: form.phone,
            },
          },
        });

        if (signUpError) throw signUpError;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (signInError) throw signInError;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - FORMIQ Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-md text-center px-8">
          {/* Established */}
          <p className="text-xs tracking-widest uppercase mb-8" style={{ color: '#C9920A', letterSpacing: '0.2em' }}>
            Established · MMXXV
          </p>

          {/* Brand name */}
          <h1 className="brand-name text-5xl mb-2" style={{ color: '#F5F4F0' }}>FORMIQ</h1>
          <p className="text-sm uppercase tracking-widest mb-6" style={{ color: 'rgba(245,244,240,0.55)', letterSpacing: '0.35em' }}>
            3D Print Studio
          </p>

          {/* Gold rule */}
          <div className="w-24 mx-auto mb-6" style={{ height: '0.5px', backgroundColor: '#C9920A' }} />

          {/* Tagline */}
          <p className="tagline text-lg" style={{ color: '#C9920A' }}>
            &ldquo;Layer by layer. Smarter by design.&rdquo;
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { label: 'Technologies', value: '7' },
              { label: 'Materials', value: '19+' },
              { label: 'Quality', value: '100%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(26,26,26,0.4)', border: '1px solid rgba(201,146,10,0.15)' }}>
                <p className="text-2xl font-light" style={{ color: '#C9920A' }}>{stat.value}</p>
                <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="brand-name text-xl" style={{ color: '#F5F4F0' }}>FORMIQ</span>
          </div>

          <h2 className="page-heading text-2xl mb-1" style={{ color: '#F5F4F0' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6B6B6B' }}>
            {mode === 'login'
              ? 'Sign in to manage your 3D print orders'
              : 'Start submitting your 3D print orders today'}
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm animate-scale-in" style={{ backgroundColor: 'rgba(201,146,10,0.1)', border: '1px solid rgba(201,146,10,0.3)', color: '#C9920A' }}>
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            style={{ backgroundColor: '#111', border: '1px solid rgba(201,146,10,0.2)', color: '#F5F4F0' }}
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C9920A', borderTopColor: 'transparent' }} />
            ) : (
              <GoogleIcon className="w-5 h-5" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1" style={{ height: '0.5px', backgroundColor: 'rgba(201,146,10,0.15)' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: '#6B6B6B' }}>or</span>
            <div className="flex-1" style={{ height: '0.5px', backgroundColor: 'rgba(201,146,10,0.15)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            {mode === 'signup' && (
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                icon={<Phone className="w-4 h-4" />}
                hint="Optional"
              />
            )}

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] transition-colors"
                style={{ color: '#6B6B6B' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'signup' && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={(e) => update('confirm_password', e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            )}

            <Button type="submit" isLoading={loading} className="w-full" size="lg">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#6B6B6B' }}>
            {mode === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium transition-colors" style={{ color: '#C9920A' }}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>Already have an account?{' '}
                <Link href="/login" className="font-medium transition-colors" style={{ color: '#C9920A' }}>
                  Sign In
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
