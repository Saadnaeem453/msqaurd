import { api } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface OrganizerSettings {
  full_name?: string;
  email: string;
  avatar_url?: string;
  job_title?: string;
  phone_number?: string;
  bio?: string;
  preferred_language?: string;
  timezone?: string;
}

export interface UpdateSettingsPayload {
  full_name?: string;
  job_title?: string;
  phone_number?: string;
  bio?: string;
  preferred_language?: string;
  timezone?: string;
  profile_image?: File | null;
  [key: string]: unknown;
}

// ─── Service ────────────────────────────────────────────────────────────────

export const organizerSettingsApi = {
  /**
   * Get organizer settings.
   */
  get: () =>
    api.get<OrganizerSettings>("/organizer/settings", {
      successMessage: false,
      errorMessage: true,
    }),

  /**
   * Update organizer settings (partial update).
   * Supports both JSON and FormData (for profile_image uploads).
   */
  update: (data: UpdateSettingsPayload) => {
    // If profile_image is a File, use FormData
    if (data.profile_image instanceof File) {
      const formData = new FormData();

      // Append text fields
      if (data.full_name) formData.append("full_name", data.full_name);
      if (data.job_title) formData.append("job_title", data.job_title);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.bio) formData.append("bio", data.bio);
      if (data.preferred_language) formData.append("preferred_language", data.preferred_language);
      if (data.timezone) formData.append("timezone", data.timezone);

      // Append profile image file
      formData.append("profile_image", data.profile_image);

      return api.put<OrganizerSettings>("/organizer/settings", formData, {
        loadingMessage: "Saving settings...",
        successMessage: "Settings updated successfully",
        errorMessage: "Failed to update settings",
      });
    }

    // Otherwise, send as JSON
    const { profile_image, ...jsonPayload } = data;
    return api.put<OrganizerSettings>("/organizer/settings", jsonPayload, {
      loadingMessage: "Saving settings...",
      successMessage: "Settings updated successfully",
      errorMessage: "Failed to update settings",
    });
  },
};
