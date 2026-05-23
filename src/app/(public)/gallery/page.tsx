'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModelPreview3D from '@/components/ModelPreview3D';
import { Loader2, ZoomIn } from 'lucide-react';

// Hardcoded list of gallery models
const GALLERY_MODELS = [
  {
    id: 'calibration-cube',
    name: '20mm Calibration Cube',
    url: '/models/calibration_cube_20mm.stl',
    description: 'A standard 20×20×20 mm cube used for calibrating X, Y, and Z axes on 3D printers.',
  },
  {
    id: 'precision-block',
    name: '50mm Precision Block',
    url: '/models/precision_block_50mm.stl',
    description: 'A larger 50×50×50 mm block for testing dimensional accuracy and layer consistency.',
  },
];

// Real print showcase photos
const PRINT_PHOTOS = [
  {
    src: '/gallery/print_gear_assembly.png',
    title: 'Mechanical Gear Assembly',
    tech: 'FDM · Matte Black PLA',
    desc: 'High-tolerance interlocking gears printed with precision FDM for smooth mechanical operation.',
  },
  {
    src: '/gallery/print_architectural_model.png',
    title: 'Architectural Scale Model',
    tech: 'FDM · White PLA',
    desc: 'Detailed architectural scale model printed with fine-layer FDM for crisp edges and clean surfaces.',
  },
  {
    src: '/gallery/print_dragon_figurine.png',
    title: 'Dragon Figurine',
    tech: 'FDM · Black PLA',
    desc: 'Highly detailed collectible figurine showcasing the surface quality achievable with fine-layer FDM printing.',
  },
  {
    src: '/gallery/print_prosthetic_hand.png',
    title: 'Prosthetic Mechanical Hand',
    tech: 'FDM · PETG',
    desc: 'Functional prosthetic hand design demonstrating the real-world medical and assistive applications of 3D printing.',
  },
  {
    src: '/gallery/print_jewelry_ring.png',
    title: 'Custom Lattice Ring',
    tech: 'FDM · White PLA',
    desc: 'Intricate lattice-patterned ring prototype produced with fine-layer FDM for design validation.',
  },
];


export default function GalleryPage() {
  const [files, setFiles] = useState<{ file: File; id: string; error?: string }[]>([]);
  const [stlLoading, setStlLoading] = useState(true);
  const [lightbox, setLightbox] = useState<null | typeof PRINT_PHOTOS[0]>(null);

  useEffect(() => {
    async function loadModels() {
      try {
        const loadedFiles = await Promise.all(
          GALLERY_MODELS.map(async (model) => {
            try {
              const res = await fetch(model.url);
              if (!res.ok) throw new Error(`Failed to fetch ${model.url}`);
              const blob = await res.blob();
              const file = new File([blob], `${model.name}.stl`, { type: 'model/stl' });
              return { file, id: model.id };
            } catch (err) {
              console.error(err);
              return {
                file: new File([], `${model.name}.stl`),
                id: model.id,
                error: 'Could not load model',
              };
            }
          })
        );
        setFiles(loadedFiles);
      } catch (err) {
        console.error('Error loading gallery models:', err);
      } finally {
        setStlLoading(false);
      }
    }
    loadModels();
  }, []);

  return (
    <div className="bg-[#0A0A0F] min-h-screen pb-24">

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              ✕ Close
            </button>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.25)]">
              <Image src={lightbox.src} alt={lightbox.title} fill className="object-cover" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-[#F5F0E8] font-medium">{lightbox.title}</p>
              <p className="text-[#C9A84C] text-sm mt-1">{lightbox.tech}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="relative pt-32 pb-20 border-b border-[rgba(201,168,76,0.12)] overflow-hidden">
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
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ color: '#F5F0E8' }}>
            Our <span style={{ color: '#C9A84C' }}>3D Print Gallery</span>
          </h1>
          <p className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed" style={{ color: '#9CA3AF' }}>
            From precision mechanical parts to intricate artistic figurines — browse real prints from the HELIX studio, then interact with our live 3D models below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Photo Grid ── */}
        <section className="py-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#C9A84C]" />
            <h2 className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>Print Showcase</h2>
            <span className="flex-1 h-px bg-[rgba(201,168,76,0.12)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRINT_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="group relative rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.12)] cursor-pointer"
                style={{ backgroundColor: '#0D1B2A' }}
                onClick={() => setLightbox(photo)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
                  </div>
                  {/* Tech badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium tracking-wider" style={{ backgroundColor: 'rgba(10,10,15,0.85)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                    {photo.tech}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-medium mb-1.5" style={{ color: '#F5F0E8' }}>{photo.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{photo.desc}</p>
                </div>
              </div>
            ))}

            {/* CTA card in last slot on large screens */}
            <div
              className="rounded-2xl border border-dashed flex flex-col items-center justify-center p-8 text-center"
              style={{ borderColor: 'rgba(201,168,76,0.25)', backgroundColor: 'rgba(201,168,76,0.03)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <span className="text-xl" style={{ color: '#C9A84C' }}>+</span>
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#C9A84C' }}>Your print here?</h4>
              <p className="text-sm mb-5" style={{ color: '#6B6B6B' }}>Upload your design and we&apos;ll turn it into reality.</p>
              <a
                href="/orders/new"
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 btn-glow"
                style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
              >
                Start Printing
              </a>
            </div>
          </div>
        </section>

        {/* ── Interactive 3D Models ── */}
        <section className="py-16 border-t border-[rgba(201,168,76,0.1)]">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#C9A84C]" />
            <h2 className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>Interactive 3D Viewer</h2>
            <span className="flex-1 h-px bg-[rgba(201,168,76,0.12)]" />
          </div>
          <p className="text-sm mb-10" style={{ color: '#6B6B6B' }}>
            Rotate · Zoom · Pan — interact with our sample models directly in your browser.
          </p>

          {stlLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#C9A84C' }} />
              <p className="text-sm tracking-widest uppercase" style={{ color: '#6B6B6B' }}>Loading Models...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Viewer */}
              <div className="lg:col-span-8">
                <div className="sticky top-24 p-1 rounded-2xl" style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.15), transparent)' }}>
                  <ModelPreview3D files={files} />
                </div>
              </div>

              {/* Model list */}
              <div className="lg:col-span-4 space-y-4">
                {GALLERY_MODELS.map((model) => (
                  <div key={model.id} className="p-5 rounded-xl border transition-colors" style={{ borderColor: 'rgba(201,168,76,0.15)', backgroundColor: '#0D1B2A' }}>
                    <h4 className="font-medium mb-2" style={{ color: '#F5F0E8' }}>{model.name}</h4>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B6B' }}>{model.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#C9A84C' }}>STL Format</span>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#C9A84C' }}>Watertight</span>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-6 rounded-xl border" style={{ borderColor: 'rgba(201,168,76,0.2)', backgroundColor: 'rgba(201,168,76,0.05)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#C9A84C' }}>Have your own design?</h4>
                  <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
                    Upload any STL or OBJ file to get an instant quote.
                  </p>
                  <a
                    href="/orders/new"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 btn-glow"
                    style={{ backgroundColor: '#C9A84C', color: '#0A0A0F' }}
                  >
                    Upload Custom Model
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
