"use client";
// ProductCard — editorial card. Used in grids on Home, Collection, and related.
// Includes wishlist heart, quick-view button (hover), and social-proof line.
import { type ProductDTO, formatINRFromRupees } from "@/lib/types";
import { useStore } from "@/lib/store";
import { ProductImage } from "./ProductImage";
import { Stars } from "./Stars";
import { WishlistButton } from "./WishlistButton";
import { cn } from "@/lib/utils";

type Variant = "default" | "tall" | "wide";

// Deterministic "bought today" count per slug (stable across renders).
function boughtToday(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return 6 + (Math.abs(h) % 18); // 6–23
}

export function ProductCard({
  product,
  variant = "default",
  priority = false,
}: {
  product: ProductDTO;
  variant?: Variant;
  priority?: boolean;
}) {
  const navigate = useStore((s) => s.navigate);
  const openQuickView = useStore((s) => s.openQuickView);

  const aspectClass =
    variant === "tall"
      ? "aspect-[3/4]"
      : variant === "wide"
        ? "aspect-[16/9]"
        : "aspect-square";

  const discountPct =
    product.compareAt && product.compareAt > product.price
      ? Math.round(
          ((product.compareAt - product.price) / product.compareAt) * 100,
        )
      : 0;

  return (
    <article
      className="group cursor-pointer transition-opacity active:opacity-95"
      onClick={() => navigate({ view: "product", slug: product.slug })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate({ view: "product", slug: product.slug });
        }
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden border border-brushed-silver bg-surface-container-low",
          aspectClass,
        )}
      >
        <ProductImage
          imageKey={product.imageKey}
          alt={product.title}
          className="h-full w-full border-0"
        />
        {product.badge && (
          <div className="absolute left-0 top-0 bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.1em] font-semibold text-on-dark font-[var(--font-label)]">
            {product.badge}
          </div>
        )}
        {discountPct > 0 && !product.badge && (
          <div className="absolute left-0 top-0 bg-leather-tan px-3 py-1 text-[10px] uppercase tracking-[0.1em] font-semibold text-on-dark font-[var(--font-label)]">
            -{discountPct}%
          </div>
        )}

        {/* Wishlist heart */}
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton
            slug={product.slug}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas-white/85 text-primary backdrop-blur transition-colors hover:bg-canvas-white"
            size={18}
          />
        </div>

        {/* Hover actions: Quick view + View Product */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product.slug);
            }}
            className="bg-canvas-white/95 px-4 py-2.5 text-center text-[11px] uppercase tracking-[0.15em] font-semibold text-primary backdrop-blur transition-colors hover:bg-leather-tan hover:text-on-dark font-[var(--font-label)]"
          >
            Quick view
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-[var(--font-display)] text-[18px] font-medium leading-tight text-primary uppercase tracking-tight">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary font-[var(--font-label)]">
            {product.colorName}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={product.rating} size={13} />
            <span className="text-[11px] text-secondary font-[var(--font-label)]">
              ({product.reviewCount.toLocaleString("en-IN")})
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1 font-[var(--font-body)] text-[11px] text-leather-tan">
            <span className="material-symbols-outlined text-[12px]">
              local_fire_department
            </span>
            {boughtToday(product.slug)} bought today
          </p>
        </div>
        <div className="text-right">
          <div className="font-[var(--font-display)] text-[18px] font-medium leading-none text-primary">
            {formatINRFromRupees(product.price)}
          </div>
          {product.compareAt && product.compareAt > product.price && (
            <div className="mt-1 text-[12px] text-outline line-through font-[var(--font-body)]">
              {formatINRFromRupees(product.compareAt)}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

