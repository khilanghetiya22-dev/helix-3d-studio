import React from 'react';
import Link from 'next/link';
import { ArrowRight, Upload, Layers, Truck, CheckCircle, Clock, Shield, Star, MessageCircle } from 'lucide-react';
import HelixIcon from '@/components/brand/HelixIcon';
import HelixWordmark from '@/components/brand/HelixWordmark';
import PublicNavClient from '@/components/brand/PublicNavClient';
import WelcomeOverlay from '@/components/WelcomeOverlay';
import Footer from '@/components/brand/Footer';
import { createClient } from '@/lib/supabase/server';
import TestimonialCard from '@/components/TestimonialCard';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: 'HELIX — 3D Print Studio',
  description: 'Where ideas take shape. Professional FDM 3D printing services. Ships pan-India in 3–7 days.',
};

const TECH_STRIP = [
  { slug: 'fdm', name: 'FDM', icon: '🖨️', desc: 'Functional prototypes', from: 49 },
];

const SAMPLE_GALLERY = [
  {
    tech: 'FDM',
    material: 'PLA',
    label: 'Mechanical Bracket',
    bg: 'linear-gradient(135deg, #0D1B2A 0%, #0f1a2e 100%)',
    icon: '⚙️',
    accent: '#C9A84C',
  },
  {
    tech: 'FDM',
    material: 'ABS',
    label: 'Enclosure Shell',
    bg: 'linear-gradient(135deg, #0D1B2A 0%, #1a1a3e 100%)',
    icon: '📦',
    accent: '#C9A84C',
  },
  {
    tech: 'FDM',
    material: 'PETG',
    label: 'Functional Clip',
    bg: 'linear-gradient(135deg, #0D1B2A 0%, #0d2010 100%)',
    icon: '🔩',
    accent: '#C9A84C',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'HELIX delivered my prototype bracket within 3 days — the FDM quality was flawless, pricing was transparent, and the tracking updates were real-time. Will not use anyone else.',
    name: 'Arjun Mehta',
    city: 'Pune, Maharashtra',
    rating: 5,
    technology: 'FDM',
  },
  {
    quote:
      'I needed precise dental models in SLA resin with < 0.1mm tolerance. HELIX nailed every single piece. The 3D preview feature let me verify my design before committing.',
    name: 'Dr. Priya Nair',
    city: 'Kochi, Kerala',
    rating: 5,
    technology: 'SLA',
  },
  {
    quote:
      'Ordered a stainless steel DMLS part for our aerospace prototype. Turnaround was 10 days including post-processing. The surface finish was exceptional. Highly recommend HELIX.',
    name: 'Vikram Singh',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    technology: 'DMLS',
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0F' }}>
      <WelcomeOverlay />
      <PublicNavClient user={profile} />

      {/* ── HERO ── */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">


            <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ color: '#F5F0E8' }}>
              Precision 3D Printing,{' '}
              <span style={{ color: '#C9A84C' }}>Delivered</span>
            </h1>

            <p className="tagline mt-6 text-lg sm:text-xl max-w-xl mx-auto" style={{ color: '#C9A84C' }}>
              &ldquo;Where ideas take shape.&rdquo;
            </p>

            <p className="mt-4 text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#9CA3AF' }}>
              Upload your CAD files, choose from 5+ materials, and get professional-quality FDM prints delivered across India.
            </p>

            {/* CTAs — V11 spec: "Place an Order" (gold filled) + "View Services" (outlined) */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
                style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
              >
                Place an Order <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all"
                style={{ border: '1px solid rgba(201,168,76,0.4)', color: '#F5F0E8' }}
              >
                View Services
              </Link>
            </div>

            {/* Hero Stats — V11: Ships in 3–7 Days instead of 500MB Max Upload */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { value: '1', label: 'Technology' },
                { value: '5+', label: 'Materials' },
                { value: '2–4', label: 'Ships in Days' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 card-hover"
                  style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  <p className="text-2xl font-light" style={{ color: '#C9A84C' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
      </section>

      {/* ── TECHNOLOGY STRIP ── */}
      <section className="py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="page-heading text-2xl sm:text-3xl" style={{ color: '#F5F0E8' }}>
              FDM Printing Technology
            </h2>
            <div className="gold-rule w-12 mx-auto mt-3 mb-3" />
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Fast, affordable, and versatile — FDM for every project
            </p>
          </div>
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TECH_STRIP.map((tech) => (
              <Link
                key={tech.slug}
                href={`/services#${tech.slug}`}
                className="group flex-shrink-0"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="rounded-xl p-5 transition-all duration-300 card-hover"
                  style={{
                    backgroundColor: '#0D1B2A',
                    border: '1px solid rgba(201,168,76,0.12)',
                    width: '160px',
                  }}
                >
                  <div className="text-2xl mb-3">{tech.icon}</div>
                  <h3
                    className="text-sm font-medium mb-1"
                    style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}
                  >
                    {tech.name}
                  </h3>
                  <p className="text-[11px] mb-3" style={{ color: '#6B6B6B' }}>{tech.desc}</p>
                  <p className="text-[11px]" style={{ color: '#C9A84C' }}>from ₹{tech.from}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — 4 steps ── */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>How It Works</h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3" style={{ color: '#6B6B6B' }}>
              Four simple steps from design to delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: <Upload className="w-6 h-6" />,
                title: 'Upload',
                desc: 'Drag & drop your CAD files — STL, OBJ, STEP, Fusion 360, SolidWorks, and 15+ more formats.',
              },
              {
                step: '02',
                icon: <Layers className="w-6 h-6" />,
                title: 'Configure',
                desc: 'Select your printing technology, material, quality, and quantity. Options adapt to your technology.',
              },
              {
                step: '03',
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Preview & Price',
                desc: 'See a live 3D preview of your model and get instant itemised pricing — before you commit.',
              },
              {
                step: '04',
                icon: <Truck className="w-6 h-6" />,
                title: 'Print & Deliver',
                desc: 'We print, quality-check, and deliver. Track every stage in real time from your dashboard.',
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <div
                  className="rounded-xl p-7 card-hover h-full"
                  style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-xs font-mono mb-2" style={{ color: '#6B6B6B', letterSpacing: '0.1em' }}>
                    STEP {item.step}
                  </div>
                  <h3 className="text-base font-light mb-2" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE PRINTS GALLERY ── */}
      <section className="py-20 sm:py-28 relative" style={{ backgroundColor: 'rgba(27,42,74,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>
              Sample Prints
            </h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3 max-w-lg mx-auto" style={{ color: '#6B6B6B' }}>
              From rapid prototypes to production-grade metal parts — see what HELIX can create.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {SAMPLE_GALLERY.map((item, i) => (
              <div
                key={i}
                className="group rounded-xl overflow-hidden card-hover"
                style={{ border: '1px solid rgba(201,168,76,0.12)' }}
              >
                {/* Visual placeholder — premium look */}
                <div
                  className="relative h-44 sm:h-52 flex items-center justify-center"
                  style={{ background: item.bg }}
                >
                  {/* Grid pattern inside */}
                  <div className="grid-pattern absolute inset-0 opacity-20" />
                  <div
                    className="relative z-10 flex flex-col items-center gap-2"
                    style={{
                      border: '1px solid rgba(201,168,76,0.25)',
                      borderRadius: '12px',
                      padding: '20px 28px',
                      backgroundColor: 'rgba(26,26,26,0.5)',
                    }}
                  >
                    <span style={{ fontSize: '36px' }}>{item.icon}</span>
                    <div
                      style={{
                        height: '0.5px',
                        width: '40px',
                        backgroundColor: '#C9A84C',
                        opacity: 0.4,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#C9A84C',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {item.tech}
                    </span>
                  </div>
                </div>
                {/* Caption */}
                <div style={{ backgroundColor: '#0D1B2A', padding: '14px 16px' }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#F5F0E8',
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  >
                    {item.label}
                  </p>
                  <p style={{ fontSize: '11px', color: '#6B6B6B', marginTop: '3px' }}>
                    {item.tech} · {item.material}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HELIX ── */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>Why HELIX?</h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3" style={{ color: '#6B6B6B' }}>Everything you need for professional 3D printing.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Upload className="w-5 h-5" />,
                title: 'Live 3D Preview',
                desc: 'Upload your file and see an interactive 3D preview in-browser — rotate, zoom, and verify before committing.',
              },
              {
                icon: <Star className="w-5 h-5" />,
                title: 'Instant Pricing',
                desc: '5-component breakdown: material, print time, handling, shipping zone, and platform fee — all live.',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: 'Real-Time Tracking',
                desc: 'Follow your order through every stage: Received → Printing → Quality Check → Shipped → Delivered.',
              },
              {
                icon: <Truck className="w-5 h-5" />,
                title: 'Pan-India Delivery',
                desc: 'Zone-based shipping across all 28 states and 8 union territories. Standard, Express, and Overnight options.',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Quality Guaranteed',
                desc: 'Every print undergoes quality inspection before shipping. Admin confirms final price after file review.',
              },
              {
                icon: <Layers className="w-5 h-5" />,
                title: 'FDM Technology',
                desc: 'Fused Deposition Modeling — fast, affordable, and versatile for prototypes, jigs, fixtures, and consumer products.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-6 card-hover group"
                style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors"
                  style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}
                >
                  {f.icon}
                </div>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: 'rgba(27,42,74,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>
              What Customers Say
            </h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3" style={{ color: '#6B6B6B' }}>
              Trusted by engineers, designers, and manufacturers across India.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA STRIP ── */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.25)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F5F0E8', letterSpacing: '0.02em' }}>
                  Questions? Chat with us on WhatsApp
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#6B6B6B' }}>
                  Typical response in under 1 hour · Mon – Sat, 9 AM – 7 PM
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918487842209'}?text=${encodeURIComponent("Hi, I'd like to know more about HELIX 3D printing")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all btn-glow"
              style={{ backgroundColor: '#25D366', color: '#fff', letterSpacing: '0.04em' }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            className="rounded-xl p-10 sm:p-14"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <h2 className="page-heading text-3xl sm:text-4xl mb-4" style={{ color: '#F5F0E8' }}>
              Ready to Print?
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
              Create your free account and place your first 3D printing order in minutes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
            >
              Start Your Order <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Fixed floating WhatsApp button */}
      <WhatsAppButton />
    </div>
  );
}
