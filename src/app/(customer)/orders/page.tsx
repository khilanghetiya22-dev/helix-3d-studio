import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { Order } from '@/lib/types';
import OrderListClient from './OrderListClient';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all user orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_files(file_name, file_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch orders:', error);
  }

  const userOrders = (orders || []) as unknown as (Order & { order_files: { file_name: string, file_url: string }[] })[];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#F5F4F0' }}>Order History</h1>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>View and track your 3D printing orders</p>
        </div>
        
        <Link 
          href="/orders/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: '#C9920A', color: '#1A1A1A' }}
        >
          <Plus className="w-4 h-4" />
          New Order
        </Link>
      </div>

      <OrderListClient orders={userOrders} />
    </div>
  );
}
