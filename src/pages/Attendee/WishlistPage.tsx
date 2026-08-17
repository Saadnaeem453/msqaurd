import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Heart, Grid3x3, List, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { wishlistApi, WishlistItem } from "../../services/wishlist.service";

interface WishlistEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  badge?: string;
}

const formatDate = (dateStr: string, timeStr?: string) => {
  try {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return { month, day, year: year.toString() };
  } catch {
    return { month: "TBD", day: "", year: "" };
  }
};

const WishlistPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlistEvents, setWishlistEvents] = useState<WishlistEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await wishlistApi.getWishlist();
        if (res.ok && res.data) {
          const items = res.data as WishlistItem[];
          const events: WishlistEvent[] = items.map((item) => {
            const dateInfo = formatDate(item.event.event_date, item.event.start_time);
            const primaryTier = item.event.tiers?.find((t) => t.is_primary);
            const price = primaryTier ? `$${Number(primaryTier.price).toFixed(2)}` : "Free";
            return {
              id: item.event.id,
              title: item.event.title,
              category: item.event.category || "",
              date: `${dateInfo.month} ${dateInfo.day}, ${dateInfo.year}`,
              time: item.event.start_time || "",
              location: item.event.venue_name || "TBD",
              price,
              image: item.event.hero_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
              badge: item.event.status === "published" ? undefined : item.event.status?.toUpperCase(),
            };
          });
          setWishlistEvents(events);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (eventId: string) => {
    try {
      const res = await wishlistApi.removeFromWishlist(eventId);
      if (res.ok) {
        setWishlistEvents((prev) => prev.filter((event) => event.id !== eventId));
      } else {
        const detail = (res as any).detail || "";
        toast.error(detail || "Failed to remove from wishlist");
      }
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  return (
    <div className="w-full py-8">
      {/*  Breadcrumb ─────────────────────────────────── */}
      <div className="text-secondary text-sm mb-4">
        Dashboard &gt; Saved Events
      </div>

      {/*  Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-2">
            Your Wishlist
          </h1>
          <p className="text-secondary text-sm max-w-xl">
            Curated collection of the most anticipated events. Don't let these moments slip away.
          </p>
        </div>
        <div className="flex items-center bg-[#1a1b20] rounded-lg p-1 border border-secondary/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-secondary/20 text-white"
                : "text-secondary hover:text-white"
            }`}
          >
            <Grid3x3 size={14} />
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-secondary/20 text-white"
                : "text-secondary hover:text-white"
            }`}
          >
            <List size={14} />
            List
          </button>
        </div>
      </div>

      {/* ─ Wishlist Items ─────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wishlistEvents.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              : "space-y-4"
          }
        >
          {wishlistEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden relative group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                {event.badge && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {event.badge}
                  </span>
                )}
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {event.category}
                </span>
                <button
                  onClick={() => removeFromWishlist(event.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-jakarta text-white text-lg font-semibold mb-2 line-clamp-1">
                  {event.title}
                </h3>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Calendar size={12} className="text-secondary/60" />
                    <span>
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <MapPin size={12} className="text-secondary/60" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary/10">
                  <div>
                    <p className="text-[10px] text-secondary/60 uppercase tracking-wider">
                      Starting from
                    </p>
                    <p className="text-white text-lg font-bold">{event.price}</p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Explore More Card */}
          {viewMode === "grid" && (
            <div className="border-2 border-dashed border-secondary/20 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                <Plus size={20} className="text-secondary" />
              </div>
              <p className="text-white text-sm font-medium mb-1">Explore More</p>
              <p className="text-secondary text-xs">Keep adding events to your wishlist</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart size={40} className="text-secondary/30 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-1">Your wishlist is empty</h3>
          <p className="text-secondary text-sm mb-4">
            Start exploring and save events you're interested in.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Explore Events
          </button>
        </div>
      )}

      {/* ─ Discover Events Section ────────────────────── */}
      <div className="mt-12 relative bg-[#131418] border border-secondary/10 rounded-2xl p-8 md:p-12 overflow-hidden">
        {/* Gradient effect in top-right corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-secondary/20 via-secondary/5 to-transparent rounded-bl-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              CURATED FOR YOU
            </p>
            <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-white mb-3">
              Discover events you'll love
            </h2>
            <p className="text-secondary text-sm mb-2">
              Our AI suggests events based on your saved items and past attendance.
            </p>
            <p className="text-secondary text-sm mb-6">
              Explore the latest workshops and concerts tailored to your profile.
            </p>
            <button className="bg-white hover:bg-white/90 text-black text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
              View Recommendations
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Decorative images */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg bg-secondary/20 border border-secondary/10 flex items-center justify-center">
              <Grid3x3 size={24} className="text-secondary/40" />
            </div>
            <div className="w-20 h-20 rounded-lg bg-secondary/20 border border-secondary/10 flex items-center justify-center -ml-4">
              <Calendar size={24} className="text-secondary/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
