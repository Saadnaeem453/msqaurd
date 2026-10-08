import { useState } from "react";
import { AlertTriangle, Aperture, Ban, ChevronLeft, ChevronRight, CircleAlert, FileWarning, History, ListFilter, MoreVertical, Timer, TrendingDown, X } from "lucide-react";

type Severity = "critical" | "medium" | "low";
const reports: { id: string; title: string; severity: Severity; reason: string; description: string; reporter: string; time: string; image: string }[] = [
  { id: "EV-882941", title: "Underground Nexus v2", severity: "critical", reason: "Inappropriate Imagery", description: "System detected high-contrast explicit patterns in visual buffer.", reporter: "USR-0092-ALPHA", time: "2 mins ago", image: "photo-1470229722913-7c0e2dbbafd3" },
  { id: "EV-110293", title: "Neon Pulse Live", severity: "medium", reason: "Misleading Content", description: "Description contains unverified financial promises.", reporter: "USR-5521-GAMMA", time: "18 mins ago", image: "photo-1514525253161-7a46d19cd819" },
  { id: "EV-449301", title: "Tech Summit Alpha", severity: "low", reason: "Spam", description: "Duplicate event posting across multiple regions.", reporter: "USR-3381-SIGMA", time: "45 mins ago", image: "photo-1518770660439-4636190af475" },
];
const badges: Record<Severity, string> = {
  critical: "border-primary/20 bg-primary/15 text-secondary",
  medium: "border-report-amber/20 bg-report-amber/15 text-report-amber",
  low: "border-report-blue/20 bg-report-blue/15 text-report-blue",
};

export default function EventReportPage() {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const visibleReports = criticalOnly ? reports.filter((row) => row.severity === "critical") : reports;
  const pages = page < 4 ? [1, 2, 3] : page > 54 ? [54, 55, 56] : [page - 1, page, page + 1];
  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-secondary">
      <div className="mx-auto max-w-[1500px] px-5 pb-8 pt-[22px] md:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold leading-8 tracking-tight">Reported Events Queue</h1>
          <div className="relative flex gap-2">
            <button type="button" onClick={() => setFilterOpen(!filterOpen)} aria-expanded={filterOpen} className="flex h-11 items-center gap-1.5 bg-report-control px-4 text-base"><ListFilter size={16} />Filter Queue</button>
            <button type="button" onClick={() => setAuditOpen(true)} className="flex h-11 items-center gap-1.5 rounded-[2px] bg-primary px-4 text-base"><History size={16} />Audit Log</button>
            {filterOpen && <div className="absolute right-0 top-full mt-2 z-10 rounded border border-border_color bg-lightgrayblue p-3 text-base shadow-lg"><label className="flex items-center gap-2 whitespace-nowrap"><input type="checkbox" checked={criticalOnly} onChange={(event) => { setCriticalOnly(event.target.checked); setPage(1); }} />Critical reports only</label></div>}
          </div>
        </header>
        <section aria-label="Report statistics" className="mt-[19px] grid grid-cols-1 gap-4 min-[1100px]:grid-cols-3">
          <div className="relative min-h-[150px] overflow-hidden rounded-[3px] bg-report-panel px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3px] text-secondary">Active Reports</p>
            <p className="mt-[6px] text-3xl font-semibold leading-9">1,402</p>
            <p className="mt-[9px] flex items-center gap-1 text-sm text-secondary/80"><span className="flex items-center gap-0.5 text-green"><TrendingDown size={14} />12%</span> vs last 24h</p>
            <FileWarning aria-hidden="true" className="absolute -bottom-1 -right-1 text-bgray/10" size={31} />
          </div>
          <div className="relative min-h-[150px] overflow-hidden rounded-[3px] border border-primary/10 bg-report-panel px-[15px] py-[15px]">
            <p className="text-xs uppercase tracking-[0.3px] text-secondary">High Severity</p>
            <p className="mt-[6px] text-3xl font-semibold leading-9 text-report-alert">87</p>
            <p className="mt-[9px] flex items-center gap-1 text-sm text-report-alert"><AlertTriangle size={14} />Requires Immediate Action</p>
            <CircleAlert aria-hidden="true" className="absolute -bottom-1 -right-1 text-secondary/10" size={32} />
          </div>
          <div className="relative min-h-[150px] overflow-hidden rounded-[3px] bg-report-panel px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3px] text-secondary">Resolution Time</p>
            <p className="mt-[6px] text-3xl font-semibold leading-9">14.2m</p>
            <p className="mt-[9px] flex items-center gap-1 text-sm text-secondary/70"><Timer size={14} />Avg. per report</p>
            <Aperture aria-hidden="true" className="absolute -bottom-1 -right-1 text-bgray/10" size={30} />
          </div>
        </section>
        <section className="mt-5 overflow-hidden rounded-[3px] bg-report-panel" aria-label="Pending review queue">
          <div className="flex min-h-[80px] flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-base font-normal">Pending Review Queue</h2>
            <div className="flex rounded-[2px] bg-grayblue p-[3px]">
              {[false, true].map((critical) => <button key={String(critical)} type="button" aria-pressed={criticalOnly === critical} onClick={() => { setCriticalOnly(critical); setPage(1); }} className={`px-3 py-2 text-sm leading-5 ${criticalOnly === critical ? "bg-report-control text-bgray" : "text-secondary"}`}>{critical ? "Critical Only" : "All Reports"}</button>)}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] table-fixed text-left">
              <colgroup><col className="w-[13%]" /><col className="w-[24%]" /><col className="w-[22%]" /><col className="w-[13%]" /><col className="w-[14%]" /><col className="w-[14%]" /></colgroup>
              <thead className="h-16 bg-report-head text-sm font-medium uppercase tracking-[0.5px] text-secondary"><tr>
                <th className="pl-4 font-medium">Severity</th><th className="px-2 font-medium">Event Target</th><th className="px-2 font-medium">Report Reason</th><th className="px-2 font-medium">Reporter<br />ID</th><th className="px-2 font-medium">Flagged<br />Time</th><th className="pr-4 text-right font-medium">Actions</th>
              </tr></thead>
              <tbody>{visibleReports.map((row) => <tr key={row.id} className="h-[120px] border-b border-bgray/5 [&_td]:py-4">
                <td className="pl-4"><span className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase leading-none ${badges[row.severity]}`}>{row.severity}</span></td>
                <td className="px-2"><div className="flex items-center gap-2"><img src={`https://images.unsplash.com/${row.image}?auto=format&fit=crop&w=60&h=60&q=80`} alt="" className="h-12 w-12 shrink-0 rounded-[1px] object-cover brightness-50" /><div><p className="max-w-[160px] text-base font-semibold leading-6">{row.title}</p><p className="mt-[1px] text-sm leading-5 text-secondary/80">ID: {row.id}</p></div></div></td>
                <td className="px-2"><p className="max-w-[200px] text-base leading-6">{row.reason}</p><p className="mt-[2px] max-w-[210px] text-sm leading-5 text-secondary">{row.description}</p></td>
                <td className="px-2 text-sm leading-5 text-secondary">{row.reporter.slice(0, 9)}<br />{row.reporter.slice(9)}</td>
                <td className="px-2 text-sm leading-5 text-secondary"><span className="block max-w-[90px]">{row.time}</span></td>
                <td className="pr-4"><div className="flex items-center justify-end gap-1">{[{ Icon: Ban, label: "Suspend" }, { Icon: X, label: "Dismiss" }, { Icon: MoreVertical, label: "Details" }].map(({ Icon, label }) => <button key={label} type="button" aria-label={`${label} ${row.title}`} onClick={() => setSelectedReport(`${label}: ${row.title}`)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-bgray/10 text-bgray hover:text-secondary"><Icon size={18} /></button>)}</div></td>
              </tr>)}</tbody>
            </table>
          </div>
          <footer className="flex min-h-[80px] flex-wrap items-center justify-between gap-4 px-5 py-4 text-sm text-secondary">
            <p>Showing {criticalOnly ? "1 - 1 of 1" : `${(page - 1) * 25 + 1} - ${Math.min(page * 25, 1402)} of 1,402`} reports</p>
            {!criticalOnly && <nav aria-label="Report pages" className="flex items-center gap-[3px]">
              <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)} className="flex h-9 w-9 items-center justify-center disabled:opacity-30"><ChevronLeft size={16} /></button>
              {pages.map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={number === page ? "page" : undefined} className={`h-9 w-9 rounded-[1px] ${page === number ? "bg-primary text-bgray" : "hover:bg-bgray/10"}`}>{number}</button>)}
              <span className="px-1">…</span><button type="button" onClick={() => setPage(57)} aria-current={page === 57 ? "page" : undefined} className={`h-9 w-9 ${page === 57 ? "bg-primary text-bgray" : ""}`}>57</button>
              <button type="button" aria-label="Next page" disabled={page === 57} onClick={() => setPage(page + 1)} className="flex h-9 w-9 items-center justify-center disabled:opacity-30"><ChevronRight size={16} /></button>
            </nav>}
          </footer>
        </section>
        {(auditOpen || selectedReport) && <div className="fixed inset-0 z-40 flex items-center justify-center bg-grayblue/80 p-5"><section role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" className="w-full max-w-sm rounded border border-border_color bg-report-panel p-5 shadow-xl"><div className="flex items-center justify-between gap-3"><h2 id="report-dialog-title" className="text-base font-semibold">{auditOpen ? "Audit Log" : selectedReport}</h2><button type="button" aria-label="Close dialog" onClick={() => { setAuditOpen(false); setSelectedReport(null); }}><X size={16} /></button></div><p className="mt-4 text-base text-secondary">{auditOpen ? "No audit entries available. Audit history requires a connected reporting service." : "This report is preview data. Moderation requires a connected reporting service."}</p></section></div>}
      </div>
    </div>
  );
}

