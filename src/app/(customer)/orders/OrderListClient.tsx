'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, Box } from 'lucide-react';
import type { Order } from '@/lib/types';

type ExtendedOrder = Order & { order_files: { file_name: string; file_url: string }[] };

export default function OrderListClient({ orders }: { orders: ExtendedOrder[] }) {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'completed') return order.status === 'delivered';
    return order.status !== 'delivered';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', border: 'rgba(59,130,246,0.2)' };
      case 'printing': return { bg: 'rgba(201,146,10,0.1)', text: '#C9920A', border: 'rgba(201,146,10,0.2)' };
      case 'quality_check': return { bg: 'rgba(168,85,247,0.1)', text: '#A855F7', border: 'rgba(168,85,247,0.2)' };
      case 'shipped': return { bg: 'rgba(236,72,153,0.1)', text: '#EC4899', border: 'rgba(236,72,153,0.2)' };
      case 'delivered': return { bg: 'rgba(34,197,94,0.1)', text: '#22C55E', border: 'rgba(34,197,94,0.2)' };
      default: return { bg: 'rgba(107,107,107,0.1)', text: '#6B6B6B', border: 'rgba(107,107,107,0.2)' };
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Pending Quote';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(201,146,10,0.1)] pb-px">
        {['all', 'in_progress', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === tab 
                ? 'border-[#C9920A] text-[#C9920A]' 
                : 'border-transparent text-[#6B6B6B] hover:text-[#F5F4F0]'
            }`}
          >
            {tab === 'all' ? 'All Orders' : tab === 'in_progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-[rgba(201,146,10,0.1)] bg-[#111111]">
          <Box className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: '#F5F4F0' }} />
          <p className="text-[#F5F4F0] font-medium mb-1">No orders found</p>
          <p className="text-sm text-[#6B6B6B]">You haven't placed any orders in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredOrders.map((order) => {
            const statusStyle = getStatusColor(order.status);
            const displayPrice = order.final_price !== null ? order.final_price : order.estimated_price;
            const date = new Date(order.created_at).toLocaleDateString('en-IN', { 
              day: 'numeric', month: 'short', year: 'numeric' 
            });

            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl transition-all hover:bg-[#1A1A1A] border border-[rgba(201,146,10,0.08)] hover:border-[rgba(201,146,10,0.2)] bg-[#111111]">
                  
                  <div className="flex items-center gap-4 mb-3 sm:mb-0 w-full sm:w-auto">
                    {/* Thumbnail placeholder */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(26,26,26,0.5)', border: '1px solid rgba(201,146,10,0.1)' }}>
                      <Package className="w-5 h-5 text-[#6B6B6B]" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#F5F4F0]">
                          Order #{order.id.split('-')[0].toUpperCase()}
                        </span>
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-medium border"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6B6B6B]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date}</span>
                        <span>&middot;</span>
                        <span>{order.quantity} item{order.quantity > 1 ? 's' : ''}</span>
                        <span>&middot;</span>
                        <span className="uppercase">{order.material}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 sm:pl-4 border-t border-[rgba(201,146,10,0.1)] sm:border-none pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-[#6B6B6B] mb-0.5">Amount</p>
                      <p className="text-sm font-medium text-[#F5F4F0]">{formatPrice(displayPrice)}</p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-[rgba(201,146,10,0.1)]">
                      <ChevronRight className="w-4 h-4 text-[#C9920A] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
