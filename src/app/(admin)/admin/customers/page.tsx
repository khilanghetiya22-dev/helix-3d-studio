import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, Package, ArrowRight, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatDistanceToNow } from 'date-fns';

export const metadata = { title: 'Customers — HELIX Admin' };

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  // Fetch all customer profiles
  const { data: customers } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, created_at')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  // For each customer, get order count and total spend
  const { data: orderAgg } = await supabase
    .from('orders')
    .select('user_id, estimated_price, final_price');

  const aggByUser: Record<string, { count: number; total: number }> = {};
  (orderAgg || []).forEach((o) => {
    if (!aggByUser[o.user_id]) aggByUser[o.user_id] = { count: 0, total: 0 };
    aggByUser[o.user_id].count += 1;
    aggByUser[o.user_id].total += Number(o.final_price) || Number(o.estimated_price) || 0;
  });

  let allCustomers = (customers || []).map((c) => ({
    ...c,
    orderCount: aggByUser[c.id]?.count || 0,
    totalSpend: aggByUser[c.id]?.total || 0,
  }));

  // Search filter
  if (sp.search) {
    const q = sp.search.toLowerCase();
    allCustomers = allCustomers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="page-heading text-2xl sm:text-3xl"
            style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}
          >
            CUSTOMERS
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
            {allCustomers.length} registered customer{allCustomers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <form className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B6B6B' }} />
        <input
          name="search"
          defaultValue={sp.search || ''}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
          style={{
            backgroundColor: '#0D1B2A',
            border: '1px solid rgba(201,168,76,0.2)',
            color: '#F5F0E8',
          }}
        />
      </form>

      {allCustomers.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#6B6B6B' }} />
          <p style={{ color: '#9CA3AF' }}>No customers found.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {allCustomers.map((customer, i) => (
            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
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
                {/* Avatar */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                    style={{
                      backgroundColor: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: '#C9A84C',
                    }}
                  >
                    {customer.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>
                      {customer.full_name || 'Unknown'}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#6B6B6B' }}>
                      {customer.email}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 sm:gap-8 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>
                      {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>
                      ₹{customer.totalSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs ml-1" style={{ color: '#6B6B6B' }}>spent</span>
                  </div>
                  <span className="text-xs" style={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                    Joined {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
                  </span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 hidden sm:block" style={{ color: '#C9A84C' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
