'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Rotating Wireframe Icosphere ─────────────────────────────────────
// A large, slowly rotating wireframe sphere that gives the "tech" feel
const WireframeSphere = () => {
  const meshRef = useRef<THREE.LineSegments>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(4.5, 2);
    return new THREE.EdgesGeometry(ico);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.05;
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.z = t * 0.03;
    }
    if (glowRef.current) {
      const pulse = 1.0 + Math.sin(t * 0.5) * 0.05;
      glowRef.current.scale.set(pulse, pulse, pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.04 + Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Wireframe edges */}
      <lineSegments ref={meshRef} geometry={geometry}>
        <lineBasicMaterial
          color="#588157"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Inner glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#588157"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// ── Neural Network Nodes with Connections ────────────────────────────
const NeuralNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const nodeCount = 250;
  const connectionDistance = 3.0;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const vel: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Spread across a wide volume
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      vel.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.004,
      });
    }
    return [pos, vel];
  }, []);

  const lineColor = useMemo(() => new THREE.Color('#588157'), []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    // Move particles
    for (let i = 0; i < nodeCount; i++) {
      posArr[i * 3] += velocities[i].x + Math.sin(time * 0.2 + i * 0.1) * 0.002;
      posArr[i * 3 + 1] += velocities[i].y + Math.cos(time * 0.15 + i * 0.07) * 0.002;
      posArr[i * 3 + 2] += velocities[i].z;

      // Bounce at boundaries
      if (Math.abs(posArr[i * 3]) > 10) velocities[i].x *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 8) velocities[i].y *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 6) velocities[i].z *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Build connection lines
    const linePosArr: number[] = [];
    const lineColArr: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < connectionDistance * connectionDistance) {
          linePosArr.push(
            posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2],
            posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]
          );

          const alpha = (1.0 - Math.sqrt(distSq) / connectionDistance) * 0.5;
          lineColArr.push(
            lineColor.r, lineColor.g, lineColor.b, alpha,
            lineColor.r, lineColor.g, lineColor.b, alpha
          );
        }
      }
    }

    linesRef.current.geometry.setAttribute(
      'position', new THREE.Float32BufferAttribute(linePosArr, 3)
    );
    linesRef.current.geometry.setAttribute(
      'color', new THREE.Float32BufferAttribute(lineColArr, 4)
    );
    linesRef.current.geometry.computeBoundingSphere();
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a3b18a"
          size={0.08}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

// ── Floating Grid Plane ──────────────────────────────────────────────
// A large grid that slowly drifts, giving a "data matrix" floor
const FloatingGrid = () => {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const size = 40;
    const divisions = 30;
    const grid = new THREE.GridHelper(size, divisions, '#344e41', '#344e41');
    return grid.geometry;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = -6 + Math.sin(t * 0.1) * 0.5;
    ref.current.rotation.x = Math.PI * 0.02;
    ref.current.rotation.z = t * 0.01;
  });

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, -6, -5]}>
      <lineBasicMaterial
        color="#344e41"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// ── Data Stream Particles (Vertical Rain) ────────────────────────────
const DataStreams = () => {
  const ref = useRef<THREE.Points>(null);
  const streamCount = 800;

  const [positions, speeds, opacities] = useMemo(() => {
    const pos = new Float32Array(streamCount * 3);
    const spd = new Float32Array(streamCount);
    const opac = new Float32Array(streamCount);

    for (let i = 0; i < streamCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      spd[i] = 0.008 + Math.random() * 0.025;
      opac[i] = 0.2 + Math.random() * 0.5;
    }
    return [pos, spd, opac];
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < streamCount; i++) {
      posArr[i * 3 + 1] -= speeds[i];
      if (posArr[i * 3 + 1] < -12) {
        posArr[i * 3 + 1] = 12 + Math.random() * 5;
        posArr[i * 3] = (Math.random() - 0.5) * 35;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={streamCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#588157"
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ── Orbital Ring ─────────────────────────────────────────────────────
// A glowing ring that slowly rotates around the center
const OrbitalRing = ({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) => {
  const ref = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.1,
        Math.sin(angle) * radius
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = tilt;
    ref.current.rotation.y = t * speed;
    ref.current.rotation.z = tilt * 0.5;
  });

  return (
    <line ref={ref as any} geometry={geometry} position={[0, 0, -2]}>
      <lineBasicMaterial
        color="#588157"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
};

// ── Camera Drift ─────────────────────────────────────────────────────
const CameraDrift = () => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.06) * 2;
    state.camera.position.y = Math.cos(t * 0.04) * 1;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// ── Main Background Component ────────────────────────────────────────
export const NeuralBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#050608]">
      {/* Reduced vignette so the 3D elements are clearly visible */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,6,8,0.7) 80%, #050608 100%)',
        }}
      />

      {/* Subtle top glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(88,129,87,0.08)_0%,_transparent_70%)] pointer-events-none z-10" />

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
        <ambientLight intensity={0.2} />

        {/* Core wireframe icosphere */}
        <WireframeSphere />

        {/* Particle network with connections */}
        <NeuralNetwork />

        {/* Floating perspective grid */}
        <FloatingGrid />

        {/* Vertical data rain */}
        <DataStreams />

        {/* Orbital rings at different tilts */}
        <OrbitalRing radius={7} speed={0.03} tilt={0.3} />
        <OrbitalRing radius={9} speed={-0.02} tilt={-0.5} />
        <OrbitalRing radius={5.5} speed={0.04} tilt={0.8} />

        {/* Slow camera drift */}
        <CameraDrift />
      </Canvas>
    </div>
  );
};
