import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  QrCode,
  BarChart,
  DollarSign,
  User,
  Users,
  Palette,
  Settings,
  Bell,
  Shield,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const Sidebar = () => {
  const location = useLocation();

  const navSections: NavSection[] = [
    {
      title: "Dashboard",
      items: [
        { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/organizer" },
        { label: "Insights", icon: <LayoutDashboard size={18} />, path: "/organizer/insights" },
      ],
    },
    {
      title: "Events",
      items: [
        { label: "All Events", icon: <Calendar size={18} />, path: "/organizer/events" },
        { label: "Create Event", icon: <Calendar size={18} />, path: "/organizer/events/create" },
        { label: "Drafts", icon: <Calendar size={18} />, path: "/organizer/events/drafts" },
        { label: "Published", icon: <Calendar size={18} />, path: "/organizer/events/published" },
        { label: "Past Events", icon: <Calendar size={18} />, path: "/organizer/events/past" },
      ],
    },
    {
      title: "Tickets",
      items: [
        { label: "Ticket Sales", icon: <Ticket size={18} />, path: "/organizer/tickets/sales" },
        { label: "Attendees", icon: <Ticket size={18} />, path: "/organizer/tickets/attendees" },
        { label: "Ticket Types", icon: <Ticket size={18} />, path: "/organizer/tickets/types" },
      ],
    },
    {
      title: "Check-in",
      items: [
        { label: "QR Scanner", icon: <QrCode size={18} />, path: "/organizer/checkin/scanner" },
        { label: "Live Check-ins", icon: <QrCode size={18} />, path: "/organizer/checkin/live" },
      ],
    },
    {
      title: "Analytics",
      items: [
        { label: "Audience Insights", icon: <BarChart size={18} />, path: "/organizer/analytics/audience" },
        { label: "Event Performance", icon: <BarChart size={18} />, path: "/organizer/analytics/performance" },
        { label: "Trends", icon: <BarChart size={18} />, path: "/organizer/analytics/trends" },
      ],
    },
    {
      title: "Finance",
      items: [
        { label: "Revenue", icon: <DollarSign size={18} />, path: "/organizer/finance/revenue" },
        { label: "Transactions", icon: <DollarSign size={18} />, path: "/organizer/finance/transactions" },
        { label: "Payouts", icon: <DollarSign size={18} />, path: "/organizer/finance/payouts" },
      ],
    },
    {
      title: "Organization",
      items: [
        { label: "Profile", icon: <User size={18} />, path: "/organizer/organization/profile" },
        { label: "Team", icon: <Users size={18} />, path: "/organizer/organization/team" },
        { label: "Branding", icon: <Palette size={18} />, path: "/organizer/organization/branding" },
        { label: "Account", icon: <Settings size={18} />, path: "/organizer/settings" },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Notifications", icon: <Bell size={18} />, path: "/organizer/settings/notifications" },
        { label: "Security", icon: <Shield size={18} />, path: "/organizer/settings/security" },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#131418] border-r border-secondary/10 h-screen sticky top-0 overflow-y-auto no-scrollbar flex-shrink-0">

      <div className="p-6 border-b border-secondary/10">
        <Link to="/organizer" className="text-primary text-2xl font-bold tracking-tight">
          MSQUARED
        </Link>
        <p className="text-secondary/50 text-[10px] uppercase tracking-[0.2em] font-light mt-0.5">
          Organizer
        </p>
      </div>


      <nav className="p-4 space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx}>

            <h3 className="text-secondary/40 text-[10px] uppercase tracking-[0.15em] font-light px-3 py-1">
              {section.title}
            </h3>

            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-secondary hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={active ? "text-whites" : "text-secondary/60"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;