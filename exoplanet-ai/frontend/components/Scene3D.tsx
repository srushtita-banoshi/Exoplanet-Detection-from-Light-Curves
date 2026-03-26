'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ radius = 0.15, color = '#22d3ee', speed = 0.5 }) {
  const mesh = useRef<THREE.Mesh>(null);
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={mesh}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </Float>
  );
}

function Star() {
  return (
    <mesh>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshBasicMaterial color="#fbbf24" />
      <pointLight color="#fbbf24" intensity={2} distance={5} />
    </mesh>
  );
}

function OrbitRing({ radius = 1.2 }) {
  const points = new THREE.EllipseCurve(0, 0, radius, radius * 0.6, 0, 2 * Math.PI, false, 0).getPoints(64);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.4 });
  const line = new THREE.Line(geometry, material);
  return <primitive object={line} />;
}

function OrbitingPlanet({ period = 5 }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      const t = (performance.now() / 1000) * (2 * Math.PI) / period;
      group.current.position.x = 1.2 * Math.cos(t);
      group.current.position.z = 0.72 * Math.sin(t);
    }
  });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function SceneContent({ mode = 'hero' }: { mode?: 'hero' | 'detail' }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Star />
      <OrbitRing radius={mode === 'hero' ? 1.2 : 1.5} />
      <OrbitingPlanet period={mode === 'hero' ? 8 : 6} />
      {mode === 'detail' && <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />}
    </>
  );
}

export function Scene3D({ className = '', mode = 'hero' }: { className?: string; mode?: 'hero' | 'detail' }) {
  return (
    <div className={className} style={{ background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <SceneContent mode={mode} />
      </Canvas>
    </div>
  );
}
