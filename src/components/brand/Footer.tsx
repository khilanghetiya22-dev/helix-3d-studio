import React from 'react';
import Link from 'next/link';
import FormiqIcon from '@/components/brand/FormiqIcon';
import FormiqWordmark from '@/components/brand/FormiqWordmark';

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'rgba(201,146,10,0.15)', backgroundColor: '#111111' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <FormiqIcon size={36} variant="dark" />
              <FormiqWordmark size="sm" />
            </div>
            <p className="tagline text-sm" style={{ color: '#C9920A' }}>
              &ldquo;Layer by layer. Smarter by design.&rdquo;
            </p>
            <p className="text-xs mt-3" style={{ color: '#6B6B6B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Established · MMXXV
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9920A' }}>Services</h4>
            <ul className="space-y-2.5">
              {['FDM Printing', 'SLA / DLP Resin', 'SLS Powder Bed', 'DMLS Metal', 'PolyJet', 'Binder Jetting'].map(s => (
                <li key={s}>
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9920A' }}>Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Services', href: '/services' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact', href: '/contact' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-formiq-gold" style={{ color: '#9CA3AF' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9920A' }}>Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Place Order', href: '/orders/new' },
                { label: 'My Dashboard', href: '/dashboard' },
                { label: 'Sign Up', href: '/signup' },
                { label: 'Log In', href: '/login' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-formiq-gold" style={{ color: '#9CA3AF' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9920A' }}>Contact</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: '#9CA3AF' }}>
              <li>formiq.studio</li>
              <li>Ahmedabad, Gujarat, India</li>
              <li>hello@formiq.studio</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6" style={{ borderTop: '0.5px solid rgba(201,146,10,0.15)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>
              © MMXXV FORMIQ 3D Print Studio · formiq.studio
            </p>
            <p className="tagline text-xs" style={{ color: 'rgba(201,146,10,0.5)' }}>
              Layer by layer. Smarter by design.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
