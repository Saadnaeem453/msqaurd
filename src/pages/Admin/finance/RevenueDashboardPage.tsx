import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiCreditCard,
  FiPercent,
  FiSettings,
  FiShoppingCart,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
} from "recharts";

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  trend: string;
  trendTone: "up" | "down";
  progress: number;
}

interface TrendPoint {
  month: string;
  gmv: number;
  revenue: number;
  current: boolean;
  cap?: number;
}

interface SourceStream {
  id: string;
  label: string;
  percent: number;
  dot: string;
}

interface Region {
  id: string;
  index: string;
  name: string;
  value: string;
  percent: number;
}

type TxStatus = "settled" | "pending";

interface Transaction {
  id: string;
  ref: string;
  name: string;
  icon: IconType;
  date: string;
  value: string;
  status: TxStatus;
}

interface FinanceEvent {
  id: string;
  title: string;
  meta: string;
  dot: string;
}

interface MapMarker {
  id: string;
  x: string;
  y: string;
  size: number;
}

interface DropdownOption {
  value: string;
  label: string;
}

const statItems: StatItem[] = [
  {
    id: "gmv",
    label: "Total GMV",
    value: "$4,281,950.00",
    icon: FiCreditCard,
    trend: "+12.4%",
    trendTone: "up",
    progress: 75,
  },
  {
    id: "revenue",
    label: "Platform Revenue",
    value: "$642,292.50",
    icon: FiPercent,
    trend: "+8.2%",
    trendTone: "up",
    progress: 65,
  },
  {
    id: "aov",
    label: "Avg. Order Value",
    value: "$142.20",
    icon: FiShoppingCart,
    trend: "-2.1%",
    trendTone: "down",
    progress: 45,
  },
  {
    id: "subs",
    label: "Active Subscriptions",
    value: "12,840",
    icon: FiBriefcase,
    trend: "+18.9%",
    trendTone: "up",
    progress: 88,
  },
];

const rangeOptions: DropdownOption[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "12m", label: "Last 12 Months" },
  { value: "ytd", label: "This Year" },
];

const trendSeries: TrendPoint[] = [
  { month: "SEP", gmv: 30, revenue: 18, current: false },
  { month: "OCT", gmv: 38, revenue: 22, current: false },
  { month: "NOV", gmv: 42, revenue: 26, current: false },
  { month: "DEC", gmv: 36, revenue: 20, current: false },
  { month: "JAN", gmv: 52, revenue: 30, current: false },
  { month: "FEB", gmv: 56, revenue: 34, current: false },
  { month: "MAR", gmv: 48, revenue: 28, current: false },
  { month: "APR", gmv: 64, revenue: 38, current: false },
  { month: "MAY", gmv: 58, revenue: 32, current: false },
  { month: "JUN", gmv: 62, revenue: 36, current: false },
  { month: "JUL", gmv: 70, revenue: 42, current: false },
  { month: "AUG", gmv: 78, revenue: 46, current: true },
];

const sourceStreams: SourceStream[] = [
  { id: "tickets", label: "Ticket Sales Commission", percent: 62, dot: "bg-primary" },
  { id: "premium", label: "Premium Features", percent: 24, dot: "bg-finance-revenue" },
  { id: "services", label: "Organizer Services", percent: 14, dot: "bg-bgray/40" },
];

const regionMarkers: MapMarker[] = [
  { id: "na", x: "36%", y: "33%", size: 7 },
  { id: "eu", x: "72%", y: "55%", size: 9 },
  { id: "sea", x: "52%", y: "78%", size: 5 },
];

const regions: Region[] = [
  { id: "r1", index: "01", name: "North America", value: "$1.2M", percent: 72 },
  { id: "r2", index: "02", name: "Europe Central", value: "$940K", percent: 58 },
  { id: "r3", index: "03", name: "South East Asia", value: "$412K", percent: 32 },
];

const transactions: Transaction[] = [
  {
    id: "t1",
    ref: "ATX-88291",
    name: "Cyberfest Global 2024",
    icon: FiCalendar,
    date: "24 Aug, 14:22",
    value: "$12,450.00",
    status: "settled",
  },
  {
    id: "t2",
    ref: "ATX-88289",
    name: "Elite VIP Payout",
    icon: FiCreditCard,
    date: "24 Aug, 12:05",
    value: "$8,120.00",
    status: "settled",
  },
  {
    id: "t3",
    ref: "ATX-88284",
    name: "Sponsorship Fee",
    icon: FiSettings,
    date: "23 Aug, 18:45",
    value: "$15,000.00",
    status: "pending",
  },
  {
    id: "t4",
    ref: "ATX-88281",
    name: "Corporate Group Buy",
    icon: FiBriefcase,
    date: "23 Aug, 16:30",
    value: "$4,820.00",
    status: "settled",
  },
];

const STATUS_CLASSES: Record<TxStatus, string> = {
  settled: "bg-green/15 text-green",
  pending: "bg-secondary/10 text-secondary",
};

const financeEvents: FinanceEvent[] = [
  { id: "e1", title: "Payout Success", meta: "2m ago • Organizer #012", dot: "bg-green" },
  { id: "e2", title: "Refund Requested", meta: "14m ago • Order #9122", dot: "bg-primary" },
  { id: "e3", title: "New Subscription", meta: "1h ago • Corporate Tier", dot: "bg-report-blue" },
  { id: "e4", title: "Daily Target Met", meta: "Just now • Finance Ops", dot: "bg-green" },
];

const RevenueDashboardPage = () => {
  const [rangeValue, setRangeValue] = useState("12m");
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) {
        setRangeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedRange = rangeOptions.find((o) => o.value === rangeValue);

  return (
    <div className="min-h-full bg-grayblue font-jakarta font-normal text-bgray">
      <div className="admin-page ">

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="admin-page-title">
              Revenue Dashboard
            </h1>
            <p className="admin-page-description">
              Real-time financial performance and transaction insights.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary">Range:</span>
            <div ref={rangeRef} className="relative">
              <button
                type="button"
                aria-expanded={rangeOpen}
                onClick={() => setRangeOpen((v) => !v)}
                className="flex items-center gap-2 rounded-sm bg-report-control px-3 py-2 text-xs font-normal text-bgray transition hover:bg-report-control"
              >
                {selectedRange?.label}
                <FiChevronDown size={12} className="text-secondary" />
              </button>
              {rangeOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-sm border border-border_color bg-report-head py-1 shadow-lg">
                  {rangeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRangeValue(option.value);
                        setRangeOpen(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-report-control ${
                        option.value === rangeValue
                          ? "font-normal text-bgray"
                          : "text-bgray/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {statItems.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trendTone === "up" ? FiTrendingUp : FiTrendingDown;
            return (
              <div key={stat.id} className="rounded-[4px] bg-report-head p-4">
                <div className="flex items-start justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-report-control">
                    <Icon size={14} className="text-secondary" />
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-normal ${
                      stat.trendTone === "up" ? "text-green" : "text-primary"
                    }`}
                  >
                    <TrendIcon size={11} />
                    {stat.trend}
                  </span>
                </div>
                <p className="mt-4 text-xs font-normal uppercase tracking-wider text-bgray/80">
                  {stat.label}
                </p>
                <p className="mt-2 text-base font-normal tracking-tight text-bgray">
                  {stat.value}
                </p>
                <div className="mt-3 h-1 w-full rounded-full bg-report-control">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-[4px] bg-report-head p-5 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
                  Revenue Trend
                </h2>
                <p className="mt-1 text-xs text-secondary">
                  GMV vs Net Revenue (Trailing 12 Months)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  GMV
                </span>
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                  Revenue
                </span>
              </div>
            </div>

            <div className="mt-6 h-72 text-secondary">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendSeries.map((point) => ({ ...point, cap: 10 }))}
                  barCategoryGap="3%"
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                  />
                  <Bar dataKey="revenue" stackId="a">
                    {trendSeries.map((point) => (
                      <Cell
                        key={point.month}
                        className={point.current ? "fill-finance-revenue" : "fill-finance-revenue-muted"}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="gmv" stackId="a">
                    {trendSeries.map((point) => (
                      <Cell
                        key={point.month}
                        className={point.current ? "fill-primary" : "fill-finance-gmv"}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="cap" stackId="a" className="fill-report-panel" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[4px] bg-report-head p-5">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Source Breakdown
            </h2>
            <p className="mt-1 text-xs text-secondary">Platform Revenue Streams</p>

            <div className="relative mx-auto mt-6 h-36 w-36 rounded-sm border-[12px] border-primary border-l-finance-revenue ring-[12px] ring-report-control">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-normal text-bgray">$642K</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wider text-secondary">
                  Total Net
                </span>
              </div>
            </div>

            <ul className="mt-10 space-y-3">
              {sourceStreams.map((stream) => (
                <li key={stream.id} className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${stream.dot}`}
                    aria-hidden="true"
                  />
                  <span className="max-w-[110px] flex-1 text-xs leading-snug text-bgray/80">
                    {stream.label}
                  </span>
                  <span className="text-xs font-normal text-bgray/80">
                    {stream.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="rounded-[4px] bg-report-head p-5 lg:col-span-2">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Regional Performance
            </h2>

            <div className="relative mt-4 h-32 overflow-hidden rounded-sm bg-report-control p-2">
              <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
                {Array.from({ length: 432 }).map((_, i) => (
                  <span key={i} className="h-0.5 w-0.5 rounded-full bg-grayblue/50" />
                ))}
              </div>
              {regionMarkers.map((marker) => (
                <span
                  key={marker.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                  style={{ left: marker.x, top: marker.y, width: marker.size, height: marker.size }}
                />
              ))}
            </div>

            <ul className="mt-4 space-y-3">
              {regions.map((region) => (
                <li key={region.id} className="flex items-center gap-3">
                  <span className="text-xs text-secondary">{region.index}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-normal text-bgray">{region.name}</p>
                    <div className="mt-1.5 h-0.5 w-full rounded-full bg-report-control">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${region.percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-normal text-bgray">{region.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[4px] bg-report-head p-5 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
                High-Value Transactions
              </h2>
              <button
                type="button"
                className="text-xs font-normal text-secondary transition hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[540px] text-left">
                <thead>
                  <tr>
                    <th className="w-[16%] pb-2 text-xs font-normal uppercase tracking-wider text-bgray/70">
                      Ref ID
                    </th>
                    <th className="w-[34%] pb-2 text-xs font-normal uppercase tracking-wider text-bgray/70">
                      Client / Entity
                    </th>
                    <th className="w-[20%] pb-2 text-xs font-normal uppercase tracking-wider text-bgray/70">
                      Date
                    </th>
                    <th className="w-[16%] pb-2 text-right text-xs font-normal uppercase tracking-wider text-bgray/70">
                      Value
                    </th>
                    <th className="w-[14%] pb-2 text-right text-xs font-normal uppercase tracking-wider text-bgray/70">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const TxIcon = tx.icon;
                    return (
                      <tr key={tx.id} className="border-t border-bgray/[0.02]">
                        <td className="py-3 pr-2">
                          <span className="block max-w-[46px] text-xs leading-snug text-secondary">
                            {tx.ref}
                          </span>
                        </td>
                        <td className="py-3 pr-2">
                          <span className="flex items-center gap-2">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-report-control text-bgray/70">
                              <TxIcon size={9} />
                            </span>
                            <span className="max-w-[110px] text-xs font-normal leading-snug text-bgray">
                              {tx.name}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 pr-2">
                          <span className="block max-w-[52px] text-xs leading-snug text-secondary">
                            {tx.date}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-right text-xs font-normal text-bgray">
                          {tx.value}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-normal uppercase tracking-wide ${STATUS_CLASSES[tx.status]}`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[4px] bg-report-head p-5">
          <h2 className="admin-section-title text-xs font-normal uppercase tracking-wider text-bgray/80">
            Live Finance Events
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financeEvents.map((event) => (
              <li key={event.id} className="flex items-start gap-2.5">
                <span
                  className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${event.dot}`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-normal text-bgray">{event.title}</p>
                  <p className="mt-0.5 text-xs text-secondary">{event.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RevenueDashboardPage;
