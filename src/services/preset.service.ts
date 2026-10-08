import { api } from "../lib/api";



export interface TicketPreset {
  id: string;
  name: string;
  price: number;
  capacity: number;
  is_active: boolean;
  description?: string | null;
  category?: string | null;
  sales_start?: string | null;
  sales_end?: string | null;
  booking_fee?: number | null;
  is_premium?: boolean;
  premium_description?: string | null;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PresetListResponse {
  presets: TicketPreset[];
  active_count: number;
}

export interface PresetStats {
  total_presets: number;
  active_presets: number;
  inactive_presets: number;
  avg_ticket_price: string;
}

export interface CreatePresetPayload {
  name: string;
  price: number;
  capacity: number;
  description?: string | null;
  category?: string | null;
  sales_start?: string | null;
  sales_end?: string | null;
  booking_fee?: number | null;
  is_active?: boolean;
  is_premium?: boolean;
  premium_description?: string | null;
  is_primary?: boolean;
}

export interface UpdatePresetPayload {
  name?: string;
  price?: number;
  capacity?: number;
  description?: string | null;
  category?: string | null;
  sales_start?: string | null;
  sales_end?: string | null;
  booking_fee?: number | null;
  is_active?: boolean;
  is_premium?: boolean;
  premium_description?: string | null;
  is_primary?: boolean;
}

export interface CopyPresetPayload {
  preset_id: string;
  event_id: string;
}



export const presetApi = {
  /** Fetch all presets (optionally filtered by active status) */
  list: (params?: { active?: boolean }) =>
    api.get<
      PresetListResponse & {
        presets: TicketPreset[];
        active_count: number;
      }
    >("/ticket-tier-presets", {
      params: params ? { active: String(params.active) } : undefined,
      successMessage: false,
      errorMessage: "Failed to fetch presets",
    }),

  /** Get stats */
  getStats: () =>
    api.get<PresetStats>("/ticket-tier-presets/stats", {
      successMessage: false,
      errorMessage: "Failed to fetch preset stats",
    }),

  /** Create a new preset */
  create: (data: CreatePresetPayload) =>
    api.post<TicketPreset>("/ticket-tier-presets", data as unknown as Record<string, unknown>, {
      successMessage: "Preset created successfully",
      errorMessage: "Failed to create preset",
    }),

  /** Update an existing preset */
  update: (id: string, data: UpdatePresetPayload) =>
    api.put<TicketPreset>(`/ticket-tier-presets/${id}`, data as unknown as Record<string, unknown>, {
      successMessage: "Preset updated successfully",
      errorMessage: "Failed to update preset",
    }),

  /** Delete a preset */
  delete: (id: string) =>
    api.delete(`/ticket-tier-presets/${id}`, {
      successMessage: "Preset deleted successfully",
      errorMessage: "Failed to delete preset",
    }),

  /** Toggle active status */
  toggleStatus: (id: string, is_active: boolean) =>
    api.patch<TicketPreset>(`/ticket-tier-presets/${id}/status`, {
      is_active,
    }, {
      successMessage: is_active ? "Preset activated" : "Preset deactivated",
      errorMessage: "Failed to update preset status",
    }),

  /** Copy preset to event */
  copyToEvent: (preset_id: string, event_id: string) =>
    api.post<any>("/ticket-tier-presets/copy-to-event", {
      preset_id,
      event_id,
    }, {
      successMessage: "Preset added to event tiers",
      errorMessage: "Failed to copy preset to event",
    }),
};
