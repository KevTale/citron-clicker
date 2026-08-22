import type { BuildingId, UpgradeDef } from "./types";

const buildingDoublers: {
  id: BuildingId;
  icon: string;
  names: [string, string, string, string];
  costs: [number, number, number, number];
  counts: [number, number, number, number];
}[] = [
  {
    id: "cursor",
    icon: "🖱️",
    names: ["Doigts renforcés", "Doigts en acier", "Doigts de titan", "Doigts d'adamantium"],
    costs: [100, 500, 10_000, 100_000],
    counts: [1, 1, 10, 25],
  },
  {
    id: "grandma",
    icon: "🍪",
    names: ["Tablier extra-acide", "Recettes secrètes", "Club des mamies", "Syndicat des zestes"],
    costs: [1_000, 5_000, 50_000, 5_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "tree",
    icon: "🌳",
    names: ["Engrais citronné", "Greffes express", "Vergers en terrasse", "Photosynthèse dopée"],
    costs: [11_000, 55_000, 550_000, 55_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "mine",
    icon: "💎",
    names: ["Pioches sucrées", "Puits de pulpe", "Filons de zestes", "Cœur de citron"],
    costs: [120_000, 600_000, 6_000_000, 600_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "factory",
    icon: "⚙️",
    names: ["Tapis roulant", "Robots presseurs", "Ligne 24/7", "Usine autonome"],
    costs: [1_300_000, 6_500_000, 65_000_000, 6_500_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "bank",
    icon: "💰",
    names: ["Livret Aigre", "Obligations zestées", "Trading haute fréquence", "Paradis fiscal"],
    costs: [14_000_000, 70_000_000, 700_000_000, 70_000_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "temple",
    icon: "✨",
    names: ["Encens acidulé", "Chœur des pépins", "Relique du premier citron", "Avatar citrique"],
    costs: [200_000_000, 1_000_000_000, 10_000_000_000, 1_000_000_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "wizard",
    icon: "🔮",
    names: ["Grimoire acidulé", "Transmutation", "Cercle de pulpe", "Pierre philosophale"],
    costs: [3_300_000_000, 16_500_000_000, 165_000_000_000, 16_500_000_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "shipment",
    icon: "🛸",
    names: ["Carburant limonade", "Voile solaire", "Colonies orbitales", "Empire galactique"],
    costs: [51_000_000_000, 255_000_000_000, 2_550_000_000_000, 255_000_000_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "portal",
    icon: "🕳️",
    names: ["Anneau stable", "Pont dimensionnel", "Invasion amicale", "Fusion des plans"],
    costs: [750_000_000_000, 3_750_000_000_000, 37_500_000_000_000, 3_750_000_000_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "timemachine",
    icon: "🕰️",
    names: ["Flux tendu temporel", "Boucle infernale", "Citrons préhistoriques", "Fin de l'histoire"],
    costs: [10_000_000_000_000, 50_000_000_000_000, 500_000_000_000_000, 50_000_000_000_000_000],
    counts: [1, 5, 25, 50],
  },
  {
    id: "condenser",
    icon: "🌌",
    names: ["Vide parfumé", "Singularité acidulée", "Antimatière pressée", "Big Zest"],
    costs: [140_000_000_000_000, 700_000_000_000_000, 7_000_000_000_000_000, 700_000_000_000_000_000],
    counts: [1, 5, 25, 50],
  },
];

const clickUpgrades: UpgradeDef[] = [
  {
    id: "click_plastic",
    name: "Souris en plastique",
    description: "Le clic gagne +1 citron.",
    cost: 50,
    icon: "🖱️",
    requires: { clicks: 10 },
    effect: { type: "clickAdd", amount: 1 },
  },
  {
    id: "click_iron",
    name: "Souris en fer",
    description: "Le clic gagne +5 citrons.",
    cost: 500,
    icon: "🖱️",
    requires: { clicks: 100 },
    effect: { type: "clickAdd", amount: 5 },
  },
  {
    id: "click_titanium",
    name: "Souris en titane",
    description: "Le clic gagne +25 citrons.",
    cost: 10_000,
    icon: "🖱️",
    requires: { clicks: 500, totalLemons: 5_000 },
    effect: { type: "clickAdd", amount: 25 },
  },
  {
    id: "click_adamantium",
    name: "Souris adamantium",
    description: "Le clic gagne +100 citrons.",
    cost: 100_000,
    icon: "🖱️",
    requires: { clicks: 1_000, totalLemons: 50_000 },
    effect: { type: "clickAdd", amount: 100 },
  },
  {
    id: "click_cps_1",
    name: "Poignet élastique",
    description: "Le clic gagne 2 % de votre production.",
    cost: 50_000,
    icon: "💪",
    requires: { clicks: 250, totalLemons: 25_000 },
    effect: { type: "clickCpsPercent", percent: 0.02 },
  },
  {
    id: "click_cps_2",
    name: "Poignet de légende",
    description: "Le clic gagne 5 % de votre production.",
    cost: 5_000_000,
    icon: "💪",
    requires: { clicks: 1_000, totalLemons: 1_000_000 },
    effect: { type: "clickCpsPercent", percent: 0.05 },
  },
  {
    id: "click_cps_3",
    name: "Poignet divin",
    description: "Le clic gagne 10 % de votre production.",
    cost: 500_000_000,
    icon: "💪",
    requires: { clicks: 2_500, totalLemons: 100_000_000 },
    effect: { type: "clickCpsPercent", percent: 0.1 },
  },
];

const globalUpgrades: UpgradeDef[] = [
  {
    id: "global_sugar",
    name: "Nuage de sucre",
    description: "Toute la production est 5 % plus efficace.",
    cost: 25_000,
    icon: "🍬",
    requires: { totalLemons: 10_000 },
    effect: { type: "globalMult", mult: 1.05 },
  },
  {
    id: "global_ice",
    name: "Glaçons éternels",
    description: "Toute la production est 10 % plus efficace.",
    cost: 2_500_000,
    icon: "🧊",
    requires: { totalLemons: 1_000_000 },
    effect: { type: "globalMult", mult: 1.1 },
  },
  {
    id: "global_sun",
    name: "Soleil personnel",
    description: "Toute la production est 15 % plus efficace.",
    cost: 250_000_000,
    icon: "☀️",
    requires: { totalLemons: 100_000_000 },
    effect: { type: "globalMult", mult: 1.15 },
  },
  {
    id: "fingers_1",
    name: "Mille doigts",
    description: "Chaque bâtiment hors curseur ajoute +0,1 au clic et aux curseurs.",
    cost: 50_000,
    icon: "🤚",
    requires: { building: "cursor", count: 10 },
    effect: { type: "fingers", amount: 0.1 },
  },
  {
    id: "fingers_2",
    name: "Million de doigts",
    description: "Chaque bâtiment hors curseur ajoute +0,5 au clic et aux curseurs.",
    cost: 5_000_000,
    icon: "🤚",
    requires: { building: "cursor", count: 25 },
    effect: { type: "fingers", amount: 0.5 },
  },
  {
    id: "fingers_3",
    name: "Milliard de doigts",
    description: "Chaque bâtiment hors curseur ajoute +5 au clic et aux curseurs.",
    cost: 500_000_000,
    icon: "🤚",
    requires: { building: "cursor", count: 50 },
    effect: { type: "fingers", amount: 5 },
  },
];

export const UPGRADES: UpgradeDef[] = [
  ...buildingDoublers.flatMap((entry) =>
    entry.names.map((name, index) => ({
      id: `${entry.id}_x2_${index + 1}`,
      name,
      description:
        entry.id === "cursor"
          ? "Les curseurs et les clics sont deux fois plus efficaces."
          : `Les ${
              {
                grandma: "mamies citron",
                tree: "citronniers",
                mine: "mines de zestes",
                factory: "usines de limonade",
                bank: "banques citronnaises",
                temple: "temples du citron",
                wizard: "tours d'alchimie",
                shipment: "vaisseaux spatiaux",
                portal: "portails",
                timemachine: "machines temporelles",
                condenser: "condensateurs",
              }[entry.id]
            } sont deux fois plus efficaces.`,
      cost: entry.costs[index],
      icon: entry.icon,
      requires: { building: entry.id, count: entry.counts[index] },
      effect: { type: "buildingMult" as const, building: entry.id, mult: 2 },
    })),
  ),
  ...clickUpgrades,
  ...globalUpgrades,
];

export const UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map((upgrade) => [upgrade.id, upgrade]));
