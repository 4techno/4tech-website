'use client';

import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Color, DynamicDrawUsage, Group, InstancedMesh, MathUtils, Object3D, Vector2 } from 'three';
import { clampFrameDelta, createGalaxyParticles, stepGalaxyPhysics, type GalaxyPointer } from '@/lib/galaxy-physics';
import { EngineFallback, type EngineMode } from './engine-experience';

const TAU = Math.PI * 2;
const particleVertex = `attribute float aSize; varying vec3 vColor;
void main(){vColor=color; vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(aSize*18./-p.z,1.,5.);}`;
const particleFragment = `varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(vColor, pow(1.-d,2.)*.82);}`;

function Particles({ active, compact }: { active: boolean; compact: boolean }) {
  const { gl, viewport } = useThree();
  const particles = useMemo(() => createGalaxyParticles(compact ? 700 : 1800), [compact]);
  const attribute = useMemo(() => new BufferAttribute(particles.positions, 3).setUsage(DynamicDrawUsage), [particles]);
  const pointer = useRef<GalaxyPointer>({ x: 0, y: 0, active: false });
  const time = useRef(0);
  useEffect(() => {
    const node = gl.domElement.parentElement!;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const b = gl.domElement.getBoundingClientRect();
      pointer.current = { x: ((event.clientX - b.left) / b.width - .5) * viewport.width / .37, y: (.5 - (event.clientY - b.top) / b.height) * viewport.height / .37, active: true };
    };
    const leave = () => { pointer.current.active = false; };
    node.addEventListener('pointermove', move, { passive: true }); node.addEventListener('pointerleave', leave);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); };
  }, [gl, viewport.width, viewport.height]);
  useFrame((_, dt) => {
    if (!active) return;
    const delta = clampFrameDelta(dt); time.current += delta;
    stepGalaxyPhysics(particles, pointer.current, delta, time.current);
    attribute.needsUpdate = true;
  });
  return <points scale={.37} position={[0, 0, .3]} frustumCulled={false}>
    <bufferGeometry><primitive object={attribute} attach="attributes-position"/><bufferAttribute attach="attributes-color" args={[particles.colors, 3]}/><bufferAttribute attach="attributes-aSize" args={[particles.sizes, 1]}/></bufferGeometry>
    <shaderMaterial vertexShader={particleVertex} fragmentShader={particleFragment} vertexColors transparent blending={AdditiveBlending} depthWrite={false}/>
  </points>;
}

function Ring({ radius, width = .012, color = '#43413e', arc = TAU, start = 0, opacity = 1 }: { radius: number; width?: number; color?: string; arc?: number; start?: number; opacity?: number }) {
  return <mesh rotation={[0, 0, start]}><torusGeometry args={[radius, width, 5, Math.ceil(128 * arc / TAU), arc]}/><meshBasicMaterial color={color} transparent={opacity < 1} opacity={opacity}/></mesh>;
}

function InstrumentTicks() {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const object = new Object3D(), color = new Color();
    for (let i = 0; i < 96; i++) {
      const theta = i * TAU / 96;
      object.position.set(Math.cos(theta) * 2.61, Math.sin(theta) * 2.61, .035);
      object.rotation.set(0, 0, theta);
      object.scale.set(i % 8 === 0 ? .2 : .085, .012, .025);
      object.updateMatrix();
      mesh.current.setMatrixAt(i, object.matrix);
      mesh.current.setColorAt(i, color.set(i % 8 === 0 ? '#d9cbc0' : i < 26 ? '#ed493b' : '#49423c'));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, []);
  return <instancedMesh ref={mesh} args={[undefined, undefined, 96]}><boxGeometry args={[1, 1, 1]}/><meshBasicMaterial/></instancedMesh>;
}

function Instrument({ mode, paused, compact, onLost }: { mode: EngineMode; paused: boolean; compact: boolean; onLost: () => void }) {
  const assembly = useRef<Group>(null);
  const rotor = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const pointer = useRef(new Vector2());
  const elapsed = useRef(0);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onLost);
    return () => canvas.removeEventListener('webglcontextlost', onLost);
  }, [gl, onLost]);
  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const b = canvas.getBoundingClientRect();
      pointer.current.set((event.clientX - b.left) / b.width - .5, (event.clientY - b.top) / b.height - .5);
    };
    const leave = () => pointer.current.set(0, 0);
    canvas.addEventListener('pointermove', move, { passive: true }); canvas.addEventListener('pointerleave', leave);
    return () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); };
  }, [gl]);
  useEffect(() => { invalidate(); }, [mode, paused, invalidate]);
  useFrame((_, delta) => {
    if (paused) return;
    const dt = Math.min(delta, .05); elapsed.current += dt;
    if (assembly.current) {
      assembly.current.rotation.x = MathUtils.damp(assembly.current.rotation.x, -.17 + pointer.current.y * .18, 3, dt);
      assembly.current.rotation.y = MathUtils.damp(assembly.current.rotation.y, -.25 + pointer.current.x * .25, 3, dt);
    }
    if (rotor.current) rotor.current.rotation.z = elapsed.current * (mode === 'signal' ? -.12 : .055);
    if (inner.current) {
      inner.current.rotation.y = MathUtils.damp(inner.current.rotation.y, mode === 'robotics' ? 1.12 : .15, 2.5, dt);
      inner.current.rotation.x = MathUtils.damp(inner.current.rotation.x, mode === 'robotics' ? -.65 : 0, 2.5, dt);
      inner.current.rotation.z = elapsed.current * .08;
    }
  });
  return <group ref={assembly} rotation={[-.17, -.25, 0]}>
    <mesh position={[0, 0, -.2]}><ringGeometry args={[2.33, 2.85, 160]}/><meshStandardMaterial color="#161513" metalness={.8} roughness={.42} side={2}/></mesh>
    <Ring radius={2.87} color="#63605a" width={.012}/><Ring radius={2.79} color="#35332f"/>
    <Ring radius={2.35} color="#716c62" width={.015}/><Ring radius={2.25} color="#32312f"/>
    <group ref={rotor}>
      {[0, 1, 2].map(i => <Ring key={i} radius={2.91} width={.026} color={i === 1 ? '#f8a78d' : '#ed493b'} arc={1.34} start={i * TAU / 3 + .16}/>)}
      <InstrumentTicks/>
    </group>
    <group ref={inner}>
      <Ring radius={1.92} color="#ba7761" arc={4.3}/><Ring radius={1.86} color="#3c3732"/>
      <group rotation={[.95, .35, .25]}><Ring radius={1.68} width={.018} color="#ed493b"/><Ring radius={1.75} color="#5c4238"/></group>
      <group rotation={[-.8, .6, 0]}><Ring radius={1.6} color="#d8a18a" arc={4.5}/></group>
      {mode === 'robotics' && <mesh><icosahedronGeometry args={[.78, 1]}/><meshStandardMaterial color="#b9b3ac" metalness={.9} roughness={.28} wireframe/></mesh>}
      {mode === 'systems' && <group rotation={[.55, .6, .25]}><mesh><boxGeometry args={[.9, .9, .9]}/><meshStandardMaterial color="#e94d37" metalness={.6} roughness={.35}/></mesh><mesh scale={1.32}><boxGeometry args={[.9, .9, .9]}/><meshBasicMaterial color="#dfbaa7" wireframe transparent opacity={.5}/></mesh></group>}
      {mode === 'signal' && Array.from({ length: 7 }, (_, i) => <Ring key={i} radius={.26 + i * .17} width={.011} color="#ed493b" opacity={1 - i * .1}/>)}
    </group>
    <Particles active={!paused} compact={compact}/>
    <pointLight position={[2, 3, 5]} intensity={28} color="#ffe0c5"/><ambientLight intensity={1.2}/>
  </group>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <EngineFallback/> : this.props.children; }
}

export default function EngineScene({ mode, paused }: { mode: EngineMode; paused: boolean }) {
  const [failed, setFailed] = useState(false);
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setCompact(query.matches); update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (failed) return <EngineFallback/>;
  return <SceneBoundary><Canvas camera={{ position: [0, 0, 8.6], fov: 44 }} dpr={compact ? 1 : [1, 1.5]} frameloop={paused ? 'demand' : 'always'} gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }} fallback={<EngineFallback/>}><Instrument mode={mode} paused={paused} compact={compact} onLost={() => setFailed(true)}/></Canvas></SceneBoundary>;
}
