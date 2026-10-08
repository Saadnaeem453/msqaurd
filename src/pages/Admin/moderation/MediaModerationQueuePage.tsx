import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiChevronDown,
  FiFileText,
  FiFilm,
  FiFilter,
  FiImage,
  FiMessageSquare,
  FiMic,
  FiMusic,
  FiTrendingUp,
} from "react-icons/fi";

type MediaCategory = "image" | "video" | "audio" | "text";
type BadgeTone = "danger" | "warn" | "muted";
type TabId = "all" | "image" | "video" | "text";

interface MediaBadge {
  label: string;
  confidence: number;
  tone: BadgeTone;
}

interface MediaItem {
  id: string;
  title: string;
  user: string;
  age: string;
  category: MediaCategory;
  typeIcon: IconType;
  badge: MediaBadge;
  quote?: string;
  duration?: string;
  thumbIcon?: IconType;
  thumbTone?: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

const TOTAL_IN_QUEUE = 24;

const headerStats = [
  { id: "health", label: "Queue Health", value: "92%", tone: "greenish", trend: true },
  { id: "pending", label: "Pending AI", value: "1,204", tone: "secondary", trend: false },
] as const;

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All Content" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "text", label: "Description Text" },
];

const sortOptions: DropdownOption[] = [
  { value: "confidence", label: "Highest Confidence" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "risk", label: "Risk Score" },
];

const initialItems: MediaItem[] = [
  {
    id: "m1",
    title: "Neon Genesis Party",
    user: "@cyber_rave_01",
    age: "2m ago",
    category: "image",
    typeIcon: FiImage,
    badge: { label: "Explicit Content", confidence: 94, tone: "danger" },
    thumbIcon: FiImage,
    thumbTone: "text-primary",
  },
  {
    id: "m2",
    title: "Downhill Thrills 2024",
    user: "@mtb_legend",
    age: "15m ago",
    category: "video",
    typeIcon: FiFilm,
    badge: { label: "Violence Detected", confidence: 72, tone: "warn" },
    quote: "“Check out this insane wipeout from today's run...”",
    duration: "0:45",
    thumbIcon: FiFilm,
    thumbTone: "text-report-amber",
  },
  {
    id: "m3",
    title: "Live at The Dome",
    user: "@concert_junkie",
    age: "42m ago",
    category: "image",
    typeIcon: FiImage,
    badge: { label: "Copyrighted", confidence: 91, tone: "danger" },
    thumbIcon: FiMusic,
    thumbTone: "text-bgray/40",
  },
  {
    id: "m4",
    title: "Event Description",
    user: "@night_walker_x",
    age: "1h ago",
    category: "text",
    typeIcon: FiMessageSquare,
    badge: { label: "Hate Speech/Illegal", confidence: 88, tone: "muted" },
    quote:
      "“Uncensored underground meet at the industrial district. No cops, no rules. 18+ strictly. DM for secret location coordinates.”",
  },
  {
    id: "m5",
    title: "Global Tech Summit",
    user: "@official_events",
    age: "2h ago",
    category: "image",
    typeIcon: FiImage,
    badge: { label: "Spam Probability", confidence: 61, tone: "warn" },
    thumbIcon: FiImage,
    thumbTone: "text-report-blue",
  },
  {
    id: "m6",
    title: "Podcast Live: Uncut",
    user: "@truth_seeker",
    age: "3h ago",
    category: "audio",
    typeIcon: FiMic,
    badge: { label: "Audio Trigger", confidence: 91, tone: "danger" },
    thumbIcon: FiMic,
    thumbTone: "text-report-amber",
  },
];

const extraItems: MediaItem[] = [
  {
    id: "m7",
    title: "Aftermovie Draft",
    user: "@festival_cuts",
    age: "4h ago",
    category: "video",
    typeIcon: FiFilm,
    badge: { label: "Violence Detected", confidence: 40, tone: "warn" },
    duration: "1:12",
    thumbIcon: FiFilm,
    thumbTone: "text-bgray/40",
  },
  {
    id: "m8",
    title: "Meetup Flyer Scan",
    user: "@print_house",
    age: "5h ago",
    category: "image",
    typeIcon: FiImage,
    badge: { label: "Copyrighted", confidence: 33, tone: "danger" },
    thumbIcon: FiImage,
    thumbTone: "text-primary",
  },
];

const BADGE_CLASSES: Record<BadgeTone, string> = {
  danger: "bg-primary text-bgray",
  warn: "bg-report-amber text-grayblue",
  muted: "bg-primary/15 text-secondary",
};

const MediaModerationQueuePage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [sortValue, setSortValue] = useState("confidence");
  const [sortOpen, setSortOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [pool, setPool] = useState<MediaItem[]>(extraItems);

  const visibleItems = useMemo(
    () =>
      activeTab === "all"
        ? items
        : items.filter((item) => item.category === activeTab),
    [activeTab, items],
  );

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const loadMore = () => {
    setItems((prev) => [...prev, ...pool]);
    setPool([]);
  };

  const selectedSort = sortOptions.find((o) => o.value === sortValue);

  return (
    <div className="min-h-full bg-grayblue font-jakarta font-normal text-bgray [&_button]:font-normal [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">

        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="admin-page-title">
              Media Moderation Queue
            </h1>
            <p className="admin-page-description">
              Reviewing 24 flagged media assets pending manual verification.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {headerStats.map((stat) => (
              <div key={stat.id} className="min-w-[112px] rounded-sm bg-report-panel px-4 py-3">
                <p className="text-xs text-secondary">{stat.label}</p>
                <p
                  className={`mt-1 flex items-center gap-1.5 text-lg font-normal ${
                    stat.tone === "greenish" ? "text-green" : "text-report-alert"
                  }`}
                >
                  {stat.value}
                  {stat.trend && <FiTrendingUp size={12} />}
                </p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-6 flex flex-wrap items-center gap-3 bg-report-panel px-4 py-3">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-sm px-4 py-2 text-xs font-normal transition ${
                  activeTab === tab.id
                    ? "bg-report-alert text-grayblue"
                    : "text-secondary hover:bg-bgray/10 hover:text-bgray"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <span className="text-xs text-secondary">Sort by:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 text-sm transition hover:bg-bgray/10"
              >
                {selectedSort?.label}
                <FiChevronDown size={12} className="text-secondary" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 border border-border_color bg-report-panel py-1 shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortValue(option.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                        option.value === sortValue
                          ? "text-bgray"
                          : "text-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="flex items-center gap-2 bg-report-control px-4 py-2.5 text-sm transition hover:bg-bgray/15"
            >
              <FiFilter size={12} />
              More Filters
            </button>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.map((item) => {
            const TypeIcon = item.typeIcon;
            const ThumbIcon = item.thumbIcon;
            return (
              <article
                key={item.id}
              className="flex flex-col overflow-hidden rounded-[3px] bg-report-panel"
              >
                {item.category === "text" ? (
                  <div className="flex flex-1 flex-col items-center px-4 pb-4 pt-6 text-center">
                    <FiFileText size={22} className="text-secondary" />
                    <p className="mt-3 text-sm leading-5 text-bgray/80">
                      {item.quote}
                    </p>
                  </div>
                ) : (
                  <div className="relative flex h-40 items-center justify-center bg-grayblue">
                    {ThumbIcon && (
                      <ThumbIcon size={28} className={item.thumbTone} />
                    )}
                    <span
                      className={`absolute left-2 top-2 rounded-sm px-2 py-1 text-[10px] font-normal uppercase tracking-wide ${BADGE_CLASSES[item.badge.tone]}`}
                    >
                      {item.badge.label} {item.badge.confidence}%
                    </span>
                    {item.duration && (
                      <span className="absolute bottom-2 right-2 rounded-sm bg-grayblue/80 px-1.5 py-0.5 text-xs text-bgray">
                        {item.duration}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`flex flex-1 flex-col p-3 ${
                    item.category === "text" ? "border-t border-border_color/60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-snug">
                      {item.title}
                    </p>
                    <TypeIcon size={13} className="mt-0.5 shrink-0 text-secondary" />
                  </div>
                  <p className="mt-1 text-xs text-secondary">
                    User: {item.user} • {item.age}
                  </p>
                  {item.category !== "text" && item.quote && (
                    <p className="mt-2 text-xs italic leading-snug text-secondary">
                      {item.quote}
                    </p>
                  )}
                  {item.category === "text" && (
                    <span
                      className={`mt-2 inline-block w-fit rounded-sm px-2 py-1 text-[10px] font-normal uppercase tracking-wide ${BADGE_CLASSES[item.badge.tone]}`}
                    >
                      {item.badge.label} {item.badge.confidence}%
                    </span>
                  )}
                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex-1 bg-report-control py-2 text-xs transition hover:bg-bgray/15"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex-1 bg-primary py-2 text-xs transition hover:bg-primary/90"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-secondary">
            Showing {visibleItems.length} of {TOTAL_IN_QUEUE} items in queue
          </p>
          <button
            type="button"
            onClick={loadMore}
            disabled={pool.length === 0}
            className="flex items-center gap-2 bg-report-control px-6 py-2.5 text-sm transition hover:bg-bgray/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Load More Content
            <FiChevronDown size={12} />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MediaModerationQueuePage;
