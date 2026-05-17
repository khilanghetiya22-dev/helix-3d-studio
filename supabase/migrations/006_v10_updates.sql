-- ============================================
-- FORMIQ — V10 Migration: Settings & Tracking
-- ============================================

-- ============================================
-- 1. Settings table
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies for settings
DROP POLICY IF EXISTS "Admins can view all settings" ON public.settings;
CREATE POLICY "Admins can view all settings"
  ON public.settings FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all settings" ON public.settings;
CREATE POLICY "Admins can manage all settings"
  ON public.settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Customers can view settings like platform fees
DROP POLICY IF EXISTS "Customers can view public settings" ON public.settings;
CREATE POLICY "Customers can view public settings"
  ON public.settings FOR SELECT
  USING (true);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed initial settings
INSERT INTO public.settings (key, value) VALUES
  ('business_pincode_prefix', '380'),
  ('platform_fee_percent', '10'),
  ('handling_fee_percent', '5')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. Update orders table
-- ============================================

-- Add tracking_number column
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- We don't drop the previous payment_method check constraint for safety, 
-- we will just enforce it at the application layer to only use 'prepaid'.
