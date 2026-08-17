import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  Megaphone,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Quote,
  Mic,
  Music,
  Users as UsersIcon,
  Utensils,
  MapPin,
  Globe,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ─ Mock Data ───────────────────────────────────────────────────────────────

// Ticket Sales Pacing (weeks)
const salesPacingData = [
  { week: "W1", current: 80, avg: 60 },
  { week: "W2", current: 180, avg: 150 },
  { week: "W3", current: 320, avg: 280 },
  { week: "W4", current: 480, avg: 420 },
  { week: "W5", current: 620, avg: 560 },
  { week: "W6", current: 780, avg: 700 },
  { week: "W7", current: 920, avg: 830 },
  { week: "W8", current: 1050, avg: 950 },
  { week: "W9", current: 1150, avg: 1060 },
  { week: "W10", current: 1248, avg: 1150 },
];

const conversionFunnelData = [
  { label: "Page Views", value: 12402, percent: 100 },
  { label: "Ticket Selection", value: 4120, percent: 33 },
  { label: "Checkout", value: 1850, percent: 15 },
  { label: "Completed Purchase", value: 1248, percent: 10 },
];

const sentimentData = [
  { label: "Positive", percent: 74, color: "#ef4444" },
  { label: "Neutral", percent: 21, color: "#374151" },
  { label: "Negative", percent: 5, color: "#1f2937" },
];

const agendaFeedback = [
  {
    icon: Mic,
    title: "Opening Keynote: The Future of Digital",
    speaker: "Dr. Helena Vance",
    votes: 422,
    rating: 4.9,
    color: "bg-red-500/10",
  },
  {
    icon: Music,
    title: "Evening Performance: Crimson Collective",
    speaker: "Urban Stage",
    votes: 388,
    rating: 4.8,
    color: "bg-red-500/10",
  },
  {
    icon: UsersIcon,
    title: "Panel: Community Resilience",
    speaker: "Hall B",
    votes: 310,
    rating: 4.5,
    color: "bg-secondary/10",
  },
  {
    icon: Utensils,
    title: "Catering & Networking Brunch",
    speaker: "Outdoor Terrace",
    votes: 192,
    rating: 4.2,
    color: "bg-secondary/10",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Stat Card ───────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  change,
  changeType,
  sub,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  sub?: string;
}) => (
  <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
    <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-2">
      {label}
    </p>
    <div className="flex items-end gap-2 mb-1">
      <span className="text-3xl font-bold text-white font-jakarta">{value}</span>
      <span
        className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${
          changeType === "up"
            ? "text-green-400"
            : changeType === "down"
              ? "text-red-400"
              : "text-secondary/60"
        }`}
      >
        {changeType === "up" && <TrendingUp size={12} />}
        {changeType === "down" && <TrendingDown size={12} />}
        {changeType === "neutral" && <Minus size={12} />}
        {change}
      </span>
    </div>
    {sub && <p className="text-secondary/40 text-[10px]">{sub}</p>}
  </div>
);

// ── Component ───────────────────────────────────────────────────────────────

const EventPerformance = () => {
  const maxFunnelValue = conversionFunnelData[0].value;
  const funnelBarColors = ["#ef4444", "#b91c1c", "#7f1d1d", "#450a0a"];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ── Top Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tickets Sold"
          value="1,248"
          change="+12.5%"
          changeType="up"
          sub="vs. Summer Gala 2023 (1,109)"
        />
        <StatCard
          label="Net Revenue"
          value={formatCurrency(84320)}
          change="+8.2%"
          changeType="up"
          sub="Goal: $100,000 (84% complete)"
        />
        <StatCard
          label="Social Reach"
          value="42.5K"
          change="-0.0%"
          changeType="neutral"
          sub="Organic shares across Instagram & X"
        />
        <StatCard
          label="Attendance Rate"
          value="88%"
          change=""
          changeType="up"
          sub="1,098 check-in"
        />
      </div>

      {/* ── Sales Pacing + Conversion Funnel ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Ticket Sales Pacing */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-jakarta text-lg font-bold text-white">
              Ticket Sales Pacing
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-red-500 rounded-full" />
                <span className="text-secondary text-[10px]">Current Event</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t border-dashed border-secondary rounded-full" />
                <span className="text-secondary text-[10px]">Avg. Performance</span>
              </div>
            </div>
          </div>
          <p className="text-secondary/50 text-xs mb-6">
            Comparative analysis against event averages.
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesPacingData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={true} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={{ stroke: "#1f2937" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c22",
                    border: "1px solid #292a2b",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#4b5563"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  dot={false}
                  activeDot={false}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 1.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-6">
            Conversion Funnel
          </h2>

          <div className="space-y-5">
            {conversionFunnelData.map((item, idx) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-bold">
                      {item.value.toLocaleString()}
                    </span>
                    {idx > 0 && (
                      <span className="text-secondary/40 text-[10px]">
                        ({item.percent}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.value / maxFunnelValue) * 100}%`,
                      backgroundColor: funnelBarColors[idx],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Social Impact + Agenda Feedback ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Social Impact */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-jakarta text-lg font-bold text-white">Social Impact</h2>
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] uppercase tracking-wider rounded-full font-semibold">
              Sentiments Analysis
            </span>
          </div>

          {/* Sentiment Icons */}
          <div className="flex items-center justify-around mb-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2">
                <ThumbsUp size={20} className="text-red-400" />
              </div>
              <p className="text-white text-xl font-bold font-jakarta">74%</p>
              <p className="text-secondary/50 text-[10px] uppercase tracking-wider mt-0.5">Positive</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                <Meh size={20} className="text-secondary" />
              </div>
              <p className="text-white text-xl font-bold font-jakarta">21%</p>
              <p className="text-secondary/50 text-[10px] uppercase tracking-wider mt-0.5">Neutral</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/5 flex items-center justify-center mx-auto mb-2">
                <ThumbsDown size={20} className="text-secondary/40" />
              </div>
              <p className="text-white text-xl font-bold font-jakarta">5%</p>
              <p className="text-secondary/50 text-[10px] uppercase tracking-wider mt-0.5">Negative</p>
            </div>
          </div>

          {/* Featured Quote */}
          <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/10">
            <div className="flex items-start gap-3">
              <Quote size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-secondary/80 text-xs leading-relaxed italic">
                  "The Summer Gala 2024 production quality is unparalleled. Best event of the year so far! #MSquared #SummerGala"
                </p>
                <p className="text-secondary/40 text-[10px] mt-2">
                  @sarah_events • Instagram • 2h ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agenda Feedback Summary */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-5">
            Agenda Feedback Summary
          </h2>

          <div className="space-y-3">
            {agendaFeedback.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-secondary/5 hover:border-secondary/10 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}
                >
                  <item.icon size={16} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  <p className="text-secondary/40 text-[10px]">
                    {item.speaker} • {item.votes} Votes
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className={`text-sm font-bold ${
                      item.rating >= 4.5 ? "text-red-400" : "text-white"
                    }`}
                  >
                    {item.rating}
                  </span>
                  <span className="text-secondary/40 text-[10px]">/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Attendee Origin ──────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-jakarta text-lg font-bold text-white flex items-center gap-2">
              <MapPin size={16} className="text-secondary/60" />
              Attendee Origin
            </h2>
            <p className="text-secondary/50 text-xs mt-1">
              Heatmap of registered ticket holders by region.
            </p>
          </div>
          <div className="text-right">
            <p className="text-secondary/40 text-[10px] uppercase tracking-wider">Top Region</p>
            <p className="text-red-400 text-sm font-bold font-jakarta">Metropolitan Hub (64%)</p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="relative h-52 bg-[#1a1c22] rounded-lg overflow-hidden flex items-center justify-center border border-secondary/5">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />

          <div className="relative flex items-center gap-8 z-10">
            {/* Globe icon */}
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
              <Globe size={28} className="text-secondary/40" />
            </div>

            <div className="flex gap-4">
              <div className="bg-[#131418] border border-secondary/10 rounded-lg px-6 py-3 text-center">
                <p className="text-secondary/40 text-[9px] uppercase tracking-wider mb-1">Domestic</p>
                <p className="text-white text-2xl font-bold font-jakarta">92%</p>
              </div>
              <div className="bg-[#131418] border border-secondary/10 rounded-lg px-6 py-3 text-center">
                <p className="text-secondary/40 text-[9px] uppercase tracking-wider mb-1">International</p>
                <p className="text-white text-2xl font-bold font-jakarta">8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPerformance;
