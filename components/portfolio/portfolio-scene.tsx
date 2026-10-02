'use client';

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, CatmullRomCurve3, DynamicDrawUsage, Group, MathUtils, Vector2, Vector3 } from 'three';
import { clampFrameDelta, createGalaxyParticles, stepGalaxyPhysics, type GalaxyPointer } from '@/lib/galaxy-physics';
import type { StageMode } from './portfolio-stage';
import styles from './portfolio.module.css';

const TAU = Math.PI * 2;

function StaticForm() {
  return <div className={styles.stageFallback}><i /><i /><i /><span>MV</span></div>;
}

/** Geometry is rebuilt from the supplied intro's four acts, without its blocking gate or audio. */
function Helix() {
  const paths = useMemo(() => Array.from({ length: 5 }, (_, strand) => new CatmullRomCurve3(Array.from({ length: 90 }, (_, i) => {
    const t = i / 89;
    const angle = t * TAU * 1.5 + strand * TAU / 5;
    const radius = .45 + Math.sin(t * Math.PI) * 1.2;
    return new Vector3(Math.cos(angle) * radius, (t - .5) * 4.7, Math.sin(angle) * radius);
  }))), []);
  return <group rotation={[.1, 0, -.36]}>{paths.map((path, index) => <mesh key={index}><tubeGeometry args={[path, 110, index === 0 ? .025 : .014, 5, false]} /><meshStandardMaterial color={index < 2 ? '#ed493b' : '#c99875'} emissive={index < 2 ? '#8b2217' : '#241b16'} emissiveIntensity={.6} metalness={.72} roughness={.3} /></mesh>)}<mesh><icosahedronGeometry args={[.68, 1]} /><meshStandardMaterial color="#ed493b" emissive="#7d251a" emissiveIntensity={.45} metalness={.8} roughness={.24} wireframe /></mesh><mesh><icosahedronGeometry args={[.28, 0]} /><meshStandardMaterial color="#edbbaa" emissive="#a33c20" emissiveIntensity={.7} metalness={.5} roughness={.25} /></mesh></group>;
}

function Silicon() {
  return <group rotation={[.7, -.3, -.4]}>
    <mesh><boxGeometry args={[3.2, 3.2, .12]} /><meshStandardMaterial color="#25241f" roughness={.48} metalness={.65} /></mesh>
    <mesh position={[0, 0, .24]}><boxGeometry args={[1.3, 1.3, .4]} /><meshStandardMaterial color="#c07a57" metalness={.82} roughness={.3} /></mesh>
    <mesh position={[0, 0, .47]}><boxGeometry args={[.8, .8, .07]} /><meshStandardMaterial color="#ec543d" emissive="#8b2217" emissiveIntensity={.65} metalness={.7} roughness={.3} /></mesh>
    {Array.from({ length: 4 }, (_, side) => <group rotation={[0, 0, side * Math.PI / 2]} key={side}>{Array.from({ length: 7 }, (_, index) => <group key={index} position={[(index - 3) * .22, 0, 0]}><mesh position={[0, 1.0, .105]}><boxGeometry args={[.026, .67, .035]} /><meshBasicMaterial color={index % 2 ? '#665346' : '#cd9878'} /></mesh><mesh position={[0, .7, .22]}><boxGeometry args={[.1, .27, .12]} /><meshStandardMaterial color="#d4bd9e" metalness={.9} roughness={.3} /></mesh></group>)}</group>)}
    {[[-1.3, -1.3], [-1.3, 1.3], [1.3, -1.3], [1.3, 1.3]].map(([x, y], i) => <mesh position={[x, y, .09]} key={i}><torusGeometry args={[.1, .025, 6, 20]} /><meshBasicMaterial color="#8c755e" /></mesh>)}
  </group>;
}

function Joint({ size = .24 }: { size?: number }) {
  return <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[size, size, .5, 24]} /><meshStandardMaterial color="#c79576" metalness={.75} roughness={.32} /></mesh>;
}

function Kinetics({ active }: { active: boolean }) {
  const shoulder = useRef<Group>(null);
  const elbow = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, dt) => {
    if (!active) return;
    time.current += Math.min(dt, .05);
    if (shoulder.current) shoulder.current.rotation.z = -.3 + Math.sin(time.current * .3) * .16;
    if (elbow.current) elbow.current.rotation.z = -1.2 + Math.sin(time.current * .3 + .8) * .22;
  });
  return <group position={[-.5, -1.65, 0]} rotation={[.1, -.3, 0]}>
    <mesh><cylinderGeometry args={[.65, .85, .35, 32]} /><meshStandardMaterial color="#51463d" metalness={.8} roughness={.4} /></mesh>
    <group ref={shoulder} rotation={[0, 0, -.3]} position={[0, .25, 0]}><Joint /><mesh position={[0, .85, 0]}><boxGeometry args={[.29, 1.7, .38]} /><meshStandardMaterial color="#e7573e" metalness={.65} roughness={.3} /></mesh><group ref={elbow} position={[0, 1.7, 0]} rotation={[0, 0, -1.2]}><Joint /><mesh position={[0, .7, 0]}><boxGeometry args={[.24, 1.4, .3]} /><meshStandardMaterial color="#b8a58d" metalness={.82} roughness={.32} /></mesh><group position={[0, 1.5, 0]}><Joint size={.18} />{[-1, 1].map(side => <group key={side} position={[side * .19, .21, 0]}><mesh><boxGeometry args={[.1, .42, .18]} /><meshStandardMaterial color="#e7573e" metalness={.6} roughness={.3} /></mesh><mesh position={[-side * .07, .19, 0]}><boxGeometry args={[.21, .1, .18]} /><meshStandardMaterial color="#c8af95" metalness={.7} roughness={.3} /></mesh></group>)}</group></group></group>
  </group>;
}

function Signals() {
  return <group rotation={[.7, -.4, .4]}>
    <mesh><torusGeometry args={[1.1, .75, 18, 50]} /><meshBasicMaterial color="#ed634b" wireframe transparent opacity={.62} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.025, .025, 3.8, 8]} /><meshBasicMaterial color="#eed1ad" /></mesh>
    {[2.35, 2.5, 2.65].map((radius, index) => <mesh key={radius}><torusGeometry args={[radius, .01, 4, 100]} /><meshBasicMaterial color="#be8c6b" transparent opacity={.6 - index * .13} /></mesh>)}
  </group>;
}

function Starfield({ active, compact }: { active: boolean; compact: boolean }) {
  const { gl, viewport } = useThree();
  const particles = useMemo(() => createGalaxyParticles(compact ? 600 : 1400, 9631), [compact]);
  const attribute = useMemo(() => new BufferAttribute(particles.positions, 3).setUsage(DynamicDrawUsage), [particles]);
  const pointer = useRef<GalaxyPointer>({ x: 0, y: 0, active: false });
  const time = useRef(0);
  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      pointer.current = { x: ((event.clientX - box.left) / box.width - .5) * viewport.width / .55, y: (.5 - (event.clientY - box.top) / box.height) * viewport.height / .55, active: true };
    };
    const leave = () => { pointer.current.active = false; };
    canvas.addEventListener('pointermove', move, { passive: true }); canvas.addEventListener('pointerleave', leave);
    return () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); };
  }, [gl, viewport.width, viewport.height]);
  useFrame((_, dt) => {
    if (!active) return;
    const delta = clampFrameDelta(dt); time.current += delta;
    stepGalaxyPhysics(particles, pointer.current, delta, time.current); attribute.needsUpdate = true;
  });
  return <points scale={.55} position={[0, 0, -2]} frustumCulled={false}><bufferGeometry><primitive object={attribute} attach="attributes-position" /><bufferAttribute attach="attributes-color" args={[particles.colors, 3]} /></bufferGeometry><pointsMaterial size={.025} vertexColors transparent opacity={.5} blending={AdditiveBlending} depthWrite={false} /></points>;
}

function Assembly({ mode, paused, compact, onLost }: { mode: StageMode; paused: boolean; compact: boolean; onLost: () => void }) {
  const model = useRef<Group>(null);
  const pointer = useRef(new Vector2());
  const time = useRef(0);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const box = canvas.getBoundingClientRect();
      pointer.current.set((event.clientX - box.left) / box.width - .5, (event.clientY - box.top) / box.height - .5);
    };
    const leave = () => pointer.current.set(0, 0);
    canvas.addEventListener('pointermove', move, { passive: true }); canvas.addEventListener('pointerleave', leave); canvas.addEventListener('webglcontextlost', onLost);
    return () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); canvas.removeEventListener('webglcontextlost', onLost); };
  }, [gl, onLost]);
  useEffect(() => { invalidate(); }, [mode, paused, invalidate]);
  useFrame((_, delta) => {
    if (paused || !model.current) return;
    const dt = Math.min(delta, .05); time.current += dt;
    model.current.rotation.y = MathUtils.damp(model.current.rotation.y, Math.sin(time.current * .16) * .35 + pointer.current.x * .4, 3, dt);
    model.current.rotation.x = MathUtils.damp(model.current.rotation.x, pointer.current.y * .2, 3, dt);
    model.current.position.y = Math.sin(time.current * .5) * .065;
  });
  return <><ambientLight intensity={1.2} /><pointLight color="#ffe8ce" position={[3, 4, 5]} intensity={35} /><pointLight color="#ed493b" position={[-3, -1, 2]} intensity={18} /><Starfield active={!paused} compact={compact} /><group ref={model}>{mode === 'genesis' ? <Helix /> : mode === 'silicon' ? <Silicon /> : mode === 'kinetics' ? <Kinetics active={!paused} /> : <Signals />}</group></>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticForm /> : this.props.children; }
}

export default function PortfolioScene({ mode, paused }: { mode: StageMode; paused: boolean }) {
  const [failed, setFailed] = useState(false);
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setCompact(query.matches); update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (failed) return <StaticForm />;
  return <SceneBoundary><Canvas camera={{ position: [0, 0, 8.2], fov: 43 }} dpr={compact ? 1 : [1, 1.5]} gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }} frameloop={paused ? 'demand' : 'always'} fallback={<StaticForm />}><Assembly mode={mode} paused={paused} compact={compact} onLost={() => setFailed(true)} /></Canvas></SceneBoundary>;
}
