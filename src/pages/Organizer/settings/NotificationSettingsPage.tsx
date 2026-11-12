import { useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheck,
  FiMail,
  FiMessageSquare,
  FiMonitor,
} from "react-icons/fi";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface ToggleSetting {
  id: string;
  title: string;
  description?: string;
  icon?: typeof FiMail;
  iconClasses?: string;
  inset?: boolean;
}

type SettingState = Record<string, boolean>;

/* ================== Mock data (swap with real API later) ================== */

const emailSettings: ToggleSetting[] = [
  {
    id: "new-ticket",
    title: "New Ticket Sales",
    description: "Real-time alerts whenever a ticket is purchased for any active event.",
  },
  {
    id: "daily-report",
    title: "Daily Performance Report",
    description: "A consolidated summary of revenue, attendance, and marketing reach sent every morning.",
  },
  {
    id: "check-in",
    title: "Attendee Check-In Alerts",
    description: "Notifications for VIP arrivals or specific check-in milestones.",
  },
  {
    id: "org-updates",
    title: "Organization Updates",
    description: "Internal news regarding policy changes or feature releases.",
  },
];

const inAppSettings: ToggleSetting[] = [
  { id: "system-alerts", title: "System Alerts", icon: FiAlertTriangle, iconClasses: "text-primary", inset: true },
  { id: "chat-messages", title: "Chat Messages", icon: FiMessageSquare, iconClasses: "text-bgray/70", inset: true },
  { id: "event-reminders", title: "Event Reminders", icon: FiCalendar, iconClasses: "text-bgray/70", inset: true },
];

const DEFAULT_STATE: SettingState = {
  "new-ticket": true,
  "daily-report": true,
  "check-in": false,
  "org-updates": true,
  "system-alerts": true,
  "chat-messages": true,
  "event-reminders": true,
  "sms-critical": false,
};

const DEFAULT_PHONE = "+1 (555) 000-0000";

/* ============================= Atoms ============================= */

const Toggle = ({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={`relative h-[14px] w-[26px] shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-white/20"}`}
  >
    <span className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-all ${on ? "left-[13px]" : "left-0.5"}`} />
  </button>
);

/* ============================= Page ============================= */

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState<SettingState>(DEFAULT_STATE);
  const [phone, setPhone] = useState(DEFAULT_PHONE);

  const flip = (id: string) => setSettings((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetDefaults = () => {
    setSettings(DEFAULT_STATE);
    setPhone(DEFAULT_PHONE);
    toast.info("Notification settings reset to default.");
  };

  return (
    <div className="min-h-full bg-[#111214] font-jakarta text-bgray">
      {/* Top bar fragment per pixels — right-aligned cluster; converges into AdminNavbar on integration */}
      <div className="mx-auto w-full max-w-[1500px] px-5 py-3">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold leading-7 tracking-tight text-bgray">Notification Settings</h1>
          <p className="mt-1 max-w-[470px] text-[13px] leading-[1.45] text-bgray/65">
            Configure how MSQUARED keeps you informed. Manage communication channels for
            sales performance, attendee interactions, and critical system alerts.
          </p>
        </header>

        {/* Body grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2.1fr)_minmax(180px,1fr)]">
          {/* Left column */}
          <div className="space-y-4">
            {/* Email notifications */}
            <section className="rounded-xl border border-white/[0.06] bg-[#131418] p-4 sm:min-h-[455px]">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/10">
                  <FiMail size={15} className="text-primary" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-bgray">Email Notifications</h2>
                  <p className="mt-0.5 text-[11px] text-bgray/50">
                    Managed via verified: admin@msquared.com
                  </p>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-white/[0.06]">
                {emailSettings.map((setting) => (
                  <li key={setting.id} className="flex items-center justify-between gap-4 py-6">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-bgray/90">{setting.title}</p>
                      <p className="mt-1 max-w-[280px] text-xs leading-[1.45] text-bgray/55">
                        {setting.description}
                      </p>
                    </div>
                    <Toggle on={settings[setting.id]} label={setting.title} onChange={() => flip(setting.id)} />
                  </li>
                ))}
              </ul>
            </section>

            {/* In-app notifications */}
            <section className="rounded-xl border border-white/[0.06] bg-[#131418] p-4 sm:min-h-[240px]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.08]">
                  <FiMonitor size={15} className="text-bgray/70" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-bgray">In-App Notifications</h2>
                  <p className="mt-0.5 text-[11px] text-bgray/50">
                    Activity while you are using MSQUARED OS
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5">
                {inAppSettings.map((setting) => {
                  const SettingIcon = setting.icon;
                  return (
                    <li
                      key={setting.id}
                      className="flex items-center gap-3 rounded-md border border-white/[0.04] bg-[#191a1c] px-3 py-2.5"
                    >
                      <SettingIcon size={13} className={setting.iconClasses} />
                      <span className="flex-1 text-sm text-bgray/90">{setting.title}</span>
                      <Toggle on={settings[setting.id]} label={setting.title} onChange={() => flip(setting.id)} />
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* SMS alerts */}
            <section className="rounded-xl border border-white/[0.06] bg-[#131418] p-5 sm:min-h-[221px]">
              <div className="flex items-center gap-2.5">
                <FiMessageSquare size={13} className="text-secondary" />
                <h2 className="text-xs font-medium uppercase tracking-wider text-bgray/80">SMS Alerts</h2>
              </div>
              <p className="mt-3 text-[11px] leading-[1.5] text-bgray/55">
                Critical alerts are sent via SMS when immediate action is required or servers
                are down.
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-bgray/55">
                Phone Number
              </p>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-white/[0.06] bg-[#111214] px-2.5 py-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label="Phone number"
                  className="w-full bg-transparent text-xs text-bgray/60 focus:outline-none"
                />
                <button type="button" className="shrink-0 text-[10px] font-bold uppercase text-primary transition hover:underline">
                  Verify
                </button>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={settings["sms-critical"]}
                  onClick={() => flip("sms-critical")}
                  className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border transition ${
                    settings["sms-critical"] ? "border-primary bg-primary" : "border-bgray/30 bg-transparent"
                  }`}
                >
                  {settings["sms-critical"] && <FiCheck size={10} className="text-bgray" />}
                </button>
                <span className="text-[11px] text-bgray/75">Enable Critical SMS Alerts</span>
              </label>
            </section>

            {/* Unsaved changes */}
            <section className="rounded-xl border border-white/[0.06] bg-[#131418] p-5 sm:min-h-[215px]">
              <h2 className="text-sm font-medium text-bgray/90">Unsaved Changes</h2>
              <p className="mt-1.5 text-[10px] leading-[1.5] text-bgray/50">
                Changes to notification routes affect all connected devices across your
                organization.
              </p>
              <button
                type="button"
                onClick={() => toast.success("Preferences updated across all connected devices.")}
                className="mt-4 w-full rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition hover:bg-primary/90"
              >
                Update Preferences
              </button>
              <button
                type="button"
                onClick={resetDefaults}
                className="mt-2 w-full rounded-md border border-white/[0.08] py-2.5 text-xs font-medium text-bgray/75 transition hover:bg-white/[0.03]"
              >
                Reset to Default
              </button>
            </section>

            {/* Help center */}
            <section className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#131418]">
              {/* Isometric cube artwork is a raster asset in Figma — gradient bed placeholder */}
              <div className="relative h-24 bg-gradient-to-br from-[#191a1c] to-[#111214]">
                <span
                  className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white/[0.06] bg-white/[0.02]"
                  aria-hidden="true"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Help Center</p>
                <p className="mt-1 text-[11px] font-semibold text-bgray/90">Need help configuring?</p>
                <button type="button" className="mt-0.5 text-[10px] text-bgray/55 underline decoration-bgray/30 underline-offset-2 transition hover:text-bgray">
                  Read Documentation →
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
