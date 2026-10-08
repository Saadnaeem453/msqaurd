import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCheckSquare,
  FiCpu,
  FiCreditCard,
  FiMoreVertical,
  FiMusic,
  FiRadio,
  FiRefreshCw,
  FiSun,

  FiTrendingUp,
} from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";
import { MdEqualize } from "react-icons/md";
import ConfirmModal from "../../../components/ui/ConfirmModal";

interface StatItem {
  id: string;
  label: string;
  value: string;
  valueTone: "secondary" | "bgray";
  icon: IconType;
  tinted?: boolean;
  footerIcon: IconType;
  footerText: string;
  footerTone: "green" | "secondary";
}

type EventStatus = "trending" | "high-risk" | "stable";

interface LiveEvent {
  id: string;
  name: string;
  eventId: string;
  thumbIcon: IconType;
  status: EventStatus;
  velocityRate: string;
  velocityCap: number;
  checkIn: string;
  checkInSub: string;
  revenue: string;
  delta: string;
  deltaTone: "green" | "muted";
}

interface SystemEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  tone: "critical" | "success";
}

interface IngressMarker {
  id: string;
  x: string;
  y: string;
  size: number;
}

const statItems: StatItem[] = [
  {
    id: "live",
    label: "Total Live Events",
    value: "142",
    valueTone: "secondary",
    icon: FiRadio,
    footerIcon: FiTrendingUp,
    footerText: "+12% vs last hour",
    footerTone: "green",
  },
  {
    id: "tickets",
    label: "Current Tickets Sold",
    value: "18,542",
    valueTone: "bgray",
    icon: BsTicketPerforated,
    footerIcon: FiRefreshCw,
    footerText: "42.5 tickets / min",
    footerTone: "secondary",
  },
  {
    id: "revenue",
    label: "Live Revenue (USD)",
    value: "$1.28M",
    valueTone: "bgray",
    icon: FiCreditCard,
    tinted: true,
    footerIcon: FiCheckSquare,
    footerText: "Processed across 12 nodes",
    footerTone: "green",
  },
];

const liveEvents: LiveEvent[] = [
  {
    id: "1",
    name: "Neon Horizon 2024",
    eventId: "EVT-992-PX",
    thumbIcon: FiSun,
    status: "trending",
    velocityRate: "8.2 t/min",
    velocityCap: 89,
    checkIn: "74.2%",
    checkInSub: "(4.2k/5.6k)",
    revenue: "$422,150",
    delta: "+5.2% pk",
    deltaTone: "green",
  },
  {
    id: "2",
    name: "Midnight Jazz Series",
    eventId: "EVT-4411-LL",
    thumbIcon: FiMusic,
    status: "high-risk",
    velocityRate: "0.4 t/min",
    velocityCap: 32,
    checkIn: "12.5%",
    checkInSub: "(180/1.2k)",
    revenue: "$12,800",
    delta: "-18.4% pk",
    deltaTone: "muted",
  },
  {
    id: "3",
    name: "Global Tech Summit",
    eventId: "EVT-102-NO",
    thumbIcon: FiCpu,
    status: "stable",
    velocityRate: "2.1 t/min",
    velocityCap: 94,
    checkIn: "91.8%",
    checkInSub: "(8.5k/9.2k)",
    revenue: "$842,500",
    delta: "Stable",
    deltaTone: "muted",
  },
];

const STATUS_BADGES: Record<EventStatus, { label: string; classes: string }> = {
  trending: { label: "Trending", classes: "bg-green/15 text-green" },
  "high-risk": { label: "High Risk", classes: "bg-primary/15 text-secondary" },
  stable: { label: "Stable", classes: "bg-bgray/10 text-bgray/80" },
};

const systemEvents: SystemEvent[] = [
  {
    id: "1",
    title: "Payment Node Timeout",
    time: "2m ago",
    description:
      "Cluster 'US-EAST-1B' reports elevated latency in transaction processing for 'Neon Horizon 2024'. Automatic failover initiated.",
    tone: "critical",
  },
  {
    id: "2",
    title: "Capacity Threshold Reached",
    time: "14m ago",
    description:
      "'Global Tech Summit' has reached 94% capacity. Waitlist automation has been successfully deployed for remaining tier tickets.",
    tone: "success",
  },
];

const SYSTEM_EVENT_ICONS: Record<SystemEvent["tone"], { icon: IconType; classes: string }> = {
  critical: { icon: FiAlertTriangle, classes: "bg-primary/15 text-primary" },
  success: { icon: FiCheckCircle, classes: "bg-green/15 text-green" },
};

const ingressMarkers: IngressMarker[] = [
  { id: "nyc", x: "26%", y: "28%", size: 9 },
  { id: "fra", x: "65%", y: "38%", size: 5 },
  { id: "jnb", x: "51%", y: "71%", size: 11 },
];

const peakActivity = { label: "Peak Activity", node: "LND_NODE_04", delta: "+42.1%" };

const LivePublishedEventsPage = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);

  const handleRebalance = () => {
    setRebalancing(true);

    window.setTimeout(() => {
      setRebalancing(false);
      setConfirmOpen(false);
    }, 900);
  };

  return (
    <div className="min-h-full bg-[#0b1118] text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">
        <header className="admin-page-heading"><div><h1 className="admin-page-title">Published Events</h1><p className="admin-page-description">Monitor published events and track live performance.</p></div></header>

        <section className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            const FooterIcon = item.footerIcon;
            return (
              <div
                key={item.id}
                className={`relative rounded-md border border-bgray/5 p-4 ${
                  item.tinted ? "bg-[#160f19] border-secondary/15" : "bg-[#14181f]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="pr-7 text-[11px] font-medium uppercase tracking-wider text-secondary">
                    {item.label}
                  </span>
                  <Icon aria-hidden="true" size={34} className="absolute right-3 top-3 text-bgray/10" />
                </div>
                <p
                  className={`mt-1 font-jakarta text-2xl font-semibold tracking-tight ${
                    item.tinted || item.valueTone === "secondary" ? "text-secondary" : "text-bgray"
                  }`}
                >
                  {item.value}
                </p>
                <div
                  className={`mt-3 flex items-center gap-1 text-[11px] font-medium ${
                    item.footerTone === "green" ? "text-green" : "text-secondary"
                  }`}
                >
                  <FooterIcon size={13} />
                  {item.footerText}
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-5 overflow-hidden rounded-md border border-bgray/5 bg-[#14181f]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1c222b] px-4 py-3">
            <h2 className="admin-section-title flex items-center gap-2 font-jakarta text-base font-semibold text-bgray">
              <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
              Live Performance Pipeline
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-sm bg-[#303741] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-bgray transition hover:bg-bgray/15"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="rounded-sm bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-bgray transition hover:bg-primary/90"
              >
                Re-Balance Nodes
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed text-left">
              <thead>
                <tr className="bg-[#181e26]">
                  <th className="w-[24%] px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-secondary">
                    Event Details
                  </th>
                  <th className="w-[13%] px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-secondary">
                    Status
                  </th>
                  <th className="w-[20%] px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-secondary">
                    Sales Velocity
                  </th>
                  <th className="w-[17%] px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-secondary">
                    Check-In Rate
                  </th>
                  <th className="w-[16%] px-4 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-secondary">
                    Live Revenue
                  </th>
                  <th className="w-[10%] px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-secondary">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {liveEvents.map((event) => {
                  const ThumbIcon = event.thumbIcon;
                  const badge = STATUS_BADGES[event.status];
                  return (
                    <tr key={event.id} className="border-t border-bgray/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-bgray/10">
                            <ThumbIcon size={13} className="text-bgray/40" />
                          </span>
                          <div>
                            <p className="max-w-[130px] text-sm font-semibold leading-snug text-bgray">
                              {event.name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-secondary/50">
                              ID: {event.eventId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${badge.classes}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full min-w-[85px]">
                          <div className="flex items-center justify-between text-[10px] text-bgray">
                            <span>{event.velocityRate}</span>
                            <span>{event.velocityCap}% CAP</span>
                          </div>
                          <div className="mt-1 h-1 w-full rounded-full bg-bgray/15">
                            <div
                              className={`h-full rounded-full ${
                                event.status === "trending" ? "bg-green" : "bg-secondary"
                              }`}
                              style={{ width: `${event.velocityCap}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap items-baseline gap-1">
                          <span
                            className={`text-sm font-bold ${
                              event.status === "high-risk" ? "text-secondary" : "text-bgray"
                            }`}
                          >
                            {event.checkIn}
                          </span>
                          <span className="text-[10px] text-secondary/50">
                            {event.checkInSub}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-bold text-bgray">{event.revenue}</p>
                        <p
                          className={`mt-0.5 text-[10px] ${
                            event.deltaTone === "green"
                              ? "font-semibold text-green"
                              : "text-secondary/50"
                          }`}
                        >
                          {event.delta}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          aria-label={`Actions for ${event.name}`}
                          className="rounded p-1.5 text-secondary/50 transition hover:bg-bgray/10 hover:text-bgray"
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

        <section className="mt-5 grid grid-cols-1 gap-3 min-[560px]:grid-cols-2">

          <div className="overflow-hidden rounded-md border border-bgray/5 bg-[#14181f]">
            <div className="p-4">
              <h2 className="admin-section-title text-[11px] font-bold uppercase tracking-wider text-bgray/80">
                Critical System Events
              </h2>
              <ul className="mt-4 space-y-5">
                {systemEvents.map((event) => {
                  const tone = SYSTEM_EVENT_ICONS[event.tone];
                  const Icon = tone.icon;
                  return (
                    <li key={event.id} className="flex gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tone.classes}`}
                      >
                        <Icon size={13} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs font-semibold text-bgray">{event.title}</p>
                          <span className="shrink-0 text-[9px] uppercase text-secondary/50">
                            {event.time}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs leading-relaxed text-secondary/50">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="h-20 bg-gradient-to-br from-bgray/10 to-bgray/5" aria-hidden="true" />
          </div>

          <div className="overflow-hidden rounded-md border border-bgray/5 bg-[#14181f]">
            <div className="px-4 py-3">
              <h2 className="admin-section-title text-[11px] font-bold uppercase tracking-wider text-bgray/80">
                Global Ingress Heatmap
              </h2>
            </div>
            <div className="relative h-[330px] bg-[radial-gradient(ellipse_at_center,#19262c,#080f15)]">
              {ingressMarkers.map((marker) => (
                <span
                  key={marker.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-lg shadow-secondary/50"
                  style={{
                    left: marker.x,
                    top: marker.y,
                    width: marker.size,
                    height: marker.size,
                  }}
                />
              ))}
              <div className="absolute bottom-4 left-4 rounded-md bg-bgray/10 px-3 py-2">
                <p className="text-[9px] uppercase tracking-wider text-secondary/50">
                  {peakActivity.label}
                </p>
                <p className="mt-0.5 flex items-baseline gap-2 text-xs font-bold">
                  <span className="text-bgray">{peakActivity.node}</span>
                  <span className="text-green">{peakActivity.delta}</span>
                </p>
              </div>

            </div>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleRebalance}
        message="Re-balance ingress nodes across all live regions? Ticket processing may pause briefly."
        loading={rebalancing}
      />
    </div>
  );
};

export default LivePublishedEventsPage;
