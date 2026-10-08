import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiCode,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiGitMerge,
  FiMoreVertical,
  FiPlus,
  FiSettings,
  FiShare2,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  footer: { icon: IconType; text: string; tone: "green" | "primary" | "muted" };
}

interface KeyRow {
  id: string;
  icon: IconType;
  name: string;
  token: string;
  scopes: string[];
  lastUsed: string;
  status: "active" | "inactive";
}

interface EndpointRow {
  id: string;
  url: string;
  events: string;
  badge: string;
  badgeTone: "green" | "primary";
}

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  { id: "keys", label: "Active Keys", value: "12", footer: { icon: FiTrendingUp, text: "2 added this month", tone: "green" } },
  { id: "requests", label: "API Requests (24h)", value: "1.2M", footer: { icon: FiZap, text: "450 req/sec peak", tone: "muted" } },
  { id: "latency", label: "Avg Latency", value: "42ms", footer: { icon: FiCheckCircle, text: "Stable system health", tone: "green" } },
  { id: "webhooks", label: "Webhook Events", value: "8.4k", footer: { icon: FiAlertTriangle, text: "12 failed deliveries", tone: "primary" } },
];

const keyRows: KeyRow[] = [
  {
    id: "k1",
    icon: FiCode,
    name: "Production Analytics",
    token: "ev_live_••••••••••••••••x782",
    scopes: ["Read:Events", "Read:Finance"],
    lastUsed: "2 mins ago",
    status: "active",
  },
  {
    id: "k2",
    icon: FiGitMerge,
    name: "Migration Service",
    token: "ev_test_••••••••••••••••a422",
    scopes: ["Full:Access"],
    lastUsed: "Oct 12, 2024",
    status: "inactive",
  },
  {
    id: "k3",
    icon: FiBarChart2,
    name: "Data Warehouse Sync",
    token: "ev_live_••••••••••••••••f921",
    scopes: ["Read:Global"],
    lastUsed: "22 mins ago",
    status: "active",
  },
];

const endpointRows: EndpointRow[] = [
  {
    id: "e1",
    url: "https://api.eventos-internal.com/v1/hooks",
    events: "Events: user.signup, payment.success, event.live",
    badge: "200 OK",
    badgeTone: "green",
  },
  {
    id: "e2",
    url: "https://hooks.slack.com/services/T012345/...",
    events: "Events: moderation.flag",
    badge: "503 FAILED",
    badgeTone: "primary",
  },
];

const SECRET_MASKED = "whsec_51d7••••••••••••9f4a";
const SECRET_FULL = "whsec_51d7XkQ9vRtY2mBn8Lq3W9f4a";

/* ============================= Page ============================= */

const ApiKeyManagementPage = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [rotateOpen, setRotateOpen] = useState(false);
  const [rotating, setRotating] = useState(false);

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      toast.success("API token copied to clipboard.");
    } catch {
      toast.error("Clipboard access was denied.");
    }
  };

  const handleRotate = () => {
    setRotating(true);
    // Mock async rotation — replace with real API call
    window.setTimeout(() => {
      setRotating(false);
      setRotateOpen(false);
      setShowSecret(false);
      toast.success("Webhook secret rotated. Update your listeners.");
    }, 900);
  };

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">API Key Management</h1>
            <p className="mt-2 text-sm leading-relaxed text-secondary/80">
              Manage secure programmatic access to the EventOS infrastructure endpoints.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold text-bgray transition hover:bg-primary/90"
          >
            <FiPlus size={14} />
            Generate New Key
          </button>
        </header>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const FooterIcon = item.footer.icon;
            return (
              <div key={item.id} className="rounded-md bg-[#151c24] p-5">
                <p className="text-xs font-medium text-bgray/80">{item.label}</p>
                <p className="mt-2 text-xl font-bold text-bgray">{item.value}</p>
                <p
                  className={`mt-3 flex items-center gap-1.5 text-[10px] ${
                    item.footer.tone === "green"
                      ? "text-green"
                      : item.footer.tone === "primary"
                        ? "text-primary"
                        : "text-bgray/70"
                  }`}
                >
                  <FooterIcon size={11} />
                  {item.footer.text}
                </p>
              </div>
            );
          })}
        </section>

        {/* Active integration keys */}
        <section className="mt-6 overflow-hidden rounded-md bg-[#151c24]">
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-5">
            <h2 className="text-base font-medium text-bgray">Active Integration Keys</h2>
            <button type="button" aria-label="Filter keys" className="rounded p-1 text-bgray/60 transition hover:text-bgray">
              <FiFilter size={15} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-t border-bgray/5">
                  {["Key Label", "API Key / Token", "Scopes", "Last Used", "Status", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-secondary/80"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keyRows.map((row) => {
                  const RowIcon = row.icon;
                  return (
                    <tr key={row.id} className="border-t border-bgray/5">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/15">
                            <RowIcon size={14} className="text-primary" />
                          </span>
                          <span className="max-w-[110px] text-xs font-semibold leading-snug text-bgray">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-bgray/90">{row.token}</span>
                          <button
                            type="button"
                            aria-label={`Copy token for ${row.name}`}
                            onClick={() => copyToken(row.token)}
                            className="shrink-0 text-bgray/60 transition hover:text-bgray"
                          >
                            <FiCopy size={12} />
                          </button>
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="flex flex-col items-start gap-1.5">
                          {row.scopes.map((scope) => (
                            <span key={scope} className="rounded-sm bg-bgray/10 px-2 py-1 text-[10px] text-bgray/80">
                              {scope}
                            </span>
                          ))}
                        </span>
                      </td>
                      <td className="max-w-[70px] px-6 py-5 text-xs leading-snug text-bgray/90">{row.lastUsed}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                            row.status === "active" ? "bg-green/15 text-green" : "bg-bgray/10 text-bgray/70"
                          }`}
                        >
                          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
                          {row.status === "active" ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          type="button"
                          aria-label={`More actions for ${row.name}`}
                          className="rounded p-1 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray"
                        >
                          <FiMoreVertical size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Webhooks row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
          {/* Endpoints */}
          <section className="rounded-md bg-[#151c24] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-base font-medium text-bgray">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/15">
                  <FiShare2 size={14} className="text-primary" />
                </span>
                Webhook Endpoints
              </h2>
              <button type="button" className="text-xs font-bold text-secondary transition hover:text-bgray">
                Add Endpoint
              </button>
            </div>

            <ul className="mt-5 space-y-4">
              {endpointRows.map((endpoint) => (
                <li key={endpoint.id} className="flex items-center gap-3 rounded-sm bg-[#1d242d] p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-bgray/90">{endpoint.url}</p>
                    <p className="mt-1 text-[10px] text-bgray/60">{endpoint.events}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-sm px-2 py-1 text-[10px] font-bold ${
                      endpoint.badgeTone === "green" ? "bg-green/15 text-green" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {endpoint.badge}
                  </span>
                  <button
                    type="button"
                    aria-label={`Configure ${endpoint.url}`}
                    className="shrink-0 rounded p-1 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray"
                  >
                    <FiSettings size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Webhook secret */}
          <section className="rounded-md bg-[#151c24] p-6">
            <h2 className="text-base font-medium text-bgray">Webhook Secret</h2>
            <p className="mt-3 text-xs leading-relaxed text-bgray/70">
              Use this secret to verify signatures of incoming webhook requests from EventOS.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-sm bg-[#080f15] px-3 py-3">
              <span className={`font-mono text-xs text-bgray/70 ${showSecret ? "" : "blur-[3px]"}`}>
                {showSecret ? SECRET_FULL : SECRET_MASKED}
              </span>
              <button
                type="button"
                aria-label={showSecret ? "Mask webhook secret" : "Reveal webhook secret"}
                onClick={() => setShowSecret((v) => !v)}
                className="shrink-0 text-bgray/70 transition hover:text-bgray"
              >
                {showSecret ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRotateOpen(true)}
              className="mt-4 w-full rounded-md border border-bgray/20 py-2.5 text-xs font-semibold text-bgray transition hover:bg-bgray/5"
            >
              Rotate Secret
            </button>
            <p className="mt-3 text-center text-[10px] text-bgray/60">Last rotated: 4 months ago</p>
          </section>
        </div>

        {/* Technical documentation */}
        <section className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-md bg-primary/10 p-6">
          <div className="max-w-xl">
            <h2 className="text-base font-medium text-secondary">Technical Documentation</h2>
            <p className="mt-2 text-xs leading-relaxed text-secondary/80">
              Our REST API supports OAuth 2.0 and API Key authentication. Explore our comprehensive
              documentation for endpoint references, rate limit details, and SDK installation guides.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-md bg-secondary px-5 py-2.5 text-xs font-semibold text-grayblue transition hover:bg-secondary/90"
            >
              API Explorer
            </button>
            <button
              type="button"
              className="rounded-md border border-secondary/40 px-5 py-2.5 text-xs font-semibold text-secondary transition hover:bg-secondary/10"
            >
              Read Docs
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={rotateOpen}
        onClose={() => setRotateOpen(false)}
        onConfirm={handleRotate}
        title="Rotate webhook secret"
        message="Rotating invalidates the current secret immediately. Listeners not updated will fail signature verification."
        confirmLabel="Rotate Secret"
      />
    </div>
  );
};

export default ApiKeyManagementPage;