"use client";
// ContactView — contact form + support details (email, phone, address, hours).
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ContactView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.subject.trim()) errs.subject = "Please add a subject.";
    if (form.message.trim().length < 10)
      errs.message = "Message should be at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Could not send",
          description: data.error ?? "Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Message sent",
          description: "We'll reply within one business day.",
        });
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-20">
      <PageHeader
        eyebrow="Contact Us"
        title={
          <>
            We're here
            <br />
            to help.
          </>
        }
        intro="Questions about an order, a product, or your warranty? Reach out and a real person will get back to you within one business day."
      />

      <section className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Form */}
          <Reveal>
            <h2 className="mb-6 font-[var(--font-display)] text-[24px] font-medium text-primary">
              Send us a message
            </h2>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="Your name"
                  name="name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                  placeholder="Aarav Sharma"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                  placeholder="you@example.com"
                />
              </div>
              <Input
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
                error={errors.subject}
                placeholder="How can we help?"
              />
              <div>
                <label
                  htmlFor="message"
                  className="block font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us a bit more..."
                  className={cn(
                    "mt-1.5 w-full resize-none border bg-canvas-white px-3 py-2.5 font-[var(--font-body)] text-[15px] text-primary placeholder:text-outline-variant focus:outline-none",
                    errors.message
                      ? "border-error"
                      : "border-brushed-silver focus:border-primary",
                  )}
                />
                {errors.message && (
                  <p className="mt-1 font-[var(--font-body)] text-[12px] text-error">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={sending}
                className="bg-primary px-8 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-on-dark hover:bg-deep-charcoal disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </Reveal>

          {/* Contact info */}
          <Reveal delay={120}>
            <h2 className="mb-6 font-[var(--font-display)] text-[24px] font-medium text-primary">
              Other ways to reach us
            </h2>
            <div className="space-y-6">
              <ContactRow
                icon="mail"
                label="Email"
                value="support@oneshot.in"
                sub="Replies within one business day"
              />
              <ContactRow
                icon="call"
                label="Phone"
                value="+91 80-4567-8900"
                sub="Mon–Sat, 10am–7pm IST"
              />
              <ContactRow
                icon="location_on"
                label="Studio"
                value="OneShot Audio Pvt. Ltd."
                sub="4th Floor, Indiranagar, Bengaluru, Karnataka 560038"
              />
              <ContactRow
                icon="schedule"
                label="Support hours"
                value="Monday – Saturday"
                sub="10:00am – 7:00pm IST (closed Sundays & public holidays)"
              />
            </div>

            <div className="mt-8 border border-brushed-silver bg-surface-container-lowest p-6">
              <p className="flex items-center gap-2 font-[var(--font-display)] text-[16px] font-medium text-primary">
                <span className="material-symbols-outlined text-[20px] text-leather-tan">
                  bolt
                </span>
                Need a faster answer?
              </p>
              <p className="mt-2 font-[var(--font-body)] text-[14px] text-secondary">
                Most questions about shipping, returns, and warranty are covered
                in our FAQ.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-1.5 w-full border bg-canvas-white px-3 py-2.5 font-[var(--font-body)] text-[15px] text-primary placeholder:text-outline-variant focus:outline-none",
          error ? "border-error" : "border-brushed-silver focus:border-primary",
        )}
      />
      {error && (
        <p className="mt-1 font-[var(--font-body)] text-[12px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex gap-4 border-b border-brushed-silver pb-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brushed-silver bg-surface-container-low">
        <span className="material-symbols-outlined text-[22px] text-primary">
          {icon}
        </span>
      </div>
      <div>
        <p className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
          {label}
        </p>
        <p className="mt-1 font-[var(--font-display)] text-[17px] font-medium text-primary">
          {value}
        </p>
        <p className="mt-1 font-[var(--font-body)] text-[14px] text-secondary">
          {sub}
        </p>
      </div>
    </div>
  );
}
