import { api } from "../lib/api";



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


export const organizerSettingsApi = {
  /**
   */
  get: () =>
    api.get<OrganizerSettings>("/organizer/settings", {
      successMessage: false,
      errorMessage: true,
    }),


  update: (data: UpdateSettingsPayload) => {
    if (data.profile_image instanceof File) {
      const formData = new FormData();

      if (data.full_name) formData.append("full_name", data.full_name);
      if (data.job_title) formData.append("job_title", data.job_title);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.bio) formData.append("bio", data.bio);
      if (data.preferred_language) formData.append("preferred_language", data.preferred_language);
      if (data.timezone) formData.append("timezone", data.timezone);

      formData.append("profile_image", data.profile_image);

      return api.put<OrganizerSettings>("/organizer/settings", formData, {
        loadingMessage: "Saving settings...",
        successMessage: "Settings updated successfully",
        errorMessage: "Failed to update settings",
      });
    }

    const { profile_image, ...jsonPayload } = data;
    return api.put<OrganizerSettings>("/organizer/settings", jsonPayload, {
      loadingMessage: "Saving settings...",
      successMessage: "Settings updated successfully",
      errorMessage: "Failed to update settings",
    });
  },
};
