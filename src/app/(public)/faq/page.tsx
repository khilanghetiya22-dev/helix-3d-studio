import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FAQAccordion from './FAQAccordion';

export const metadata = {
  title: 'FAQ — HELIX 3D Studio',
  description: 'Find answers to common questions about HELIX — pricing, file formats, technologies, shipping, and more.',
};


const faqs: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Create a free account, go to "New Order", upload your 3D file (STL, OBJ, STEP, etc.), select your technology and material, review the instant pricing breakdown, then confirm. Our team picks it up from there.',
      },
      {
        q: 'Do I need an account to get a quote?',
        a: 'Yes — creating an account is free and takes under 60 seconds. Once logged in, you can upload files and see real-time pricing instantly without committing to an order.',
      },
      {
        q: 'What file formats do you accept?',
        a: 'We accept STL, OBJ, 3MF, PLY, STEP / STP, Fusion 360 (.f3d), and SolidWorks (.sldprt, .sldasm). Maximum 50 MB per file.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    items: [
      {
        q: 'How is pricing calculated?',
        a: 'We use a transparent 5-component model: (1) Material cost based on estimated weight × price per gram, (2) Print time cost based on estimated hours × hourly rate, (3) Handling fee, (4) Zone-based shipping fee, and (5) Platform fee. You see all five line items before you pay.',
      },
      {
        q: 'Is the quoted price final?',
        a: 'The instant quote is an estimate. After our team analyses your file and confirms machine setup, an admin sets the final price. You\'ll receive a notification and must approve the final price before printing begins.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We support online prepaid payments — UPI, Credit/Debit Card, and Net Banking. All transactions are secured and processed at checkout.',
      },
      {
        q: 'Are there any hidden charges?',
        a: 'Never. Every cost component is shown upfront. The platform fee covers transaction processing and platform maintenance — it\'s always displayed separately.',
      },
    ],
  },
  {
    category: 'Printing & Quality',
    items: [
      {
        q: 'Which technology should I choose?',
        a: 'HELIX currently offers FDM (Fused Deposition Modeling) — the most versatile and affordable 3D printing technology, ideal for functional prototypes, jigs, fixtures, and consumer products. Available materials include PLA, ABS, PETG, TPU, and Nylon.',
      },
      {
        q: 'What quality levels are available?',
        a: 'For FDM: Draft (0.3 mm layers — fast), Standard (0.2 mm), and Fine (0.1 mm — highest detail). Choose based on your tolerance and budget requirements.',
      },
      {
        q: 'Do you check quality before shipping?',
        a: 'Yes. Every order goes through a quality inspection stage before dispatch. We check dimensional accuracy, surface finish, and structural integrity. If something doesn\'t meet spec, we reprint — at our cost.',
      },
      {
        q: 'Can I request post-processing (sanding, painting, etc.)?',
        a: 'Basic post-processing (support removal, light sanding) is included. Advanced finishing like painting, acetone smoothing, or media blasting can be requested via the order instructions — we\'ll quote separately.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'Which locations do you deliver to?',
        a: 'Pan-India — all 28 states and 8 union territories. Shipping is free for local Ahmedabad orders (Zone: Local). Other zones are priced by pincode prefix, shown transparently in your order.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Most orders are printed and dispatched within 3–5 business days. Shipping transit adds 1–4 days depending on your zone. Express options are available for urgent orders — select at checkout.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. Your dashboard shows a live order status stepper: Received → Printing → Quality Check → Shipped → Delivered. Once shipped, a tracking number is added to your order.',
      },
      {
        q: 'What if my order arrives damaged?',
        a: 'Contact us at khilanghetiya22@gmail.com within 48 hours of delivery with photos. We\'ll arrange a free reprint or refund depending on the situation.',
      },
    ],
  },
  {
    category: 'Account & Platform',
    items: [
      {
        q: 'Is my design data kept confidential?',
        a: 'Absolutely. Your uploaded files are stored securely in private cloud storage with access scoped only to your account and our print operators. We do not share, sell, or use your designs for any purpose other than fulfilling your order.',
      },
      {
        q: 'Can I save multiple delivery addresses?',
        a: 'Yes. You can manage a saved address book in your profile and select or change the shipping address at order time.',
      },
      {
        q: 'I\'m an admin — how do I access the admin panel?',
        a: 'Admin accounts are created internally. Once your account has admin role, you\'ll see an "Admin" link in the navbar after logging in. The panel lets you manage orders, set final prices, configure materials, and manage shipping zones.',
      },
    ],
  },
];



export default function FAQPage() {
  return (
    <div style={{ backgroundColor: '#0A0A0F' }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>
            Help Centre
          </p>
          <h1 className="page-heading text-4xl sm:text-5xl mb-6" style={{ color: '#F5F0E8' }}>
            Frequently Asked <span style={{ color: '#C9A84C' }}>Questions</span>
          </h1>
          <div className="gold-rule w-16 mx-auto mb-6" />
          <p className="text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
            Everything you need to know about HELIX. Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="transition-colors" style={{ color: '#C9A84C' }}>
              Contact our team →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {faqs.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xs font-medium uppercase tracking-widest" style={{ color: '#C9A84C' }}>
                  {section.category}
                </h2>
                <div className="flex-1 gold-rule" />
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <FAQAccordion key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: 'rgba(27,42,74,0.15)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F0E8' }}>
            Still Have Questions?
          </h2>
          <p className="mb-8" style={{ color: '#9CA3AF' }}>
            Our team typically responds within a few hours during business hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all btn-glow"
              style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg transition-all"
              style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#9CA3AF' }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA strip — v14: FAQ page only */}
      <section
        className="py-12 mx-4 mb-8 rounded-2xl"
        style={{ backgroundColor: 'rgba(13,27,42,0.8)', border: '1px solid rgba(201,168,76,0.25)' }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>Still have questions?</p>
          <h2 className="page-heading text-2xl sm:text-3xl mb-4" style={{ color: '#F5F0E8' }}>
            Chat with us on WhatsApp
          </h2>
          <p className="mb-6 text-sm" style={{ color: '#9CA3AF' }}>
            Our team typically responds within a few minutes during business hours.
          </p>
          <a
            href={`https://wa.me/918487842209?text=${encodeURIComponent("Hi, I'd like to know more about HELIX 3D Studio")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366', color: '#FFFFFF', letterSpacing: '0.03em' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>

  );
}
