import { useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiChevronDown,
  FiChevronRight,
  FiEdit,
  FiLink,
  FiMousePointer,
  FiRadio,
  FiSend,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";



interface StatItem {
  id: string;
  icon: IconType;
  iconTone: "primary" | "info" | "amber" | "green";
  delta?: { text: string; tone: "green" | "primary"; dir: "up" | "down" };
  deltaPlain?: string;
  label: string;
  value: string;
}

interface TrendPoint {
  tick: string;
  delivered: number;
  clicks: number;
}

type ActivityStatus = "sent" | "scheduled" | "draft";

interface ActivityRow {
  id: string;
  title: string;
  excerpt: string;
  audience: string;
  region: string | null;
  status: ActivityStatus;
  ctr: string | null;
}

interface LogRow {
  id: string;
  tone: "green" | "info" | "primary";
  title: string;
  tag: string;
  meta: string;
}

interface FilterOption {
  value: string;
  label: string;
}



const statItems: StatItem[] = [
  {
    id: "campaigns",
    icon: FiRadio,
    iconTone: "primary",
    delta: { text: "+2 active", tone: "green", dir: "up" },
    label: "Active Campaigns",
    value: "12",
  },
  {
    id: "reach",
    icon: FiUsers,
    iconTone: "info",
    deltaPlain: "Daily Stats",
    label: "Total Reach (24h)",
    value: "142.8k",
  },
  {
    id: "ctr",
    icon: FiMousePointer,
    iconTone: "amber",
    delta: { text: "-1.2%", tone: "primary", dir: "down" },
    label: "Avg. Click Rate",
    value: "4.2%",
  },
  {
    id: "optin",
    icon: FiShield,
    iconTone: "green",
    delta: { text: "+0.5%", tone: "green", dir: "up" },
    label: "System Opt-In %",
    value: "89.4%",
  },
];

const ICON_TONE_CLASSES: Record<StatItem["iconTone"], string> = {
  primary: "bg-primary/15 text-primary",
  info: "bg-report-blue/15 text-report-blue",
  amber: "bg-report-amber/15 text-report-amber",
  green: "bg-green/15 text-green",
};

const trendSeries: TrendPoint[] = [
  { tick: "00:00", delivered: 24, clicks: 0 },
  { tick: "", delivered: 36, clicks: 0 },
  { tick: "04:00", delivered: 28, clicks: 0 },
  { tick: "", delivered: 48, clicks: 0 },
  { tick: "08:00", delivered: 65, clicks: 1 },
  { tick: "", delivered: 57, clicks: 0 },
  { tick: "12:00", delivered: 74, clicks: 1 },
  { tick: "", delivered: 40, clicks: 0 },
  { tick: "16:00", delivered: 32, clicks: 0 },
  { tick: "", delivered: 52, clicks: 1 },
  { tick: "20:00", delivered: 70, clicks: 0 },
  { tick: "23:59", delivered: 60, clicks: 1 },
];

const statusOptions: FilterOption[] = [
  { value: "all", label: "All Status" },
  { value: "sent", label: "Sent" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
];

const regionOptions: FilterOption[] = [
  { value: "all", label: "Filter Region" },
  { value: "global", label: "Global" },
  { value: "eu-west", label: "EU-West" },
  { value: "eu-east", label: "EU-East" },
  { value: "na", label: "North America" },
];

const activityRows: ActivityRow[] = [
  {
    id: "n1",
    title: "New Legendary Drop Live!",
    excerpt: "Check out the new MSQUARED drop...",
    audience: "All Users",
    region: "global",
    status: "sent",
    ctr: "5.2%",
  },
  {
    id: "n2",
    title: "New Legendary Drop Live!",
    excerpt: "Check out the new MSQUARED drop...",
    audience: "All Users",
    region: "global",
    status: "sent",
    ctr: "5.2%",
  },
  {
    id: "n3",
    title: "Flash Tournament: 2h Left",
    excerpt: "Register now for the Grand Prix finals...",
    audience: "Organizers",
    region: "eu-west",
    status: "scheduled",
    ctr: null,
  },
  {
    id: "n4",
    title: "Flash Tournament: 2h Left",
    excerpt: "Register now for the Grand Prix finals...",
    audience: "Organizers",
    region: "eu-west",
    status: "scheduled",
    ctr: null,
  },
  {
    id: "n5",
    title: "System Maintenance Tomorrow",
    excerpt: "We will be performing a 1h updat...",
    audience: "Internal",
    region: null,
    status: "draft",
    ctr: null,
  },
  {
    id: "n6",
    title: "System Maintenance Tomorrow",
    excerpt: "We will be performing a 1h updat...",
    audience: "Internal",
    region: null,
    status: "draft",
    ctr: null,
  },
  {
    id: "n7",
    title: "Welcome to the OS",
    excerpt: "Get started with MSQUARED admin tools...",
    audience: "New Users",
    region: null,
    status: "sent",
    ctr: "12.8%",
  },
];

const STATUS_BADGES: Record<ActivityStatus, { label: string; classes: string }> = {
  sent: { label: "Sent", classes: "bg-green/15 text-green" },
  scheduled: { label: "Scheduled", classes: "bg-report-blue/15 text-report-blue" },
  draft: { label: "Draft", classes: "bg-bgray/10 text-bgray/80" },
};

const logRows: LogRow[] = [
  {
    id: "l1",
    tone: "green",
    title: "Successful broadcast to 84k users",
    tag: "v-campaign-091",
    meta: "2 minutes ago • Initiated by Admin_MO",
  },
  {
    id: "l2",
    tone: "info",
    title: "Scheduled: 'National Event Alert' for EU-WEST",
    tag: "v-sched-44",
    meta: "14 minutes ago • Automated Trigger",
  },
  {
    id: "l3",
    tone: "primary",
    title: "Campaign Error: Missing Deep Link Param",
    tag: "v-fail-12",
    meta: "1.5 hours ago • System Validator",
  },
];

const DEFAULT_PREVIEW = {
  title: "System Update Live",
  body: "We've just deployed v4.2.0 with enhanced validation tools. Click to view release notes.",
};



const PushNotificationsControlPage = () => {
  const [statusValue, setStatusValue] = useState("all");
  const [regionValue, setRegionValue] = useState("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [sendOpen, setSendOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState(activityRows);

  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        const byStatus = statusValue === "all" || row.status === statusValue;
        const byRegion = regionValue === "all" || row.region === regionValue;
        return byStatus && byRegion;
      }),
    [rows, statusValue, regionValue],
  );

  const handleSend = () => {
    setSendOpen(false);
    toast.error("Notification delivery is not connected yet. Save your notification as a draft.");
  };

  const saveDraft = () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Enter a notification title and message.");
      titleRef.current?.focus();
      return;
    }
    const draft = { title, body, deepLink, scheduleDate, scheduleTime };
    try {
      localStorage.setItem("admin-push-notification-draft", JSON.stringify(draft));
      setRows((current) => [
        { id: "local-draft", title, excerpt: body, audience: "Not selected", region: null, status: "draft", ctr: null },
        ...current.filter((row) => row.id !== "local-draft"),
      ]);
      setStatusValue("all");
      setRegionValue("all");
      toast.success("Draft saved in this browser.");
    } catch {
      toast.error("Unable to save the draft in this browser.");
    }
  };

  const inputClass =
    "w-full rounded-md bg-report-head px-3 py-2.5 text-sm text-bgray placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary/50";
  const labelClass = "text-xs font-normal uppercase tracking-wider text-bgray/70";

  const previewTitle = title.trim() || DEFAULT_PREVIEW.title;
  const previewBody = body.trim() || DEFAULT_PREVIEW.body;

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">

        <nav className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider">
          <span className="text-secondary/60">
            Communications
          </span>
          <FiChevronRight size={10} className="text-secondary/60" />
          <span className="text-secondary">Push Notifications</span>
        </nav>


        <header className="admin-page-heading mt-3">
          <div className="max-w-2xl">
            <h1 className="admin-page-title">
              Push Notifications Control
            </h1>
            <p className="admin-page-description">
              Broadcast critical system updates, marketing campaigns, and transactional alerts
              across the MSQUARED ecosystem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); titleRef.current?.focus(); }}
            className="flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-normal text-bgray transition hover:bg-primary/90"
          >
            <FiSend size={13} />
            Create New Notification
          </button>
        </header>


        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            const DeltaIcon = item.delta?.dir === "down" ? FiArrowDownRight : FiArrowUpRight;
            return (
              <div key={item.id} className="rounded-md bg-lightgrayblue p-5">
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-md ${ICON_TONE_CLASSES[item.iconTone]}`}
                  >
                    <Icon size={15} />
                  </span>
                  {item.delta && (
                    <span
                      className={`flex items-center gap-1 text-xs font-normal ${
                        item.delta.tone === "green" ? "text-green" : "text-primary"
                      }`}
                    >
                      {item.delta.text}
                      <DeltaIcon size={10} />
                    </span>
                  )}
                  {item.deltaPlain && (
                    <span className="text-xs text-secondary/60">{item.deltaPlain}</span>
                  )}
                </div>
                <p className="mt-3 text-xs font-normal uppercase tracking-wider text-bgray/80">
                  {item.label}
                </p>
                <p className="mt-1 text-3xl font-normal tracking-tight text-bgray">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>


        <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[2.1fr_1fr]">

          <div className="min-w-0 space-y-4">

            <section className="rounded-md bg-report-head p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-normal uppercase tracking-wider text-bgray">
                  Aggregate Engagement Trend
                </h2>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-normal uppercase tracking-wide text-bgray/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Delivered
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-normal uppercase tracking-wide text-bgray/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-report-blue" aria-hidden="true" />
                    Clicks
                  </span>
                </div>
              </div>
              <div className="mt-5 h-40 text-secondary/60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendSeries}
                    barCategoryGap="5%"
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      dataKey="tick"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={{ fontSize: 11, fill: "currentColor" }}
                    />
                    <Bar stackId="engagement" dataKey="delivered" fill="currentColor" className="text-primary/20" />
                    <Bar stackId="engagement" dataKey="clicks" fill="currentColor" className="text-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>


            <section className="overflow-hidden rounded-md bg-report-head">
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
                <h2 className="admin-section-title">
                  Recent Activity
                </h2>
                <div className="flex items-center gap-2">

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusOpen((v) => !v)}
                      className="flex items-center gap-1.5 rounded-md bg-bgray/10 px-3 py-1.5 text-xs font-normal uppercase tracking-wide text-bgray/80 transition hover:bg-bgray/15"
                    >
                      {statusOptions.find((o) => o.value === statusValue)?.label}
                      <FiChevronDown size={10} />
                    </button>
                    {statusOpen && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-md border border-border_color bg-report-head py-1 shadow-lg">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setStatusValue(option.value);
                              setStatusOpen(false);
                            }}
                            className="block w-full px-3 py-1.5 text-left text-xs text-bgray/80 transition hover:bg-bgray/10"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setRegionOpen((v) => !v)}
                      className="flex items-center gap-1.5 rounded-md bg-bgray/10 px-3 py-1.5 text-xs font-normal uppercase tracking-wide text-bgray/80 transition hover:bg-bgray/15"
                    >
                      {regionOptions.find((o) => o.value === regionValue)?.label}
                      <FiChevronDown size={10} />
                    </button>
                    {regionOpen && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-border_color bg-report-head py-1 shadow-lg">
                        {regionOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setRegionValue(option.value);
                              setRegionOpen(false);
                            }}
                            className="block w-full px-3 py-1.5 text-left text-xs text-bgray/80 transition hover:bg-bgray/10"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr className="bg-bgray/5">
                      <th className="w-[38%] px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-secondary">
                        Content Preview
                      </th>
                      <th className="w-[22%] px-4 py-2.5 text-xs font-normal uppercase tracking-wider text-secondary">
                        Target Audience
                      </th>
                      <th className="w-[22%] px-4 py-2.5 text-xs font-normal uppercase tracking-wider text-secondary">
                        Status
                      </th>
                      <th className="w-[18%] px-4 py-2.5 text-xs font-normal uppercase tracking-wider text-secondary">
                        CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-secondary">No notifications match these filters.</td></tr>}
                    {visibleRows.map((row) => {
                      const badge = STATUS_BADGES[row.status];
                      return (
                        <tr key={row.id} className="border-0">
                          <td className="px-5 py-3">
                            <p className="text-xs font-normal leading-snug text-bgray">
                              {row.title}
                            </p>
                            <p className="mt-0.5 max-w-[180px] text-xs leading-snug text-secondary/60">
                              {row.excerpt}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block rounded bg-bgray/10 px-2 py-1 text-xs font-normal leading-snug text-bgray/80">
                              {row.audience}
                              {row.region && (
                                <span className="block text-xs uppercase tracking-wide text-secondary/60">
                                  {row.region}
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-normal uppercase tracking-wide ${badge.classes}`}
                            >
                              <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-normal ${
                                row.ctr ? "text-bgray" : "text-secondary/60"
                              }`}
                            >
                              {row.ctr ?? "--"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>


          <div className="min-w-0 space-y-4">
            <section className="rounded-md bg-lightgrayblue p-5">
              <h2 className="flex items-center gap-2 admin-section-title">
                <FiEdit size={15} className="text-primary" />
                Quick Compose
              </h2>

              <div className="mt-4 min-w-0 space-y-4">
                <div>
                  <label htmlFor="notif-title" className={labelClass}>
                    Notification Title
                  </label>
                  <input
                    ref={titleRef}
                    id="notif-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. System Update Live"
                    className={`mt-1.5 ${inputClass}`}
                  />
                </div>

                <div>
                  <label htmlFor="notif-body" className={labelClass}>
                    Body Text
                  </label>
                  <textarea
                    id="notif-body"
                    value={body}
                    maxLength={150}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter the message body..."
                    className={`mt-1.5 h-24 resize-none ${inputClass}`}
                  />
                  <p className="mt-1 text-right text-xs text-secondary/60">
                    {body.length}/150 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="notif-url" className={labelClass}>
                    Deep Link URL
                  </label>
                  <div className="relative mt-1.5">
                    <FiLink
                      size={11}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60"
                    />
                    <input
                      id="notif-url"
                      type="text"
                      value={deepLink}
                      onChange={(e) => setDeepLink(e.target.value)}
                      placeholder="msquared://events/..."
                      className={`pl-8 ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="notif-date" className={labelClass}>
                      Schedule Date
                    </label>
                    <input
                      id="notif-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      placeholder="mm/dd/yyyy"
                      className={`mt-1.5 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="notif-time" className={labelClass}>
                      Time (UTC)
                    </label>
                    <input
                      id="notif-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      placeholder="--:-- --"
                      className={`mt-1.5 ${inputClass}`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={saveDraft}
                  className="w-full rounded-sm bg-report-control py-2.5 text-xs font-normal text-bgray transition hover:bg-bgray/15"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => { if (!title.trim() || !body.trim()) { toast.error("Enter a notification title and message."); return; } setSendOpen(true); }}
                  className="w-full rounded-md bg-primary py-2.5 text-xs font-normal text-bgray transition hover:bg-primary/90"
                >
                  Send Notification Now
                </button>
              </div>
            </section>


            <div>
              <div className="relative mx-auto max-w-sm rounded-3xl bg-backlog-head px-4 pb-4 pt-10">
                <span aria-hidden="true" className="absolute left-1/2 top-2 h-2 w-14 -translate-x-1/2 rounded-full bg-grayblue" />
                <div className="rounded-xl border border-bgray/10 bg-bgray/10 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary">
                    <FiRadio size={10} className="text-bgray" />
                  </span>
                  <span className="text-xs font-normal uppercase tracking-wider text-secondary/60">
                    MSQUARED • NOW
                  </span>
                </div>
                <p className="mt-2 text-xs font-normal text-bgray">{previewTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary/60">
                  {previewBody}
                </p>
                </div>
                <span
                  className="mx-auto mt-6 block h-1 w-16 rounded-full bg-bgray/20"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-center text-xs font-normal uppercase tracking-widest text-secondary/60">
                Dynamic Preview (iOS Style)
              </p>
            </div>
          </div>
        </div>


        <section className="mt-6 rounded-md bg-report-head p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="admin-section-title">
              System Dispatch Log
            </h2>
            <span className="text-xs text-secondary/60">
              Last updated: 14:32:05 UTC
            </span>
          </div>
          <ul className="mt-4 min-w-0 space-y-4">
            {logRows.map((row) => (
              <li key={row.id} className="flex items-start gap-2.5">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-report-control ${
                    row.tone === "green"
                      ? "bg-green"
                      : row.tone === "info"
                        ? "bg-report-blue"
                        : "bg-primary"
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-normal text-bgray">
                    {row.title} <span className="ml-1 text-xs font-normal text-secondary">{row.tag}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-secondary/60">{row.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ConfirmModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onConfirm={handleSend}
        message={`Send "${previewTitle}" now?`}
        title="Send Notification"
        confirmLabel="Send Notification"
      />
    </div>
  );
};

export default PushNotificationsControlPage;
