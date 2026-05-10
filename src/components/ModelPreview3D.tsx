'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Box, Layers, AlertCircle, Loader2 } from 'lucide-react';
import { PREVIEWABLE_EXTENSIONS } from '@/lib/constants';

// Dynamic import to avoid SSR issues
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

interface ModelPreview3DProps {
  files: { file: File; id: string; error?: string }[];
  onVolumeCalculated?: (volumeCm3: number | null) => void;
  onDimensionsCalculated?: (dims: { x: number; y: number; z: number } | null) => void;
  className?: string;
}

function getExtension(filename: string): string {
  return '.' + filename.split('.').pop()?.toLowerCase();
}

function isPreviewable(filename: string): boolean {
  const ext = getExtension(filename);
  return (PREVIEWABLE_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * Calculate volume using signed tetrahedron method.
 * Works for watertight meshes (STL/OBJ). Returns volume in cm³.
 */
function calculateVolumeCm3(geometry: THREE.BufferGeometry): number {
  const position = geometry.attributes.position;
  if (!position) return 0;

  // Ensure we have a non-indexed geometry for triangle iteration
  const geo = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = geo.attributes.position;

  let volume = 0;
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    v1.fromBufferAttribute(pos, i);
    v2.fromBufferAttribute(pos, i + 1);
    v3.fromBufferAttribute(pos, i + 2);
    volume += v1.dot(v2.clone().cross(v3)) / 6;
  }

  // Convert mm³ → cm³ (Three.js STL loader uses mm by default)
  return Math.abs(volume) / 1000;
}

export default function ModelPreview3D({ files, onVolumeCalculated, onDimensionsCalculated, className = '' }: ModelPreview3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Object3D | null>(null);
  const frameRef = useRef<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const validFiles = files.filter(f => !f.error);
  const previewableFiles = validFiles.filter(f => isPreviewable(f.file.name));
  const activeFile = previewableFiles.find(f => f.id === selectedFileId) || previewableFiles[0];

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    // Cleanup existing
    if (rendererRef.current) {
      rendererRef.current.dispose();
      cancelAnimationFrame(frameRef.current);
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(100, 80, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 5000;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 150, 100);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xC9920A, 0.15);
    dirLight2.position.set(-100, 50, -100);
    scene.add(dirLight2);

    // Grid floor — gold-tinted per FORMIQ brand
    const gridHelper = new THREE.GridHelper(200, 20, 0x3D2E0A, 0x2A2005);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
    };
  }, []);

  // Load model
  const loadModel = useCallback(async (file: File) => {
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;

    setLoading(true);
    setError(null);

    // Remove previous mesh
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current = null;
    }

    try {
      const ext = getExtension(file.name);
      const arrayBuffer = await file.arrayBuffer();
      let geometry: THREE.BufferGeometry | null = null;
      let object: THREE.Object3D | null = null;

      switch (ext) {
        case '.stl': {
          const loader = new STLLoader();
          geometry = loader.parse(arrayBuffer);
          break;
        }
        case '.obj': {
          const loader = new OBJLoader();
          const text = new TextDecoder().decode(arrayBuffer);
          object = loader.parse(text);
          // Extract geometry from first mesh for volume calculation
          object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !geometry) {
              geometry = (child as THREE.Mesh).geometry as THREE.BufferGeometry;
            }
          });
          break;
        }
        case '.ply': {
          const loader = new PLYLoader();
          geometry = loader.parse(arrayBuffer);
          break;
        }
        default:
          setError(`Preview not supported for ${ext} files`);
          setLoading(false);
          return;
      }

      // Calculate volume
      let volumeCm3: number | null = null;
      if (geometry) {
        geometry.computeVertexNormals();
        volumeCm3 = calculateVolumeCm3(geometry);
      }

      // Create mesh if we have geometry but no object
      if (geometry && !object) {
        const material = new THREE.MeshPhongMaterial({
          color: 0x2A4070,
          specular: 0x3D2E0A,
          shininess: 50,
          wireframe: wireframe,
          flatShading: false,
        });
        object = new THREE.Mesh(geometry, material);
      }

      if (!object) {
        setError('Failed to parse model');
        setLoading(false);
        return;
      }

      // Set wireframe on all meshes
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshPhongMaterial;
          if (mat.wireframe !== undefined) mat.wireframe = wireframe;
        }
      });

      // Auto-center and fit
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      object.position.sub(center);
      object.position.y += size.y / 2; // Place on grid

      sceneRef.current.add(object);
      meshRef.current = object;

      // Fit camera
      const distance = maxDim * 2;
      cameraRef.current.position.set(distance * 0.7, distance * 0.5, distance * 0.7);
      controlsRef.current.target.set(0, size.y / 2, 0);
      controlsRef.current.update();

      // Report volume
      if (onVolumeCalculated) {
        onVolumeCalculated(volumeCm3 && volumeCm3 > 0 ? volumeCm3 : null);
      }

      // Report bounding box dimensions
      if (onDimensionsCalculated) {
        const dimBox = new THREE.Box3().setFromObject(object);
        const dimSize = dimBox.getSize(new THREE.Vector3());
        onDimensionsCalculated({ x: dimSize.x, y: dimSize.y, z: dimSize.z });
      }
    } catch (err) {
      console.error('Model load error:', err);
      setError('Failed to load model. The file may be corrupted.');
      if (onVolumeCalculated) onVolumeCalculated(null);
    } finally {
      setLoading(false);
    }
  }, [wireframe, onVolumeCalculated]);

  // Toggle wireframe
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshPhongMaterial;
          if (mat.wireframe !== undefined) mat.wireframe = wireframe;
        }
      });
    }
  }, [wireframe]);

  // Initialize scene on mount
  useEffect(() => {
    const cleanup = initScene();
    return () => { if (cleanup) cleanup(); };
  }, [initScene]);

  // Load active file
  useEffect(() => {
    if (activeFile) {
      loadModel(activeFile.file);
    }
  }, [activeFile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset camera
  const resetView = () => {
    if (!cameraRef.current || !controlsRef.current || !meshRef.current) return;
    const box = new THREE.Box3().setFromObject(meshRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2;
    cameraRef.current.position.set(distance * 0.7, distance * 0.5, distance * 0.7);
    controlsRef.current.target.set(0, size.y / 2, 0);
    controlsRef.current.update();
  };

  // No previewable files
  if (validFiles.length === 0) return null;

  const hasNonPreviewable = validFiles.some(f => !isPreviewable(f.file.name));
  const hasPreviewable = previewableFiles.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* File selector tabs (when multiple previewable files) */}
      {previewableFiles.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {previewableFiles.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFileId(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (activeFile?.id === f.id)
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-bg-secondary text-text-muted border border-border-primary hover:text-text-secondary'
              }`}
            >
              {f.file.name}
            </button>
          ))}
        </div>
      )}

      {/* Preview canvas */}
      {hasPreviewable && (
        <div className="relative rounded-2xl overflow-hidden border border-border-primary bg-[#1a1a1a]">
          {/* Toolbar */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`p-2 rounded-lg backdrop-blur-sm text-xs font-medium transition-all ${
                wireframe
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-black/50 text-white/70 border border-white/10 hover:text-white'
              }`}
              title={wireframe ? 'Solid view' : 'Wireframe view'}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 rounded-lg bg-black/50 text-white/70 border border-white/10 hover:text-white backdrop-blur-sm transition-all"
              title="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Label */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
            <Box className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-white/80 font-medium">3D Preview</span>
          </div>

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-text-secondary">Loading model...</p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && !loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <AlertCircle className="w-8 h-8 text-danger" />
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
            </div>
          )}

          {/* Three.js canvas */}
          <div
            ref={containerRef}
            className="w-full aspect-square md:aspect-[4/3] min-h-[400px]"
          />
        </div>
      )}

      {/* Fallback for non-previewable files */}
      {hasNonPreviewable && (
        <div className="rounded-xl bg-bg-secondary border border-border-primary p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-text-primary">Preview not available</p>
            <p className="text-xs text-text-muted mt-0.5">
              Some uploaded file types can&apos;t be previewed in the browser. Your files have been accepted and will be reviewed by our team.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
