import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  Filter,
  Pencil,
  Volume2,
  Users,
  Share2,
  MoreVertical,
  Mic,
  Gamepad2,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  useEventList,
  useEventStats,
} from "../../../hooks/useEvents";
import { Event } from "../../../services/event.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function totalCapacity(event: Event): number {
  return (event.tiers || []).reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);
}

function totalSold(event: Event): number {
  return (event.tiers || []).reduce((sum, t) => sum + (Number(t.tickets_sold) || 0), 0);
}

function totalRevenue(event: Event): number {
  return (event.tiers || []).reduce((sum, t) => {
    return sum + (Number(t.price) || 0) * (Number(t.tickets_sold) || 0);
  }, 0);
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

function formatCurrencyFull(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

const PublishedEvents = () => {
  const navigate = useNavigate();
  const { events, loading } = useEventList({ status: "published", limit: 50 });
  const { stats } = useEventStats();

  // Sort events: upcoming first, then by date
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.event_date).getTime();
      const dateB = new Date(b.event_date).getTime();
      return dateA - dateB;
    });
  }, [events]);

  const now = new Date();

  // Live events = published events that are today or in the future
  const liveEvents = useMemo(() => {
    return sortedEvents.filter((e) => new Date(e.event_date) >= now);
  }, [sortedEvents, now]);

  // Past published events (for micro-event series)
  const pastEvents = useMemo(() => {
    return sortedEvents.filter((e) => new Date(e.event_date) < now);
  }, [sortedEvents, now]);

  // Compute stats from events
  const computedStats = useMemo(() => {
    let totalTicketsSold = 0;
    let totalRevenueVal = 0;
    let totalCapacityVal = 0;
    let totalSoldVal = 0;

    events.forEach((e) => {
      const sold = totalSold(e);
      const capacity = totalCapacity(e);
      totalTicketsSold += sold;
      totalRevenueVal += totalRevenue(e);
      totalCapacityVal += capacity;
      totalSoldVal += sold;
    });

    const avgCapacity = totalCapacityVal > 0 ? Math.round((totalSoldVal / totalCapacityVal) * 100) : 0;

    return {
      totalTicketsSold,
      revenue: totalRevenueVal,
      avgCapacity,
    };
  }, [events]);

  // Display values (use API stats if available, else computed)
  const displayTicketsSold = stats?.totalTicketsSold ?? computedStats.totalTicketsSold;
  const displayRevenue = computedStats.revenue;
  const displayAvgCapacity = computedStats.avgCapacity;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">Published Events</h1>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
            Live Tracking
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets Sold */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Total Tickets Sold
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              {displayTicketsSold.toLocaleString()}
            </span>
            <span className="flex items-center gap-0.5 text-green-400 text-sm font-medium mb-1">
              <TrendingUp size={14} />
              +12%
            </span>
          </div>
        </div>

        {/* Active Revenue */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Active Revenue
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white">
              {formatCurrency(displayRevenue)}
            </span>
            <DollarSign size={18} className="text-secondary/40 mb-1" />
          </div>
        </div>

        {/* Avg Capacity */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Avg. Capacity
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white">{displayAvgCapacity}%</span>
            <div className="w-16 h-2 bg-secondary/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${displayAvgCapacity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Blast Promotion */}
        <div className="bg-red-600 rounded-xl p-5 relative overflow-hidden cursor-pointer hover:bg-red-700 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Blast Promotion</p>
              <p className="text-white/70 text-xs mt-1">
                Reach 5,000+ students instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Events Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">
            Live Events ({liveEvents.length})
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary/20 text-secondary text-xs rounded-lg hover:text-white hover:border-secondary/40 transition-colors">
              <Filter size={12} /> Filter
            </button>
            <button className="px-3 py-1.5 border border-secondary/20 text-secondary text-xs rounded-lg hover:text-white hover:border-secondary/40 transition-colors">
              Sort: Newest
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : liveEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#131418] border border-secondary/10 rounded-xl">
            <Calendar size={40} className="text-secondary/30 mx-auto mb-3" />
            <h3 className="text-white text-lg font-semibold mb-1">No live events</h3>
            <p className="text-secondary text-sm">
              Publish an event to see it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {liveEvents.map((event) => (
              <LiveEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Micro-Event Series */}
      {pastEvents.length > 0 && (
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Micro-Event Series</h2>
            <button className="text-primary text-sm font-medium flex items-center gap-1 hover:text-primary/80 transition-colors">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {pastEvents.slice(0, 4).map((event) => (
              <MicroEventItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Live Event Card ─────────────────────────────────────────────────────────

const LiveEventCard = ({ event }: { event: Event }) => {
  const navigate = useNavigate();
  const sold = totalSold(event);
  const capacity = totalCapacity(event);
  const fillPercent = capacity > 0 ? Math.round((sold / capacity) * 100) : 0;
  const revenue = totalRevenue(event);

  const categoryLabels: Record<string, string> = {
    music: "Festival",
    tech: "Workshop",
    education: "Seminar",
    sports: "Tournament",
    art: "Exhibition",
    food: "Food Fair",
    business: "Conference",
  };

  const categoryLabel = categoryLabels[event.category?.toLowerCase()] || event.category?.toUpperCase() || "EVENT";

  return (
    <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group">
      {/* Hero Image */}
      <div className="relative h-44 bg-secondary/5 overflow-hidden">
        {event.hero_image ? (
          <img
            src={event.hero_image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900/40 to-[#131418] flex items-center justify-center">
            <Calendar size={40} className="text-secondary/20" />
          </div>
        )}

        {/* LIVE + Category badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </span>
          <span className="px-2.5 py-1 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/10">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg leading-tight flex-1 pr-3">
            {event.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-bold text-red-500">{fillPercent}%</span>
            <p className="text-secondary/60 text-[10px] uppercase tracking-wider">Sold</p>
          </div>
        </div>

        {/* Location */}
        {event.venue_name && (
          <p className="text-secondary text-xs flex items-center gap-1 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.venue_name}
            {event.street_address && `, ${event.street_address}`}
          </p>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-t border-b border-secondary/10">
          <div>
            <p className="text-secondary/50 text-[10px] uppercase tracking-wider mb-0.5">Tickets Sold</p>
            <p className="text-white text-sm font-semibold">
              {sold.toLocaleString()} / {capacity.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-secondary/50 text-[10px] uppercase tracking-wider mb-0.5">Revenue</p>
            <p className="text-red-400 text-sm font-semibold">
              {formatCurrencyFull(revenue)}
            </p>
          </div>
          <div>
            <p className="text-secondary/50 text-[10px] uppercase tracking-wider mb-0.5">Date</p>
            <p className="text-white text-sm font-semibold">{formatDate(event.event_date)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            <Pencil size={14} /> Edit Event
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-secondary/10 text-secondary rounded-lg hover:text-white hover:bg-secondary/20 transition-colors">
            <Volume2 size={16} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-secondary/10 text-secondary rounded-lg hover:text-white hover:bg-secondary/20 transition-colors">
            <Users size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Micro Event Item ───────────────────────────────────────────────────────

const MicroEventItem = ({ event }: { event: Event }) => {
  const sold = totalSold(event);
  const capacity = totalCapacity(event);

  const categoryIcons: Record<string, React.ReactNode> = {
    music: <Mic size={16} className="text-red-400" />,
    sports: <Gamepad2 size={16} className="text-red-400" />,
    tech: <BarChart3 size={16} className="text-red-400" />,
    education: <Calendar size={16} className="text-red-400" />,
  };

  const icon = categoryIcons[event.category?.toLowerCase()] || <Calendar size={16} className="text-red-400" />;

  return (
    <div className="flex items-center gap-4 py-3 px-3 rounded-lg hover:bg-secondary/5 transition-colors group">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{event.title}</p>
        <p className="text-secondary/50 text-xs">
          {formatDate(event.event_date)}
          {event.venue_name && ` • ${event.venue_name}`}
        </p>
      </div>

      {/* Booking info */}
      <div className="text-right flex-shrink-0 mr-2">
        <p className="text-white text-sm font-semibold">
          {sold}/{capacity}
        </p>
        <p className="text-secondary/50 text-[10px] uppercase tracking-wider">Booked</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-secondary hover:text-white transition-colors">
          <Share2 size={14} />
        </button>
        <button className="p-1.5 text-secondary hover:text-white transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  );
};

export default PublishedEvents;
