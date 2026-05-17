// Type definitions for HELIX 3D Studio

export type UserRole = 'admin' | 'customer';

export type OrderStatus = 'received' | 'printing' | 'quality_check' | 'shipped' | 'delivered';

export type PrintQuality = 'draft' | 'standard' | 'fine';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  density_g_per_cm3: number;
  price_per_gram: number;
  technology_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  description: string | null;
  best_for: string | null;
  use_infill: boolean;
  use_color: boolean;
  icon: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  material: string;
  material_id: string | null;
  technology_id: string | null;
  color: string;
  infill: number;
  quality: PrintQuality;
  quantity: number;
  instructions: string | null;
  address_json: Address;
  tracking_number: string | null;
  estimated_weight_g: number | null;
  estimated_volume_cm3: number | null;
  estimated_price: number | null;
  final_price: number | null;
  // V7 pricing breakdown
  estimated_print_hours: number | null;
  print_time_cost: number | null;
  material_cost: number | null;
  handling_fee: number | null;
  shipping_fee: number | null;
  shipping_zone: string | null;
  platform_fee: number | null;
  shipping_tier: 'standard' | 'express' | 'overnight' | null;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  order_files?: OrderFile[];
  materials?: Material;
  technologies?: Technology;
}

export interface OrderFile {
  id: string;
  order_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export interface OrderFormData {
  // Project details
  material: string;
  color: string;
  infill: number;
  quality: PrintQuality;
  quantity: number;
  instructions: string;
  // Address
  address_json: Address;
  // Files (handled separately)
}

export interface StepperStep {
  key: OrderStatus;
  label: string;
  icon: string;
}

export interface FilterState {
  status: OrderStatus | 'all';
  search: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'created_at' | 'updated_at' | 'status';
  sortOrder: 'asc' | 'desc';
}
