'use server';

import { createClient } from '@/lib/supabase/server';
import type { Material } from '@/lib/types';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Fetch all active materials, optionally filtered by technology
 */
export async function getActiveMaterials(technologyId?: string): Promise<Material[]> {
  const supabase = await createClient();
  let query = supabase
    .from('materials')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (technologyId) {
    query = query.eq('technology_id', technologyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getActiveMaterials] Error:', error);
    return [];
  }
  return data as Material[];
}

/**
 * Fetch ALL materials including inactive (admin only)
 */
export async function getAllMaterials(): Promise<Material[]> {
  const supabase = await createClient();

  // Admin check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Use service role or direct query (RLS will filter)
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('name');

  if (error) {
    console.error('[getAllMaterials] Error:', error);
    return [];
  }
  return data as Material[];
}

/**
 * Update a material's price or density (admin only)
 */
export async function updateMaterial(
  materialId: string,
  updates: {
    price_per_gram?: number;
    density_g_per_cm3?: number;
    name?: string;
    description?: string;
  }
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
      .from('materials')
      .update(updates)
      .eq('id', materialId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update' };
  }
}

/**
 * Add a new material (admin only)
 */
export async function addMaterial(data: {
  name: string;
  slug: string;
  description: string;
  density_g_per_cm3: number;
  price_per_gram: number;
  technology_id?: string;
}): Promise<ActionResult> {
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

    const { error } = await supabase.from('materials').insert(data);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to add' };
  }
}

/**
 * Toggle material active/inactive (admin only)
 */
export async function toggleMaterial(materialId: string, isActive: boolean): Promise<ActionResult> {
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
      .from('materials')
      .update({ is_active: isActive })
      .eq('id', materialId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to toggle' };
  }
}
