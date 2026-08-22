"use client";

import { ACHIEVEMENTS } from "@/lib/game/achievements";
import { formatDuration, formatNumber } from "@/lib/game/format";
import type { DerivedStats, GameState } from "@/lib/game/types";
import { Button } from "@/components/ui/button";

interface StatsPanelProps {
  state: GameState;
  stats: DerivedStats;
  now: number;
  onReset: () => void;
}

export function StatsPanel({ state, stats, now, onReset }: StatsPanelProps) {
  const owned = Object.values(state.buildings).reduce((sum, count) => sum + count, 0);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-lemon-50">Tableau de bord</h2>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <Stat label="Citrons totaux" value={formatNumber(state.totalLemons)} />
          <Stat label="Faits à la main" value={formatNumber(state.handmadeLemons)} />
          <Stat label="Clics" value={formatNumber(state.clicks)} />
          <Stat label="Bâtiments" value={formatNumber(owned)} />
          <Stat label="Production brute" value={`${formatNumber(stats.rawCps)} / s`} />
          <Stat label="Temps de jeu" value={formatDuration(now - state.startedAt)} />
        </dl>
      </div>

      <div>
        <div className="mb-2 flex items-end justify-between">
          <h3 className="font-display text-base text-lemon-50">Trophées</h3>
          <p className="text-xs text-lemon-200/55">
            {state.achievements.length}/{ACHIEVEMENTS.length}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = state.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                title={
                  unlocked
                    ? `${achievement.name} — ${achievement.description}`
                    : `??? — ${achievement.description}`
                }
                className={`flex aspect-square items-center justify-center rounded-xl border text-xl ${
                  unlocked
                    ? "border-yellow-300/40 bg-yellow-300/15"
                    : "border-white/8 bg-black/30 opacity-35 grayscale"
                }`}
              >
                {unlocked ? achievement.icon : "•"}
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-rose-300/30 bg-rose-950/20 text-rose-100 hover:bg-rose-950/40"
        onClick={() => {
          if (window.confirm("Tout jeter et recommencer à zéro ? La sauvegarde locale sera effacée.")) {
            onReset();
          }
        }}
      >
        Recommencer le verger
      </Button>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/20 px-3 py-2">
      <dt className="text-[11px] text-lemon-200/50">{label}</dt>
      <dd className="font-display text-lemon-50">{value}</dd>
    </div>
  );
}
