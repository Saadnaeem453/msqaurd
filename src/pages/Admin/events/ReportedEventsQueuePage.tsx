import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAlertTriangle,
  FiAperture,
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiMonitor,
  FiMoreVertical,
  FiMusic,
  FiPower,
  FiSlash,
  FiTrendingDown,
  FiX,
} from "react-icons/fi";
import { BsExclamationSquare } from "react-icons/bs";

type StatFooter =
  | { kind: "trend"; percent: string; note: string }
  | { kind: "alert"; text: string }
  | { kind: "plain"; text: string };

interface StatItem {
  id: string;
  label: string;
  labelTone: "muted" | "secondary";
  value: string;
  valueTone: "foreground" | "secondary";
  cornerIcon: IconType;
  alert?: boolean;
  footer: StatFooter;
}

type Severity = "critical" | "medium" | "low";
type ThumbTone = "primary" | "info";

interface ReportedEvent {
  id: string;
  name: string;
  eventId: string;
  reasonTitle: string;
  reasonDetail: string;
  reporterId: string;
  flagged: string;
  severity: Severity;
  thumbIcon: IconType;
  thumbTone: ThumbTone;
}

const TOTAL_REPORTS = 1402;
const REPORTS_PAGE_SIZE = 25;

const statItems: StatItem[] = [
  {
    id: "active",
    label: "Active Reports",
    labelTone: "muted",
    value: "1,402",
    valueTone: "foreground",
    cornerIcon: BsExclamationSquare,
    footer: { kind: "trend", percent: "12%", note: "vs last 24h" },
  },
  {
    id: "severity",
    label: "High Severity",
    labelTone: "secondary",
    value: "87",
    valueTone: "secondary",
    cornerIcon: FiPower,
    alert: true,
    footer: { kind: "alert", text: "Requires Immediate Action" },
  },
  {
    id: "resolution",
    label: "Resolution Time",
    labelTone: "muted",
    value: "14.2m",
    valueTone: "foreground",
    cornerIcon: FiAperture,
    footer: { kind: "plain", text: "Avg. per report" },
  },
];

const severityFilters = [
  { id: "all", label: "All Reports" },
  { id: "critical", label: "Critical Only" },
] as const;

type SeverityFilter = (typeof severityFilters)[number]["id"];

const reportedEvents: ReportedEvent[] = [
  {
    id: "1",
    name: "Underground Nexus v2",
    eventId: "EV-882941",
    reasonTitle: "Inappropriate Imagery",
    reasonDetail: "System detected high-contrast explicit patterns in visual buffer.",
    reporterId: "USR-0092-ALPHA",
    flagged: "2 mins ago",
    severity: "critical",
    thumbIcon: FiMusic,
    thumbTone: "primary",
  },
  {
    id: "2",
    name: "Neon Pulse Live",
    eventId: "EV-110293",
    reasonTitle: "Misleading Content",
    reasonDetail: "Description contains unverified financial promises.",
    reporterId: "USR-5521-GAMMA",
    flagged: "18 mins ago",
    severity: "medium",
    thumbIcon: FiMonitor,
    thumbTone: "info",
  },
  {
    id: "3",
    name: "Tech Summit Alpha",
    eventId: "EV-449301",
    reasonTitle: "Spam",
    reasonDetail: "Duplicate event posting across multiple regions.",
    reporterId: "USR-3381-SIGMA",
    flagged: "45 mins ago",
    severity: "low",
    thumbIcon: FiActivity,
    thumbTone: "primary",
  },
];

const SEVERITY_BADGES: Record<Severity, string> = {
  critical: "border border-primary/20 bg-primary/15 text-secondary",
  medium: "border border-report-amber/20 bg-report-amber/15 text-report-amber",
  low: "border border-report-blue/20 bg-report-blue/15 text-report-blue",
};

const THUMB_TONE_CLASSES: Record<ThumbTone, string> = {
  primary: "text-primary",
  info: "text-report-blue",
};

const getPageItems = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
};

const ReportedEventsQueuePage = () => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_REPORTS / REPORTS_PAGE_SIZE);
  const rangeStart = (currentPage - 1) * REPORTS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * REPORTS_PAGE_SIZE, TOTAL_REPORTS);

  const visibleRows = useMemo(
    () =>
      severityFilter === "all"
        ? reportedEvents
        : reportedEvents.filter((row) => row.severity === "critical"),
    [severityFilter],
  );

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-base text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="admin-page-title">
            Reported Events Queue
          </h1><p className="admin-page-description">Review flagged events and manage the pending report queue.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-report-control px-4 py-2.5 text-base font-normal text-bgray transition hover:bg-report-control"
            >
              <FiFilter size={16} />
              Filter Queue
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-base font-normal text-bgray transition hover:bg-primary/90"
            >
              <FiRotateCcw size={16} />
              Audit Log
            </button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 min-[1100px]:grid-cols-3">
          {statItems.map((item) => {
            const CornerIcon = item.cornerIcon;
            return (
              <div
                key={item.id}
                className={`relative min-h-[140px] overflow-hidden rounded-[3px] bg-report-panel p-5 ${
                  item.alert ? "border border-primary/15" : "border border-transparent"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wider ${
                    item.labelTone === "secondary"
                      ? "text-secondary"
                      : "text-bgray/80"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`mt-2 text-2xl font-semibold tracking-tight ${
                    item.valueTone === "secondary" ? "text-report-alert" : "text-bgray"
                  }`}
                >
                  {item.value}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-sm">
                  {item.footer.kind === "trend" && (
                    <>
                      <FiTrendingDown size={13} className="text-green" />
                      <span className="font-semibold text-green">
                        {item.footer.percent}
                      </span>
                      <span className="text-secondary/70">{item.footer.note}</span>
                    </>
                  )}
                  {item.footer.kind === "alert" && (
                    <>
                      <FiAlertTriangle size={13} className="text-secondary" />
                      <span className="text-secondary">{item.footer.text}</span>
                    </>
                  )}
                  {item.footer.kind === "plain" && (
                    <>
                      <FiClock size={13} className="text-bgray/80" />
                      <span className="text-bgray/80">{item.footer.text}</span>
                    </>
                  )}
                </div>

                <CornerIcon
                  size={40}
                  className="absolute -bottom-1 -right-1 text-bgray/10"
                />
              </div>
            );
          })}
        </section>

        <section className="mt-6 overflow-hidden rounded-[3px] bg-report-panel">
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Pending Review Queue
            </h2>
            <div className="flex w-fit rounded-sm bg-grayblue p-1">
              {severityFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={severityFilter === filter.id}
                  onClick={() => { setSeverityFilter(filter.id); setCurrentPage(1); }}
                  className={`rounded-sm px-3 py-1.5 text-sm font-medium transition ${
                    severityFilter === filter.id
                      ? "bg-report-control text-bgray"
                      : "text-secondary/70 hover:text-bgray"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] table-fixed text-left">
              <thead>
                <tr className="bg-report-head">
                  <th className="w-[13%] px-4 py-4 text-xs font-medium uppercase tracking-wider text-secondary">
                    Severity
                  </th>
                  <th className="w-[24%] px-4 py-4 text-xs font-medium uppercase tracking-wider text-secondary">
                    Event Target
                  </th>
                  <th className="w-[22%] px-4 py-4 text-xs font-medium uppercase tracking-wider text-secondary">
                    Report Reason
                  </th>
                  <th className="w-[13%] px-4 py-4 text-xs font-medium uppercase tracking-wider text-secondary">
                    Reporter ID
                  </th>
                  <th className="w-[13%] px-4 py-4 text-xs font-medium uppercase tracking-wider text-secondary">
                    Flagged Time
                  </th>
                  <th className="w-[15%] px-4 py-4 text-xs font-medium uppercase tracking-wider text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const ThumbIcon = row.thumbIcon;
                  return (
                    <tr key={row.id} className="border-t border-bgray/[0.03]">
                      <td className="px-4 py-5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${SEVERITY_BADGES[row.severity]}`}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-11 w-10 shrink-0 items-center justify-center rounded bg-report-control">
                            <ThumbIcon size={16} className={THUMB_TONE_CLASSES[row.thumbTone]} />
                          </span>
                          <div>
                            <p className="max-w-[170px] text-base font-semibold leading-snug text-bgray">
                              {row.name}
                            </p>
                            <p className="mt-0.5 text-sm text-secondary/70">
                              ID: {row.eventId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-base text-bgray">{row.reasonTitle}</p>
                        <p className="mt-1 max-w-[210px] text-sm leading-snug text-secondary/70">
                          {row.reasonDetail}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        <span className="block max-w-[110px] text-sm leading-snug text-bgray/80">
                          {row.reporterId}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="block max-w-[80px] text-sm leading-snug text-bgray/80">
                          {row.flagged}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Ban event ${row.name}`}
                            className="rounded p-1 text-bgray/80 transition hover:bg-report-control hover:text-bgray"
                          >
                            <FiSlash size={18} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Dismiss report for ${row.name}`}
                            className="rounded p-1 text-bgray/80 transition hover:bg-report-control hover:text-bgray"
                          >
                            <FiX size={18} />
                          </button>
                          <button
                            type="button"
                            aria-label={`More actions for ${row.name}`}
                            className="rounded p-1 text-bgray/80 transition hover:bg-report-control hover:text-bgray"
                          >
                            <FiMoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-bgray/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-secondary/70">
              Showing{" "}
              <span className="font-bold text-bgray">
                {rangeStart} - {rangeEnd}
              </span>{" "}
              of {TOTAL_REPORTS.toLocaleString("en-US")} reports
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-md text-secondary/70 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={13} />
              </button>
              {getPageItems(currentPage, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-secondary/70"
                  >
                    {"\u2026"}
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    aria-current={item === currentPage ? "page" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-sm text-sm transition ${
                      item === currentPage
                        ? "bg-primary font-bold text-bgray"
                        : "text-secondary/70 hover:text-bgray"
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
                className="flex h-9 w-9 items-center justify-center rounded-md text-bgray transition hover:bg-report-control disabled:cursor-not-allowed disabled:opacity-40"
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

export default ReportedEventsQueuePage;
