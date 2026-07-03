"use client";
// RecentlyViewed — horizontal strip of recently viewed products shown on home.
// Reads from the store's recentlyViewed list (localStorage-backed).
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export function RecentlyViewed() {
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const products = useStore((s) => s.products);

  const items = recentlyViewed
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
      <Reveal className="mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[24px] text-leather-tan">
          history
        </span>
        <div>
          <h2 className="font-[var(--font-display)] text-[24px] font-medium leading-tight tracking-tight text-primary sm:text-[28px]">
            Recently viewed
          </h2>
          <p className="font-[var(--font-body)] text-[13px] text-secondary">
            Pick up where you left off.
          </p>
        </div>
      </Reveal>
      <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
        {items.slice(0, 6).map((p) => (
          <div key={p.id} className="w-44 shrink-0 sm:w-56 lg:w-64">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
