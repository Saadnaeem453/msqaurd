import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Filter,
  Plus,
  ArrowRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Music,
  Mic,
  Zap,
} from "lucide-react";
import { useEventList } from "../../../hooks/useEvents";
import { Event } from "../../../services/event.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${date}, ${time}`;
  } catch {
    return dateStr;
  }
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(dateStr);
}

/**
 * Calculate draft completion percentage based on filled fields.
 */
function getCompletionPercent(event: Event): number {
  let filled = 0;
  let total = 10;

  // Basics (3)
  if (event.title?.trim()) filled++;
  if (event.category?.trim()) filled++;
  if (event.description?.trim()) filled++;

  // Venue (4)
  if (event.event_date) filled++;
  if (event.start_time) filled++;
  if (event.end_time) filled++;
  if (event.venue_name?.trim()) filled++;

  // Tickets (1)
  if ((event.tiers || []).length > 0) filled++;

  // Design (1)
  if (event.hero_image) filled++;

  // Speakers (1) — optional but counts
  if ((event.speakers || []).length > 0) filled++;

  // Agenda (1) — optional but counts
  if ((event.agenda || []).length > 0) filled++;

  return Math.round((filled / total) * 100);
}

function getDraftIssues(event: Event): string[] {
  const issues: string[] = [];
  if (!event.title?.trim()) issues.push("Title missing");
  if (!event.category?.trim()) issues.push("Category missing");
  if (!event.description?.trim()) issues.push("Description missing");
  if (!event.event_date) issues.push("Event date missing");
  if (!event.start_time) issues.push("Start time missing");
  if (!event.venue_name?.trim()) issues.push("Venue missing");
  if ((event.tiers || []).length === 0) issues.push("No ticket tiers");
  if (!event.hero_image) issues.push("Banner missing");
  return issues;
}

const categoryIcons: Record<string, React.ReactNode> = {
  music: <Music size={18} className="text-red-400" />,
  sports: <Gamepad2 size={18} className="text-red-400" />,
  tech: <Zap size={18} className="text-red-400" />,
  education: <GraduationCap size={18} className="text-red-400" />,
  art: <Mic size={18} className="text-red-400" />,
};

// ─── Component ───────────────────────────────────────────────────────────────

const DraftEvents = () => {
  const navigate = useNavigate();
  const { events, loading, refetch } = useEventList({ status: "draft", limit: 50 });

  // Sort: most recently updated first
  const sortedDrafts = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
      const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [events]);

  // Categorize drafts
  const drafts = useMemo(() => {
    return sortedDrafts.map((event) => {
      const completion = getCompletionPercent(event);
      const issues = getDraftIssues(event);
      return { event, completion, issues };
    });
  }, [sortedDrafts]);

  const nearCompletion = drafts.filter((d) => d.completion >= 60).length;
  const needsAttention = drafts.filter((d) => d.completion < 60).length;
  const readyToReview = drafts.filter((d) => d.completion >= 80 && d.issues.length <= 1).length;

  const totalIncomplete = drafts.length;

  // Top priority draft (highest completion)
  const topPriority = drafts.length > 0 ? drafts.reduce((max, d) => d.completion > max.completion ? d : max, drafts[0]) : null;

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Draft Events</h1>
          <p className="text-secondary text-sm mt-1 max-w-lg">
            You have {totalIncomplete} incomplete event setup{totalIncomplete !== 1 ? "s" : ""}. Pick up where you left off to get your event live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-secondary/20 text-secondary text-sm rounded-lg hover:text-white hover:border-secondary/40 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <Link
            to="/organizer/events/create"
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} /> New Draft
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-16 bg-[#131418] border border-secondary/10 rounded-xl">
          <Calendar size={40} className="text-secondary/30 mx-auto mb-3" />
          <h3 className="text-white text-lg font-semibold mb-1">No draft events</h3>
          <p className="text-secondary text-sm mb-6">
            Start creating your first event
          </p>
          <Link
            to="/organizer/events/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Create Event
          </Link>
        </div>
      ) : (
        <>
          {/* Main draft cards — top 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {drafts.slice(0, 2).map(({ event, completion, issues }) => (
              <DraftCard
                key={event.id}
                event={event}
                completion={completion}
                issues={issues}
              />
            ))}
          </div>

          {/* Smaller draft cards + Draft Health */}
          {drafts.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {drafts.slice(2, 5).map(({ event, completion, issues }) => (
                <SmallDraftCard
                  key={event.id}
                  event={event}
                  completion={completion}
                  issues={issues}
                />
              ))}

              {/* Draft Health Card */}
              <div className="bg-[#1a1c22] border border-secondary/10 rounded-xl p-5">
                <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-4">
                  Draft Health
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary text-sm">Near Completion</span>
                    <span className="text-white font-bold text-lg">{String(nearCompletion).padStart(2, "0")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary text-sm">Needs Attention</span>
                    <span className="text-red-400 font-bold text-lg">{String(needsAttention).padStart(2, "0")}</span>
                  </div>
                </div>

                {topPriority && (
                  <div className="mt-4 pt-3 border-t border-secondary/10">
                    <p className="text-secondary/60 text-xs italic">
                      "Focus on finishing '{topPriority.event.title}' first. It's closest to the publishing deadline."
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Large Draft Card ────────────────────────────────────────────────────────

const DraftCard = ({
  event,
  completion,
  issues,
}: {
  event: Event;
  completion: number;
  issues: string[];
}) => {
  const navigate = useNavigate();
  const updatedAt = event.updated_at || event.created_at || "";
  const totalCapacity = (event.tiers || []).reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);

  const statusLabel = completion >= 80 ? "Ready to Review" : completion >= 50 ? "In Progress" : "Just Started";
  const statusColor = completion >= 80 ? "text-green-400" : completion >= 50 ? "text-yellow-400" : "text-secondary";

  return (
    <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors">
      <div className="flex flex-col sm:flex-row">
        {/* Hero / Image area */}
        <div className="relative sm:w-2/5 h-40 sm:h-auto bg-secondary/5 flex-shrink-0">
          {event.hero_image ? (
            <img
              src={event.hero_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-[#131418] flex items-center justify-center">
              <Calendar size={36} className="text-secondary/20" />
            </div>
          )}

          {/* Completion badge */}
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full border border-white/10">
              <span className={`w-1.5 h-1.5 rounded-full ${completion >= 60 ? "bg-green-400" : "bg-yellow-400"}`} />
              {completion}% Complete
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {/* Status + Last edited */}
            <div className="flex items-start justify-between mb-2">
              <span className={`${statusColor} text-[10px] uppercase tracking-wider font-bold`}>
                {statusLabel}
              </span>
              <span className="text-secondary/50 text-[10px]">
                Last Edited {timeAgo(updatedAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-lg leading-tight mb-3">
              {event.title || "Untitled Event"}
            </h3>

            {/* Info boxes */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-secondary/5 rounded-lg px-3 py-2">
                <p className="text-secondary/50 text-[10px] uppercase tracking-wider">Venue</p>
                <p className="text-white text-xs font-medium truncate">
                  {event.venue_name || "Not set"}
                </p>
              </div>
              <div className="bg-secondary/5 rounded-lg px-3 py-2">
                <p className="text-secondary/50 text-[10px] uppercase tracking-wider">Expected Reach</p>
                <p className="text-white text-xs font-medium">
                  {totalCapacity > 0 ? `${totalCapacity.toLocaleString()}+ Attendees` : "Not set"}
                </p>
              </div>
            </div>

            {/* Issues */}
            {issues.length > 0 && issues.length <= 2 && (
              <p className="text-secondary/60 text-xs mb-3">
                {issues.join(", ")}...
              </p>
            )}
          </div>

          {/* Bottom: avatars + action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-2">
              <div className="w-7 h-7 rounded-full bg-red-500/20 border-2 border-[#131418] flex items-center justify-center text-[10px] text-red-400 font-bold">
                JD
              </div>
              <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-[#131418] flex items-center justify-center text-[10px] text-primary font-bold">
                MK
              </div>
            </div>

            <button
              onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Resume Setup <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Small Draft Card ────────────────────────────────────────────────────────

const SmallDraftCard = ({
  event,
  completion,
  issues,
}: {
  event: Event;
  completion: number;
  issues: string[];
}) => {
  const navigate = useNavigate();
  const updatedAt = event.updated_at || event.created_at || "";
  const hasBanner = !!event.hero_image;
  const isReady = completion >= 80 && issues.length <= 1;

  return (
    <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 hover:border-secondary/20 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
          {categoryIcons[event.category?.toLowerCase()] || <Calendar size={18} className="text-red-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{event.title || "Untitled"}</p>
          <p className="text-secondary/50 text-xs">Edited {timeAgo(updatedAt)}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {isReady ? (
            <>
              <CheckCircle2 size={12} className="text-green-400" />
              <span className="text-green-400 text-xs">Ready to review</span>
            </>
          ) : !hasBanner ? (
            <>
              <AlertTriangle size={12} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs">Banner Missing</span>
            </>
          ) : (
            <>
              <div className={`w-2 h-2 rounded-full ${completion >= 60 ? "bg-green-400" : "bg-yellow-400"}`} />
              <span className="text-secondary text-xs">{completion}% complete</span>
            </>
          )}
        </div>
        <button
          onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
          className="text-primary text-xs font-medium hover:text-primary/80 transition-colors"
        >
          Resume
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            completion >= 80 ? "bg-green-500" : completion >= 50 ? "bg-primary" : "bg-red-500"
          }`}
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  );
};

export default DraftEvents;
