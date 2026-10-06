'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  colorType: 'ember' | 'ruby' | 'stardust' | 'cyan';
  phase: number;
  phaseSpeed: number;
}

interface TouchRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface ReactiveBackgroundProps {
  className?: string;
  enableSpotlight?: boolean;
  enableParticles?: boolean;
  enableRings?: boolean;
  enableRipples?: boolean;
}

export default function ReactiveBackground({
  className = '',
  enableSpotlight = true,
  enableParticles = true,
  enableRings = true,
  enableRipples = true,
}: ReactiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const secondarySpotlightRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<SVGSVGElement>(null);

  // Position coordinates for smooth lerping
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    active: false,
    lastInteraction: 0,
  });

  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<TouchRipple[]>([]);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Track pointer movements (mouse and stylus)
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerRef.current.targetX = x;
    pointerRef.current.targetY = y;
    pointerRef.current.active = true;
    pointerRef.current.lastInteraction = performance.now();
  }, []);

  // Track touch start and movement for mobile reactivity
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    pointerRef.current.targetX = x;
    pointerRef.current.targetY = y;
    pointerRef.current.active = true;
    pointerRef.current.lastInteraction = performance.now();

    if (enableRipples) {
      ripplesRef.current.push({
        x,
        y,
        radius: 8,
        maxRadius: 140,
        alpha: 0.55,
        speed: 3.2,
      });
      if (ripplesRef.current.length > 5) ripplesRef.current.shift();
    }
  }, [enableRipples]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    pointerRef.current.targetX = x;
    pointerRef.current.targetY = y;
    pointerRef.current.active = true;
    pointerRef.current.lastInteraction = performance.now();
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 640;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    // Initial center position
    pointerRef.current.targetX = width / 2;
    pointerRef.current.targetY = height * 0.45;
    pointerRef.current.currentX = width / 2;
    pointerRef.current.currentY = height * 0.45;

    // Generate responsive particles
    const particleCount = isMobile ? 38 : 68;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const rand = Math.random();
      const colorType =
        rand < 0.38
          ? 'ember' // 4TECH Precision Crimson (#C5221F)
          : rand < 0.68
          ? 'ruby' // 4TECH Ruby Crimson (#ff3355)
          : rand < 0.88
          ? 'stardust' // Soft starlight white
          : 'cyan'; // Telemetry cyan (#06b6d4)

      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.1 + Math.random() * 2.2,
        baseAlpha: 0.2 + Math.random() * 0.45,
        alpha: 0.2 + Math.random() * 0.45,
        colorType,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.025,
      });
    }
    particlesRef.current = particles;

    // Resize handler
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (ctx) ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Visibility observer to pause RAF when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    // Render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      animFrameRef.current = requestAnimationFrame(render);
      if (!isVisibleRef.current || !ctx) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const pointer = pointerRef.current;

      // Idle ambient orbital breathing when no input for > 2.5s
      const idle = !pointer.active && time - pointer.lastInteraction > 2500;
      if (idle && !reduced) {
        const t = time * 0.0008;
        pointer.targetX = width / 2 + Math.cos(t) * 90;
        pointer.targetY = height * 0.45 + Math.sin(t * 1.5) * 45;
      }

      // Smooth lerp towards target (120fps responsive)
      const lerpFactor = pointer.active ? 0.12 : 0.05;
      pointer.currentX += (pointer.targetX - pointer.currentX) * lerpFactor;
      pointer.currentY += (pointer.targetY - pointer.currentY) * lerpFactor;

      const curX = pointer.currentX;
      const curY = pointer.currentY;

      // 1. Update DOM spotlights
      if (spotlightRef.current && enableSpotlight) {
        spotlightRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      }
      if (secondarySpotlightRef.current && enableSpotlight) {
        // Offset secondary spotlight slightly for subtle chromatic depth
        const offsetX = curX + (curX - width / 2) * 0.12;
        const offsetY = curY + (curY - height / 2) * 0.12;
        secondarySpotlightRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Update 3D Parallax on Concentric Radar Rings
      if (ringsRef.current && enableRings) {
        const px = (curX / width - 0.5) * 36;
        const py = (curY / height - 0.5) * 36;
        ringsRef.current.style.transform = `translate3d(calc(-50% + ${px.toFixed(1)}px), calc(-50% + ${py.toFixed(1)}px), 0)`;
      }

      // 3. Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (!enableParticles) return;

      const currentParticles = particlesRef.current;
      const repelRadius = isMobile ? 120 : 170;

      // Update and draw particles
      for (let i = 0; i < currentParticles.length; i++) {
        const p = currentParticles[i];

        // Harmonic breathing
        p.phase += p.phaseSpeed;
        const breathing = Math.sin(p.phase) * 0.18;

        // Base velocity drift
        if (!reduced) {
          p.originX += p.vx;
          p.originY += p.vy;

          if (p.originX < 0) p.originX = width;
          if (p.originX > width) p.originX = 0;
          if (p.originY < 0) p.originY = height;
          if (p.originY > height) p.originY = 0;
        }

        // Distance from cursor/touch
        const dx = p.x - curX;
        const dy = p.y - curY;
        const dist = Math.hypot(dx, dy);

        let repelX = 0;
        let repelY = 0;
        let glowBoost = 0;

        if (dist < repelRadius && dist > 1) {
          const force = (1 - dist / repelRadius);
          const repelAmount = force * (isMobile ? 32 : 48);
          repelX = (dx / dist) * repelAmount;
          repelY = (dy / dist) * repelAmount;
          glowBoost = force * 0.65;
        }

        // Spring return to origin
        p.x += (p.originX + repelX - p.x) * 0.08;
        p.y += (p.originY + repelY - p.y) * 0.08;
        p.alpha = Math.min(1, p.baseAlpha + breathing + glowBoost);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        let fillStyle = '';
        if (p.colorType === 'ember') {
          fillStyle = `rgba(197, 34, 31, ${p.alpha})`;
        } else if (p.colorType === 'ruby') {
          fillStyle = `rgba(255, 51, 85, ${p.alpha})`;
        } else if (p.colorType === 'cyan') {
          fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
        } else {
          fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.75})`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fill();

        // Draw glowing halos for larger particles
        if (p.radius > 2.0 && p.alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle =
            p.colorType === 'cyan'
              ? `rgba(6, 182, 212, ${p.alpha * 0.15})`
              : `rgba(255, 51, 85, ${p.alpha * 0.15})`;
          ctx.fill();
        }
      }

      // Constellation filament lines between close particles
      const lineDist = isMobile ? 55 : 75;
      ctx.lineWidth = 0.75;
      for (let i = 0; i < currentParticles.length; i++) {
        for (let j = i + 1; j < currentParticles.length; j++) {
          const p1 = currentParticles[i];
          const p2 = currentParticles[j];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (d < lineDist) {
            const lineAlpha = (1 - d / lineDist) * 0.14 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(197, 34, 31, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw touch ripple waves on mobile
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= 0.95;

        if (r.alpha < 0.02 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 51, 85, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(197, 34, 31, ${r.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Global pointer and touch listeners on window so that pointer-events-none container receives smooth updates
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });
    window.addEventListener('touchcancel', handlePointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('touchcancel', handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave, handleTouchStart, handleTouchMove, enableSpotlight, enableParticles, enableRings, enableRipples]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Primary Reactive Spotlight Glow (Follows cursor & touch) */}
      {enableSpotlight && (
        <>
          <div
            ref={spotlightRef}
            className="absolute top-0 left-0 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] md:w-[850px] md:h-[850px] rounded-full pointer-events-none will-change-transform z-[1]"
            style={{
              background:
                'radial-gradient(circle closest-side, rgba(160, 42, 34, 0.28) 0%, rgba(197, 34, 31, 0.12) 45%, transparent 75%)',
              filter: 'blur(45px)',
            }}
          />
          {/* Secondary Telemetry Cyan Glow */}
          <div
            ref={secondarySpotlightRef}
            className="absolute top-0 left-0 w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] rounded-full pointer-events-none will-change-transform z-[2]"
            style={{
              background:
                'radial-gradient(circle closest-side, rgba(6, 182, 212, 0.12) 0%, rgba(34, 211, 238, 0.03) 50%, transparent 80%)',
              filter: 'blur(35px)',
            }}
          />
        </>
      )}

      {/* 2. Interactive Concentric Radar Telemetry Rings with 3D Parallax */}
      {enableRings && (
        <svg
          ref={ringsRef}
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[1300px] sm:h-[1300px] pointer-events-none will-change-transform z-[3]"
          viewBox="0 0 1000 1000"
          fill="none"
        >
          {/* Concentric Radar Rings */}
          <circle cx="500" cy="500" r="140" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <circle cx="500" cy="500" r="260" stroke="rgba(160, 42, 34, 0.12)" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="500" cy="500" r="380" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
          <circle cx="500" cy="500" r="490" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" strokeDasharray="3 9" />

          {/* Telemetry Crosshair Ticks */}
          <line x1="500" y1="90" x2="500" y2="130" stroke="rgba(229, 57, 53, 0.4)" strokeWidth="1.5" />
          <line x1="500" y1="870" x2="500" y2="910" stroke="rgba(229, 57, 53, 0.4)" strokeWidth="1.5" />
          <line x1="90" y1="500" x2="130" y2="500" stroke="rgba(229, 57, 53, 0.4)" strokeWidth="1.5" />
          <line x1="870" y1="500" x2="910" y2="500" stroke="rgba(229, 57, 53, 0.4)" strokeWidth="1.5" />

          {/* Diagonal Corner Markers */}
          <circle cx="232" cy="232" r="2" fill="rgba(255, 51, 85, 0.5)" />
          <circle cx="768" cy="232" r="2" fill="rgba(255, 51, 85, 0.5)" />
          <circle cx="232" cy="768" r="2" fill="rgba(255, 51, 85, 0.5)" />
          <circle cx="768" cy="768" r="2" fill="rgba(255, 51, 85, 0.5)" />
        </svg>
      )}

      {/* 3. Reactive Canvas Particles & Touch Ripples */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[4]" />

      {/* 4. Peripheral Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 40%, #060608 100%)',
        }}
      />
    </div>
  );
}
