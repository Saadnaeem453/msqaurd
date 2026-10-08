import { useState, useMemo } from "react";
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Download,
  UserPlus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Crown,
  Star,
} from "lucide-react";

type AttendeeStatus = "ACTIVE" | "VIP" | "INACTIVE";

interface Interest {
  name: string;
  color: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: AttendeeStatus;
  ticketCount: number;
  interests: Interest[];
  lifetimeSpend: number;
  joinedDate: string;
}

const generateAttendees = (): Attendee[] => {
  const firstNames = ["Elena", "Marcus", "Linda", "David", "Sarah", "Ahmed", "Fatima", "Omar", "Aisha", "Hassan", "Maryam", "Yusuf", "Zainab", "Ibrahim", "Khadija", "Ali"];
  const lastNames = ["Smith", "Johnson", "Yang", "Ahmed", "Connor", "Khan", "Al-Rashid", "Hassan", "Ibrahim", "Omar", "Siddiqui", "Farooq", "Nakamura", "Chen", "Patel", "Singh"];
  const domains = ["techlink.io", "gmail.com", "designlab.com", "outlook.com", "yahoo.com", "proton.me", "corporate.net"];
  const statuses: AttendeeStatus[] = ["ACTIVE", "VIP", "INACTIVE", "ACTIVE", "ACTIVE", "VIP", "ACTIVE", "ACTIVE"];
  const interestPool: Interest[] = [
    { name: "Tech", color: "bg-secondary/20 text-secondary" },
    { name: "SaaS", color: "bg-secondary/20 text-secondary" },
    { name: "Networking", color: "bg-secondary/20 text-secondary" },
    { name: "AI", color: "bg-secondary/20 text-secondary" },
    { name: "Machine Learning", color: "bg-secondary/20 text-secondary" },
    { name: "Python", color: "bg-secondary/20 text-secondary" },
    { name: "UX", color: "bg-secondary/20 text-secondary" },
    { name: "Figma", color: "bg-secondary/20 text-secondary" },
    { name: "DevOps", color: "bg-secondary/20 text-secondary" },
    { name: "Rust", color: "bg-secondary/20 text-secondary" },
    { name: "Cloud", color: "bg-secondary/20 text-secondary" },
    { name: "Design", color: "bg-secondary/20 text-secondary" },
  ];

  const attendees: Attendee[] = [];
  for (let i = 0; i < 142892; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const status = statuses[i % statuses.length];
    const domain = domains[i % domains.length];
    const ticketCount = (i % 20) + 1;
    const numInterests = (i % 3) + 1;
    const interests = interestPool.slice((i * 3) % interestPool.length, (i * 3) % interestPool.length + numInterests);
    const lifetimeSpend = Math.floor((i * 37.5) % 5000) + 100;
    const year = 2023 + (i % 2);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;

    attendees.push({
      id: `att-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      avatar: `${firstName[0]}${lastName[0]}`,
      status,
      ticketCount,
      interests,
      lifetimeSpend,
      joinedDate: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]} ${day}, ${year}`,
    });
  }
  return attendees;
};

const allAttendees = generateAttendees();

const statusBadge = (status: AttendeeStatus) => {
  if (status === "ACTIVE") return "bg-secondary/15 text-secondary border border-secondary/30";
  if (status === "VIP") return "bg-primary/15 text-primary border border-primary/30";
  return "bg-bgray/15 text-bgray border border-bgray/30";
};

const statusIcon = (status: AttendeeStatus) => {
  if (status === "VIP") return <Crown size={10} className="mr-1" />;
  return null;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
};

const StatCard = ({
  label,
  value,
  change,
  changeColor,
  sub,
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  changeColor?: string;
  sub?: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-[#151c25] rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-secondary/70 text-[11px] uppercase tracking-[0.15em] font-semibold">{label}</p>
      <span className="text-secondary/50">{icon}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-bgray font-jakarta">{value}</span>
      {change && <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>}
    </div>
    {sub && <p className="text-secondary/60 text-xs mt-1">{sub}</p>}
  </div>
);

const Attendees = () => {
  const [page, setPage] = useState(1);
  const perPage = 25;
  const [filter, setFilter] = useState<"ALL" | "VIP" | "NEW">("ALL");

  const filteredAttendees = useMemo(() => {
    if (filter === "ALL") return allAttendees;
    if (filter === "VIP") return allAttendees.filter((a) => a.status === "VIP");
    return allAttendees.slice(0, 24);
  }, [filter]);

  const totalPages = Math.ceil(filteredAttendees.length / perPage);
  const paginatedAttendees = filteredAttendees.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, filteredAttendees.length);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const interestDistribution = [
    { name: "Technology & Software", percent: 64, color: "bg-secondary" },
    { name: "Digital Design & Arts", percent: 22, color: "bg-secondary" },
    { name: "Business & Leadership", percent: 14, color: "bg-secondary" },
  ];

  const recentActivity = [
    { name: "Sarah Connor", action: "purchased Executive Pass for AI Future 2024", time: "3 minutes ago", icon: "green" },
    { name: "James Miller", action: "upgraded to VIP Gold", time: "16 minutes ago", icon: "green" },
    { name: "Review Pending", action: "for bulk purchase (15 tickets) — Corporate Account", time: "42 minutes ago", icon: "yellow" },
  ];

  return (
    <div className="admin-page space-y-6">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Attendee Management</h1>
          <p className="admin-page-description">Oversee platform participants, monitor engagement metrics and financial contributions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#151c25] border border-secondary/15 text-secondary hover:text-bgray rounded-lg text-sm font-medium transition-colors">
            <Download size={14} />
            Export List
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-bgray rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
            <UserPlus size={14} />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Attendees"
          value="142,892"
          change="+12.4%"
          changeColor="text-secondary"
          sub="vs last month"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Monthly Active Users"
          value="84,203"
          change="+4.1%"
          changeColor="text-secondary"
          sub="engagement rate up"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Avg. Events per User"
          value="3.8"
          change="-0.2%"
          changeColor="text-primary"
          sub="seasonal dip"
          icon={<Calendar size={16} />}
        />
        <StatCard
          label="Avg. Lifetime Value"
          value="$342.50"
          change="+18.2%"
          changeColor="text-secondary"
          sub="premium tiers active"
          icon={<DollarSign size={16} />}
        />
      </div>

      <div className="bg-[#151c25] rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#202630] border border-secondary/20 text-secondary rounded-lg text-sm font-medium transition-colors">
              <Filter size={12} />
              Filter
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "ALL" ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-transparent text-secondary/60 hover:text-secondary"}`}
            >
              All Attendees
            </button>
            <button
              onClick={() => setFilter("VIP")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "VIP" ? "bg-primary/20 text-primary border border-primary/30" : "bg-transparent text-secondary/60 hover:text-secondary"}`}
            >
              VIP
            </button>
            <button
              onClick={() => setFilter("NEW")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "NEW" ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-transparent text-secondary/60 hover:text-secondary"}`}
            >
              New (24)
            </button>
          </div>
          <span className="text-secondary text-xs">Showing {startIdx}-{endIdx} of {filteredAttendees.length.toLocaleString()} results</span>
        </div>
      </div>

      <div className="bg-[#151c25] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#202630]">
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">Attendee ↓</th>
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">Status</th>
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">Ticket History</th>
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">Interests</th>
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">Lifetime Spend</th>
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">Joined</th>
                <th className="text-secondary text-[11px] uppercase tracking-wider font-medium text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-bgray/5 hover:bg-bgray/[0.03] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-secondary text-xs font-bold">{attendee.avatar}</span>
                      </div>
                      <div>
                        <p className="text-bgray text-sm font-medium">{attendee.name}</p>
                        <p className="text-secondary text-sm">{attendee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusBadge(attendee.status)}`}>
                      {statusIcon(attendee.status)}
                      {attendee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/20 text-primary text-[10px] font-bold">
                        {attendee.ticketCount}
                      </span>
                      {attendee.ticketCount > 5 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-secondary/20 text-secondary text-[10px] font-bold">
                          +{Math.floor(attendee.ticketCount / 2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {attendee.interests.slice(0, 2).map((interest, idx) => (
                        <span key={idx} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${interest.color}`}>
                          {interest.name}
                        </span>
                      ))}
                      {attendee.interests.length > 2 && (
                        <span className="text-[10px] text-secondary px-1.5 py-0.5">+{attendee.interests.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-bgray text-sm font-medium">{formatCurrency(attendee.lifetimeSpend)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-secondary text-xs">{attendee.joinedDate}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-secondary hover:text-bgray transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-bgray/10 bg-[#15161a]">
          <div className="flex items-center gap-2">
            <span className="text-secondary text-xs">Rows per page:</span>
            <select className="bg-[#0f1014] border border-secondary/20 rounded px-2 py-1 text-xs text-secondary focus:outline-none cursor-pointer">
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary text-xs">{startIdx}-{endIdx} of {filteredAttendees.length.toLocaleString()}</span>
            <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="p-1.5 rounded text-secondary hover:text-bgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="p-1.5 rounded text-secondary hover:text-bgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-[#151c25] rounded-xl p-5">
          <h3 className="text-bgray text-sm font-bold font-jakarta mb-4">Interest Distribution</h3>
          <div className="space-y-4">
            {interestDistribution.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-secondary text-xs">{item.name}</span>
                  <span className="text-secondary text-sm font-medium">{item.percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border_color overflow-hidden">
                  <div className="h-full rounded-full bg-secondary" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#151c25] rounded-xl p-5">
          <h3 className="text-bgray text-sm font-bold font-jakarta mb-1">Recent Ticket Activity</h3>
          <p className="text-secondary text-xs mb-4">Live stream of purchase events across the global platform.</p>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.icon === "green" ? "bg-secondary" : "bg-primary"}`} />
                <div className="flex-1">
                  <p className="text-bgray text-xs">
                    <span className="font-medium">{item.name}</span> {item.action}
                  </p>
                  <p className="text-secondary text-xs mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendees;
