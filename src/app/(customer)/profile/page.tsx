import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MapPin, ArrowRight, User, Lock } from 'lucide-react';

export const metadata = { title: 'My Profile — HELIX 3D Studio' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, created_at')
    .eq('id', user.id)
    .single();

  const { data: savedAddress } = await supabase
    .from('user_addresses')
    .select('street, city, state, pincode, country')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .maybeSingle();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="page-heading text-2xl sm:text-3xl"
          style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}
        >
          MY PROFILE
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
          Manage your account settings, saved address, and preferences.
        </p>
      </div>

      {/* Account info card */}
      <div
        className="rounded-xl p-6 mb-4"
        style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium flex-shrink-0"
            style={{
              backgroundColor: 'rgba(201,168,76,0.1)',
              border: '1.5px solid rgba(201,168,76,0.3)',
              color: '#C9A84C',
            }}
          >
            {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-base font-medium" style={{ color: '#F5F0E8' }}>
              {profile?.full_name || 'Your Name'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
              {profile?.email || user.email}
            </p>
          </div>
        </div>

        <div style={{ height: '0.5px', backgroundColor: 'rgba(201,168,76,0.15)', marginBottom: '16px' }} />

        <div className="space-y-3 text-sm">
          {[
            { label: 'Full Name', value: profile?.full_name || '—' },
            { label: 'Email', value: profile?.email || user.email || '—' },
            { label: 'Phone', value: profile?.phone || '—' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span style={{ color: '#6B6B6B' }}>{row.label}</span>
              <span style={{ color: '#F5F0E8' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="space-y-3">
        {/* Saved Address */}
        <Link href="/profile/address" style={{ textDecoration: 'none' }}>
          <div
            className="rounded-xl p-5 flex items-center justify-between row-hover"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)', cursor: 'pointer' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>Delivery Address</p>
                {savedAddress ? (
                  <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
                    {savedAddress.street}, {savedAddress.city} · {savedAddress.pincode}
                  </p>
                ) : (
                  <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>No saved address yet</p>
                )}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
          </div>
        </Link>

        {/* Account Settings placeholder */}
        <div
          className="rounded-xl p-5 flex items-center justify-between opacity-60"
          style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.08)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ border: '1px solid rgba(201,168,76,0.1)', color: '#6B6B6B' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Account Settings</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>Update name & phone — coming soon</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-5 flex items-center justify-between opacity-60"
          style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.08)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ border: '1px solid rgba(201,168,76,0.1)', color: '#6B6B6B' }}
            >
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Change Password</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>Update via email reset — coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
