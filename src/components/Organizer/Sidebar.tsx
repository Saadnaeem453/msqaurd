import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
    <>
      {!mobileOpen && <button
        type="button"
        aria-label={mobileOpen ? "Close organizer menu" : "Open organizer menu"}
        onClick={() => setMobileOpen((value) => !value)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-secondary/15 bg-[#131418] text-secondary shadow-lg hover:text-white md:hidden"
      >
        <Menu size={20} />
      </button>}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close organizer menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 overflow-y-auto border-r border-secondary/10 bg-[#131418] no-scrollbar transition-transform duration-200 md:sticky md:top-0 md:block md:h-screen md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>

      <div className="flex items-start justify-between border-b border-secondary/10 p-5 sm:p-6">
        <div>
          <Link to="/organizer" onClick={() => setMobileOpen(false)} className="text-primary text-2xl font-bold tracking-tight">
            MSQUARED
          </Link>
          <p className="mt-0.5 text-[10px] font-light uppercase tracking-[0.2em] text-secondary/50">Organizer</p>
        </div>
        <button type="button" aria-label="Close organizer menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-secondary hover:bg-white/5 hover:text-white md:hidden">
          <X size={20} />
        </button>
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
                      onClick={() => setMobileOpen(false)}
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
    </>
  );
};

export default Sidebar;
