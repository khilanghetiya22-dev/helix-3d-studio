import React from 'react';
import Link from 'next/link';
import { ArrowRight, Upload, Layers, Truck, CheckCircle, Clock, Shield, Star } from 'lucide-react';
import WelcomeOverlay from '@/components/WelcomeOverlay';
import { createClient } from '@/lib/supabase/server';
import TestimonialCard from '@/components/TestimonialCard';
import InteractiveGallery from '@/components/brand/InteractiveGallery';

export const metadata = {
  title: 'HELIX — 3D Print Studio',
  description: 'Where ideas take shape. Professional FDM 3D printing services — PLA, ABS, PETG, TPU, Nylon. Ships pan-India in 2–4 business days.',
};

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
      'I needed PETG enclosures for my electronics project. HELIX\'s online pricing tool gave me an accurate quote instantly, and delivery was right on time. Excellent service!',
    name: 'Dr. Priya Nair',
    city: 'Kochi, Kerala',
    rating: 5,
    technology: 'FDM',
  },
  {
    quote:
      'Ordered custom Nylon parts for our robotics team. The 3D preview feature let us verify the design before printing. Dimensional accuracy was spot-on. Highly recommend HELIX.',
    name: 'Vikram Singh',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    technology: 'FDM',
  },
];

export default async function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0F' }}>
      <WelcomeOverlay />

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
              Upload your CAD files, choose from 5+ premium materials, and get high-quality FDM prints delivered right to your doorstep.
            </p>

            {/* CTAs — Place an Order & View Services */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/orders/new/fdm"
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

            {/* Hero Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { value: 'FDM Only', label: 'Printing Standard' },
                { value: '5+ Materials', label: 'PLA, ABS, PETG, TPU, Nylon' },
                { value: '3–7 Days', label: 'Ships Pan-India' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 card-hover flex flex-col justify-center items-center text-center"
                  style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  <p className="text-sm sm:text-base font-medium" style={{ color: '#C9A84C' }}>{s.value}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#6B6B6B', lineHeight: '1.2' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
      </section>

      {/* ── TECHNOLOGY STRIP ── */}
      <section className="py-12 relative overflow-hidden border-b border-t" style={{ borderColor: 'rgba(201,168,76,0.15)', backgroundColor: 'rgba(13,27,42,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#C9A84C' }}>FDM Specialization</h2>
            <p className="text-xs text-gray-500 mt-1">We specialize exclusively in Fused Deposition Modeling (FDM) to guarantee unbeatable tolerances & strength.</p>
          </div>
          <div className="flex gap-4">
            {['PLA', 'ABS', 'PETG', 'TPU', 'Nylon'].map((m) => (
              <span key={m} className="text-xs px-3 py-1 rounded border font-mono" style={{ backgroundColor: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.25)', color: '#9CA3AF' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>How It Works</h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3 text-sm text-gray-500">
              Four simple steps from CAD upload to premium 3D print delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: <Upload className="w-6 h-6" />,
                title: 'Upload File',
                desc: 'Drag & drop your STL, OBJ, STEP, or other CAD formats directly in our web uploader.',
              },
              {
                step: '02',
                icon: <Layers className="w-6 h-6" />,
                title: 'Configure',
                desc: 'Select material (PLA/ABS/PETG/TPU/Nylon), color (White/Black), infill %, and quantity.',
              },
              {
                step: '03',
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Preview & Price',
                desc: 'Instantly view a live 3D preview of your model and get fully itemized transparent pricing.',
              },
              {
                step: '04',
                icon: <Truck className="w-6 h-6" />,
                title: 'Print & Deliver',
                desc: 'We print, inspect, and ship your parts pan-India with real-time tracking updates.',
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <div
                  className="rounded-xl p-7 card-hover h-full flex flex-col justify-between"
                  style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                      style={{ border: '1px solid #C9A84C', color: '#C9A84C' }}
                    >
                      {item.icon}
                    </div>
                    <div className="text-[10px] font-mono mb-2" style={{ color: '#6B6B6B', letterSpacing: '0.15em' }}>
                      STEP {item.step}
                    </div>
                    <h3 className="text-base font-light mb-2" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed mt-2" style={{ color: '#9CA3AF' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES WE SERVE ── */}
      <section className="py-16 border-t" style={{ borderColor: 'rgba(201,168,76,0.12)', backgroundColor: 'rgba(13,27,42,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="page-heading text-2xl sm:text-3xl" style={{ color: '#F5F0E8' }}>Industries We Serve</h2>
            <div className="gold-rule w-12 mx-auto mt-3 mb-3" />
            <p className="text-sm text-gray-500">Tailored 3D printing configurations for engineering, design, and hobby applications.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎓', title: 'Students & Hobbyists', desc: 'From passion projects and prototypes to academic design showcases.' },
              { icon: '⚙️', title: 'Engineers & Startups', desc: 'Functional component testing, proof of concept, and custom jigs.' },
              { icon: '🏗️', title: 'Architects & Designers', desc: 'Beautiful miniature scale concepts and physical visualization models.' },
              { icon: '🏭', title: 'Small Businesses', desc: 'Custom branding items, fixtures, mechanical molds, and hardware.' },
            ].map((ind, i) => (
              <div key={i} className="rounded-xl p-5 bg-black/40 border border-gray-800 text-center card-hover">
                <div className="text-3xl mb-3">{ind.icon}</div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#C9A84C' }}>{ind.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE PRINTS GALLERY ── */}
      <section className="py-20 sm:py-24 relative" style={{ backgroundColor: 'rgba(27,42,74,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>
              Sample Prints Portfolio
            </h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3 max-w-lg mx-auto text-sm text-gray-500">
              Check out our gallery of real FDM 3D prints across various materials and configurations.
            </p>
          </div>
          <InteractiveGallery />
        </div>
      </section>

      {/* ── WHY HELIX ── */}
      <section className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>Why HELIX?</h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3 text-sm text-gray-500">Everything you need for high-end professional FDM prints.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Upload className="w-5 h-5" />,
                title: 'Live 3D Preview',
                desc: 'Upload your file and see an interactive 3D WebGL preview in-browser — rotate, zoom, and verify layer orientations.',
              },
              {
                icon: <Star className="w-5 h-5" />,
                title: 'Instant Slicing Pricing',
                desc: '5-component itemized live pricing: material weight, print hours, handling fee, shipping zone, and platform fee.',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: 'Real-Time Tracking',
                desc: 'Follow order progress from uploader straight to delivery: Received → Slicing → Printing → Quality Check → Shipped.',
              },
              {
                icon: <Truck className="w-5 h-5" />,
                title: 'Pan-India Delivery',
                desc: 'Zone-based flat rate shipping across India. Standard and Express options. Free shipping on orders over ₹999.',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Professional QA Inspect',
                desc: 'Every completed part undergoes mechanical and visual inspections. Admin manual review confirms final details.',
              },
              {
                icon: <Layers className="w-5 h-5" />,
                title: 'FDM Focus',
                desc: 'Specialized 0.4mm nozzle FDM prints with extreme layer control. PLA, ABS, PETG, TPU, and Nylon standard.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-6 card-hover group flex flex-col justify-between"
                style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.12)' }}
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors"
                    style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
                    {f.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mt-2" style={{ color: '#9CA3AF' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING EXAMPLE STRIP ── */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: '#0D1B2A',
            border: '1.5px solid #C9A84C',
            borderLeft: '5px solid #C9A84C',
          }}
        >
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base font-semibold" style={{ color: '#F5F0E8' }}>
              A 10g PLA part costs approximately ₹35–50 + shipping.
            </p>
            <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
              FDM prints start from as low as ₹49. Exact price calculated from model volume after upload.
            </p>
          </div>
          <Link
            href="/orders/new/fdm"
            className="text-xs font-semibold uppercase tracking-wider text-nowrap px-4 py-2 rounded transition-all"
            style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            Get an instant quote →
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 sm:py-24" style={{ backgroundColor: 'rgba(27,42,74,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F0E8' }}>
              What Customers Say
            </h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3 text-sm text-gray-500">
              Trusted by hardware engineers, product designers, and student makers across India.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK ORDER CTA BANNER ── */}
      <section className="max-w-4xl mx-auto px-4 pt-16">
        <div
          className="rounded-xl p-5 text-center transition-colors"
          style={{
            backgroundColor: '#0D1B2A',
            border: '0.5px solid rgba(201,168,76,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#C9A84C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
          }}
        >
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Need to manufacture a larger batch of parts?{' '}
            <Link href="/contact?type=bulk" className="font-semibold underline tracking-wide transition-colors" style={{ color: '#C9A84C' }}>
              Request a custom bulk order quote with wholesale rates →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Bottom CTA BANNER ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            className="rounded-xl p-10 sm:p-14"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <h2 className="page-heading text-3xl sm:text-4xl mb-4" style={{ color: '#F5F0E8' }}>
              Ready to print?
            </h2>
            <p className="mb-8 max-w-md mx-auto text-sm text-gray-400">
              Upload your 3D models and get professional physical FDM components delivered in 2–4 business days.
            </p>
            <Link
              href="/orders/new/fdm"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
            >
              Start Your Order <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
