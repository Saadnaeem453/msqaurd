import { useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecommendedEvents, useAllEvents } from "../../hooks/useAttendeeEvents";
import HeroCarousel from "../../components/Attendee/HeroCarousel";
import CategoryBrowser from "../../components/Attendee/CategoryBrowser";
import EventCard from "../../components/Attendee/EventCard";

// ─── Default user location (London) ────────────────────────────────────────
// In production, this would come from the user's profile or geolocation API
const DEFAULT_USER_LAT = 51.5074;
const DEFAULT_USER_LON = -0.1278;

const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  // Recommended events (For You hero + first set of cards)
  const { events: recommended, loading: recommendedLoading, error: recommendedError } =
    useRecommendedEvents();

  // All events (filtered by category for the "Recommended For You" grid)
  const {
    events: allEvents,
    loading: allLoading,
    error: allError,
  } = useAllEvents({
    category: activeCategory === "all" ? undefined : activeCategory,
    limit: 6,
  });

  // For the hero carousel, use recommended events (up to 3)
  const heroEvents = useMemo(() => recommended.slice(0, 3), [recommended]);

  // For the event grid, show all events (or recommended if all events is empty)
  const gridEvents = useMemo(() => {
    if (allEvents.length > 0) return allEvents;
    // Fallback to recommended events
    return recommended.filter((e) => e.status === "published");
  }, [allEvents, recommended]);

  // Loading states
  const isHeroLoading = recommendedLoading;
  const isGridLoading = allLoading || (activeCategory === "all" && recommendedLoading);

  return (
    <div className="space-y-8 w-full">
      {/* ── Hero Carousel: "For You" ─────────────────────────── */}
      <section>
        <HeroCarousel events={heroEvents} loading={isHeroLoading} />
      </section>

      {/* ─ Browse Categories ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Browse Categories</h3>
        </div>
        <CategoryBrowser
          activeCategory={activeCategory}
          onCategoryChange={(value) => {
            if (value === "all") {
              setActiveCategory("all");
            } else {
              navigate(`/home/category/${encodeURIComponent(value)}`);
            }
          }}
          onSeeAll={() => navigate("/home/explore")}
        />
      </section>

      {/* ─ Recommended For You ──────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recommended For You</h3>
          <span className="text-secondary text-xs flex items-center gap-1">
            <MapPin size={12} /> Near London, UK
          </span>
        </div>

        {/* Error */}
        {(recommendedError || allError) && !isGridLoading && gridEvents.length === 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400 text-sm">Failed to load events</p>
            <p className="text-red-400/60 text-xs mt-1">
              {recommendedError || allError}
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isGridLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-secondary/10" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-secondary/10 rounded w-16" />
                  <div className="h-4 bg-secondary/10 rounded w-3/4" />
                  <div className="h-3 bg-secondary/10 rounded w-1/2" />
                  <div className="h-8 bg-secondary/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isGridLoading && gridEvents.length === 0 && (
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-secondary/40" />
            </div>
            <h4 className="text-white text-lg font-semibold mb-1">No events found</h4>
            <p className="text-secondary text-sm">
              {activeCategory !== "all"
                ? `No events in "${activeCategory}" yet. Try another category.`
                : "No events available right now. Check back soon!"}
            </p>
          </div>
        )}

        {/* Event cards grid */}
        {!isGridLoading && gridEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userLat={DEFAULT_USER_LAT}
                userLon={DEFAULT_USER_LON}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
