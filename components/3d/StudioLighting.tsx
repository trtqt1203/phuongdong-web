"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";

export function StudioLighting() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Studio Ambient baseline */}
      <ambientLight intensity={0.55} color="#FAF7F2" />

      {/* Main Studio Key Light: Warm, soft highlight on chest & lapel */}
      <directionalLight
        ref={keyLightRef}
        position={[3.5, 4.5, 4.0]}
        intensity={1.8}
        color="#FFF9F0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0001}
      />

      {/* Softer Fill Light: Cool neutral fill from opposite flank */}
      <directionalLight
        position={[-4.0, 2.5, 3.0]}
        intensity={0.85}
        color="#E8EEF5"
      />

      {/* Rim / Silhouette Back Light: Crisp edge lighting on shoulders and collar */}
      <directionalLight
        position={[0.0, 4.0, -4.5]}
        intensity={1.2}
        color="#FFF5E4"
      />

      {/* Subtle under-bounce light */}
      <directionalLight
        position={[0, -2, 2]}
        intensity={0.25}
        color="#B99A63"
      />

      {/* Contact Shadow beneath mannequin stand */}
      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.65}
        scale={6}
        blur={2.2}
        far={3.5}
        color="#040404"
      />
    </>
  );
}
