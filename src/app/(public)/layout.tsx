import React from 'react';
import Link from 'next/link';
import FormiqIcon from '@/components/brand/FormiqIcon';
import FormiqWordmark from '@/components/brand/FormiqWordmark';
import Footer from '@/components/brand/Footer';
import PublicNavClient from '@/components/brand/PublicNavClient';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <PublicNavClient />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
