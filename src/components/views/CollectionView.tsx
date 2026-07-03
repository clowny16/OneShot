"use client";
// CollectionView — filterable product grid with two-tier filtering.
// Primary filter = productType (Earbuds, Wired Earphones, Headphones, Speakers,
// Gaming, Accessories). When productType === "Earbuds", a secondary row of
// use-case sub-categories (Everyday, Bass, Sports, etc.) appears.
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

const PRODUCT_TYPES = [
  "All",
  "Earbuds",
  "Wired Earphones",
  "Wired Headphones",
  "Wireless Headphones",
  "Portable Speakers",
  "Premium Speakers",
  "Gaming Audio",
  "Audio Accessories",
] as const;

const EARBUDS_SUBCATS = [
  "All",
  "Everyday",
  "Bass",
  "Sports",
  "Calling",
  "Focus",
  "Premium",
] as const;

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export function CollectionView() {
  const products = useStore((s) => s.products);
  const storeProductType = useStore((s) => s.collectionProductType);
  const storeCategory = useStore((s) => s.collectionCategory);
  const navigate = useStore((s) => s.navigate);

  const [activeType, setActiveType] = useState<string>(
    storeProductType ?? "All",
  );
  const [activeSub, setActiveSub] = useState<string>(
    storeCategory ?? "All",
  );
  const [sort, setSort] = useState<SortId>("featured");
  const [search, setSearch] = useState("");

  // Sync local filters with the store values when navigating from footer/nav.
  const [prevKey, setPrevKey] = useState(`${storeProductType}|${storeCategory}`);
  const newKey = `${storeProductType}|${storeCategory}`;
  if (newKey !== prevKey) {
    setPrevKey(newKey);
    setActiveType(storeProductType ?? "All");
    setActiveSub(storeCategory ?? "All");
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeType !== "All") {
      list = list.filter((p) => p.productType === activeType);
    }
    // Secondary sub-category filter only applies within Earbuds
    if (activeType === "Earbuds" && activeSub !== "All") {
      list = list.filter((p) => p.category === activeSub);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured: keep a curated order — earbuds first by their order, then
        // other types by price ascending.
        const order = [
          "probeat",
          "aeropods",
          "maxtune",
          "echobuds",
          "zenbuds",
          "wavepods",
          "pulsepods",
          "sonicbuds",
          "neopods",
          "airbuds",
        ];
        list.sort((a, b) => {
          const ia = order.indexOf(a.slug);
          const ib = order.indexOf(b.slug);
          if (ia !== -1 && ib !== -1) return ia - ib;
          if (ia !== -1) return -1;
          if (ib !== -1) return 1;
          return a.price - b.price;
        });
    }
    return list;
  }, [products, activeType, activeSub, sort, search]);

  // Show the earbuds sub-category row only when Earbuds is the active type.
  const showSubcats = activeType === "Earbuds";

  return (
    <div className="pt-20">
      {/* Banner */}
      <section className="relative flex min-h-[280px] items-end overflow-hidden lg:min-h-[340px]">
        <img
          src={IMAGES.collectionBanner}
          alt="Person wearing wireless earbuds in an urban setting"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 lg:px-16 lg:pb-16">
          <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-on-dark/80">
            The Collection
          </span>
          <h1 className="font-[var(--font-display)] text-[36px] font-medium leading-[1.05] tracking-tight text-on-dark sm:text-[52px]">
            All Audio
          </h1>
          <p className="mt-3 max-w-xl font-[var(--font-body)] text-[16px] text-on-dark/80">
            {products.length} products across earbuds, headphones, speakers,
            gaming, and accessories. Free shipping across India on orders over
            ₹999.
          </p>
        </div>
      </section>

      {/* Filter bar — sticks at top-16 (64px) to match the scrolled nav height
          (nav shrinks from h-20 to h-16 on scroll, so by the time the filter
          reaches the top the nav is always 64px) */}
      <section className="sticky top-16 z-30 border-b border-brushed-silver bg-canvas-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-3 lg:px-16">
          {/* Primary: product type chips */}
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveType(type);
                  setActiveSub("All");
                }}
                className={cn(
                  "shrink-0 px-4 py-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold transition-colors",
                  activeType === type
                    ? "bg-primary text-on-dark"
                    : "text-secondary hover:text-primary",
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Secondary: earbuds sub-categories (only when Earbuds selected) */}
          {showSubcats && (
            <div className="no-scrollbar mt-2 flex gap-1 overflow-x-auto border-t border-brushed-silver pt-2">
              {EARBUDS_SUBCATS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold transition-colors",
                    activeSub === sub
                      ? "border-b-2 border-leather-tan text-primary"
                      : "text-secondary hover:text-primary",
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Search + sort row */}
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex-1 lg:max-w-xs">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="w-full border border-brushed-silver bg-surface-container-low py-2 pl-9 pr-3 font-[var(--font-body)] text-[14px] text-primary placeholder:text-outline focus:bg-canvas-white focus:outline-none"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="border border-brushed-silver bg-surface-container-low px-3 py-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary focus:outline-none"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
          {(activeType !== "All" || activeSub !== "All" || search) && (
            <button
              onClick={() => {
                setActiveType("All");
                setActiveSub("All");
                setSearch("");
              }}
              className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-brushed-silver py-24 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline">
              search_off
            </span>
            <p className="mt-4 font-[var(--font-display)] text-[20px] font-medium text-primary">
              No products match your filters.
            </p>
            <button
              onClick={() => {
                setActiveType("All");
                setActiveSub("All");
                setSearch("");
              }}
              className="mt-4 border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-brushed-silver pt-10 text-center">
          <p className="font-[var(--font-body)] text-[15px] text-secondary">
            Not sure which earbuds fit your routine?
          </p>
          <button
            onClick={() => navigate({ view: "faq" })}
            className="mt-3 border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary hover:text-leather-tan"
          >
            Read the buying guide →
          </button>
        </div>
      </section>
    </div>
  );
}
