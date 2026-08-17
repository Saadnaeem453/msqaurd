import { useState, useCallback, useEffect } from "react";
import {
  attendeeEventsApi,
  AttendeeEvent,
} from "../services/attendee_events.service";

// ─── Types ───────────────────────────────────────────────────────────────────

interface UseRecommendedEventsReturn {
  events: AttendeeEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseAllEventsOptions {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseAllEventsReturn {
  events: AttendeeEvent[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => Promise<void>;
}

// ─── useRecommendedEvents ────────────────────────────────────────────────────

export function useRecommendedEvents(autoFetch = true): UseRecommendedEventsReturn {
  const [events, setEvents] = useState<AttendeeEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await attendeeEventsApi.getRecommended();

    if (result.ok && result.data) {
      const data = result.data as any;
      // api.get unwraps json.data, so result.data = the events array directly
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data.data && Array.isArray(data.data)) {
        // Fallback: nested in .data
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } else {
      setError(result.detail || "Failed to fetch recommended events");
      setEvents([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

// ─── useAllEvents ────────────────────────────────────────────────────────────

export function useAllEvents(options: UseAllEventsOptions = {}): UseAllEventsReturn {
  const { category, search, page = 1, limit = 12, autoFetch = true } = options;

  const [events, setEvents] = useState<AttendeeEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: Record<string, any> = { page, limit };
    if (category && category !== "all") params.category = category;
    if (search) params.search = search;

    const result = await attendeeEventsApi.getAll(params);

    if (result.ok && result.data) {
      const data = result.data as any;

      if (Array.isArray(data)) {
        // Direct array response
        setEvents(data);
        setTotal(data.length);
        setTotalPages(1);
      } else if (data.events && Array.isArray(data.events)) {
        // Paginated response
        setEvents(data.events);
        setTotal(data.total ?? data.events.length);
        setTotalPages(data.totalPages ?? 1);
      } else if (data.data?.events && Array.isArray(data.data.events)) {
        // Double-nested
        setEvents(data.data.events);
        setTotal(data.data.total ?? data.data.events.length);
        setTotalPages(data.data.totalPages ?? 1);
      } else {
        setEvents([]);
      }
    } else {
      setError(result.detail || "Failed to fetch events");
    }

    setLoading(false);
  }, [category, search, page, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return { events, loading, error, total, page, totalPages, refetch: fetchEvents };
}

// ── Helper: get hero image URL ─────────────────────────────────────────────

export function getHeroImage(event: AttendeeEvent): string | undefined {
  // Prefer hero_image field
  if (event.hero_image) return event.hero_image;
  // Fallback to gallery where is_hero === true
  const heroGallery = event.gallery?.find((g) => g.is_hero);
  if (heroGallery) return heroGallery.image_url;
  // Fallback to first gallery image
  if (event.gallery && event.gallery.length > 0) {
    const sorted = [...event.gallery].sort((a, b) => a.order - b.order);
    return sorted[0].image_url;
  }
  return undefined;
}

// ─── Helper: get primary tier price ──────────────────────────────────────────

export function getPrimaryPrice(event: AttendeeEvent): { price: string; name: string } | null {
  if (!event.tiers || event.tiers.length === 0) return null;
  const primary = event.tiers.find((t) => t.is_primary);
  const tier = primary || event.tiers[0];
  return {
    price: typeof tier.price === "number" ? tier.price.toFixed(2) : tier.price,
    name: tier.name,
  };
}

// ─── Helper: format date ─────────────────────────────────────────────────────

export function formatEventDate(dateStr: string, timezone?: string): string {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function formatEventTime(timeStr: string): string {
  if (!timeStr) return "";
  // "09:00:00" → "09:00"
  return timeStr.slice(0, 5);
}
