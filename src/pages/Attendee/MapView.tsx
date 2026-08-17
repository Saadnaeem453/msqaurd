import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Search, Navigation, ChevronRight } from "lucide-react";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Friday Youth Circle",
    date: "Today, 7:00 PM",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Charity Gala Dinner",
    date: "Sat, Oct 12 · 6:00 PM",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Arabic Mastery Seminar",
    date: "Oct 15 · 10:00 AM",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Muslim Medics Meetup",
    date: "Oct 18 · 5:00 PM",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Quran Study Circle",
    date: "Oct 20 · 6:30 PM",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Halal Food Festival",
    date: "Oct 22 · 12:00 PM",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop",
  },
];

const MapView = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const visibleEvents = useMemo(
    () => MOCK_EVENTS.slice(0, visibleCount),
    [visibleCount]
  );

  return (
    <div className="h-[calc(100vh-140px)] flex overflow-hidden app-container-breakout">
      {/* ── Map Area ───────────────────────────────────────── */}
      <div className="flex-1 relative bg-[#0d0e12]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="100" height="100" fill="#0d0e12" />

          {/* Grid */}
          {[20, 40, 60, 80].map((v) => (
            <g key={`g-${v}`}>
              <line x1={v} y1="0" x2={v} y2="100" stroke="#1a1b20" strokeWidth="0.3" />
              <line x1="0" y1={v} x2="100" y2={v} stroke="#1a1b20" strokeWidth="0.3" />
            </g>
          ))}

          {/* Roads */}
          <path d="M0 50 Q25 45 50 50 T100 50" stroke="#1e1f25" strokeWidth="2" fill="none" />
          <path d="M50 0 Q45 25 50 50 T50 100" stroke="#1e1f25" strokeWidth="2" fill="none" />
          <path d="M0 30 Q30 28 60 35 T100 30" stroke="#1a1b20" strokeWidth="1" fill="none" />
          <path d="M0 70 Q40 65 70 72 T100 68" stroke="#1a1b20" strokeWidth="1" fill="none" />
          <path d="M20 0 Q22 30 25 50 T20 100" stroke="#1a1b20" strokeWidth="1" fill="none" />
          <path d="M80 0 Q78 40 75 60 T80 100" stroke="#1a1b20" strokeWidth="1" fill="none" />

          {/* Thames */}
          <path
            d="M0 60 Q20 55 35 62 Q50 68 65 60 Q80 52 100 58"
            stroke="#1a2332"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />

          {/* Parks */}
          <ellipse cx="30" cy="40" rx="8" ry="6" fill="#0f1a0f" opacity="0.5" />
          <ellipse cx="70" cy="30" rx="6" ry="5" fill="#0f1a0f" opacity="0.5" />
          <ellipse cx="55" cy="80" rx="10" ry="7" fill="#0f1a0f" opacity="0.5" />

          {/* User pulse */}
          <circle cx="50" cy="50" r="8" fill="#ef4444" opacity="0.1">
            <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="2" fill="#ef4444" />
          <circle cx="50" cy="50" r="1" fill="white" />

          {/* Event markers */}
          {MOCK_EVENTS.map((event, i) => {
            const positions = [
              { x: 45, y: 35 },
              { x: 62, y: 48 },
              { x: 38, y: 58 },
              { x: 55, y: 30 },
              { x: 30, y: 42 },
              { x: 68, y: 62 },
            ];
            const pos = positions[i];
            const isSelected = selectedEvent === event.id;
            return (
              <g
                key={event.id}
                className="cursor-pointer"
                onClick={() => navigate(`/home/events/${event.id}`)}
              >
                <circle cx={pos.x} cy={pos.y} r="5" fill="#ef4444" opacity="0.15">
                  {isSelected && (
                    <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" />
                  )}
                </circle>
                <circle cx={pos.x} cy={pos.y} r={isSelected ? 3 : 2} fill="#ef4444" stroke="#0d0e12" strokeWidth="0.5" />
                <circle cx={pos.x} cy={pos.y} r="0.8" fill="white" opacity="0.8" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Events Sidebar (Right) ────────────────────────── */}
      <div className="w-72 md:w-80 bg-[#0d0e12] flex flex-col overflow-hidden border-l border-secondary/10">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-semibold text-base">In this area</h2>
            <span className="bg-red-600/20 text-red-400 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {MOCK_EVENTS.length} events
            </span>
          </div>
          <p className="text-secondary text-xs">London, Greater London</p>
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 space-y-3">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate(`/home/events/${event.id}`)}
              className={`bg-[#131418] border rounded-xl p-3 cursor-pointer transition-all ${
                selectedEvent === event.id
                  ? "border-red-600/40"
                  : "border-secondary/10 hover:border-secondary/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium leading-tight mb-1">
                    {event.title}
                  </h3>
                  <p className="text-secondary/60 text-[11px] flex items-center gap-1">
                    <Clock size={10} />
                    {event.date}
                  </p>
                </div>
                <ChevronRight size={14} className="text-secondary/30 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < MOCK_EVENTS.length && (
          <div className="px-4 pb-4 flex-shrink-0">
            <button
              onClick={() => setVisibleCount((c) => Math.min(c + 3, MOCK_EVENTS.length))}
              className="w-full text-red-400 text-sm font-medium py-2.5 rounded-lg border border-red-600/20 hover:bg-red-600/10 transition-colors"
            >
              Load more events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
