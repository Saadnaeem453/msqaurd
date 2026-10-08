import { api } from "../lib/api";


export interface AttendeeOrganization {
  id: string;
  name: string;
  logo_url?: string;
}

export interface AttendeeEventTier {
  id: string;
  name: string;
  price: string | number;
  capacity?: number;
  is_primary: boolean;
  is_premium?: boolean;
  sales_start?: string;
  sales_end?: string;
  tickets_sold?: number;
}

export interface AttendeeEventGallery {
  id: string;
  image_url: string;
  is_hero: boolean;
  order: number;
}

export interface AttendeeEventSpeaker {
  id: string;
  name: string;
  title?: string;
  photo_url?: string;
  bio?: string;
}

export interface AttendeeEventAgenda {
  id: string;
  event_id: string;
  time: string;
  duration: string;
  title: string;
  type: string;
  speaker_name?: string;
  speaker_id?: string;
  description?: string;
  order?: number;
}

export interface AttendeeEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  summary?: string;
  event_date: string;
  timezone: string;
  start_time: string;
  end_time: string;
  venue_type: "physical" | "online" | "hybrid";
  venue_name?: string;
  street_address?: string;
  latitude?: string;
  longitude?: string;
  hero_image?: string;
  video_url?: string | null;
  status: string;
  is_active: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  organizer_id: string;
  organization_id?: string;
  organization?: AttendeeOrganization;
  gallery?: AttendeeEventGallery[];
  tiers?: AttendeeEventTier[];
  speakers?: AttendeeEventSpeaker[];
  agenda?: AttendeeEventAgenda[];
}

export interface AttendeeReviewReply {
  id: string;
  user_name: string;
  user_avatar?: string;
  comment: string;
  created_at: string;
}

export interface AttendeeReview {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  helpful_count: number;
  tags?: string[];
  parent_id?: string | null;
  is_owner?: boolean;
  replies?: AttendeeReviewReply[];
  created_at: string;
  updated_at?: string;
}

export interface ReviewsResponse {
  reviews: AttendeeReview[];
  average_rating: number;
  total_reviews: number;
  rating_breakdown: { stars: number; count: number; percent: number }[];
  trending_tags: string[];
  pagination: { page: number; limit: number; total: number; total_pages: number };
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  tags: string[];
  [key: string]: unknown;
}

export interface MyReviewCheck {
  has_reviewed: boolean;
  can_review: boolean;
  review?: AttendeeReview;
  reason?: string;
}

export const REVIEW_TAGS = [
  "Enlightening",
  "Well-Organized",
  "Great Atmosphere",
  "Networking",
  "Informative",
  "Inspiring",
  "Well-Structured",
  "Engaging",
];

export interface RecommendedEventsResponse {
  success: boolean;
  data: AttendeeEvent[];
  detail: string;
}

export interface CategoryItem {
  label: string;
  value: string;
}

export const CATEGORIES: CategoryItem[] = [
  { label: "All Events", value: "all" },
  { label: "Islamic Talks", value: "Islamic Talks" },
  { label: "Sports & Fitness", value: "Sports & Fitness" },
  { label: "Social Mixers", value: "Social Mixers" },
  { label: "Professional Networking", value: "Professional Networking" },
  { label: "Youth Programs", value: "Youth Programs" },
  { label: "Charity", value: "Charity" },
  { label: "Lecture", value: "Lecture" },
  { label: "Workshop", value: "Workshop" },
  { label: "Networking", value: "Networking" },
  { label: "Social", value: "Social" },
  { label: "Competition", value: "Competition" },
];


export const attendeeEventsApi = {
  /**
   * Get recommended events for the current attendee (0–3 events).
   */
  getRecommended: () =>
    api.get<AttendeeEvent[]>("/events/recommended", {
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Get all published events (optional category filter + search).
   */
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get<AttendeeEvent[] | { events: AttendeeEvent[]; total: number; page: number; limit: number; totalPages: number }>("/events", {
      params,
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Get a single published event by ID (public endpoint for attendee view).
   */
  get: (id: string) =>
    api.get<AttendeeEvent>(`/events/public/${id}`, {
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Get reviews for a published event (public endpoint).
   */
  getReviews: (eventId: string, params?: { page?: number; limit?: number; sort?: string }) =>
    api.get<ReviewsResponse>(`/events/public/${eventId}/reviews`, {
      params,
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Check if current user has reviewed this event (and can review).
   */
  getMyReview: (eventId: string) =>
    api.get<MyReviewCheck>(`/events/${eventId}/reviews/my-review`, {
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Submit a new review (requires booking).
   */
  createReview: (eventId: string, data: CreateReviewPayload) =>
    api.post<AttendeeReview>(`/events/${eventId}/reviews`, data, {
      loadingMessage: "Submitting review...",
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Edit own review.
   */
  updateReview: (reviewId: string, data: CreateReviewPayload) =>
    api.put<AttendeeReview>(`/reviews/${reviewId}`, data, {
      loadingMessage: "Updating review...",
      successMessage: "Review updated!",
      errorMessage: true,
    }),

  /**
   * Delete own review.
   */
  deleteReview: (reviewId: string) =>
    api.delete(`/reviews/${reviewId}`, {
      loadingMessage: "Deleting review...",
      successMessage: "Review deleted",
      errorMessage: true,
    }),

  /**
   * Toggle helpful vote on a review.
   */
  toggleHelpful: (reviewId: string) =>
    api.post<{ review_id: string; helpful_count: number; user_has_voted: boolean }>(
      `/reviews/${reviewId}/helpful`,
      {},
      { successMessage: false, errorMessage: false }
    ),

  /**
   * Reply to a review.
   */
  replyToReview: (reviewId: string, comment: string) =>
    api.post<AttendeeReview>(`/reviews/${reviewId}/reply`, { comment }, {
      loadingMessage: "Posting reply...",
      successMessage: "Reply posted!",
      errorMessage: true,
    }),

  /**
   * Get replies for a review.
   */
  getReplies: (reviewId: string) =>
    api.get<AttendeeReview[]>(`/reviews/${reviewId}/replies`, {
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Book/purchase a ticket for an event.
   */
  book: (eventId: string, tierId: string, quantity: number = 1) =>
    api.post<{ success: boolean; data: any; detail: string }>(
      `/events/${eventId}/book`,
      { tier_id: tierId, quantity },
      {
        loadingMessage: "Booking tickets...",
        successMessage: "Tickets booked successfully!",
        errorMessage: "Failed to book tickets.",
      }
    ),
};
