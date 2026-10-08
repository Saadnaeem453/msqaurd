import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiArrowDown,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiClock,
  FiDownload,
  FiEdit,
  FiEye,
  FiFilter,
  FiMic,
  FiPlus,
  FiSettings,
  FiShare2,
  FiSliders,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  delta?: { text: string; tone: "greenish" };
}

type DeltaTone = "greenish" | "primary" | "muted";

interface CategoryRow {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  iconClasses: string;
  slug: string;
  count: number;
  delta: string;
  deltaTone: DeltaTone;
  colorHex: string;
  visible: boolean;
  archived: boolean;
}

interface LogicRule {
  id: string;
  icon: IconType;
  title: string;
  description: string;
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  { id: "tiers", label: "Total Tiers", value: "12", icon: FiShare2, delta: { text: "+2 New", tone: "greenish" } },
  { id: "events", label: "Active Events", value: "1,402", icon: FiCalendar },
  { id: "visibility", label: "Public Visibility", value: "91.6%", icon: FiEye },
  { id: "growth", label: "Growth Tier", value: "Workshop", icon: FiTrendingUp },
];

const initialRows: CategoryRow[] = [
  {
    id: "talks",
    name: "Talks",
    description: "Keynotes & Panel Discussions",
    icon: FiMic,
    iconClasses: "bg-report-blue/10 text-report-blue",
    slug: "/talks",
    count: 428,
    delta: "+12%",
    deltaTone: "greenish",
    colorHex: "#3b82f6",
    visible: true,
    archived: false,
  },
  {
    id: "galas",
    name: "Galas",
    description: "Formal & Charity Events",
    icon: FiStar,
    iconClasses: "bg-yellow-400/10 text-yellow-400",
    slug: "/galas",
    count: 82,
    delta: "-3%",
    deltaTone: "primary",
    colorHex: "#f59e0b",
    visible: true,
    archived: false,
  },
  {
    id: "workshops",
    name: "Workshops",
    description: "Interactive Learning Sessions",
    icon: FiUser,
    iconClasses: "bg-green/20 text-green",
    slug: "/workshops",
    count: 694,
    delta: "+34%",
    deltaTone: "greenish",
    colorHex: "#10b981",
    visible: true,
    archived: false,
  },
  {
    id: "meetups",
    name: "Meetups",
    description: "Casual Networking (Archived)",
    icon: FiUsers,
    iconClasses: "bg-bgray/10 text-bgray/50",
    slug: "/meetups",
    count: 14,
    delta: "Stable",
    deltaTone: "muted",
    colorHex: "#2e353f",
    visible: false,
    archived: true,
  },
];

const logicRules: LogicRule[] = [
  {
    id: "r1",
    icon: FiSliders,
    title: "Keyword Auto-Tagging",
    description: "Assign 'Workshop' if description includes 'hands-on'",
  },
  {
    id: "r2",
    icon: FiClock,
    title: "Automatic Archiving",
    description: "Hide categories with 0 events for > 180 days",
  },
];

const DELTA_CLASSES: Record<DeltaTone, string> = {
  greenish: "text-green",
  primary: "text-primary",
  muted: "text-secondary/65",
};

const STORAGE_KEY = "admin-event-category-config";
const EventCategoriesPage = () => {
  const [rows, setRows] = useState<CategoryRow[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return initialRows.map(row => {
        const value = (Array.isArray(saved?.categories) ? saved.categories : [])?.find((item: { id: string }) => item.id === row.id);
        return value && typeof value.name === "string" && typeof value.slug === "string" && typeof value.description === "string" && /^#[0-9a-f]{6}$/i.test(value.colorHex) && typeof value.visible === "boolean" && typeof value.archived === "boolean" ? { ...row, name: value.name, slug: value.slug, description: value.description, colorHex: value.colorHex, visible: value.visible, archived: value.archived } : row;
      });
    } catch { return initialRows; }
  });
  const [rules, setRules] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); return { keyword: typeof saved?.rules?.keyword === "string" ? saved.rules.keyword : "hands-on", days: Number.isInteger(saved?.rules?.days) && saved.rules.days > 0 ? saved.rules.days : 180, tagging: saved?.rules?.tagging !== false, archiving: saved?.rules?.archiving !== false }; }
    catch { return { keyword: "hands-on", days: 180, tagging: true, archiving: true }; }
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [dialog, setDialog] = useState<"edit" | "bulk" | "r1" | "r2" | "docs" | null>(null);
  const [draft, setDraft] = useState<CategoryRow>(initialRows[0]);
  const [bulkVisible, setBulkVisible] = useState("keep");
  const [bulkArchived, setBulkArchived] = useState("keep");
  const [ruleDraft, setRuleDraft] = useState(rules);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (dialog) dialogRef.current?.showModal(); else dialogRef.current?.close(); }, [dialog]);
  const persist = (nextRows: CategoryRow[], nextRules = rules) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories: nextRows.map(({ icon, ...row }) => { void icon; return row; }), rules: nextRules })); setRows(nextRows); setRules(nextRules); toast.success("Configuration saved in this browser."); return true; }
    catch { toast.error("Unable to save configuration. Check browser storage permissions."); return false; }
  };
  const filtered = rows.filter(row => (row.name + " " + row.slug).toLowerCase().includes(query.toLowerCase()) && (filter === "all" || (filter === "public" ? row.visible : filter === "hidden" ? !row.visible : row.archived)));
  if (sort === "count") filtered.sort((a,b) => b.count - a.count);
  if (sort === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allSelected = visibleRows.length > 0 && visibleRows.every(row => selectedIds.includes(row.id));
  const toggleRow = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(value => value !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(prev => allSelected ? prev.filter(id => !visibleRows.some(row => row.id === id)) : [...new Set([...prev, ...visibleRows.map(row => row.id)])]);
  const toggleVisible = (id: string) => persist(rows.map(row => row.id === id ? { ...row, visible: !row.visible, archived: row.visible ? row.archived : false } : row));
  const exportConfig = () => {
    const blob = new Blob([JSON.stringify({ version: 1, categories: rows.map(({ icon, ...row }) => { void icon; return row; }), rules }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "event-categories-config.json"; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const checkboxClass = (checked: boolean) =>
    `flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition ${
      checked ? "border-primary bg-primary" : "border-bgray/30 bg-transparent hover:border-bgray/60"
    }`;

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-md">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">
              Event Categories
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-secondary/80">
              Configure global classification tiers for all events hosted on the platform.
              Define visual styles, default parameters, and search indexing priority.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportConfig}
              className="flex items-center gap-2 rounded-md bg-bgray/10 px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
            >
              <FiDownload size={12} />
              Export Config
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiPlus size={12} />
              Add Category
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-md bg-[#192028] p-5">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-secondary">
                    {item.label}
                  </span>
                  <Icon size={16} className="text-bgray/20" />
                </div>
                <p className="mt-2 flex items-baseline gap-2 text-xl font-bold tracking-tight text-bgray">
                  {item.id === "tiers" ? rows.length : item.id === "events" ? rows.filter(row => !row.archived).reduce((total, row) => total + row.count, 0).toLocaleString() : item.id === "visibility" ? `${(rows.filter(row => row.visible).length / rows.length * 100).toFixed(1)}%` : item.value}

                </p>
              </div>
            );
          })}
        </section>

        {/* Toolbar */}
        <section className="mt-7 flex flex-wrap items-center gap-2 rounded-t-md bg-[#171e26] px-4 py-3">
          <button type="button" onClick={() => setFilterOpen(!filterOpen)} aria-expanded={filterOpen} className="flex items-center gap-1.5 rounded-md bg-bgray/10 px-3 py-1.5 text-[10px] font-semibold text-bgray transition hover:bg-bgray/15">
            <FiFilter size={11} />
            Filter
          </button>
          <button type="button" onClick={() => { setSort(sort === "count" ? "name" : "count"); setCurrentPage(1); }} className="flex items-center gap-1.5 rounded-md bg-bgray/10 px-3 py-1.5 text-[10px] font-semibold text-bgray transition hover:bg-bgray/15">
            <FiArrowDown size={11} />
            Sort by: {sort === "name" ? "Name" : sort === "count" ? "Count" : "Default"}
          </button>
          <button type="button" onClick={() => { if (!selectedIds.length) { toast.info("Select categories to bulk edit."); return; } setBulkVisible("keep"); setBulkArchived("keep"); setDialog("bulk"); }} className="flex items-center gap-1.5 rounded-md bg-bgray/10 px-3 py-1.5 text-[10px] font-semibold text-bgray transition hover:bg-bgray/15">
            <FiEdit size={11} />
            Bulk Edit
          </button>
          <span className="ml-auto text-[9px] text-secondary/65">
            Configuration saved locally in this browser
          </span>
        </section>

        {filterOpen && <div className="flex flex-wrap gap-3 bg-[#171e26] p-4"><label className="text-xs">Search<input value={query} onChange={event => { setQuery(event.target.value); setCurrentPage(1); }} className="ml-2 rounded bg-grayblue p-2" /></label><label className="text-xs">Visibility<select value={filter} onChange={event => { setFilter(event.target.value); setCurrentPage(1); }} className="ml-2 rounded bg-grayblue p-2"><option value="all">All categories</option><option value="public">Public</option><option value="hidden">Hidden</option><option value="archived">Archived</option></select></label><button type="button" onClick={() => { setFilter("all"); setQuery(""); setCurrentPage(1); }} className="text-xs text-secondary">Reset filters</button></div>}
        {/* Categories table */}
        <section className="overflow-hidden rounded-b-md bg-[#171e26]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="bg-[#0d151d]">
                  <th className="w-[4%] px-4 py-3">
                    <button type="button" role="checkbox" aria-checked={allSelected} aria-label="Select all categories" onClick={toggleAll} className={checkboxClass(allSelected)}>
                      {allSelected && <FiCheck size={9} className="text-bgray" />}
                    </button>
                  </th>
                  <th className="w-[26%] px-3 py-3 text-[9px] font-bold uppercase tracking-wider text-secondary">Tier Name &amp; Icon</th>
                  <th className="w-[12%] px-3 py-3 text-[9px] font-bold uppercase tracking-wider text-secondary">Slug</th>
                  <th className="w-[14%] px-3 py-3 text-[9px] font-bold uppercase tracking-wider text-secondary">Event Count</th>
                  <th className="w-[16%] px-3 py-3 text-[9px] font-bold uppercase tracking-wider text-secondary">Assigned Color</th>
                  <th className="w-[12%] px-3 py-3 text-[9px] font-bold uppercase tracking-wider text-secondary">Visibility</th>
                  <th className="w-[10%] px-3 py-3 text-[9px] font-bold uppercase tracking-wider text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const RowIcon = row.icon;
                  const checked = selectedIds.includes(row.id);
                  return (
                    <tr key={row.id} className="border-t border-bgray/[0.025] odd:bg-bgray/[0.015]">
                      <td className="px-4 py-4">
                        <button type="button" role="checkbox" aria-checked={checked} aria-label={`Select ${row.name}`} onClick={() => toggleRow(row.id)} className={checkboxClass(checked)}>
                          {checked && <FiCheck size={9} className="text-bgray" />}
                        </button>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${row.iconClasses}`}>
                            <RowIcon size={13} />
                          </span>
                          <div>
                            <p className={`text-xs font-bold ${row.archived ? "text-secondary/65" : "text-bgray"}`}>
                              {row.name}
                            </p>
                            <p className="mt-0.5 text-[9px] text-secondary/65">{row.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-xs text-secondary">{row.slug}</td>
                      <td className="px-3 py-4">
                        <span className="flex items-baseline gap-1.5">
                          <span className={`text-xs font-bold ${row.archived ? "text-bgray/70" : "text-bgray"}`}>
                            {row.count}
                          </span>
                          <span className={`text-[8px] font-semibold ${DELTA_CLASSES[row.deltaTone]}`}>
                            {row.delta}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="flex items-center gap-2">
                          {/* Assigned color is API data (hex shown in UI) — inline style is the data value, not a design token */}
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.colorHex }} />
                          <span className="text-[10px] text-bgray/80">{row.colorHex}</span>
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={row.visible}
                          aria-label={`Toggle ${row.name} visibility`}
                          onClick={() => toggleVisible(row.id)}
                          className={`relative h-5 w-9 shrink-0 rounded-full transition ${row.visible ? "bg-primary" : "bg-bgray/20"}`}
                        >
                          <span className={`absolute top-1 h-3 w-3 rounded-full bg-bgray transition-all ${row.visible ? "left-5" : "left-1"}`} />
                        </button>
                      </td>
                      {/* Actions column renders empty in the Figma — awaiting design clarification */}
                      <td className="px-3 py-4"><button type="button" aria-label={`Edit ${row.name}`} onClick={() => { setDraft({ ...row }); setDialog("edit"); }} className="rounded p-2 text-secondary hover:bg-bgray/10"><FiEdit size={14} /></button></td>
                    </tr>
                  );
                })}
              {visibleRows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-secondary">No categories match your filters.</td></tr>}</tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
            <p className="text-[10px] text-secondary/65">
              Showing <span className="font-bold text-bgray">{filtered.length ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, filtered.length)}</span> of{" "}
              <span className="font-bold text-bgray">{filtered.length}</span> categories
            </p>
            <div className="flex items-center gap-1.5"><label className="mr-3 text-[10px] text-secondary">Rows <select className="bg-grayblue p-1" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}><option value={4}>4</option><option value={2}>2</option><option value={1}>1</option></select></label>
              <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setCurrentPage(Math.max(1, page - 1))} className="flex h-7 w-7 items-center justify-center rounded-md text-secondary/65 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40">
                <FiChevronLeft size={12} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={page === Math.min(currentPage, totalPages) ? "page" : undefined} className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold transition ${page === Math.min(currentPage, totalPages) ? "bg-primary font-bold text-bgray" : "text-secondary/65 hover:text-bgray"}`}>
                  {page}
                </button>
              ))}
              <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => setCurrentPage(Math.min(totalPages, page + 1))} className="flex h-7 w-7 items-center justify-center rounded-md text-bgray transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40">
                <FiChevronRight size={12} />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Logic builder */}
          <div className="rounded-xl border border-bgray/5 bg-gradient-to-br from-[#171c24] to-[#231c25] p-6 lg:col-span-2">
            <h2 className="font-jakarta text-base font-semibold text-bgray">
              Category Logic Builder
            </h2>
            <p className="mt-2 max-w-[420px] text-xs leading-relaxed text-secondary/80">
              Automation rules for smart categorization based on event metadata and keyword
              analysis.
            </p>
            <ul className="mt-4 space-y-3">
              {logicRules.map((rule) => {
                const RuleIcon = rule.icon;
                return (
                  <li key={rule.id} className="flex items-center gap-3 rounded-md bg-[#0d151d] p-3">
                    <RuleIcon size={14} className="shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-bgray">{rule.title}</p>
                      <p className="mt-0.5 text-[9px] text-secondary/65">{rule.id === "r1" ? `${rules.tagging ? "Assign Workshop" : "Disabled"}: description includes ?${rules.keyword}?` : `${rules.archiving ? "Hide" : "Disabled:"} categories with 0 events for > ${rules.days} days`}</p>
                    </div>
                    <button type="button" aria-label={`Configure ${rule.title}`} onClick={() => { setRuleDraft({ ...rules }); setDialog(rule.id as "r1" | "r2"); }} className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                      <FiSettings size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Custom tier CTA */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-bgray/5 bg-[#242b35] p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
              <FiAlertCircle size={20} className="text-primary" />
            </span>
            <h2 className="mt-4 font-jakarta text-base font-semibold text-bgray">
              Need a Custom Tier?
            </h2>
            <p className="mt-2 max-w-[190px] text-[9px] leading-relaxed text-secondary/65">
              Contact the technical architecture team for tiers requiring custom JSON payloads
              or specialized API endpoints.
            </p>
            <button type="button" onClick={() => setDialog("docs")} className="mt-4 w-full rounded-md bg-grayblue py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/10">
              Documentation
            </button>
          </div>
        </section>
      </div>
      <dialog ref={dialogRef} onClose={() => setDialog(null)} className="w-[calc(100%-2rem)] max-w-lg rounded-lg border border-bgray/10 bg-[#192028] p-6 text-bgray backdrop:bg-black/70">
        <form onSubmit={event => {
          event.preventDefault();
          if (dialog === "edit") {
            if (!draft.name.trim() || !/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug) || rows.some(row => row.id !== draft.id && row.slug === draft.slug)) { toast.error("Enter a name and unique slug such as /workshops."); return; }
            if (persist(rows.map(row => row.id === draft.id ? { ...draft, name: draft.name.trim(), visible: draft.archived ? false : draft.visible } : row))) setDialog(null);
          } else if (dialog === "bulk") {
            if (persist(rows.map(row => { if (!selectedIds.includes(row.id)) return row; const archived = bulkArchived === "keep" ? (bulkVisible === "yes" ? false : row.archived) : bulkArchived === "yes"; return { ...row, archived, visible: archived ? false : bulkVisible === "keep" ? row.visible : bulkVisible === "yes" }; }))) { setSelectedIds([]); setDialog(null); }
          } else if (dialog === "r1" || dialog === "r2") { if (persist(rows, { ...ruleDraft, keyword: ruleDraft.keyword.trim() })) setDialog(null); }
        }}>
          <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-lg">{dialog === "edit" ? "Edit Category" : dialog === "bulk" ? `Edit ${selectedIds.length} Categories` : dialog === "docs" ? "Category Configuration Guide" : dialog === "r1" ? "Keyword Auto-Tagging" : "Automatic Archiving"}</h2><button type="button" onClick={() => setDialog(null)} aria-label="Close dialog" className="p-2"><FiX size={18} /></button></div>
          {dialog === "edit" && <div className="space-y-4">{(["name", "slug", "description"] as const).map(key => <label key={key} className="block text-sm capitalize">{key}<input required value={draft[key]} onChange={event => setDraft({ ...draft, [key]: event.target.value })} className="mt-1 block w-full rounded bg-grayblue p-3" /></label>)}<label className="flex items-center gap-3 text-sm">Assigned color<input type="color" value={draft.colorHex} onChange={event => setDraft({ ...draft, colorHex: event.target.value })} /></label><label className="flex gap-2 text-sm"><input type="checkbox" checked={draft.archived} onChange={event => setDraft({ ...draft, archived: event.target.checked })} />Archived (hidden from public)</label></div>}
          {dialog === "bulk" && <div className="space-y-4">{[{ label: "Visibility", value: bulkVisible, set: setBulkVisible, yes: "Public", no: "Hidden" }, { label: "Archive state", value: bulkArchived, set: setBulkArchived, yes: "Archived", no: "Active" }].map(item => <label key={item.label} className="block text-sm">{item.label}<select value={item.value} onChange={event => item.set(event.target.value)} className="mt-2 block w-full bg-grayblue p-3"><option value="keep">Keep current value</option><option value="yes">{item.yes}</option><option value="no">{item.no}</option></select></label>)}</div>}
          {(dialog === "r1" || dialog === "r2") && <div className="space-y-4"><label className="flex gap-2 text-sm"><input type="checkbox" checked={dialog === "r1" ? ruleDraft.tagging : ruleDraft.archiving} onChange={event => setRuleDraft({ ...ruleDraft, [dialog === "r1" ? "tagging" : "archiving"]: event.target.checked })} />Enable rule</label>{dialog === "r1" ? <label className="block text-sm">Description keyword<input required pattern=".*\S.*" value={ruleDraft.keyword} onChange={event => setRuleDraft({ ...ruleDraft, keyword: event.target.value })} className="mt-2 block w-full bg-grayblue p-3" /></label> : <label className="block text-sm">Days without events<input type="number" required min={1} max={3650} value={ruleDraft.days} onChange={event => setRuleDraft({ ...ruleDraft, days: Number(event.target.value) })} className="mt-2 block w-full bg-grayblue p-3" /></label>}<p className="text-xs text-secondary">Rule settings are saved locally and included in exports. Applying rules to live events requires backend integration.</p></div>}
          {dialog === "docs" ? <div className="space-y-4 text-sm leading-6 text-secondary"><p>Select categories using the checkboxes, then use Bulk Edit to change visibility or archive state. Archived categories are hidden. Turning visibility on restores a category.</p><p>Edit names, unique slugs, and colors with each row?s edit button. Filter by visibility or search by name and slug. Sorting applies to all matching categories.</p><p>Export Config downloads JSON containing all available categories and automation settings. Changes are saved in this browser; no server configuration is updated. Only the four supplied category records are available.</p></div> : <button type="submit" className="mt-6 rounded bg-primary px-5 py-2.5 text-sm text-white">Save Changes</button>}
        </form>
      </dialog>
    </div>
  );
};

export default EventCategoriesPage;