export interface FabricOption {
  id: string;
  name: string;
  color: string;
  composition: string;
  weight: string;
  description: string;
  roughness: number;
  metalness: number;
}

export interface LapelOption {
  id: "notch" | "peak" | "shawl";
  name: string;
  description: string;
  tagline: string;
}

export interface ButtonOption {
  id: "one-button" | "two-button" | "double-breasted";
  name: string;
  description: string;
  count: number;
}

export interface PocketOption {
  id: "flap" | "jetted" | "patch";
  name: string;
  description: string;
}

export interface ShirtOption {
  id: string;
  name: string;
  color: string;
  fabric: string;
}

export interface TieOption {
  id: string;
  name: string;
  color: string | null;
  silkType: string;
}

export interface FitOption {
  id: "slim" | "classic" | "relaxed";
  name: string;
  description: string;
  waistScale: number;
  chestScale: number;
  drapeFactor: number;
}

export const FABRICS: FabricOption[] = [
  {
    id: "midnight-navy",
    name: "Midnight Navy",
    color: "#111827",
    composition: "Super 150s Australian Merino",
    weight: "260g/m · Four Season",
    description: "Deep oceanic luster that commands the room with authoritative refinement.",
    roughness: 0.72,
    metalness: 0.02,
  },
  {
    id: "midnight-black",
    name: "Midnight Black",
    color: "#111111",
    composition: "Super 130s Tasmanian Wool",
    weight: "280g/m · Formal Black Tie",
    description: "Pure, light-absorbing obsidian weave with an impeccably crisp drape.",
    roughness: 0.78,
    metalness: 0.01,
  },
  {
    id: "charcoal",
    name: "Charcoal Heather",
    color: "#303236",
    composition: "Super 120s Worsted Flannel",
    weight: "310g/m · Autumn/Winter",
    description: "Rich micro-textured slate wool conferring understated architectural power.",
    roughness: 0.82,
    metalness: 0.01,
  },
  {
    id: "deep-brown",
    name: "Tuscan Espresso",
    color: "#30251F",
    composition: "Cashmere & Mulberry Silk Blend",
    weight: "290g/m · Autumn Drape",
    description: "Opulent roasted umber with subtle warm undertones and peerless softness.",
    roughness: 0.76,
    metalness: 0.02,
  },
  {
    id: "ivory",
    name: "Warm Alabaster",
    color: "#DDD6C8",
    composition: "Irish Linen & Raw Silk",
    weight: "240g/m · Summer Gala",
    description: "Luminous ivory weave with natural breathable texture for warm evenings.",
    roughness: 0.85,
    metalness: 0.0,
  },
];

export const LAPELS: LapelOption[] = [
  {
    id: "notch",
    name: "Notch Lapel",
    tagline: "Quintessential Versatility",
    description: "A precision 75° cut angle, balanced for sharp business attire and daily sophistication.",
  },
  {
    id: "peak",
    name: "Peak Lapel",
    tagline: "Commanding Stature",
    description: "Dramatic upward sweeping lines that accentuate the V-taper and broaden the shoulders.",
  },
  {
    id: "shawl",
    name: "Shawl Lapel",
    tagline: "Black-Tie Distinction",
    description: "An unbroken fluid arc with grosgrain facing, the pinnacle of evening tuxedo craft.",
  },
];

export const BUTTONS: ButtonOption[] = [
  {
    id: "one-button",
    name: "Single Button",
    description: "Minimalist stance creating an elongated, deep V-torso silhouette.",
    count: 1,
  },
  {
    id: "two-button",
    name: "Two Button",
    description: "The timeless bespoke standard; fasten the top, leave the bottom open.",
    count: 2,
  },
  {
    id: "double-breasted",
    name: "Double Breasted (6x2)",
    description: "Naval-inspired crossover fronts with dual horn button columns.",
    count: 6,
  },
];

export const POCKETS: PocketOption[] = [
  {
    id: "flap",
    name: "Flap Pockets",
    description: "Tailored gently angled flaps matching jacket hip contour.",
  },
  {
    id: "jetted",
    name: "Jetted (Besom)",
    description: "Minimalist dual piped welt for an uninterrupted, sleek exterior.",
  },
  {
    id: "patch",
    name: "Patch Pockets",
    description: "Curved top-stitched pockets evoking soft Neapolitan tailoring.",
  },
];

export const SHIRTS: ShirtOption[] = [
  {
    id: "white",
    name: "Crisp White",
    color: "#F8F9FA",
    fabric: "200/2 Egyptian Giza Cotton",
  },
  {
    id: "ivory",
    name: "Soft Cream",
    color: "#EDE8DF",
    fabric: "Sea Island Cotton Poplin",
  },
  {
    id: "black",
    name: "Obsidian",
    color: "#181818",
    fabric: "Mercerized Micro-Twill",
  },
  {
    id: "light-blue",
    name: "Azure Haze",
    color: "#D6E4EE",
    fabric: "Fine Royal Oxford Weave",
  },
];

export const TIES: TieOption[] = [
  {
    id: "black",
    name: "Obsidian Silk",
    color: "#141414",
    silkType: "7-Fold Grenadine Silk",
  },
  {
    id: "burgundy",
    name: "Barolo Wine",
    color: "#4A1521",
    silkType: "Raw Shantung Slub Silk",
  },
  {
    id: "navy",
    name: "Imperial Navy",
    color: "#162447",
    silkType: "Jacquard Micro-Diamond",
  },
  {
    id: "no-tie",
    name: "Open Collar",
    color: null,
    silkType: "Unbuttoned Sartorial Ease",
  },
];

export const FITS: FitOption[] = [
  {
    id: "slim",
    name: "Slim Fit",
    description: "Closer silhouette with sharper waist suppression and athletic shoulder accentuation.",
    waistScale: 0.88,
    chestScale: 0.96,
    drapeFactor: 0.1,
  },
  {
    id: "classic",
    name: "Classic Fit",
    description: "Balanced proportions, structured chest canvas, and timeless English drape.",
    waistScale: 1.0,
    chestScale: 1.0,
    drapeFactor: 0.3,
  },
  {
    id: "relaxed",
    name: "Relaxed Fit",
    description: "Contemporary fluid drape with gentle room through torso and higher armhole movement.",
    waistScale: 1.12,
    chestScale: 1.05,
    drapeFactor: 0.5,
  },
];

export interface SuitConfiguration {
  fabric: string; // id
  lapel: "notch" | "peak" | "shawl";
  buttons: "one-button" | "two-button" | "double-breasted";
  pocket: "flap" | "jetted" | "patch";
  shirt: string; // id
  tie: string; // id
  fit: "slim" | "classic" | "relaxed";
}

export const DEFAULT_SUIT_CONFIG: SuitConfiguration = {
  fabric: "midnight-navy",
  lapel: "peak",
  buttons: "two-button",
  pocket: "flap",
  shirt: "white",
  tie: "black",
  fit: "classic",
};
