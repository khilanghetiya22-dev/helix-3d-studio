'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Edit2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AddressForm from '@/components/ui/AddressForm';
import type { Address } from '@/lib/types';

export default function ProfileAddressPage() {
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setSavedAddress({
              street: data.street,
              city: data.city,
              state: data.state,
              pincode: data.pincode,
              country: data.country,
            });
          }
          setLoading(false);
        });
    });
  }, []);

  const handleSave = async (address: Address) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();

      if (existing) {
        await supabase.from('user_addresses').update({
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);
      } else {
        await supabase.from('user_addresses').insert({
          user_id: user.id,
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country || 'India',
          is_default: true,
        });
      }

      setSavedAddress(address);
      setMode('view');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save address:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Back */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: '#9CA3AF', textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="page-heading text-2xl"
            style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}
          >
            DELIVERY ADDRESS
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
            Your saved address is pre-filled automatically on new orders.
          </p>
        </div>
        {savedAddress && mode === 'view' && (
          <button
            onClick={() => setMode('edit')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', backgroundColor: 'transparent' }}
          >
            <Edit2 className="w-3.5 h-3.5" /> Change
          </button>
        )}
      </div>

      {/* Success banner */}
      {saved && (
        <div
          className="rounded-lg px-4 py-3 mb-4 flex items-center gap-2 animate-fade-in"
          style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <Check className="w-4 h-4" style={{ color: '#C9A84C' }} />
          <span className="text-sm" style={{ color: '#C9A84C' }}>Address saved successfully.</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl animate-pulse"
              style={{ backgroundColor: '#0D1B2A' }}
            />
          ))}
        </div>
      ) : mode === 'view' && savedAddress ? (
        /* View mode — AddressConfirmCard style */
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: '#C9A84C' }}
            >
              Delivering to
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>
            {savedAddress.street}
          </p>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {savedAddress.city}, {savedAddress.state} · {savedAddress.pincode}
          </p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            {savedAddress.country}
          </p>
        </div>
      ) : (
        /* Edit mode */
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          {savedAddress && mode === 'edit' && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#C9A84C' }}>
                Edit Address
              </span>
              <button
                onClick={() => setMode('view')}
                className="text-xs"
                style={{ color: '#6B6B6B' }}
              >
                Cancel
              </button>
            </div>
          )}
          <AddressForm
            defaultValues={savedAddress || {}}
            onSave={handleSave}
          />
        </div>
      )}

      {!savedAddress && !loading && (
        <p className="text-sm mt-4 text-center" style={{ color: '#6B6B6B' }}>
          No saved address yet. Fill in and save below — it will be pre-filled on your next order.
        </p>
      )}
    </div>
  );
}
