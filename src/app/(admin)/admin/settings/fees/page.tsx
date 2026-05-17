import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Percent, Save } from 'lucide-react';

export const metadata = { title: 'Platform Fees — HELIX Admin Settings' };

// Default fee settings
const DEFAULT_FEES = {
  handling_fee_percent: '5',
  platform_fee_percent: '10',
};

export default async function AdminFeesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!adminProfile || adminProfile.role !== 'admin') redirect('/dashboard');

  // Fetch settings from DB
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['handling_fee_percent', 'platform_fee_percent']);

  const settingsMap: Record<string, string> = { ...DEFAULT_FEES };
  (settings || []).forEach((s) => { settingsMap[s.key] = s.value; });

  const handlingPct = parseFloat(settingsMap.handling_fee_percent || '5');
  const platformPct = parseFloat(settingsMap.platform_fee_percent || '10');

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="page-heading text-2xl sm:text-3xl"
          style={{ color: '#F5F0E8', letterSpacing: '0.08em' }}
        >
          PLATFORM FEES
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
          Edit handling and platform fee percentages. Changes apply to all new orders immediately.
        </p>
      </div>

      {/* Info banner */}
      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}
      >
        <Percent className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>
            Fee structure note
          </p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>
            Both fees are calculated as a percentage of the <strong style={{ color: '#F5F0E8' }}>Material Cost</strong> component.
            Handling fee covers post-processing and packaging. Platform fee covers operational and technology costs.
            These values are stored in the <code style={{ color: '#C9A84C' }}>settings</code> table and read live on every order calculation.
          </p>
        </div>
      </div>

      {/* Fee Cards */}
      <div className="space-y-4">
        {[
          {
            key: 'handling_fee_percent',
            label: 'Handling Fee',
            desc: 'Applied as % of Material Cost. Covers post-processing, packaging, and QC handling.',
            current: handlingPct,
            formula: 'Material Cost × Handling %',
            example: `e.g. Material Cost ₹200 × ${handlingPct}% = ₹${(200 * handlingPct / 100).toFixed(2)}`,
          },
          {
            key: 'platform_fee_percent',
            label: 'Platform Fee',
            desc: 'Applied as % of Material Cost. Covers HELIX platform operations and technology.',
            current: platformPct,
            formula: 'Material Cost × Platform %',
            example: `e.g. Material Cost ₹200 × ${platformPct}% = ₹${(200 * platformPct / 100).toFixed(2)}`,
          },
        ].map((fee) => (
          <div
            key={fee.key}
            className="rounded-xl p-6"
            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-medium" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
                  {fee.label}
                </h3>
                <p className="text-xs mt-1 mb-3" style={{ color: '#6B6B6B' }}>{fee.desc}</p>
                <p className="text-xs font-mono" style={{ color: '#C9A84C' }}>{fee.formula}</p>
                <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{fee.example}</p>
              </div>
              <div
                className="flex-shrink-0 text-center px-5 py-3 rounded-xl"
                style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <p className="text-3xl font-light" style={{ color: '#C9A84C' }}>{fee.current}</p>
                <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <form
        action="/api/admin/fees"
        method="POST"
        className="mt-8 rounded-xl p-6"
        style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.2)' }}
      >
        <h3 className="text-sm font-medium mb-5" style={{ color: '#F5F0E8', letterSpacing: '0.04em' }}>
          Update Fees
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-2" style={{ color: '#9CA3AF' }}>
              Handling Fee (%)
            </label>
            <input
              type="number"
              name="handling_fee_percent"
              defaultValue={handlingPct}
              min={0}
              max={50}
              step={0.5}
              className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: '#111',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#F5F0E8',
              }}
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: '#9CA3AF' }}>
              Platform Fee (%)
            </label>
            <input
              type="number"
              name="platform_fee_percent"
              defaultValue={platformPct}
              min={0}
              max={50}
              step={0.5}
              className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: '#111',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#F5F0E8',
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs" style={{ color: '#6B6B6B' }}>
            ⚠ These values will apply to all new orders from the moment you save.
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all btn-glow"
            style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>

      <p className="text-xs mt-4 text-center" style={{ color: '#6B6B6B' }}>
        Editing fee percentages via form submission requires a POST handler at <code style={{ color: '#C9A84C' }}>/api/admin/fees</code> (server action or route handler).
        Until then, update directly in the Supabase <code style={{ color: '#C9A84C' }}>settings</code> table.
      </p>
    </div>
  );
}
