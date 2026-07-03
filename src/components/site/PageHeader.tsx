"use client";
// PageHeader — editorial hero header for inner pages (About, Contact, FAQ, etc.)
import { type ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-brushed-silver bg-surface-container-lowest">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 lg:px-16 lg:py-24">
        <Reveal>
          {eyebrow && (
            <span className="mb-3 block font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
              {eyebrow}
            </span>
          )}
          <h1 className="font-[var(--font-display)] text-[40px] font-medium leading-[1.05] tracking-tight text-primary sm:text-[56px] lg:text-[64px]">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl font-[var(--font-body)] text-[17px] leading-relaxed text-secondary lg:text-[19px]">
              {intro}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
