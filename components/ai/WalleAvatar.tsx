'use client';

import React from 'react';
import type { CompanionState } from './AiPetAssistant';

interface WalleAvatarProps {
  pupilX?: number;
  pupilY?: number;
  headTilt?: number;
  headPitch?: number;
  state?: CompanionState;
  compact?: boolean;
}

/**
 * High-fidelity vector WALL-E Companion Avatar.
 * Features:
 * - Iconic binocular ocular assembly with independent pupil translation looking at cursor/touch
 * - Hydraulic neck linkage with pitch and tilt articulation
 * - Weathered yellow-ochre chassis with compaction door seam
 * - Solar charge status LED meter
 * - Official WALL·E typography badge
 * - Triangular crawler tank treads with sprockets
 * - Articulated mechanical gripper arms
 */
export default function WalleAvatar({
  pupilX = 0,
  pupilY = 0,
  headTilt = 0,
  headPitch = 0,
  state = 'idle',
  compact = false,
}: WalleAvatarProps) {
  const isSleeping = state === 'sleep';
  const isThinking = state === 'thinking';
  const isSuccess = state === 'success';

  // Eye lid droop in sleep state
  const eyelidY = isSleeping ? 10 : 0;
  // Brow angle in success state (cheerful) or thinking (curious)
  const leftBrowAngle = isSuccess ? -12 : isThinking ? 8 : 0;
  const rightBrowAngle = isSuccess ? 12 : isThinking ? -8 : 0;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full overflow-visible select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        {/* Yellow-Ochre Chassis Gradients */}
        <linearGradient id="walleBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E5A823" />
          <stop offset="60%" stopColor="#C48A14" />
          <stop offset="100%" stopColor="#966807" />
        </linearGradient>

        <linearGradient id="wallePlateGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2BA38" />
          <stop offset="100%" stopColor="#B37C0E" />
        </linearGradient>

        {/* Binocular Eye Metals */}
        <linearGradient id="eyeHousingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A4742" />
          <stop offset="50%" stopColor="#2E2C29" />
          <stop offset="100%" stopColor="#1C1A18" />
        </linearGradient>

        <linearGradient id="eyeRimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A756D" />
          <stop offset="100%" stopColor="#3A3833" />
        </linearGradient>

        {/* Glass Lens Gradient */}
        <radialGradient id="lensGlass" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2A3845" />
          <stop offset="65%" stopColor="#0B131A" />
          <stop offset="100%" stopColor="#05080A" />
        </radialGradient>

        {/* Optical Sensor Glow */}
        <radialGradient id="pupilGlow" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={isThinking ? '#60A5FA' : isSuccess ? '#F87171' : '#38BDF8'} />
          <stop offset="50%" stopColor={isThinking ? '#2563EB' : isSuccess ? '#DC2626' : '#0284C7'} />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>

        {/* Tread Dark Carbon */}
        <linearGradient id="treadGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1E1E22" />
          <stop offset="50%" stopColor="#2C2C33" />
          <stop offset="100%" stopColor="#17171A" />
        </linearGradient>

        <filter id="walleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>{`
          @keyframes walleIdlePlay {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            35% { transform: translateY(-2px) rotate(0.7deg); }
            70% { transform: translateY(1px) rotate(-0.5deg); }
          }
          @keyframes walleEyeSparkle {
            0%, 100% { opacity: 0.95; transform: scale(1); }
            50% { opacity: 0.65; transform: scale(0.85); }
          }
          .walle-playing-body {
            animation: walleIdlePlay 4s ease-in-out infinite;
            transform-origin: 60px 85px;
          }
          .walle-sparkle {
            animation: walleEyeSparkle 2.5s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* =========================================================================
          1. TREAD CRAWLERS (LEFT & RIGHT TANK TRACKS)
          ========================================================================= */}
      <g id="treads">
        {/* Left Tread */}
        <g id="leftTread">
          <path
            d="M16 86 L25 65 L31 65 L33 98 L19 98 Z"
            fill="url(#treadGrad)"
            stroke="#151518"
            strokeWidth="1.2"
          />
          {/* Track treads cleats */}
          <line x1="18" y1="84" x2="23" y2="82" stroke="#4B4B52" strokeWidth="1.5" />
          <line x1="21" y1="74" x2="26" y2="72" stroke="#4B4B52" strokeWidth="1.5" />
          <line x1="25" y1="66" x2="29" y2="66" stroke="#4B4B52" strokeWidth="1.5" />
          <line x1="18" y1="96" x2="32" y2="96" stroke="#4B4B52" strokeWidth="1.5" />
          {/* Wheel Sprockets */}
          <circle cx="21" cy="89" r="4" fill="#323238" stroke="#151518" strokeWidth="1" />
          <circle cx="27" cy="73" r="3.2" fill="#323238" stroke="#151518" strokeWidth="1" />
          <circle cx="29" cy="90" r="4.2" fill="#323238" stroke="#151518" strokeWidth="1" />
        </g>

        {/* Right Tread */}
        <g id="rightTread">
          <path
            d="M104 86 L95 65 L89 65 L87 98 L101 98 Z"
            fill="url(#treadGrad)"
            stroke="#151518"
            strokeWidth="1.2"
          />
          {/* Track treads cleats */}
          <line x1="102" y1="84" x2="97" y2="82" stroke="#4B4B52" strokeWidth="1.5" />
          <line x1="99" y1="74" x2="94" y2="72" stroke="#4B4B52" strokeWidth="1.5" />
          <line x1="95" y1="66" x2="91" y2="66" stroke="#4B4B52" strokeWidth="1.5" />
          <line x1="102" y1="96" x2="88" y2="96" stroke="#4B4B52" strokeWidth="1.5" />
          {/* Wheel Sprockets */}
          <circle cx="99" cy="89" r="4" fill="#323238" stroke="#151518" strokeWidth="1" />
          <circle cx="93" cy="73" r="3.2" fill="#323238" stroke="#151518" strokeWidth="1" />
          <circle cx="91" cy="90" r="4.2" fill="#323238" stroke="#151518" strokeWidth="1" />
        </g>
      </g>

      {/* =========================================================================
          2. MAIN CHASSIS (WEATHERED YELLOW CUBE BODY)
          ========================================================================= */}
      <g id="chassis" className="walle-playing-body">
        {/* Chassis Cube Shadow & Base */}
        <rect x="29" y="58" width="62" height="42" rx="4" fill="#755206" />

        {/* Front Plate */}
        <rect
          x="30"
          y="57"
          width="60"
          height="41"
          rx="3.5"
          fill="url(#walleBodyGrad)"
          stroke="#7A5605"
          strokeWidth="1.2"
        />

        {/* Weathered top rim highlight */}
        <path d="M31 59 L89 59" stroke="#FFE082" strokeWidth="1" opacity="0.6" />

        {/* Compaction Door Seam (Horizontal Center Groove) */}
        <path d="M30 78 L90 78" stroke="#5E4102" strokeWidth="1.8" />
        <path d="M30 79.5 L90 79.5" stroke="#F6C95A" strokeWidth="0.8" opacity="0.5" />

        {/* Compaction Door Latch Plates & Rivets */}
        <rect x="42" y="76" width="6" height="5" rx="1" fill="#423E3B" stroke="#252422" strokeWidth="0.6" />
        <rect x="72" y="76" width="6" height="5" rx="1" fill="#423E3B" stroke="#252422" strokeWidth="0.6" />
        <circle cx="33" cy="61" r="1" fill="#4A3403" />
        <circle cx="87" cy="61" r="1" fill="#4A3403" />
        <circle cx="33" cy="94" r="1" fill="#4A3403" />
        <circle cx="87" cy="94" r="1" fill="#4A3403" />

        {/* Solar Charge Meter Indicator (Left Chest) */}
        <g id="solarMeter" transform="translate(35, 62)">
          <rect x="0" y="0" width="8" height="13" rx="1.5" fill="#18181A" stroke="#333338" strokeWidth="0.6" />
          {/* Level bars (Bottom Red, Mid Yellow, Top Green) */}
          <rect x="1.5" y="10" width="5" height="1.8" rx="0.5" fill={isSleeping ? '#451010' : '#EF4444'} />
          <rect x="1.5" y="7.2" width="5" height="1.8" rx="0.5" fill={isSleeping ? '#453508' : '#FBBF24'} />
          <rect x="1.5" y="4.4" width="5" height="1.8" rx="0.5" fill={isSleeping ? '#453508' : '#FBBF24'} />
          <rect x="1.5" y="1.6" width="5" height="1.8" rx="0.5" fill={isSuccess ? '#10B981' : isSleeping ? '#06331C' : '#34D399'} />
        </g>

        {/* Official "WALL·E" Stamped Badge (Right Chest) */}
        <g id="walleBadge" transform="translate(56, 64)">
          <rect x="0" y="0" width="28" height="9" rx="1.5" fill="#1A1817" stroke="#3A3836" strokeWidth="0.7" />
          {/* Red Stripe Accent */}
          <rect x="0" y="0" width="4" height="9" rx="1" fill="#DC2626" />
          <text
            x="6"
            y="7"
            fill="#F5F5F0"
            fontSize="5.2"
            fontFamily="var(--font-mono, monospace)"
            fontWeight="bold"
            letterSpacing="0.4"
          >
            WALL·E
          </text>
        </g>

        {/* Mechanical Gripper Arms (Left & Right Flanks) */}
        {/* Left Arm & Pincer */}
        <path d="M27 65 L21 72 L19 80" stroke="#3E3D42" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 80 L16 83 M19 80 L22 83" stroke="#252429" strokeWidth="1.8" strokeLinecap="round" />

        {/* Right Arm & Pincer */}
        <path d="M93 65 L99 72 L101 80" stroke="#3E3D42" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M101 80 L104 83 M101 80 L98 83" stroke="#252429" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* =========================================================================
          3. ARTICULATED NECK LINKAGE (HYDRAULIC PISTONS)
          ========================================================================= */}
      <g id="neck" transform={`translate(0, ${headPitch * 0.3})`}>
        {/* Main Neck Post */}
        <rect x="56" y="44" width="8" height="15" rx="1" fill="#2E2D32" stroke="#17171A" strokeWidth="0.8" />
        {/* Hydraulic Chrome Piston Struts */}
        <rect x="51" y="46" width="3.5" height="12" rx="0.8" fill="#71717A" stroke="#3F3F46" strokeWidth="0.6" />
        <rect x="65.5" y="46" width="3.5" height="12" rx="0.8" fill="#71717A" stroke="#3F3F46" strokeWidth="0.6" />
        {/* Universal Joint Bracket */}
        <circle cx="60" cy="45" r="4.5" fill="#4B4B52" stroke="#1D1D21" strokeWidth="0.9" />
      </g>

      {/* =========================================================================
          4. BINOCULAR OPTICAL EYES (CURSOR-TRACKING HEAD)
          ========================================================================= */}
      <g
        id="walleHead"
        style={{
          transformOrigin: '60px 45px',
          transform: `translate(${headPitch * 0.4}px, ${headPitch * 0.8}px) rotate(${headTilt}deg)`,
          transition: isSleeping ? 'transform 0.6s ease' : 'none',
        }}
      >
        {/* -------------------- LEFT OCULAR ASSEMBLY -------------------- */}
        <g id="leftEye" transform="translate(31, 14)">
          {/* Eyebrow / Visor Hood */}
          <path
            d="M1 9 C4 5 18 5 28 8 L27 15 L2 15 Z"
            fill="#57534D"
            stroke="#292524"
            strokeWidth="0.8"
            style={{
              transformOrigin: '15px 10px',
              transform: `rotate(${leftBrowAngle}deg)`,
            }}
          />

          {/* Eye Housing Body (Trapezoidal rounded casing) */}
          <path
            d="M2 13 C2 10 7 7 15 7 C23 7 28 10 28 13 L27 34 C27 38 22 40 15 40 C8 40 3 38 3 34 Z"
            fill="url(#eyeHousingGrad)"
            stroke="url(#eyeRimGrad)"
            strokeWidth="1.2"
          />

          {/* Outer Lens Bezel Ring */}
          <ellipse cx="15" cy="24" rx="10.5" ry="11.5" fill="#141417" stroke="#48443F" strokeWidth="1.2" />

          {/* Deep Optical Glass Chamber */}
          <ellipse cx="15" cy="24" rx="8.5" ry="9.5" fill="url(#lensGlass)" />

          {/* CURSOR TRACKING PUPIL & OPTICAL SENSOR */}
          <g transform={`translate(${pupilX}, ${pupilY})`}>
            {/* Iris Glow Ring */}
            <circle cx="15" cy="24" r="5.8" fill="url(#pupilGlow)" opacity={isSleeping ? 0.35 : 0.95} />
            {/* Pupil Aperture Core */}
            <circle cx="15" cy="24" r="3.2" fill="#040608" />
            {/* Specular Glint Reflection */}
            {!isSleeping && (
              <>
                <circle cx="13.2" cy="21.8" r="1.4" fill="#FFFFFF" opacity="0.95" />
                <circle cx="16.8" cy="25.5" r="0.7" fill="#BAE6FD" opacity="0.75" />
              </>
            )}
          </g>

          {/* Dynamic Eyelid (Sleep / Blink) */}
          {isSleeping && (
            <path
              d="M3 13 C3 13 8 26 15 26 C22 26 27 13 27 13 L27 7 L3 7 Z"
              fill="#2E2C29"
              stroke="#44403C"
              strokeWidth="0.8"
            />
          )}

          {/* Visor highlight line */}
          <path d="M4 11 L25 10" stroke="#87837A" strokeWidth="0.8" opacity="0.65" />
        </g>

        {/* -------------------- EYE BRIDGE BRACKET -------------------- */}
        <path
          d="M58 28 L62 28 L61 38 L59 38 Z"
          fill="#353330"
          stroke="#1F1D1B"
          strokeWidth="0.8"
        />

        {/* -------------------- RIGHT OCULAR ASSEMBLY -------------------- */}
        <g id="rightEye" transform="translate(61, 14)">
          {/* Eyebrow / Visor Hood */}
          <path
            d="M0 8 C10 5 24 5 27 9 L26 15 L1 15 Z"
            fill="#57534D"
            stroke="#292524"
            strokeWidth="0.8"
            style={{
              transformOrigin: '14px 10px',
              transform: `rotate(${rightBrowAngle}deg)`,
            }}
          />

          {/* Eye Housing Body (Trapezoidal rounded casing) */}
          <path
            d="M0 13 C0 10 5 7 13 7 C21 7 26 10 26 13 L25 34 C25 38 20 40 13 40 C6 40 1 38 1 34 Z"
            fill="url(#eyeHousingGrad)"
            stroke="url(#eyeRimGrad)"
            strokeWidth="1.2"
          />

          {/* Outer Lens Bezel Ring */}
          <ellipse cx="13" cy="24" rx="10.5" ry="11.5" fill="#141417" stroke="#48443F" strokeWidth="1.2" />

          {/* Deep Optical Glass Chamber */}
          <ellipse cx="13" cy="24" rx="8.5" ry="9.5" fill="url(#lensGlass)" />

          {/* CURSOR TRACKING PUPIL & OPTICAL SENSOR */}
          <g transform={`translate(${pupilX}, ${pupilY})`}>
            {/* Iris Glow Ring */}
            <circle cx="13" cy="24" r="5.8" fill="url(#pupilGlow)" opacity={isSleeping ? 0.35 : 0.95} />
            {/* Pupil Aperture Core */}
            <circle cx="13" cy="24" r="3.2" fill="#040608" />
            {/* Specular Glint Reflection */}
            {!isSleeping && (
              <>
                <circle cx="11.2" cy="21.8" r="1.4" fill="#FFFFFF" opacity="0.95" />
                <circle cx="14.8" cy="25.5" r="0.7" fill="#BAE6FD" opacity="0.75" />
              </>
            )}
          </g>

          {/* Dynamic Eyelid (Sleep / Blink) */}
          {isSleeping && (
            <path
              d="M1 13 C1 13 6 26 13 26 C20 26 25 13 25 13 L25 7 L1 7 Z"
              fill="#2E2C29"
              stroke="#44403C"
              strokeWidth="0.8"
            />
          )}

          {/* Visor highlight line */}
          <path d="M2 10 L23 11" stroke="#87837A" strokeWidth="0.8" opacity="0.65" />
        </g>
      </g>
    </svg>
  );
}
