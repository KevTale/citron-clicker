"use client";

import { pickNews } from "@/lib/game/news";
import type { GameState } from "@/lib/game/types";

export function NewsTicker({ state }: { state: GameState }) {
  const line = pickNews(state, state.newsIndex);

  return (
    <div className="overflow-hidden rounded-xl border border-yellow-200/15 bg-black/25 px-3 py-2">
      <p className="text-[10px] tracking-[0.2em] text-yellow-200/60 uppercase">Infos du verger</p>
      <p key={state.newsIndex} className="animate-fade-in mt-0.5 text-sm text-lemon-50">
        {line}
      </p>
    </div>
  );
}
