import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Edit3,
  ArrowLeft,
  Tag,
  Eye,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useEvent, useEventStatus, useDeleteEvent } from "../../../hooks/useEvents";
import { EventStatus } from "../../../services/event.service";
import ConfirmModal from "../../../components/ui/ConfirmModal";

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { event, loading, error, refetch } = useEvent(id);
  const { updateStatus, updating } = useEventStatus();
  const { deleteEvent, deleting } = useDeleteEvent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondary text-sm">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-white text-lg font-semibold">Event not found</h2>
          <p className="text-secondary text-sm">{error || "This event doesn't exist or has been deleted."}</p>
          <Link
            to="/organizer/events"
            className="inline-block mt-4 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const totalCapacity = (event.tiers || []).reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);
  const totalSold = (event.tiers || []).reduce((sum, t) => sum + (Number(t.tickets_sold) || 0), 0);
  const totalRevenue = (event.tiers || []).reduce(
    (sum, t) => sum + (Number(t.price) || 0) * (Number(t.tickets_sold) || 0),
    0
  );

  const handleStatusChange = async (newStatus: EventStatus) => {
    const success = await updateStatus(event.id, newStatus);
    if (success) await refetch();
  };

  const handleDelete = async () => {
    const success = await deleteEvent(event.id);
    if (success) navigate("/organizer/events");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <Link
          to="/organizer/events"
          className="flex items-center gap-2 text-secondary hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to Events
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 border border-secondary/20 text-secondary hover:text-white rounded-lg text-sm transition-colors"
          >
            <Edit3 size={14} /> Edit
          </button>


          {event.status === "draft" && (
            <button
              onClick={() => handleStatusChange("published")}
              disabled={updating}
              className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              Publish
            </button>
          )}
          {event.status === "published" && (
            <button
              onClick={() => handleStatusChange("completed")}
              disabled={updating}
              className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              Mark Complete
            </button>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>


      <div className="relative rounded-xl overflow-hidden h-64 bg-secondary/5">
        {event.hero_image ? (
          <img
            src={event.hero_image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={48} className="text-secondary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                statusColors[event.status] || statusColors.draft
              }`}
            >
              {event.status}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
              {event.category}
            </span>
          </div>
          <h1 className="text-white text-2xl font-bold">{event.title}</h1>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 flex items-start gap-3">
          <Calendar size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-secondary text-xs">Date</p>
            <p className="text-white text-sm font-medium">{formatDate(event.event_date)}</p>
          </div>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 flex items-start gap-3">
          <Clock size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-secondary text-xs">Time</p>
            <p className="text-white text-sm font-medium">
              {event.start_time} – {event.end_time}
              <span className="text-secondary ml-1">({event.timezone})</span>
            </p>
          </div>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 flex items-start gap-3">
          <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-secondary text-xs">Venue</p>
            <p className="text-white text-sm font-medium capitalize">
              {event.venue_name || event.venue_type}
            </p>
            {event.street_address && (
              <p className="text-secondary text-xs mt-0.5">{event.street_address}</p>
            )}
          </div>
        </div>
      </div>


      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2">About this event</h3>
        <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
          <p className="text-secondary text-xs">Tickets Sold</p>
          <p className="text-2xl font-bold text-white mt-1">{totalSold}</p>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
          <p className="text-secondary text-xs">Capacity</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCapacity}</p>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
          <p className="text-secondary text-xs">Revenue</p>
          <p className="text-2xl font-bold text-primary mt-1">£{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
          <p className="text-secondary text-xs">Fill Rate</p>
          <p className="text-2xl font-bold text-white mt-1">
            {totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0}%
          </p>
        </div>
      </div>


      {event.tiers && event.tiers.length > 0 && (
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Tag size={16} className="text-primary" /> Ticket Tiers
          </h3>
          <div className="space-y-3">
            {event.tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between bg-secondary/5 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  {tier.is_primary && (
                    <Sparkles size={14} className="text-primary" />
                  )}
                  <div>
                    <p className="text-white font-medium flex items-center gap-2">
                      {tier.name}
                      {tier.is_premium && (
                        <span className="text-[9px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                          Premium
                        </span>
                      )}
                    </p>
                    {tier.premium_description && (
                      <p className="text-secondary text-xs mt-0.5">{tier.premium_description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">£{Number(tier.price).toFixed(2)}</p>
                  <p className="text-secondary text-xs">
                    {Number(tier.tickets_sold) || 0}/{Number(tier.capacity)} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {event.speakers && event.speakers.length > 0 && (
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <User size={16} className="text-primary" /> Speakers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.speakers.map((speaker) => (
              <div key={speaker.id} className="flex items-start gap-3 bg-secondary/5 rounded-lg p-4">
                <img
                  src={speaker.photo_url || "https://via.placeholder.com/48"}
                  alt={speaker.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary/20"
                />
                <div>
                  <p className="text-white font-medium">{speaker.name}</p>
                  {speaker.title && <p className="text-primary text-xs">{speaker.title}</p>}
                  {speaker.bio && (
                    <p className="text-secondary text-xs mt-1 line-clamp-2">{speaker.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {event.agenda && event.agenda.length > 0 && (
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Agenda
          </h3>
          <div className="space-y-3">
            {event.agenda
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-secondary/5 rounded-lg p-4"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-white text-sm font-semibold">{item.time}</p>
                    <p className="text-secondary text-xs">{item.duration}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{item.title}</p>
                      <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {item.type}
                      </span>
                    </div>
                    {item.speaker_name && (
                      <p className="text-secondary text-xs mt-0.5">
                        Speaker: {item.speaker_name}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-secondary text-xs mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}


      {event.gallery && event.gallery.length > 0 && (
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Eye size={16} className="text-primary" /> Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {event.gallery
              .sort((a, b) => a.order - b.order)
              .map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-lg overflow-hidden border border-secondary/10"
                >
                  <img
                    src={img.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      )}


      {event.video_url && (
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Promotional Video</h3>
          <a
            href={event.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline break-all"
          >
            {event.video_url}
          </a>
        </div>
      )}


      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default EventDetail;
