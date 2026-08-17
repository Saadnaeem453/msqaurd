import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Shield,
  DollarSign,
  BarChart3,
  Megaphone,
  Building2,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Bell,
  HelpCircle,
  Clock,
  LogOut,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

// ─── Nav Sections ────────────────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    items: [
      { label: "Overview", path: "/admin/overview" },
      { label: "Live Activity", path: "/admin/dashboard/live" },
      { label: "Platform Metrics", path: "/admin/dashboard/metrics" },
    ],
  },
  {
    title: "Users",
    icon: <Users size={18} />,
    items: [
      { label: "All Users", path: "/admin/users" },
      { label: "Organizers", path: "/admin/users/organizers" },
      { label: "Attendees", path: "/admin/users/attendees" },
      { label: "Suspended", path: "/admin/users/suspended" },
      { label: "Roles", path: "/admin/users/roles" },
    ],
  },
  {
    title: "Events",
    icon: <Calendar size={18} />,
    items: [
      { label: "All Events", path: "/admin/events" },
      { label: "Pending Review", path: "/admin/events/pending" },
      { label: "Featured", path: "/admin/events/featured" },
      { label: "Flagged", path: "/admin/events/flagged" },
      { label: "Calendar View", path: "/admin/events/calendar" },
    ],
  },
  {
    title: "Moderation",
    icon: <Shield size={18} />,
    items: [
      { label: "Reports Queue", path: "/admin/moderation/reports" },
      { label: "Content Review", path: "/admin/moderation/content" },
      { label: "Disputes", path: "/admin/moderation/disputes" },
      { label: "Moderation Log", path: "/admin/moderation/log" },
    ],
  },
  {
    title: "Finance",
    icon: <DollarSign size={18} />,
    items: [
      { label: "Revenue Overview", path: "/admin/finance" },
      { label: "Payouts", path: "/admin/finance/payouts" },
      { label: "Refunds", path: "/admin/finance/refunds" },
      { label: "Tax Reports", path: "/admin/finance/tax" },
    ],
  },
  {
    title: "Analytics",
    icon: <BarChart3 size={18} />,
    items: [
      { label: "Platform Metrics", path: "/admin/analytics" },
      { label: "Growth", path: "/admin/analytics/growth" },
      { label: "Engagement", path: "/admin/analytics/engagement" },
      { label: "Demographics", path: "/admin/analytics/demographics" },
    ],
  },
  {
    title: "Communications",
    icon: <Megaphone size={18} />,
    items: [
      { label: "Broadcasts", path: "/admin/communications/broadcasts" },
      { label: "Templates", path: "/admin/communications/templates" },
      { label: "Push Notifications", path: "/admin/communications/push" },
      { label: "Email Campaigns", path: "/admin/communications/email" },
    ],
  },
  {
    title: "Organizations",
    icon: <Building2 size={18} />,
    items: [
      { label: "Directory", path: "/admin/organizations" },
      { label: "Verification Requests", path: "/admin/organizations/verification" },
      { label: "Partnerships", path: "/admin/organizations/partnerships" },
    ],
  },
  {
    title: "Platform Settings",
    icon: <Settings size={18} />,
    items: [
      { label: "General", path: "/admin/settings" },
      { label: "API Keys", path: "/admin/settings/api-keys" },
      { label: "Feature Flags", path: "/admin/settings/features" },
      { label: "Integrations", path: "/admin/settings/integrations" },
    ],
  },
  {
    title: "Security & Audit",
    icon: <ShieldCheck size={18} />,
    items: [
      { label: "Access Logs", path: "/admin/security" },
      { label: "Incident Reports", path: "/admin/security/incidents" },
      { label: "Compliance", path: "/admin/security/compliance" },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────────────

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Dashboard"])
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!showLogoutModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLogoutModal(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showLogoutModal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accountType");
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("mh_token");
    localStorage.removeItem("initialLoaderShown");
    setShowLogoutModal(false);
    navigate("/admin-login", { replace: true });
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isItemActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-[#192029] border-r border-secondary/10 h-screen flex flex-col flex-shrink-0">
      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Brand Header */}
        <div className="p-4 pb-3 border-b border-secondary/10">
          <div className="flex items-center gap-2.5">
            {/* Red square logo with 4-grid pattern */}
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white/60 rounded-[1px]" />
                <div className="bg-white/60 rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
              </div>
            </div>
            <div>
              <span className="text-secondary text-sm font-bold tracking-tight font-jakarta block leading-tight">
                MSQUARED
              </span>
              <span className="text-secondary/60 text-xs font-semibold block leading-tight">
                Admin
              </span>
              <p className="text-secondary/40 text-[9px] uppercase tracking-[0.1em] mt-0.5">
                System Command Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-2 px-2">
          {navSections.map((section) => {
            const isExpanded = expandedSections.has(section.title);
            const hasActiveItem = section.items.some((item) =>
              isItemActive(item.path)
            );

            return (
              <div key={section.title} className="mb-0.5">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    hasActiveItem
                      ? "bg-secondary/10 text-secondary"
                      : isExpanded
                        ? "text-white bg-white/5"
                        : "text-secondary/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={hasActiveItem ? "text-secondary" : ""}>
                    {section.icon}
                  </span>
                  <span className="font-medium flex-1 text-left text-[13px]">
                    {section.title}
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-secondary/40" />
                  ) : (
                    <ChevronRight size={14} className="text-secondary/40" />
                  )}
                </button>

                {/* Sub-items */}
                {isExpanded && (
                  <div className="mt-0.5 space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = isItemActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-3 py-1.5 pl-9 rounded-md text-xs transition-colors ${
                            isActive
                              ? "text-secondary font-bold"
                              : "text-white hover:text-secondary/80 hover:bg-white/3"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom section (sticky) */}
      <div className="p-3 border-t border-secondary/15 space-y-2 bg-[#151b22]">
        {/* New System Alert Button */}
        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
          <Bell size={14} />
          New System Alert
        </button>

        {/* Support & Logs */}
        <div className="flex items-center gap-4 px-1">
          <button className="flex items-center gap-1.5 text-secondary/50 hover:text-white text-xs transition-colors">
            <HelpCircle size={13} />
            Support
          </button>
          <button className="flex items-center gap-1.5 text-secondary/50 hover:text-white text-xs transition-colors">
            <Clock size={13} />
            Logs
          </button>
        </div>

        {/* Admin User */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-2.5 px-1 pt-1 rounded-lg hover:bg-white/5 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-[10px] font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[11px] font-medium truncate">
              Admin Root
            </p>
            <p className="text-secondary/30 text-[8px] uppercase tracking-wider">
              Master Access
            </p>
          </div>
        </button>
      </div>

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-[#131418] border border-secondary/15 rounded-xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-secondary/10 flex items-center justify-between">
              <h2 className="text-white font-semibold text-base">Admin Session</h2>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="text-secondary/40 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-secondary text-sm leading-relaxed">
                Are you sure you want to log out of the admin dashboard?
              </p>
            </div>
            <div className="px-6 py-4 border-t border-secondary/10 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
