import { useState } from "react";
import type { FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FiCalendar, FiCreditCard, FiLock, FiShield } from "react-icons/fi";
import { toast } from "sonner";

/* CRITICAL: set VITE_STRIPE_PUBLISHABLE_KEY; and point fetchClientSecret at your
   backend POST /api/create-payment-intent (returns a PaymentIntent client_secret). */
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "pk_test_51PLACEHOLDER0000000000",
);

const ELEMENT_STYLE = {
  base: {
    color: "#F4F6F6",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    "::placeholder": { color: "#8D9296" },
    iconColor: "#8D9296",
  },
  invalid: { color: "#e50a15", iconColor: "#e50a15" },
};

const ORDER_LINES = [
  { id: "pass", label: "VIP Access Pass (x2)", value: "$250.00", tone: "light" as const },
  { id: "discount", label: "Early Bird Discount", value: "- $50.00", tone: "primary" as const },
  { id: "fee", label: "Processing Fee", value: "$12.50", tone: "light" as const },
];

const fetchClientSecret = async (): Promise<string> =>
  "pi_test_00000000000000_secret_00000000000000";

/* ============================= Checkout form ============================= */

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim() || !email.includes("@")) {
      toast.error("Enter your full name and a valid email.");
      return;
    }
    const card = elements?.getElement(CardNumberElement);
    if (!stripe || !card || !elements) return;
    setProcessing(true);
    try {
      const clientSecret = await fetchClientSecret();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: fullName.trim(), email: email.trim() },
        },
        receipt_email: email.trim(),
        ...(saveCard ? { setup_future_usage: "off_session" } : {}),
      });
      if (result.error) toast.error(result.error.message ?? "Payment failed.");
      else toast.success("Payment confirmed — see you at the Summit!");
    } catch {
      toast.error("Unable to reach the payment service.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-0">
      <h1 className="font-jakarta text-3xl font-bold tracking-tight text-foreground">
        Attendee Information
      </h1>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full-name" className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            Full Name
          </label>
          <input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="mt-2 w-full rounded-md bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="mt-2 w-full rounded-md bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="font-jakarta text-2xl font-bold tracking-tight text-foreground">
          Payment Details
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="rounded-sm bg-surface-elevated px-2 py-1 text-[9px] font-bold text-foreground/70">VISA</span>
          <span className="rounded-sm bg-surface-elevated px-2 py-1 text-[9px] font-bold text-foreground/70">MC</span>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-surface-elevated p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
          Card Information
        </p>
        <div className="mt-3 flex items-center gap-4 rounded-md border border-border_color bg-surface px-4 py-3.5">
          <FiCreditCard size={16} className="shrink-0 text-foreground/60" />
          <CardNumberElement
            options={ELEMENT_STYLE}
            className="!w-full flex-1"
          />
          <CardExpiryElement options={ELEMENT_STYLE} className="!w-16 shrink-0" />
          <CardCvcElement options={ELEMENT_STYLE} className="!w-12 shrink-0" />
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={saveCard}
            onClick={() => setSaveCard((v) => !v)}
            className={`flex h-4 w-4 items-center justify-center rounded-sm border transition ${
              saveCard ? "border-primary bg-primary" : "border-foreground/30 bg-transparent"
            }`}
          >
            {saveCard && <span className="text-[9px] font-bold text-foreground">✓</span>}
          </button>
          <span className="text-xs text-foreground/80">Save card for future community events</span>
        </label>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-surface-elevated p-4">
        <FiShield size={16} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-foreground/80">
          Your transaction is secured with 256-bit SSL encryption and processed via Stripe.
        </p>
      </div>

      {/* keeps submit reachable when the summary column stacks below on mobile */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-foreground transition hover:bg-primary/90 disabled:opacity-60 lg:hidden"
      >
        <FiLock size={14} />
        {processing ? "Processing…" : "Complete Payment"}
      </button>
    </form>
  );
};

/* ============================= Order summary ============================= */

const OrderSummary = () => {
  const [processing] = useState(false);
  return (
    <aside className="overflow-hidden rounded-xl border border-border_color bg-surface-elevated">
      {/* Event artwork — swap for <img> when the asset is available */}
      <div className="h-32 bg-gradient-to-br from-primary/50 via-primary/20 to-surface" />

      <div className="p-6">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Live Confirmation
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Global Leadership Summit 2024
        </h2>
        <p className="mt-2 flex items-center gap-2 text-xs text-foreground/80">
          <FiCalendar size={12} className="text-secondary" />
          Oct 24 • 09:00 AM • Main Hall
        </p>

        <ul className="mt-5 space-y-3 border-t border-border_color pt-5">
          {ORDER_LINES.map((line) => (
            <li key={line.id} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-foreground/90">{line.label}</span>
              <span className={line.tone === "primary" ? "text-primary" : "text-foreground"}>
                {line.value}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border_color pt-4">
          <p className="text-right text-[9px] font-bold uppercase tracking-widest text-foreground-muted">
            All Taxes Included
          </p>
          <p className="mt-1 flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">$212.50</span>
          </p>
        </div>

        <button
          type="button"
          disabled={processing}
          className="mt-5 hidden w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-foreground transition hover:bg-primary/90 disabled:opacity-60 lg:flex"
        >
          <FiLock size={14} />
          Complete Payment
        </button>

        <p className="mt-4 text-center text-[10px] text-foreground-muted">
          By clicking "Complete Payment", you agree to our{" "}
          <span className="underline decoration-foreground-muted underline-offset-2">
            Terms of Service
          </span>
        </p>
      </div>
    </aside>
  );
};

/* ============================= Page ============================= */

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <div className="min-h-screen bg-surface font-inter text-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </div>
  </Elements>
);

export default CheckoutPage;