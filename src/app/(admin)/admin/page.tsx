import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Package, TrendingUp, Clock, Users, ArrowRight, Printer, CheckCircle, Truck } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { STATUS_LABELS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata = { title: 'Admin Dashboard — HELIX 3D Studio' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  // Fetch all orders for stats
  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, estimated_price, final_price, created_at, material, quantity, profiles!inner(full_name, email), technologies(name, icon, slug)')
    .order('created_at', { ascending: false });

  const allOrders = (orders || []) as unknown as (Order & {
    profiles: { full_name: string; email: string };
    technologies: { name: string; icon: string; slug: string } | null;
  })[];

  // Stats
  const totalOrders = allOrders.length;
  const pendingCount = allOrders.filter(o => ['received', 'printing', 'quality_check'].includes(o.status)).length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.final_price) || Number(o.estimated_price) || 0), 0);
  const recentOrders = allOrders.slice(0, 8);

  // Customer count
  const { count: customerCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'customer');

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: <Package className="w-5 h-5" />,
      href: '/admin/orders',
      color: '#C9A84C',
    },
    {
      label: 'Pending / Active',
      value: pendingCount,
      icon: <Clock className="w-5 h-5" />,
      href: '/admin/orders?status=received',
      color: '#9CA3AF',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/admin/orders',
      color: '#C9A84C',
    },
    {
      label: 'Customers',
      value: customerCount ?? 0,
      icon: <Users className="w-5 h-5" />,
      href: '/admin/customers',
      color: '#9CA3AF',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="page-heading text-2xl sm:text-3xl"
          style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}
        >
          ADMIN DASHBOARD
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
          Overview of HELIX 3D Studio operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div
              className="rounded-xl p-5 card-hover"
              style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ border: '1px solid rgba(201,168,76,0.2)', color: stat.color }}
              >
                {stat.icon}
              </div>
              <p
                className="text-2xl font-light mb-1"
                style={{ color: '#F5F0E8', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: '#6B6B6B' }}>
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="grid sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'All Orders', href: '/admin/orders', icon: <Package className="w-4 h-4" /> },
          { label: 'Printing Now', href: '/admin/orders?status=printing', icon: <Printer className="w-4 h-4" /> },
          { label: 'Quality Check', href: '/admin/orders?status=quality_check', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'All Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: '#0D1B2A',
              border: '1px solid rgba(201,168,76,0.12)',
              color: '#9CA3AF',
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#C9A84C' }}>{item.icon}</span>
            {item.label}
            <ArrowRight className="w-3.5 h-3.5 ml-auto" style={{ color: '#C9A84C' }} />
          </Link>
        ))}
      </div>

      {/* Gold separator */}
      <div style={{ height: '0.5px', backgroundColor: '#C9A84C', opacity: 0.15, marginBottom: '24px' }} />

      {/* Recent Orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
          Recent Orders
        </h2>
        <Link
          href="/admin/orders"
          className="text-sm font-medium flex items-center gap-1 transition-colors"
          style={{ color: '#C9A84C', textDecoration: 'none' }}
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#6B6B6B' }} />
          <p style={{ color: '#9CA3AF' }}>No orders yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {recentOrders.map((order, i) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl px-4 py-3 animate-slide-up row-hover"
                style={{
                  backgroundColor: '#0D1B2A',
                  border: '1px solid rgba(201,168,76,0.1)',
                  animationDelay: `${i * 40}ms`,
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
                    <p className="text-xs truncate" style={{ color: '#6B6B6B' }}>
                      {order.profiles.full_name} · {order.profiles.email}
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
                  <span className="text-xs" style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    Qty {order.quantity}
                  </span>
                  {(order.final_price || order.estimated_price) && (
                    <span className="text-xs font-medium" style={{ color: '#C9A84C', whiteSpace: 'nowrap' }}>
                      ₹{Number(order.final_price || order.estimated_price).toFixed(0)}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </span>
                  <Truck className="w-4 h-4 flex-shrink-0 hidden sm:block" style={{ color: '#C9A84C' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Admin links strip */}
      <div className="mt-10 pt-6" style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)' }}>
        <p className="text-xs mb-4" style={{ color: '#6B6B6B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Settings
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Materials & Pricing', href: '/admin/settings/materials' },
            { label: 'Shipping Zones', href: '/admin/settings/shipping' },
            { label: 'Platform Fees', href: '/admin/settings/fees' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm px-4 py-2 rounded-lg transition-all"
              style={{
                color: '#9CA3AF',
                border: '1px solid rgba(201,168,76,0.15)',
                backgroundColor: '#0D1B2A',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
