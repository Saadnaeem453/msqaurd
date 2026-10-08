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

export const adminApi = {
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
};