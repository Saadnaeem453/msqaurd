import { api } from "../lib/api";

export type AdminUserRole = "attendee" | "organizer" | "admin";

export interface AdminUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: AdminUserRole;
  is_active: boolean;
  email_verified: boolean;
  last_login_at: string | null;
  auth_provider: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUsersPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: AdminUserRole | "all";
  search?: string;
}

export interface AdminUserUpdatePayload {
  is_active: boolean;
  email_verified: boolean;
}

export interface AdminEvent {
  id: string;
  title: string;
  category: string;
  event_date: string;
  status: "draft" | "published" | "cancelled" | "completed";
  venue_type: string;
  venue_name?: string | null;
  hero_image?: string | null;
  organizer_id: string;
  organizer?: { id: string; full_name: string; email: string };
  organization?: { id: string; name: string; logo_url?: string | null };
  tiers?: Array<{ price: number | string; tickets_sold?: number }>;
}

export interface AdminEventsParams {
  page?: number;
  limit?: number;
  status?: "all" | AdminEvent["status"];
  category?: string;
  search?: string;
  from?: string;
  to?: string;
}

export const adminApi = {
  getEvents: (params?: AdminEventsParams) =>
    api.get<{ events: AdminEvent[]; total: number; page: number; limit: number; totalPages: number }>("/admin/events", {
      params,
      successMessage: false,
      errorMessage: true,
    }),

  getEventStats: () =>
    api.get<{ total: number; published: number; drafts: number; completed: number; upcoming: number }>("/admin/events/stats", {
      successMessage: false,
      errorMessage: true,
    }),

  getUsers: (params?: AdminUsersParams) =>
    api.get<AdminUser[]>("/admin/users", {
      params,
      successMessage: false,
      errorMessage: true,
    }),

  updateUser: (id: string, payload: AdminUserUpdatePayload) =>
    api.patch<AdminUser>(`/admin/users/${id}`, payload as unknown as Record<string, unknown>, {
      loadingMessage: "Updating user...",
      successMessage: "User updated successfully.",
      errorMessage: "Failed to update user.",
    }),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`, {
      loadingMessage: "Deleting user...",
      successMessage: "User deleted successfully.",
      errorMessage: "Failed to delete user.",
    }),
};
