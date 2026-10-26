import { api } from "../lib/api";

export interface AudienceInsights {
  period: string;
  summary: { total_unique_attendees: number; previous_period_unique_attendees: number; total_change_percent: number | null; new_attendee_percent: number; returning_attendee_percent: number; engagement_score: number | null; engagement_trend_percent: number | null };
  age_distribution: { group: string; count: number }[];
  gender_split: { name: string; value: number; color: string }[];
  attendee_origin: { name: string; count: number; percent: number }[];
  top_interests: { name: string; percent: number }[];
  trending_categories: string[];
  device_breakdown: { device_type: string; users: number; percentage: number }[];
  platform_distribution: { platform: string; users: number; avgSession: string | null; conversion: number | null }[];
}

export const organizerAudienceApi = {
  get: (period: string) => api.get<AudienceInsights>("/organizer/analytics/audience", { params: { period }, successMessage: false, errorMessage: false }),
};
