-- ============================================
-- FORMIQ — V9 Migration: Addresses & Order Updates
-- ============================================

-- ============================================
-- 1. User Addresses table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  label       TEXT DEFAULT 'Home',
  street      TEXT NOT NULL,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  pincode     TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'India',
  -- FIX: Changed DEFAULT true → false.
  -- Defaulting every new address to "default" is a logic bug;
  -- only the address the user explicitly chooses should be default.
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------
-- Policies for user_addresses
-- (DROP IF EXISTS → re-runnable / idempotent)
-- -----------------------------------------------

DROP POLICY IF EXISTS "Users can view their own addresses"  ON public.user_addresses;
CREATE POLICY "Users can view their own addresses"
  ON public.user_addresses FOR SELECT
  USING (auth.uid() = user_id);

-- FIX: Added admin SELECT policy so admins can see customer
-- addresses for order fulfilment and support purposes.
DROP POLICY IF EXISTS "Admins can view all addresses"       ON public.user_addresses;
CREATE POLICY "Admins can view all addresses"
  ON public.user_addresses FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
CREATE POLICY "Users can insert their own addresses"
  ON public.user_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
CREATE POLICY "Users can update their own addresses"
  ON public.user_addresses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;
CREATE POLICY "Users can delete their own addresses"
  ON public.user_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON public.user_addresses;
CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Update orders table
-- ============================================

-- FIX: Wrap RENAME in an anonymous block so it is safe to re-run.
-- Plain ALTER TABLE … RENAME COLUMN has no IF EXISTS guard and will
-- throw "column does not exist" if the migration is applied twice.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'orders'
      AND column_name  = 'address'
  ) THEN
    ALTER TABLE public.orders RENAME COLUMN address TO address_json;
  END IF;
END $$;

-- Add new columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_tier   TEXT
    CHECK (shipping_tier IN ('standard', 'express', 'overnight')),
  -- FIX: Added CHECK constraint on payment_method to restrict to
  -- known values ('prepaid', 'cod') required by the V9 spec.
  ADD COLUMN IF NOT EXISTS payment_method  TEXT DEFAULT 'prepaid'
    CHECK (payment_method IN ('prepaid', 'cod')),
  ADD COLUMN IF NOT EXISTS payment_status  TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded'));
