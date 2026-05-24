import React from 'react';
import Link from 'next/link';
import HelixIcon from '@/components/brand/HelixIcon';
import HelixWordmark from '@/components/brand/HelixWordmark';

// Social icon SVGs — Instagram only (v14 spec)
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918487842209';
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/helixprint.in';

  return (
    <footer style={{ borderTop: '0.5px solid rgba(201,168,76,0.25)', backgroundColor: '#111111' }}>
      {/* Scoped hover styles */}
      <style>{`
        .footer-nav-link { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-nav-link:hover { color: #C9A84C; }
        .footer-social-icon { color: rgba(201,168,76,0.5); transition: color 0.2s; display: flex; align-items: center; }
        .footer-social-icon:hover { color: #C9A84C; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 4-column grid: Brand (wide) · Company · Platform · Contact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* 1. Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <HelixIcon size={36} variant="dark" />
              <HelixWordmark size="sm" />
            </div>
            <p className="tagline text-sm" style={{ color: '#C9A84C' }}>
              &ldquo;Where ideas take shape.&rdquo;
            </p>
            <p className="text-xs mt-3" style={{ color: '#6B6B6B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Ahmedabad, Gujarat, India
            </p>
          </div>

          {/* 2. Company column */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Company</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/services#fdm" className="footer-nav-link text-sm">
                  FDM Printing
                </a>
              </li>
              <li>
                <a href="/services#materials" className="footer-nav-link text-sm">
                  Materials &amp; Pricing
                </a>
              </li>
              <li>
                <a href="/design-guide" className="footer-nav-link text-sm">
                  Design Guidelines
                </a>
              </li>
              <li>
                <a href="/faq" className="footer-nav-link text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="footer-nav-link text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Platform column */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'My Dashboard', href: '/dashboard' },
                { label: 'Place an Order', href: '/orders/new' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Track Order', href: '/orders' },
                { label: 'Log In', href: '/login' },
                { label: 'Sign Up', href: '/signup' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-nav-link text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact column */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:khilanghetiya22@gmail.com" className="footer-nav-link">
                  khilanghetiya22@gmail.com
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hi, I'd like to know more about HELIX 3D printing")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  +91 84878 42209
                </a>
              </li>
              <li style={{ color: '#6B6B6B' }}>Ahmedabad, Gujarat, India</li>
            </ul>
          </div>
        </div>

        {/* Social icons row — Instagram only */}
        <div
          className="mt-10 pt-6 pb-4 flex items-center justify-center gap-5"
          style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)' }}
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer-social-icon"
          >
            <InstagramIcon />
          </a>
        </div>

        {/* Bottom bar — v14: helixprint.in */}
        <div className="pt-4" style={{ borderTop: '0.5px solid rgba(201,168,76,0.1)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>
              © 2026 HELIX 3D Studio · helixprint.in
            </p>
            <p className="tagline text-xs" style={{ color: 'rgba(201,168,76,0.5)' }}>
              Where ideas take shape.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
