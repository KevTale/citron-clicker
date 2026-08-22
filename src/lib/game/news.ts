import type { GameState } from "./types";

const GENERIC_NEWS = [
  "Les scientifiques confirment : le citron est 23 % plus acide aujourd'hui.",
  "Un citron a été élu maire. Il promet plus de zestes, moins de pépins.",
  "Nouvelle étude : 4 personnes sur 5 préfèrent la limonade à l'eau. La cinquième ment.",
  "La bourse des agrumes s'envole. Les kiwis protestent.",
  "Un chat a volé un citron. Il nie, mais ses moustaches sont jaunes.",
  "Météo : soleil, légèrement citronné, risque de pépins dans le nord.",
  "Des archéologues découvrent une fresque : un citron géant, déjà adoré.",
  "Le dictionnaire ajoute « zestastrophique ». Ça veut dire très acide.",
  "Un chef étoilé sert un citron cru. Les critiques parlent de « courage ».",
  "Rumeur : la Lune serait un citron trop mûr. La NASA ne commente pas.",
  "Un bébé a dit « citron » comme premier mot. Ses parents sont fiers et un peu inquiets.",
  "Les abeilles boycottent les fleurs fades. Elles veulent du peps.",
  "Un philosophe affirme que le citron est la forme parfaite. Platon se retourne.",
  "Alerte : pénurie de pailles. Les verres de limonade se sentent nus.",
  "Un marathonien ne boit que de la limonade. Il arrive premier et tout jaune.",
];

const CONDITIONAL_NEWS: { test: (state: GameState) => boolean; lines: string[] }[] = [
  {
    test: (state) => state.buildings.grandma >= 1,
    lines: [
      "Les mamies citron fondent un syndicat. Revendications : plus de tabliers, moins de réunions.",
      "Une mamie a pressé 400 citrons avant le café. Elle trouve ça « léger ».",
    ],
  },
  {
    test: (state) => state.buildings.tree >= 5,
    lines: [
      "Les citronniers chuchotent la nuit. Ils parlent rendement.",
      "Un verger a demandé une augmentation. On lui a donné de l'engrais.",
    ],
  },
  {
    test: (state) => state.buildings.factory >= 1,
    lines: [
      "L'usine tourne si vite que les citrons sortent déjà en quartiers.",
      "Un robot presseur s'est mis en grève. Il voulait des pauses sucrées.",
    ],
  },
  {
    test: (state) => state.buildings.shipment >= 1,
    lines: [
      "Premier contact : une planète entièrement recouverte de citronniers. On s'entend bien.",
      "Le vaisseau revient avec des citrons cubiques. Marketing spatial.",
    ],
  },
  {
    test: (state) => state.totalLemons >= 1_000_000,
    lines: [
      "Vous êtes officiellement trop riche en citrons. Les banques appellent ça un « risque systémique ».",
      "Un économiste pleure en regardant votre stock. Il dit que c'est de la « beauté brute ».",
    ],
  },
];

export function pickNews(state: GameState, index: number): string {
  const pool = [...GENERIC_NEWS];
  for (const entry of CONDITIONAL_NEWS) {
    if (entry.test(state)) pool.push(...entry.lines);
  }
  return pool[index % pool.length] ?? GENERIC_NEWS[0];
}
