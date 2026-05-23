'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Send, Package, Upload, MapPin, Eye, Cpu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FileUploadZone from '@/components/FileUploadZone';
import ModelPreview3D from '@/components/ModelPreview3D';
import PricingCard from '@/components/PricingCard';
import { COLORS, INFILL_OPTIONS, QUALITY_OPTIONS } from '@/lib/constants';
import { submitOrder } from '@/app/actions/orders';
import { getActiveMaterials } from '@/app/actions/materials';
import AddressSection from '@/components/ui/AddressSection';
import { getTechnologyBySlug } from '@/app/actions/technologies';
import type { Address, Material, Technology } from '@/lib/types';
import type { OrderPricingResult } from '@/lib/pricing';
import type { ShippingTier } from '@/lib/shippingCalculator';

interface FileWithPreview {
  file: File;
  id: string;
  progress: number;
  error?: string;
}

const STEPS = [
  { label: 'Project Details', icon: <Package className="w-4 h-4" /> },
  { label: 'Upload Files', icon: <Upload className="w-4 h-4" /> },
  { label: 'Delivery Address', icon: <MapPin className="w-4 h-4" /> },
  { label: 'Review & Submit', icon: <Eye className="w-4 h-4" /> },
];

export default function TechOrderFormPage({ params }: { params: Promise<{ technology: string }> }) {
  const { technology: techSlug } = use(params);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [tech, setTech] = useState<Technology | null>(null);
  const [volumeCm3, setVolumeCm3] = useState<number | null>(null);
  const [pricingData, setPricingData] = useState<(OrderPricingResult & { shippingTier?: ShippingTier; shippingPrice?: number }) | null>(null);
  const [dimensions, setDimensions] = useState<{ x: number; y: number; z: number } | null>(null);

  const [form, setForm] = useState({
    material_id: '', color: '', infill: 20, quality: 'standard',
    quantity: 1, instructions: '',
  });
  const [initialAddress, setInitialAddress] = useState<Address | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  // Fetch technology + materials
  useEffect(() => {
    getTechnologyBySlug(techSlug).then((t) => {
      if (!t) {
        router.push('/orders/new');
        return;
      }
      setTech(t);
      // Set default infill based on tech
      if (!t.use_infill) {
        setForm(prev => ({ ...prev, infill: 100 }));
      }
      // Fetch materials for this technology
      getActiveMaterials(t.id).then((mats) => {
        setMaterials(mats);
        if (mats.length > 0) {
          setForm(prev => ({ ...prev, material_id: mats[0].id }));
        }
      });
    });

    // Fetch user default address
    const fetchAddress = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .maybeSingle();
        if (data) {
          const addr = { street: data.street, city: data.city, state: data.state, pincode: data.pincode, country: data.country };
          setInitialAddress(addr);
          setAddress(addr);
        }
      }
    };
    fetchAddress();
  }, [techSlug, router]);

  const selectedMaterial = materials.find(m => m.id === form.material_id) || null;
  const showInfill = tech?.use_infill ?? false;
  const showColor = tech?.use_color ?? true;

  const update = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.material_id) { setError('Please select a material'); return false; }
      if (showColor && !form.color) { setError('Please select a color'); return false; }
    }
    if (step === 1) {
      const validFiles = files.filter(f => !f.error);
      if (validFiles.length === 0) { setError('Please upload at least one file'); return false; }
    }
    if (step === 2) {
      if (!address) { setError('Please confirm your delivery address'); return false; }
      if (!address.pincode || address.pincode.length !== 6) { setError('Valid 6-digit pincode is required in the address'); return false; }
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) { setError(''); setStep(s => Math.min(s + 1, 3)); } };
  const prevStep = () => { setError(''); setStep(s => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const validFiles = files.filter(f => !f.error);

      const result = await submitOrder({
        material: selectedMaterial?.slug || '',
        material_id: form.material_id,
        technology_id: tech?.id,
        color: showColor ? form.color : 'default',
        infill: showInfill ? form.infill : 100,
        quality: form.quality,
        quantity: form.quantity,
        instructions: form.instructions,
        address_json: address!,
        fileCount: validFiles.length,
        estimated_weight_g: pricingData?.estimatedWeight ?? null,
        estimated_volume_cm3: volumeCm3,
        estimated_price: pricingData?.grandTotal ?? null,
        // V5 pricing breakdown
        estimated_print_hours: pricingData?.printTime?.billedHours ?? null,
        print_time_cost: pricingData?.printTimeCost ?? null,
        material_cost: pricingData?.materialCost ?? null,
        handling_fee: pricingData?.handlingFee ?? null,
        shipping_fee: pricingData?.shippingPrice ?? null,
        shipping_zone: pricingData?.shipping?.zoneName ?? null,
        shipping_tier: pricingData?.shippingTier ?? 'standard',
        payment_method: 'prepaid',
        payment_status: 'pending',
        platform_fee: pricingData?.platformFee ?? null,
      });

      if (!result.success) throw new Error(result.error || 'Failed to submit order');

      const orderId = result.orderId!;

      // Upload files
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const f of validFiles) {
          const filePath = `${user.id}/${orderId}/${Date.now()}_${f.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('order-files')
            .upload(filePath, f.file);
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('order-files').getPublicUrl(filePath);
            await supabase.from('order_files').insert({
              order_id: orderId,
              file_name: f.file.name,
              file_url: urlData.publicUrl,
              file_size: f.file.size,
              file_type: f.file.name.split('.').pop() || '',
            });
          }
        }
      }

      router.push(`/orders/${orderId}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const materialLabel = selectedMaterial?.name || '';
  const colorLabel = COLORS.find(c => c.value === form.color)?.label || form.color;
  const qualityLabel = QUALITY_OPTIONS.find(q => q.value === form.quality)?.label || form.quality;

  if (!tech) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 animate-fade-in">
        <div className="w-8 h-8 border-2 border-text-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-text-muted">Loading technology...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Tech Badge + Back */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push('/orders/new')} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Change Technology
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
          <Cpu className="w-3.5 h-3.5" /> {tech.icon} {tech.name} Order
        </div>
      </div>

      <h1 className="text-2xl font-bold text-text-primary mb-1">Place a New Order</h1>
      <p className="text-sm text-text-secondary mb-8">{tech.full_name} — {tech.description}</p>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => { if (i < step) setStep(i); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                i === step ? 'bg-primary/10 text-primary border border-primary/30' :
                i < step ? 'bg-accent/10 text-accent cursor-pointer' :
                'bg-bg-secondary text-text-muted border border-border-primary'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                i === step ? 'bg-primary text-white' :
                i < step ? 'bg-accent text-white' :
                'bg-bg-elevated text-text-muted'
              }`}>
                {i < step ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 flex-shrink-0 ${i < step ? 'bg-accent' : 'bg-border-primary'}`} />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger animate-scale-in">{error}</div>
      )}

      {/* Step 0: Project Details */}
      {step === 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 space-y-5 animate-slide-up">
            {/* Material selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Material Type</label>
              {materials.length === 0 ? (
                <p className="text-sm text-text-muted">Loading materials...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {materials.map((m) => (
                    <button key={m.id} type="button" onClick={() => update('material_id', m.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${form.material_id === m.id ? 'border-primary bg-primary/10' : 'border-border-primary bg-bg-secondary hover:border-border-secondary'}`}>
                      <p className="text-sm font-semibold text-text-primary">{m.name}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{m.description}</p>
                      <p className="text-xs text-accent mt-1 font-medium">₹{m.price_per_gram}/g</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color (conditional) */}
            {showColor && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Color</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {COLORS.map((c) => (
                    <button key={c.value} type="button" onClick={() => update('color', c.value)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${form.color === c.value ? 'border-primary bg-primary/10 shadow-md' : 'border-border-primary hover:border-border-secondary bg-bg-secondary'}`}>
                      <div className="w-8 h-8 rounded-lg border border-border-primary shadow-inner" style={{
                        background: c.hex
                      }} />
                      <span className="text-[10px] text-text-secondary">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Infill (FDM only) */}
            {showInfill && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Infill Percentage</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {INFILL_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => update('infill', opt.value)}
                      className={`p-3 rounded-xl border text-center transition-all ${form.infill === opt.value ? 'border-primary bg-primary/10' : 'border-border-primary bg-bg-secondary hover:border-border-secondary'}`}>
                      <p className="text-lg font-bold text-text-primary">{opt.label}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Print Quality</label>
              <div className="grid grid-cols-3 gap-3">
                {QUALITY_OPTIONS.map((q) => (
                  <button key={q.value} type="button" onClick={() => update('quality', q.value)}
                    className={`p-4 rounded-xl border text-center transition-all ${form.quality === q.value ? 'border-primary bg-primary/10' : 'border-border-primary bg-bg-secondary hover:border-border-secondary'}`}>
                    <p className="text-2xl mb-1">{q.icon}</p>
                    <p className="text-sm font-semibold text-text-primary">{q.label}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{q.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Instructions */}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" min={1} max={1000} value={form.quantity} onChange={(e) => update('quantity', parseInt(e.target.value) || 1)} />
              <div />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Special Instructions</label>
              <textarea value={form.instructions} onChange={(e) => update('instructions', e.target.value)} rows={3} placeholder="Any special requirements..." className="w-full rounded-xl bg-bg-secondary border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all px-4 py-2.5 text-sm resize-none" />
            </div>
          </Card>

          {/* Pricing sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <PricingCard
              material={selectedMaterial}
              infill={showInfill ? form.infill : 100}
              quantity={form.quantity}
              volumeCm3={volumeCm3}
              technologyName={tech.name}
              technologySlug={techSlug}
              showInfill={showInfill}
              quality={form.quality}
              pincode={address?.pincode || ''}
              onPricingChange={setPricingData}
            />
          </div>
        </div>
      )}

      {/* Step 1: Files + 3D Preview */}
      {step === 1 && (
        <div className="space-y-6 animate-slide-up">
          <Card>
            <FileUploadZone files={files} onFilesChange={setFiles} />
          </Card>

          {files.filter(f => !f.error).length > 0 && (
            <ModelPreview3D
              files={files}
              onVolumeCalculated={(vol) => setVolumeCm3(vol)}
              onDimensionsCalculated={(dims) => setDimensions(dims)}
            />
          )}

          {/* Dimensions display */}
          {dimensions && (
            <div className="flex items-center justify-center gap-4 py-2">
              <span className="text-xs text-text-muted">Model Size:</span>
              <span className="text-sm font-mono font-medium text-text-primary">
                {dimensions.x.toFixed(1)} × {dimensions.y.toFixed(1)} × {dimensions.z.toFixed(1)} mm
              </span>
            </div>
          )}

          {selectedMaterial && (
            <PricingCard
              material={selectedMaterial}
              infill={showInfill ? form.infill : 100}
              quantity={form.quantity}
              volumeCm3={volumeCm3}
              technologyName={tech.name}
              technologySlug={techSlug}
              showInfill={showInfill}
              quality={form.quality}
              pincode={address?.pincode || ''}
              onPricingChange={setPricingData}
            />
          )}
        </div>
      )}

      {/* Step 2: Address */}
      {step === 2 && (
        <div className="animate-slide-up">
          <AddressSection
            initialAddress={initialAddress}
            onConfirm={(addr) => {
              setAddress(addr);
              setError('');
            }}
          />
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="grid lg:grid-cols-3 gap-6 animate-slide-up">
          <Card className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Order Summary</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div><span className="text-text-muted">Technology</span><p className="font-medium text-text-primary">{tech.icon} {tech.name}</p></div>
              <div><span className="text-text-muted">Material</span><p className="font-medium text-text-primary">{materialLabel}</p></div>
              {showColor && <div><span className="text-text-muted">Color</span><p className="font-medium text-text-primary">{colorLabel}</p></div>}
              {showInfill && <div><span className="text-text-muted">Infill</span><p className="font-medium text-text-primary">{form.infill}%</p></div>}
              <div><span className="text-text-muted">Quality</span><p className="font-medium text-text-primary">{qualityLabel}</p></div>
              <div><span className="text-text-muted">Quantity</span><p className="font-medium text-text-primary">{form.quantity}</p></div>
              <div><span className="text-text-muted">Files</span><p className="font-medium text-text-primary">{files.filter(f => !f.error).length} file(s)</p></div>
              {dimensions && (
                <div><span className="text-text-muted">Model Size</span><p className="font-medium text-text-primary font-mono">{dimensions.x.toFixed(1)}×{dimensions.y.toFixed(1)}×{dimensions.z.toFixed(1)} mm</p></div>
              )}
            </div>
            {form.instructions && (
              <div className="text-sm"><span className="text-text-muted">Instructions</span><p className="font-medium text-text-primary mt-0.5">{form.instructions}</p></div>
            )}
            <div className="border-t border-border-primary pt-4 text-sm">
              <p className="text-text-muted mb-1">Delivery Address</p>
              {address ? (
                <p className="font-medium text-text-primary">{address.street}, {address.city}, {address.state} — {address.pincode}, {address.country}</p>
              ) : (
                <p className="font-medium text-danger">Address missing</p>
              )}
            </div>
          </Card>

          <PricingCard
            material={selectedMaterial}
            infill={showInfill ? form.infill : 100}
            quantity={form.quantity}
            volumeCm3={volumeCm3}
            technologyName={tech.name}
            technologySlug={techSlug}
            showInfill={showInfill}
            quality={form.quality}
            pincode={address?.pincode || ''}
            boundingBoxMm={dimensions ? { l: dimensions.x, b: dimensions.y, h: dimensions.z } : null}
            onPricingChange={setPricingData}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="ghost" onClick={step === 0 ? () => router.push('/orders/new') : prevStep} icon={<ArrowLeft className="w-4 h-4" />}>
          {step === 0 ? 'Change Tech' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={loading} icon={<Send className="w-4 h-4" />}>Submit Order</Button>
        )}
      </div>
    </div>
  );
}
