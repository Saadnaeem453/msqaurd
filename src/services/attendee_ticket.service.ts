import { api } from "../lib/api";

export interface AttendeeTicketEvent {
  id: string;
  title: string;
  event_date: string;
  start_time?: string;
  timezone?: string;
  status?: string;
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
