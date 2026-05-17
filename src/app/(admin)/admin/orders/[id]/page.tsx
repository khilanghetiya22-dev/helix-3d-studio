import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminOrderDetailClient from './AdminOrderDetailClient';

export const metadata = { title: 'Admin — Order Detail — HELIX 3D Studio' };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (!order) notFound();

  const { data: customer } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', order.user_id)
    .single();

  const { data: files } = await supabase
    .from('order_files')
    .select('*')
    .eq('order_id', id)
    .order('uploaded_at', { ascending: true });

  return (
    <AdminOrderDetailClient
      order={order}
      customer={customer!}
      files={files || []}
    />
  );
}
