import { useState } from "react";
import {
  FiAlertOctagon,
  FiCheckCircle,
  FiChevronRight,
  FiEye,
  FiFileText,
  FiLock,
  FiPlusSquare,
  FiRotateCcw,
  FiSettings,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { HiOutlineNoSymbol, HiOutlineSparkles } from "react-icons/hi2";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface KeywordRow {
  id: string;
  text: string;
  tone: "primary" | "amber";
}

interface SliderProps {
  label: string;
  value: number;
  display: string;
  valueTone: "primary" | "light";
  onChange: (value: number) => void;
}

interface ToggleProps {
  on: boolean;
  label: string;
  onChange: () => void;
}

interface AuditRow {
  id: string;
  dotClass: string;
  text: string;
  author: string;
  time: string;
}

/* ================== Mock data (swap with real API later) ================== */

const DEFAULTS = { nsfw: 88, violence: 94, recency: 42, proximity: 85, affinity: 61 };

const initialKeywords: KeywordRow[] = [
  { id: "k1", text: "scam_crypto", tone: "primary" },
  { id: "k2", text: "bot_invite", tone: "primary" },
  { id: "k3", text: "off_platform_link", tone: "amber" },
  { id: "k4", text: "phishing_alert", tone: "primary" },
];

const auditRows: AuditRow[] = [
  {
    id: "a1",
    dotClass: "bg-primary",
    text: "Threshold: NSFW Confidence updated from 85% to 88%",
    author: "Admin: Sarah J.",
    time: "2 mins ago",
  },
  {
    id: "a2",
    dotClass: "bg-bgray/40",
    text: "New keyword 'phishing_alert' added to blocklist",
    author: "System Automator",
    time: "14 mins ago",
  },
];

const inputScenario = `{
  "user_id": "8122-PX",
  "history": ["gaming", "esports"],
  "content_pool": [
    {"id": "EV-99", "tags": ["live", "tournament"]}
  ]
}`;

/* ============================= Atoms ============================= */

const Slider = ({ label, value, display, valueTone, onChange }: SliderProps) => (
  <div>
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-bgray/90">{label}</span>
      <span className={`text-xs font-bold ${valueTone === "primary" ? "text-primary" : "text-bgray"}`}>
        {display}
      </span>
    </div>
    <div className="relative mt-2 h-1 rounded-full bg-bgray/20">
      <div className="absolute h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
      />
    </div>
  </div>
);

const Toggle = ({ on, label, onChange }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={`relative h-3.5 w-6 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-bgray/25"}`}
  >
    <span className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-bgray transition-all ${on ? "left-3" : "left-0.5"}`} />
  </button>
);

/* ============================= Page ============================= */

const AIRulesPage = () => {
  const [nsfw, setNsfw] = useState(DEFAULTS.nsfw);
  const [violence, setViolence] = useState(DEFAULTS.violence);
  const [recency, setRecency] = useState(DEFAULTS.recency);
  const [proximity, setProximity] = useState(DEFAULTS.proximity);
  const [affinity, setAffinity] = useState(DEFAULTS.affinity);
  const [ocr, setOcr] = useState(true);
  const [face, setFace] = useState(false);
  const [lockdown, setLockdown] = useState(false);
  const [apiSync, setApiSync] = useState(true);
  const [keywords, setKeywords] = useState<KeywordRow[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);

  const addKeyword = () => {
    const text = newKeyword.trim();
    if (!text) return;
    setKeywords((prev) => [...prev, { id: crypto.randomUUID(), text, tone: "primary" }]);
    setNewKeyword("");
  };

  const resetDefaults = () => {
    setNsfw(DEFAULTS.nsfw);
    setViolence(DEFAULTS.violence);
    setRecency(DEFAULTS.recency);
    setProximity(DEFAULTS.proximity);
    setAffinity(DEFAULTS.affinity);
    setOcr(true);
    setFace(false);
    setLockdown(false);
    setApiSync(true);
    setKeywords(initialKeywords);
    toast.info("Configuration reset to defaults.");
  };

  const runSimulation = () => toast.success("Simulation complete — Priority Index 0.887.");

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-medium leading-tight tracking-tight text-bgray">
              AI Moderation &amp; Recommendation Rules
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-secondary/80">
              Configure automated safety thresholds and engine logic for content distribution.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetDefaults}
              className="w-24 rounded-md border border-bgray/20 px-3 py-2 text-center text-xs font-semibold leading-snug text-bgray transition hover:bg-bgray/5"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="w-24 rounded-md bg-primary px-3 py-2 text-center text-xs font-semibold leading-snug text-bgray transition hover:bg-primary/90"
            >
              Apply Changes
            </button>
          </div>
        </header>

        {/* Row 1 */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
          {/* Visual content scanning */}
          <section className="rounded-md bg-[#151c24] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
                  <FiEye size={15} className="text-primary" />
                </span>
                Visual Content Scanning
              </h2>
              <span className="rounded-md bg-bgray/10 px-3 py-1 text-[8px] font-bold uppercase tracking-wide text-bgray/80">
                Model: V4-Oculus
              </span>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <Slider label="NSFW Confidence Threshold" value={nsfw} display={`${nsfw}%`} valueTone="primary" onChange={setNsfw} />
                <p className="mt-2 text-[9px] italic text-secondary/70">
                  Rule: Flag content for manual review if AI confidence exceeds {nsfw}%.
                </p>
              </div>
              <div>
                <Slider label="Violence & Harm Detection" value={violence} display={`${violence}%`} valueTone="primary" onChange={setViolence} />
                <p className="mt-2 text-[9px] italic text-secondary/70">
                  Rule: Immediate shadow-ban if severity detected above {violence}% threshold.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 rounded-sm bg-[#1d242d] p-4">
                <div>
                  <p className="text-xs font-bold text-bgray">OCR Keyword Extraction</p>
                  <p className="mt-1 text-[9px] text-secondary/70">Analyze text within images</p>
                </div>
                <Toggle on={ocr} label="OCR keyword extraction" onChange={() => setOcr((v) => !v)} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-sm bg-[#1d242d] p-4">
                <div>
                  <p className="text-xs font-bold text-bgray">Face Recognition</p>
                  <p className="mt-1 text-[9px] text-secondary/70">Check against prohibited person lists</p>
                </div>
                <Toggle on={face} label="Face recognition" onChange={() => setFace((v) => !v)} />
              </div>
            </div>
          </section>

          {/* Keyword filter lists */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
                <HiOutlineNoSymbol size={15} className="text-primary" />
              </span>
              Keyword Filter Lists
            </h2>

            <div className="mt-5 flex items-center gap-2 rounded-sm border border-bgray/10 bg-[#080f15] px-3 py-2.5">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                placeholder="Add new keyword..."
                className="w-full bg-transparent text-xs text-bgray placeholder:text-secondary/50 focus:outline-none"
              />
              <button type="button" aria-label="Add keyword" onClick={addKeyword} className="shrink-0 text-primary transition hover:text-primary/80">
                <FiPlusSquare size={15} />
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {keywords.map((keyword) => (
                <li
                  key={keyword.id}
                  className={`flex items-center justify-between gap-2 rounded-r-sm bg-[#1d242d] py-2.5 pl-3 pr-2 ${
                    keyword.tone === "amber" ? "border-l-2 border-amber" : "border-l-2 border-primary"
                  }`}
                >
                  <span className="text-xs text-bgray/90">{keyword.text}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${keyword.text}`}
                    onClick={() => setKeywords((prev) => prev.filter((k) => k.id !== keyword.id))}
                    className="rounded p-1 text-bgray/60 transition hover:text-bgray"
                  >
                    <FiX size={12} />
                  </button>
                </li>
              ))}
            </ul>

            <button type="button" className="mt-5 flex items-center gap-2 text-xs text-bgray/80 transition hover:text-bgray">
              <FiFileText size={13} />
              Import Global Blocklist (.json)
            </button>
          </section>
        </div>

        {/* Row 2 — feed logic */}
        <section className="mt-4 rounded-md bg-[#151c24] p-6">
          <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
              <HiOutlineSparkles size={15} className="text-primary" />
            </span>
            Personalized Feed Logic (ML Engine)
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-secondary">
                <FiLock size={12} className="text-primary" />
                Ranking Weights
              </p>
              <div className="mt-5 space-y-5">
                <Slider label="Recency Bias" value={recency} display={(recency / 100).toFixed(2)} valueTone="light" onChange={setRecency} />
                <Slider label="Social Proximity" value={proximity} display={(proximity / 100).toFixed(2)} valueTone="light" onChange={setProximity} />
                <Slider label="Interest Affinity" value={affinity} display={(affinity / 100).toFixed(2)} valueTone="light" onChange={setAffinity} />
              </div>
            </div>

            {/* Sandbox */}
            <div className="overflow-hidden rounded-md bg-[#1d242d]">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-bgray/10 px-4 py-2.5">
                <span className="flex items-center gap-2 text-xs text-bgray">
                  <span className="h-1.5 w-1.5 rounded-full bg-info" aria-hidden="true" />
                  Test Rule Sandbox
                </span>
                <button
                  type="button"
                  onClick={runSimulation}
                  className="rounded-sm bg-primary px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-bgray transition hover:bg-primary/90"
                >
                  Run Simulation
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-bgray/80">
                    Input Scenario (Mock Data)
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded-sm bg-[#080f15] p-3 font-mono text-[9px] leading-relaxed text-secondary/80">
                    {inputScenario}
                  </pre>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-bgray/80">
                    Predicted Feed Placement
                  </p>
                  <div className="mt-2 rounded-sm bg-[#080f15] p-3">
                    <p className="flex items-center gap-2 text-[10px] font-bold text-green">
                      <FiCheckCircle size={12} />
                      Engine Processed Successfully
                    </p>
                    <p className="mt-2 text-[10px] text-bgray/90">Result: Priority Index 0.887</p>
                    <p className="mt-1 text-[10px] text-bgray/90">Recommended: Position #1 (Hero)</p>
                    <p className="mt-3 text-[9px] text-secondary/70">Latency: 14ms | GPU Load: 62%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Row 3 */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Real-time interference */}
          <section className="flex flex-col rounded-md bg-[#151c24] p-6">
            <h2 className="text-base font-medium text-bgray">Real-time Interference</h2>
            <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-secondary/70">
              Live visualization of moderation engine load across global regions. Spike detection
              enabled.
            </p>
            {/* Chart canvas renders empty in the Figma export — reserved space kept verbatim */}
            <div className="min-h-[120px] flex-1" aria-hidden="true" />
            <div className="mt-4 flex items-stretch gap-4">
              <div>
                <p className="text-2xl font-bold text-bgray">1,204</p>
                <p className="mt-1 text-[8px] uppercase tracking-widest text-secondary/70">Actions / Min</p>
              </div>
              <div className="border-l border-bgray/10 pl-4">
                <p className="text-2xl font-bold text-green">99.92%</p>
                <p className="mt-1 text-[8px] uppercase tracking-widest text-secondary/70">Accuracy</p>
              </div>
            </div>
          </section>

          {/* 2x2 control cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-md bg-[#151c24] p-4">
              <div className="flex items-start justify-between gap-2">
                <FiAlertOctagon size={16} className="text-primary" />
                <Toggle on={lockdown} label="Crisis lockdown mode" onChange={() => setLockdown((v) => !v)} />
              </div>
              <p className="mt-3 text-xs font-bold leading-snug text-bgray">Crisis Lockdown Mode</p>
              <p className="mt-1 text-[9px] leading-snug text-secondary/70">
                Halt all new content uploads platform-wide immediately.
              </p>
            </section>

            <section className="rounded-md bg-[#151c24] p-4">
              <div className="flex items-start justify-between gap-2">
                <FiRotateCcw size={16} className="text-info" />
                <FiChevronRight size={14} className="text-bgray/70" />
              </div>
              <p className="mt-3 text-xs font-bold leading-snug text-bgray">Rule Version History</p>
              <p className="mt-1 text-[9px] leading-snug text-secondary/70">
                View and rollback to previous engine configurations.
              </p>
            </section>

            <section className="rounded-md bg-[#151c24] p-4">
              <div className="flex items-start justify-between gap-2">
                <FiShare2 size={16} className="text-indigo-400" />
                <Toggle on={apiSync} label="External API sync" onChange={() => setApiSync((v) => !v)} />
              </div>
              <p className="mt-3 text-xs font-bold leading-snug text-bgray">External API Sync</p>
              <p className="mt-1 text-[9px] leading-snug text-secondary/70">
                Synchronize filters with global security databases.
              </p>
            </section>

            <section className="rounded-md bg-primary/10 p-4">
              <div className="flex items-start justify-between gap-2">
                <FiSettings size={16} className="text-primary" />
                <FiChevronRight size={14} className="text-bgray/70" />
              </div>
              <p className="mt-3 text-xs font-bold leading-snug text-bgray">Debug Logs</p>
              <p className="mt-1 text-[9px] leading-snug text-secondary/70">
                View raw AI classification decision logs.
              </p>
            </section>
          </div>
        </div>

        {/* Audit trail */}
        <section className="mt-8 border-t border-bgray/10 pt-6 pb-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-secondary">
            Configuration Audit Trail
          </h2>
          <ul className="mt-5 space-y-4">
            {auditRows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.dotClass}`} aria-hidden="true" />
                <p className="flex-1 text-xs text-bgray/90">{row.text}</p>
                <span className="text-[10px] text-secondary/70">{row.author}</span>
                <span className="text-[10px] text-secondary/70">{row.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ConfirmModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onConfirm={() => {
          setApplyOpen(false);
          toast.success("AI moderation rules applied across all regions.");
        }}
        title="Apply configuration"
        message="Push threshold and engine-logic changes to the live moderation cluster? Changes propagate within 120 seconds."
        confirmLabel="Apply"
      />
    </div>
  );
};

export default AIRulesPage;