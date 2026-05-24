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
    full_name: defaultValues.full_name || '',
    phone: defaultValues.phone || '',
    street: defaultValues.street || '',
    landmark: defaultValues.landmark || '',
    state: defaultValues.state || '',
    city: defaultValues.city || '',
    pincode: defaultValues.pincode || '',
    country: 'India'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (onChange) onChange(address);
  }, [address, onChange]);

  const validateField = (field: keyof Address, value: string): string => {
    if (field === 'full_name') {
      if (!value) return 'Full Name is required';
      if (value.length < 2) return 'Full Name must be at least 2 characters';
      if (value.length > 80) return 'Full Name must not exceed 80 characters';
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(value)) return 'Full Name cannot contain numbers or special characters';
    }
    
    if (field === 'phone') {
      if (!value) return 'Phone number is required';
      // Strip spaces or +91 prefix if any
      const cleaned = value.replace(/\s+/g, '').replace(/^\+91/, '');
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleaned)) {
        return 'Enter a valid 10-digit Indian mobile number';
      }
    }
    
    if (field === 'street') {
      if (!value) return 'Street address is required';
      if (value.length < 10) return 'Street address must be at least 10 characters';
      if (value.length > 200) return 'Street address must not exceed 200 characters';
    }
    
    if (field === 'landmark') {
      if (value && value.length > 100) return 'Landmark must not exceed 100 characters';
    }
    
    if (field === 'state') {
      if (!value) return 'State / UT selection is required';
    }
    
    if (field === 'city') {
      if (!value) return 'City selection is required';
    }
    
    if (field === 'pincode') {
      if (!value) return 'Pincode is required';
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeRegex.test(value)) {
        return 'Enter a valid 6-digit Indian pincode';
      }
    }
    
    return '';
  };

  const handleChange = (field: keyof Address, value: string) => {
    const newAddress = { ...address, [field]: value };
    
    // Reset city if state changes
    if (field === 'state') {
      newAddress.city = '';
    }

    setAddress(newAddress);
    
    // Validate on the fly if already touched
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleBlur = (field: keyof Address) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, address[field] || '');
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    handleChange('pincode', value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d+]/g, '').slice(0, 15);
    handleChange('phone', value);
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fieldsToValidate: (keyof Address)[] = ['full_name', 'phone', 'street', 'landmark', 'state', 'city', 'pincode'];
    
    fieldsToValidate.forEach(field => {
      const errorMsg = validateField(field, address[field] || '');
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });
    
    setErrors(newErrors);
    // Touch all fields to show error states
    const allTouched = fieldsToValidate.reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateAll() && onSave) {
      // Clean up phone number prefix if needed
      const cleanedPhone = (address.phone || '').replace(/\s+/g, '').replace(/^\+91/, '');
      const finalAddress = {
        ...address,
        phone: cleanedPhone
      } as Address;
      onSave(finalAddress);
    }
  };

  const availableCities = address.state ? CITY_MAPPING[address.state] || [] : [];

  const hasAnyErrors = Object.values(errors).some(msg => msg !== '');

  return (
    <div className="space-y-4">
      {hasAnyErrors && (
        <div className="p-3 rounded-lg border text-sm animate-scale-in" style={{ backgroundColor: 'rgba(201,168,76,0.08)', borderColor: '#C9A84C', color: '#C9A84C' }}>
          Please fix the errors below before continuing
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>Full Name</label>
          <input
            type="text"
            value={address.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            onBlur={() => handleBlur('full_name')}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none border ${
              errors.full_name ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
            }`}
            style={{ color: '#F5F0E8' }}
            placeholder="Recipient's Name"
          />
          {errors.full_name && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.full_name}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>Phone Number</label>
          <input
            type="text"
            value={address.phone}
            onChange={handlePhoneChange}
            onBlur={() => handleBlur('phone')}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none border ${
              errors.phone ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
            }`}
            style={{ color: '#F5F0E8' }}
            placeholder="10-digit Indian Mobile Number"
          />
          {errors.phone && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.phone}</p>}
        </div>
      </div>

      {/* Street */}
      <div>
        <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>Street Address / Flat No.</label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => handleChange('street', e.target.value)}
          onBlur={() => handleBlur('street')}
          className={`w-full px-4 py-2 rounded-md transition-colors outline-none border ${
            errors.street ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
          }`}
          style={{ color: '#F5F0E8' }}
          placeholder="House/Flat number, Building, Street, Locality"
        />
        {errors.street && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.street}</p>}
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>Landmark <span className="text-xs" style={{ color: '#6B6B6B' }}>(Optional)</span></label>
        <input
          type="text"
          value={address.landmark}
          onChange={(e) => handleChange('landmark', e.target.value)}
          onBlur={() => handleBlur('landmark')}
          className={`w-full px-4 py-2 rounded-md transition-colors outline-none border ${
            errors.landmark ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
          }`}
          style={{ color: '#F5F0E8' }}
          placeholder="Nearby school, temple, hospital etc."
        />
        {errors.landmark && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.landmark}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>State / Union Territory</label>
          <select
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            onBlur={() => handleBlur('state')}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none border appearance-none ${
              errors.state ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
            }`}
            style={{ color: address.state ? '#F5F0E8' : '#6B6B6B' }}
          >
            <option value="" disabled>Select State / UT</option>
            {STATES_AND_UTS.map(state => (
              <option key={state} value={state} style={{ color: '#F5F0E8', backgroundColor: '#0A0A0F' }}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.state}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>City</label>
          <select
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            disabled={!address.state}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none border appearance-none disabled:opacity-50 ${
              errors.city ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
            }`}
            style={{ color: address.city ? '#F5F0E8' : '#6B6B6B' }}
          >
            <option value="" disabled>Select City</option>
            {availableCities.map(city => (
              <option key={city} value={city} style={{ color: '#F5F0E8', backgroundColor: '#0A0A0F' }}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.city}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pincode */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>Pincode</label>
          <input
            type="text"
            value={address.pincode}
            onChange={handlePincodeChange}
            onBlur={() => handleBlur('pincode')}
            className={`w-full px-4 py-2 rounded-md transition-colors outline-none border ${
              errors.pincode ? 'border-[#C9A84C] bg-[#111111]' : 'border-[rgba(201,168,76,0.2)] bg-[#111111] focus:border-[#C9A84C]'
            }`}
            style={{ color: '#F5F0E8' }}
            placeholder="6-digit PIN"
            maxLength={6}
          />
          {errors.pincode && <p className="text-xs mt-1" style={{ color: '#C9A84C' }}>{errors.pincode}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm mb-1" style={{ color: '#F5F0E8' }}>Country</label>
          <input
            type="text"
            value="India"
            readOnly
            className="w-full px-4 py-2 rounded-md bg-[#111111] border border-[rgba(201,168,76,0.2)] cursor-not-allowed opacity-70 border-[rgba(201,168,76,0.2)]"
            style={{ color: '#F5F0E8' }}
          />
        </div>
      </div>

      {!hideSaveButton && (
        <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md font-medium text-sm transition-colors"
            style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
          >
            Save Address
          </button>
        </div>
      )}
    </div>
  );
}
