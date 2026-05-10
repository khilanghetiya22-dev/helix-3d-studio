import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15).optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().min(1, 'Country is required'),
});

export const orderSchema = z.object({
  material: z.string().min(1, 'Please select a material'),
  color: z.string().min(1, 'Please select a color'),
  infill: z.number().min(0).max(100),
  quality: z.enum(['draft', 'standard', 'fine']),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000),
  instructions: z.string().max(2000).optional().or(z.literal('')),
  address_json: addressSchema,
  shipping_tier: z.enum(['standard', 'express', 'overnight']).nullable().optional(),
  payment_method: z.string().optional(),
  payment_status: z.enum(['pending', 'paid', 'refunded']).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['received', 'printing', 'quality_check', 'shipped', 'delivered']),
  tracking_number: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OrderFormInput = z.infer<typeof orderSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
