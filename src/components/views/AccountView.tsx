"use client";
// AccountView — user account dashboard with profile, order history, and stats.
// Requires authentication (redirects to login if not signed in).
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type OrderItem = {
  name: string;
  slug: string;
  price: number;
  quantity: number;
  colorHex: string;
  colorName: string;
};

type Order = {
  orderId: string;
  total: number;
  shipping: number;
  subtotal: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};

export function AccountView() {
  const { data: session, status } = useSession();
  const navigate = useStore((s) => s.navigate);
  const openWishlistDrawer = useStore((s) => s.openWishlistDrawer);
  const wishlistCount = useStore((s) => s.wishlist.length);
  const cart = useStore((s) => s.cart);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/account/orders", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { orders: [] }))
        .then((data) => setOrders(data.orders ?? []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoaded(true));
    }
  }, [status, session]);

  // Derive loading from auth status + fetch completion (no setState in effect)
  const loading = status === "loading" || (status === "authenticated" && !ordersLoaded);

  // Redirect to login if unauthenticated
  if (status === "loading") {
    return (
      <div className="pt-20">
        <div className="mx-auto w-full max-w-md px-5 py-24 text-center">
          <span className="material-symbols-outlined text-[40px] text-outline animate-spin">
            progress_activity
          </span>
          <p className="mt-4 font-[var(--font-body)] text-[15px] text-secondary">
            Loading your account…
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="pt-20">
        <PageHeader
          eyebrow="Account"
          title="Please sign in."
          intro="You need to be signed in to view your account."
        />
        <div className="mx-auto w-full max-w-md px-5 py-12 text-center">
          <button
            onClick={() => navigate({ view: "login" })}
            className="bg-primary px-10 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-primary hover:bg-deep-charcoal"
          >
            Sign In
          </button>
          <div className="mt-4">
            <button
              onClick={() => navigate({ view: "signup" })}
              className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary hover:text-primary"
            >
              Create an account →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItems = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const onLogout = () => {
    signOut({ redirect: false });
    toast({ title: "Signed out", description: "See you soon!" });
    navigate({ view: "home" });
  };

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="My Account"
        title={`Hello, ${user?.name ?? "there"}.`}
        intro="Manage your orders, wishlist, and account preferences."
      />

      {/* Stats */}
      <section className="border-b border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-8 lg:px-16">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { value: String(orders.length), label: "Orders", icon: "receipt_long" },
              { value: String(totalItems), label: "Items bought", icon: "shopping_bag" },
              { value: formatINRFromRupees(totalSpent), label: "Total spent", icon: "payments" },
              { value: String(wishlistCount), label: "Wishlist items", icon: "favorite" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    {s.icon}
                  </span>
                </span>
                <div>
                  <div className="font-[var(--font-display)] text-[20px] font-medium text-primary">
                    {s.value}
                  </div>
                  <div className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left: profile + actions */}
          <div className="lg:col-span-1">
            <div className="border border-brushed-silver bg-canvas-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-[var(--font-display)] text-[18px] font-semibold text-on-primary">
                  {(user?.name ?? "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-[var(--font-display)] text-[16px] font-medium text-primary">
                    {user?.name}
                  </p>
                  <p className="truncate font-[var(--font-body)] text-[13px] text-secondary">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={openWishlistDrawer}
                  className="flex w-full items-center justify-between border border-brushed-silver px-4 py-3 text-left font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:bg-surface-container-low"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      favorite
                    </span>
                    Wishlist
                  </span>
                  <span className="text-secondary">{wishlistCount}</span>
                </button>
                <button
                  onClick={() => navigate({ view: "cart" })}
                  className="flex w-full items-center justify-between border border-brushed-silver px-4 py-3 text-left font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:bg-surface-container-low"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      shopping_bag
                    </span>
                    Cart
                  </span>
                  <span className="text-secondary">{cart?.itemCount ?? 0}</span>
                </button>
                <button
                  onClick={() => navigate({ view: "faq" })}
                  className="flex w-full items-center justify-between border border-brushed-silver px-4 py-3 text-left font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:bg-surface-container-low"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      help
                    </span>
                    Help & FAQ
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    arrow_forward
                  </span>
                </button>
              </div>

              <button
                onClick={onLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 border border-error px-4 py-3 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-error transition-colors hover:bg-error hover:text-on-dark"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Right: order history */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 font-[var(--font-display)] text-[22px] font-medium tracking-tight text-primary">
              Order History
            </h2>

            {loading ? (
              <div className="border border-brushed-silver bg-canvas-white p-12 text-center">
                <span className="material-symbols-outlined text-[32px] text-outline animate-spin">
                  progress_activity
                </span>
                <p className="mt-3 font-[var(--font-body)] text-[14px] text-secondary">
                  Loading your orders…
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="border border-dashed border-brushed-silver p-12 text-center">
                <span className="material-symbols-outlined text-[48px] text-outline">
                  receipt_long
                </span>
                <p className="mt-4 font-[var(--font-display)] text-[18px] font-medium text-primary">
                  No orders yet
                </p>
                <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
                  When you place an order, it&apos;ll show up here.
                </p>
                <button
                  onClick={() => navigate({ view: "collection" })}
                  className="mt-6 bg-primary px-8 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-primary hover:bg-deep-charcoal"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <Reveal
                    key={order.orderId}
                    delay={Math.min(i, 5) * 50}
                    className="border border-brushed-silver bg-canvas-white p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brushed-silver pb-4">
                      <div>
                        <p className="font-[var(--font-display)] text-[16px] font-medium text-primary">
                          {order.orderId}
                        </p>
                        <p className="font-[var(--font-body)] text-[12px] text-secondary">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-3 py-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold",
                            order.status === "CONFIRMED"
                              ? "bg-success/15 text-success"
                              : "bg-surface-container text-secondary",
                          )}
                        >
                          {order.status}
                        </span>
                        <span className="font-[var(--font-display)] text-[18px] font-medium text-primary">
                          {formatINRFromRupees(order.total)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="h-10 w-10 shrink-0 overflow-hidden border border-brushed-silver bg-surface-container-low"
                          >
                            <img
                              src={`/generated/${item.slug}.png`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary">
                              {item.name}
                            </p>
                            <p className="font-[var(--font-body)] text-[12px] text-secondary">
                              {item.colorName} · Qty {item.quantity}
                            </p>
                          </div>
                          <span className="font-[var(--font-display)] text-[13px] font-medium text-primary">
                            {formatINRFromRupees(
                              (item.price * item.quantity) / 100,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
