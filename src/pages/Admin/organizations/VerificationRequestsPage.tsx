import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiBook,
  FiBriefcase,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiFileText,
  FiX,
} from "react-icons/fi";
import { HiOutlineNoSymbol } from "react-icons/hi2";
import ConfirmModal from "../../../components/ui/ConfirmModal";

/* ============================= Types ============================= */

type TabId = "all" | "urgent" | "non-profit" | "enterprise";
type SortId = "newest" | "oldest" | "priority";
type Priority = "high" | "normal";

interface HistoryEntry {
  id: string;
  title: string;
  time: string;
  active: boolean;
}

interface VerificationRow {
  id: string;
  name: string;
  icon: IconType;
  type: string;
  filterKey: TabId;
  date: string;
  priority: Priority;
  requestId: string;
  regNumber: string;
  vat: string;
  assets: number;
  history: HistoryEntry[];
}

interface ConfirmState {
  action: "approve" | "reject";
}

/* ================== Mock data (swap with real API later) ================== */

const initialRows: VerificationRow[] = [
  {
    id: "v1",
    name: "Vanguard Logistics Ltd.",
    icon: FiBriefcase,
    type: "Enterprise",
    filterKey: "enterprise",
    date: "Oct 24, 2023 · 09:15",
    priority: "high",
    requestId: "VER-99210-ALPH",
    regNumber: "UK-8829-110-B",
    vat: "GB 123 4567 89",
    assets: 3,
    history: [
      { id: "h1", title: "Review started by System", time: "Oct 24, 09:15 AM", active: true },
      { id: "h2", title: "Auto-scanned documentation", time: "Oct 24, 09:17 AM", active: false },
    ],
  },
  {
    id: "v2",
    name: "Global Green Initiative",
    icon: FiBarChart2,
    type: "Non-Profit",
    filterKey: "non-profit",
    date: "Oct 23, 2023 · 14:42",
    priority: "normal",
    requestId: "VER-88120-GLB",
    regNumber: "NL-4471-220-C",
    vat: "NL 8855 2210 B04",
    assets: 2,
    history: [
      { id: "h1", title: "Review started by System", time: "Oct 23, 02:44 PM", active: true },
      { id: "h2", title: "Auto-scanned documentation", time: "Oct 23, 02:46 PM", active: false },
    ],
  },
  {
    id: "v3",
    name: "Horizon University",
    icon: FiBook,
    type: "Educational",
    filterKey: "all",
    date: "Oct 23, 2023 · 11:20",
    priority: "normal",
    requestId: "VER-77030-EDU",
    regNumber: "US-DE-3319-H",
    vat: "EXEMPT (501c3)",
    assets: 4,
    history: [
      { id: "h1", title: "Review started by System", time: "Oct 23, 11:22 AM", active: true },
      { id: "h2", title: "Auto-scanned documentation", time: "Oct 23, 11:24 AM", active: false },
    ],
  },
  {
    id: "v4",
    name: "NeuralPath AI Systems",
    icon: FiCpu,
    type: "Enterprise",
    filterKey: "enterprise",
    date: "Oct 22, 2023 · 18:05",
    priority: "high",
    requestId: "VER-66210-NPS",
    regNumber: "US-CA-8842-K",
    vat: "GB 998 2210 77",
    assets: 1,
    history: [
      { id: "h1", title: "Review started by System", time: "Oct 22, 06:07 PM", active: true },
      { id: "h2", title: "Auto-scanned documentation", time: "Oct 22, 06:09 PM", active: false },
    ],
  },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All Requests" },
  { id: "urgent", label: "Urgent" },
  { id: "non-profit", label: "Non-Profit" },
  { id: "enterprise", label: "Enterprise" },
];

const sortOptions: { id: SortId; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "priority", label: "Priority High-Low" },
];

const TOTAL_REQUESTS = 42;
const PAGE_SIZE = 4;

/* ============================= Page ============================= */

const VerificationRequestsPage = () => {
  const [rows, setRows] = useState<VerificationRow[]>(initialRows);
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [sortId, setSortId] = useState<SortId>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("v1");
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const visibleRows = useMemo(() => {
    const filtered =
      activeTab === "all"
        ? rows
        : activeTab === "urgent"
          ? rows.filter((row) => row.priority === "high")
          : rows.filter((row) => row.filterKey === activeTab);
    if (sortId === "oldest") return [...filtered].reverse();
    if (sortId === "priority")
      return [...filtered].sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "high" ? -1 : 1));
    return filtered;
  }, [rows, activeTab, sortId]);

  const selected = rows.find((row) => row.id === selectedId) ?? visibleRows[0];
  const totalPages = Math.ceil(TOTAL_REQUESTS / PAGE_SIZE);
  const activeSort = sortOptions.find((o) => o.id === sortId);

  const handleConfirm = () => {
    if (!confirmState || !selected) return;
    setConfirmLoading(true);
    // Mock async moderation action — replace with real API call
    window.setTimeout(() => {
      setRows((prev) => {
        const next = prev.filter((row) => row.id !== selected.id);
        setSelectedId(next[0]?.id ?? "");
        return next;
      });
      setConfirmLoading(false);
      setConfirmState(null);
    }, 700);
  };

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page flex flex-col items-start gap-6 lg:flex-row">
        {/* ============ Left column ============ */}
        <div className="min-w-0 w-full flex-1">
          {/* Header */}
          <header className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="max-w-[220px] text-2xl font-medium leading-tight tracking-tight text-bgray">
                Verification Requests
              </h1>
              <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-secondary">
                High-priority moderation queue for organizational legal verification.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-[88px] min-h-[120px] border border-bgray/10 bg-[#151c24] p-3">
                <p className="text-[8px] font-normal uppercase leading-5 tracking-wider text-secondary">
                  Avg. Resolution Time
                </p>
                <p className="mt-2 text-lg font-medium leading-snug text-secondary">18.4<br />Hours</p>
              </div>
              <div className="w-[88px] min-h-[120px] border border-bgray/10 bg-[#151c24] p-3">
                <p className="text-[8px] font-normal uppercase leading-5 tracking-wider text-secondary">
                  Current Backlog
                </p>
                <p className="mt-2 text-lg font-medium leading-snug text-bgray">42<br />Units</p>
              </div>
            </div>
          </header>

          {/* Filters + sort */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                aria-pressed={activeTab === tab.id}
                className={`min-h-9 rounded-none px-2.5 py-2 text-[10px] font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#ffb5ac] text-grayblue"
                    : "bg-bgray/10 text-bgray/80 hover:bg-bgray/15 hover:text-bgray"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="ml-2 text-[9px] leading-tight text-secondary/65">Sort by:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="rounded-none bg-[#151c24] px-2.5 py-2 text-[10px] font-medium text-bgray/80 transition hover:bg-bgray/15 hover:text-bgray"
              >
                {activeSort?.label}
              </button>
              {sortOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortId(option.id);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-left text-[10px] transition hover:bg-bgray/10 ${
                        option.id === sortId ? "font-bold text-bgray" : "text-bgray/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Queue table */}
          <section className="mt-3 overflow-hidden bg-[#151c24]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px] table-fixed text-left">
                <thead>
                  <tr className="bg-[#242b35]">
                    <th className="w-[32%] px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary">
                      Organization Name
                    </th>
                    <th className="w-[24%] px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary">
                      Type
                    </th>
                    <th className="w-[24%] px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary">
                      Submission Date
                    </th>
                    <th className="w-[20%] px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => {
                    const RowIcon = row.icon;
                    const isSelected = row.id === selectedId;
                    return (
                      <tr
                        key={row.id}
                        tabIndex={0}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(row.id); setInspectorOpen(true); } }}
                        onClick={() => {
                          setSelectedId(row.id);
                          setInspectorOpen(true);
                        }}
                        className={`cursor-pointer border-t border-bgray/[0.02] transition ${
                          isSelected ? "bg-bgray/[0.025]" : "hover:bg-bgray/5"
                        }`}
                      >
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-none bg-bgray/10 text-secondary">
                              <RowIcon size={10} />
                            </span>
                            <span className="max-w-[84px] text-[11px] font-normal leading-snug text-bgray">
                              {row.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-5">
                          <span className="inline-block rounded-none bg-bgray/10 px-1.5 py-0.5 text-[8px] font-normal uppercase tracking-wide text-bgray/80">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-5">
                          <span className="block max-w-[64px] text-xs leading-snug text-secondary">
                            {row.date}
                          </span>
                        </td>
                        <td className="px-3 py-5">
                          {row.priority === "high" ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                              High
                            </span>
                          ) : (
                            <span className="text-xs text-bgray/90">Normal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-grayblue py-4">
              <p className="text-[10px] text-secondary/80">
                Showing <span className="font-bold text-bgray">1-{visibleRows.length}</span> of{" "}
                <span className="font-bold text-bgray">{TOTAL_REQUESTS}</span> verification
                requests
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border_color text-bgray/80 transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border_color text-bgray/80 transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ============ Inspector ============ */}
        {inspectorOpen && selected && (
          <aside className="flex w-full shrink-0 flex-col border border-bgray/[0.03] bg-[#192129] p-5 lg:w-[43%]">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-medium text-bgray">
                Verification Inspector
              </h2>
              <button
                type="button"
                aria-label="Close inspector"
                onClick={() => setInspectorOpen(false)}
                className="rounded p-1 text-secondary/65 transition hover:bg-bgray/10 hover:text-bgray"
              >
                <FiX size={14} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-bgray/10 text-secondary">
                <FiBriefcase size={12} />
              </span>
              <div>
                <p className="text-xs font-normal leading-relaxed text-bgray">{selected.name}</p>
                <p className="mt-0.5 text-[9px] text-secondary">Request ID: {selected.requestId}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-[#080f15] px-3 py-2.5">
                <p className="text-[8px] font-normal uppercase leading-5 tracking-wider text-secondary">
                  Company Registration Number
                </p>
                <p className="mt-1 text-[11px] text-bgray">{selected.regNumber}</p>
              </div>
              <div className="bg-[#080f15] px-3 py-2.5">
                <p className="text-[8px] font-normal uppercase leading-5 tracking-wider text-secondary">
                  Tax Identification (VAT)
                </p>
                <p className="mt-1 text-[11px] text-bgray">{selected.vat}</p>
              </div>
            </div>

            <p className="-mx-5 mt-5 border-t border-bgray/5 px-5 pt-4 text-[8px] font-normal uppercase leading-5 tracking-wider text-secondary">
              Legal Assets ({selected.assets})
            </p>
            {/* Document photos are raster assets in Figma — placeholders; swap for <img> on API integration */}
            <div className="mt-2 space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-[1.8] flex-col items-center justify-center gap-3 bg-[#080f15]"
                >
                  <FiFileText size={28} className="text-secondary/40" />
                  <span className="text-[10px] text-secondary/50">Document preview unavailable</span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[8px] font-normal uppercase leading-5 tracking-wider text-secondary">
              Verification History
            </p>
            <ul className="mt-3 space-y-5">
              {selected.history.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2.5">
                  <span
                    className={`mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 ${
                      entry.active ? "border-secondary" : "border-bgray/40"
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-normal leading-relaxed text-bgray">{entry.title}</p>
                    <p className="mt-0.5 text-[9px] text-secondary/65">{entry.time}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="-mx-5 -mb-5 mt-4 flex gap-4 border-t border-bgray/5 bg-[#202831] p-5">
              <button
                type="button"
                onClick={() => setConfirmState({ action: "reject" })}
                className="flex flex-1 items-center justify-center gap-2 rounded-none bg-[#ac000b] py-3 text-xs font-medium text-white transition hover:bg-primary/90"
              >
                <HiOutlineNoSymbol size={13} />
                Reject
              </button>
              <button
                type="button"
                onClick={() => setConfirmState({ action: "approve" })}
                className="flex flex-1 items-center justify-center gap-2 rounded-none bg-[#0da34b] py-3 text-xs font-medium text-white transition hover:bg-green/90"
              >
                <FiCheckCircle size={13} />
                Approve
              </button>
            </div>
          </aside>
        )}
      </div>

      <ConfirmModal
        open={confirmState !== null}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirm}
        message={
          confirmState?.action === "reject"
            ? `Reject ${selected?.name ?? "this request"}? This demo removes the request locally; no notification is sent.`
            : `Approve ${selected?.name ?? "this request"} for platform verification? This is a local demo change.`
        }
        variant={confirmState?.action === "reject" ? "danger" : "info"}
        loading={confirmLoading}
      />
    </div>
  );
};

export default VerificationRequestsPage;