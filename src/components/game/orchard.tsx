"use client";

import { BUILDINGS } from "@/lib/game/buildings";
import type { GameState } from "@/lib/game/types";

interface OrchardProps {
  state: GameState;
}

export function Orchard({ state }: OrchardProps) {
  const rows = BUILDINGS.filter((building) => state.buildings[building.id] > 0);

  if (rows.length === 0) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-yellow-200/20 bg-black/15 px-6 py-8 text-center">
        <p className="font-display text-lg text-lemon-50">Le verger est vide</p>
        <p className="mt-1 max-w-sm text-sm text-lemon-100/60">
          Achetez un curseur ou une mamie pour voir vos employés s&apos;activer ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((building) => {
        const count = state.buildings[building.id];
        const shown = Math.min(count, 24);
        return (
          <div key={building.id} className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-xs text-lemon-100/60">
              <span>
                {building.icon} {count > 1 ? building.plural : building.name}
              </span>
              <span>×{count}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: shown }).map((_, index) => (
                <span
                  key={index}
                  className="inline-flex size-7 items-center justify-center rounded-md bg-lime-900/40 text-base"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {building.icon}
                </span>
              ))}
              {count > shown ? (
                <span className="inline-flex h-7 items-center rounded-md bg-yellow-300/15 px-2 text-xs text-yellow-100">
                  +{count - shown}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
