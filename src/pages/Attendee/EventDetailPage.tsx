import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Heart,
  Ticket,
  Shield,
  Play,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  attendeeEventsApi,
  AttendeeEvent,
  AttendeeEventAgenda,
  ReviewsResponse,
} from "../../services/attendee_events.service";
import { wishlistApi } from "../../services/wishlist.service";



const formatDate = (dateStr: string, timeStr: string) => {
  try {
    const d = new Date(dateStr + "T" + timeStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [event, setEvent] = useState<AttendeeEvent | null>(null);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [myReview, setMyReview] = useState<{ has_reviewed: boolean; can_review: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    attendeeEventsApi
      .get(id)
      .then((res) => {
        if (cancelled) return;
        if (res.ok && res.data) {
          const data = res.data as any;

          setEvent(data.id ? data : data.data);
        } else {
          setError(res.detail || "Event not found");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load event");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);


  useEffect(() => {
    if (!id || !event) return;
    let cancelled = false;

    attendeeEventsApi
      .getReviews(id)
      .then((res) => {
        if (cancelled) return;
        if (res.ok && res.data) {
          const data = res.data as any;
          setReviews(data);
        }
      })
      .catch(() => {
        // Silent fail — reviews are non-critical
      });


    attendeeEventsApi
      .getMyReview(id)
      .then((res) => {
        if (cancelled) return;
        if (res.ok && res.data) {
          setMyReview(res.data as any);
        }
      })
      .catch(() => {
        // Silent fail
      });


    wishlistApi
      .getWishlist()
      .then((res) => {
        if (cancelled) return;
        if (res.ok && res.data) {
          const wishlistItems = res.data as any[];
          const isInWishlist = wishlistItems.some((item) => item.event_id === id);
          setSaved(isInWishlist);
        }
      })
      .catch(() => {
        // Silent fail
      });

    return () => {
      cancelled = true;
    };
  }, [id, event]);


  const handleSaveEvent = async () => {
    if (!event?.id) return;

    if (saved) {
      const res = await wishlistApi.removeFromWishlist(event.id);
      if (res.ok) {
        setSaved(false);
      } else {
        const detail = (res as any).detail || "";
        toast.error(detail || "Failed to remove from wishlist");
      }
    } else {
      const res = await wishlistApi.addToWishlist(event.id);
      if (res.ok) {
        setSaved(true);
      } else {
        const detail = (res as any).detail || "";
        if (detail.toLowerCase().includes("already")) {
          setSaved(true);
        } else {
          toast.error(detail || "Failed to add to wishlist");
        }
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/home/events/${event?.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title || "",
          text: `Check out: ${event?.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
    setShowShare(false);
  };

  const handleBookSpot = () => {
    navigate(`/home/events/${event?.id}/plans`);
  };


  const primaryPrice = event?.tiers?.find((t) => t.is_primary)?.price;
  const priceLabel =
    primaryPrice === undefined || primaryPrice === null
      ? "TBD"
      : primaryPrice === 0
      ? "Free"
      : `$${Number(primaryPrice).toFixed(2)}`;

  const firstSpeaker = event?.speakers?.[0] || null;

  const galleryImages = (event?.gallery || [])
    .sort((a, b) => a.order - b.order)
    .map((g) => g.image_url);

  const heroImage =
    event?.hero_image ||
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&h=700&fit=crop";


  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondary text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }


  if (error || !event) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3 max-w-md px-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-white text-lg font-semibold">Event not found</h2>
          <p className="text-secondary text-sm">{error || "This event doesn't exist or has been removed."}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block mt-4 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      <div className="relative app-container-breakout">
        <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
          <img
            src={heroImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0e]/40 to-transparent" />


          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
        </div>
      </div>


      <div className="relative -mt-8">
        <div>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              {event.category}
            </span>
            {event.status === "published" && (
              <span className="flex items-center gap-2 text-secondary text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Ticket Sales
              </span>
            )}
          </div>


          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {event.title}
          </h1>


          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-secondary/70 mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className="text-primary" />
              {formatDate(event.event_date, event.start_time)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-primary" />
              {event.venue_name || event.venue_type}
            </span>
            {event.organization && (
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-primary" />
                {event.organization.name}
              </span>
            )}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="text-lg font-bold text-white">About the Event</h2>
              </div>
              <p className="text-secondary/70 text-sm leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>


            <section>
              <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
                {reviews && reviews.total_reviews > 0 ? (
                  /* Reviews exist — show summary + View Reviews button */
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{reviews.average_rating.toFixed(1)}</span>
                      <span className="text-secondary/50 text-sm">/5.0</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          className={s <= Math.round(reviews.average_rating) ? "text-primary" : "text-secondary/20"}
                          fill={s <= Math.round(reviews.average_rating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-secondary/50 text-xs uppercase tracking-wider">
                      {reviews.total_reviews} Verified Reviews
                    </span>
                    <button
                      onClick={() => navigate(`/home/events/${event.id}/reviews`)}
                      className="text-sm text-white border border-secondary/20 hover:border-secondary/40 rounded-full px-5 py-2 transition-colors"
                    >
                      View Reviews
                    </button>
                  </div>
                ) : (
                  /* No reviews yet */
                  <div className="text-center py-4">
                    <p className="text-secondary text-sm mb-3">No reviews yet</p>
                    {myReview?.can_review && (
                      <button
                        onClick={() => navigate(`/home/events/${event.id}/reviews`)}
                        className="text-sm text-primary border border-primary/30 hover:bg-primary/10 rounded-full px-5 py-2 transition-colors"
                      >
                        Write a Review
                      </button>
                    )}
                    {!myReview?.can_review && (
                      <p className="text-secondary/40 text-xs">Book this event to leave a review</p>
                    )}
                  </div>
                )}
              </div>
            </section>


            {firstSpeaker && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold text-white">Lead Speaker</h2>
                </div>
                <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 flex items-center gap-4">
                  <img
                    src={firstSpeaker.photo_url || "https://via.placeholder.com/56"}
                    alt={firstSpeaker.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{firstSpeaker.name}</h3>
                    <p className="text-secondary/50 text-sm">{firstSpeaker.title || ""}</p>
                    {firstSpeaker.bio && (
                      <p className="text-secondary/60 text-xs mt-1 line-clamp-2">{firstSpeaker.bio}</p>
                    )}
                  </div>
                </div>
              </section>
            )}


            {event.agenda && event.agenda.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold text-white">Event Schedule</h2>
                </div>
                <div className="space-y-3">
                  {event.agenda
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((item: AttendeeEventAgenda, i: number) => (
                      <div
                        key={item.id || i}
                        className="bg-[#131418] border border-secondary/10 rounded-xl p-4 flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium">{item.title}</h4>
                          <p className="text-secondary/50 text-xs mt-0.5">
                            {item.time} · {item.duration}
                            {item.speaker_name && ` · ${item.speaker_name}`}
                          </p>
                          {item.description && (
                            <p className="text-secondary/40 text-xs mt-1 line-clamp-1">{item.description}</p>
                          )}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                          {item.type}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            )}


            {galleryImages.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold text-white">Gallery</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-xl overflow-hidden border border-secondary/10"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}


            {event.video_url && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold text-white">Promotional Video</h2>
                </div>
                <a
                  href={event.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#131418] border border-secondary/10 rounded-xl p-5 text-primary text-sm hover:border-primary/30 transition-colors"
                >
                  <Play size={18} className="inline mr-2" />
                  Watch Video
                  <ChevronRight size={16} className="inline ml-2 text-secondary/40" />
                </a>
              </section>
            )}
          </div>


          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">

              <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 space-y-4">
                <div>
                  <p className="text-secondary/50 text-[11px] uppercase tracking-wider mb-1">
                    {event.tiers && event.tiers.length > 1 ? "Starting from" : "Admission"}
                  </p>
                  <p className="text-3xl font-bold text-white">{priceLabel}</p>
                  {event.tiers && event.tiers.length > 1 && (
                    <p className="text-secondary/40 text-xs mt-1">{event.tiers.length} ticket tiers available</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-secondary/60">
                    <Ticket size={14} className="text-primary" />
                    E-Ticket provided instantly
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary/60">
                    <Shield size={14} className="text-primary" />
                    Secure MSQUARED Transaction
                  </div>
                </div>

                <button
                  onClick={handleBookSpot}
                  className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
                >
                  Book Your Spot
                </button>


                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveEvent}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      saved
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-secondary/5 border-secondary/10 text-secondary hover:text-white hover:border-secondary/20"
                    }`}
                  >
                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                    {saved ? "Saved" : "Save Event"}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShare(!showShare)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-secondary/5 border border-secondary/10 text-secondary hover:text-white hover:border-secondary/20 transition-colors"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                    {showShare && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowShare(false)}
                        />
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#1a1b1f] border border-secondary/15 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={handleShare}
                            className="w-full text-left px-4 py-2.5 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors flex items-center gap-2"
                          >
                            <Share2 size={14} />
                            Copy Link
                          </button>
                          <button
                            onClick={() => {
                              toast.success("Shared to social media!");
                              setShowShare(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors flex items-center gap-2"
                          >
                            <Heart size={14} />
                            Share on Social
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>


              {(event.venue_name || event.street_address) && (
                <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-secondary/10">
                    <p className="text-[11px] text-secondary/50 uppercase tracking-wider font-semibold">
                      Location
                    </p>
                  </div>
                  <div className="relative h-40 bg-[#1a1b20]">

                    <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                      <rect width="100" height="60" fill="#1a1b20" />
                      <path d="M0 30 Q25 25 50 30 T100 30" stroke="#252630" strokeWidth="1.5" fill="none" />
                      <path d="M50 0 Q45 20 50 30 T50 60" stroke="#252630" strokeWidth="1.5" fill="none" />
                      <path d="M0 45 Q30 40 50 45 T100 42" stroke="#202128" strokeWidth="0.8" fill="none" />
                      <circle cx="50" cy="28" r="8" fill="currentColor" className="text-primary" opacity="0.15">
                        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="50" cy="28" r="3.5" fill="currentColor" className="text-primary" stroke="#1a1b20" strokeWidth="1" />
                      <circle cx="50" cy="28" r="1.5" fill="white" />
                    </svg>
                  </div>
                  <div className="px-5 py-3">
                    <p className="text-secondary/60 text-xs">
                      <MapPin size={12} className="inline mr-1 text-primary" />
                      {event.venue_name}
                      {event.street_address && <br />}
                      {event.street_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
