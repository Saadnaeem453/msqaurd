import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, QrCode, ChevronLeft, ChevronRight } from "lucide-react";
import { attendeeEventsApi, PurchasedEvent } from "../../services/attendee_events.service";

const PAGE_SIZE = 20;
const formatDate = (value: string) => new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const formatEventDate = (value: string) => { const date = new Date(`${value}T00:00:00`); return { month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(), day: date.toLocaleDateString("en-US", { day: "2-digit" }), year: date.toLocaleDateString("en-US", { year: "numeric" }) }; };
const formatTime = (value?: string) => value ? new Date(`1970-01-01T${value}`).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Time unavailable";

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<PurchasedEvent[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPurchasedEvents = useCallback(async () => {
    setLoading(true); setError("");
    const result = await attendeeEventsApi.getPurchased({ page, limit: PAGE_SIZE });
    if (result.ok && result.data) {
      const uniqueEvents = Array.from(
        new Map((result.data.events || []).map((item) => [item.event.id, item])).values(),
      );
      setEvents(uniqueEvents);
      setTotalPages(result.data.pagination?.total_pages || 1);
    } else setError(result.detail || "Unable to load your purchased events.");
    setLoading(false);
  }, [page]);

  useEffect(() => { void loadPurchasedEvents(); }, [loadPurchasedEvents]);

  const filteredEvents = useMemo(() => events.filter((item) => {
    const eventDate = new Date(`${item.event.event_date}T${item.event.start_time || "00:00:00"}`);
    return activeTab === "upcoming" ? eventDate >= new Date() : eventDate < new Date();
  }), [activeTab, events]);

  return <div className="w-full py-8"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h1 className="text-3xl font-bold text-white md:text-4xl">My Tickets</h1><p className="mt-1 text-sm text-secondary">Manage your upcoming experiences and event history.</p></div><div className="flex items-center rounded-lg border border-secondary/10 bg-[#1a1b20] p-1"><button type="button" onClick={() => setActiveTab("upcoming")} className={`rounded-md px-5 py-2 text-sm font-medium ${activeTab === "upcoming" ? "bg-red-600 text-white" : "text-secondary hover:text-white"}`}>Upcoming</button><button type="button" onClick={() => setActiveTab("past")} className={`rounded-md px-5 py-2 text-sm font-medium ${activeTab === "past" ? "bg-red-600 text-white" : "text-secondary hover:text-white"}`}>Past Events</button></div></div>
    {loading ? <div className="py-20 text-center text-sm text-secondary">Loading your purchased events...</div> : error ? <div className="py-20 text-center"><p className="text-sm text-red-300">{error}</p><button type="button" onClick={() => void loadPurchasedEvents()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Try again</button></div> : filteredEvents.length === 0 ? <div className="py-20 text-center"><QrCode size={40} className="mx-auto mb-4 text-secondary/30" /><h3 className="mb-1 text-lg font-semibold text-white">No {activeTab === "upcoming" ? "upcoming" : "past"} tickets</h3><p className="text-sm text-secondary">{activeTab === "upcoming" ? "You haven't booked any upcoming events yet." : "You haven't attended any past events yet."}</p></div> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{filteredEvents.map((ticket) => { const eventDate = formatEventDate(ticket.event.event_date); const tierText = ticket.purchased_tiers.map((tier) => `${tier.name || "Ticket"} (x${tier.quantity})`).join(", "); return <div key={ticket.event.id} className="flex flex-col overflow-hidden rounded-xl border border-secondary/10 bg-[#131418] md:flex-row"><div className="relative h-40 md:h-auto md:w-48 md:flex-shrink-0"><img src={ticket.event.hero_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"} alt={ticket.event.title} className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">{activeTab === "upcoming" ? "LIVE SOON" : "ATTENDED"}</span></div><div className="flex flex-1 flex-col p-5"><div className="mb-3 flex items-start justify-between gap-3"><h3 className="text-lg font-semibold leading-tight text-white">{ticket.event.title}</h3><div className="flex-shrink-0 text-right"><p className="text-xs font-bold uppercase text-red-400">{eventDate.month}</p><p className="text-lg font-bold leading-tight text-white">{eventDate.day}</p><p className="text-[10px] text-secondary/50">{eventDate.year}</p></div></div><div className="mb-3 space-y-2"><div className="flex items-center gap-2 text-sm text-secondary"><MapPin size={14} className="flex-shrink-0 text-secondary/60" /><span>{ticket.event.venue_name || ticket.event.venue_type}</span></div><div className="flex items-center gap-2 text-sm text-secondary"><Clock size={14} className="flex-shrink-0 text-secondary/60" /><span>{formatTime(ticket.event.start_time)} - {formatTime(ticket.event.end_time)}</span></div></div><div className="mb-4 space-y-1 border-t border-secondary/10 pt-3 text-xs text-secondary"><p><span className="text-secondary/60">Ticket:</span> {tierText || "Ticket details unavailable"}</p><p><span className="text-secondary/60">Booked:</span> {formatDate(ticket.booking_date)} · {ticket.ticket_count} ticket{ticket.ticket_count === 1 ? "" : "s"}</p><p><span className="text-secondary/60">Order:</span> {ticket.order_reference}</p></div><div className="mt-auto flex items-center justify-end border-t border-secondary/10 pt-3"><button type="button" onClick={() => navigate(`/home/events/${ticket.event.id}`)} className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-red-700">View Ticket <QrCode size={14} /></button></div></div></div>; })}</div>}
    {!loading && !error && totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-3"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded p-2 text-secondary hover:text-white disabled:opacity-30"><ChevronLeft size={18} /></button><span className="text-sm text-secondary">Page {page} of {totalPages}</span><button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded p-2 text-secondary hover:text-white disabled:opacity-30"><ChevronRight size={18} /></button></div>}
  </div>;
};

export default MyTicketsPage;
