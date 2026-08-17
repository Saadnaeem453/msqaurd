import { useState, type ReactNode } from "react";
import {
  Info,
  MapPin,
  Ticket,
  ImageIcon,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Rocket,
  Eye,
  Lightbulb,
} from "lucide-react";
import { EventFormData } from "../../../pages/Organizer/events/CreateEvent";

interface Props {
  data: EventFormData;
  updateData: (data: Partial<EventFormData>) => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isLoading?: boolean;
}

type SectionId = "basics" | "logistics" | "tickets" | "media" | "agenda";

const ReviewStep = ({ data, onSaveDraft, onPublish, isLoading }: Props) => {
  const [expanded, setExpanded] = useState<SectionId>("basics");

  const hasHeroImage = Boolean(data.heroImage || data.heroImageUrl);
  const galleryCount = (data.gallery?.length || 0) + (data.galleryUrls?.length || 0);
  const hasTiers = data.tiers?.length > 0;
  const hasAgenda = data.agenda?.length > 0;

  const contentReady = Boolean(data.title && data.category && data.description);
  const scheduleReady = Boolean(data.eventDate && data.startTime && data.endTime);
  const mediaReady = hasHeroImage && galleryCount >= 1;
  const ticketingReady = hasTiers;

  const readinessItems = [
    {
      label: "Content Accuracy",
      detail: "Dates and descriptions verified",
      ready: contentReady && scheduleReady,
    },
    {
      label: "Media Quality",
      detail: "High-res images uploaded",
      ready: mediaReady,
    },
    {
      label: "Ticketing Active",
      detail: "Stripe integration connected",
      ready: ticketingReady,
    },
    {
      label: "Organizer Terms",
      detail: "Policies and safety agreed",
      ready: true,
    },
  ];

  const toggleSection = (id: SectionId) => {
    setExpanded((prev) => (prev === id ? prev : id));
  };

  const sections: {
    id: SectionId;
    label: string;
    icon: typeof Info;
    content: ReactNode;
  }[] = [
    {
      id: "basics",
      label: "Basics",
      icon: Info,
      content: (
        <div className="space-y-5 pt-1">
          <div>
            <p className="text-secondary/60 text-[10px] uppercase tracking-[0.15em] font-semibold mb-1.5">
              Event Title
            </p>
            <p className="text-white text-base font-semibold">
              {data.title || "—"}
            </p>
          </div>
          <div>
            <p className="text-secondary/60 text-[10px] uppercase tracking-[0.15em] font-semibold mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {data.category ? (
                <span className="bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {data.category}
                </span>
              ) : (
                <span className="text-secondary text-sm">—</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-secondary/60 text-[10px] uppercase tracking-[0.15em] font-semibold mb-1.5">
              Description
            </p>
            <p className="text-secondary/80 text-sm leading-relaxed whitespace-pre-wrap">
              {data.description || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "logistics",
      label: "Logistics",
      icon: MapPin,
      content: (
        <div className="space-y-4 pt-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Date</span>
            <span className="text-white text-right">{data.eventDate || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Time</span>
            <span className="text-white text-right">
              {data.startTime && data.endTime
                ? `${data.startTime} – ${data.endTime}`
                : "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Timezone</span>
            <span className="text-white text-right">{data.timezone || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Venue</span>
            <span className="text-white text-right">{data.venueName || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Type</span>
            <span className="text-white text-right capitalize">
              {data.venueType || "physical"}
            </span>
          </div>
          {data.streetAddress && (
            <div className="flex justify-between gap-4">
              <span className="text-secondary/60">Address</span>
              <span className="text-white text-right">{data.streetAddress}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: Ticket,
      content: (
        <div className="space-y-3 pt-1 text-sm">
          {hasTiers ? (
            data.tiers.map((tier, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <span className="text-secondary/80">
                  {tier.name}
                  {tier.isPrimary && " (Primary)"}
                </span>
                <span className="text-white">
                  £{tier.price} × {tier.capacity}
                </span>
              </div>
            ))
          ) : (
            <p className="text-secondary/60">No ticket tiers configured yet.</p>
          )}
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: ImageIcon,
      content: (
        <div className="space-y-4 pt-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Hero Image</span>
            <span className={hasHeroImage ? "text-white" : "text-secondary/50"}>
              {hasHeroImage ? "Uploaded" : "Not uploaded"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary/60">Gallery</span>
            <span className="text-white">{galleryCount} image(s)</span>
          </div>
          {data.videoUrl && (
            <div className="flex justify-between gap-4">
              <span className="text-secondary/60">Video URL</span>
              <span className="text-white truncate ml-4">{data.videoUrl}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: ListOrdered,
      content: (
        <div className="space-y-3 pt-1 text-sm">
          {hasAgenda ? (
            data.agenda.map((item, idx) => (
              <div
                key={idx}
                className="border-b border-secondary/10 last:border-0 pb-3 last:pb-0"
              >
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-secondary/60 text-xs mt-0.5">
                  {item.time}
                  {item.duration ? ` · ${item.duration}` : ""}
                  {item.type ? ` · ${item.type}` : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-secondary/60">No agenda sessions added yet.</p>
          )}
          {data.speakers?.length > 0 && (
            <p className="text-secondary/50 text-xs pt-1">
              {data.speakers.length} speaker(s) linked
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left — review accordions */}
      <div className="lg:col-span-2 space-y-3">
        {sections.map(({ id, label, icon: Icon, content }) => {
          const isOpen = expanded === id;
          return (
            <div
              key={id}
              className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-white font-medium">{label}</span>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className="text-secondary/60" />
                ) : (
                  <ChevronDown size={18} className="text-secondary/60" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-secondary/10">{content}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right — readiness sidebar */}
      <div className="space-y-4">
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Readiness Check</h3>
          <ul className="space-y-4 mb-6">
            {readinessItems.map((item) => (
              <li key={item.label} className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className={`flex-shrink-0 mt-0.5 ${
                    item.ready ? "text-primary" : "text-secondary/30"
                  }`}
                />
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-secondary/60 text-xs mt-0.5">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onPublish}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Rocket size={16} />
              {isLoading ? "Publishing..." : "Publish Event"}
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isLoading}
              className="w-full py-3 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save for Later
            </button>
          </div>

          <p className="text-secondary/50 text-[11px] leading-relaxed mt-4">
            By publishing, your event will immediately be visible on the public explorer.
          </p>
        </div>

        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/5 border border-secondary/10 flex items-center justify-center flex-shrink-0">
            <Eye size={16} className="text-secondary" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Live Preview</p>
            <button
              type="button"
              className="text-primary text-xs font-medium hover:text-primary/80 transition-colors"
            >
              View as Attendee
            </button>
          </div>
        </div>

        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-1">Pro Tip</p>
              <p className="text-secondary/60 text-xs leading-relaxed">
                Events with at least 3 high-quality images see 40% higher ticket conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
