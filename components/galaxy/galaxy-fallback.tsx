"use client";

import { useEffect, type CSSProperties } from "react";
import { createGalaxyParticles } from "../../lib/galaxy-physics";

const stars = createGalaxyParticles(640);

export const galaxyGlowStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse 39% 29% at 50% 50%, rgba(238,214,199,0.075) 0%, rgba(148,101,104,0.034) 28%, rgba(101,32,45,0.025) 58%, transparent 100%), radial-gradient(ellipse 72% 63% at 50% 50%, rgba(180,140,155,0.026), transparent 80%)",
};

/** A deterministic static counterpart, also usable as the dynamic-import placeholder. */
export default function GalaxyFallback({ onReady }: { onReady?: () => void }) {
  useEffect(() => { onReady?.(); }, [onReady]);
  return (
    <div
      aria-hidden="true"
      data-galaxy-fallback=""
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <div style={galaxyGlowStyle} />
      <svg
        viewBox="-6.4 -4.6 12.8 9.2"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
        focusable="false"
      >
        {Array.from({ length: stars.count }, (_, i) => {
          const index = i * 3;
          return (
            <circle
              key={i}
              cx={stars.positions[index]}
              cy={-stars.positions[index + 1]}
              r={stars.sizes[i] * 0.009}
              fill={`rgb(${Math.round(stars.colors[index] * 255)},${Math.round(stars.colors[index + 1] * 255)},${Math.round(stars.colors[index + 2] * 255)})`}
              opacity={stars.orbit[i] ? 0.78 : 0.4}
            />
          );
        })}
      </svg>
    </div>
  );
}
