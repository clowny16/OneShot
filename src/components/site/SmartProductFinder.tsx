"use client";
// SmartProductFinder — guided quiz that calls /api/finder (LLM) to recommend
// the best earbuds based on the user's usage, budget, priority, and feature.
// Renders as a modal dialog with a 4-step quiz + recommendation screen.
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Answers = {
  productType?: string;
  usage?: string;
  budget?: string;
  priority?: string;
  feature?: string;
};

const QUESTIONS: {
  key: keyof Answers;
  title: string;
  subtitle: string;
  options: { id: string; label: string; icon: string; desc: string }[];
}[] = [
  {
    key: "productType",
    title: "What are you looking for?",
    subtitle: "Pick the type of audio product you want.",
    options: [
      { id: "Earbuds", label: "Earbuds", icon: "headphones", desc: "True wireless freedom" },
      { id: "Headphones", label: "Headphones", icon: "headset", desc: "Wired or wireless over-ear" },
      { id: "Speakers", label: "Speakers", icon: "speaker", desc: "Portable or home audio" },
      { id: "Gaming Audio", label: "Gaming", icon: "sports_esports", desc: "Headsets for play" },
      { id: "Wired Earphones", label: "Wired", icon: "cable", desc: "Classic in-ear" },
      { id: "Audio Accessories", label: "Accessories", icon: "settings_input_component", desc: "Adapters & docks" },
    ],
  },
  {
    key: "usage",
    title: "How will you use it most?",
    subtitle: "Pick the one that fits your day best.",
    options: [
      { id: "Music", label: "Music", icon: "music_note", desc: "Streaming, podcasts, albums" },
      { id: "Calls", label: "Calls", icon: "call", desc: "Meetings, work-from-home" },
      { id: "Sport", label: "Sport", icon: "directions_run", desc: "Gym, running, workouts" },
      { id: "Focus", label: "Focus", icon: "self_improvement", desc: "Study, meditation, deep work" },
      { id: "Party", label: "Party", icon: "celebration", desc: "Gatherings & events" },
    ],
  },
  {
    key: "budget",
    title: "What's your budget?",
    subtitle: "All prices in INR.",
    options: [
      { id: "under-1500", label: "Under ₹1,500", icon: "savings", desc: "Great value picks" },
      { id: "1500-2500", label: "₹1,500 – ₹2,500", icon: "payments", desc: "Balanced performance" },
      { id: "above-2500", label: "Above ₹2,500", icon: "workspace_premium", desc: "Premium & flagship" },
    ],
  },
  {
    key: "priority",
    title: "What matters most to you?",
    subtitle: "Choose your top priority.",
    options: [
      { id: "Bass", label: "Bass", icon: "graphic_eq", desc: "Deep, punchy low-end" },
      { id: "Clarity", label: "Clarity", icon: "hearing", desc: "Clean mids & highs" },
      { id: "Battery", label: "Battery", icon: "battery_full", desc: "Longest playback" },
      { id: "Comfort", label: "Comfort", icon: "spa", desc: "All-day lightweight fit" },
      { id: "ANC", label: "Quiet", icon: "noise_aware", desc: "Block the world out" },
      { id: "Volume", label: "Loud", icon: "volume_up", desc: "Room-filling sound" },
    ],
  },
];

type Result = {
  primary: { slug: string; reason: string };
  alternative: { slug: string; reason: string } | null;
  summary: string;
};

export function SmartProductFinder() {
  const open = useStore((s) => s.finderOpen);
  const close = useStore((s) => s.closeFinder);
  const navigate = useStore((s) => s.navigate);
  const products = useStore((s) => s.products);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setLoading(false);
  };

  const choose = (key: keyof Answers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      runFinder(next);
    }
  };

  const runFinder = async (a: Answers) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: a }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          close();
          setTimeout(reset, 200);
        }
      }}
    >
      <DialogContent
        className="max-w-2xl overflow-hidden bg-canvas-white p-0 sm:rounded-none"
        aria-describedby={undefined}
      >
        <DialogHeader className="border-b border-brushed-silver bg-primary px-6 py-5 text-on-dark">
          <DialogTitle className="flex items-center gap-3 text-on-dark">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas-white/10">
              <span className="material-symbols-outlined text-[22px]">
                auto_awesome
              </span>
            </span>
            <div>
              <div className="font-[var(--font-display)] text-[18px] font-semibold uppercase tracking-tight">
                Find Your Earbuds
              </div>
              <div className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-on-dark/70">
                AI-powered · 4 quick questions
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
          {!result && !loading && !error && (
            <div className="px-6 py-8">
              {/* Progress */}
              <div className="mb-8 flex items-center gap-2">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 transition-colors",
                      i <= step ? "bg-primary" : "bg-brushed-silver",
                    )}
                  />
                ))}
              </div>
              <div className="mb-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-leather-tan">
                Step {step + 1} of {QUESTIONS.length}
              </div>
              <h2 className="font-[var(--font-display)] text-[24px] font-medium leading-tight tracking-tight text-primary sm:text-[28px]">
                {QUESTIONS[step].title}
              </h2>
              <p className="mt-2 font-[var(--font-body)] text-[15px] text-secondary">
                {QUESTIONS[step].subtitle}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUESTIONS[step].options.map((opt) => {
                  const active = answers[QUESTIONS[step].key] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => choose(QUESTIONS[step].key, opt.id)}
                      className={cn(
                        "flex items-start gap-4 border p-4 text-left transition-all",
                        active
                          ? "border-primary bg-surface-container-low"
                          : "border-brushed-silver bg-canvas-white hover:border-secondary",
                      )}
                    >
                      <span className="material-symbols-outlined mt-0.5 text-[24px] text-leather-tan">
                        {opt.icon}
                      </span>
                      <div>
                        <div className="font-[var(--font-display)] text-[16px] font-medium text-primary">
                          {opt.label}
                        </div>
                        <div className="font-[var(--font-body)] text-[13px] text-secondary">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-6 flex items-center gap-1 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_back
                  </span>
                  Back
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full bg-leather-tan/30" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-dark">
                  <span className="material-symbols-outlined animate-spin text-[28px]">
                    progress_activity
                  </span>
                </div>
              </div>
              <p className="mt-6 font-[var(--font-display)] text-[18px] font-medium text-primary">
                Finding your match…
              </p>
              <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
                Comparing models against your answers.
              </p>
            </div>
          )}

          {error && (
            <div className="px-6 py-20 text-center">
              <span className="material-symbols-outlined text-[48px] text-error">
                error
              </span>
              <p className="mt-4 font-[var(--font-display)] text-[18px] font-medium text-primary">
                {error}
              </p>
              <button
                onClick={() => runFinder(answers)}
                className="mt-4 bg-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark hover:bg-deep-charcoal"
              >
                Try again
              </button>
            </div>
          )}

          {result && !loading && (
            <div className="px-6 py-8">
              <div className="mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-leather-tan">
                  check_circle
                </span>
                <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-secondary">
                  Your recommendation
                </span>
              </div>
              <p className="mb-8 font-[var(--font-display)] text-[20px] font-medium leading-snug text-primary sm:text-[22px]">
                {result.summary}
              </p>

              {/* Primary */}
              {(() => {
                const p = productBySlug(result.primary.slug);
                if (!p) return null;
                return (
                  <div className="mb-4 border-2 border-primary bg-canvas-white">
                    <div className="flex items-center justify-between border-b border-brushed-silver bg-primary px-4 py-2">
                      <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-on-dark">
                        Best match for you
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-leather-tan">
                        star
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 p-5 sm:flex-row">
                      <button
                        onClick={() => {
                          close();
                          navigate({ view: "product", slug: p.slug });
                        }}
                        className="h-40 w-full shrink-0 overflow-hidden border border-brushed-silver sm:w-40"
                      >
                        <img
                          src={`/generated/${p.imageKey}.png`}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <div className="flex-1">
                        <h3 className="font-[var(--font-display)] text-[22px] font-medium uppercase tracking-tight text-primary">
                          {p.name}
                        </h3>
                        <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
                          {p.tagline}
                        </p>
                        <p className="mt-3 rounded-sm bg-surface-container-low px-3 py-2 font-[var(--font-body)] text-[14px] italic text-on-surface-variant">
                          “{result.primary.reason}”
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-[var(--font-display)] text-[24px] font-medium text-primary">
                            {formatINRFromRupees(p.price)}
                          </span>
                          <button
                            onClick={() => {
                              close();
                              navigate({ view: "product", slug: p.slug });
                            }}
                            className="bg-primary px-6 py-2.5 font-[var(--font-label)] text-[11px] uppercase tracking-[0.15em] font-semibold text-on-dark hover:bg-deep-charcoal"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Alternative */}
              {result.alternative &&
                (() => {
                  const p = productBySlug(result.alternative.slug);
                  if (!p) return null;
                  return (
                    <div className="border border-brushed-silver bg-canvas-white">
                      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                        <button
                          onClick={() => {
                            close();
                            navigate({ view: "product", slug: p.slug });
                          }}
                          className="h-24 w-full shrink-0 overflow-hidden border border-brushed-silver sm:w-24"
                        >
                          <img
                            src={`/generated/${p.imageKey}.png`}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                        <div className="flex-1">
                          <span className="font-[var(--font-label)] text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary">
                            Also consider
                          </span>
                          <h4 className="font-[var(--font-display)] text-[17px] font-medium uppercase tracking-tight text-primary">
                            {p.name}
                          </h4>
                          <p className="mt-1 font-[var(--font-body)] text-[13px] text-secondary">
                            {result.alternative.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-[var(--font-display)] text-[18px] font-medium text-primary">
                            {formatINRFromRupees(p.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={reset}
                  className="flex-1 border border-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary hover:bg-surface-container-low"
                >
                  Retake quiz
                </button>
                <button
                  onClick={() => {
                    close();
                    navigate({ view: "collection" });
                  }}
                  className="flex-1 bg-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark hover:bg-deep-charcoal"
                >
                  Browse all
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
