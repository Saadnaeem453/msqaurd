import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AttendeeEvent } from "../../services/attendee_events.service";
import { getHeroImage } from "../../hooks/useAttendeeEvents";

interface HeroCarouselProps {
  events: AttendeeEvent[];
  loading?: boolean;
}

const CATEGORY_MAP: Record<string, string> = {
  Lecture: "Islamic Talks",
  Workshop: "Workshop",
  Networking: "Professional Networking",
  Social: "Social Mixers",
  Competition: "Sports & Fitness",
  "Islamic Talks": "Islamic Talks",
  "Sports & Fitness": "Sports & Fitness",
  "Social Mixers": "Social Mixers",
  "Professional Networking": "Professional Networking",
  "Youth Programs": "Youth Programs",
  Charity: "Charity",
};

const HeroCarousel = ({ events, loading }: HeroCarouselProps) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index < 0 ? events.length - 1 : index >= events.length ? 0 : index);
    },
    [events.length]
  );

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      goTo(current + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, events.length, goTo]);

  if (loading) {
    return (
      <div className="relative w-full h-[320px] md:h-[420px] bg-secondary/5 rounded-2xl overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="relative w-full h-[280px] bg-[#131418] border border-secondary/10 rounded-2xl flex items-center justify-center">
        <p className="text-secondary text-sm">No recommended events yet</p>
      </div>
    );
  }

  const event = events[current];
  const heroImg = getHeroImage(event);
  const categoryLabel = CATEGORY_MAP[event.category] || event.category;

  const goToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/home/events/${event.id}`);
  };

  return (
    <div
      className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/home/events/${event.id}`)}
    >
      {/* Background image */}
      {heroImg ? (
        <img
          src={heroImg}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/10" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            FOR YOU
          </span>
          <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded border border-white/10">
            {categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight max-w-xl">
          {event.title}
        </h2>

        {/* Description */}
        <p className="text-white/70 text-sm md:text-base mt-2 max-w-lg line-clamp-2">
          {event.summary || event.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={goToDetail}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Book Your Spot
          </button>
          <button
            onClick={goToDetail}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-5 py-2.5 rounded-lg border border-white/10 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo(current - 1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo(current + 1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {events.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === current ? "w-6 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
