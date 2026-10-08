import { useState } from "react";
import {
  Download,
  ChevronDown,
  Info,
  Cpu,
  Users,
  Megaphone,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";



const growthData = [
  { month: "JAN", revenue: 42000, tickets: 320 },
  { month: "FEB", revenue: 48000, tickets: 380 },
  { month: "MAR", revenue: 51000, tickets: 410 },
  { month: "APR", revenue: 55000, tickets: 450 },
  { month: "MAY", revenue: 62000, tickets: 520 },
  { month: "JUN", revenue: 68000, tickets: 580 },
  { month: "JUL", revenue: 74000, tickets: 640 },
  { month: "AUG", revenue: 81000, tickets: 710 },
  { month: "SEP", revenue: 88000, tickets: 780 },
  { month: "OCT", revenue: 96000, tickets: 860 },
  { month: "NOV", revenue: 105000, tickets: 940 },
  { month: "DEC", revenue: 115000, tickets: 1050 },
];



const heatmapData: Record<string, number[]> = {
  MOR: [2, 3, 4, 3, 5, 2, 1],
  AFT: [4, 5, 6, 5, 7, 4, 2],
  EVE: [6, 7, 8, 7, 9, 6, 3],
};

const trendingCategories = [
  { name: "Tech Networking", count: "32 Events this month", change: 40, icon: Cpu },
  { name: "Youth Creative", count: "18 Events this month", change: 12, icon: Users },
  { name: "Political Advocacy", count: "12 Events this month", change: -8, icon: Megaphone },
];

const timeLabels = ["M", "T", "W", "T", "F", "S", "S"];



function heatColor(value: number): string {

  const ratio = value / 10;
  const r = Math.round(40 + (239 - 40) * ratio);
  const g = Math.round(15 + (80 - 15) * ratio);
  const b = Math.round(15 + (80 - 15) * ratio);
  return `rgb(${r},${g},${b})`;
}



const TrendsPage = () => {
  const [timeRange, setTimeRange] = useState("Last 12 Months");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const timeRangeOptions = ["Last 3 Months", "Last 6 Months", "Last 12 Months", "Full Year 2024"];

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-6">

      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-[10px] uppercase tracking-[0.2em] font-bold">
            Live Market Analysis
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-jakarta text-3xl font-bold text-white">
              Macro Trends & Growth
            </h1>
            <p className="text-secondary text-sm mt-1.5">
              Real-time data synchronization across all community channels.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors">
              <Download size={14} /> Export PDF
            </button>
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-secondary/10 border border-secondary/15 text-white rounded-lg text-sm hover:bg-secondary/20 transition-colors"
              >
                {timeRange}
                <ChevronDown size={12} className="text-secondary" />
              </button>
              {showTimeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTimeDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
                    {timeRangeOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setTimeRange(opt);
                          setShowTimeDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary/10 ${
                          opt === timeRange
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
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-jakarta text-xl font-bold text-white">
                Growth Over Time
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-secondary text-[10px]">Revenue ($)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/40" />
                  <span className="text-secondary text-[10px]">Ticket Volume</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider">Avg. Monthly Growth</p>
              <p className="text-green-400 text-2xl font-bold font-jakarta flex items-center gap-1 justify-end">
                <TrendingUp size={18} /> +12.4%
              </p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={growthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={{ stroke: "#1f2937" }}
                  tickLine={false}
                  interval={1}
                />
                <YAxis yAxisId="revenue" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v / 1000}k`} />
                <YAxis yAxisId="tickets" orientation="right" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c22",
                    border: "1px solid #292a2b",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") return [`$${value.toLocaleString()}`, "Revenue"];
                    return [value.toLocaleString(), "Tickets"];
                  }}
                />
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#revenueGrad)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 1.5 }}
                />
                <Line
                  yAxisId="tickets"
                  type="monotone"
                  dataKey="tickets"
                  stroke="#4b5563"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="text-white text-sm font-bold uppercase tracking-wider">
              AI Prediction (Q4)
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-white font-jakarta">$1.2M</span>
              <span className="flex items-center gap-0.5 text-green-400 text-lg font-bold mb-1">
                <TrendingUp size={16} /> +22%
              </span>
            </div>
          </div>

          <p className="text-secondary/60 text-sm leading-relaxed mb-6">
            Based on current retention trends and historical Q4 performance, we project a significant spike in tech networking events.
          </p>


          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs">Confidence Score</span>
              <span className="text-white text-xs font-bold">94.2%</span>
            </div>
            <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{ width: "94.2%" }}
              />
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="font-jakarta text-base font-bold text-white">Peak Launch Times</h2>
            <button className="text-secondary/40 hover:text-secondary transition-colors">
              <Info size={14} />
            </button>
          </div>


          <div className="mb-4">

            <div className="flex items-center gap-1 mb-1.5 ml-8">
              {timeLabels.map((day, i) => (
                <div key={i} className="w-8 text-center text-secondary/40 text-[9px] font-medium">
                  {day}
                </div>
              ))}
            </div>


            {Object.entries(heatmapData).map(([timeLabel, values]) => (
              <div key={timeLabel} className="flex items-center gap-1 mb-1">
                <div className="w-7 text-right text-secondary/40 text-[9px] font-medium mr-1">
                  {timeLabel}
                </div>
                {values.map((val, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-sm transition-all"
                    style={{
                      backgroundColor: heatColor(val),
                      opacity: 0.3 + (val / 10) * 0.7,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          <p className="text-secondary/50 text-xs leading-relaxed">
            <span className="text-white font-medium">Recommendation:</span> Wednesday Afternoon or Friday Evening for highest engagement.
          </p>
        </div>


        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-base font-bold text-white mb-5">
            Trending Categories
          </h2>

          <div className="space-y-3">
            {trendingCategories.map((cat) => {
              const Icon = cat.icon;
              const isPositive = cat.change > 0;
              return (
                <div
                  key={cat.name}
                  className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/5"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{cat.name}</p>
                    <p className="text-secondary/40 text-[10px]">{cat.count}</p>
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-sm font-bold flex-shrink-0 ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? "+" : ""}
                    {cat.change}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>


        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <p className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-semibold text-center mb-6">
            Market Standing
          </p>


          <div className="flex items-center justify-center mb-5">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="50"
                  strokeLinecap="round"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 0.82)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white font-jakarta">82%</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white text-sm font-bold">Top 18th Percentile</p>
            <p className="text-secondary/50 text-[10px] mt-1 leading-relaxed">
              You are performing better than 82% of similar-sized organizations in the "Education" sector.
            </p>
          </div>
        </div>
      </div>


      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-jakarta text-lg font-bold text-white mb-2">
              Retention & Loyalty
            </h2>
            <p className="text-secondary/60 text-sm leading-relaxed max-w-lg">
              Our community loyalty index tracks the frequency of repeat ticket purchases and engagement levels.
            </p>
          </div>

          <div className="flex items-center gap-6">

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-red-400 text-2xl font-bold font-jakarta">2.4%</span>
                <TrendingDown size={14} className="text-red-400" />
              </div>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-0.5">Churn Rate</p>
            </div>


            <div className="w-px h-12 bg-secondary/10" />


            <div className="text-right">
              <span className="text-white text-2xl font-bold font-jakarta">78</span>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-0.5">Net Promoter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
