import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Tag,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  useEventList,
  useEventStatus,
  useDeleteEvent,
} from "../../../hooks/useEvents";
import { Event, EventStatus } from "../../../services/event.service";
import ConfirmModal from "../../../components/ui/ConfirmModal";



const statusFilters: { label: string; value: EventStatus | "all"; path: string }[] = [
  { label: "All Events", value: "all", path: "/organizer/events" },
  { label: "Drafts", value: "draft", path: "/organizer/events/drafts" },
  { label: "Published", value: "published", path: "/organizer/events/published" },
  { label: "Past Events", value: "completed", path: "/organizer/events/past" },
];

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const statusActions: Record<string, { label: string; status: EventStatus; color: string }[]> = {
  draft: [
    { label: "Publish", status: "published", color: "text-green-400 hover:bg-green-500/10" },
    { label: "Cancel", status: "cancelled", color: "text-red-400 hover:bg-red-500/10" },
  ],
  published: [
    { label: "Mark Complete", status: "completed", color: "text-blue-400 hover:bg-blue-500/10" },
    { label: "Cancel", status: "cancelled", color: "text-red-400 hover:bg-red-500/10" },
  ],
  cancelled: [
    { label: "Restore as Draft", status: "draft", color: "text-yellow-400 hover:bg-yellow-500/10" },
  ],
  completed: [],
};



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



const EventList = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const activeFilter = useMemo<EventStatus | "all">(() => {
    const path = location.pathname;
    if (path.endsWith("/drafts")) return "draft";
    if (path.endsWith("/published")) return "published";
    if (path.endsWith("/past")) return "completed";
    return "all";
  }, [location.pathname]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);


  useEffect(() => {
    setCurrentPage(1);
  }, [location.pathname]);

  const { events, loading, error, pagination, refetch } = useEventList({
    status: activeFilter === "all" ? undefined : activeFilter,
    page: currentPage,
    limit: 12,
  });
  const { updateStatus, updating } = useEventStatus();
  const { deleteEvent, deleting } = useDeleteEvent();


  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue_name?.toLowerCase().includes(q)
    );
  }, [events, search]);

  const handleStatusChange = async (event: Event, newStatus: EventStatus) => {
    const success = await updateStatus(event.id, newStatus);
    if (success) {
      await refetch();
      setOpenMenuId(null);
    }
  };

  const handleDelete = (event: Event) => {
    setDeleteTarget(event);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const success = await deleteEvent(deleteTarget.id);
    if (success) {
      toast.success(`"${deleteTarget.title}" deleted`);
      await refetch();
      setOpenMenuId(null);
    }
    setDeleteTarget(null);
  };

  const handleDuplicate = (event: Event) => {

    navigate("/organizer/events/create", {
      state: { duplicateFrom: event },
    });
    toast.info("Duplicate event created as draft");
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {statusFilters.find((f) => f.value === activeFilter)?.label || "All Events"}
          </h1>
          <p className="text-secondary text-sm mt-1">
            {pagination.total} event{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          to="/organizer/events/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Create Event
        </Link>
      </div>


      <div className="flex gap-2 border-b border-secondary/10 pb-0">
        {statusFilters.map((filter) => {
          const isActive = filter.value === activeFilter;
          return (
            <Link
              key={filter.value}
              to={filter.path}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                isActive
                  ? "text-white bg-secondary/10 border-b-2 border-primary"
                  : "text-secondary hover:text-white hover:bg-secondary/5"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>


      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by name, category, or venue..."
          className="w-full bg-[#131418] border border-secondary/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm outline-none placeholder:text-secondary focus:border-primary/50 transition-colors"
        />
      </div>


      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}


      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium text-sm">Failed to load events</p>
            <p className="text-red-400/70 text-xs mt-1">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="ml-auto text-red-400 hover:text-red-300 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}


      {!loading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} className="text-secondary" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-1">
            {search ? "No events found" : "No events yet"}
          </h3>
          <p className="text-secondary text-sm mb-6">
            {search
              ? `No events match "${search}"`
              : "Create your first event to get started"}
          </p>
          {!search && (
            <Link
              to="/organizer/events/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Create Event
            </Link>
          )}
        </div>
      )}


      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isOpen={openMenuId === event.id}
              onToggleMenu={() =>
                setOpenMenuId(openMenuId === event.id ? null : event.id)
              }
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              menuDisabled={updating || deleting}
            />
          ))}
        </div>
      )}


      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-secondary/10">
          <p className="text-secondary text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-white text-sm px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}


      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};



interface EventCardProps {
  event: Event;
  isOpen: boolean;
  onToggleMenu: () => void;
  onStatusChange: (event: Event, status: EventStatus) => void;
  onDelete: (event: Event) => void;
  onDuplicate: (event: Event) => void;
  menuDisabled: boolean;
}

const EventCard = ({
  event,
  isOpen,
  onToggleMenu,
  onStatusChange,
  onDelete,
  onDuplicate,
  menuDisabled,
}: EventCardProps) => {
  const navigate = useNavigate();
  const sold = totalSold(event);
  const capacity = totalCapacity(event);
  const fillPercent = capacity > 0 ? Math.round((sold / capacity) * 100) : 0;

  return (
    <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group">

      <div className="relative h-36 bg-secondary/5">
        {event.hero_image ? (
          <img
            src={event.hero_image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={32} className="text-secondary/30" />
          </div>
        )}


        <span
          className={`absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
            statusColors[event.status] || statusColors.draft
          }`}
        >
          {event.status}
        </span>


        {event.category && (
          <span className="absolute top-2 right-10 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-black/50 text-white border border-white/10">
            {event.category}
          </span>
        )}


        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded transition-colors"
        >
          <MoreVertical size={14} />
        </button>


        {isOpen && (
          <div className="absolute top-8 right-2 w-44 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-lg py-1 z-20">
            <button
              onClick={() => {
                navigate(`/organizer/events/${event.id}`);
                onToggleMenu();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <Eye size={14} /> View Details
            </button>
            <button
              onClick={() => {
                navigate(`/organizer/events/${event.id}/edit`);
                onToggleMenu();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <Edit3 size={14} /> Edit Event
            </button>
            <button
              onClick={() => {
                onDuplicate(event);
                onToggleMenu();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <Copy size={14} /> Duplicate
            </button>


            {(statusActions[event.status] || []).map((action) => (
              <button
                key={action.status}
                onClick={() => {
                  onStatusChange(event, action.status);
                }}
                disabled={menuDisabled}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors disabled:opacity-50 ${action.color}`}
              >
                <Tag size={14} /> {action.label}
              </button>
            ))}

            <div className="border-t border-secondary/10 my-1" />
            <button
              onClick={() => onDelete(event)}
              disabled={menuDisabled}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>


      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold truncate">{event.title}</h3>
          <p className="text-secondary text-sm mt-0.5 line-clamp-2">
            {event.summary || event.description?.slice(0, 100) || "No description"}
          </p>
        </div>


        <div className="flex items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {formatDate(event.event_date)}
          </span>
          {event.venue_name && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={12} /> {event.venue_name}
            </span>
          )}
        </div>


        {capacity > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-secondary flex items-center gap-1">
                <Users size={12} /> {sold}/{capacity}
              </span>
              <span className="text-secondary">{fillPercent}%</span>
            </div>
            <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  fillPercent >= 80
                    ? "bg-green-500"
                    : fillPercent >= 40
                      ? "bg-primary"
                      : "bg-yellow-500"
                }`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        )}


        <div className="flex gap-2 pt-1">
          <button
            onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
            className="flex-1 py-1.5 text-xs text-secondary hover:text-white border border-secondary/10 hover:border-secondary/20 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => navigate(`/organizer/events/${event.id}`)}
            className="flex-1 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventList;
