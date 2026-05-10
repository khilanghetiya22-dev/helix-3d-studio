'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, X, ToggleLeft, ToggleRight, Settings, ArrowLeft, Beaker, Cpu } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getAllMaterials, updateMaterial, addMaterial, toggleMaterial } from '@/app/actions/materials';
import { getActiveTechnologies } from '@/app/actions/technologies';
import type { Material, Technology } from '@/lib/types';

export default function AdminMaterialsPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ price_per_gram: '', density_g_per_cm3: '' });
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '', slug: '', description: '', density_g_per_cm3: '', price_per_gram: '', technology_id: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [mats, techs] = await Promise.all([getAllMaterials(), getActiveTechnologies()]);
    setMaterials(mats);
    setTechnologies(techs);
    setLoading(false);
  };

  const handleEdit = (mat: Material) => {
    setEditingId(mat.id);
    setEditValues({
      price_per_gram: String(mat.price_per_gram),
      density_g_per_cm3: String(mat.density_g_per_cm3),
    });
  };

  const handleSave = async (matId: string) => {
    setSaving(true);
    setError('');
    const result = await updateMaterial(matId, {
      price_per_gram: parseFloat(editValues.price_per_gram),
      density_g_per_cm3: parseFloat(editValues.density_g_per_cm3),
    });
    if (result.success) {
      setEditingId(null);
      setSuccessMsg('Material updated');
      setTimeout(() => setSuccessMsg(''), 2000);
      await fetchData();
    } else {
      setError(result.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleToggle = async (matId: string, currentActive: boolean) => {
    const result = await toggleMaterial(matId, !currentActive);
    if (result.success) await fetchData();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await addMaterial({
      name: newMaterial.name,
      slug: newMaterial.slug || newMaterial.name.toLowerCase().replace(/\s+/g, '-'),
      description: newMaterial.description,
      density_g_per_cm3: parseFloat(newMaterial.density_g_per_cm3),
      price_per_gram: parseFloat(newMaterial.price_per_gram),
      technology_id: newMaterial.technology_id || undefined,
    });
    if (result.success) {
      setShowAddForm(false);
      setNewMaterial({ name: '', slug: '', description: '', density_g_per_cm3: '', price_per_gram: '', technology_id: '' });
      setSuccessMsg('Material added');
      setTimeout(() => setSuccessMsg(''), 2000);
      await fetchData();
    } else {
      setError(result.error || 'Failed to add');
    }
    setSaving(false);
  };

  // Group materials by technology
  const groupedMaterials = technologies.map(tech => ({
    technology: tech,
    materials: materials.filter(m => m.technology_id === tech.id),
  })).filter(g => g.materials.length > 0);

  // Ungrouped materials
  const ungrouped = materials.filter(m => !m.technology_id);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => router.push('/admin/orders')} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            Material Pricing
          </h1>
          <p className="text-sm text-text-secondary mt-1">Manage materials, densities, and prices — grouped by technology.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} icon={showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
          {showAddForm ? 'Cancel' : 'Add Material'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger animate-scale-in">{error}</div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent animate-scale-in">✓ {successMsg}</div>
      )}

      {/* Add Material Form */}
      {showAddForm && (
        <Card className="mb-6 border-primary/20 bg-primary/5 animate-slide-up">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> New Material
          </h2>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" placeholder="e.g. ASA" value={newMaterial.name} onChange={(e) => setNewMaterial(p => ({ ...p, name: e.target.value }))} required />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Technology</label>
              <select
                value={newMaterial.technology_id}
                onChange={(e) => setNewMaterial(p => ({ ...p, technology_id: e.target.value }))}
                className="w-full rounded-xl bg-bg-secondary border border-border-primary text-text-primary text-sm px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              >
                <option value="">Select technology</option>
                {technologies.map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.name} — {t.full_name}</option>
                ))}
              </select>
            </div>
            <Input label="Density (g/cm³)" type="number" step="0.01" placeholder="1.24" value={newMaterial.density_g_per_cm3} onChange={(e) => setNewMaterial(p => ({ ...p, density_g_per_cm3: e.target.value }))} required />
            <Input label="Price (₹/g)" type="number" step="0.01" placeholder="3.50" value={newMaterial.price_per_gram} onChange={(e) => setNewMaterial(p => ({ ...p, price_per_gram: e.target.value }))} required />
            <div className="sm:col-span-2">
              <Input label="Description" placeholder="Short description" value={newMaterial.description} onChange={(e) => setNewMaterial(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" isLoading={saving} icon={<Plus className="w-4 h-4" />}>Add Material</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Materials grouped by technology */}
      {loading ? (
        <Card className="text-center py-12">
          <div className="w-8 h-8 border-2 border-text-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading materials...</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {groupedMaterials.map(({ technology: tech, materials: mats }) => (
            <div key={tech.id} className="animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{tech.icon}</span>
                <h2 className="text-base font-bold text-text-primary">{tech.name}</h2>
                <span className="text-xs text-text-muted">— {tech.full_name}</span>
                <div className="flex gap-1.5 ml-auto">
                  {tech.use_infill && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400">Infill</span>}
                  {tech.use_color && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400">Color</span>}
                </div>
              </div>

              <div className="space-y-2">
                {mats.map((mat) => (
                  <MaterialRow
                    key={mat.id}
                    mat={mat}
                    editingId={editingId}
                    editValues={editValues}
                    saving={saving}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={() => setEditingId(null)}
                    onToggle={handleToggle}
                    onEditChange={setEditValues}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Ungrouped materials */}
          {ungrouped.length > 0 && (
            <div className="animate-slide-up">
              <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-text-muted" /> Unassigned
              </h2>
              <div className="space-y-2">
                {ungrouped.map((mat) => (
                  <MaterialRow
                    key={mat.id}
                    mat={mat}
                    editingId={editingId}
                    editValues={editValues}
                    saving={saving}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={() => setEditingId(null)}
                    onToggle={handleToggle}
                    onEditChange={setEditValues}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MaterialRow({ mat, editingId, editValues, saving, onEdit, onSave, onCancel, onToggle, onEditChange }: {
  mat: Material;
  editingId: string | null;
  editValues: { price_per_gram: string; density_g_per_cm3: string };
  saving: boolean;
  onEdit: (m: Material) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onToggle: (id: string, active: boolean) => void;
  onEditChange: (v: { price_per_gram: string; density_g_per_cm3: string }) => void;
}) {
  return (
    <Card className={`${!mat.is_active ? 'opacity-50' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mat.is_active ? 'bg-primary/10' : 'bg-bg-elevated'}`}>
            <Beaker className={`w-5 h-5 ${mat.is_active ? 'text-primary' : 'text-text-muted'}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">{mat.name}</p>
            <p className="text-xs text-text-muted truncate">{mat.description}</p>
          </div>
        </div>

        {editingId === mat.id ? (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-28">
              <label className="text-[10px] text-text-muted mb-0.5 block">Density (g/cm³)</label>
              <input type="number" step="0.01" value={editValues.density_g_per_cm3}
                onChange={(e) => onEditChange({ ...editValues, density_g_per_cm3: e.target.value })}
                className="w-full rounded-lg bg-bg-secondary border border-border-primary text-text-primary text-sm px-2.5 py-1.5 focus:outline-none focus:border-primary" />
            </div>
            <div className="w-28">
              <label className="text-[10px] text-text-muted mb-0.5 block">Price (₹/g)</label>
              <input type="number" step="0.01" value={editValues.price_per_gram}
                onChange={(e) => onEditChange({ ...editValues, price_per_gram: e.target.value })}
                className="w-full rounded-lg bg-bg-secondary border border-border-primary text-text-primary text-sm px-2.5 py-1.5 focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-1.5 mt-4">
              <button onClick={() => onSave(mat.id)} disabled={saving}
                className="p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={onCancel}
                className="p-1.5 rounded-lg bg-bg-elevated text-text-muted hover:text-text-secondary transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-text-muted">Density</p>
              <p className="text-sm font-medium text-text-primary">{mat.density_g_per_cm3} g/cm³</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Price</p>
              <p className="text-sm font-bold text-accent">₹{mat.price_per_gram}/g</p>
            </div>
            <button onClick={() => onEdit(mat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-secondary text-text-secondary border border-border-primary hover:border-primary hover:text-primary transition-all">
              Edit
            </button>
            <button onClick={() => onToggle(mat.id, mat.is_active)}
              className="p-1.5 rounded-lg hover:bg-bg-elevated transition-all" title={mat.is_active ? 'Disable' : 'Enable'}>
              {mat.is_active
                ? <ToggleRight className="w-5 h-5 text-accent" />
                : <ToggleLeft className="w-5 h-5 text-text-muted" />
              }
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
