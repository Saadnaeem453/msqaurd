import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { ChevronDown, Calendar, MapPin, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useEventStats, useEventList } from "../../../hooks/useEvents";

interface DashboardContext {
  timeframe: string;
  setTimeframe: (tf: string) => void;
}

const OrganizerDashboardOverview = () => {
  const context = useOutletContext<DashboardContext>();
  const timeframe = context?.timeframe ?? "Last month";
  const setTimeframe = context?.setTimeframe ?? (() => {});
  const [showDropdown, setShowDropdown] = useState(false);

  const { stats, loading: statsLoading, error: statsError } = useEventStats();
  const { events: upcomingEvents, loading: eventsLoading } = useEventList({
    status: "published",
    limit: 5,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary hover:text-white px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            {timeframe} <ChevronDown size={14} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1a1c22] border border-secondary/20 rounded-md shadow-lg py-1 z-30">
              {["Last week", "Last month", "Last year"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 transition-colors"
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Events"
          value={stats?.total ?? "—"}
          loading={statsLoading}
          icon={<Calendar size={18} className="text-primary" />}
        />
        <StatCard
          label="Tickets Sold"
          value={stats?.totalTicketsSold?.toLocaleString() ?? "—"}
          loading={statsLoading}
          icon={<Users size={18} className="text-green-400" />}
        />
        <StatCard
          label="Published"
          value={stats?.published ?? "—"}
          subtitle={`${stats?.upcoming ?? 0} upcoming`}
          loading={statsLoading}
          icon={<TrendingUp size={18} className="text-blue-400" />}
        />
      </div>

      {/* Error banner */}
      {statsError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm">Failed to load statistics</p>
            <p className="text-red-400/70 text-xs mt-0.5">{statsError}</p>
          </div>
        </div>
      )}

      {/* Upcoming Events & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
            <Link
              to="/organizer/events/published"
              className="text-primary text-sm hover:underline"
            >
              View All
            </Link>
          </div>

          {eventsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!eventsLoading && upcomingEvents.length === 0 && (
            <div className="text-center py-8">
              <Calendar size={28} className="text-secondary/30 mx-auto mb-2" />
              <p className="text-secondary text-sm">No upcoming events</p>
              <Link
                to="/organizer/events/create"
                className="text-primary text-sm hover:underline mt-1 inline-block"
              >
                Create your first event
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const totalCap = (event.tiers || []).reduce(
                (sum, t) => sum + (Number(t.capacity) || 0),
                0
              );
              const totalSold = (event.tiers || []).reduce(
                (sum, t) => sum + (Number(t.tickets_sold) || 0),
                0
              );
              const fillPercent =
                totalCap > 0 ? Math.round((totalSold / totalCap) * 100) : 0;

              return (
                <Link
                  key={event.id}
                  to={`/organizer/events/${event.id}`}
                  className="block hover:bg-secondary/5 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div className="flex justify-between">
                    <span className="text-white font-medium truncate">
                      {event.title}
                    </span>
                    <span className="text-secondary text-sm flex-shrink-0 ml-2">
                      {formatDate(event.event_date)}
                      {event.start_time ? `, ${event.start_time}` : ""}
                    </span>
                  </div>
                  <p className="text-secondary text-sm">
                    {event.venue_name || (event.venue_type === "online" ? "Online Event" : "TBD")}
                  </p>
                  {totalCap > 0 && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-secondary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                      <span className="text-secondary text-xs">
                        {totalSold}/{totalCap}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Event Breakdown</h3>
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <BreakdownRow
                label="Published"
                count={stats?.published ?? 0}
                total={stats?.total ?? 0}
                color="bg-green-500"
              />
              <BreakdownRow
                label="Drafts"
                count={stats?.drafts ?? 0}
                total={stats?.total ?? 0}
                color="bg-yellow-500"
              />
              <BreakdownRow
                label="Completed"
                count={stats?.completed ?? 0}
                total={stats?.total ?? 0}
                color="bg-blue-500"
              />

              <div className="pt-4 border-t border-secondary/10">
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm">Total Tickets Sold</span>
                  <span className="text-white font-bold text-lg">
                    {stats?.totalTicketsSold?.toLocaleString() ?? 0}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/organizer/events/create"
                  className="w-full block text-center bg-primary/10 hover:bg-primary/20 text-primary py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  + Create New Event
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  subtitle,
  loading,
  icon,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-secondary text-sm">{label}</p>
        {icon}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-secondary/10 rounded animate-pulse mt-1" />
      ) : (
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      )}
      {subtitle && <span className="text-secondary text-xs mt-1">{subtitle}</span>}
    </div>
  );
}

function BreakdownRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-secondary text-sm">{label}</span>
        <span className="text-white text-sm font-medium">{count}</span>
      </div>
      <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default OrganizerDashboardOverview;
