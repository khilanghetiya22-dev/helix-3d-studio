'use client';
import React, { useState, useEffect } from 'react';
import { Address } from '@/lib/types';
import { STATES_AND_UTS, CITY_MAPPING } from '@/lib/addressData';

interface AddressFormProps {
  defaultValues?: Partial<Address>;
  onSave?: (address: Address) => void;
  onChange?: (address: Partial<Address>) => void;
  hideSaveButton?: boolean;
}

export default function AddressForm({ defaultValues = {}, onSave, onChange, hideSaveButton = false }: AddressFormProps) {
  const [address, setAddress] = useState<Partial<Address>>({
    street: defaultValues.street || '',
    state: defaultValues.state || '',
    city: defaultValues.city || '',
    pincode: defaultValues.pincode || '',
    country: 'India'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (onChange) onChange(address);
  }, [address]);

  const handleChange = (field: keyof Address, value: string) => {
    const newAddress = { ...address, [field]: value };
    
    // Reset city if state changes
    if (field === 'state') {
      newAddress.city = '';
    }

    setAddress(newAddress);
    
    // Clear error for field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    handleChange('pincode', value);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!address.street) newErrors.street = 'Street address is required';
    if (!address.state) newErrors.state = 'State is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.pincode || address.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate() && onSave) {
      onSave(address as Address);
    }
  };

  const availableCities = address.state ? CITY_MAPPING[address.state] || [] : [];

  return (
    <div className="space-y-4">
      {/* Street */}
      <div>
        <label className="block text-sm mb-1" style={{ color: '#F5F4F0' }}>Street Address</label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => handleChange('street', e.target.value)}
          className={`w-full px-4 py-2 rounded-md transition-colors outline-none ${
            errors.street ? 'border-[#C9920A] bg-[#111111]' : 'border border-[rgba(201,146,10,0.2)] bg-[#111111] focus:border-[#C9920A]'
          }`}
          style={{ color: '#F5F4F0' }}
          placeholder="House/Flat number, Building, Street"
        />
        {errors.street && <p className="text-xs mt-1" style={{ color: '#C9920A' }}>{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F4F0' }}>State / Union Territory</label>
          <select
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none appearance-none ${
              errors.state ? 'border-[#C9920A] bg-[#111111]' : 'border border-[rgba(201,146,10,0.2)] bg-[#111111] focus:border-[#C9920A]'
            }`}
            style={{ color: address.state ? '#F5F4F0' : '#6B6B6B' }}
          >
            <option value="" disabled>Select State / UT</option>
            {STATES_AND_UTS.map(state => (
              <option key={state} value={state} style={{ color: '#F5F4F0', backgroundColor: '#1A1A1A' }}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="text-xs mt-1" style={{ color: '#C9920A' }}>{errors.state}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F4F0' }}>City</label>
          <select
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={!address.state}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none appearance-none disabled:opacity-50 ${
              errors.city ? 'border-[#C9920A] bg-[#111111]' : 'border border-[rgba(201,146,10,0.2)] bg-[#111111] focus:border-[#C9920A]'
            }`}
            style={{ color: address.city ? '#F5F4F0' : '#6B6B6B' }}
          >
            <option value="" disabled>Select City</option>
            {availableCities.map(city => (
              <option key={city} value={city} style={{ color: '#F5F4F0', backgroundColor: '#1A1A1A' }}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-xs mt-1" style={{ color: '#C9920A' }}>{errors.city}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pincode */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F4F0' }}>Pincode</label>
          <input
            type="text"
            value={address.pincode}
            onChange={handlePincodeChange}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none ${
              errors.pincode ? 'border-[#C9920A] bg-[#111111]' : 'border border-[rgba(201,146,10,0.2)] bg-[#111111] focus:border-[#C9920A]'
            }`}
            style={{ color: '#F5F4F0' }}
            placeholder="6-digit PIN"
            maxLength={6}
          />
          {errors.pincode && <p className="text-xs mt-1" style={{ color: '#C9920A' }}>{errors.pincode}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F4F0' }}>Country</label>
          <input
            type="text"
            value="India"
            readOnly
            className="w-full px-4 py-2 rounded-md bg-[#111111] border border-[rgba(201,146,10,0.2)] cursor-not-allowed opacity-70"
            style={{ color: '#F5F4F0' }}
          />
        </div>
      </div>

      {!hideSaveButton && (
        <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'rgba(201,146,10,0.2)' }}>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md font-medium text-sm transition-colors"
            style={{ backgroundColor: '#C9920A', color: '#1A1A1A' }}
          >
            Save Address
          </button>
        </div>
      )}
    </div>
  );
}
