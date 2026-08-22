import type { AchievementDef, GameState } from "./types";

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_click", name: "Premier pressage", description: "Cliquez le citron une fois.", icon: "🍋" },
  { id: "clicks_100", name: "Poignet chaud", description: "Cliquez 100 fois.", icon: "👆" },
  { id: "clicks_1000", name: "Tennis elbow", description: "Cliquez 1 000 fois.", icon: "💪" },
  { id: "clicks_10000", name: "Main de fer", description: "Cliquez 10 000 fois.", icon: "🦾" },
  { id: "lemons_100", name: "Un bol", description: "Récoltez 100 citrons.", icon: "🥣" },
  { id: "lemons_1000", name: "Un étal", description: "Récoltez 1 000 citrons.", icon: "🧺" },
  { id: "lemons_1e6", name: "Un camion", description: "Récoltez 1 million de citrons.", icon: "🚚" },
  { id: "lemons_1e9", name: "Un océan", description: "Récoltez 1 milliard de citrons.", icon: "🌊" },
  { id: "lemons_1e12", name: "Une étoile", description: "Récoltez 1 trillion de citrons.", icon: "🌟" },
  { id: "cps_10", name: "Petit verger", description: "Atteignez 10 citrons par seconde.", icon: "🌳" },
  { id: "cps_1000", name: "Empire acidulé", description: "Atteignez 1 000 citrons par seconde.", icon: "🏰" },
  { id: "cps_1e6", name: "Nation citron", description: "Atteignez 1 million de citrons par seconde.", icon: "🌍" },
  { id: "first_building", name: "Premier employé", description: "Achetez un bâtiment.", icon: "🔑" },
  { id: "buildings_50", name: "PME", description: "Possédez 50 bâtiments.", icon: "🏢" },
  { id: "buildings_200", name: "Conglomérat", description: "Possédez 200 bâtiments.", icon: "🏙️" },
  { id: "upgrade_1", name: "Amélioration", description: "Achetez une amélioration.", icon: "✨" },
  { id: "upgrade_20", name: "Obsession", description: "Achetez 20 améliorations.", icon: "🧪" },
  { id: "golden_1", name: "Citron d'or", description: "Cliquez un citron doré.", icon: "🥇" },
  { id: "grandma_1", name: "Goûter", description: "Engagez une mamie citron.", icon: "👵" },
  { id: "tree_1", name: "Première pousse", description: "Plantez un citronnier.", icon: "🌱" },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(
  ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]),
);

export function unlockedAchievementIds(state: GameState, cps: number): string[] {
  const ownedBuildings = Object.values(state.buildings).reduce((sum, count) => sum + count, 0);
  const checks: Record<string, boolean> = {
    first_click: state.clicks >= 1,
    clicks_100: state.clicks >= 100,
    clicks_1000: state.clicks >= 1_000,
    clicks_10000: state.clicks >= 10_000,
    lemons_100: state.totalLemons >= 100,
    lemons_1000: state.totalLemons >= 1_000,
    lemons_1e6: state.totalLemons >= 1_000_000,
    lemons_1e9: state.totalLemons >= 1_000_000_000,
    lemons_1e12: state.totalLemons >= 1_000_000_000_000,
    cps_10: cps >= 10,
    cps_1000: cps >= 1_000,
    cps_1e6: cps >= 1_000_000,
    first_building: ownedBuildings >= 1,
    buildings_50: ownedBuildings >= 50,
    buildings_200: ownedBuildings >= 200,
    upgrade_1: state.upgrades.length >= 1,
    upgrade_20: state.upgrades.length >= 20,
    golden_1: state.achievements.includes("golden_1"),
    grandma_1: state.buildings.grandma >= 1,
    tree_1: state.buildings.tree >= 1,
  };

  return ACHIEVEMENTS.filter((achievement) => checks[achievement.id]).map((achievement) => achievement.id);
}
