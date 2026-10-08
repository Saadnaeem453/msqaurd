import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAlertTriangle,
  FiChevronRight,
  FiClock,
  FiEdit,
  FiEye,
  FiMonitor,
  FiMousePointer,
  FiRadio,
  FiSmartphone,
  FiSun,
  FiTarget,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

/* ============================= Types ============================= */

interface ActiveBanner {
  id: string;
  icon: IconType;
  iconTone: "primary" | "neutral";
  title: string;
  window: string;
  description: string;
}

type Visibility = "public" | "internal";

interface ArchiveRow {
  id: string;
  title: string;
  type: string;
  visibility: Visibility;
  period: string;
  author: string;
  status: { dot: string; label: string };
}

interface StatItem {
  id: string;
  icon: IconType;
  iconTone: "primary" | "neutral" | "green";
  label: string;
  value: string;
}

type DeviceMode = "phone" | "monitor";

/* ================== Mock data (swap with real API later) ================== */

const activeBanners: ActiveBanner[] = [
  {
    id: "b1",
    icon: FiAlertTriangle,
    iconTone: "primary",
    title: "Scheduled Database Maintenance",
    window: "Until 04:00 AM UTC",
    description:
      "Global maintenance window. Users will experience read-only access for core event modules.",
  },
  {
    id: "b2",
    icon: FiSun,
    iconTone: "neutral",
    title: "Ramadan Kareem Greeting",
    window: "Ends: Apr 21",
    description:
      "Contextual modal for MENA region users on login. Festive greetings and platform theme adjustment.",
  },
];

const archiveRows: ArchiveRow[] = [
  {
    id: "a1",
    title: "New Feature: Wallet v2",
    type: "Tooltip",
    visibility: "public",
    period: "May 12 - May 19",
    author: "S. Aris",
    status: { dot: "bg-secondary", label: "Pending" },
  },
  {
    id: "a2",
    title: "Privacy Policy Update",
    type: "Modal",
    visibility: "public",
    period: "Apr 01 - Apr 15",
    author: "Legal Team",
    status: { dot: "bg-bgray/40", label: "Expired" },
  },
  {
    id: "a3",
    title: "Internal: Audit Logs Sync",
    type: "Banner",
    visibility: "internal",
    period: "Permanent",
    author: "System Admin",
    status: { dot: "bg-green", label: "Active" },
  },
];

const VISIBILITY_CLASSES: Record<Visibility, string> = {
  public: "bg-report-blue/10 text-report-blue",
  internal: "bg-primary/15 text-secondary",
};

const previewComponents = [
  "Global Maintenance Banner",
  "Ramadan Greeting Modal",
  "Wallet v2 Tooltip",
];

const statItems: StatItem[] = [
  { id: "reach", icon: FiEye, iconTone: "primary", label: "Avg Reach", value: "142.4k" },
  { id: "ctr", icon: FiMousePointer, iconTone: "neutral", label: "CTR (Modals)", value: "8.4%" },
  { id: "broadcasts", icon: FiClock, iconTone: "neutral", label: "Broadcasts 30d", value: "12" },
  { id: "load", icon: FiActivity, iconTone: "green", label: "System Load", value: "0.02%" },
];

const ICON_TONE_CLASSES: Record<StatItem["iconTone"], string> = {
  primary: "bg-primary/15 text-primary",
  neutral: "bg-bgray/10 text-bgray/70",
  green: "bg-green/15 text-green",
};

function AnnouncementScreen({ componentIndex, enabled, dismissed, onDismiss, desktop }: {
  componentIndex: number; enabled: boolean; dismissed: boolean; onDismiss: () => void; desktop: boolean;
}) {
  const show = enabled && !dismissed;
  return (
    <div className={`relative overflow-hidden rounded-md bg-[#0c0e12] ${desktop ? "min-h-[250px] p-3" : "min-h-[380px] py-2"}`}>
      <div className="mb-3 flex items-center justify-between"><span className="h-3 w-3 rounded-full bg-primary" /><span className="text-[9px] text-bgray/60">MSQUARED</span></div>
      {show && componentIndex === 0 && <div className="mb-3 rounded-sm bg-primary p-2 text-white"><div className="flex items-start gap-1"><FiAlertTriangle size={12} className="shrink-0" /><p className="flex-1 text-[10px] font-semibold">Database Maintenance</p><button type="button" aria-label="Dismiss maintenance banner in preview" onClick={onDismiss} className="rounded p-0.5 hover:bg-white/20"><FiX size={12} /></button></div><p className="mt-1 text-[9px] leading-relaxed">Read-only mode active until 04:00 UTC.</p></div>}
      <div aria-hidden="true" className="space-y-3"><div className={`${desktop ? "h-12" : "h-20"} rounded-md bg-[#1e1f27]`} /><div className="grid grid-cols-2 gap-2"><div className="h-16 rounded-md bg-[#1e1f27]" /><div className="h-16 rounded-md bg-[#1e1f27]" /></div></div>
      <div className="relative mt-3 rounded-md bg-[#1e1f27] p-3"><span className="text-[10px] text-bgray">My Wallet</span><p className="mt-1 text-xs text-bgray/60">Balance &amp; tickets</p>
        {show && componentIndex === 2 && <div className="relative mt-3 rounded bg-report-blue p-2 text-grayblue"><span aria-hidden="true" className="absolute -top-1 left-3 h-2 w-2 rotate-45 bg-report-blue" /><div className="flex items-start gap-1"><p className="flex-1 text-[10px] font-semibold">Meet Wallet v2</p><button type="button" aria-label="Dismiss wallet tooltip in preview" onClick={onDismiss}><FiX size={12} /></button></div><p className="mt-1 text-[9px] leading-relaxed">Your tickets and balance, together in one place.</p><button type="button" onClick={onDismiss} className="mt-2 rounded bg-grayblue px-2 py-1 text-[9px] text-white">Got it</button></div>}
      </div>
      {show && componentIndex === 1 && <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-2"><section aria-label="Ramadan greeting preview" className="w-full rounded-lg border border-secondary/20 bg-[#20262f] p-3 text-center"><div className="flex justify-end"><button type="button" aria-label="Dismiss Ramadan greeting in preview" onClick={onDismiss} className="p-1 text-secondary"><FiX size={12} /></button></div><FiSun size={24} className="mx-auto text-secondary" /><h3 className="mt-2 text-xs font-semibold text-bgray">Ramadan Kareem</h3><p className="mt-2 text-[10px] leading-relaxed text-secondary">Wishing you a peaceful and blessed Ramadan.</p><button type="button" onClick={onDismiss} className="mt-3 rounded bg-primary px-3 py-2 text-[10px] text-white">Continue</button></section></div>}
    </div>
  );
}

/* ============================= Page ============================= */

const PlatformAnnouncementsPage = () => {
  const [device, setDevice] = useState<DeviceMode>("phone");
  const [componentIndex, setComponentIndex] = useState(0);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const selectPreview = (index: number) => { setComponentIndex(index); setDismissed(false); setPreviewEnabled(true); };

  const selectedComponent = previewComponents[componentIndex % previewComponents.length];

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <h1 className="text-2xl font-semibold tracking-tight text-bgray lg:text-3xl">
              Platform Announcements
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-secondary/90">
              Manage global broadcasts, maintenance notices, and contextual tooltips across
              the MSQUARED ecosystem.
            </p>
          </div>
          <button
            type="button"
            className="flex min-h-14 w-52 shrink-0 items-center justify-center gap-5 rounded-sm bg-primary px-5 py-3 text-center text-sm leading-relaxed text-white shadow-lg shadow-primary/10 transition hover:bg-primary/90"
          >
            <FiRadio size={15} className="shrink-0" />
            Broadcast New Message
          </button>
        </header>

        {/* Body grid */}
        <div className="mt-6 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,2.05fr)_minmax(270px,1fr)]">
          {/* Left column */}
          <div className="min-w-0 space-y-4">
            {/* Active banners */}
            <section className="rounded-md border border-bgray/5 border-l-2 border-l-primary bg-[#171c24] p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-jakarta text-base font-semibold text-bgray">
                  <FiRadio size={15} className="text-primary" />
                  Currently Active Banners
                </h2>
                <span className="rounded-sm bg-primary/15 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-primary">
                  Live Now
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {activeBanners.map((banner) => {
                  const BannerIcon = banner.icon;
                  return (
                    <li key={banner.id} className="flex gap-3 bg-[#1b2129] p-3.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                          banner.iconTone === "primary"
                            ? "bg-primary/15 text-primary"
                            : "bg-bgray/10 text-bgray/70"
                        }`}
                      >
                        <BannerIcon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs font-bold text-bgray">{banner.title}</p>
                          <p className="text-[11px] font-normal text-secondary">{banner.window}</p>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-secondary/80">
                          {banner.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-center gap-2">
                        <button type="button" aria-label={`Edit ${banner.title}`} className="rounded p-1 text-bgray/70 transition hover:text-bgray">
                          <FiEdit size={12} />
                        </button>
                        <button type="button" aria-label={`Preview ${banner.title}`} onClick={() => selectPreview(banner.id === "b1" ? 0 : 1)} className="rounded p-1 text-primary transition hover:text-primary/80">
                          <FiTarget size={12} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Archive table */}
            <section className="overflow-hidden rounded-md border border-bgray/5 bg-[#171c24]">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-report-head px-5 py-4">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-bgray">
                  Announcement Archive &amp; History
                </h2>
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-md bg-bgray/10 px-3 py-1.5 text-[9px] font-semibold text-bgray transition hover:bg-bgray/15">
                    Filter
                  </button>
                  <button type="button" className="rounded-md bg-bgray/10 px-3 py-1.5 text-[9px] font-semibold text-bgray transition hover:bg-bgray/15">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left">
                  <thead>
                    <tr>
                      <th className="w-[24%] px-4 py-2.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                        Announcement Title
                      </th>
                      <th className="w-[12%] px-3 py-2.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                        Type
                      </th>
                      <th className="w-[14%] px-3 py-2.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                        Visibility
                      </th>
                      <th className="w-[18%] px-3 py-2.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                        Scheduled Period
                      </th>
                      <th className="w-[16%] px-3 py-2.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                        Author
                      </th>
                      <th className="w-[16%] px-3 py-2.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {archiveRows.map((row) => (
                      <tr key={row.id} className="border-t border-bgray/[0.03]">
                        <td className="px-4 py-4">
                          <span className="block max-w-[110px] text-xs font-medium leading-relaxed text-bgray">
                            {row.title}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="inline-block rounded-sm bg-bgray/10 px-2 py-0.5 text-[8px] font-semibold text-bgray/80">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-semibold ${VISIBILITY_CLASSES[row.visibility]}`}>
                            {row.visibility === "public" ? "Public" : "Internal"}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="block max-w-[70px] text-[10px] font-semibold leading-snug text-bgray/90">
                            {row.period}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="block max-w-[70px] text-[10px] leading-snug text-bgray/90">
                            {row.author}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${row.status.dot}`} aria-hidden="true" />
                            <span className="text-[10px] text-bgray/80">{row.status.label}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Live device preview */}
          <section className="overflow-hidden rounded-md border border-bgray/5 bg-[#20262f]">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-xs font-medium tracking-wide text-bgray">
                Live Device Preview
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Phone preview"
                  aria-pressed={device === "phone"}
                  onClick={() => setDevice("phone")}
                  className={`rounded p-1.5 transition ${
                    device === "phone" ? "bg-bgray/10 text-bgray" : "text-secondary/75 hover:text-bgray"
                  }`}
                >
                  <FiSmartphone size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Desktop preview"
                  aria-pressed={device === "monitor"}
                  onClick={() => setDevice("monitor")}
                  className={`rounded p-1.5 transition ${
                    device === "monitor" ? "bg-bgray/10 text-bgray" : "text-secondary/75 hover:text-bgray"
                  }`}
                >
                  <FiMonitor size={14} />
                </button>
              </div>
            </div>

            <div className="flex min-h-[470px] items-center justify-center bg-[#0f141c] px-5 py-7">
              <div className={device === "phone" ? "relative w-[200px] rounded-[2.5rem] border-[7px] border-[#202129] bg-[#0c0e12] px-3 pb-3 pt-7 shadow-xl" : "w-full max-w-[360px]"}>
                {device === "phone" && <span aria-hidden="true" className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#202129]" />}
                <div className={device === "monitor" ? "rounded-lg border-[6px] border-[#303741]" : ""}>
                  <AnnouncementScreen componentIndex={componentIndex} enabled={previewEnabled} dismissed={dismissed} onDismiss={() => setDismissed(true)} desktop={device === "monitor"} />
                </div>
                {device === "monitor" && <div aria-hidden="true"><span className="mx-auto block h-5 w-8 bg-[#303741]" /><span className="mx-auto block h-2 w-24 rounded bg-[#303741]" /></div>}
              </div>
            </div>

            <div className="border-t border-bgray/[0.03] p-4">
              <div className="flex items-center justify-between">
                <button type="button" role="switch" aria-checked={previewEnabled} onClick={() => { setPreviewEnabled(!previewEnabled); setDismissed(false); }} className="flex items-center gap-2 text-[10px] text-bgray"><span className={`relative h-4 w-7 rounded-full ${previewEnabled ? "bg-primary" : "bg-bgray/20"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white ${previewEnabled ? "right-0.5" : "left-0.5"}`} /></span>Preview enabled</button>
                <span className="flex items-center gap-1.5">
                  <span className="text-[8px] text-secondary/75">Cycle Items</span>
                  <button
                    type="button"
                    aria-label="Cycle preview component"
                    onClick={() => selectPreview((componentIndex + 1) % previewComponents.length)}
                    className="flex h-5 w-5 items-center justify-center rounded border border-border_color text-bgray/80 transition hover:bg-bgray/10"
                  >
                    <FiChevronRight size={10} />
                  </button>
                </span>
              </div>
              <label htmlFor="announcement-preview-component" className="mt-3 block text-[9px] font-medium uppercase tracking-wider text-secondary">
                Selected Component
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-sm bg-report-head p-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <select id="announcement-preview-component" value={componentIndex} onChange={event => selectPreview(Number(event.target.value))} className="min-w-0 flex-1 bg-report-head text-[10px] text-bgray">{previewComponents.map((name, index) => <option key={name} value={index}>{name}</option>)}</select>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2"><p role="status" className="text-[10px] text-secondary/70">{!previewEnabled ? "Preview off" : dismissed ? "Dismissed in preview" : `${selectedComponent} shown`}</p><button type="button" aria-label="Replay selected preview" onClick={() => selectPreview(componentIndex)} className="flex shrink-0 items-center gap-1 rounded p-1 text-[10px] text-secondary hover:bg-bgray/10"><FiRefreshCw size={12} />Replay</button></div>
            </div>
          </section>
        </div>

        {/* Bottom stat bar */}
        <section className="mt-6 grid grid-cols-1 gap-3 border-t border-bgray/5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-sm border border-bgray/5 bg-report-head p-4">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${ICON_TONE_CLASSES[item.iconTone]}`}>
                  <Icon size={15} />
                </span>
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-wider text-secondary">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-bgray">{item.value}</p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default PlatformAnnouncementsPage;