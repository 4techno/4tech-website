'use client';

import React, { useRef, useEffect, useCallback } from 'react';

const clamp = (val: number, min: number, max: number) =>
  val < min ? min : val > max ? max : val;

const smoothstep = (min: number, max: number, value: number) => {
  const norm = clamp((value - min) / (max - min || 1e-6), 0, 1);
  return norm * norm * (3 - 2 * norm);
};

interface ScrollExpandProps {
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  overlayScrim?: number;
  children?: React.ReactNode;
}

export default function ScrollExpandSection({
  title = 'The Philosophy',
  scrollHint = 'Scroll to expand',
  startWidth = 48,
  startHeight = 60,
  startRadius = 26,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1,
  overlayScrim = 0.72,
  children,
}: ScrollExpandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const applyProgress = useCallback(
    (progress: number) => {
      const frame = frameRef.current;
      const media = mediaRef.current;
      if (!frame || !media) return;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      const widthPct = isMobile ? 86 : isTablet ? 70 : startWidth;
      const heightPct = isMobile ? 58 : isTablet ? 60 : startHeight;
      const radiusVal = isMobile ? 18 : isTablet ? 22 : startRadius;

      const clampedProg = clamp(progress / 0.85, 0, 1);
      const eased = smoothstep(0, 1, clampedProg);

      const insetX = Math.max(0, (100 - (widthPct + (100 - widthPct) * eased)) / 2);
      const insetY = Math.max(0, (100 - (heightPct + (100 - heightPct) * eased)) / 2);
      const currentRadius = radiusVal + (endRadius - radiusVal) * eased;

      frame.style.clipPath = `inset(${insetY.toFixed(3)}% ${insetX.toFixed(3)}% ${insetY.toFixed(3)}% ${insetX.toFixed(3)}% round ${currentRadius.toFixed(1)}px)`;

      const currentScale = mediaZoom + (1 - mediaZoom) * eased;
      media.style.transform = `scale(${currentScale.toFixed(4)})`;
      media.style.filter = `blur(${(8 * (1 - eased)).toFixed(1)}px)`;

      if (titleRef.current) {
        const titleEased = smoothstep(0.08, 0.5, clampedProg);
        titleRef.current.style.opacity = `${(1 - titleEased).toFixed(3)}`;
        titleRef.current.style.transform = `translate3d(-50%, calc(-50% - ${(26 * titleEased).toFixed(1)}px), 0) scale(${(1 + 0.04 * titleEased).toFixed(3)})`;
      }

      if (hintRef.current) {
        const hintEased = smoothstep(0, 0.2, clampedProg);
        hintRef.current.style.opacity = `${(1 - hintEased).toFixed(3)}`;
        hintRef.current.style.transform = `translate3d(-50%, ${(10 * hintEased).toFixed(1)}px, 0)`;
      }

      if (scrimRef.current) {
        const scrimOp = 0.25 + (overlayScrim - 0.25) * eased;
        scrimRef.current.style.opacity = `${scrimOp.toFixed(3)}`;
      }

      if (overlayRef.current) {
        const overlayProg = smoothstep(0.45, 0.85, progress);
        overlayRef.current.style.opacity = `${overlayProg.toFixed(3)}`;
        overlayRef.current.style.transform = `translate3d(0, ${(20 * (1 - overlayProg)).toFixed(1)}px, 0)`;
        overlayRef.current.style.pointerEvents = overlayProg > 0.8 ? 'auto' : 'none';
      }
    },
    [startWidth, startHeight, startRadius, endRadius, mediaZoom, overlayScrim]
  );

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!container || !track || !stage) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.height = 'auto';
      stage.style.height = 'min(78svh, 760px)';
      if (frameRef.current) frameRef.current.style.clipPath = 'none';
      if (mediaRef.current) {
        mediaRef.current.style.transform = 'none';
        mediaRef.current.style.filter = 'none';
      }
      if (titleRef.current) titleRef.current.style.display = 'none';
      if (hintRef.current) hintRef.current.style.display = 'none';
      if (overlayRef.current) overlayRef.current.style.opacity = '1';
      return;
    }

    let rafId = 0;
    let windowH = 0;
    let scrollRange = 0;

    const computeHeights = () => {
      windowH = window.innerHeight;
      if (windowH <= 0) return;
      const totalH = windowH * (1 + Math.max(0.6, scrollDistance));
      track.style.height = `${totalH}px`;
      stage.style.height = `${windowH}px`;
      scrollRange = totalH - windowH;
    };

    const updateScroll = () => {
      const top = -track.getBoundingClientRect().top;
      const progress = scrollRange <= 0 ? 0 : clamp(top / scrollRange, 0, 1);
      applyProgress(progress);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          updateScroll();
        });
      }
    };

    const onResize = () => {
      computeHeights();
      updateScroll();
    };

    computeHeights();
    updateScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, [applyProgress, scrollDistance]);

  return (
    <section id="philosophy" className="relative w-full" aria-labelledby="jm-philosophy-heading">
      <div ref={containerRef} className="scroll-expand">
        <div ref={trackRef} className="scroll-expand__track">
          <div ref={stageRef} className="scroll-expand__stage">
            <div ref={frameRef} className="scroll-expand__frame">
              {/* Original 4TECH illustration; this is not project evidence. */}
              <div
                ref={mediaRef}
                className="scroll-expand__media bg-void"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #27150f 0%, #0d0d0f 68%, #050505 100%)',
                }}
              >
                <img className="jm-philosophy-hands" src="/assets/editorial/hero-hands.jpg" alt="" loading="lazy" decoding="async" />
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(160, 42, 34, 0.4) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              {/* Scrim */}
              <div ref={scrimRef} className="scroll-expand__scrim" />

              {/* Overlay Content */}
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children ? (
                  children
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 sm:gap-7 max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-ember/30 bg-ember/10 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-ember shadow-[0_0_8px_#A02A22]" />
                      <span className="text-ember text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase">
                        The Philosophy
                      </span>
                    </div>

                    <h2 id="jm-philosophy-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-[1.35] sm:leading-[1.4] tracking-tight text-center max-w-3xl drop-shadow-lg">
                      Good engineering makes the invisible testable. We connect mathematical ideas, physical systems and clear evidence.
                    </h2>

                    <p className="text-xs sm:text-sm font-mono tracking-widest text-[#B5B5B5] uppercase">
                      4TECH / Engineering philosophy
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Title before expansion */}
            {title && (
              <div ref={titleRef} className="scroll-expand__title" aria-hidden="true">
                {title}
              </div>
            )}

            {/* Hint before expansion */}
            {scrollHint && (
              <div ref={hintRef} className="scroll-expand__hint">
                <span className="scroll-expand__hint-dot" />
                <span>{scrollHint}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
