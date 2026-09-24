"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SuitConfiguration, FABRICS, SHIRTS, TIES, FITS } from "@/data/configuratorOptions";

interface StylizedSuitMannequinProps {
  config: SuitConfiguration;
}

export function StylizedSuitMannequin({ config }: StylizedSuitMannequinProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Active options
  const fabric = useMemo(() => FABRICS.find((f) => f.id === config.fabric) || FABRICS[0], [config.fabric]);
  const shirt = useMemo(() => SHIRTS.find((s) => s.id === config.shirt) || SHIRTS[0], [config.shirt]);
  const tie = useMemo(() => TIES.find((t) => t.id === config.tie) || TIES[0], [config.tie]);
  const fit = useMemo(() => FITS.find((f) => f.id === config.fit) || FITS[1], [config.fit]);

  // Target colors for smooth lerp
  const targetFabricColor = useMemo(() => new THREE.Color(fabric.color), [fabric.color]);
  const targetShirtColor = useMemo(() => new THREE.Color(shirt.color), [shirt.color]);
  const targetTieColor = useMemo(() => (tie.color ? new THREE.Color(tie.color) : new THREE.Color("#111111")), [tie.color]);

  // Materials
  const jacketMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(fabric.color),
      roughness: fabric.roughness,
      metalness: fabric.metalness,
      bumpScale: 0.002,
    });
  }, [fabric.color, fabric.roughness, fabric.metalness]);

  const lapelSatinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(fabric.color),
      roughness: 0.42, // subtle grosgrain/satin luster
      metalness: 0.05,
    });
  }, [fabric.color]);

  const shirtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(shirt.color),
      roughness: 0.82,
      metalness: 0.0,
    });
  }, [shirt.color]);

  const tieMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: targetTieColor,
      roughness: 0.35, // silk sheen
      metalness: 0.12,
    });
  }, [targetTieColor]);

  const hornButtonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#181512"),
      roughness: 0.25,
      metalness: 0.35,
    });
  }, []);

  const goldBrassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#B99A63"),
      roughness: 0.3,
      metalness: 0.85,
    });
  }, []);

  const pocketSquareMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FAFAF8"),
      roughness: 0.45,
      metalness: 0.0,
    });
  }, []);

  const mannequinWoodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1714"),
      roughness: 0.5,
      metalness: 0.1,
    });
  }, []);

  // Frame loop for smooth color transition & gentle fit morphing
  useFrame((_, delta) => {
    const factor = Math.min(delta * 8, 1);
    jacketMaterial.color.lerp(targetFabricColor, factor);
    lapelSatinMaterial.color.lerp(targetFabricColor, factor);
    shirtMaterial.color.lerp(targetShirtColor, factor);
    if (tie.color) {
      tieMaterial.color.lerp(targetTieColor, factor);
    }
  });

  // Fit scaling factors
  const waistScale = fit.waistScale;
  const chestScale = fit.chestScale;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* ========================================================
          1. ATELIER MANNEQUIN STAND & FINIAL
      ======================================================== */}
      {/* Neck Finial / Cap (Polished brass) */}
      <mesh position={[0, 1.34, 0]} material={goldBrassMaterial} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.08, 32]} />
      </mesh>
      <mesh position={[0, 1.39, 0]} material={goldBrassMaterial}>
        <sphereGeometry args={[0.035, 24, 24]} />
      </mesh>

      {/* Mannequin Neck (Tailor linen / dark wood) */}
      <mesh position={[0, 1.22, 0]} material={mannequinWoodMaterial}>
        <cylinderGeometry args={[0.082, 0.095, 0.18, 32]} />
      </mesh>

      {/* Stand Central Rod (Behind legs down to floor) */}
      <mesh position={[0, -1.0, 0]} material={mannequinWoodMaterial}>
        <cylinderGeometry args={[0.024, 0.024, 1.8, 24]} />
      </mesh>

      {/* Stand Base (Brass bevelled base) */}
      <mesh position={[0, -1.9, 0]} material={goldBrassMaterial} receiveShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.04, 48]} />
      </mesh>
      <mesh position={[0, -1.86, 0]} material={goldBrassMaterial}>
        <torusGeometry args={[0.2, 0.02, 16, 48]} />
      </mesh>

      {/* ========================================================
          2. DRESS SHIRT & SPREAD COLLAR
      ======================================================== */}
      {/* Inner Shirt Torso */}
      <mesh position={[0, 0.85, 0.05]} material={shirtMaterial}>
        <boxGeometry args={[0.3, 0.65, 0.22]} />
      </mesh>

      {/* Shirt Placket (Center strip) */}
      <mesh position={[0, 0.72, 0.166]} material={shirtMaterial}>
        <boxGeometry args={[0.042, 0.62, 0.012]} />
      </mesh>

      {/* Shirt Collar Bands */}
      {/* Left collar leaf */}
      <mesh
        position={[-0.07, 1.13, 0.12]}
        rotation={[0.35, 0.45, -0.32]}
        material={shirtMaterial}
        castShadow
      >
        <boxGeometry args={[0.11, 0.075, 0.015]} />
      </mesh>
      {/* Right collar leaf */}
      <mesh
        position={[0.07, 1.13, 0.12]}
        rotation={[0.35, -0.45, 0.32]}
        material={shirtMaterial}
        castShadow
      >
        <boxGeometry args={[0.11, 0.075, 0.015]} />
      </mesh>

      {/* Small mother-of-pearl collar buttons */}
      <mesh position={[0, 0.98, 0.174]} rotation={[Math.PI / 2, 0, 0]} material={goldBrassMaterial}>
        <cylinderGeometry args={[0.009, 0.009, 0.006, 16]} />
      </mesh>
      <mesh position={[0, 0.82, 0.174]} rotation={[Math.PI / 2, 0, 0]} material={goldBrassMaterial}>
        <cylinderGeometry args={[0.009, 0.009, 0.006, 16]} />
      </mesh>

      {/* ========================================================
          3. SILK TIE (Visible unless 'no-tie')
      ======================================================== */}
      {config.tie !== "no-tie" && (
        <group position={[0, 0, 0]}>
          {/* Tie Knot (Triangular Half-Windsor) */}
          <mesh position={[0, 1.05, 0.165]} rotation={[-0.1, 0, 0]} material={tieMaterial} castShadow>
            <cylinderGeometry args={[0.038, 0.024, 0.07, 4]} />
          </mesh>
          {/* Tie Dimple / Blade */}
          <mesh position={[0, 0.78, 0.175]} rotation={[-0.05, 0, 0]} material={tieMaterial} castShadow>
            <boxGeometry args={[0.055, 0.46, 0.015]} />
          </mesh>
          {/* Tie Lower Blade tip */}
          <mesh position={[0, 0.52, 0.168]} rotation={[0, 0, Math.PI]} material={tieMaterial}>
            <coneGeometry args={[0.038, 0.08, 4]} />
          </mesh>
        </group>
      )}

      {/* ========================================================
          4. JACKET CHEST & TORSO (Morphed by Fit)
      ======================================================== */}
      <group scale={[chestScale, 1, 1]}>
        {/* Main Chest Body (Sculpted chest canvas) */}
        <mesh position={[0, 0.85, 0]} material={jacketMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.56, 0.32]} />
        </mesh>

        {/* Left Shoulder Yoke */}
        <mesh
          position={[-0.27, 1.05, 0]}
          rotation={[0, 0, -0.16]}
          material={jacketMaterial}
          castShadow
        >
          <boxGeometry args={[0.22, 0.16, 0.3]} />
        </mesh>

        {/* Right Shoulder Yoke */}
        <mesh
          position={[0.27, 1.05, 0]}
          rotation={[0, 0, 0.16]}
          material={jacketMaterial}
          castShadow
        >
          <boxGeometry args={[0.22, 0.16, 0.3]} />
        </mesh>

        {/* Sleeve Cap Left */}
        <mesh position={[-0.37, 0.86, 0]} rotation={[0, 0, 0.1]} material={jacketMaterial} castShadow>
          <cylinderGeometry args={[0.1, 0.085, 0.55, 24]} />
        </mesh>

        {/* Sleeve Cap Right */}
        <mesh position={[0.37, 0.86, 0]} rotation={[0, 0, -0.1]} material={jacketMaterial} castShadow>
          <cylinderGeometry args={[0.1, 0.085, 0.55, 24]} />
        </mesh>

        {/* Forearm Sleeves */}
        <mesh position={[-0.39, 0.42, 0.03]} rotation={[-0.2, 0, 0.05]} material={jacketMaterial} castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.42, 24]} />
        </mesh>
        <mesh position={[0.39, 0.42, 0.03]} rotation={[-0.2, 0, -0.05]} material={jacketMaterial} castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.42, 24]} />
        </mesh>

        {/* Sleeve Cuff Buttons (4 miniature buttons on each wrist) */}
        {[-0.045, -0.015, 0.015, 0.045].map((offset, i) => (
          <React.Fragment key={`cuff-${i}`}>
            <mesh position={[-0.445, 0.26 + offset, 0.06]} rotation={[0, 0, Math.PI / 2]} material={hornButtonMaterial}>
              <cylinderGeometry args={[0.007, 0.007, 0.005, 12]} />
            </mesh>
            <mesh position={[0.445, 0.26 + offset, 0.06]} rotation={[0, 0, Math.PI / 2]} material={hornButtonMaterial}>
              <cylinderGeometry args={[0.007, 0.007, 0.005, 12]} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Waist & Lower Skirt (Waist suppression governed by fit) */}
        <group scale={[waistScale, 1, waistScale]}>
          <mesh position={[0, 0.42, 0]} material={jacketMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.28, 0.42, 32]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          5. INTERCHANGEABLE LAPEL GEOMETRY
      ======================================================== */}
      {/* NOTCH LAPEL */}
      {config.lapel === "notch" && (
        <group>
          {/* Left Notch Roll */}
          <mesh
            position={[-0.13, 0.88, 0.17]}
            rotation={[-0.08, 0.28, -0.22]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.13, 0.46, 0.03]} />
          </mesh>
          {/* Left Notch Step Angle Cutout */}
          <mesh
            position={[-0.19, 1.06, 0.18]}
            rotation={[0, 0, -0.55]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.08, 0.12, 0.03]} />
          </mesh>

          {/* Right Notch Roll */}
          <mesh
            position={[0.13, 0.88, 0.17]}
            rotation={[-0.08, -0.28, 0.22]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.13, 0.46, 0.03]} />
          </mesh>
          {/* Right Notch Step Angle Cutout */}
          <mesh
            position={[0.19, 1.06, 0.18]}
            rotation={[0, 0, 0.55]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.08, 0.12, 0.03]} />
          </mesh>
        </group>
      )}

      {/* PEAK LAPEL */}
      {config.lapel === "peak" && (
        <group>
          {/* Left Peak Main Blade */}
          <mesh
            position={[-0.14, 0.89, 0.17]}
            rotation={[-0.08, 0.28, -0.2]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.15, 0.48, 0.032]} />
          </mesh>
          {/* Left Peak Wing (Dramatic upward pointed tip) */}
          <mesh
            position={[-0.23, 1.12, 0.18]}
            rotation={[0.1, 0.1, -0.92]}
            material={jacketMaterial}
            castShadow
          >
            <coneGeometry args={[0.055, 0.18, 4]} />
          </mesh>

          {/* Right Peak Main Blade */}
          <mesh
            position={[0.14, 0.89, 0.17]}
            rotation={[-0.08, -0.28, 0.2]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.15, 0.48, 0.032]} />
          </mesh>
          {/* Right Peak Wing */}
          <mesh
            position={[0.23, 1.12, 0.18]}
            rotation={[0.1, -0.1, 0.92]}
            material={jacketMaterial}
            castShadow
          >
            <coneGeometry args={[0.055, 0.18, 4]} />
          </mesh>
        </group>
      )}

      {/* SHAWL LAPEL (Continuous curved dinner jacket collar with subtle satin sheen) */}
      {config.lapel === "shawl" && (
        <group>
          {/* Left Shawl Collar Arc */}
          <mesh
            position={[-0.13, 0.92, 0.175]}
            rotation={[-0.08, 0.25, -0.18]}
            material={lapelSatinMaterial}
            castShadow
          >
            <cylinderGeometry args={[0.065, 0.075, 0.58, 24, 1, false, 0, Math.PI]} />
          </mesh>

          {/* Right Shawl Collar Arc */}
          <mesh
            position={[0.13, 0.92, 0.175]}
            rotation={[-0.08, -0.25, 0.18]}
            material={lapelSatinMaterial}
            castShadow
          >
            <cylinderGeometry args={[0.065, 0.075, 0.58, 24, 1, false, 0, Math.PI]} />
          </mesh>
        </group>
      )}

      {/* ========================================================
          6. BREAST POCKET & POCKET SQUARE
      ======================================================== */}
      {/* Barchetta Breast Pocket Welt */}
      <mesh
        position={[-0.17, 0.88, 0.172]}
        rotation={[0, 0, 0.08]}
        material={jacketMaterial}
        castShadow
      >
        <boxGeometry args={[0.11, 0.022, 0.018]} />
      </mesh>

      {/* Crisp Presidential Fold Pocket Square (Silk) */}
      <mesh
        position={[-0.17, 0.902, 0.174]}
        rotation={[0, 0, 0.08]}
        material={pocketSquareMaterial}
        castShadow
      >
        <boxGeometry args={[0.085, 0.018, 0.01]} />
      </mesh>

      {/* ========================================================
          7. HIP POCKETS (Flap / Jetted / Patch)
      ======================================================== */}
      {config.pocket === "flap" && (
        <group>
          {/* Left Flap */}
          <mesh
            position={[-0.2, 0.38, 0.17]}
            rotation={[0.12, 0.05, -0.06]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.15, 0.045, 0.02]} />
          </mesh>
          {/* Right Flap */}
          <mesh
            position={[0.2, 0.38, 0.17]}
            rotation={[0.12, -0.05, 0.06]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.15, 0.045, 0.02]} />
          </mesh>
        </group>
      )}

      {config.pocket === "jetted" && (
        <group>
          {/* Left Jetted double welts */}
          <mesh position={[-0.2, 0.38, 0.165]} rotation={[0, 0, -0.04]} material={jacketMaterial}>
            <boxGeometry args={[0.14, 0.015, 0.01]} />
          </mesh>
          {/* Right Jetted double welts */}
          <mesh position={[0.2, 0.38, 0.165]} rotation={[0, 0, 0.04]} material={jacketMaterial}>
            <boxGeometry args={[0.14, 0.015, 0.01]} />
          </mesh>
        </group>
      )}

      {config.pocket === "patch" && (
        <group>
          {/* Left Patch Pocket (rounded bottom) */}
          <mesh
            position={[-0.2, 0.35, 0.168]}
            rotation={[0.06, 0.04, -0.04]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.145, 0.125, 0.018]} />
          </mesh>
          {/* Right Patch Pocket */}
          <mesh
            position={[0.2, 0.35, 0.168]}
            rotation={[0.06, -0.04, 0.04]}
            material={jacketMaterial}
            castShadow
          >
            <boxGeometry args={[0.145, 0.125, 0.018]} />
          </mesh>
        </group>
      )}

      {/* ========================================================
          8. FASTENING BUTTONS (1-Button / 2-Button / Double-Breasted)
      ======================================================== */}
      {config.buttons === "one-button" && (
        <mesh position={[0, 0.52, 0.20]} rotation={[Math.PI / 2, 0, 0]} material={hornButtonMaterial} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.009, 20]} />
        </mesh>
      )}

      {config.buttons === "two-button" && (
        <group>
          {/* Top Fastened Button */}
          <mesh position={[0, 0.58, 0.198]} rotation={[Math.PI / 2, 0, 0]} material={hornButtonMaterial} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.009, 20]} />
          </mesh>
          {/* Bottom Unfastened Button */}
          <mesh position={[0, 0.44, 0.198]} rotation={[Math.PI / 2, 0, 0]} material={hornButtonMaterial} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.009, 20]} />
          </mesh>
        </group>
      )}

      {config.buttons === "double-breasted" && (
        <group>
          {/* 6x2 Double Breasted Column Layout */}
          {[-0.075, 0.075].map((xOffset) => (
            <React.Fragment key={`db-${xOffset}`}>
              {/* Upper show button */}
              <mesh position={[xOffset, 0.68, 0.194]} rotation={[Math.PI / 2, 0, 0]} material={hornButtonMaterial} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.009, 20]} />
              </mesh>
              {/* Middle fastening button */}
              <mesh position={[xOffset, 0.54, 0.198]} rotation={[Math.PI / 2, 0, 0]} material={hornButtonMaterial} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.009, 20]} />
              </mesh>
              {/* Lower button */}
              <mesh position={[xOffset, 0.40, 0.198]} rotation={[Math.PI / 2, 0, 0]} material={hornButtonMaterial} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.009, 20]} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      )}

      {/* ========================================================
          9. TROUSERS / LEGS (Matching fabric with crisp crease)
      ======================================================== */}
      <group position={[0, -0.65, 0]}>
        {/* Left Leg */}
        <mesh position={[-0.13, 0, 0]} material={jacketMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.115, 0.09, 0.95, 24]} />
        </mesh>
        {/* Left Trouser Front Crease */}
        <mesh position={[-0.13, 0, 0.092]} material={jacketMaterial}>
          <boxGeometry args={[0.012, 0.95, 0.01]} />
        </mesh>

        {/* Right Leg */}
        <mesh position={[0.13, 0, 0]} material={jacketMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.115, 0.09, 0.95, 24]} />
        </mesh>
        {/* Right Trouser Front Crease */}
        <mesh position={[0.13, 0, 0.092]} material={jacketMaterial}>
          <boxGeometry args={[0.012, 0.95, 0.01]} />
        </mesh>

        {/* Tailored Hem / Cuffs */}
        <mesh position={[-0.13, -0.46, 0]} material={jacketMaterial}>
          <cylinderGeometry args={[0.096, 0.094, 0.04, 24]} />
        </mesh>
        <mesh position={[0.13, -0.46, 0]} material={jacketMaterial}>
          <cylinderGeometry args={[0.096, 0.094, 0.04, 24]} />
        </mesh>
      </group>
    </group>
  );
}
