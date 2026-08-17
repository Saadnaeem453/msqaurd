import { useState } from "react";
import {
  Download,
  RefreshCw,
  Globe,
  Radio,
  Users,
  Shield,
  MoreVertical,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Chart Data ──────────────────────────────────────────────────────────────

const revenueData = [
  { time: "00:00", value: 12 },
  { time: "02:00", value: 18 },
  { time: "04:00", value: 8 },
  { time: "06:00", value: 22 },
  { time: "08:00", value: 35 },
  { time: "10:00", value: 42 },
  { time: "12:00", value: 28 },
  { time: "14:00", value: 48 },
  { time: "16:00", value: 38 },
  { time: "18:00", value: 25 },
  { time: "20:00", value: 15 },
  { time: "22:00", value: 10 },
];

const maxValue = Math.max(...revenueData.map((d) => d.value));

// ── Organizers Data ─────────────────────────────────────────────────────────

const organizersData = [
  {
    initials: "NX",
    name: "NexGen Festivals",
    id: "#849201",
    volume: "$1,240,400",
    tickets: "42,800",
    status: "PREMIER",
  },
  {
    initials: "SC",
    name: "Summit Collective",
    id: "#110293",
    volume: "$840,200",
    tickets: "12,150",
    status: "VERIFIED",
  },
  {
    initials: "UR",
    name: "Urban Rhythms",
    id: "#394281",
    volume: "$412,000",
    tickets: "8,200",
    status: "UNDER REVIEW",
  },
];

// ─── Alerts Data ─────────────────────────────────────────────────────────────

const alertsData = [
  {
    id: "a1",
    type: "critical" as const,
    title: "CRITICAL MODERATION",
    time: "2m ago",
    message:
      "Mass-reporting detected on event #AX-9421. Immediate review required.",
  },
  {
    id: "a2",
    type: "latency" as const,
    title: "SYSTEM LATENCY",
    time: "14m ago",
    message:
      "API Node US-EAST-1 exhibiting 150ms tail latency increase.",
  },
  {
    id: "a3",
    type: "queue" as const,
    title: "QUEUE DEPTH",
    time: "32m ago",
    message:
      "Verification queue exceeding 200 items. Escalation triggered.",
  },
];

// ── Globe Dots ──────────────────────────────────────────────────────────────

const globeDots = [
  { cx: 30, cy: 35, label: "North America", color: "#e50a15", r: 2.5 },
  { cx: 55, cy: 28, label: "Europe", color: "#e9bcb6", r: 2 },
  { cx: 82, cy: 48, label: "APAC", color: "#e50a15", r: 2.5 },
  { cx: 50, cy: 55, label: "Africa", color: "#e9bcb6", r: 1.5 },
  { cx: 68, cy: 35, label: "Asia", color: "#e9bcb6", r: 1.5 },
  { cx: 35, cy: 65, label: "South America", color: "#e9bcb6", r: 1.5 },
  { cx: 85, cy: 65, label: "Australia", color: "#e9bcb6", r: 1 },
];

// ── Sub-Components ──────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
  extra,
  icon,
  progress,
  progressColor,
}: {
  label: string;
  value: string;
  sub?: string;
  extra?: React.ReactNode;
  icon: React.ReactNode;
  progress?: number;
  progressColor?: string;
}) => (
  <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-secondary/70 text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </p>
      <span className="text-secondary/50">{icon}</span>
    </div>
    <p className="text-2xl md:text-3xl font-bold text-white font-jakarta">
      {value}
    </p>
    {sub && (
      <p className="text-secondary/70 text-xs mt-1">{sub}</p>
    )}
    {extra && <div className="mt-2">{extra}</div>}
    {progress !== undefined && (
      <div className="mt-3 h-0.5 rounded-full bg-secondary/15 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: progressColor || "#e50a15",
          }}
        />
      </div>
    )}
  </div>
);

// ── Globe SVG ────────────────────────────────────────────────────────────────

const GlobeMap = () => (
  <svg
    viewBox="0 0 120 100"
    className="w-full h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <radialGradient id="globeFill" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#2a3545" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0f1923" stopOpacity="0.85" />
      </radialGradient>
    </defs>

    {/* Globe sphere */}
    <circle cx="60" cy="50" r="42" fill="url(#globeFill)" />

    {/* Latitude lines */}
    {[-25, -12, 0, 12, 25].map((offset, i) => {
      const y = 50 + offset;
      const halfW = Math.sqrt(42 * 42 - offset * offset);
      return (
        <ellipse
          key={`lat-${i}`}
          cx={60}
          cy={y}
          rx={halfW}
          ry={2.5}
          fill="none"
          stroke="#3a4a5a"
          strokeWidth="0.3"
          opacity="0.35"
        />
      );
    })}

    {/* Longitude lines */}
    {[-28, -14, 0, 14, 28].map((offset, i) => (
      <ellipse
        key={`lon-${i}`}
        cx={60}
        cy={50}
        rx={Math.abs(offset) || 0.5}
        ry={42}
        fill="none"
        stroke="#3a4a5a"
        strokeWidth="0.3"
        opacity="0.3"
      />
    ))}

    {/* Equator */}
    <line x1={18} y1={50} x2={102} y2={50} stroke="#3a4a5a" strokeWidth="0.4" opacity="0.4" />
    {/* Prime meridian */}
    <line x1={60} y1={8} x2={60} y2={92} stroke="#3a4a5a" strokeWidth="0.4" opacity="0.4" />

    {/* Pulse rings from active regions */}
    {globeDots.filter((d) => d.color === "#e50a15").map((dot, i) => (
      <circle
        key={`pulse-${i}`}
        cx={dot.cx}
        cy={dot.cy}
        r={4}
        fill="none"
        stroke="#e50a15"
        strokeWidth="0.3"
        opacity="0.3"
      >
        <animate
          attributeName="r"
          values="3;7;3"
          dur="2.5s"
          begin={`${i * 0.5}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0;0.3"
          dur="2.5s"
          begin={`${i * 0.5}s`}
          repeatCount="indefinite"
        />
      </circle>
    ))}

    {/* Activity dots */}
    {globeDots.map((dot, i) => (
      <g key={i}>
        <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} opacity="0.85" />
        <circle cx={dot.cx} cy={dot.cy} r={dot.r * 0.4} fill="white" opacity="0.5" />
      </g>
    ))}

    {/* Globe border */}
    <circle cx={60} cy={50} r={42} fill="none" stroke="#3a4a5a" strokeWidth="0.4" opacity="0.3" />
  </svg>
);

// ── Dollar icon helper ───────────────────────────────────────────────────────

function DollarSignIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-secondary/50"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// ── Bar color helper ─────────────────────────────────────────────────────────

const getBarColor = (value: number) => {
  const ratio = value / maxValue;
  if (ratio >= 0.95) return "#e50a15";
  if (ratio >= 0.75) return "#e9bcb6";
  if (ratio >= 0.5) return "#e9bcb6";
  return "#6b7a8a";
};

// ── Page Component ──────────────────────────────────────────────────────────

const SystemOverview = () => {
  const [timeframe] = useState("Last 7 Days");

  const statusColor = (status: string) => {
    if (status === "PREMIER") return "bg-green-500/15 text-green-400 border border-green-500/30";
    if (status === "VERIFIED") return "bg-green-500/15 text-green-400 border border-green-500/30";
    if (status === "UNDER REVIEW") return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    return "bg-secondary/10 text-secondary/60 border border-secondary/20";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-xl md:text-2xl font-bold text-white">
            System Overview
          </h1>
          <p className="text-secondary/60 text-sm mt-1">
            Real-time platform performance and operational status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-secondary/20 text-secondary/60 hover:text-white hover:border-secondary/40 rounded-lg text-xs font-medium transition-colors">
            <Download size={14} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
            <RefreshCw size={14} />
            Refresh Node State
          </button>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Platform GMV"
          value="$12.8M"
          icon={<DollarSignIcon />}
          progress={72}
          progressColor="#e50a15"
          extra={
            <>
              <span className="text-greenish text-xs font-medium">+14.2%</span>
              <p className="text-secondary/60 text-[10px] mt-1">
                Current Q3 Velocity
              </p>
            </>
          }
        />
        <StatCard
          label="Active Users"
          value="842.1K"
          icon={<Users size={16} className="text-secondary/50" />}
          extra={
            <div className="flex items-center gap-3 mt-1">
              <span className="text-secondary/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                810K Attendees
              </span>
              <span className="text-secondary/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                32.1K Organizers
              </span>
            </div>
          }
        />
        <StatCard
          label="Live Throughput"
          value="1,248"
          icon={<Radio size={16} className="text-secondary/50" />}
          extra={
            <>
              <span className="text-secondary/70 text-xs">Events Live</span>
              <p className="text-secondary/60 text-[10px] mt-1">
                Peak capacity: 82% reached
              </p>
            </>
          }
        />
        <StatCard
          label="Global Queue"
          value="142"
          icon={<Shield size={16} className="text-secondary/50" />}
          extra={
            <>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle size={10} className="text-secondary/60" />
                <span className="text-secondary/70 text-[10px]">Priority: 10 High</span>
              </div>
              <p className="text-secondary/60 text-[10px] mt-1">
                Avg wait time: 4.2 mins
              </p>
            </>
          }
        />
      </div>

      {/* ── Globe + Revenue Velocity ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Global Activity Map */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-secondary/60" />
              <h3 className="text-white text-sm font-bold font-jakarta">
                Global Activity Map
              </h3>
            </div>
            <span className="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-primary/20">
              Realtime Mesh
            </span>
          </div>

          {/* Globe container */}
          <div className="relative w-full h-48 md:h-64 lg:h-72 bg-[#0a0f18] rounded-lg overflow-hidden">
            <GlobeMap />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-secondary/70 text-[10px]">
                North America: <span className="text-white font-medium">High</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary/60" />
              <span className="text-secondary/70 text-[10px]">
                Europe: <span className="text-white font-medium">Stable</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-secondary/70 text-[10px]">
                APAC: <span className="text-white font-medium">Surging</span>
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Velocity */}
        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="mb-4">
            <h3 className="text-white text-sm font-bold font-jakarta">
              Revenue Velocity
            </h3>
            <p className="text-secondary/60 text-[10px] mt-0.5">
              Transaction throughput last 24h
            </p>
          </div>

          {/* Bar Chart */}
          <div className="h-40 md:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={16}>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6b7280", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.value)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-secondary/10">
            <div>
              <p className="text-secondary/60 text-[10px] uppercase tracking-wider">
                Peak Velocity
              </p>
              <p className="text-white text-sm font-bold mt-0.5 font-jakarta">$42.8k/min</p>
            </div>
            <div>
              <p className="text-secondary/60 text-[10px] uppercase tracking-wider">
                Average Wait
              </p>
              <p className="text-white text-sm font-bold mt-0.5 font-jakarta">0.42s</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerts + Organizers ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Critical Alerts */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-red-400" />
              <h3 className="text-white text-sm font-bold font-jakarta">
                Critical Alerts
              </h3>
            </div>
            <span className="bg-red-500/15 text-red-400 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-red-500/30">
              4 New
            </span>
          </div>

          <div className="space-y-3">
            {alertsData.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/[0.02] rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-xs font-bold tracking-wider">
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-1 text-secondary/40">
                    <Clock size={10} />
                    <span className="text-[10px]">{alert.time}</span>
                  </div>
                </div>
                <p className="text-secondary/60 text-[11px] leading-relaxed">
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* High-Performance Organizers */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm font-bold font-jakarta">
              High-Performance Organizers
            </h3>
            <span className="text-secondary/60 text-[10px] bg-secondary/10 px-2 py-1 rounded border border-secondary/15">
              {timeframe}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-secondary/10">
                  <th className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium text-left pb-2.5 pr-3">
                    Organizer Entity
                  </th>
                  <th className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium text-right pb-2.5 px-3">
                    Volume (GMV)
                  </th>
                  <th className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium text-right pb-2.5 px-3 hidden md:table-cell">
                    Tickets Sold
                  </th>
                  <th className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium text-center pb-2.5 px-3">
                    Status
                  </th>
                  <th className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium text-center pb-2.5 pl-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {organizersData.map((org) => (
                  <tr
                    key={org.id}
                    className="border-b border-secondary/5 last:border-0"
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {/* Gray avatar */}
                        <div className="w-7 h-7 rounded-md bg-[#2a2b30] flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-[9px] font-bold">
                            {org.initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-[11px] font-medium leading-tight">
                            {org.name}
                          </p>
                          <p className="text-secondary/30 text-[9px]">
                            ID: {org.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-white text-[11px] font-medium">
                      {org.volume}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-400 text-[11px] hidden md:table-cell">
                      {org.tickets}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColor(org.status)}`}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <button className="text-secondary/30 hover:text-white transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
