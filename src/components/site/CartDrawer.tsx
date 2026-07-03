"use client";
// CartDrawer — slide-out cart panel for instant cart access without leaving
// the current page. Mirrors the CartView logic but in a compact drawer.
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { ProductImage } from "@/components/site/ProductImage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 49;

export function CartDrawer() {
  const open = useStore((s) => s.cartDrawerOpen);
  const close = useStore((s) => s.closeCartDrawer);
  const cart = useStore((s) => s.cart);
  const loading = useStore((s) => s.cartLoading);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeItem = useStore((s) => s.removeItem);
  const navigate = useStore((s) => s.navigate);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && close()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-canvas-white p-0 sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-brushed-silver px-5 py-4">
          <SheetTitle className="flex items-center justify-between font-[var(--font-display)] text-[18px] font-medium uppercase tracking-tight text-primary">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">
                shopping_bag
              </span>
              Your Bag
            </span>
            <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
              {cart?.itemCount ?? 0} items
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <span className="material-symbols-outlined text-[56px] text-outline">
              shopping_bag
            </span>
            <p className="mt-4 font-[var(--font-display)] text-[18px] font-medium text-primary">
              Your bag is empty
            </p>
            <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
              Add something you love.
            </p>
            <button
              onClick={() => {
                close();
                navigate({ view: "collection" });
              }}
              className="mt-6 bg-primary px-8 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal"
            >
              Shop the collection
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-brushed-silver bg-surface-container-low px-5 py-3">
              {remaining > 0 ? (
                <p className="font-[var(--font-body)] text-[13px] text-primary">
                  Add{" "}
                  <span className="font-semibold text-leather-tan">
                    {formatINRFromRupees(remaining)}
                  </span>{" "}
                  more for free shipping.
                </p>
              ) : (
                <p className="flex items-center gap-1.5 font-[var(--font-body)] text-[13px] text-success">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  Free shipping unlocked.
                </p>
              )}
              <div className="mt-2 h-1 w-full bg-surface-container-high">
                <div
                  className="h-full bg-leather-tan transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 divide-y divide-brushed-silver overflow-y-auto scrollbar-thin">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 px-5 py-4">
                  <button
                    onClick={() => {
                      close();
                      navigate({ view: "product", slug: item.slug });
                    }}
                    className="h-20 w-20 shrink-0 overflow-hidden border border-brushed-silver bg-surface-container-low"
                  >
                    <ProductImage
                      imageKey={item.imageKey}
                      alt={item.name}
                      className="h-full w-full border-0"
                    />
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => {
                          close();
                          navigate({ view: "product", slug: item.slug });
                        }}
                        className="text-left font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary hover:text-leather-tan"
                      >
                        {item.name}
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="text-secondary hover:text-error disabled:opacity-50"
                        aria-label="Remove"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-brushed-silver"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="font-[var(--font-body)] text-[11px] text-secondary">
                        {item.colorName}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-brushed-silver">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={loading || item.quantity <= 1}
                          className="px-2 py-1.5 text-primary hover:bg-surface-container-low disabled:opacity-40"
                          aria-label="Decrease"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            remove
                          </span>
                        </button>
                        <span className="w-8 text-center font-[var(--font-display)] text-[13px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={loading || item.quantity >= 10}
                          className="px-2 py-1.5 text-primary hover:bg-surface-container-low disabled:opacity-40"
                          aria-label="Increase"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            add
                          </span>
                        </button>
                      </div>
                      <span className="font-[var(--font-display)] text-[14px] font-medium text-primary">
                        {formatINRFromRupees(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-brushed-silver bg-canvas-white p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                  Subtotal
                </span>
                <span className="font-[var(--font-display)] text-[24px] font-medium text-primary">
                  {formatINRFromRupees(subtotal)}
                </span>
              </div>
              <p className="mb-4 font-[var(--font-body)] text-[12px] text-secondary">
                Shipping calculated at checkout. Free over ₹999.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    close();
                    navigate({ view: "checkout" });
                  }}
                  className="w-full bg-primary px-6 py-3.5 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal"
                >
                  Checkout
                </button>
                <button
                  onClick={() => {
                    close();
                    navigate({ view: "cart" });
                  }}
                  className="w-full border border-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary hover:bg-surface-container-low"
                >
                  View full cart
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Re-export toast usage to keep the module self-contained
export { toast };
