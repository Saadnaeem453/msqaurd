import { useEffect, useMemo, useState } from "react";
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
import { organizerAudienceApi, AudienceInsights as AudienceInsightsData } from "../../../services/organizer_audience.service";



/**
 * Returns a red color that gets brighter as value increases.
 * 0% → very dark red (#450a0a), 100% → bright red (#ef4444)
 */
function valueToRedColor(percent: number, maxPercent: number): string {
  const ratio = Math.min(percent / maxPercent, 1);

  const r = Math.round(69 + (239 - 69) * ratio);
  const g = Math.round(10 + (68 - 10) * ratio);
  const b = Math.round(10 + (68 - 10) * ratio);
  return `rgb(${r},${g},${b})`;
}



const AudienceInsights = () => {
  const [ageRangeFilter, setAgeRangeFilter] = useState("Last 30 Days");
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [data, setData] = useState<AudienceInsightsData | null>(null);

  const ageRangeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];
  const periodKey = ({ "Last 7 Days": "7d", "Last 30 Days": "30d", "Last 90 Days": "90d", "This Year": "1y" } as Record<string, string>)[ageRangeFilter] || "30d";

  useEffect(() => {
    let active = true;
    setData(null);
    organizerAudienceApi.get(periodKey).then((response) => {
      if (!active) return;
      if (response.ok && response.data) setData(response.data);
    });
    return () => { active = false; };
  }, [periodKey]);

  const ageDistributionData = data?.age_distribution || [];
  const maxAgeCount = Math.max(...ageDistributionData.map((entry) => entry.count), 1);
  const genderData = data?.gender_split || [];
  const interestsData = data?.top_interests || [];
  const maxInterestPercent = Math.max(...interestsData.map((entry) => entry.percent), 1);
  const platformData = data?.platform_distribution || [];
  const trendingCategories = data?.trending_categories || [];
  const deviceData = useMemo(() => Object.fromEntries((data?.device_breakdown || []).map((entry) => [entry.device_type, entry])), [data]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-6">

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


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

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
          <p className="text-white text-3xl font-bold font-jakarta">{data?.summary.total_unique_attendees.toLocaleString() || "—"}</p>
          <p className="text-secondary/40 text-xs mt-2">{data?.summary.previous_period_unique_attendees ? `vs. ${data.summary.previous_period_unique_attendees.toLocaleString()} previous period` : "No previous-period data"}</p>
        </div>


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
            {data?.summary.new_attendee_percent ?? "—"}% <span className="text-base font-normal text-secondary/50">new</span>
          </p>
          <div className="mt-3 h-2 bg-secondary/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${data?.summary.new_attendee_percent || 0}%` }} />
          </div>
        </div>


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
            {data?.summary.engagement_score ?? "—"}<span className="text-base font-normal text-secondary/40">{data?.summary.engagement_score == null ? "" : "/10"}</span>
          </p>

          <div className="flex items-end gap-1 mt-3 h-8">
            {(data?.summary.engagement_score == null ? [] : [35, 45, 55, 40, 65, 70, 84]).map((val, i) => (
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


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

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

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-red-500/5 blur-3xl" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute opacity-30" />
              <div className="w-3 h-3 rounded-full bg-red-500 relative" />
            </div>

            <div className="relative text-center z-10">
              <p className="text-secondary/60 text-sm mb-1">
                {data?.attendee_origin.length ? "Attendee origin by profile country" : "No origin data available"}
              </p>
              <p className="text-secondary/40 text-xs">
                {data?.attendee_origin[0] ? `Top Region: ${data.attendee_origin[0].name} (${data.attendee_origin[0].percent}%)` : "Complete attendee profiles to see origin data"}
              </p>
            </div>
          </div>
        </div>


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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-6">
            Device Breakdown
          </h2>

          <div className="flex items-center justify-around">

            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <Smartphone size={28} className="text-red-400" />
              </div>
              <p className="text-3xl font-bold text-white font-jakarta">{deviceData.mobile?.percentage ?? 0}%</p>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-1">Mobile</p>
            </div>


            <div className="w-px h-20 bg-secondary/10" />


            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <Monitor size={28} className="text-secondary" />
              </div>
              <p className="text-3xl font-bold text-white font-jakarta">{deviceData.desktop?.percentage ?? 0}%</p>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-1">Desktop</p>
            </div>
          </div>
        </div>


        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-5">
            Platform Distribution
          </h2>


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
                  {p.avgSession || "—"}
                </span>
                <span
                  className={`text-sm font-bold w-16 text-right ${
                    p.conversion !== null && p.conversion >= 10 ? "text-red-400" : "text-secondary"
                  }`}
                >
                  {p.conversion === null ? "—" : `${p.conversion}%`}
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
