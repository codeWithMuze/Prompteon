'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Gentle Star Field ────────────────────────────────────────────────
const StarField = () => {
  const ref = useRef<THREE.Points>(null);
  const starCount = 600;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const szs = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Spread stars across a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 25;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      szs[i] = 0.02 + Math.random() * 0.06;
    }
    return [pos, szs];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.008;
    ref.current.rotation.x = Math.sin(t * 0.005) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a3b18a"
        size={0.05}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ── Twinkling Stars (closer, brighter) ───────────────────────────────
const TwinklingStars = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 150;

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 15;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, phs];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 0.4 + Math.sin(t * 0.5) * 0.2;
    ref.current.rotation.y = t * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#dad7cd"
        size={0.08}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ── Subtle Ambient Glow ──────────────────────────────────────────────
const AmbientGlow = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.03 + Math.sin(t * 0.2) * 0.01;
  });

  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <sphereGeometry args={[6, 32, 32]} />
      <meshBasicMaterial
        color="#588157"
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

// ── Slow Camera Drift ────────────────────────────────────────────────
const CameraDrift = () => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.03) * 0.5;
    state.camera.position.y = Math.cos(t * 0.02) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// ── Main Component ───────────────────────────────────────────────────
export const StarsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#050608]">
      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,6,8,0.8) 85%, #050608 100%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#050608' }}
      >
        <StarField />
        <TwinklingStars />
        <AmbientGlow />
        <CameraDrift />
      </Canvas>
    </div>
  );
};
