import { FiCheck, FiHome, FiMapPin } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";

/* ============================= Types ============================= */

interface OrderSummary {
  orderNumber: string;
  date: string;
  badge: string;
  title: string;
  venue: string;
  ticketType: string;
  totalPaid: string;
}

/* ================== Mock data (swap with real API later) ================== */

const order: OrderSummary = {
  orderNumber: "MSQ-8829A19",
  date: "March 24, 2024",
  badge: "Live Experience",
  title: "Neon Horizon: The Underground Collective",
  venue: "Cyber District Main Hall, Metropolis",
  ticketType: "VIP Premium Access",
  totalPaid: "$128.50",
};

/* ============================= Page ============================= */

const PaymentSuccessPage = () => (
  <div className="flex min-h-screen flex-col items-center bg-surface px-4 py-16 font-inter text-foreground">
    {/* Success icon with glow */}
    <div className="relative">
      <span className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" aria-hidden="true" />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
          <FiCheck size={24} strokeWidth={3.5} className="text-primary" />
        </span>
      </span>
    </div>

    <h1 className="mt-8 text-center font-jakarta text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      Payment Successful!
    </h1>
    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary">
      Order #{order.orderNumber}
    </p>

    {/* Ticket card */}
    <section className="mt-8 w-full max-w-sm rounded-lg border border-border_color bg-surface-elevated p-4 text-left">
      <div className="flex gap-3">
        {/* Event artwork placeholder — swap for <img> when the asset exists */}
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary/60 to-primary/20" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-primary">
              {order.badge}
            </span>
            <span className="text-[10px] text-foreground-muted">{order.date}</span>
          </div>
          <h2 className="mt-2 text-sm font-semibold leading-snug text-foreground">{order.title}</h2>
          <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-foreground-muted">
            <FiMapPin size={10} className="shrink-0" />
            {order.venue}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-border_color pt-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">
            Ticket Type
          </p>
          <p className="mt-1 text-[10px] font-bold text-foreground">{order.ticketType}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">
            Total Paid
          </p>
          <p className="mt-1 text-sm font-bold text-primary">{order.totalPaid}</p>
        </div>
      </div>
    </section>

    {/* Actions */}
    <div className="mt-6 flex w-full max-w-sm gap-3">
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3 text-xs font-bold text-foreground transition hover:bg-primary/90"
      >
        <FaTicketAlt size={13} />
        View My Ticket
      </button>
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-foreground/10 py-3 text-xs font-bold text-foreground transition hover:bg-foreground/15"
      >
        <FiHome size={13} />
        Back to Home
      </button>
    </div>

    <p className="mt-6 text-center text-[10px] text-foreground-muted">
      A confirmation email has been sent to your registered address.
    </p>
    <p className="mt-1 text-center text-[10px] text-foreground-muted">
      Need help?{" "}
      <button type="button" className="font-semibold text-primary transition hover:underline">
        Contact MSQUARED Support
      </button>
    </p>
  </div>
);

export default PaymentSuccessPage;