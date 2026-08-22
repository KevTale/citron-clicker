"use client";

import { MiniLemon } from "@/components/game/lemon-graphic";
import type { GoldenLemon as GoldenLemonState } from "@/lib/game/types";

interface GoldenLemonProps {
  golden: GoldenLemonState;
  onClick: () => void;
}

export function GoldenLemon({ golden, onClick }: GoldenLemonProps) {
  return (
    <button
      type="button"
      aria-label="Citron doré"
      onClick={onClick}
      className="pointer-events-auto absolute z-30 -translate-x-1/2 -translate-y-1/2 animate-wiggle cursor-pointer rounded-full border-0 bg-transparent p-0"
      style={{ left: `${golden.x}%`, top: `${golden.y}%` }}
    >
      <span className="absolute inset-0 rounded-full bg-amber-300/50 blur-md" />
      <MiniLemon className="relative h-16 w-16 drop-shadow-[0_0_16px_rgba(255,210,50,0.9)]" />
    </button>
  );
}
