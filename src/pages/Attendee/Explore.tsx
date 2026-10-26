import { useState, useEffect } from "react";
import { Search, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 6;

const categories = [
  {
    name: "Spiritual Growth",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
      </svg>
    ),
  },
  {
    name: "Professional Network",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "Eid Celebrations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M12 3L14 9L20 11L15 15L16 21L12 18L8 21L9 15L4 11L10 9L12 3Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
      </svg>
    ),
  },
  {
    name: "Student Events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const trendingEvents = [
  {
    id: 1,
    title: "Global Tech Ummah Summit 2024",
    date: "Oct 24, 6:00 PM",
    location: "Silicon Valley, CA",
    tags: ["PROFESSIONAL", "FEATURED"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    large: true,
  },
  {
    id: 2,
    title: "Spiritual Growth Retreat",
    date: "Saturday • 240 attending",
    location: "",
    tags: [],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    large: false,
  },
  {
    id: 3,
    title: "Nurturing the Soul in Modern Times",
    date: "Sat, Oct 12 • 9:00 PM",
    description: "Join a Jumu'ah reflection for an insightful session on...",
    price: "$15.00",
    location: "",
    tags: [],
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
    large: true,
  },
  {
    id: 4,
    title: "Campus Youth Festival",
    date: "Friday • LIVE NOW",
    location: "",
    tags: [],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    large: false,
  },
];

const suggestedEvents = [
  {
    id: 1,
    title: "Charity Gala Night 2024",
    location: "Community Center •Tonight, 7PM",
    price: "$15.00/100",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Career Mentorship Circle",
    location: "Tech Hub • Nov 5, 3:00PM",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
  },
];

const Explore = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);


  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;

    const updated = [
      query,
      ...recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    addToRecentSearches(search);
  };

  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  return (
    <div className="space-y-10">

      <section className="text-center space-y-6 pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Explore the Ummah
        </h1>
        <p className="text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Discover professional networking, spiritual circles, and community celebrations near you.
        </p>


        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-center bg-[#131418] border border-secondary/15 rounded-full overflow-hidden shadow-lg">
            <Search className="ml-5 text-secondary/60 flex-shrink-0" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search events by keyword, city, or interest..."
              className="flex-1 bg-transparent border-none outline-none text-white text-sm md:text-base px-4 py-4 placeholder:text-secondary/40"
            />
            <button
              onClick={handleSearch}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 md:px-8 py-3 m-1.5 rounded-full transition-colors flex-shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </section>


      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-red-500" size={20} />
            <h2 className="text-xl md:text-2xl font-bold text-white">Trending This Week</h2>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <button className="text-secondary hover:text-white text-sm flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="md:col-span-2 space-y-4">
            {trendingEvents.filter((e) => e.large).map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/home/events/${event.id}`)}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-[2.5/1] md:aspect-[3/1] bg-secondary/10">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>


                {event.tags.length > 0 && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-red-600/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}


                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-white font-semibold text-base md:text-lg mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 text-secondary/80 text-xs">
                    <span>{event.date}</span>
                    {event.location && (
                      <>
                        <span>•</span>
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-secondary/70 text-xs mt-1 line-clamp-1">
                      {event.description}
                    </p>
                  )}
                  {event.price && (
                    <span className="text-primary font-semibold text-sm mt-2 inline-block">
                      {event.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>


          <div className="space-y-4">
            {trendingEvents.filter((e) => !e.large).map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/home/events/${event.id}`)}
                className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3]"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-secondary/80 text-xs">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Explore by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate(`/home/category/${encodeURIComponent(category.name)}`)}
              className="bg-[#131418] border border-secondary/10 hover:border-secondary/20 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors group cursor-pointer"
            >
              <div className="text-red-500 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <span className="text-white text-xs md:text-sm font-medium text-center uppercase tracking-wide">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </section>


      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Suggested for You</h2>

          <div className="space-y-3">
            {suggestedEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/home/events/${event.id}`)}
                className="bg-[#131418] border border-secondary/10 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/5 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-secondary/10 flex-shrink-0 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-secondary text-xs mb-2 line-clamp-1">{event.location}</p>
                  {event.price && (
                    <button className="bg-red-600/20 text-red-400 text-[10px] font-semibold px-2 py-1 rounded">
                      {event.price}
                    </button>
                  )}
                </div>
                <ArrowRight className="text-secondary/40 flex-shrink-0" size={16} />
              </div>
            ))}
          </div>
        </div>


        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Recent Searches</h2>

          {recentSearches.length === 0 ? (
            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6 text-center">
              <p className="text-secondary text-sm">No recent searches yet.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="bg-[#131418] border border-secondary/10 hover:border-secondary/20 rounded-full px-4 py-2 text-sm text-secondary hover:text-white cursor-pointer flex items-center gap-2 transition-colors group"
                >
                  <span>{search}</span>
                  <button
                    onClick={(e) => removeRecentSearch(search, e)}
                    className="text-secondary/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${search}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      <section>
        <div className="bg-gradient-to-br from-red-900/20 via-[#131418] to-[#131418] border border-secondary/10 rounded-2xl p-8 md:p-12 text-center">
          <MapPin className="text-red-500 mx-auto mb-4" size={32} />
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Explore Your Local Area
          </h2>
          <p className="text-secondary text-sm mb-6 max-w-md mx-auto">
            See what's happening within 5 miles of your location.
          </p>
          <button
            onClick={() => navigate("/home/map")}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            Open Map View
          </button>
        </div>
      </section>
    </div>
  );
};

export default Explore;
