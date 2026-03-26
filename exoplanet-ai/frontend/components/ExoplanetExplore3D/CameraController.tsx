'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_POS = new THREE.Vector3(8, 6, 8);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export function CameraController({
  selectedId,
  focusPositionRef,
}: {
  selectedId: string | null;
  focusPositionRef: React.MutableRefObject<THREE.Vector3 | null>;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (selectedId && focusPositionRef.current) {
      targetPos.current.lerp(
        focusPositionRef.current.clone().add(new THREE.Vector3(2, 1.2, 2)),
        0.03
      );
      targetLook.current.lerp(focusPositionRef.current, 0.03);
      camera.position.lerp(targetPos.current, 0.03);
      camera.lookAt(targetLook.current);
    } else {
      camera.position.lerp(DEFAULT_POS, 0.02);
      camera.lookAt(DEFAULT_TARGET);
    }
  });
  return null;
}
