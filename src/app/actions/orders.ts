'use server';

import { createClient } from '@/lib/supabase/server';
import { orderSchema, statusUpdateSchema } from '@/lib/validations';
import { sendOrderConfirmation, sendAdminNewOrderAlert, sendStatusUpdateEmail } from '@/lib/email';
import type { OrderStatus } from '@/lib/types';

interface ActionResult {
  success: boolean;
  error?: string;
  orderId?: string;
}

/**
 * Server action: Submit a new order with server-side validation + email notifications
 */
export async function submitOrder(formData: {
  material: string;
  material_id?: string;
  technology_id?: string;
  color: string;
  infill: number;
  quality: string;
  quantity: number;
  instructions: string;
  address_json: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  fileCount: number;
  estimated_weight_g?: number | null;
  estimated_volume_cm3?: number | null;
  estimated_price?: number | null;
  // V5 pricing breakdown
  estimated_print_hours?: number | null;
  print_time_cost?: number | null;
  material_cost?: number | null;
  handling_fee?: number | null;
  shipping_fee?: number | null;
  shipping_zone?: string | null;
  platform_fee?: number | null;
  shipping_tier?: 'standard' | 'express' | 'overnight' | null;
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'refunded';
}): Promise<ActionResult> {
  try {
    // Server-side validation with Zod
    const parsed = orderSchema.safeParse({
      material: formData.material,
      color: formData.color,
      infill: formData.infill,
      quality: formData.quality,
      quantity: formData.quantity,
      instructions: formData.instructions,
      address_json: formData.address_json,
      shipping_tier: formData.shipping_tier,
      payment_method: formData.payment_method,
      payment_status: formData.payment_status,
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return { success: false, error: firstError?.message || 'Validation failed' };
    }

    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    // Insert order
    const insertData: Record<string, unknown> = {
      user_id: user.id,
      material: parsed.data.material,
      color: parsed.data.color,
      infill: parsed.data.infill,
      quality: parsed.data.quality,
      quantity: parsed.data.quantity,
      instructions: parsed.data.instructions || null,
      address_json: parsed.data.address_json,
    };

    if (parsed.data.shipping_tier) insertData.shipping_tier = parsed.data.shipping_tier;
    if (parsed.data.payment_method) insertData.payment_method = parsed.data.payment_method;
    if (parsed.data.payment_status) insertData.payment_status = parsed.data.payment_status;

    // V2/V3 pricing and tech fields
    if (formData.material_id) insertData.material_id = formData.material_id;
    if (formData.technology_id) insertData.technology_id = formData.technology_id;
    if (formData.estimated_weight_g != null) insertData.estimated_weight_g = formData.estimated_weight_g;
    if (formData.estimated_volume_cm3 != null) insertData.estimated_volume_cm3 = formData.estimated_volume_cm3;
    if (formData.estimated_price != null) insertData.estimated_price = formData.estimated_price;

    // V5 pricing breakdown
    if (formData.estimated_print_hours != null) insertData.estimated_print_hours = formData.estimated_print_hours;
    if (formData.print_time_cost != null) insertData.print_time_cost = formData.print_time_cost;
    if (formData.material_cost != null) insertData.material_cost = formData.material_cost;
    if (formData.handling_fee != null) insertData.handling_fee = formData.handling_fee;
    if (formData.shipping_fee != null) insertData.shipping_fee = formData.shipping_fee;
    if (formData.shipping_zone) insertData.shipping_zone = formData.shipping_zone;
    if (formData.platform_fee != null) insertData.platform_fee = formData.platform_fee;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(insertData)
      .select()
      .single();

    if (orderError) {
      return { success: false, error: orderError.message };
    }

    // Send emails (best-effort, don't block on failure)
    if (profile) {
      // Customer confirmation
      sendOrderConfirmation({
        customerName: profile.full_name,
        customerEmail: profile.email,
        orderId: order.id,
        material: order.material,
        color: order.color,
        infill: order.infill,
        quality: order.quality,
        quantity: order.quantity,
        instructions: order.instructions,
        address: order.address_json,
        fileCount: formData.fileCount,
      }).catch(console.error);

      // Admin notification
      sendAdminNewOrderAlert({
        customerName: profile.full_name,
        customerEmail: profile.email,
        orderId: order.id,
        material: order.material,
        color: order.color,
        infill: order.infill,
        quality: order.quality,
        quantity: order.quantity,
        fileCount: formData.fileCount,
      }).catch(console.error);
    }

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error('[submitOrder] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to submit order' };
  }
}

/**
 * Server action: Update order status (admin only) with validation + email notification
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
): Promise<ActionResult> {
  try {
    // Server-side validation
    const parsed = statusUpdateSchema.safeParse({
      status,
      tracking_number: trackingNumber,
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return { success: false, error: firstError?.message || 'Validation failed' };
    }

    // Auth + admin check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    // Update order
    const updateData: Record<string, string> = { status: parsed.data.status };
    if (trackingNumber) updateData.tracking_number = trackingNumber;

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Get order + customer info for email
    const { data: order } = await supabase
      .from('orders')
      .select('*, profiles!inner(full_name, email)')
      .eq('id', orderId)
      .single();

    if (order) {
      const customerProfile = order.profiles as unknown as { full_name: string; email: string };
      sendStatusUpdateEmail({
        customerName: customerProfile.full_name,
        customerEmail: customerProfile.email,
        orderId: order.id,
        newStatus: parsed.data.status as OrderStatus,
        trackingNumber: trackingNumber || undefined,
      }).catch(console.error);
    }

    return { success: true, orderId };
  } catch (err) {
    console.error('[updateOrderStatus] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update order' };
  }
}

/**
 * Server action: Set final price for an order (admin only)
 */
export async function setFinalPrice(
  orderId: string,
  finalPrice: number,
): Promise<ActionResult> {
  try {
    if (finalPrice < 0) {
      return { success: false, error: 'Price must be a positive number' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ final_price: finalPrice })
      .eq('id', orderId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, orderId };
  } catch (err) {
    console.error('[setFinalPrice] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to set price' };
  }
}
