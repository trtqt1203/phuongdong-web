"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { SuitConfiguration } from "@/data/configuratorOptions";
import { ScrollState } from "@/hooks/useScrollStage";
import { StudioLighting } from "./StudioLighting";
import { CameraController } from "./CameraController";
import { SuitScene } from "./SuitScene";

interface SuitCanvasProps {
  config: SuitConfiguration;
  scrollState: ScrollState;
  isConfiguratorMode: boolean;
  onReady?: () => void;
}

export function SuitCanvas({
  config,
  scrollState,
  isConfiguratorMode,
  onReady,
}: SuitCanvasProps) {
  const [dpr, setDpr] = useState(1);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDpr(Math.min(window.devicePixelRatio, 2));

      // Check basic WebGL support
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) setHasWebGL(false);
      } catch {
        setHasWebGL(false);
      }
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center text-atelier-textMuted bg-[#0c0c0c]">
        <div>
          <p className="font-serif text-2xl text-atelier-gold mb-2">3D Atelier Display</p>
          <p className="text-xs max-w-sm">
            Hardware acceleration is disabled or unsupported in this browser. You can still customize
            all bespoke options below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative canvas-3d-container">
      <Canvas
        camera={{ position: [0, 0.35, 3.8], fov: 42, near: 0.1, far: 25 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: "high-performance",
        }}
        shadows
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: isConfiguratorMode ? "auto" : "none",
        }}
      >
        <StudioLighting />
        <CameraController
          scrollState={scrollState}
          isConfiguratorMode={isConfiguratorMode}
        />
        <SuitScene
          config={config}
          scrollState={scrollState}
          isConfiguratorMode={isConfiguratorMode}
          onModelReady={onReady}
        />
      </Canvas>
    </div>
  );
}
