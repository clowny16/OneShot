"use client";
// FAQView — accordion FAQ with categories and a buying guide.
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SECTIONS: {
  title: string;
  items: { q: string; a: string }[];
}[] = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are dispatched within 24 hours. Standard delivery takes 3–5 business days across India. Metro cities usually receive orders in 2–3 days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes. Shipping is free on all orders above ₹999. Orders below that carry a flat ₹49 shipping fee.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll receive an email with a tracking link and AWB number. You can also write to us for a status update.",
      },
      {
        q: "Do you ship outside India?",
        a: "Currently we ship within India only. We're working on international shipping and will announce it through The Journal newsletter.",
      },
    ],
  },
  {
    title: "Products & Sound",
    items: [
      {
        q: "Which earbuds are best for calls?",
        a: "EchoBuds are tuned for calling with dual-mic ENC for clear voice. If you take meetings all day, EchoBuds or ProBeat Buds (with ANC) are our top picks.",
      },
      {
        q: "Which model has the best bass?",
        a: "SonicBuds and MaxTune both feature bass-tuned drivers. MaxTune adds a wider soundstage for audiophiles, while SonicBuds lean into deep bass for EDM and hip-hop.",
      },
      {
        q: "Are OneShot earbuds good for the gym?",
        a: "Yes. PulsePods are built for sport with IPX5 sweat resistance and secure-fit ear hooks. WavePods (IPX6) are a great choice for outdoor runs and rainy weather.",
      },
      {
        q: "What is ANC and which model has it?",
        a: "Active Noise Cancellation uses microphones to reduce outside noise. Our ProBeat Buds support ANC up to -32dB, plus a transparency mode for when you need to hear your surroundings.",
      },
      {
        q: "How long does the battery last?",
        a: "Battery life varies by model. AirBuds deliver up to 24h total, while ProBeat Buds deliver up to 36h total with the case. Most models give 5–8 hours of playback per charge.",
      },
    ],
  },
  {
    title: "Returns & Warranty",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer 7-day easy returns on unopened and lightly used units. If something doesn't fit or sound right, write to us and we'll arrange a pickup.",
      },
      {
        q: "How long is the warranty?",
        a: "Every OneShot product comes with a 1-year warranty covering manufacturing defects. Keep your order ID handy when you contact support.",
      },
      {
        q: "What does the warranty not cover?",
        a: "Physical damage, water damage beyond the rated IPX level, and normal wear and tear are not covered. Lost earbuds are also outside warranty scope.",
      },
      {
        q: "How do I claim warranty?",
        a: "Email support@oneshot.in with your order ID and a short description of the issue. We'll guide you through the next steps, including pickup if needed.",
      },
    ],
  },
  {
    title: "Connectivity & Care",
    items: [
      {
        q: "How do I pair my earbuds?",
        a: "Open the charging case with the earbuds inside, press and hold the button on the case until the LED blinks, then select 'OneShot' from your phone's Bluetooth menu.",
      },
      {
        q: "Can I connect to two devices at once?",
        a: "Select models support dual-point connectivity, letting you stay paired to your phone and laptop simultaneously. Check the spec table on each product page.",
      },
      {
        q: "How do I clean my earbuds?",
        a: "Wipe the shells with a dry microfiber cloth. Use a soft brush to clear ear tips. Never submerge the case or use harsh solvents.",
      },
      {
        q: "Are replacement ear tips available?",
        a: "Yes. Each box ships with multiple tip sizes. For spares, write to support and we'll send a replacement set for the cost of shipping.",
      },
    ],
  },
];

export function FAQView() {
  const navigate = useStore((s) => s.navigate);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].title);

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Help Centre"
        title={
          <>
            Frequently asked
            <br />
            questions.
          </>
        }
        intro="Everything about orders, sound, returns, and care. Can't find what you're looking for? Our team is one message away."
      />

      <section className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Section nav */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="mb-4 font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
              Categories
            </h2>
            <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
              {SECTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    setActiveSection(s.title);
                    document
                      .getElementById(`faq-${s.title.replace(/\s+/g, "-")}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "shrink-0 border-l-2 px-4 py-3 text-left font-[var(--font-label)] text-[12px] uppercase tracking-[0.05em] font-semibold transition-colors",
                    activeSection === s.title
                      ? "border-primary text-primary"
                      : "border-transparent text-secondary hover:text-primary",
                  )}
                >
                  {s.title}
                </button>
              ))}
            </nav>

            <div className="mt-8 hidden border border-brushed-silver bg-surface-container-lowest p-5 lg:block">
              <p className="font-[var(--font-display)] text-[16px] font-medium text-primary">
                Still stuck?
              </p>
              <p className="mt-1 font-[var(--font-body)] text-[13px] text-secondary">
                Our support team replies within one business day.
              </p>
              <button
                onClick={() => navigate({ view: "contact" })}
                className="mt-3 border-b border-primary pb-1 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary hover:text-leather-tan"
              >
                Contact us →
              </button>
            </div>
          </aside>

          {/* Accordion list */}
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                id={`faq-${section.title.replace(/\s+/g, "-")}`}
              >
                <Reveal>
                  <h3 className="mb-4 font-[var(--font-display)] text-[24px] font-medium tracking-tight text-primary">
                    {section.title}
                  </h3>
                </Reveal>
                <Accordion
                  type="single"
                  collapsible
                  className="border-t border-brushed-silver"
                >
                  {section.items.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`${section.title}-${idx}`}
                      className="border-b border-brushed-silver"
                    >
                      <AccordionTrigger className="py-5 text-left font-[var(--font-display)] text-[16px] font-medium text-primary hover:no-underline hover:text-leather-tan">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 font-[var(--font-body)] text-[15px] leading-relaxed text-secondary">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {/* Mobile contact CTA */}
            <div className="border border-brushed-silver bg-surface-container-lowest p-5 lg:hidden">
              <p className="font-[var(--font-display)] text-[16px] font-medium text-primary">
                Still stuck?
              </p>
              <p className="mt-1 font-[var(--font-body)] text-[13px] text-secondary">
                Our support team replies within one business day.
              </p>
              <button
                onClick={() => navigate({ view: "contact" })}
                className="mt-3 border-b border-primary pb-1 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-primary"
              >
                Contact us →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
