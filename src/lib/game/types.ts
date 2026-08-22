export const BUILDING_IDS = [
  "cursor",
  "grandma",
  "tree",
  "mine",
  "factory",
  "bank",
  "temple",
  "wizard",
  "shipment",
  "portal",
  "timemachine",
  "condenser",
] as const;

export type BuildingId = (typeof BUILDING_IDS)[number];

export type BuyMode = 1 | 10 | 100 | "max";

export type UpgradeEffect =
  | { type: "buildingMult"; building: BuildingId; mult: number }
  | { type: "clickAdd"; amount: number }
  | { type: "clickCpsPercent"; percent: number }
  | { type: "globalMult"; mult: number }
  | { type: "fingers"; amount: number };

export interface BuildingDef {
  id: BuildingId;
  name: string;
  plural: string;
  description: string;
  flavor: string;
  baseCost: number;
  baseCps: number;
  icon: string;
}

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  requires: {
    building?: BuildingId;
    count?: number;
    totalLemons?: number;
    clicks?: number;
  };
  effect: UpgradeEffect;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GoldenLemon {
  x: number;
  y: number;
  expiresAt: number;
  kind: "lucky" | "frenzy" | "clickFrenzy";
}

export interface GameState {
  lemons: number;
  totalLemons: number;
  handmadeLemons: number;
  buildings: Record<BuildingId, number>;
  upgrades: string[];
  achievements: string[];
  clicks: number;
  startedAt: number;
  lastSavedAt: number;
  frenzyUntil: number;
  clickFrenzyUntil: number;
  nextGoldenAt: number;
  golden: GoldenLemon | null;
  newsIndex: number;
}

export interface DerivedStats {
  rawCps: number;
  cps: number;
  frenzyActive: boolean;
  clickFrenzyActive: boolean;
  clickPower: number;
  buildingCps: Record<BuildingId, number>;
}

export const COST_GROWTH = 1.15;
export const FRENZY_MULT = 7;
export const CLICK_FRENZY_MULT = 777;
export const FRENZY_DURATION_MS = 77_000;
export const CLICK_FRENZY_DURATION_MS = 13_000;
export const GOLDEN_LIFETIME_MS = 13_000;
export const SAVE_KEY = "citron-clicker-save-v1";
