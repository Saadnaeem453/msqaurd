import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiFilter,
  FiMessageSquare,
  FiSearch,
  FiTag,
  FiTrendingDown,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { MdTimer } from "react-icons/md";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon?: IconType;
  dot?: boolean;
  footer: string;
  footerTone: "greenish" | "muted";
  trendIcon?: boolean;
}

interface VolumePoint {
  time: string;
  resolutions: number;
  reports: number;
  remaining: number;
}

interface Moderator {
  id: string;
  initials: string;
  name: string;
  cases: number;
  percent: number;
}

type Severity = "critical" | "high" | "medium";
type QueueTab = "priority" | "recent" | "flags";

interface QueueRow {
  id: string;
  severity: Severity;
  type: string;
  entityIcon: IconType;
  entity: string;
  reporter: string;
  time: string;
  tabs: QueueTab[];
}

const TOTAL_REPORTS = 1284;
const PAGE_SIZE = 4;

const statItems: StatItem[] = [
  {
    id: "backlog",
    label: "Active Backlog",
    value: "1,284",
    icon: FiAlertTriangle,
    footer: "12% from yesterday",
    footerTone: "greenish",
    trendIcon: true,
  },
  {
    id: "critical",
    label: "Critical Tasks",
    value: "42",
    dot: true,
    footer: "Avg. age: 8 mins",
    footerTone: "muted",
  },
  {
    id: "resolution",
    label: "Avg. Resolution",
    value: "14m 22s",
    icon: MdTimer,
    footer: "Target: < 15m",
    footerTone: "muted",
  },
  {
    id: "moderators",
    label: "Moderators Live",
    value: "18 / 24",
    icon: FiUsers,
    footer: "Capacity: 75%",
    footerTone: "muted",
  },
];

const volumeSeries: VolumePoint[] = [
  { time: "00:00", resolutions: 26, reports: 10, remaining: 12 },
  { time: "04:00", resolutions: 38, reports: 12, remaining: 10 },
  { time: "08:00", resolutions: 50, reports: 10, remaining: 12 },
  { time: "12:00", resolutions: 76, reports: 16, remaining: 10 },
  { time: "16:00", resolutions: 32, reports: 6, remaining: 26 },
  { time: "20:00", resolutions: 20, reports: 8, remaining: 24 },
  { time: "23:59", resolutions: 54, reports: 14, remaining: 16 },
];

const moderators: Moderator[] = [
  { id: "m1", initials: "SC", name: "Sarah Chen", cases: 142, percent: 85 },
  { id: "m2", initials: "MK", name: "Marcus Kane", cases: 128, percent: 75 },
  { id: "m3", initials: "JL", name: "Jane Loft", cases: 115, percent: 65 },
  { id: "m4", initials: "AM", name: "Aris M.", cases: 98, percent: 55 },
];

const queueTabs: { id: QueueTab; label: string }[] = [
  { id: "priority", label: "Priority" },
  { id: "recent", label: "Recent" },
  { id: "flags", label: "System Flags" },
];

const queueRows: QueueRow[] = [
  {
    id: "q1",
    severity: "critical",
    type: "Hate Speech (AI Flag)",
    entityIcon: FiMessageSquare,
    entity: "Msg #842-88…",
    reporter: "System-Autobot",
    time: "01:14s",
    tabs: ["priority", "flags"],
  },
  {
    id: "q2",
    severity: "high",
    type: "Harassment",
    entityIcon: FiUser,
    entity: "@user_valkyrie",
    reporter: "@moderator_ai_v2",
    time: "04:22s",
    tabs: ["priority", "recent"],
  },
  {
    id: "q3",
    severity: "medium",
    type: "Spam Content",
    entityIcon: FiTag,
    entity: "Nexus Fest 2024",
    reporter: "5 Community Rpts",
    time: "08:45s",
    tabs: ["priority", "recent", "flags"],
  },
  {
    id: "q4",
    severity: "high",
    type: "Fraudulent Ticket Listing",
    entityIcon: FiCreditCard,
    entity: "Order #90112",
    reporter: "Stripe Guard",
    time: "12:01s",
    tabs: ["priority", "flags"],
  },
];

const SEVERITY_CLASSES: Record<Severity, string> = {
  critical: "border border-primary/40 bg-primary/15 text-secondary",
  high: "border border-report-amber/20 bg-report-amber/15 text-report-amber",
  medium: "border border-report-blue/20 bg-report-blue/15 text-report-blue",
};

const BacklogOverviewPage = () => {
  const [activeTab, setActiveTab] = useState<QueueTab>("priority");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [criticalOnly, setCriticalOnly] = useState(false);

  const visibleRows = useMemo(() => {
    const byTab = queueRows.filter((row) => row.tabs.includes(activeTab) && (!criticalOnly || row.severity === "critical"));
    const lowered = query.trim().toLowerCase();
    return lowered
      ? byTab.filter(
          (row) =>
            row.type.toLowerCase().includes(lowered) ||
            row.entity.toLowerCase().includes(lowered) ||
            row.reporter.toLowerCase().includes(lowered),
        )
      : byTab;
  }, [activeTab, query, criticalOnly]);

  const totalPages = Math.ceil(TOTAL_REPORTS / PAGE_SIZE);

  return (
    <div className="min-h-full bg-grayblue font-jakarta font-normal text-bgray">
      <div className="admin-page ">

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="admin-page-title">
              Backlog Overview
            </h1>
            <p className="admin-page-description">
              Real-time monitoring of reported content and user behavioral alerts.
            </p>
          </div>
          <button
            type="button"
            className="flex w-fit items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-normal uppercase tracking-wide text-bgray transition hover:bg-primary/90"
          >
            <FiZap size={14} />
            Start Triage
          </button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-2.5 min-[600px]:grid-cols-4">
          {statItems.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="rounded-[3px] border border-bgray/5 bg-backlog-panel p-4">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-normal uppercase tracking-wider text-bgray/80">
                    {stat.label}
                  </span>
                  {stat.dot && (
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  )}
                  {Icon && <Icon size={16} className="text-secondary" />}
                </div>
                <p className="mt-2 text-2xl font-normal tracking-tight text-bgray">
                  {stat.value}
                </p>
                <p
                  className={`mt-2 flex items-center gap-1.5 text-xs ${
                    stat.footerTone === "greenish"
                      ? "font-normal text-green"
                      : "text-secondary/70"
                  }`}
                >
                  {stat.trendIcon && <FiTrendingDown size={11} />}
                  {stat.footer}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-3 min-[600px]:grid-cols-3">

          <div className="rounded-[3px] border border-bgray/5 bg-backlog-panel p-5 min-[600px]:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
                Report Volume (24h)
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  Reports
                </span>
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-bgray" aria-hidden="true" />
                  Resolutions
                </span>
              </div>
            </div>

            <div className="mt-5 h-52 text-secondary/70">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumeSeries}
                  barCategoryGap="5%"
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "currentColor" }}
                  />
                  <Bar dataKey="resolutions" stackId="a" className="fill-backlog-resolution" />
                  <Bar dataKey="reports" stackId="a" className="fill-backlog-reports" />
                  <Bar dataKey="remaining" stackId="a" className="fill-backlog-cap" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[3px] border border-bgray/5 bg-backlog-panel p-5">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Top Moderators
            </h2>
            <ul className="mt-4 space-y-4">
              {moderators.map((mod) => (
                <li key={mod.id} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-report-control text-xs font-normal text-secondary">
                    {mod.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-xs text-bgray">{mod.name}</span>
                      <span className="shrink-0 text-xs text-bgray/80">
                        {mod.cases} cases
                      </span>
                    </div>
                    <div className="mt-1.5 h-0.5 w-full rounded-full bg-report-control">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${mod.percent}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-5 w-full rounded-md border border-bgray/5 py-2 text-xs font-normal uppercase tracking-wider text-bgray/80 transition hover:bg-report-control hover:text-bgray"
            >
              View All Analytics
            </button>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[3px] border border-bgray/5 bg-backlog-panel">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Active Moderation Queue
            </h2>
            <div className="flex rounded-md bg-grayblue p-1">
              {queueTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded px-3 py-1.5 text-xs font-normal transition ${
                    activeTab === tab.id
                      ? "bg-report-control text-bgray"
                      : "text-secondary/70 hover:text-bgray"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <FiSearch
                  size={12}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary/70"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="w-40 rounded-md bg-backlog-head py-2 pl-8 pr-3 text-xs text-bgray placeholder:text-secondary/70 focus:outline-none"
                />
              </div>
              <button
                type="button"
                aria-label="Show critical cases only"
                aria-pressed={criticalOnly}
                onClick={() => { setCriticalOnly((value) => !value); setCurrentPage(1); }}
                className="rounded-md p-2 text-bgray/80 transition hover:bg-report-control hover:text-bgray"
              >
                <FiFilter size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] table-fixed text-left">
              <thead>
                <tr className="bg-backlog-head">
                  <th className="w-[12%] px-5 py-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Severity
                  </th>
                  <th className="w-[20%] px-4 py-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Type
                  </th>
                  <th className="w-[20%] px-4 py-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Target Entity
                  </th>
                  <th className="w-[18%] px-4 py-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Reporter
                  </th>
                  <th className="w-[15%] px-4 py-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Time in Queue
                  </th>
                  <th className="w-[15%] px-4 py-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const EntityIcon = row.entityIcon;
                  return (
                    <tr key={row.id} className="border-t border-bgray/[0.02]">
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-sm px-2 py-1 text-[10px] font-normal uppercase tracking-wide ${SEVERITY_CLASSES[row.severity]}`}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block max-w-[170px] text-sm leading-snug text-bgray/90">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-report-control text-bgray/70">
                            <EntityIcon size={9} />
                          </span>
                          <span className="block max-w-[140px] text-sm leading-snug text-bgray/90">
                            {row.entity}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block max-w-[160px] text-sm leading-snug text-bgray/90">
                          {row.reporter}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-normal text-secondary">{row.time}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="max-w-[60px] text-left text-xs font-normal leading-snug text-secondary transition hover:underline"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-bgray/[0.02] px-5 py-3.5">
            <p className="text-xs text-secondary/70">
              Showing {visibleRows.length} of {TOTAL_REPORTS.toLocaleString("en-US")} reports
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 text-secondary/70 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={13} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded p-1 text-secondary/70 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BacklogOverviewPage;
