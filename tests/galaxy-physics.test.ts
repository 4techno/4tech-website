import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_FRAME_DELTA,
  clampFrameDelta,
  createGalaxyParticles,
  normalizeGalaxyPointer,
  stepGalaxyPhysics,
} from "../lib/galaxy-physics";

const inactivePointer = { x: 0, y: 0, active: false };

function isolatedParticle(x = 0.2, y = 0) {
  const particle = createGalaxyParticles(1);
  particle.anchors.set([x, y, 0]);
  particle.positions.set(particle.anchors);
  particle.orbit[0] = 1;
  return particle;
}

test("particle layout is repeatable and different seeds create different galaxies", () => {
  const first = createGalaxyParticles(200, 4);
  const second = createGalaxyParticles(200, 4);
  assert.deepEqual(first.positions, second.positions);
  assert.deepEqual(first.colors, second.colors);
  assert.notDeepEqual(first.positions, createGalaxyParticles(200, 5).positions);
  assert.ok(first.positions.every(Number.isFinite));
  assert.ok(first.sizes.every((size) => size > 0));
  assert.throws(() => createGalaxyParticles(-1), RangeError);
  assert.throws(() => createGalaxyParticles(1.5), RangeError);
});

test("cursor repulsion moves a nearby particle away and leaves distant stars untouched", () => {
  const nearby = isolatedParticle();
  const distant = isolatedParticle(3);
  const pointer = { x: 0, y: 0, active: true };
  for (let i = 0; i < 60; i++) {
    stepGalaxyPhysics(nearby, pointer, 1 / 60, 0);
    stepGalaxyPhysics(distant, pointer, 1 / 60, 0);
  }
  assert.ok(nearby.positions[0] > 0.4);
  assert.equal(distant.offsets[0], 0);
  assert.equal(distant.positions[0], 3);
});

test("the damped spring returns particles to their anchor after the pointer leaves", () => {
  const particle = isolatedParticle();
  for (let i = 0; i < 60; i++) {
    stepGalaxyPhysics(particle, { x: 0, y: 0, active: true }, 1 / 60, 0);
  }
  const displaced = particle.offsets[0];
  for (let i = 0; i < 360; i++) stepGalaxyPhysics(particle, inactivePointer, 1 / 60, 0);
  assert.ok(displaced > 0.2);
  assert.ok(Math.abs(particle.offsets[0]) < 0.001);
  assert.ok(Math.abs(particle.velocities[0]) < 0.001);
});

test("an exact cursor hit stays finite and ejects the particle rather than dividing by zero", () => {
  const particle = isolatedParticle(0, 0);
  for (let i = 0; i < 120; i++) {
    stepGalaxyPhysics(particle, { x: 0, y: 0, active: true }, 1 / 60, 0);
  }
  assert.ok(particle.positions.every(Number.isFinite));
  const distance = Math.hypot(particle.offsets[0], particle.offsets[1]);
  assert.ok(distance > 0.2 && distance <= 1.75);
});

test("physics behaves consistently at 30, 60, and 120 frames per second", () => {
  const results = [30, 60, 120].map((fps) => {
    const particle = isolatedParticle();
    for (let i = 0; i < fps * 2; i++) {
      stepGalaxyPhysics(particle, { x: 0, y: 0, active: true }, 1 / fps, 0);
    }
    return particle.positions[0];
  });
  assert.ok(Math.max(...results) - Math.min(...results) < 0.002);
});

test("large resumed-frame deltas are clamped and invalid time cannot corrupt the buffers", () => {
  const resumed = isolatedParticle();
  const normal = isolatedParticle();
  const pointer = { x: 0, y: 0, active: true };
  stepGalaxyPhysics(resumed, pointer, 600, 0);
  stepGalaxyPhysics(normal, pointer, MAX_FRAME_DELTA, 0);
  assert.deepEqual(resumed.positions, normal.positions);
  const before = resumed.positions.slice();
  assert.equal(stepGalaxyPhysics(resumed, pointer, Number.NaN, 0), 0);
  assert.deepEqual(resumed.positions, before);
  assert.equal(clampFrameDelta(-1), 0);
  assert.equal(clampFrameDelta(Infinity), 0);
});

test("zero delta leaves a paused galaxy entirely unchanged", () => {
  const particles = createGalaxyParticles(100);
  const before = particles.positions.slice();
  stepGalaxyPhysics(particles, { x: 0, y: 0, active: true }, 0, 500);
  assert.deepEqual(particles.positions, before);
  assert.ok(particles.velocities.every((velocity) => velocity === 0));
});

test("pointer mapping uses canvas offsets, flips the vertical axis, and rejects outside events", () => {
  const bounds = { left: 100, top: 200, width: 800, height: 400 };
  assert.deepEqual(normalizeGalaxyPointer(500, 400, bounds), { x: 0, y: 0 });
  assert.deepEqual(normalizeGalaxyPointer(100, 200, bounds), { x: -1, y: 1 });
  assert.deepEqual(normalizeGalaxyPointer(900, 600, bounds), { x: 1, y: -1 });
  assert.equal(normalizeGalaxyPointer(99, 400, bounds), null);
  assert.equal(normalizeGalaxyPointer(500, 400, { ...bounds, width: 0 }), null);
  assert.equal(normalizeGalaxyPointer(NaN, 400, bounds), null);
});
