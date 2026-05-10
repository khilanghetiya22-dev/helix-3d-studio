import React from 'react';
import { MapPin, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact — FORMIQ 3D Print Studio',
  description: 'Get in touch with the FORMIQ team for order enquiries, custom quotes, technical help, or general support.',
};

const contactPoints = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'hello@formiq.studio',
    note: 'We respond within a few hours on business days',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Studio Location',
    value: 'Ahmedabad, Gujarat, India',
    note: 'Walk-ins by appointment only',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: 'Business Hours',
    value: 'Mon – Sat, 9 AM – 7 PM IST',
    note: 'Closed on public holidays',
  },
];

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9920A', letterSpacing: '0.2em' }}>
            Get In Touch
          </p>
          <h1 className="page-heading text-4xl sm:text-5xl mb-6" style={{ color: '#F5F4F0' }}>
            Contact <span style={{ color: '#C9920A' }}>FORMIQ</span>
          </h1>
          <div className="gold-rule w-16 mx-auto mb-6" />
          <p className="text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
            Questions about an order, a technical spec, or a custom project? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left — contact info */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="page-heading text-xl mb-6" style={{ color: '#F5F4F0' }}>Reach Us Directly</h2>

              {contactPoints.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl p-5 card-hover"
                  style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.12)' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ border: '1px solid rgba(201,146,10,0.3)', color: '#C9920A' }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#6B6B6B' }}>{c.label}</p>
                      <p className="text-sm font-medium mb-1" style={{ color: '#F5F4F0' }}>{c.value}</p>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>{c.note}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick links */}
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.12)' }}
              >
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#C9920A' }}>Quick Links</p>
                <div className="space-y-2">
                  {[
                    { label: 'Read our FAQ', href: '/faq' },
                    { label: 'View our Services', href: '/services' },
                    { label: 'Place an Order', href: '/signup' },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{ color: '#9CA3AF' }}
                    >
                      <span style={{ color: '#C9920A' }}>→</span> {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — contact form (client) */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
