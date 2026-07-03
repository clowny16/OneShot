"use client";
// Footer — editorial footer with sticky-to-bottom behaviour handled by parent layout.
import { useStore } from "@/lib/store";

export function Footer() {
  const navigate = useStore((s) => s.navigate);

  const columns: { title: string; links: { label: string; view: Parameters<typeof navigate>[0] }[] }[] = [
    {
      title: "Shop",
      links: [
        { label: "All Earbuds", view: { view: "collection" } },
        { label: "Everyday", view: { view: "collection", category: "Everyday" } },
        { label: "Sports", view: { view: "collection", category: "Sports" } },
        { label: "Premium", view: { view: "collection", category: "Premium" } },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", view: { view: "faq" } },
        { label: "Shipping & Delivery", view: { view: "shipping" } },
        { label: "Returns & Refunds", view: { view: "returns" } },
        { label: "Contact Us", view: { view: "contact" } },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", view: { view: "about" } },
        { label: "Our Story", view: { view: "about" } },
        { label: "Warranty", view: { view: "returns" } },
        { label: "Care Guide", view: { view: "faq" } },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-brushed-silver bg-surface-container-lowest">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand block */}
          <div className="col-span-2">
            <div className="font-[var(--font-display)] text-3xl font-semibold uppercase tracking-tighter text-primary">
              OneShot<span className="text-leather-tan">.</span>
            </div>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-secondary font-[var(--font-body)]">
              Wireless earbuds engineered for everyday sound. Designed in India
              for music, calls, sport, and focus.
            </p>
            <div className="mt-6 flex gap-4">
              {["share", "language", "location_on"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-secondary transition-colors hover:text-primary"
                  aria-label={icon}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link, idx) => (
                  <li key={`${link.label}-${idx}`}>
                    <button
                      onClick={() => navigate(link.view)}
                      className="text-left text-[14px] text-primary transition-colors hover:text-leather-tan font-[var(--font-body)]"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brushed-silver pt-8 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[0.1em] text-outline font-[var(--font-label)]">
            © {new Date().getFullYear()} OneShot. Engineered for everyday sound.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Warranty"].map((l) => (
              <button
                key={l}
                onClick={() => navigate({ view: "faq" })}
                className="text-[11px] uppercase tracking-[0.1em] text-secondary transition-colors hover:text-leather-tan font-[var(--font-label)]"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
