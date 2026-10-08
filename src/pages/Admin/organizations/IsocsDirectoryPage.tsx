import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiFilter,
  FiMoreVertical,
  FiPlus,
  FiSend,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  footer: string;
  footerTone: "greenish" | "muted" | "secondary";
  spark?: boolean;
}

interface SparkPoint {
  id: string;
  value: number;
  peak: boolean;
}

interface SocietyRow {
  id: string;
  initial: string;
  name: string;
  region: string;
  president: string;
  presidentInitials: string;
  members: string;
  engagement: number;
}

interface ActivityItem {
  id: string;
  icon: IconType;
  iconClasses: string;
  title: string;
  meta: string;
}

interface RegionStat {
  id: string;
  label: string;
  percent: number;
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  {
    id: "isocs",
    label: "Total ISOCs",
    value: "142",
    icon: MdBusiness,
    footer: "+12 this semester",
    footerTone: "greenish",
  },
  {
    id: "members",
    label: "Active Members",
    value: "12,482",
    icon: FiUsers,
    footer: "Avg 88 members/org",
    footerTone: "muted",
  },
  {
    id: "peak",
    label: "High Engagement Peak",
    value: "King's College London",
    icon: FiUsers,
    footer: "98% Weekly Active Rate",
    footerTone: "secondary",
    spark: true,
  },
];

const sparkSeries: SparkPoint[] = [
  { id: "s1", value: 30, peak: false },
  { id: "s2", value: 45, peak: false },
  { id: "s3", value: 38, peak: false },
  { id: "s4", value: 52, peak: false },
  { id: "s5", value: 40, peak: false },
  { id: "s6", value: 58, peak: false },
  { id: "s7", value: 46, peak: false },
  { id: "s8", value: 70, peak: true },
];

const filterChips = [
  { id: "region", label: "Region: All" },
  { id: "status", label: "Status: Active" },
];

const societyRows: SocietyRow[] = [
  {
    id: "u1",
    initial: "U",
    name: "UCL ISOC",
    region: "London, SE",
    president: "Omar Farooq",
    presidentInitials: "OF",
    members: "1,452",
    engagement: 92,
  },
  {
    id: "u2",
    initial: "M",
    name: "Manchester ISOC",
    region: "Manchester, NW",
    president: "Zahra Ahmed",
    presidentInitials: "ZA",
    members: "2,104",
    engagement: 89,
  },
  {
    id: "u3",
    initial: "B",
    name: "Birmingham ISOC",
    region: "Birmingham, WM",
    president: "Hamza Malik",
    presidentInitials: "HM",
    members: "1,890",
    engagement: 76,
  },
  {
    id: "u4",
    initial: "E",
    name: "Edinburgh ISOC",
    region: "Edinburgh, SCO",
    president: "Layla Yusuf",
    presidentInitials: "LY",
    members: "742",
    engagement: 84,
  },
];

const activityItems: ActivityItem[] = [
  {
    id: "a1",
    icon: FiUserPlus,
    iconClasses: "bg-primary/15 text-secondary",
    title: "New President Elected at Leeds ISOC",
    meta: "2 hours ago • by System Automator",
  },
  {
    id: "a2",
    icon: FiSend,
    iconClasses: "bg-report-blue/10 text-report-blue",
    title: "Charity Week Campaign Launched by 42 ISOCs",
    meta: "6 hours ago • Global Event Anchor",
  },
  {
    id: "a3",
    icon: FiAlertTriangle,
    iconClasses: "bg-primary/15 text-secondary",
    title: "Low Engagement Warning for Exeter ISOC",
    meta: "14 hours ago • Threshold reached (<15% active)",
  },
];

const regionStats: RegionStat[] = [
  { id: "r1", label: "London & SE", percent: 42 },
  { id: "r2", label: "Midlands", percent: 21 },
  { id: "r3", label: "North & Scotland", percent: 28 },
  { id: "r4", label: "Wales & SW", percent: 9 },
];

const PAGE_NUMBERS = [1, 2, 3];

/* ============================= Page ============================= */

const IsocsDirectoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // 142 societies / 10 per page (server-side total)

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-bgray lg:text-3xl">
              ISOCs Directory
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-secondary">
              Management and monitoring of active Islamic Societies across the platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-sm bg-[#242b35] px-4 py-2 text-xs font-normal text-bgray transition hover:bg-bgray/15"
            >
              Export CSV
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-normal text-white transition hover:bg-primary/90"
            >
              <FiPlus size={12} />
              Add Society
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr]">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative min-h-[98px] rounded-md border border-bgray/[0.02] bg-[#151c24] p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] text-secondary">{item.label}</span>
                  {!item.spark && <Icon size={16} className="shrink-0 text-secondary" />}
                </div>
                <p
                  className={`mt-1 font-medium tracking-tight text-bgray ${
                    item.spark ? "mr-28 text-lg leading-snug" : "text-xl"
                  }`}
                >
                  {item.value}
                </p>
                <p
                  className={`mt-1 text-[10px] ${
                    item.footerTone === "greenish"
                      ? "font-semibold text-green"
                      : item.footerTone === "secondary"
                        ? "text-secondary"
                        : "text-secondary/65"
                  }`}
                >
                  {item.footer}
                </p>
                {item.spark && (
                  <div className="absolute right-4 top-1/2 h-12 w-24 -translate-y-1/2 rounded-sm border-y border-bgray/5 bg-[#252b34] pt-3 text-secondary/65">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sparkSeries} barCategoryGap="25%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Bar dataKey="value">
                          {sparkSeries.map((point) => (
                            <Cell
                              key={point.id}
                              className={point.peak ? "fill-secondary" : "fill-secondary/40"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Registered societies */}
        <section className="mt-6 overflow-hidden rounded-sm bg-[#080f15]">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#151c24] px-5 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-base font-medium text-bgray">
                Registered Societies
              </h2>
              <div className="flex items-center gap-1.5">
                {filterChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="rounded-sm bg-[#242b35] px-2 py-1 text-[8px] font-medium uppercase tracking-wide text-secondary"
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Filter" className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                <FiFilter size={13} />
              </button>
              <button type="button" aria-label="More options" className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                <FiMoreVertical size={13} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] table-fixed text-left">
              <thead>
                <tr className="bg-[#0e151d]">
                  <th className="w-[26%] px-5 py-3 text-[10px] font-medium uppercase tracking-widest text-secondary/80">
                    University / Region
                  </th>
                  <th className="w-[22%] px-4 py-3 text-[10px] font-medium uppercase tracking-widest text-secondary/80">
                    Current President
                  </th>
                  <th className="w-[16%] px-4 py-3 text-[10px] font-medium uppercase tracking-widest text-secondary/80">
                    Member Count
                  </th>
                  <th className="w-[24%] px-4 py-3 text-[10px] font-medium uppercase tracking-widest text-secondary/80">
                    Engagement Score
                  </th>
                  <th className="w-[12%] px-4 py-3 text-[10px] font-medium uppercase tracking-widest text-secondary/80">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {societyRows.map((row) => (
                  <tr key={row.id} className="border-t border-bgray/[0.015] transition hover:bg-bgray/[0.025]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#242b35] text-sm font-semibold text-secondary">
                          {row.initial}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-bgray">{row.name}</p>
                          <p className="mt-0.5 text-[9px] text-secondary/65">{row.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-bgray/10 text-[6px] font-bold text-bgray/80">
                          {row.presidentInitials}
                        </span>
                        <span className="text-xs text-bgray/90">{row.president}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-bgray">{row.members}</td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-24 rounded-full bg-bgray/15">
                          <span
                            className="block h-full rounded-full bg-[#ffafa4]"
                            style={{ width: `${row.engagement}%` }}
                          />
                        </span>
                        <span className="text-[10px] font-medium text-secondary">
                          {row.engagement}%
                        </span>
                      </span>
                    </td>
                    {/* Actions column renders empty in the Figma — awaiting design clarification */}
                    <td className="px-4 py-4" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="text-[10px] text-secondary/65">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, 142)} of 142 Societies
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-sm bg-bgray/10 px-3 py-1.5 text-[9px] font-semibold text-secondary/65 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              {PAGE_NUMBERS.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`flex h-6 w-6 items-center justify-center rounded-sm text-[9px] font-bold transition ${
                    page === currentPage
                      ? "bg-secondary text-grayblue"
                      : "bg-bgray/10 text-bgray/80 hover:text-bgray"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-sm bg-bgray/10 px-3 py-1.5 text-[9px] font-semibold text-bgray/80 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[2.1fr_1fr]">
          {/* Recent activity */}
          <div className="min-h-[430px] rounded-md bg-[#151c24] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-bgray">
                Recent Activity
              </h2>
              <button
                type="button"
                className="text-[10px] font-medium uppercase tracking-widest text-secondary/80 transition hover:text-bgray"
              >
                View Audit Log
              </button>
            </div>
            <ul className="mt-5 space-y-4">
              {activityItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.id} className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.iconClasses}`}
                    >
                      <ItemIcon size={12} />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-bgray">{item.title}</p>
                      <p className="mt-1 text-[9px] text-secondary/65">{item.meta}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Regional distribution */}
          <div className="rounded-md bg-[#151c24] p-5">
            <h2 className="text-base font-medium text-bgray">
              Regional Distribution
            </h2>
            <ul className="mt-4 space-y-3">
              {regionStats.map((region) => (
                <li key={region.id}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-bgray/80">{region.label}</span>
                    <span className="text-[10px] font-medium text-secondary">
                      {region.percent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 w-full rounded-full bg-bgray/15">
                    <div
                      className="h-full rounded-full bg-[#ffafa4]"
                      style={{ width: `${region.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Loading placeholder per Figma (map widget pending) */}
            <div className="relative mt-4 flex h-52 items-center justify-center overflow-hidden rounded-sm bg-[#080f15]">
              <span aria-hidden="true" className="absolute h-24 w-20 -rotate-45 rounded-[45%] border border-secondary/15" />
              <span className="absolute left-1/2 top-9 h-1 w-1 -translate-x-1/2 rounded-full bg-bgray/30" aria-hidden="true" />
              <span className="absolute bottom-10 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-bgray/30" aria-hidden="true" />
              <p className="px-3 text-center text-[8px] font-normal uppercase tracking-widest text-secondary/30">
                Interactive Heatmap Loading...
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IsocsDirectoryPage;