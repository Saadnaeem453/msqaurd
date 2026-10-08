import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiBarChart2,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiEdit,
  FiSliders,
} from "react-icons/fi";
import { MdQrCode } from "react-icons/md";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface FeatureRow {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface RegionRow {
  id: string;
  flagClass: string;
  name: string;
  fee: string;
}

interface PolicyRow {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface TicketSettings {
  baseFee: string;
  txFee: string;
  features: FeatureRow[];
  interval: string;
  policies: PolicyRow[];
}

/* ================== Mock data (swap with real API later) ================== */

const defaultSettings = (): TicketSettings => ({
  baseFee: "3.5",
  txFee: "0.99",
  features: [
    { id: "waitlist", title: "Waitlist Management", description: "Automatic queuing for sold-out events", enabled: true },
    { id: "resale", title: "Secondary Resale", description: "Peer-to-peer secure transfers", enabled: true },
    { id: "dynamic", title: "Dynamic Pricing", description: "AI-driven demand adjustments", enabled: false },
  ],
  interval: "30s",
  policies: [
    { id: "anti-bot", label: "Enable Anti-Bot ID Verification", checked: true, disabled: false },
    { id: "lock", label: "Lock transfers until 24hrs before event", checked: false, disabled: true },
    { id: "capacity", label: "Enforce capacity limits across all distributors", checked: true, disabled: false },
  ],
});

const regionRows: RegionRow[] = [
  { id: "eu", flagClass: "bg-blue-600", name: "European Union (VAT Adjusted)", fee: "4.2% + €0.85" },
  { id: "na", flagClass: "bg-primary", name: "North America (Standard)", fee: "3.5% + $0.99" },
];

const intervalOptions: DropdownOption[] = [
  { value: "5s", label: "5 Seconds (Standard)" },
  { value: "15s", label: "15 Seconds (Secure)" },
  { value: "30s", label: "30 Seconds (Ultra-Secure)" },
  { value: "60s", label: "60 Seconds (Relaxed)" },
];

const FEE_PATTERN = /^\d+(\.\d+)?$/;

const loadSettings = (): TicketSettings => {
  const base = defaultSettings();
  try {
    const stored = JSON.parse(localStorage.getItem("admin-ticket-infra") || "null");
    if (!stored || typeof stored !== "object") return base;
    return {
      baseFee: typeof stored.baseFee === "string" && FEE_PATTERN.test(stored.baseFee) ? stored.baseFee : base.baseFee,
      txFee: typeof stored.txFee === "string" && FEE_PATTERN.test(stored.txFee) ? stored.txFee : base.txFee,
      interval: intervalOptions.some((o: DropdownOption) => o.value === stored.interval) ? stored.interval : base.interval,
      features: base.features.map((feature) => {
        const saved = Array.isArray(stored.features) ? stored.features.find((entry: { id?: string }) => entry?.id === feature.id) : undefined;
        return typeof saved?.enabled === "boolean" ? { ...feature, enabled: saved.enabled } : feature;
      }),
      policies: base.policies.map((policy) => {
        const saved = Array.isArray(stored.policies) ? stored.policies.find((entry: { id?: string }) => entry?.id === policy.id) : undefined;
        return !policy.disabled && typeof saved?.checked === "boolean" ? { ...policy, checked: saved.checked } : policy;
      }),
    };
  } catch {
    return base;
  }
};

/* ============================= Page ============================= */

const TicketSettingsPage = () => {
  const [restored] = useState(loadSettings);
  const [settings, setSettings] = useState<TicketSettings>(restored);
  const [saved, setSaved] = useState<TicketSettings>(restored);
  const [intervalOpen, setIntervalOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  const patch = (next: Partial<TicketSettings>) => setSettings((prev) => ({ ...prev, ...next }));

  const toggleFeature = (id: string) =>
    setSettings((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)),
    }));

  const togglePolicy = (id: string) =>
    setSettings((prev) => ({
      ...prev,
      policies: prev.policies.map((p) => (p.id === id && !p.disabled ? { ...p, checked: !p.checked } : p)),
    }));

  const handleSave = () => {
    if (!FEE_PATTERN.test(settings.baseFee.trim()) || !FEE_PATTERN.test(settings.txFee.trim())) {
      toast.error("Fees must be numeric values (e.g. 3.5 or 0.99).");
      setSaveOpen(false);
      return;
    }
    try {
      localStorage.setItem("admin-ticket-infra", JSON.stringify(settings));
      setSaved(settings);
      setSaveOpen(false);
      toast.success("Global settings saved locally. Node propagation simulated.");
    } catch {
      toast.error("Unable to save settings in browser storage.");
    }
  };

  const handleDiscard = () => {
    setSettings(saved);
    setIntervalOpen(false);
    toast.info("Changes discarded.");
  };

  const selectedInterval = intervalOptions.find((o) => o.value === settings.interval);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">Ticket Infrastructure</h1>
            <p className="mt-1 text-xs leading-relaxed text-secondary/80">
              Configure global ticketing rules, fee logic, and security protocols across all regions.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-bgray/10 px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
          >
            <FiClock size={13} />
            Audit Log
          </button>
        </header>

        {/* Row 1 */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Default fee structure */}
          <section className="rounded-md bg-[#151c24] p-5 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
                  <FiBarChart2 size={15} className="text-primary" />
                </span>
                Default Fee Structure
              </h2>
              <span className="rounded-sm bg-green/15 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-green">
                Active Override
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                  Platform Base Service Fee
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.baseFee}
                    onChange={(e) => patch({ baseFee: e.target.value })}
                    aria-label="Platform base service fee"
                    className="w-16 rounded-sm bg-bgray/10 px-3 py-2.5 text-center text-sm font-bold text-bgray focus:outline-none"
                  />
                  <span className="text-sm text-bgray/60">%</span>
                </p>
                <p className="mt-2 max-w-[170px] text-[9px] leading-relaxed text-secondary/70">
                  Applies to all primary ticket sales globally.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                  Fixed Transaction Fee
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-bgray/60">$</span>
                  <input
                    type="text"
                    value={settings.txFee}
                    onChange={(e) => patch({ txFee: e.target.value })}
                    aria-label="Fixed transaction fee"
                    className="w-16 rounded-sm bg-bgray/10 px-3 py-2.5 text-center text-sm font-bold text-bgray focus:outline-none"
                  />
                </p>
                <p className="mt-2 max-w-[170px] text-[9px] leading-relaxed text-secondary/70">
                  Per-ticket processing cost charged at checkout.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-bgray/10 pt-5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                Regional Variations
              </p>
              <ul className="mt-3 space-y-3">
                {regionRows.map((region) => (
                  <li key={region.id} className="flex items-center gap-3">
                    <span className={`h-3.5 w-5 shrink-0 rounded-sm ${region.flagClass}`} aria-hidden="true" />
                    <span className="flex-1 text-xs text-bgray/90">{region.name}</span>
                    <span className="text-xs text-bgray/90">{region.fee}</span>
                    <button
                      type="button"
                      aria-label={`Edit ${region.name}`}
                      className="rounded p-1 text-secondary transition hover:text-bgray"
                    >
                      <FiEdit size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Right column */}
          <div className="space-y-4">
            <section className="rounded-md bg-[#151c24] p-5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                Platform Features
              </p>
              <ul className="mt-4 space-y-4">
                {settings.features.map((feature) => (
                  <li key={feature.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-bgray">{feature.title}</p>
                      <p className="mt-0.5 max-w-[150px] text-[9px] leading-snug text-secondary/70">
                        {feature.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={feature.enabled}
                      aria-label={feature.title}
                      onClick={() => toggleFeature(feature.id)}
                      className={`relative h-3.5 w-6 shrink-0 rounded-full transition ${
                        feature.enabled ? "bg-primary" : "bg-bgray/25"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-bgray transition-all ${
                          feature.enabled ? "left-3" : "left-0.5"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-md bg-primary p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-bgray">
                <FiAlertTriangle size={14} />
                Safe-Mode Active
              </p>
              <p className="mt-3 text-[9px] leading-relaxed text-bgray/90">
                Global capacity changes require 2FA authorization from the Security Lead. All
                changes are immutable once deployed to production.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-sm bg-grayblue/25 py-2.5 text-[9px] font-bold uppercase tracking-wider text-bgray transition hover:bg-grayblue/35"
              >
                Review Security Policy
              </button>
            </section>
          </div>
        </div>

        {/* Row 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* QR security logic */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-bgray/10">
                <MdQrCode size={15} className="text-bgray/70" />
              </span>
              QR Security Logic
            </h2>

            <p className="mt-5 text-[10px] font-medium uppercase tracking-widest text-secondary">
              QR Refresh Interval (Dynamic)
            </p>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setIntervalOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-sm bg-bgray/10 px-3 py-2.5 text-xs text-bgray transition hover:bg-bgray/15"
              >
                {selectedInterval?.label}
                <FiChevronDown size={12} className="text-bgray/60" />
              </button>
              {intervalOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                  {intervalOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        patch({ interval: option.value });
                        setIntervalOpen(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                        option.value === settings.interval ? "font-medium text-bgray" : "text-bgray/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3">
              <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded-sm border-2 border-bgray bg-[#080f15]">
                <MdQrCode size={16} className="text-bgray/60" />
              </span>
              <div>
                <p className="text-xs font-bold text-bgray">Encryption Signature</p>
                <p className="mt-1 max-w-[240px] text-[9px] leading-relaxed text-secondary/70">
                  SHA-256 rotating hashes synchronized with NTP server time. Prevents duplicate
                  scanning and screenshots.
                </p>
                <button
                  type="button"
                  className="mt-1.5 text-[9px] font-bold text-primary transition hover:underline"
                >
                  Regenerate Key Stack
                </button>
              </div>
            </div>
          </section>

          {/* Limits & resale policies */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-bgray/10">
                <FiSliders size={15} className="text-bgray/70" />
              </span>
              Limits &amp; Resale Policies
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                  Max Tickets / User
                </p>
                <p className="mt-2 text-xl font-bold text-bgray">6</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                  Resale Price Cap
                </p>
                <p className="mt-2 flex items-baseline justify-between gap-2 text-xl font-bold text-bgray">
                  110
                  <span className="text-sm font-normal text-bgray/60">%</span>
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {settings.policies.map((policy) => (
                <li key={policy.id}>
                  <label className={`flex items-center gap-2.5 ${policy.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={policy.checked}
                      disabled={policy.disabled}
                      onClick={() => togglePolicy(policy.id)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition ${
                        policy.checked ? "bg-primary" : "bg-bgray/20"
                      }`}
                    >
                      {policy.checked && <FiCheck size={10} className="text-bgray" />}
                    </button>
                    <span className="text-xs text-bgray">{policy.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer bar */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-bgray/10 pt-5 pb-6">
          <p className="flex items-center gap-2 text-xs text-secondary/70">
            <FiAlertCircle size={14} className="shrink-0 text-amber" />
            Changes will propagate across all nodes in approximately 120 seconds.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="rounded-sm bg-bgray/15 px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-bgray transition hover:bg-bgray/20"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => setSaveOpen(true)}
              className="rounded-sm bg-primary px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-bgray transition hover:bg-primary/90"
            >
              Save Global Settings
            </button>
          </div>
        </footer>
      </div>

      <ConfirmModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onConfirm={handleSave}
        title="Save global settings"
        message="Save ticket infrastructure settings in this browser? Node propagation is simulated locally."
        variant="info"
        confirmLabel="Save Settings"
      />
    </div>
  );
};

export default TicketSettingsPage;