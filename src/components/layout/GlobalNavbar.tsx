'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../Navbar';
import PublicNavClient from '../brand/PublicNavClient';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

export function GlobalNavbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (!error && data) {
            setProfile(data);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching profile in GlobalNavbar:', err);
      }
    }

    fetchProfile();

    // Dynamically listen to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    return <Navbar user={profile} />;
  }

  // Public pages render the public hover-dropdown Navbar
  return <PublicNavClient user={profile} />;
}
