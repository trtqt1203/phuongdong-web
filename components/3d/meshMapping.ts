import * as THREE from "three";
import { SuitConfiguration } from "@/data/configuratorOptions";

/**
 * Semantic mapping dictionary between standard 3D suit mesh identifiers
 * and the configurator controls.
 *
 * When a 3D artist exports `suit.glb` (from Blender, Clo3D, Marvelous Designer),
 * they can name their mesh nodes according to this schema or adjust this dictionary.
 */
export interface MeshMapDefinition {
  jacket: string[]; // mesh names that should receive jacket fabric material
  lapels: {
    notch?: string[];
    peak?: string[];
    shawl?: string[];
    default?: string[];
  };
  trousers: string[];
  shirt: string[];
  tie: string[];
  buttons: {
    oneButton?: string[];
    twoButton?: string[];
    doubleBreasted?: string[];
    allButtons?: string[];
  };
  pockets: {
    flap?: string[];
    jetted?: string[];
    patch?: string[];
  };
}

export const DEFAULT_MESH_MAP: MeshMapDefinition = {
  jacket: ["jacket", "jacket_body", "suit_jacket", "torso_outer", "coat", "blazer"],
  lapels: {
    notch: ["lapel_notch", "lapel_standard", "notch_lapel"],
    peak: ["lapel_peak", "peak_lapel", "lapel_pointed"],
    shawl: ["lapel_shawl", "shawl_lapel", "lapel_dinner"],
    default: ["lapel", "lapels", "jacket_lapel", "collar_lapel"],
  },
  trousers: ["trousers", "pants", "suit_pants", "legs", "slacks"],
  shirt: ["shirt", "dress_shirt", "collar", "shirt_body", "cuffs"],
  tie: ["tie", "necktie", "cravat", "silk_tie"],
  buttons: {
    oneButton: ["button_single", "button_1"],
    twoButton: ["button_two", "button_2", "buttons_front"],
    doubleBreasted: ["buttons_db", "buttons_double_breasted", "buttons_6x2"],
    allButtons: ["buttons", "button", "jacket_buttons"],
  },
  pockets: {
    flap: ["pocket_flap", "pockets_flap"],
    jetted: ["pocket_jetted", "pockets_besom"],
    patch: ["pocket_patch", "pockets_patch"],
  },
};

/**
 * Inspects a GLTF scene and categorizes its meshes into semantic suit components.
 */
export function categorizeSuitMeshes(scene: THREE.Group, map: MeshMapDefinition = DEFAULT_MESH_MAP) {
  const categorized = {
    jacketMeshes: [] as THREE.Mesh[],
    lapelMeshes: {
      notch: [] as THREE.Mesh[],
      peak: [] as THREE.Mesh[],
      shawl: [] as THREE.Mesh[],
      general: [] as THREE.Mesh[],
    },
    trousersMeshes: [] as THREE.Mesh[],
    shirtMeshes: [] as THREE.Mesh[],
    tieMeshes: [] as THREE.Mesh[],
    buttonMeshes: {
      oneButton: [] as THREE.Mesh[],
      twoButton: [] as THREE.Mesh[],
      doubleBreasted: [] as THREE.Mesh[],
      general: [] as THREE.Mesh[],
    },
    pocketMeshes: {
      flap: [] as THREE.Mesh[],
      jetted: [] as THREE.Mesh[],
      patch: [] as THREE.Mesh[],
    },
    unmapped: [] as THREE.Mesh[],
  };

  const matches = (name: string, list?: string[]) => {
    if (!list) return false;
    const lower = name.toLowerCase();
    return list.some((target) => lower.includes(target.toLowerCase()));
  };

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const name = mesh.name;
      let matched = false;

      // Jacket
      if (matches(name, map.jacket)) {
        categorized.jacketMeshes.push(mesh);
        matched = true;
      }

      // Lapels
      if (matches(name, map.lapels.notch)) {
        categorized.lapelMeshes.notch.push(mesh);
        matched = true;
      } else if (matches(name, map.lapels.peak)) {
        categorized.lapelMeshes.peak.push(mesh);
        matched = true;
      } else if (matches(name, map.lapels.shawl)) {
        categorized.lapelMeshes.shawl.push(mesh);
        matched = true;
      } else if (matches(name, map.lapels.default)) {
        categorized.lapelMeshes.general.push(mesh);
        matched = true;
      }

      // Trousers
      if (matches(name, map.trousers)) {
        categorized.trousersMeshes.push(mesh);
        matched = true;
      }

      // Shirt
      if (matches(name, map.shirt)) {
        categorized.shirtMeshes.push(mesh);
        matched = true;
      }

      // Tie
      if (matches(name, map.tie)) {
        categorized.tieMeshes.push(mesh);
        matched = true;
      }

      // Buttons
      if (matches(name, map.buttons.oneButton)) {
        categorized.buttonMeshes.oneButton.push(mesh);
        matched = true;
      } else if (matches(name, map.buttons.twoButton)) {
        categorized.buttonMeshes.twoButton.push(mesh);
        matched = true;
      } else if (matches(name, map.buttons.doubleBreasted)) {
        categorized.buttonMeshes.doubleBreasted.push(mesh);
        matched = true;
      } else if (matches(name, map.buttons.allButtons)) {
        categorized.buttonMeshes.general.push(mesh);
        matched = true;
      }

      // Pockets
      if (matches(name, map.pockets.flap)) {
        categorized.pocketMeshes.flap.push(mesh);
        matched = true;
      } else if (matches(name, map.pockets.jetted)) {
        categorized.pocketMeshes.jetted.push(mesh);
        matched = true;
      } else if (matches(name, map.pockets.patch)) {
        categorized.pocketMeshes.patch.push(mesh);
        matched = true;
      }

      if (!matched) {
        categorized.unmapped.push(mesh);
      }
    }
  });

  return categorized;
}

/**
 * Applies current configurator options (fabric color, shirt, tie, lapel visibility, button visibility)
 * directly to categorized GLTF meshes.
 */
export function applyConfigurationToMeshes(
  categorized: ReturnType<typeof categorizeSuitMeshes>,
  config: SuitConfiguration,
  fabricHex: string,
  shirtHex: string,
  tieHex: string | null
) {
  const fabricColor = new THREE.Color(fabricHex);
  const shirtColor = new THREE.Color(shirtHex);
  const tieColor = tieHex ? new THREE.Color(tieHex) : null;

  // Apply fabric color to jacket & trousers
  [...categorized.jacketMeshes, ...categorized.trousersMeshes].forEach((mesh) => {
    if (mesh.material) {
      const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
      if (mat.color) {
        mat.color.copy(fabricColor);
      }
    }
  });

  // Apply shirt color
  categorized.shirtMeshes.forEach((mesh) => {
    if (mesh.material) {
      const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
      if (mat.color) {
        mat.color.copy(shirtColor);
      }
    }
  });

  // Apply tie
  categorized.tieMeshes.forEach((mesh) => {
    if (tieColor) {
      mesh.visible = true;
      if (mesh.material) {
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        if (mat.color) {
          mat.color.copy(tieColor);
        }
      }
    } else {
      mesh.visible = false;
    }
  });

  // Toggle Lapel variants if specific variant meshes exist
  const hasVariantLapels =
    categorized.lapelMeshes.notch.length > 0 ||
    categorized.lapelMeshes.peak.length > 0 ||
    categorized.lapelMeshes.shawl.length > 0;

  if (hasVariantLapels) {
    categorized.lapelMeshes.notch.forEach((m) => (m.visible = config.lapel === "notch"));
    categorized.lapelMeshes.peak.forEach((m) => (m.visible = config.lapel === "peak"));
    categorized.lapelMeshes.shawl.forEach((m) => (m.visible = config.lapel === "shawl"));
  } else {
    // Single lapel mesh - apply fabric color
    categorized.lapelMeshes.general.forEach((m) => {
      m.visible = true;
      if (m.material) {
        const mat = (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;
        if (mat.color) mat.color.copy(fabricColor);
      }
    });
  }
}
