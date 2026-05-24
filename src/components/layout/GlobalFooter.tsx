'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '../brand/Footer';
import WhatsAppButton from '../WhatsAppButton';

export function GlobalFooter() {
  const pathname = usePathname();

  // Hide footer & WhatsApp floating action button on auth screens
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
