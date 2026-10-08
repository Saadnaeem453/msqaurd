import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiDownload,
  FiEye,
  FiFilter,
  FiMoreVertical,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiX,
} from "react-icons/fi";
import ConfirmModal from "../components/ui/ConfirmModal";

type RefundStatus = "pending" | "approved" | "rejected";
type RefundPriority = "high" | "medium" | "low";
type TabId = "all" | "pending" | "approved" | "rejected";

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  valueTone: "primary" | "foreground";
  footer: string;
  footerTone: "greenish" | "muted" | "secondary";
}

interface RefundRequest {
  id: string;
  requester: string;
  requesterEmail: string;
  avatar: string;
  eventName: string;
  transactionId: string;
  amount: string;
  reason: string;
  submitted: string;
  status: RefundStatus;
  priority: RefundPriority;
  riskScore: number;
}

interface ActivityItem {
  id: string;
  icon: IconType;
  title: string;
  meta: string;
  tone: "success" | "warning" | "neutral";
}

interface AutomationRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const TOTAL_REFUNDS = 1248;
const PAGE_SIZE = 10;

const stats: StatItem[] = [
  {
    id: "total",
    label: "Total Requests",
    value: "1,248",
    icon: FiRefreshCw,
    valueTone: "primary",
    footer: "+12% active under review",
    footerTone: "greenish",
  },
  {
    id: "amount",
    label: "Pending Amount",
    value: "$842.5k",
    icon: FiCreditCard,
    valueTone: "foreground",
    footer: "Across 342 transactions",
    footerTone: "muted",
  },
  {
    id: "resolution",
    label: "Avg. Resolution",
    value: "2.4d",
    icon: FiClock,
    valueTone: "foreground",
    footer: "SLA target: 3d",
    footerTone: "secondary",
  },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const refundRows: RefundRequest[] = [
  {
    id: "RF-8821",
    requester: "Alice Morgan",
    requesterEmail: "alice.morgan@mail.com",
    avatar: "AM",
    eventName: "Neon Horizon 2024",
    transactionId: "TXN-90821-A",
    amount: "$245.00",
    reason: "Event Cancelled",
    submitted: "8 mins ago",
    status: "pending",
    priority: "high",
    riskScore: 82,
  },
  {
    id: "RF-8822",
    requester: "James Wilson",
    requesterEmail: "j.wilson@work.io",
    avatar: "JW",
    eventName: "Tech Summit Global",
    transactionId: "TXN-77302-K",
    amount: "$1,200.00",
    reason: "Duplicate Payment",
    submitted: "24 mins ago",
    status: "approved",
    priority: "medium",
    riskScore: 34,
  },
  {
    id: "RF-8823",
    requester: "Priya Shah",
    requesterEmail: "priya.shah@mail.com",
    avatar: "PS",
    eventName: "Music Fest 2024",
    transactionId: "TXN-44811-Q",
    amount: "$85.50",
    reason: "Personal Reasons",
    submitted: "41 mins ago",
    status: "rejected",
    priority: "low",
    riskScore: 18,
  },
  {
    id: "RF-8824",
    requester: "Marcus Chen",
    requesterEmail: "m.chen@nexus.io",
    avatar: "MC",
    eventName: "Founder Night Live",
    transactionId: "TXN-12044-P",
    amount: "$540.00",
    reason: "Billing Dispute",
    submitted: "1h ago",
    status: "pending",
    priority: "high",
    riskScore: 71,
  },
];

const activityItems: ActivityItem[] = [
  {
    id: "a1",
    icon: FiCheck,
    title: "Refund RF-8822 approved",
    meta: "Processed by Admin_Sarah • 6m ago",
    tone: "success",
  },
  {
    id: "a2",
    icon: FiAlertTriangle,
    title: "High-value refund flagged",
    meta: "RF-8824 requires secondary approval • 18m ago",
    tone: "warning",
  },
  {
    id: "a3",
    icon: FiRefreshCw,
    title: "Batch processor completed",
    meta: "18 requests synchronized with Stripe • 34m ago",
    tone: "neutral",
  },
];

const initialRules: AutomationRule[] = [
  {
    id: "low-value",
    label: "Auto-approve low value",
    description: "Approve verified refunds below $50.",
    enabled: true,
  },
  {
    id: "repeat",
    label: "Flag repeat requesters",
    description: "Escalate users with 3+ claims in 30 days.",
    enabled: true,
  },
  {
    id: "manual",
    label: "Manual review above $500",
    description: "Require admin approval for large claims.",
    enabled: false,
  },
];

const STATUS_CLASSES: Record<RefundStatus, string> = {
  pending: "bg-secondary/15 text-secondary",
  approved: "bg-greenish/15 text-greenish",
  rejected: "bg-foreground/10 text-foreground-muted",
};

const PRIORITY_CLASSES: Record<RefundPriority, string> = {
  high: "bg-primary/15 text-secondary",
  medium: "bg-amber/15 text-amber",
  low: "bg-foreground/10 text-foreground-muted",
};

const ACTIVITY_CLASSES: Record<ActivityItem["tone"], string> = {
  success: "bg-greenish/15 text-greenish",
  warning: "bg-primary/15 text-secondary",
  neutral: "bg-foreground/10 text-foreground/70",
};

const getPageWindow = (current: number, total: number): number[] => {
  const start = Math.min(Math.max(1, current - 1), Math.max(1, total - 2));
  return Array.from({ length: Math.min(3, total) }, (_, index) => start + index);
};

const RefundRequestsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("RF-8821");
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleRows = useMemo(() => {
    const byTab =
      activeTab === "all"
        ? refundRows
        : refundRows.filter((row) => row.status === activeTab);

    const lowered = query.trim().toLowerCase();

    return lowered
      ? byTab.filter(
          (row) =>
            row.requester.toLowerCase().includes(lowered) ||
            row.id.toLowerCase().includes(lowered) ||
            row.eventName.toLowerCase().includes(lowered),
        )
      : byTab;
  }, [activeTab, query]);

  const selected = refundRows.find((row) => row.id === selectedId) ?? refundRows[0];

  const totalPages = Math.ceil(TOTAL_REFUNDS / PAGE_SIZE);
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, TOTAL_REFUNDS);

  const handleBatchProcess = () => {
    setBatchLoading(true);
    window.setTimeout(() => {
      setBatchLoading(false);
      setBatchOpen(false);
    }, 900);
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-surface font-inter text-left">
      <div className="admin-page ">

        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="admin-page-title">
              Refund Requests
            </h1>
            <p className="admin-page-description">
              Manage participant refund claims and transaction reversals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-foreground/10 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-foreground/15"
            >
              <FiDownload size={13} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => setBatchOpen(true)}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-primary/90"
            >
              <FiRefreshCw size={13} />
              Process Batch
            </button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.id}
                className="rounded-lg border border-border_color bg-surface-elevated p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    {stat.label}
                  </span>
                  <Icon size={22} className="text-secondary/70" />
                </div>
                <p
                  className={`mt-3 text-3xl font-bold tracking-tight ${
                    stat.valueTone === "primary" ? "text-primary" : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`mt-3 flex items-center gap-1.5 text-xs ${
                    stat.footerTone === "greenish"
                      ? "font-semibold text-greenish"
                      : stat.footerTone === "secondary"
                        ? "text-secondary"
                        : "text-foreground-muted"
                  }`}
                >
                  {stat.footerTone === "greenish" && <FiTrendingUp size={12} />}
                  {stat.footer}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">

          <div className="overflow-hidden rounded-lg border border-border_color bg-surface-elevated">
            <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="admin-section-title font-jakarta text-base font-semibold text-foreground">
                  Refund Queue
                </h2>
                <p className="mt-1 text-xs text-foreground-muted">
                  Triage high-risk claims before payout reversal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <FiSearch
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search requests..."
                    className="w-44 rounded-md bg-foreground/10 py-2 pl-8 pr-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md bg-foreground/10 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-foreground/15"
                >
                  <FiFilter size={13} />
                  Filter
                </button>
              </div>
            </div>

            <div className="border-t border-border_color/60 px-5 pt-3">
              <div className="flex items-center gap-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 pb-2 text-xs font-semibold transition ${
                      activeTab === tab.id
                        ? "border-secondary text-foreground"
                        : "border-transparent text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-1 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="w-[13%] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Request ID
                    </th>
                    <th className="w-[28%] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      User / Event
                    </th>
                    <th className="w-[12%] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Amount
                    </th>
                    <th className="w-[16%] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Reason
                    </th>
                    <th className="w-[15%] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Status
                    </th>
                    <th className="w-[16%] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => {
                    const isSelected = selectedId === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className={`cursor-pointer border-t border-border_color/60 transition ${
                          isSelected ? "bg-primary/10" : "hover:bg-foreground/5"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p className="text-xs font-bold text-foreground">{row.id}</p>
                          <p className="mt-0.5 text-[10px] text-foreground-muted">
                            {row.submitted}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-secondary">
                              {row.avatar}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {row.requester}
                              </p>
                              <p className="mt-0.5 max-w-[160px] text-[10px] leading-snug text-foreground-muted">
                                {row.eventName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-foreground">{row.amount}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-[95px] text-xs leading-snug text-foreground/80">
                            {row.reason}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${STATUS_CLASSES[row.status]}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`View ${row.id}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(row.id);
                              }}
                              className="rounded p-1.5 text-foreground/80 transition hover:bg-foreground/10 hover:text-foreground"
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Approve ${row.id}`}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded p-1.5 text-greenish transition hover:bg-greenish/10"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Reject ${row.id}`}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded p-1.5 text-secondary transition hover:bg-secondary/10"
                            >
                              <FiX size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`More actions for ${row.id}`}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded p-1.5 text-foreground-muted transition hover:bg-foreground/10 hover:text-foreground"
                            >
                              <FiMoreVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border_color/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-foreground-muted">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {rangeStart}-{rangeEnd}
                </span>{" "}
                of {TOTAL_REFUNDS.toLocaleString("en-US")} requests
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted transition hover:bg-foreground/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiX size={0} className="hidden" />
                  ‹
                </button>
                {getPageWindow(currentPage, totalPages).map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-current={page === currentPage ? "page" : undefined}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition ${
                      page === currentPage
                        ? "bg-primary font-bold text-foreground"
                        : "text-foreground-muted hover:bg-foreground/10 hover:text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md text-foreground transition hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">

            <section className="rounded-lg border border-border_color bg-surface-elevated p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="admin-section-title font-jakarta text-base font-semibold text-foreground">
                    Request Inspector
                  </h2>
                  <p className="mt-1 text-xs text-foreground-muted">
                    Selected claim details
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${PRIORITY_CLASSES[selected.priority]}`}
                >
                  {selected.priority}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FiUser size={17} />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{selected.requester}</p>
                  <p className="mt-0.5 text-[10px] text-foreground-muted">
                    {selected.requesterEmail}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-3">
                {[
                  { label: "Request ID", value: selected.id },
                  { label: "Transaction", value: selected.transactionId },
                  { label: "Event", value: selected.eventName },
                  { label: "Amount", value: selected.amount },
                  { label: "Reason", value: selected.reason },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between gap-4">
                    <dt className="text-xs text-foreground-muted">{item.label}</dt>
                    <dd className="max-w-[150px] text-right text-xs font-semibold text-foreground">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-md bg-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <FiShield size={13} className="text-secondary" />
                    Risk Score
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    {selected.riskScore}%
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-foreground/15">
                  <div
                    className={`h-full rounded-full ${
                      selected.riskScore > 70
                        ? "bg-primary"
                        : selected.riskScore > 35
                          ? "bg-secondary"
                          : "bg-greenish"
                    }`}
                    style={{ width: `${selected.riskScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded-md bg-foreground/10 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-foreground/15"
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-foreground transition hover:bg-primary/90"
                >
                  Approve Refund
                </button>
              </div>
            </section>

            <section className="rounded-lg border border-border_color bg-surface-elevated p-5">
              <h2 className="admin-section-title font-jakarta text-base font-semibold text-foreground">
                Risk Assessment
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/80">High Value Refunds</span>
                    <span className="text-sm font-bold text-foreground">24</span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-foreground/15">
                    <div className="h-full w-3/5 rounded-full bg-primary" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/80">Fraud Signals</span>
                    <span className="text-sm font-bold text-secondary">8</span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-foreground/15">
                    <div className="h-full w-1/4 rounded-full bg-secondary" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border_color bg-surface-elevated p-5">
              <h2 className="admin-section-title font-jakarta text-base font-semibold text-foreground">
                Automated Rules
              </h2>

              <ul className="mt-4 space-y-4">
                {rules.map((rule) => (
                  <li key={rule.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{rule.label}</p>
                      <p className="mt-0.5 max-w-[190px] text-[10px] leading-snug text-foreground-muted">
                        {rule.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={rule.enabled}
                      onClick={() => toggleRule(rule.id)}
                      className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                        rule.enabled ? "bg-primary" : "bg-foreground/15"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-3 w-3 rounded-full bg-foreground transition ${
                          rule.enabled ? "left-5" : "left-1"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </section>

        <section className="mt-4 rounded-lg border border-border_color bg-surface-elevated p-5">
          <div className="flex items-center justify-between">
            <h2 className="admin-section-title font-jakarta text-base font-semibold text-foreground">
              Recent Activity
            </h2>
            <button
              type="button"
              className="text-xs font-semibold text-secondary transition hover:text-foreground"
            >
              View audit trail
            </button>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {activityItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ACTIVITY_CLASSES[item.tone]}`}
                  >
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[10px] text-foreground-muted">
                      {item.meta}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <ConfirmModal
        open={batchOpen}
        onClose={() => setBatchOpen(false)}
        onConfirm={handleBatchProcess}
        message="Process all eligible pending refunds in the current queue? High-risk refunds will remain under manual review."
        loading={batchLoading}
      />
    </div>
  );
};

export default RefundRequestsPage;
