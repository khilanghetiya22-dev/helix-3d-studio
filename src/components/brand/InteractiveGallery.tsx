'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GalleryItem {
  material: 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'Nylon';
  label: string;
  color: string;
  imgUrl: string;
}

const ITEMS: GalleryItem[] = [
  {
    material: 'PLA',
    label: 'Mechanical Mounting Bracket',
    color: 'White',
    imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    material: 'ABS',
    label: 'Sensor Enclosure Shell',
    color: 'Black',
    imgUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=600&q=80',
  },
  {
    material: 'PETG',
    label: 'Outdoor Snap-Fit Clip',
    color: 'White',
    imgUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    material: 'TPU',
    label: 'Flexible Vibration Damper Gasket',
    color: 'Black',
    imgUrl: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=600&q=80',
  },
  {
    material: 'Nylon',
    label: 'High-Torque Spur Gear Assembly',
    color: 'White',
    imgUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    material: 'PLA',
    label: 'Assembly Alignment Custom Jig',
    color: 'Black',
    imgUrl: 'https://images.unsplash.com/photo-1627389955805-b0493dc4de25?auto=format&fit=crop&w=600&q=80',
  },
];

const FILTERS: ('ALL' | 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'Nylon')[] = ['ALL', 'PLA', 'ABS', 'PETG', 'TPU', 'Nylon'];

export default function InteractiveGallery() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'Nylon'>('ALL');

  const filteredItems = activeFilter === 'ALL'
    ? ITEMS
    : ITEMS.filter(item => item.material === activeFilter);

  return (
    <div className="w-full">
      {/* Filter Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="text-xs px-4 py-2 rounded-full font-medium transition-all"
            style={{
              backgroundColor: activeFilter === f ? '#C9A84C' : 'rgba(201,168,76,0.06)',
              color: activeFilter === f ? '#0A0A0F' : '#9CA3AF',
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            {f === 'ALL' ? 'Show All' : f}
          </button>
        ))}
      </div>

      {/* Grid of prints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, i) => (
          <div
            key={i}
            className="group rounded-xl overflow-hidden card-hover flex flex-col"
            style={{
              backgroundColor: '#0D1B2A',
              border: '1px solid rgba(201,168,76,0.12)',
            }}
          >
            {/* Visual Container */}
            <div className="relative h-56 w-full overflow-hidden bg-black/40">
              <img
                src={item.imgUrl}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/80 via-transparent to-transparent opacity-60" />
              
              {/* Tags */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span
                  className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold"
                  style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
                >
                  {item.material}
                </span>
                <span
                  className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold"
                  style={{ backgroundColor: 'rgba(10,10,15,0.85)', color: '#F5F0E8', border: '0.5px solid rgba(201,168,76,0.25)' }}
                >
                  {item.color}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h4
                  className="text-sm font-medium leading-snug tracking-wide"
                  style={{ color: '#F5F0E8', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  {item.label}
                </h4>
                <p className="text-[11px] mt-1.5" style={{ color: '#6B6B6B' }}>
                  FDM Technology · 0.2mm tolerance layer specs
                </p>
              </div>
              
              <div className="mt-4 pt-3 flex justify-between items-center" style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)' }}>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Helix 3D Print Studio</span>
                <span className="text-[10px] font-medium" style={{ color: '#C9A84C' }}>Real Print Photo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
