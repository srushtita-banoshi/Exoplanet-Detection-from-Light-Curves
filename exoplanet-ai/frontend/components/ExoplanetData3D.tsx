'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const ID_ALIASES: Record<string, string> = {
  'kepler-22b': 'k22b', 'trappist-1e': 't1e', 'toi-700-d': 'toi700',
  'kepler-186f': 'k186f', 'kepler-452b': 'k452b',
};

const PLANET_COLORS = ['#22d3ee', '#22c55e', '#eab308', '#a78bfa', '#f472b6'] as const;

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

function semiMajorAxisAu(periodDays: number): string {
  const a = (periodDays * periodDays / (365.25 * 365.25)) ** (1 / 3);
  return a.toFixed(2);
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
  const baseSize = 0.14 * Math.min(sizeScale, 2);
  useFrame((state) => {
    if (ref.current && isHighlighted) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.15);
    }
  });
  const au = semiMajorAxisAu(planet.period_days);
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[baseSize, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 0.7 : 0.5}
        />
      </mesh>
      <Html
        position={[0, baseSize + 0.35, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '10px',
          color: '#e2e8f0',
          background: 'rgba(3, 7, 18, 0.9)',
          padding: '4px 8px',
          borderRadius: '6px',
          border: `1px solid ${color}60`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontWeight: 600, color }}>{planet.name}</div>
        <div style={{ color: '#94a3b8', fontSize: '9px', marginTop: '2px' }}>{au} AU · {planet.habitabilty_score}/100</div>
      </Html>
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
      DEMO_PLANETS.map((p, i) => {
        const x = (normalize(p.period_days, minP, maxP) - 0.5) * 4;
        const y = (normalize(p.radius_earth, minR, maxR) - 0.5) * 4;
        const z = (p.habitabilty_score / 100 - 0.5) * 4;
        const color = PLANET_COLORS[i % PLANET_COLORS.length];
        const sizeScale = p.radius_earth;
        return { planet: p, position: [x, z, y] as [number, number, number], color, sizeScale };
      }),
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 6]} intensity={1.2} />
      <pointLight position={[-6, -6, 4]} intensity={0.6} />
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
        minDistance={4}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.4}
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
    <div className={`relative w-full h-[320px] rounded-xl overflow-hidden border border-white/10 ${className}`}>
      <Canvas camera={{ position: [6, 5, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#030712']} />
        <Scene highlightId={resolvedId} />
      </Canvas>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-slate-500 px-2 pointer-events-none">
        <span>X: Period (d)</span>
        <span>Y: Radius (R⊕)</span>
        <span>Z: Habitability</span>
      </div>
      <div className="absolute top-2 left-2 text-[10px] text-slate-500 pointer-events-none">
        Each sphere = one planet · Label shows name, distance (AU), habitability
      </div>
    </div>
  );
}
