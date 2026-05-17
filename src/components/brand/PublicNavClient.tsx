'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import HelixIcon from '@/components/brand/HelixIcon';
import HelixWordmark from '@/components/brand/HelixWordmark';
import type { Profile } from '@/lib/types';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

interface PublicNavClientProps {
  user?: Profile | null;
}

export default function PublicNavClient({ user }: PublicNavClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#0A0A0F', borderBottom: '0.5px solid rgba(201,168,76,0.25)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <HelixIcon size={32} variant="dark" className="group-hover:opacity-80 transition-opacity" />
            <HelixWordmark size="sm" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  color: pathname === l.href ? '#C9A84C' : '#9CA3AF',
                  borderBottom: pathname === l.href ? '1px solid #C9A84C' : '1px solid transparent',
                  letterSpacing: '0.02em',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                    <User className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium leading-none" style={{ color: '#F5F0E8' }}>{user.full_name}</p>
                    <p className="text-xs leading-none mt-0.5" style={{ color: '#6B6B6B' }}>{user.role === 'admin' ? 'Admin' : 'Customer'}</p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg transition-all" style={{ color: '#6B6B6B' }} title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium transition-colors" style={{ color: '#9CA3AF' }}>
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all btn-glow"
                  style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg transition-all"
            style={{ color: '#F5F0E8' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-1 animate-slide-down"
          style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', backgroundColor: '#0A0A0F' }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{ color: pathname === l.href ? '#C9A84C' : '#9CA3AF' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg"
                  style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                    <User className="w-5 h-5" style={{ color: '#C9A84C' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#F5F0E8' }}>{user.full_name}</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>{user.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm mt-1"
                  style={{ color: '#C9A84C' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm rounded-lg"
                  style={{ color: '#9CA3AF', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm rounded-lg btn-glow"
                  style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
