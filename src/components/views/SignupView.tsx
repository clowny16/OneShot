"use client";
// SignupView — create a new account with name, email, password.
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function SignupView() {
  const navigate = useStore((s) => s.navigate);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Signup failed",
          description: data.error ?? "Please try again.",
          variant: "destructive",
        });
        return;
      }
      // Auto-login after signup
      const signRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (signRes?.error) {
        toast({
          title: "Account created",
          description: "Please sign in to continue.",
        });
        navigate({ view: "login" });
      } else {
        toast({
          title: "Welcome to OneShot!",
          description: "Your account is ready.",
        });
        navigate({ view: "account" });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Account"
        title="Create your account."
        intro="Join OneShot to track orders, save your wishlist, and check out faster."
      />
      <section className="mx-auto w-full max-w-md px-5 py-12 lg:py-16">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aarav Sharma"
              className={cn(
                "mt-1.5 w-full border bg-canvas-white px-3 py-2.5 font-[var(--font-body)] text-[15px] text-primary placeholder:text-outline-variant focus:outline-none",
                errors.name ? "border-error" : "border-brushed-silver focus:border-primary",
              )}
            />
            {errors.name && (
              <p className="mt-1 font-[var(--font-body)] text-[12px] text-error">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={cn(
                "mt-1.5 w-full border bg-canvas-white px-3 py-2.5 font-[var(--font-body)] text-[15px] text-primary placeholder:text-outline-variant focus:outline-none",
                errors.email ? "border-error" : "border-brushed-silver focus:border-primary",
              )}
            />
            {errors.email && (
              <p className="mt-1 font-[var(--font-body)] text-[12px] text-error">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              className={cn(
                "mt-1.5 w-full border bg-canvas-white px-3 py-2.5 font-[var(--font-body)] text-[15px] text-primary placeholder:text-outline-variant focus:outline-none",
                errors.password ? "border-error" : "border-brushed-silver focus:border-primary",
              )}
            />
            {errors.password && (
              <p className="mt-1 font-[var(--font-body)] text-[12px] text-error">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary px-6 py-3.5 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-primary transition-all hover:bg-deep-charcoal disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 border-t border-brushed-silver pt-6 text-center">
          <p className="font-[var(--font-body)] text-[14px] text-secondary">
            Already have an account?{" "}
            <button
              onClick={() => navigate({ view: "login" })}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate({ view: "home" })}
            className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary hover:text-primary"
          >
            Continue as guest →
          </button>
        </div>
      </section>
    </div>
  );
}
