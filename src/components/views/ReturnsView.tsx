"use client";
// ReturnsView — return policy, eligibility, process, warranty terms.
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { useStore } from "@/lib/store";

export function ReturnsView() {
  const navigate = useStore((s) => s.navigate);

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Returns & Refunds"
        title={
          <>
            7-day returns.
            <br />
            1-year warranty.
          </>
        }
        intro="If your earbuds don't fit, don't sound right, or arrive damaged, we'll make it right. Here's exactly how returns, refunds, and warranties work."
      />

      {/* Quick summary */}
      <section className="border-b border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-16">
          <Reveal className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { value: "7 days", label: "Return window" },
              { value: "1 year", label: "Warranty period" },
              { value: "3–5 days", label: "Refund processing" },
              { value: "₹0", label: "Return shipping (defective)" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-[var(--font-display)] text-[28px] font-medium leading-none text-primary sm:text-[36px]">
                  {s.value}
                </div>
                <div className="mt-2 font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Eligibility + Process */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Eligibility */}
          <Reveal>
            <h2 className="font-[var(--font-display)] text-[28px] font-medium leading-tight tracking-tight text-primary sm:text-[36px]">
              What's eligible.
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                {
                  ok: true,
                  t: "Unused or lightly used within 7 days of delivery",
                },
                { ok: true, t: "Defective or damaged on arrival" },
                { ok: true, t: "Wrong model or colour shipped" },
                { ok: true, t: "Missing accessories in a sealed box" },
                { ok: false, t: "Used beyond a trial fit (more than 7 days)" },
                { ok: false, t: "Physical damage caused by the user" },
                { ok: false, t: "Water damage beyond rated IPX level" },
                { ok: false, t: "Lost or stolen earbuds" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b border-brushed-silver pb-4 font-[var(--font-body)] text-[15px] text-primary"
                >
                  <span
                    className={`material-symbols-outlined mt-0.5 text-[20px] ${item.ok ? "text-success" : "text-error"}`}
                  >
                    {item.ok ? "check_circle" : "cancel"}
                  </span>
                  {item.t}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Process */}
          <Reveal delay={120}>
            <h2 className="font-[var(--font-display)] text-[28px] font-medium leading-tight tracking-tight text-primary sm:text-[36px]">
              How to return.
            </h2>
            <ol className="mt-6 space-y-6">
              {[
                {
                  step: "1",
                  title: "Email support",
                  body: "Write to support@oneshot.in with your order ID and the reason for return. We'll reply within one business day.",
                },
                {
                  step: "2",
                  title: "Get a return authorisation",
                  body: "If eligible, we'll share a return authorisation and a courier pickup slot. defective units get free pickup; change-of-mind returns carry a ₹49 pickup fee.",
                },
                {
                  step: "3",
                  title: "Pack and hand over",
                  body: "Pack the earbuds with all original accessories in the box. Hand them to the courier at your scheduled pickup.",
                },
                {
                  step: "4",
                  title: "Inspection and refund",
                  body: "We inspect within 48 hours of receiving the return. Refunds hit your original payment method in 3–5 business days.",
                },
              ].map((p) => (
                <li key={p.step} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary font-[var(--font-display)] text-[15px] font-medium text-primary">
                    {p.step}
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-[17px] font-medium text-primary">
                      {p.title}
                    </p>
                    <p className="mt-1 font-[var(--font-body)] text-[14px] leading-relaxed text-secondary">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Warranty */}
      <section className="border-y border-brushed-silver bg-deep-charcoal py-16 text-canvas-white lg:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
                Warranty
              </span>
              <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight sm:text-[44px]">
                1-year warranty on every unit.
              </h2>
              <p className="mt-5 max-w-md font-[var(--font-body)] text-[16px] leading-relaxed text-canvas-white/70">
                Every OneShot product is covered against manufacturing defects
                for one year from the date of delivery. If something fails on
                its own, we fix it or replace it.
              </p>
              <button
                onClick={() => navigate({ view: "contact" })}
                className="mt-6 bg-canvas-white px-8 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary hover:bg-leather-tan hover:text-canvas-white"
              >
                Claim warranty
              </button>
            </Reveal>
            <Reveal delay={120} className="space-y-6">
              <div className="border border-gunmetal p-6">
                <h3 className="font-[var(--font-display)] text-[18px] font-medium">
                  Covered
                </h3>
                <ul className="mt-3 space-y-2 font-[var(--font-body)] text-[14px] text-canvas-white/70">
                  {[
                    "Driver or audio failure",
                    "Charging port defects",
                    "Bluetooth connectivity faults",
                    "Battery degradation beyond spec",
                    "Button or touch control failure",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="material-symbols-outlined text-[16px] text-leather-tan">
                        check
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-gunmetal p-6">
                <h3 className="font-[var(--font-display)] text-[18px] font-medium">
                  Not covered
                </h3>
                <ul className="mt-3 space-y-2 font-[var(--font-body)] text-[14px] text-canvas-white/70">
                  {[
                    "Physical damage, drops, or cracks",
                    "Water damage beyond rated IPX level",
                    "Normal wear and tear on cables and tips",
                    "Lost or stolen units",
                    "Unauthorized repairs or modifications",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="material-symbols-outlined text-[16px] text-error">
                        close
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Refund methods */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
        <Reveal className="mb-10">
          <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
            Refunds
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
            How refunds work.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: "credit_card",
              title: "Original payment method",
              body: "Card / UPI / netbanking refunds reach your source account in 3–5 business days after inspection.",
            },
            {
              icon: "redeem",
              title: "Store credit",
              body: "Choose instant store credit (issued within 24 hours) and get an extra 5% on top of your refund value.",
            },
            {
              icon: "swap_horiz",
              title: "Exchange",
              body: "Swap for a different model or colour. We'll adjust the difference either way — no restocking fee.",
            },
          ].map((r, i) => (
            <Reveal
              key={r.title}
              delay={i * 80}
              className="border border-brushed-silver bg-canvas-white p-6"
            >
              <span className="material-symbols-outlined text-[28px] text-leather-tan">
                {r.icon}
              </span>
              <h3 className="mt-3 font-[var(--font-display)] text-[18px] font-medium text-primary">
                {r.title}
              </h3>
              <p className="mt-2 font-[var(--font-body)] text-[14px] leading-relaxed text-secondary">
                {r.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-12 text-center lg:px-16 lg:py-16">
          <Reveal>
            <p className="font-[var(--font-body)] text-[16px] text-secondary">
              Need to start a return or warranty claim?
            </p>
            <button
              onClick={() => navigate({ view: "contact" })}
              className="mt-4 bg-primary px-10 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal"
            >
              Contact Support
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
