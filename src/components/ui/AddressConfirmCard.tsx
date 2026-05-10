'use client';
import React from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import { Address } from '@/lib/types';

interface AddressConfirmCardProps {
  address: Address;
  name?: string;
  phone?: string;
  onChangeClick: () => void;
}

export default function AddressConfirmCard({ address, name = 'Customer', phone, onChangeClick }: AddressConfirmCardProps) {
  return (
    <div className="rounded-xl border border-[rgba(201,146,10,0.2)] bg-[#1B2A4A] p-5 relative overflow-hidden group transition-colors hover:border-[#C9920A]">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#C9920A]"></div>
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-[#C9920A]" />
          <h3 className="text-sm font-medium text-[#F5F4F0]">Delivering to</h3>
        </div>
        
        <button 
          type="button"
          onClick={onChangeClick}
          className="text-xs font-medium text-[#C9920A] flex items-center gap-1 hover:text-[#e5aa1c] transition-colors"
        >
          Change <Edit2 className="w-3 h-3" />
        </button>
      </div>

      <div className="pl-7 space-y-1">
        <p className="text-[15px] text-[#F5F4F0] font-medium">{name}</p>
        <p className="text-sm text-[#F5F4F0]/90 leading-relaxed">
          {address.street}<br />
          {address.city}, {address.state} &middot; {address.pincode}<br />
          {address.country}
        </p>
        {phone && (
          <p className="text-sm text-[#F5F4F0]/70 mt-2 pt-2 border-t border-[rgba(201,146,10,0.1)]">
            Phone: {phone}
          </p>
        )}
      </div>
    </div>
  );
}
