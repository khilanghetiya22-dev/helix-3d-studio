import React from 'react';
import Link from 'next/link';
import { ArrowRight, Printer } from 'lucide-react';

export const metadata = {
  title: 'Services — HELIX 3D Studio',
  description: 'Explore HELIX\'s professional FDM 3D printing service — across PLA, ABS, PETG, TPU and Nylon. Ships pan-India in 2–4 days.',
};

const technologies = [
  {
    slug: 'fdm',
    shortName: 'FDM',
    name: 'Fused Deposition Modeling',
    icon: <Printer className="w-6 h-6" />,
    badge: 'Most Popular',
    desc: 'Melts and extrudes thermoplastic filament layer by layer. The workhorse of 3D printing — fast, affordable, and incredibly versatile. Ideal for functional prototypes, custom jigs, and consumer products.',
    bestFor: 'Prototypes, jigs, fixtures, concept models, consumer products',
    materials: ['PLA', 'ABS', 'PETG', 'TPU', 'Nylon'],
    specs: ['Layer resolution: 0.1–0.3 mm', 'Build volume: up to 300×300×400 mm', 'Accuracy: ±0.2 mm'],
    turnaround: '2–4 business days',
    startingFrom: 49,
  },
];


export default function ServicesPage() {
  return (
    <div style={{ backgroundColor: '#0A0A0F' }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>
            1 Technology · 5+ Materials
          </p>
          <h1 className="page-heading text-4xl sm:text-5xl mb-6" style={{ color: '#F5F0E8' }}>
            Our <span style={{ color: '#C9A84C' }}>Services</span>
          </h1>
          <div className="gold-rule w-16 mx-auto mb-8" />
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
            Professional FDM 3D printing for rapid prototypes, functional parts, and consumer products — delivered pan-India in 2–4 business days.
          </p>
        </div>
      </section>

      {/* Turnaround summary strip */}
      <section className="py-6 border-t border-b" style={{ borderColor: 'rgba(201,168,76,0.15)', backgroundColor: 'rgba(27,42,74,0.2)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-wrap gap-6 justify-center">
            {technologies.map((t) => (
              <div key={t.slug} className="flex items-center gap-2 text-sm">
                <span style={{ color: '#C9A84C', fontWeight: 500 }}>{t.shortName}</span>
                <span style={{ color: '#6B6B6B' }}>·</span>
                <span style={{ color: '#9CA3AF' }}>{t.turnaround}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {technologies.map((tech, i) => (
            <div
              key={tech.slug}
              id={tech.slug}
              className="rounded-xl p-8 card-hover group animate-fade-in scroll-mt-20"
              style={{
                backgroundColor: '#0D1B2A',
                border: '1px solid rgba(201,168,76,0.12)',
                animationDelay: `${i * 0.07}s`,
              }}
            >
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left: title + desc */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
                    >
                      {tech.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-light" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
                          {tech.shortName}
                        </h2>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(201,168,76,0.15)',
                            color: '#C9A84C',
                            border: '1px solid rgba(201,168,76,0.3)',
                          }}
                        >
                          {tech.badge}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-wider" style={{ color: '#6B6B6B' }}>{tech.name}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>{tech.desc}</p>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>Best For</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{tech.bestFor}</p>
                  </div>

                  {/* Starting price + turnaround */}
                  <div className="flex items-center gap-6 mt-5 pt-4" style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)' }}>
                    <div>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>Starting from</p>
                      <p className="text-base font-medium mt-0.5" style={{ color: '#C9A84C' }}>₹{tech.startingFrom}</p>
                    </div>
                    <div style={{ width: '0.5px', height: '32px', backgroundColor: 'rgba(201,168,76,0.2)' }} />
                    <div>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>Typical turnaround</p>
                      <p className="text-sm font-medium mt-0.5" style={{ color: '#F5F0E8' }}>{tech.turnaround}</p>
                    </div>
                  </div>
                </div>

                {/* Right: materials + specs */}
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.materials.map((m) => (
                        <span
                          key={m}
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: 'rgba(27,42,74,0.8)', color: '#9CA3AF', border: '1px solid rgba(201,168,76,0.1)' }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>Specs</p>
                    <ul className="space-y-1">
                      {tech.specs.map((s) => (
                        <li key={s} className="text-xs" style={{ color: '#6B6B6B' }}>· {s}</li>
                      ))}
                    </ul>
                  </div>
              <Link
                key={tech.slug}
                href={`/orders/new/${tech.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-all"
                style={{ color: '#C9A84C' }}
              >
                Order {tech.shortName} Print <ArrowRight className="w-3.5 h-3.5" />
              </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Turnaround Times Table */}
      <section className="py-16" style={{ backgroundColor: 'rgba(27,42,74,0.12)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="page-heading text-2xl sm:text-3xl mb-4 text-center" style={{ color: '#F5F0E8' }}>
            Turnaround Times
          </h2>
          <div className="gold-rule w-12 mx-auto mb-8" />
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(201,168,76,0.15)' }}
          >
            {technologies.map((tech, i) => (
              <div
                key={tech.slug}
                className="flex items-center justify-between px-6 py-4"
                style={{
                  backgroundColor: i % 2 === 0 ? '#0D1B2A' : 'rgba(27,42,74,0.6)',
                  borderBottom: i < technologies.length - 1 ? '0.5px solid rgba(201,168,76,0.1)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: '#C9A84C', minWidth: '80px' }}>
                    {tech.shortName}
                  </span>
                  <span className="text-xs hidden sm:block" style={{ color: '#6B6B6B' }}>
                    {tech.name}
                  </span>
                </div>
                <span className="text-sm" style={{ color: '#9CA3AF' }}>{tech.turnaround}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-4" style={{ color: '#6B6B6B' }}>
            Times are estimates and may vary based on order complexity and current queue.
          </p>
        </div>
      </section>

      {/* File formats */}
      <section className="py-16" style={{ backgroundColor: 'rgba(27,42,74,0.15)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F0E8' }}>Accepted File Formats</h2>
          <div className="gold-rule w-16 mx-auto mb-8" />
          <div className="flex flex-wrap gap-3 justify-center">
            {['STL', 'OBJ', '3MF', 'PLY', 'STEP', 'STP', 'F3D', 'SLDPRT', 'SLDASM'].map((f) => (
              <span
                key={f}
                className="text-sm px-4 py-2 rounded-lg font-mono"
                style={{ backgroundColor: '#0D1B2A', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                .{f.toLowerCase()}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm" style={{ color: '#6B6B6B' }}>
            Maximum upload size: 50 MB per file · Multiple files per order supported
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div
            className="rounded-xl p-10"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F0E8' }}>Start Your First Order</h2>
            <p className="mb-8" style={{ color: '#9CA3AF' }}>
              Upload your design, get instant pricing, and place your order in minutes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
