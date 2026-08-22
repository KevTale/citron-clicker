"use client";

import { useState } from "react";

import { LemonGraphic } from "@/components/game/lemon-graphic";
import { formatNumber, lemonWord } from "@/lib/game/format";
import type { FloatingGain } from "@/hooks/use-game";

interface LemonButtonProps {
  lemons: number;
  cps: number;
  clickPower: number;
  frenzy: boolean;
  clickFrenzy: boolean;
  floaters: FloatingGain[];
  onClickLemon: (x: number, y: number, rect: DOMRect) => void;
}

export function LemonButton({
  lemons,
  cps,
  clickPower,
  frenzy,
  clickFrenzy,
  floaters,
  onClickLemon,
}: LemonButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-4xl font-semibold tracking-tight text-lemon-100 sm:text-5xl">
        {formatNumber(lemons)}
      </p>
      <p className="mt-1 text-sm text-lemon-200/80 sm:text-base">
        {lemonWord(lemons)}
        <span className="mx-2 text-lemon-300/40">•</span>
        {formatNumber(cps)} par seconde
      </p>
      <p className="mt-0.5 text-xs text-lemon-200/55">
        +{formatNumber(clickPower)} par clic
      </p>

      <button
        type="button"
        aria-label="Presser un citron"
        className="relative mt-6 cursor-pointer select-none rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/50"
        onPointerDown={(event) => {
          setPressed(true);
          const rect = event.currentTarget.getBoundingClientRect();
          onClickLemon(event.clientX, event.clientY, rect);
        }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        <span
          className={`absolute inset-6 rounded-full bg-yellow-300/25 blur-2xl transition ${
            frenzy || clickFrenzy ? "animate-pulse bg-amber-300/40" : ""
          }`}
        />
        <LemonGraphic
          className={`relative h-52 w-52 drop-shadow-[0_18px_24px_rgba(80,50,0,0.35)] transition-transform duration-100 sm:h-64 sm:w-64 ${
            pressed ? "scale-90 rotate-[-4deg]" : "scale-100 hover:scale-[1.03]"
          }`}
        />
        {floaters.map((floater) => (
          <span
            key={floater.id}
            className="pointer-events-none absolute animate-floater font-display text-lg font-semibold text-yellow-100"
            style={{ left: `${floater.x}%`, top: `${floater.y}%` }}
          >
            +{formatNumber(floater.amount)}
          </span>
        ))}
      </button>

      <p className="mt-4 max-w-xs text-sm text-lemon-100/70">
        Cliquez le citron. Achetez un verger. Devenez ridiculement acide.
      </p>
    </div>
  );
}
