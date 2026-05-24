import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, AlertTriangle, HelpCircle, HardDrive, Cpu, Compass } from 'lucide-react';

export const metadata = {
  title: 'FDM 3D Printing Design Guidelines — HELIX',
  description: 'Learn how to optimize your 3D models for FDM printing. Read our guidelines on wall thickness, overhangs, holes, tolerances, and STL exports.',
};

export default function DesignGuidePage() {
  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: '#0A0A0F', color: '#F5F0E8' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-4" style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <BookOpen className="w-8 h-8" style={{ color: '#C9A84C' }} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-wide mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Design Guidelines for <span style={{ color: '#C9A84C' }}>FDM Printing</span>
          </h1>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: '#C9A84C' }} />
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#9CA3AF' }}>
            Optimize your 3D models to guarantee maximum print quality, accuracy, and strength while avoiding common print failures.
          </p>
        </div>

        {/* 2. Quick Summary Card */}
        <div className="rounded-2xl p-6 sm:p-8 mb-12" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-5 h-5" style={{ color: '#C9A84C' }} />
            <h2 className="text-lg font-medium tracking-wider uppercase" style={{ color: '#C9A84C' }}>The 5 Golden Rules of FDM</h2>
          </div>
          <ul className="space-y-3.5 text-sm" style={{ color: '#F5F0E8' }}>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>01</span>
              <span><strong>Wall Thickness:</strong> Structural parts require a minimum of <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">1.2mm</code> (3 shells). Decorative parts can go down to <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">0.8mm</code>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>02</span>
              <span><strong>Overhangs:</strong> Keep angles under <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">45°</code> to print cleanly without supports. Anything steeper will require removable supports.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>03</span>
              <span><strong>Hole Clearance:</strong> Add <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">0.2mm</code> tolerance to hole diameters (e.g., model a 5.0mm hole as <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">5.2mm</code>) to compensate for FDM shrink.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>04</span>
              <span><strong>Tolerances:</strong> Standard FDM accuracy is <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">±0.2mm</code>. For large parts (&gt;150mm), design with <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/40 text-[#C9A84C]">±0.5mm</code> clearances.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>05</span>
              <span><strong>Watertight Geometry:</strong> Ensure your model is a single, closed, solid manifold volume. Open boundaries or floating shells will cause slicing issues.</span>
            </li>
          </ul>
        </div>

        {/* Grid of Sections */}
        <div className="space-y-12">

          {/* 3. Wall Thickness */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>3. Wall Thickness</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
              Proper wall thickness is the primary determinant of part strength. In FDM printing, walls are formed by concentric extrusions called "perimeters" or "shells".
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-5 bg-red-950/20 border border-red-900/30">
                <p className="text-sm font-semibold text-red-400 mb-2">❌ Thin Walls (&lt; 0.8mm)</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  Walls narrower than the nozzle width (typically 0.4mm) cannot be printed at all. Walls under 0.8mm are fragile, easily delaminate, and result in visual holes.
                </p>
              </div>
              <div className="rounded-xl p-5 bg-emerald-950/20 border border-emerald-900/30">
                <p className="text-sm font-semibold text-emerald-400 mb-2">✅ Structural Walls (≥ 1.2mm)</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  Provides 3 full perimeters. This delivers robust mechanical integrity, prevents infill show-through, and guarantees structural durability under stress.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Overhangs */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>4. Overhangs</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
              Since FDM prints layers bottom-up, each layer requires support from the layer beneath it. Overhanging features that stick out without support can sag or fail.
            </p>
            <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:text-left flex-1">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>The 45-Degree Rule</h4>
                  <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                    Angles up to <strong>45°</strong> from the vertical can be printed cleanly because each new layer overlaps enough with the previous one. Anything steeper than 45° requires support structures, which add to print time, material use, and leave slight marks when removed.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-28 h-20 bg-black/40 rounded border border-gray-800 font-mono text-xs text-center p-2">
                  <div>
                    <div className="text-[#C9A84C] font-bold text-lg">≤ 45°</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Self-Supporting</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Hole Diameter */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>5. Hole Diameter Tolerances</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#9CA3AF' }}>
              As thermoplastic is extruded in circles, it experiences slight shrinkage and tension, pulling the outer boundaries inward. This makes printed holes slightly smaller than modelled.
            </p>
            <div className="rounded-xl p-5" style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(201,168,76,0.1)' }}>
              <ul className="space-y-3 text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                <li>
                  ⚙️ <strong>Standard Clearance:</strong> Always add <code className="font-mono px-1 py-0.5 rounded bg-black/40 text-[#C9A84C]">+0.2mm</code> to your hole diameters. If you need a bolt to pass through a 5.0mm opening, design the hole in CAD as <code className="font-mono text-[#C9A84C]">5.2mm</code>.
                </li>
                <li>
                  🔩 <strong>Threaded Openings:</strong> For M-series or imperial threads, design to their standard nominal size. FDM shrink can be used constructively to allow tapped screws to grab tightly, or you can use brass heat-set inserts for maximum strength.
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Tolerances */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>6. Dimensional Accuracy & Tolerances</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#9CA3AF' }}>
              FDM parts have natural dimensional deviations due to layer stacking, thermal expansion, and mechanical motion tolerances.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-5 bg-black/40 border border-gray-800">
                <h4 className="text-sm font-semibold mb-1 text-white">±0.20mm</h4>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>Typical Tolerances</p>
                <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                  For small-to-medium parts under 100mm, this is our standard print envelope accuracy.
                </p>
              </div>
              <div className="rounded-xl p-5 bg-black/40 border border-gray-800">
                <h4 className="text-sm font-semibold mb-1 text-white">±0.50mm</h4>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>Large-Scale Tolerances</p>
                <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                  For parts exceeding 150mm. Large thermoplastic volumes expand and warp slightly as they cool down.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Support Requirements */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>7. Support Requirements & Design Tips</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
              Minimizing support structures saves material, reduces your print cost, and delivers superior surface finishes.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-5 bg-black/30 border border-gray-800">
                <p className="text-sm font-semibold text-white mb-2">🔄 Use Chamfers instead of Fillets</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  Fillets create steep overhang angles near the build plate that require support. A 45° chamfer creates a self-supporting incline that prints beautifully without support.
                </p>
              </div>
              <div className="rounded-xl p-5 bg-black/30 border border-gray-800">
                <p className="text-sm font-semibold text-white mb-2">🧭 Orient For Success</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  Choose the orientation of your part to maximize the contact area with the build plate. This enhances build stability and removes unnecessary overhang heights.
                </p>
              </div>
            </div>
          </section>

          {/* 8. How to Export STL */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>8. How to Export STL Files</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
              Ensure your meshes have adequate resolution before export. Low polygon models will show faceted circles, while overly dense files unnecessarily delay slicing.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-black/40 border border-gray-800">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C9A84C' }}>Fusion 360</p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-400">
                  <li>Right-click Component</li>
                  <li>Click "Save As Mesh"</li>
                  <li>Select <strong>STL (Binary)</strong></li>
                  <li>Refinement: <strong>High</strong></li>
                </ol>
              </div>
              <div className="rounded-xl p-4 bg-black/40 border border-gray-800">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C9A84C' }}>SolidWorks</p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-400">
                  <li>File → Save As</li>
                  <li>Type: <strong>STL (*.stl)</strong></li>
                  <li>Click <strong>Options</strong></li>
                  <li>Resolution: <strong>Fine</strong></li>
                </ol>
              </div>
              <div className="rounded-xl p-4 bg-black/40 border border-gray-800">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C9A84C' }}>Blender</p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-400">
                  <li>Select your Object</li>
                  <li>File → Export → STL</li>
                  <li>Check <strong>"Selection Only"</strong></li>
                  <li>Check <strong>"Apply Modifiers"</strong></li>
                </ol>
              </div>
            </div>
          </section>

          {/* 9. Watertight Geometry */}
          <section className="pb-8 border-b border-gray-800">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>9. Watertight Solid Geometry</h3>
            <div className="flex gap-4 items-start rounded-xl p-5" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="text-sm font-semibold text-red-400 mb-1">Prevent Slicing Engine Disasters</p>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  FDM slicing engines must distinguish what is "inside" the solid and what is "outside" to compute infill paths. If your model contains open shells, zero-thickness walls, or non-manifold edges, the slicer will fail or create void errors. We recommend using <strong>Autodesk Meshmixer</strong> or <strong>Netfabb</strong> to repair open boundary boundaries before upload.
                </p>
              </div>
            </div>
          </section>

          {/* 10. File Size & Complexity */}
          <section className="pb-12">
            <h3 className="text-xl font-medium tracking-wide mb-3" style={{ color: '#C9A84C' }}>10. File Size & Complexity Limits</h3>
            <div className="flex gap-4 items-start rounded-xl p-5 bg-black/40 border border-gray-800">
              <HardDrive className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />
              <div>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  We recommend keeping STL models under <strong>50MB</strong>. For models exceeding 50MB, consider reducing the polygon count using a decimator (such as in Meshmixer or Blender). Models up to <strong>200MB</strong> will still be accepted for production printing, but will bypass our client-side interactive 3D WebGL renderer due to browser memory limits.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* 11. CTA Strip */}
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#0D1B2A', border: '1.5px solid #C9A84C', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <h3 className="text-2xl font-light mb-2 text-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Ready to Print?
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
            Upload your fully-validated CAD file and get an instant, itemized auto-calculated quote in seconds.
          </p>
          <Link
            href="/orders/new/fdm"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium rounded-lg transition-all btn-glow"
            style={{ backgroundColor: '#C9A84C', color: '#0A0A0F', letterSpacing: '0.04em' }}
          >
            Place an Order <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
