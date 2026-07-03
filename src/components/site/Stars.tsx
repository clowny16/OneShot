"use client";
// Stars — render a 5-star rating (filled / half / empty) using Material Symbols.
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const extraFull = rating - full >= 0.75 ? 1 : 0;

  return (
    <span
      className={cn("inline-flex items-center text-leather-tan", className)}
      style={{ fontSize: size }}
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full + extraFull;
        const isHalf = !isFull && i === full && hasHalf;
        return (
          <span
            key={i}
            className="material-symbols-outlined filled"
            style={{
              fontSize: size,
              fontVariationSettings: `'FILL' 1, 'wght' 400`,
              color: isFull
                ? "var(--color-leather-tan)"
                : isHalf
                  ? "var(--color-leather-tan)"
                  : "var(--color-brushed-silver)",
              clipPath: isHalf ? "inset(0 50% 0 0)" : undefined,
            }}
            aria-hidden="true"
          >
            star
          </span>
        );
      })}
    </span>
  );
}
