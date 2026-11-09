import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  CalendarDays,
  CircleDollarSign,
  MapPin,
  ShoppingCart,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { useEventStats, useEventList } from "../../../hooks/useEvents";
import { RevenueOverview, organizerTicketSalesApi } from "../../../services/organizer_ticket_sales.service";
import { Event } from "../../../services/event.service";

interface DashboardContext {
  timeframe: string;
}

const OrganizerDashboardOverview = () => {
  const { timeframe = "Last month" } = useOutletContext<DashboardContext>();
  const { stats, loading: statsLoading, error: statsError } = useEventStats();
  const { events: publishedEvents, loading: publishedLoading } = useEventList({ status: "published", limit: 10 });
  const { events: draftEvents, loading: draftsLoading } = useEventList({ status: "draft", limit: 10 });
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [salesLoading, setSalesLoading] = useState(true);

  const period = timeframe === "Last week" ? "7d" : timeframe === "Last year" ? "1y" : "30d";

  useEffect(() => {
    let active = true;
    setSalesLoading(true);
    organizerTicketSalesApi.overview({ period }).then((result) => {
      if (!active) return;
      if (result.ok && result.data) setOverview(result.data);
      setSalesLoading(false);
    });
    return () => { active = false; };
  }, [period]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...publishedEvents, ...draftEvents]
      .filter((event) => {
        const date = getEventDateTime(event);
        return !Number.isNaN(date.getTime()) && date >= now;
      })
      .sort((a, b) => getEventDateTime(a).getTime() - getEventDateTime(b).getTime())
      .slice(0, 3);
  }, [publishedEvents, draftEvents]);

  const ticketChange = overview?.kpis.percentage_changes?.tickets_sold;
  const revenueChange = overview?.kpis.percentage_changes?.total_revenue;
  const isLoading = publishedLoading || draftsLoading;

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <section aria-label="Dashboard statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Events"
          value={stats?.total ?? "—"}
          loading={statsLoading}
          hint={`${stats?.upcoming ?? 0} upcoming events`}
          icon={<CalendarDays size={18} />}
          watermark={<CalendarDays size={70} />}
        />
        <StatCard
          label="Tickets Sold"
          value={overview?.kpis.tickets_sold?.toLocaleString() ?? stats?.totalTicketsSold?.toLocaleString() ?? "—"}
          loading={statsLoading || salesLoading}
          hint={changeLabel(ticketChange, "tickets sold this period")}
          positive={ticketChange === undefined || ticketChange >= 0}
          icon={<Ticket size={18} />}
          watermark={<Ticket size={70} />}
        />
        <StatCard
          label="Total Revenue"
          value={overview ? formatCompactCurrency(overview.kpis.total_revenue / 100) : "—"}
          loading={salesLoading}
          hint={changeLabel(revenueChange, "revenue this period")}
          positive={revenueChange === undefined || revenueChange >= 0}
          icon={<CircleDollarSign size={18} />}
          watermark={<CircleDollarSign size={70} />}
        />
      </section>

      {statsError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300" role="status">
          Dashboard statistics could not be loaded: {statsError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <section aria-labelledby="upcoming-events-heading" className="min-w-0 md:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="upcoming-events-heading" className="text-2xl font-semibold tracking-tight text-white">Upcoming Events</h2>
            <Link to="/organizer/events/published" className="text-xs font-semibold text-primary hover:text-red-400">View All</Link>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center rounded-xl border border-white/[0.08] bg-[#131418]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#131418] px-5 py-12 text-center">
              <CalendarDays size={28} className="mx-auto mb-2 text-secondary/50" />
              <p className="text-sm text-secondary">No upcoming events</p>
              <Link to="/organizer/events/create" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Create an event</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => <UpcomingEventCard key={event.id} event={event} />)}
            </div>
          )}
        </section>

        <section aria-labelledby="recent-sales-heading" className="min-w-0 md:col-span-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="recent-sales-heading" className="text-2xl font-semibold tracking-tight text-white">Recent Sales</h2>
            <span aria-hidden="true" className="text-lg leading-none text-secondary/40">•••</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#131418] px-4">
            {salesLoading ? (
              <div className="flex min-h-52 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : overview?.recent_transactions?.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {overview.recent_transactions.slice(0, 4).map((transaction) => (
                  <li key={transaction.order_id} className="flex min-w-0 items-center gap-3 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary/50">
                      <ShoppingCart size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">{transaction.purchaser?.full_name || "Guest"}</p>
                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-secondary/65">
                        {transaction.quantity}x {transaction.event || "Event"}{transaction.tier ? ` (${transaction.tier})` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-white">{formatCurrency(transaction.gross_order_minor / 100)}</p>
                      <p className="mt-0.5 text-[9px] text-secondary/50">{timeAgo(transaction.payment_date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-12 text-center text-sm text-secondary">No recent sales to show</p>
            )}
          </div>
          <Link
            to="/organizer/finance/transactions"
            className="mt-3 flex min-h-10 items-center justify-center rounded-lg text-xs font-semibold text-secondary transition hover:text-white"
          >
            Download Transaction History
          </Link>
        </section>
      </div>
    </div>
  );
};

function StatCard({
  label,
  value,
  hint,
  loading,
  positive = true,
  icon,
  watermark,
}: {
  label: string;
  value: string | number;
  hint: string;
  loading: boolean;
  positive?: boolean;
  icon: React.ReactNode;
  watermark: React.ReactNode;
}) {
  return (
    <article className="relative min-h-[137px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#131418] px-6 py-5">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 text-secondary/10">{watermark}</div>
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary/65">{label}</p>
          {loading ? (
            <div className="mt-2 h-9 w-24 animate-pulse rounded bg-white/10" />
          ) : (
            <p className="mt-1 text-4xl font-bold leading-none tracking-tight text-white">{value}</p>
          )}
          <p className={`mt-4 flex items-center gap-1.5 text-[10px] font-semibold ${positive ? "text-emerald-400" : "text-primary"}`}>
            {positive && <TrendingUp size={12} />}
            {!positive && <span aria-hidden="true">→</span>}
            {hint}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary/50">{icon}</span>
      </div>
    </article>
  );
}

function UpcomingEventCard({ event }: { event: Event }) {
  const totalCapacity = (event.tiers || []).reduce((sum, tier) => sum + (Number(tier.capacity) || 0), 0);
  const ticketsSold = (event.tiers || []).reduce((sum, tier) => sum + (Number(tier.tickets_sold) || 0), 0);
  const capacityPercent = totalCapacity ? Math.min(100, Math.round((ticketsSold / totalCapacity) * 100)) : 0;
  const eventDate = getEventDateTime(event);
  const isLiveSoon = event.status === "published" && eventDate.getTime() - Date.now() <= 2 * 60 * 60 * 1000;
  const statusLabel = event.status === "draft" ? "Draft" : ticketsSold > 0 ? "On-sale" : "Scheduled";
  const venue = event.venue_name || (event.venue_type === "online" ? "Online Event" : "Venue to be announced");

  return (
    <Link
      to={`/organizer/events/${event.id}`}
      className="group flex min-h-[137px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#131418] transition hover:border-white/[0.16]"
    >
      <div className="relative block w-[30%] min-w-[118px] shrink-0 bg-[#0d0e12]">
        {event.hero_image ? (
          <img src={event.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/10 to-[#0d0e12] text-secondary/30"><CalendarDays size={34} /></div>
        )}
        {isLiveSoon && <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-1 text-[8px] font-bold uppercase text-white">Live in 2h</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5 sm:px-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-tight text-white sm:text-lg">{event.title}</h3>
          <span className={`shrink-0 rounded px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide ${statusLabel === "On-sale" ? "bg-primary/15 text-primary" : "bg-white/[0.07] text-secondary/80"}`}>
            {statusLabel}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-secondary/70">
          <span className="inline-flex items-center gap-1"><CalendarDays size={11} />{formatEventDate(event.event_date, event.start_time)}</span>
          <span className="inline-flex min-w-0 items-center gap-1"><MapPin size={11} /><span className="truncate">{venue}</span></span>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full bg-primary" style={{ width: `${capacityPercent}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between gap-2 font-mono text-[9px] text-secondary/55">
          <span>{ticketsSold.toLocaleString()} / {totalCapacity.toLocaleString()} Tickets</span>
          <span>{capacityPercent}% Capacity</span>
        </div>
      </div>
    </Link>
  );
}

function changeLabel(change: number | undefined, fallback: string) {
  if (change === undefined || !Number.isFinite(change)) return fallback;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}% vs last period`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function formatCompactCurrency(amount: number) {
  if (amount >= 1000) return `£${(amount / 1000).toFixed(1)}k`;
  return `£${amount.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

function formatEventDate(date: string, time?: string) {
  const formattedDate = new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
  return `${formattedDate}${time ? `, ${time.slice(0, 5)}` : ""}`;
}

function getEventDateTime(event: Event) {
  const date = event.event_date.slice(0, 10);
  return new Date(`${date}T${event.start_time || "00:00"}`);
}

function timeAgo(dateString: string) {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 60_000));
  if (!Number.isFinite(elapsedMinutes)) return "";
  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min${elapsedMinutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(elapsedMinutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default OrganizerDashboardOverview;
