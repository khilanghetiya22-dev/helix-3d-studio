'use server';

import { createClient } from '@/lib/supabase/server';
import type { Technology } from '@/lib/types';

/**
 * Fetch all active technologies
 */
export async function getActiveTechnologies(): Promise<Technology[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('[getActiveTechnologies] Error:', error);
    return [];
  }
  return data as Technology[];
}

/**
 * Fetch a single technology by slug
 */
export async function getTechnologyBySlug(slug: string): Promise<Technology | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data as Technology;
}
