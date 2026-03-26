'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const STAR_COLOR = '#f59e0b';
const PLANET_COLOR = '#22d3ee';

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color={STAR_COLOR} />
      <pointLight color={STAR_COLOR} intensity={3} distance={20} />
    </mesh>
  );
}

function Planet({ radius = 0.15, color = PLANET_COLOR, speed = 0.5, distance = 4 }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = Math.cos(state.clock.elapsedTime * speed) * distance;
      ref.current.position.z = Math.sin(state.clock.elapsedTime * speed) * distance;
    }
  });
  return (
    <group ref={ref}>
      <Float speed={1.5} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
      <meshBasicMaterial color={PLANET_COLOR} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function SpaceScene3D({ className = '', compact }: { className?: string; compact?: boolean }) {
  const heightClass = compact ? 'h-[260px] md:h-[280px]' : 'h-[320px] md:h-[400px]';
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-white/10`}>
        <Canvas
          camera={{ position: [0, 4, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#030712']} />
          <ambientLight intensity={0.2} />
          <Stars radius={80} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Sun />
          <OrbitRing radius={4} />
          <Planet radius={0.2} color={PLANET_COLOR} speed={0.4} distance={4} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={6}
            maxDistance={20}
            autoRotate
            autoRotateSpeed={0.3}
          />
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
