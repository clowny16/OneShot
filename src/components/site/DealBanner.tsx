"use client";
// DealBanner — limited-time deal banner with a live countdown.
// Shown at the very top of the home page (above the hero slider).
import { useEffect, useState } from "react";

// Deal ends 36 hours from first mount (persists in localStorage so it counts
// down consistently across reloads).
const DEAL_DURATION_MS = 36 * 60 * 60 * 1000;
const DEAL_KEY = "oneshot_deal_end";

function getDealEnd(): number {
  if (typeof window === "undefined") return Date.now() + DEAL_DURATION_MS;
  const stored = localStorage.getItem(DEAL_KEY);
  if (stored) {
    const n = Number(stored);
    if (!Number.isNaN(n) && n > Date.now()) return n;
  }
  const end = Date.now() + DEAL_DURATION_MS;
  localStorage.setItem(DEAL_KEY, String(end));
  return end;
}

export function DealBanner() {
  const [end] = useState(getDealEnd);
  const [remaining, setRemaining] = useState(end - Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => {
      setRemaining(Math.max(0, end - Date.now()));
    }, 1000);
    return () => clearInterval(t);
  }, [end]);

  if (!mounted || remaining <= 0) return null;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-deep-charcoal text-on-dark">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center lg:px-16">
        <span className="flex items-center gap-1.5 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold">
          <span className="material-symbols-outlined filled text-[14px] text-leather-tan">
            bolt
          </span>
          Festive drop — up to 30% off
        </span>
        <span className="hidden text-on-dark/40 sm:inline">·</span>
        <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-on-dark/80">
          Ends in
        </span>
        <span className="flex items-center gap-1 font-[var(--font-display)] text-[13px] font-semibold tabular-nums">
          <span className="bg-canvas-white/15 px-1.5 py-0.5 rounded-sm">{pad(hours)}</span>
          <span className="text-on-dark/60">:</span>
          <span className="bg-canvas-white/15 px-1.5 py-0.5 rounded-sm">{pad(minutes)}</span>
          <span className="text-on-dark/60">:</span>
          <span className="bg-canvas-white/15 px-1.5 py-0.5 rounded-sm">{pad(seconds)}</span>
        </span>
      </div>
    </div>
  );
}
