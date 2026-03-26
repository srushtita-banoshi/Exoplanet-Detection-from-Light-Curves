'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const STAR_COLOR = '#f59e0b';
const PLANET_COLOR = '#22d3ee';

function Star() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.95, 28, 28]} />
        <meshBasicMaterial color={STAR_COLOR} />
      </mesh>
      <pointLight color={STAR_COLOR} intensity={3} distance={20} />
    </group>
  );
}

function OrbitingPlanet({ radius = 0.12, color = PLANET_COLOR, speed = 0.6, distance = 3 }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = Math.cos(state.clock.elapsedTime * speed) * distance;
      ref.current.position.z = Math.sin(state.clock.elapsedTime * speed) * distance;
    }
  });
  return (
    <group ref={ref}>
      <Float speed={1} floatIntensity={0.15}>
        <mesh>
          <sphereGeometry args={[radius, 20, 20]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

export function PlanetView3D({ planetRadius = 1, className = '' }: { planetRadius?: number; className?: string }) {
  const r = Math.min(0.25, 0.1 + planetRadius * 0.05);
  return (
    <div className={`w-full ${className}`}>
      <div className="h-[200px] rounded-xl overflow-hidden border border-white/10 relative">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={['#030712']} />
          <ambientLight intensity={0.3} />
          <Star />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.2, 48]} />
            <meshBasicMaterial color={PLANET_COLOR} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <OrbitingPlanet radius={r} color={PLANET_COLOR} speed={0.5} distance={3} />
        </Canvas>
      </div>
      <div className="flex items-center justify-center gap-6 mt-2 text-xs">
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          Star
        </span>
        <span className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
          Planet
        </span>
      </div>
    </div>
  );
}
