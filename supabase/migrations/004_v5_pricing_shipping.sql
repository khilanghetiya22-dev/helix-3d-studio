-- ============================================
-- PrintForge 3D — V5 Migration: Pricing & Shipping
-- ============================================

-- ============================================
-- 1. Shipping Zones table
-- ============================================
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name TEXT NOT NULL,
  pincode_prefixes TEXT[] NOT NULL DEFAULT '{}',
  fee NUMERIC NOT NULL DEFAULT 100,
  description TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shipping zones"
  ON public.shipping_zones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage shipping zones"
  ON public.shipping_zones FOR ALL
  USING (public.is_admin());

-- ============================================
-- 2. Settings table (key-value config store)
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.settings FOR ALL
  USING (public.is_admin());

-- ============================================
-- 3. Add pricing breakdown columns to orders
-- ============================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS estimated_print_hours INT,
  ADD COLUMN IF NOT EXISTS print_time_cost NUMERIC,
  ADD COLUMN IF NOT EXISTS material_cost NUMERIC,
  ADD COLUMN IF NOT EXISTS handling_fee NUMERIC,
  ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC,
  ADD COLUMN IF NOT EXISTS shipping_zone TEXT,
  ADD COLUMN IF NOT EXISTS platform_fee NUMERIC;

-- ============================================
-- 4. Seed shipping zones
-- ============================================
INSERT INTO public.shipping_zones (zone_name, pincode_prefixes, fee, description) VALUES
  ('Local',  ARRAY['380'],                   0,   'Same city (free delivery/pickup)'),
  ('Zone A', ARRAY['38','39'],              40,   'Gujarat (home state)'),
  ('Zone B', ARRAY['40','41','42','43'],    60,   'Maharashtra, Goa'),
  ('Zone C', ARRAY['11','12','13','14','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37'], 80, 'Delhi, Haryana, Punjab, UP, Uttarakhand, Rajasthan, MP'),
  ('Zone D', ARRAY['44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78'], 100, 'South & East India'),
  ('Zone E', ARRAY['79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99'], 140, 'North-East, J&K, Ladakh, Islands')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. Seed business pincode prefix setting
-- ============================================
INSERT INTO public.settings (key, value) VALUES
  ('business_pincode_prefix', '380')
ON CONFLICT (key) DO NOTHING;
