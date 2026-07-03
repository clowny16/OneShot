"use client";
// ShippingView — shipping zones, timelines, charges, tracking info.
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { useStore } from "@/lib/store";

const ZONES = [
  {
    zone: "Metro cities",
    cities: "Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata",
    days: "2–3 business days",
    charge: "Free over ₹999 · ₹49 below",
  },
  {
    zone: "Tier-1 cities",
    cities: "Pune, Ahmedabad, Jaipur, Kochi, Chandigarh, Lucknow",
    days: "3–4 business days",
    charge: "Free over ₹999 · ₹49 below",
  },
  {
    zone: "Rest of India",
    cities: "All other serviceable pincodes",
    days: "4–6 business days",
    charge: "Free over ₹999 · ₹49 below",
  },
  {
    zone: "Remote & NE states",
    cities: "Select pincodes in NE, J&K, Ladakh, Andaman & Nicobar",
    days: "6–8 business days",
    charge: "₹99 flat (remote-area surcharge)",
  },
];

const STEPS = [
  {
    icon: "shopping_bag",
    title: "Order placed",
    body: "You'll get an order confirmation by email immediately after checkout.",
  },
  {
    icon: "inventory_2",
    title: "Packed & dispatched",
    body: "We pack and dispatch within 24 hours from our Bengaluru warehouse.",
  },
  {
    icon: "local_shipping",
    title: "In transit",
    body: "You'll receive a tracking link and AWB number via email and SMS.",
  },
  {
    icon: "package_2",
    title: "Delivered",
    body: "Handed over at your doorstep. Signature optional — let us know if you need it.",
  },
];

export function ShippingView() {
  const navigate = useStore((s) => s.navigate);

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Shipping & Delivery"
        title={
          <>
            Fast, tracked,
            <br />
            free over ₹999.
          </>
        }
        intro="We ship across India from our Bengaluru warehouse. Orders are dispatched within 24 hours and reach most pincodes in 3–5 business days."
      />

      {/* Quick facts */}
      <section className="border-b border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-16">
          <Reveal className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { value: "24h", label: "Dispatch time" },
              { value: "3–5 days", label: "Average delivery" },
              { value: "₹999", label: "Free shipping threshold" },
              { value: "All India", label: "Serviceable pincodes" },
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

      {/* Process */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
        <Reveal className="mb-10">
          <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
            How it works
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
            From order to doorstep.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 80}
              className="border border-brushed-silver bg-canvas-white p-6"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-leather-tan">
                  {step.icon}
                </span>
                <span className="font-[var(--font-display)] text-[32px] font-medium text-brushed-silver">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-[var(--font-display)] text-[18px] font-medium text-primary">
                {step.title}
              </h3>
              <p className="mt-2 font-[var(--font-body)] text-[14px] leading-relaxed text-secondary">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Zones table */}
      <section className="border-y border-brushed-silver bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
          <Reveal className="mb-10">
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
              Delivery zones
            </span>
            <h2 className="font-[var(--font-display)] text-[32px] font-medium leading-tight tracking-tight text-primary sm:text-[40px]">
              Estimated timelines.
            </h2>
          </Reveal>
          <Reveal className="overflow-x-auto">
            <table className="w-full min-w-[640px] border border-brushed-silver bg-canvas-white">
              <thead>
                <tr className="border-b border-brushed-silver bg-surface-container-low text-left">
                  <th className="px-5 py-4 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                    Zone
                  </th>
                  <th className="px-5 py-4 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                    Coverage
                  </th>
                  <th className="px-5 py-4 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                    Delivery time
                  </th>
                  <th className="px-5 py-4 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z) => (
                  <tr
                    key={z.zone}
                    className="border-b border-brushed-silver last:border-0"
                  >
                    <td className="px-5 py-4 font-[var(--font-display)] text-[15px] font-medium text-primary">
                      {z.zone}
                    </td>
                    <td className="px-5 py-4 font-[var(--font-body)] text-[14px] text-secondary">
                      {z.cities}
                    </td>
                    <td className="px-5 py-4 font-[var(--font-body)] text-[14px] text-primary">
                      {z.days}
                    </td>
                    <td className="px-5 py-4 font-[var(--font-body)] text-[14px] text-primary">
                      {z.charge}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* Tracking + FAQ */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
              Tracking
            </span>
            <h2 className="font-[var(--font-display)] text-[28px] font-medium leading-tight tracking-tight text-primary sm:text-[36px]">
              Track your order.
            </h2>
            <p className="mt-4 font-[var(--font-body)] text-[16px] leading-relaxed text-secondary">
              As soon as your order ships, we email you a tracking link and an
              AWB number. Click the link to see live status from our courier
              partner.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Automated email + SMS with tracking link on dispatch",
                "Live status updates from pickup to delivery",
                "Reschedule or redirect deliveries via courier portal",
                "Write to us anytime for a manual status check",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 font-[var(--font-body)] text-[15px] text-primary"
                >
                  <span className="material-symbols-outlined mt-0.5 text-[18px] text-leather-tan">
                    check_circle
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
              Common questions
            </span>
            <h2 className="font-[var(--font-display)] text-[28px] font-medium leading-tight tracking-tight text-primary sm:text-[36px]">
              Shipping FAQ.
            </h2>
            <div className="mt-6 divide-y divide-brushed-silver border-y border-brushed-silver">
              {[
                {
                  q: "When does my order ship?",
                  a: "Orders placed before 4pm IST ship the same business day. Orders after that ship the next morning.",
                },
                {
                  q: "Do you ship on weekends?",
                  a: "We don't dispatch on Sundays or public holidays, but courier transit continues. You'll still get deliveries on Saturdays in most cities.",
                },
                {
                  q: "What if I'm not home during delivery?",
                  a: "Our courier attempts delivery up to 3 times. You'll get an SMS to reschedule or pick up from the nearest courier branch.",
                },
                {
                  q: "Is my package insured?",
                  a: "Yes — all shipments are insured against loss or damage in transit until they reach your doorstep.",
                },
              ].map((item) => (
                <div key={item.q} className="py-4">
                  <p className="font-[var(--font-display)] text-[15px] font-medium text-primary">
                    {item.q}
                  </p>
                  <p className="mt-1 font-[var(--font-body)] text-[14px] leading-relaxed text-secondary">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate({ view: "faq" })}
              className="mt-6 border-b border-primary pb-1 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary hover:text-leather-tan"
            >
              View full FAQ →
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
