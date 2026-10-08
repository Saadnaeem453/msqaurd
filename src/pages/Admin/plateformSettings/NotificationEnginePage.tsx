import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiClock,
  FiMail,
  FiMessageSquare,
  FiMoreVertical,
  FiSliders,
} from "react-icons/fi";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface ProviderRow {
  id: string;
  icon: IconType;
  iconClasses: string;
  name: string;
  role: string;
  uptime: string;
  uptimeTone: "green" | "amber";
  latency: string;
}

type Priority = "critical" | "standard" | "high" | "info";
type TriggerCategory = "security" | "transactional" | "event";
type TabId = "all" | "security" | "transactional";

interface TriggerRow {
  id: string;
  title: string;
  code: string;
  dotClass: string;
  channels: IconType[];
  priority: Priority;
  category: TriggerCategory;
  enabled: boolean;
}

interface ConstraintRow {
  id: string;
  label: string;
  value: string;
}

interface DeliveryRow {
  id: string;
  time: string;
  ref: string;
  status: "delivered" | "bounced";
}

/* ================== Mock data (swap with real API later) ================== */

const providerRows: ProviderRow[] = [
  {
    id: "ses",
    icon: FiMail,
    iconClasses: "bg-info/15 text-info",
    name: "AWS SES",
    role: "Primary Email",
    uptime: "99.98%",
    uptimeTone: "green",
    latency: "Lat: 42ms",
  },
  {
    id: "twilio",
    icon: FiMessageSquare,
    iconClasses: "bg-primary/15 text-primary",
    name: "Twilio",
    role: "Global SMS",
    uptime: "100%",
    uptimeTone: "green",
    latency: "Lat: 112ms",
  },
  {
    id: "firebase",
    icon: FiBell,
    iconClasses: "bg-bgray/10 text-bgray/80",
    name: "Firebase Cloud",
    role: "Mobile Push",
    uptime: "94.2%",
    uptimeTone: "amber",
    latency: "Degraded",
  },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "security", label: "Security" },
  { id: "transactional", label: "Transactional" },
];

const initialTriggers: TriggerRow[] = [
  {
    id: "t1",
    title: "Security: MFA Bypass Attempt",
    code: "trigger_sec_0991",
    dotClass: "bg-primary",
    channels: [FiMail, FiMessageSquare, FiBell],
    priority: "critical",
    category: "security",
    enabled: true,
  },
  {
    id: "t2",
    title: "Event: Approval Granted",
    code: "trigger_ev_appr",
    dotClass: "bg-bgray/40",
    channels: [FiMail, FiBell],
    priority: "standard",
    category: "event",
    enabled: true,
  },
  {
    id: "t3",
    title: "Finance: Payment Failure",
    code: "trigger_fin_fail",
    dotClass: "bg-bgray/40",
    channels: [FiMail, FiMessageSquare],
    priority: "high",
    category: "transactional",
    enabled: false,
  },
  {
    id: "t4",
    title: "Platform: New Login Device",
    code: "trigger_sec_auth",
    dotClass: "bg-bgray/40",
    channels: [FiMail],
    priority: "info",
    category: "security",
    enabled: true,
  },
];

const PRIORITY_BADGES: Record<Priority, { label: string; classes: string }> = {
  critical: { label: "Critical", classes: "bg-primary/15 text-primary" },
  standard: { label: "Standard", classes: "bg-green/15 text-green" },
  high: { label: "High", classes: "bg-amber/15 text-amber" },
  info: { label: "Info", classes: "bg-bgray/10 text-bgray/80" },
};

const constraintRows: ConstraintRow[] = [
  { id: "c1", label: "Rate limit per user", value: "5 / hour" },
  { id: "c2", label: "Quiet Hours (GMT)", value: "22:00-06:00" },
  { id: "c3", label: "Batch threshold", value: "10 events" },
];

const deliveryRows: DeliveryRow[] = [
  { id: "d1", time: "14:22:01", ref: "SEC_0991", status: "delivered" },
  { id: "d2", time: "14:18:55", ref: "FIN_FAIL", status: "bounced" },
  { id: "d3", time: "14:15:30", ref: "EV_APPR", status: "delivered" },
  { id: "d4", time: "14:12:12", ref: "SEC_0991", status: "delivered" },
];

/* ============================= Page ============================= */

const NotificationEnginePage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [triggers, setTriggers] = useState<TriggerRow[]>(initialTriggers);
  const [deployOpen, setDeployOpen] = useState(false);

  const toggleTrigger = (id: string) =>
    setTriggers((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));

  const visibleTriggers =
    activeTab === "all" ? triggers : triggers.filter((t) => t.category === activeTab);

  const handleDeploy = () => {
    setDeployOpen(false);
    toast.success("Configuration deployed to AWS SNS and Twilio.");
  };

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">Notification Engine</h1>
            <p className="mt-2 text-xs leading-relaxed text-secondary/80">
              Configure global logic, delivery triggers, and provider routing for all system
              communications. Managed via AWS SNS and Twilio integrations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="w-24 rounded-md border border-bgray/20 px-3 py-2 text-center text-xs font-semibold leading-snug text-bgray transition hover:bg-bgray/5"
            >
              Test Payload
            </button>
            <button
              type="button"
              onClick={() => setDeployOpen(true)}
              className="w-24 rounded-md bg-primary px-3 py-2 text-center text-xs font-semibold leading-snug text-bgray transition hover:bg-primary/90"
            >
              Deploy Changes
            </button>
          </div>
        </header>

        {/* Row 1 */}
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[190px_minmax(0,1fr)]">
          {/* Left column */}
          <div className="space-y-4">
            {/* Provider health */}
            <section className="rounded-md bg-[#151c24] p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-medium text-bgray">Provider Health</h2>
                <FiActivity size={16} className="text-bgray/70" />
              </div>
              <ul className="mt-4 space-y-3">
                {providerRows.map((provider) => {
                  const ProviderIcon = provider.icon;
                  return (
                    <li key={provider.id} className="flex items-center gap-2.5 rounded-sm bg-[#1d242d] p-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${provider.iconClasses}`}>
                        <ProviderIcon size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-bgray">{provider.name}</p>
                        <p className="mt-0.5 text-[11px] text-secondary/70">{provider.role}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[11px] font-bold ${provider.uptimeTone === "green" ? "text-green" : "text-amber"}`}>
                          {provider.uptime}
                        </p>
                        <p className={`mt-0.5 text-[8px] ${provider.uptimeTone === "green" ? "text-secondary/70" : "text-amber"}`}>
                          {provider.latency}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Global opt-out */}
            <section className="rounded-md bg-[#151c24] p-5">
              <p className="text-[12px] font-medium uppercase tracking-widest text-secondary">
                Global Opt-Out
              </p>
              <p className="mt-2 text-3xl font-bold text-secondary">1.2%</p>
              <p className="mt-2 text-[12px] text-bgray/80">
                System-wide suppressions (Last 24h)
              </p>
              <div className="mt-3 h-1 w-full rounded-full bg-bgray/15">
                <div className="h-full rounded-full bg-secondary" style={{ width: "12%" }} />
              </div>
            </section>
          </div>

          {/* Notification triggers */}
          <section className="rounded-md bg-[#151c24] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-medium text-bgray">Notification Triggers</h2>
              <div className="flex rounded-md bg-[#080f15] p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-sm px-4 py-1.5 text-[12px] font-bold transition ${
                      activeTab === tab.id
                        ? "bg-secondary text-grayblue"
                        : "text-bgray/80 hover:text-bgray"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr>
                    <th className="px-3 py-2 pl-0 text-left text-[11px] font-semibold uppercase tracking-widest text-secondary/70">
                      Trigger Event
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-widest text-secondary/70">
                      Channels
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-widest text-secondary/70">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-widest text-secondary/70">
                      Status
                    </th>
                    <th className="px-3 py-2 pr-0" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {visibleTriggers.map((trigger) => (
                    <tr key={trigger.id} className="border-t border-bgray/5">
                      <td className="px-3 py-4 pl-0">
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${trigger.dotClass}`} aria-hidden="true" />
                          <div>
                            <p className="text-xs font-bold text-bgray">{trigger.title}</p>
                            <p className="mt-1 font-mono text-[11px] text-secondary/70">ID: {trigger.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="flex items-center gap-2">
                          {trigger.channels.map((ChannelIcon, index) => (
                            <ChannelIcon key={index} size={12} className="text-secondary/70" />
                          ))}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`rounded-sm px-2 py-1 text-[8px] font-bold uppercase tracking-wide ${PRIORITY_BADGES[trigger.priority].classes}`}>
                          {PRIORITY_BADGES[trigger.priority].label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={trigger.enabled}
                          aria-label={`Toggle ${trigger.title}`}
                          onClick={() => toggleTrigger(trigger.id)}
                          className={`relative h-3 w-6 shrink-0 rounded-full transition ${
                            trigger.enabled ? "bg-secondary" : "bg-bgray/25"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-2 w-2 rounded-full bg-bgray transition-all ${
                              trigger.enabled ? "left-3.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-3 py-4 pr-0">
                        <button
                          type="button"
                          aria-label={`More actions for ${trigger.title}`}
                          className="rounded p-1 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray"
                        >
                          <FiMoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Row 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Logic constraints */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="flex items-center gap-2 text-xs font-bold text-secondary">
              <FiSliders size={13} />
              Logic Constraints
            </h2>
            <ul className="mt-4 space-y-3">
              {constraintRows.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-bgray/90">{row.label}</span>
                  <span className="rounded-sm bg-[#080f15] px-2.5 py-1.5 text-[11px] font-semibold text-bgray">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent deliveries */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="flex items-center gap-2 text-xs font-bold text-secondary">
              <FiClock size={13} />
              Recent Deliveries
            </h2>
            <ul className="mt-4 space-y-3">
              {deliveryRows.map((row) => (
                <li key={row.id} className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-bgray/80">{row.time}</span>
                  <span className="text-bgray/80">{row.ref}</span>
                  <span className={`ml-auto font-bold ${row.status === "delivered" ? "text-green" : "text-primary"}`}>
                    {row.status === "delivered" ? "Delivered" : "Bounced"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Detailed analytics */}
          <section className="flex flex-col items-center rounded-md bg-[#151c24] p-5 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-bgray/10">
              <FiBarChart2 size={16} className="text-secondary" />
            </span>
            <h2 className="mt-3 text-xs font-bold text-bgray">Detailed Analytics</h2>
            <p className="mt-2 max-w-[190px] text-[11px] leading-relaxed text-secondary/70">
              View per-template open rates and click-through metrics in the reporting dashboard.
            </p>
            <button
              type="button"
              className="mt-3 text-[12px] font-bold text-secondary transition hover:text-bgray"
            >
              Launch Reports
            </button>
          </section>
        </div>
      </div>

      <ConfirmModal
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        onConfirm={handleDeploy}
        title="Deploy configuration"
        message="Push trigger and routing changes to AWS SNS and Twilio production? Active campaigns pick up changes immediately."
        confirmLabel="Deploy"
      />
    </div>
  );
};

export default NotificationEnginePage;