import { Calendar, Download, TrendingUp, Activity, Users } from "lucide-react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Chart Data ──────────────────────────────────────────────────────────────

const revenueAcquisitionData = [
  { year: "2022", revenue: 1.2, acquisition: 0.8 },
  { year: "2022 H2", revenue: 1.8, acquisition: 1.1 },
  { year: "2023", revenue: 2.4, acquisition: 1.5 },
  { year: "2023 H2", revenue: 3.1, acquisition: 1.9 },
  { year: "2024", revenue: 3.8, acquisition: 2.2 },
  { year: "2024 H2", revenue: 4.2, acquisition: 2.6 },
];

const marketShareData = [
  { name: "Islamic Talks", value: 45, color: "#e50a15" },
  { name: "Community Festivals", value: 25, color: "#f0a0a5" },
  { name: "Youth Summits", value: 20, color: "#4a4a5a" },
  { name: "Other", value: 10, color: "#2a2a35" },
];

// ─── Table Data ──────────────────────────────────────────────────────────────

const orgTypeData = [
  { type: "Masjids", vol: "1,240", revenue: "$12,400", health: "STABLE", healthColor: "bg-green-500/15 text-green-400 border border-green-500/30" },
  { type: "ISOCs", vol: "842", revenue: "$4,200", health: "HIGH GROWTH", healthColor: "bg-green-500/15 text-green-400 border border-green-500/30" },
  { type: "Professional Organizers", vol: "320", revenue: "$48,900", health: "PREMIUM", healthColor: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  { type: "Charity Trusts", vol: "80", revenue: "$15,200", health: "VOLATILE", healthColor: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" },
];

// ─── Cohort Data ─────────────────────────────────────────────────────────────

const cohortData = [
  { cohort: "Jan 24", M1: 98, M2: 82, M3: 71, M4: 64, M5: 59, M6: 52 },
  { cohort: "Feb 24", M1: 96, M2: 78, M3: 66, M4: 59, M5: 51, M6: null },
  { cohort: "Mar 24", M1: 99, M2: 84, M3: 76, M4: 68, M5: null, M6: null },
  { cohort: "Apr 24", M1: 97, M2: 74, M3: 61, M4: null, M5: null, M6: null },
];

const getCellBg = (value: number | null): string => {
  if (value === null) return "bg-[#1e2028]";
  if (value >= 90) return "bg-[#e50a15]";
  if (value >= 80) return "bg-[#c21020]";
  if (value >= 70) return "bg-[#9a1020]";
  if (value >= 60) return "bg-[#6a1020]";
  return "bg-[#3a1020]";
};

// ─ Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  change,
  changeColor,
  progressColor,
  progressWidth,
  description,
}: {
  label: string;
  value: string;
  change: string;
  changeColor: string;
  progressColor: string;
  progressWidth: number;
  description: string;
}) => (
  <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl p-5">
    <p className="text-secondary/40 text-[9px] uppercase tracking-[0.15em] font-semibold mb-2">
      {label}
    </p>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-gray-200 font-jakarta">{value}</span>
      <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
    </div>
    <div className="mt-3 h-1 rounded-full bg-secondary/10 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${progressWidth}%`, backgroundColor: progressColor }}
      />
    </div>
    <p className="text-secondary/30 text-[10px] mt-2">{description}</p>
  </div>
);

// ── Main Page ───────────────────────────────────────────────────────────────

const PlatformMetrics = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* ─ Header ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-xl md:text-2xl font-bold text-gray-200">
            Platform Metrics
          </h1>
          <p className="text-secondary/60 text-sm mt-1">
            Historical performance and comparative ecosystem analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1b20] border border-secondary/15 text-secondary/70 hover:text-gray-200 rounded-lg text-xs font-medium transition-colors">
            <Calendar size={14} />
            Last 3 Years
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-gray-100 rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue Growth"
          value="$4.2M"
          change="+24.8%"
          changeColor="text-greenish"
          progressColor="#e9bcb6"
          progressWidth={78}
          description="vs. Fiscal Year 2023"
        />
        <StatCard
          label="Active Users (MAU)"
          value="128.5k"
          change="+12.4%"
          changeColor="text-greenish"
          progressColor="#e9bcb6"
          progressWidth={65}
          description="Avg. growth per quarter"
        />
        <StatCard
          label="Event Success Rate"
          value="94.2%"
          change="-0.5%"
          changeColor="text-red-400"
          progressColor="#22c55e"
          progressWidth={94}
          description="Based on attendance vs. capacity"
        />
        <StatCard
          label="Platform LTV"
          value="$842"
          change="+8.1%"
          changeColor="text-greenish"
          progressColor="#e9bcb6"
          progressWidth={55}
          description="Customer Lifetime Value avg."
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue & Acquisition Trends */}
        <div className="lg:col-span-3 bg-[#1a1b20] border border-secondary/10 rounded-xl p-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-gray-200 text-sm font-bold font-jakarta">
                Revenue & Acquisition Trends
              </h3>
              <p className="text-secondary/50 text-xs mt-1">
                Correlation between marketing spend and platform revenue (2022-2024)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary/70" />
                <span className="text-secondary/60 text-[10px]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary/40" />
                <span className="text-secondary/60 text-[10px]">Acquisition</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueAcquisitionData}>
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                {/* Acquisition bars — dim secondary */}
                <Bar dataKey="acquisition" fill="rgba(233,188,182,0.15)" radius={[2, 2, 0, 0]} barSize={28} />
                {/* Revenue bars — mid secondary */}
                <Bar dataKey="revenue" fill="rgba(233,188,182,0.35)" radius={[2, 2, 0, 0]} barSize={28} />
                {/* Revenue line — solid secondary */}
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e9bcb6"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Share */}
        <div className="lg:col-span-2 bg-[#1a1b20] border border-secondary/10 rounded-xl p-5">
          <h3 className="text-gray-200 text-sm font-bold font-jakarta">
            Market Share
          </h3>
          <p className="text-secondary/50 text-xs mt-1">
            Event volume by category
          </p>

          {/* Donut Chart */}
          <div className="relative h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-gray-200 text-lg font-bold font-jakarta">2,482</p>
                <p className="text-secondary/40 text-[9px] uppercase tracking-wider">Total Events</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {marketShareData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-secondary/70 text-xs">{item.name}</span>
                </div>
                <span className="text-gray-300 text-xs font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table + Cohorts Row ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance by Organization Type */}
        <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl p-5">
          <h3 className="text-gray-200 text-sm font-bold font-jakarta">
            Performance by Organization Type
          </h3>
          <p className="text-secondary/50 text-xs mt-1">
            Comparative efficiency across the ecosystem
          </p>

          <table className="w-full mt-6">
            <thead>
              <tr className="border-b border-secondary/10">
                <th className="text-secondary/40 text-[9px] uppercase tracking-wider font-medium text-left pb-2.5">
                  Org Type
                </th>
                <th className="text-secondary/40 text-[9px] uppercase tracking-wider font-medium text-right pb-2.5">
                  Event Vol.
                </th>
                <th className="text-secondary/40 text-[9px] uppercase tracking-wider font-medium text-right pb-2.5">
                  Avg. Revenue
                </th>
                <th className="text-secondary/40 text-[9px] uppercase tracking-wider font-medium text-right pb-2.5">
                  Health
                </th>
              </tr>
            </thead>
            <tbody>
              {orgTypeData.map((row) => (
                <tr key={row.type} className="border-b border-secondary/5 last:border-0">
                  <td className="py-3 text-gray-300 text-xs font-medium">{row.type}</td>
                  <td className="py-3 text-right text-secondary/70 text-xs">{row.vol}</td>
                  <td className="py-3 text-right text-gray-200 text-xs font-medium">{row.revenue}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${row.healthColor}`}>
                      {row.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Retention Cohorts */}
        <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-gray-200 text-sm font-bold font-jakarta">
              Retention Cohorts
            </h3>
            {/* Color legend */}
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#e50a15]" />
              <span className="w-3 h-3 rounded-sm bg-[#c21020]" />
              <span className="w-3 h-3 rounded-sm bg-[#6a1020]" />
              <span className="w-3 h-3 rounded-sm bg-[#2a2a35]" />
            </div>
          </div>
          <p className="text-secondary/60 text-xs mt-1">
            Active users by onboarding month
          </p>

          {/* Cohort grid */}
          <div className="mt-5">
            {/* Header row */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-16 shrink-0" />
              {["M1", "M2", "M3", "M4", "M5", "M6"].map((m) => (
                <div key={m} className="flex-1 text-center">
                  <span className="text-secondary/50 text-[9px] uppercase tracking-wider">
                    {m}
                  </span>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {cohortData.map((row) => (
              <div key={row.cohort} className="flex items-center gap-1.5 mb-1.5">
                {/* Row label */}
                <div className="w-16 shrink-0 bg-[#1e2028] rounded-md py-1.5 flex items-center justify-center">
                  <span className="text-gray-400 text-[10px] font-medium">{row.cohort}</span>
                </div>
                {/* Cells */}
                {[row.M1, row.M2, row.M3, row.M4, row.M5, row.M6].map((val, i) => (
                  <div key={i} className="flex-1 flex justify-center">
                    {val !== null ? (
                      <div
                        className={`w-full rounded-md py-1.5 flex items-center justify-center ${getCellBg(val)}`}
                      >
                        <span className="text-gray-100 text-[10px] font-bold">{val}%</span>
                      </div>
                    ) : (
                      <div className="w-full h-7 rounded-md bg-[#1e2028]" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ecosystem Resilience Analysis ─────────────────── */}
      <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl p-5">
        <h3 className="text-gray-200 text-sm font-bold font-jakarta mb-2">
          Ecosystem Resilience Analysis
        </h3>
        <p className="text-secondary/50 text-xs mb-6 max-w-xl">
          Organizers onboarding through ISOC pathways show a 2.4x higher platform lifetime compared to direct masjid sign-ups, primarily driven by higher peer-to-peer engagement tools usage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Two image cards */}
          <div className="relative h-32 rounded-lg overflow-hidden bg-[#0f1923]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-bold mb-1">Telemetry Focus</p>
                <p className="text-gray-200 text-sm font-bold font-jakarta">Network Effect Density</p>
              </div>
            </div>
          </div>
          <div className="relative h-32 rounded-lg overflow-hidden bg-[#0f1923]">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-secondary/60 text-[8px] uppercase tracking-[0.2em] font-bold mb-1">Retention Core</p>
                <p className="text-gray-200 text-sm font-bold font-jakarta">Cohort Aging Velocity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Stat callouts */}
          <div className="bg-[#0f1420] border border-secondary/10 rounded-lg p-4">
            <TrendingUp size={16} className="text-secondary/40 mb-2" />
            <p className="text-gray-200 text-lg font-bold font-jakarta">18.2 months</p>
            <p className="text-secondary/50 text-[10px] mt-1">
              Organizers stay active for an average of 18.2 months.
            </p>
          </div>
          <div className="bg-[#0f1420] border border-secondary/10 rounded-lg p-4">
            <Activity size={16} className="text-secondary/40 mb-2" />
            <p className="text-gray-200 text-lg font-bold font-jakarta">15% YoY</p>
            <p className="text-secondary/50 text-[10px] mt-1">
              Attendee repeat purchase rate up by 15% YoY.
            </p>
          </div>
          <div className="bg-[#0f1420] border border-secondary/10 rounded-lg p-4">
            <Users size={16} className="text-secondary/40 mb-2" />
            <p className="text-gray-200 text-lg font-bold font-jakarta">System Infrastructure Scalability</p>
            <p className="text-secondary/50 text-[10px] mt-1">
              Uptime maintained at 99.99% throughout peak festival seasons.
            </p>
          </div>
        </div>
      </div>

      {/* ─ Footer ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-secondary/10">
        <div className="flex items-center gap-6">
          <p className="text-secondary/30 text-[10px]">
            © 2024 MSQUARED ECOSYSTEM
          </p>
          <p className="text-secondary/30 text-[10px] font-mono uppercase tracking-wider">
            Encrypted Connection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-secondary/30 hover:text-secondary/60 text-[10px] uppercase tracking-wider transition-colors">
            Documentation
          </a>
          <a href="#" className="text-secondary/30 hover:text-secondary/60 text-[10px] uppercase tracking-wider transition-colors">
            API Status
          </a>
          <a href="#" className="text-secondary/30 hover:text-secondary/60 text-[10px] uppercase tracking-wider transition-colors">
            Audit Logs
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlatformMetrics;
