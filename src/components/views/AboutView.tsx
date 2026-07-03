"use client";
// AboutView — brand story, values, stats, timeline, team-ish.
import { useStore } from "@/lib/store";
import { IMAGES } from "@/lib/images";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export function AboutView() {
  const navigate = useStore((s) => s.navigate);

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Our Story"
        title={
          <>
            Sound, made
            <br />
            simple.
          </>
        }
        intro="OneShot started with a simple idea: great wireless earbuds shouldn't cost a month's salary. We design, tune, and ship earbuds that fit real Indian routines — the commute, the workout, the call, the quiet hour after."
      />

      {/* Hero image band */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <Reveal className="aspect-[16/9] overflow-hidden border border-brushed-silver">
          <img
            src={IMAGES.about}
            alt="OneShot design studio with earbuds prototypes on a workbench"
            className="h-full w-full object-cover"
          />
        </Reveal>
      </section>

      {/* Mission */}
      <section className="border-y border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
                Our Mission
              </span>
              <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
                Honest audio, fair price.
              </h2>
            </Reveal>
            <Reveal delay={120} className="space-y-5 font-[var(--font-body)] text-[16px] leading-relaxed text-on-surface-variant">
              <p>
                The earbuds market is full of over-promises. Megapixel drivers,
                neon specs, and prices that don't match the build. We took a
                different approach.
              </p>
              <p>
                Every OneShot model is tuned by ear, tested across devices, and
                priced so it makes sense for daily use. No inflated MRP, no
                marketing theatre — just clean sound that lasts.
              </p>
              <p>
                We sell direct to you online, which means we can put better
                components into the product instead of shelf space.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
        <Reveal className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { value: "10+", label: "Models shipped" },
            { value: "1L+", label: "Happy listeners" },
            { value: "4.5★", label: "Average rating" },
            { value: "1yr", label: "Warranty on every unit" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-[var(--font-display)] text-[40px] font-medium leading-none text-primary sm:text-[56px]">
                {s.value}
              </div>
              <div className="mt-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Values */}
      <section className="bg-deep-charcoal py-16 text-on-dark lg:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-16">
          <Reveal className="mb-12">
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
              What we stand for
            </span>
            <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight sm:text-[44px]">
              Three commitments.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: "tune",
                title: "Tuned by ear",
                body: "Every model goes through real-world listening tests — not just frequency response charts. We tune for voices, bass, and long sessions.",
              },
              {
                icon: "savings",
                title: "Fair pricing",
                body: "We price for what's inside. No inflated MRPs, no fake discounts. The price you see reflects the product you get.",
              },
              {
                icon: "support_agent",
                title: "Real support",
                body: "Talk to a real person, not a bot. Our support team answers within one business day, every day.",
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="border border-gunmetal p-8">
                <span className="material-symbols-outlined text-[32px] text-leather-tan">
                  {v.icon}
                </span>
                <h3 className="mt-4 font-[var(--font-display)] text-[22px] font-medium">
                  {v.title}
                </h3>
                <p className="mt-3 font-[var(--font-body)] text-[15px] leading-relaxed text-on-dark/70">
                  {v.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
        <Reveal className="mb-12">
          <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
            How we got here
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[44px]">
            A short timeline.
          </h2>
        </Reveal>
        <div className="space-y-0">
          {[
            {
              year: "2021",
              title: "Started in a garage",
              body: "Two engineers, one oscilloscope, and a stack of driver samples. We built the first OneShot prototype on weekends.",
            },
            {
              year: "2022",
              title: "First 1,000 listeners",
              body: "AirBuds launched at ₹999. Word of mouth carried us past our first thousand orders in three months.",
            },
            {
              year: "2023",
              title: "Ten models deep",
              body: "From bass-tuned SonicBuds to ANC ProBeat — we covered every listening style without inflating the lineup.",
            },
            {
              year: "Today",
              title: "Direct to you",
              body: "We ship across India, support every order in-house, and keep tuning. The next drop is always in the works.",
            },
          ].map((t, i) => (
            <Reveal
              key={t.year}
              delay={i * 80}
              className="grid grid-cols-1 gap-4 border-t border-brushed-silver py-8 sm:grid-cols-[120px_1fr] sm:gap-8"
            >
              <div className="font-[var(--font-display)] text-[24px] font-medium text-leather-tan">
                {t.year}
              </div>
              <div>
                <h3 className="font-[var(--font-display)] text-[22px] font-medium text-primary">
                  {t.title}
                </h3>
                <p className="mt-2 font-[var(--font-body)] text-[16px] leading-relaxed text-secondary">
                  {t.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 text-center lg:px-16 lg:py-20">
          <Reveal className="mx-auto max-w-xl">
            <h2 className="font-[var(--font-display)] text-[28px] font-medium tracking-tight text-primary sm:text-[36px]">
              Hear the difference.
            </h2>
            <p className="mt-3 font-[var(--font-body)] text-[16px] text-secondary">
              Browse the collection and find the earbuds that fit your routine.
            </p>
            <button
              onClick={() => navigate({ view: "collection" })}
              className="mt-6 bg-primary px-10 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark hover:bg-deep-charcoal"
            >
              Shop the Collection
            </button>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-5 text-center lg:px-16">
          <Reveal className="mx-auto max-w-xl">
            <h2 className="mb-4 font-[var(--font-display)] text-[28px] font-medium tracking-tight text-primary sm:text-[36px]">
              The Journal
            </h2>
            <p className="mb-8 font-[var(--font-body)] text-[16px] text-secondary">
              New drops, sound tips, and the occasional studio note.
            </p>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
