import { api } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AttendeeProfile {
  id: string;
  user_id: string;
  bio?: string;
  interests: string[];
  gender?: "brother" | "sister" | "prefer_not_to_say";
  event_reminders: boolean;
  marketing_emails: boolean;
  country?: string | null;
  city?: string | null;
  dob?: string | null;
  age_group?: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendeeUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

export interface ProfileResponse {
  user: AttendeeUser;
  profile: AttendeeProfile;
}

export interface UpdateProfilePayload {
  full_name?: string;
  bio?: string;
  interests?: string[];
  gender?: "brother" | "sister" | "prefer_not_to_say";
  event_reminders?: boolean;
  marketing_emails?: boolean;
  profile_picture?: File | null;
  [key: string]: unknown;
}

// ─── Service ────────────────────────────────────────────────────────────────

export const attendeeProfileApi = {
  /**
   * Get current user's profile.
   */
  get: () =>
    api.get<ProfileResponse>("/attendee/profile", {
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Update current user's profile (partial update).
   * Supports both JSON and FormData (for file uploads).
   */
  update: (data: UpdateProfilePayload) => {
    // If profile_picture is a File, use FormData
    if (data.profile_picture instanceof File) {
      const formData = new FormData();

      // Append text fields
      if (data.full_name) formData.append("full_name", data.full_name);
      if (data.bio) formData.append("bio", data.bio);
      if (data.interests) formData.append("interests", JSON.stringify(data.interests));
      if (data.gender) formData.append("gender", data.gender);
      if (data.event_reminders !== undefined)
        formData.append("event_reminders", String(data.event_reminders));
      if (data.marketing_emails !== undefined)
        formData.append("marketing_emails", String(data.marketing_emails));

      // Append profile picture file
      formData.append("profile_picture", data.profile_picture);

      return api.put<ProfileResponse>("/attendee/profile", formData, {
        loadingMessage: "Updating profile...",
        successMessage: "Profile updated successfully",
        errorMessage: "Failed to update profile",
      });
    }

    // Otherwise, send as JSON
    const { profile_picture, ...jsonPayload } = data;
    return api.put<ProfileResponse>("/attendee/profile", jsonPayload, {
      loadingMessage: "Updating profile...",
      successMessage: "Profile updated successfully",
      errorMessage: "Failed to update profile",
    });
  },
};
