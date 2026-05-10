import React from 'react';
import Link from 'next/link';
import { Upload, Layers, Truck, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';
import FormiqIcon from '@/components/brand/FormiqIcon';
import FormiqWordmark from '@/components/brand/FormiqWordmark';
import Footer from '@/components/brand/Footer';

export const metadata = {
  title: 'FORMIQ — 3D Print Studio',
  description: 'Layer by layer. Smarter by design. Professional 3D printing services for FDM, SLA, SLS, DMLS and more.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#1A1A1A', borderBottom: '0.5px solid rgba(201,146,10,0.25)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <FormiqIcon size={32} variant="dark" />
            <FormiqWordmark size="sm" />
          </Link>

          {/* Public page links */}
          <div className="hidden md:flex items-center gap-1">
            {[{ label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'FAQ', href: '/faq' }, { label: 'Contact', href: '/contact' }].map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium transition-colors" style={{ color: '#9CA3AF', letterSpacing: '0.02em' }}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-medium transition-colors" style={{ color: '#9CA3AF' }}>
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9920A', color: '#1A1A1A', letterSpacing: '0.04em' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Established badge */}
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C9920A', letterSpacing: '0.2em' }}>
              Established · MMXXV
            </p>

            <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ color: '#F5F4F0' }}>
              Precision 3D Printing,{' '}
              <span style={{ color: '#C9920A' }}>Delivered</span>
            </h1>

            <p className="tagline mt-6 text-lg sm:text-xl max-w-xl mx-auto" style={{ color: '#C9920A' }}>
              &ldquo;Layer by layer. Smarter by design.&rdquo;
            </p>

            <p className="mt-4 text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#9CA3AF' }}>
              Upload your CAD files, choose from 19+ materials across 7 technologies, and get professional-quality prints delivered across India.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
                style={{ backgroundColor: '#C9920A', color: '#1A1A1A', letterSpacing: '0.04em' }}
              >
                Start Your First Order <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all"
                style={{ border: '1px solid rgba(201,146,10,0.3)', color: '#9CA3AF' }}
              >
                I Have an Account
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { value: '7', label: 'Technologies' },
                { value: '19+', label: 'Materials' },
                { value: '500MB', label: 'Max Upload' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4 card-hover" style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.15)' }}>
                  <p className="text-2xl font-light" style={{ color: '#C9920A' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F4F0' }}>How It Works</h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3" style={{ color: '#6B6B6B' }}>Three simple steps from design to delivery.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Upload className="w-6 h-6" />, title: 'Upload Your Design', desc: 'Drag & drop your 3D files — STL, OBJ, STEP, Fusion 360, SolidWorks, and 15+ more formats supported.' },
              { step: '02', icon: <Layers className="w-6 h-6" />, title: 'Configure & Preview', desc: 'Choose technology, material, and quality. See a live 3D preview and real-time pricing before you order.' },
              { step: '03', icon: <Truck className="w-6 h-6" />, title: 'Track & Receive', desc: 'Track your order through every stage — from printing to quality check to delivery at your door.' },
            ].map((item) => (
              <div key={item.step} className="group">
                <div className="rounded-xl p-8 card-hover h-full" style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ border: '1px solid #C9920A', color: '#C9920A' }}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-mono mb-2" style={{ color: '#6B6B6B', letterSpacing: '0.1em' }}>STEP {item.step}</div>
                  <h3 className="text-lg font-light mb-3" style={{ color: '#F5F4F0', letterSpacing: '0.04em' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FORMIQ */}
      <section className="py-20 sm:py-28 relative" style={{ backgroundColor: 'rgba(27,42,74,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="page-heading text-3xl sm:text-4xl" style={{ color: '#F5F4F0' }}>Why FORMIQ?</h2>
            <div className="gold-rule w-16 mx-auto mt-4 mb-3" />
            <p className="mt-3" style={{ color: '#6B6B6B' }}>Everything you need for professional 3D printing.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Upload className="w-5 h-5" />, title: 'Universal File Support', desc: 'Accept 20+ 3D file formats including STL, STEP, Fusion 360, SolidWorks, CATIA & more.' },
              { icon: <Layers className="w-5 h-5" />, title: '7 Technologies', desc: 'FDM, SLA, DLP, SLS, DMLS, PolyJet, and Binder Jetting — the right tech for every project.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Transparent Pricing', desc: '5-component pricing breakdown: material, print time, handling, shipping, and platform fee.' },
              { icon: <Clock className="w-5 h-5" />, title: 'Real-Time Tracking', desc: 'Follow your order from received through printing, quality check, shipping to delivery.' },
              { icon: <Truck className="w-5 h-5" />, title: 'Pan-India Delivery', desc: 'Zone-based shipping across all 28 states and 8 union territories. Free local delivery.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Quality Guaranteed', desc: 'Every print undergoes quality inspection before shipping to ensure perfection.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl p-6 card-hover group" style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.12)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors" style={{ border: '1px solid rgba(201,146,10,0.3)', color: '#C9920A' }}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#F5F4F0', letterSpacing: '0.04em' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="rounded-xl p-10 sm:p-14" style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.2)' }}>
            <h2 className="page-heading text-3xl sm:text-4xl mb-4" style={{ color: '#F5F4F0' }}>
              Ready to Print?
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
              Create your free account and place your first 3D printing order in minutes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9920A', color: '#1A1A1A', letterSpacing: '0.04em' }}
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
