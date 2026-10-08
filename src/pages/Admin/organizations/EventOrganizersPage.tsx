import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiShare2,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiFilter,
  FiMoreVertical,
  FiStar,
  FiUserPlus,
} from "react-icons/fi";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  icon: IconType;
  iconClasses: string;
  badge: string;
  badgeClasses: string;
  label: string;
  value: string;
}

type OrganizerStatus = "verified" | "trial" | "review";

interface OrganizerRow {
  id: string;
  name: string;
  orgId: string;
  revenue: string;
  events: number;
  rating: string;
  reviews: string;
  status: OrganizerStatus;
}

interface ActivityItem {
  id: string;
  icon: IconType;
  iconClasses: string;
  title: string;
  titleClasses: string;
  description: string;
  time: string;
}

interface GrowthStat {
  id: string;
  label: string;
  value: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  {
    id: "revenue",
    icon: FiCreditCard,
    iconClasses: "bg-secondary/20 text-secondary",
    badge: "+12.4%",
    badgeClasses: "bg-green/15 text-green",
    label: "Total Revenue",
    value: "$4,289,500",
  },
  {
    id: "events",
    icon: FiCalendar,
    iconClasses: "bg-bgray/10 text-bgray/70",
    badge: "Active",
    badgeClasses: "bg-bgray/10 text-bgray/80",
    label: "Event Count",
    value: "1,204",
  },
  {
    id: "review",
    icon: FiStar,
    iconClasses: "bg-report-blue/10 text-report-blue",
    badge: "Top Rated",
    badgeClasses: "bg-report-blue/10 text-report-blue",
    label: "Avg. User Review",
    value: "4.82/5.0",
  },
  {
    id: "throughput",
    icon: FiShare2,
    iconClasses: "bg-secondary/15 text-secondary",
    badge: "Peak",
    badgeClasses: "bg-secondary/15 text-secondary",
    label: "Platform Throughput",
    value: "98.2%",
  },
];

const organizerRows: OrganizerRow[] = [
  {
    id: "o1",
    name: "Nebula Studios",
    orgId: "#ORG-8821",
    revenue: "$1,240,500.00",
    events: 142,
    rating: "4.9",
    reviews: "(2.4k reviews)",
    status: "verified",
  },
  {
    id: "o2",
    name: "Kinetic Collective",
    orgId: "#ORG-9214",
    revenue: "$892,300.00",
    events: 88,
    rating: "4.7",
    reviews: "(1.1k reviews)",
    status: "verified",
  },
  {
    id: "o3",
    name: "Vertex Agency",
    orgId: "#ORG-1150",
    revenue: "$412,000.00",
    events: 54,
    rating: "4.5",
    reviews: "(890 reviews)",
    status: "trial",
  },
  {
    id: "o4",
    name: "Echo Media",
    orgId: "#ORG-5532",
    revenue: "$215,900.00",
    events: 22,
    rating: "4.2",
    reviews: "(154 reviews)",
    status: "review",
  },
];

const STATUS_BADGES: Record<OrganizerStatus, { label: string; classes: string }> = {
  verified: { label: "Verified", classes: "border-green/20 bg-green/10 text-green" },
  trial: { label: "Trial", classes: "border-report-blue/20 bg-report-blue/10 text-report-blue" },
  review: { label: "Review", classes: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400" },
};

const activityItems: ActivityItem[] = [
  {
    id: "a1",
    icon: FiUserPlus,
    iconClasses: "bg-primary/15 text-secondary",
    title: "New Organizer Registered",
    titleClasses: "text-secondary",
    description: "Pulse Events joined the platform.",
    time: "2 minutes ago",
  },
  {
    id: "a2",
    icon: FiDollarSign,
    iconClasses: "bg-green/15 text-green",
    title: "Payout Disbursed",
    titleClasses: "text-green",
    description: "$45,000 sent to Nebula Studios.",
    time: "1 hour ago",
  },
  {
    id: "a3",
    icon: FiAlertTriangle,
    iconClasses: "bg-primary/15 text-primary",
    title: "Audit Alert",
    titleClasses: "text-primary",
    description: "Unusual traffic detected for Echo Media.",
    time: "3 hours ago",
  },
];

const growthStats: GrowthStat[] = [
  { id: "g1", label: "Peak Growth", value: "+28%" },
  { id: "g2", label: "Conversion", value: "14.2%" },
  { id: "g3", label: "Retention", value: "92%" },
];

const rangeOptions: DropdownOption[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

const PAGE_NUMBERS = [1, 2, 3];
const TOTAL_PAGES = 26;

/* ============================= Page ============================= */

const EventOrganizersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rangeValue, setRangeValue] = useState("30d");
  const [rangeOpen, setRangeOpen] = useState(false);

  const selectedRange = rangeOptions.find((o) => o.value === rangeValue);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-bgray lg:text-3xl">
              Event Organizers
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-secondary">
              Direct management and performance auditing for platform partners.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-[#1d222c] px-4 py-2 text-xs font-normal text-bgray transition hover:bg-bgray/15"
            >
              <FiFilter size={12} />
              Filters
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-[#1d222c] px-4 py-2 text-xs font-normal text-bgray transition hover:bg-bgray/15"
            >
              <FiDownload size={12} />
              Export CSV
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-sm border border-bgray/5 bg-[#1d1e26] p-4">
                <div className="flex items-start justify-between">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-sm ${item.iconClasses}`}>
                    <Icon size={14} />
                  </span>
                  <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${item.badgeClasses}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="mt-4 text-[9px] font-normal uppercase tracking-wider text-secondary">
                  {item.label}
                </p>
                <p className="mt-1 text-xl font-medium tracking-tight text-bgray">{item.value}</p>
              </div>
            );
          })}
        </section>

        {/* Directory table */}
        <section className="mt-7 overflow-hidden rounded-sm border border-bgray/5 bg-[#151c24]">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1c242e] px-5 py-4">
            <h2 className="text-xs font-medium text-bgray">
              Active Organizers Directory
            </h2>
            <span className="text-[9px] text-secondary/35">Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, 254)} of 254 partners</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed text-left">
              <thead>
                <tr className="bg-[#242b35]">
                  <th className="w-[26%] px-5 py-3 text-[9px] font-semibold uppercase tracking-widest text-bgray">
                    Organizer Name
                  </th>
                  <th className="w-[18%] px-4 py-3 text-[9px] font-semibold uppercase tracking-widest text-bgray">
                    Revenue Generated
                  </th>
                  <th className="w-[12%] px-4 py-3 text-[9px] font-semibold uppercase tracking-widest text-bgray">
                    Event Count
                  </th>
                  <th className="w-[20%] px-4 py-3 text-[9px] font-semibold uppercase tracking-widest text-bgray">
                    User Reviews
                  </th>
                  <th className="w-[14%] px-4 py-3 text-[9px] font-semibold uppercase tracking-widest text-bgray">
                    Status
                  </th>
                  <th className="w-[10%] px-4 py-3 text-[9px] font-semibold uppercase tracking-widest text-bgray">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {organizerRows.map((row) => {
                  const badge = STATUS_BADGES[row.status];
                  return (
                    <tr key={row.id} className="border-t border-bgray/[0.025] odd:bg-[#1a222c] transition hover:bg-bgray/5">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {/* Logo placeholder — swap for <img> on API integration */}
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#080e12] text-secondary/70">
                            <FiShare2 size={12} />
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-bgray">{row.name}</p>
                            <p className="mt-0.5 text-[9px] text-secondary/35">ID: {row.orgId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-bgray">{row.revenue}</td>
                      <td className="px-4 py-4 text-xs text-bgray">{row.events}</td>
                      <td className="px-4 py-4">
                        <span className="flex items-baseline gap-1">
                          <FiStar size={10} className="fill-secondary text-secondary" />
                          <span className="text-xs font-semibold text-bgray">{row.rating}</span>
                          <span className="text-[8px] text-secondary/35">{row.reviews}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          aria-label={`Actions for ${row.name}`}
                          className="rounded p-1.5 text-secondary/35 transition hover:bg-bgray/10 hover:text-bgray"
                        >
                          <FiMoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
            <span className="text-[10px] text-secondary/35">Page {currentPage} of {TOTAL_PAGES}</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-secondary/35 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={12} />
              </button>
              {PAGE_NUMBERS.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold transition ${
                    page === currentPage
                      ? "bg-bgray/15 text-bgray"
                      : "text-secondary/35 hover:bg-bgray/10 hover:text-bgray"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === TOTAL_PAGES}
                onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-bgray transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight size={12} />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2.1fr]">
          {/* Recent activities */}
          <div className="flex min-h-[350px] flex-col rounded-sm border border-bgray/5 bg-[#1d1e26] p-5">
            <h2 className="text-base font-medium text-bgray">
              Recent Activities
            </h2>
            <ul className="mt-4 space-y-4">
              {activityItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.iconClasses}`}>
                      <ItemIcon size={12} />
                    </span>
                    <div>
                      <p className={`text-xs font-semibold text-bgray`}>{item.title}</p>
                      <p className="mt-0.5 text-[9px] text-secondary/35">{item.description}</p>
                      <p className="mt-1 text-[8px] uppercase tracking-wide text-secondary/35">
                        {item.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-auto pt-5 text-center text-[9px] font-semibold uppercase tracking-widest text-bgray transition hover:underline"
            >
              View Full Logs
            </button>
          </div>

          {/* Growth & performance */}
          <div className="flex min-h-[350px] flex-col rounded-sm border border-bgray/5 bg-[#1d1e26] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-medium text-bgray">
                Growth &amp; Performance
              </h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRangeOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-normal text-secondary transition hover:bg-bgray/15"
                >
                  {selectedRange?.label}
                  <FiChevronDown size={10} className="text-secondary/35" />
                </button>
                {rangeOpen && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-md border border-border_color bg-[#1d1e26] py-1 shadow-lg">
                    {rangeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setRangeValue(option.value);
                          setRangeOpen(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-[10px] transition hover:bg-bgray/10 ${
                          option.value === rangeValue
                            ? "font-medium text-bgray"
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

            {/* Chart canvas renders empty in the Figma export — reserved space kept verbatim */}
            <div className="min-h-[230px] flex-1" aria-hidden="true" />

            <div className="mt-4 grid grid-cols-3 gap-4">
              {growthStats.map((stat) => (
                <div key={stat.id} className="border-l border-secondary/40 pl-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-secondary/35">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-bgray">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventOrganizersPage;