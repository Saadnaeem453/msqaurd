import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FiArchive,
  FiArrowDownRight,
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";



type BadgeTone = "green" | "neutral" | "negative";

interface StatItem {
  id: string;
  label: string;
  value: string;
  badge: { icon: IconType; text: string; tone: BadgeTone };
  footer: { kind: "progress"; percent: number } | { kind: "description"; text: string } | { kind: "segments" };
}

interface StreamPoint {
  day: string;
  fees: number;
  service: number;
}

interface WaterfallRow {
  id: string;
  label: string;
  value: string;
  percent: number;
}

interface ClearanceRow {
  id: string;
  icon: IconType;
  name: string;
  category: string;
  amount: string;
  status: "cleared" | "processing";
}

interface DropdownOption {
  value: string;
  label: string;
}



const statItems: StatItem[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$2,482,190",
    badge: { icon: FiArrowUpRight, text: "+12.4%", tone: "green" },
    footer: { kind: "progress", percent: 75 },
  },
  {
    id: "aov",
    label: "Avg. Order Value",
    value: "$142.50",
    badge: { icon: FiArrowUpRight, text: "+2.1%", tone: "green" },
    footer: { kind: "description", text: "Calculated across 17,420 transactions" },
  },
  {
    id: "arpu",
    label: "Revenue per User (ARPU)",
    value: "$18.92",
    badge: { icon: FiArrowRight, text: "Stable", tone: "neutral" },
    footer: { kind: "segments" },
  },
  {
    id: "take",
    label: "Take Rate",
    value: "12.5%",
    badge: { icon: FiArrowDownRight, text: "-0.5%", tone: "negative" },
    footer: { kind: "description", text: "Target: 13.0% by Q4" },
  },
];

const BADGE_CLASSES: Record<BadgeTone, string> = {
  green: "bg-green/15 text-green",
  neutral: "bg-report-control text-bgray/80",
  negative: "bg-primary/15 text-primary",
};

const rangeOptions: DropdownOption[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "ytd", label: "This Year" },
];

const streamSeries: StreamPoint[] = [
  { day: "MON", fees: 60, service: 30 },
  { day: "TUE", fees: 72, service: 24 },
  { day: "WED", fees: 48, service: 48 },
  { day: "THU", fees: 60, service: 40 },
  { day: "FRI", fees: 48, service: 60 },
  { day: "SAT", fees: 96, service: 20 },
  { day: "SUN", fees: 72, service: 30 },
];

const waterfallRows: WaterfallRow[] = [
  { id: "processing", label: "Processing Fees", value: "-$156k", percent: 8 },
  { id: "discounts", label: "Discounts & Promos", value: "-$240k", percent: 15 },
  { id: "refund", label: "Refund Reserve", value: "-$92k", percent: 5 },
];

const payoutSeries = [
  { week: "W1", days: 16 },
  { week: "W2", days: 18 },
  { week: "W3", days: 30 },
  { week: "W4", days: 36 },
  { week: "W5", days: 40 },
  { week: "W6", days: 39 },
  { week: "W7", days: 47 },
  { week: "W8", days: 47 },
];

const clearanceRows: ClearanceRow[] = [
  {
    id: "c1",
    icon: FiCalendar,
    name: "Giga Arena Tour",
    category: "Ticket Sales",
    amount: "$12,400.00",
    status: "cleared",
  },
  {
    id: "c2",
    icon: FiArchive,
    name: "V-Asset Drop #02",
    category: "Merchant Sales",
    amount: "$8,922.50",
    status: "processing",
  },
  {
    id: "c3",
    icon: FiCreditCard,
    name: "Neon Summit '24",
    category: "Entry Fee",
    amount: "$5,500.00",
    status: "cleared",
  },
];

const STATUS_CLASSES: Record<ClearanceRow["status"], string> = {
  cleared: "bg-green/10 text-green",
  processing: "bg-secondary/10 text-secondary",
};

const SEGMENT_CLASSES = [
  "bg-secondary/50",
  "bg-secondary/50",
  "bg-secondary/50",
  "bg-secondary",
  "bg-report-control",
];



const RevenueAnalyticsPage = () => {
  const payoutGradientId = useId();
  const [rangeValue, setRangeValue] = useState("30d");
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setRangeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const exportReport = () => {
    const rows = [["Metric", "Value"], ...statItems.map((item) => [item.label, item.value])];
    const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "revenue-analytics-preview.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const selectedRange = rangeOptions.find((o) => o.value === rangeValue);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="admin-page-title">
              Revenue Analytics
            </h1>
            <p className="admin-page-description">
              Financial performance and monetization efficiency for MSQUARED Ecosystem.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div ref={rangeRef} className="relative">
              <button
                type="button"
                aria-expanded={rangeOpen}
                onClick={() => setRangeOpen((v) => !v)}
                className="flex items-center gap-2 rounded-sm bg-report-control px-4 py-2 text-xs font-normal text-bgray transition hover:bg-report-control"
              >
                <FiCalendar size={13} />
                {selectedRange?.label}
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
            <button
              type="button"
              onClick={exportReport}
              className="flex items-center gap-2 rounded-sm bg-report-alert px-4 py-2 text-xs font-normal text-grayblue transition hover:bg-secondary/90"
            >
              <FiDownload size={13} />
              Export Report
            </button>
          </div>
        </header>
        <section className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[900px]:grid-cols-4">
          {statItems.map((item) => {
            const BadgeIcon = item.badge.icon;
            return (
              <div key={item.id} className="min-h-[150px] rounded-[4px] bg-report-head p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="max-w-[120px] text-sm leading-5 text-secondary">
                    {item.label}
                  </span>
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs font-normal ${BADGE_CLASSES[item.badge.tone]}`}
                  >
                    <BadgeIcon size={9} />
                    {item.badge.text}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-normal tracking-tight text-bgray">
                  {item.value}
                </p>
                {item.footer.kind === "progress" && (
                  <div className="mt-4 h-1 w-full rounded-full bg-report-control">
                    <div
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${item.footer.percent}%` }}
                    />
                  </div>
                )}
                {item.footer.kind === "description" && (
                  <p className="mt-3 max-w-[130px] text-xs leading-snug text-secondary/80">
                    {item.footer.text}
                  </p>
                )}
                {item.footer.kind === "segments" && (
                  <div className="mt-4 flex gap-1">
                    {SEGMENT_CLASSES.map((cls, index) => (
                      <span key={index} className={`h-1 flex-1 rounded-full ${cls}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
        <section className="mt-5 grid grid-cols-1 gap-5 min-[900px]:grid-cols-3">
          <div className="rounded-[4px] bg-report-head p-5 min-[900px]:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="admin-section-title">
                Revenue Stream& GMV Growth
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                  Platform Fees
                </span>
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-finance-revenue" aria-hidden="true" />
                  Service Sales
                </span>
              </div>
            </div>
            <div className="mt-6 h-64 text-secondary/80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streamSeries} barCategoryGap="10%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                  />
                  <Bar dataKey="fees" stackId="a" className="fill-report-alert" />
                  <Bar dataKey="service" stackId="a" className="fill-finance-revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[4px] bg-report-head p-5">
            <h2 className="admin-section-title">
              Fee Deductions Waterfall
            </h2>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-bgray/80">Gross GMV</span>
                <span className="text-xs font-normal text-bgray">$3,120k</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-report-control">
                <div className="h-full w-full rounded-full bg-analytics-neutral" />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {waterfallRows.map((row) => (
                <div key={row.id} className="pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-bgray/80">{row.label}</span>
                    <span className="text-xs font-normal text-secondary">{row.value}</span>
                  </div>
                  <div className="mt-1.5 flex h-2.5 w-full justify-end overflow-hidden rounded-full bg-report-control">
                    <div
                      className="h-full bg-report-alert"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-normal text-secondary">Net Platform Revenue</span>
              <span className="text-xs font-normal text-secondary">$2,632k</span>
            </div>
          </div>
        </section>
        <section className="mt-5 grid grid-cols-1 gap-5 min-[900px]:grid-cols-[54fr_46fr]">
          <div className="rounded-[4px] bg-report-head p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="admin-section-title">
                Payout Velocity
              </h2>
              <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                <FiClock size={12} aria-hidden="true" />
                Avg. 1.2 days to clearance
              </span>
            </div>
            <div className="mt-6 h-56 text-secondary">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payoutSeries} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={payoutGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 10, className: "fill-secondary" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="days"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    fill={`url(#${payoutGradientId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[4px] bg-report-head p-5">
            <h2 className="admin-section-title">
              High Value Clearances
            </h2>
            <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[320px] text-left">
              <thead>
                <tr>
                  <th className="w-[42%] pb-3 text-[10px] font-normal uppercase tracking-wider text-secondary">
                    Source
                  </th>
                  <th className="w-[33%] pb-3 text-[10px] font-normal uppercase tracking-wider text-secondary">
                    Amount
                  </th>
                  <th className="w-[25%] pb-3 text-right text-[10px] font-normal uppercase tracking-wider text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {clearanceRows.map((row) => {
                  const RowIcon = row.icon;
                  return (
                    <tr key={row.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-report-control text-secondary">
                            <RowIcon size={9} />
                          </span>
                          <div>
                            <p className="max-w-[110px] text-sm font-normal leading-snug text-bgray">
                              {row.name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-secondary/80">
                              {row.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-bgray">{row.amount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block rounded-sm px-2 py-1 text-[10px] font-normal uppercase tracking-wide ${STATUS_CLASSES[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
            <Link
              to="/admin/finance/transactions"
              className="mt-2 block w-full text-center text-xs font-normal text-secondary transition hover:underline"
            >
              View All Ledger Entries
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};




export default RevenueAnalyticsPage;
