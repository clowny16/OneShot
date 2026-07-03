"use client";
// WishlistDrawer — slide-out panel showing wishlisted products.
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { ProductImage } from "@/components/site/ProductImage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function WishlistDrawer() {
  const open = useStore((s) => s.wishlistDrawerOpen);
  const close = useStore((s) => s.closeWishlistDrawer);
  const wishlist = useStore((s) => s.wishlist);
  const products = useStore((s) => s.products);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const navigate = useStore((s) => s.navigate);
  const openQuickView = useStore((s) => s.openQuickView);

  const items = wishlist
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && close()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-canvas-white p-0 sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-brushed-silver px-5 py-4">
          <SheetTitle className="flex items-center justify-between font-[var(--font-display)] text-[18px] font-medium uppercase tracking-tight text-primary">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined filled text-[22px] text-leather-tan">
                favorite
              </span>
              Wishlist
            </span>
            <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
              {items.length} saved
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <span className="material-symbols-outlined text-[56px] text-outline">
              favorite_border
            </span>
            <p className="mt-4 font-[var(--font-display)] text-[18px] font-medium text-primary">
              No saved items yet
            </p>
            <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
              Tap the heart on any product to save it here.
            </p>
            <button
              onClick={() => {
                close();
                navigate({ view: "collection" });
              }}
              className="mt-6 bg-primary px-8 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal"
            >
              Browse earbuds
            </button>
          </div>
        ) : (
          <div className="flex-1 divide-y divide-brushed-silver overflow-y-auto scrollbar-thin">
            {items.map((p) => (
              <div key={p.id} className="flex gap-3 px-5 py-4">
                <button
                  onClick={() => {
                    close();
                    navigate({ view: "product", slug: p.slug });
                  }}
                  className="h-20 w-20 shrink-0 overflow-hidden border border-brushed-silver bg-surface-container-low"
                >
                  <ProductImage
                    imageKey={p.imageKey}
                    alt={p.name}
                    className="h-full w-full border-0"
                  />
                </button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <button
                    onClick={() => {
                      close();
                      navigate({ view: "product", slug: p.slug });
                    }}
                    className="text-left font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary hover:text-leather-tan"
                  >
                    {p.name}
                  </button>
                  <p className="font-[var(--font-body)] text-[12px] text-secondary">
                    {p.colorName}
                  </p>
                  <span className="mt-1 font-[var(--font-display)] text-[15px] font-medium text-primary">
                    {formatINRFromRupees(p.price)}
                  </span>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <button
                      onClick={() => openQuickView(p.slug)}
                      className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Quick view
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.slug)}
                      className="flex items-center gap-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary hover:text-error"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        delete
                      </span>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
