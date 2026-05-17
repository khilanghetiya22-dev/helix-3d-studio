import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Layers, Zap, Target, Award, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us — HELIX 3D Studio',
  description: 'Learn about HELIX — India\'s premium 3D printing studio offering FDM, SLA, SLS, DMLS and more from Ahmedabad.',
};

const values = [
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Precision First',
    desc: 'Every micron matters. We calibrate our machines daily and run quality checks on every single print before it leaves our studio.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Rapid Turnaround',
    desc: 'From file upload to dispatch — most orders are ready within 3–5 business days. Express and overnight options available.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Pan-India Delivery',
    desc: 'Zone-based shipping covering all 28 states and 8 UTs. Free local delivery for customers in Ahmedabad.',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Studio-Grade Quality',
    desc: 'Industrial-grade printers. Professional post-processing. Every part is inspected against your spec before shipment.',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: '7 Technologies',
    desc: 'FDM, SLA, DLP, SLS, DMLS, PolyJet, Binder Jetting — we pick the right process for your geometry and material requirements.',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Smart Platform',
    desc: 'Real-time pricing, live 3D preview, order tracking, and transparent 5-component cost breakdowns — all in one dashboard.',
  },
];

const team = [
  { name: 'Khiladi H.', role: 'Founder & Lead Engineer', initials: 'KH' },
  { name: 'Print Team', role: 'Machine Operators', initials: 'PT' },
  { name: 'QA Studio', role: 'Quality & Finishing', initials: 'QA' },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#0A0A0F' }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>
            Established · MMXXV
          </p>
          <h1 className="page-heading text-4xl sm:text-5xl mb-6" style={{ color: '#F5F0E8' }}>
            About <span style={{ color: '#C9A84C' }}>HELIX</span>
          </h1>
          <div className="gold-rule w-16 mx-auto mb-8" />
          <p className="tagline text-xl mb-6" style={{ color: '#C9A84C' }}>
            &ldquo;Where ideas take shape.&rdquo;
          </p>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
            HELIX is a premium 3D printing studio based in Ahmedabad, Gujarat. We combine industrial-grade
            additive manufacturing technology with a seamless digital platform — making professional 3D printing
            accessible to designers, engineers, startups, and makers across India.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-24" style={{ backgroundColor: 'rgba(27,42,74,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="page-heading text-3xl mb-4" style={{ color: '#F5F0E8' }}>Our Story</h2>
              <div className="gold-rule w-12 mb-6" />
              <div className="space-y-4 text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
                <p>
                  HELIX was born from a single frustration: getting high-quality 3D prints in India meant weeks
                  of back-and-forth emails, opaque pricing, and inconsistent results.
                </p>
                <p>
                  We built the platform we always wished existed — one where you upload your design, instantly
                  see a breakdown of exactly what you&apos;re paying for and why, track your order in real-time,
                  and receive a part that matches your expectations.
                </p>
                <p>
                  Today, HELIX serves engineers, product designers, architects, educators, and hobbyists across
                  India with 7 different printing technologies and 19+ materials.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '7', label: 'Technologies' },
                { value: '19+', label: 'Materials' },
                { value: '28', label: 'States Served' },
                { value: '100%', label: 'Quality Checked' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-6 text-center card-hover" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <p className="text-3xl font-light mb-1" style={{ color: '#C9A84C' }}>{s.value}</p>
                  <p className="text-xs uppercase tracking-wider" style={{ color: '#6B6B6B' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="page-heading text-3xl sm:text-4xl mb-4" style={{ color: '#F5F0E8' }}>What We Stand For</h2>
            <div className="gold-rule w-16 mx-auto mb-3" />
            <p style={{ color: '#6B6B6B' }}>The principles behind every print we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl p-6 card-hover group" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>
                  {v.icon}
                </div>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-24" style={{ backgroundColor: 'rgba(27,42,74,0.15)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="page-heading text-3xl sm:text-4xl mb-4" style={{ color: '#F5F0E8' }}>The Team</h2>
          <div className="gold-rule w-16 mx-auto mb-3" />
          <p className="mb-12" style={{ color: '#6B6B6B' }}>Small team. Big output. Relentless quality.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((t) => (
              <div key={t.name} className="rounded-xl p-8 card-hover" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-light" style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
                  {t.initials}
                </div>
                <p className="font-medium" style={{ color: '#F5F0E8' }}>{t.name}</p>
                <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="rounded-xl p-10" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}>
            <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F0E8' }}>Ready to Print?</h2>
            <p className="mb-8" style={{ color: '#9CA3AF' }}>
              Join engineers and designers across India who trust HELIX for their 3D printing needs.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
