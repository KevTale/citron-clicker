"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ACHIEVEMENT_BY_ID } from "@/lib/game/achievements";
import {
  buyBuilding,
  buyUpgrade,
  clickGolden,
  clickLemon,
  createInitialState,
  deriveStats,
  parseState,
  serializeState,
  tick,
} from "@/lib/game/engine";
import { SAVE_KEY, type BuildingId, type BuyMode, type GameState } from "@/lib/game/types";

export interface FloatingGain {
  id: number;
  amount: number;
  x: number;
  y: number;
}

export interface GameNotice {
  id: number;
  text: string;
}

export function useGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [now, setNow] = useState(0);
  const [buyMode, setBuyMode] = useState<BuyMode>(1);
  const [floaters, setFloaters] = useState<FloatingGain[]>([]);
  const [notices, setNotices] = useState<GameNotice[]>([]);
  const stateRef = useRef<GameState | null>(null);
  const lastFrame = useRef(0);
  const floaterId = useRef(0);
  const noticeId = useRef(0);
  const ready = state !== null;

  const pushNotice = useCallback((text: string) => {
    const id = ++noticeId.current;
    setNotices((current) => [...current.slice(-4), { id, text }]);
    window.setTimeout(() => {
      setNotices((current) => current.filter((notice) => notice.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    const loaded = parseState(window.localStorage.getItem(SAVE_KEY)) ?? createInitialState();
    const elapsedMs = Math.max(0, Date.now() - (loaded.lastSavedAt || loaded.startedAt));
    const elapsed = Math.min(elapsedMs / 1000, 8 * 60 * 60);
    const offline = elapsed > 15 ? deriveStats(loaded).cps * elapsed : 0;
    const initial =
      offline > 0
        ? {
            ...loaded,
            lemons: loaded.lemons + offline,
            totalLemons: loaded.totalLemons + offline,
          }
        : loaded;
    stateRef.current = initial;
    const timer = window.setTimeout(() => {
      setState(initial);
      setNow(Date.now());
      if (offline > 0) {
        pushNotice(`Pendant votre absence : +${Math.floor(offline).toLocaleString("fr-FR")} citrons.`);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pushNotice]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!ready) return;
    lastFrame.current = performance.now();
    let frame = 0;
    let lastUi = 0;
    const loop = (timestamp: number) => {
      const current = stateRef.current;
      if (current) {
        const dt = Math.min(0.25, (timestamp - lastFrame.current) / 1000);
        lastFrame.current = timestamp;
        const previousAchievements = current.achievements;
        const next = tick(current, dt, Date.now());
        stateRef.current = next;
        if (timestamp - lastUi > 70) {
          lastUi = timestamp;
          setNow(Date.now());
          setState(next);
          if (next.achievements.length > previousAchievements.length) {
            const fresh = next.achievements.filter((id) => !previousAchievements.includes(id));
            for (const id of fresh) {
              const achievement = ACHIEVEMENT_BY_ID[id];
              if (achievement) pushNotice(`Trophée : ${achievement.name}`);
            }
          }
        }
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [ready, pushNotice]);

  useEffect(() => {
    const persist = () => {
      const current = stateRef.current;
      if (!current) return;
      const saved = { ...current, lastSavedAt: Date.now() };
      window.localStorage.setItem(SAVE_KEY, serializeState(saved));
    };
    const interval = window.setInterval(persist, 8_000);
    window.addEventListener("beforeunload", persist);
    return () => {
      persist();
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", persist);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((current) => (current ? { ...current, newsIndex: current.newsIndex + 1 } : current));
    }, 9_000);
    return () => window.clearInterval(interval);
  }, []);

  const stats = useMemo(() => (state ? deriveStats(state, now || undefined) : null), [state, now]);

  const onClickLemon = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    const current = stateRef.current;
    if (!current) return;
    const { state: next, gained } = clickLemon(current);
    stateRef.current = next;
    setState(next);
    const id = ++floaterId.current;
    setFloaters((items) => [
      ...items.slice(-18),
      {
        id,
        amount: gained,
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
      },
    ]);
    window.setTimeout(() => {
      setFloaters((items) => items.filter((item) => item.id !== id));
    }, 900);
  }, []);

  const onBuyBuilding = useCallback(
    (id: BuildingId) => {
      setState((current) => {
        if (!current) return current;
        const next = buyBuilding(current, id, buyMode);
        stateRef.current = next;
        return next;
      });
    },
    [buyMode],
  );

  const onBuyUpgrade = useCallback((id: string) => {
    setState((current) => {
      if (!current) return current;
      const next = buyUpgrade(current, id);
      stateRef.current = next;
      return next;
    });
  }, []);

  const onGolden = useCallback(() => {
    const current = stateRef.current;
    if (!current) return;
    const { state: next, message, gained } = clickGolden(current);
    stateRef.current = next;
    setState(next);
    if (message) {
      pushNotice(gained > 0 ? `${message} +${Math.floor(gained).toLocaleString("fr-FR")}` : message);
    }
  }, [pushNotice]);

  const reset = useCallback(() => {
    const next = createInitialState();
    stateRef.current = next;
    setState(next);
    window.localStorage.removeItem(SAVE_KEY);
    pushNotice("Le verger a été arraché. On recommence.");
  }, [pushNotice]);

  return {
    state,
    stats,
    now,
    buyMode,
    setBuyMode,
    floaters,
    notices,
    onClickLemon,
    onBuyBuilding,
    onBuyUpgrade,
    onGolden,
    reset,
  };
}
