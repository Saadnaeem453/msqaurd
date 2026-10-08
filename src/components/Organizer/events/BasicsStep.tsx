import { EventFormData } from "../../../pages/Organizer/events/CreateEvent";
import { useState } from "react";
import {
  BookOpen,
  Hammer,
  Users,
  PartyPopper,
  Trophy,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";

interface Props {
  data: EventFormData;
  updateData: (data: Partial<EventFormData>) => void;
  onNext?: () => void;
  onBack?: () => void;
  errors?: Record<string, string>;
}

const BasicsStep = ({ data, updateData, onNext, onBack, errors = {} }: Props) => {
  const [description, setDescription] = useState(data.description || "");
  const maxDescriptionLength = 250;

  const categoryOptions = [
    { label: "Lecture", icon: BookOpen },
    { label: "Workshop", icon: Hammer },
    { label: "Networking", icon: Users },
    { label: "Social", icon: PartyPopper },
    { label: "Competition", icon: Trophy },
    { label: "Other", icon: MoreHorizontal },
  ];

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxDescriptionLength) {
      setDescription(value);
      updateData({ description: value });
    }
  };

  const handleCategorySelect = (cat: string) => {
    updateData({ category: cat });
  };

  return (
    <div className="grid bg-[#131418] mt-8  p-6 md:p-8 border border-secondary/10 rounded-xl grid-cols-1 lg:grid-cols-5 gap-6">

      <div className="lg:col-span-3 space-y-6">

        <div>
          <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
            EVENT TITLE
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            placeholder="e.g., Annual Youth Leadership Seminar"
            className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors ${
              errors.title ? "border-red-500" : "border-secondary/20"
            }`}
          />
          {errors.title ? (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.title}
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-1">
              Give your event a clear, catchy name that stands out.
            </p>
          )}
        </div>


        <div>
          <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
            CATEGORY
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categoryOptions.map((cat) => {
              const isSelected = data.category === cat.label;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleCategorySelect(cat.label)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-secondary/5 border-secondary/20 text-gray-400 hover:border-secondary/40 hover:text-white"
                  }`}
                >
                  <Icon size={24} className="mb-1" strokeWidth={1.5} />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.category}
            </p>
          )}
        </div>


        <div>
          <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
            SHORT DESCRIPTION
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Briefly describe what makes this event special..."
              rows={3}
              className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors resize-none pr-16 ${
                errors.description ? "border-red-500" : "border-secondary/20"
              }`}
            />
            <span className="absolute bottom-2 right-2 text-gray-400 text-xs">
              {description.length} / {maxDescriptionLength}
            </span>
          </div>
          {errors.description ? (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.description}
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-1">
              Summarize the main takeaway for attendees.
            </p>
          )}
        </div>
      </div>


      <div className="lg:col-span-2 space-y-6">

        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
          <span className="bg-primary inline-block h-2 w-8 mt-2 rounded-full"></span>
            <div>
              <p className="text-white text-sm font-medium">Did you know?</p>
              <p className="text-gray-400 text-sm">
                Events with clear categories and punchy titles get 40% more engagement in the UmmahEvents discovery feed. Keep it concise!
              </p>
            </div>
          </div>
        </div>


        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
          <h4 className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold mb-3">
            PREVIEWING CARD
          </h4>
          <div className="bg-[#111214] rounded-lg p-4 border border-secondary/20">
            <div className="flex flex-col gap-1">
              <span className="text-primary text-xs font-medium uppercase tracking-wider">
                {data.category || "CATEGORY"}
              </span>
              <h3 className="text-white text-lg font-semibold">
                {data.title || "Event Title"}
              </h3>
              <p className="text-gray-400 text-sm">
                {data.description || "Short description of the event..."}
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default BasicsStep;