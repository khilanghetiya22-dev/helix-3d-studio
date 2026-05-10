'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import FormiqIcon from '@/components/brand/FormiqIcon';
import FormiqWordmark from '@/components/brand/FormiqWordmark';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function PublicNavClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#1A1A1A', borderBottom: '0.5px solid rgba(201,146,10,0.25)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <FormiqIcon size={32} variant="dark" className="group-hover:opacity-80 transition-opacity" />
            <FormiqWordmark size="sm" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  color: pathname === l.href ? '#C9920A' : '#9CA3AF',
                  borderBottom: pathname === l.href ? '1px solid #C9920A' : '1px solid transparent',
                  letterSpacing: '0.02em',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-medium transition-colors" style={{ color: '#9CA3AF' }}>
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9920A', color: '#1A1A1A', letterSpacing: '0.04em' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg transition-all"
            style={{ color: '#F5F4F0' }}
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
          style={{ borderTop: '0.5px solid rgba(201,146,10,0.15)', backgroundColor: '#1A1A1A' }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{ color: pathname === l.href ? '#C9920A' : '#9CA3AF' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t flex gap-2" style={{ borderColor: 'rgba(201,146,10,0.15)' }}>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center px-4 py-2 text-sm rounded-lg"
              style={{ color: '#9CA3AF', border: '1px solid rgba(201,146,10,0.2)' }}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center px-4 py-2 text-sm rounded-lg btn-glow"
              style={{ backgroundColor: '#C9920A', color: '#1A1A1A' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
