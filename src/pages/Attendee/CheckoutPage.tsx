import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiLock, FiShield } from "react-icons/fi";
import { AttendeeEventTier } from "../../services/attendee_events.service";
import { attendeePaymentApi } from "../../services/attendee_payment.service";

interface BookingSelection {
  eventId: string;
  eventTitle?: string;
  tier: AttendeeEventTier;
  quantity: number;
}

interface StoredUser {
  full_name?: string;
  email?: string;
}

const formatGBP = (amount: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);

const getStoredUser = (): StoredUser => {
  try {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    return {
      full_name: typeof user?.full_name === "string" ? user.full_name : "",
      email: typeof user?.email === "string" ? user.email : "",
    };
  } catch {
    return {};
  }
};

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingSelection | null>(null);
  const [name, setName] = useState(() => getStoredUser().full_name || "");
  const [email, setEmail] = useState(() => getStoredUser().email || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("bookingSelection") || "null") as
        | BookingSelection
        | null;
      if (
        saved?.eventId === id &&
        typeof saved.tier?.id === "string" &&
        Number.isInteger(saved.quantity) &&
        saved.quantity > 0
      ) {
        setBooking(saved);
      } else {
        setBooking(null);
      }
    } catch {
      setBooking(null);
    }
  }, [id]);

  const total = booking ? Number(booking.tier.price) * booking.quantity : 0;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!booking || !id || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");

    try {
      const result = await attendeePaymentApi.createCheckoutSession({
        ticket_tier_id: booking.tier.id,
        quantity: booking.quantity,
        purchaser: {
          full_name: name.trim(),
          email: email.trim(),
        },
      });

      if (!result.ok || !result.data?.checkout_url) {
        const detail = result.detail || "";
        setError(
          detail.toLowerCase().includes("expired")
            ? "This checkout session has expired. Please start checkout again."
            : detail || "We couldn't start secure checkout. Please try again."
        );
        return;
      }

      const checkoutUrl = new URL(result.data.checkout_url);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
        setError("The secure checkout link returned by the server is invalid.");
        return;
      }

      window.location.assign(checkoutUrl.toString());
    } catch {
      setError("We couldn't connect to secure checkout. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#050505] p-10 text-center text-[#aaaab0]">
        <p>Select a ticket plan before checking out.</p>
        {id && (
          <button
            type="button"
            onClick={() => navigate(`/home/events/${id}/plans`)}
            className="mt-5 rounded-md bg-[#f20d22] px-5 py-3 text-sm font-bold text-white"
          >
            Choose tickets
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 font-inter text-[#e8e8eb] sm:px-6 lg:py-12">
      <div className="mx-auto max-w-[1120px]">
        <button
          type="button"
          onClick={() => navigate(`/home/events/${id}/plans`)}
          className="mb-7 flex items-center gap-2 text-xs text-[#aaaab0] hover:text-white"
        >
          <FiArrowLeft /> Back to plans
        </button>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_326px]">
          <form onSubmit={submit} className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">Attendee Information</h1>
            <p className="mt-2 text-sm text-[#aaaab0]">
              Enter the purchaser details for your ticket order.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-[10px] font-bold uppercase tracking-wide text-[#c9a8aa]">
                Full Name
                <input
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#1a1a1b] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#f20d22]"
                />
              </label>
              <label className="text-[10px] font-bold uppercase tracking-wide text-[#c9a8aa]">
                Email Address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#1a1a1b] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#f20d22]"
                />
              </label>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Secure Payment</h2>
              <div className="flex items-center gap-2 text-xs text-[#99999e]">
                <FiLock /> Stripe Hosted Checkout
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-[#111112] p-5 text-sm leading-relaxed text-[#c9a8aa]">
              <p className="flex items-start gap-3">
                <FiShield className="mt-0.5 shrink-0 text-[#f20d22]" />
                Card details are entered securely on Stripe. MSQUARED never collects or stores
                your card number, expiry date, or security code.
              </p>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#f20d22] py-3 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60 lg:hidden"
            >
              <FiLock />
              {submitting ? "Connecting to Stripe..." : "Pay Securely with Stripe"}
            </button>
          </form>

          <aside className="overflow-hidden rounded-lg border border-white/10 bg-[#111112]">
            <div className="h-32 bg-gradient-to-br from-[#32151a] via-[#171a1d] to-[#0c1014]" />
            <div className="p-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f20d22]" /> Order Summary · GBP
              </p>
              <h2 className="mt-6 text-lg font-semibold">{booking.eventTitle || "Event Booking"}</h2>
              <p className="mt-2 flex items-center gap-2 text-[10px] text-[#c9a8aa]">
                <FiCalendar size={12} /> Your selected experience
              </p>
              <ul className="mt-6 space-y-4 border-t border-white/10 pt-5 text-xs">
                <li className="flex justify-between gap-3">
                  <span>{booking.tier.name} (x{booking.quantity})</span>
                  <span>{formatGBP(total)}</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Booking fee</span>
                  <span className="text-right text-[#aaaab0]">Calculated at checkout</span>
                </li>
              </ul>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-right text-[8px] font-bold uppercase tracking-wider text-[#c9a8aa]">
                  Final amount confirmed by Stripe
                </p>
                <p className="mt-1 flex items-center justify-between">
                  <span className="font-semibold">Total (GBP)</span>
                  <span className="text-lg font-bold text-[#f20d22]">Confirmed in Stripe</span>
                </p>
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={() => document.querySelector("form")?.requestSubmit()}
                className="mt-6 hidden w-full items-center justify-center gap-2 rounded-md bg-[#f20d22] py-3 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60 lg:flex"
              >
                <FiLock />
                {submitting ? "Connecting to Stripe..." : "Pay Securely with Stripe"}
              </button>
              <p className="mt-4 text-center text-[9px] text-[#77777d]">
                The server calculates the final order amount. No card details are entered on this
                page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
