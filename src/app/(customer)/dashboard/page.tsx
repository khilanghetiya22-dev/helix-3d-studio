import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Plus, Package, Clock, CheckCircle2, Truck, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { STATUS_LABELS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata = {
  title: 'My Orders — HELIX 3D Studio',
  description: 'Manage your 3D printing orders.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_files(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const allOrders = (orders || []) as Order[];
  const stats = {
    total: allOrders.length,
    active: allOrders.filter(o => !['delivered'].includes(o.status)).length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    printing: allOrders.filter(o => o.status === 'printing').length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-heading text-2xl sm:text-3xl" style={{ color: '#F5F0E8' }}>
            Welcome back, <span style={{ color: '#C9A84C' }}>{profile?.full_name || 'User'}</span>
          </h1>
          <p className="mt-1" style={{ color: '#6B6B6B' }}>Here&apos;s an overview of your 3D print orders.</p>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all text-sm"
          style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
        >
          <Plus className="w-4 h-4" /> New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: <Package className="w-5 h-5" /> },
          { label: 'Active', value: stats.active, icon: <Clock className="w-5 h-5" /> },
          { label: 'Printing', value: stats.printing, icon: <Truck className="w-5 h-5" /> },
          { label: 'Delivered', value: stats.delivered, icon: <CheckCircle2 className="w-5 h-5" /> },
        ].map((stat) => (
          <Card key={stat.label} hover>
            <div style={{ color: '#C9A84C' }} className="mb-3">{stat.icon}</div>
            <p className="text-3xl font-light" style={{ color: '#F5F0E8' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Orders</h2>
          {allOrders.length > 3 && (
            <Link href="/orders" className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {allOrders.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
              <Package className="w-8 h-8" style={{ color: '#C9A84C' }} />
            </div>
            <h3 className="text-lg font-light mb-2" style={{ color: '#F5F0E8' }}>No orders yet</h3>
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>Start your first print.</p>
            <Link
              href="/orders/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all text-sm"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
            >
              <Plus className="w-4 h-4" /> Place Your First Order
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {allOrders.slice(0, 3).map((order, i) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card hover className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
                    <Package className="w-5 h-5" style={{ color: '#C9A84C' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-text-primary">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <Badge variant={order.status as OrderStatus} size="sm" dot>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      {order.material.toUpperCase()} • {order.color} • Qty: {order.quantity} • {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
