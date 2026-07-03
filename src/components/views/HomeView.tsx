"use client";
// HomeView — editorial landing page.
// Sections: Deal banner, Hero slider, Find-Your-Earbuds CTA, Curated Sound
// (asymmetric product grid), Built for Everyday (dark philosophy), Feature
// bento, Best Sellers, Recently viewed, Trust strip, Newsletter.
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { IMAGES } from "@/lib/images";
import { formatINRFromRupees } from "@/lib/types";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ProductImage } from "@/components/site/ProductImage";
import { HeroSlider } from "@/components/site/HeroSlider";
import { DealBanner } from "@/components/site/DealBanner";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";

export function HomeView() {
  const products = useStore((s) => s.products);
  const navigate = useStore((s) => s.navigate);
  const openFinder = useStore((s) => s.openFinder);

  // Pick 4 products for the editorial grid in a curated order.
  const featured = useMemo(() => {
    const order = ["probeat", "airbuds", "echobuds", "maxtune"];
    return order
      .map((slug) => products.find((p) => p.slug === slug))
      .filter(Boolean) as typeof products;
  }, [products]);

  return (
    <div>
      {/* ===== Deal banner ===== */}
      <DealBanner />

      {/* ===== Hero Slider ===== */}
      <HeroSlider />

      {/* ===== Find Your Earbuds CTA ===== */}
      <section className="border-b border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-6 lg:px-16">
          <button
            onClick={openFinder}
            className="group flex w-full flex-col items-start justify-between gap-4 text-left sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-canvas-white">
                <span className="material-symbols-outlined text-[22px]">
                  auto_awesome
                </span>
              </span>
              <div>
                <p className="font-[var(--font-display)] text-[18px] font-medium text-primary sm:text-[20px]">
                  Not sure which earbuds fit you?
                </p>
                <p className="font-[var(--font-body)] text-[14px] text-secondary">
                  Take the 30-second quiz — we'll match you to the right pair.
                </p>
              </div>
            </div>
            <span className="flex items-center gap-2 bg-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white transition-all group-hover:bg-deep-charcoal">
              Find Your Earbuds
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </span>
          </button>
        </div>
      </section>

      {/* ===== Curated Sound (Editorial Grid) ===== */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-20 lg:px-16 lg:py-28">
        <Reveal className="mb-12 flex items-end justify-between gap-6 lg:mb-16">
          <div>
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
              The Collection
            </span>
            <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[44px]">
              Curated Sound
            </h2>
          </div>
          <button
            onClick={() => navigate({ view: "collection" })}
            className="hidden shrink-0 border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:text-leather-tan sm:block"
          >
            View All Pieces →
          </button>
        </Reveal>

        {featured.length >= 4 ? (
          <div className="editorial-grid">
            {/* Large feature card */}
            <Reveal className="col-span-12 lg:col-span-8">
              <ProductCard
                product={featured[0]}
                variant="wide"
                priority
              />
            </Reveal>
            {/* Small 1 */}
            <Reveal
              className="col-span-12 mt-0 lg:col-span-4 lg:mt-24"
              delay={80}
            >
              <ProductCard product={featured[1]} />
            </Reveal>
            {/* Small 2 */}
            <Reveal className="col-span-12 lg:col-span-4" delay={120}>
              <ProductCard product={featured[2]} />
            </Reveal>
            {/* Large secondary */}
            <Reveal className="col-span-12 lg:col-span-8" delay={160}>
              <ProductCard product={featured[3]} variant="wide" />
            </Reveal>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-10 sm:hidden">
          <button
            onClick={() => navigate({ view: "collection" })}
            className="border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary"
          >
            View All Pieces →
          </button>
        </div>
      </section>

      {/* ===== Built for Everyday (Dark Philosophy) ===== */}
      <section className="bg-deep-charcoal py-20 text-canvas-white lg:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="mb-6 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
                Our Philosophy
              </span>
              <h2 className="mb-8 font-[var(--font-display)] text-[36px] font-medium leading-[1.1] tracking-tight uppercase sm:text-[48px]">
                Built for the
                <br />
                Everyday.
              </h2>
              <div className="max-w-md space-y-5 font-[var(--font-body)] text-[17px] leading-relaxed text-canvas-white/75">
                <p>
                  We make earbuds that fit real life. Lightweight shells, stable
                  Bluetooth, and tuned drivers — for the commute, the gym, the
                  call, and the quiet hour after.
                </p>
                <p>
                  No inflated specs. No marketing theatre. Just clean sound,
                  honest materials, and a battery that lasts the day.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap gap-10 lg:gap-12">
                <Stat value="36h" label="Total Battery" />
                <Stat value="5.3" label="Bluetooth" />
                <Stat value="1yr" label="Warranty" />
              </div>
            </Reveal>

            <Reveal delay={120} className="relative">
              <div className="aspect-[4/5] overflow-hidden border border-gunmetal">
                <img
                  src={IMAGES.philosophy}
                  alt="Close-up of earbuds being assembled, highlighting craftsmanship and precision"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 hidden w-44 h-44 border border-leather-tan/30 bg-deep-charcoal p-4 lg:block">
                <div className="flex h-full w-full items-center justify-center border border-leather-tan text-center">
                  <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-leather-tan leading-relaxed">
                    Lab Tested
                    <br />
                    10,000 Hours
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Feature Bento ===== */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-20 lg:px-16 lg:py-28">
        <Reveal className="mb-12">
          <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
            Why OneShot
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[44px]">
            Three things we get right.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <BentoCard
            image={IMAGES.bentoAcoustic}
            title="Acoustic Purity"
            body="Tuned drivers deliver a balanced, natural soundstage across every genre — from podcasts to bass-heavy sets."
            cta="See Specs"
            onClick={() => navigate({ view: "collection" })}
          />
          <BentoCard
            image={IMAGES.bentoMaterials}
            title="Honest Materials"
            body="Lightweight polycarbonate shells, soft silicone tips, and braided cables. Built for daily use, not the drawer."
            cta="Material Origin"
            onClick={() => navigate({ view: "about" })}
          />
          <BentoCard
            image={IMAGES.bentoApp}
            title="All-Day Battery"
            body="Up to 36 hours total with the case. USB-C fast charge gives you an hour of playback in 10 minutes."
            cta="Compare Models"
            onClick={() => navigate({ view: "collection" })}
          />
        </div>
      </section>

      {/* ===== Best Sellers strip ===== */}
      <section className="border-y border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-[var(--font-display)] text-[28px] font-medium leading-tight tracking-tight text-primary sm:text-[36px]">
              Best Sellers
            </h2>
            <button
              onClick={() => navigate({ view: "collection" })}
              className="border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:text-leather-tan"
            >
              View All →
            </button>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== Recently viewed ===== */}
      <RecentlyViewed />

      {/* ===== Newsletter / Journal ===== */}
      <section className="border-b border-brushed-silver py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 text-center lg:px-16">
          <Reveal className="mx-auto max-w-xl">
            <h2 className="mb-4 font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[44px]">
              The Journal
            </h2>
            <p className="mb-10 font-[var(--font-body)] text-[17px] text-secondary">
              Occasional updates on new drops, sound tips, and studio sessions.
              No clutter.
            </p>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="mb-1 font-[var(--font-display)] text-[32px] font-medium leading-none text-canvas-white">
        {value}
      </p>
      <p className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-canvas-white/60">
        {label}
      </p>
    </div>
  );
}

function BentoCard({
  image,
  title,
  body,
  cta,
  onClick,
}: {
  image: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <Reveal className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden border border-brushed-silver bg-surface-container-low p-8">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative z-10 text-canvas-white">
        <h4 className="mb-2 font-[var(--font-display)] text-[24px] font-medium leading-tight">
          {title}
        </h4>
        <p className="mb-6 line-clamp-2 font-[var(--font-body)] text-[15px] leading-relaxed text-canvas-white/80">
          {body}
        </p>
        <button
          onClick={onClick}
          className="flex items-center gap-2 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold transition-all group-hover:gap-4"
        >
          {cta}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>
    </Reveal>
  );
}
