import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiHome, FiMapPin, FiRefreshCw } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  attendeePaymentApi,
  CheckoutSessionStatus,
} from "../../services/attendee_payment.service";

const formatGBP = (amount: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);

const POLL_INTERVAL_MS = 2000;
const MAX_STATUS_POLLS = 15;

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<CheckoutSessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const verifyOrder = useCallback(async () => {
    if (!sessionId) {
      setError("This return link is missing its checkout session. Check your tickets or contact support.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      for (let attempt = 0; attempt < MAX_STATUS_POLLS; attempt += 1) {
        const result = await attendeePaymentApi.getCheckoutSessionStatus(sessionId);
        if (!result.ok || !result.data) {
          setError(result.detail || "We couldn't verify this order yet. Please try again.");
          return;
        }

        setStatus(result.data);
        const isFinal = result.data.status === "paid" ||
          result.data.payment_status === "paid" ||
          result.data.payment_status === "succeeded" ||
          result.data.payment_status === "failed" ||
          result.data.payment_status === "expired";
        if (isFinal) return;
        if (attempt < MAX_STATUS_POLLS - 1) {
          await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
        }
      }
    } catch {
      setError("We couldn't verify this order right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void verifyOrder();
  }, [verifyOrder]);

  const paidAndIssued =
    (status?.status === "paid" ||
      status?.payment_status === "paid" ||
      status?.payment_status === "succeeded") &&
    (status.ticket_status === "issued" || (status.ticket_count ?? status.tickets?.length ?? 0) > 0);
  const expired = status?.payment_status === "expired";
  const failed = status?.payment_status === "failed" || status?.ticket_status === "failed";

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#101114] px-4 py-12 font-inter text-[#e8e8eb] sm:py-16">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-[#f20d22]/30 blur-3xl" aria-hidden="true" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#f20d22]">
          {paidAndIssued ? (
            <FiCheck size={38} strokeWidth={3} className="text-white" />
          ) : (
            <FiRefreshCw size={32} className={`text-white ${loading ? "animate-spin" : ""}`} />
          )}
        </span>
      </div>

      <h1 className="mt-7 text-center font-jakarta text-3xl text-gray-300 font-bold tracking-tight sm:text-4xl">
        {loading
          ? "Verifying your payment"
          : paidAndIssued
          ? "Payment Successful!"
          : expired
          ? "Checkout session expired"
          : failed
          ? "Order needs attention"
          : "Payment verification is taking longer than expected"}
      </h1>
      <p className="mt-3 max-w-lg text-center text-sm text-[#aaaab0]">
        {paidAndIssued
          ? "Your payment and ticket issuance have been confirmed by our server."
          : expired
          ? "This Stripe Checkout session has expired. Please start a new checkout."
          : failed
          ? "The order or ticket issuance could not be completed. Please contact support."
          : "Your payment was submitted, but the server has not confirmed it yet. Please verify again shortly."}
      </p>

      {error && (
        <div role="alert" className="mt-5 max-w-lg rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-200">
          {error}
        </div>
      )}

      {paidAndIssued && status && (
        <>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-[#f20d22]">
            Order {status.order_number ? `#${status.order_number}` : "confirmed"}
          </p>
          <section className="mt-7 w-full max-w-[452px] rounded-lg border border-white/10 bg-[#111214] p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#f20d22]/70 via-[#48151b] to-[#17191d]" />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold leading-snug">
                  {status.event?.title || status.event_title || "Your event"}
                </h2>
                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#aaaab0]">
                  <FiMapPin size={10} className="shrink-0" />
                  {status.event?.venue_name || status.event?.venue_type || "Ticket issued by MSQUARED"}
                </p>
                {status.event?.event_date && (
                  <p className="mt-1 text-[10px] text-[#aaaab0]">
                    {new Date(`${status.event.event_date}T00:00:00`).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#aaaab0]">
                  Ticket Type
                </p>
                <p className="mt-1 text-xs font-bold">
                  {status.items?.map((item) => `${item.tier_name || "Event ticket"} × ${item.quantity}`).join(", ") || status.ticket_type || "Event ticket"}
                  {status.quantity && status.quantity > 1 ? ` × ${status.quantity}` : ""}
                </p>
              </div>
              {(typeof status.total === "number" || typeof status.total_minor === "number") && (
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#aaaab0]">
                    Total Paid
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#f20d22]">
                    {formatGBP(status.total ?? (status.total_minor ?? 0) / 100)}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="mt-5 w-full max-w-[452px] space-y-3" aria-label="Issued tickets">
            {status.tickets?.map((ticket) => (
              <article key={ticket.id} className="rounded-lg border border-white/10 bg-[#111214] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">{ticket.ticket_type}</h2>
                    {ticket.attendee_name && (
                      <p className="mt-1 text-xs text-[#aaaab0]">{ticket.attendee_name}</p>
                    )}
                    <p className="mt-1 text-[10px] text-[#77777d]">Ticket #{ticket.id}</p>
                  </div>
                  {ticket.qr_code_url && (
                    <img
                      src={ticket.qr_code_url}
                      alt={`QR code for ${ticket.ticket_type}`}
                      className="h-20 w-20 rounded bg-white p-1"
                    />
                  )}
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      <div className="mt-6 flex w-full max-w-[452px] gap-3">
        {expired ? (
          <button
            type="button"
            onClick={() => eventId && navigate(`/home/events/${eventId}/plans`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#f20d22] py-3 text-xs font-bold transition hover:bg-[#f20d22]/90"
          >
            <FaTicketAlt size={13} /> Start a New Checkout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void verifyOrder()}
            disabled={loading || !sessionId}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#f20d22] py-3 text-xs font-bold transition hover:bg-[#f20d22]/90 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Verify Order
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 py-3 text-xs font-bold transition hover:bg-white/15"
        >
          <FiHome /> Back to Home
        </button>
      </div>

      {paidAndIssued && (
        <button
          type="button"
          onClick={() => navigate("/home/tickets")}
          className="mt-3 flex w-full max-w-[452px] items-center justify-center gap-2 rounded-md border border-white/10 py-3 text-xs font-bold transition hover:bg-white/5"
        >
          <FaTicketAlt size={13} /> View My Tickets
        </button>
      )}
      <p className="mt-6 text-center text-[10px] text-[#77777d]">
        Need help? Contact MSQUARED Support.
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
