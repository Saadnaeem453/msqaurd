import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiExternalLink,
  FiFilter,
  FiFlag,
  FiMoreVertical,
  FiMusic,
  FiSlash,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

interface StatItem {
  id: string;
  label: string;
  value: string;
  valueTone: "secondary" | "foreground";
  cornerIcon: IconType;
  cornerTone: "muted" | "primary";
  tinted?: boolean;
  footer: { kind: "trend"; text: string } | { kind: "icon"; icon: IconType; text: string; tone: "muted" | "secondary" };
}

type QueueStatus = "connected" | "error";

interface QueueRow {
  id: string;
  name: string;
  orgId: string;
  icon: IconType;
  balance: string;
  status: QueueStatus;
  hasProcessButton: boolean;
}

interface HistoryItem {
  id: string;
  tone: "success" | "failed";
  title: string;
  meta: string;
  time: string;
}

const statItems: StatItem[] = [
  {
    id: "pending",
    label: "Total Pending Payouts",
    value: "$428,950.00",
    valueTone: "secondary",
    cornerIcon: FiCreditCard,
    cornerTone: "muted",
    footer: { kind: "trend", text: "+12% from last week" },
  },
  {
    id: "processed",
    label: "Processed (Last 30d)",
    value: "$1,294,000",
    valueTone: "foreground",
    cornerIcon: FiCheckCircle,
    cornerTone: "muted",
    footer: { kind: "icon", icon: FiCheckCircle, text: "482 batches settled", tone: "muted" },
  },
  {
    id: "failed",
    label: "Failed Payouts",
    value: "12",
    valueTone: "secondary",
    cornerIcon: FiAlertCircle,
    cornerTone: "primary",
    tinted: true,
    footer: { kind: "icon", icon: FiAlertTriangle, text: "Requires Immediate Attention", tone: "secondary" },
  },
];

const queueRows: QueueRow[] = [
  {
    id: "q1",
    name: "Global Arena Corp",
    orgId: "92834-EV",
    icon: FiCreditCard,
    balance: "$124,500.00",
    status: "connected",
    hasProcessButton: true,
  },
  {
    id: "q2",
    name: "Echo Beats Festival",
    orgId: "11409-MS",
    icon: FiMusic,
    balance: "$82,140.50",
    status: "error",
    hasProcessButton: false,
  },
  {
    id: "q3",
    name: "Velocity Racing Hub",
    orgId: "55210-VH",
    icon: FiFlag,
    balance: "$21,000.00",
    status: "connected",
    hasProcessButton: true,
  },
];

const historyItems: HistoryItem[] = [
  {
    id: "h1",
    tone: "success",
    title: "Bulk Settlement #8821",
    meta: "$2,140,000 processed to 12 banks",
    time: "Oct 24, 2023 • 09:42 AM",
  },
  {
    id: "h2",
    tone: "success",
    title: "Individual Payout #9011",
    meta: "Sent to Skyline Events Group",
    time: "Oct 23, 2023 • 04:15 PM",
  },
  {
    id: "h3",
    tone: "failed",
    title: "Failed Settlement #8819",
    meta: "Swift rejection from JP Morgan",
    time: "Oct 23, 2023 • 11:20 AM",
  },
];

export default function PayoutsPage() {
  const [cycle, setCycle] = useState<"weekly" | "monthly">("weekly");
  const [day, setDay] = useState("Monday");
  const [monthDay, setMonthDay] = useState("1");
  const [autoApproval, setAutoApproval] = useState(true);
  const [connectedOnly, setConnectedOnly] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; body: string } | null>(null);
  const visibleRows = queueRows.filter((row) => !connectedOnly || row.status === "connected");
  const reviewPayout = (row?: QueueRow) => setDialog({
    title: row ? `Process payout: ${row.name}` : "Process bulk payouts",
    body: row
      ? `${row.balance} is awaiting settlement for ${row.name}. Payout processing is unavailable until the payment service is connected.`
      : "Two connected organizers are shown in this preview. Bulk processing is unavailable until the payment service is connected.",
  });

  return (
    <div className="min-h-full bg-grayblue font-jakarta font-normal text-bgray [&_button]:font-normal [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">
        <header className="admin-page-heading"><div><h1 className="admin-page-title">Payouts</h1><p className="admin-page-description">Review organizer payouts, settlement schedules, and payment history.</p></div></header>
        <section aria-label="Payout summary" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {statItems.map((stat) => {
            const CornerIcon = stat.cornerIcon;
            const FooterIcon = stat.footer.kind === "trend" ? FiTrendingUp : stat.footer.icon;
            return (
              <article key={stat.id} className={`relative min-h-[140px] overflow-hidden rounded-[4px] border p-5 ${stat.tinted ? "border-primary/10 bg-primary/[0.025]" : "border-bgray/5 bg-report-head"}`}>
                <p className="relative z-10 text-xs uppercase tracking-wider text-secondary">{stat.label}</p>
                <p className={`relative z-10 mt-3 text-[clamp(22px,2vw,32px)] leading-tight ${stat.valueTone === "secondary" ? "text-report-alert" : "text-bgray"}`}>{stat.value}</p>
                <p className={`relative z-10 mt-4 flex items-center gap-1.5 text-xs ${stat.footer.kind === "trend" ? "text-green" : stat.tinted ? "text-report-alert" : "text-secondary"}`}>
                  <FooterIcon aria-hidden="true" size={12} />{stat.footer.text}
                </p>
                <CornerIcon aria-hidden="true" size={82} className={`absolute bottom-1 right-2 ${stat.cornerTone === "primary" ? "text-secondary/10" : "text-bgray/5"}`} />
              </article>
            );
          })}
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(260px,1fr)]">
          <section aria-labelledby="payout-queue-heading" className="min-w-0">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 id="payout-queue-heading" className="admin-section-title text-lg font-normal">Payout Queue</h2>
              <div className="flex gap-2">
                <button type="button" aria-label="Show connected organizers only" aria-pressed={connectedOnly} onClick={() => setConnectedOnly((value) => !value)} className={`flex items-center gap-2 rounded-sm px-3 py-2 text-xs ${connectedOnly ? "bg-secondary text-grayblue" : "bg-report-control text-bgray"}`}><FiFilter size={13} />Filter</button>
                <button type="button" onClick={() => reviewPayout()} className="flex items-center gap-2 rounded-sm bg-report-alert px-3 py-2 text-xs text-grayblue hover:bg-secondary"><FiTrendingUp size={13} />Process Bulk</button>
              </div>
            </header>
            <div className="overflow-hidden rounded-[4px] border border-bgray/5 bg-report-head">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[590px] table-fixed text-left">
                  <colgroup><col className="w-[28%]" /><col className="w-[24%]" /><col className="w-[25%]" /><col className="w-[23%]" /></colgroup>
                  <thead className="bg-report-panel text-[10px] uppercase tracking-wider text-secondary">
                    <tr><th className="px-4 py-4 font-normal">Organizer</th><th className="px-4 py-4 font-normal">Current<br />Balance</th><th className="px-4 py-4 font-normal">Status</th><th className="px-4 py-4 text-right font-normal">Action</th></tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row) => {
                      const Icon = row.icon;
                      return (
                        <tr key={row.id} className="border-t border-bgray/[0.025]">
                          <td className="px-4 py-5"><div className="flex items-center gap-3"><span className="flex h-8 w-6 shrink-0 items-center justify-center bg-report-control text-secondary"><Icon size={17} /></span><div><p className="max-w-[105px] text-sm leading-5">{row.name}</p><p className="mt-1 text-[10px] text-secondary">ID: {row.orgId}</p></div></div></td>
                          <td className="px-4 py-5 text-sm tabular-nums">{row.balance}</td>
                          <td className="px-4 py-5"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] uppercase leading-3 ${row.status === "connected" ? "bg-green/10 text-green" : "bg-primary/15 text-secondary"}`}>{row.status === "connected" ? <FiCheckCircle size={10} /> : <FiSlash size={10} />}<span>{row.status === "connected" ? "Connected" : <>Stripe<br />Error</>}</span></span></td>
                          <td className="px-4 py-5 text-right">{row.hasProcessButton ? <button type="button" onClick={() => reviewPayout(row)} className="bg-report-control px-3 py-2 text-sm leading-4 hover:bg-bgray/20">Process<br />Payout</button> : <button type="button" aria-label={`Review payout error for ${row.name}`} onClick={() => setDialog({ title: "Stripe connection error", body: `${row.name} needs its payout connection reviewed before settlement. No payout has been processed.` })} className="p-2 text-secondary hover:bg-bgray/10"><FiMoreVertical size={17} /></button>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="min-w-0 space-y-5">
            <section className="rounded-[4px] border border-bgray/5 bg-report-head p-5">
              <h2 className="admin-section-title flex items-center gap-2 text-base font-normal"><FiClock size={16} className="text-report-alert" />Auto-Scheduling</h2>
              <fieldset className="mt-6"><legend className="mb-2 text-sm text-secondary">Settlement Cycle</legend><div className="grid grid-cols-2 gap-2">{(["weekly", "monthly"] as const).map((value) => <button key={value} type="button" aria-pressed={cycle === value} onClick={() => setCycle(value)} className={`rounded-sm py-2 text-xs capitalize ${cycle === value ? "bg-report-alert text-grayblue" : "bg-report-control text-secondary"}`}>{value}</button>)}</div></fieldset>
              <label className="mt-5 block text-sm text-secondary" htmlFor="payout-day">Process on day</label>
              <select id="payout-day" value={cycle === "weekly" ? day : monthDay} onChange={(event) => cycle === "weekly" ? setDay(event.target.value) : setMonthDay(event.target.value)} className="mt-2 w-full rounded-sm border border-transparent bg-report-control px-3 py-2 text-xs text-bgray focus:border-secondary focus:outline-none">
                {cycle === "weekly" ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((value) => <option key={value}>{value}</option>) : Array.from({ length: 28 }, (_, index) => <option key={index + 1} value={String(index + 1)}>Day {index + 1}</option>)}
              </select>
              <div className="mt-6 flex items-center justify-between gap-3 px-2"><div><p id="auto-approval-label" className="text-xs">Auto-Approval</p><p className="mt-1 text-[10px] text-secondary">For amounts under $10,000</p></div><button type="button" role="switch" aria-checked={autoApproval} aria-labelledby="auto-approval-label" onClick={() => setAutoApproval((value) => !value)} className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${autoApproval ? "bg-report-alert" : "bg-report-control"}`}><span className={`h-4 w-4 rounded-full bg-grayblue transition-transform ${autoApproval ? "translate-x-4" : "translate-x-0"}`} /></button></div>
              <button type="button" onClick={() => setDialog({ title: "Settlement rules preview", body: `${cycle === "weekly" ? `Weekly on ${day}` : `Monthly on day ${monthDay}`}; auto-approval ${autoApproval ? "enabled for amounts under $10,000" : "disabled"}. These settings have not been saved: the settlement service is not connected.` })} className="mt-7 w-full rounded-sm border border-secondary/60 px-2 py-3 text-xs text-secondary hover:bg-secondary/5">Update Settlement Rules</button>
            </section>

            <section className="rounded-[4px] border border-bgray/5 bg-report-panel p-5">
              <header className="flex items-center justify-between"><h2 className="admin-section-title text-base font-normal">Settlement History</h2><button type="button" aria-label="View settlement history" onClick={() => setDialog({ title: "Settlement History", body: "The three sample settlements shown are the available preview history. Connect the settlement service to view the full ledger." })} className="p-1 text-secondary hover:text-bgray"><FiExternalLink size={15} /></button></header>
              <ol className="mt-5 space-y-6">{historyItems.map((item) => <li key={item.id} className="relative flex gap-3"><span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.tone === "success" ? "bg-green/15 text-green" : "bg-primary/15 text-secondary"}`}>{item.tone === "success" ? <FiCheck size={13} /> : <FiX size={13} />}</span><div><p className={`text-xs ${item.tone === "failed" ? "text-secondary" : "text-bgray"}`}>{item.title}</p><p className="mt-1 text-xs leading-4 text-secondary">{item.meta}</p><p className="mt-2 text-[10px] uppercase text-bgray/50">{item.time}</p></div></li>)}</ol>
            </section>
          </div>
        </div>
      </div>
      {dialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-grayblue/85 p-5" onKeyDown={(event) => { if (event.key === "Escape") setDialog(null); }}><section role="dialog" aria-modal="true" aria-labelledby="payout-dialog-title" className="w-full max-w-md rounded border border-bgray/10 bg-report-panel p-6 shadow-xl"><h2 id="payout-dialog-title" className="admin-section-title text-lg font-normal">{dialog.title}</h2><p className="mt-4 text-sm leading-6 text-secondary">{dialog.body}</p><button autoFocus type="button" onClick={() => setDialog(null)} className="mt-5 rounded-sm bg-report-control px-5 py-2 text-sm">Close</button></section></div>}
    </div>
  );
}
