-- ============================================
-- HELIX 3D Studio — V14 Migration: FDM-Only
-- Deactivate all non-FDM technologies and their materials.
-- HELIX is now a strictly FDM-only printing service.
-- ============================================

-- 1. Deactivate all technologies except FDM
UPDATE public.technologies
SET is_active = false
WHERE slug != 'fdm';

-- 2. Deactivate all materials not linked to FDM
UPDATE public.materials
SET is_active = false
WHERE technology_id != (SELECT id FROM public.technologies WHERE slug = 'fdm')
  AND technology_id IS NOT NULL;
