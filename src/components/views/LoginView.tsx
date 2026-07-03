"use client";
// LoginView — email/password login using NextAuth credentials provider.
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function LoginView() {
  const navigate = useStore((s) => s.navigate);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Enter your password.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You're now signed in.",
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
        title="Welcome back."
        intro="Sign in to track orders, save your wishlist, and check out faster."
      />
      <section className="mx-auto w-full max-w-md px-5 py-12 lg:py-16">
        <form onSubmit={onSubmit} className="space-y-5">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 border-t border-brushed-silver pt-6 text-center">
          <p className="font-[var(--font-body)] text-[14px] text-secondary">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate({ view: "signup" })}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Create one
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
