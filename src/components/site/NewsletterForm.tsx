"use client";
// NewsletterForm — minimal email capture with inline validation.
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Could not subscribe",
          description: data.error ?? "Please try again.",
          variant: "destructive",
        });
      } else if (data.alreadySubscribed) {
        toast({
          title: "You're already on the list",
          description: "We'll be in touch with the next drop.",
        });
      } else {
        toast({
          title: "Welcome to the Journal",
          description: "Check your inbox for a confirmation.",
        });
        setEmail("");
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="flex w-full max-w-md gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="YOUR EMAIL ADDRESS"
          className="min-w-0 flex-1 border-b border-primary bg-transparent py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] text-primary placeholder:text-outline-variant focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="border-b border-primary px-6 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:text-leather-tan disabled:opacity-50"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-0 sm:flex-row border-b border-primary"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="YOUR EMAIL ADDRESS"
        className="min-w-0 flex-1 bg-transparent py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] text-primary placeholder:text-outline-variant focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-8 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary transition-colors hover:text-leather-tan disabled:opacity-50"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
