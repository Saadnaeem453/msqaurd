import { useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiGlobe,
  FiInfo,
  FiShare2,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  valueTone: "light" | "primary";
  icon: typeof FiShield;
  iconTone: string;
  footer: { icon: "trend" | "alert" | "target"; text: string; tone: "green" | "primary" | "muted" };
}

type RowStatus = "blocked" | "success" | "mfa" | "mismatch";

interface LoginRow {
  id: string;
  time: string;
  subLabel: string;
  subTone: "primary" | "muted";
  userId: string;
  email: string;
  avatarTone: "primary" | "neutral";
  device: string;
  fingerprint: string;
  location: string;
  ip: string;
  dotClass: string;
  status: RowStatus;
  critical?: boolean;
}

interface RiskRow {
  id: string;
  label: string;
  percent: number;
  barClass: string;
  valueClass: string;
}

interface ChipDef {
  id: "events" | "range";
  icon: typeof FiFilter;
  options: { value: string; label: string }[];
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  {
    id: "sessions",
    label: "Active Sessions",
    value: "1,248",
    valueTone: "light",
    icon: FiShare2,
    iconTone: "text-secondary",
    footer: { icon: "trend", text: "+4.2% from last hour", tone: "green" },
  },
  {
    id: "failed",
    label: "Failed Attempts (24h)",
    value: "42",
    valueTone: "primary",
    icon: FiShield,
    iconTone: "text-primary",
    footer: { icon: "alert", text: "12 flagged as brute-force risk", tone: "primary" },
  },
  {
    id: "anomalies",
    label: "Geographic Anomalies",
    value: "03",
    valueTone: "light",
    icon: FiGlobe,
    iconTone: "text-bgray/60",
    footer: { icon: "target", text: "Logins from unmapped IP ranges", tone: "muted" },
  },
];

const eventChips: ChipDef[] = [
  {
    id: "events",
    icon: FiFilter,
    options: [
      { value: "all", label: "All Events" },
      { value: "success", label: "Success Only" },
      { value: "failed", label: "Failed Only" },
      { value: "mfa", label: "MFA Events" },
    ],
  },
  {
    id: "range",
    icon: FiCalendar,
    options: [
      { value: "24h", label: "Last 24 Hours" },
      { value: "7d", label: "Last 7 Days" },
      { value: "30d", label: "Last 30 Days" },
    ],
  },
];

const loginRows: LoginRow[] = [
  {
    id: "r1",
    time: "2024-05-22 14:23:01",
    subLabel: "Critical Alert",
    subTone: "primary",
    userId: "USR-94821",
    email: "m.anderson@corporate.com",
    avatarTone: "primary",
    device: "Firefox 125 (Windows 11)",
    fingerprint: "aX3c-89nn-8812",
    location: "Moscow, RU",
    ip: "91.108.221.14",
    dotClass: "bg-primary",
    status: "blocked",
    critical: true,
  },
  {
    id: "r2",
    time: "2024-05-22 14:18:45",
    subLabel: "Normal Audit",
    subTone: "muted",
    userId: "USR-11029",
    email: "sarah.j@ventrix.io",
    avatarTone: "neutral",
    device: "Chrome 124 (MacOS 14)",
    fingerprint: "k2m4-pp5n-8821",
    location: "New York, US",
    ip: "72.14.201.88",
    dotClass: "bg-green",
    status: "success",
  },
  {
    id: "r3",
    time: "2024-05-22 14:15:12",
    subLabel: "Elevated Access",
    subTone: "muted",
    userId: "USR-00441",
    email: "admin_it@ventrix.io",
    avatarTone: "neutral",
    device: "Safari 17.4 (iOS)",
    fingerprint: "b8c1-09nn-2214",
    location: "London, UK",
    ip: "88.22.81.100",
    dotClass: "bg-amber",
    status: "mfa",
  },
  {
    id: "r4",
    time: "2024-05-22 14:02:59",
    subLabel: "Anomalies",
    subTone: "primary",
    userId: "USR-55912",
    email: "dev_ops_k@internal.mod",
    avatarTone: "neutral",
    device: "Chrome 124 (Linux)",
    fingerprint: "771d-1kqp-4419",
    location: "Berlin, DE",
    ip: "88.21.10.144",
    dotClass: "bg-amber",
    status: "mismatch",
  },
];

const STATUS_BADGES: Record<RowStatus, { label: string; classes: string }> = {
  blocked: { label: "Blocked", classes: "bg-primary/15 text-primary" },
  success: { label: "Success", classes: "bg-green/15 text-green" },
  mfa: { label: "MFA Pending", classes: "bg-amber/15 text-amber" },
  mismatch: { label: "Device Mismatch", classes: "bg-primary/15 text-primary" },
};

const riskRows: RiskRow[] = [
  { id: "low", label: "Low Risk", percent: 92, barClass: "bg-green", valueClass: "text-bgray" },
  { id: "mfa", label: "MFA Anomalies", percent: 7, barClass: "bg-amber", valueClass: "text-bgray" },
  { id: "critical", label: "Critical/Bot", percent: 1, barClass: "bg-primary", valueClass: "text-primary" },
];

/* ============================= Page ============================= */

const LoginHistoryPage = () => {
  const [chips, setChips] = useState<Record<ChipDef["id"], string>>({ events: "all", range: "24h" });
  const [openChip, setOpenChip] = useState<ChipDef["id"] | null>(null);
  const [page, setPage] = useState(1);

  const labelFor = (chip: ChipDef) => chip.options.find((o) => o.value === chips[chip.id])?.label;

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-medium tracking-tight text-bgray">Login History</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary/80">
            Monitoring real-time authentication traffic and security signals across the
            infrastructure.
          </p>
        </header>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-md bg-[#151c24] p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                    {item.label}
                  </p>
                  <Icon size={16} className={item.iconTone} />
                </div>
                <p className={`mt-2 text-3xl font-bold ${item.valueTone === "primary" ? "text-primary" : "text-bgray"}`}>
                  {item.value}
                </p>
                <p
                  className={`mt-3 flex items-center gap-1.5 text-[10px] ${
                    item.footer.tone === "green"
                      ? "text-green"
                      : item.footer.tone === "primary"
                        ? "text-primary"
                        : "text-bgray/70"
                  }`}
                >
                  {item.footer.icon === "trend" && <FiTrendingUp size={11} />}
                  {item.footer.icon === "alert" && <FiAlertTriangle size={10} />}
                  {item.footer.icon === "target" && <FiTarget size={10} />}
                  {item.footer.text}
                </p>
              </div>
            );
          })}
        </section>

        {/* Filter bar */}
        <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#151c24] px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {eventChips.map((chip) => {
              const ChipIcon = chip.icon;
              return (
                <div key={chip.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenChip(openChip === chip.id ? null : chip.id)}
                    className="flex items-center gap-2 rounded-md bg-bgray/10 px-3 py-2 text-xs text-bgray transition hover:bg-bgray/15"
                  >
                    <ChipIcon size={12} className="text-bgray/70" />
                    {labelFor(chip)}
                    <FiChevronDown size={11} className="text-bgray/60" />
                  </button>
                  {openChip === chip.id && (
                    <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                      {chip.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setChips((prev) => ({ ...prev, [chip.id]: option.value }));
                            setOpenChip(null);
                          }}
                          className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                            option.value === chips[chip.id] ? "font-medium text-bgray" : "text-bgray/80"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-primary/90"
          >
            <FiDownload size={13} />
            Export Log
          </button>
        </section>

        {/* Login table */}
        <section className="mt-4 overflow-hidden rounded-md bg-[#151c24]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="bg-bgray/5">
                  {["Timestamp", "User Identity", "Device / Browser", "Location / IP", "Status", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-secondary/80"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loginRows.map((row) => {
                  const badge = STATUS_BADGES[row.status];
                  return (
                    <tr
                      key={row.id}
                      className={`border-t border-bgray/5 ${
                        row.critical ? "border-l-2 border-l-primary bg-primary/10" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <p className="text-xs font-semibold text-bgray">{row.time}</p>
                        <p
                          className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${
                            row.subTone === "primary" ? "text-primary" : "text-bgray/60"
                          }`}
                        >
                          {row.subLabel}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${
                              row.avatarTone === "primary" ? "bg-primary/15 text-primary" : "bg-bgray/10 text-bgray/70"
                            }`}
                          >
                            <FiUser size={13} />
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-bgray">{row.userId}</p>
                            <p className="mt-0.5 text-[10px] text-bgray/60">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="max-w-[110px] text-xs leading-snug text-bgray/90">{row.device}</p>
                        <p className="mt-1 max-w-[110px] text-[10px] leading-snug text-bgray/60">
                          Fingerprint: {row.fingerprint}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="flex items-center gap-1.5 text-xs text-bgray/90">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.dotClass}`} aria-hidden="true" />
                          {row.location}
                        </p>
                        <p className="mt-1 text-[10px] text-bgray/60">{row.ip}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${badge.classes}`}
                        >
                          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          aria-label={`Details for ${row.userId}`}
                          className="rounded-full p-1 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray"
                        >
                          <FiInfo size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-bgray/60">
              Showing 1-20 of 12,401 entries
            </p>
            <nav aria-label="Login history pagination" className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 text-bgray/60 transition hover:text-bgray disabled:opacity-40"
              >
                <FiChevronLeft size={12} />
              </button>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  aria-current={page === num ? "page" : undefined}
                  onClick={() => setPage(num)}
                  className={`h-7 w-7 rounded-sm text-xs font-semibold transition ${
                    page === num ? "bg-primary text-bgray" : "text-bgray/70 hover:bg-bgray/10"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                onClick={() => setPage((p) => p + 1)}
                className="rounded p-1 text-bgray/70 transition hover:text-bgray"
              >
                <FiChevronRight size={12} />
              </button>
            </nav>
          </div>
        </section>

        {/* Bottom row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          {/* Geo-distribution */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="flex items-center gap-2 text-sm font-medium text-bgray">
              <FiGlobe size={14} className="text-primary" />
              Real-time Geo-Distribution
            </h2>
            {/* Dot-map is a raster asset in Figma — placeholder bed; swap for bundled map asset on integration */}
            <div className="mt-4 flex h-56 flex-col items-center justify-center rounded-sm bg-[#080f15] px-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-bgray">
                Live Node Monitoring Active
              </p>
              <p className="mt-2 text-xs text-bgray/60">
                Tracking auth requests across 42 availability zones
              </p>
            </div>
          </section>

          {/* Risk distribution */}
          <section className="rounded-md bg-[#151c24] p-5">
            <h2 className="text-sm font-medium text-bgray">Risk Distribution</h2>
            <ul className="mt-4 space-y-4">
              {riskRows.map((row) => (
                <li key={row.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-bgray/90">{row.label}</span>
                    <span className={`text-xs font-semibold ${row.valueClass}`}>{row.percent}%</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full rounded-full bg-bgray/15">
                    <div className={`h-full rounded-full ${row.barClass}`} style={{ width: `${row.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-5 w-full rounded-md border border-bgray/20 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/5"
            >
              View Full Report
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryPage;