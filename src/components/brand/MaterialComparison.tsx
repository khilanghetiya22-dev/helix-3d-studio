'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface MaterialProp {
  name: string;
  strength: number; // 1-5
  flexibility: number; // 1-5
  heat: string;
  moisture: string;
  cost: number;
  bestFor: string;
  description: string;
}

const MATERIALS: MaterialProp[] = [
  {
    name: 'PLA',
    strength: 3,
    flexibility: 1,
    heat: 'Low (60°C)',
    moisture: 'Low',
    cost: 3,
    bestFor: 'Prototypes & display',
    description: 'Easy to print with excellent detail and low warpage. The best choice for visual prototypes, concept models, and display pieces. Derived from organic sources (cornstarch), biodegradable under industrial conditions.',
  },
  {
    name: 'ABS',
    strength: 4,
    flexibility: 2,
    heat: 'Med (90°C)',
    moisture: 'Medium',
    cost: 4,
    bestFor: 'Functional parts',
    description: 'Tough, impact-resistant structural plastic. Excellent for automotive parts, protective enclosures, and functional assemblies that undergo impact or require moderate heat resistance.',
  },
  {
    name: 'PETG',
    strength: 4,
    flexibility: 2,
    heat: 'Med (80°C)',
    moisture: 'High',
    cost: 4,
    bestFor: 'Watertight containers',
    description: 'Combines the printability of PLA with the durability of ABS. Highly chemical and moisture resistant. Ideal for outdoor housings, food-safe containers, and snap-fit joints.',
  },
  {
    name: 'TPU',
    strength: 2,
    flexibility: 5,
    heat: 'Low (60°C)',
    moisture: 'Medium',
    cost: 6,
    bestFor: 'Flexible grips & seals',
    description: 'Rubber-like flexibility and elasticity. Extremely high impact resistance and wear durability. Perfect for shock absorbers, custom gaskets, wheels, phone cases, and ergonomic grips.',
  },
  {
    name: 'Nylon',
    strength: 5,
    flexibility: 3,
    heat: 'High (120°C)',
    moisture: 'Low',
    cost: 7,
    bestFor: 'Mechanical components',
    description: 'Exceptional strength, toughness, and abrasion resistance. Very low friction coefficient. The premier choice for gears, bearings, custom tools, and high-stress industrial applications.',
  },
];

type UseCase = 'prototype' | 'outdoor' | 'food' | 'flexible' | 'structural' | 'general';

interface UseCaseChip {
  key: UseCase;
  label: string;
  recommend: string[]; // Materials to highlight
}

const USE_CASES: UseCaseChip[] = [
  { key: 'prototype', label: 'Prototype', recommend: ['PLA'] },
  { key: 'outdoor', label: 'Outdoor Use', recommend: ['PETG'] },
  { key: 'food', label: 'Food Contact', recommend: ['PETG'] },
  { key: 'flexible', label: 'Flexible', recommend: ['TPU'] },
  { key: 'structural', label: 'Structural', recommend: ['ABS', 'Nylon', 'PETG'] },
  { key: 'general', label: 'General Use', recommend: ['PLA', 'PETG'] },
];

export default function MaterialComparison() {
  const [activeUseCase, setActiveUseCase] = useState<UseCase | null>(null);
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const renderDots = (score: number) => {
    return (
      <div className="flex gap-0.5 justify-center">
        {[1, 2, 3, 4, 5].map((d) => (
          <span
            key={d}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: d <= score ? '#C9A84C' : 'rgba(201,168,76,0.15)',
              border: d <= score ? 'none' : '0.5px solid rgba(201,168,76,0.25)',
            }}
          />
        ))}
      </div>
    );
  };

  const handleChipClick = (key: UseCase) => {
    if (activeUseCase === key) {
      setActiveUseCase(null);
    } else {
      setActiveUseCase(key);
      const recommended = USE_CASES.find((uc) => uc.key === key)?.recommend || [];
      if (recommended.length > 0) {
        setExpandedMaterial(recommended[0]); // Expand first recommendation
      }
    }
  };

  const isHighlighted = (name: string) => {
    if (!activeUseCase) return false;
    const recommended = USE_CASES.find((uc) => uc.key === activeUseCase)?.recommend || [];
    return recommended.includes(name);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 id="materials" className="page-heading text-2xl sm:text-3xl mb-3" style={{ color: '#F5F0E8' }}>
          Interactive Material Comparison
        </h2>
        <div className="gold-rule w-16 mx-auto mb-4" />
        <p className="text-sm max-w-lg mx-auto" style={{ color: '#9CA3AF' }}>
          Select a material to expand its detailed properties, or click your specific use case to see our recommendations highlighted instantly.
        </p>
      </div>

      {/* Use Case Selection Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider flex items-center gap-1.5 mr-2" style={{ color: '#C9A84C' }}>
          <Sparkles className="w-3.5 h-3.5" /> Best for me:
        </span>
        {USE_CASES.map((uc) => (
          <button
            key={uc.key}
            onClick={() => handleChipClick(uc.key)}
            className="text-xs px-3.5 py-1.5 rounded-full font-medium transition-all"
            style={{
              backgroundColor: activeUseCase === uc.key ? '#C9A84C' : 'rgba(201,168,76,0.06)',
              color: activeUseCase === uc.key ? '#0A0A0F' : '#9CA3AF',
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            {uc.label}
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-xl border mb-6" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
        <table className="w-full border-collapse text-sm text-center">
          <thead>
            <tr style={{ backgroundColor: '#0D1B2A', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              <th className="px-4 py-3.5 text-left font-medium uppercase tracking-wider text-xs" style={{ color: '#C9A84C' }}>Property</th>
              {MATERIALS.map((mat) => (
                <th
                  key={mat.name}
                  onClick={() => setExpandedMaterial(expandedMaterial === mat.name ? null : mat.name)}
                  className="px-4 py-3.5 font-medium cursor-pointer transition-colors relative"
                  style={{
                    backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.08)' : 'transparent',
                    borderLeft: '0.5px solid rgba(201,168,76,0.1)',
                  }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-bold tracking-wide hover:underline" style={{ color: isHighlighted(mat.name) ? '#C9A84C' : '#F5F0E8' }}>
                      {mat.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-normal">Click for details</span>
                    {isHighlighted(mat.name) && (
                      <span className="absolute top-0 right-0 text-[8px] uppercase font-mono px-1 rounded-bl bg-[#C9A84C] text-[#0A0A0F]">
                        Rec
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <td className="px-4 py-3 text-left font-medium text-xs text-gray-400">Strength</td>
              {MATERIALS.map((mat) => (
                <td
                  key={mat.name}
                  className="px-4 py-3 transition-colors"
                  style={{ backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.04)' : 'transparent', borderLeft: '0.5px solid rgba(201,168,76,0.05)' }}
                >
                  {renderDots(mat.strength)}
                </td>
              ))}
            </tr>
            <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <td className="px-4 py-3 text-left font-medium text-xs text-gray-400">Flexibility</td>
              {MATERIALS.map((mat) => (
                <td
                  key={mat.name}
                  className="px-4 py-3 transition-colors"
                  style={{ backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.04)' : 'transparent', borderLeft: '0.5px solid rgba(201,168,76,0.05)' }}
                >
                  {renderDots(mat.flexibility)}
                </td>
              ))}
            </tr>
            <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <td className="px-4 py-3 text-left font-medium text-xs text-gray-400">Heat Resistance</td>
              {MATERIALS.map((mat) => (
                <td
                  key={mat.name}
                  className="px-4 py-3 text-xs transition-colors"
                  style={{
                    backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.04)' : 'transparent',
                    borderLeft: '0.5px solid rgba(201,168,76,0.05)',
                    color: '#9CA3AF',
                  }}
                >
                  {mat.heat}
                </td>
              ))}
            </tr>
            <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <td className="px-4 py-3 text-left font-medium text-xs text-gray-400">Moisture Resistance</td>
              {MATERIALS.map((mat) => (
                <td
                  key={mat.name}
                  className="px-4 py-3 text-xs transition-colors"
                  style={{
                    backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.04)' : 'transparent',
                    borderLeft: '0.5px solid rgba(201,168,76,0.05)',
                    color: '#9CA3AF',
                  }}
                >
                  {mat.moisture}
                </td>
              ))}
            </tr>
            <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
              <td className="px-4 py-3 text-left font-medium text-xs text-gray-400">Cost (₹/g)</td>
              {MATERIALS.map((mat) => (
                <td
                  key={mat.name}
                  className="px-4 py-3 text-xs font-mono font-semibold transition-colors"
                  style={{
                    backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.04)' : 'transparent',
                    borderLeft: '0.5px solid rgba(201,168,76,0.05)',
                    color: '#C9A84C',
                  }}
                >
                  ₹{mat.cost}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left font-medium text-xs text-gray-400">Best For</td>
              {MATERIALS.map((mat) => (
                <td
                  key={mat.name}
                  className="px-4 py-3 text-[11px] transition-colors leading-snug"
                  style={{
                    backgroundColor: isHighlighted(mat.name) ? 'rgba(201,168,76,0.04)' : 'transparent',
                    borderLeft: '0.5px solid rgba(201,168,76,0.05)',
                    color: '#9CA3AF',
                  }}
                >
                  {mat.bestFor}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Expanded Material Details Card */}
      {expandedMaterial && (
        <div
          className="rounded-xl p-5 mb-8 animate-fade-in"
          style={{
            backgroundColor: '#0D1B2A',
            border: '1px solid #C9A84C',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          {(() => {
            const mat = MATERIALS.find((m) => m.name === expandedMaterial)!;
            return (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: '#C9A84C' }}>
                      {mat.name} Detailed Specifications
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/40 text-gray-400">FDM Filament</span>
                  </div>
                  <button
                    onClick={() => setExpandedMaterial(null)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Close spec ✕
                  </button>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                  {mat.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded p-2.5 bg-black/40 border border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase">Tensile Strength</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: '#F5F0E8' }}>
                      {mat.strength >= 4 ? 'High' : mat.strength === 3 ? 'Medium' : 'Low'} ({mat.strength}/5)
                    </p>
                  </div>
                  <div className="rounded p-2.5 bg-black/40 border border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase">Flexibility</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: '#F5F0E8' }}>
                      {mat.flexibility >= 4 ? 'Elastic' : mat.flexibility >= 2 ? 'Semi-rigid' : 'Rigid'} ({mat.flexibility}/5)
                    </p>
                  </div>
                  <div className="rounded p-2.5 bg-black/40 border border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase">Max Heat Tolerance</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: '#F5F0E8' }}>
                      {mat.heat}
                    </p>
                  </div>
                  <div className="rounded p-2.5 bg-black/40 border border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase">Flat Rate Price</p>
                    <p className="text-xs font-semibold mt-0.5 font-mono" style={{ color: '#C9A84C' }}>
                      ₹{mat.cost} per gram
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
