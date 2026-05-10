-- ============================================
-- PrintForge 3D — Initial Database Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Profiles table (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Admin check function (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. Orders table
-- ============================================
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' 
    CHECK (status IN ('received', 'printing', 'quality_check', 'shipped', 'delivered')),
  material TEXT NOT NULL,
  color TEXT NOT NULL,
  infill INTEGER NOT NULL CHECK (infill BETWEEN 0 AND 100),
  quality TEXT NOT NULL CHECK (quality IN ('draft', 'standard', 'fine')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  instructions TEXT,
  address JSONB NOT NULL,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Customers can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Customers can update their own orders (limited)"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'received')
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. Order files table
-- ============================================
CREATE TABLE public.order_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;

-- Order files policies
CREATE POLICY "Users can view files for their own orders"
  ON public.order_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_files.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all files"
  ON public.order_files FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can insert files for their own orders"
  ON public.order_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_files.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files for their own orders"
  ON public.order_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_files.order_id
      AND orders.user_id = auth.uid()
      AND orders.status = 'received'
    )
  );

-- ============================================
-- 4. Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Auto-create profile on signup trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.email = current_setting('app.admin_email', true) THEN 'admin'
      ELSE 'customer'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. Indexes for performance
-- ============================================
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_files_order_id ON public.order_files(order_id);

-- ============================================
-- 7. Storage bucket for order files
-- ============================================
-- Run this in Supabase SQL editor or via the dashboard:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('order-files', 'order-files', false);
