'use client';
import React, { useState, useEffect } from 'react';
import { Address } from '@/lib/types';
import AddressForm from './AddressForm';
import AddressConfirmCard from './AddressConfirmCard';
import { createClient } from '@/lib/supabase/client';

interface AddressSectionProps {
  initialAddress: Address | null;
  name?: string;
  phone?: string;
  onConfirm: (address: Address) => void;
}

export default function AddressSection({ initialAddress, name, phone, onConfirm }: AddressSectionProps) {
  // If we have an initial address, default to 'confirm' mode, else 'edit' mode.
  const [mode, setMode] = useState<'confirm' | 'edit'>(initialAddress ? 'confirm' : 'edit');
  const [savedAddress, setSavedAddress] = useState<Address | null>(initialAddress);

  const supabase = createClient();

  useEffect(() => {
    // Sync if initialAddress changes from parent (e.g. loaded asynchronously)
    if (initialAddress && !savedAddress) {
      setSavedAddress(initialAddress);
      setMode('confirm');
    }
  }, [initialAddress, savedAddress]);

  useEffect(() => {
    // When in confirm mode, make sure parent has the confirmed address
    if (mode === 'confirm' && savedAddress) {
      onConfirm(savedAddress);
    }
  }, [mode, savedAddress, onConfirm]);

  const handleSave = async (address: Address) => {
    setSavedAddress(address);
    onConfirm(address);
    setMode('confirm');

    // Attempt to save to profile user_addresses silently
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Upsert logic - simpler to just insert or update where user_id = auth.uid() and is_default = true
        const { data: existing } = await supabase
          .from('user_addresses')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .maybeSingle();

        if (existing) {
          await supabase.from('user_addresses').update({
            full_name: address.full_name,
            phone: address.phone,
            street: address.street,
            landmark: address.landmark || null,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
            updated_at: new Date().toISOString()
          }).eq('id', existing.id);
        } else {
          await supabase.from('user_addresses').insert({
            user_id: user.id,
            full_name: address.full_name,
            phone: address.phone,
            street: address.street,
            landmark: address.landmark || null,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
            is_default: true,
          });
        }
      }
    } catch (err) {
      console.error('Failed to save address to profile:', err);
      // Silent error as it's an auto-save feature
    }
  };

  if (mode === 'confirm' && savedAddress) {
    return (
      <AddressConfirmCard
        address={savedAddress}
        name={name}
        phone={phone}
        onChangeClick={() => setMode('edit')}
      />
    );
  }

  return (
    <div className="bg-[#111111] border border-[rgba(201,168,76,0.2)] rounded-xl p-5">
      <h3 className="text-sm font-medium text-[#F5F0E8] mb-4 uppercase tracking-widest flex items-center gap-2">
        Delivery Address
      </h3>
      <AddressForm
        defaultValues={savedAddress || {}}
        onSave={handleSave}
      />
    </div>
  );
}
