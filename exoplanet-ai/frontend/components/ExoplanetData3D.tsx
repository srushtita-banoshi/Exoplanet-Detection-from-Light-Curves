'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ID_ALIASES: Record<string, string> = {
  'kepler-22b': 'k22b', 'trappist-1e': 't1e', 'toi-700-d': 'toi700',
  'kepler-186f': 'k186f', 'kepler-452b': 'k452b',
};

type Planet = {
  id: string;
  name: string;
  period_days: number;
  radius_earth: number;
  habitabilty_score: number;
  discovery: string;
};

const DEMO_PLANETS: Planet[] = [
  { id: 'k22b', name: 'Kepler-22b', period_days: 289.9, radius_earth: 2.4, habitabilty_score: 72, discovery: 'Kepler (2011)' },
  { id: 't1e', name: 'TRAPPIST-1e', period_days: 6.1, radius_earth: 0.92, habitabilty_score: 85, discovery: 'Spitzer/Kepler' },
  { id: 'toi700', name: 'TOI-700 d', period_days: 37.4, radius_earth: 1.14, habitabilty_score: 82, discovery: 'TESS (2020)' },
  { id: 'k186f', name: 'Kepler-186f', period_days: 129.9, radius_earth: 1.11, habitabilty_score: 80, discovery: 'Kepler (2014)' },
  { id: 'k452b', name: 'Kepler-452b', period_days: 384.8, radius_earth: 1.63, habitabilty_score: 78, discovery: 'Kepler (2015)' },
];

function normalize(val: number, min: number, max: number): number {
  return (val - min) / (max - min || 1);
}

function StarReference() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <group position={[-2.5, -2.5, -2.5]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <pointLight color="#fbbf24" intensity={2} distance={6} />
    </group>
  );
}

function DataPoint({
  planet,
  position,
  isHighlighted,
  color,
  sizeScale,
}: {
  planet: Planet;
  position: [number, number, number];
  isHighlighted: boolean;
  color: string;
  sizeScale: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseSize = 0.06 * sizeScale;
  useFrame((state) => {
    if (ref.current && isHighlighted) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[isHighlighted ? baseSize * 1.5 : baseSize, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 0.7 : 0.4}
        />
      </mesh>
    </group>
  );
}

function Scene({ highlightId }: { highlightId?: string }) {
  const periods = DEMO_PLANETS.map((p) => p.period_days);
  const radii = DEMO_PLANETS.map((p) => p.radius_earth);
  const minP = Math.min(...periods);
  const maxP = Math.max(...periods);
  const minR = Math.min(...radii);
  const maxR = Math.max(...radii);

  const points = useMemo(
    () =>
      DEMO_PLANETS.map((p) => {
        const x = (normalize(p.period_days, minP, maxP) - 0.5) * 4;
        const y = (normalize(p.radius_earth, minR, maxR) - 0.5) * 4;
        const z = (p.habitabilty_score / 100 - 0.5) * 4;
        const color =
          p.habitabilty_score >= 70 ? '#22c55e' : p.habitabilty_score >= 40 ? '#eab308' : '#64748b';
        const sizeScale = p.radius_earth;
        return { planet: p, position: [x, z, y] as [number, number, number], color, sizeScale };
      }),
    []
  );

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} />
      <StarReference />
      {points.map(({ planet, position, color, sizeScale }) => (
        <DataPoint
          key={planet.id}
          planet={planet}
          position={position}
          isHighlighted={highlightId === planet.id}
          color={color}
          sizeScale={sizeScale}
        />
      ))}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function ExoplanetData3D({
  highlightId,
  className = '',
}: {
  highlightId?: string;
  className?: string;
}) {
  const resolvedId = highlightId ? (ID_ALIASES[highlightId] ?? highlightId) : undefined;
  return (
    <div className={`relative w-full h-[280px] rounded-xl overflow-hidden border border-white/10 ${className}`}>
      <Canvas camera={{ position: [5, 4, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#030712']} />
        <Scene highlightId={resolvedId} />
      </Canvas>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-slate-500 px-2 pointer-events-none">
        <span>X: Period</span>
        <span>Y: Radius</span>
        <span>Z: Habitability</span>
      </div>
      <div className="absolute top-2 left-2 text-[10px] text-amber-400/80 pointer-events-none">
        ★ Star reference
      </div>
    </div>
  );
}
