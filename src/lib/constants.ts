// Constants for FORMIQ 3D Print Studio

import { StepperStep } from './types';

export const MATERIALS = [
  { value: 'pla', label: 'PLA', description: 'Most popular, easy to print' },
  { value: 'abs', label: 'ABS', description: 'Strong, heat resistant' },
  { value: 'petg', label: 'PETG', description: 'Durable, flexible' },
  { value: 'resin', label: 'Resin', description: 'High detail, smooth finish' },
  { value: 'nylon', label: 'Nylon', description: 'Strong, flexible, durable' },
  { value: 'tpu', label: 'TPU', description: 'Flexible, rubber-like' },
  { value: 'carbon-fiber', label: 'Carbon Fiber', description: 'Extremely strong, lightweight' },
  { value: 'wood-fill', label: 'Wood Fill', description: 'Wood-like appearance' },
  { value: 'metal-fill', label: 'Metal Fill', description: 'Metallic finish' },
] as const;

export const COLORS = [
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'black', label: 'Black', hex: '#1A1A1A' },
  { value: 'gray', label: 'Gray', hex: '#6B7280' },
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6' },
  { value: 'green', label: 'Green', hex: '#10B981' },
  { value: 'yellow', label: 'Yellow', hex: '#F59E0B' },
  { value: 'orange', label: 'Orange', hex: '#F97316' },
  { value: 'purple', label: 'Purple', hex: '#8B5CF6' },
  { value: 'pink', label: 'Pink', hex: '#EC4899' },
  { value: 'transparent', label: 'Transparent', hex: 'transparent' },
  { value: 'custom', label: 'Custom Color', hex: '#94A3B8' },
] as const;

export const INFILL_OPTIONS = [
  { value: 10, label: '10%', description: 'Very light, decorative only' },
  { value: 20, label: '20%', description: 'Light, standard for most prints' },
  { value: 30, label: '30%', description: 'Medium strength' },
  { value: 50, label: '50%', description: 'Strong, functional parts' },
  { value: 75, label: '75%', description: 'Very strong' },
  { value: 100, label: '100%', description: 'Solid, maximum strength' },
] as const;

export const QUALITY_OPTIONS = [
  { value: 'draft', label: 'Draft', description: '0.3mm layer height — Fast, visible layers', icon: '⚡' },
  { value: 'standard', label: 'Standard', description: '0.2mm layer height — Good balance', icon: '⚖️' },
  { value: 'fine', label: 'Fine', description: '0.1mm layer height — Smooth, detailed', icon: '✨' },
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

export const ACCEPTED_FILE_TYPES = [
  '.stl', '.3mf', '.obj', '.ply', '.amf',
  '.step', '.stp', '.iges', '.igs',
  '.f3d', '.f3z',
  '.sldprt', '.sldasm',
  '.catpart', '.catproduct',
  '.x_t', '.x_b',
  '.dxf', '.dwg',
  '.gcode',
  '.zip', '.rar',
] as const;

export const ACCEPTED_FILE_TYPES_STRING = ACCEPTED_FILE_TYPES.join(',');

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export const FILE_TYPE_CATEGORIES: Record<string, string[]> = {
  'Mesh Files': ['.stl', '.3mf', '.obj', '.ply', '.amf'],
  'CAD Files': ['.step', '.stp', '.iges', '.igs'],
  'Fusion 360': ['.f3d', '.f3z'],
  'SolidWorks': ['.sldprt', '.sldasm'],
  'CATIA': ['.catpart', '.catproduct'],
  'Parasolid': ['.x_t', '.x_b'],
  'Drawing': ['.dxf', '.dwg'],
  'G-Code': ['.gcode'],
  'Archive': ['.zip', '.rar'],
};

// File extensions that can be previewed in 3D (Three.js)
export const PREVIEWABLE_EXTENSIONS = ['.stl', '.obj', '.ply', '.3mf'] as const;

// Infill factor mapping for pricing calculations
export const INFILL_FACTORS: Record<number, number> = {
  10: 0.15,
  20: 0.25,
  30: 0.35,
  50: 0.55,
  75: 0.78,
  100: 1.00,
};

