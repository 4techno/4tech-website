'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styles from './analog-camera-3d.module.css';

type ModelKey = 'camera' | 'film';

interface ModelConfig {
  key: ModelKey;
  label: string;
  path: string;
  defaultDistance: number;
}

const MODELS: ModelConfig[] = [
  {
    key: 'camera',
    label: 'Canon F-1 System',
    path: '/assets/3d/cannonF1_v2.glb',
    defaultDistance: 2.8,
  },
  {
    key: 'film',
    label: 'Kodak UltraMax 400 Roll',
    path: '/assets/3d/film-roll-ultramax.glb',
    defaultDistance: 2.4,
  },
];

export default function AnalogCamera3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeModel, setActiveModel] = useState<ModelKey>('camera');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Internal Three.js references
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const currentObjectRef = useRef<THREE.Object3D | null>(null);

  // Hotspot preset views
  const applyView = (posX: number, posY: number, posZ: number, targetY = 0) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    // Smooth transition
    const startPos = cam.position.clone();
    const endPos = new THREE.Vector3(posX, posY, posZ);
    const startTarget = ctrl.target.clone();
    const endTarget = new THREE.Vector3(0, targetY, 0);

    let progress = 0;
    const animateView = () => {
      progress += 0.05;
      if (progress > 1) progress = 1;
      cam.position.lerpVectors(startPos, endPos, progress);
      ctrl.target.lerpVectors(startTarget, endTarget, progress);
      ctrl.update();

      if (progress < 1) {
        requestAnimationFrame(animateView);
      }
    };
    animateView();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    let animId: number;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c0e);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.2, 1.4, 2.6);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.85;
    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip below ground
    controlsRef.current = controls;

    // 5. Darkroom studio lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Warm key light (simulating analog tungsten/darkroom lamp)
    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Warm amber rim light
    const rimLight = new THREE.DirectionalLight(0xfc6b2f, 2.4);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Soft cool fill light
    const fillLight = new THREE.DirectionalLight(0xaad4f5, 1.2);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // 6. GLTF Loader
    const loader = new GLTFLoader();
    const config = MODELS.find(m => m.key === activeModel) || MODELS[0];

    setLoading(true);
    setLoadError(null);

    loader.load(
      config.path,
      gltf => {
        if (destroyed) return;
        const root = gltf.scene;

        // Auto-center & auto-scale to standard bounding sphere
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.6 / (maxDim || 1);

        root.position.sub(center.multiplyScalar(scale));
        root.scale.setScalar(scale);

        // Enhance materials
        root.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.2, mat.roughness ?? 0.5);
              mat.metalness = Math.min(0.9, mat.metalness ?? 0.4);
            }
          }
        });

        scene.add(root);
        currentObjectRef.current = root;
        setLoading(false);

        // Reset camera position
        camera.position.set(config.defaultDistance * 0.8, config.defaultDistance * 0.5, config.defaultDistance);
        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      err => {
        console.error('Failed to load 3D model:', err);
        if (!destroyed) {
          setLoading(false);
          setLoadError('Could not load 3D asset. Running interactive fallback.');
        }
      }
    );

    // 7. Resize listener
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Render loop
    const animate = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (currentObjectRef.current) {
        scene.remove(currentObjectRef.current);
      }
    };
  }, [activeModel]);

  return (
    <section id="camera-3d" className={styles.section} aria-labelledby="camera-3d-title">
      <div className={styles.shell}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              [ 3D WORKSHOP / WEBGL ENGINE ]
            </span>
            <h2 id="camera-3d-title" className={styles.title}>
              Analog Camera & Film 3D Studio
            </h2>
            <p className={styles.subtitle}>
              Real-time WebGL inspection of mechanical SLR anatomy and 35mm film rolls from the official analog photography repository.
            </p>
          </div>

          {/* Switcher Buttons */}
          <div className={styles.modelSwitcher} role="group" aria-label="Select 3D model">
            {MODELS.map(m => (
              <button
                key={m.key}
                type="button"
                className={`${styles.switchBtn} ${activeModel === m.key ? styles.switchBtnActive : ''}`}
                onClick={() => setActiveModel(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div ref={containerRef} className={styles.viewportContainer}>
          <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive 3D model viewer" />

          {/* Loading Overlay */}
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} aria-hidden="true" />
              <span className={styles.loadingText}>INITIALIZING WEBGL SHADERS...</span>
            </div>
          )}

          {/* Load error message */}
          {loadError && (
            <div className={styles.loadingOverlay}>
              <span className={styles.loadingText} style={{ color: '#ff6b6b' }}>
                {loadError}
              </span>
            </div>
          )}

          {/* Hotspot Presets */}
          {activeModel === 'camera' && !loading && (
            <div className={styles.hotspotBar} role="group" aria-label="Camera inspection presets">
              <button type="button" className={styles.hotspotBtn} onClick={() => applyView(0, 1.8, 1.8, 0.4)}>
                Pentaprism
              </button>
              <button type="button" className={styles.hotspotBtn} onClick={() => applyView(0, 0.1, 2.2, 0)}>
                50mm f/1.4 Lens
              </button>
              <button type="button" className={styles.hotspotBtn} onClick={() => applyView(1.5, 1.2, 1.2, 0.2)}>
                Film Advance Lever
              </button>
              <button type="button" className={styles.hotspotBtn} onClick={() => applyView(2.2, 1.4, 2.6, 0)}>
                Reset View
              </button>
            </div>
          )}

          {/* Bottom Hint & External Links */}
          <div className={styles.bottomOverlay}>
            <span className={styles.hint}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="m8 12 4-4 4 4" />
              </svg>
              Click & drag to inspect 360° • Scroll wheel to zoom
            </span>

            <div className={styles.actions}>
              <a
                href="https://github.com/Jishnu09-siuu/analog-editorial-portfolio.git"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoBtn}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Repository</span>
              </a>

              <a
                href="https://julianvance.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.liveDemoBtn}
              >
                <span>Live Site</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
