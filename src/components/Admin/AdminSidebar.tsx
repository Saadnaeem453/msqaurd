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

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

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
      { label: "Attendees", path: "/admin/users/attendees" },
      { label: "Organizers", path: "/admin/users/organizers" },
      { label: "Verification Requests", path: "/admin/users/verification" },
      { label: "Suspended", path: "/admin/users/suspended" },
    ],
  },
  {
    title: "Events",
    icon: <Calendar size={18} />,
    items: [
      { label: "ALL Event", path: "/admin/events" },
      { label: "Pending Approval", path: "/admin/events/pending" },
      { label: "Published Events", path: "/admin/events/published" },
      { label: "Reported Events", path: "/admin/events/reported" },
      { label: "Rejected Events", path: "/admin/events/rejected" },
    ],
  },
  {
    title: "Moderation",
    icon: <Shield size={18} />,
    items: [
      { label: "Event Reports", path: "/admin/moderation/reports" },
      { label: "User Reports", path: "/admin/moderation/user-reports" },
      { label: "Content Review", path: "/admin/moderation/content" },
      { label: "Moderation Queue", path: "/admin/moderation/queue" },
    ],
  },
  {
    title: "Finance",
    icon: <DollarSign size={18} />,
    items: [
      { label: "Revenue Dashboard", path: "/admin/finance" },
      { label: "Transactions", path: "/admin/finance/transactions" },
      { label: "Payouts", path: "/admin/finance/payouts" },
      { label: "Refunds", path: "/admin/finance/refunds" },
    ],
  },
  {
    title: "Analytics",
    icon: <BarChart3 size={18} />,
    items: [
      { label: "User Analytics", path: "/admin/analytics/users" },
      { label: "Events Analytics", path: "/admin/analytics/events" },
      { label: "Revenue Analytics", path: "/admin/analytics/revenue" },
      { label: "Growth Trends", path: "/admin/analytics/growth" },
    ],
  },
  {
    title: "Communications",
    icon: <Megaphone size={18} />,
    items: [
      { label: "Push Notifications", path: "/admin/communications/push" },
      { label: "Email Campaigns", path: "/admin/communications/email" },
      { label: "System Announcements", path: "/admin/communications/broadcasts" },
    ],
  },
  {
    title: "Organizations",
    icon: <Building2 size={18} />,
    items: [
      { label: "All Organizations", path: "/admin/organizations" },
      { label: "Masjids", path: "/admin/organizations/masjids" },
      { label: "ISOCs", path: "/admin/organizations/isocs" },
      { label: "Event Organizers", path: "/admin/organizations/event-organizers" },
      { label: "Verification Requests", path: "/admin/organizations/verification" },
    ],
  },
  {
    title: "Platform Settings",
    icon: <Settings size={18} />,
    items: [
      { label: "Categories", path: "/admin/settings/plateform/categories" },
      { label: "Event types", path: "/admin/settings/plateform/event-types" },
      { label: "Ticket Settings", path: "/admin/settings/plateform/ticket-settings" },
      { label: "Payment Settings", path: "/admin/settings/plateform/payment-infrastructure" },
      { label: "Notification Settings", path: "/admin/settings/plateform/notification-engine" },
      { label: "AI Rules", path: "/admin/settings/plateform/ai-rules" },
    ],
  },
  {
    title: "Security & Audit",
    icon: <ShieldCheck size={18} />,
    items: [
      { label: "Admin Activity Log", path: "/admin/settings/security/activity" },
      { label: "Login History", path: "/admin/settings/security/login-history" },
      { label: "Access Roles", path: "/admin/settings/security/access-roles" },
      { label: "Permission", path: "/admin/settings/security/permissions" },
      { label: "Api keys", path: "/admin/settings/security/api-keys" },
    ],
  },
];

const AdminSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Dashboard"])
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const activeSection = navSections.find((section) =>
      section.items.some((item) => item.path === location.pathname)
    );
    if (activeSection) {
      setExpandedSections((previous) => new Set([...previous, activeSection.title]));
    }
  }, [location.pathname]);

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
    <aside className="flex h-full min-h-0 w-64 max-w-full shrink-0 flex-col border-r border-secondary/10 bg-lightgrayblue">

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain no-scrollbar">

        <div className="p-4 pb-3 border-b border-secondary/10">
          <div className="flex items-center gap-2.5">

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

        <nav className="py-2 px-2">
          {navSections.map((section) => {
            const isExpanded = expandedSections.has(section.title);
            const hasActiveItem = section.items.some((item) =>
              isItemActive(item.path)
            );

            return (
              <div key={section.title} className="mb-0.5">

                <button
                  type="button"
                  aria-expanded={isExpanded}
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

                {isExpanded && (
                  <div className="mt-0.5 space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = isItemActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={onNavigate}
                          aria-current={isActive ? "page" : undefined}
                          className={`block px-3 py-1.5 pl-9 rounded-md text-xs transition-colors ${
                            isActive
                              ? "text-secondary font-bold"
                              : "text-bgray/60 hover:text-secondary/80 hover:bg-bgray/[0.03]"
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

      <div className="p-3 border-t border-secondary/15 space-y-2 bg-[#151b22]">

        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
          <Bell size={14} />
          New System Alert
        </button>

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
