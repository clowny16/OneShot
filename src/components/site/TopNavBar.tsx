"use client";
// TopNavBar — sticky editorial top navigation.
// Desktop: brand mark left, nav center, icons right (search, cart with count, mobile menu).
// Mobile: sheet menu.
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

const NAV_LINKS: { label: string; view: Parameters<ReturnType<typeof useStore.getState>["navigate"]>[0] }[] = [
  { label: "COLLECTIONS", view: { view: "collection" } },
  { label: "ABOUT", view: { view: "about" } },
  { label: "SUPPORT", view: { view: "faq" } },
  { label: "CONTACT", view: { view: "contact" } },
];

export function TopNavBar() {
  const navigate = useStore((s) => s.navigate);
  const cart = useStore((s) => s.cart);
  const loadCart = useStore((s) => s.loadCart);
  const openCartDrawer = useStore((s) => s.openCartDrawer);
  const openWishlistDrawer = useStore((s) => s.openWishlistDrawer);
  const openFinder = useStore((s) => s.openFinder);
  const wishlistCount = useStore((s) => s.wishlist.length);
  const view = useStore((s) => s.view);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const itemCount = cart?.itemCount ?? 0;

  const go = (target: Parameters<typeof navigate>[0]) => {
    navigate(target);
    setMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-brushed-silver bg-canvas-white/95 backdrop-blur transition-all duration-300",
        scrolled ? "h-16" : "h-20",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 lg:px-16">
        {/* Brand */}
        <button
          onClick={() => go({ view: "home" })}
          className="font-[var(--font-display)] text-[22px] font-semibold uppercase tracking-tighter text-primary transition-opacity active:opacity-70"
          aria-label="OneShot home"
        >
          OneShot
          <span className="text-leather-tan">.</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              (link.label === "COLLECTIONS" && view === "collection") ||
              (link.label === "ABOUT" && view === "about") ||
              (link.label === "SUPPORT" && (view === "faq" || view === "shipping" || view === "returns")) ||
              (link.label === "CONTACT" && view === "contact");
            return (
              <button
                key={link.label}
                onClick={() => go(link.view)}
                className={cn(
                  "font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold transition-colors duration-300 pb-1",
                  active
                    ? "border-b border-primary text-primary"
                    : "border-b border-transparent text-secondary hover:text-primary",
                )}
              >
                {link.label}
              </button>
            );
          })}
          <button
            onClick={() => {
              setMenuOpen(false);
              openFinder();
            }}
            className="group flex items-center gap-1.5 rounded-full bg-deep-charcoal px-4 py-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-canvas-white transition-all hover:bg-leather-tan"
          >
            <span className="material-symbols-outlined filled text-[16px] text-leather-tan transition-colors group-hover:text-canvas-white">
              auto_awesome
            </span>
            Find Your Earbuds
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              toast({
                title: "Search",
                description: "Browse the collection to find your fit.",
              });
              go({ view: "collection" });
            }}
            className="hidden sm:block transition-opacity active:opacity-70"
            aria-label="Search products"
          >
            <span className="material-symbols-outlined text-primary">search</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={openWishlistDrawer}
            className="relative transition-opacity active:opacity-70"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <span className="material-symbols-outlined text-primary">
              favorite
            </span>
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-error px-1 text-[10px] font-semibold text-canvas-white rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart (opens drawer) */}
          <button
            onClick={openCartDrawer}
            className="relative transition-opacity active:opacity-70"
            aria-label={`Cart with ${itemCount} items`}
          >
            <span className="material-symbols-outlined text-primary">
              shopping_bag
            </span>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-leather-tan px-1 text-[10px] font-semibold text-canvas-white rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu — render Sheet only after mount to avoid Radix
              aria-controls hydration mismatch (server/client ID divergence) */}
          {mounted ? (
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden transition-opacity active:opacity-70"
                  aria-label="Open menu"
                >
                  <span className="material-symbols-outlined text-primary">
                    menu
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-canvas-white">
                <SheetHeader>
                  <SheetTitle className="text-left font-[var(--font-display)] text-2xl uppercase tracking-tighter">
                    OneShot<span className="text-leather-tan">.</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-1">
                  {[
                    { label: "Home", v: { view: "home" } as const },
                    { label: "Collections", v: { view: "collection" } as const },
                    { label: "About Us", v: { view: "about" } as const },
                    { label: "FAQ", v: { view: "faq" } as const },
                    { label: "Shipping & Delivery", v: { view: "shipping" } as const },
                    { label: "Returns & Refunds", v: { view: "returns" } as const },
                    { label: "Contact Us", v: { view: "contact" } as const },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => go(item.v)}
                      className="border-b border-brushed-silver py-4 text-left font-[var(--font-display)] text-lg uppercase tracking-tight text-primary transition-colors hover:text-leather-tan"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => go({ view: "cart" })}
                    className="w-full bg-primary py-4 text-center font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white"
                  >
                    View Cart ({itemCount})
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <button
              className="lg:hidden transition-opacity active:opacity-70"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-primary">
                menu
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
