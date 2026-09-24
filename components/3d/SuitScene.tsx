"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SuitConfiguration } from "@/data/configuratorOptions";
import { ScrollState } from "@/hooks/useScrollStage";
import { SuitModelLoader } from "./SuitModelLoader";

interface SuitSceneProps {
  config: SuitConfiguration;
  scrollState: ScrollState;
  isConfiguratorMode: boolean;
  onModelReady?: () => void;
}

export function SuitScene({
  config,
  scrollState,
  isConfiguratorMode,
  onModelReady,
}: SuitSceneProps) {
  const suitGroupRef = useRef<THREE.Group>(null);

  // Damped rotational target values
  const currentRotation = useRef({ x: 0, y: -0.32, z: 0 });
  const currentPosition = useRef(new THREE.Vector3(0.55, 0, 0));
  const currentScale = useRef(1);

  useFrame((state, delta) => {
    if (!suitGroupRef.current) return;

    const p = scrollState.progress;
    const lerpSpeed = Math.min(delta * 4, 1);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isConfiguratorMode) {
      // In configurator mode: model is centered in the 3D viewer portal
      currentPosition.current.set(isMobile ? 0 : -0.65, 0.02, 0);
      currentScale.current = isMobile ? 0.9 : 1.15;

      suitGroupRef.current.position.lerp(currentPosition.current, lerpSpeed);
      suitGroupRef.current.scale.lerp(
        new THREE.Vector3(currentScale.current, currentScale.current, currentScale.current),
        lerpSpeed
      );
      return;
    }

    // --- Storytelling Stage Interpolations ---
    let targetYRot = -0.32; // Default front 3/4 angle
    let targetXPos = isMobile ? 0 : 0.65;
    let targetYPos = 0;
    let targetScale = isMobile ? 0.88 : 1.08;

    if (p < 0.2) {
      // Hero: front 3/4 view, centered slightly right
      targetYRot = -0.32 + p * 1.2;
      targetXPos = isMobile ? 0 : 0.68;
    } else if (p < 0.38) {
      // Silhouette: rotate 25-30 deg further toward profile
      const localP = (p - 0.2) / 0.18;
      targetYRot = -0.08 + localP * 0.75;
      targetXPos = isMobile ? 0 : 0.75;
    } else if (p < 0.56) {
      // Fabric: slight rotation to catch studio highlights
      const localP = (p - 0.38) / 0.18;
      targetYRot = 0.67 - localP * 0.45;
      targetXPos = isMobile ? 0 : 0.55;
      targetYPos = -0.05;
      targetScale = isMobile ? 0.95 : 1.18;
    } else if (p < 0.74) {
      // Details: Lapel & pockets
      const localP = (p - 0.56) / 0.18;
      targetYRot = 0.22 - localP * 0.35;
      targetXPos = isMobile ? 0 : 0.45;
      targetYPos = -0.15;
      targetScale = isMobile ? 1.05 : 1.25;
    } else if (p < 0.9) {
      // Shirt & Tie: Frontal alignment
      targetYRot = -0.05;
      targetXPos = isMobile ? 0 : 0.45;
      targetYPos = -0.08;
      targetScale = isMobile ? 0.95 : 1.15;
    } else {
      // Fit & Proportions
      targetYRot = -0.25;
      targetXPos = isMobile ? 0 : 0.5;
      targetScale = isMobile ? 0.9 : 1.1;
    }

    // Subtle idle floating / breathing
    const idleTime = state.clock.getElapsedTime();
    const idleY = Math.sin(idleTime * 0.8) * 0.015;
    const idleRotY = Math.sin(idleTime * 0.4) * 0.02;

    // Subtle mouse parallax (desktop only: ±4 deg horizontal, ±1.5 deg vertical)
    const mouseInfluenceY = isMobile ? 0 : scrollState.mouse.x * 0.07;
    const mouseInfluenceX = isMobile ? 0 : -scrollState.mouse.y * 0.03;

    // Apply interpolated rotation
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetYRot + idleRotY + mouseInfluenceY,
      lerpSpeed
    );
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      mouseInfluenceX,
      lerpSpeed
    );

    suitGroupRef.current.rotation.y = currentRotation.current.y;
    suitGroupRef.current.rotation.x = currentRotation.current.x;

    // Apply interpolated position & scale
    currentPosition.current.set(targetXPos, targetYPos + idleY, 0);
    suitGroupRef.current.position.lerp(currentPosition.current, lerpSpeed);

    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, lerpSpeed);
    suitGroupRef.current.scale.set(
      currentScale.current,
      currentScale.current,
      currentScale.current
    );
  });

  return (
    <group ref={suitGroupRef}>
      <SuitModelLoader config={config} onModelReady={onModelReady} />
    </group>
  );
}
