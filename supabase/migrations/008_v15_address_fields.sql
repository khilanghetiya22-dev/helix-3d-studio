-- ============================================
-- HELIX — V15 Migration: Address fields update
-- ============================================

-- Add new address fields to user_addresses
ALTER TABLE public.user_addresses
  ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone     TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS landmark  TEXT;

-- Adjust orders constraints for shipping tier check (remove overnight option)
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_shipping_tier_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_tier_check
  CHECK (shipping_tier IN ('standard', 'express'));
