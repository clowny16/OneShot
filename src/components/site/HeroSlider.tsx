"use client";
// HeroSlider — full-bleed editorial hero carousel with 3 slides.
// Features: autoplay (6s, pause on hover), prev/next arrows, dot indicators,
// slide counter, progress bar, keyboard arrow nav, crossfade + slide transitions.
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { HERO_SLIDES } from "@/lib/images";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

type Slide = (typeof HERO_SLIDES)[number];

export function HeroSlider() {
  const navigate = useStore((s) => s.navigate);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    AutoPlay({ delay: AUTOPLAY_MS, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  // Track selected slide + rebuild progress animation on each selection
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Restart the CSS progress animation when the selected slide changes
  useEffect(() => {
    const node = progressRef.current;
    if (!node) return;
    node.classList.remove("run");
    // force reflow so the animation restarts
    void node.offsetWidth;
    if (!paused) node.classList.add("run");
  }, [selected, paused]);

  // Keyboard arrow navigation when the hero is in view
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section
      className="relative w-full overflow-hidden bg-deep-charcoal"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div
        ref={emblaRef}
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex">
          {HERO_SLIDES.map((slide, idx) => (
            <SlideView
              key={idx}
              slide={slide}
              index={idx}
              active={idx === selected}
              onPrimary={() => onPrimary(navigate, slide)}
              onSecondary={() => onSecondary(navigate, slide)}
            />
          ))}
        </div>
      </div>

      {/* Bottom trust strip (persists across slides) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-canvas-white/20 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-16">
          {[
            { icon: "bluetooth", label: "Bluetooth 5.3" },
            { icon: "battery_full", label: "Up to 36h Battery" },
            { icon: "verified", label: "1-Year Warranty" },
            { icon: "local_shipping", label: "Free Shipping over ₹999" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-canvas-white/90"
            >
              <span className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
              <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="group absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-canvas-white/30 bg-black/20 text-canvas-white backdrop-blur-sm transition-all hover:bg-canvas-white hover:text-primary lg:left-6"
      >
        <span className="material-symbols-outlined text-[24px]">
          arrow_back
        </span>
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="group absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-canvas-white/30 bg-black/20 text-canvas-white backdrop-blur-sm transition-all hover:bg-canvas-white hover:text-primary lg:right-6"
      >
        <span className="material-symbols-outlined text-[24px]">
          arrow_forward
        </span>
      </button>

      {/* Controls: dots + counter + progress */}
      <div className="absolute bottom-24 right-5 z-20 flex flex-col items-end gap-3 lg:bottom-28 lg:right-16">
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-display)] text-[14px] font-medium tabular-nums text-canvas-white">
            {String(selected + 1).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 transition-all duration-300",
                  i === selected
                    ? "w-8 bg-canvas-white"
                    : "w-2.5 bg-canvas-white/40 hover:bg-canvas-white/70",
                )}
              />
            ))}
          </div>
          <span className="font-[var(--font-display)] text-[14px] font-medium tabular-nums text-canvas-white/50">
            {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
        </div>
        {/* Progress bar (top of slide stack) */}
        <div className="h-0.5 w-40 overflow-hidden bg-canvas-white/20">
          <div
            ref={progressRef}
            className="h-full w-full origin-left bg-leather-tan"
            style={{
              animationName: "heroProgress",
              animationDuration: `${AUTOPLAY_MS}ms`,
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
            }}
          />
        </div>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes heroProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .heroProgress.run { animation-play-state: running; }
      `}</style>
    </section>
  );
}

function SlideView({
  slide,
  index,
  active,
  onPrimary,
  onSecondary,
}: {
  slide: Slide;
  index: number;
  active: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <div
      className="relative min-w-0 shrink-0 grow-0 basis-full"
      aria-hidden={!active}
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${HERO_SLIDES.length}`}
    >
      <div className="relative flex min-h-[600px] w-full items-center overflow-hidden sm:min-h-[680px] lg:min-h-[760px]">
        {/* Background image */}
        <img
          src={slide.src}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-out",
            active ? "scale-105" : "scale-100",
          )}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-24 lg:px-16">
          <div className="max-w-2xl">
            <span
              className={cn(
                "mb-4 block font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white/90 transition-all duration-700",
                active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {slide.eyebrow}
            </span>
            <h1
              className={cn(
                "mb-6 whitespace-pre-line font-[var(--font-display)] text-[40px] font-medium leading-[1.05] tracking-tight text-canvas-white transition-all duration-700 delay-75 sm:text-[56px] lg:text-[72px]",
                active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              {slide.title}
            </h1>
            <p
              className={cn(
                "mb-10 max-w-lg font-[var(--font-body)] text-[17px] leading-relaxed text-canvas-white/85 transition-all duration-700 delay-150 lg:text-[19px]",
                active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              {slide.body}
            </p>
            <div
              className={cn(
                "flex flex-col gap-3 transition-all duration-700 delay-300 sm:flex-row sm:gap-4",
                active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              <button
                onClick={onPrimary}
                className="bg-canvas-white px-10 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary transition-all hover:bg-leather-tan hover:text-canvas-white"
              >
                {slide.primaryCta.label}
              </button>
              <button
                onClick={onSecondary}
                className="border border-canvas-white/60 px-10 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white transition-all hover:bg-canvas-white hover:text-primary"
              >
                {slide.secondaryCta.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Resolve CTA targets to store navigate calls
function onPrimary(
  navigate: ReturnType<typeof useStore.getState>["navigate"],
  slide: Slide,
) {
  const cta = slide.primaryCta;
  if ("slug" in cta) {
    navigate({ view: "product", slug: cta.slug });
  } else if ("productType" in cta || "category" in cta) {
    navigate({
      view: "collection",
      productType: "productType" in cta ? cta.productType : undefined,
      category: "category" in cta ? cta.category : undefined,
    });
  } else {
    navigate({ view: cta.view });
  }
}

function onSecondary(
  navigate: ReturnType<typeof useStore.getState>["navigate"],
  slide: Slide,
) {
  const cta = slide.secondaryCta;
  if ("slug" in cta) {
    navigate({ view: "product", slug: cta.slug });
  } else if ("productType" in cta || "category" in cta) {
    navigate({
      view: "collection",
      productType: "productType" in cta ? cta.productType : undefined,
      category: "category" in cta ? cta.category : undefined,
    });
  } else {
    navigate({ view: cta.view });
  }
}
