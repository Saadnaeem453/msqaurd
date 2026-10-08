import { useState } from "react";

import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiRotateCcw,
} from "react-icons/fi";
import { FaGavel } from "react-icons/fa";

type StatFooter =
  | { kind: "progress"; percent: number }
  | { kind: "description"; text: string }
  | { kind: "link"; label: string };

interface StatItem {
  id: string;
  label: string;
  value: string;
  valueTone: "bgray" | "secondary";
  change?: string;
  tinted?: boolean;
  footer: StatFooter;
}

type Severity = "critical" | "medium" | "low";
type AgentKind = "system" | "human";
type TabId = "all" | "fraud" | "policy";

interface SuspendedUser {
  id: string;
  name: string;
  email: string;
  severity: Severity;
  reasonTitle: string;
  reasonDetail: string;
  appliedDate: string;
  agentName: string;
  agentKind: AgentKind;
}

const TOTAL_RESTRICTED = 1248;
const ACCOUNTS_PAGE_SIZE = 10;

const statItems: StatItem[] = [
  {
    id: "violations",
    label: "Policy Violations",
    value: "842",
    valueTone: "bgray",
    change: "+12%",
    footer: { kind: "progress", percent: 60 },
  },
  {
    id: "fraud",
    label: "Fraud Suspected",
    value: "316",
    valueTone: "bgray",
    change: "-4%",
    footer: { kind: "progress", percent: 40 },
  },
  {
    id: "ban-duration",
    label: "Average Ban Duration",
    value: "18.4 Days",
    valueTone: "bgray",
    footer: { kind: "description", text: "Calculated over last 30 days" },
  },
  {
    id: "appeals",
    label: "Critical Appeals",
    value: "42 Pending",
    valueTone: "secondary",
    tinted: true,
    footer: { kind: "link", label: "View Queue" },
  },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All Suspensions" },
  { id: "fraud", label: "Fraud (316)" },
  { id: "policy", label: "Policy (842)" },
];

const suspendedUsers: SuspendedUser[] = [
  {
    id: "#US_922",
    name: "Marcus Thorne",
    email: "m.thorne@stealv.net",
    severity: "critical",
    reasonTitle: "Suspected Fraud",
    reasonDetail: "Payment gateway automated flag (Level 3)",
    appliedDate: "Oct 24, 2023",
    agentName: "System_Bot",
    agentKind: "system",
  },
  {
    id: "#US_184",
    name: "Sarah J. Miller",
    email: "sj.miller@proto.com",
    severity: "medium",
    reasonTitle: "ToS Violation",
    reasonDetail: "Repeated spam in event comments",
    appliedDate: "Oct 26, 2023",
    agentName: "Mod_Alex",
    agentKind: "human",
  },
  {
    id: "#US_005",
    name: "Dmitry Volkov",
    email: "d.volkov@security.io",
    severity: "critical",
    reasonTitle: "Bot Activity",
    reasonDetail: "Mass registration detected (IP cluster)",
    appliedDate: "Oct 27, 2023",
    agentName: "System_Bot",
    agentKind: "system",
  },
  {
    id: "#US_772",
    name: "Elena Rodriguez",
    email: "elena.r@mail.com",
    severity: "low",
    reasonTitle: "Chargeback Dispute",
    reasonDetail: "Automatic lock until resolution",
    appliedDate: "Oct 28, 2023",
    agentName: "Billing_Root",
    agentKind: "human",
  },
];

const SEVERITY_CLASSES: Record<Severity, string> = {
  critical: "bg-[#382d30] text-secondary",
  medium: "bg-[#392419] text-[#ff8a35]",
  low: "bg-[#152339] text-[#5798ff]",
};

const AGENT_DOT_CLASSES: Record<AgentKind, string> = {
  system: "border border-primary/50 bg-primary/20",
  human: "bg-bgray/20",
};

const StatCard = ({ item }: { item: StatItem }) => (
  <div
    className={`min-h-[124px] rounded-sm border border-bgray/10 p-4 ${
      item.tinted ? "bg-[#292630]" : "bg-[#1d2028]"
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-secondary">{item.label}</span>
      {item.change && (
        <span className={`text-xs ${item.change.startsWith("-") ? "text-green" : "text-secondary"}`}>{item.change}</span>
      )}
    </div>

    <p
      className={`mt-2 text-3xl font-semibold tracking-tight ${
        item.valueTone === "secondary" ? "text-secondary" : "text-bgray"
      }`}
    >
      {item.value}
    </p>

    {item.footer.kind === "progress" && (
      <div className="mt-2.5 h-[3px] w-full rounded-full bg-bgray/15">
        <div
          className="h-full rounded-full bg-secondary"
          style={{ width: `${item.footer.percent}%` }}
        />
      </div>
    )}
    {item.footer.kind === "description" && (
      <p className="mt-2 text-sm leading-5 text-secondary">
        {item.footer.text}
      </p>
    )}
    {item.footer.kind === "link" && (
      <button
        type="button"
        className="mt-2 text-xs font-medium text-secondary underline underline-offset-2 transition hover:text-bgray"
      >
        {item.footer.label}
      </button>
    )}
  </div>
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGE_WINDOW = 3;

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const windowStart = Math.min(
    Math.max(1, currentPage - 1),
    Math.max(1, totalPages - PAGE_WINDOW + 1),
  );
  const pages = Array.from(
    { length: Math.min(PAGE_WINDOW, totalPages) },
    (_, i) => windowStart + i,
  );

  const edgeButton =
    "flex h-7 w-7 items-center justify-center rounded-none border border-border_color text-bgray/80 transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={edgeButton}
      >
        <FiChevronLeft size={12} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-7 w-7 items-center justify-center rounded-none text-xs transition ${
            page === currentPage
              ? "bg-secondary font-semibold text-grayblue"
              : "border border-border_color text-bgray/80 hover:bg-bgray/10"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={edgeButton}
      >
        <FiChevronRight size={12} />
      </button>
    </div>
  );
};

interface SuspensionsTableProps {
  rows: SuspendedUser[];
}

const SuspensionsTable = ({ rows }: SuspensionsTableProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_RESTRICTED / ACCOUNTS_PAGE_SIZE);
  const rangeStart = (currentPage - 1) * ACCOUNTS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * ACCOUNTS_PAGE_SIZE, TOTAL_RESTRICTED);

  return (
    <section className="overflow-hidden rounded-md border border-bgray/10 bg-[#151c24]">

      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-2 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "border-secondary text-bgray"
                  : "border-transparent text-secondary hover:text-bgray"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 pb-2 text-xs text-bgray/80 transition hover:text-bgray"
        >
          <FiFilter size={13} />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] table-fixed text-left">
          <thead>
            <tr className="bg-lightgrayblue">
              <th className="w-[24%] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-secondary">
                User Identity
              </th>
              <th className="w-[12%] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-secondary">
                Severity
              </th>
              <th className="w-[24%] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-secondary">
                Suspension Reason
              </th>
              <th className="w-[12%] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-secondary">
                Applied Date
              </th>
              <th className="w-[18%] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-secondary">
                Admin Agent
              </th>
              <th className="w-[10%] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#101216]">
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-bgray/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex min-h-8 min-w-[58px] shrink-0 px-1 items-center justify-center rounded-sm bg-bgray/15 text-xs text-secondary">{row.id}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-4 text-bgray">{row.name}</p>
                      <p className="text-xs leading-5 text-secondary">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-sm px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide ${SEVERITY_CLASSES[row.severity]}`}
                  >
                    {row.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-bgray">{row.reasonTitle}</p>
                  <p className="max-w-[150px] text-xs leading-5 text-secondary">
                    {row.reasonDetail}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="block max-w-[80px] text-sm leading-snug text-bgray/80">
                    {row.appliedDate}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${AGENT_DOT_CLASSES[row.agentKind]}`}
                    />
                    <span className="text-sm text-secondary">{row.agentName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Restore account ${row.id}`}
                      className="rounded p-1 text-secondary transition hover:bg-bgray/10 hover:text-bgray"
                    >
                      <FiRotateCcw size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Enforce permanent ban for ${row.id}`}
                      className="rounded p-1 text-secondary transition hover:bg-bgray/10 hover:text-bgray"
                    >
                      <FaGavel size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-bgray/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-secondary">
          Showing {rangeStart}-{rangeEnd} of {TOTAL_RESTRICTED.toLocaleString("en-US")}{" "}
          restricted accounts
        </p>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

const SuspendedUsersPage = () => (
  <div className="min-h-full bg-grayblue text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
    <div className="admin-page ">

      <header className="flex flex-col gap-4 min-[600px]:flex-row min-[600px]:items-end min-[600px]:justify-between">
        <div className="max-w-lg min-[600px]:flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="admin-page-title">
              Suspended Users
            </h1>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-bold tracking-wide text-primary">
              1,248 RESTRICTED
            </span>
          </div>
          <p className="admin-page-description">
            High-alert monitoring of accounts with restricted platform access. Immediate
            triage and permanent ban controls are enabled for level 3 system
            administrators.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex w-28 items-center gap-2 rounded-none border border-border_color bg-[#1d2028] px-2.5 py-1.5 text-center text-xs font-semibold text-bgray transition hover:bg-bgray/10"
          >
            <FiDownload size={14} className="shrink-0" />
            Export Audit Log
          </button>
          <button
            type="button"
            className="flex w-32 items-center gap-2 rounded-none bg-primary px-2.5 py-1.5 text-center text-xs font-semibold text-bgray transition hover:bg-primary/90"
          >
            <FiAlertCircle size={14} className="shrink-0" />
            Bulk Policy Update
          </button>
        </div>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 min-[900px]:grid-cols-4">
        {statItems.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </section>

      <section className="mt-6">
        <SuspensionsTable rows={suspendedUsers} />
      </section>

      <footer className="mt-8 grid grid-cols-1 items-center gap-4 min-[900px]:grid-cols-[2.5fr_1.5fr_1fr]">
        <div className="border-l-2 border-primary bg-[#17131e] p-2.5">
          <p className="text-xs font-bold text-bgray">Administrative Protocol 12-B</p>
          <p className="mt-1 text-xs leading-4 text-secondary">
            All permanent bans are logged in the immutable audit trail. Actions taken here
            are subject to quarterly compliance reviews. Ensure all justifications are
            attached to user notes before final submission.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            className="max-w-[90px] text-left text-xs text-secondary underline underline-offset-2 transition hover:text-bgray"
          >
            Ban Policy Documentation
          </button>
          <button
            type="button"
            className="max-w-[80px] text-left text-xs text-secondary underline underline-offset-2 transition hover:text-bgray"
          >
            Compliance Center
          </button>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-lightgrayblue px-2 py-1">
          <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
          <span className="text-xs text-secondary">Last Backup: 4m ago</span>
        </div>
      </footer>
    </div>
  </div>
);

export default SuspendedUsersPage;
