import { useState } from "react";
import {
  MoreVertical,
  Plus,
  SlidersHorizontal,
  ExternalLink,
  Pencil,
  PauseCircle,
  PlusCircle,
} from "lucide-react";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useTicketPresets } from "../../../hooks/useTicketPresets";
import type { TicketPreset, CreatePresetPayload, UpdatePresetPayload } from "../../../services/preset.service";
import PresetModal from "../../../components/Organizer/PresetModal";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ── Sub-components ──────────────────────────────────────────────────────────

const ToggleSwitch = ({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
      enabled ? "bg-primary" : "bg-secondary/20"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
      style={{ left: enabled ? "22px" : "2px" }}
    />
  </button>
);

const CircularGauge = ({ percent }: { percent: number }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#1f2937"
        strokeWidth="6"
      />
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#e50a15"
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
      <text
        x="40"
        y="44"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
      >
        {percent}%
      </text>
    </svg>
  );
};

const PresetCard = ({
  preset,
  onEdit,
  onDelete,
  onToggle,
  activeCount,
}: {
  preset: TicketPreset;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  activeCount: number;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`relative bg-[#131418] border rounded-xl p-5 transition-opacity ${
        preset.is_active
          ? "border-secondary/10 opacity-100"
          : "border-secondary/5 opacity-60"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              preset.is_active ? "bg-primary" : "bg-secondary/30"
            }`}
          />
          <h3
            className={`font-jakarta text-lg font-bold ${
              preset.is_active ? "text-white" : "text-secondary/60"
            }`}
          >
            {preset.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            enabled={preset.is_active}
            onChange={onToggle}
            disabled={!preset.is_active && activeCount >= 3}
          />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-secondary/40 hover:text-white transition-colors p-1"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-8 w-36 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
            <button
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors"
            >
              Edit Preset
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {/* Category Badge */}
      {preset.category && (
        <span className="inline-block bg-secondary/10 text-secondary/70 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded mb-3">
          {preset.category}
        </span>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-primary font-jakarta">
          ${preset.price}
        </span>
        <span className="text-secondary/50 text-sm">/ unit</span>
      </div>

      {/* Capacity */}
      <div className="mb-4">
        <span className="text-secondary/60 text-xs">
          Capacity: {preset.capacity.toLocaleString()}
        </span>
      </div>

      {/* Booking Fee */}
      {preset.booking_fee !== undefined && preset.booking_fee !== null && preset.booking_fee > 0 && (
        <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-3">
          <p className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold mb-1">
            Booking Fee
          </p>
          <p className="text-white text-sm font-bold">
            {formatCurrency(preset.booking_fee)}
          </p>
        </div>
      )}
    </div>
  );
};

// ─ Page Component ──────────────────────────────────────────────────────────

const TicketTypes = () => {
  const {
    presets,
    activePresets,
    inactivePresets,
    stats,
    activeCount,
    loading,
    refetch,
    createPreset,
    updatePreset,
    deletePreset,
    toggleActive,
  } = useTicketPresets();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPreset, setEditPreset] = useState<TicketPreset | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TicketPreset | null>(null);
  const [platformFee, setPlatformFee] = useState("3.5");
  const [processingFee, setProcessingFee] = useState("0.99");

  const handleToggle = async (id: string, currentActive: boolean) => {
    const newStatus = !currentActive;
    if (newStatus && activeCount >= 3) return;
    await toggleActive(id, newStatus);
  };

  const handleCreate = async (data: CreatePresetPayload) => {
    return await createPreset(data);
  };

  const handleUpdate = async (data: CreatePresetPayload) => {
    if (!editPreset) return false;
    const payload: UpdatePresetPayload = { ...data };
    return await updatePreset(editPreset.id, payload);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await deletePreset(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const avgPrice = stats
    ? parseFloat(stats.avg_ticket_price)
    : presets.length > 0
      ? presets.reduce((s, p) => s + p.price, 0) / presets.length
      : 0;

  const totalPresets = stats?.total_presets ?? presets.length;
  const activePresetsCount = stats?.active_presets ?? activeCount;
  const inactivePresetsCount = stats?.inactive_presets ?? inactivePresets.length;

  // Update log (derived from presets — in production, fetch from API)
  const tierUpdates = [
    {
      id: "u1",
      type: "price" as const,
      tierName: "Tier Price Updated",
      message: "Preset pricing was modified recently",
      time: "Recent",
    },
    {
      id: "u2",
      type: "pause" as const,
      tierName: "Preset Deactivated",
      message: "A preset was moved to inactive status",
      time: "Recent",
    },
    {
      id: "u3",
      type: "create" as const,
      tierName: "Preset Created",
      message: "A new ticket preset was added",
      time: "Recent",
    },
  ];

  const updateIcon = (type: string) => {
    switch (type) {
      case "price":
        return <Pencil size={14} className="text-primary" />;
      case "pause":
        return <PauseCircle size={14} className="text-yellow-500" />;
      case "create":
        return <PlusCircle size={14} className="text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl md:text-3xl font-bold text-white">
            Ticket Types
          </h1>
          <p className="text-secondary/60 text-sm mt-1 max-w-xl">
            Manage pricing tiers and inventory across all active events.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Create New Tier
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Total Presets
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white font-jakarta">
            {loading ? "—" : totalPresets}
          </p>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Avg. Ticket Price
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white font-jakarta">
            {loading ? "—" : formatCurrency(avgPrice)}
          </p>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Active Presets
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl md:text-3xl font-bold text-white font-jakarta">
              {loading ? "—" : activePresetsCount}
            </p>
            <span className="text-secondary/60 text-xs font-medium mb-1">
              of 3 max
            </span>
          </div>
        </div>
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-2">
            Inactive
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white font-jakarta">
            {loading ? "—" : inactivePresetsCount}
          </p>
        </div>
      </div>

      {/* ── Preset Cards ──────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : presets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-secondary/60 text-lg mb-2">No presets yet</p>
          <p className="text-secondary/40 text-sm mb-4">
            Create your first ticket preset to get started.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> Create First Preset
          </button>
        </div>
      ) : (
        <>
          {/* Active presets first */}
          {activePresets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <h2 className="font-jakarta text-sm font-bold text-white uppercase tracking-wider">
                  Active Presets ({activePresets.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activePresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    activeCount={activeCount}
                    onEdit={() => setEditPreset(preset)}
                    onDelete={() => {
                      setDeleteTarget(preset);
                      setShowDeleteModal(true);
                    }}
                    onToggle={() => handleToggle(preset.id, true)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive presets */}
          {inactivePresets.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-secondary/30" />
                <h2 className="font-jakarta text-sm font-bold text-secondary/60 uppercase tracking-wider">
                  Inactive Presets ({inactivePresets.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {inactivePresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    activeCount={activeCount}
                    onEdit={() => setEditPreset(preset)}
                    onDelete={() => {
                      setDeleteTarget(preset);
                      setShowDeleteModal(true);
                    }}
                    onToggle={() => handleToggle(preset.id, false)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ─ Global Tier Settings ───────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal size={18} className="text-primary" />
          <h2 className="font-jakarta text-xl font-bold text-white">
            Global Tier Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Booking Fee Configuration */}
          <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-5 md:p-6">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-5">
              Booking Fee Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-2">
                  Standard Platform Fee (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-2">
                  Fixed Processing Fee ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 text-sm">
                    $
                  </span>
                </div>
              </div>
            </div>

            {/* Fee Distribution Preview */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-4 mb-5">
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold mb-3">
                Fee Distribution Preview
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary/80">
                    Platform Rebate (MS2)
                  </span>
                  <span className="text-primary font-semibold">1.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/80">
                    Stripe Processing
                  </span>
                  <span className="text-white font-semibold">
                    2.0% + $0.30
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-secondary/10">
                  <span className="text-white font-semibold">
                    Organiser Net Fee
                  </span>
                  <span className="text-white font-bold">
                    $0.69 + 0%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-5 py-2 bg-secondary/10 text-secondary hover:text-white hover:bg-secondary/20 rounded-lg text-sm font-medium transition-colors">
                Save Config
              </button>
            </div>
          </div>

          {/* Platform Rebate */}
          <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-5 md:p-6">
            <h3 className="text-white text-sm font-bold mb-1">
              Platform Rebate
            </h3>
            <p className="text-secondary/50 text-xs mb-6">
              Visibility into MSQUARED&apos;s service share across your ticket
              inventory.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <CircularGauge percent={6.2} />
              <div>
                <p className="text-white text-lg font-bold font-jakarta">
                  Total Platform Draw
                </p>
                <p className="text-secondary/50 text-xs">
                  Rolling 30-day average
                </p>
              </div>
            </div>

            <button className="flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors mt-2">
              View Detailed Settlement Report
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Tier Updates ────────────────────────────── */}
      <div>
        <h2 className="font-jakarta text-lg font-bold text-white mb-4">
          Recent Tier Updates
        </h2>

        <div className="space-y-3">
          {tierUpdates.map((update) => (
            <div
              key={update.id}
              className="flex items-center gap-4 bg-[#131418] border border-secondary/10 rounded-xl px-5 py-4"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                {updateIcon(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">
                  {update.tierName}
                </p>
                <p className="text-secondary/50 text-xs mt-0.5 truncate">
                  {update.message}
                </p>
              </div>
              <span className="text-secondary/40 text-xs flex-shrink-0 hidden sm:block">
                {update.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create Preset Modal ────────────────────────────── */}
      <PresetModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        activeCount={activeCount}
      />

      {/* ── Edit Preset Modal ──────────────────────────────── */}
      {editPreset && (
        <PresetModal
          open={true}
          onClose={() => setEditPreset(null)}
          onSubmit={handleUpdate}
          preset={editPreset}
          isEdit
          activeCount={activeCount}
        />
      )}

      {/* ── Delete Confirmation Modal ──────────────────────── */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Preset"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone. Copied tiers in events will remain unaffected.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

export default TicketTypes;
