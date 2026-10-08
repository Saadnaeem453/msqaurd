import { useRef, useState } from "react";
import { FiChevronRight, FiFilePlus, FiGrid, FiList, FiMail, FiUsers, FiX } from "react-icons/fi";
import { toast } from "sonner";

const campaigns = [
  { title: "Q4 Exclusive Member Launch", subject: "Welcome to the future of events", status: "A/B TESTING", kind: "testing" },
  { title: "Security Protocol Update v2.4", subject: "Important security changes to your…", status: "SENDING", kind: "sending" },
  { title: "Post-Event Survey: 'Apex 24'", subject: "How was your experience at Apex?", status: "COMPLETED", kind: "completed" },
] as const;

const templates = [
  { title: "Welcome Series", used: "2h ago", tags: ["CORE", "ONBOARDING"] },
  { title: "Event Reminder", used: "Yesterday", tags: ["DYNAMIC"] },
  { title: "Policy Update", used: "1w ago", tags: ["SYSTEM", "LEGAL"] },
];

function CampaignArtwork({ variant }: { variant: number }) {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-full bg-grayblue" role="img" aria-label={['Member launch analytics illustration', 'Security monitoring dashboards illustration', 'Event control room illustration'][variant]}>
      <g className="stroke-report-blue/20" strokeWidth="2">
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 40} 0L${i * 40 - 70} 210M0 ${i * 30}H300`} />)}
      </g>
      <g transform={variant === 0 ? "translate(25 30) rotate(-16 120 80)" : variant === 1 ? "translate(12 10) skewY(-6)" : "translate(40 25)"}>
        <rect width="240" height="155" rx="3" className="fill-report-head stroke-report-blue/30" />
        <path d="M12 20H90M12 27H65" className="stroke-secondary/30" strokeWidth="3" />
        {Array.from({ length: variant === 0 ? 8 : 24 }, (_, i) => <rect key={i} x={15 + i * (variant === 0 ? 27 : 9)} y={125 - ((i * 37 + 19) % 80)} width={variant === 0 ? 13 : 4} height={(i * 37 + 19) % 80} className={i % 3 === 0 ? "fill-primary/80" : "fill-report-alert/30"} />)}
        <path d="M12 104L38 97 58 102 79 67 105 76 129 48 149 63 174 37 198 45 229 18" className="fill-none stroke-primary" strokeWidth="2" />
        <path d="M12 137H226M12 145H150" className="stroke-report-blue/30" strokeWidth="2" />
      </g>
      {variant === 2 && <g className="fill-report-control/70 stroke-report-blue/20"><path d="M30 175L105 140H225L283 175Z" /><path d="M80 173V210M246 173V210M149 155V202" /><rect x="137" y="116" width="34" height="37" /></g>}
    </svg>
  );
}

export default function EmailCampaignManagerPage() {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<{ title: string; subject: string }[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("admin-email-drafts") || "[]");
      return Array.isArray(saved) ? saved.filter((item) => typeof item?.title === "string" && typeof item?.subject === "string") : [];
    } catch { return []; }
  });
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploadedTemplates, setUploadedTemplates] = useState<string[]>([]);

  const saveDraft = () => {
    const next = [...drafts, { title: name.trim(), subject: subject.trim() }];
    try {
      localStorage.setItem("admin-email-drafts", JSON.stringify(next));
      setDrafts(next);
      setShowDrafts(true);
      dialogRef.current?.close();
      setName("");
      setSubject("");
      toast.success("Campaign draft saved in this browser.");
    } catch { toast.error("Unable to save this draft."); }
  };

  return (
    <div className="min-h-full bg-grayblue font-jakarta font-normal text-bgray">
      <div className="admin-page">
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs text-secondary">Communications <FiChevronRight size={12} /> <span className="text-bgray">Email Campaigns</span></nav>
        <header className="admin-page-heading">
          <h1 className="admin-page-title">Email Campaign Manager</h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowDrafts(!showDrafts)} aria-pressed={showDrafts} className="rounded-sm bg-report-control px-4 py-3 text-sm">{showDrafts ? "Active Campaigns" : `Drafts (${drafts.length})`}</button>
            <button type="button" onClick={() => dialogRef.current?.showModal()} className="flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm shadow-lg shadow-primary/15"><FiMail /> New Campaign</button>
          </div>
        </header>

        <section aria-label="Email performance" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-bgray/5 bg-gradient-to-br from-report-head to-finance-gmv/20 p-5">
            <p className="text-xs uppercase tracking-widest text-secondary">Emails Sent (MTD)</p>
            <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl">1.2M</span><span className="text-xs text-green">↗12.4%</span></div>
            <div className="mt-4 h-1 bg-report-control"><div className="h-full w-[82%] bg-primary" /></div>
          </div>
          <div className="border border-bgray/5 bg-report-head p-5">
            <p className="text-xs uppercase tracking-widest text-secondary">Open Rate</p>
            <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl">42.8%</span><span className="text-xs text-green">↗3.1%</span></div>
            <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs"><span className="text-secondary/70">INDUSTRY AVG: 22.5%</span><span className="text-primary">TOP TIER</span></div>
          </div>
          <div className="border border-bgray/5 bg-report-head p-5">
            <p className="text-xs uppercase tracking-widest text-secondary">Conversion Rate</p>
            <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl">8.4%</span><span className="text-xs text-secondary/60">−0.0%</span></div>
            <div className="mt-4 flex gap-1">{[0, 1, 2, 3].map(i => <span key={i} className={`h-1 flex-1 ${i < 2 ? "bg-primary" : "bg-primary/20"}`} />)}</div>
          </div>
          <div className="border border-bgray/5 bg-report-head p-5">
            <p className="text-xs uppercase tracking-widest text-secondary">Spam Score</p>
            <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl">0.02</span><span className="bg-green/10 px-2 py-1 text-xs text-green">OPTIMAL</span></div>
            <p className="mt-4 text-xs leading-6 text-secondary">System-wide monitoring active.<br />All nodes clean.</p>
          </div>
        </section>

        <div className="mt-8 grid items-start gap-4 xl:grid-cols-[3.15fr_1fr]">
          <section className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="admin-section-title">Recent Campaigns <span className="ml-1 text-sm text-secondary">(Filtered: {showDrafts ? "Drafts" : "Active"})</span></h2>
              <div className="flex gap-1">{(["grid", "list"] as const).map(mode => <button key={mode} type="button" aria-label={`${mode} view`} aria-pressed={layout === mode} onClick={() => setLayout(mode)} className={`p-2 text-secondary ${layout === mode ? "bg-report-control" : "bg-report-head"}`}>{mode === "grid" ? <FiGrid /> : <FiList />}</button>)}</div>
            </div>
            <div className={layout === "grid" ? "grid gap-4 md:grid-cols-3" : "grid gap-4"}>
              {showDrafts ? drafts.map((draft, i) => <article key={i} className="border border-bgray/5 bg-report-head p-5"><span className="text-xs text-secondary">DRAFT</span><h3 className="mt-3 text-base">{draft.title}</h3><p className="mt-2 text-sm text-secondary">Subject: {draft.subject}</p></article>) : campaigns.map((campaign, index) => (
                <article key={campaign.kind} className={`min-w-0 overflow-hidden border border-bgray/5 bg-report-head ${layout === "list" ? "sm:grid sm:grid-cols-[220px_1fr]" : ""}`}>
                  <div className="relative aspect-[1.4] overflow-hidden">
                    <CampaignArtwork variant={index} />
                    <span className={`absolute left-2 top-2 px-2 py-1 text-xs ${index === 0 ? "bg-primary" : index === 1 ? "bg-bgray text-grayblue" : "bg-report-control"}`}>{campaign.status}</span>
                  </div>
                  <div className="min-h-[230px] p-4">
                    <h3 className="text-base leading-6">{campaign.title}</h3><p className="mt-1 text-sm leading-5 text-secondary/70">Subject: {campaign.subject}</p>
                    {index === 0 ? <><div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div className="flex items-center gap-2"><FiUsers className="shrink-0 text-secondary" /><span>46,200<br /><span className="text-secondary">Recipients</span></span></div><span>2d 4h<br />remaining</span></div><div className="mt-6 flex items-center justify-between"><span className="flex text-xs"><span className="rounded-full bg-report-control px-2 py-1">A</span><span className="-ml-1 rounded-full bg-report-control px-2 py-1 ring-2 ring-report-head">B</span></span><span className="text-xs tracking-wider text-green">ACTIVE ●</span></div></> : index === 1 ? <><div className="mt-4 flex flex-wrap justify-between gap-1 text-xs text-secondary"><span>PROGRESS: 68%</span><span>724,110 / 1.05M</span></div><div className="mt-2 h-1 bg-report-control"><div className="h-full w-[68%] bg-bgray" /></div><div className="mt-6 flex flex-wrap justify-between gap-2 text-xs"><span className="text-secondary">Started 12:40 PM EST</span><span className="text-primary">Monitor Live</span></div></> : <><div className="mt-4 grid grid-cols-2 gap-2">{[["CTR", "14.2%"], ["BOUNCE", "0.4%"]].map(([label, value]) => <div key={label} className="border border-bgray/5 bg-lightgrayblue p-3"><p className="text-xs text-secondary">{label}</p><p className="mt-2 text-base">{value}</p></div>)}</div><p className="mt-5 border-t border-bgray/5 pt-3 text-xs text-secondary">Archived Oct 24, 2023</p></>}
                  </div>
                </article>
              ))}
            </div>
            {showDrafts && drafts.length === 0 && <p className="bg-report-head p-8 text-sm text-secondary">No saved drafts. Create a new campaign to get started.</p>}
          </section>

          <aside className="min-w-0 space-y-6">
            <section>
              <div className="mb-5 flex items-center justify-between gap-2"><h2 className="admin-section-title">Templates</h2><button type="button" onClick={() => setSelectedTemplate(selectedTemplate ? null : "All Templates")} className="text-xs text-primary">View All</button></div>
              <div className="space-y-3">{templates.map((template, i) => <button key={template.title} type="button" onClick={() => setSelectedTemplate(template.title)} className="flex w-full gap-3 border border-bgray/5 bg-report-head p-3 text-left"><span aria-hidden="true" className="relative h-16 w-12 shrink-0 border border-bgray/10 bg-report-control p-2"><span className={`mb-2 block h-1 ${i === 0 ? "bg-primary/30" : "bg-bgray/10"}`} /><span className="mb-1 block h-0.5 bg-secondary/25" /><span className="block h-0.5 w-3/4 bg-secondary/20" /></span><span className="min-w-0"><span className="block text-sm">{template.title}</span><span className="mt-1 block text-xs text-secondary">Last used: {template.used}</span><span className="mt-3 flex flex-wrap gap-1">{template.tags.map(tag => <span key={tag} className="bg-report-control px-1.5 py-1 text-[10px]">{tag}</span>)}</span></span></button>)}{uploadedTemplates.map((file, i) => <p key={`${file}-${i}`} className="break-words bg-report-head p-3 text-sm">{file}<span className="mt-1 block text-xs text-secondary">Selected locally</span></p>)}</div>
              <input ref={uploadRef} type="file" accept=".html,.htm" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) { setUploadedTemplates(current => [...current, file.name]); toast.info("Template selected locally. Server upload is not connected."); } e.target.value = ""; }} />
              <button type="button" onClick={() => uploadRef.current?.click()} className="mt-3 flex w-full items-center justify-center gap-2 border border-dashed border-bgray/10 py-3 text-xs text-secondary"><FiFilePlus /> Upload New Template</button>
              {selectedTemplate && <div className="mt-3 border border-bgray/10 bg-report-head p-4"><div className="flex justify-between gap-2"><h3 className="text-sm">{selectedTemplate}</h3><button type="button" aria-label="Close template details" onClick={() => setSelectedTemplate(null)}><FiX /></button></div><p className="mt-2 text-xs leading-5 text-secondary">{selectedTemplate === "All Templates" ? "All available templates are listed above." : "Use this template to start a new campaign draft."}</p>{selectedTemplate !== "All Templates" && <button type="button" className="mt-3 text-sm text-report-alert" onClick={() => { setName(selectedTemplate); dialogRef.current?.showModal(); }}>Use Template</button>}</div>}
            </section>
            <section className="border border-bgray/5 bg-report-head p-5"><h2 className="admin-section-title">Activity Feed</h2><ol className="mt-4 space-y-6">{[{title:"Campaign Finished",body:"'Post-Event Survey' reached 14,202 users.",time:"12 MINUTES AGO",color:"text-green"},{title:"Spam Alert (Resolved)",body:"Unusual bounce rate detected on Node-04.",time:"1 HOUR AGO",color:"text-primary"},{title:"New Template Drafted",body:"Marcus Chen created 'Flash Sale v4'.",time:"3 HOURS AGO",color:"text-analytics-neutral"}].map(item => <li key={item.title} className="relative border-l border-bgray/5 pl-5"><span className={`absolute -left-1.5 top-1 h-2.5 w-2.5 rounded-full border-2 border-current ${item.color}`} /><h3 className="text-xs">{item.title}</h3><p className="mt-1 text-xs leading-6 text-secondary">{item.body}</p><p className="mt-2 text-[10px] text-secondary/50">{item.time}</p></li>)}</ol></section>
          </aside>
        </div>
      </div>
      <dialog ref={dialogRef} className="w-[calc(100%-2rem)] max-w-lg rounded-md border border-bgray/10 bg-report-head p-6 text-bgray backdrop:bg-grayblue/80">
        <form onSubmit={event => { event.preventDefault(); saveDraft(); }}>
          <div className="mb-5 flex justify-between"><h2 className="text-xl">New Campaign</h2><button type="button" aria-label="Close new campaign" onClick={() => dialogRef.current?.close()}><FiX /></button></div>
          <label className="block text-sm text-secondary">Campaign name<input autoFocus required value={name} onChange={e => setName(e.target.value)} className="mt-2 block w-full rounded-sm bg-grayblue p-3 text-bgray" /></label>
          <label className="mt-4 block text-sm text-secondary">Email subject<input required value={subject} onChange={e => setSubject(e.target.value)} className="mt-2 block w-full rounded-sm bg-grayblue p-3 text-bgray" /></label>
          <button type="submit" className="mt-6 rounded-sm bg-primary px-5 py-3 text-sm">Save Draft</button>
        </form>
      </dialog>
    </div>
  );
}
