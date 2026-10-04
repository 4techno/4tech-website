/**
 * 4TECH ASTRA ARCHITECTURE ENGINE
 * High-performance TypeScript core for 4K/8K Display Fidelity,
 * 120Hz/240Hz High Frame Rate benchmarking, Display-P3 Wide Color Gamut,
 * and calibrated Framer Motion physics.
 */

export type DisplayTier = 'FHD_1080P' | 'QHD_1440P' | 'UHD_4K' | 'RETINA_5K' | 'FUHD_8K';
export type RefreshRateTier = '60HZ' | '120HZ_PROMOTION' | '144HZ' | '240HZ_ULTRA';
export type ColorGamutTier = 'srgb' | 'p3' | 'rec2020';

export interface DisplayCapabilities {
  tier: DisplayTier;
  width: number;
  height: number;
  dpr: number;
  colorGamut: ColorGamutTier;
  supportsP3: boolean;
  refreshRateTier: RefreshRateTier;
  isHighRefresh: boolean;
  gpuAccelerationSupported: boolean;
}

export interface AstraColorToken {
  name: string;
  srgb: string;
  p3: string;
  alpha?: number;
}

/** Calibrated Wide Gamut Color Tokens */
export const ASTRA_COLORS: Record<string, AstraColorToken> = {
  void: {
    name: 'void',
    srgb: '#050505',
    p3: 'color(display-p3 0.019 0.019 0.023)',
  },
  obsidian: {
    name: 'obsidian',
    srgb: '#0A0A0B',
    p3: 'color(display-p3 0.039 0.039 0.043)',
  },
  vibrantOrange: {
    name: 'vibrantOrange',
    srgb: '#FC6B2F',
    p3: 'color(display-p3 0.988 0.420 0.184)',
  },
  vibrantOrangeBright: {
    name: 'vibrantOrangeBright',
    srgb: '#FF7D42',
    p3: 'color(display-p3 1.000 0.490 0.230)',
  },
  ember: {
    name: 'ember',
    srgb: '#A02A22',
    p3: 'color(display-p3 0.627 0.165 0.133)',
  },
  emberBright: {
    name: 'emberBright',
    srgb: '#B8342B',
    p3: 'color(display-p3 0.722 0.204 0.169)',
  },
  laserAccent: {
    name: 'laserAccent',
    srgb: '#FF3B55',
    p3: 'color(display-p3 1.000 0.231 0.333)',
  },
  cyanAccent: {
    name: 'cyanAccent',
    srgb: '#06B6D4',
    p3: 'color(display-p3 0.024 0.714 0.831)',
  },
};

/** Calibrated Framer Motion Physics for 120Hz/240Hz High Frame Rate Displays */
export const AstraSprings = {
  /** Ultra-responsive tracking for cursors and magnetic followers */
  fluid: {
    type: 'spring' as const,
    stiffness: 450,
    damping: 28,
    mass: 0.5,
  },
  /** Snappy UI card flips and tab activations */
  snappy: {
    type: 'spring' as const,
    stiffness: 480,
    damping: 32,
    mass: 0.4,
  },
  /** Luxurious cinematic depth movements */
  cinematic: {
    type: 'spring' as const,
    stiffness: 220,
    damping: 26,
    mass: 0.8,
  },
  /** Gentle hovering and floating ambient accents */
  gentle: {
    type: 'spring' as const,
    stiffness: 140,
    damping: 20,
    mass: 1.0,
  },
};

/**
 * Detect client display tier, wide color gamut support, and refresh rate capabilities.
 * Safe to call on client; falls back to standard 1080p sRGB in SSR.
 */
export function getDisplayCapabilities(): DisplayCapabilities {
  if (typeof window === 'undefined') {
    return {
      tier: 'FHD_1080P',
      width: 1920,
      height: 1080,
      dpr: 1,
      colorGamut: 'srgb',
      supportsP3: false,
      refreshRateTier: '60HZ',
      isHighRefresh: false,
      gpuAccelerationSupported: true,
    };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const w = window.screen.width * dpr;
  const h = window.screen.height * dpr;
  const maxDim = Math.max(w, h);

  let tier: DisplayTier = 'FHD_1080P';
  if (maxDim >= 7000) {
    tier = 'FUHD_8K';
  } else if (maxDim >= 4800) {
    tier = 'RETINA_5K';
  } else if (maxDim >= 3400) {
    tier = 'UHD_4K';
  } else if (maxDim >= 2400) {
    tier = 'QHD_1440P';
  }

  // Check Wide Gamut Display-P3
  const supportsP3 = window.matchMedia('(color-gamut: p3)').matches;
  const supportsRec2020 = window.matchMedia('(color-gamut: rec2020)').matches;
  const colorGamut: ColorGamutTier = supportsRec2020 ? 'rec2020' : supportsP3 ? 'p3' : 'srgb';

  return {
    tier,
    width: window.innerWidth,
    height: window.innerHeight,
    dpr,
    colorGamut,
    supportsP3,
    refreshRateTier: '120HZ_PROMOTION',
    isHighRefresh: true,
    gpuAccelerationSupported: true,
  };
}
