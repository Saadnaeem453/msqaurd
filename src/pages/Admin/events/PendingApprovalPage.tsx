import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiMonitor,
  FiMusic,
  FiZap,
} from "react-icons/fi";
import { MdTouchApp } from "react-icons/md";

interface HeaderStat {
  id: string;
  label: string;
  value: string;
  tone: "bgray" | "secondary";
  delta?: string;
  zap?: boolean;
}

type Verification = "verified" | "pending";
type ThumbTone = "info" | "primary" | "muted";

export interface QueueEvent {
  id: string;
  title: string;
  organizer: string;
  verification: Verification;
  countdownPrefix: string;
  countdown: string;
  urgent: boolean;
  capacity: string;
  entryFee: string;
  category: string;
  thumbIcon: IconType;
  thumbTone: ThumbTone;
  imageUrl?: string | null;
}

interface DropdownOption {
  value: string;
  label: string;
}

const headerStats: HeaderStat[] = [
  { id: "waiting", label: "Waiting Review", value: "124", tone: "secondary", delta: "+12%" },
  { id: "sla", label: "SLA Compliance", value: "98.2%", tone: "bgray", delta: "Stable" },
  { id: "new", label: "New Today", value: "47", tone: "bgray", zap: true },
];

const categoryOptions: DropdownOption[] = [
  { value: "all", label: "All Categories" },
  { value: "tech", label: "Technology" },
  { value: "entertainment", label: "Entertainment" },
  { value: "finance", label: "Finance" },
];

const queueEvents: QueueEvent[] = [
  {
    id: "EVT-9021-X",
    title: "Cyber Summit 2024: Infrastructure Keynote",
    organizer: "TechPulse Labs",
    verification: "verified",
    countdownPrefix: "Starts in",
    countdown: "4h 22m",
    urgent: true,
    capacity: "1,200 SEATS",
    entryFee: "$299.00",
    category: "TECHNOLOGY",
    thumbIcon: FiMonitor,
    thumbTone: "info",
  },
  {
    id: "EVT-4431-B",
    title: "Underground Beats Vol. 4 - Digital Showcase",
    organizer: "Neon Collective",
    verification: "pending",
    countdownPrefix: "In",
    countdown: "3 Days",
    urgent: false,
    capacity: "500 SLOTS",
    entryFee: "FREE",
    category: "ENTERTAINMENT",
    thumbIcon: FiMusic,
    thumbTone: "primary",
  },
  {
    id: "EVT-0092-Z",
    title: "Global Finance Summit - 2024 Q3",
    organizer: "Apex Capital",
    verification: "verified",
    countdownPrefix: "In",
    countdown: "12 Days",
    urgent: false,
    capacity: "2,500 SEATS",
    entryFee: "$1,250.00",
    category: "FINANCE",
    thumbIcon: FiBarChart2,
    thumbTone: "muted",
  },
];

const VERIFICATION_BADGES: Record<Verification, { label: string; icon: IconType; classes: string }> = {
  verified: {
    label: "Verified Organizer",
    icon: FiCheckCircle,
    classes: "bg-green/15 text-green",
  },
  pending: {
    label: "Verification Pending",
    icon: FiAlertCircle,
    classes: "bg-[#302e1d] text-[#ffe000]",
  },
};

const THUMB_TONE_CLASSES: Record<ThumbTone, string> = {
  info: "text-[#49b9c7]",
  primary: "text-primary",
  muted: "text-bgray/50",
};

const VerificationBadge = ({ verification }: { verification: Verification }) => {
  const badge = VERIFICATION_BADGES[verification];
  const Icon = badge.icon;
  return (
    <span
      className={`inline-flex max-w-[110px] items-start gap-1 rounded-sm px-2 py-1 text-[10px] font-bold uppercase leading-snug tracking-wide ${badge.classes}`}
    >
      <Icon size={11} className="mt-0.5 shrink-0" />
      {badge.label}
    </span>
  );
};

interface EventCardProps {
  event: QueueEvent;
  highlighted: boolean;
  onReview: () => void;
}

const EventCard = ({ event, highlighted, onReview }: EventCardProps) => {
  const ThumbIcon = event.thumbIcon;
  const [failedImage, setFailedImage] = useState<string | null>(null);
  return (
    <article
      className={`rounded-sm border bg-[#151c24] p-4 ${
        highlighted ? "border-secondary border-l-[3px]" : "border-transparent"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-[58px] w-[80px] shrink-0 items-center justify-center rounded-md bg-bgray/10">
          {event.imageUrl && failedImage !== event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} loading="lazy" className="h-full w-full rounded-sm object-cover" onError={() => setFailedImage(event.imageUrl ?? null)} />
          ) : (
            <ThumbIcon role="img" aria-label="Event image placeholder" size={22} className={THUMB_TONE_CLASSES[event.thumbTone]} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-jakarta text-[13px] font-semibold leading-snug text-bgray">{event.title}</h3>
          <div className="mt-2 flex flex-wrap items-start gap-2">
            <span className="flex max-w-[90px] items-start gap-1 text-[11px] font-medium leading-snug text-secondary">
              <FiBriefcase size={11} className="mt-0.5 shrink-0" />
              {event.organizer}
            </span>
            <VerificationBadge verification={event.verification} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end">
          <span
            className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 ${
              event.urgent
                ? "border border-secondary/30 bg-secondary/10 text-secondary"
                : "bg-bgray/10 text-bgray/80"
            }`}
          >
            <FiCalendar size={13} className="shrink-0" />
            <span className="text-left text-[10px] leading-tight">
              {event.countdownPrefix}
              <br />
              <span className="font-bold">{event.countdown}</span>
            </span>
          </span>
          <span className="mt-2 max-w-[70px] text-right text-[10px] leading-snug text-bgray/50">
            ID: {event.id}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3 min-[500px]:ml-[92px]">
        {[
          { label: "Capacity", value: event.capacity },
          { label: "Entry Fee", value: event.entryFee },
          { label: "Category", value: event.category },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-[10px] font-medium uppercase text-bgray/50">
              {stat.label}
            </p>
            <p className="mt-0.5 text-xs font-medium uppercase leading-tight text-bgray">
              {stat.value}
            </p>
          </div>
        ))}
        <button
          type="button"
          onClick={onReview}
          className="ml-auto w-[70px] rounded-sm bg-[#303741] px-2 py-2 text-xs text-bgray/80 transition hover:bg-bgray/15 hover:text-bgray"
        >
          Review Entry
        </button>
      </div>
    </article>
  );
};

interface ReviewSidebarProps {
  selected: QueueEvent | null;
}

const ReviewSidebar = ({ selected }: ReviewSidebarProps) => (
  <section className="rounded-xl border border-secondary/20 bg-[#1b1d25] p-4">
    <div className="flex items-center justify-between">
      <h2 className="admin-section-title font-jakarta text-xs text-bgray/80">Review Sidebar</h2>
      <span className="rounded bg-secondary px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-grayblue">
        Quick Action
      </span>
    </div>

    {selected === null ? (
      <div className="mt-4 flex min-h-[114px] flex-col items-center justify-center rounded-md bg-[#303741] px-5 py-5 text-center">
        <MdTouchApp size={24} className="text-bgray/50" />
        <p className="mt-3 max-w-[190px] text-xs leading-4 text-bgray">
          Select an event from the list to preview details and perform rapid moderation.
        </p>
      </div>
    ) : (
      <div className="mt-4 rounded-md bg-bgray/10 p-4">
        <h3 className="text-sm font-bold leading-snug text-bgray">{selected.title}</h3>
        <p className="mt-1 text-xs font-bold text-secondary">{selected.organizer}</p>
        <div className="mt-3">
          <VerificationBadge verification={selected.verification} />
        </div>
        <dl className="mt-4 space-y-2 text-xs">
          {[
            { label: "Capacity", value: selected.capacity },
            { label: "Entry Fee", value: selected.entryFee },
            { label: "Category", value: selected.category },
            { label: "Event ID", value: selected.id },
          ].map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <dt className="text-bgray/50">{row.label}</dt>
              <dd className="font-bold text-bgray">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md border border-green/30 bg-green/15 px-3 py-2 text-xs font-semibold text-green transition hover:bg-green/25"
          >
            Approve
          </button>
          <button
            type="button"
            className="flex-1 rounded-md bg-bgray/10 px-3 py-2 text-xs text-bgray/80 transition hover:bg-bgray/15"
          >
            Request Changes
          </button>
        </div>
      </div>
    )}
  </section>
);

const PendingApprovalPage = () => {
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [categoryValue, setCategoryValue] = useState("all");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visibleEvents = useMemo(
    () => queueEvents.filter((event) => (!urgentOnly || event.urgent) && (categoryValue === "all" || event.category === (categoryValue === "tech" ? "TECHNOLOGY" : categoryValue.toUpperCase()))),
    [urgentOnly, categoryValue],
  );
  const selectedEvent = queueEvents.find((e) => e.id === selectedId) ?? null;
  const selectedCategory = categoryOptions.find((o) => o.value === categoryValue);

  return (
    <div className="min-h-full bg-grayblue text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">

        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm border border-secondary/20 bg-primary/20 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider text-secondary">
                Live Queue
              </span>
              <h1 className="admin-page-title">
                Pending Approval
              </h1>
            </div>
            <p className="admin-page-description">
              Review and moderate incoming event submissions. Ensure all infrastructure
              policies are met before allowing public indexing.
            </p>
          </div>

          <div className="flex divide-x divide-border_color/60 rounded-md bg-[#242c36]">
            {headerStats.map((stat) => (
              <div key={stat.id} className="px-3 py-3">
                <p className="text-xs text-bgray/80">{stat.label}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span
                    className={`text-xl font-bold ${
                      stat.tone === "secondary" ? "text-secondary" : "text-bgray"
                    }`}
                  >
                    {stat.value}
                  </span>
                  {stat.delta && (
                    <span className={`text-[10px] font-medium ${stat.id === "sla" ? "text-green" : "text-secondary"}`}>{stat.delta}</span>
                  )}
                  {stat.zap && <FiZap size={11} className="text-secondary" />}
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 min-[700px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">

          <div>
            <div className="flex flex-wrap items-center gap-2 rounded-sm bg-[#151c24] p-1.5">
              <button
                type="button"
                onClick={() => setUrgentOnly((v) => !v)}
                aria-pressed={urgentOnly}
                className={`rounded-sm px-2.5 py-1.5 text-xs font-semibold transition ${
                  urgentOnly
                    ? "bg-secondary text-grayblue"
                    : "bg-secondary/80 text-grayblue hover:bg-secondary"
                }`}
              >
                Urgent
              </button>
              <button
                type="button"
                className="rounded-sm px-2.5 py-1.5 text-xs text-bgray/80 transition hover:bg-bgray/10"
              >
                Bulk Actions
              </button>
              <span className="ml-2 text-xs text-bgray/50">Filter by Category:</span>
              <div ref={categoryRef} className="relative" onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setCategoryOpen(false);
                  categoryRef.current?.querySelector("button")?.focus();
                }
              }}>
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  aria-expanded={categoryOpen}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-bgray transition hover:bg-bgray/10"
                >
                  {selectedCategory?.label}
                  <FiChevronDown size={12} className="text-bgray/50" />
                </button>
                {categoryOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setCategoryValue(option.value);
                          setCategoryOpen(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                          option.value === categoryValue
                            ? "font-medium text-bgray"
                            : "text-bgray/80"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-4">
              {visibleEvents.length === 0 && (
                <p className="bg-[#151c24] p-6 text-sm text-secondary">No pending events match these filters.</p>
              )}
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  highlighted={event.urgent || event.id === selectedId}
                  onReview={() => setSelectedId(event.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <ReviewSidebar selected={selectedEvent} />

            <section className="rounded-xl border border-secondary/20 bg-[#1b1d25] p-4">
              <div className="flex items-center justify-between">
                <h2 className="admin-section-title font-jakarta text-xs text-bgray/80">Average Review Time</h2>
                <span className="text-sm font-bold text-bgray">14m 20s</span>
              </div>
              <div className="mt-3 h-1 w-full rounded-full bg-bgray/15">
                <div className="h-full rounded-full bg-secondary" style={{ width: "85%" }} />
              </div>
              <p className="mt-3 text-[10px] italic text-bgray/50">
                "Targeting &lt; 10m for Tier 1 Partners"
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
