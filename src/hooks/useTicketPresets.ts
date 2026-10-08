import { useState, useCallback, useEffect } from "react";
import {
  presetApi,
  TicketPreset,
  PresetStats,
  CreatePresetPayload,
  UpdatePresetPayload,
} from "../services/preset.service";



interface UseTicketPresetsReturn {
  presets: TicketPreset[];
  activePresets: TicketPreset[];
  inactivePresets: TicketPreset[];
  stats: PresetStats | null;
  activeCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createPreset: (data: CreatePresetPayload) => Promise<boolean>;
  updatePreset: (id: string, data: UpdatePresetPayload) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  toggleActive: (id: string, is_active: boolean) => Promise<boolean>;
  copyPresetToEvent: (preset_id: string, event_id: string) => Promise<any | null>;
}

export function useTicketPresets(autoFetch = true): UseTicketPresetsReturn {
  const [presets, setPresets] = useState<TicketPreset[]>([]);
  const [stats, setStats] = useState<PresetStats | null>(null);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [listResult, statsResult] = await Promise.all([
      presetApi.list(),
      presetApi.getStats(),
    ]);

    if (listResult.ok && listResult.data) {
      const data = listResult.data as any;
      const presetList = data.presets || [];
      setPresets(presetList);
      setActiveCount(data.active_count ?? presetList.filter((p: TicketPreset) => p.is_active).length);
    } else {
      setError(listResult.detail || "Failed to fetch presets");
    }

    if (statsResult.ok && statsResult.data) {
      const data = statsResult.data as any;
      setStats({
        total_presets: data.total_presets ?? 0,
        active_presets: data.active_presets ?? 0,
        inactive_presets: data.inactive_presets ?? 0,
        avg_ticket_price: data.avg_ticket_price ?? "0",
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) fetchPresets();
  }, [autoFetch, fetchPresets]);

  const createPreset = useCallback(async (data: CreatePresetPayload): Promise<boolean> => {
    const result = await presetApi.create(data);
    if (result.ok) {
      await fetchPresets();
      return true;
    }
    return false;
  }, [fetchPresets]);

  const updatePreset = useCallback(async (id: string, data: UpdatePresetPayload): Promise<boolean> => {
    const result = await presetApi.update(id, data);
    if (result.ok) {
      await fetchPresets();
      return true;
    }
    return false;
  }, [fetchPresets]);

  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    const result = await presetApi.delete(id);
    if (result.ok) {
      await fetchPresets();
      return true;
    }
    return false;
  }, [fetchPresets]);

  const toggleActive = useCallback(async (id: string, is_active: boolean): Promise<boolean> => {
    const result = await presetApi.toggleStatus(id, is_active);
    if (result.ok) {
      await fetchPresets();
      return true;
    }
    return false;
  }, [fetchPresets]);

  const copyPresetToEvent = useCallback(async (preset_id: string, event_id: string) => {
    const result = await presetApi.copyToEvent(preset_id, event_id);
    if (result.ok && result.data) {
      const data = result.data as any;
      return data.id ? data : data.data || null;
    }
    return null;
  }, []);

  const activePresets = presets.filter((p) => p.is_active);
  const inactivePresets = presets.filter((p) => !p.is_active);

  return {
    presets,
    activePresets,
    inactivePresets,
    stats,
    activeCount,
    loading,
    error,
    refetch: fetchPresets,
    createPreset,
    updatePreset,
    deletePreset,
    toggleActive,
    copyPresetToEvent,
  };
}
