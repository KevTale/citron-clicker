"use client";

import { ShoppingBasket } from "lucide-react";

import { BuildingShop } from "@/components/game/building-shop";
import { GoldenLemon } from "@/components/game/golden-lemon";
import { LemonButton } from "@/components/game/lemon-button";
import { NewsTicker } from "@/components/game/news-ticker";
import { Orchard } from "@/components/game/orchard";
import { StatsPanel } from "@/components/game/stats-panel";
import { UpgradeBar } from "@/components/game/upgrade-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGame } from "@/hooks/use-game";

export function GameApp() {
  const game = useGame();

  if (!game.state || !game.stats) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-grove text-lemon-50">
        <p className="font-display text-xl">Le verger pousse…</p>
      </div>
    );
  }

  const { state, stats } = game;
  const shop = (
    <BuildingShop
      state={state}
      stats={stats}
      buyMode={game.buyMode}
      onBuyMode={game.setBuyMode}
      onBuy={game.onBuyBuilding}
    />
  );

  return (
    <div className="relative min-h-dvh overflow-hidden bg-grove text-lemon-50">
      <div className="pointer-events-none absolute inset-0 grove-overlay" />
      {state.golden ? <GoldenLemon golden={state.golden} onClick={game.onGolden} /> : null}

      {game.notices.length > 0 ? (
        <div className="pointer-events-none absolute top-4 right-4 z-40 flex w-72 flex-col gap-2">
          {game.notices.map((notice) => (
            <div
              key={notice.id}
              className="animate-fade-in rounded-xl border border-yellow-200/30 bg-lime-950/90 px-3 py-2 text-sm shadow-lg"
            >
              {notice.text}
            </div>
          ))}
        </div>
      ) : null}

      {(stats.frenzyActive || stats.clickFrenzyActive) && (
        <div className="absolute top-0 right-0 left-0 z-20 bg-amber-300 px-4 py-1.5 text-center text-sm font-semibold text-lime-950">
          {stats.frenzyActive && stats.clickFrenzyActive
            ? "Double folie : production ×7 et clics ×777"
            : stats.frenzyActive
              ? "Frénésie : le verger produit 7 fois plus"
              : "Clics en folie : chaque clic vaut 777 fois plus"}
        </div>
      )}

      <div className="relative mx-auto grid min-h-dvh max-w-[1500px] grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_minmax(340px,1.15fr)_minmax(320px,0.95fr)]">
        <section className="flex flex-col items-center justify-center px-4 py-8 lg:border-r lg:border-yellow-200/10">
          <p className="mb-4 font-display text-sm tracking-[0.28em] text-yellow-200/70 uppercase">
            Citron Clicker
          </p>
          <LemonButton
            lemons={state.lemons}
            cps={stats.cps}
            clickPower={stats.clickPower}
            frenzy={stats.frenzyActive}
            clickFrenzy={stats.clickFrenzyActive}
            floaters={game.floaters}
            onClickLemon={game.onClickLemon}
          />
          <div className="mt-6 lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button className="bg-yellow-300 text-lime-950 hover:bg-yellow-200">
                    <ShoppingBasket data-icon="inline-start" />
                    Boutique
                  </Button>
                }
              />
              <SheetContent side="bottom" className="h-[80vh] border-yellow-200/15 bg-lime-950 text-lemon-50">
                <SheetHeader>
                  <SheetTitle className="font-display text-lemon-50">Boutique</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 px-4 pb-4">{shop}</div>
              </SheetContent>
            </Sheet>
          </div>
        </section>

        <section className="flex min-h-0 flex-col gap-5 overflow-y-auto px-4 py-6 lg:max-h-dvh">
          <NewsTicker state={state} />
          <UpgradeBar state={state} onBuy={game.onBuyUpgrade} />
          <Separator className="bg-yellow-200/10" />
          <div>
            <h2 className="mb-2 font-display text-lg text-lemon-50">Votre empire</h2>
            <Orchard state={state} />
          </div>
          <Separator className="bg-yellow-200/10" />
          <StatsPanel state={state} stats={stats} now={game.now} onReset={game.reset} />
        </section>

        <aside className="hidden min-h-0 border-l border-yellow-200/10 px-4 py-6 lg:flex lg:max-h-dvh lg:flex-col">
          {shop}
        </aside>
      </div>
    </div>
  );
}
