'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, User, Shield, Settings, Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import HelixWordmark from '@/components/brand/HelixWordmark';
import HelixIcon from '@/components/brand/HelixIcon';
import type { Profile } from '@/lib/types';

interface NavbarProps {
  user: Profile | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#0A0A0F',
        borderBottom: '0.5px solid rgba(201,168,76,0.25)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <HelixIcon size={32} variant="dark" className="group-hover:opacity-80 transition-opacity" />
            <HelixWordmark size="sm" />
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard" active={pathname === '/dashboard'}>My Orders</NavLink>
              <Link
                href="/orders/new"
                className="ml-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all"
                style={{
                  border: '1px solid #C9A84C',
                  color: pathname === '/orders/new' ? '#0A0A0F' : '#C9A84C',
                  backgroundColor: pathname === '/orders/new' ? '#C9A84C' : 'transparent',
                  letterSpacing: '0.04em',
                }}
              >
                New Order
              </Link>
              {isAdmin && (
                <>
                  <NavLink href="/admin/orders" active={pathname === '/admin/orders'}>
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </NavLink>
                  <NavLink href="/admin/settings/materials" active={pathname === '/admin/settings/materials'}>
                    <Settings className="w-3.5 h-3.5" /> Materials
                  </NavLink>
                  <NavLink href="/admin/settings/shipping" active={pathname === '/admin/settings/shipping'}>
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </NavLink>
                </>
              )}
            </div>
          )}

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                    <User className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium leading-none" style={{ color: '#F5F0E8' }}>{user.full_name}</p>
                    <p className="text-xs leading-none mt-0.5" style={{ color: '#6B6B6B' }}>{isAdmin ? 'Admin' : 'Customer'}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg transition-all" style={{ color: '#6B6B6B' }} title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium transition-colors" style={{ color: '#9CA3AF' }}>Log In</Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: '#C9A84C',
                    color: '#0A0A0F',
                    letterSpacing: '0.04em',
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg transition-all" style={{ color: '#F5F0E8' }}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 py-4 space-y-1 animate-slide-down" style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', backgroundColor: '#0A0A0F' }}>
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-lg" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
                  <User className="w-5 h-5" style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#F5F0E8' }}>{user.full_name}</p>
                  <p className="text-xs" style={{ color: '#6B6B6B' }}>{user.email}</p>
                </div>
              </div>
              <MobLink href="/dashboard" close={() => setMenuOpen(false)}>My Orders</MobLink>
              <MobLink href="/orders/new" close={() => setMenuOpen(false)}>New Order</MobLink>
              {isAdmin && <MobLink href="/admin/orders" close={() => setMenuOpen(false)}>🛡️ Admin Panel</MobLink>}
              {isAdmin && <MobLink href="/admin/settings/materials" close={() => setMenuOpen(false)}>⚙️ Materials</MobLink>}
              {isAdmin && <MobLink href="/admin/settings/shipping" close={() => setMenuOpen(false)}>🚚 Shipping</MobLink>}
              <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm mt-2" style={{ color: '#C9A84C' }}>Sign Out</button>
            </>
          ) : (
            <>
              <MobLink href="/login" close={() => setMenuOpen(false)}>Log In</MobLink>
              <MobLink href="/signup" close={() => setMenuOpen(false)}>Sign Up</MobLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all"
      style={{
        color: active ? '#C9A84C' : '#9CA3AF',
        borderBottom: active ? '1px solid #C9A84C' : '1px solid transparent',
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </Link>
  );
}

function MobLink({ href, children, close }: { href: string; children: React.ReactNode; close: () => void }) {
  return (
    <Link href={href} onClick={close} className="block px-3 py-2.5 rounded-lg text-sm transition-colors" style={{ color: '#9CA3AF' }}>
      {children}
    </Link>
  );
}
