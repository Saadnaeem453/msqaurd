import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText, Filter, Monitor, MoreVertical, Settings, TrendingUp, User } from "lucide-react";

type Tone = "critical" | "routine";
const logs = [
    ["EV-88219", "Neon Genesis Rave", "Copyright Violation", "critical", "J. Dorsey", "24 Oct 2023, 14:22"],
    ["EV-90214", "Cyberpunk Flea Market", "Terms of Service", "routine", "M. Lowery", "23 Oct 2023, 09:15"],
    ["EV-44122", "Underground Logic Summit", "Prohibited Goods", "critical", "Sys_Auto_Mod", "22 Oct 2023, 18:45"],
    ["EV-11094", "Meta-Garden Exhibition", "Duplicate Listing", "routine", "T. Kim", "22 Oct 2023, 12:00"],
    ["EV-66723", "Void Echo Festival", "Public Safety Risk", "critical", "J. Dorsey", "21 Oct 2023, 22:10"],
] as const;
const reasonClasses: Record<Tone, string> = { critical: "bg-primary/15 text-secondary", routine: "bg-bgray/10 text-bgray/80" };

export default function RejectedEventsArchivePage() {
    const [page, setPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [exported, setExported] = useState(false);
    return <div className="min-h-full bg-grayblue font-jakarta text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-secondary">
        <div className="admin-page ">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div><h1 className="admin-page-title">Rejected Events Archive</h1><p className="admin-page-description">Review rejected events and follow appeal decisions.</p></div>
                <div className="relative flex items-center gap-2">
                    <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)} className="flex items-center gap-2 rounded-sm bg-report-control px-4 py-2.5 text-sm transition hover:bg-bgray/15"><Filter size={14} />Filter Archive</button>
                    <button type="button" onClick={() => setExported(true)} className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm transition hover:bg-primary/90"><Download size={14} />{exported ? "Log Exported" : "Export Log (CSV)"}</button>
                    {filterOpen && <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-sm border border-border_color bg-lightgrayblue p-3 text-sm shadow-lg">All archived events</div>}
                </div>
            </header>

            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[.8fr_.8fr_1.7fr]">
                <article className="min-h-[140px] font-bold rounded-[3px] bg-report-panel p-5"><p className="text-xs uppercase tracking-wide text-secondary">Total Rejected</p><p className="mt-2 text-2xl font-semibold">1,284</p><p className="mt-3 flex items-center gap-1.5 text-sm text-report-alert"><TrendingUp size={14} />+12% this month</p></article>
                <article className="min-h-[140px] font-bold rounded-[3px] bg-report-panel p-5"><p className="text-xs uppercase tracking-wide text-secondary">Appealed Events</p><p className="mt-2 text-2xl font-semibold">342</p><p className="mt-3 flex items-center gap-1.5 text-sm text-secondary"><FileText size={14} />26.6% Appeal Rate</p></article>
                <article className="min-h-[140px]font-bold rounded-[3px] bg-report-panel p-5"><p className="text-xs uppercase tracking-wide text-secondary">Violation Trends</p><div className="mt-5 grid grid-cols-2 gap-8">{[{ label: "Copyright", value: 42, color: "bg-primary" }, { label: "Harmful Content", value: 18, color: "bg-secondary" }].map((trend) => <div key={trend.label}><p className="flex justify-between text-xs text-secondary"><span>{trend.label}</span><span>{trend.value}%</span></p><div className="mt-2 h-1 bg-bgray/10"><div className={`h-full ${trend.color}`} style={{ width: `${trend.value}%` }} /></div></div>)}</div></article>
            </section>

            <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.85fr_.9fr]">
                <section className="overflow-hidden rounded-[3px] bg-report-panel">
                    <header className="flex min-h-[62px] flex-wrap items-center justify-between gap-3 px-5 py-4"><h2 className="admin-section-title text-sm font-medium uppercase tracking-wide">Historical Logs</h2><div className="flex items-center gap-4 text-xs text-secondary"><span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-report-alert" />Critical</span><span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-secondary" />Routine</span></div></header>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[780px] table-fixed text-left">
                            <colgroup><col className="w-[25%]" /><col className="w-[21%]" /><col className="w-[25%]" /><col className="w-[20%]" /><col className="w-[9%]" /></colgroup>
                            <thead className="bg-report-head text-xs uppercase tracking-wide text-secondary">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Event / ID</th>
                                    <th className="px-4 py-4 font-medium">Rejection Reason</th>
                                    <th className="px-4 py-4 font-medium">Admin Agent</th>
                                    <th className="px-4 py-4 font-medium">Timestamp</th>
                                    <th className="px-4 py-4 font-medium">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>{logs.map(([id, name, reason, tone, agent, date], index) => { const Agent = index === 2 ? Settings : User; return <tr key={id} className="border-t border-bgray/[.03]"><td className="px-5 py-4"><p className="max-w-[130px] text-base font-medium leading-5">{name}</p><p className="mt-1 text-xs text-secondary">ID: {id}</p></td><td className="px-4 py-4"><span className={`inline-block max-w-[100px] rounded-sm px-2 py-1 text-[11px] font-medium uppercase leading-4 ${reasonClasses[tone]}`}>{reason}</span></td><td className="px-4 py-4"><span className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${index === 2 ? "bg-bgray/10" : "bg-secondary/15"}`}><Agent size={12} /></span><span className="text-sm">{agent}</span></span></td><td className="px-4 py-4 text-sm leading-5 text-secondary"><span className="block max-w-[90px]">{date}</span></td><td className="px-4 py-4"><button type="button" aria-label={`Actions for ${name}`} className="rounded p-1 text-secondary hover:bg-bgray/10 hover:text-bgray"><MoreVertical size={16} /></button></td></tr> })}</tbody></table></div>
                    <footer className="flex items-center justify-between px-5 py-4 text-xs text-secondary"><span>Showing {(page - 1) * 5 + 1} - {page * 5} of 1,284 entries</span><div className="flex gap-2"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid h-8 w-8 place-items-center rounded-sm bg-report-control disabled:opacity-40"><ChevronLeft size={16} /></button><button type="button" aria-label="Next page" disabled={page === 12} onClick={() => setPage((value) => Math.min(12, value + 1))} className="grid h-8 w-8 place-items-center rounded-sm bg-report-control disabled:opacity-40"><ChevronRight size={16} /></button></div></footer>
                </section>
                <aside className="rounded-[3px] bg-report-panel p-5"><div className="flex items-center justify-between gap-3"><h2 className="admin-section-title text-lg font-medium">Appeal History</h2><span className="rounded-sm bg-primary px-2 py-1 text-[10px] font-semibold uppercase">In Review</span></div><div className="mt-5 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-sm bg-primary/20 text-primary"><FileText size={21} /></span><div><p className="text-base font-medium">Neon Genesis Rave</p><p className="mt-1 text-xs text-secondary">Organized by: Anomalia Ent.</p></div></div><ol className="mt-7 border-l border-bgray/10 pl-5"><li className="relative pb-7"><i className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary" /><p className="text-sm font-semibold">Second Appeal Submitted</p><p className="mt-1 text-xs text-secondary">26 Oct 2023, 11:20</p><blockquote className="mt-3 rounded-sm bg-bgray/[.06] p-3 text-sm leading-5 text-secondary">“We have obtained a direct license from the IP holder for all tracks used. Documentation attached in encrypted vault.”</blockquote><span className="mt-2 inline-flex items-center gap-1 rounded-sm bg-bgray/10 px-2 py-1 text-xs text-secondary"><FileText size={12} />license_final.pdf</span></li><li className="relative"><i className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-bgray/30" /><p className="text-sm font-semibold">First Appeal Rejected</p><p className="mt-1 text-xs text-secondary">25 Oct 2023, 14:10</p><p className="mt-2 text-sm leading-5 text-secondary">Admin J. Dorsey: Proof of license received was a free-use scan and not a commercial grant.</p></li></ol><button type="button" className="mt-7 flex w-full items-center justify-center gap-2 rounded-sm bg-report-control px-3 py-3 text-sm transition hover:bg-bgray/15"><Monitor size={16} />Open Adjudication Console</button></aside>
            </div>
        </div>
    </div>;
}
