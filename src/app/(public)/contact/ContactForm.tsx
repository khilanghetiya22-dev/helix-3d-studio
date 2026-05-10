'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const inputStyle = {
  backgroundColor: '#111111',
  border: '1px solid rgba(201,146,10,0.2)',
  color: '#F5F4F0',
  borderRadius: '8px',
  padding: '12px 16px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
} as React.CSSProperties;

const labelStyle = {
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#6B6B6B',
  marginBottom: '6px',
  display: 'block',
} as React.CSSProperties;

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Please fill in all required fields.');
      setState('error');
      return;
    }
    setState('loading');
    // Simulate submission — wire to Resend / server action when ready
    await new Promise((r) => setTimeout(r, 1200));
    setState('success');
  };

  if (state === 'success') {
    return (
      <div
        className="rounded-xl p-8 flex flex-col items-center justify-center py-16 text-center animate-fade-in"
        style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.15)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(201,146,10,0.1)', border: '1px solid rgba(201,146,10,0.3)' }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: '#C9920A' }} />
        </div>
        <h3 className="page-heading text-2xl mb-3" style={{ color: '#F5F4F0' }}>Message Sent!</h3>
        <p className="text-sm mb-8 max-w-xs" style={{ color: '#9CA3AF' }}>
          Thanks for reaching out. We&apos;ll reply to{' '}
          <strong style={{ color: '#C9920A' }}>{form.email}</strong> shortly.
        </p>
        <button
          onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setState('idle'); }}
          className="text-sm px-6 py-3 rounded-lg transition-all"
          style={{ border: '1px solid rgba(201,146,10,0.3)', color: '#9CA3AF' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-8"
      style={{ backgroundColor: '#1B2A4A', border: '1px solid rgba(201,146,10,0.15)' }}
    >
      <h2 className="page-heading text-xl mb-2" style={{ color: '#F5F4F0' }}>Send a Message</h2>
      <p className="text-sm mb-8" style={{ color: '#6B6B6B' }}>We&apos;ll get back to you as soon as possible.</p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contact-name" style={labelStyle}>Name *</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#C9920A'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(201,146,10,0.2)'; }}
            />
          </div>
          <div>
            <label htmlFor="contact-email" style={labelStyle}>Email *</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#C9920A'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(201,146,10,0.2)'; }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
          <select
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            style={{ ...inputStyle, appearance: 'none' } as React.CSSProperties}
            onFocus={(e) => { e.target.style.borderColor = '#C9920A'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(201,146,10,0.2)'; }}
          >
            <option value="">Select a topic…</option>
            <option value="order">Order Enquiry</option>
            <option value="quote">Custom Quote Request</option>
            <option value="technical">Technical / File Help</option>
            <option value="billing">Billing / Payment</option>
            <option value="shipping">Shipping &amp; Delivery</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" style={labelStyle}>Message *</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            placeholder="Describe your enquiry in detail — include order ID if relevant…"
            value={form.message}
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' } as React.CSSProperties}
            onFocus={(e) => { e.target.style.borderColor = '#C9920A'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(201,146,10,0.2)'; }}
          />
        </div>

        {state === 'error' && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: 'rgba(201,146,10,0.08)', border: '1px solid rgba(201,146,10,0.3)', color: '#C9920A' }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={state === 'loading'}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium rounded-lg transition-all btn-glow"
          style={{
            backgroundColor: state === 'loading' ? 'rgba(201,146,10,0.6)' : '#C9920A',
            color: '#1A1A1A',
            letterSpacing: '0.04em',
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {state === 'loading' ? (
            <>
              <span className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Message <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
