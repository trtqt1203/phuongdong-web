"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { SuitConfiguration, FABRICS, SHIRTS, TIES } from "@/data/configuratorOptions";
import { StylizedSuitMannequin } from "./StylizedSuitMannequin";
import { categorizeSuitMeshes, applyConfigurationToMeshes } from "./meshMapping";

interface SuitModelLoaderProps {
  config: SuitConfiguration;
  onModelReady?: () => void;
}

// Inner component that loads GLB if available
function GLTFModelWrapper({
  modelUrl,
  config,
  onLoaded,
}: {
  modelUrl: string;
  config: SuitConfiguration;
  onLoaded?: () => void;
}) {
  const gltf = useGLTF(modelUrl);

  const categorized = useMemo(() => {
    if (!gltf?.scene) return null;
    return categorizeSuitMeshes(gltf.scene);
  }, [gltf]);

  useEffect(() => {
    if (categorized && gltf?.scene) {
      const fabric = FABRICS.find((f) => f.id === config.fabric) || FABRICS[0];
      const shirt = SHIRTS.find((s) => s.id === config.shirt) || SHIRTS[0];
      const tie = TIES.find((t) => t.id === config.tie) || TIES[0];

      applyConfigurationToMeshes(
        categorized,
        config,
        fabric.color,
        shirt.color,
        tie.color
      );
      onLoaded?.();
    }
  }, [categorized, config, gltf, onLoaded]);

  if (!gltf?.scene) return null;

  return (
    <primitive
      object={gltf.scene}
      position={[0, -0.6, 0]}
      scale={[1.2, 1.2, 1.2]}
      castShadow
      receiveShadow
    />
  );
}

let cachedHasModel: boolean | null = null;

export function SuitModelLoader({ config, onModelReady }: SuitModelLoaderProps) {
  const [hasExternalModel, setHasExternalModel] = useState<boolean | null>(cachedHasModel);
  const modelPath = "/models/suit.glb";

  useEffect(() => {
    if (cachedHasModel !== null) {
      setHasExternalModel(cachedHasModel);
      onModelReady?.();
      return;
    }

    let mounted = true;
    fetch("/api/check-model")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const exists = Boolean(data?.exists);
        cachedHasModel = exists;
        setHasExternalModel(exists);
        onModelReady?.();
      })
      .catch(() => {
        if (mounted) {
          cachedHasModel = false;
          setHasExternalModel(false);
          onModelReady?.();
        }
      });

    return () => {
      mounted = false;
    };
  }, []); // Run once on mount

  if (hasExternalModel) {
    return (
      <Suspense fallback={<StylizedSuitMannequin config={config} />}>
        <GLTFModelWrapper
          modelUrl={modelPath}
          config={config}
          onLoaded={onModelReady}
        />
      </Suspense>
    );
  }

  // Primary procedural luxury atelier suit mannequin
  return <StylizedSuitMannequin config={config} />;
}
