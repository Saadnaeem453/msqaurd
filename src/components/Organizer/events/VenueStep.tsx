import { EventFormData } from "../../../pages/Organizer/events/CreateEvent";
import { MapPin, Wifi, Monitor, Lightbulb, AlertCircle } from "lucide-react";
import CustomDropdown from "../../ui/CustomDropdown";

interface Props {
  data: EventFormData;
  updateData: (data: Partial<EventFormData>) => void;
  errors?: Record<string, string>;
}

const VenueStep = ({ data, updateData, errors = {} }: Props) => {
  const venueTypes = [
    { label: "Physical", value: "physical", icon: MapPin },
    { label: "Online", value: "online", icon: Wifi },
    { label: "Hybrid", value: "hybrid", icon: Monitor },
  ];

  const handleVenueTypeSelect = (value: string) => {
    updateData({ venueType: value as "physical" | "online" | "hybrid" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      <div className="lg:col-span-3 space-y-6">

        <div className="bg-[#121314] border border-[#292a2b] rounded-lg p-4">
          <h3 className="text-2xl font-jakarta font-semibold text-white mb-4">Time & Date</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
                EVENT DATE
              </label>
              <input
  type="date"
  value={data.eventDate}
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) => updateData({ eventDate: e.target.value })}
  className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors ${
    errors.eventDate ? "border-red-500" : "border-[#292a2b]"
  }`}
/>
              {errors.eventDate && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.eventDate}
                </p>
              )}
            </div>
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
                TIMEZONE
              </label>
              <CustomDropdown
                options={[
                  { value: "GMT (London)", label: "GMT (London)" },
                  { value: "EST", label: "EST" },
                  { value: "PST", label: "PST" },
                ]}
                value={data.timezone}
                onChange={(value) => updateData({ timezone: value })}
              />
            </div>
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
                START TIME
              </label>
              <input
                type="time"
                value={data.startTime}
                onChange={(e) => updateData({ startTime: e.target.value })}
                className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors ${
                  errors.startTime ? "border-red-500" : "border-[#292a2b]"
                }`}
              />
              {errors.startTime && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.startTime}
                </p>
              )}
            </div>
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
                END TIME
              </label>
              <input
                type="time"
                value={data.endTime}
                onChange={(e) => updateData({ endTime: e.target.value })}
                className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors ${
                  errors.endTime ? "border-red-500" : "border-[#292a2b]"
                }`}
              />
              {errors.endTime && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.endTime}
                </p>
              )}
            </div>
          </div>
        </div>


        <div className="bg-[#121314] border border-[#292a2b] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Venue Details</h3>


          <div className="grid grid-cols-3 gap-2 mb-4">
            {venueTypes.map((type) => {
              const isSelected = data.venueType === type.value;
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleVenueTypeSelect(type.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-transparent border-[#292a2b] text-gray-400 hover:border-secondary/40 hover:text-white"
                  }`}
                >
                  <Icon size={24} strokeWidth={1.5} className="mb-1" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
                VENUE NAME
              </label>
              <input
                type="text"
                value={data.venueName}
                onChange={(e) => updateData({ venueName: e.target.value })}
                placeholder="e.g. Regent's Park Mosque Hall"
                className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors ${
                  errors.venueName ? "border-red-500" : "border-[#292a2b]"
                }`}
              />
              {errors.venueName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.venueName}
                </p>
              )}
            </div>
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
                STREET ADDRESS
              </label>
              <input
                type="text"
                value={data.streetAddress}
                onChange={(e) => updateData({ streetAddress: e.target.value })}
                placeholder="123 Park Road, London NW8 7RG"
                className="w-full bg-transparent border border-[#292a2b] rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>


      <div className="lg:col-span-2 space-y-6">

        <div className="bg-[#121314] border border-[#292a2b] rounded-lg p-4">
          <h4 className="text-secondary text-[10px] uppercase tracking-[0.15em] font-semibold mb-3">
            VENUE PREVIEW
          </h4>
          <div className="bg-[#1a1b1e] rounded-lg overflow-hidden border border-[#292a2b]">

            <svg
              viewBox="0 0 400 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >

              <rect width="400" height="200" fill="#2a2b2e" />


              <path
                d="M0 100 L400 100"
                stroke="#3a3b3e"
                strokeWidth="2"
              />
              <path
                d="M200 0 L200 200"
                stroke="#3a3b3e"
                strokeWidth="2"
              />
              <path
                d="M100 0 L100 200"
                stroke="#3a3b3e"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M300 0 L300 200"
                stroke="#3a3b3e"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M0 50 L400 50"
                stroke="#3a3b3e"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M0 150 L400 150"
                stroke="#3a3b3e"
                strokeWidth="1"
                opacity="0.5"
              />


              <rect x="30" y="30" width="40" height="30" fill="#3a3b3e" rx="2" />
              <rect x="90" y="80" width="50" height="30" fill="#3a3b3e" rx="2" />
              <rect x="250" y="40" width="60" height="40" fill="#3a3b3e" rx="2" />
              <rect x="320" y="120" width="40" height="25" fill="#3a3b3e" rx="2" />
              <rect x="40" y="150" width="80" height="20" fill="#3a3b3e" rx="2" />


              <rect x="150" y="120" width="50" height="40" fill="#2d4a2d" rx="4" opacity="0.6" />


              <g transform="translate(210, 100)">
                <path
                  d="M0 -20 C-12 -20 -20 -10 -20 0 C-20 12 0 30 0 30 C0 30 20 12 20 0 C20 -10 12 -20 0 -20Z"
                  fill="#ef4444"
                />
                <circle cx="0" cy="-4" r="6" fill="white" />
              </g>


              <text
                x="220"
                y="120"
                fill="#9ca3af"
                fontSize="10"
                fontFamily="sans-serif"
              >
                {data.venueName || "Regent's Park Mosque Hall"}
              </text>
            </svg>

            <div className="p-3">
              <p className="text-gray-400 text-sm">
                {data.streetAddress || "123 Park Road, Marylebone, London NW8 7RG, UK"}
              </p>
            </div>
          </div>
        </div>


        <div className="bg-[#121314] border border-[#292a2b] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Organizer Tip</p>
              <p className="text-gray-400 text-sm">
                Providing an accurate address ensures attendees get automatic reminders via their mobile OS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueStep;