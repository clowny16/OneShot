"use client";
// ThemeToggle — light/dark mode toggle button using next-themes.
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = (mounted ? resolvedTheme : "light") === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-brushed-silver text-primary transition-colors hover:bg-surface-container-low",
        className,
      )}
    >
      {/* Render a neutral icon until mounted to avoid hydration mismatch */}
      <span className="material-symbols-outlined text-[18px]">
        {mounted ? (isDark ? "light_mode" : "dark_mode") : "contrast"}
      </span>
    </button>
  );
}
