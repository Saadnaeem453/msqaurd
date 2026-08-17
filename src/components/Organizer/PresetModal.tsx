import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PresetFormData {
  name: string;
  price: string;
  capacity: string;
  description: string;
  category: string;
  sales_start: string;
  sales_end: string;
  booking_fee: string;
  is_premium: boolean;
  premium_description: string;
  is_primary: boolean;
  is_active: boolean;
}

interface PresetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: number;
    capacity: number;
    description: string | null;
    category: string | null;
    sales_start: string | null;
    sales_end: string | null;
    booking_fee: number | null;
    is_premium: boolean;
    premium_description: string | null;
    is_primary: boolean;
    is_active: boolean;
  }) => Promise<boolean>;
  preset?: {
    id: string;
    name: string;
    price: number;
    capacity: number;
    description?: string | null;
    category?: string | null;
    sales_start?: string | null;
    sales_end?: string | null;
    booking_fee?: number | null;
    is_premium?: boolean;
    premium_description?: string | null;
    is_primary?: boolean;
    is_active?: boolean;
  } | null;
  isEdit?: boolean;
  activeCount?: number;
}

const emptyForm: PresetFormData = {
  name: "",
  price: "",
  capacity: "",
  description: "",
  category: "standard",
  sales_start: "",
  sales_end: "",
  booking_fee: "0",
  is_premium: false,
  premium_description: "",
  is_primary: false,
  is_active: false,
};

const categories = [
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "vip", label: "VIP" },
  { value: "student", label: "Student" },
  { value: "early_bird", label: "Early Bird" },
  { value: "general", label: "General Admission" },
];

// ── Component ────────────────────────────────────────────────────────────────

const PresetModal = ({
  open,
  onClose,
  onSubmit,
  preset,
  isEdit = false,
  activeCount = 0,
}: PresetModalProps) => {
  const [form, setForm] = useState<PresetFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Populate form when preset changes (edit mode)
  useEffect(() => {
    if (isEdit && preset) {
      setForm({
        name: preset.name || "",
        price: String(preset.price ?? ""),
        capacity: String(preset.capacity ?? ""),
        description: preset.description || "",
        category: preset.category || "standard",
        sales_start: preset.sales_start || "",
        sales_end: preset.sales_end || "",
        booking_fee: String(preset.booking_fee ?? 0),
        is_premium: preset.is_premium || false,
        premium_description: preset.premium_description || "",
        is_primary: preset.is_primary || false,
        is_active: preset.is_active || false,
      });
    } else if (!isEdit) {
      setForm(emptyForm);
    }
    setErrors({});
  }, [isEdit, preset, open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const updateField = (field: keyof PresetFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price || parseFloat(form.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!form.capacity || parseInt(form.capacity) <= 0)
      newErrors.capacity = "Valid capacity is required";
    if (form.is_active && activeCount >= 3)
      newErrors.is_active = "Maximum 3 active presets allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    const success = await onSubmit({
      name: form.name.trim(),
      price: parseFloat(form.price),
      capacity: parseInt(form.capacity),
      description: form.description.trim() || null,
      category: form.category || null,
      sales_start: form.sales_start || null,
      sales_end: form.sales_end || null,
      booking_fee: parseFloat(form.booking_fee) || null,
      is_premium: form.is_premium,
      premium_description: form.is_premium ? form.premium_description.trim() || null : null,
      is_primary: form.is_primary,
      is_active: form.is_active,
    });
    setSubmitting(false);

    if (success) onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[#131418] border border-secondary/15 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#131418] border-b border-secondary/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-jakarta text-lg font-bold text-white">
            {isEdit ? "Edit Preset" : "Create New Preset"}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary/40 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
              Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. VIP Access"
              className={`w-full bg-secondary/5 border rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 transition-colors ${
                errors.name ? "border-red-500/50" : "border-secondary/10"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price + Capacity row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
                Price ($) <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0.00"
                className={`w-full bg-secondary/5 border rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 transition-colors ${
                  errors.price ? "border-red-500/50" : "border-secondary/10"
                }`}
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
                Capacity <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
                placeholder="100"
                className={`w-full bg-secondary/5 border rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 transition-colors ${
                  errors.capacity ? "border-red-500/50" : "border-secondary/10"
                }`}
              />
              {errors.capacity && (
                <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brief description of this tier..."
              rows={3}
              className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  className="bg-[#1a1c22] text-white"
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sales Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
                Sales Start
              </label>
              <input
                type="date"
                value={form.sales_start}
                onChange={(e) => updateField("sales_start", e.target.value)}
                className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
                Sales End
              </label>
              <input
                type="date"
                value={form.sales_end}
                onChange={(e) => updateField("sales_end", e.target.value)}
                className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Booking Fee */}
          <div>
            <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
              Booking Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.booking_fee}
              onChange={(e) => updateField("booking_fee", e.target.value)}
              placeholder="0.00"
              className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            {/* Is Premium */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Is Premium</p>
                <p className="text-secondary/40 text-[10px]">
                  Enable premium tier features
                </p>
              </div>
              <button
                onClick={() => updateField("is_premium", !form.is_premium)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  form.is_premium ? "bg-primary" : "bg-secondary/20"
                }`}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: form.is_premium ? "22px" : "2px" }}
                />
              </button>
            </div>

            {/* Premium Description (conditional) */}
            {form.is_premium && (
              <div>
                <label className="text-secondary/60 text-[10px] uppercase tracking-wider font-semibold block mb-1.5">
                  Premium Description
                </label>
                <textarea
                  value={form.premium_description}
                  onChange={(e) =>
                    updateField("premium_description", e.target.value)
                  }
                  placeholder="Describe premium benefits..."
                  rows={2}
                  className="w-full bg-secondary/5 border border-secondary/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            )}

            {/* Is Primary */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Is Primary</p>
                <p className="text-secondary/40 text-[10px]">
                  Set as the default ticket tier
                </p>
              </div>
              <button
                onClick={() => updateField("is_primary", !form.is_primary)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  form.is_primary ? "bg-primary" : "bg-secondary/20"
                }`}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: form.is_primary ? "22px" : "2px" }}
                />
              </button>
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Is Active</p>
                <p className="text-secondary/40 text-[10px]">
                  {activeCount >= 3 && !form.is_active
                    ? "Maximum 3 active presets reached"
                    : `${activeCount} of 3 active presets used`}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!form.is_active && activeCount >= 3) {
                    setErrors((prev) => ({
                      ...prev,
                      is_active: "Maximum 3 active presets allowed",
                    }));
                    return;
                  }
                  updateField("is_active", !form.is_active);
                }}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  form.is_active ? "bg-primary" : "bg-secondary/20"
                }`}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: form.is_active ? "22px" : "2px" }}
                />
              </button>
            </div>
            {errors.is_active && (
              <p className="text-red-400 text-xs">{errors.is_active}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#131418] border-t border-secondary/10 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Preset"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresetModal;
