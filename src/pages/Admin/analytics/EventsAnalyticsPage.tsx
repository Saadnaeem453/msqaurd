import { useState } from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowDown,
  FiArrowUp,
  FiMapPin,
  FiRadio,
  FiStar,
  FiYoutube,
} from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { MdSpeed } from "react-icons/md";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";



interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  trend?: { dir: "up" | "down"; text: string };
  note: string;
}

interface CategorySlice {
  id: string;
  label: string;
  percent: number;
  fillClass: string;
  dotClass: string;
}

interface ScatterPoint {
  x: number;
  y: number;
  z: number;
}

interface Organizer {
  id: string;
  initials: string;
  name: string;
  series: string;
  events: number;
  score: string;
  scoreTone: "green" | "amber";
  rating: string;
}

interface AlertCard {
  id: string;
  icon: IconType;
  title: string;
  description: string;
  tone: "critical" | "insight";
}

interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  tone: "secondary" | "muted" | "green";
}



const rangeSegments = [
  { id: "l30d", label: "L30D" },
  { id: "q3", label: "Q3 2023" },
  { id: "yearly", label: "Yearly" },
] as const;

type RangeId = (typeof rangeSegments)[number]["id"];

const statItems: StatItem[] = [
  {
    id: "live",
    label: "Live Events",
    value: "1,284",
    icon: FiYoutube,
    trend: { dir: "up", text: "12%" },
    note: "vs last month",
  },
  {
    id: "attendance",
    label: "Avg. Attendance",
    value: "84.2%",
    icon: FiMapPin,
    trend: { dir: "up", text: "3.1%" },
    note: "vs last month",
  },
  {
    id: "nps",
    label: "Net Promoter Score",
    value: "78",
    icon: FiStar,
    trend: { dir: "down", text: "0.4%" },
    note: "vs last month",
  },
  {
    id: "health",
    label: "Platform Health",
    value: "99.9%",
    icon: MdSpeed,
    note: "Stable response times",
  },
];

const categorySlices: CategorySlice[] = [
  { id: "talks", label: "Talks", percent: 45, fillClass: "fill-primary", dotClass: "bg-primary" },
  { id: "galas", label: "Galas", percent: 30, fillClass: "fill-analytics-neutral", dotClass: "bg-analytics-neutral" },
  { id: "workshops", label: "Workshops", percent: 25, fillClass: "fill-secondary", dotClass: "bg-secondary" },
];

const CATEGORY_TOTAL = 3420;

const highNpsPoints: ScatterPoint[] = [
  { x: 11, y: 22, z: 5 },
  { x: 42, y: 64, z: 20 },
  { x: 72, y: 78, z: 15 },
  { x: 93, y: 91, z: 2 },
];

const neutralPoints: ScatterPoint[] = [
  { x: 26, y: 48, z: 10 },
  { x: 56, y: 32, z: 5 },
  { x: 87, y: 18, z: 10 },
];

const organizers: Organizer[] = [
  {
    id: "o1",
    initials: "SK",
    name: "Sarah Kovacs",
    series: "Global Keynote Series",
    events: 24,
    score: "98.2",
    scoreTone: "green",
    rating: "4.9",
  },
  {
    id: "o2",
    initials: "MJ",
    name: "Marcus Jensen",
    series: "Workshop Elite",
    events: 18,
    score: "94.5",
    scoreTone: "green",
    rating: "4.7",
  },
  {
    id: "o3",
    initials: "AL",
    name: "Aria Lovelace",
    series: "Tech Talk Lab",
    events: 32,
    score: "88.9",
    scoreTone: "amber",
    rating: "4.5",
  },
];

const alertCards: AlertCard[] = [
  {
    id: "alert",
    icon: FiAlertTriangle,
    title: "Low Attendance Alert",
    description:
      "Summer Gala (ID: #892) is currently 35% below expected booking curve for June 15th.",
    tone: "critical",
  },
  {
    id: "insight",
    icon: HiOutlineLightBulb,
    title: "Insight Opportunity",
    description:
      "Talks category engagement has surged on Thursday evenings. Consider shifting workshop slots to Friday.",
    tone: "insight",
  },
];

const activityItems: ActivityItem[] = [
  {
    id: "a1",
    title: "New Organizer Approved",
    meta: "2 minutes ago • Creative Collective Ltd.",
    tone: "secondary",
  },
  {
    id: "a2",
    title: "Analytics Report Exported",
    meta: "45 minutes ago • Admin: M. Jensen",
    tone: "muted",
  },
  {
    id: "a3",
    title: "Platform Update v2.4.1 Live",
    meta: "3 hours ago • Deployment Automated",
    tone: "green",
  },
];

const ACTIVITY_TONES: Record<ActivityItem["tone"], string> = {
  secondary: "text-secondary",
  muted: "text-bgray/40",
  green: "text-green",
};

const HEAT_INTENSITY_CLASSES = [
  "bg-report-control",
  "bg-analytics-heat-low",
  "bg-analytics-heat-mid",
  "bg-analytics-heat-high",
  "bg-report-alert",
];

const heatmapGrid: number[] = [
  0, 3, 1, 0, 3, 3, 3, 2, 1, 4, 1, 3,
  4, 0, 2, 4, 0, 3, 2, 2, 2, 1, 3, 3,
  2, 0, 4, 2, 3, 4, 2, 2, 4, 3, 3, 3,
  1, 2, 3, 1, 4, 0, 2, 4, 2, 3, 4, 1,
];



const EventsAnalyticsPage = () => {
  const [range, setRange] = useState<RangeId>("l30d");

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="admin-page-title">
              Events Analytics
            </h1>
            <p className="admin-page-description">
              Global platform growth and behavioral demographics
            </p>
          </div>
          <div className="flex w-fit rounded-sm bg-grayblue p-1 ring-1 ring-bgray/5">
            {rangeSegments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                aria-pressed={range === segment.id}
                onClick={() => setRange(segment.id)}
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
        <section className="mt-7 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[760px]:grid-cols-4">
          {statItems.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend?.dir === "down" ? FiArrowDown : FiArrowUp;
            return (
              <div key={stat.id} className="rounded-[2px] bg-report-head p-4">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-normal text-bgray/80">{stat.label}</span>
                  <Icon size={16} className="text-secondary" />
                </div>
                <p className="mt-2 text-3xl font-normal tracking-tight text-bgray">
                  {stat.value}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs">
                  {stat.trend && (
                    <span
                      className={`flex items-center gap-1 font-normal ${
                        stat.trend.dir === "up" ? "text-green" : "text-primary"
                      }`}
                    >
                      <TrendIcon size={10} />
                      {stat.trend.text}
                    </span>
                  )}
                  <span className="text-secondary/70">{stat.note}</span>
                </p>
              </div>
            );
          })}
        </section>
        <section className="mt-7 grid grid-cols-1 gap-5 min-[760px]:grid-cols-3">
          <div className="rounded-[2px] bg-report-head p-5">
            <h2 className="admin-section-title">
              Category Distribution
            </h2>
            <div className="relative mt-4 h-[195px]">
              
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-secondary/70">Total</span>
                <span className="mt-1 text-xl font-normal text-bgray">
                  {CATEGORY_TOTAL.toLocaleString("en-US")}
                </span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 pb-2">
              {categorySlices.map((slice) => (
                <div key={slice.id}>
                  <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                    <span className={`h-1.5 w-1.5 rounded-full ${slice.dotClass}`} aria-hidden="true" />
                    {slice.label}
                  </span>
                  <span className="mt-1 block text-xs font-normal text-bgray/80">
                    {slice.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2px] bg-report-head p-5 min-[760px]:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="admin-section-title">
                Event Size vs. Engagement
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  High NPS
                </span>
                <span className="flex items-center gap-1.5 text-xs text-bgray/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-analytics-neutral" aria-hidden="true" />
                  Neutral
                </span>
              </div>
            </div>
            <div className="mt-5 h-64 text-secondary/70">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 0, right: 0, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.07} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    ticks={[0, 20, 40, 60, 80, 100]}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "EVENT CAPACITY (ATTENDANCE)",
                      position: "insideBottom",
                      offset: -8,
                      fontSize: 8,
                      fill: "currentColor",
                      letterSpacing: 1,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    width={26}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "ENGAGEMENT (RATING)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 8,
                      fontSize: 8,
                      fill: "currentColor",
                      letterSpacing: 1,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" domain={[2, 20]} range={[25, 300]} />
                  <Scatter data={highNpsPoints} fill="currentColor" className="text-analytics-scatter" />
                  <Scatter data={neutralPoints} fill="currentColor" className="text-analytics-neutral" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        <section className="mt-5 grid grid-cols-1 gap-5 min-[760px]:grid-cols-7">
          <div className="min-w-0 rounded-[2px] bg-report-head p-5 min-[760px]:col-span-4 min-[760px]:min-h-[430px]">
            <div className="flex items-center justify-between">
              <h2 className="admin-section-title">
                Top Performing Organizers
              </h2>
              <Link
                to="/admin/users/organizers"
                className="shrink-0 text-xs font-normal text-secondary transition hover:text-bgray"
              >
                View All Report
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[385px] text-left">
              <thead>
                <tr>
                  <th className="w-[40%] pb-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Organizer
                  </th>
                  <th className="w-[20%] pb-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Events
                  </th>
                  <th className="w-[20%] pb-3 text-xs font-normal uppercase tracking-wider text-secondary">
                    Prod. Score
                  </th>
                  <th className="w-[20%] pb-3 text-right text-xs font-normal uppercase tracking-wider text-secondary">
                    Avg. Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((org) => (
                  <tr key={org.id}>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-report-control text-xs font-normal text-secondary">
                          {org.initials}
                        </span>
                        <div>
                          <p className="text-xs font-normal text-bgray">{org.name}</p>
                          <p className="mt-0.5 text-xs text-secondary/70">{org.series}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-bgray">{org.events}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-sm px-2 py-0.5 text-xs font-normal ${
                          org.scoreTone === "green"
                            ? "bg-green/15 text-green"
                            : "bg-analytics-yellow/10 text-analytics-yellow"
                        }`}
                      >
                        {org.score}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-sm text-bgray">
                        {org.rating}
                        <FiStar size={10} className="text-secondary" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
          <div className="rounded-[2px] bg-report-head p-5 min-[760px]:col-span-3">
            <h2 className="admin-section-title">
              Critical Alerts &amp; Insights
            </h2>
            <div className="mt-4 space-y-3">
              {alertCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className={`rounded-md p-3 ${
                      card.tone === "critical"
                        ? "border border-secondary/15 bg-primary/10"
                        : "border border-secondary/15 bg-secondary/10"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Icon size={19} className="mt-0.5 shrink-0 text-report-alert" />
                      <div>
                        <p className="text-xs font-normal text-secondary">{card.title}</p>
                        <p
                          className={`mt-1 text-xs leading-relaxed ${
                            card.tone === "critical"
                              ? "text-secondary/80"
                              : "text-secondary/70"
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-xs font-normal uppercase tracking-wider text-bgray/70">
              Recent System Activity
            </p>
            <ul className="mt-3 space-y-3">
              {activityItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <FiRadio size={13} className={`mt-0.5 shrink-0 ${ACTIVITY_TONES[item.tone]}`} />
                  <div>
                    <p className="text-xs font-normal text-bgray">{item.title}</p>
                    <p className="mt-0.5 text-xs text-secondary/70">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mt-6 rounded-[2px] bg-report-head p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="admin-section-title">
                Organizer Productivity Map
              </h2>
              <p className="mt-1 text-xs text-secondary/70">
                Activity intensity across event categories (24h period)
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-secondary/70">Low</span>
              {HEAT_INTENSITY_CLASSES.map((cls) => (
                <span key={cls} className={`h-3.5 w-3.5 rounded-sm ${cls}`} aria-hidden="true" />
              ))}
              <span className="text-xs text-secondary/70">High</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-12 gap-1.5">
            {heatmapGrid.map((intensity, index) => (
              <div
                key={index}
                aria-label={`Activity cell ${index + 1}: intensity ${intensity + 1} of 5`}
                title={`Intensity ${intensity + 1} of 5`}
                className={`h-[26px] rounded-[1px] ${HEAT_INTENSITY_CLASSES[intensity]}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventsAnalyticsPage;
