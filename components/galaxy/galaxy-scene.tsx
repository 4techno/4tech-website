"use client";

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  DynamicDrawUsage,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  type ShaderMaterial,
} from "three";
import {
  clampFrameDelta,
  createGalaxyParticles,
  normalizeGalaxyPointer,
  stepGalaxyPhysics,
  type GalaxyPointer,
} from "../../lib/galaxy-physics";
import GalaxyFallback, { galaxyGlowStyle } from "./galaxy-fallback";

export { default as GalaxyFallback } from "./galaxy-fallback";

export interface GalaxySceneProps {
  paused: boolean;
  onReady?: () => void;
}

const COMPACT_QUERY = "(max-width: 767px), (pointer: coarse)";
function compactSnapshot() { return window.matchMedia(COMPACT_QUERY).matches; }
function subscribeCompact(onChange: () => void) {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vShimmer;
  void main() {
    vColor = color;
    vShimmer = 0.87 + 0.13 * sin(uTime * 0.55 + aPhase);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = clamp(aSize * uPixelRatio * (10.0 / -viewPosition.z), 0.8, 8.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vShimmer;
  void main() {
    float radius = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (radius > 1.0) discard;
    float halo = exp(-4.7 * radius * radius) * (1.0 - smoothstep(0.75, 1.0, radius));
    float core = pow(1.0 - radius, 5.0);
    float alpha = (halo * 0.64 + core * 0.55) * vShimmer;
    gl_FragColor = vec4(vColor * 1.8, min(1.0, alpha * 1.25));
    #include <colorspace_fragment>
  }
`;

interface BoundaryProps { children: ReactNode; onReady?: () => void }
class GalaxyErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <GalaxyFallback onReady={this.props.onReady} /> : this.props.children;
  }
}

interface StarCloudProps extends GalaxySceneProps {
  compact: boolean;
  onContextLost: () => void;
}

function StarCloud({ paused, compact, onReady, onContextLost }: StarCloudProps) {
  const { gl, camera, scene, viewport, size } = useThree();
  const material = useRef<ShaderMaterial>(null);
  const pointer = useRef<GalaxyPointer>({ x: 0, y: 0, active: false });
  const elapsed = useRef(0);
  const ready = useRef(false);
  const readyCallback = useRef(onReady);
  const particles = useMemo(() => createGalaxyParticles(compact ? 2300 : 8200), [compact]);
  const positionAttribute = useMemo(
    () => new BufferAttribute(particles.positions, 3).setUsage(DynamicDrawUsage),
    [particles],
  );
  const scale = Math.min(1, viewport.width / 12.1, viewport.height / 8.4);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
  }), []);

  useEffect(() => { readyCallback.current = onReady; }, [onReady]);

  useEffect(() => {
    const canvas = gl.domElement;
    const clearPointer = () => { pointer.current.active = false; };
    if (paused) return clearPointer();
    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const worldPoint = new Vector3();
    const normalized = new Vector2();
    const updatePointer = (event: PointerEvent) => {
      // Touch remains native scrolling; the decorative canvas never captures input.
      if (event.pointerType === "touch") return clearPointer();
      const point = normalizeGalaxyPointer(event.clientX, event.clientY, canvas.getBoundingClientRect());
      if (!point) return clearPointer();
      normalized.set(point.x, point.y);
      raycaster.setFromCamera(normalized, camera);
      if (!raycaster.ray.intersectPlane(plane, worldPoint)) return clearPointer();
      pointer.current.x = worldPoint.x / scale;
      pointer.current.y = worldPoint.y / scale;
      pointer.current.active = true;
    };
    // Window listeners still receive movement above the hero's text and links.
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", clearPointer);
    window.addEventListener("scroll", clearPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", clearPointer);
    return () => {
      clearPointer();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", clearPointer);
      window.removeEventListener("scroll", clearPointer);
      document.documentElement.removeEventListener("pointerleave", clearPointer);
    };
  }, [camera, gl, paused, scale]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onContextLost);
    return () => canvas.removeEventListener("webglcontextlost", onContextLost);
  }, [gl, onContextLost]);

  useEffect(() => {
    uniforms.uPixelRatio.value = gl.getPixelRatio();
    // `never` must still have a static first frame and refresh after a resize.
    // Rendering once does not start an animation loop.
    try {
      gl.render(scene, camera);
      if (!ready.current) {
        ready.current = true;
        readyCallback.current?.();
      }
    } catch {
      onContextLost();
    }
  }, [camera, gl, onContextLost, particles, paused, scale, scene, size.height, size.width, uniforms]);

  useFrame((_, frameDelta) => {
    if (paused) return;
    const delta = clampFrameDelta(frameDelta);
    elapsed.current += delta;
    stepGalaxyPhysics(particles, pointer.current, delta, elapsed.current);
    positionAttribute.needsUpdate = true;
    if (material.current) material.current.uniforms.uTime.value = elapsed.current;
  });

  return (
    <points scale={scale} frustumCulled={false}>
      <bufferGeometry>
        <primitive object={positionAttribute} attach="attributes-position" />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[particles.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[particles.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexColors
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </points>
  );
}

export default function GalaxyScene({ paused, onReady }: GalaxySceneProps) {
  const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, () => true);
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  if (contextLost) return <GalaxyFallback onReady={onReady} />;

  return (
    <div
      aria-hidden="true"
      data-galaxy-scene=""
      data-motion={paused ? "paused" : "running"}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <div style={galaxyGlowStyle} />
      <GalaxyErrorBoundary onReady={onReady}>
        <Canvas
          frameloop={paused ? "never" : "always"}
          dpr={compact ? 1 : [1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 40 }}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power", stencil: false, depth: false }}
          flat
          fallback={<GalaxyFallback onReady={onReady} />}
          onCreated={({ gl, events }) => {
            gl.setClearColor(0x000000, 0);
            // Picking thousands of decorative particles is unnecessary.
            events.enabled = false;
          }}
          style={{ pointerEvents: "none", background: "transparent" }}
        >
          <StarCloud paused={paused} compact={compact} onReady={onReady} onContextLost={handleContextLost} />
        </Canvas>
      </GalaxyErrorBoundary>
    </div>
  );
}
