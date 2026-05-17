'use client';

import React, { useEffect, useState } from 'react';
import ModelPreview3D from '@/components/ModelPreview3D';
import { Loader2 } from 'lucide-react';

// Hardcoded list of gallery models we generated
const GALLERY_MODELS = [
  {
    id: 'calibration-cube',
    name: '20mm Calibration Cube',
    url: '/models/calibration_cube_20mm.stl',
    description: 'A standard 20x20x20mm cube used for calibrating X, Y, and Z axes on 3D printers.',
  },
  {
    id: 'precision-block',
    name: '50mm Precision Block',
    url: '/models/precision_block_50mm.stl',
    description: 'A larger 50x50x50mm block for testing dimensional accuracy and layer consistency over larger prints.',
  }
];

export default function GalleryPage() {
  const [files, setFiles] = useState<{ file: File; id: string; error?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModels() {
      try {
        const loadedFiles = await Promise.all(
          GALLERY_MODELS.map(async (model) => {
            try {
              const res = await fetch(model.url);
              if (!res.ok) throw new Error(`Failed to fetch ${model.url}`);
              const blob = await res.blob();
              // Create a File object from the blob
              const file = new File([blob], `${model.name}.stl`, { type: 'model/stl' });
              return { file, id: model.id };
            } catch (err) {
              console.error(err);
              return { 
                file: new File([], `${model.name}.stl`), 
                id: model.id, 
                error: 'Could not load model' 
              };
            }
          })
        );
        setFiles(loadedFiles);
      } catch (err) {
        console.error('Error loading gallery models:', err);
      } finally {
        setLoading(false);
      }
    }

    loadModels();
  }, []);

  return (
    <div className="bg-[#0A0A0F] min-h-screen pb-24">
      {/* Header section */}
      <div className="relative pt-32 pb-20 border-b border-border-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/80 to-[#0A0A0F] z-10" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6">
            Interactive <span className="text-primary">3D Gallery</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Browse our collection of precision test models and standard 3D prints. 
            Use your mouse or touch screen to rotate, pan, and zoom the interactive previews below.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-secondary tracking-widest text-sm font-medium uppercase">Loading Models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Viewer Column */}
            <div className="lg:col-span-8">
              <div className="sticky top-24">
                <div className="p-1 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent">
                  <ModelPreview3D files={files} />
                </div>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary"></span>
                Featured Models
              </h3>
              
              <div className="space-y-4">
                {GALLERY_MODELS.map((model) => (
                  <div key={model.id} className="p-5 rounded-xl border border-border-primary bg-bg-secondary hover:border-primary/50 transition-colors">
                    <h4 className="font-medium text-text-primary mb-2">{model.name}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {model.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
                      <span className="px-2 py-1 rounded bg-black/50">STL Format</span>
                      <span className="px-2 py-1 rounded bg-black/50">Watertight</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-semibold text-primary mb-2">Have your own design?</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Upload your STL or OBJ files to get an instant quote and bring your ideas to life.
                </p>
                <a href="/orders/new" className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-primary text-black font-medium text-sm hover:opacity-90 transition-opacity btn-glow">
                  Upload Custom Model
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
