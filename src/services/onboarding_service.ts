// services/onboarding_service.ts
import { api } from "../lib/api";

export interface OnboardingStepResponse {
  step: number;
  onboarding_completed: boolean;
  data: {
    city?: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    categories?: Array<{ id: string; label: string; icon: string; selected: boolean }>;
    age_group?: string;
    gender_preference?: string;
    dob?: string;
  };
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface OnboardingSubmitData {
  city?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  interests: string[];   // array of category IDs
  age_group?: string;
  gender_preference?: string;
  dob?: string;
}

export const onboardingApi = {
  /**
   * Get the current onboarding step and any saved data for that step.
   * No loading/success messages are shown (silent).
   */
  getStep: () =>
    api.get<OnboardingStepResponse>('/onboarding/step', {
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Get the list of available categories (with icons).
   * No loading message; success message is disabled.
   */
  getCategories: () =>
    api.get<{ categories: Category[] }>('/onboarding/categories', {
      successMessage: false,
    }),

  /**
   * Submit all onboarding data at once.
   * Shows loading and success messages.
   */
  submitOnboarding: (data: OnboardingSubmitData) =>
    api.post<{ success: boolean; user: any; detail: string }>(
      '/onboarding/submit',
      data,
      {
        loadingMessage: 'Saving your preferences...',
        successMessage: 'Onboarding completed! Welcome to MSQUARED.',
      }
    ),
};