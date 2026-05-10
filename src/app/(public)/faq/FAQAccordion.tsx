'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: '#1B2A4A',
        border: `1px solid ${open ? 'rgba(201,146,10,0.4)' : 'rgba(201,146,10,0.12)'}`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="text-sm font-medium" style={{ color: '#F5F4F0', letterSpacing: '0.02em' }}>
          {q}
        </span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
          style={{ color: '#C9920A', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 animate-slide-down">
          <div className="gold-rule mb-4" />
          <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}
