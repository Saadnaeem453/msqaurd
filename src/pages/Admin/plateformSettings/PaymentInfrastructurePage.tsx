import { useState } from "react";
import {
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiDollarSign,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiMoreVertical,
  FiPlus,
  FiTrendingUp,
} from "react-icons/fi";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface LatencyBar {
  id: string;
  ms: number;
  highlight: boolean;
}

interface LatencyRow {
  id: string;
  label: string;
  value: string;
  tone: "green" | "light" | "muted";
}

interface AuditRow {
  id: string;
  dotClass: string;
  text: string;
  time: string;
}

type LedgerStatus = "settled" | "pending" | "hold";

interface LedgerRow {
  id: string;
  merchantId: string;
  entity: string;
  gross: string;
  fee: string;
  net: string;
  status: LedgerStatus;
}

interface ToggleState {
  autoCapture: boolean;
  threeDSecure: boolean;
}

/* ================== Mock data (swap with real API later) ================== */



const latencyBars: LatencyBar[] = [
  { id: "b1", ms: 140, highlight: false },
  { id: "b2", ms: 90, highlight: false },
  { id: "b3", ms: 160, highlight: false },
  { id: "b4", ms: 220, highlight: true },
  { id: "b5", ms: 150, highlight: false },
  { id: "b6", ms: 110, highlight: false },
  { id: "b7", ms: 80, highlight: false },
  { id: "b8", ms: 130, highlight: false },
];

const latencyRows: LatencyRow[] = [
  { id: "auth", label: "Authorization", value: "182ms", tone: "green" },
  { id: "settlement", label: "Settlement API", value: "314ms", tone: "light" },
  { id: "refunds", label: "Refunds", value: "220ms", tone: "muted" },
];

const auditRows: AuditRow[] = [
  { id: "a1", dotClass: "bg-primary", text: "Fee Change: A. Rivera adjusted global marketplace fee to 8.5%", time: "14 mins ago" },
  { id: "a2", dotClass: "bg-bgray/40", text: "Payout Batch: Batch #9928 processed for 12 nodes", time: "1 hour ago" },
  { id: "a3", dotClass: "bg-green", text: "Gateway Sync: Stripe webhooks synchronized successfully", time: "3 hours ago" },
  { id: "a4", dotClass: "bg-primary", text: 'Alert: High refund rate detected on Event "Cyber Tokyo"', time: "5 hours ago" },
];

const ledgerRows: LedgerRow[] = [
  { id: "r1", merchantId: "#M-88210", entity: "Nebula Soundstage", gross: "$42,000.00", fee: "$3,648.50", net: "$38,253.50", status: "settled" },
  { id: "r2", merchantId: "#M-91044", entity: "Vanguard Expo Group", gross: "$112,040.00", fee: "$9,523.40", net: "$102,516.60", status: "pending" },
  { id: "r3", merchantId: "#M-77122", entity: "Underground Labs", gross: "$8,120.00", fee: "-$690.20", net: "$7,429.80", status: "settled" },
  { id: "r4", merchantId: "#M-22904", entity: "Summit Peak Media", gross: "$56,770.00", fee: "-$4,825.45", net: "$51,944.55", status: "hold" },
];

const statusBadge: Record<LedgerStatus, { label: string; badgeClass: string }> = {
  settled: { label: "Settled", badgeClass: "bg-green/15 text-green" },
  pending: { label: "Pending", badgeClass: "bg-primary/15 text-primary" },
  hold: { label: "On Hold", badgeClass: "bg-bgray/15 text-bgray/80" },
};

const toneClass: Record<LatencyRow["tone"], string> = {
  green: "text-green",
  light: "text-bgray/90",
  muted: "text-secondary/70",
};

const PAGE_COUNT = 3;

/* ============================= Page ============================= */

const PaymentInfrastructurePage = () => {
  const [showKey, setShowKey] = useState(false);
  const [toggles, setToggles] = useState<ToggleState>({ autoCapture: true, threeDSecure: true });
  const [page, setPage] = useState(1);

  const flipToggle = (key: keyof ToggleState) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText("WEBHOOK_SECRET");
      toast.success("Webhook secret copied.");
    } catch {
      toast.error("Clipboard access was denied.");
    }
  };

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-medium tracking-tight text-bgray">Payment Infrastructure</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-bgray/10 px-4 py-2 text-sm font-semibold text-bgray transition hover:bg-bgray/15"
            >
              <FiDownload size={13} />
              Export Ledger
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiPlus size={13} />
              New Gateway Connection
            </button>
          </div>
        </header>

        {/* Row 1 — stat cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-md border-l-2 border-primary bg-[#151c24] p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
                Net Volume (24h)
              </p>
              <FiTrendingUp size={14} className="text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold text-bgray">$1,429,082.44</p>
            <p className="mt-2 flex items-center gap-1.5">
              <FiArrowUp size={10} className="text-green" />
              <span className="text-[12px] font-bold text-green">12.4%</span>
              <span className="text-[9px] text-secondary/70">vs previous period</span>
            </p>
          </section>

          <section className="rounded-md bg-[#151c24] p-5">
            <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
              Success Rate
            </p>
            <p className="mt-2 text-xl font-bold text-bgray">99.92%</p>
            <div className="mt-2 h-0.5 w-full rounded-full bg-green" />
          </section>

          <section className="rounded-md bg-[#151c24] p-5">
            <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
              Pending Payouts
            </p>
            <p className="mt-2 flex items-baseline gap-2 text-xl font-bold text-bgray">
              142
              <span className="text-[12px] font-normal text-secondary/70">Requests</span>
            </p>
            <p className="mt-2 text-[9px] font-bold text-primary">Action Required</p>
          </section>
        </div>

        {/* Row 2 — Stripe Connect + Gateway latency */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)]">
          <section className="rounded-md bg-[#151c24] p-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500">
                <FiDollarSign size={15} className="text-bgray" />
              </span>
              <h2 className="text-2xl font-medium text-bgray">Stripe Connect</h2>
              <span className="ml-auto rounded-sm bg-green/15 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-green">
                Active
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
                  Production API Key
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-sm bg-bgray/10 px-3 py-2.5">
                  <span className="truncate font-mono text-[12px] text-bgray/80">
                    {showKey ? "API_KEY_FULL" : "API_KEY_MASKED"}
                  </span>
                  <button
                    type="button"
                    aria-label={showKey ? "Mask production API key" : "Reveal production API key"}
                    onClick={() => setShowKey((v) => !v)}
                    className="ml-auto shrink-0 text-secondary/70 transition hover:text-bgray"
                  >
                    {showKey ? <FiEyeOff size={12} /> : <FiEye size={12} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
                  Webhook Secret
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-sm bg-bgray/10 px-3 py-2.5">
                  <span className="truncate font-mono text-[12px] text-bgray/80">{"WEBHOOK_SECRET"}</span>
                  <button
                    type="button"
                    aria-label="Copy webhook secret"
                    onClick={copyWebhook}
                    className="ml-auto shrink-0 text-secondary/70 transition hover:text-bgray"
                  >
                    <FiCopy size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[12px] font-medium text-bgray/90">Auto-capture Payments</p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggles.autoCapture}
                  aria-label="Auto-capture payments"
                  onClick={() => flipToggle("autoCapture")}
                  className={`mt-2 relative h-3 w-6 shrink-0 rounded-full transition ${
                    toggles.autoCapture ? "bg-primary" : "bg-bgray/25"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-2 w-2 rounded-full bg-bgray transition-all ${
                      toggles.autoCapture ? "left-3.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div>
                <p className="text-[12px] font-medium text-bgray/90">3D Secure Requirement</p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggles.threeDSecure}
                  aria-label="3D secure requirement"
                  onClick={() => flipToggle("threeDSecure")}
                  className={`mt-2 relative h-3 w-6 shrink-0 rounded-full transition ${
                    toggles.threeDSecure ? "bg-primary" : "bg-bgray/25"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-2 w-2 rounded-full bg-bgray transition-all ${
                      toggles.threeDSecure ? "left-3.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div>
                <p className="text-[12px] font-medium text-bgray/90">Dynamic Descriptor</p>
                <p className="mt-2 font-mono text-[12px] text-bgray/80">M2-EVNT* {"{EVENT_ID}"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-md bg-[#151c24] p-5">
            <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
              Gateway Latency
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[12px] text-bgray/90">{latencyRows[0].label}</span>
              <span className={`text-[12px] font-bold ${toneClass[latencyRows[0].tone]}`}>
                {latencyRows[0].value}
              </span>
            </div>
            <div className="mt-3 h-14 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyBars} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Bar dataKey="ms" radius={[1, 1, 0, 0]}>
                    {latencyBars.map((bar) => (
                      <Cell key={bar.id} fill="#e50a15" fillOpacity={bar.highlight ? 1 : 0.35} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-2">
              {latencyRows.slice(1).map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-bgray/90">{row.label}</span>
                  <span className={`text-[12px] ${toneClass[row.tone]}`}>{row.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Row 3 — Fee architecture + Audit trail */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)]">
          <section className="rounded-md bg-[#151c24] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-medium text-bgray">Fee Architecture</h2>
              <button type="button" className="text-[12px] font-bold text-primary transition hover:underline">
                Manage Overrides
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-sm bg-bgray/5 p-4">
                <p className="text-[9px] font-medium uppercase tracking-widest text-secondary">
                  Standard Marketplace Fee
                </p>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-baseline gap-1 text-xl font-bold text-bgray">
                      8.5
                      <span className="text-[12px] font-normal text-secondary/70">%</span>
                    </p>
                    <p className="mt-1 text-[8px] text-secondary/70">Per ticket transaction</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-bgray">$0.30</p>
                    <p className="mt-1 text-[8px] text-secondary/70">Fixed platform fee</p>
                  </div>
                </div>
              </div>

              <div className="rounded-sm bg-bgray/5 p-4">
                <p className="text-[9px] font-medium uppercase tracking-widest text-secondary">
                  Merchant Payout Schedule
                </p>
                <p className="mt-3 rounded-sm bg-bgray/10 px-3 py-2.5 text-[12px] text-bgray/90">
                  T+2 Daily Rolling
                </p>
                <p className="mt-2 text-[8px] text-secondary/70">
                  Next scheduled batch: Today, 23:59 UTC
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-md bg-[#151c24] p-5">
            <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
              Audit Trail
            </p>
            <ul className="mt-4 space-y-4">
              {auditRows.map((row) => (
                <li key={row.id} className="flex items-start gap-2.5">
                  <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${row.dotClass}`} aria-hidden="true" />
                  <div>
                    <p className="text-[12px] leading-snug text-bgray/90">{row.text}</p>
                    <p className="mt-1 text-[8px] uppercase tracking-wide text-secondary/70">{row.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Row 4 — Merchant settlement ledger */}
        <section className="mt-6 rounded-md bg-[#151c24] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-medium text-bgray">Merchant Settlement Ledger</h2>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Filter ledger" className="rounded p-1 text-secondary/70 transition hover:text-bgray">
                <FiFilter size={14} />
              </button>
              <button type="button" aria-label="Ledger options" className="rounded p-1 text-secondary/70 transition hover:text-bgray">
                <FiMoreVertical size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-bgray/10">
                  {["Merchant ID", "Entity Name", "Gross Vol", "Platform Fee", "Net Payout", "Status"].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-widest text-secondary/70 first:pl-0 last:pr-0"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledgerRows.map((row) => (
                  <tr key={row.id} className="border-b border-bgray/5 last:border-0">
                    <td className="px-3 py-3 pl-0 font-mono text-[12px] text-bgray/70">{row.merchantId}</td>
                    <td className="px-3 py-3 text-[12px] font-semibold text-bgray">{row.entity}</td>
                    <td className="px-3 py-3 text-[12px] text-bgray/90">{row.gross}</td>
                    <td className="px-3 py-3 text-[12px] font-semibold text-primary">{row.fee}</td>
                    <td className="px-3 py-3 text-[12px] text-bgray/90">{row.net}</td>
                    <td className="px-3 py-3 pr-0">
                      <span
                        className={`rounded-sm px-2 py-1 text-[8px] font-bold uppercase tracking-wide ${statusBadge[row.status].badgeClass}`}
                      >
                        {statusBadge[row.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[9px] text-secondary/70">Showing 1-4 of 142 records</p>
            <nav aria-label="Ledger pagination" className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 text-secondary/70 transition hover:text-bgray disabled:opacity-40"
              >
                <FiChevronLeft size={12} />
              </button>
              {[1, 2, PAGE_COUNT].map((num) => (
                <button
                  key={num}
                  type="button"
                  aria-current={page === num ? "page" : undefined}
                  onClick={() => setPage(num)}
                  className={`h-5 w-5 rounded-sm text-[9px] font-bold transition ${
                    page === num ? "bg-primary text-bgray" : "text-bgray/70 hover:bg-bgray/10"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={page === PAGE_COUNT}
                onClick={() => setPage((p) => Math.min(PAGE_COUNT, p + 1))}
                className="rounded p-1 text-secondary/70 transition hover:text-bgray disabled:opacity-40"
              >
                <FiChevronRight size={12} />
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentInfrastructurePage;