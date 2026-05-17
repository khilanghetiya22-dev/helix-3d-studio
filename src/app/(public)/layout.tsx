import React from 'react';
import Link from 'next/link';
import HelixIcon from '@/components/brand/HelixIcon';
import HelixWordmark from '@/components/brand/HelixWordmark';
import Footer from '@/components/brand/Footer';
import PublicNavClient from '@/components/brand/PublicNavClient';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createClient } from '@/lib/supabase/server';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col">
      <PublicNavClient user={profile} />
      <main>{children}</main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
