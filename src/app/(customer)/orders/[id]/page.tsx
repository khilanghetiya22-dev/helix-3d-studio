import React from 'react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Download, FileText, MapPin, Calendar, Hash, TrendingUp, Cpu, Navigation } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import OrderStatusStepper from '@/components/OrderStatusStepper';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import { STATUS_LABELS, MATERIALS, COLORS, QUALITY_OPTIONS } from '@/lib/constants';
import { format } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata = { title: 'Order Details — HELIX 3D Studio' };

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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_files(*), technologies(name, icon, slug)')
    .eq('id', id)
    .single();

  if (!order) notFound();
  const o = order as Order & { technologies?: { name: string; icon: string; slug: string } | null };

  const mat = MATERIALS.find(m => m.value === o.material)?.label || o.material;
  const col = COLORS.find(c => c.value === o.color)?.label || o.color;
  const qual = QUALITY_OPTIONS.find(q => q.value === o.quality)?.label || o.quality;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm transition-colors" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <Link
          href={`/orders/${id}/track`}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', textDecoration: 'none' }}
        >
          <Navigation className="w-3.5 h-3.5" /> Track Order
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Order #{o.id.slice(0, 8)}</h1>
            <Badge variant={o.status as OrderStatus} size="md" dot>{STATUS_LABELS[o.status]}</Badge>
          </div>
          <p className="text-sm text-text-muted mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Placed on {format(new Date(o.created_at), 'MMM d, yyyy \'at\' h:mm a')}
          </p>
        </div>
        {o.technologies && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
            <Cpu className="w-3.5 h-3.5" /> {o.technologies.icon} {o.technologies.name}
          </div>
        )}
      </div>

      {/* Status Stepper */}
      <Card className="mb-6">
        <OrderStatusStepper currentStatus={o.status} />
      </Card>

      {/* Status Timeline */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
          Status Timeline
        </p>
        <OrderStatusTimeline
          currentStatus={o.status}
          createdAt={o.created_at}
          updatedAt={o.updated_at}
        />
      </div>

      {/* Tracking */}
      {o.tracking_number && (
        <Card className="mb-6" style={{ backgroundColor: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5" style={{ color: '#C9A84C' }} />
              <div>
                <p className="text-sm font-medium text-text-primary">Tracking Number</p>
                <p className="text-lg font-mono font-bold" style={{ color: '#C9A84C' }}>{o.tracking_number}</p>
              </div>
            </div>
            <a 
              href={`https://www.delhivery.com/tracking?id=${o.tracking_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
            >
              Track on Delhivery &rarr;
            </a>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Print Specifications</h2>
          <div className="space-y-3 text-sm">
            {o.technologies && (
              <div className="flex items-center justify-between py-2 border-b border-border-primary/50">
                <span className="text-text-muted">Technology</span>
                <span className="font-medium text-text-primary">{o.technologies.icon} {o.technologies.name}</span>
              </div>
            )}
            {[
              ['Material', mat],
              ['Color', col],
              ['Infill', `${o.infill}%`],
              ['Quality', qual],
              ['Quantity', String(o.quantity)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border-primary/50 last:border-0">
                <span className="text-text-muted">{label}</span>
                <span className="font-medium text-text-primary">{value}</span>
              </div>
            ))}
          </div>
          {o.instructions && (
            <div className="mt-4 pt-4 border-t border-border-primary">
              <p className="text-sm text-text-muted mb-1">Special Instructions</p>
              <p className="text-sm text-text-primary bg-bg-secondary rounded-lg p-3">{o.instructions}</p>
            </div>
          )}
        </Card>

        {/* Address + Pricing */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Delivery Address
            </h2>
            <div className="text-sm text-text-secondary leading-relaxed bg-bg-secondary rounded-xl p-4 space-y-1">
              {o.address_json?.full_name && (
                <p className="text-text-primary font-medium">{o.address_json.full_name}</p>
              )}
              <p className="text-text-primary">{o.address_json?.street}</p>
              {o.address_json?.landmark && (
                <p style={{ color: '#6B6B6B' }} className="text-xs">Landmark: {o.address_json.landmark}</p>
              )}
              <p>{o.address_json?.city}, {o.address_json?.state} — {o.address_json?.pincode}</p>
              <p>{o.address_json?.country || 'India'}</p>
              {o.address_json?.phone && (
                <p className="text-xs mt-2 pt-2 border-t border-border-primary/50" style={{ color: '#6B6B6B' }}>
                  Phone: {o.address_json.phone.startsWith('+91') ? o.address_json.phone : `+91 ${o.address_json.phone.replace(/^(\d{5})/, '$1 ')}`}
                </p>
              )}
            </div>
          </Card>

          {/* Pricing Breakdown */}
          {(o.material_cost != null || o.estimated_price != null) && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: '#C9A84C' }} />
                <h2 className="text-base font-semibold text-text-primary">Pricing</h2>
              </div>
              <div className="space-y-2 text-sm">
                {o.material_cost != null && (
                  <PriceRow label="Material Cost" value={formatCurrency(o.material_cost)} />
                )}
                {o.print_time_cost != null && (
                  <PriceRow
                    label="Print Time"
                    value={formatCurrency(o.print_time_cost)}
                    detail={o.estimated_print_hours ? `${o.estimated_print_hours} hrs × ₹5` : undefined}
                  />
                )}
                {o.handling_fee != null && (
                  <PriceRow label="Handling (5%)" value={formatCurrency(o.handling_fee)} />
                )}
                {o.shipping_fee != null && (
                  <PriceRow
                    label={`Shipping (${o.shipping_tier || 'standard'})`}
                    value={o.shipping_fee === 0 ? 'FREE' : formatCurrency(o.shipping_fee)}
                    detail={o.shipping_zone || undefined}
                  />
                )}
                {o.platform_fee != null && (
                  <PriceRow label="Platform (10%)" value={formatCurrency(o.platform_fee)} />
                )}
              </div>
              <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '0.5px solid rgba(201,168,76,0.3)' }}>
                <span className="text-sm" style={{ color: '#9CA3AF' }}>Estimated Total</span>
                <span className="text-lg font-bold" style={{ color: '#F5F0E8' }}>
                  {formatCurrency(o.estimated_price)}
                </span>
              </div>
              
              <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-primary">
                <div>
                  <p className="text-xs text-text-muted">Payment</p>
                  <p className="text-sm font-medium uppercase text-text-primary">{o.payment_method}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Status</p>
                  <span className={`text-xs font-bold uppercase tracking-wider ${o.payment_status === 'paid' ? 'text-green-500' : 'text-[#C9A84C]'}`}>
                    {o.payment_status}
                  </span>
                </div>
              </div>
              {o.final_price != null && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>Final Price</span>
                  <span className="text-lg font-bold" style={{ color: '#C9A84C' }}>
                    {formatCurrency(o.final_price)}
                  </span>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Files */}
      {o.order_files && o.order_files.length > 0 && (
        <Card className="mt-6">
          <h2 className="text-base font-semibold text-text-primary mb-4">Uploaded Files ({o.order_files.length})</h2>
          <div className="space-y-2">
            {o.order_files.map((f) => (
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
    <div className="flex items-center justify-between py-1.5 border-b border-border-primary/30 last:border-0">
      <span style={{ color: '#6B6B6B' }}>{label}</span>
      <div className="text-right">
        <span className="font-medium" style={{ color: '#F5F0E8' }}>{value}</span>
        {detail && <span className="text-[10px] ml-1.5" style={{ color: '#6B6B6B' }}>· {detail}</span>}
      </div>
    </div>
  );
}
