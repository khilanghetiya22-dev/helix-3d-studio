'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import { getActiveTechnologies } from '@/app/actions/technologies';
import type { Technology } from '@/lib/types';

export default function TechnologySelectionPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    getActiveTechnologies().then((data) => {
      setTechnologies(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C', letterSpacing: '0.15em' }}>
          Step 1 of 2
        </p>
        <h1 className="page-heading text-3xl" style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}>SELECT TECHNOLOGY</h1>
        <div className="gold-rule w-12 mx-auto mt-3 mb-3" />
        <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color: '#6B6B6B' }}>
          Choose the printing method for your project
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 rounded-xl animate-pulse" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.1)' }} />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, i) => (
            <Link key={tech.id} href={`/orders/new/${tech.slug}`}>
              <div
                className="group relative rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 animate-slide-up cursor-pointer"
                style={{
                  backgroundColor: '#0D1B2A',
                  border: hoveredId === tech.id ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.12)',
                }}
                onMouseEnter={() => setHoveredId(tech.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Selected gold stripe */}
                {hoveredId === tech.id && (
                  <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full animate-scale-in" style={{ backgroundColor: '#C9A84C' }} />
                )}

                {/* Icon */}
                <div className="text-2xl mb-3">{tech.icon || '🖨️'}</div>

                {/* Name */}
                <h2 className="text-lg font-light mb-0.5" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>{tech.name}</h2>
                <p className="text-[11px] mb-3" style={{ color: '#6B6B6B' }}>{tech.full_name}</p>

                {/* Description */}
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
                  {tech.description}
                </p>

                {/* Best for tags */}
                {tech.best_for && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tech.best_for.split(',').map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px]" style={{ backgroundColor: 'rgba(26,26,26,0.5)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.15)' }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#6B6B6B' }}>
                    {tech.use_infill && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(26,26,26,0.4)' }}>Infill</span>}
                    {tech.use_color && <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(26,26,26,0.4)' }}>Color</span>}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#C9A84C' }}>
                    Select <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Hover tooltip */}
                {hoveredId === tech.id && (
                  <div className="absolute -top-2 right-3 z-10 animate-scale-in">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg shadow-lg text-[10px]" style={{ backgroundColor: '#243553', border: '1px solid rgba(201,168,76,0.2)', color: '#9CA3AF' }}>
                      <Info className="w-3 h-3" /> Click to start order
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Comparison hint */}
      <div className="text-center mt-8">
        <p className="text-xs" style={{ color: '#6B6B6B' }}>
          Not sure which to choose? FDM is great for most projects. SLA/DLP for high detail. DMLS for metal parts.
        </p>
      </div>
    </div>
  );
}
