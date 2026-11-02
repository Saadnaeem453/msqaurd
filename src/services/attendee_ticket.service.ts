import { api } from "../lib/api";

export const blobToDataUrl = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(String(reader.result));
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

export interface AttendeeTicketEvent {
  id: string;
  title: string;
  event_date: string;
  start_time?: string;
  timezone?: string;
  status?: string;
  hero_image?: string | null;
  end_time?: string;
  venue_name?: string | null;
  street_address?: string | null;
}

export interface AttendeeTicketTier {
  id: string;
  name: string;
  price?: string | number;
}

export interface AttendeeTicket {
  id: string;
  ticket_code: string;
  status: "valid" | "checked_in" | string;
  checked_in_at?: string | null;
  purchased_at?: string;
  order_reference: string;
  event: AttendeeTicketEvent;
  tier: AttendeeTicketTier;
  qr_url: string;
  status_label?: string;
  attendee?: { id: string; full_name: string; email: string; avatar_url?: string | null };
}

export const attendeeTicketApi = {
  list: (params: { page?: number; limit?: number } = {}) =>
    api.get<AttendeeTicket[]>("/attendee/tickets", { params, successMessage: false, errorMessage: false }),

  get: (ticketId: string) =>
    api.get<AttendeeTicket>(`/attendee/tickets/${encodeURIComponent(ticketId)}`, { successMessage: false, errorMessage: false }),

  qr: (ticketId: string) =>
    api.download(`/attendee/tickets/${encodeURIComponent(ticketId)}/qr`),

  downloadQr: (ticketId: string) =>
    api.download(`/attendee/tickets/${encodeURIComponent(ticketId)}/qr/download`),
};
