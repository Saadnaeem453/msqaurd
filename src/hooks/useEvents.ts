import { useState, useCallback, useEffect } from 'react';
import {
  eventApi,
  Event,
  EventStatus,
  CreateEventPayload,
  UpdateEventPayload,
} from '../services/event.service';



interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseEventListOptions {
  status?: EventStatus;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseEventListReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
}



export function useEventList(options: UseEventListOptions = {}): UseEventListReturn {
  const { status, page = 1, limit = 12, autoFetch = true } = options;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await eventApi.list({ status, page, limit });

    if (result.ok && result.data) {

      const data = result.data as any;

      if (data.events && Array.isArray(data.events)) {
        setEvents(data.events);
        setPagination({
          page: data.page ?? page,
          limit: data.limit ?? limit,
          total: data.total ?? 0,
          totalPages: data.totalPages ?? 1,
        });
      } else {

        const inner = data.data || data;
        if (inner.events && Array.isArray(inner.events)) {
          setEvents(inner.events);
          setPagination({
            page: inner.page ?? page,
            limit: inner.limit ?? limit,
            total: inner.total ?? 0,
            totalPages: inner.totalPages ?? 1,
          });
        } else {
          setEvents([]);
        }
      }
    } else {
      setError(result.detail || 'Failed to fetch events');
    }

    setLoading(false);
  }, [status, page, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  const setPage = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents,
    setPage,
  };
}



export function useEvent(id: string | undefined, autoFetch = true) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const result = await eventApi.get(id);

    if (result.ok && result.data) {

      const data = result.data as any;

      if (data.id) {

        setEvent(data);
      } else if (data.data?.id) {

        setEvent(data.data);
      } else {
        setError('Invalid event data received');
      }
    } else {
      setError(result.detail || 'Failed to fetch event');
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchEvent();
    }
  }, [autoFetch, id, fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
}



export function useEventStats(autoFetch = true) {
  const [stats, setStats] = useState<{
    total: number;
    published: number;
    drafts: number;
    completed: number;
    upcoming: number;
    totalTicketsSold: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await eventApi.getStats();

    if (result.ok && result.data) {
      const data = result.data as any;


      const statsData = data.total !== undefined ? data : data.data;

      if (statsData) {
        setStats({
          total: statsData.total ?? 0,
          published: statsData.published ?? 0,
          drafts: statsData.drafts ?? 0,
          completed: statsData.completed ?? 0,
          upcoming: statsData.upcoming ?? 0,
          totalTicketsSold: statsData.totalTicketsSold ?? 0,
        });
      }
    } else {
      setError(result.detail || 'Failed to fetch stats');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}



export function useCreateEvent() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = useCallback(async (data: CreateEventPayload): Promise<Event | null> => {
    setCreating(true);
    setError(null);

    const result = await eventApi.create(data);

    setCreating(false);

    if (result.ok && result.data) {
      const responseData = result.data as any;

      const event = responseData.id ? responseData : responseData.data;
      if (event?.id) {
        return event;
      }
      setError(responseData.detail || 'Failed to create event');
      return null;
    }

    setError(result.detail || 'Failed to create event');
    return null;
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setCreating(false);
  }, []);

  return { createEvent, creating, error, reset };
}

/** Create event with file uploads (multipart/form-data) */
export function useCreateEventWithFiles() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEventWithFiles = useCallback(async (formData: FormData): Promise<Event | null> => {
    setCreating(true);
    setError(null);

    const result = await eventApi.createWithFiles(formData);

    setCreating(false);

    if (result.ok && result.data) {
      const responseData = result.data as any;
      const event = responseData.id ? responseData : responseData.data;
      if (event?.id) {
        return event;
      }
      setError(responseData.detail || 'Failed to create event');
      return null;
    }

    setError(result.detail || 'Failed to create event');
    return null;
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setCreating(false);
  }, []);

  return { createEventWithFiles, creating, error, reset };
}



export function useUpdateEvent() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEvent = useCallback(
    async (id: string, data: UpdateEventPayload): Promise<Event | null> => {
      setUpdating(true);
      setError(null);

      const result = await eventApi.update(id, data);

      setUpdating(false);

      if (result.ok && result.data) {
        const responseData = result.data as any;
        const event = responseData.id ? responseData : responseData.data;
        if (event?.id) {
          return event;
        }
        setError(responseData.detail || 'Failed to update event');
        return null;
      }

      setError(result.detail || 'Failed to update event');
      return null;
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setUpdating(false);
  }, []);

  return { updateEvent, updating, error, reset };
}

/** Update event with file uploads (multipart/form-data) */
export function useUpdateEventWithFiles() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEventWithFiles = useCallback(
    async (id: string, formData: FormData): Promise<Event | null> => {
      setUpdating(true);
      setError(null);

      const result = await eventApi.updateWithFiles(id, formData);

      setUpdating(false);

      if (result.ok && result.data) {
        const responseData = result.data as any;
        const event = responseData.id ? responseData : responseData.data;
        if (event?.id) {
          return event;
        }
        setError(responseData.detail || 'Failed to update event');
        return null;
      }

      setError(result.detail || 'Failed to update event');
      return null;
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setUpdating(false);
  }, []);

  return { updateEventWithFiles, updating, error, reset };
}



export function useEventStatus() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: EventStatus): Promise<boolean> => {
      setUpdating(true);
      setError(null);

      const result = await eventApi.updateStatus(id, status);

      setUpdating(false);

      if (result.ok) {
        return true;
      }

      setError(result.detail || 'Failed to update status');
      return false;
    },
    []
  );

  return { updateStatus, updating, error };
}



export function useDeleteEvent() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setDeleting(true);
    setError(null);

    const result = await eventApi.delete(id);

    setDeleting(false);

    if (result.ok) {
      return true;
    }

    setError(result.detail || 'Failed to delete event');
    return false;
  }, []);

  return { deleteEvent, deleting, error };
}



export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { api } = await import('../lib/api');
      const result = await api.upload<{ url: string }>(
        '/upload/image',
        formData,
        {
          loadingMessage: 'Uploading image...',
          successMessage: false,
          errorMessage: 'Failed to upload image',
        }
      );

      setUploading(false);
      setProgress(100);

      if (result.ok && result.data) {
        const data = result.data as any;
        return data.url || data.data?.url || null;
      }

      return null;
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    }
  }, []);

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<string[]> => {
      setUploading(true);
      setError(null);

      const urls: string[] = [];
      const total = files.length;

      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round((i / total) * 100));
        const url = await uploadImage(files[i]);
        if (url) urls.push(url);
      }

      setProgress(100);
      setUploading(false);

      return urls;
    },
    [uploadImage]
  );

  return { uploadImage, uploadMultiple, uploading, progress, error };
}
