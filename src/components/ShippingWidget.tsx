'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Truck, MapPin, Zap, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { calcShipping, type ShippingTier, type ShippingResult, type TierResult } from '@/lib/shippingCalculator';

interface ShippingWidgetProps {
  pincode: string;
  actualWeightG: number;
  boundingBoxMm?: { l: number; b: number; h: number } | null;
  orderTotal: number;
  businessPincodePrefix?: string;
  onTierSelect: (tier: ShippingTier, price: number) => void;
}

export default function ShippingWidget({
  pincode,
  actualWeightG,
  boundingBoxMm = null,
  orderTotal,
  businessPincodePrefix = '380',
  onTierSelect,
}: ShippingWidgetProps) {
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [selectedTier, setSelectedTier] = useState<ShippingTier>('standard');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Recalculate on pincode or weight change (debounced 300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (pincode.length !== 6) {
      setResult(null);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const shipping = calcShipping({
        pincode,
        actualWeightG: Math.max(actualWeightG, 10),
        boundingBoxMm,
        businessPincodePrefix,
        orderTotal,
      });
      setResult(shipping);
      setSelectedTier('standard');
      setLoading(false);

      // Notify parent with standard tier price
      if (shipping.isServiceable && shipping.tiers.length > 0) {
        const stdTier = shipping.tiers[0];
        onTierSelect('standard', stdTier.price);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pincode, actualWeightG, orderTotal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTierSelect = (tier: TierResult) => {
    setSelectedTier(tier.tier);
    onTierSelect(tier.tier, tier.price);
  };

  // No pincode yet
  if (pincode.length < 6) {
    return (
      <div className="py-3">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4" style={{ color: '#C9920A' }} />
          <span className="text-sm font-medium" style={{ color: '#F5F4F0' }}>Delivery Options</span>
        </div>
        <p className="text-xs" style={{ color: '#6B6B6B' }}>
          Enter your 6-digit pincode to see delivery options
        </p>
      </div>
    );
  }

  // Skeleton loader
  if (loading) {
    return (
      <div className="py-3 space-y-3 animate-pulse">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" style={{ color: '#C9920A' }} />
          <span className="text-sm font-medium" style={{ color: '#F5F4F0' }}>Calculating delivery...</span>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 rounded-lg" style={{ backgroundColor: 'rgba(26,26,26,0.4)' }} />
        ))}
      </div>
    );
  }

  // Unserviceable
  if (result && !result.isServiceable) {
    return (
      <div className="py-3">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4" style={{ color: '#C9920A' }} />
          <span className="text-sm font-medium" style={{ color: '#F5F4F0' }}>Delivery Options</span>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(201,146,10,0.08)', border: '1px solid rgba(201,146,10,0.2)' }}>
          <p className="text-xs" style={{ color: '#C9920A' }}>
            Sorry, we don&apos;t deliver to this pincode yet. Try a nearby pincode.
          </p>
        </div>
      </div>
    );
  }

  if (!result || result.tiers.length === 0) return null;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="py-3">
      {/* Header — "Shipping to Pune, Maharashtra · 411001" */}
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4" style={{ color: '#C9920A' }} />
        <span className="text-sm font-medium" style={{ color: '#F5F4F0' }}>
          {result.cityName
            ? `Delivery to ${result.cityName}, ${result.stateName}`
            : 'Delivery Options'}
        </span>
        <span className="text-xs ml-auto" style={{ color: '#6B6B6B' }}>
          {pincode}
        </span>
      </div>

      {/* Tier Cards */}
      <div className="space-y-2">
        {result.tiers.map((tier) => {
          const isSelected = selectedTier === tier.tier;
          return (
            <button
              key={tier.tier}
              type="button"
              onClick={() => handleTierSelect(tier)}
              className="w-full text-left rounded-lg p-3 transition-all duration-200"
              style={{
                backgroundColor: isSelected ? 'rgba(201,146,10,0.06)' : 'rgba(26,26,26,0.3)',
                border: isSelected ? '1px solid rgba(201,146,10,0.4)' : '1px solid rgba(201,146,10,0.08)',
                borderLeft: isSelected ? '3px solid #C9920A' : '3px solid transparent',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Radio dot */}
                  <div
                    className="w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: isSelected ? '#C9920A' : '#6B6B6B',
                    }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C9920A' }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: '#F5F4F0' }}>
                        {tier.label}
                      </span>
                      {tier.tier === 'overnight' && (
                        <Zap className="w-3 h-3" style={{ color: '#C9920A' }} />
                      )}
                      {tier.isFree && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                          style={{ backgroundColor: '#C9920A', color: '#1A1A1A' }}
                        >
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: '#6B6B6B' }}>
                      {tier.deliveryLabel}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <span className="text-sm font-medium" style={{ color: tier.isFree ? '#C9920A' : '#F5F4F0' }}>
                  {tier.isFree ? 'FREE' : tier.price === 0 ? 'FREE' : formatPrice(tier.price)}
                </span>
              </div>

              {/* Urgency note */}
              {tier.urgencyNote && isSelected && (
                <p className="text-[10px] mt-1.5 ml-5.5 flex items-center gap-1" style={{ color: '#C9920A' }}>
                  <Zap className="w-2.5 h-2.5" />
                  {tier.urgencyNote}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Footnote — collapsible details */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-[10px] transition-colors"
          style={{ color: '#6B6B6B' }}
        >
          <Package className="w-3 h-3" />
          {result.zone} · {result.billableWeightKg.toFixed(1)} kg · Fuel+GST incl.
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showDetails && (
          <div className="mt-1.5 text-[10px] space-y-0.5 pl-4 animate-slide-down" style={{ color: '#6B6B6B' }}>
            {result.note && <p>{result.note}</p>}
            <p>Fuel surcharge (12%) + GST (18%) included in all prices</p>
            {orderTotal < 999 && (
              <p style={{ color: '#C9920A' }}>
                <MapPin className="w-2.5 h-2.5 inline" /> Add {formatPrice(999 - orderTotal)} more for free standard delivery
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
