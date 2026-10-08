import { useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FiChevronRight,
  FiCompass,
  FiDownload,
  FiGlobe,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
} from "recharts";



interface MomentumPoint {
  month: string;
  spike: number;
  events: number;
  users: number;
  revenue: number;
}

interface RegionTarget {
  id: string;
  icon: IconType;
  name: string;
  percent: number;
  suffix: string;
}

interface ForecastStat {
  id: string;
  label: string;
  value: string;
  tone: "secondary" | "bgray";
  align: "left" | "right";
}



const rangeSegments = [
  { id: "12m", label: "12 Months" },
  { id: "3m", label: "3 Months" },
  { id: "30d", label: "30 Days" },
] as const;

type RangeId = (typeof rangeSegments)[number]["id"];

const momentumSeries: MomentumPoint[] = [
  { month: "JAN", spike: 72, events: 29, users: 0, revenue: 0 },
  { month: "FEB", spike: 0, events: 0, users: 8, revenue: 3 },
  { month: "MAR", spike: 72, events: 32, users: 13, revenue: 11 },
  { month: "APR", spike: 0, events: 0, users: 22, revenue: 17 },
  { month: "MAY", spike: 72, events: 30, users: 38, revenue: 22 },
  { month: "JUN", spike: 0, events: 0, users: 46, revenue: 22 },
  { month: "JUL", spike: 72, events: 41, users: 53, revenue: 21 },
  { month: "AUG", spike: 0, events: 0, users: 65, revenue: 25 },
  { month: "SEP", spike: 72, events: 46, users: 66, revenue: 33 },
  { month: "OCT", spike: 0, events: 0, users: 66, revenue: 42 },
  { month: "NOV", spike: 72, events: 51, users: 75, revenue: 52 },
  { month: "DEC", spike: 72, events: 60, users: 80, revenue: 59 },
];

const momentumLegend = [
  { id: "users", label: "Users", dot: "bg-secondary" },
  { id: "events", label: "Events", dot: "bg-bgray/60" },
  { id: "revenue", label: "Revenue", dot: "bg-bgray/40" },
];

const regionTargets: RegionTarget[] = [
  {
    id: "na",
    icon: FiGlobe,
    name: "North America (Primary)",
    percent: 92,
    suffix: "Saturated",
  },
  {
    id: "sea",
    icon: FiCompass,
    name: "South East Asia (Targeting)",
    percent: 14,
    suffix: "Market Share",
  },
  {
    id: "we",
    icon: FiGlobe,
    name: "Western Europe (Emerging)",
    percent: 38,
    suffix: "Market Share",
  },
];

const forecastStats: ForecastStat[] = [
  { id: "rev", label: "Q4 Project Rev", value: "$4.2M - $4.8M", tone: "secondary", align: "left" },
  { id: "confidence", label: "Confidence", value: "94%", tone: "bgray", align: "right" },
  { id: "cap", label: "Est. User Cap", value: "1.8M Active", tone: "bgray", align: "left" },
  { id: "timeframe", label: "Timeframe", value: "180 Days", tone: "bgray", align: "right" },
];

const recommendation =
  "“Current momentum suggests early saturation in urban hubs. Divert 15% of marketing yield to suburban tier-2 markets to sustain the 1.2x viral coefficient.”";



const GrowthTrendsPage = () => {
  const [range, setRange] = useState<RangeId>("12m");
  const visibleSeries = range === "12m" ? momentumSeries : momentumSeries.slice(range === "3m" ? -3 : -1);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">

        <nav className="flex items-center gap-2 text-xs">
          <Link to="/admin/analytics/users" className="text-secondary transition hover:text-bgray">
            Analytics
          </Link>
          <FiChevronRight size={11} className="text-secondary/70" />
          <span className="font-normal text-secondary">Growth Trends</span>
        </nav>


        <header className="admin-page-heading mt-2">
          <h1 className="admin-page-title">
            Growth &amp; Strategic Expansion
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md bg-bgray/10 p-1">
              {rangeSegments.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => setRange(segment.id)}
                  aria-pressed={range === segment.id}
                  className={`rounded-sm px-4 py-1.5 text-xs font-normal transition ${
                    range === segment.id
                      ? "bg-primary text-bgray"
                      : "text-bgray/80 hover:text-bgray"
                  }`}
                >
                  {segment.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-sm border border-bgray/5 px-4 py-2 text-xs font-normal text-bgray transition hover:bg-bgray/10 print:hidden"
            >
              <FiDownload size={13} />
              Export PDF
            </button>
          </div>
        </header>


        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[2.08fr_1fr]">

          <div className="rounded-md border border-bgray/5 bg-report-head p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="admin-section-title">
                  Momentum Performance
                </h2>
                <p className="mt-1 max-w-[240px] text-xs leading-snug text-secondary/80">
                  Correlation between user acquisition, events, and yield
                </p>
              </div>
              <div className="flex items-center gap-3">
                {momentumLegend.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center gap-1.5 text-xs text-bgray/80"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} aria-hidden="true" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 h-[330px] text-secondary/70">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={visibleSeries}
                  barCategoryGap="35%"
                  barGap={-6}
                  margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={8}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                  />

                  <Bar dataKey="spike" barSize={2} fill="currentColor" className="text-secondary/10" />
                  <Bar dataKey="events" barSize={8} fill="currentColor" className="text-secondary/15" />
                  <Line
                    type="monotone"
                    dataKey="users"
                    dot={false}
                    strokeWidth={1.5}
                    stroke="currentColor" className="text-secondary/25"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    dot={false}
                    strokeWidth={1.2}
                    strokeDasharray="4 4"
                    stroke="currentColor" className="text-bgray/25"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="flex flex-col gap-5">
            <div className="rounded-md border border-bgray/5 bg-report-head p-5">
              <p className="text-xs font-normal uppercase tracking-widest text-secondary">
                Market Sentiment
              </p>
              <div className="mx-auto mt-4 flex h-36 w-36 flex-col items-center justify-center rounded-xl border-8 border-bgray/[0.02]">
                <span className="text-3xl font-normal text-bgray">8.4</span>
                <span className="mt-1 text-xs font-normal uppercase tracking-wider text-secondary">
                  Bullish
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between">
                <div className="text-center">
                  <p className="text-xs text-bgray/80">Social Buzz</p>
                  <p className="mt-1 text-xs font-normal text-green">+22%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-bgray/80">Press Weight</p>
                  <p className="mt-1 text-xs text-bgray/80">High</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-primary p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-normal uppercase tracking-widest text-bgray">
                  Viral Coefficient
                </p>
                <FiTrendingUp size={16} className="text-bgray" />
              </div>
              <p className="mt-1 text-3xl font-normal text-bgray">
                1.24<span className="text-lg font-normal text-bgray/80">k</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-bgray">
                Critical threshold reached. Organic loops generating 42% of new traffic.
              </p>
            </div>
          </div>
        </section>


        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.42fr_1fr]">

          <div className="rounded-md border border-bgray/5 bg-report-head p-5 lg:min-h-[320px]">
            <h2 className="admin-section-title">
              Regional Expansion Targets
            </h2>
            <ul className="mt-5 space-y-3">
              {regionTargets.map((region) => {
                const RegionIcon = region.icon;
                return (
                  <li key={region.id} className="rounded-sm bg-lightgrayblue/60 p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bgray/10 text-secondary">
                        <RegionIcon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                          <span className="text-sm font-normal text-bgray">
                            {region.name}
                          </span>
                          <span className="shrink-0 text-xs">
                            <span className="font-normal text-bgray">{region.percent}%</span>{" "}
                            <span className="text-secondary">{region.suffix}</span>
                          </span>
                        </div>
                        <div className="mt-2 h-1 w-full rounded-full bg-bgray/15">
                          <div
                            className="h-full rounded-full bg-report-alert"
                            style={{ width: `${region.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>


          <div className="rounded-md border border-bgray/5 bg-report-head p-5">
            <h2 className="admin-section-title">
              Growth Forecasting
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Predictive AI-modeling based on current trajectory
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
              {forecastStats.map((stat) => (
                <div key={stat.id} className={stat.align === "right" ? "text-right" : ""}>
                  <p className="text-xs text-bgray/80">{stat.label}</p>
                  <p
                    className={`mt-1 text-xs font-normal ${
                      stat.tone === "secondary" ? "text-secondary" : "text-bgray/90"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="flex items-center gap-2 text-xs font-normal uppercase tracking-widest text-secondary">
                <FiZap size={13} />
                Strategic Recommendation
              </p>
              <p className="mt-3 text-sm italic leading-relaxed text-bgray">
                {recommendation}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GrowthTrendsPage;
