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
        className="max-w-3xl overflow-hidden bg-canvas-white p-0 sm:rounded-none"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          {product ? product.name : "Quick view"}
        </DialogTitle>
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden border-b border-brushed-silver bg-surface-container-low md:border-b-0 md:border-r">
              <ProductImage
                imageKey={product.imageKey}
                alt={product.title}
                className="h-full w-full border-0"
                imgClassName="transition-transform duration-500 hover:scale-105"
              />
              {product.badge && (
                <div className="absolute left-0 top-0 bg-primary px-3 py-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-canvas-white">
                  {product.badge}
                </div>
              )}
              {product.compareAt && product.compareAt > product.price && (
                <div className="absolute right-0 top-0 bg-leather-tan px-3 py-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-canvas-white">
                  -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex max-h-[80vh] flex-col overflow-y-auto scrollbar-thin p-6">
              {/* Product type + wishlist */}
              <div className="flex items-center justify-between">
                <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
                  {product.productType}
                </span>
                <WishlistButton
                  slug={product.slug}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brushed-silver text-secondary hover:border-error hover:text-error"
                  size={18}
                />
              </div>

              <h2 className="mt-2 font-[var(--font-display)] text-[24px] font-medium uppercase leading-tight tracking-tight text-primary">
                {product.name}
              </h2>
              <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
                {product.tagline}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Stars rating={product.rating} size={14} />
                <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-secondary">
                  {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <span className="font-[var(--font-display)] text-[30px] font-medium text-primary">
                  {formatINRFromRupees(product.price)}
                </span>
                {product.compareAt && product.compareAt > product.price && (
                  <span className="mb-1.5 font-[var(--font-body)] text-[16px] text-outline line-through">
                    {formatINRFromRupees(product.compareAt)}
                  </span>
                )}
              </div>
              <p className="mt-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                Inclusive of all taxes
              </p>

              {/* Color */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className="h-5 w-5 rounded-full border-2 border-primary"
                  style={{ backgroundColor: product.colorHex }}
                />
                <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                  {product.colorName}
                </span>
              </div>

              {/* Bullets */}
              <ul className="mt-5 space-y-2 border-t border-brushed-silver pt-5">
                {product.bullets.slice(0, 4).map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-[var(--font-body)] text-[13px] text-on-surface"
                  >
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-leather-tan">
                      check_circle
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={onAdd}
                  disabled={adding}
                  className="flex flex-1 items-center justify-center gap-2 bg-primary px-6 py-3.5 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white transition-all hover:bg-deep-charcoal disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {adding ? "progress_activity" : "shopping_bag"}
                  </span>
                  {adding ? "Adding…" : "Add to Cart"}
                </button>
                <button
                  onClick={onView}
                  className="flex-1 border border-primary px-6 py-3.5 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary hover:bg-surface-container-low"
                >
                  View Details
                </button>
              </div>

              {/* Trust */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-brushed-silver pt-4">
                {[
                  { icon: "local_shipping", label: "Free Shipping" },
                  { icon: "swap_horiz", label: "7-Day Returns" },
                  { icon: "verified_user", label: "1-Yr Warranty" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {b.icon}
                    </span>
                    <span className="font-[var(--font-label)] text-[9px] uppercase tracking-[0.1em] font-semibold text-secondary">
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
