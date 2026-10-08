import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiCheck,
  FiCheckSquare,
  FiChevronDown,
  FiChevronUp,
  FiCreditCard,
  FiGlobe,
  FiInfo,
  FiLock,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";

type RefundType = "user" | "system";
type QueueTab = "all" | "urgent";

interface RefundRow {
  id: string;
  name: string;
  reason: string;
  event: string;
  txn: string;
  amount: string;
  type: RefundType;
  urgent: boolean;
}

interface Dispute {
  id: string;
  provider: string;
  ref: string;
  due: string;
  claim: string;
}

interface VolumeBar {
  id: string;
  value: number;
  dip: boolean;
}

const refundRows: RefundRow[] = [
  {
    id: "r1",
    name: "Marcus Thorne",
    reason: "Complaint: Audio Failure",
    event: "Cyber City Expo 2024",
    txn: "TXN_9921_AD",
    amount: "$245.00",
    type: "user",
    urgent: false,
  },
  {
    id: "r2",
    name: "Isabella Ross",
    reason: "Cancellation: Personal",
    event: "Deep Tech Summit",
    txn: "TXN_1102_XS",
    amount: "$1,200.00",
    type: "system",
    urgent: true,
  },
  {
    id: "r3",
    name: "Quantum Logistics",
    reason: "Bulk Cancellation (Event Cancelled)",
    event: "London Logistics Fair",
    txn: "TXN_4483_BT",
    amount: "$14,500.00",
    type: "system",
    urgent: true,
  },
];

const TYPE_LABELS: Record<RefundType, { label: string; classes: string }> = {
  user: { label: "User-Req", classes: "text-report-blue" },
  system: { label: "System-Req", classes: "text-report-amber" },
};

const disputes: Dispute[] = [
  {
    id: "d1",
    provider: "Stripe",
    ref: "DIS_1A4892",
    due: "Due: 24h",
    claim: "Claim: “Product not received” for Digital Access Key.",
  },
  {
    id: "d2",
    provider: "Amex",
    ref: "AU_990182",
    due: "Due: 3d",
    claim: "Claim: “Fraudulent transaction” from attendee portal.",
  },
];

const volumeBars: VolumeBar[] = [
  { id: "v1", value: 30, dip: false },
  { id: "v2", value: 42, dip: false },
  { id: "v3", value: 22, dip: true },
  { id: "v4", value: 38, dip: false },
  { id: "v5", value: 34, dip: false },
  { id: "v6", value: 52, dip: false },
  { id: "v7", value: 44, dip: false },
];

const trendStats = [
  { id: "approval", label: "Approval Rate", value: "82.4%" },
  { id: "response", label: "Avg Response", value: "4.2h" },
];

const headerStats = [
  { id: "pending", label: "Pending Action", value: "14 Requests", tone: "primary" },
  { id: "disputes", label: "Active Disputes", value: "3 Chargebacks", tone: "secondary" },
] as const;

const RefundsAdjudicationPage = () => {
  const [activeTab, setActiveTab] = useState<QueueTab>("all");
  const [autoApprove, setAutoApprove] = useState(true);
  const [refundWindow, setRefundWindow] = useState(14);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const visibleRows = useMemo(
    () => (activeTab === "all" ? refundRows : refundRows.filter((row) => row.urgent)),
    [activeTab],
  );

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  return (
    <div className="relative min-h-full bg-grayblue pb-24 font-jakarta font-normal text-bgray">
      <div className="admin-page ">

        <header className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="admin-page-title">
              Refunds &amp; Adjudication
            </h1>
            <p className="admin-page-description">
              Manage global return requests and resolve financial disputes.
            </p>
          </div>
          <div className="flex gap-8 md:justify-end">
            {headerStats.map((stat) => (
              <div key={stat.id}>
                <p className="text-xs font-normal uppercase tracking-wider text-bgray/80">
                  {stat.label}
                </p>
                <p
                  className={`mt-1 text-sm font-normal ${
                    stat.tone === "primary" ? "text-primary" : "text-secondary"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">

          <div className="space-y-3 lg:col-span-2">

            <section className="overflow-hidden rounded-[4px] bg-report-panel">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <h2 className="admin-section-title flex items-center gap-2 font-jakarta text-sm font-normal text-bgray">
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary">
                    <FiRefreshCw size={11} className="text-bgray" />
                  </span>
                  Incoming Refund Requests
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-pressed={activeTab === "all"}
                    onClick={() => setActiveTab("all")}
                    className={`rounded-sm px-3 py-1.5 text-xs font-normal transition ${
                      activeTab === "all"
                        ? "bg-report-control text-bgray"
                        : "bg-report-control text-bgray/70 hover:text-bgray"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    aria-pressed={activeTab === "urgent"}
                    onClick={() => setActiveTab("urgent")}
                    className={`rounded-sm px-3 py-1.5 text-xs font-normal transition ${
                      activeTab === "urgent"
                        ? "bg-primary/25 font-normal text-secondary"
                        : "bg-primary/15 text-secondary hover:bg-primary/20"
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] table-fixed text-left">
                  <thead>
                    <tr className="bg-report-control/40">
                      <th className="w-[22%] px-4 py-2.5 text-[10px] font-normal uppercase tracking-wider text-bgray/70">
                        Requester / Reason
                      </th>
                      <th className="w-[26%] px-4 py-2.5 text-[10px] font-normal uppercase tracking-wider text-bgray/70">
                        Event Context
                      </th>
                      <th className="w-[14%] px-4 py-2.5 text-[10px] font-normal uppercase tracking-wider text-bgray/70">
                        Amount
                      </th>
                      <th className="w-[16%] px-4 py-2.5 text-[10px] font-normal uppercase tracking-wider text-bgray/70">
                        Type
                      </th>
                      <th className="w-[22%] px-4 py-2.5 text-[10px] font-normal uppercase tracking-wider text-bgray/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row) => {
                      const type = TYPE_LABELS[row.type];
                      const selected = selectedIds.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          tabIndex={0}
                          aria-selected={selected}
                          onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); toggleSelected(row.id); } }}
                          onClick={() => toggleSelected(row.id)}
                          className={`cursor-pointer border-t border-bgray/[0.025] transition ${
                            selected ? "bg-primary/10" : "hover:bg-report-control/40"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <p className="max-w-[110px] text-sm font-normal leading-snug text-bgray">
                              {row.name}
                            </p>
                            <p className="mt-1 max-w-[110px] text-sm leading-snug text-secondary">
                              {row.reason}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="max-w-[140px] text-sm leading-snug text-bgray/90">
                              {row.event}
                            </p>
                            <p className="mt-1 text-xs text-secondary">{row.txn}</p>
                          </td>
                          <td className="px-4 py-4 text-xs font-normal text-bgray">
                            {row.amount}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-[10px] font-normal uppercase tracking-wide ${type.classes}`}
                            >
                              {type.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                aria-label={`Approve refund ${row.txn}`}
                                onClick={(e) => { e.stopPropagation(); setActionMessage(`Refund ${row.txn}: processing is unavailable until the refund service is connected.`); }}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-green/10 text-green transition hover:bg-green/20"
                              >
                                <FiCheck size={10} />
                              </button>
                              <button
                                type="button"
                                aria-label={`Reject refund ${row.txn}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary/20 text-secondary transition hover:bg-primary/30"
                              >
                                <FiX size={10} />
                              </button>
                              <button
                                type="button"
                                aria-label={`Retry refund ${row.txn}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-report-control text-bgray/70 transition hover:bg-report-control hover:text-bgray"
                              >
                                <FiRefreshCw size={10} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[4px] bg-report-panel p-4">
              <FiAlertTriangle
                size={26}
                className="absolute right-2 top-12 text-bgray/10"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="admin-section-title flex items-center gap-2 font-jakarta text-sm font-normal text-bgray">
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary">
                    <FiCreditCard size={11} className="text-bgray" />
                  </span>
                  External Disputes (Chargebacks)
                </h2>
                <span className="rounded-sm bg-primary/20 px-3 py-1.5 text-xs font-normal text-secondary">
                  Requires Evidence
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {disputes.map((dispute) => (
                  <article key={dispute.id} className="rounded-sm bg-report-control/40 p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-normal text-bgray">
                        {dispute.provider}: {dispute.ref}
                      </p>
                      <span className="shrink-0 text-xs text-bgray/80">{dispute.due}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-secondary/80">
                      {dispute.claim}
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full rounded-sm bg-report-alert py-2 text-xs font-normal text-grayblue transition hover:bg-secondary/90"
                    >
                      Submit Counter-Evidence
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-3">

            <section className="rounded-[4px] bg-report-panel p-4">
              <h2 className="admin-section-title flex items-center gap-2 font-jakarta text-sm font-normal text-bgray">
                <FiGlobe size={15} className="text-primary" />
                Global Eligibility
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-sm bg-report-control/40 p-3">
                  <span className="text-xs font-normal text-bgray">{"Auto-approve < $50"}</span>
                  <button
                    type="button"
                    aria-label="Automatically approve refunds under $50"
                    role="switch"
                    aria-checked={autoApprove}
                    onClick={() => setAutoApprove((v) => !v)}
                    className={`relative h-5 w-10 shrink-0 rounded-full transition ${
                      autoApprove ? "bg-primary" : "bg-report-control"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-3 w-3 rounded-full bg-bgray transition-all ${
                        autoApprove ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-sm bg-report-control/40 p-3">
                  <span className="text-xs font-normal text-bgray">Refund Window (Days)</span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs font-normal text-bgray">{refundWindow}</span>
                    <span className="flex flex-col">
                      <button
                        type="button"
                        aria-label="Increase refund window"
                        onClick={() => setRefundWindow((d) => d + 1)}
                        className="text-secondary/80 transition hover:text-bgray"
                      >
                        <FiChevronUp size={9} />
                      </button>
                      <button
                        type="button"
                        aria-label="Decrease refund window"
                        onClick={() => setRefundWindow((d) => Math.max(1, d - 1))}
                        className="text-secondary/80 transition hover:text-bgray"
                      >
                        <FiChevronDown size={9} />
                      </button>
                    </span>
                  </span>
                </div>

                <div className="rounded-sm bg-report-control/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-normal text-bgray">Force Refund Lock</span>
                    <FiInfo size={13} className="text-secondary/80" />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-secondary/80">
                    Prevents any refund processing for selected sensitive events.
                  </p>
                  <button
                    type="button"
                    className="mt-3 flex items-center gap-1.5 text-xs font-normal text-secondary transition hover:text-bgray"
                  >
                    <FiLock size={11} />
                    Select Locked Events
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[4px] bg-report-panel p-4">
              <h2 className="admin-section-title font-jakarta text-sm font-normal text-bgray">Volume Trends</h2>
              <div className="mt-4 h-32 text-secondary/80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeBars} barCategoryGap="5%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Bar dataKey="value">
                      {volumeBars.map((bar, index) => (
                        <Cell key={bar.id} className={index === 6 ? "fill-primary" : index === 5 ? "fill-primary/75" : bar.dip ? "fill-primary/20" : "fill-primary/35"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {trendStats.map((stat) => (
                  <div key={stat.id}>
                    <p className="text-[10px] font-normal uppercase tracking-wider text-secondary/80">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm font-normal text-bgray">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {actionMessage && <div role="status" className="mx-5 mb-4 flex items-center justify-between gap-4 rounded-sm border border-secondary/20 bg-report-control p-4 text-sm md:mx-6 lg:mx-8">{actionMessage}<button type="button" aria-label="Close message" onClick={() => setActionMessage(null)}><FiX size={16} /></button></div>}

      <div className="sticky bottom-4 z-20 mx-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-primary px-4 py-2.5 md:mx-6 lg:mx-8">
        <span className="flex items-center gap-2 text-xs font-normal text-bgray">
          <FiCheckSquare size={15} />
          {selectedIds.length} Items Selected
        </span>
        <span className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActionMessage(selectedIds.length ? "Selected refunds are preview data. Connect the refund service to apply bulk actions." : "Select refund requests first.")}
            className="rounded-sm bg-secondary/25 px-4 py-2 text-xs font-normal text-bgray transition hover:bg-secondary/40"
          >
            Bulk Approve
          </button>
          <button
            type="button"
            className="rounded-sm bg-secondary/25 px-4 py-2 text-xs font-normal text-bgray transition hover:bg-secondary/40"
          >
            Flag for Review
          </button>
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => setSelectedIds([])}
            className="rounded p-1 text-bgray transition hover:bg-primary/50"
          >
            <FiX size={16} />
          </button>
        </span>
      </div>
    </div>
  );
};

export default RefundsAdjudicationPage;
