"use client";

import { visibleUpgrades } from "@/lib/game/engine";
import { formatNumber } from "@/lib/game/format";
import type { GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface UpgradeBarProps {
  state: GameState;
  onBuy: (id: string) => void;
}

export function UpgradeBar({ state, onBuy }: UpgradeBarProps) {
  const upgrades = visibleUpgrades(state);

  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <h2 className="font-display text-lg text-lemon-50">Améliorations</h2>
        <p className="text-xs text-lemon-200/55">{state.upgrades.length} achetées</p>
      </div>
      {upgrades.length === 0 ? (
        <p className="rounded-xl border border-dashed border-yellow-200/20 bg-black/20 px-4 py-6 text-sm text-lemon-100/55">
          Cliquez encore un peu. Les premières améliorations arriveront vite.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {upgrades.map((upgrade) => {
            const canBuy = state.lemons >= upgrade.cost;
            return (
              <button
                key={upgrade.id}
                type="button"
                disabled={!canBuy}
                title={`${upgrade.name} — ${upgrade.description} (${formatNumber(upgrade.cost)} citrons)`}
                onClick={() => onBuy(upgrade.id)}
                className={cn(
                  "group relative flex size-14 items-center justify-center rounded-xl border text-2xl transition",
                  canBuy
                    ? "border-yellow-300/70 bg-yellow-300/20 hover:scale-105 hover:bg-yellow-300/35"
                    : "border-white/10 bg-black/30 opacity-60",
                )}
              >
                <span>{upgrade.icon}</span>
                <span className="pointer-events-none absolute top-full z-20 mt-2 hidden w-52 rounded-lg border border-yellow-200/20 bg-lime-950/95 p-2 text-left text-xs text-lemon-50 shadow-xl group-hover:block">
                  <strong className="block font-display">{upgrade.name}</strong>
                  <span className="mt-1 block text-lemon-100/75">{upgrade.description}</span>
                  <span className="mt-1 block text-yellow-200">{formatNumber(upgrade.cost)} citrons</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
