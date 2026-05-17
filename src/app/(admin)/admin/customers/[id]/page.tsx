import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Package, Phone, Mail, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { STATUS_LABELS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata = { title: 'Customer Detail — HELIX Admin' };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!adminProfile || adminProfile.role !== 'admin') redirect('/dashboard');

  // Fetch customer profile
  const { data: customer } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!customer) redirect('/admin/customers');

  // Fetch customer's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*, technologies(name, icon, slug), order_files(id)')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  const customerOrders = (orders || []) as (Order & {
    technologies: { name: string; icon: string; slug: string } | null;
  })[];

  const totalSpend = customerOrders.reduce(
    (sum, o) => sum + (Number(o.final_price) || Number(o.estimated_price) || 0),
    0
  );

  // Saved address
  const { data: savedAddress } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', id)
    .eq('is_default', true)
    .maybeSingle();

  return (
    <div className="animate-fade-in max-w-5xl">
      {/* Back */}
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: '#9CA3AF', textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium flex-shrink-0"
          style={{
            backgroundColor: 'rgba(201,168,76,0.1)',
            border: '2px solid rgba(201,168,76,0.3)',
            color: '#C9A84C',
          }}
        >
          {customer.full_name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <h1
            className="page-heading text-2xl"
            style={{ color: '#F5F0E8', letterSpacing: '0.06em' }}
          >
            {customer.full_name}
          </h1>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm" style={{ color: '#6B6B6B' }}>
              <Mail className="w-3.5 h-3.5" /> {customer.email}
            </span>
            {customer.phone && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: '#6B6B6B' }}>
                <Phone className="w-3.5 h-3.5" /> {customer.phone}
              </span>
            )}
            <span className="text-xs" style={{ color: '#6B6B6B' }}>
              Joined {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: customerOrders.length },
          { label: 'Total Spend', value: `₹${totalSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
          {
            label: 'Last Order',
            value: customerOrders[0]
              ? formatDistanceToNow(new Date(customerOrders[0].created_at), { addSuffix: true })
              : 'None',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <p className="text-lg font-light" style={{ color: '#C9A84C' }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Saved address */}
      {savedAddress && (
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#C9A84C' }}>
              Saved Address
            </span>
          </div>
          <p className="text-sm" style={{ color: '#F5F0E8' }}>{savedAddress.street}</p>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {savedAddress.city}, {savedAddress.state} · {savedAddress.pincode}
          </p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>{savedAddress.country}</p>
        </div>
      )}

      {/* Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
            Order History
          </h2>
          <span className="text-sm" style={{ color: '#6B6B6B' }}>
            {customerOrders.length} order{customerOrders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {customerOrders.length === 0 ? (
          <Card className="text-center py-10">
            <Package className="w-10 h-10 mx-auto mb-3" style={{ color: '#6B6B6B' }} />
            <p style={{ color: '#9CA3AF' }}>No orders yet.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {customerOrders.map((order, i) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl px-4 py-3 animate-slide-up row-hover"
                  style={{
                    backgroundColor: '#0D1B2A',
                    border: '1px solid rgba(201,168,76,0.1)',
                    animationDelay: `${i * 30}ms`,
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
                    >
                      <Package className="w-4 h-4" style={{ color: '#C9A84C' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    <Badge variant={order.status as OrderStatus} size="sm">
                      {STATUS_LABELS[order.status]}
                    </Badge>
                    {order.technologies && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'rgba(26,26,26,0.5)',
                          color: '#9CA3AF',
                          border: '1px solid rgba(201,168,76,0.1)',
                        }}
                      >
                        {order.technologies.icon} {order.technologies.name}
                      </span>
                    )}
                    {(order.final_price || order.estimated_price) && (
                      <span className="text-xs font-medium" style={{ color: '#C9A84C' }}>
                        ₹{Number(order.final_price || order.estimated_price).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
