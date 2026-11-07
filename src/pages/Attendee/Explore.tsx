import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Search, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { attendeeEventsApi, AttendeeEvent, CATEGORIES } from "../../services/attendee_events.service";

const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 6;
const imageFor = (event: AttendeeEvent) => event.hero_image || event.gallery?.find((item) => item.is_hero)?.image_url || event.gallery?.[0]?.image_url || "/events.svg";
const dateFor = (event: AttendeeEvent) => `${new Date(event.event_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${event.start_time} (${event.timezone})`;
const locationFor = (event: AttendeeEvent) => event.venue_name || event.street_address || (event.venue_type === "online" ? "Online event" : "Venue details unavailable");

const Explore = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
  const [events, setEvents] = useState<AttendeeEvent[]>([]);
  const [recommended, setRecommended] = useState<AttendeeEvent[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  const search = params.get("search") || "";
  useEffect(() => { setSearchQuery(search); }, [search]);
  useEffect(() => { try { setRecentSearches(JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]")); } catch { setRecentSearches([]); } }, []);
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    attendeeEventsApi.getAll({ search: search || undefined, page: 1, limit: 24 }).then((result) => {
      if (!active) return;
      if (!result.ok) { setError(result.detail || "Unable to load events."); setEvents([]); return; }
      const payload = result.data; setEvents(Array.isArray(payload) ? payload : payload?.events || []);
    }).catch(() => active && setError("Unable to load events.")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [search]);
  useEffect(() => { let active = true; attendeeEventsApi.getRecommended().then((result) => { if (active && result.ok) setRecommended(result.data || []); }).finally(() => active && setRecommendedLoading(false)); return () => { active = false; }; }, []);

  const addRecent = (value: string) => { const next = [value, ...recentSearches.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, MAX_RECENT_SEARCHES); setRecentSearches(next); localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)); };
  const runSearch = () => { const value = searchQuery.trim(); if (value) addRecent(value); setParams(value ? { search: value } : {}); };
  const visibleEvents = useMemo(() => events.slice(0, 6), [events]);
  const featured = visibleEvents.slice(0, 2); const secondary = visibleEvents.slice(2, 4);

  return <div className="space-y-10">
    <section className="space-y-6 pb-4 pt-8 text-center"><h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Explore the Ummah</h1><p className="mx-auto max-w-2xl text-sm leading-relaxed text-secondary md:text-base">Discover professional networking, spiritual circles, and community celebrations near you.</p><div className="relative mx-auto max-w-3xl"><div className="flex items-center overflow-hidden rounded-full border border-secondary/15 bg-[#131418] shadow-lg"><Search className="ml-5 shrink-0 text-secondary/60" size={20} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} placeholder="Search events by keyword, city, or interest..." className="flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-secondary/40 md:text-base" /><button onClick={runSearch} className="m-1.5 shrink-0 rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 md:px-8">Search</button></div></div></section>

    <section><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><TrendingUp className="text-red-500" size={20} /><h2 className="text-xl font-bold text-white md:text-2xl">Trending This Week</h2><span className="h-2 w-2 rounded-full bg-red-500" /></div><button onClick={() => navigate(search ? `/home/explore?search=${encodeURIComponent(search)}` : "/home/explore")} className="flex items-center gap-1 text-sm text-secondary hover:text-white">View All <ArrowRight size={14} /></button></div>{loading ? <div className="rounded-xl border border-secondary/10 bg-[#131418] p-12 text-center text-sm text-secondary">Loading events...</div> : error ? <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-12 text-center text-sm text-red-300">{error}</div> : !visibleEvents.length ? <div className="rounded-xl border border-secondary/10 bg-[#131418] p-12 text-center text-sm text-secondary">No events match your search.</div> : <div className="grid grid-cols-1 gap-4 md:grid-cols-3"><div className="space-y-4 md:col-span-2">{featured.map((event) => <EventFeature key={event.id} event={event} onOpen={() => navigate(`/home/events/${event.id}`)} />)}</div><div className="space-y-4">{secondary.map((event) => <EventTile key={event.id} event={event} onOpen={() => navigate(`/home/events/${event.id}`)} />)}</div></div>}</section>

    <section><h2 className="mb-5 text-xl font-bold text-white md:text-2xl">Explore by Category</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{CATEGORIES.filter((category) => category.value !== "all").slice(0, 8).map((category) => <button key={category.value} onClick={() => navigate(`/home/category/${encodeURIComponent(category.value)}`)} className="group flex flex-col items-center gap-3 rounded-xl border border-secondary/10 bg-[#131418] p-6 transition-colors hover:border-secondary/20"><Sparkles className="text-red-500 transition-transform group-hover:scale-110" size={30} /><span className="text-center text-xs font-medium uppercase tracking-wide text-white md:text-sm">{category.label}</span></button>)}</div></section>

    <section className="grid grid-cols-1 gap-8 md:grid-cols-2"><div><h2 className="mb-5 text-xl font-bold text-white md:text-2xl">Suggested for You</h2>{recommendedLoading ? <p className="text-sm text-secondary">Loading recommendations...</p> : !recommended.length ? <div className="rounded-xl border border-secondary/10 bg-[#131418] p-6 text-center text-sm text-secondary">No recommendations available yet.</div> : <div className="space-y-3">{recommended.slice(0, 4).map((event) => <EventRow key={event.id} event={event} onOpen={() => navigate(`/home/events/${event.id}`)} />)}</div>}</div><div><h2 className="mb-5 text-xl font-bold text-white md:text-2xl">Recent Searches</h2>{!recentSearches.length ? <div className="rounded-xl border border-secondary/10 bg-[#131418] p-6 text-center text-sm text-secondary">No recent searches yet.</div> : <div className="flex flex-wrap gap-2">{recentSearches.map((item) => <div key={item} className="flex items-center gap-2 rounded-full border border-secondary/10 bg-[#131418] px-4 py-2 text-sm text-secondary hover:text-white"><button onClick={() => { setSearchQuery(item); setParams({ search: item }); }}>{item}</button><button aria-label={`Remove ${item}`} onClick={() => { const next = recentSearches.filter((value) => value !== item); setRecentSearches(next); localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)); }} className="text-secondary/40 hover:text-red-400">×</button></div>)}</div>}</div></section>

    <section><div className="rounded-2xl border border-secondary/10 bg-gradient-to-br from-red-900/20 via-[#131418] to-[#131418] p-8 text-center md:p-12"><MapPin className="mx-auto mb-4 text-red-500" size={32} /><h2 className="mb-2 text-xl font-bold text-white md:text-2xl">Explore Your Local Area</h2><p className="mx-auto mb-6 max-w-md text-sm text-secondary">See what's happening within 25 km of your chosen location.</p><button onClick={() => navigate("/home/map")} className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700">Open Map View</button></div></section>
  </div>;
};

const EventFeature = ({ event, onOpen }: { event: AttendeeEvent; onOpen: () => void }) => <button type="button" onClick={onOpen} className="group relative block aspect-[2.5/1] w-full overflow-hidden rounded-xl text-left"><img src={imageFor(event)} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-4 md:p-5"><h3 className="mb-1 line-clamp-1 text-base font-semibold text-white md:text-lg">{event.title}</h3><p className="text-xs text-secondary/80">{dateFor(event)} · {locationFor(event)}</p></div></button>;
const EventTile = ({ event, onOpen }: { event: AttendeeEvent; onOpen: () => void }) => <button type="button" onClick={onOpen} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl text-left"><img src={imageFor(event)} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-3 md:p-4"><h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white md:text-base">{event.title}</h3><p className="text-xs text-secondary/80">{dateFor(event)}</p></div></button>;
const EventRow = ({ event, onOpen }: { event: AttendeeEvent; onOpen: () => void }) => <button type="button" onClick={onOpen} className="flex w-full items-center gap-4 rounded-xl border border-secondary/10 bg-[#131418] p-4 text-left transition-colors hover:bg-secondary/5"><img src={imageFor(event)} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" /><span className="min-w-0 flex-1"><strong className="block truncate text-sm font-semibold text-white">{event.title}</strong><span className="mt-1 block truncate text-xs text-secondary">{locationFor(event)} · {dateFor(event)}</span><span className="mt-1 block text-[10px] uppercase tracking-wide text-primary">{event.category}</span></span><ArrowRight className="shrink-0 text-secondary/40" size={16} /></button>;

export default Explore;
