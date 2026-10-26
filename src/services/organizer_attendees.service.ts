import { api } from "../lib/api";

export interface OrganizerAttendee {
  id: string;
  name: string;
  email: string;
  event: string;
  ticket_type: string;
  status: "checked_in" | "pending";
  checked_in_at: string | null;
  registered_at: string;
}

export interface OrganizerAttendeeResponse {
  attendees: OrganizerAttendee[];
  metrics: { total_attendees: number; checked_in: number; check_in_rate: number; registered_today: number };
  pagination: { page: number; limit: number; total: number; total_pages: number };
}

export const organizerAttendeesApi = {
  list: (page = 1, limit = 20) => api.get<OrganizerAttendeeResponse>("/organizer/attendees", { params: { page, limit }, successMessage: false, errorMessage: false }),
};
