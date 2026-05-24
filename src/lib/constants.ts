// Constants for HELIX 3D Studio

import { StepperStep } from './types';

export const MATERIALS = [
  { value: 'pla', label: 'PLA', description: 'Most popular, easy to print' },
  { value: 'abs', label: 'ABS', description: 'Strong, heat resistant' },
  { value: 'petg', label: 'PETG', description: 'Durable, flexible' },
  { value: 'nylon', label: 'Nylon', description: 'Strong, flexible, durable' },
  { value: 'tpu', label: 'TPU', description: 'Flexible, rubber-like' },
] as const;

export const COLORS = [
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'black', label: 'Black', hex: '#0A0A0F' },
] as const;

export const ORDER_STATUSES: StepperStep[] = [
  { key: 'received', label: 'Received', icon: 'inbox' },
  { key: 'printing', label: 'Printing', icon: 'printer' },
  { key: 'quality_check', label: 'Quality Check', icon: 'check-circle' },
  { key: 'shipped', label: 'Shipped', icon: 'truck' },
  { key: 'delivered', label: 'Delivered', icon: 'package-check' },
];

export const STATUS_LABELS: Record<string, string> = {
  received: 'Received',
  printing: 'Printing',
  quality_check: 'Quality Check',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

// V15: Only 9 file formats accepted
export const ACCEPTED_FILE_TYPES = [
  '.stl', '.obj', '.3mf', '.ply',
  '.step', '.stp',
  '.f3d',
  '.sldprt', '.sldasm',
] as const;

export const ACCEPTED_FILE_TYPES_STRING = ACCEPTED_FILE_TYPES.join(',');

// V15: Max 50MB per file (down from 500MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const FILE_TYPE_CATEGORIES: Record<string, string[]> = {
  'Mesh Files': ['.stl', '.obj', '.3mf', '.ply'],
  'CAD Files': ['.step', '.stp'],
  'Fusion 360': ['.f3d'],
  'SolidWorks': ['.sldprt', '.sldasm'],
};

// File extensions that can be previewed in 3D (Three.js)
export const PREVIEWABLE_EXTENSIONS = ['.stl', '.obj', '.ply', '.3mf'] as const;

// Infill factor mapping for pricing calculations (fixed at 1.0 internally per V15)
export const INFILL_FACTORS: Record<number, number> = {
  10: 0.15,
  20: 0.25,
  30: 0.35,
  50: 0.55,
  75: 0.78,
  100: 1.00,
};

export const QUALITY_OPTIONS = [
  { value: 'draft', label: 'Draft', description: '0.3mm layer height — Fast, visible layers', icon: '⚡' },
  { value: 'standard', label: 'Standard', description: '0.2mm layer height — Good balance', icon: '⚖️' },
  { value: 'fine', label: 'Fine', description: '0.1mm layer height — Smooth, detailed', icon: '✨' },
] as const;
