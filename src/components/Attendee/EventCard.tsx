import { useNavigate } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import { AttendeeEvent } from "../../services/attendee_events.service";
import { getHeroImage, getPrimaryPrice, formatEventDate, formatEventTime } from "../../hooks/useAttendeeEvents";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "Sports & Fitness": "text-red-400",
  Sports: "text-red-400",
  SOCIALS: "text-red-400",
  Social: "text-red-400",
  "Social Mixers": "text-red-400",
  LECTURE: "text-red-400",
  Lecture: "text-red-400",
  "Islamic Talks": "text-red-400",
  Workshop: "text-blue-400",
  Networking: "text-green-400",
  "Professional Networking": "text-green-400",
  "Youth Programs": "text-yellow-400",
  Charity: "text-purple-400",
  Competition: "text-orange-400",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS[category.toUpperCase()] || "text-red-400";
}

function getVenueIcon(venueType?: string) {
  if (venueType === "online") return <MapPin size={12} className="text-secondary" />;
  return <Building2 size={12} className="text-secondary" />;
}

/** Haversine distance in miles */
function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeDistance(event: AttendeeEvent, userLat?: number, userLon?: number): string | null {
  const eventLat = parseFloat(event.latitude || "");
  const eventLon = parseFloat(event.longitude || "");
  if (!userLat || !userLon || !eventLat || !eventLon) return null;
  const miles = getDistanceMiles(userLat, userLon, eventLat, eventLon);
  if (miles < 0.1) return "0.1 MILES AWAY";
  return `${miles.toFixed(1)} MILES AWAY`;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface EventCardProps {
  event: AttendeeEvent;
  userLat?: number;
  userLon?: number;
  compact?: boolean;
}

const EventCard = ({ event, userLat, userLon, compact }: EventCardProps) => {
  const navigate = useNavigate();
  const heroImg = getHeroImage(event);
  const price = getPrimaryPrice(event);
  const distance = computeDistance(event, userLat, userLon);
  const categoryColor = getCategoryColor(event.category);
  const categoryUpper = event.category.toUpperCase();

  const dateStr = formatEventDate(event.event_date);
  const timeStr = formatEventTime(event.start_time);

  const goToDetail = () => {
    navigate(`/home/events/${event.id}`);
  };

  return (
    <div
      className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group flex flex-col cursor-pointer"
      onClick={goToDetail}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {heroImg ? (
          <img
            src={heroImg}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/5 flex items-center justify-center">
            <span className="text-secondary/30 text-xs">No image</span>
          </div>
        )}

        {/* Distance overlay */}
        {distance && (
          <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            {distance}
          </span>
        )}

        {/* Gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#131418] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Category + Date/Time row */}
        <div className="flex items-start justify-between mb-1.5">
          <span className={`${categoryColor} text-[10px] font-bold uppercase tracking-wider`}>
            {categoryUpper}
          </span>
          <span className="text-secondary text-[10px] font-medium">
            {dateStr} · {timeStr}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Venue */}
        <div className="flex items-center gap-1.5 text-secondary text-xs mb-3">
          {getVenueIcon(event.venue_type)}
          <span className="truncate">{event.venue_name || "Online Event"}</span>
        </div>

        {/* Price + Book button */}
        <div className="mt-auto">
          {price && (
            <p className="text-secondary text-[10px] mb-1.5">
              From <span className="text-white font-medium">£{price.price}</span>
            </p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
            className="w-full text-center bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
