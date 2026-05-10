-- ============================================
-- PrintForge 3D — V2 Migration: Materials & Pricing
-- ============================================

-- ============================================
-- 1. Materials table (admin-configurable)
-- ============================================
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  density_g_per_cm3 NUMERIC(5,2) NOT NULL,
  price_per_gram NUMERIC(8,2) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Everyone can read active materials
CREATE POLICY "Anyone can view active materials"
  ON public.materials FOR SELECT
  USING (is_active = true);

-- Admin can do everything
CREATE POLICY "Admins can manage materials"
  ON public.materials FOR ALL
  USING (public.is_admin());

-- Updated_at trigger
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Seed default materials
-- ============================================
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram) VALUES
  ('PLA',    'pla',    'Most popular, easy to print',        1.24, 3.50),
  ('ABS',    'abs',    'Strong, heat resistant',              1.04, 3.00),
  ('PETG',   'petg',   'Durable, flexible',                  1.27, 4.00),
  ('Resin',  'resin',  'High detail, smooth finish',         1.10, 8.00),
  ('Nylon',  'nylon',  'Strong, flexible, durable',          1.14, 6.00),
  ('TPU',    'tpu',    'Flexible, rubber-like',               1.21, 5.50),
  ('Carbon Fiber', 'carbon-fiber', 'Extremely strong, lightweight', 1.30, 12.00),
  ('Wood Fill',    'wood-fill',    'Wood-like appearance',          1.15, 7.00),
  ('Metal Fill',   'metal-fill',   'Metallic finish',               2.00, 15.00)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. Add pricing columns to orders
-- ============================================
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS material_id UUID REFERENCES public.materials(id),
  ADD COLUMN IF NOT EXISTS estimated_weight_g NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS estimated_volume_cm3 NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS estimated_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS final_price NUMERIC(10,2);
