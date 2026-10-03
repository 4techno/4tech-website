'use client';

import React, { useEffect, useRef } from 'react';

export default function GhostCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (no touch/coarse devices)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Track coordinates
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hasMoved = false;
    let isHovering = false;
    let isMouseDown = false;
    let isOffscreen = true;

    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], [data-magnetic], .ed-service-card, .exp-item, .project-card, [tabindex="0"]';

    const handlePointerMove = (e: MouseEvent) => {
      hasMoved = true;
      isOffscreen = false;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update Center Dot instantly with 0ms latency for precision sub-pixel tracking
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0px) translate(-50%, -50%)`;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target && target.closest(interactiveSelectors)) {
        if (!isHovering) {
          isHovering = true;
          document.body.classList.add('cursor-hover');
        }
      } else {
        if (isHovering) {
          isHovering = false;
          document.body.classList.remove('cursor-hover');
        }
      }

      document.body.classList.remove('cursor-hidden');
    };

    const handleMouseDown = () => {
      isMouseDown = true;
      document.body.classList.add('cursor-active');
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      document.body.classList.remove('cursor-active');
    };

    const handleMouseLeave = () => {
      isOffscreen = true;
      document.body.classList.add('cursor-hidden');
    };

    const handleMouseEnter = () => {
      isOffscreen = false;
      document.body.classList.remove('cursor-hidden');
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Max frame rate render loop with high-frequency spring lerp (60Hz / 120Hz / 144Hz / 240Hz monitor support)
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!hasMoved || isOffscreen) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Frame-rate independent spring interpolation for buttery smooth magnetic ring
      // Standard lerp factor around 0.22 at 60fps, mathematically scaled by delta
      const factor = 1 - Math.exp(-18 * delta);
      ringX += (mouseX - ringX) * factor;
      ringY += (mouseY - ringY) * factor;

      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0px) translate(-50%, -50%)`;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-hover', 'cursor-active', 'cursor-hidden');
    };
  }, []);

  return (
    <>
      {/* 1. Precision Target Center Dot (Zero Latency) */}
      <div ref={dotRef} className="luxury-cursor-dot" aria-hidden="true" />

      {/* 2. Magnetic Lagging Smooth Round Ring (60-240Hz Fluid Easing) */}
      <div ref={ringRef} className="luxury-cursor-ring" aria-hidden="true" />
    </>
  );
}
