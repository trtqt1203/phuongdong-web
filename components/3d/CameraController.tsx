"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { ScrollState } from "@/hooks/useScrollStage";

interface CameraControllerProps {
  scrollState: ScrollState;
  isConfiguratorMode: boolean;
}

export function CameraController({ scrollState, isConfiguratorMode }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType>(null);

  // Target camera position vectors
  const targetCamPos = useRef(new THREE.Vector3(0, 0.4, 3.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.2, 0));

  // Reset controls target when entering configurator mode
  useEffect(() => {
    if (isConfiguratorMode && controlsRef.current) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      controlsRef.current.target.set(isMobile ? 0 : -0.65, 0.15, 0);
      controlsRef.current.update();
    }
  }, [isConfiguratorMode]);

  useFrame((_, delta) => {
    if (isConfiguratorMode) {
      // In configurator mode, OrbitControls is active
      return;
    }

    const p = scrollState.progress;
    const lerpSpeed = Math.min(delta * 4.5, 1);

    // Compute camera target position based on scroll progress
    if (p < 0.2) {
      // Stage 1: Hero - Chest/upper-body fashion perspective
      // Desktop: model occupies right/center-right
      const isMobile = window.innerWidth < 768;
      targetCamPos.current.set(isMobile ? 0 : -0.25, 0.35, 3.8);
      targetLookAt.current.set(isMobile ? 0 : 0.35, 0.25, 0);
    } else if (p < 0.38) {
      // Stage 2: Silhouette - side angle view
      targetCamPos.current.set(-0.5, 0.25, 3.6);
      targetLookAt.current.set(0.3, 0.1, 0);
    } else if (p < 0.56) {
      // Stage 3: Fabric - Medium close-up on jacket textile
      targetCamPos.current.set(-0.3, 0.45, 3.2);
      targetLookAt.current.set(0.25, 0.35, 0);
    } else if (p < 0.74) {
      // Stage 4: Details & Lapel - Close-up on lapel, collar, and chest
      targetCamPos.current.set(-0.2, 0.65, 2.7);
      targetLookAt.current.set(0.2, 0.55, 0);
    } else if (p < 0.9) {
      // Stage 5: Shirt & Tie - Centered chest view
      targetCamPos.current.set(-0.15, 0.6, 2.9);
      targetLookAt.current.set(0.15, 0.5, 0);
    } else {
      // Stage 6: Fit - Proportional view
      targetCamPos.current.set(0, 0.2, 3.6);
      targetLookAt.current.set(0, 0.1, 0);
    }

    // Smoothly lerp camera position
    camera.position.lerp(targetCamPos.current, lerpSpeed);
    camera.lookAt(targetLookAt.current);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={isConfiguratorMode}
      enableDamping={true}
      dampingFactor={0.06}
      enablePan={false}
      minDistance={2.1}
      maxDistance={4.8}
      minPolarAngle={Math.PI / 4.5} // ~40 deg: cannot view from straight overhead
      maxPolarAngle={Math.PI / 1.75} // ~102 deg: cannot view from under floor
      rotateSpeed={0.65}
    />
  );
}
