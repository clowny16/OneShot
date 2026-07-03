"use client";
// QuickView — modal product preview triggered from collection/product cards.
// Shows image, price, key bullets, color, and Add to Cart / View Product.
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { ProductImage } from "@/components/site/ProductImage";
import { Stars } from "@/components/site/Stars";
import { WishlistButton } from "@/components/site/WishlistButton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function QuickView() {
  const slug = useStore((s) => s.quickViewSlug);
  const close = useStore((s) => s.closeQuickView);
  const products = useStore((s) => s.products);
  const addToCart = useStore((s) => s.addToCart);
  const navigate = useStore((s) => s.navigate);

  const product = slug ? products.find((p) => p.slug === slug) ?? null : null;

  const [adding, setAdding] = useState(false);

  const onAdd = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product, product.colorHex, 1);
      toast({
        title: "Added to cart",
        description: product.name,
      });
    } finally {
      setAdding(false);
    }
  };

  const onView = () => {
    if (!product) return;
    const targetSlug = product.slug;
    close();
    navigate({ view: "product", slug: targetSlug });
  };

  return (
    <Dialog
      open={!!slug}
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <DialogContent
        className="max-w-4xl gap-0 overflow-hidden rounded-xl border border-brushed-silver bg-canvas-white p-0 shadow-2xl sm:rounded-xl"
        aria-describedby={undefined}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {product ? product.name : "Quick view"}
        </DialogTitle>
        {product && (
          <div className="relative grid grid-cols-1 md:grid-cols-2">
            {/* Custom close button — larger, visible, with hover state */}
            <button
              onClick={close}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-canvas-white/90 text-primary shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-error hover:text-on-dark"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-surface-container-low md:aspect-auto">
              <ProductImage
                imageKey={product.imageKey}
                alt={product.title}
                className="h-full w-full border-0"
                imgClassName="transition-transform duration-500 hover:scale-105"
              />
              {product.badge && (
                <div className="absolute left-0 top-0 bg-primary px-3 py-1.5 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-on-dark">
                  {product.badge}
                </div>
              )}
              {product.compareAt && product.compareAt > product.price && (
                <div className="absolute bottom-0 right-0 bg-leather-tan px-3 py-1.5 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-on-dark">
                  Save {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex max-h-[85vh] flex-col overflow-y-auto scrollbar-thin p-6 lg:p-8">
              {/* Product type + wishlist */}
              <div className="flex items-center justify-between pr-8">
                <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
                  {product.productType}
                </span>
                <WishlistButton
                  slug={product.slug}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brushed-silver text-secondary hover:border-error hover:text-error"
                  size={16}
                />
              </div>

              <h2 className="mt-3 font-[var(--font-display)] text-[26px] font-medium leading-tight tracking-tight text-primary">
                {product.name}
              </h2>
              <p className="mt-1.5 font-[var(--font-body)] text-[14px] text-secondary">
                {product.tagline}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Stars rating={product.rating} size={15} />
                <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-secondary">
                  {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-end gap-3">
                <span className="font-[var(--font-display)] text-[32px] font-medium leading-none text-primary">
                  {formatINRFromRupees(product.price)}
                </span>
                {product.compareAt && product.compareAt > product.price && (
                  <span className="mb-1 font-[var(--font-body)] text-[16px] text-outline line-through">
                    {formatINRFromRupees(product.compareAt)}
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                Inclusive of all taxes
              </p>

              {/* Color */}
              <div className="mt-5 flex items-center gap-2.5">
                <span
                  className="h-6 w-6 rounded-full border-2 border-brushed-silver"
                  style={{ backgroundColor: product.colorHex }}
                />
                <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                  {product.colorName}
                </span>
              </div>

              {/* Bullets */}
              <ul className="mt-6 space-y-2.5 border-t border-brushed-silver pt-5">
                {product.bullets.slice(0, 4).map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 font-[var(--font-body)] text-[13px] leading-relaxed text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-leather-tan">
                      check_circle
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Actions — balanced 2-col grid, rounded, with hover shadow */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  onClick={onAdd}
                  disabled={adding}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 font-[var(--font-label)] text-[12px] uppercase tracking-[0.12em] font-semibold text-on-primary transition-all hover:bg-deep-charcoal hover:shadow-md disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {adding ? "progress_activity" : "shopping_bag"}
                  </span>
                  {adding ? "Adding…" : "Add to Cart"}
                </button>
                <button
                  onClick={onView}
                  className="flex items-center justify-center gap-2 rounded-lg border border-primary px-5 py-3.5 font-[var(--font-label)] text-[12px] uppercase tracking-[0.12em] font-semibold text-primary transition-all hover:bg-surface-container-low"
                >
                  Details
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Trust badges — more breathing room, tan icons */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-brushed-silver pt-5">
                {[
                  { icon: "local_shipping", label: "Free Shipping" },
                  { icon: "swap_horiz", label: "7-Day Returns" },
                  { icon: "verified_user", label: "1-Yr Warranty" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <span className="material-symbols-outlined text-[20px] text-leather-tan">
                      {b.icon}
                    </span>
                    <span className="font-[var(--font-label)] text-[9px] uppercase tracking-[0.08em] font-semibold text-secondary">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
