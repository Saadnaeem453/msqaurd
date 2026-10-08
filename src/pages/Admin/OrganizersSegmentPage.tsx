import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiMaximize2,
  FiMoreVertical,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { MdCheckCircle } from "react-icons/md";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";

export type StatFooter =
  | { kind: "progress"; percent: number }
  | { kind: "reviews"; note: string; avatars: number }
  | { kind: "segments"; filled: number; total: number };

export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  trend?: string;
  shield?: boolean;
  aside?: string;
  footer: StatFooter;
}

export interface FilterOption {
  value: string;
  label: string;
}

export type OrganizerStatus = "verified" | "pending";

export interface Organizer {
  id: string;
  initials: string;
  name: string;
  orgId: string;
  leadName: string;
  leadEmail: string;
  status: OrganizerStatus;
  eventsHosted: number;
  revenue: string;
}

export interface GrowthPoint {
  month: string;
  events: number;
  isCurrent: boolean;
}

export interface HealthMetric {
  id: string;
  label: string;
  value: string;
  percent: number;
}

const TOTAL_ORGANIZERS = 2842;
const PAGE_SIZE = 25;

const statItems: StatItem[] = [
  {
    id: "total",
    label: "Total Organizers",
    value: "2,842",
    icon: FiUsers,
    trend: "+12%",
    footer: { kind: "progress", percent: 62 },
  },
  {
    id: "verification",
    label: "Verification Rate",
    value: "89.4%",
    icon: HiOutlineCheckBadge,
    shield: true,
    footer: { kind: "reviews", note: "Pending reviews: 142", avatars: 3 },
  },
  {
    id: "volume",
    label: "Active Event Volume",
    value: "14.2k",
    icon: FiZap,
    aside: "Live now",
    footer: { kind: "segments", filled: 2, total: 3 },
  },
];

const segmentOptions: FilterOption[] = [
  { value: "all", label: "All Segments" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

const rangeOptions: FilterOption[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "ytd", label: "This Year" },
];

const organizerRows: Organizer[] = [
  {
    id: "1",
    initials: "NS",
    name: "Nexus Studios",
    orgId: "ORG-99201",
    leadName: "Sarah Chen",
    leadEmail: "sarah.c@nexus.io",
    status: "verified",
    eventsHosted: 156,
    revenue: "$1.2M",
  },
  {
    id: "2",
    initials: "GL",
    name: "Global Live Ent.",
    orgId: "ORG-84722",
    leadName: "Marcus Thorne",
    leadEmail: "m.thorne@gl-live.com",
    status: "verified",
    eventsHosted: 84,
    revenue: "$842k",
  },
  {
    id: "3",
    initials: "VT",
    name: "Vertex Tech Meetups",
    orgId: "ORG-11029",
    leadName: "Elena Rodriguez",
    leadEmail: "elena@vertex.tech",
    status: "pending",
    eventsHosted: 12,
    revenue: "$45k",
  },
  {
    id: "4",
    initials: "SC",
    name: "Sonic Collective",
    orgId: "ORG-33921",
    leadName: "David Wilson",
    leadEmail: "d.wilson@sonic.org",
    status: "verified",
    eventsHosted: 412,
    revenue: "$4.1M",
  },
];

const growthSeries: GrowthPoint[] = [
  { month: "JAN", events: 34, isCurrent: false },
  { month: "FEB", events: 47, isCurrent: false },
  { month: "MAR", events: 41, isCurrent: false },
  { month: "APR", events: 58, isCurrent: false },
  { month: "MAY", events: 53, isCurrent: false },
  { month: "JUN", events: 72, isCurrent: false },
  { month: "JUL", events: 92, isCurrent: true },
];

const healthMetrics: HealthMetric[] = [
  { id: "latency", label: "API Latency", value: "12ms", percent: 98 },
  { id: "payout", label: "Payout Success Rate", value: "99.9%", percent: 99.9 },
];

const StatFooterView = ({ footer }: { footer: StatFooter }) => {
  if (footer.kind === "progress") {
    return (
      <div className="mt-4 h-1 w-full rounded-full bg-bgray/15">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${footer.percent}%` }}
        />
      </div>
    );
  }

  if (footer.kind === "reviews") {
    return (
      <div className="mt-4 flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {Array.from({ length: footer.avatars }).map((_, i) => (
            <span
              key={i}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border_color bg-bgray/10 text-secondary"
            >
              <FiUser size={11} />
            </span>
          ))}
        </div>
        <span className="text-xs text-secondary/70">{footer.note}</span>
      </div>
    );
  }

  return (
    <div className="mt-4 flex gap-1.5">
      {Array.from({ length: footer.total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full ${
            i < footer.filled ? "bg-secondary" : "bg-bgray/15"
          }`}
        />
      ))}
    </div>
  );
};

const StatCard = ({ item }: { item: StatItem }) => {
  const Icon = item.icon;
  return (
    <div className="relative rounded-md border border-secondary/20 bg-lightgrayblue p-4 lg:p-5">
      <div className="flex items-start justify-between">
        <span className="pr-8 text-[11px] font-semibold uppercase tracking-wider text-secondary">
          {item.label}
        </span>
        <Icon aria-hidden="true" size={42} className="absolute right-4 top-4 text-bgray/10" />
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span className="font-jakarta text-3xl font-semibold tracking-tight text-bgray lg:text-4xl">
          {item.value}
        </span>
        {item.trend && (
          <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-green">
            <FiTrendingUp size={12} />
            {item.trend}
          </span>
        )}
        {item.shield && (
          <FiShield size={13} className="mb-1.5 text-secondary/70" />
        )}
        {item.aside && (
          <span className="mb-1 text-xs text-secondary/70">{item.aside}</span>
        )}
      </div>

      <StatFooterView footer={item.footer} />
    </div>
  );
};

interface FilterDropdownProps {
  icon: IconType;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown = ({ icon: Icon, options, value, onChange }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative" onKeyDown={(event) => {
      if (event.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-border_color bg-bgray/5 px-3 py-1.5 text-xs font-medium text-bgray/80 transition hover:bg-bgray/10"
      >
        <Icon size={13} className="text-secondary/70" />
        {selected?.label}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-border_color bg-lightgrayblue py-1 shadow-lg">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                o.value === value ? "font-medium text-bgray" : "text-bgray/80"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  segmentValue: string;
  rangeValue: string;
  onSegmentChange: (value: string) => void;
  onRangeChange: (value: string) => void;
  displayText: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const FilterBar = ({
  segmentValue,
  rangeValue,
  onSegmentChange,
  onRangeChange,
  displayText,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: FilterBarProps) => (
  <div className="flex flex-col gap-3 rounded-md border border-secondary/20 bg-lightgrayblue px-3 py-2.5 md:flex-row md:items-center md:justify-between">
    <div className="flex flex-wrap items-center gap-2">
      <FilterDropdown
        icon={FiFilter}
        options={segmentOptions}
        value={segmentValue}
        onChange={onSegmentChange}
      />
      <FilterDropdown
        icon={FiCalendar}
        options={rangeOptions}
        value={rangeValue}
        onChange={onRangeChange}
      />
    </div>

    <div className="flex items-center gap-3">
      <span className="text-xs text-secondary/70">{displayText}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous page"
          className="rounded-md p-1.5 text-secondary/70 transition hover:bg-bgray/10 hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <FiChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next page"
          className="rounded-md border border-border_color p-1.5 text-bgray/80 transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

const STATUS_STYLES: Record<OrganizerStatus, { label: string; icon: IconType; classes: string }> = {
  verified: {
    label: "Verified",
    icon: MdCheckCircle,
    classes: "bg-green/10 text-green",
  },
  pending: {
    label: "Pending",
    icon: FiClock,
    classes: "bg-secondary/10 text-secondary",
  },
};

const StatusBadge = ({ status }: { status: OrganizerStatus }) => {
  const style = STATUS_STYLES[status];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.classes}`}
    >
      <Icon size={12} />
      {style.label}
    </span>
  );
};

const OrganizersTable = ({ rows }: { rows: Organizer[] }) => (
  <div className="overflow-hidden rounded-md border border-secondary/20 bg-lightgrayblue">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left">
        <thead className="border-b border-secondary/20 bg-bgray/[0.02]">
          <tr>
            {["Organization", "Lead Organizer", "Status", "Events Hosted", "Revenue", "Action"].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-secondary"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="transition hover:bg-bgray/5"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-secondary/20 bg-bgray/10 text-xs font-bold text-secondary">
                    {row.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-bgray">{row.name}</p>
                    <p className="mt-0.5 text-xs text-secondary/70">ID: {row.orgId}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-bgray/90">{row.leadName}</p>
                <p className="mt-0.5 text-xs text-secondary/70">{row.leadEmail}</p>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-4 text-sm text-bgray/80">{row.eventsHosted}</td>
              <td className="px-4 py-4 text-sm font-semibold text-bgray">{row.revenue}</td>
              <td className="px-4 py-4">
                <button
                  type="button"
                  aria-label={`Actions for ${row.name}`}
                  className="rounded p-1 text-secondary/70 transition hover:bg-bgray/10 hover:text-bgray"
                >
                  <FiMoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const GrowthProjectionCard = ({ data }: { data: GrowthPoint[] }) => (
  <div className="rounded-md border border-secondary/20 bg-lightgrayblue p-5">
    <div className="flex items-center justify-between">
      <h2 className="admin-section-title font-jakarta text-base font-semibold text-bgray">
        Growth Projection
      </h2>
      <button
        type="button"
        aria-label="Expand chart"
        className="rounded p-1 text-secondary/70 transition hover:bg-bgray/10 hover:text-bgray"
      >
        <FiMaximize2 size={15} />
      </button>
    </div>

    <div className="mt-5 h-44 text-secondary/70">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="8%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "currentColor" }}
          />
          <Bar dataKey="events">
            {data.map((point) => (
              <Cell
                key={point.month}
                className={point.isCurrent ? "fill-primary" : "fill-bgray/10"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PlatformHealthCard = ({ metrics }: { metrics: HealthMetric[] }) => (
  <div className="rounded-md border border-secondary/20 bg-lightgrayblue p-5">
    <h2 className="admin-section-title font-jakarta text-base font-semibold text-bgray">Platform Health</h2>
    <p className="mt-1 text-xs text-secondary/70">
      System performance across organization clusters is optimal.
    </p>

    <ul className="mt-5 space-y-4">
      {metrics.map((metric) => (
        <li key={metric.id}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-bgray/80">{metric.label}</span>
            <span className="text-sm font-semibold text-green">{metric.value}</span>
          </div>
          <div role="progressbar" aria-label={metric.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metric.percent} className="mt-2 h-1 w-full rounded-full bg-bgray/15">
            <div
              className="h-full rounded-full bg-green"
              style={{ width: `${metric.percent}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const OrganizersSegmentPage = () => {
  const [segmentValue, setSegmentValue] = useState("all");
  const [rangeValue, setRangeValue] = useState("30d");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_ORGANIZERS / PAGE_SIZE);
  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, TOTAL_ORGANIZERS);
  const displayText = `Displaying ${rangeStart}-${rangeEnd} of ${TOTAL_ORGANIZERS.toLocaleString("en-US")}`;

  return (
    <div className="min-h-full bg-grayblue text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">

        <nav className="flex items-center gap-1.5 text-xs">
          <Link to="/admin/users" className="text-secondary transition hover:text-bgray focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
            Users
          </Link>
          <FiChevronRight size={12} className="text-secondary/70" />
          <span className="font-medium text-secondary">Organizers Management</span>
        </nav>

        <header className="mt-3">
          <h1 className="admin-page-title">
            Organizers Segment
          </h1>
          <p className="admin-page-description">
            Monitor and manage institutional partners and independent event hosts.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {statItems.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </section>

        <section className="mt-6">
          <FilterBar
            segmentValue={segmentValue}
            rangeValue={rangeValue}
            onSegmentChange={setSegmentValue}
            onRangeChange={setRangeValue}
            displayText={displayText}
            canPrev={page > 1}
            canNext={page < totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </section>

        <section className="mt-6">
          <OrganizersTable rows={organizerRows} />
        </section>

        <section className="mt-6 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <GrowthProjectionCard data={growthSeries} />
          <PlatformHealthCard metrics={healthMetrics} />
        </section>
      </div>
    </div>
  );
};

export default OrganizersSegmentPage;
