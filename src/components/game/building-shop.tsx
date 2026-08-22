"use client";

import { BUILDING_BY_ID, BUILDINGS } from "@/lib/game/buildings";
import {
  buildingCost,
  bulkCost,
  resolveBuyAmount,
  visibleBuildings,
} from "@/lib/game/engine";
import { formatCps, formatNumber } from "@/lib/game/format";
import type { BuildingId, BuyMode, DerivedStats, GameState } from "@/lib/game/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MODES: BuyMode[] = [1, 10, 100, "max"];

interface BuildingShopProps {
  state: GameState;
  stats: DerivedStats;
  buyMode: BuyMode;
  onBuyMode: (mode: BuyMode) => void;
  onBuy: (id: BuildingId) => void;
}

export function BuildingShop({ state, stats, buyMode, onBuyMode, onBuy }: BuildingShopProps) {
  const visible = new Set(visibleBuildings(state));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 px-1 pb-3">
        <div>
          <h2 className="font-display text-xl text-lemon-50">Boutique</h2>
          <p className="text-xs text-lemon-200/60">Des employés, des arbres, puis l&apos;espace.</p>
        </div>
        <div className="flex rounded-lg border border-lemon-300/20 bg-black/20 p-0.5">
          {MODES.map((mode) => (
            <Button
              key={String(mode)}
              size="xs"
              variant={buyMode === mode ? "default" : "ghost"}
              className={cn(
                "min-w-9 text-[11px]",
                buyMode === mode && "bg-yellow-300 text-lime-950 hover:bg-yellow-200",
              )}
              onClick={() => onBuyMode(mode)}
            >
              {mode === "max" ? "max" : `×${mode}`}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {BUILDINGS.map((building) => {
          if (!visible.has(building.id)) {
            return (
              <div
                key={building.id}
                className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-lemon-100/35"
              >
                <p className="text-sm">???</p>
                <p className="text-xs">Encore trop mystérieux.</p>
              </div>
            );
          }

          const owned = state.buildings[building.id];
          const amount = resolveBuyAmount(building.id, owned, state.lemons, buyMode);
          const cost =
            buyMode === "max"
              ? amount > 0
                ? bulkCost(building.id, owned, amount)
                : buildingCost(building.id, owned)
              : bulkCost(building.id, owned, amount || buyMode);
          const canBuy = amount > 0 && state.lemons >= cost;
          const per = owned > 0 ? stats.buildingCps[building.id] / owned : BUILDING_BY_ID[building.id].baseCps;

          return (
            <button
              key={building.id}
              type="button"
              disabled={!canBuy}
              onClick={() => onBuy(building.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                canBuy
                  ? "border-yellow-300/40 bg-gradient-to-r from-yellow-300/20 to-lime-900/30 hover:border-yellow-200 hover:from-yellow-300/30"
                  : "border-white/8 bg-black/25 opacity-80",
              )}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-black/30 text-2xl">
                {building.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-base text-lemon-50">{building.name}</span>
                  {owned > 0 ? (
                    <Badge variant="secondary" className="bg-lime-900/80 text-yellow-100">
                      {owned}
                    </Badge>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-lemon-100/65">{building.description}</span>
                <span className="mt-1 block text-[11px] text-lemon-200/50">
                  {formatCps(per)} chacun · {formatCps(stats.buildingCps[building.id] || 0)} au total
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className={cn("block font-display text-sm", canBuy ? "text-yellow-200" : "text-rose-200/80")}>
                  {formatNumber(cost)}
                </span>
                <span className="text-[11px] text-lemon-100/45">
                  {buyMode === "max" ? (amount > 1 ? `×${amount}` : "1") : `×${amount || buyMode}`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
