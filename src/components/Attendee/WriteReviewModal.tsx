import { useState, useEffect, useRef } from "react";
import { Star, X } from "lucide-react";
import {
  attendeeEventsApi,
  CreateReviewPayload,
  REVIEW_TAGS,
} from "../../services/attendee_events.service";
import { toast } from "sonner";

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess?: () => void;
  editReview?: {
    id: string;
    rating: number;
    comment: string;
    tags: string[];
  } | null;
}

const MIN_COMMENT = 10;
const MAX_COMMENT = 2000;
const MAX_TAGS = 5;

const WriteReviewModal = ({
  open,
  onClose,
  eventId,
  onSuccess,
  editReview,
}: WriteReviewModalProps) => {
  const [rating, setRating] = useState(editReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(editReview?.comment || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(editReview?.tags || []);
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset form when modal opens or editReview changes
  useEffect(() => {
    if (open) {
      setRating(editReview?.rating || 0);
      setComment(editReview?.comment || "");
      setSelectedTags(editReview?.tags || []);
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [open, editReview]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < MAX_TAGS
          ? [...prev, tag]
          : prev
    );
  };

  const isValid =
    rating >= 1 &&
    rating <= 5 &&
    comment.trim().length >= MIN_COMMENT &&
    comment.trim().length <= MAX_COMMENT;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);

    try {
      const payload: CreateReviewPayload = {
        rating,
        comment: comment.trim(),
        tags: selectedTags,
      };

      const res = editReview
        ? await attendeeEventsApi.updateReview(editReview.id, payload)
        : await attendeeEventsApi.createReview(eventId, payload);

      if (res.ok) {
        toast.success(editReview ? "Review updated!" : "Review submitted!");
        onSuccess?.();
        onClose();
      } else {
        const msg = (res as any).detail || "";
        if (msg.toLowerCase().includes("already")) {
          toast.error("You have already reviewed this event");
        } else if (msg.toLowerCase().includes("book")) {
          toast.error("You must book this event to leave a review");
        } else if (msg) {
          toast.error(msg);
        } else {
          toast.error("Failed to submit review. Please try again.");
        }
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#131418] border border-secondary/15 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/10">
          <h2 className="text-white text-lg font-semibold">
            {editReview ? "Edit Your Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary/40 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Rating */}
          <div>
            <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-3">
              YOUR RATING
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      star <= (hoverRating || rating)
                        ? "text-primary"
                        : "text-secondary/20"
                    }
                    fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-white text-sm ml-3">{rating}/5</span>
              )}
            </div>
            {rating === 0 && (
              <p className="text-red-400/60 text-xs mt-2">Please select a rating</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-3">
              YOUR REVIEW
            </label>
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience at this event... (min 10 characters)"
              rows={5}
              maxLength={MAX_COMMENT}
              className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-3 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-secondary/40 text-xs">
                {comment.length < MIN_COMMENT && comment.length > 0
                  ? `${MIN_COMMENT - comment.length} more characters needed`
                  : "Minimum 10 characters"}
              </p>
              <p className={`text-xs ${comment.length > MAX_COMMENT - 100 ? "text-red-400" : "text-secondary/40"}`}>
                {comment.length}/{MAX_COMMENT}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-3">
              TAGS ({selectedTags.length}/{MAX_TAGS})
            </label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    disabled={!isSelected && selectedTags.length >= MAX_TAGS}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-secondary/5 text-secondary border-secondary/10 hover:border-secondary/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-secondary/10">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {editReview ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewModal;
