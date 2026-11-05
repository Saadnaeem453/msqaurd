import { useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiBook,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
  FiDownload,
  FiMusic,
  FiPieChart,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { organizerAudienceApi, AudienceInsights } from "../../../services/organizer_audience.service";
import { organizerTicketSalesApi, RevenueOverview } from "../../../services/organizer_ticket_sales.service";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon?: typeof FiUsers;
  dot?: boolean;
  footer: { icon?: "up" | "down"; text: string; tone: "green" | "primary" | "muted" };
}

interface VelocityPoint {
  label: string;
  value: number;
}

interface AudienceRow {
  id: string;
  label: string;
  percent: number;
}

interface CategoryRow {
  id: string;
  icon: typeof FiAward;
  title: string;
  sub: string;
}

type DayTone = "off" | "mid" | "peak";

interface WeekDay {
  id: string;
  label: string;
  tone: DayTone;
}

interface EventRow {
  id: string;
  icon: typeof FiAward;
  name: string;
  category: string;
  sold: string;
  revenue: string;
  status: { label: string; tone: "green" | "amber" };
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  {
    id: "sales",
    label: "Total Sales",
    value: "$42,890.00",
    icon: FiDollarSign,
    footer: { icon: "up", text: "+15.8% vs last month", tone: "green" },
  },
  {
    id: "users",
    label: "Active Users",
    value: "8,432",
    icon: FiUsers,
    footer: { icon: "up", text: "+4.2% since yesterday", tone: "green" },
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "3.8%",
    icon: FiPieChart,
    footer: { icon: "down", text: "-0.5% from last period", tone: "primary" },
  },
  {
    id: "live",
    label: "Live Events",
    value: "14",
    dot: true,
    footer: { text: "4 starting in next 24h", tone: "muted" },
  },
];

const rangeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

const velocityTabs = ["Day", "Week", "Month"] as const;
type VelocityTab = (typeof velocityTabs)[number];

const velocitySeries: Record<VelocityTab, VelocityPoint[]> = {
  Month: [
    { label: "JAN", value: 40 }, { label: "FEB", value: 55 }, { label: "MAR", value: 35 },
    { label: "APR", value: 60 }, { label: "MAY", value: 75 }, { label: "JUN", value: 90 },
    { label: "JUL", value: 50 }, { label: "AUG", value: 45 }, { label: "SEP", value: 70 },
    { label: "OCT", value: 95 }, { label: "NOV", value: 60 }, { label: "DEC", value: 40 },
  ],
  Week: [
    { label: "W1", value: 30 }, { label: "W2", value: 48 }, { label: "W3", value: 62 },
    { label: "W4", value: 44 }, { label: "W5", value: 70 }, { label: "W6", value: 58 },
    { label: "W7", value: 82 }, { label: "W8", value: 66 }, { label: "W9", value: 50 },
    { label: "W10", value: 74 }, { label: "W11", value: 60 }, { label: "W12", value: 88 },
  ],
  Day: [
    { label: "00", value: 12 }, { label: "04", value: 8 }, { label: "08", value: 26 },
    { label: "12", value: 48 }, { label: "16", value: 62 }, { label: "20", value: 90 },
    { label: "23", value: 54 },
  ],
};

const audienceRows: AudienceRow[] = [
  { id: "a1", label: "Age 18-24", percent: 62 },
  { id: "a2", label: "Age 25-34", percent: 24 },
  { id: "a3", label: "Age 35-44", percent: 10 },
];

const locationChips = ["London, UK", "Manchester, UK", "Birmingham, UK", "Glasgow, UK"];

const categoryRows: CategoryRow[] = [
  { id: "c1", icon: FiAward, title: "Sports & Tournaments", sub: "2.4k tickets this month" },
  { id: "c2", icon: FiMusic, title: "Arts & Culture", sub: "1.8k tickets this month" },
  { id: "c3", icon: FiBook, title: "Lectures & Workshops", sub: "940 tickets this month" },
];

const weekDays: WeekDay[] = [
  { id: "mon", label: "MON", tone: "off" },
  { id: "tue", label: "TUE", tone: "off" },
  { id: "wed", label: "WED", tone: "mid" },
  { id: "thu", label: "THU", tone: "mid" },
  { id: "fri", label: "FRI", tone: "mid" },
  { id: "sat", label: "SAT", tone: "peak" },
  { id: "sun", label: "SUN", tone: "off" },
];

const DAY_TONE_CLASSES: Record<DayTone, string> = {
  off: "bg-bgray/10 text-bgray/60",
  mid: "bg-primary/15 text-primary",
  peak: "bg-primary text-bgray",
};

const eventRows: EventRow[] = [
  {
    id: "e1",
    icon: FiAward,
    name: "Annual Gala 2024",
    category: "Culture",
    sold: "1,240 / 1,500",
    revenue: "$18,600",
    status: { label: "Active", tone: "green" },
  },
  {
    id: "e2",
    icon: FiMusic,
    name: "Regional Finals",
    category: "Sports",
    sold: "890 / 1,000",
    revenue: "$12,450",
    status: { label: "Active", tone: "green" },
  },
  {
    id: "e3",
    icon: FiBook,
    name: "Tech Summit: AI Future",
    category: "Education",
    sold: "560 / 800",
    revenue: "$8,400",
    status: { label: "Sold Out Soon", tone: "amber" },
  },
];

/* ============================= Page ============================= */

const OrganiserInsightsPage = () => {
  const [rangeValue, setRangeValue] = useState("30d");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [velocityTab, setVelocityTab] = useState<VelocityTab>("Day");
  const [audience, setAudience] = useState<AudienceInsights | null>(null);
  const [overview, setOverview] = useState<RevenueOverview | null>(null);

  const periodKey = rangeValue;
  useEffect(() => {
    let active = true;
    const refresh = () => Promise.all([organizerAudienceApi.get(periodKey), organizerTicketSalesApi.overview({ period: periodKey as "7d" | "30d" | "90d" })]).then(([audienceResult, overviewResult]) => {
      if (!active) return;
      if (audienceResult.ok) setAudience(audienceResult.data || null);
      if (overviewResult.ok) setOverview(overviewResult.data || null);
    });
    void refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, [periodKey]);

  const liveAudienceRows = useMemo(() => {
    const total = (audience?.age_distribution || []).reduce((sum, row) => sum + row.count, 0) || 1;
    return (audience?.age_distribution || []).slice(0, 3).map((row, index) => ({ id: `age-${index}`, label: row.group, percent: Math.round((row.count / total) * 100) }));
  }, [audience]);
  const liveVelocitySeries = useMemo(() => {
    const points = overview?.sales_velocity || [];
    return points.length ? points.map((point) => ({ label: point.date.slice(5), value: point.tickets_sold })) : velocitySeries[velocityTab];
  }, [overview, velocityTab]);
  const displayStats = useMemo(() => statItems.map((item) => item.id === "sales" && overview ? { ...item, value: `$${(overview.kpis.total_revenue / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` } : item.id === "users" && audience ? { ...item, value: audience.summary.total_unique_attendees.toLocaleString() } : item), [audience, overview]);
  const displayEvents = useMemo(() => (overview?.recent_transactions || []).slice(0, 3).map((tx, index) => ({ id: tx.order_id || `event-${index}`, icon: FiAward, name: tx.event || "Event", category: tx.tier || "Tickets", sold: `${tx.quantity}`, revenue: `$${(tx.gross_order_minor / 100).toLocaleString()}`, status: { label: tx.payment_status, tone: tx.payment_status.toLowerCase() === "paid" || tx.payment_status.toLowerCase() === "succeeded" ? "green" as const : "amber" as const } })), [overview]);

  const selectedRange = rangeOptions.find((o) => o.value === rangeValue);

  return (
    <div className="min-h-full font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-md">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">Organiser Insights</h1>
            <p className="mt-2 text-sm leading-relaxed text-secondary/80">
              Deep dive into your community's engagement patterns and ticket sales performance
              across all event categories.
            </p>
          </div>
          {/* Figma shows the two header buttons overlapping — rendered side-by-side */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setRangeOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md bg-bgray/10 px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
              >
                <FiCalendar size={12} />
                {selectedRange?.label}
                <FiChevronDown size={11} className="text-bgray/60" />
              </button>
              {rangeOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                  {rangeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRangeValue(option.value);
                        setRangeOpen(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                        option.value === rangeValue ? "font-medium text-bgray" : "text-bgray/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiDownload size={12} />
              Export PDF
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-md bg-[#151c24] p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                    {item.label}
                  </p>
                  {Icon && <Icon size={14} className="text-primary" />}
                  {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
                </div>
                <p className="mt-2 text-xl font-bold text-bgray">{item.value}</p>
                <p
                  className={`mt-2 flex items-center gap-1.5 text-[10px] ${
                    item.footer.tone === "green"
                      ? "text-green"
                      : item.footer.tone === "primary"
                        ? "text-primary"
                        : "text-bgray/60"
                  }`}
                >
                  {item.footer.icon === "up" && <FiTrendingUp size={10} />}
                  {item.footer.icon === "down" && <FiTrendingDown size={10} />}
                  {item.footer.text}
                </p>
              </div>
            );
          })}
        </section>

        {/* Velocity + audience */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="rounded-md bg-[#151c24] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-medium text-bgray">Ticket Sales Velocity</h2>
              <div className="flex rounded-md bg-[#080f15] p-1">
                {velocityTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setVelocityTab(tab)}
                    className={`rounded-sm px-3 py-1 text-[10px] font-bold transition ${
                      velocityTab === tab ? "bg-bgray/15 text-bgray" : "text-bgray/60 hover:text-bgray"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveVelocitySeries} barCategoryGap="28%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    className="text-bgray/50"
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#e50a15" fillOpacity={0.35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="text-base font-medium text-bgray">Audience Split</h2>
            <ul className="mt-4 space-y-4">
              {(liveAudienceRows.length ? liveAudienceRows : audienceRows).map((row) => (
                <li key={row.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-bgray/90">{row.label}</span>
                    <span className="text-xs font-bold text-primary">{row.percent}%</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full rounded-full bg-bgray/15">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${row.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[10px] text-bgray/60">Location Hot-spots</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {locationChips.map((chip) => (
                <span key={chip} className="rounded-md bg-bgray/10 px-2.5 py-1 text-[10px] text-bgray/80">
                  {chip}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Categories + peak times */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="text-base font-medium text-bgray">Popular Categories</h2>
            <ul className="mt-4 space-y-2">
              {categoryRows.map((row) => {
                const RowIcon = row.icon;
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-md p-2 text-left transition hover:bg-bgray/5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/15">
                        <RowIcon size={14} className="text-primary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-bgray">{row.title}</span>
                        <span className="mt-0.5 block text-[10px] text-bgray/60">{row.sub}</span>
                      </span>
                      <FiChevronRight size={14} className="shrink-0 text-bgray/60" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="flex flex-col rounded-md bg-[#151c24] p-5">
            <h2 className="text-base font-medium text-bgray">Peak Booking Times</h2>
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <p className="text-3xl font-bold tracking-tight text-primary">19:00 — 21:00</p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-widest text-bgray/60">
                Maximum Conversion Window
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {weekDays.map((day) => (
                <span
                  key={day.id}
                  className={`rounded-sm px-2.5 py-1 text-[10px] font-bold ${DAY_TONE_CLASSES[day.tone]}`}
                >
                  {day.label}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Top performing events */}
        <section className="mt-4 overflow-hidden rounded-md bg-[#151c24]">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
            <h2 className="text-base font-medium text-bgray">Top Performing Events</h2>
            <button type="button" className="text-[10px] font-bold text-primary transition hover:underline">
              View Full Leaderboard
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-t border-bgray/5 bg-bgray/5">
                  {["Event Name", "Category", "Tickets Sold", "Revenue", "Status"].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-secondary/80"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(displayEvents.length ? displayEvents : eventRows).map((row) => {
                  const RowIcon = row.icon;
                  return (
                    <tr key={row.id} className="border-t border-bgray/5">
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/15">
                            <RowIcon size={14} className="text-primary" />
                          </span>
                          <span className="text-xs font-bold text-bgray">{row.name}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-sm bg-primary/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-primary">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-bgray/90">{row.sold}</td>
                      <td className="px-5 py-4 text-xs text-bgray/90">{row.revenue}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`flex items-center gap-1.5 text-[10px] font-semibold ${
                            row.status.tone === "green" ? "text-green" : "text-amber"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              row.status.tone === "green" ? "bg-green" : "bg-amber"
                            }`}
                            aria-hidden="true"
                          />
                          {row.status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganiserInsightsPage;
