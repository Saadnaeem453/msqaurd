import { useMemo, useState } from "react";
import { FiCheckCircle, FiMinus, FiPlus } from "react-icons/fi";

/* ============================= Types ============================= */

interface Tier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  popular?: boolean;
}

/* ================== Mock data (swap with real API later) ================== */

const tiers: Tier[] = [
  {
    id: "standard",
    name: "Standard Access",
    price: 15,
    perks: ["General admission entry", "Digital event guide & map", "Standard community workshop access"],
  },
  {
    id: "premium",
    name: "Premium Gold",
    price: 45,
    popular: true,
    perks: [
      "Priority line-skip entry",
      "Exclusive speaker lounge access",
      "Limited edition merch kit",
      "Premium networking dinner",
    ],
  },
  {
    id: "vip",
    name: "VIP Passage",
    price: 120,
    perks: [
      "All Premium perks included",
      "1-on-1 mentor session",
      "Backstage pass & artist meet",
      "Lifetime community alumni status",
    ],
  },
];

/* ============================= Page ============================= */

const SelectExperiencePage = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(tiers.map((tier) => [tier.id, 0])),
  );

  const totalTickets = useMemo(
    () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0),
    [quantities],
  );
  const subtotal = useMemo(
    () => tiers.reduce((sum, tier) => sum + tier.price * quantities[tier.id], 0),
    [quantities],
  );

  const adjust = (id: string, delta: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));

  const clearAll = () => setQuantities(Object.fromEntries(tiers.map((tier) => [tier.id, 0])));

  return (
    <div className="min-h-screen bg-surface font-inter text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <header>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Live Ticket Sale
          </p>
          <h1 className="mt-3 font-jakarta text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Select Your Experience
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary/80">
            Secure your spot at the MSQUARED Global Summit. Choose from our tiered access
            levels designed to provide the ultimate community immersion.
          </p>
        </header>

        {/* Tier cards */}
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiers.map((tier) => {
            const qty = quantities[tier.id];
            return (
              <article
                key={tier.id}
                className={`relative flex flex-col rounded-xl bg-surface-elevated p-6 ${
                  tier.popular ? "border border-primary/60" : "border border-border_color"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-5 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                    Most Popular
                  </span>
                )}

                <h2
                  className={`text-lg font-semibold ${
                    tier.popular ? "text-secondary" : "text-foreground"
                  }`}
                >
                  {tier.name}
                </h2>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                  <span className="text-xs text-foreground-muted">/ person</span>
                </p>

                <ul className="mt-6 flex-1 space-y-4">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <FiCheckCircle size={14} className="mt-0.5 shrink-0 text-primary" />
                      <span className="text-xs leading-relaxed text-foreground/90">{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between rounded-lg bg-foreground/5 px-4 py-3">
                  <span className="text-xs text-foreground/80">Quantity</span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Decrease ${tier.name} quantity`}
                      onClick={() => adjust(tier.id, -1)}
                      disabled={qty === 0}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground/10 text-foreground transition hover:bg-foreground/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold text-foreground">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${tier.name} quantity`}
                      onClick={() => adjust(tier.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground/10 text-foreground transition hover:bg-foreground/20"
                    >
                      <FiPlus size={12} />
                    </button>
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        {/* Checkout bar */}
        <div className="mt-12 flex flex-col gap-4 rounded-xl bg-surface-elevated px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="border-r border-border_color pr-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
                Selected Items
              </p>
              <p className="mt-1 text-sm text-foreground/90">{totalTickets} Tickets</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
                Estimated Subtotal
              </p>
              <p className="mt-1 text-2xl font-bold text-primary">
                ${subtotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              disabled={totalTickets === 0}
              className="rounded-lg border border-border_color px-6 py-3 text-xs font-semibold text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear All
            </button>
            <button
              type="button"
              disabled={totalTickets === 0}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-xs font-bold text-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
              <FiPlus size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectExperiencePage;