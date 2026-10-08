import { useId, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiMaximize,
  FiTrendingDown,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { MdHourglassEmpty } from "react-icons/md";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
} from "recharts";



interface StatItem {
  id: string;
  label: string;
  value: string;
  cornerIcon: IconType;
  footer: { kind: "trend"; dir: "up" | "down"; text: string; tone: "green" | "secondary" } | { kind: "live"; text: string };
}

interface AgeRow {
  id: string;
  label: string;
  percent: number;
}

interface ClusterChip {
  id: string;
  label: string;
  tone: "hot" | "neutral" | "hot-outline";
}

interface GrowthPoint {
  tick: string;
  dau: number;
  mau: number;
}

interface FunnelStage {
  id: string;
  label: string;
  percent: number;
  display: string;
  drop: string | null;
  barClass: string;
}

interface CohortRow {
  id: string;
  cohort: string;
  size: string;
  weeks: (number | null)[];
}

interface MapMarker {
  id: string;
  x: string;
  y: string;
  size: number;
  tone: "secondary" | "primary";
}



const rangeSegments = [
  { id: "l30d", label: "L30D" },
  { id: "q3", label: "Q3 2023" },
  { id: "yearly", label: "Yearly" },
] as const;

type RangeId = (typeof rangeSegments)[number]["id"];

const statItems: StatItem[] = [
  {
    id: "users",
    label: "Total Users",
    value: "1,248,392",
    cornerIcon: FiUsers,
    footer: { kind: "trend", dir: "up", text: "+12.4% vs last month", tone: "green" },
  },
  {
    id: "signups",
    label: "New Signups (24h)",
    value: "14,802",
    cornerIcon: FiUserPlus,
    footer: { kind: "trend", dir: "up", text: "+5.2% vs yesterday", tone: "green" },
  },
  {
    id: "retention",
    label: "Avg. Retention Rate",
    value: "68.4%",
    cornerIcon: MdHourglassEmpty,
    footer: { kind: "trend", dir: "down", text: "-0.8% dropoff spike", tone: "secondary" },
  },
  {
    id: "sessions",
    label: "Active Sessions",
    value: "82,119",
    cornerIcon: FiZap,
    footer: { kind: "live", text: "Real-time throughput" },
  },
];

const mapMarkers: MapMarker[] = [
  { id: "eu", x: "33%", y: "40%", size: 9, tone: "secondary" },
  { id: "pac", x: "7%", y: "36%", size: 5, tone: "primary" },
];

const ageRows: AgeRow[] = [
  { id: "a1", label: "18-24", percent: 36 },
  { id: "a2", label: "25-34", percent: 48 },
  { id: "a3", label: "35-44", percent: 12 },
  { id: "a4", label: "45+", percent: 5 },
];

const clusterChips: ClusterChip[] = [
  { id: "c1", label: "E-Sports", tone: "hot" },
  { id: "c2", label: "VR/AR", tone: "neutral" },
  { id: "c3", label: "Live Concerts", tone: "hot" },
  { id: "c4", label: "Web3 Gaming", tone: "neutral" },
  { id: "c5", label: "Podcasting", tone: "neutral" },
  { id: "c6", label: "Digital Collectibles", tone: "hot-outline" },
];

const CLUSTER_CLASSES: Record<ClusterChip["tone"], string> = {
  hot: "bg-secondary/15 text-secondary",
  neutral: "bg-bgray/10 text-bgray/80",
  "hot-outline": "border border-secondary/40 bg-secondary/15 text-secondary",
};

const growthSeries: GrowthPoint[] = [
  { tick: "AUG 01", dau: 18, mau: 26 },
  { tick: "AUG 07", dau: 23, mau: 32 },
  { tick: "AUG 14", dau: 22, mau: 30 },
  { tick: "AUG 21", dau: 49, mau: 58 },
  { tick: "AUG 28", dau: 26, mau: 35 },
  { tick: "TODAY", dau: 57, mau: 68 },
];

const funnelStages: FunnelStage[] = [
  { id: "f1", label: "Landing Page", percent: 100, display: "100% (1.4M)", drop: null, barClass: "bg-report-alert" },
  { id: "f2", label: "Account Created", percent: 80, display: "62%", drop: "38% DROP", barClass: "bg-analytics-heat-high" },
  { id: "f3", label: "Profile Setup", percent: 60, display: "48%", drop: "14% DROP", barClass: "bg-analytics-heat-high/80" },
  { id: "f4", label: "First Action", percent: 45, display: "34%", drop: "14% DROP", barClass: "bg-analytics-heat-mid" },
];

const cohortRows: CohortRow[] = [
  { id: "r1", cohort: "Aug 21 - Aug 27", size: "14,201", weeks: [92, 78, 64, 51, 42, 31, 22, 18] },
  { id: "r2", cohort: "Aug 14 - Aug 20", size: "12,890", weeks: [88, 72, 58, 44, 32, 21, 14, null] },
  { id: "r3", cohort: "Aug 07 - Aug 13", size: "11,402", weeks: [94, 81, 69, 54, 36, 24, null, null] },
];

const heatClass = (value: number | null): string => {
  if (value === null) return "bg-bgray/5 text-bgray/50";
  if (value >= 80) return "bg-secondary text-grayblue font-normal";
  if (value >= 60) return "bg-secondary/70 text-grayblue";
  if (value >= 45) return "bg-secondary/50 text-bgray";
  if (value >= 35) return "bg-secondary/35 text-secondary";
  if (value >= 20) return "bg-secondary/15 text-bgray/80";
  return "bg-bgray/10 text-bgray/70";
};

const retentionLegend = [
  { id: "l1", label: "< 20%", swatch: "bg-primary/20" },
  { id: "l2", label: "40%", swatch: "bg-primary/60" },
  { id: "l3", label: "> 80%", swatch: "bg-primary" },
];




const continentPaths = [
  "M28 100L48 83 73 81 85 65 111 61 124 51 151 54 166 68 184 66 197 82 180 98 169 112 160 128 147 139 137 159 126 168 118 191 106 188 98 166 83 158 73 145 64 127 48 121 36 111Z",
  "M111 183L126 188 134 201 150 204 166 219 183 223 188 242 175 261 169 283 156 298 151 320 137 341 128 326 126 304 117 284 112 259 103 243 102 223 109 210Z",
  "M193 35L219 26 241 35 230 57 213 75 197 67 187 50Z",
  "M273 100L282 85 297 78 301 61 314 51 323 61 313 82 324 96 343 99 350 116 334 128 324 124 319 137 302 132 287 125 274 127 266 113Z",
  "M275 139L295 135 315 143 331 145 341 163 351 179 342 192 339 215 326 236 312 258 300 256 293 234 281 220 281 196 263 184 255 166 263 148Z",
  "M331 85L351 66 381 62 404 48 433 56 458 53 488 68 523 70 553 87 545 104 523 113 516 133 499 139 495 157 478 164 469 183 452 168 439 170 432 196 420 212 409 194 405 176 387 169 371 153 351 148 341 129 348 111Z",
  "M352 153L371 161 383 181 372 194 360 189 350 173Z",
  "M451 194L462 202 471 220 486 232 481 243 468 235 455 220Z",
  "M470 249L491 235 517 237 538 257 540 281 522 291 506 284 489 292 468 281 461 264Z",
  "M552 289L560 282 562 298 550 315 543 311Z",
  "M346 238L352 232 355 250 349 264 343 258Z",
  "M506 144L514 131 520 137 514 151 508 159Z",
];

function UserDistributionMap() {
  const clipId = useId();
  return (
    <svg viewBox="0 0 580 360" className="h-full w-full bg-grayblue" role="img" aria-label="Illustrative global user distribution map">
      <defs>
        <clipPath id={clipId}>
          {continentPaths.map((d, i) => <path key={i} d={d} />)}
        </clipPath>
      </defs>
      <g className="fill-report-head stroke-report-blue/20" strokeWidth="0.6">
        {continentPaths.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g clipPath={`url(#${clipId})`}>
        {Array.from({ length: 2600 }, (_, i) => {
          const x = (i * 7919) % 577;
          const y = (i * 3571) % 353;
          const density = Math.exp(-((x - 112) ** 2 + (y - 130) ** 2) / 1900)
            + Math.exp(-((x - 299) ** 2 + (y - 117) ** 2) / 1200)
            + Math.exp(-((x - 457) ** 2 + (y - 155) ** 2) / 2600);
          return <circle key={i} cx={x} cy={y} r={density > 0.3 ? 1 : 0.6} className="fill-primary" opacity={Math.min(0.85, 0.18 + density)} />;
        })}
      </g>
    </svg>
  );
}

const UserAnalyticsPage = () => {
  const [range, setRange] = useState<RangeId>("l30d");
  const gradientId = useId();
  const [mapExpanded, setMapExpanded] = useState(false);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">

        <header className="admin-page-heading">
          <div>
            <h1 className="admin-page-title">
              User Analytics
            </h1>
            <p className="admin-page-description">
              Global platform growth and behavioral demographics
            </p>
          </div>
          <div className="flex w-fit rounded-md bg-bgray/10 p-1">
            {rangeSegments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                onClick={() => setRange(segment.id)}
                aria-pressed={range === segment.id}
                className={`rounded-sm px-4 py-1 text-xs font-normal transition ${
                  range === segment.id
                    ? "bg-primary text-bgray"
                    : "text-bgray/80 hover:text-bgray"
                }`}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </header>


        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map((item) => {
            const CornerIcon = item.cornerIcon;
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-md bg-report-head p-4"
              >
                <p className="text-xs font-normal uppercase tracking-wider text-secondary">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-normal tracking-tight text-bgray">
                  {item.value}
                </p>
                <p
                  className={`mt-3 flex items-center gap-1.5 text-xs font-normal ${
                    item.footer.kind === "live"
                      ? "text-secondary"
                      : item.footer.tone === "green"
                        ? "text-green"
                        : "text-secondary"
                  }`}
                >
                  {item.footer.kind === "trend" &&
                    (item.footer.dir === "up" ? (
                      <FiTrendingUp size={11} />
                    ) : (
                      <FiTrendingDown size={11} />
                    ))}
                  {item.footer.kind === "live" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                  )}
                  {item.footer.text}
                </p>
                <CornerIcon
                  size={44}
                  className="absolute -bottom-2 -right-1 text-bgray/10"
                />
              </div>
            );
          })}
        </section>


        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">

          <div className={`overflow-hidden rounded-md bg-report-head ${mapExpanded ? "lg:col-span-3" : "lg:col-span-2"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
              <h2 className="admin-section-title">
                Global User Distribution
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                  High Density
                </span>
                <button
                  type="button"
                  aria-label={mapExpanded ? "Collapse map" : "Expand map"}
                  aria-expanded={mapExpanded}
                  onClick={() => setMapExpanded(!mapExpanded)}
                  className="rounded p-1 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray"
                >
                  <FiMaximize size={13} />
                </button>
              </div>
            </div>

            <div className={`relative bg-grayblue ${mapExpanded ? "h-[560px]" : "h-[390px]"}`}>
              <UserDistributionMap />
              {mapMarkers.map((marker) => (
                <span
                  key={marker.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    marker.tone === "secondary"
                      ? "bg-secondary shadow-lg shadow-secondary/50"
                      : "bg-primary shadow-lg shadow-primary/50"
                  }`}
                  style={{ left: marker.x, top: marker.y, width: marker.size, height: marker.size }}
                />
              ))}
            </div>
          </div>

          <div className={mapExpanded ? "grid gap-4 sm:grid-cols-2 lg:col-span-3" : "space-y-4"}>

            <div className="rounded-md bg-report-head p-5">
              <h2 className="admin-section-title">
                Age Breakdown
              </h2>
              <ul className="mt-4 space-y-3">
                {ageRows.map((row) => (
                  <li key={row.id} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-xs text-secondary/70">
                      {row.label}
                    </span>
                    <div className="relative h-7 flex-1 bg-report-control">
                      <div
                        className="h-full bg-report-alert"
                        style={{ width: `${row.percent}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-normal text-bgray">
                        {row.percent}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>


            <div className="rounded-md bg-report-head p-5">
              <h2 className="admin-section-title">
                Interest Clusters
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {clusterChips.map((chip) => (
                  <span
                    key={chip.id}
                    className={`rounded-full border border-secondary/10 px-2.5 py-1 text-xs font-normal uppercase tracking-wide ${CLUSTER_CLASSES[chip.tone]}`}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">

          <div className="rounded-md bg-report-head p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="admin-section-title">
                  User Growth Trends
                </h2>
                <p className="mt-1 text-xs text-secondary/70">DAU/MAU ratio: 42.8%</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                  DAU
                </span>
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-bgray/50" aria-hidden="true" />
                  MAU
                </span>
              </div>
            </div>
            <div className="mt-6 h-64 text-report-alert">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={growthSeries} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="tick"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 11, className: "fill-secondary/70" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="dau"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    fill={`url(#${gradientId})`}
                  />
                  <Line
                    type="monotone"
                    dataKey="mau"
                    strokeDasharray="4 4"
                    strokeWidth={1.2}
                    dot={false}
                    stroke="currentColor" className="text-analytics-neutral"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="rounded-md bg-report-head p-5">
            <h2 className="admin-section-title">
              Onboarding Funnel Drops
            </h2>
            <ul className="mt-6 space-y-4">
              {funnelStages.map((stage, index) => (
                <li key={stage.id} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-bgray/80">{stage.label}</span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`flex h-9 items-center rounded-sm px-2 ${stage.barClass}`}
                      style={{ width: `${stage.percent}%` }}
                    >
                      <span className="whitespace-nowrap text-xs font-normal text-grayblue">{stage.display}</span>
                    </div>
                    {index < funnelStages.length - 1 && (
                      <div
                        className="mt-1 h-1.5 rounded-full bg-primary/20"
                        style={{ width: `${funnelStages[index + 1].percent}%` }}
                      />
                    )}
                  </div>
                  <span className="w-14 shrink-0 text-xs font-normal leading-tight text-secondary">
                    {stage.drop ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>


        <section className="mt-4 overflow-hidden rounded-md bg-report-head">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
            <h2 className="admin-section-title">
              Retention Cohorts (Weekly)
            </h2>
            <div className="flex items-center gap-3">
              {retentionLegend.map((item) => (
                <span key={item.id} className="flex items-center gap-1.5 text-xs text-secondary/70">
                  <span className={`h-2.5 w-2.5 rounded-sm ${item.swatch}`} aria-hidden="true" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="bg-bgray/5">
                  <th className="w-[22%] px-5 py-3 text-xs font-normal uppercase tracking-wider text-bgray/70">
                    Cohort
                  </th>
                  <th className="w-[14%] px-4 py-3 text-xs font-normal uppercase tracking-wider text-bgray/70">
                    Size
                  </th>
                  {Array.from({ length: 8 }, (_, i) => (
                    <th
                      key={i}
                      className="w-[8%] px-1 py-3 text-center text-xs font-normal uppercase tracking-wider text-bgray/70"
                    >
                      W{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-3 text-xs text-bgray/90">{row.cohort}</td>
                    <td className="px-4 py-3 text-xs text-bgray/80">{row.size}</td>
                    {row.weeks.map((value, i) => (
                      <td
                        key={i}
                        className={`px-1 py-3.5 text-center text-xs ${heatClass(value)}`}
                      >
                        {value === null ? "-" : `${value}%`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserAnalyticsPage;
