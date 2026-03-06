'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function Star() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <pointLight color="#fbbf24" intensity={2.5} distance={18} />
    </group>
  );
}

function OrbitingPlanet({ radius = 0.12, color = '#22d3ee', speed = 0.6, distance = 3 }) {
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
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export function PlanetView3D({ planetRadius = 1, className = '' }: { planetRadius?: number; className?: string }) {
  const r = Math.min(0.25, 0.1 + planetRadius * 0.05);
  return (
    <div className={`w-full h-[200px] rounded-xl overflow-hidden border border-white/10 ${className}`}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.3} />
        <Star />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.2, 48]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <OrbitingPlanet radius={r} color="#22d3ee" speed={0.5} distance={3} />
      </Canvas>
    </div>
  );
}
