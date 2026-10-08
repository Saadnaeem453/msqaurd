import { CreateEventPayload, Event, EventTier, EventGallery, EventSpeaker, EventAgenda } from '../services/event.service';


export interface EventFormData {
  title: string;
  category: string;
  description: string;
  summary: string;
  eventDate: string;
  timezone: string;
  startTime: string;
  endTime: string;
  venueType: 'physical' | 'online' | 'hybrid';
  venueName: string;
  streetAddress: string;
  tiers: Array<{
    name: string;
    description?: string;
    price: number;
    capacity: number;
    salesStart: string;
    salesEnd: string;
    isPremium?: boolean;
    premiumDescription?: string;
    isPrimary?: boolean;
  }>;
  heroImage: File | null;
  heroImageUrl?: string;
  gallery: File[];
  galleryUrls?: string[];
  videoUrl: string;
  speakers: Array<{
    name: string;
    title: string;
    bio: string;
    photo?: File | null;
    photo_url?: string;
  }>;
  agenda: Array<{
    time: string;
    duration: string;
    title: string;
    type: string;
    speaker?: string;
    description: string;
  }>;
}

export const initialFormData: EventFormData = {
  title: '',
  category: '',
  description: '',
  summary: '',
  eventDate: '',
  timezone: 'GMT (London)',
  startTime: '',
  endTime: '',
  venueType: 'physical',
  venueName: '',
  streetAddress: '',
  tiers: [],
  heroImage: null,
  gallery: [],
  videoUrl: '',
  speakers: [],
  agenda: [],
};


const venueTypeMap: Record<string, 'physical' | 'online' | 'hybrid'> = {
  Physical: 'physical',
  physical: 'physical',
  Online: 'online',
  online: 'online',
  Hybrid: 'hybrid',
  hybrid: 'hybrid',
};

function toVenueType(raw?: string): 'physical' | 'online' | 'hybrid' {
  if (!raw) return 'physical';
  return venueTypeMap[raw] || 'physical';
}

function toVenueLabel(vt?: string): string {
  if (!vt) return 'Physical';
  const map: Record<string, string> = { physical: 'Physical', online: 'Online', hybrid: 'Hybrid' };
  return map[vt] || 'Physical';
}

function formatDateToISO(dateStr: string, timeStr: string, timezone: string): string {
  if (!dateStr) return '';
  const time = timeStr || '00:00';
  return `${dateStr}T${time}:00`;
}


export function formToPayload(
  form: EventFormData,
  status: 'draft' | 'published' = 'draft'
): CreateEventPayload {
  const payload: CreateEventPayload = {
    title: form.title.trim(),
    category: form.category,
    description: form.description.trim(),
    summary: form.summary?.trim() || undefined,
    event_date: form.eventDate,
    timezone: form.timezone,
    start_time: form.startTime,
    end_time: form.endTime,
    venue_type: toVenueType(form.venueType),
    venue_name: form.venueName?.trim() || undefined,
    street_address: form.streetAddress?.trim() || undefined,
    hero_image: form.heroImageUrl || undefined,
    video_url: form.videoUrl?.trim() || undefined,
    status,
  };

  if (form.tiers.length > 0) {
    payload.tiers = form.tiers.map((t) => ({
      name: t.name.trim(),
      price: Number(t.price) || 0,
      capacity: Number(t.capacity) || 0,
      sales_start: t.salesStart || undefined,
      sales_end: t.salesEnd || undefined,
      is_premium: Boolean(t.isPremium),
      premium_description: t.isPremium ? (t.premiumDescription?.trim() || undefined) : undefined,
      is_primary: Boolean(t.isPrimary),
    }));
  }

  if (form.galleryUrls && form.galleryUrls.length > 0) {
    payload.gallery = form.galleryUrls.map((url, idx) => ({
      image_url: url,
      order: idx,
      is_hero: false,
    }));
  }

  if (form.speakers.length > 0) {
    payload.speakers = form.speakers
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        title: s.title?.trim() || undefined,
        bio: s.bio?.trim() || undefined,
        photo_url: s.photo_url || undefined,
      }));
  }

  if (form.agenda.length > 0) {
    payload.agenda = form.agenda
      .filter((a) => a.title.trim())
      .map((a) => ({
        time: a.time,
        duration: a.duration,
        title: a.title.trim(),
        type: a.type,
        speaker_name: a.speaker?.trim() || undefined,
        description: a.description?.trim() || undefined,
      }));
  }

  return payload;
}


export function formToFormData(
  form: EventFormData,
  status: 'draft' | 'published' = 'draft'
): FormData {
  const fd = new FormData();


  fd.append('title', form.title.trim());
  fd.append('category', form.category.trim());
  fd.append('description', form.description.trim());
  if (form.summary?.trim()) fd.append('summary', form.summary.trim());
  fd.append('event_date', form.eventDate);
  fd.append('timezone', form.timezone);
  fd.append('start_time', form.startTime);
  fd.append('end_time', form.endTime);
  fd.append('venue_type', toVenueType(form.venueType));
  if (form.venueName?.trim()) fd.append('venue_name', form.venueName.trim());
  if (form.streetAddress?.trim()) fd.append('street_address', form.streetAddress.trim());
  if (form.videoUrl?.trim()) fd.append('video_url', form.videoUrl.trim());
  fd.append('status', status);

  if (form.tiers.length > 0) {
    const tiers = form.tiers.map((t) => ({
      name: t.name.trim(),
      price: Number(t.price) || 0,
      capacity: Number(t.capacity) || 0,
      sales_start: t.salesStart || undefined,
      sales_end: t.salesEnd || undefined,
      is_premium: Boolean(t.isPremium),
      premium_description: t.isPremium ? (t.premiumDescription?.trim() || undefined) : undefined,
      is_primary: Boolean(t.isPrimary),
    }));
    fd.append('tiers', JSON.stringify(tiers));
  }

  if (form.galleryUrls && form.galleryUrls.length > 0) {
    const gallery = form.galleryUrls.map((url, idx) => ({
      image_url: url,
      order: idx,
      is_hero: false,
    }));
    fd.append('gallery', JSON.stringify(gallery));
  }

  if (form.speakers.length > 0) {
    const speakers = form.speakers
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        title: s.title?.trim() || undefined,
        bio: s.bio?.trim() || undefined,
        photo_url: s.photo_url || undefined,
      }));
    fd.append('speakers', JSON.stringify(speakers));
  }

  if (form.agenda.length > 0) {
    const agenda = form.agenda
      .filter((a) => a.title.trim())
      .map((a) => ({
        time: a.time,
        duration: a.duration,
        title: a.title.trim(),
        type: a.type,
        speaker_name: a.speaker?.trim() || undefined,
        description: a.description?.trim() || undefined,
      }));
    fd.append('agenda', JSON.stringify(agenda));
  }

  if (form.heroImage instanceof File) {
    fd.append('hero_image', form.heroImage);
  } else if (form.heroImageUrl) {
    fd.append('hero_image', form.heroImageUrl);
  }

  if (form.gallery.length > 0) {
    form.gallery.forEach((file) => {
      fd.append('gallery_images', file);
    });
  }

  form.speakers.forEach((speaker, idx) => {
    if (speaker.photo instanceof File) {
      fd.append(`speaker_photo_${idx}`, speaker.photo);
    }
  });

  return fd;
}


export function eventToForm(event: Event): EventFormData {
  return {
    title: event.title || '',
    category: event.category || '',
    description: event.description || '',
    summary: event.summary || '',
    eventDate: event.event_date || '',
    timezone: event.timezone || 'GMT (London)',
    startTime: event.start_time || '',
    endTime: event.end_time || '',
    venueType: toVenueType(event.venue_type),
    venueName: event.venue_name || '',
    streetAddress: event.street_address || '',
    tiers: (event.tiers || []).map((t) => ({
      name: t.name || '',
      description: '',
      price: Number(t.price) || 0,
      capacity: Number(t.capacity) || 0,
      salesStart: t.sales_start || '',
      salesEnd: t.sales_end || '',
      isPremium: Boolean(t.is_premium),
      premiumDescription: t.premium_description || '',
      isPrimary: Boolean(t.is_primary),
    })),
    heroImage: null,
    heroImageUrl: event.hero_image || undefined,
    gallery: [],
    galleryUrls: (event.gallery || [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((g) => g.image_url),
    videoUrl: event.video_url || '',
    speakers: (event.speakers || []).map((s) => ({
      name: s.name || '',
      title: s.title || '',
      bio: s.bio || '',
      photo_url: s.photo_url || undefined,
    })),
    agenda: (event.agenda || [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((a) => ({
        time: a.time || '',
        duration: a.duration || '',
        title: a.title || '',
        type: a.type || 'Lecture',
        speaker: a.speaker_name || '',
        description: a.description || '',
      })),
  };
}


export interface ValidationErrors {
  [field: string]: string;
}

export function validateEventForm(form: EventFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.title.trim()) errors.title = 'Event title is required';
  else if (form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';

  if (!form.category) errors.category = 'Please select a category';

  if (!form.description.trim()) errors.description = 'Description is required';

  if (!form.eventDate) errors.eventDate = 'Event date is required';
  if (!form.startTime) errors.startTime = 'Start time is required';
  if (!form.endTime) errors.endTime = 'End time is required';

  if (form.startTime && form.endTime && form.startTime >= form.endTime) {
    errors.endTime = 'End time must be after start time';
  }

  if (form.venueType === 'physical' || form.venueType === 'hybrid') {
    if (!form.venueName.trim()) errors.venueName = 'Venue name is required for physical/hybrid events';
  }

  form.tiers.forEach((tier, idx) => {
    if (!tier.name.trim()) errors[`tier_${idx}_name`] = 'Tier name is required';
    if (!tier.price || tier.price < 0) errors[`tier_${idx}_price`] = 'Price must be 0 or greater';
    if (!tier.capacity || tier.capacity <= 0) errors[`tier_${idx}_capacity`] = 'Capacity must be greater than 0';
  });

  form.speakers.forEach((speaker, idx) => {
    if (!speaker.name.trim()) errors[`speaker_${idx}_name`] = 'Speaker name is required';
  });

  form.agenda.forEach((item, idx) => {
    if (!item.title.trim()) errors[`agenda_${idx}_title`] = 'Session title is required';
    if (!item.time.trim()) errors[`agenda_${idx}_time`] = 'Session time is required';
  });

  return errors;
}
