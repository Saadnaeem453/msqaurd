import {
  Globe,
  AtSign,
  Linkedin,
  MapPin,
  CalendarDays,
  Users,
  Trophy,
  TrendingUp,
  LayoutGrid,
  List,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";

// ── Mock Data ───────────────────────────────────────────────────────────────

const organizers = [
  {
    name: "Ahmed Suleiman",
    role: "Lead Coordinator",
    initials: "AS",
    color: "bg-red-500/20 text-red-400",
    online: true,
  },
  {
    name: "Sarah Khan",
    role: "Marketing Director",
    initials: "SK",
    color: "bg-blue-500/20 text-blue-400",
    online: false,
  },
  {
    name: "Omar Al-Fayed",
    role: "Logistics Manager",
    initials: "OF",
    color: "bg-green-500/20 text-green-400",
    online: false,
  },
];

const listings = [
  {
    title: "Future of Community Leadership",
    type: "LECTURE",
    typeColor: "bg-red-500",
    date: "Mon, Oct 17 • 6:00 PM",
    description:
      "Join us for an evening of deep insights into how community leaders shape the narrative for the next generation.",
    attendees: 124,
  },
  {
    title: "Autumn Community Bazaar",
    type: "UPCOMING",
    typeColor: "bg-green-500",
    date: "Sat, Nov 22 • 10:00 AM",
    description:
      "Celebrating local artisans and entrepreneurs in the heart of London. Food, crafts, and community spirit.",
    attendees: 89,
  },
];

// ── Component ───────────────────────────────────────────────────────────────

const OrganizationProfile = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* ── Profile Header ─────────────────────────────────── */}
      <div className="relative">
        {/* Banner gradient */}
        <div className="h-32 bg-gradient-to-r from-red-900/30 via-[#131418] to-[#131418] rounded-t-xl" />

        {/* Content row */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 px-6 -mt-10 relative z-10">
          {/* Logo */}
          <div className="w-20 h-20 rounded-xl bg-[#1a1c22] border border-secondary/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </div>

          {/* Name + meta */}
          <div className="flex-1">
            <h1 className="font-jakarta text-3xl font-bold text-white">
              Islamic Society of London
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-2.5 py-0.5 bg-secondary/10 border border-secondary/15 rounded text-[10px] text-secondary font-medium uppercase tracking-wider">
                Premium Community Organizer
              </span>
              <span className="flex items-center gap-1 text-secondary/60 text-xs">
                <MapPin size={12} /> London, United Kingdom
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="px-5 py-2 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm font-medium transition-colors">
              Follow
            </button>
            <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
              Contact Society
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h2 className="font-jakarta text-lg font-bold text-white">
                About the Organization
              </h2>
            </div>

            <p className="text-secondary/70 text-sm leading-relaxed mb-5">
              The Islamic Society of London is a premier community-driven organization dedicated to fostering cultural understanding, spiritual growth, and professional development. We pride ourselves on creating high-impact events that bridge the gap between traditional heritage and modern urban living. From large-scale community conferences to intimate lecture series, our mission is to empower the next generation of leaders.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoCard
                label="Focus Areas"
                value="Education, Community, Youth"
              />
              <InfoCard
                label="Established"
                value="September 2012"
              />
              <InfoCard
                label="Legal Status"
                value="Registered Charity"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={18} className="text-red-400" />
              </div>
              <p className="text-white text-4xl font-bold font-jakarta mb-1">52</p>
              <p className="text-secondary/50 text-xs uppercase tracking-wider mb-3">
                Events Hosted Successfully
              </p>
              <p className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <TrendingUp size={12} /> +12% since last quarter
              </p>
            </div>

            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} className="text-red-400" />
              </div>
              <p className="text-white text-4xl font-bold font-jakarta mb-1">
                12k
              </p>
              <p className="text-secondary/50 text-xs uppercase tracking-wider mb-3">
                Total Members Reached
              </p>
              <p className="flex items-center gap-1 text-secondary/60 text-xs">
                <Trophy size={12} /> Top 1% Organizer Tier
              </p>
            </div>
          </div>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-5">
          {/* Connect With Us */}
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
            <p className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-bold mb-4">
              Connect With Us
            </p>
            <div className="space-y-2.5">
              <ConnectLink icon={Globe} label="Official Website" />
              <ConnectLink icon={AtSign} label="@isl_london" />
              <ConnectLink icon={Linkedin} label="LinkedIn Profile" />
            </div>
          </div>

          {/* Active Organizers */}
          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-bold">
                Active Organizers
              </p>
              <button className="text-primary text-[10px] font-medium flex items-center gap-0.5 hover:text-primary/80 transition-colors">
                View All <ChevronRight size={10} />
              </button>
            </div>

            <div className="space-y-3">
              {organizers.map((org) => (
                <div key={org.name} className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold ${org.color}`}
                    >
                      {org.initials}
                    </div>
                    {org.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#131418]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{org.name}</p>
                    <p className="text-secondary/50 text-[10px] truncate">{org.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 border border-secondary/15 text-secondary/60 hover:text-white hover:border-secondary/30 rounded-lg text-xs transition-colors">
              Manage Team
            </button>
          </div>

          {/* Annual Conference Card */}
          <div className="bg-gradient-to-br from-red-900/30 to-[#1a1c22] border border-red-500/10 rounded-xl p-5">
            <p className="text-white text-sm font-bold mb-1">Annual Conference 2024</p>
            <p className="text-secondary/50 text-xs">Tickets launching soon</p>
          </div>
        </div>
      </div>

      {/* ── Active Public Listings ─────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-jakarta text-xl font-bold text-white">
            Active Public Listings
          </h2>
          <div className="flex items-center gap-1 bg-secondary/10 rounded-lg p-0.5">
            <button className="p-1.5 rounded bg-secondary/20 text-white">
              <LayoutGrid size={14} />
            </button>
            <button className="p-1.5 rounded text-secondary hover:text-white transition-colors">
              <List size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing, idx) => (
            <div
              key={idx}
              className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group"
            >
              {/* Hero area */}
              <div className="relative h-36 bg-gradient-to-br from-secondary/10 to-[#0d0e12]">
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white ${listing.typeColor}`}
                >
                  {listing.type}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-secondary/50 text-[10px] mb-2">
                  <Clock size={10} />
                  {listing.date}
                </div>
                <h3 className="text-white font-bold text-base mb-2 leading-tight">
                  {listing.title}
                </h3>
                <p className="text-secondary/50 text-xs leading-relaxed line-clamp-2 mb-4">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-secondary/40 text-[10px] flex items-center gap-1">
                    <Users size={10} /> +{listing.attendees}
                  </span>
                  <button className="flex items-center gap-1 text-primary text-xs font-medium hover:text-primary/80 transition-colors">
                    View Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Listing Card */}
          <div className="border-2 border-dashed border-secondary/15 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary/30 transition-colors cursor-pointer group min-h-[280px]">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Plus size={24} className="text-secondary group-hover:text-primary transition-colors" />
            </div>
            <p className="text-white font-bold text-base mb-1">Create New Listing</p>
            <p className="text-secondary/40 text-xs">
              Add a new event to your public profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Info Card ───────────────────────────────────────────────────────────────

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary/5 rounded-lg p-3.5 border border-secondary/5">
    <p className="text-secondary/40 text-[9px] uppercase tracking-wider font-semibold mb-1">
      {label}
    </p>
    <p className="text-white text-xs font-medium">{value}</p>
  </div>
);

// ── Connect Link ────────────────────────────────────────────────────────────

const ConnectLink = ({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}) => (
  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/5 transition-colors text-left">
    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-secondary" />
    </div>
    <span className="text-secondary text-sm">{label}</span>
  </button>
);

export default OrganizationProfile;
