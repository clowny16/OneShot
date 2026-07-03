"use client";
// ProductView — detail page: gallery, color variants, price, bullets, specs,
// add-to-cart, related products.
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees, type ProductDTO } from "@/lib/types";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { Stars } from "@/components/site/Stars";
import { Reveal } from "@/components/site/Reveal";
import { WishlistButton } from "@/components/site/WishlistButton";
import { StickyBuyBar } from "@/components/site/StickyBuyBar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ProductView({ slug }: { slug: string }) {
  const products = useStore((s) => s.products);
  const addToCart = useStore((s) => s.addToCart);
  const navigate = useStore((s) => s.navigate);

  const product = useMemo(
    () => products.find((p) => p.slug === slug) ?? null,
    [products, slug],
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.slug !== product.slug)
      .slice(0, 4);
  }, [products, product]);

  const [qty, setQty] = useState(1);
  const [colorHex, setColorHex] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description",
  );

  useEffect(() => {
    if (product) {
      setColorHex(product.colorHex);
      setQty(1);
      setActiveTab("description");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-32 pb-24 text-center lg:px-16">
        <p className="font-[var(--font-display)] text-[24px] font-medium text-primary">
          Product not found.
        </p>
        <button
          onClick={() => navigate({ view: "collection" })}
          className="mt-6 border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary"
        >
          Back to collection
        </button>
      </div>
    );
  }

  const discountPct =
    product.compareAt && product.compareAt > product.price
      ? Math.round(
          ((product.compareAt - product.price) / product.compareAt) * 100,
        )
      : 0;

  const onAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product, colorHex, qty);
      toast({
        title: "Added to cart",
        description: `${qty} × ${product.name}`,
      });
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    setAdding(true);
    try {
      await addToCart(product, colorHex, qty);
      navigate({ view: "checkout" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-2 px-5 py-4 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary lg:px-16">
          <button
            onClick={() => navigate({ view: "home" })}
            className="hover:text-primary"
          >
            Home
          </button>
          <span className="text-outline">/</span>
          <button
            onClick={() => navigate({ view: "collection" })}
            className="hover:text-primary"
          >
            Collection
          </button>
          <span className="text-outline">/</span>
          <span className="text-primary">{product.name}</span>
        </div>
      </div>

      {/* Main product */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <Reveal>
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden border border-brushed-silver bg-surface-container-low">
                <ProductImage
                  imageKey={product.imageKey}
                  alt={product.title}
                  className="h-full w-full border-0"
                  imgClassName="transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square overflow-hidden border bg-surface-container-low",
                      i === 0 ? "border-primary" : "border-brushed-silver",
                    )}
                  >
                    <ProductImage
                      imageKey={product.imageKey}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="h-full w-full border-0"
                      imgClassName={cn(
                        "object-cover opacity-60",
                        i === 0 && "opacity-100",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={120}>
            <div>
              {product.badge && (
                <span className="mb-3 inline-block bg-primary px-3 py-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-on-dark">
                  {product.badge}
                </span>
              )}
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
                  {product.name}
                </h1>
                <WishlistButton
                  slug={product.slug}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brushed-silver text-secondary hover:border-error hover:text-error"
                  size={22}
                />
              </div>
              <p className="mt-2 font-[var(--font-body)] text-[17px] text-secondary">
                {product.tagline}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Stars rating={product.rating} size={16} />
                <span className="font-[var(--font-label)] text-[12px] uppercase tracking-[0.05em] font-semibold text-secondary">
                  {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>

              <div className="mt-6 flex items-end gap-3">
                <span className="font-[var(--font-display)] text-[36px] font-medium leading-none text-primary">
                  {formatINRFromRupees(product.price)}
                </span>
                {product.compareAt && product.compareAt > product.price && (
                  <>
                    <span className="mb-1 font-[var(--font-body)] text-[18px] text-outline line-through">
                      {formatINRFromRupees(product.compareAt)}
                    </span>
                    <span className="mb-1 bg-leather-tan px-2 py-0.5 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-on-dark">
                      Save {discountPct}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                Inclusive of all taxes
              </p>

              {/* Color */}
              <div className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary">
                    Colour:
                  </span>
                  <span className="font-[var(--font-body)] text-[14px] text-secondary">
                    {product.colorName}
                  </span>
                </div>
                <div className="flex gap-3">
                  <ColorOption
                    hex={product.colorHex}
                    label={product.colorName}
                    selected={colorHex === product.colorHex}
                    onClick={() => setColorHex(product.colorHex)}
                  />
                  {/* Offer alternate shades as a visual variant selector */}
                  {alternateShades(product).map((s) => (
                    <ColorOption
                      key={s.hex}
                      hex={s.hex}
                      label={s.label}
                      selected={colorHex === s.hex}
                      onClick={() => setColorHex(s.hex)}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity + actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center border border-brushed-silver">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      remove
                    </span>
                  </button>
                  <span className="w-12 text-center font-[var(--font-display)] text-[16px] font-medium">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="px-4 py-3 text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                    disabled={qty >= 10}
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                  </button>
                </div>

                <button
                  onClick={onAddToCart}
                  disabled={adding || !product.inStock}
                  className="flex-1 bg-primary px-8 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark transition-all hover:bg-deep-charcoal disabled:opacity-50"
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              <button
                onClick={buyNow}
                disabled={adding || !product.inStock}
                className="mt-3 w-full border border-primary px-8 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary transition-all hover:bg-primary hover:text-on-dark disabled:opacity-50"
              >
                Buy It Now
              </button>

              {!product.inStock && (
                <p className="mt-3 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-error">
                  Currently out of stock
                </p>
              )}

              {/* Quick bullets */}
              <ul className="mt-8 space-y-3 border-t border-brushed-silver pt-6">
                {product.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-[var(--font-body)] text-[15px] text-on-surface"
                  >
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-leather-tan">
                      check_circle
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-brushed-silver pt-6">
                {[
                  { icon: "local_shipping", label: "Free Shipping" },
                  { icon: "swap_horiz", label: "7-Day Returns" },
                  { icon: "verified_user", label: "1-Yr Warranty" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <span className="material-symbols-outlined text-[24px] text-primary">
                      {b.icon}
                    </span>
                    <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tabs: description / specs / reviews */}
      <section className="border-t border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
          <div className="flex gap-8 border-b border-brushed-silver">
            {(
              [
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${product.reviewCount.toLocaleString("en-IN")})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "-mb-px border-b-2 pb-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold transition-colors",
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-secondary hover:text-primary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-[var(--font-display)] text-[22px] font-medium text-primary">
                    About {product.name}
                  </h3>
                  <p className="font-[var(--font-body)] text-[16px] leading-relaxed text-on-surface-variant">
                    {product.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {product.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 font-[var(--font-body)] text-[15px] text-primary"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-leather-tan" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-[var(--font-display)] text-[22px] font-medium text-primary">
                    Highlights
                  </h3>
                  {product.bullets.slice(0, 4).map((b, i) => (
                    <div
                      key={i}
                      className="border border-brushed-silver bg-canvas-white p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-leather-tan">
                          bolt
                        </span>
                        <p className="font-[var(--font-body)] text-[15px] text-primary">
                          {b}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={i} className="border-b border-brushed-silver">
                        <td className="w-1/3 py-3 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                          {s.label}
                        </td>
                        <td className="py-3 font-[var(--font-body)] text-[15px] text-primary">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-2xl">
                <div className="flex items-center gap-6 border border-brushed-silver bg-canvas-white p-6">
                  <div className="text-center">
                    <div className="font-[var(--font-display)] text-[48px] font-medium leading-none text-primary">
                      {product.rating.toFixed(1)}
                    </div>
                    <Stars rating={product.rating} size={16} />
                    <div className="mt-1 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                      {product.reviewCount.toLocaleString("en-IN")} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        star === 5
                          ? 72
                          : star === 4
                            ? 18
                            : star === 3
                              ? 6
                              : star === 2
                                ? 3
                                : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 font-[var(--font-label)] text-[10px] uppercase tracking-[0.05em] font-semibold text-secondary">
                            {star}
                          </span>
                          <span className="material-symbols-outlined filled text-[12px] text-leather-tan">
                            star
                          </span>
                          <div className="h-1.5 flex-1 bg-surface-container-high">
                            <div
                              className="h-full bg-leather-tan"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-[var(--font-label)] text-[10px] font-semibold text-secondary">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {SAMPLE_REVIEWS.map((r, i) => (
                    <div
                      key={i}
                      className="border border-brushed-silver bg-canvas-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center bg-primary font-[var(--font-display)] text-[12px] font-semibold text-on-dark">
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary">
                              {r.name}
                            </p>
                            <Stars rating={r.rating} size={11} />
                          </div>
                        </div>
                        <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.05em] font-semibold text-outline">
                          {r.date}
                        </span>
                      </div>
                      <p className="mt-3 font-[var(--font-body)] text-[14px] leading-relaxed text-on-surface-variant">
                        {r.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-[var(--font-display)] text-[28px] font-medium leading-tight tracking-tight text-primary sm:text-[36px]">
              You may also like
            </h2>
            <button
              onClick={() => navigate({ view: "collection" })}
              className="border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary hover:text-leather-tan"
            >
              View All →
            </button>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile buy bar */}
      <StickyBuyBar product={product} />
    </div>
  );
}

function ColorOption({
  hex,
  label,
  selected,
  onClick,
}: {
  hex: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "h-9 w-9 rounded-full border-2 transition-all",
        selected
          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-canvas-white"
          : "border-brushed-silver hover:border-secondary",
      )}
      style={{ backgroundColor: hex }}
    />
  );
}

// Provide 2 alternate visual shades per product so the variant selector feels
// real, even though stock is shared. These do not change the SKU.
function alternateShades(product: ProductDTO): { hex: string; label: string }[] {
  const alternates: Record<string, { hex: string; label: string }[]> = {
    airbuds: [
      { hex: "#1a1a1a", label: "Midnight Black" },
      { hex: "#bc8552", label: "Sand Tan" },
    ],
    neopods: [
      { hex: "#f3f3f3", label: "Cloud White" },
      { hex: "#bc8552", label: "Sand Tan" },
    ],
    sonicbuds: [
      { hex: "#0e0e0e", label: "Obsidian" },
      { hex: "#8a8a8a", label: "Titanium" },
    ],
    pulsepods: [
      { hex: "#0e0e0e", label: "Black" },
      { hex: "#c89a8a", label: "Coral" },
    ],
    echobuds: [
      { hex: "#1a1a1a", label: "Black" },
      { hex: "#0e0e0e", label: "Obsidian" },
    ],
    wavepods: [
      { hex: "#0e0e0e", label: "Black" },
      { hex: "#1a1a1a", label: "Slate" },
    ],
    zenbuds: [
      { hex: "#1a1a1a", label: "Charcoal" },
      { hex: "#f3f3f3", label: "Ivory" },
    ],
    maxtune: [
      { hex: "#0e0e0e", label: "Obsidian" },
      { hex: "#1a1a1a", label: "Graphite" },
    ],
    aeropods: [
      { hex: "#1a1a1a", label: "Black" },
      { hex: "#c8c8c8", label: "Silver" },
    ],
    probeat: [
      { hex: "#2a2a2a", label: "Graphite" },
      { hex: "#8a8a8a", label: "Titanium" },
    ],
  };
  return alternates[product.slug] ?? [];
}

const SAMPLE_REVIEWS = [
  {
    name: "Arjun M.",
    rating: 5,
    date: "2 weeks ago",
    body: "Sound is clean and the fit is comfortable for long calls. Battery easily lasts the day. Great value at this price.",
  },
  {
    name: "Sneha R.",
    rating: 4,
    date: "1 month ago",
    body: "Bass is punchy without overpowering the mids. Pairing was instant on my phone. Case feels solid.",
  },
  {
    name: "Vikram P.",
    rating: 5,
    date: "1 month ago",
    body: "Using these for daily commute and gym. Connection stays stable even when phone is in my bag. Highly recommend.",
  },
];
