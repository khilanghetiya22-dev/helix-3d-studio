-- ============================================
-- PrintForge 3D — V3 Migration: Technologies
-- ============================================

-- ============================================
-- 1. Technologies table
-- ============================================
CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  best_for TEXT,
  use_infill BOOLEAN DEFAULT false NOT NULL,
  use_color BOOLEAN DEFAULT true NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active technologies"
  ON public.technologies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage technologies"
  ON public.technologies FOR ALL
  USING (public.is_admin());

-- ============================================
-- 2. Seed technologies
-- ============================================
INSERT INTO public.technologies (slug, name, full_name, description, best_for, use_infill, use_color, icon, display_order) VALUES
  ('fdm',    'FDM',    'Fused Deposition Modeling',      'Melts and extrudes thermoplastic filament layer by layer',  'Functional prototypes, low cost parts',           true,  true,  '🏭', 1),
  ('sls',    'SLS',    'Selective Laser Sintering',       'Uses a laser to sinter powdered material into solid form', 'Strong complex geometries, no supports needed',    false, false, '⚡', 2),
  ('sla',    'SLA',    'Stereolithography',               'UV laser cures liquid resin layer by layer',               'High detail, smooth surface finish',               false, true,  '💎', 3),
  ('dlp',    'DLP',    'Digital Light Processing',        'Projects UV light to cure resin, faster than SLA',         'High detail, faster production than SLA',          false, true,  '🔬', 4),
  ('dmls',   'DMLS',   'Direct Metal Laser Sintering',    'Fuses metal powder using high-power laser',                'Metal functional parts, aerospace, medical',       false, false, '🔩', 5),
  ('polyjet','PolyJet','PolyJet / Multi-material Jetting','Jets and UV-cures photopolymer droplets',                  'Multi-material, full color, ultra-smooth',         false, true,  '🎨', 6),
  ('binder-jetting','Binder Jetting','Binder Jetting',    'Binds powder material with liquid binding agent',          'Full color models, sand casting, metal parts',     false, true,  '🧱', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. Add technology_id to materials table
-- ============================================
ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS technology_id UUID REFERENCES public.technologies(id);

-- ============================================
-- 4. Add technology_id to orders table
-- ============================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS technology_id UUID REFERENCES public.technologies(id);

-- ============================================
-- 5. Seed new materials (linked to technologies)
-- ============================================

-- Allow same material name under different technologies
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_name_key;

-- First, assign existing FDM materials
UPDATE public.materials SET technology_id = (SELECT id FROM public.technologies WHERE slug = 'fdm')
WHERE slug IN ('pla', 'abs', 'petg', 'tpu', 'nylon') AND technology_id IS NULL;

-- SLA materials
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram, technology_id)
SELECT m.name, m.slug, m.description, m.density, m.price, t.id
FROM (VALUES
  ('Standard Resin', 'standard-resin', 'General-purpose, smooth finish',  1.10, 8.00),
  ('Tough Resin',    'tough-resin',    'ABS-like toughness',               1.15, 10.00),
  ('Flexible Resin', 'flexible-resin', 'Rubber-like flexibility',          1.08, 12.00)
) AS m(name, slug, description, density, price)
CROSS JOIN (SELECT id FROM public.technologies WHERE slug = 'sla') t
ON CONFLICT (slug) DO NOTHING;

-- DLP materials
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram, technology_id)
SELECT m.name, m.slug, m.description, m.density, m.price, t.id
FROM (VALUES
  ('ABS-like Resin',  'abs-like-resin',  'Simulates ABS properties', 1.12, 9.00),
  ('Castable Resin',  'castable-resin',  'For investment casting',   1.05, 15.00)
) AS m(name, slug, description, density, price)
CROSS JOIN (SELECT id FROM public.technologies WHERE slug = 'dlp') t
ON CONFLICT (slug) DO NOTHING;

-- SLS materials
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram, technology_id)
SELECT m.name, m.slug, m.description, m.density, m.price, t.id
FROM (VALUES
  ('Nylon PA12',         'nylon-pa12',         'Versatile, strong',     1.01, 18.00),
  ('Glass-filled Nylon', 'glass-filled-nylon', 'Extra stiffness',       1.22, 22.00)
) AS m(name, slug, description, density, price)
CROSS JOIN (SELECT id FROM public.technologies WHERE slug = 'sls') t
ON CONFLICT (slug) DO NOTHING;

-- DMLS materials
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram, technology_id)
SELECT m.name, m.slug, m.description, m.density, m.price, t.id
FROM (VALUES
  ('Stainless Steel', 'stainless-steel', 'Corrosion resistant',  7.90, 80.00),
  ('Titanium',        'titanium',        'Lightweight, strong',  4.43, 150.00),
  ('Aluminium',       'aluminium',       'Lightweight metal',    2.68, 60.00)
) AS m(name, slug, description, density, price)
CROSS JOIN (SELECT id FROM public.technologies WHERE slug = 'dmls') t
ON CONFLICT (slug) DO NOTHING;

-- PolyJet materials
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram, technology_id)
SELECT m.name, m.slug, m.description, m.density, m.price, t.id
FROM (VALUES
  ('Rigid',       'polyjet-rigid',       'Hard, precise',           1.18, 25.00),
  ('Flexible',    'polyjet-flexible',    'Rubber-like feel',        1.14, 30.00)
) AS m(name, slug, description, density, price)
CROSS JOIN (SELECT id FROM public.technologies WHERE slug = 'polyjet') t
ON CONFLICT (slug) DO NOTHING;

-- Binder Jetting materials
INSERT INTO public.materials (name, slug, description, density_g_per_cm3, price_per_gram, technology_id)
SELECT m.name, m.slug, m.description, m.density, m.price, t.id
FROM (VALUES
  ('Sandstone',        'bj-sandstone',        'Full color models',  1.80, 20.00),
  ('Stainless Steel',  'bj-stainless-steel',  'Metal parts',        7.80, 75.00)
) AS m(name, slug, description, density, price)
CROSS JOIN (SELECT id FROM public.technologies WHERE slug = 'binder-jetting') t
ON CONFLICT (slug) DO NOTHING;
