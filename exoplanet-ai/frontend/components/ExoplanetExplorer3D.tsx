'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  EXPLORER_PLANETS,
  PLANET_TYPE_COLORS,
  getHabitabilityVerdict,
  waterProbability,
  earthSimilarityIndex,
  type ExplorerPlanet,
} from '@/lib/exoplanetExplorerData';

function normalize(v: number, min: number, max: number): number {
  return (v - min) / (max - min || 1);
}

// —— Galaxy layout: position planets in 3D (period, radius, habitability)
function getGalaxyPosition(p: ExplorerPlanet, index: number): [number, number, number] {
  const periods = EXPLORER_PLANETS.map((x) => x.period_days);
  const radii = EXPLORER_PLANETS.map((x) => x.radius_earth);
  const x = (normalize(p.period_days, Math.min(...periods), Math.max(...periods)) - 0.5) * 8;
  const z = (normalize(p.radius_earth, Math.min(...radii), Math.max(...radii)) - 0.5) * 6;
  const y = (p.habitability_score / 100 - 0.5) * 6;
  return [x, y, z];
}

function Starfield() {
  return (
    <Stars
      radius={120}
      depth={60}
      count={3000}
      factor={4}
      saturation={0.1}
      fade
      speed={0.3}
    />
  );
}

function PlanetMarker({
  planet,
  position,
  isHovered,
  isSelected,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  planet: ExplorerPlanet;
  position: [number, number, number];
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const color = PLANET_TYPE_COLORS[planet.type];
  const size = 0.2 * Math.min(planet.radius_earth, 2);
  const scale = 1 + (isHovered ? 0.4 : 0) + (isSelected ? 0.2 : 0);
  const emissive = isHovered || isSelected ? 0.9 : 0.5;
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });
  return (
    <group position={position}>
      <mesh
        ref={ref}
        scale={scale}
        onClick={(e) => (e.stopPropagation(), onClick())}
        onPointerOver={(e) => (e.stopPropagation(), onPointerOver())}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissive}
        />
      </mesh>
      <pointLight color={color} intensity={isHovered || isSelected ? 2 : 1} distance={4} />
      <Html
        position={[0, size + 0.5, 0]}
        center
        distanceFactor={12}
        style={{
          pointerEvents: 'none',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          color: '#e2e8f0',
          background: 'rgba(3, 7, 18, 0.9)',
          padding: '6px 10px',
          borderRadius: '8px',
          border: `1px solid ${color}60`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontWeight: 600, color }}>{planet.name}</div>
        <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
          {planet.orbital_au.toFixed(2)} AU · Habitability: {planet.habitability_score}%
        </div>
      </Html>
    </group>
  );
}

function SystemStar() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <pointLight color="#f59e0b" intensity={4} distance={25} />
    </group>
  );
}

function OrbitingPlanetInSystem({
  planet,
  orbitalRadius,
  speed,
  onClick,
}: {
  planet: ExplorerPlanet;
  orbitalRadius: number;
  speed: number;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const color = PLANET_TYPE_COLORS[planet.type];
  const size = 0.15 * Math.min(planet.radius_earth, 2);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(t) * orbitalRadius;
      ref.current.position.z = Math.sin(t) * orbitalRadius;
    }
  });
  return (
    <group ref={ref} onClick={(e) => (e.stopPropagation(), onClick())}>
      <mesh>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <pointLight color={color} intensity={1.5} distance={8} />
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

function GalaxyScene({
  selectedId,
  hoveredId,
  onPlanetClick,
  onPlanetHover,
  onPlanetLeave,
}: {
  selectedId: string | null;
  hoveredId: string | null;
  onPlanetClick: (p: ExplorerPlanet) => void;
  onPlanetHover: (p: ExplorerPlanet) => void;
  onPlanetLeave: () => void;
}) {
  const positions = useMemo(
    () => EXPLORER_PLANETS.map((p, i) => getGalaxyPosition(p, i)),
    []
  );
  return (
    <>
      <Starfield />
      {EXPLORER_PLANETS.map((planet, i) => (
        <PlanetMarker
          key={planet.id}
          planet={planet}
          position={positions[i]!}
          isHovered={hoveredId === planet.id}
          isSelected={selectedId === planet.id}
          onClick={() => onPlanetClick(planet)}
          onPointerOver={() => onPlanetHover(planet)}
          onPointerOut={onPlanetLeave}
        />
      ))}
    </>
  );
}

function SystemScene({
  planet,
  onPlanetClick,
}: {
  planet: ExplorerPlanet;
  onPlanetClick: (p: ExplorerPlanet) => void;
}) {
  const orbitalRadius = 3;
  const speed = 0.5 / Math.max(0.1, planet.period_days / 100);
  return (
    <>
      <Starfield />
      <SystemStar />
      <OrbitRing radius={orbitalRadius} />
      <OrbitingPlanetInSystem
        planet={planet}
        orbitalRadius={orbitalRadius}
        speed={speed}
        onClick={() => onPlanetClick(planet)}
      />
      <Html position={[0, 2.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none', color: '#94a3b8', fontSize: '12px' }}>
        {planet.host_star}
      </Html>
    </>
  );
}

function InfoPanel({
  planet,
  onClose,
}: {
  planet: ExplorerPlanet;
  onClose: () => void;
}) {
  const verdict = getHabitabilityVerdict(planet.habitability_score, planet.type);
  const waterProb = waterProbability(planet.habitability_score);
  const esi = earthSimilarityIndex(planet.radius_earth, planet.habitability_score);
  const color = PLANET_TYPE_COLORS[planet.type];
  return (
    <div
      className="absolute top-4 right-4 w-72 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-sm shadow-xl z-10"
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-100">{planet.name}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div><dt className="text-slate-500">Host Star</dt><dd className="text-slate-200">{planet.host_star}</dd></div>
          <div><dt className="text-slate-500">Distance from Earth</dt><dd className="text-slate-200">~{planet.distance_ly} ly</dd></div>
          <div><dt className="text-slate-500">Orbital Period</dt><dd className="text-slate-200">{planet.period_days.toFixed(1)} days</dd></div>
          <div><dt className="text-slate-500">Orbital Distance</dt><dd className="text-slate-200">{planet.orbital_au.toFixed(2)} AU</dd></div>
          <div><dt className="text-slate-500">Planet Radius</dt><dd className="text-slate-200">{planet.radius_earth} R⊕</dd></div>
          <div><dt className="text-slate-500">Planet Mass</dt><dd className="text-slate-200">~{planet.mass_earth} M⊕</dd></div>
          <div><dt className="text-slate-500">Discovery</dt><dd className="text-slate-200">{planet.discovery} ({planet.discovery_method})</dd></div>
        </dl>
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Habitability Score</span>
            <span style={{ color }}>{planet.habitability_score}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${planet.habitability_score}%`, backgroundColor: color }}
            />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-slate-500">Water Probability</span><br /><span className="text-slate-200">{waterProb}%</span></div>
          <div><span className="text-slate-500">Earth Similarity</span><br /><span className="text-slate-200">{esi}</span></div>
        </div>
        <div className="mt-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-slate-500 mb-0.5">AI Verdict</p>
          <p className="text-sm font-medium" style={{ color }}>{verdict}</p>
        </div>
      </div>
    </div>
  );
}

export function ExoplanetExplorer3D() {
  const [viewMode, setViewMode] = useState<'galaxy' | 'system'>('galaxy');
  const [selectedSystemId, setSelectedSystemId] = useState<string>(EXPLORER_PLANETS[0]!.id);
  const [selectedPlanet, setSelectedPlanet] = useState<ExplorerPlanet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<ExplorerPlanet | null>(null);
  const systemPlanet = useMemo(
    () => EXPLORER_PLANETS.find((p) => p.id === selectedSystemId) ?? EXPLORER_PLANETS[0]!,
    [selectedSystemId]
  );

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-[#030712]">
      <Canvas camera={{ position: [10, 6, 10], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 30, 100]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[20, 20, 20]} intensity={0.8} />
        {viewMode === 'galaxy' ? (
          <GalaxyScene
            selectedId={selectedPlanet?.id ?? null}
            hoveredId={hoveredPlanet?.id ?? null}
            onPlanetClick={setSelectedPlanet}
            onPlanetHover={setHoveredPlanet}
            onPlanetLeave={() => setHoveredPlanet(null)}
          />
        ) : (
          <SystemScene planet={systemPlanet} onPlanetClick={setSelectedPlanet} />
        )}
        <OrbitControls
          enableZoom
          enablePan
          minDistance={4}
          maxDistance={30}
          autoRotate={!selectedPlanet}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => setViewMode('galaxy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'galaxy' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-400/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:border-cyan-400/30'}`}
        >
          Galaxy View
        </button>
        <button
          onClick={() => setViewMode('system')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'system' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-400/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:border-cyan-400/30'}`}
        >
          Star System View
        </button>
        {viewMode === 'system' && (
          <select
            value={selectedSystemId}
            onChange={(e) => setSelectedSystemId(e.target.value)}
            className="ml-2 px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 focus:border-cyan-400/50 focus:outline-none"
          >
            {EXPLORER_PLANETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        {selectedPlanet && (
          <button
            onClick={() => setSelectedPlanet(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-slate-300 border border-white/10 hover:border-cyan-400/30"
          >
            Back to view
          </button>
        )}
      </div>

      {selectedPlanet && <InfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />}

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px] text-slate-500 z-10">
        <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Earth-like</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Habitable</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1" />Super-Earth</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />Gas giant</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-violet-500 mr-1" />Unknown</span>
      </div>
    </div>
  );
}
