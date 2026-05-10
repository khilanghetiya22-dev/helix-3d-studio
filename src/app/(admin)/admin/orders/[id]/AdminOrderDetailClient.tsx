'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, MapPin, Calendar, User, Mail, Phone, Hash, Save, DollarSign, Package, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import OrderStatusStepper from '@/components/OrderStatusStepper';
import { STATUS_LABELS, MATERIALS, COLORS, QUALITY_OPTIONS, ORDER_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';
import { updateOrderStatus, setFinalPrice } from '@/app/actions/orders';
import type { Order, OrderStatus, Profile, OrderFile } from '@/lib/types';

interface AdminOrderDetailClientProps {
  order: Order;
  customer: Profile;
  files: OrderFile[];
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function AdminOrderDetailClient({ order, customer, files }: AdminOrderDetailClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.tracking_number || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Final price state
  const [finalPriceInput, setFinalPriceInput] = useState(
    order.final_price != null ? String(order.final_price) : ''
  );
  const [priceSaving, setPriceSaving] = useState(false);
  const [priceSaved, setPriceSaved] = useState(false);
  const [priceError, setPriceError] = useState('');

  const mat = MATERIALS.find(m => m.value === order.material)?.label || order.material;
  const col = COLORS.find(c => c.value === order.color)?.label || order.color;
  const qual = QUALITY_OPTIONS.find(q => q.value === order.quality)?.label || order.quality;

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const result = await updateOrderStatus(order.id, status, tracking || undefined);
      if (!result.success) {
        setSaveError(result.error || 'Failed to update');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch (err) {
      console.error(err);
      setSaveError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleSetFinalPrice = async () => {
    setPriceSaving(true);
    setPriceError('');
    try {
      const price = parseFloat(finalPriceInput);
      if (isNaN(price) || price < 0) {
        setPriceError('Please enter a valid price');
        return;
      }
      const result = await setFinalPrice(order.id, price);
      if (!result.success) {
        setPriceError(result.error || 'Failed to set price');
        return;
      }
      setPriceSaved(true);
      setTimeout(() => setPriceSaved(false), 2000);
      router.refresh();
    } catch (err) {
      console.error(err);
      setPriceError('An unexpected error occurred');
    } finally {
      setPriceSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Order #{order.id.slice(0, 8)}</h1>
            <Badge variant={order.status as OrderStatus} size="md" dot>{STATUS_LABELS[order.status]}</Badge>
          </div>
          <p className="text-sm text-text-muted mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(order.created_at), 'MMM d, yyyy \'at\' h:mm a')}
          </p>
        </div>
      </div>

      {/* Status Stepper */}
      <Card className="mb-6">
        <OrderStatusStepper currentStatus={status} />
      </Card>

      {/* Admin Controls */}
      <Card className="mb-6" style={{ border: '1px solid rgba(201,146,10,0.2)', backgroundColor: 'rgba(201,146,10,0.03)' }}>
        <h2 className="text-base font-semibold text-text-primary mb-4">⚙️ Admin Controls</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full rounded-xl bg-bg-secondary border border-border-primary text-text-primary px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
            >
              {ORDER_STATUSES.map(s => (
                <option key={s.key} value={s.key} className="bg-bg-secondary">{s.label}</option>
              ))}
            </select>
          </div>
          <Input
            label="Tracking Number"
            placeholder="Enter tracking number..."
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            icon={<Hash className="w-4 h-4" />}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSave} isLoading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
          {saved && <span className="text-sm text-accent animate-fade-in">✓ Saved successfully</span>}
          {saveError && <span className="text-sm text-danger animate-fade-in">✗ {saveError}</span>}
        </div>
      </Card>

      {/* Set Final Price */}
      <Card className="mb-6" style={{ border: '1px solid rgba(201,146,10,0.25)', backgroundColor: 'rgba(201,146,10,0.03)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(201,146,10,0.1)' }}>
            <DollarSign className="w-4 h-4" style={{ color: '#C9920A' }} />
          </div>
          <h2 className="text-base font-semibold text-text-primary">Set Final Price</h2>
        </div>

        {order.estimated_price != null && (
          <div className="flex items-center gap-4 mb-3 text-sm">
            <span style={{ color: '#6B6B6B' }}>Estimated:</span>
            <span className="font-medium" style={{ color: '#F5F4F0' }}>{formatCurrency(order.estimated_price)}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#6B6B6B' }}>₹</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={finalPriceInput}
              onChange={(e) => setFinalPriceInput(e.target.value)}
              placeholder="Enter final price"
              className="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: '#111',
                border: '1px solid rgba(201,146,10,0.2)',
                color: '#F5F4F0',
              }}
            />
          </div>
          <button
            onClick={handleSetFinalPrice}
            disabled={priceSaving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#C9920A', color: '#1A1A1A' }}
          >
            {priceSaving ? 'Saving...' : 'Set Final Price'}
          </button>
        </div>

        {order.final_price != null && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: '#6B6B6B' }}>Current final price:</span>
            <span className="text-lg font-bold" style={{ color: '#C9920A' }}>{formatCurrency(order.final_price)}</span>
          </div>
        )}

        {priceSaved && <p className="text-sm mt-2 animate-fade-in" style={{ color: '#C9920A' }}>✓ Final price set</p>}
        {priceError && <p className="text-sm mt-2 animate-fade-in" style={{ color: '#C9920A' }}>✗ {priceError}</p>}
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Customer</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-text-muted" /><span className="text-text-primary">{customer.full_name}</span></div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-text-muted" /><span className="text-text-primary">{customer.email}</span></div>
            {customer.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-text-muted" /><span className="text-text-primary">{customer.phone}</span></div>}
          </div>
        </Card>

        {/* Print Specs */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Print Specs</h2>
          <div className="space-y-2 text-sm">
            {[['Material', mat], ['Color', col], ['Infill', `${order.infill}%`], ['Quality', qual], ['Quantity', String(order.quantity)]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-border-primary/50 last:border-0">
                <span className="text-text-muted">{l}</span>
                <span className="font-medium text-text-primary">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Address */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Delivery
          </h2>
          <div className="text-sm text-text-secondary bg-bg-secondary rounded-xl p-3">
            <p className="text-text-primary font-medium">{order.address_json.street}</p>
            <p>{order.address_json.city}, {order.address_json.state} — {order.address_json.pincode}</p>
            <p>{order.address_json.country}</p>
          </div>
        </Card>
      </div>

      {/* Pricing Breakdown */}
      {(order.material_cost != null || order.estimated_price != null) && (
        <Card className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: '#C9920A' }} />
            <h2 className="text-base font-semibold text-text-primary">Pricing Breakdown</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {order.estimated_volume_cm3 != null && (
              <PriceRow label="Model Volume" value={`${Number(order.estimated_volume_cm3).toFixed(1)} cm³`} />
            )}
            {order.estimated_weight_g != null && (
              <PriceRow label="Est. Weight" value={`${Number(order.estimated_weight_g).toFixed(1)} g`} />
            )}
            {order.material_cost != null && (
              <PriceRow label="Material Cost" value={formatCurrency(order.material_cost)} />
            )}
            {order.print_time_cost != null && (
              <PriceRow
                label="Print Time"
                value={formatCurrency(order.print_time_cost)}
                detail={order.estimated_print_hours ? `${order.estimated_print_hours} hr × ₹5` : undefined}
              />
            )}
            {order.handling_fee != null && (
              <PriceRow label="Handling (5%)" value={formatCurrency(order.handling_fee)} />
            )}
            {order.shipping_fee != null && (
              <PriceRow
                label="Shipping"
                value={formatCurrency(order.shipping_fee)}
                detail={order.shipping_zone || undefined}
              />
            )}
            {order.platform_fee != null && (
              <PriceRow label="Platform (10%)" value={formatCurrency(order.platform_fee)} />
            )}
          </div>
          <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '0.5px solid rgba(201,146,10,0.3)' }}>
            <span className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Estimated Total</span>
            <span className="text-lg font-bold" style={{ color: '#F5F4F0' }}>
              {formatCurrency(order.estimated_price)}
            </span>
          </div>
          {order.final_price != null && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: '#C9920A' }}>Final Price (confirmed)</span>
              <span className="text-lg font-bold" style={{ color: '#C9920A' }}>
                {formatCurrency(order.final_price)}
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      {order.instructions && (
        <Card className="mt-6">
          <h2 className="text-base font-semibold text-text-primary mb-2">Special Instructions</h2>
          <p className="text-sm text-text-secondary bg-bg-secondary rounded-xl p-4">{order.instructions}</p>
        </Card>
      )}

      {/* Files */}
      {files.length > 0 && (
        <Card className="mt-6">
          <h2 className="text-base font-semibold text-text-primary mb-4">Files ({files.length})</h2>
          <div className="space-y-2">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-border-primary">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{f.file_name}</p>
                  <p className="text-xs text-text-muted">{formatBytes(f.file_size)} • .{f.file_type}</p>
                </div>
                <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-primary transition-all" title="Download">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function PriceRow({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border-primary/30">
      <span style={{ color: '#6B6B6B' }}>{label}</span>
      <div className="text-right">
        <span className="font-medium" style={{ color: '#F5F4F0' }}>{value}</span>
        {detail && <span className="text-[10px] ml-1.5" style={{ color: '#6B6B6B' }}>· {detail}</span>}
      </div>
    </div>
  );
}
