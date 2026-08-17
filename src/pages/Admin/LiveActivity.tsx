import { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  ShoppingCart,
  LogIn,
  AlertCircle,
  PlusCircle,
  Edit3,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Chart Data (7 bars) ────────────────────────────────────────────────────

const rpsData = [
  { time: "1", value: 8 },
  { time: "2", value: 12 },
  { time: "3", value: 7 },
  { time: "4", value: 15 },
  { time: "5", value: 11 },
  { time: "6", value: 9 },
  { time: "7", value: 14 },
];

const maxRps = Math.max(...rpsData.map((d) => d.value));

// ─── Transactions Data ───────────────────────────────────────────────────────

const transactionsData = [
  {
    id: "t1",
    icon: "cart" as const,
    description: "Alex M. bought 2 tickets",
    sub: "Cyberpunk Neon Festival 2024",
    amount: "$162.00",
    time: "JUST NOW",
    timeHighlight: true,
  },
  {
    id: "t2",
    icon: "entry" as const,
    description: "User #8291 Checked In",
    sub: "London Underground: Base Session",
    amount: "ENTRY",
    time: "1M AGO",
    timeHighlight: false,
  },
  {
    id: "t3",
    icon: "cart" as const,
    description: "Sarah K. bought 1 ticket",
    sub: "Sunset Beach Party – VIP",
    amount: "$85.00",
    time: "2M AGO",
    timeHighlight: false,
  },
  {
    id: "t4",
    icon: "entry" as const,
    description: "User #1102 Checked In",
    sub: "Global Dev Summit 2024",
    amount: "ENTRY",
    time: "3M AGO",
    timeHighlight: false,
  },
];

// ─── Moderation Data ─────────────────────────────────────────────────────────

const moderationData = [
  {
    id: "m1",
    icon: "alert" as const,
    title: "Inappropriate Content Report",
    priority: "URGENT",
    description:
      'Event: "Wild Night Out" contains unverified imagery. Reported by User #120.',
    actions: ["Review", "Dismiss"],
  },
  {
    id: "m2",
    icon: "event" as const,
    title: "New Event Created",
    priority: null,
    description:
      '"Quantum Computing Expo" created by Microsoft Org.',
    time: "5M AGO",
  },
  {
    id: "m3",
    icon: "venue" as const,
    title: "Venue Changed",
    priority: null,
    description:
      '"Jazz on the Hill" moved to "Indoor Amphitheater" due to weather.',
    time: "12M AGO",
  },
];

// ── Map scatter dots ───────────────────────────────────────────────────────

const mapDots = [
  { cx: 28, cy: 38 },
  { cx: 42, cy: 30 },
  { cx: 55, cy: 45 },
  { cx: 70, cy: 35 },
  { cx: 80, cy: 52 },
  { cx: 35, cy: 55 },
  { cx: 60, cy: 60 },
  { cx: 75, cy: 42 },
  { cx: 45, cy: 48 },
  { cx: 65, cy: 28 },
];

// ── Sub-Components ──────────────────────────────────────────────────────────

const MapVisualization = () => (
  <svg
    viewBox="0 0 200 140"
    className="w-full h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <radialGradient id="mapBg" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#0a0f18" />
        <stop offset="40%" stopColor="#0f1923" />
        <stop offset="100%" stopColor="#1a2836" />
      </radialGradient>
    </defs>

    {/* Background */}
    <rect width="200" height="140" fill="url(#mapBg)" />

    {/* Concentric rings — dim secondary color */}
    {[25, 40, 55].map((r, i) => (
      <circle
        key={`ring-${i}`}
        cx={120}
        cy={60}
        r={r}
        fill="none"
        stroke="#e9bcb6"
        strokeWidth="0.3"
        opacity={0.1 - i * 0.025}
      />
    ))}

    {/* Scattered activity dots — secondary color */}
    {mapDots.map((dot, i) => (
      <g key={i}>
        <circle
          cx={dot.cx}
          cy={dot.cy}
          r={3}
          fill="#e9bcb6"
          opacity="0.12"
        >
          <animate
            attributeName="r"
            values="2;4;2"
            dur="3s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.15;0;0.15"
            dur="3s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={dot.cx} cy={dot.cy} r={1.2} fill="#e9bcb6" opacity="0.5" />
      </g>
    ))}
  </svg>
);

// ── Main Page ───────────────────────────────────────────────────────────────

const LiveActivity = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-xl md:text-2xl font-bold text-white">
            Live Activity Monitor
          </h1>
          <p className="text-secondary/60 text-sm mt-1">
            Real-time ecosystem pulse and system performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1e293b] border border-secondary/10 rounded-full px-4 py-2">
            <span className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium">
              Uptime
            </span>
            <span className="text-white text-xs font-bold">99.998%</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1e293b] border border-secondary/10 rounded-full px-4 py-2">
            <span className="text-secondary/50 text-[10px] uppercase tracking-wider font-medium">
              Local Time
            </span>
            <span className="text-white text-xs font-bold font-mono">
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* ─ Top Row: Map + Stat Cards ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Live Attendance Map */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-secondary/60" />
              <h3 className="text-secondary/80 text-sm font-bold font-jakarta">
                Live Attendance Map
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse" />
              <span className="text-secondary/50 text-[10px]">
                Real-time geo-clustering active
              </span>
            </div>
          </div>

          {/* Map area */}
          <div className="relative w-full h-56 md:h-72 lg:h-80 rounded-lg overflow-hidden">
            <MapVisualization />

            {/* Bottom-right stat overlays */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <div className="bg-[#1a2332]/90 border border-secondary/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                <p className="text-secondary/40 text-[8px] uppercase tracking-wider font-medium">
                  Top Region
                </p>
                <p className="text-white text-xs font-bold font-jakarta">
                  North America
                </p>
              </div>
              <div className="bg-[#1a2332]/90 border border-secondary/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                <p className="text-secondary/40 text-[8px] uppercase tracking-wider font-medium">
                  Active Clusters
                </p>
                <p className="text-white text-xs font-bold font-jakarta">
                  1,242
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right stat cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Requests Per Second */}
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-secondary/80 text-[10px] uppercase tracking-wider font-semibold">
                Requests Per Second
              </p>
              <TrendingUp size={14} className="text-secondary/40" />
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white font-jakarta">
                12,841
              </span>
              <span className="text-secondary/70 text-xs font-semibold">
                +4.2%
              </span>
            </div>
            {/* Bar chart — 7 thick bars, dim primary for peak */}
            <div className="h-12 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rpsData} barSize={22}>
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {rpsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value === maxRps
                            ? "rgba(229,10,21,0.35)"
                            : "rgba(233,188,182,0.25)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Success Rate */}
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-secondary/80 text-[10px] uppercase tracking-wider font-semibold">
                Payment Success Rate
              </p>
              <CheckCircle size={14} className="text-greenish" />
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white font-jakarta">
                98.4%
              </span>
              <span className="text-secondary/70 text-xs">Stable</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2.5 rounded-full bg-secondary/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-greenish transition-all"
                style={{ width: "98.4%" }}
              />
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-secondary/80 text-[10px] uppercase tracking-wider font-semibold">
                Active Sessions
              </p>
              <Users size={14} className="text-secondary/40" />
            </div>
            <span className="text-2xl font-bold text-white font-jakarta block mt-0.5">
              142,009
            </span>
            <p className="text-secondary/50 text-[10px] mt-1.5">
              Across 14 regions and 200+ organizations.
            </p>
          </div>
        </div>
      </div>

      {/*  Bottom Row: Transaction Feed + Moderation Queue ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Transaction Feed */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-secondary/60" />
              <h3 className="text-secondary/80 text-sm font-bold font-jakarta">
                Live Transaction Feed
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse" />
              <span className="text-secondary/60 text-[10px] font-bold uppercase tracking-wider">
                Streaming Live
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {transactionsData.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                {/* Icon box */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.icon === "cart"
                      ? "bg-greenish/15"
                      : "bg-secondary/10"
                  }`}
                >
                  {tx.icon === "cart" ? (
                    <ShoppingCart size={15} className="text-greenish" />
                  ) : (
                    <LogIn size={15} className="text-secondary/60" />
                  )}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">
                    {tx.description}
                  </p>
                  <p className="text-secondary/40 text-[10px] truncate">
                    {tx.sub}
                  </p>
                </div>

                {/* Amount / Time — secondary color */}
                <div className="text-right flex-shrink-0">
                  <p className="text-secondary/70 text-xs font-bold">
                    {tx.amount}
                  </p>
                  <p
                    className={`text-[9px] font-bold tracking-wider ${
                      tx.timeHighlight
                        ? "text-white"
                        : "text-secondary/50"
                    }`}
                  >
                    {tx.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation Queue */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-secondary/60" />
              <h3 className="text-secondary/80 text-sm font-bold font-jakarta">
                Moderation Queue
              </h3>
            </div>
            <span className="bg-secondary/10 text-secondary/70 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-secondary/20">
              2 Pending Reports
            </span>
          </div>

          <div className="space-y-1">
            {moderationData.map((item) => (
              <div
                key={item.id}
                className={`py-3 px-3 rounded-lg hover:bg-white/[0.02] transition-colors ${
                  item.id === "m1"
                    ? "bg-secondary/[0.03] border-l-2 border-l-secondary/40"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon box */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.icon === "alert"
                        ? "bg-secondary/15"
                        : item.icon === "event"
                        ? "bg-greenish/15"
                        : "bg-secondary/10"
                    }`}
                  >
                    {item.icon === "alert" ? (
                      <AlertCircle size={15} className="text-secondary/70" />
                    ) : item.icon === "event" ? (
                      <PlusCircle size={15} className="text-greenish" />
                    ) : (
                      <Edit3 size={15} className="text-secondary/60" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-white text-xs font-medium">
                        {item.title}
                      </p>
                      {item.priority && (
                        <span className="text-secondary/70 text-[9px] font-bold uppercase tracking-wider">
                          {item.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-secondary/50 text-[10px] leading-relaxed">
                      {item.description}
                    </p>

                    {/* Action buttons */}
                    {item.actions && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <button className="px-3 py-1 bg-secondary/10 text-secondary/70 text-[10px] font-medium rounded border border-secondary/20 hover:bg-secondary/15 transition-colors">
                          Review
                        </button>
                        <button className="px-3 py-1 bg-secondary/10 text-secondary/60 text-[10px] font-medium rounded border border-secondary/15 hover:bg-secondary/15 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    )}
                    {item.time && (
                      <p className="text-secondary/30 text-[9px] mt-1.5">
                        {item.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivity;
