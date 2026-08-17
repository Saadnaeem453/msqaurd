import { api } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────

export interface EventTier {
  id?: string;
  event_id?: string;
  name: string;
  price: number | string;
  capacity: number;
  sales_start?: string;
  sales_end?: string;
  is_premium: boolean;
  premium_description?: string | null;
  is_primary: boolean;
  tickets_sold?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface EventGallery {
  id?: string;
  event_id?: string;
  image_url: string;
  order: number;
  is_hero: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface EventSpeaker {
  id?: string;
  event_id?: string;
  name: string;
  title?: string;
  bio?: string;
  photo_url?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface EventAgenda {
  id?: string;
  event_id?: string;
  time: string;
  duration: string;
  title: string;
  type: string; // Lecture, Workshop, Networking, Panel, Break
  speaker_name?: string;
  speaker_id?: string;
  description?: string;
  order?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  organization_id?: string | null;
  title: string;
  category: string;
  description: string;
  summary?: string | null;
  event_date: string;
  timezone: string;
  start_time: string;
  end_time: string;
  venue_type: 'physical' | 'online' | 'hybrid';
  venue_name?: string | null;
  street_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hero_image?: string | null;
  video_url?: string | null;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_active: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  published_at?: string | null;
  // Nested associations
  tiers?: EventTier[];
  gallery?: EventGallery[];
  speakers?: EventSpeaker[];
  agenda?: EventAgenda[];
}

export interface EventListResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  detail: string;
}

export interface EventSingleResponse {
  success: boolean;
  data: Event;
  detail: string;
}

export interface EventStatsResponse {
  success: boolean;
  data: {
    total: number;
    published: number;
    drafts: number;
    completed: number;
    upcoming: number;
    totalTicketsSold: number;
  };
  detail: string;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

// ─── Create/Update payload ─────────────────────────────────────────────

export interface CreateEventPayload {
  organization_id?: string;
  title: string;
  category: string;
  description: string;
  summary?: string;
  event_date: string;
  timezone: string;
  start_time: string;
  end_time: string;
  venue_type?: 'physical' | 'online' | 'hybrid';
  venue_name?: string;
  street_address?: string;
  latitude?: number;
  longitude?: number;
  hero_image?: string;
  video_url?: string;
  status?: EventStatus;
  tiers?: Omit<EventTier, 'id' | 'event_id' | 'created_at' | 'updated_at'>[];
  gallery?: Omit<EventGallery, 'id' | 'event_id' | 'created_at'>[];
  speakers?: Omit<EventSpeaker, 'id' | 'event_id' | 'created_at' | 'updated_at'>[];
  agenda?: Omit<EventAgenda, 'id' | 'event_id' | 'order' | 'created_at' | 'updated_at'>[];
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

// ─── Service ────────────────────────────────────────────────────────────

export const eventApi = {
  /**
   * List events for the current organizer with pagination and status filter.
   */
  list: (params?: { status?: EventStatus; page?: number; limit?: number }) =>
    api.get<EventListResponse>('/events', {
      params,
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Get a single event by ID with all nested associations.
   */
  get: (id: string) =>
    api.get<EventSingleResponse>(`/events/${id}`, {
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Create a new event with all nested data (JSON).
   */
  create: (data: CreateEventPayload) =>
    api.post<EventSingleResponse>('/events', data, {
      loadingMessage: 'Creating event...',
      successMessage: 'Event created successfully!',
      errorMessage: 'Failed to create event.',
    }),

  /**
   * Create a new event with file uploads (multipart/form-data).
   * Use formToFormData() from eventMapper to build the FormData.
   */
  createWithFiles: (formData: FormData) =>
    api.post<EventSingleResponse>('/events', formData, {
      loadingMessage: 'Creating event...',
      successMessage: 'Event created successfully!',
      errorMessage: 'Failed to create event.',
    }),

  /**
   * Update an existing event (full or partial, JSON).
   */
  update: (id: string, data: UpdateEventPayload) =>
    api.put<EventSingleResponse>(`/events/${id}`, data, {
      loadingMessage: 'Updating event...',
      successMessage: 'Event updated successfully!',
      errorMessage: 'Failed to update event.',
    }),

  /**
   * Update an existing event with file uploads (multipart/form-data).
   * Use formToFormData() from eventMapper to build the FormData.
   */
  updateWithFiles: (id: string, formData: FormData) =>
    api.put<EventSingleResponse>(`/events/${id}`, formData, {
      loadingMessage: 'Updating event...',
      successMessage: 'Event updated successfully!',
      errorMessage: 'Failed to update event.',
    }),

  /**
   * Update only the status of an event (publish, cancel, complete).
   */
  updateStatus: (id: string, status: EventStatus) =>
    api.patch<{ success: boolean; data: { id: string; status: EventStatus; published_at?: string }; detail: string }>(
      `/events/${id}/status`,
      { status },
      {
        loadingMessage: 'Updating status...',
        successMessage: `Event ${status} successfully!`,
        errorMessage: 'Failed to update status.',
      }
    ),

  /**
   * Soft delete an event (sets is_active = false).
   */
  delete: (id: string) =>
    api.delete<{ success: boolean; detail: string }>(`/events/${id}`, {
      loadingMessage: 'Deleting event...',
      successMessage: 'Event deleted successfully!',
      errorMessage: 'Failed to delete event.',
    }),

  /**
   * Get dashboard statistics for the organizer.
   */
  getStats: () =>
    api.get<EventStatsResponse>('/events/stats', {
      successMessage: false,
      errorMessage: true,
    }),
};