import React from 'react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, MapPin, Truck, Hash, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import OrderStatusStepper from '@/components/OrderStatusStepper';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import { STATUS_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata = { title: 'Track Order — HELIX 3D Studio' };

export default async function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase
    .from('orders')
    .select('*, technologies(name, icon, slug)')
    .eq('id', id)
    .eq('user_id', user.id) // ensure ownership
    .single();

  if (!order) notFound();
  const o = order as Order & { technologies?: { name: string; icon: string; slug: string } | null };

  const SHIPPING_TIER_LABEL: Record<string, string> = {
    standard: 'Standard Delivery',
    express: 'Express Delivery',
    overnight: 'Overnight / Priority',
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back */}
      <Link
        href={`/orders/${id}`}
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: '#9CA3AF', textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order Details
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1
            className="page-heading text-2xl"
            style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}
          >
            TRACK ORDER
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm" style={{ color: '#6B6B6B' }}>
              #{o.id.slice(0, 8).toUpperCase()}
            </span>
            <span style={{ color: '#3A3A3A' }}>·</span>
            <span className="text-xs" style={{ color: '#6B6B6B' }}>
              {format(new Date(o.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <Badge variant={o.status as OrderStatus} size="md">
          {STATUS_LABELS[o.status]}
        </Badge>
      </div>

      {/* Technology badge */}
      {o.technologies && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            backgroundColor: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: '#C9A84C',
          }}
        >
          {o.technologies.icon} {o.technologies.name} Order
        </div>
      )}

      {/* Status Stepper */}
      <Card className="mb-6">
        <OrderStatusStepper currentStatus={o.status} />
      </Card>

      {/* Status Timeline */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <p
          className="text-xs font-medium uppercase tracking-widest mb-5"
          style={{ color: '#C9A84C' }}
        >
          Status Timeline
        </p>
        <OrderStatusTimeline
          currentStatus={o.status}
          createdAt={o.created_at}
          updatedAt={o.updated_at}
        />
      </div>

      {/* Tracking number */}
      {o.tracking_number && (
        <div
          className="rounded-xl p-5 mb-6"
          style={{
            backgroundColor: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.25)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: '#C9A84C' }}
            >
              Courier · Delhivery
            </span>
          </div>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>AWB / Tracking Number</p>
          <p className="text-xl font-mono font-bold mt-1" style={{ color: '#F5F0E8' }}>
            {o.tracking_number}
          </p>
          <a
            href={`https://www.delhivery.com/tracking?id=${o.tracking_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg text-sm font-medium transition-all btn-glow"
            style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', textDecoration: 'none' }}
          >
            Track on Delhivery <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Shipping info */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4" style={{ color: '#C9A84C' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#C9A84C' }}>
            Delivery Info
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p style={{ color: '#6B6B6B' }}>Shipping Method</p>
            <p className="mt-1 font-medium" style={{ color: '#F5F0E8' }}>
              {o.shipping_tier ? SHIPPING_TIER_LABEL[o.shipping_tier] || o.shipping_tier : 'Standard Delivery'}
            </p>
          </div>
          {o.shipping_zone && (
            <div>
              <p style={{ color: '#6B6B6B' }}>Zone</p>
              <p className="mt-1 font-medium" style={{ color: '#F5F0E8' }}>{o.shipping_zone}</p>
            </div>
          )}
          {o.shipping_fee != null && (
            <div>
              <p style={{ color: '#6B6B6B' }}>Shipping Fee</p>
              <p className="mt-1 font-medium" style={{ color: '#C9A84C' }}>
                {o.shipping_fee === 0 ? 'FREE' : `₹${Number(o.shipping_fee).toFixed(2)}`}
              </p>
            </div>
          )}
        </div>

        {/* Address */}
        {o.address_json && (
          <>
            <div style={{ height: '0.5px', backgroundColor: 'rgba(201,168,76,0.15)', margin: '16px 0' }} />
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6B6B6B' }} />
              <div className="text-sm">
                <p style={{ color: '#F5F0E8' }}>{o.address_json.street}</p>
                <p style={{ color: '#9CA3AF' }}>
                  {o.address_json.city}, {o.address_json.state} · {o.address_json.pincode}
                </p>
                <p style={{ color: '#9CA3AF' }}>{o.address_json.country}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* No tracking yet */}
      {!o.tracking_number && (
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.1)' }}
        >
          <Truck className="w-8 h-8 mx-auto mb-3" style={{ color: '#6B6B6B' }} />
          <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>
            Tracking not yet available
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
            Tracking details will appear here once your order is shipped.
          </p>
        </div>
      )}
    </div>
  );
}
