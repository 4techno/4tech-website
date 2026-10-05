'use client';

import React, { useRef, useEffect, useCallback } from 'react';

export interface AsciiWavesProps {
  characters?: string;
  color?: string;
  waveTension?: number;
  waveTwist?: number;
  invert?: boolean;
  noiseScale?: number;
  elementSize?: number;
  speed?: number;
  hasCursorInteraction?: boolean;
  intensity?: number;
  interactionIntensity?: number;
  className?: string;
  videoUrl?: string;
}

/**
 * Ascii Waves — Wave effect crafted from animated ASCII characters.
 * Implements the React Bits Pro API with professional red styling and high-performance canvas rendering.
 */
export default function AsciiWaves({
  characters = ' .:-+*=%@#',
  color = '#E52320', // Professional red
  waveTension = 0.5,
  waveTwist = 0.15,
  invert = false,
  noiseScale = 1.0,
  elementSize = 14,
  speed = 1.0,
  hasCursorInteraction = true,
  intensity = 1.0,
  interactionIntensity = 1.2,
  className = '',
}: AsciiWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Smooth pointer tracking
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    radius: 220,
  });

  // Parse color to rgb components
  const rgb = React.useMemo(() => {
    let hex = color.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(hex, 16);
    if (isNaN(num) || hex.length !== 6) {
      return { r: 229, g: 35, b: 32 }; // fallback professional red (#E52320)
    }
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }, [color]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.targetX = e.clientX - rect.left;
    pointerRef.current.targetY = e.clientY - rect.top;
    pointerRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    const charW = Math.max(8, Math.round(elementSize * 0.62));
    const charH = Math.max(10, Math.round(elementSize * 1.05));

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.font = `${Math.round(elementSize)}px var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace`;

      cols = Math.ceil(width / charW);
      rows = Math.ceil(height / charH);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Pause animation when off-screen
    const io = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    io.observe(container);

    let startTime = performance.now();
    const charsLen = characters.length;

    const render = (now: number) => {
      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = (now - startTime) * 0.001 * speed;

      // Pointer lerping
      const p = pointerRef.current;
      if (p.active) {
        p.x += (p.targetX - p.x) * 0.12;
        p.y += (p.targetY - p.y) * 0.12;
      } else {
        p.x += (-9999 - p.x) * 0.05;
        p.y += (-9999 - p.y) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      const tension = waveTension * 3.2;
      const twist = waveTwist * 2.8;
      const scale = noiseScale;
      const pRadius = p.radius;
      const pRadiusSq2 = 2 * (pRadius * 0.45) * (pRadius * 0.45);

      for (let r = 0; r < rows; r++) {
        const py = r * charH;
        const ny = ((r / rows) - 0.5) * 2 * scale;

        for (let c = 0; c < cols; c++) {
          const px = c * charW;
          const nx = ((c / cols) - 0.5) * 2 * scale;

          const distCenter = Math.hypot(nx, ny);
          const angle = Math.atan2(ny, nx);

          // Multi-layer harmonic sine wave equation
          const w1 = Math.sin(nx * tension + elapsed * 1.6);
          const w2 = Math.cos(ny * tension - elapsed * 1.3);
          const w3 = Math.sin(distCenter * 4.2 - elapsed * 2.1 + angle * twist);

          let wave = (w1 * 0.45 + w2 * 0.35 + w3 * 0.2);

          // Interactive cursor perturbation
          if (hasCursorInteraction && p.x > -1000) {
            const dx = px - p.x;
            const dy = py - p.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < pRadius * pRadius) {
              const d = Math.sqrt(distSq);
              const attenuation = Math.exp(-distSq / pRadiusSq2);
              const ripple = Math.sin(d * 0.05 - elapsed * 4.5) * attenuation * interactionIntensity;
              wave += ripple * 0.7;
            }
          }

          // Normalize wave to [0, 1]
          let norm = (wave * intensity + 1) * 0.5;
          norm = Math.max(0, Math.min(1, norm));

          if (invert) {
            norm = 1 - norm;
          }

          const charIdx = Math.min(charsLen - 1, Math.floor(norm * charsLen));
          const char = characters[charIdx];

          if (char && char !== ' ') {
            // Modulate opacity and luminance in professional red spectrum
            const alpha = 0.18 + norm * 0.82;
            const brightness = Math.floor(norm * 45); // subtle highlight on peaks
            const cr = Math.min(255, rgb.r + brightness);
            const cg = Math.min(255, rgb.g + Math.floor(brightness * 0.4));
            const cb = Math.min(255, rgb.b + Math.floor(brightness * 0.4));

            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
            ctx.fillText(char, px, py);
          }
        }
      }

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      io.disconnect();
    };
  }, [
    characters,
    rgb,
    waveTension,
    waveTwist,
    invert,
    noiseScale,
    elementSize,
    speed,
    hasCursorInteraction,
    intensity,
    interactionIntensity,
  ]);

  return (
    <div
      ref={containerRef}
      onPointerMove={hasCursorInteraction ? handlePointerMove : undefined}
      onPointerLeave={hasCursorInteraction ? handlePointerLeave : undefined}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
