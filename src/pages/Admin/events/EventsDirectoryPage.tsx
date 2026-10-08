import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiCalendar,
  FiImage,
  FiDownload,
  FiFilter,
  FiGrid,
  FiRadio,
  FiUsers,
} from "react-icons/fi";
import { BsCalendarCheck } from "react-icons/bs";
import { MdSwapVert } from "react-icons/md";

type StatFooter =
  | { kind: "badge"; label: string; note: string }
  | { kind: "live"; note: string }
  | { kind: "target"; chip: string; note: string };

interface StatItem {
  id: string;
  label: string;
  value: string;
  valueTone: "bgray" | "secondary";
  icon: IconType;
  footer: StatFooter;
}

interface DropdownOption {
  value: string;
  label: string;
}

type EventStatus = "published" | "pending" | "reported" | "rejected";
type StatusFilter = "all" | "published" | "pending";

export interface DirectoryEvent {
  id: string;
  title: string;
  location: string;
  organizer: string;
  date: string;
  status: EventStatus;
  revenue: number;
  imageUrl?: string | null;
  category: string;
}

const statItems: StatItem[] = [
  {
    id: "total",
    label: "Total Events",
    value: "—",
    valueTone: "bgray",
    icon: BsCalendarCheck,
    footer: { kind: "badge", label: "—", note: "vs last month" },
  },
  {
    id: "active",
    label: "Active Now",
    value: "—",
    valueTone: "secondary",
    icon: FiRadio,
    footer: { kind: "live", note: "Live broadcasting peak" },
  },
  {
    id: "attendance",
    label: "Avg. Attendance",
    value: "—",
    valueTone: "bgray",
    icon: FiUsers,
    footer: { kind: "target", chip: "Target: —", note: "across all categories" },
  },
];

const rangeOptions: DropdownOption[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "ytd", label: "This Year" },
];

const categoryOptions: DropdownOption[] = [
  { value: "all", label: "All Categories" },
  { value: "tech", label: "Technology" },
  { value: "music", label: "Music" },
  { value: "finance", label: "Finance" },
  { value: "design", label: "Design" },
];

const pageSizeOptions: DropdownOption[] = [
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "50", label: "50" },
];

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Status" },
  { id: "published", label: "Published" },
  { id: "pending", label: "Pending" },
];

const directoryEvents: DirectoryEvent[] = [];

const STATUS_BADGE_CLASSES: Record<EventStatus, string> = {
  published: "bg-green/15 text-green",
  pending: "bg-[#392f17] text-[#ffc700]",
  reported: "bg-primary/15 text-primary",
  rejected: "bg-bgray/10 text-secondary/60",
};

const formatRevenue = (value: number): string =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const EventThumbnail = ({ src, title }: { src?: string | null; title: string }) => {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex h-9 w-8 shrink-0 items-center justify-center bg-grayblue text-secondary/50">
      {src && !failed ? (
        <img src={src} alt={title} loading="lazy" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <FiImage role="img" aria-label="Event image unavailable" size={18} />
      )}
    </span>
  );
};

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: IconType;
}

const Dropdown = ({ options, value, onChange, placeholder, className, icon: Icon }: DropdownProps) => {
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
    <div ref={ref} className={`relative ${className ?? ""}`} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); ref.current?.querySelector("button")?.focus(); }
    }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-md border border-border_color px-3 py-2 text-xs text-bgray/80 transition hover:bg-bgray/5"
      >
        {Icon && <Icon size={13} className="shrink-0 text-secondary/60" />}
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <FiChevronDown size={12} className="ml-auto shrink-0 text-secondary/60" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
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

const StatCard = ({ item }: { item: StatItem }) => {
  const Icon = item.icon;
  return (
    <div className="relative min-h-[110px] rounded-none bg-[#151c24] p-4">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary/60">
          {item.label}
        </span>
        <Icon aria-hidden="true" size={30} className="absolute right-3 top-3 text-bgray/10" />
      </div>
      <p
        className={`mt-2 text-xl font-semibold tracking-tight ${
          item.valueTone === "secondary" ? "text-secondary" : "text-bgray"
        }`}
      >
        {item.value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {item.footer.kind === "badge" && (
          <span className="rounded bg-green/15 px-2 py-1 text-[10px] font-bold text-green">
            {item.footer.label}
          </span>
        )}
        {item.footer.kind === "live" && (
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
        )}
        {item.footer.kind === "target" && (
          <span className="rounded bg-bgray/10 px-2 py-1 text-[10px] font-semibold text-bgray/80">
            {item.footer.chip}
          </span>
        )}
        <span className="text-[11px] text-secondary/60">
          {item.footer.note}
        </span>
      </div>
    </div>
  );
};

const EventsDirectoryPage = () => {
  const [rangeValue, setRangeValue] = useState("30d");
  const [categoryValue, setCategoryValue] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageSize, setPageSize] = useState("15");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);

  const size = Number(pageSize);
  const filteredRows = useMemo(() => {
    const now = new Date();
    const since = rangeValue === "ytd"
      ? new Date(now.getFullYear(), 0, 1).getTime()
      : now.getTime() - Number(rangeValue.replace("d", "")) * 86400000;
    return directoryEvents.filter((event) => {
      const date = Date.parse(event.date);
      return (statusFilter === "all" || event.status === statusFilter)
        && (categoryValue === "all" || event.category === categoryValue)
        && date >= since && date <= now.getTime();
    }).sort((a, b) => sortAsc
      ? a.id.localeCompare(b.id, undefined, { numeric: true })
      : b.id.localeCompare(a.id, undefined, { numeric: true }));
  }, [statusFilter, categoryValue, rangeValue, sortAsc]);
  const totalEvents = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalEvents / size));
  const page = Math.min(currentPage, totalPages);
  const rangeStart = totalEvents ? (page - 1) * size + 1 : 0;
  const rangeEnd = Math.min(page * size, totalEvents);
  const rangeLabel = `${rangeStart}-${rangeEnd} of ${totalEvents.toLocaleString("en-US")}`;
  const visibleRows = filteredRows.slice((page - 1) * size, page * size);
  const pagerSquare =
    "flex h-7 w-7 items-center justify-center rounded-md border border-border_color bg-bgray/5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-bgray/5";

  return (
    <div className="min-h-full bg-grayblue text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="admin-page-title">
              Events Directory
            </h1>
            <p className="admin-page-description">
              Manage and monitor all platform activity in real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-none bg-[#303741] px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
            >
              <FiFilter size={13} />
              Saved Views
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-none bg-primary px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiDownload size={13} />
              Export Report
            </button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-3 min-[600px]:grid-cols-3">
          {statItems.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </section>

        <section className="mt-6 rounded-none bg-[#151c24] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-secondary">
              <FiFilter size={13} />
              Quick Filters:
            </span>
            <Dropdown
              icon={FiCalendar}
              options={rangeOptions}
              value={rangeValue}
              onChange={(value) => { setRangeValue(value); setCurrentPage(1); }}
              className="w-40"
            />
            <Dropdown
              icon={FiGrid}
              options={categoryOptions}
              value={categoryValue}
              onChange={(value) => { setCategoryValue(value); setCurrentPage(1); }}
              className="w-36"
            />
            <div className="flex items-center gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => { setStatusFilter(filter.id); setCurrentPage(1); }}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    statusFilter === filter.id
                      ? "border-bgray/20 bg-bgray/15 font-medium text-bgray"
                      : "border-transparent bg-bgray/5 text-secondary/60 hover:text-bgray"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <span className="text-xs text-secondary/60">Showing {rangeLabel}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={pagerSquare}
              >
                <FiChevronLeft size={12} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={page === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={pagerSquare}
              >
                <FiChevronRight size={12} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-none bg-[#151c24]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[660px] table-fixed text-left">
              <thead>
                <tr className="bg-[#242c36]">
                  <th className="w-[12%] px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-bgray/80">
                    <span className="flex items-center gap-1.5">
                      Event ID
                      <button
                        type="button"
                        aria-label={sortAsc ? "Sort descending" : "Sort ascending"}
                        onClick={() => setSortAsc((v) => !v)}
                        className="text-secondary/60 transition hover:text-bgray"
                      >
                        <MdSwapVert size={12} />
                      </button>
                    </span>
                  </th>
                  <th className="w-[27%] px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-bgray/80">
                    Event Title
                  </th>
                  <th className="w-[14%] px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-bgray/80">
                    Organizer
                  </th>
                  <th className="w-[10%] px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-bgray/80">
                    Date
                  </th>
                  <th className="w-[17%] px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-bgray/80">
                    Status
                  </th>
                  <th className="w-[20%] px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-bgray/80">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <FiImage aria-hidden="true" size={28} className="mx-auto mb-3 text-secondary/40" />
                      <p className="font-jakarta text-base font-semibold text-bgray">No events to display</p>
                      <p className="mt-2 text-sm text-secondary/60">Events will appear here when available.</p>
                    </td>
                  </tr>
                )}
                {visibleRows.map((row) => {

                  const rejected = row.status === "rejected";
                  return (
                    <tr key={row.id} className="border-t border-bgray/[0.02]">
                      <td className="px-4 py-4">
                        <span className="block max-w-[52px] text-sm leading-snug text-bgray/80">
                          #EVT-{row.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <EventThumbnail key={row.imageUrl} src={row.imageUrl} title={row.title} />
                          <div>
                            <p
                              className={`max-w-[150px] text-sm font-medium leading-snug ${
                                rejected ? "text-secondary/60 line-through" : "text-bgray"
                              }`}
                            >
                              {row.title}
                            </p>
                            <p className="mt-0.5 text-[11px] text-secondary/60">
                              {row.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`block max-w-[90px] text-xs leading-snug ${
                            rejected ? "text-secondary/60" : "text-bgray/80"
                          }`}
                        >
                          {row.organizer}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`block max-w-[56px] text-xs leading-snug ${
                            rejected ? "text-secondary/60" : "text-bgray/80"
                          }`}
                        >
                          {row.date}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${STATUS_BADGE_CLASSES[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-sm ${
                            rejected
                              ? "font-medium text-secondary/60"
                              : "font-semibold text-bgray"
                          }`}
                        >
                          {formatRevenue(row.revenue)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-border_color/60 bg-[#242c36] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary/60">Rows per page:</span>
              <Dropdown
                options={pageSizeOptions}
                value={pageSize}
                onChange={(v) => {
                  setPageSize(v);
                  setCurrentPage(1);
                }}
                className="w-14"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-secondary/60">{rangeLabel}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="First page"
                  disabled={page === 1}
                  onClick={() => setCurrentPage(1)}
                  className={pagerSquare}
                >
                  <FiChevronsLeft size={12} />
                </button>
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={pagerSquare}
                >
                  <FiChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={pagerSquare}
                >
                  <FiChevronRight size={12} />
                </button>
                <button
                  type="button"
                  aria-label="Last page"
                  disabled={page === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className={pagerSquare}
                >
                  <FiChevronsRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventsDirectoryPage;
