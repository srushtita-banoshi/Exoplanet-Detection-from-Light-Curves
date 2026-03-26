'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  DEMO_EXOPLANETS,
  PLANET_TYPE_COLORS,
  type ExoplanetRecord,
} from '@/lib/exoplanetData';

const STAR_COLOR = '#f59e0b';
const ORBIT_RING_COLOR = 'rgba(34, 211, 238, 0.12)';

function OrbitingPlanetWrapper({
  planet,
  radius,
  startAngle,
  color,
  isHovered,
  isSelected,
  onClick,
  onPointerOver,
  onPointerOut,
  showLabel,
}: {
  planet: ExoplanetRecord;
  radius: number;
  startAngle: number;
  color: string;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  showLabel: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const speed = 0.15 / Math.max(planet.period_days / 100, 0.05);
      const angle = startAngle + state.clock.elapsedTime * speed;
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
    }
  });
  return (
    <group ref={groupRef}>
      <PlanetSphere
        planet={planet}
        position={[0, 0, 0]}
        color={color}
        isHovered={isHovered}
        isSelected={isSelected}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        showLabel={showLabel}
      />
    </group>
  );
}

function CentralStar() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color={STAR_COLOR} />
      </mesh>
      <pointLight color={STAR_COLOR} intensity={2} distance={25} />
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
      <meshBasicMaterial color={ORBIT_RING_COLOR} transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PlanetSphere({
  planet,
  position,
  color,
  isHovered,
  isSelected,
  onClick,
  onPointerOver,
  onPointerOut,
  showLabel,
}: {
  planet: ExoplanetRecord;
  position: [number, number, number];
  color: string;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  showLabel: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scale = 0.12 * Math.min(planet.radius_earth, 2.5);
  const displayScale = isHovered || isSelected ? scale * 1.35 : scale;
  useFrame((state) => {
    if (meshRef.current && (isHovered || isSelected)) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.08);
    }
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        scale={displayScale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 0.7 : 0.4}
        />
      </mesh>
      {showLabel && (
        <Html
          position={[0, 1.6, 0]}
          center
          distanceFactor={6}
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
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 600, color }}>{planet.name}</div>
          <div style={{ color: '#94a3b8', fontSize: '9px', marginTop: '2px' }}>
            {planet.semiMajorAxisAu.toFixed(2)} AU · Habitability: {planet.habitability_score}%
          </div>
        </Html>
      )}
    </group>
  );
}

type ViewMode = 'system' | 'galaxy';

export function SceneContent({
  viewMode,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  cameraTargetRef,
}: {
  viewMode: ViewMode;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  cameraTargetRef: React.MutableRefObject<THREE.Vector3 | null>;
}) {
  const maxAu = Math.max(...DEMO_EXOPLANETS.map((p) => p.semiMajorAxisAu));
  const orbitScale = 3 / Math.max(maxAu, 0.2);

  const systemPositions = useMemo(() => {
    return DEMO_EXOPLANETS.map((p, i) => {
      const r = p.semiMajorAxisAu * orbitScale;
      const angle = (i / DEMO_EXOPLANETS.length) * Math.PI * 2;
      return { planet: p, radius: r, startAngle: angle };
    });
  }, [orbitScale]);

  const galaxyPositions = useMemo(() => {
    return DEMO_EXOPLANETS.map((p, i) => {
      const x = (p.semiMajorAxisAu / maxAu) * 4 - 2;
      const z = (p.habitability_score / 100) * 4 - 2;
      const y = (p.radius_earth / 2.5) * 2 - 1;
      return { planet: p, position: [x, y, z] as [number, number, number] };
    });
  }, [maxAu]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cameraTargetRef.current && selectedId) {
      const planet = DEMO_EXOPLANETS.find((p) => p.id === selectedId);
      if (planet) {
        let px = 0, py = 0, pz = 0;
        if (viewMode === 'system') {
          const sp = systemPositions.find((s) => s.planet.id === selectedId);
          if (sp) {
            const angle = sp.startAngle + (t * 0.5) / Math.max(0.1, sp.planet.period_days / 100);
            px = Math.cos(angle) * sp.radius;
            pz = Math.sin(angle) * sp.radius;
            py = 0;
          }
        } else {
          const gp = galaxyPositions.find((g) => g.planet.id === selectedId);
          if (gp) [px, py, pz] = gp.position;
        }
        cameraTargetRef.current.lerp(new THREE.Vector3(px, py, pz), 0.02);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#030712', 15, 40]} />
      {viewMode === 'system' && (
        <>
          <CentralStar />
          {systemPositions.map(({ planet, radius, startAngle }) => (
            <OrbitRing key={planet.id} radius={radius} />
          ))}
          {systemPositions.map(({ planet, radius, startAngle }) => (
            <OrbitingPlanetWrapper
              key={planet.id}
              planet={planet}
              radius={radius}
              startAngle={startAngle}
              color={PLANET_TYPE_COLORS[planet.type]}
              isHovered={hoveredId === planet.id}
              isSelected={selectedId === planet.id}
              onClick={() => onSelect(selectedId === planet.id ? null : planet.id)}
              onPointerOver={() => onHover(planet.id)}
              onPointerOut={() => onHover(null)}
              showLabel={!selectedId || selectedId === planet.id}
            />
          ))}
        </>
      )}
      {viewMode === 'galaxy' &&
        galaxyPositions.map(({ planet, position }) => {
          const color = PLANET_TYPE_COLORS[planet.type];
          return (
            <PlanetSphere
              key={planet.id}
              planet={planet}
              position={position}
              color={color}
              isHovered={hoveredId === planet.id}
              isSelected={selectedId === planet.id}
              onClick={() => onSelect(selectedId === planet.id ? null : planet.id)}
              onPointerOver={() => onHover(planet.id)}
              onPointerOut={() => onHover(null)}
              showLabel={!selectedId || selectedId === planet.id}
            />
          );
        })}
      <OrbitControls
        enableZoom
        enablePan
        minDistance={2}
        maxDistance={25}
        autoRotate={!selectedId}
        autoRotateSpeed={0.2}
      />
    </>
  );
}
