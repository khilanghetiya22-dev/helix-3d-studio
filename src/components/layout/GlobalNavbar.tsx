'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../Navbar';
import PublicNavClient from '../brand/PublicNavClient';
import type { Profile } from '@/lib/types';

interface GlobalNavbarProps {
  initialProfile: Profile | null;
}

export function GlobalNavbar({ initialProfile }: GlobalNavbarProps) {
  const pathname = usePathname();

  // Hide navbars on auth screens (full-bleed design)
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  // Auth / Dashboard pages render the internal Customer/Admin Navbar
  const isInternalPage =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/profile');

  if (isInternalPage) {
    return <Navbar user={initialProfile} />;
  }

  // Public pages render the public hover-dropdown Navbar
  return <PublicNavClient user={initialProfile} />;
}
