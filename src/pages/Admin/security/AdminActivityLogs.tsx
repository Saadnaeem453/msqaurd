import { useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiGrid,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  valueTone: "light" | "primary";
  aside?: { icon?: "trend" | "alert"; text: string; tone: "green" | "primary" | "muted" };
  bar?: number;
}

interface LogRow {
  id: string;
  time: string;
  admin: string;
  initials: string;
  category: string;
  categoryTone: "critical" | "neutral";
  description: string;
  ip: string;
  dot: "primary" | "green";
  rowTone?: "critical";
}

interface WatcherRow {
  id: string;
  name: string;
  status: string;
  dotClass: string;
  muted: boolean;
  statusClass: string;
}

interface IntensityBar {
  id: string;
  value: number;
  critical: boolean;
}

interface FilterChip {
  id: "time" | "category" | "severity";
  icon: typeof FiCalendar;
  options: { value: string; label: string }[];
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  {
    id: "logs",
    label: "Total Logs (24h)",
    value: "142,891",
    valueTone: "light",
    aside: { icon: "trend", text: "+12%", tone: "green" },
  },
  {
    id: "critical",
    label: "Critical Actions",
    value: "42",
    valueTone: "primary",
    aside: { icon: "alert", text: "Check Required", tone: "primary" },
  },
  {
    id: "admins",
    label: "Unique Admins",
    value: "18",
    valueTone: "light",
    aside: { text: "Active Session", tone: "muted" },
  },
  {
    id: "latency",
    label: "Cluster Latency",
    value: "14ms",
    valueTone: "light",
    aside: { text: "Nominal", tone: "muted" },
    bar: 92,
  },
];

const filterChips: FilterChip[] = [
  {
    id: "time",
    icon: FiCalendar,
    options: [
      { value: "24h", label: "Last 24 Hours" },
      { value: "7d", label: "Last 7 Days" },
      { value: "30d", label: "Last 30 Days" },
    ],
  },
  {
    id: "category",
    icon: FiGrid,
    options: [
      { value: "all", label: "All Categories" },
      { value: "system", label: "System Override" },
      { value: "user", label: "User Management" },
      { value: "finance", label: "Finance Audit" },
      { value: "security", label: "Security Alert" },
      { value: "config", label: "Config Change" },
    ],
  },
  {
    id: "severity",
    icon: FiShield,
    options: [
      { value: "all", label: "Severity: All" },
      { value: "critical", label: "Severity: Critical" },
      { value: "warning", label: "Severity: Warning" },
      { value: "info", label: "Severity: Info" },
    ],
  },
];

const logRows: LogRow[] = [
  {
    id: "l1",
    time: "2024-05-24 14:22:10",
    admin: "s_roberts",
    initials: "SR",
    category: "SYSTEM_OVERRIDE",
    categoryTone: "critical",
    description: "Bulk deletion of 45 inactive event instances in shard-02",
    ip: "192.168.1.44",
    dot: "primary",
    rowTone: "critical",
  },
  {
    id: "l2",
    time: "2024-05-24 14:18:55",
    admin: "a_miller",
    initials: "AM",
    category: "USER_MANAGEMENT",
    categoryTone: "neutral",
    description: "Updated permission level for user_ID: 88291 (Viewer → Editor)",
    ip: "172.16.25.9",
    dot: "green",
  },
  {
    id: "l3",
    time: "2024-05-24 14:15:02",
    admin: "t_davis",
    initials: "TD",
    category: "FINANCE_AUDIT",
    categoryTone: "neutral",
    description: "Manual refund processed for TXN_440291-B ($1,250.00)",
    ip: "82.145.2.101",
    dot: "green",
  },
  {
    id: "l4",
    time: "2024-05-24 14:02:44",
    admin: "root_admin",
    initials: "RA",
    category: "SECURITY_ALERT",
    categoryTone: "critical",
    description: "Failed MFA attempt from unrecognized location (Kiev, UA)",
    ip: "91.200.42.7",
    dot: "primary",
  },
  {
    id: "l5",
    time: "2024-05-24 13:58:22",
    admin: "j_kim",
    initials: "JK",
    category: "CONFIG_CHANGE",
    categoryTone: "neutral",
    description: "Global API rate limit increased from 10k to 15k req/min",
    ip: "104.22.1.5",
    dot: "green",
  },
];

const watchers: WatcherRow[] = [
  { id: "w1", name: "Admin-Console-US-East", status: "ACTIVE", dotClass: "bg-green", muted: false, statusClass: "text-bgray" },
  { id: "w2", name: "Security-Orchestrator", status: "ACTIVE", dotClass: "bg-green", muted: false, statusClass: "text-bgray" },
  { id: "w3", name: "Compliance-Mirror-01", status: "IDLE", dotClass: "bg-bgray/40", muted: true, statusClass: "text-bgray/60" },
  { id: "w4", name: "Root-Audit-Service", status: "WATCHING", dotClass: "bg-secondary", muted: false, statusClass: "text-secondary" },
];

const intensityBars: IntensityBar[] = [
  { id: "b1", value: 30, critical: false },
  { id: "b2", value: 45, critical: false },
  { id: "b3", value: 38, critical: false },
  { id: "b4", value: 60, critical: false },
  { id: "b5", value: 95, critical: true },
  { id: "b6", value: 52, critical: false },
  { id: "b7", value: 28, critical: false },
  { id: "b8", value: 20, critical: false },
  { id: "b9", value: 40, critical: false },
  { id: "b10", value: 65, critical: false },
  { id: "b11", value: 45, critical: false },
  { id: "b12", value: 97, critical: true },
  { id: "b13", value: 58, critical: false },
  { id: "b14", value: 32, critical: false },
];

const PAGE_ITEMS: (number | "ellipsis")[] = [1, 2, 3, "ellipsis", 2858];

/* ============================= Page ============================= */

const AdminActivityLogs = () => {
  const [filters, setFilters] = useState<Record<FilterChip["id"], string>>({
    time: "24h",
    category: "all",
    severity: "all",
  });
  const [openChip, setOpenChip] = useState<FilterChip["id"] | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [page, setPage] = useState(1);

  const setFilter = (id: FilterChip["id"], value: string) =>
    setFilters((prev) => ({ ...prev, [id]: value }));

  const labelFor = (chip: FilterChip) => chip.options.find((o) => o.value === filters[chip.id])?.label;

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">Platform Activity Log</h1>
            <p className="mt-2 text-sm leading-relaxed text-secondary/80">
              Real-time surveillance of all administrative operations across the global cluster.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-bgray/10 px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
            >
              <FiDownload size={13} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => toast.success("Stream refreshed — 0 new entries.")}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiRefreshCw size={13} />
              Refresh Stream
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => (
            <div key={item.id} className="rounded-md bg-[#151c24] p-4">
              <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                {item.label}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className={`text-xl font-bold ${item.valueTone === "primary" ? "text-primary" : "text-bgray"}`}>
                  {item.value}
                </p>
                {item.aside && (
                  <span
                    className={`flex items-center gap-1 text-[10px] font-semibold ${
                      item.aside.tone === "green"
                        ? "text-green"
                        : item.aside.tone === "primary"
                          ? "text-primary"
                          : "text-bgray/70"
                    }`}
                  >
                    {item.aside.icon === "trend" && <FiTrendingUp size={11} />}
                    {item.aside.icon === "alert" && <FiAlertTriangle size={10} />}
                    {item.aside.text}
                  </span>
                )}
              </div>
              {item.bar !== undefined && (
                <div className="mt-3 h-1 w-full rounded-full bg-bgray/15">
                  <div className="h-full rounded-full bg-green" style={{ width: `${item.bar}%` }} />
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Filter bar */}
        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-md bg-[#151c24] px-4 py-3">
          {filterChips.map((chip) => {
            const ChipIcon = chip.icon;
            return (
              <div key={chip.id} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenChip(openChip === chip.id ? null : chip.id)}
                  className="flex items-center gap-2 rounded-md bg-bgray/10 px-3 py-2 text-xs text-bgray transition hover:bg-bgray/15"
                >
                  <ChipIcon size={12} className="text-secondary/80" />
                  {labelFor(chip)}
                  <FiChevronDown size={11} className="text-bgray/60" />
                </button>
                {openChip === chip.id && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                    {chip.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFilter(chip.id, option.value);
                          setOpenChip(null);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                          option.value === filters[chip.id] ? "font-medium text-bgray" : "text-bgray/80"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-bgray/80">Auto-refresh</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoRefresh}
              aria-label="Auto-refresh"
              onClick={() => setAutoRefresh((v) => !v)}
              className={`relative h-3.5 w-6 shrink-0 rounded-full transition ${autoRefresh ? "bg-primary" : "bg-bgray/25"}`}
            >
              <span
                className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-bgray transition-all ${
                  autoRefresh ? "left-3" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Log table */}
        <section className="mt-4 overflow-hidden rounded-md bg-[#151c24]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  {["Timestamp", "Admin User", "Category", "Action Description", "IP Address"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-secondary/80"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-t border-bgray/5 ${row.rowTone === "critical" ? "bg-primary/10" : ""}`}
                  >
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-xs text-bgray/90">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.dot === "primary" ? "bg-primary" : "bg-green"}`}
                          aria-hidden="true"
                        />
                        {row.time}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-xs text-bgray/90">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-bgray/10 text-[10px] font-bold text-bgray/80">
                          {row.initials}
                        </span>
                        {row.admin}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-sm px-2 py-1 text-[10px] font-bold tracking-wide ${
                          row.categoryTone === "critical" ? "bg-primary/15 text-primary" : "bg-bgray/10 text-bgray/80"
                        }`}
                      >
                        {row.category}
                      </span>
                    </td>
                    <td className="max-w-[360px] px-4 py-4 text-xs text-bgray/90">{row.description}</td>
                    <td className="px-4 py-4 text-xs text-bgray/70">{row.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-xs text-bgray/70">
              Showing 1-50 of <span className="font-bold text-bgray">142,891</span> entries
            </p>
            <nav aria-label="Log pagination" className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 text-bgray/60 transition hover:text-bgray disabled:opacity-40"
              >
                <FiChevronLeft size={12} />
              </button>
              {PAGE_ITEMS.map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`e${index}`} className="px-1 text-xs text-bgray/60">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    aria-current={page === item ? "page" : undefined}
                    onClick={() => setPage(item)}
                    className={`h-7 w-7 rounded-sm text-xs font-semibold transition ${
                      page === item ? "bg-primary text-bgray" : "text-bgray/70 hover:bg-bgray/10"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next page"
                disabled={page === 2858}
                onClick={() => setPage((p) => Math.min(2858, p + 1))}
                className="rounded p-1 text-bgray/70 transition hover:text-bgray disabled:opacity-40"
              >
                <FiChevronRight size={12} />
              </button>
            </nav>
          </div>
        </section>

        {/* Bottom row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          {/* Activity intensity pattern */}
          <section className="rounded-md bg-[#151c24] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-bgray">Activity Intensity Pattern</h2>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                  Critical
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-bgray/40" aria-hidden="true" />
                  Routine
                </span>
              </div>
            </div>
            <div className="mt-5 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intensityBars} barCategoryGap="28%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="fadeCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e9bcb6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#e9bcb6" stopOpacity={0.15} />
                    </linearGradient>
                    <linearGradient id="fadeRoutine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8d9296" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#8d9296" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="id" hide />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {intensityBars.map((bar) => (
                      <Cell key={bar.id} fill={bar.critical ? "url(#fadeCritical)" : "url(#fadeRoutine)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Active watchers */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="text-sm font-medium text-bgray">Active Watchers</h2>
            <ul className="mt-4 space-y-4">
              {watchers.map((watcher) => (
                <li key={watcher.id} className="flex items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${watcher.dotClass}`} aria-hidden="true" />
                  <span className={`flex-1 text-xs ${watcher.muted ? "text-bgray/60" : "text-bgray/90"}`}>
                    {watcher.name}
                  </span>
                  <span className={`text-[10px] font-semibold tracking-wide ${watcher.statusClass}`}>
                    {watcher.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityLogs;