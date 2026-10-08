import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Search,
  Heart,
  Filter,
  Users,
  DollarSign,
  ChevronDown,
  Radio,
} from "lucide-react";
import { CATEGORIES, AttendeeEvent } from "../../services/attendee_events.service";
import { attendeeEventsApi } from "../../services/attendee_events.service";
import Pagination from "../../components/Pagination";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Islamic Talks":
    "Deepen your knowledge and connect with scholars. Discover lectures, seminars, and interactive discussions happening in your community.",
  "Sports & Fitness":
    "Stay active and build community. Find sports tournaments, fitness classes, and wellness events for all levels.",
  "Social Mixers":
    "Meet new people and build meaningful connections. Casual gatherings, dinners, and social events for the community.",
  "Professional Networking":
    "Grow your career and expand your network. Industry meetups, career fairs, and professional development events.",
  "Youth Programs":
    "Engaging activities designed for young Muslims. Workshops, camps, mentorship programs, and fun social events.",
  Charity:
    "Give back to the community. Fundraisers, volunteer opportunities, and charitable events making a real difference.",
  Lecture:
    "Learn from experts and scholars. Educational talks covering faith, science, history, and personal development.",
  Workshop:
    "Hands-on learning experiences. Skill-building sessions, creative workshops, and interactive training programs.",
  Networking:
    "Connect with like-minded individuals. Structured networking events designed to build lasting professional relationships.",
  Social:
    "Fun and relaxed community gatherings. Game nights, outings, and casual meetups to strengthen community bonds.",
  Competition:
    "Test your skills and compete. Sports tournaments, quiz competitions, and creative contests for all ages.",
};

const FILTER_OPTIONS = {
  date: ["Upcoming", "This Week", "This Month", "Past"],
  radius: ["Within 5 miles", "Within 25 miles", "Within 50 miles", "Any distance"],
  price: ["Any Price", "Free", "Paid", "$10-$25", "$25+"],
  audience: ["All Audiences", "Youth", "Families", "Brothers", "Sisters"],
};

const MOCK_EVENTS: AttendeeEvent[] = [
  {
    id: "1",
    title: "Nurturing the Soul in Modern Times",
    category: "Islamic Talks",
    description: "Join Ustadh Jamal Ibrahim for an insightful session on maintaining spiritual balance in today's fast-paced world.",
    event_date: "2025-10-12",
    start_time: "18:00",
    end_time: "20:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Central Mosque Hall",
    hero_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t1", name: "General", price: 15, is_primary: true }],
  },
  {
    id: "2",
    title: "Prophetic Parenting Workshop",
    category: "Islamic Talks",
    description: "A full-day intensive workshop for parents focusing on early childhood Islamic education and character building.",
    event_date: "2025-10-13",
    start_time: "10:00",
    end_time: "16:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Community Center",
    hero_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t2", name: "General", price: 0, is_primary: true }],
  },
  {
    id: "3",
    title: "The Science of Hadith Methodology",
    category: "Islamic Talks",
    description: "A foundational evening lecture exploring the methodology of hadith authentication and its relevance today.",
    event_date: "2025-10-16",
    start_time: "19:30",
    end_time: "21:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Islamic Institute",
    hero_image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t3", name: "General", price: 10, is_primary: true }],
  },
  {
    id: "4",
    title: "Understanding the Quran: Tafseer Series",
    category: "Islamic Talks",
    description: "Weekly Tafseer session covering Surah Al-Kahf with practical lessons for daily life.",
    event_date: "2025-10-18",
    start_time: "19:00",
    end_time: "20:30",
    timezone: "Europe/London",
    venue_type: "hybrid",
    venue_name: "East London Mosque",
    hero_image: "https://images.unsplash.com/photo-1585036156171-384164a8c542?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t4", name: "General", price: 0, is_primary: true }],
  },
  {
    id: "5",
    title: "Islamic Finance: Halal Investing",
    category: "Islamic Talks",
    description: "Learn about Sharia-compliant investment strategies and building wealth the Islamic way.",
    event_date: "2025-10-20",
    start_time: "18:00",
    end_time: "20:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Business Hub, Canary Wharf",
    hero_image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t5", name: "General", price: 20, is_primary: true }],
  },
  {
    id: "6",
    title: "Seerah of the Prophet ﷺ",
    category: "Islamic Talks",
    description: "An immersive journey through the life of Prophet Muhammad ﷺ and lessons for modern Muslims.",
    event_date: "2025-10-22",
    start_time: "14:00",
    end_time: "17:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Green Lane Masjid",
    hero_image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t6", name: "General", price: 5, is_primary: true }],
  },
  {
    id: "7",
    title: "Youth Leadership in Islam",
    category: "Islamic Talks",
    description: "Empowering young Muslims to take leadership roles in their communities with confidence and faith.",
    event_date: "2025-10-25",
    start_time: "11:00",
    end_time: "15:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Muslim Youth Centre",
    hero_image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t7", name: "General", price: 0, is_primary: true }],
  },
  {
    id: "8",
    title: "Women in Islamic History",
    category: "Islamic Talks",
    description: "Celebrating the contributions of remarkable women throughout Islamic history and their legacy today.",
    event_date: "2025-10-28",
    start_time: "18:30",
    end_time: "20:00",
    timezone: "Europe/London",
    venue_type: "hybrid",
    venue_name: "Sisters Resource Centre",
    hero_image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t8", name: "General", price: 8, is_primary: true }],
  },
  {
    id: "9",
    title: "Fiqh of Daily Life",
    category: "Islamic Talks",
    description: "Practical Islamic jurisprudence for everyday situations — work, family, finance, and worship.",
    event_date: "2025-11-01",
    start_time: "19:00",
    end_time: "21:00",
    timezone: "Europe/London",
    venue_type: "physical",
    venue_name: "Birmingham Central Mosque",
    hero_image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=500&fit=crop",
    status: "published",
    is_active: true,
    organizer_id: "1",
    tiers: [{ id: "t9", name: "General", price: 12, is_primary: true }],
  },
];

const formatDate = (dateStr: string, timeStr: string) => {
  const date = new Date(dateStr + "T" + timeStr);
  const day = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = date.getDate();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day}, ${month} ${dayNum} · ${time}`;
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<AttendeeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    date: "Upcoming",
    radius: "Within 25 miles",
    price: "Any Price",
    audience: "All Audiences",
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(MOCK_EVENTS.length / ITEMS_PER_PAGE);

  const categoryInfo = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return {
      label: cat?.label || category || "Category",
      description: CATEGORY_DESCRIPTIONS[category || ""] || "Discover events in this category.",
    };
  }, [category]);


  useEffect(() => {
    let cancelled = false;
    setLoading(true);


    attendeeEventsApi
      .getAll({ category, limit: 50 })
      .then((res) => {
        if (cancelled) return;
        const data = res.data as any;
        const list = Array.isArray(data) ? data : data?.events || [];
        setEvents(list.length > 0 ? list : MOCK_EVENTS.filter((e) => e.category === category));
      })
      .catch(() => {
        if (cancelled) return;
        setEvents(MOCK_EVENTS.filter((e) => e.category === category));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return MOCK_EVENTS.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setShowFilterDropdown(null);
    setCurrentPage(1);
  };

  const FilterButton = ({ label, icon: Icon, options, filterKey }: {
    label: string;
    icon: React.ElementType;
    options: string[];
    filterKey: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => setShowFilterDropdown(showFilterDropdown === filterKey ? null : filterKey)}
        className="flex items-center gap-2 bg-[#131418] border border-secondary/10 hover:border-secondary/20 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
      >
        <span className="flex flex-col items-start">
          <span className="text-[10px] text-secondary/50 uppercase tracking-wider">{label}</span>
          <span className="flex items-center gap-1.5">
            <Icon size={14} className="text-red-400" />
            {activeFilters[filterKey as keyof typeof activeFilters]}
          </span>
        </span>
        <ChevronDown size={14} className="text-secondary/40 ml-1" />
      </button>

      {showFilterDropdown === filterKey && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(null)} />
          <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1b1f] border border-secondary/15 rounded-lg shadow-xl z-50 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleFilterChange(filterKey, opt)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeFilters[filterKey as keyof typeof activeFilters] === opt
                    ? "bg-red-600/10 text-red-400"
                    : "text-secondary hover:text-white hover:bg-secondary/10"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">

      <div className="flex items-center gap-2 text-sm">
        <Link to="/home/explore" className="text-secondary hover:text-white transition-colors">
          Explore
        </Link>
        <span className="text-secondary/30">›</span>
        <span className="text-white font-medium">{categoryInfo.label}</span>
      </div>


      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {categoryInfo.label}
          </h1>
          <p className="text-secondary text-sm md:text-base max-w-2xl leading-relaxed">
            {categoryInfo.description}
          </p>
        </div>
        <span className="bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {MOCK_EVENTS.length} Live {categoryInfo.label.split(" ").pop()}
        </span>
      </div>


      <div className="flex items-center gap-3 flex-wrap">
        <FilterButton label="Date" icon={Calendar} options={FILTER_OPTIONS.date} filterKey="date" />
        <FilterButton label="Location Radius" icon={MapPin} options={FILTER_OPTIONS.radius} filterKey="radius" />
        <FilterButton label="Price" icon={DollarSign} options={FILTER_OPTIONS.price} filterKey="price" />
        <FilterButton label="Audience" icon={Users} options={FILTER_OPTIONS.audience} filterKey="audience" />

        <button className="flex items-center gap-2 bg-[#131418] border border-secondary/10 hover:border-secondary/20 rounded-lg px-4 py-2.5 text-sm text-secondary hover:text-white transition-colors">
          <Filter size={14} className="text-red-400" />
          More Filters
        </button>
      </div>


      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-secondary/10" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-secondary/10 rounded w-24" />
                <div className="h-5 bg-secondary/10 rounded w-3/4" />
                <div className="h-3 bg-secondary/10 rounded w-full" />
                <div className="h-3 bg-secondary/10 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedEvents.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="text-secondary/30 mx-auto mb-4" size={32} />
          <h3 className="text-white text-lg font-semibold mb-1">No events found</h3>
          <p className="text-secondary text-sm">Check back soon for upcoming events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedEvents.map((event) => {
            const price = event.tiers?.find((t) => t.is_primary)?.price;
            const priceLabel =
              price === undefined || price === null
                ? "TBD"
                : price === 0
                ? "FREE"
                : `$${Number(price).toFixed(2)}`;
            const isNew = false;
            const isLive = false;

            return (
              <div
                key={event.id}
                className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group cursor-pointer"
                onClick={() => navigate(`/home/events/${event.id}`)}
              >

                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.hero_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />


                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {isLive && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                        <Radio size={8} fill="white" /> Live
                      </span>
                    )}
                    {isNew && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        New
                      </span>
                    )}
                    <span className="bg-black/50 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      Youth
                    </span>
                  </div>


                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <Heart size={14} />
                  </button>
                </div>


                <div className="p-4">

                  <p className="text-red-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Calendar size={12} />
                    {formatDate(event.event_date, event.start_time)}
                  </p>


                  <h3 className="text-white font-semibold text-base mb-1.5 line-clamp-1">
                    {event.title}
                  </h3>


                  <p className="text-secondary/60 text-xs leading-relaxed line-clamp-2 mb-4">
                    {event.description}
                  </p>


                  <div className="flex items-center justify-between pt-3 border-t border-secondary/10">
                    <span className="text-secondary text-xs flex items-center gap-1">
                      <MapPin size={12} />
                      {event.venue_name || "TBD"}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        price === 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {priceLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryPage;
