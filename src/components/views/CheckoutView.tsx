"use client";
// CheckoutView — shipping form, mock payment, order summary, success screen.
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatINRFromRupees } from "@/lib/types";
import { ProductImage } from "@/components/site/ProductImage";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 49;

type Step = "shipping" | "payment" | "done";

export function CheckoutView() {
  const cart = useStore((s) => s.cart);
  const placeOrder = useStore((s) => s.placeOrder);
  const lastOrder = useStore((s) => s.lastOrder);
  const navigate = useStore((s) => s.navigate);
  const resetOrder = useStore((s) => s.resetOrder);

  const [step, setStep] = useState<Step>(
    lastOrder ? "done" : "shipping",
  );
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState<"card" | "upi" | "cod">("upi");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  // If order completed, show confirmation
  if (step === "done" && lastOrder) {
    return (
      <Confirmation
        order={lastOrder}
        onContinue={() => {
          resetOrder();
          navigate({ view: "home" });
        }}
        onShop={() => {
          resetOrder();
          navigate({ view: "collection" });
        }}
      />
    );
  }

  // If cart empty and no order, send to collection
  if (items.length === 0 && !lastOrder) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-32 pb-24 text-center lg:px-16">
        <span className="material-symbols-outlined text-[56px] text-outline">
          shopping_bag
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-[28px] font-medium text-primary">
          Your cart is empty
        </h1>
        <button
          onClick={() => navigate({ view: "collection" })}
          className="mt-6 bg-primary px-8 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal"
        >
          Shop the collection
        </button>
      </div>
    );
  }

  const validateShipping = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim()) e.lastName = "Required.";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10)))
      e.phone = "Enter a valid 10-digit phone number.";
    if (!form.address.trim()) e.address = "Required.";
    if (!form.city.trim()) e.city = "Required.";
    if (!form.state.trim()) e.state = "Required.";
    if (!/^\d{6}$/.test(form.pincode))
      e.pincode = "Enter a valid 6-digit pincode.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onContinueToPayment = () => {
    if (validateShipping()) {
      setStep("payment");
      window.scrollTo({ top: 0 });
    } else {
      toast({
        title: "Please check the form",
        description: "Some fields need your attention.",
        variant: "destructive",
      });
    }
  };

  const onPlaceOrder = async () => {
    setPlacing(true);
    const res = await placeOrder(form);
    setPlacing(false);
    if (!res.ok) {
      toast({
        title: "Checkout failed",
        description: res.error ?? "Please try again.",
        variant: "destructive",
      });
      setStep("shipping");
    } else {
      setStep("done");
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="pt-20">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        {/* Stepper */}
        <div className="mb-10 flex items-center gap-3">
          <StepDot label="1" active={step === "shipping"} done={step !== "shipping"} />
          <div className="h-px w-8 bg-brushed-silver" />
          <StepDot label="2" active={step === "payment"} done={step === "done"} />
          <div className="h-px w-8 bg-brushed-silver" />
          <StepDot label="3" active={false} done={step === "done"} />
          <span className="ml-2 font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
            {step === "shipping" ? "Shipping" : step === "payment" ? "Payment" : "Confirmed"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
          {/* Left: form */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 font-[var(--font-display)] text-[22px] font-medium text-primary">
                    Contact
                  </h2>
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    error={errors.email}
                    placeholder="you@example.com"
                  />
                </section>

                <section>
                  <h2 className="mb-4 font-[var(--font-display)] text-[22px] font-medium text-primary">
                    Shipping address
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="First name"
                      name="firstName"
                      value={form.firstName}
                      onChange={(v) => setForm({ ...form, firstName: v })}
                      error={errors.firstName}
                      placeholder="Aarav"
                    />
                    <Field
                      label="Last name"
                      name="lastName"
                      value={form.lastName}
                      onChange={(v) => setForm({ ...form, lastName: v })}
                      error={errors.lastName}
                      placeholder="Sharma"
                    />
                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      error={errors.phone}
                      placeholder="9876543210"
                    />
                    <Field
                      label="Pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={(v) => setForm({ ...form, pincode: v })}
                      error={errors.pincode}
                      placeholder="110001"
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={(v) => setForm({ ...form, address: v })}
                        error={errors.address}
                        placeholder="Flat, building, street, area"
                      />
                    </div>
                    <Field
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={(v) => setForm({ ...form, city: v })}
                      error={errors.city}
                      placeholder="New Delhi"
                    />
                    <Field
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={(v) => setForm({ ...form, state: v })}
                      error={errors.state}
                      placeholder="Delhi"
                    />
                  </div>
                </section>

                <button
                  onClick={onContinueToPayment}
                  className="w-full bg-primary px-6 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white transition-all hover:bg-deep-charcoal sm:w-auto sm:px-10"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 font-[var(--font-display)] text-[22px] font-medium text-primary">
                    Payment method
                  </h2>
                  <div className="space-y-3">
                    <PaymentOption
                      id="upi"
                      label="UPI"
                      description="Pay with any UPI app — GPay, PhonePe, Paytm."
                      icon="account_balance_wallet"
                      selected={payment === "upi"}
                      onSelect={() => setPayment("upi")}
                    />
                    <PaymentOption
                      id="card"
                      label="Credit / Debit Card"
                      description="Visa, Mastercard, RuPay."
                      icon="credit_card"
                      selected={payment === "card"}
                      onSelect={() => setPayment("card")}
                    />
                    <PaymentOption
                      id="cod"
                      label="Cash on Delivery"
                      description="Pay in cash when your order arrives."
                      icon="payments"
                      selected={payment === "cod"}
                      onSelect={() => setPayment("cod")}
                    />
                  </div>
                  <p className="mt-4 flex items-center gap-2 font-[var(--font-body)] text-[13px] text-secondary">
                    <span className="material-symbols-outlined text-[16px] text-leather-tan">
                      lock
                    </span>
                    This is a demo store — no real payment will be processed.
                  </p>
                </section>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setStep("shipping")}
                    className="border border-primary px-6 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary hover:bg-surface-container-low"
                  >
                    Back
                  </button>
                  <button
                    onClick={onPlaceOrder}
                    disabled={placing}
                    className="flex-1 bg-primary px-6 py-4 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white transition-all hover:bg-deep-charcoal disabled:opacity-50"
                  >
                    {placing
                      ? "Placing order..."
                      : `Pay ${formatINRFromRupees(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-brushed-silver bg-surface-container-lowest p-6 lg:p-8">
              <h2 className="font-[var(--font-display)] text-[22px] font-medium text-primary">
                Order Summary
              </h2>

              <div className="mt-6 max-h-72 space-y-4 overflow-y-auto scrollbar-thin pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-brushed-silver bg-surface-container-low">
                      <ProductImage
                        imageKey={item.imageKey}
                        alt={item.name}
                        className="h-full w-full border-0"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[10px] font-semibold text-canvas-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-[var(--font-label)] text-[11px] uppercase tracking-[0.05em] font-semibold text-primary">
                        {item.name}
                      </p>
                      <p className="font-[var(--font-body)] text-[12px] text-secondary">
                        {item.colorName}
                      </p>
                    </div>
                    <div className="font-[var(--font-display)] text-[14px] font-medium text-primary">
                      {formatINRFromRupees(item.lineTotal)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-brushed-silver pt-6">
                <div className="flex justify-between">
                  <span className="font-[var(--font-body)] text-[14px] text-secondary">
                    Subtotal
                  </span>
                  <span className="font-[var(--font-display)] text-[15px] font-medium text-primary">
                    {formatINRFromRupees(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-[var(--font-body)] text-[14px] text-secondary">
                    Shipping
                  </span>
                  <span className="font-[var(--font-display)] text-[15px] font-medium text-primary">
                    {shipping === 0 ? "Free" : formatINRFromRupees(shipping)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-baseline justify-between border-t border-brushed-silver pt-6">
                <span className="font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary">
                  Total
                </span>
                <span className="font-[var(--font-display)] text-[28px] font-medium text-primary">
                  {formatINRFromRupees(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
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

function StepDot({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border font-[var(--font-label)] text-[12px] font-semibold transition-colors",
        done
          ? "border-primary bg-primary text-canvas-white"
          : active
            ? "border-primary text-primary"
            : "border-brushed-silver text-outline",
      )}
    >
      {done ? (
        <span className="material-symbols-outlined text-[16px]">check</span>
      ) : (
        label
      )}
    </div>
  );
}

function PaymentOption({
  id,
  label,
  description,
  icon,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-4 border p-4 transition-colors",
        selected ? "border-primary bg-surface-container-low" : "border-brushed-silver bg-canvas-white hover:border-secondary",
      )}
    >
      <input
        type="radio"
        id={id}
        name="payment"
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <div
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-brushed-silver",
        )}
      >
        {selected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </div>
      <span className="material-symbols-outlined text-[24px] text-primary">
        {icon}
      </span>
      <div className="flex-1">
        <p className="font-[var(--font-label)] text-[12px] uppercase tracking-[0.05em] font-semibold text-primary">
          {label}
        </p>
        <p className="font-[var(--font-body)] text-[13px] text-secondary">
          {description}
        </p>
      </div>
    </label>
  );
}

function Confirmation({
  order,
  onContinue,
  onShop,
}: {
  order: {
    orderId: string;
    total: number;
    shipping: number;
    subtotal: number;
    email: string;
    name: string;
  };
  onContinue: () => void;
  onShop: () => void;
}) {
  return (
    <div className="pt-20">
      <div className="mx-auto w-full max-w-2xl px-5 py-16 text-center lg:px-16 lg:py-24">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <span className="material-symbols-outlined text-[48px] text-success">
            check_circle
          </span>
        </div>
        <h1 className="mt-6 font-[var(--font-display)] text-[36px] font-medium leading-tight tracking-tight text-primary sm:text-[44px]">
          Order confirmed
        </h1>
        <p className="mt-3 font-[var(--font-body)] text-[16px] text-secondary">
          Thank you, {order.name.split(" ")[0]}. We've received your order and
          sent a confirmation to{" "}
          <span className="font-semibold text-primary">{order.email}</span>.
        </p>

        <div className="mt-10 border border-brushed-silver bg-surface-container-lowest p-6 text-left">
          <div className="flex items-center justify-between border-b border-brushed-silver pb-4">
            <span className="font-[var(--font-label)] text-[11px] uppercase tracking-[0.1em] font-semibold text-secondary">
              Order number
            </span>
            <span className="font-[var(--font-display)] text-[18px] font-medium text-primary">
              {order.orderId}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-[var(--font-body)] text-[14px] text-secondary">
                Subtotal
              </span>
              <span className="font-[var(--font-display)] text-[14px] font-medium text-primary">
                {formatINRFromRupees(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-[var(--font-body)] text-[14px] text-secondary">
                Shipping
              </span>
              <span className="font-[var(--font-display)] text-[14px] font-medium text-primary">
                {order.shipping === 0 ? "Free" : formatINRFromRupees(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-brushed-silver pt-2">
              <span className="font-[var(--font-label)] text-[12px] uppercase tracking-[0.1em] font-semibold text-primary">
                Total paid
              </span>
              <span className="font-[var(--font-display)] text-[20px] font-medium text-primary">
                {formatINRFromRupees(order.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-sm border border-brushed-silver bg-surface-container-low p-4 text-left">
          <p className="flex items-center gap-2 font-[var(--font-body)] text-[14px] text-primary">
            <span className="material-symbols-outlined text-[18px] text-leather-tan">
              local_shipping
            </span>
            Estimated delivery: 3–5 business days
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onContinue}
            className="border border-primary px-8 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-primary hover:bg-surface-container-low"
          >
            Back to Home
          </button>
          <button
            onClick={onShop}
            className="bg-primary px-8 py-3 font-[var(--font-label)] text-[12px] uppercase tracking-[0.15em] font-semibold text-canvas-white hover:bg-deep-charcoal"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
