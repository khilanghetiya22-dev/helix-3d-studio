'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Box } from 'lucide-react';
import type { Order } from '@/lib/types';

type ExtendedOrder = Order & { 
  order_files: { file_name: string; file_url: string }[];
  technologies?: { name: string; slug: string };
};

export default function OrderListClient({ orders }: { orders: ExtendedOrder[] }) {
  const [filter, setFilter] = useState<'all' | 'received' | 'printing' | 'quality_check' | 'shipped' | 'delivered'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (filter !== 'all' && order.status !== filter) return false;
      
      // Search filter (Order ID, Material, Technology)
      if (search) {
        const query = search.toLowerCase();
        const idMatch = order.id.toLowerCase().includes(query);
        const materialMatch = order.material.toLowerCase().includes(query);
        const techMatch = order.technologies?.name.toLowerCase().includes(query) || false;
        if (!idMatch && !materialMatch && !techMatch) return false;
      }
      
      return true;
    });
  }, [orders, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return { bg: 'transparent', text: '#6B6B6B', border: 'rgba(107,107,107,0.5)' }; // grey outline
      case 'printing': return { bg: '#0D1B2A', text: '#F5F0E8', border: 'transparent' }; // navy bg, white text
      case 'quality_check': return { bg: 'transparent', text: '#C9A84C', border: '#C9A84C' }; // gold outline
      case 'shipped': return { bg: '#C9A84C', text: '#0A0A0F', border: 'transparent' }; // gold solid, black text
      case 'delivered': return { bg: 'transparent', text: '#F5F0E8', border: 'rgba(245,244,240,0.5)' }; // white outline
      default: return { bg: 'transparent', text: '#6B6B6B', border: 'rgba(107,107,107,0.5)' };
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Pending Quote';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + 
           ', ' + 
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#111111] border border-[rgba(201,168,76,0.2)] text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none text-sm transition-colors"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'received', 'printing', 'quality_check', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status as any); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                filter === status 
                  ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]' 
                  : 'border-[rgba(201,168,76,0.2)] bg-[#111111] text-[#6B6B6B] hover:text-[#F5F0E8]'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-[rgba(201,168,76,0.1)] bg-[#111111]">
          <Box className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: '#F5F0E8' }} />
          <p className="text-[#F5F0E8] font-medium mb-1">No orders yet.</p>
          <p className="text-sm text-[#6B6B6B] mb-6">Start your first print.</p>
          <Link href="/orders/new" className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#C9A84C] text-[#0A0A0F]">
            Place an Order
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[rgba(201,168,76,0.1)] bg-[#111111]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[rgba(201,168,76,0.1)] text-xs text-[#6B6B6B] uppercase tracking-wider bg-[rgba(26,26,26,0.3)]">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Technology</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Est. Total</th>
                <th className="px-4 py-3 font-medium">Placed On</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                const displayPrice = order.final_price !== null ? order.final_price : order.estimated_price;

                return (
                  <tr key={order.id} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[#0A0A0F] transition-colors group cursor-pointer" onClick={() => window.location.href = `/orders/${order.id}`}>
                    <td className="px-4 py-4 text-sm font-medium text-[#F5F0E8]">
                      #FQ-{order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded text-[10px] font-medium bg-[#0D1B2A] text-[#F5F0E8]">
                        {order.technologies?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#F5F0E8]">
                      {order.material.toUpperCase()}
                    </td>
                    <td className="px-4 py-4">
                      <span 
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium border"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6B6B6B]">
                      {order.quantity} pcs
                    </td>
                    <td className="px-4 py-4 text-sm text-[#F5F0E8]">
                      {formatPrice(displayPrice)}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6B6B6B]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <Link href={`/orders/${order.id}`} className="text-[#C9A84C] hover:underline" onClick={(e) => e.stopPropagation()}>
                        View Details &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-[#6B6B6B]">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-[rgba(201,168,76,0.2)] bg-[#111111] text-[#F5F0E8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0A0A0F] transition-colors text-sm flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded border border-[rgba(201,168,76,0.2)] bg-[#111111] text-[#F5F0E8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0A0A0F] transition-colors text-sm flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
