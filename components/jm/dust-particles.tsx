'use client';

import React from 'react';

const DUST_PARTICLES = [
  { size: 2.1, color: 'rgba(252, 107, 47, 0.6)', top: '12%', left: '8%', duration: '6.2s', delay: '0s' },
  { size: 1.5, color: 'rgba(255, 255, 255, 0.25)', top: '25%', left: '82%', duration: '7.4s', delay: '0.6s' },
  { size: 2.8, color: 'rgba(255, 255, 255, 0.3)', top: '40%', left: '15%', duration: '5.8s', delay: '1.2s' },
  { size: 1.2, color: 'rgba(252, 107, 47, 0.6)', top: '58%', left: '91%', duration: '8.1s', delay: '1.8s' },
  { size: 2.4, color: 'rgba(255, 255, 255, 0.25)', top: '72%', left: '24%', duration: '6.9s', delay: '2.4s' },
  { size: 1.8, color: 'rgba(255, 255, 255, 0.25)', top: '18%', left: '64%', duration: '5.5s', delay: '3.0s' },
  { size: 2.6, color: 'rgba(252, 107, 47, 0.6)', top: '84%', left: '45%', duration: '7.8s', delay: '3.6s' },
  { size: 1.4, color: 'rgba(255, 255, 255, 0.25)', top: '33%', left: '37%', duration: '6.1s', delay: '4.2s' },
  { size: 2.2, color: 'rgba(255, 255, 255, 0.25)', top: '67%', left: '78%', duration: '8.5s', delay: '4.8s' },
  { size: 1.6, color: 'rgba(252, 107, 47, 0.6)', top: '50%', left: '6%', duration: '5.2s', delay: '5.4s' },
  { size: 2.5, color: 'rgba(255, 255, 255, 0.25)', top: '28%', left: '95%', duration: '7.1s', delay: '6.0s' },
  { size: 1.3, color: 'rgba(255, 255, 255, 0.25)', top: '88%', left: '12%', duration: '6.6s', delay: '6.6s' },
  { size: 2.0, color: 'rgba(252, 107, 47, 0.6)', top: '15%', left: '48%', duration: '8.0s', delay: '7.2s' },
  { size: 1.7, color: 'rgba(255, 255, 255, 0.25)', top: '44%', left: '71%', duration: '5.9s', delay: '7.8s' },
  { size: 2.3, color: 'rgba(255, 255, 255, 0.25)', top: '79%', left: '58%', duration: '7.3s', delay: '8.4s' },
  { size: 1.1, color: 'rgba(252, 107, 47, 0.6)', top: '62%', left: '31%', duration: '6.4s', delay: '9.0s' },
  { size: 2.7, color: 'rgba(255, 255, 255, 0.25)', top: '92%', left: '84%', duration: '8.3s', delay: '9.6s' },
  { size: 1.9, color: 'rgba(255, 255, 255, 0.25)', top: '38%', left: '52%', duration: '5.6s', delay: '10.2s' },
];

export default function DustParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[8]" aria-hidden="true">
      {DUST_PARTICLES.map((p, idx) => (
        <div
          key={idx}
          className="dust absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            top: p.top,
            left: p.left,
            animation: `${p.duration} ease-in-out ${p.delay} infinite normal none running float`,
            boxShadow: p.color.includes('252') ? '0 0 8px rgba(252, 107, 47, 0.8)' : 'none',
          }}
        />
      ))}
    </div>
  );
}
