import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { attendeeEventsApi } from "../../services/attendee_events.service";
import { toast } from "sonner";

interface ReplyModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
  reviewerName: string;
  onSuccess?: () => void;
}

const MIN_REPLY = 5;
const MAX_REPLY = 1000;

const ReplyModal = ({ open, onClose, reviewId, reviewerName, onSuccess }: ReplyModalProps) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setComment("");
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const isValid = comment.trim().length >= MIN_REPLY && comment.trim().length <= MAX_REPLY;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const res = await attendeeEventsApi.replyToReview(reviewId, comment.trim());
      if (res.ok) {
        toast.success("Reply posted!");
        onSuccess?.();
        onClose();
      } else {
        const msg = (res as any).detail || "";
        toast.error(msg || "Failed to post reply. Please try again.");
      }
    } catch {
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#131418] border border-secondary/15 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/10">
          <h2 className="text-white text-lg font-semibold">Reply</h2>
          <button onClick={onClose} className="text-secondary/40 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-secondary text-sm">
            Replying to <span className="text-white font-medium">{reviewerName}</span>
          </p>
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your reply..."
            rows={4}
            maxLength={MAX_REPLY}
            className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-3 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-secondary/40 text-xs">
              {comment.length < MIN_REPLY && comment.length > 0
                ? `${MIN_REPLY - comment.length} more characters needed`
                : "Minimum 5 characters"}
            </p>
            <p className={`text-xs ${comment.length > MAX_REPLY - 100 ? "text-red-400" : "text-secondary/40"}`}>
              {comment.length}/{MAX_REPLY}
            </p>
          </div>
        </div>

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
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
