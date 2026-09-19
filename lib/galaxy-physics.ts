/** Deterministic particle layout and allocation-free, time-based galaxy physics. */
export interface GalaxyParticles {
  count: number;
  anchors: Float32Array;
  positions: Float32Array;
  offsets: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
  orbit: Float32Array;
}

export interface GalaxyPointer {
  x: number;
  y: number;
  active: boolean;
}

export interface PointerBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const MAX_FRAME_DELTA = 1 / 20;
const MAX_STEP = 1 / 120;
const SPRING = 10;
const DAMPING = 6.8;
const REPULSION_RADIUS = 1.2;
const REPULSION = 31;
const MAX_OFFSET = 1.75;
const ROTATION_SPEED = 0.023;
const TAU = Math.PI * 2;

export function clampFrameDelta(deltaSeconds: number): number {
  return Number.isFinite(deltaSeconds)
    ? Math.min(MAX_FRAME_DELTA, Math.max(0, deltaSeconds))
    : 0;
}

/** Canvas bounds, rather than event.target, keep overlaid links from shifting the ray. */
export function normalizeGalaxyPointer(
  clientX: number,
  clientY: number,
  bounds: PointerBounds,
): { x: number; y: number } | null {
  if (
    !Number.isFinite(clientX) || !Number.isFinite(clientY) ||
    !Number.isFinite(bounds.left) || !Number.isFinite(bounds.top) ||
    !Number.isFinite(bounds.width) || !Number.isFinite(bounds.height) ||
    bounds.width <= 0 || bounds.height <= 0
  ) return null;

  const x = (clientX - bounds.left) / bounds.width;
  const y = (clientY - bounds.top) / bounds.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x: x * 2 - 1, y: 1 - y * 2 };
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function createGalaxyParticles(count: number, seed = 40726): GalaxyParticles {
  if (!Number.isInteger(count) || count < 0 || count > 100_000) {
    throw new RangeError("Galaxy particle count must be an integer between 0 and 100,000.");
  }
  const random = seededRandom(seed);
  const normal = () => Math.sqrt(-2 * Math.log(Math.max(random(), 1e-9))) * Math.cos(TAU * random());
  const particles: GalaxyParticles = {
    count,
    anchors: new Float32Array(count * 3),
    positions: new Float32Array(count * 3),
    offsets: new Float32Array(count * 3),
    velocities: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    phases: new Float32Array(count),
    orbit: new Float32Array(count),
  };
  const tilt = -0.2;
  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);

  for (let i = 0; i < count; i++) {
    const index = i * 3;
    const fieldStar = random() < 0.14;
    let x: number;
    let y: number;
    let z: number;
    let radius = 0;
    if (fieldStar) {
      x = (random() - 0.5) * 24;
      y = (random() - 0.5) * 15;
      z = -1.5 - random() * 4;
    } else {
      const core = random() < 0.27;
      radius = core ? Math.pow(random(), 1.55) * 1.55 : Math.pow(random(), 0.68) * 5.3;
      const arm = Math.floor(random() * 3);
      const angle = core
        ? random() * TAU
        : (arm * TAU) / 3 + radius * 1.14 + normal() * (0.16 + radius * 0.035);
      const spread = core ? 0.07 : 0.045 + radius * 0.037;
      const discX = Math.cos(angle) * radius + normal() * spread;
      const discY = Math.sin(angle) * radius + normal() * spread;
      const flatY = discY * 0.64;
      x = discX * cosTilt - flatY * sinTilt;
      y = discX * sinTilt + flatY * cosTilt;
      z = discY * 0.15 + normal() * (core ? 0.22 : 0.09);
    }
    particles.anchors[index] = x;
    particles.anchors[index + 1] = y;
    particles.anchors[index + 2] = z;
    particles.orbit[i] = fieldStar ? 0 : 1;
    particles.phases[i] = random() * TAU;

    const crimson = !fieldStar && radius > 0.8 && random() < 0.13;
    const warm = random();
    const luminosity = fieldStar ? 0.25 + random() * 0.32 : 0.42 + random() * 0.58;
    particles.colors[index] = luminosity;
    particles.colors[index + 1] = luminosity * (crimson ? 0.055 + warm * 0.09 : 0.83 + warm * 0.15);
    particles.colors[index + 2] = luminosity * (crimson ? 0.10 + warm * 0.1 : 0.73 + warm * 0.24);
    const rareBrightStar = random() > 0.981;
    particles.sizes[i] = fieldStar
      ? 0.8 + random() * 1.25
      : rareBrightStar ? 3.1 + random() * 1.8 : 0.85 + Math.pow(random(), 2) * 1.9;
  }
  particles.positions.set(particles.anchors);
  return particles;
}

/** Mutates the existing buffers. Substeps preserve the spring feel across frame rates. */
export function stepGalaxyPhysics(
  particles: GalaxyParticles,
  pointer: GalaxyPointer,
  deltaSeconds: number,
  elapsedSeconds: number,
): number {
  const delta = clampFrameDelta(deltaSeconds);
  if (delta === 0) return 0;
  const steps = Math.ceil(delta / MAX_STEP);
  const dt = delta / steps;
  const angle = (Number.isFinite(elapsedSeconds) ? elapsedSeconds : 0) * ROTATION_SPEED;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const pointerActive = pointer.active && Number.isFinite(pointer.x) && Number.isFinite(pointer.y);
  const radiusSquared = REPULSION_RADIUS * REPULSION_RADIUS;

  for (let i = 0; i < particles.count; i++) {
    const index = i * 3;
    const anchorX = particles.anchors[index];
    const anchorY = particles.anchors[index + 1];
    const moving = particles.orbit[i] > 0;
    const targetX = moving ? anchorX * cos - anchorY * sin : anchorX;
    const targetY = moving ? anchorX * sin + anchorY * cos : anchorY;
    let offsetX = particles.offsets[index];
    let offsetY = particles.offsets[index + 1];
    let velocityX = particles.velocities[index];
    let velocityY = particles.velocities[index + 1];

    for (let step = 0; step < steps; step++) {
      let forceX = -offsetX * SPRING - velocityX * DAMPING;
      let forceY = -offsetY * SPRING - velocityY * DAMPING;
      if (pointerActive && moving) {
        const dx = targetX + offsetX - pointer.x;
        const dy = targetY + offsetY - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < radiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          const falloff = 1 - distance / REPULSION_RADIUS;
          // An exact hit still has a finite, deterministic direction to move away.
          const directionX = distance > 1e-5 ? dx / distance : Math.cos(particles.phases[i]);
          const directionY = distance > 1e-5 ? dy / distance : Math.sin(particles.phases[i]);
          const force = REPULSION * falloff * falloff;
          forceX += directionX * force;
          forceY += directionY * force;
        }
      }
      velocityX += forceX * dt;
      velocityY += forceY * dt;
      offsetX += velocityX * dt;
      offsetY += velocityY * dt;
      const displacementSquared = offsetX * offsetX + offsetY * offsetY;
      if (displacementSquared > MAX_OFFSET * MAX_OFFSET) {
        const scale = MAX_OFFSET / Math.sqrt(displacementSquared);
        offsetX *= scale;
        offsetY *= scale;
        velocityX *= 0.5;
        velocityY *= 0.5;
      }
    }

    particles.offsets[index] = offsetX;
    particles.offsets[index + 1] = offsetY;
    particles.velocities[index] = velocityX;
    particles.velocities[index + 1] = velocityY;
    particles.positions[index] = targetX + offsetX;
    particles.positions[index + 1] = targetY + offsetY;
    particles.positions[index + 2] = particles.anchors[index + 2];
  }
  return delta;
}
