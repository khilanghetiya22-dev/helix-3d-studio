'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Package, AlertCircle, TrendingUp, Clock, Percent, Settings2 } from 'lucide-react';
import { INFILL_FACTORS } from '@/lib/constants';
import { calcOrderPricing } from '@/lib/pricing';
import ShippingWidget from '@/components/ShippingWidget';
import type { Material } from '@/lib/types';
import type { OrderPricingResult } from '@/lib/pricing';
import type { ShippingTier } from '@/lib/shippingCalculator';

interface PricingCardProps {
  material: Material | null;
  infill: number;
  quantity: number;
  volumeCm3: number | null;
  technologyName?: string;
  technologySlug?: string;
  showInfill?: boolean;
  quality?: string;
  pincode?: string;
  boundingBoxMm?: { l: number; b: number; h: number } | null;
  className?: string;
  onPricingChange?: (pricing: OrderPricingResult & { shippingTier?: ShippingTier; shippingPrice?: number }) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function PricingCard({
  material,
  infill,
  quantity,
  volumeCm3,
  technologyName,
  technologySlug = 'fdm',
  showInfill = true,
  quality = 'standard',
  pincode = '',
  boundingBoxMm = null,
  className = '',
  onPricingChange,
}: PricingCardProps) {
  const [manualVolume, setManualVolume] = useState<string>('');
  const [animatePrice, setAnimatePrice] = useState(false);
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [shippingTier, setShippingTier] = useState<ShippingTier>('standard');
  const prevTotalRef = useRef<number | null>(null);

  const infillFactor = INFILL_FACTORS[infill] ?? (infill / 100);
  const density = material?.density_g_per_cm3 ?? 0;
  const pricePerGram = material?.price_per_gram ?? 0;

  // Effective volume (auto or manual)
  let effectiveVolume = volumeCm3;
  if (effectiveVolume === null && manualVolume !== '') {
    const parsed = parseFloat(manualVolume);
    if (!isNaN(parsed) && parsed > 0) effectiveVolume = parsed;
  }

  // Calculate pricing (without shipping — that comes from ShippingWidget)
  const pricing = calcOrderPricing({
    volumeCm3: effectiveVolume,
    infillFactor,
    materialDensity: density,
    materialPricePerGram: pricePerGram,
    quantity,
    technologySlug,
    quality,
    pincode,
  });

  // Grand total = pricing subtotal (excl old shipping) + new shipping widget price + COD fee
  const subtotal = pricing.grandTotal !== null
    ? (pricing.materialCost ?? 0) + (pricing.printTimeCost ?? 0) + (pricing.handlingFee ?? 0) + (pricing.platformFee ?? 0)
    : null;
  const grandTotal = subtotal !== null ? subtotal + shippingPrice : null;

  // Animate on total change
  useEffect(() => {
    if (grandTotal !== null && prevTotalRef.current !== grandTotal) {
      setAnimatePrice(true);
      const timer = setTimeout(() => setAnimatePrice(false), 600);
      prevTotalRef.current = grandTotal;
      return () => clearTimeout(timer);
    }
  }, [grandTotal]);

  // Report pricing to parent
  useEffect(() => {
    if (onPricingChange) {
      onPricingChange({
        ...pricing,
        shipping: { fee: shippingPrice, zoneName: '' },
        grandTotal,
        shippingTier,
        shippingPrice,
      });
    }
  }, [grandTotal, pricing.estimatedWeight, shippingPrice, shippingTier]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTierSelect = (tier: ShippingTier, price: number) => {
    setShippingTier(tier);
    setShippingPrice(price);
  };

  if (!material) return null;

  const qualityLabel = quality === 'draft' ? 'Draft' : quality === 'fine' ? 'Fine' : 'Standard';
  const orderSubtotal = (pricing.materialCost ?? 0) + (pricing.printTimeCost ?? 0) + (pricing.handlingFee ?? 0) + (pricing.platformFee ?? 0);

  return (
    <div className={`rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}>
      {/* Gold top stripe */}
      <div style={{ height: '2px', backgroundColor: '#C9A84C' }} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
              <Package className="w-4 h-4" style={{ color: '#C9A84C' }} />
            </div>
            <h3 className="text-sm font-medium" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>Estimated Print Cost</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider" style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: '#C9A84C', letterSpacing: '0.1em' }}>HELIX</span>
        </div>

        {/* Input details */}
        <div className="space-y-2 text-sm mb-4">
          {technologyName && <Row label="Technology" value={technologyName} />}

          {/* Volume — auto or manual */}
          {volumeCm3 !== null ? (
            <Row label="Model Volume" value={`${volumeCm3.toFixed(1)} cm³`} />
          ) : (
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6B6B6B' }}>Enter volume (cm³)</label>
              <input
                type="number" min="0" step="0.1"
                value={manualVolume}
                onChange={(e) => setManualVolume(e.target.value)}
                placeholder="e.g. 18.4"
                className="w-full rounded-lg text-sm px-3 py-2 focus:outline-none transition-all"
                style={{ backgroundColor: '#111', border: '1px solid rgba(201,168,76,0.2)', color: '#F5F0E8' }}
              />
            </div>
          )}

          {pricing.estimatedWeight !== null && pricing.estimatedWeight > 0 && (
            <Row label="Est. Weight" value={`${pricing.estimatedWeight.toFixed(1)} g`} />
          )}

          <Row label="Material" value={`${material.name} @ ${formatCurrency(pricePerGram)}/g`} />
          {showInfill && <Row label="Infill" value={`${infill}%`} />}
          <Row label="Print Quality" value={qualityLabel} />

          {pricing.printTime && (
            <Row
              label="Est. Print Time"
              value={`~${pricing.printTime.billedHours} hr${pricing.printTime.billedHours > 1 ? 's' : ''}`}
              icon={<Clock className="w-3 h-3" />}
            />
          )}

          <Row label="Quantity" value={String(quantity)} />
        </div>

        {/* Cost breakdown divider */}
        <div className="my-3" style={{ height: '0.5px', backgroundColor: 'rgba(201,168,76,0.2)' }} />

        {/* 4-component breakdown (shipping is now in widget below) */}
        <div className="space-y-2 text-sm">
          {pricing.materialCost !== null && (
            <CostRow label="Material Cost" value={formatCurrency(pricing.materialCost)} />
          )}

          {pricing.printTimeCost !== null && pricing.printTime && (
            <CostRow
              label="Print Time"
              value={formatCurrency(pricing.printTimeCost)}
              detail={`${pricing.printTime.billedHours} hr${pricing.printTime.billedHours > 1 ? 's' : ''} × ₹5`}
              icon={<Clock className="w-3 h-3" style={{ color: '#C9A84C' }} />}
            />
          )}

          {pricing.handlingFee !== null && (
            <CostRow
              label="Handling (5%)"
              value={formatCurrency(pricing.handlingFee)}
              icon={<Percent className="w-3 h-3" style={{ color: '#C9A84C' }} />}
            />
          )}

          {pricing.platformFee !== null && (
            <CostRow
              label="Platform (10%)"
              value={formatCurrency(pricing.platformFee)}
              icon={<Settings2 className="w-3 h-3" style={{ color: '#C9A84C' }} />}
            />
          )}
        </div>

        {/* Shipping Widget Divider */}
        <div className="my-3" style={{ height: '0.5px', backgroundColor: 'rgba(201,168,76,0.2)' }} />

        {/* Amazon-style Shipping Widget */}
        <ShippingWidget
          pincode={pincode}
          actualWeightG={pricing.estimatedWeight ?? 10}
          boundingBoxMm={boundingBoxMm}
          orderTotal={orderSubtotal}
          businessPincodePrefix="380"
          onTierSelect={handleTierSelect}
        />

        {/* Grand Total divider */}
        <div className="my-2" style={{ height: '0.5px', backgroundColor: '#C9A84C', opacity: 0.4 }} />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: '#C9A84C' }}>
            <TrendingUp className="w-3.5 h-3.5" />
            Estimated Total
          </span>
          <span
            className={`text-xl font-bold transition-all duration-300`}
            style={{ color: animatePrice ? '#C9A84C' : '#F5F0E8', transform: animatePrice ? 'scale(1.1)' : 'scale(1)' }}
          >
            {grandTotal !== null ? formatCurrency(grandTotal) : '—'}
          </span>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 rounded-lg p-3" style={{ backgroundColor: 'rgba(26,26,26,0.4)', border: '1px solid rgba(201,168,76,0.1)' }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
          <p className="text-[11px] leading-relaxed" style={{ color: '#6B6B6B' }}>
            This is an estimate. Final price will be confirmed after file review by our team.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-1" style={{ color: '#6B6B6B' }}>{icon}{label}</span>
      <span className="font-medium" style={{ color: '#F5F0E8' }}>{value}</span>
    </div>
  );
}

function CostRow({ label, value, detail, icon, highlight }: {
  label: string; value: string; detail?: string; icon?: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-1.5" style={{ color: '#6B6B6B' }}>
        {icon}{label}
      </span>
      <div className="text-right">
        <span className="font-medium" style={{ color: highlight ? '#C9A84C' : '#F5F0E8' }}>{value}</span>
        {detail && <span className="text-[10px] ml-1.5" style={{ color: '#6B6B6B' }}>· {detail}</span>}
      </div>
    </div>
  );
}
