import { api, ApiResult } from "../lib/api";

export interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description?: string | null;
  created_at: string;
}

export interface ActivityPagination {
  next_cursor?: string | null;
  has_more: boolean;
}

export interface ActivityPage {
  ok: boolean;
  activities: Activity[];
  pagination: ActivityPagination;
}

type ActivityPayload = Activity[] | { activities?: Activity[] };

const normalizePage = (response: ApiResult<ActivityPayload>): ActivityPage => ({
  ok: response.ok,
  activities: Array.isArray(response.data)
    ? response.data
    : response.data?.activities || [],
  pagination: {
    next_cursor: (response.pagination?.next_cursor as string | null | undefined) ?? null,
    has_more: Boolean(response.pagination?.has_more),
  },
});

export const activityApi = {
  getRecent: async (): Promise<ApiResult<ActivityPayload>> =>
    api.get<ActivityPayload>("/activities/recent", {
      successMessage: false,
      errorMessage: false,
    }),

  getHistory: async (cursor?: string): Promise<ActivityPage> => {
    const response = await api.get<ActivityPayload>("/activities", {
      params: { limit: 20, cursor },
      successMessage: false,
      errorMessage: false,
    });
    return normalizePage(response);
  },
};
