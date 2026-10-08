import { api } from "../lib/api";

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


export const attendeeProfileApi = {

  get: () =>
    api.get<ProfileResponse>("/attendee/profile", {
      successMessage: false,
      errorMessage: true,
    }),


  update: (data: UpdateProfilePayload) => {
    if (data.profile_picture instanceof File) {
      const formData = new FormData();

      if (data.full_name) formData.append("full_name", data.full_name);
      if (data.bio) formData.append("bio", data.bio);
      if (data.interests) formData.append("interests", JSON.stringify(data.interests));
      if (data.gender) formData.append("gender", data.gender);
      if (data.event_reminders !== undefined)
        formData.append("event_reminders", String(data.event_reminders));
      if (data.marketing_emails !== undefined)
        formData.append("marketing_emails", String(data.marketing_emails));

      formData.append("profile_picture", data.profile_picture);

      return api.put<ProfileResponse>("/attendee/profile", formData, {
        loadingMessage: "Updating profile...",
        successMessage: "Profile updated successfully",
        errorMessage: "Failed to update profile",
      });
    }

    const { profile_picture, ...jsonPayload } = data;
    return api.put<ProfileResponse>("/attendee/profile", jsonPayload, {
      loadingMessage: "Updating profile...",
      successMessage: "Profile updated successfully",
      errorMessage: "Failed to update profile",
    });
  },
};
