import { EventFormData } from "../../../pages/Organizer/events/CreateEvent";
import { useState } from "react";
import { Plus, Trash2, Sparkles, Copy } from "lucide-react";
import { useTicketPresets } from "../../../hooks/useTicketPresets";
import type { TicketPreset } from "../../../services/preset.service";



interface Props {
  data: EventFormData;
  updateData: (data: Partial<EventFormData>) => void;
  eventId?: string;
}

interface Tier {
  id?: string;
  name: string;
  price: number;
  capacity: number;
  salesStart: string;
  salesEnd: string;
  isPremium: boolean;
  premiumDescription?: string;
  isPrimary: boolean;
}



const TicketsStep = ({ data, updateData, eventId }: Props) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [copyingPresetId, setCopyingPresetId] = useState<string | null>(null);
  const [newTier, setNewTier] = useState<Tier>({
    name: "",
    price: 0,
    capacity: 0,
    salesStart: "",
    salesEnd: "",
    isPremium: false,
    premiumDescription: "",
    isPrimary: false,
  });


  const { activePresets, copyPresetToEvent, loading: presetsLoading } = useTicketPresets(true);


  const showPresets = activePresets.length > 0;

  const addTier = () => {
    if (newTier.name && newTier.price > 0 && newTier.capacity > 0) {
      const tiers = data.tiers || [];

      const updatedTiers = newTier.isPrimary
        ? tiers.map((t) => ({ ...t, isPrimary: false }))
        : tiers;
      updateData({
        tiers: [
          ...updatedTiers,
          {
            ...newTier,
            premiumDescription: newTier.isPremium ? newTier.premiumDescription : undefined,
          },
        ],
      });
      setNewTier({
        name: "",
        price: 0,
        capacity: 0,
        salesStart: "",
        salesEnd: "",
        isPremium: false,
        premiumDescription: "",
        isPrimary: false,
      });
      setShowAddForm(false);
    }
  };

  const removeTier = (index: number) => {
    const tiers = data.tiers || [];
    const updated = tiers.filter((_, i) => i !== index);
    updateData({ tiers: updated });
  };

  const updateTierField = (index: number, field: string, value: any) => {
    const tiers = data.tiers || [];
    const updated = tiers.map((tier, i) => {
      if (i === index) {

        if (field === "isPrimary" && value === true) {
          return { ...tier, isPrimary: true };
        }
        return { ...tier, [field]: value };
      }
      return tier;
    });
    updateData({ tiers: updated });
  };

  const handleSetPrimary = (index: number) => {
    const tiers = data.tiers || [];
    const updated = tiers.map((t, i) => ({
      ...t,
      isPrimary: i === index,
    }));
    updateData({ tiers: updated });
  };

  const handleUsePreset = async (preset: TicketPreset) => {
    if (!eventId) {

      const tiers = data.tiers || [];
      const newTierFromPreset: Tier = {
        name: preset.name,
        price: preset.price,
        capacity: preset.capacity,
        salesStart: preset.sales_start || "",
        salesEnd: preset.sales_end || "",
        isPremium: preset.is_premium || false,
        premiumDescription: preset.premium_description || undefined,
        isPrimary: preset.is_primary || false,
      };
      const updatedTiers = newTierFromPreset.isPrimary
        ? tiers.map((t) => ({ ...t, isPrimary: false }))
        : tiers;
      updateData({
        tiers: [
          ...updatedTiers,
          {
            ...newTierFromPreset,
            premiumDescription: newTierFromPreset.isPremium
              ? newTierFromPreset.premiumDescription
              : undefined,
          },
        ],
      });
      return;
    }


    setCopyingPresetId(preset.id);
    try {
      const result = await copyPresetToEvent(preset.id, eventId);
      if (result) {



        const tiers = data.tiers || [];
        const newTierFromPreset: Tier = {
          name: preset.name,
          price: preset.price,
          capacity: preset.capacity,
          salesStart: preset.sales_start || "",
          salesEnd: preset.sales_end || "",
          isPremium: preset.is_premium || false,
          premiumDescription: preset.premium_description || undefined,
          isPrimary: preset.is_primary || false,
        };
        const updatedTiers = newTierFromPreset.isPrimary
          ? tiers.map((t) => ({ ...t, isPrimary: false }))
          : tiers;
        updateData({
          tiers: [
            ...updatedTiers,
            {
              ...newTierFromPreset,
              premiumDescription: newTierFromPreset.isPremium
                ? newTierFromPreset.premiumDescription
                : undefined,
            },
          ],
        });
      }
    } finally {
      setCopyingPresetId(null);
    }
  };


  const tiers = data.tiers || [];
  const totalRevenue = tiers.reduce((sum, t) => sum + t.price * t.capacity, 0);
  const totalCapacity = tiers.reduce((sum, t) => sum + t.capacity, 0);
  const bookingFeeRate = 0.025;
  const bookingFeeFixed = 0.5;
  const platformRebate = totalRevenue * 0.025;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      <div className="lg:col-span-3 space-y-6">

        {showPresets && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white font-jakarta">
                  Available Presets
                </h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  Use a pre-configured tier template.
                </p>
              </div>
            </div>

            {presetsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white text-sm font-semibold">
                          {preset.name}
                        </h4>
                        <p className="text-primary text-lg font-bold font-jakarta mt-0.5">
                          ${preset.price}
                        </p>
                      </div>
                      {preset.is_primary && (
                        <span className="text-[10px] text-primary border border-primary px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles size={10} /> Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Cap: {preset.capacity.toLocaleString()}</span>
                      {preset.category && (
                        <>
                          <span>·</span>
                          <span className="capitalize">{preset.category.replace("_", " ")}</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleUsePreset(preset)}
                      disabled={copyingPresetId === preset.id}
                      className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {copyingPresetId === preset.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Use This Tier
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {showPresets && (
          <div className="border-t border-[#292a2b]" />
        )}


        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white font-jakarta">
              Manage Tiers
            </h3>
            <p className="text-gray-400 text-sm mt-0.5">
              Define your ticket types and access levels.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Add Tier
          </button>
        </div>


        <div className="space-y-4">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-[#080809] border rounded-lg p-4 space-y-3 ${
                tier.isPrimary ? "border-primary/60 border-2" : "border-[#292a2b]"
              }`}
            >

              {tier.isPrimary && (
                <div className="flex justify-end">
                  <span className="text-xs text-primary border border-primary px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles size={12} /> Primary
                  </span>
                </div>
              )}


              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
                    TIER NAME
                  </p>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTierField(idx, "name", e.target.value)}
                    className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
                    PRICE
                  </p>
                  <input
                    type="number"
                    value={tier.price || ""}
                    onChange={(e) =>
                      updateTierField(idx, "price", parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
                    CAPACITY
                  </p>
                  <input
                    type="number"
                    value={tier.capacity || ""}
                    onChange={(e) =>
                      updateTierField(idx, "capacity", parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#292a2b]">

                <div className="bg-[#0d0e12] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <span className="text-white text-sm font-medium">Premium Perks</span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = tiers.map((t, i) => {
                          if (i === idx) {
                            return {
                              ...t,
                              isPremium: !t.isPremium,
                              premiumDescription: t.isPremium ? undefined : t.premiumDescription || "",
                            };
                          }
                          return t;
                        });
                        updateData({ tiers: updated });
                      }}
                      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                        tier.isPremium ? "bg-primary" : "bg-[#292a2b]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          tier.isPremium ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {tier.isPremium && tier.premiumDescription && (
                    <p className="mt-2 text-gray-400 text-sm">
                      {tier.premiumDescription}
                    </p>
                  )}
                </div>


                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
                    SALES PERIOD
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="date"
                      value={tier.salesStart || ""}
                      onChange={(e) =>
                        updateTierField(idx, "salesStart", e.target.value)
                      }
                      className="flex-1 bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="date"
                      value={tier.salesEnd || ""}
                      onChange={(e) =>
                        updateTierField(idx, "salesEnd", e.target.value)
                      }
                      className="flex-1 bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>


              <div className="flex justify-end pt-2 border-t border-[#292a2b]">
                <button
                  onClick={() => removeTier(idx)}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>


        {showAddForm && (
          <div className="bg-[#080809] border border-[#292a2b] rounded-lg p-4 space-y-3">
            <h4 className="text-white text-sm font-medium">New Tier</h4>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tier name"
                value={newTier.name}
                onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                className="bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors"
              />
              <input
                type="number"
                placeholder="Price (£)"
                value={newTier.price || ""}
                onChange={(e) =>
                  setNewTier({ ...newTier, price: parseFloat(e.target.value) || 0 })
                }
                className="bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newTier.capacity || ""}
                onChange={(e) =>
                  setNewTier({ ...newTier, capacity: parseInt(e.target.value) || 0 })
                }
                className="bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#292a2b]">
              <div className="bg-[#0d0e12] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-white text-sm font-medium">Premium Perks</span>
                  </div>
                  <button
                    onClick={() => setNewTier({ ...newTier, isPremium: !newTier.isPremium })}
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                      newTier.isPremium ? "bg-primary" : "bg-[#292a2b]"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        newTier.isPremium ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
                {newTier.isPremium && (
                  <input
                    type="text"
                    placeholder="e.g. Lounge access, priority seating"
                    value={newTier.premiumDescription || ""}
                    onChange={(e) =>
                      setNewTier({ ...newTier, premiumDescription: e.target.value })
                    }
                    className="w-full mt-2 bg-transparent border border-[#292a2b] rounded-lg px-3 py-1.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors"
                  />
                )}
              </div>

              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
                  SALES PERIOD
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="date"
                    value={newTier.salesStart}
                    onChange={(e) =>
                      setNewTier({ ...newTier, salesStart: e.target.value })
                    }
                    className="flex-1 bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="date"
                    value={newTier.salesEnd}
                    onChange={(e) =>
                      setNewTier({ ...newTier, salesEnd: e.target.value })
                    }
                    className="flex-1 bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[#292a2b]">
              <span className="text-white text-sm">Set as Primary</span>
              <button
                onClick={() => setNewTier({ ...newTier, isPrimary: !newTier.isPrimary })}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  newTier.isPrimary ? "bg-primary" : "bg-[#292a2b]"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    newTier.isPrimary ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex gap-3 pt-2 border-t border-[#292a2b]">
              <button
                onClick={addTier}
                className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
              >
                Save Tier
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTier({
                    name: "",
                    price: 0,
                    capacity: 0,
                    salesStart: "",
                    salesEnd: "",
                    isPremium: false,
                    premiumDescription: "",
                    isPrimary: false,
                  });
                }}
                className="px-4 py-1.5 border border-[#292a2b] text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>


      <div className="lg:col-span-2 space-y-6">

        <div className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-4">
          <h4 className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold font-jakarta">
            Financial Overview
          </h4>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
                TOTAL POTENTIAL REVENUE
              </p>
              <p className="text-3xl font-bold text-primary">
                £{totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1 bg-secondary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                </div>
                <span className="text-gray-400 text-xs">65%</span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">from General Admission</p>
            </div>
            <div className="pt-3 border-t border-[#292a2b] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total Capacity</span>
                <span className="text-gray-400 font-medium">
                  {totalCapacity} Tickets
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Booking Fees</span>
                <span className="text-gray-400 font-medium">
                  {bookingFeeRate * 100}% + £{bookingFeeFixed.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Platform Rebate</span>
                <span className="text-red-500 font-medium">
                  £{platformRebate.toFixed(0)} credit
                </span>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-primary text-lg">💡</span>
            <div>
              <p className="text-white text-sm font-medium">Pricing Strategy Tip</p>
              <p className="text-secondary text-sm">
                Events with Early Bird tiers typically sell out <span className="text-white">24% faster</span>.
                Consider extending the VIP sales period to capture late premium
                bookings.
              </p>
            </div>
          </div>
        </div>


        {data.title && (
          <div className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-3">
            <p className="text-gray-400 text-sm text-center font-jakarta">
              {data.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsStep;
