import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiEdit,
  FiEye,
  FiFilter,
  FiTrendingUp,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  iconTone: "primary" | "greenish" | "amber";
  footerLeft: { text: string; tone: "greenish" | "amber" };
  footerRight: string;
  footerTwoCol?: boolean;
}

type OrgType = "masjid" | "isoc" | "organizer";
type Verification = "verified" | "pending";

interface OrganizationRow {
  id: string;
  initials: string;
  name: string;
  location: string;
  region: string;
  type: OrgType;
  events: number;
  followers: string;
  verification: Verification;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  bare?: boolean;
}

/* ================== Mock data (swap with real API later) ================== */

const TOTAL_ENTRIES = 1284;

const statItems: StatItem[] = [
  {
    id: "total",
    label: "Total Organizations",
    value: "1,284",
    icon: MdBusiness,
    iconTone: "primary",
    footerLeft: { text: "+12%", tone: "greenish" },
    footerRight: "since last month",
  },
  {
    id: "active",
    label: "Active Entities",
    value: "942",
    icon: FiCheckCircle,
    iconTone: "greenish",
    footerLeft: { text: "73.4%", tone: "greenish" },
    footerRight: "of total database",
  },
  {
    id: "pending",
    label: "Pending Verification",
    value: "42",
    icon: FiClock,
    iconTone: "amber",
    footerLeft: { text: "Priority", tone: "amber" },
    footerRight: "Requires review",
  },
  {
    id: "growth",
    label: "Growth Rate",
    value: "5.2%",
    icon: FiTrendingUp,
    iconTone: "primary",
    footerLeft: { text: "Above Target", tone: "greenish" },
    footerRight: "Q3 benchmark",
    footerTwoCol: true,
  },
];

const ICON_TONE_CLASSES: Record<StatItem["iconTone"], string> = {
  primary: "text-primary",
  greenish: "text-green",
  amber: "text-report-amber",
};

const typeOptions: DropdownOption[] = [
  { value: "all", label: "Organization Type: All" },
  { value: "masjid", label: "Organization Type: Masjid" },
  { value: "isoc", label: "Organization Type: ISOC" },
  { value: "organizer", label: "Organization Type: Organizer" },
];

const verificationOptions: DropdownOption[] = [
  { value: "all", label: "Verification: All" },
  { value: "verified", label: "Verification: Verified" },
  { value: "pending", label: "Verification: Pending" },
];

const regionOptions: DropdownOption[] = [
  { value: "all", label: "Region: UK-Wide" },
  { value: "london", label: "Region: London" },
  { value: "manchester", label: "Region: Manchester" },
  { value: "birmingham", label: "Region: Birmingham" },
];

const pageSizeOptions: DropdownOption[] = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

const organizationRows: OrganizationRow[] = [
  {
    id: "#ORG-8291",
    initials: "EL",
    name: "East London Mosque",
    location: "London, Whitechapel",
    region: "london",
    type: "masjid",
    events: 156,
    followers: "12.4K",
    verification: "verified",
  },
  {
    id: "#ORG-4412",
    initials: "KU",
    name: "Kings College ISOC",
    location: "London, Central",
    region: "london",
    type: "isoc",
    events: 42,
    followers: "2.1K",
    verification: "verified",
  },
  {
    id: "#ORG-9902",
    initials: "YO",
    name: "Youth Outreach Network",
    location: "Manchester, South",
    region: "manchester",
    type: "organizer",
    events: 12,
    followers: "854",
    verification: "pending",
  },
  {
    id: "#ORG-1120",
    initials: "GC",
    name: "Green Lane Masjid",
    location: "Birmingham, B10",
    region: "birmingham",
    type: "masjid",
    events: 210,
    followers: "18.2K",
    verification: "verified",
  },
  {
    id: "#ORG-5621",
    initials: "LM",
    name: "LSE Muslim Soc",
    location: "London, WC2A",
    region: "london",
    type: "isoc",
    events: 31,
    followers: "1.8K",
    verification: "verified",
  },
];

const TYPE_BADGES: Record<OrgType, { label: string; classes: string }> = {
  masjid: { label: "Masjid", classes: "bg-primary/15 text-primary" },
  isoc: { label: "ISOC", classes: "bg-bgray/10 text-bgray/80" },
  organizer: { label: "Organizer", classes: "bg-bgray/10 text-bgray/80" },
};

/* Filter and page-size controls. */
const Dropdown = ({ options, value, onChange, placeholder, className, bare }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          bare
            ? "flex items-center gap-2 px-2 py-1 text-xs text-bgray transition hover:text-secondary"
            : "flex w-full items-center justify-between gap-2 rounded-sm bg-[#242b35] px-3 py-2 text-xs text-bgray transition hover:bg-bgray/15"
        }
      >
        {selected?.label ?? placeholder}
        <FiChevronDown size={12} className="shrink-0 text-secondary/55" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-full min-w-[150px] rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                option.value === value ? "font-medium text-bgray" : "text-bgray/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const getPageItems = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
};

/* ============================= Page ============================= */

const AllOrganizationsDirectoryPage = () => {
  const [typeValue, setTypeValue] = useState("all");
  const [verificationValue, setVerificationValue] = useState("all");
  const [regionValue, setRegionValue] = useState("all");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const visibleRows = useMemo(
    () =>
      organizationRows.filter((row) => {
        const byType = typeValue === "all" || row.type === typeValue;
        const byVerification = verificationValue === "all" || row.verification === verificationValue;
        const byRegion = regionValue === "all" || row.region === regionValue;
        return byType && byVerification && byRegion;
      }),
    [typeValue, verificationValue, regionValue],
  );

  const totalPages = Math.ceil(TOTAL_ENTRIES / Number(pageSize));
  const rangeEnd = Math.min(currentPage * Number(pageSize), TOTAL_ENTRIES);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-bgray lg:text-3xl">
              All Organizations Directory
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-secondary">
              Manage and monitor the entire ecosystem of masjids, ISOCs, and organizers.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm border border-bgray/5 bg-[#111820] px-4 py-2.5 text-xs font-normal text-bgray transition hover:bg-bgray/15"
            >
              <FiDownload size={13} />
              Export Data
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-normal text-white transition hover:bg-primary/90"
            >
              <MdBusiness size={14} />
              Add Organization
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="min-h-[130px] rounded-md border border-bgray/[0.02] bg-[#151c24] p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="max-w-[130px] text-[10px] font-medium uppercase leading-[1.4] tracking-widest text-secondary/65">
                    {item.label}
                  </span>
                  <Icon size={16} className={ICON_TONE_CLASSES[item.iconTone]} />
                </div>
                <p className="mt-2 text-sm font-semibold tracking-tight text-bgray">{item.value}</p>
                <div className={`mt-3 flex gap-4 text-xs leading-snug ${item.footerTwoCol ? "" : "items-baseline gap-1.5"}`}>
                  <span
                    className={`max-w-[60px] text-[10px] font-medium ${
                      item.footerLeft.tone === "greenish" ? "text-green" : "text-report-amber"
                    }`}
                  >
                    {item.footerLeft.text}
                  </span>
                  <span className="max-w-[110px] text-secondary/40">{item.footerRight}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Filters */}
        <section className="mt-6 min-h-[130px] rounded-md border border-bgray/[0.02] bg-[#151c24] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 bg-[#242b35] px-3 py-2 text-xs text-secondary">
              <FiFilter size={11} />
              Filters:
            </span>
            <Dropdown options={typeOptions} value={typeValue} onChange={setTypeValue} className="w-48" />
            <Dropdown
              options={verificationOptions}
              value={verificationValue}
              onChange={setVerificationValue}
              className="w-40"
            />
            <Dropdown options={regionOptions} value={regionValue} onChange={setRegionValue} className="w-40" />
          </div>
          <p className="mt-2 text-xs text-secondary/55">
            Showing 1-{rangeEnd} of {TOTAL_ENTRIES.toLocaleString("en-US")} entries
          </p>
        </section>

        {/* Directory table */}
        <section className="mt-6 overflow-hidden rounded-t-md border border-bgray/[0.03] bg-[#151c24]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed text-left">
              <thead>
                <tr className="bg-[#1b232b]">
                  <th className="w-[10%] px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    ID
                  </th>
                  <th className="w-[21%] px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    Name
                  </th>
                  <th className="w-[12%] px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    Type
                  </th>
                  <th className="w-[12%] px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    Total Events
                  </th>
                  <th className="w-[12%] px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    Followers
                  </th>
                  <th className="w-[20%] px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    Verification
                  </th>
                  <th className="w-[13%] px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const badge = TYPE_BADGES[row.type];
                  return (
                    <tr key={row.id} className="border-t border-secondary/10 transition hover:bg-bgray/[0.02]">
                      <td className="px-5 py-5">
                        <span className="block max-w-[52px] text-xs font-normal leading-snug text-secondary">
                          {row.id}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-6 shrink-0 items-center justify-center bg-[#242b35] text-xs font-semibold text-secondary">
                            {row.initials}
                          </span>
                          <div>
                            <p className="max-w-[110px] text-xs font-normal leading-snug text-bgray">
                              {row.name}
                            </p>
                            <p className="max-w-[100px] text-xs leading-snug text-secondary/55">
                              {row.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`inline-block rounded-none px-1.5 py-1 text-[8px] font-normal uppercase tracking-wide ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-xs text-bgray">{row.events}</td>
                      <td className="px-4 py-5 text-xs text-bgray">{row.followers}</td>
                      <td className="px-4 py-5">
                        {row.verification === "verified" ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-normal text-green">
                            <FiCheckCircle size={11} />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-normal text-report-amber">
                            <FiClock size={11} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`View ${row.name}`}
                            className="rounded p-1.5 text-secondary/55 transition hover:bg-bgray/10 hover:text-bgray"
                          >
                            <FiEye size={14} />
                          </button>
                          {row.verification === "pending" && (
                            <button
                              type="button"
                              aria-label={`Review ${row.name}`}
                              className="flex h-6 w-6 items-center justify-center rounded bg-primary text-bgray transition hover:bg-primary/90"
                            >
                              <FiEdit size={11} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer bar */}
        <section className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-[#252a30] px-3 py-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary/55">Rows per page:</span>
            <Dropdown
              bare
              options={pageSizeOptions}
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              className="w-14"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md text-secondary/55 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft size={13} />
            </button>
            {getPageItems(currentPage, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-7 w-7 items-center justify-center text-xs text-secondary/55"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCurrentPage(item)}
                  aria-current={item === currentPage ? "page" : undefined}
                  className={`flex h-7 w-7 items-center justify-center rounded-none text-xs transition ${
                    item === currentPage
                      ? "bg-primary font-bold text-bgray"
                      : "text-secondary/55 hover:text-bgray"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md text-bgray transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight size={13} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllOrganizationsDirectoryPage;