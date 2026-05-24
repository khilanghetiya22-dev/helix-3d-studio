'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import HelixIcon from '@/components/brand/HelixIcon';
import HelixWordmark from '@/components/brand/HelixWordmark';
import type { Profile } from '@/lib/types';

// ─── Dropdown definitions ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'FDM Printing', href: '/services' },
      { label: 'Materials & Pricing', href: '/services#materials' },
      { label: 'Turnaround Times', href: '/services#turnaround' },
      { label: 'File Formats', href: '/services#formats' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'Our Story', href: '/about' },
      { label: 'How It Works', href: '/about#process' },
      { label: 'Quality Promise', href: '/about#quality' },
    ],
  },
  {
    label: 'Help',
    href: '/faq',
    dropdown: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Design Guidelines', href: '/design-guide' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
];

const ACCOUNT_LOGGED_IN = [
  { label: 'My Dashboard', href: '/dashboard' },
  { label: 'My Orders', href: '/orders' },
  { label: 'My Profile', href: '/profile' },
  { label: 'My Address', href: '/profile/address' },
];

const ACCOUNT_LOGGED_OUT = [
  { label: 'Log In', href: '/login' },
  { label: 'Sign Up', href: '/signup' },
];

// ─── Dropdown panel component ─────────────────────────────────────────────────
function DropdownMenu({
  items,
  isOpen,
}: {
  items: { label: string; href: string }[];
  isOpen: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="absolute top-full left-0 mt-1 min-w-[200px] rounded-lg overflow-hidden z-50"
      style={{
        backgroundColor: '#0D1B2A',
        border: '1px solid rgba(201,168,76,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-4 py-2.5 text-sm transition-all"
          style={{
            color: '#9CA3AF',
            borderLeft: '2px solid transparent',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#C9A84C';
            (e.currentTarget as HTMLElement).style.borderLeftColor = '#C9A84C';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(201,168,76,0.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
            (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ─── Nav item with hover dropdown ────────────────────────────────────────────
function NavItemWithDropdown({
  label,
  href,
  items,
  isActive,
}: {
  label: string;
  href: string;
  items: { label: string; href: string }[];
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all"
        style={{
          color: isActive ? '#C9A84C' : '#9CA3AF',
          borderBottom: isActive ? '1px solid #C9A84C' : '1px solid transparent',
          letterSpacing: '0.02em',
        }}
      >
        {label}
        <ChevronDown
          className="w-3 h-3 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </Link>
      <DropdownMenu items={items} isOpen={open} />
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
interface PublicNavClientProps {
  user?: Profile | null;
}

export default function PublicNavClient({ user }: PublicNavClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const accountItems = user ? ACCOUNT_LOGGED_IN : ACCOUNT_LOGGED_OUT;

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#0A0A0F', borderBottom: '0.5px solid rgba(201,168,76,0.25)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <HelixIcon size={32} variant="dark" />
            <HelixWordmark size="sm" />
          </Link>

          {/* Desktop nav — dropdowns */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              let isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              if (item.label === 'Help') {
                isActive = ['/faq', '/design-guide', '/contact', '/gallery'].includes(pathname);
              }
              return (
                <NavItemWithDropdown
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  items={item.dropdown}
                  isActive={isActive}
                />
              );
            })}
          </div>

          {/* Desktop right — Account dropdown + New Order CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Account dropdown */}
            <div
              ref={accountRef}
              className="relative"
            >
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all rounded-lg"
                style={{
                  color: '#9CA3AF',
                  border: '1px solid rgba(201,168,76,0.2)',
                  backgroundColor: accountOpen ? 'rgba(201,168,76,0.06)' : 'transparent',
                }}
              >
                <User className="w-3.5 h-3.5" />
                {user ? (user.full_name?.split(' ')[0] ?? 'Account') : 'Account'}
                <ChevronDown className="w-3 h-3" style={{ transform: accountOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-1 min-w-[200px] rounded-lg overflow-hidden z-50"
                  style={{
                    backgroundColor: '#0D1B2A',
                    border: '1px solid rgba(201,168,76,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                >
                  {accountItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-all"
                      style={{ color: '#9CA3AF', borderLeft: '2px solid transparent' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#C9A84C';
                        (e.currentTarget as HTMLElement).style.borderLeftColor = '#C9A84C';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(201,168,76,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
                        (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm transition-all"
                      style={{ color: '#9CA3AF', borderLeft: '2px solid transparent', borderTop: '0.5px solid rgba(201,168,76,0.12)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#C9A84C';
                        (e.currentTarget as HTMLElement).style.borderLeftColor = '#C9A84C';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
                        (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                      }}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* New Order CTA */}
            <Link
              href="/orders/new"
              className="px-5 py-2 text-sm font-medium rounded-lg transition-all btn-glow"
              style={{ border: '1px solid #C9A84C', color: '#C9A84C', backgroundColor: 'transparent', letterSpacing: '0.04em' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#C9A84C';
                (e.currentTarget as HTMLElement).style.color = '#0A0A0F';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#C9A84C';
              }}
            >
              New Order
            </Link>
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
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  color: (item.label === 'Help'
                    ? ['/faq', '/design-guide', '/contact', '/gallery'].includes(pathname)
                    : pathname.startsWith(item.href))
                    ? '#C9A84C'
                    : '#9CA3AF'
                }}
              >
                {item.label}
                <ChevronDown
                  className="w-4 h-4 transition-transform"
                  style={{ transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {mobileExpanded === item.label && (
                <div className="ml-4 mt-1 space-y-1" style={{ borderLeft: '1px solid rgba(201,168,76,0.2)', paddingLeft: '12px' }}>
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMenuOpen(false)}
                      className="block px-2 py-2 text-sm transition-colors"
                      style={{ color: '#6B6B6B' }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile account section */}
          <div className="pt-3 border-t" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                    <User className="w-5 h-5" style={{ color: '#C9A84C' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#F5F0E8' }}>{user.full_name}</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>{user.email}</p>
                  </div>
                </div>
                {ACCOUNT_LOGGED_IN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm rounded-lg transition-colors"
                    style={{ color: '#9CA3AF' }}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-sm mt-1"
                  style={{ color: '#C9A84C' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
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
