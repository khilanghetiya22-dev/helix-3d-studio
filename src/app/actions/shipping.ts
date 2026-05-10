'use server';

import { createClient } from '@/lib/supabase/server';

interface ShippingZone {
  id: string;
  zone_name: string;
  pincode_prefixes: string[];
  fee: number;
  description: string | null;
  is_active: boolean;
  updated_at: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Fetch all shipping zones
 */
export async function getShippingZones(): Promise<ShippingZone[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .order('fee');

  if (error) {
    console.error('[getShippingZones] Error:', error);
    return [];
  }
  return data as ShippingZone[];
}

/**
 * Update a shipping zone's fee (admin only)
 */
export async function updateShippingZoneFee(
  zoneId: string,
  fee: number
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Admin access required' };
    }

    const { error } = await supabase
      .from('shipping_zones')
      .update({ fee, updated_at: new Date().toISOString() })
      .eq('id', zoneId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update' };
  }
}

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  return data?.value || null;
}

/**
 * Update a setting (admin only)
 */
export async function updateSetting(
  key: string,
  value: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Admin access required' };
    }

    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update' };
  }
}
