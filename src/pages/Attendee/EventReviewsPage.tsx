import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  PenLine,
  ChevronRight,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import {
  attendeeEventsApi,
  AttendeeReview,
  ReviewsResponse,
} from "../../services/attendee_events.service";
import WriteReviewModal from "../../components/Attendee/WriteReviewModal";
import ReplyModal from "../../components/Attendee/ReplyModal";
import ConfirmModal from "../../components/ui/ConfirmModal";

const SORT_OPTIONS = ["top_rated", "most_recent", "most_helpful"];
const SORT_LABELS: Record<string, string> = {
  top_rated: "Top Rated",
  most_recent: "Most Recent",
  most_helpful: "Most Helpful",
};

const EventReviewsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("top_rated");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);


  const [showWriteReview, setShowWriteReview] = useState(false);
  const [editingReview, setEditingReview] = useState<AttendeeReview | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendeeReview | null>(null);
  const [reviewPermission, setReviewPermission] = useState<{ has_reviewed: boolean; can_review: boolean } | null>(null);


  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const ITEMS_PER_PAGE = 10;


  const fetchReviews = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await attendeeEventsApi.getReviews(id, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: sortBy,
      });

      if (res.ok && res.data) {
        const data = res.data as any;
        setReviews(data);


        const votes: Record<string, boolean> = {};
        (data.reviews || []).forEach((r: AttendeeReview) => {
          votes[r.id] = false;
        });
        setHelpfulVotes(votes);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, currentPage, sortBy]);

  useEffect(() => {
    if (!id) return;
    attendeeEventsApi.getMyReview(id).then((res) => {
      if (res.ok && res.data) setReviewPermission(res.data);
    });
  }, [id]);

  const canWriteReview = reviewPermission?.has_reviewed !== true;


  const handleHelpful = async (reviewId: string) => {
    try {
      const res = await attendeeEventsApi.toggleHelpful(reviewId);
      if (res.ok && res.data) {
        const data = res.data as any;
        setHelpfulVotes((prev) => ({ ...prev, [reviewId]: data.user_has_voted }));

        setReviews((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            reviews: prev.reviews.map((r) =>
              r.id === reviewId ? { ...r, helpful_count: data.helpful_count } : r
            ),
          };
        });
      }
    } catch {
      toast.error("Failed to toggle helpful");
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteTarget) return;
    try {
      const res = await attendeeEventsApi.deleteReview(deleteTarget.id);
      if (res.ok) {
        toast.success("Review deleted");
        setDeleteTarget(null);
        fetchReviews();
      } else {
        const msg = (res as any).detail || "";
        toast.error(msg || "Failed to delete review");
      }
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const totalPages = reviews ? Math.ceil(reviews.total_reviews / ITEMS_PER_PAGE) : 1;
  const ratingValue = Number(reviews?.average_rating);
  const averageRating = Number.isFinite(ratingValue) ? ratingValue : 0;

  return (
    <div className="max-w-6xl mx-auto py-8">

      <button
        onClick={() => navigate(-1)}
        className="text-primary text-sm font-medium flex items-center gap-1 mb-6 hover:text-primary/80 transition-colors"
      >
        <ChevronRight size={16} className="rotate-180" /> Back to Details
      </button>


      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              Past Event
            </span>
            <span className="flex items-center gap-1.5 text-secondary text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Highly Rated
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
            Spirituality in the Modern City
          </h1>
          <p className="text-secondary/60 text-sm max-w-xl leading-relaxed">
            A curated exploration of finding stillness amidst urban chaos. Hosted by the MSQUARED Leadership Collective.
          </p>
        </div>


        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-4xl font-bold text-white">
              {reviews ? averageRating.toFixed(1) : "—"}
            </span>
            <span className="text-secondary/50 text-sm">/5.0</span>
          </div>
          <div className="flex items-center gap-0.5 justify-end mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                className={
                  reviews && s <= Math.round(averageRating)
                    ? "text-primary"
                    : "text-secondary/20"
                }
                fill={reviews && s <= Math.round(averageRating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <p className="text-secondary/40 text-[10px] uppercase tracking-wider mt-1">
            {reviews ? `${reviews.total_reviews} Verified Reviews` : "—"}
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 space-y-6">

          {canWriteReview && (
            <button
              onClick={() => setShowWriteReview(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold uppercase tracking-wider py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <PenLine size={16} />
              Write a Review
            </button>
          )}


          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const breakdown = reviews?.rating_breakdown?.find((b) => b.stars === stars);
                const percent = breakdown?.percent ?? 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-secondary/60 text-xs w-3 text-right">{stars}</span>
                    <div className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-secondary/40 text-xs w-8 text-right">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>


          {reviews?.trending_tags && reviews.trending_tags.length > 0 && (
            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
              <h3 className="text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {reviews.trending_tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary text-[11px] font-medium px-3 py-1 rounded-full border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>


        <div className="lg:col-span-2 space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Community Voices</h2>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors"
              >
                Sort by: <span className="text-white">{SORT_LABELS[sortBy]}</span>
                <ChevronDown size={14} />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1b1f] border border-secondary/15 rounded-lg shadow-xl z-50 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setShowSortDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === opt
                            ? "bg-primary/10 text-primary"
                            : "text-secondary hover:text-white hover:bg-secondary/10"
                        }`}
                      >
                        {SORT_LABELS[opt]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>


          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#131418] border border-secondary/10 rounded-xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10" />
                    <div className="flex-1">
                      <div className="h-3 bg-secondary/10 rounded w-24 mb-1" />
                      <div className="h-2 bg-secondary/10 rounded w-32" />
                    </div>
                  </div>
                  <div className="h-3 bg-secondary/10 rounded w-full mb-2" />
                  <div className="h-3 bg-secondary/10 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : reviews && reviews.reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#131418] border border-secondary/10 rounded-xl p-5"
                >

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.user_avatar || "https://via.placeholder.com/40"}
                        alt={review.user_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{review.user_name}</p>
                        <p className="text-secondary/40 text-[11px]">
                          {review.is_verified ? "Verified Attendee" : "Attendee"} ·{" "}
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= review.rating ? "text-primary" : "text-secondary/20"}
                            fill={s <= review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>

                      {review.is_owner && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => setEditingReview(review)}
                            className="text-secondary/40 hover:text-primary transition-colors p-1"
                            title="Edit review"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(review)}
                            className="text-secondary/40 hover:text-red-400 transition-colors p-1"
                            title="Delete review"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>


                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary/10 text-primary text-[9px] font-medium px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}


                  <p className="text-secondary/70 text-sm leading-relaxed mb-4">
                    {review.comment}
                  </p>


                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        helpfulVotes[review.id]
                          ? "text-primary"
                          : "text-secondary/50 hover:text-primary"
                      }`}
                    >
                      <ThumbsUp size={12} fill={helpfulVotes[review.id] ? "currentColor" : "none"} />
                      Helpful ({review.helpful_count})
                    </button>
                    <button
                      onClick={() => setReplyTarget({ id: review.id, name: review.user_name })}
                      className="flex items-center gap-1.5 text-secondary/50 hover:text-white text-xs transition-colors"
                    >
                      <MessageSquare size={12} />
                      Reply
                    </button>
                  </div>


                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-6 border-l-2 border-secondary/10">
                      {review.replies.map((reply) => (
                        <div key={reply.id}>
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={reply.user_avatar || "https://via.placeholder.com/32"}
                              alt={reply.user_name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-white text-xs font-medium">{reply.user_name}</span>
                            <span className="text-secondary/30 text-[10px]">
                              ·{" "}
                              {new Date(reply.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-secondary/60 text-xs ml-8">{reply.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#131418] border border-secondary/10 rounded-xl">
              <MessageSquare className="text-secondary/30 mx-auto mb-3" size={32} />
              <h3 className="text-white text-lg font-semibold mb-1">No reviews yet</h3>
              <p className="text-secondary text-sm mb-4">Be the first to review this event!</p>
              {canWriteReview && (
                <button
                  onClick={() => setShowWriteReview(true)}
                  className="text-sm text-primary border border-primary/30 hover:bg-primary/10 rounded-full px-5 py-2 transition-colors"
                >
                  Write a Review
                </button>
              )}
            </div>
          )}


          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "bg-[#1e1f25] text-secondary hover:text-white hover:bg-secondary/20"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      <WriteReviewModal
        open={showWriteReview}
        onClose={() => {
          setShowWriteReview(false);
          setEditingReview(null);
        }}
        eventId={id || ""}
        onSuccess={() => {
          void fetchReviews();
          if (id) {
            attendeeEventsApi.getMyReview(id).then((res) => {
              if (res.ok && res.data) setReviewPermission(res.data);
            });
          }
        }}
        editReview={editingReview ? {
          id: editingReview.id,
          rating: editingReview.rating,
          comment: editingReview.comment,
          tags: editingReview.tags || [],
        } : null}
      />

      <ReplyModal
        open={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        reviewId={replyTarget?.id || ""}
        reviewerName={replyTarget?.name || ""}
        onSuccess={fetchReviews}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        message="Are you sure you want to delete your review? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
};

export default EventReviewsPage;
