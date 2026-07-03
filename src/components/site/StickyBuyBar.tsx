"use client";
// StickyBuyBar — appears on mobile product detail pages after scrolling past
// the main add-to-cart button. Shows price + sticky Add to Cart.
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees, type ProductDTO } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function StickyBuyBar({ product }: { product: ProductDTO }) {
  const addToCart = useStore((s) => s.addToCart);
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling 600px (past the main add-to-cart)
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product, product.colorHex, 1);
      toast({ title: "Added to cart", description: product.name });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-brushed-silver bg-canvas-white/95 backdrop-blur transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
            {product.name}
          </p>
          <p className="font-[var(--font-display)] text-[16px] font-medium text-primary">
            {formatINRFromRupees(product.price)}
          </p>
        </div>
        <button
          onClick={onAdd}
          disabled={adding}
          className="bg-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
