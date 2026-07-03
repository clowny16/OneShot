"use client";
// CartView — line items with qty controls, order summary, promo, checkout CTA.
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { ProductImage } from "@/components/site/ProductImage";
import { toast } from "@/hooks/use-toast";

const FREE_SHIPPING_THRESHOLD = 999; // rupees
const FLAT_SHIPPING = 49;

export function CartView() {
  const cart = useStore((s) => s.cart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeItem = useStore((s) => s.removeItem);
  const clearCart = useStore((s) => s.clearCart);
  const navigate = useStore((s) => s.navigate);
  const loading = useStore((s) => s.cartLoading);

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const discount = appliedPromo === "ONESHOT10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const onApplyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (code === "ONESHOT10") {
      setAppliedPromo(code);
      toast({
        title: "Promo applied",
        description: "10% off your subtotal.",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "Try ONESHOT10 for 10% off.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-32 pb-24 lg:px-16">
        <EmptyCart onShop={() => navigate({ view: "collection" })} />
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="pt-20">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <div className="mb-10">
          <span className="mb-2 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
            Your bag
          </span>
          <h1 className="font-[var(--font-display)] text-[36px] font-medium leading-tight tracking-tight text-primary sm:text-[48px]">
            Shopping Cart
          </h1>
          <p className="mt-2 font-[var(--font-body)] text-[15px] text-secondary">
            {cart?.itemCount ?? 0} item{(cart?.itemCount ?? 0) > 1 ? "s" : ""} in your bag
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-2">
            {/* Free shipping progress */}
            <div className="mb-6 border border-brushed-silver bg-surface-container-lowest p-4">
              {remaining > 0 ? (
                <p className="font-[var(--font-body)] text-[14px] text-primary">
                  Add{" "}
                  <span className="font-semibold text-leather-tan">
                    {formatINRFromRupees(remaining)}
                  </span>{" "}
                  more for free shipping.
                </p>
              ) : (
                <p className="flex items-center gap-2 font-[var(--font-body)] text-[14px] text-success">
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  You've unlocked free shipping.
                </p>
              )}
              <div className="mt-2 h-1.5 w-full bg-surface-container-high">
                <div
                  className="h-full bg-leather-tan transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-brushed-silver border-y border-brushed-silver">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-6 sm:gap-6"
                >
                  <button
                    onClick={() =>
                      navigate({ view: "product", slug: item.slug })
                    }
                    className="shrink-0"
                  >
                    <div className="h-24 w-24 overflow-hidden border border-brushed-silver bg-surface-container-low sm:h-32 sm:w-32">
                      <ProductImage
                        imageKey={item.imageKey}
                        alt={item.name}
                        className="h-full w-full border-0"
                      />
                    </div>
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          onClick={() =>
                            navigate({ view: "product", slug: item.slug })
                          }
                          className="text-left font-[var(--font-display)] text-[18px] font-medium uppercase tracking-tight text-primary hover:text-leather-tan"
                        >
                          {item.name}
                        </button>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full border border-brushed-silver"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-secondary">
                            {item.colorName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-[var(--font-display)] text-[16px] font-medium text-primary">
                          {formatINRFromRupees(item.lineTotal)}
                        </div>
                        <div className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.05em] font-semibold text-secondary">
                          {formatINRFromRupees(item.price)} each
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-brushed-silver">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={loading || item.quantity <= 1}
                          className="px-3 py-2 text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            remove
                          </span>
                        </button>
                        <span className="w-10 text-center font-[var(--font-display)] text-[14px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={loading || item.quantity >= 10}
                          className="px-3 py-2 text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="flex items-center gap-1 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary transition-colors hover:text-error disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => navigate({ view: "collection" })}
                className="flex items-center gap-2 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary hover:text-leather-tan"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Continue shopping
              </button>
              <button
                onClick={() => {
                  clearCart();
                  toast({ title: "Cart cleared" });
                }}
                disabled={loading}
                className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary hover:text-error disabled:opacity-50"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-brushed-silver bg-surface-container-lowest p-6 lg:p-8">
              <h2 className="font-[var(--font-display)] text-[22px] font-medium text-primary">
                Order Summary
              </h2>

              {/* Promo */}
              <div className="mt-6">
                <label className="block font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                  Promo code
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="ONESHOT10"
                    className="min-w-0 flex-1 border border-brushed-silver bg-canvas-white px-3 py-2 font-[var(--font-body)] text-[14px] text-primary uppercase placeholder:text-outline-variant focus:outline-none"
                  />
                  <button
                    onClick={onApplyPromo}
                    className="bg-primary px-4 py-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-on-dark hover:bg-deep-charcoal"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="mt-2 flex items-center gap-1 font-[var(--font-body)] text-[12px] text-success">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                    {appliedPromo} applied — 10% off
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-brushed-silver pt-6">
                <Row label="Subtotal" value={formatINRFromRupees(subtotal)} />
                {discount > 0 && (
                  <Row
                    label="Discount"
                    value={`− ${formatINRFromRupees(discount)}`}
                    accent="success"
                  />
                )}
                <Row
                  label="Shipping"
                  value={
                    shipping === 0 ? "Free" : formatINRFromRupees(shipping)
                  }
                />
              </div>

              <div className="mt-6 flex items-baseline justify-between border-t border-brushed-silver pt-6">
                <span className="font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary">
                  Total
                </span>
                <span className="font-[var(--font-display)] text-[28px] font-medium text-primary">
                  {formatINRFromRupees(total)}
                </span>
              </div>

              <button
                onClick={() => navigate({ view: "checkout" })}
                disabled={loading}
                className="mt-6 w-full bg-primary px-6 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark transition-all hover:bg-deep-charcoal disabled:opacity-50"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[16px]">
                  lock
                </span>
                <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold">
                  Secure checkout
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 text-secondary">
                {["visa", "credit_card", "account_balance", "payments"].map(
                  (icon) => (
                    <span
                      key={icon}
                      className="material-symbols-outlined text-[20px] text-outline"
                    >
                      {icon}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-[var(--font-body)] text-[14px] text-secondary">
        {label}
      </span>
      <span
        className={
          accent === "success"
            ? "font-[var(--font-display)] text-[15px] font-medium text-success"
            : "font-[var(--font-display)] text-[15px] font-medium text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}

function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="material-symbols-outlined text-[64px] text-outline">
        shopping_bag
      </span>
      <h1 className="mt-4 font-[var(--font-display)] text-[32px] font-medium tracking-tight text-primary">
        Your bag is empty
      </h1>
      <p className="mt-3 font-[var(--font-body)] text-[16px] text-secondary">
        Looks like you haven't added anything yet. Let's find your sound.
      </p>
      <button
        onClick={onShop}
        className="mt-8 bg-primary px-10 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark hover:bg-deep-charcoal"
      >
        Shop the collection
      </button>
    </div>
  );
}
