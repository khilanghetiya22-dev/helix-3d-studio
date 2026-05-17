import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Package, Clock, Printer, CheckCircle, Truck, PackageCheck, ArrowRight, Search, Cpu } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { STATUS_LABELS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata = { title: 'Admin — All Orders — HELIX 3D Studio' };

const statusIcons: Record<string, React.ReactNode> = {
  received: <Clock className="w-4 h-4" />,
  printing: <Printer className="w-4 h-4" />,
  quality_check: <CheckCircle className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <PackageCheck className="w-4 h-4" />,
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; tech?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch technologies for filter
  const { data: technologies } = await supabase
    .from('technologies')
    .select('id, slug, name, icon')
    .eq('is_active', true)
    .order('display_order');

  let query = supabase
    .from('orders')
    .select('*, profiles!inner(full_name, email), order_files(id), technologies(name, icon, slug)')
    .order('created_at', { ascending: false });

  if (sp.status && sp.status !== 'all') {
    query = query.eq('status', sp.status);
  }

  if (sp.tech && sp.tech !== 'all') {
    // Find technology id by slug
    const techMatch = technologies?.find(t => t.slug === sp.tech);
    if (techMatch) {
      query = query.eq('technology_id', techMatch.id);
    }
  }

  const { data: orders } = await query;
  const allOrders = (orders || []) as (Order & { profiles: { full_name: string; email: string }; technologies: { name: string; icon: string; slug: string } | null })[];

  // Filter by search
  const filtered = sp.search
    ? allOrders.filter(o =>
        o.profiles.full_name.toLowerCase().includes(sp.search!.toLowerCase()) ||
        o.profiles.email.toLowerCase().includes(sp.search!.toLowerCase()) ||
        o.id.toLowerCase().includes(sp.search!.toLowerCase())
      )
    : allOrders;

  // Stats
  const allCount = allOrders.length;
  const statusCounts = Object.fromEntries(
    ['received', 'printing', 'quality_check', 'shipped', 'delivered'].map(s => [
      s, allOrders.filter(o => o.status === s).length
    ])
  );

  const activeFilter = sp.status || 'all';
  const activeTech = sp.tech || 'all';

  // Build filter URLs preserving other params
  const buildUrl = (params: Record<string, string>) => {
    const base = '/admin/orders';
    const p = new URLSearchParams();
    const merged = { status: sp.status || 'all', tech: sp.tech || 'all', ...params };
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== 'all') p.set(k, v); });
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Order Management</h1>
          <p className="text-sm text-text-secondary mt-1">View and manage all customer orders.</p>
        </div>
      </div>

      {/* Technology Filter */}
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-text-muted flex items-center gap-1 mr-1"><Cpu className="w-3 h-3" /> Tech:</span>
          <FilterTab href={buildUrl({ tech: 'all' })} active={activeTech === 'all'} count={allCount}>
            All
          </FilterTab>
          {technologies.map(t => (
            <FilterTab key={t.slug} href={buildUrl({ tech: t.slug })} active={activeTech === t.slug}>
              {t.icon} {t.name}
            </FilterTab>
          ))}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterTab href={buildUrl({ status: 'all' })} active={activeFilter === 'all'} count={allCount}>
          All Orders
        </FilterTab>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <FilterTab key={key} href={buildUrl({ status: key })} active={activeFilter === key} count={statusCounts[key] || 0}>
            {statusIcons[key]} {label}
          </FilterTab>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <form>
          <input type="hidden" name="status" value={sp.status || 'all'} />
          <input type="hidden" name="tech" value={sp.tech || 'all'} />
          <input
            name="search"
            defaultValue={sp.search || ''}
            placeholder="Search by name, email, or order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </form>
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No orders found.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card hover className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-text-muted truncate">{order.profiles.full_name} • {order.profiles.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <Badge variant={order.status as OrderStatus} size="sm" dot>{STATUS_LABELS[order.status]}</Badge>
                  {order.technologies && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-secondary text-text-muted border border-border-primary">
                      {order.technologies.icon} {order.technologies.name}
                    </span>
                  )}
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {order.material.toUpperCase()} • Qty {order.quantity}
                  </span>
                  {order.estimated_price && (
                    <span className="text-xs font-medium text-accent whitespace-nowrap">
                      ₹{Number(order.estimated_price).toFixed(0)}
                    </span>
                  )}
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </span>
                  <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0 hidden sm:block" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({ href, active, count, children }: {
  href: string; active: boolean; count?: number; children: React.ReactNode;
}) {
  return (
    <Link href={href}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-bg-secondary text-text-muted border border-border-primary hover:text-text-secondary hover:border-border-secondary'
      }`}>
      {children}
      {count !== undefined && <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${active ? 'bg-primary/20' : 'bg-bg-elevated'}`}>{count}</span>}
    </Link>
  );
}
