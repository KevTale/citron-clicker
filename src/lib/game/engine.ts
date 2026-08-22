import { unlockedAchievementIds } from "./achievements";
import { BUILDING_BY_ID, BUILDINGS } from "./buildings";
import { UPGRADE_BY_ID, UPGRADES } from "./upgrades";
import {
  BUILDING_IDS,
  CLICK_FRENZY_DURATION_MS,
  CLICK_FRENZY_MULT,
  COST_GROWTH,
  FRENZY_DURATION_MS,
  FRENZY_MULT,
  GOLDEN_LIFETIME_MS,
  type BuildingId,
  type BuyMode,
  type DerivedStats,
  type GameState,
  type GoldenLemon,
  type UpgradeDef,
} from "./types";

export function emptyBuildings(): Record<BuildingId, number> {
  return Object.fromEntries(BUILDING_IDS.map((id) => [id, 0])) as Record<BuildingId, number>;
}

export function createInitialState(now = Date.now()): GameState {
  return {
    lemons: 0,
    totalLemons: 0,
    handmadeLemons: 0,
    buildings: emptyBuildings(),
    upgrades: [],
    achievements: [],
    clicks: 0,
    startedAt: now,
    lastSavedAt: now,
    frenzyUntil: 0,
    clickFrenzyUntil: 0,
    nextGoldenAt: now + randomGoldenDelay(),
    golden: null,
    newsIndex: 0,
  };
}

export function randomGoldenDelay(): number {
  return 30_000 + Math.random() * 90_000;
}

export function buildingCost(id: BuildingId, owned: number): number {
  return Math.ceil(BUILDING_BY_ID[id].baseCost * COST_GROWTH ** owned);
}

export function bulkCost(id: BuildingId, owned: number, amount: number): number {
  if (amount <= 0) return 0;
  const base = BUILDING_BY_ID[id].baseCost * COST_GROWTH ** owned;
  return Math.ceil((base * (COST_GROWTH ** amount - 1)) / (COST_GROWTH - 1));
}

export function maxAffordable(id: BuildingId, owned: number, lemons: number): number {
  if (lemons < buildingCost(id, owned)) return 0;
  let low = 1;
  let high = 1;
  while (bulkCost(id, owned, high) <= lemons) {
    high *= 2;
    if (high > 10_000) break;
  }
  let best = 0;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (bulkCost(id, owned, mid) <= lemons) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
}

export function resolveBuyAmount(id: BuildingId, owned: number, lemons: number, mode: BuyMode): number {
  if (mode === "max") return maxAffordable(id, owned, lemons);
  return mode;
}

export function otherBuildingsCount(state: GameState): number {
  return BUILDING_IDS.filter((id) => id !== "cursor").reduce((sum, id) => sum + state.buildings[id], 0);
}

export function deriveStats(state: GameState, now = Date.now()): DerivedStats {
  const ownedUpgrades = state.upgrades
    .map((id) => UPGRADE_BY_ID[id])
    .filter((upgrade): upgrade is UpgradeDef => Boolean(upgrade));

  const fingers = ownedUpgrades
    .filter((upgrade) => upgrade.effect.type === "fingers")
    .reduce((sum, upgrade) => sum + (upgrade.effect.type === "fingers" ? upgrade.effect.amount : 0), 0);

  const extras = fingers * otherBuildingsCount(state);
  const buildingCps = {} as Record<BuildingId, number>;
  let rawCps = 0;

  for (const building of BUILDINGS) {
    const count = state.buildings[building.id];
    let per = building.baseCps;
    if (building.id === "cursor") per += extras;
    for (const upgrade of ownedUpgrades) {
      if (upgrade.effect.type === "buildingMult" && upgrade.effect.building === building.id) {
        per *= upgrade.effect.mult;
      }
    }
    const total = per * count;
    buildingCps[building.id] = total;
    rawCps += total;
  }

  let global = 1;
  for (const upgrade of ownedUpgrades) {
    if (upgrade.effect.type === "globalMult") global *= upgrade.effect.mult;
  }
  rawCps *= global;

  const frenzyActive = now < state.frenzyUntil;
  const clickFrenzyActive = now < state.clickFrenzyUntil;
  const cps = rawCps * (frenzyActive ? FRENZY_MULT : 1);

  let clickPower = 1;
  for (const upgrade of ownedUpgrades) {
    if (upgrade.effect.type === "clickAdd") clickPower += upgrade.effect.amount;
    if (upgrade.effect.type === "buildingMult" && upgrade.effect.building === "cursor") {
      clickPower *= upgrade.effect.mult;
    }
    if (upgrade.effect.type === "clickCpsPercent") {
      clickPower += rawCps * upgrade.effect.percent;
    }
  }
  clickPower += extras;
  if (clickFrenzyActive) clickPower *= CLICK_FRENZY_MULT;

  return { rawCps, cps, frenzyActive, clickFrenzyActive, clickPower, buildingCps };
}

export function addLemons(state: GameState, amount: number): GameState {
  if (amount <= 0) return state;
  return {
    ...state,
    lemons: state.lemons + amount,
    totalLemons: state.totalLemons + amount,
  };
}

export function clickLemon(state: GameState, now = Date.now()): { state: GameState; gained: number } {
  const stats = deriveStats(state, now);
  const gained = stats.clickPower;
  return {
    state: {
      ...addLemons(state, gained),
      handmadeLemons: state.handmadeLemons + gained,
      clicks: state.clicks + 1,
    },
    gained,
  };
}

export function buyBuilding(state: GameState, id: BuildingId, mode: BuyMode): GameState {
  const owned = state.buildings[id];
  const amount = resolveBuyAmount(id, owned, state.lemons, mode);
  if (amount <= 0) return state;
  const cost = bulkCost(id, owned, amount);
  if (state.lemons < cost) return state;
  return {
    ...state,
    lemons: state.lemons - cost,
    buildings: { ...state.buildings, [id]: owned + amount },
  };
}

export function upgradeAvailable(state: GameState, upgrade: UpgradeDef): boolean {
  if (state.upgrades.includes(upgrade.id)) return false;
  const { building, count = 0, totalLemons = 0, clicks = 0 } = upgrade.requires;
  if (building && state.buildings[building] < count) return false;
  if (state.totalLemons < totalLemons) return false;
  if (state.clicks < clicks) return false;
  return true;
}

export function buyUpgrade(state: GameState, id: string): GameState {
  const upgrade = UPGRADE_BY_ID[id];
  if (!upgrade || !upgradeAvailable(state, upgrade) || state.lemons < upgrade.cost) return state;
  return {
    ...state,
    lemons: state.lemons - upgrade.cost,
    upgrades: [...state.upgrades, id],
  };
}

export function visibleBuildings(state: GameState): BuildingId[] {
  return BUILDINGS.filter((building, index) => {
    if (state.buildings[building.id] > 0) return true;
    if (index === 0) return true;
    const previous = BUILDINGS[index - 1];
    if (previous && state.buildings[previous.id] > 0) return true;
    return state.totalLemons >= building.baseCost * 0.5;
  }).map((building) => building.id);
}

export function visibleUpgrades(state: GameState): UpgradeDef[] {
  return UPGRADES.filter((upgrade) => {
    if (state.upgrades.includes(upgrade.id)) return false;
    if (!upgradeAvailable(state, upgrade)) {
      const { building, count = 0, totalLemons = 0, clicks = 0 } = upgrade.requires;
      const closeBuilding = building ? state.buildings[building] >= Math.ceil(count * 0.6) : true;
      const closeLemons = state.totalLemons >= totalLemons * 0.5;
      const closeClicks = state.clicks >= clicks * 0.5;
      return closeBuilding && closeLemons && closeClicks && state.totalLemons >= upgrade.cost * 0.15;
    }
    return true;
  }).slice(0, 12);
}

function spawnGolden(now: number): GoldenLemon {
  const roll = Math.random();
  const kind: GoldenLemon["kind"] = roll < 0.45 ? "lucky" : roll < 0.8 ? "frenzy" : "clickFrenzy";
  return {
    x: 12 + Math.random() * 76,
    y: 18 + Math.random() * 62,
    expiresAt: now + GOLDEN_LIFETIME_MS,
    kind,
  };
}

export function luckyReward(state: GameState, now = Date.now()): number {
  const stats = deriveStats(state, now);
  const fromCps = stats.cps * 60 * 15;
  const fromBank = state.lemons * 0.15;
  return Math.max(13, Math.min(fromCps || 13, fromBank || 13) || 13);
}

export function clickGolden(state: GameState, now = Date.now()): { state: GameState; message: string; gained: number } {
  if (!state.golden) return { state, message: "", gained: 0 };
  const kind = state.golden.kind;
  const next = {
    ...state,
    golden: null,
    nextGoldenAt: now + randomGoldenDelay(),
    achievements: state.achievements.includes("golden_1")
      ? state.achievements
      : [...state.achievements, "golden_1"],
  };
  if (kind === "lucky") {
    const gained = luckyReward(state, now);
    return {
      state: addLemons(next, gained),
      message: "Chance ! Une caisse de citrons tombe du ciel.",
      gained,
    };
  }
  if (kind === "frenzy") {
    return {
      state: { ...next, frenzyUntil: now + FRENZY_DURATION_MS },
      message: "Frénésie ! Production ×7 pendant 77 secondes.",
      gained: 0,
    };
  }
  return {
    state: { ...next, clickFrenzyUntil: now + CLICK_FRENZY_DURATION_MS },
    message: "Clics en folie ! Chaque clic est ×777 pendant 13 secondes.",
    gained: 0,
  };
}

export function tick(state: GameState, dt: number, now: number): GameState {
  const stats = deriveStats(state, now);
  let next = addLemons(state, stats.cps * dt);

  if (next.golden && now >= next.golden.expiresAt) {
    next = { ...next, golden: null, nextGoldenAt: now + randomGoldenDelay() };
  } else if (!next.golden && now >= next.nextGoldenAt) {
    next = { ...next, golden: spawnGolden(now) };
  }

  const unlocked = unlockedAchievementIds(next, stats.cps);
  if (unlocked.length !== next.achievements.length || unlocked.some((id) => !next.achievements.includes(id))) {
    const merged = Array.from(new Set([...next.achievements, ...unlocked]));
    next = { ...next, achievements: merged };
  }

  return next;
}

export function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

export function parseState(raw: string | null): GameState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<GameState>;
    const base = createInitialState();
    if (typeof data.lemons !== "number" || !Number.isFinite(data.lemons)) return null;
    return {
      ...base,
      ...data,
      buildings: { ...base.buildings, ...data.buildings },
      upgrades: Array.isArray(data.upgrades) ? data.upgrades.filter((id) => typeof id === "string") : [],
      achievements: Array.isArray(data.achievements)
        ? data.achievements.filter((id) => typeof id === "string")
        : [],
      lemons: Math.max(0, data.lemons),
      totalLemons: Math.max(0, data.totalLemons ?? data.lemons),
      handmadeLemons: Math.max(0, data.handmadeLemons ?? 0),
      clicks: Math.max(0, data.clicks ?? 0),
    };
  } catch {
    return null;
  }
}
