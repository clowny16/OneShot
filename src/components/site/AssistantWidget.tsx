"use client";
// AI Shopping Assistant — floating chat widget powered by /api/assistant (LLM).
// Product-catalog-aware, multi-turn, renders tappable product chips when the
// assistant references specific earbuds.
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Msg = {
  role: "user" | "assistant";
  content: string;
  products?: { slug: string; name: string; price: number }[];
};

const QUICK_PROMPTS = [
  "Which earbuds are best for calls?",
  "I want deep bass under ₹1,500",
  "Best for gym and running?",
  "Do you have ANC earbuds?",
];

const SESSION_KEY = "oneshot_assistant_sid";

export function AssistantWidget() {
  const open = useStore((s) => s.assistantOpen);
  const setOpen = useStore((s) => s.openAssistant);
  const close = useStore((s) => s.closeAssistant);
  const navigate = useStore((s) => s.navigate);
  const products = useStore((s) => s.products);
  const [sid] = useState(() => {
    if (typeof window === "undefined") return "";
    let s = sessionStorage.getItem(SESSION_KEY);
    if (!s) {
      s = `asst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, s);
    }
    return s;
  });

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the OneShot Assistant. Tell me how you'll use your earbuds — music, calls, sport, focus — and your budget, and I'll find your match.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, message: trimmed }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply ?? "Sorry, I didn't catch that.",
          products: data.productRefs ?? [],
        },
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen()}
        aria-label="Open shopping assistant"
        className={cn(
          "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-dark shadow-lg shadow-black/20 transition-all hover:bg-deep-charcoal hover:scale-105 lg:bottom-6 lg:right-6",
          open && "scale-0 pointer-events-none",
        )}
      >
        <span className="material-symbols-outlined filled text-[26px]">
          forum
        </span>
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leather-tan opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-leather-tan" />
        </span>
      </button>

      <Sheet open={open} onOpenChange={(o) => (o ? setOpen() : close())}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 bg-canvas-white p-0 sm:max-w-[440px]"
        >
          <SheetHeader className="border-b border-brushed-silver bg-primary px-5 py-4 text-left text-on-dark">
            <SheetTitle className="flex items-center gap-3 text-on-dark">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas-white/10">
                <span className="material-symbols-outlined text-[20px]">
                  forum
                </span>
              </span>
              <div>
                <div className="font-[var(--font-display)] text-[16px] font-semibold uppercase tracking-tight">
                  OneShot Assistant
                </div>
                <div className="flex items-center gap-1.5 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-on-dark/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Online · typically replies instantly
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto scrollbar-thin bg-surface-container-low px-4 py-5"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 font-[var(--font-body)] text-[14px] leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-on-dark"
                      : "rounded-bl-sm bg-canvas-white text-primary border border-brushed-silver",
                  )}
                >
                  {m.content}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {m.products.map((p) => {
                        const full = productBySlug(p.slug);
                        return (
                          <button
                            key={p.slug}
                            onClick={() => {
                              close();
                              navigate({ view: "product", slug: p.slug });
                            }}
                            className="flex w-full items-center gap-3 rounded-lg border border-brushed-silver bg-surface-container-low p-2 text-left transition-colors hover:border-primary"
                          >
                            {full && (
                              <div className="h-12 w-12 shrink-0 overflow-hidden border border-brushed-silver bg-surface-container">
                                <img
                                  src={`/generated/${full.imageKey}.png`}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary">
                                {p.name}
                              </div>
                              <div className="font-[var(--font-display)] text-[13px] font-medium text-leather-tan">
                                {formatINRFromRupees(p.price)}
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-[18px] text-secondary">
                              arrow_forward
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-brushed-silver bg-canvas-white px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-secondary"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="border-t border-brushed-silver bg-canvas-white px-4 py-3">
              <p className="mb-2 font-[var(--font-label)] text-[10px] uppercase tracking-[0.1em] font-semibold text-secondary">
                Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-brushed-silver px-3 py-1.5 font-[var(--font-body)] text-[12px] text-primary transition-colors hover:border-primary hover:bg-surface-container-low"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-brushed-silver bg-canvas-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about earbuds, specs, shipping…"
              className="min-w-0 flex-1 border border-brushed-silver bg-surface-container-low px-3 py-2.5 font-[var(--font-body)] text-[14px] text-primary placeholder:text-outline-variant focus:bg-canvas-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-on-dark transition-colors hover:bg-deep-charcoal disabled:opacity-40"
              aria-label="Send"
            >
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
