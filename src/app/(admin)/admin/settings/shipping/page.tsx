'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Truck, MapPin, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getShippingZones, updateShippingZoneFee, getSetting, updateSetting } from '@/app/actions/shipping';

interface ShippingZone {
  id: string;
  zone_name: string;
  pincode_prefixes: string[];
  fee: number;
  description: string | null;
  is_active: boolean;
  updated_at: string;
}

export default function AdminShippingPage() {
  const router = useRouter();
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [businessPrefix, setBusinessPrefix] = useState('380');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [zonesData, prefixData] = await Promise.all([
      getShippingZones(),
      getSetting('business_pincode_prefix'),
    ]);
    setZones(zonesData);
    if (prefixData) setBusinessPrefix(prefixData);
    setLoading(false);
  };

  const handleEditFee = (zone: ShippingZone) => {
    setEditingId(zone.id);
    setEditFee(String(zone.fee));
  };

  const handleSaveFee = async (zoneId: string) => {
    setSaving(true);
    setError('');
    const result = await updateShippingZoneFee(zoneId, parseFloat(editFee));
    if (result.success) {
      setEditingId(null);
      setSuccessMsg('Shipping fee updated');
      setTimeout(() => setSuccessMsg(''), 2000);
      await fetchData();
    } else {
      setError(result.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleSavePrefix = async () => {
    setSaving(true);
    setError('');
    const result = await updateSetting('business_pincode_prefix', businessPrefix);
    if (result.success) {
      setSuccessMsg('Business pincode updated');
      setTimeout(() => setSuccessMsg(''), 2000);
    } else {
      setError(result.error || 'Failed to save');
    }
    setSaving(false);
  };

  const zoneColors: Record<string, string> = {
    Local: 'text-green-400 bg-green-400/10',
    'Zone A': 'text-blue-400 bg-blue-400/10',
    'Zone B': 'text-cyan-400 bg-cyan-400/10',
    'Zone C': 'text-yellow-400 bg-yellow-400/10',
    'Zone D': 'text-orange-400 bg-orange-400/10',
    'Zone E': 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => router.push('/admin/orders')} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Truck className="w-6 h-6 text-primary" />
            Shipping Zones
          </h1>
          <p className="text-sm text-text-secondary mt-1">Manage shipping fees by pincode zone. Changes take effect immediately.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger animate-scale-in">{error}</div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent animate-scale-in">✓ {successMsg}</div>
      )}

      {/* Business Pincode Config */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Business Pincode Prefix</h2>
            <p className="text-xs text-text-muted mt-0.5">Orders with this pincode prefix get free local delivery.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            maxLength={3}
            value={businessPrefix}
            onChange={(e) => setBusinessPrefix(e.target.value.replace(/\D/g, '').slice(0, 3))}
            className="w-24 rounded-lg bg-bg-secondary border border-border-primary text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-primary font-mono text-center"
          />
          <Button onClick={handleSavePrefix} isLoading={saving} size="sm" icon={<Save className="w-3.5 h-3.5" />}>
            Save
          </Button>
          <span className="text-xs text-text-muted">First 3 digits of your city&apos;s pincodes (e.g. 380 for Ahmedabad)</span>
        </div>
      </Card>

      {/* Shipping Zones */}
      {loading ? (
        <Card className="text-center py-12">
          <div className="w-8 h-8 border-2 border-text-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading zones...</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {zones.map((zone, i) => {
            const colors = zoneColors[zone.zone_name] || 'text-text-muted bg-bg-secondary';

            return (
              <Card
                key={zone.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Zone info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{zone.zone_name}</p>
                      <p className="text-xs text-text-muted truncate">{zone.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {zone.pincode_prefixes.slice(0, 8).map(p => (
                          <span key={p} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-bg-elevated text-text-muted">{p}xxx</span>
                        ))}
                        {zone.pincode_prefixes.length > 8 && (
                          <span className="text-[10px] text-text-muted">+{zone.pincode_prefixes.length - 8} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fee */}
                  {editingId === zone.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <label className="text-[10px] text-text-muted mb-0.5 block">Fee (₹)</label>
                        <input
                          type="number" step="1" min="0" value={editFee}
                          onChange={(e) => setEditFee(e.target.value)}
                          className="w-full rounded-lg bg-bg-secondary border border-border-primary text-text-primary text-sm px-2.5 py-1.5 focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex gap-1.5 mt-4">
                        <button onClick={() => handleSaveFee(zone.id)} disabled={saving}
                          className="p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg bg-bg-elevated text-text-muted hover:text-text-secondary transition-all text-xs px-2">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-text-muted">Fee</p>
                        <p className={`text-lg font-bold ${zone.fee === 0 ? 'text-accent' : 'text-text-primary'}`}>
                          {zone.fee === 0 ? 'FREE' : `₹${zone.fee}`}
                        </p>
                      </div>
                      <button onClick={() => handleEditFee(zone)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-secondary text-text-secondary border border-border-primary hover:border-primary hover:text-primary transition-all">
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
