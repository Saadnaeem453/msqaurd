import { useState } from "react";
import {
  Filter,
  FileText,
  TrendingUp,
  Users,
  UserCheck,
  Activity,
  BarChart3,
  MapPin,
  Smartphone,
  Monitor,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// ── Color helper: brighter = higher value, darker = lower value ─────────────

/**
 * Returns a red color that gets brighter as value increases.
 * 0% → very dark red (#450a0a), 100% → bright red (#ef4444)
 */
function valueToRedColor(percent: number, maxPercent: number): string {
  const ratio = Math.min(percent / maxPercent, 1);
  // Interpolate between dark red (#450a0a = rgb(69,10,10)) and bright red (#ef4444 = rgb(239,68,68))
  const r = Math.round(69 + (239 - 69) * ratio);
  const g = Math.round(10 + (68 - 10) * ratio);
  const b = Math.round(10 + (68 - 10) * ratio);
  return `rgb(${r},${g},${b})`;
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const ageDistributionData = [
  { group: "18-24", count: 1800 },
  { group: "25-34", count: 4200 },
  { group: "35-44", count: 3100 },
  { group: "45-54", count: 1900 },
  { group: "55+", count: 800 },
];

const maxAgeCount = Math.max(...ageDistributionData.map((d) => d.count));

const genderData = [
  { name: "Female", value: 57.2, color: "#ef4444" },
  { name: "Male", value: 41.8, color: "#374151" },
  { name: "Non-binary", value: 1.0, color: "#6b7280" },
];

const interestsData = [
  { name: "Education", percent: 85 },
  { name: "Youth", percent: 72 },
  { name: "Tech", percent: 54 },
  { name: "Culture", percent: 48 },
  { name: "Health", percent: 31 },
];

const maxInterestPercent = Math.max(...interestsData.map((d) => d.percent));

const platformData = [
  {
    platform: "iOS (Native App)",
    users: 5820,
    avgSession: "12m 45s",
    conversion: 14.2,
  },
  {
    platform: "Android (Native App)",
    users: 4115,
    avgSession: "10m 20s",
    conversion: 11.8,
  },
  {
    platform: "Mobile Safari / Chrome",
    users: 2547,
    avgSession: "4m 15s",
    conversion: 6.4,
  },
];

const trendingCategories = [
  "#SocialImpact",
  "#Sustainability",
  "#Entrepreneurship",
  "#Volunteerism",
  "#ArtificialIntelligence",
];

// ── Component ───────────────────────────────────────────────────────────────

const AudienceInsights = () => {
  const [ageRangeFilter, setAgeRangeFilter] = useState("Last 30 Days");
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const ageRangeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-white">Audience Insights</h1>
          <p className="text-secondary text-sm mt-1.5 max-w-xl">
            Comprehensive breakdown of your community demographics and engagement patterns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors">
            <Filter size={14} /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Unique Attendees */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <BarChart3 size={16} className="text-secondary" />
            </div>
            <span className="flex items-center gap-0.5 text-green-400 text-xs font-medium">
              <TrendingUp size={12} /> +12.5% ↑
            </span>
          </div>
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-1">
            Total Unique Attendees
          </p>
          <p className="text-white text-3xl font-bold font-jakarta">12,482</p>
          <p className="text-secondary/40 text-xs mt-2">vs. 11,092 last month</p>
        </div>

        {/* New vs Returning */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <UserCheck size={16} className="text-secondary" />
            </div>
            <span className="flex items-center gap-1 text-secondary text-xs font-medium">
              Steady —
            </span>
          </div>
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-1">
            New vs Returning
          </p>
          <p className="text-white text-3xl font-bold font-jakarta">
            64% <span className="text-base font-normal text-secondary/50">new</span>
          </p>
          <div className="mt-3 h-2 bg-secondary/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: "64%" }} />
          </div>
        </div>

        {/* Engagement Score */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Activity size={16} className="text-secondary" />
            </div>
            <span className="flex items-center gap-0.5 text-green-400 text-xs font-medium">
              <TrendingUp size={12} /> +8.2% ↑
            </span>
          </div>
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-1">
            Engagement Score
          </p>
          <p className="text-white text-3xl font-bold font-jakarta">
            8.4<span className="text-base font-normal text-secondary/40">/10</span>
          </p>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 mt-3 h-8">
            {[35, 45, 55, 40, 65, 70, 84].map((val, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${(val / 100) * 100}%`,
                  backgroundColor: valueToRedColor(val, 100),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Age Distribution + Gender Split ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Age Distribution */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-jakarta text-lg font-bold text-white">Age Distribution</h2>
            <div className="relative">
              <button
                onClick={() => setShowAgeDropdown(!showAgeDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary text-xs rounded-lg hover:bg-secondary/20 transition-colors"
              >
                {ageRangeFilter}
                <ChevronDown size={12} />
              </button>
              {showAgeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAgeDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
                    {ageRangeOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setAgeRangeFilter(opt);
                          setShowAgeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-secondary/10 ${
                          opt === ageRangeFilter
                            ? "text-primary font-medium"
                            : "text-secondary hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageDistributionData}
                margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
              >
                <XAxis
                  dataKey="group"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={{ stroke: "#1f2937" }}
                  tickLine={false}
                />
                <YAxis hide />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
                  {ageDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={valueToRedColor(entry.count, maxAgeCount)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Split */}
        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-6">Gender Split</h2>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={72}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white font-jakarta">57%</span>
                <span className="text-secondary/50 text-xs">Female</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            {genderData.map((g) => (
              <div key={g.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="text-secondary">{g.name}</span>
                </div>
                <span className="text-white font-medium">{g.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Attendee Origin + Top Interests ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendee Origin */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-jakarta text-lg font-bold text-white flex items-center gap-2">
              <MapPin size={16} className="text-secondary/60" />
              Attendee Origin
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Live Map
            </span>
          </div>

          <div className="relative h-52 bg-gradient-to-br from-[#0d0e12] to-[#131418] rounded-lg overflow-hidden flex items-center justify-center border border-secondary/5">
            {/* Simulated map glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-red-500/5 blur-3xl" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute opacity-30" />
              <div className="w-3 h-3 rounded-full bg-red-500 relative" />
            </div>

            <div className="relative text-center z-10">
              <p className="text-secondary/60 text-sm mb-1">
                Interactive heatmap visualization loading...
              </p>
              <p className="text-secondary/40 text-xs">
                Top Region: Gauteng, South Africa (42%)
              </p>
            </div>
          </div>
        </div>

        {/* Top Interests & Affiliations */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-5">
            Top Interests & Affiliations
          </h2>

          <div className="space-y-3.5">
            {interestsData.map((interest) => (
              <div key={interest.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm">{interest.name}</span>
                  <span className="text-white text-sm font-bold">{interest.percent}%</span>
                </div>
                <div className="h-5 bg-secondary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${interest.percent}%`,
                      backgroundColor: valueToRedColor(interest.percent, maxInterestPercent),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Trending Categories */}
          <div className="mt-6 pt-4 border-t border-secondary/10">
            <p className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold mb-2.5">
              Trending Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trendingCategories.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-secondary/5 border border-secondary/10 rounded text-[10px] text-secondary/70 hover:text-white hover:border-secondary/20 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Device Breakdown + Platform Distribution ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Device Breakdown */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-6">
            Device Breakdown
          </h2>

          <div className="flex items-center justify-around">
            {/* Mobile */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <Smartphone size={28} className="text-red-400" />
              </div>
              <p className="text-3xl font-bold text-white font-jakarta">78%</p>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-1">Mobile</p>
            </div>

            {/* Divider */}
            <div className="w-px h-20 bg-secondary/10" />

            {/* Desktop */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <Monitor size={28} className="text-secondary" />
              </div>
              <p className="text-3xl font-bold text-white font-jakarta">22%</p>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-1">Desktop</p>
            </div>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-5">
            Platform Distribution
          </h2>

          {/* Table header */}
          <div className="flex items-center py-2 border-b border-secondary/10 mb-1">
            <span className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold flex-1">
              Platform
            </span>
            <span className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold w-20 text-right">
              Users
            </span>
            <span className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold w-20 text-right">
              Avg. Session
            </span>
            <span className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold w-16 text-right">
              Conversion
            </span>
          </div>

          <div className="space-y-0">
            {platformData.map((p, idx) => (
              <div
                key={p.platform}
                className={`flex items-center py-3 ${
                  idx < platformData.length - 1 ? "border-b border-secondary/5" : ""
                }`}
              >
                <span className="text-white text-sm flex-1">{p.platform}</span>
                <span className="text-white text-sm font-semibold w-20 text-right">
                  {p.users.toLocaleString()}
                </span>
                <span className="text-secondary text-xs w-20 text-right">
                  {p.avgSession}
                </span>
                <span
                  className={`text-sm font-bold w-16 text-right ${
                    p.conversion >= 10 ? "text-red-400" : "text-secondary"
                  }`}
                >
                  {p.conversion}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceInsights;
