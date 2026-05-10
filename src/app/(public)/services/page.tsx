import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Droplets, Zap, Layers, Box, Printer } from 'lucide-react';

export const metadata = {
  title: 'Services — FORMIQ 3D Print Studio',
  description: 'Explore FORMIQ\'s full-spectrum 3D printing services: FDM, SLA, DLP, SLS, DMLS, PolyJet and Binder Jetting — across 19+ materials.',
};

const technologies = [
  {
    slug: 'FDM',
    name: 'Fused Deposition Modeling',
    icon: <Printer className="w-6 h-6" />,
    badge: 'Most Popular',
    desc: 'Melts and extrudes thermoplastic filament layer by layer. The workhorse of 3D printing — fast, affordable, and incredibly versatile.',
    bestFor: 'Prototypes, jigs, fixtures, concept models, consumer products',
    materials: ['PLA', 'ABS', 'PETG', 'TPU', 'Nylon', 'Carbon Fiber Fill'],
    specs: ['Layer resolution: 0.1–0.3 mm', 'Build volume: up to 300×300×400 mm', 'Accuracy: ±0.2 mm'],
  },
  {
    slug: 'SLA',
    name: 'Stereolithography',
    icon: <Droplets className="w-6 h-6" />,
    badge: 'High Detail',
    desc: 'A UV laser cures liquid resin layer by layer to produce ultra-smooth, highly detailed parts with exceptional surface finish.',
    bestFor: 'Jewellery, dental models, miniatures, master patterns for casting',
    materials: ['Standard Resin', 'Tough Resin', 'Flexible Resin'],
    specs: ['Layer resolution: 0.025–0.1 mm', 'Build volume: up to 145×145×175 mm', 'Accuracy: ±0.05 mm'],
  },
  {
    slug: 'DLP',
    name: 'Digital Light Processing',
    icon: <Zap className="w-6 h-6" />,
    badge: 'Fast Resin',
    desc: 'Projects an entire UV image at once to cure resin, making it faster than SLA while maintaining excellent surface quality.',
    bestFor: 'Dental & ortho models, earbuds, intricate art pieces',
    materials: ['ABS-like Resin', 'Castable Resin'],
    specs: ['Layer resolution: 0.025–0.05 mm', 'Build volume: up to 120×67×150 mm', 'Accuracy: ±0.05 mm'],
  },
  {
    slug: 'SLS',
    name: 'Selective Laser Sintering',
    icon: <Layers className="w-6 h-6" />,
    badge: 'No Supports',
    desc: 'A laser sinters powdered nylon into strong, complex parts. No support structures needed — ideal for interlocked and organic geometries.',
    bestFor: 'End-use parts, complex assemblies, aerospace & automotive components',
    materials: ['Nylon PA12', 'Glass-filled Nylon'],
    specs: ['Layer resolution: 0.1 mm', 'Build volume: up to 340×340×600 mm', 'Accuracy: ±0.3 mm'],
  },
  {
    slug: 'DMLS',
    name: 'Direct Metal Laser Sintering',
    icon: <Cpu className="w-6 h-6" />,
    badge: 'Metal Parts',
    desc: 'Fuses metal powder using a high-power laser to create fully dense metal parts that can be machined, welded, and heat-treated.',
    bestFor: 'Aerospace, medical implants, tooling, heat exchangers',
    materials: ['Stainless Steel', 'Titanium', 'Aluminium'],
    specs: ['Layer resolution: 0.02–0.05 mm', 'Build volume: up to 250×250×325 mm', 'Accuracy: ±0.1 mm'],
  },
  {
    slug: 'PolyJet',
    name: 'PolyJet / Multi-Material Jetting',
    icon: <Box className="w-6 h-6" />,
    badge: 'Multi-Material',
    desc: 'Jets and UV-cures photopolymer droplets to create ultra-smooth, full-colour multi-material parts in a single build.',
    bestFor: 'Realistic prototypes, over-moulded parts, medical anatomical models',
    materials: ['Rigid', 'Flexible', 'Multi-material'],
    specs: ['Layer resolution: 0.016 mm', 'Build volume: up to 490×390×200 mm', 'Accuracy: ±0.1 mm'],
  },
];

export default function ServicesPage() {
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9920A', letterSpacing: '0.2em' }}>
            7 Technologies · 19+ Materials
          </p>
          <h1 className="page-heading text-4xl sm:text-5xl mb-6" style={{ color: '#F5F4F0' }}>
            Our <span style={{ color: '#C9920A' }}>Services</span>
          </h1>
          <div className="gold-rule w-16 mx-auto mb-8" />
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
            Professional 3D printing across the full technology spectrum. From rapid FDM prototypes to
            precision metal DMLS parts — we have the right process for your project.
          </p>
        </div>
      </section>

      {/* Technology cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {technologies.map((tech, i) => (
            <div
              key={tech.slug}
              className="rounded-xl p-8 card-hover group animate-fade-in"
              style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.12)', animationDelay: `${i * 0.07}s` }}
            >
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left: title + desc */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ border: '1px solid #C9920A', color: '#C9920A' }}>
                      {tech.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-light" style={{ color: '#F5F4F0', letterSpacing: '0.04em' }}>
                          {tech.slug}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(201,146,10,0.15)', color: '#C9920A', border: '1px solid rgba(201,146,10,0.3)' }}>
                          {tech.badge}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-wider" style={{ color: '#6B6B6B' }}>{tech.name}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>{tech.desc}</p>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C9920A' }}>Best For</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{tech.bestFor}</p>
                  </div>
                </div>

                {/* Right: materials + specs */}
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C9920A' }}>Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.materials.map((m) => (
                        <span key={m} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(27,42,74,0.8)', color: '#9CA3AF', border: '1px solid rgba(201,146,10,0.1)' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C9920A' }}>Specs</p>
                    <ul className="space-y-1">
                      {tech.specs.map((s) => (
                        <li key={s} className="text-xs" style={{ color: '#6B6B6B' }}>· {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* File formats */}
      <section className="py-16" style={{ backgroundColor: 'rgba(27,42,74,0.15)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F4F0' }}>Accepted File Formats</h2>
          <div className="gold-rule w-16 mx-auto mb-8" />
          <div className="flex flex-wrap gap-3 justify-center">
            {['STL', 'OBJ', 'STEP', 'STP', '3MF', 'AMF', 'IGES', 'IGS', 'F3D', 'SLDPRT', 'X_T', 'BREP', 'DAE', 'PLY', 'WRL', 'DXF'].map((f) => (
              <span key={f} className="text-sm px-4 py-2 rounded-lg font-mono" style={{ backgroundColor: '#1B2A4A', color: '#C9920A', border: '1px solid rgba(201,146,10,0.2)' }}>
                .{f.toLowerCase()}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm" style={{ color: '#6B6B6B' }}>
            Maximum upload size: 500 MB per file · Multiple files per order supported
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="rounded-xl p-10" style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.2)' }}>
            <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F4F0' }}>Start Your First Order</h2>
            <p className="mb-8" style={{ color: '#9CA3AF' }}>
              Upload your design, get instant pricing, and place your order in minutes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9920A', color: '#1A1A1A', letterSpacing: '0.04em' }}
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
