import React from 'react';
import Link from 'next/link';
import HelixIcon from '@/components/brand/HelixIcon';
import HelixWordmark from '@/components/brand/HelixWordmark';

// Social icon SVGs (inline, gold strokes)
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export default function Footer() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918487842209';

  return (
    <footer style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', backgroundColor: '#111111' }}>
      {/* Scoped hover styles */}
      <style>{`
        .footer-service-link { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-service-link:hover { color: #C9A84C; }
        .footer-nav-link { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-nav-link:hover { color: #C9A84C; }
        .footer-social-icon { color: rgba(201,168,76,0.5); transition: color 0.2s; display: flex; align-items: center; }
        .footer-social-icon:hover { color: #C9A84C; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
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

          {/* Services — V11: every item must be an <a> tag linking to /services#slug */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Services</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'FDM Printing', href: '/services#fdm' },
                { label: 'SLA / DLP Resin', href: '/services#sla' },
                { label: 'SLS Powder Bed', href: '/services#sls' },
                { label: 'DMLS Metal', href: '/services#dmls' },
                { label: 'PolyJet', href: '/services#polyjet' },
                { label: 'Binder Jetting', href: '/services#binder-jetting' },
              ].map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="footer-service-link text-sm">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Services', href: '/services' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-nav-link text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform + Contact */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Platform</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Place Order', href: '/orders/new' },
                  { label: 'My Dashboard', href: '/dashboard' },
                  { label: 'Sign Up', href: '/signup' },
                  { label: 'Log In', href: '/login' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-nav-link text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="mailto:hello@helix.studio" className="footer-nav-link">
                    hello@helix.studio
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
                <li style={{ color: '#6B6B6B' }}>Ahmedabad, Gujarat, India</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social icons row */}
        <div
          className="mt-10 pt-6 pb-4 flex items-center justify-center gap-5"
          style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)' }}
        >
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/helix.studio'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer-social-icon"
          >
            <InstagramIcon />
          </a>
          <a
            href={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/helix'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="footer-social-icon"
          >
            <LinkedInIcon />
          </a>
          <a
            href={process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@helix'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="footer-social-icon"
          >
            <YouTubeIcon />
          </a>
        </div>

        {/* Bottom bar — V11: numeric year 2025 for SEO */}
        <div className="pt-4" style={{ borderTop: '0.5px solid rgba(201,168,76,0.1)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>
              © 2026 HELIX 3D Studio · helix.studio
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
