import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, QrCode, ArrowLeft } from "lucide-react";

const MOCK_TICKETS = [
  {
    id: "1",
    title: "Innovate Tech Summit",
    date: { month: "JUN", day: "12", year: "2024" },
    location: "Grand Convention Center, NY",
    time: "09:00 AM - 05:00 PM",
    attendees: 12,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    status: "upcoming" as const,
    badge: "LIVE SOON",
  },
  {
    id: "2",
    title: "Midnight Sessions Vol. 4",
    date: { month: "JUL", day: "05", year: "2024" },
    location: "Electric Sky Arena",
    time: "10:00 PM - 03:00 AM",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    status: "upcoming" as const,
    badge: null,
  },
  {
    id: "3",
    title: "Islamic Finance Workshop",
    date: { month: "MAR", day: "15", year: "2024" },
    location: "London Islamic Center",
    time: "02:00 PM - 06:00 PM",
    attendees: 28,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    status: "past" as const,
    badge: null,
  },
];

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const filteredTickets = MOCK_TICKETS.filter((t) => t.status === activeTab);

  return (
    <div className="w-full py-8">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">My Tickets</h1>
          <p className="text-secondary text-sm mt-1">
            Manage your upcoming experiences and event history.
          </p>
        </div>
        <div className="flex items-center bg-[#1a1b20] rounded-lg p-1 border border-secondary/10">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "upcoming"
                ? "bg-red-600 text-white"
                : "text-secondary hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "past"
                ? "bg-red-600 text-white"
                : "text-secondary hover:text-white"
            }`}
          >
            Past Events
          </button>
        </div>
      </div>


      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden flex flex-col md:flex-row"
            >

              <div className="relative md:w-48 md:flex-shrink-0 h-40 md:h-auto">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
                {ticket.badge && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {ticket.badge}
                  </span>
                )}
              </div>


              <div className="flex-1 p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-white text-lg font-semibold leading-tight">
                    {ticket.title}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <p className="text-red-400 text-xs font-bold uppercase">{ticket.date.month}</p>
                    <p className="text-white text-lg font-bold leading-tight">{ticket.date.day}</p>
                    <p className="text-secondary/50 text-[10px]">{ticket.date.year}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <MapPin size={14} className="text-secondary/60 flex-shrink-0" />
                    <span>{ticket.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Clock size={14} className="text-secondary/60 flex-shrink-0" />
                    <span>{ticket.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary/10">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-secondary/20 border border-[#131418] flex items-center justify-center"
                        >
                          <span className="text-[8px] text-secondary">U</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-secondary text-xs">+{ticket.attendees}</span>
                  </div>
                  <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors">
                    View Ticket
                    <QrCode size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <QrCode size={40} className="text-secondary/30 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-1">
            No {activeTab === "upcoming" ? "upcoming" : "past"} tickets
          </h3>
          <p className="text-secondary text-sm">
            {activeTab === "upcoming"
              ? "You haven't booked any upcoming events yet."
              : "You haven't attended any past events yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
