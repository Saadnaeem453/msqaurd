import { api } from "../lib/api";

export interface CheckInResult {
  ticket_id: string;
  event_id: string;
  checked_in_at: string;
  method: "qr" | "manual";
}

export interface CheckInStats {
  total_eligible: number;
  checked_in: number;
  remaining: number;
  percentage: number;
  recent: Array<Record<string, unknown>>;
}

export const organizerCheckInApi = {
  qr: (credential: string, eventId?: string) =>
    api.post<CheckInResult>("/organizer/check-ins/qr", { credential, ...(eventId ? { event_id: eventId } : {}) }, { successMessage: false, errorMessage: false }),
  manual: (ticketId: string, eventId: string) =>
    api.post<CheckInResult>("/organizer/check-ins/manual", { ticket_id: ticketId, event_id: eventId }, { successMessage: false, errorMessage: false }),
  stats: (eventId: string) =>
    api.get<CheckInStats>(`/organizer/events/${encodeURIComponent(eventId)}/check-ins/stats`, { successMessage: false, errorMessage: false }),
};
