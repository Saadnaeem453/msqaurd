import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Heart, Edit3, Ticket, LogOut } from "lucide-react";

interface UserProfile {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
}

const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const profile = getUserProfile();

  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || "U";


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);


  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowProfileMenu(false);
    };
    if (showProfileMenu) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accountType");
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("mh_token");
    localStorage.removeItem("initialLoaderShown");
    navigate("/login");
  };

  const handleMenuItem = (item: string) => {
    setSelectedItem(item);
    setShowProfileMenu(false);

    setTimeout(() => {
      switch (item) {
        case "Edit Profile":
          navigate("/home/profile");
          break;
        case "My Tickets":
          navigate("/home/tickets");
          break;
        case "Logout":
          handleLogout();
          break;
      }
      setSelectedItem(null);
    }, 200);
  };

  const menuItems = [
    { label: "Edit Profile", icon: Edit3 },
    { label: "My Tickets", icon: Ticket },
    { label: "Logout", icon: LogOut },
  ];

  return (
    <header className="w-full bg-[#0a0b0e] border-b-[0.5px] border-secondary/10 py-4 sticky top-0 z-30">
      <div className="app-container mx-auto max-w-384 flex items-center justify-between">

        <Link to="/" className="text-primary text-2xl font-bold tracking-tight">
          MSQUARED
        </Link>


        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-jakarta transition-colors ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-secondary hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>


        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60" size={16} />
            <input
              type="text"
              placeholder="Search events..."
              className="bg-secondary/5 border border-secondary/10 rounded-full py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary/50 transition-colors w-40 lg:w-56"
            />
          </div>


          <button
            onClick={() => navigate("/home/notifications")}
            className="text-secondary hover:text-white transition-colors p-1.5 relative"
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full text-[8px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>


          <button
            onClick={() => navigate("/home/wishlist")}
            className="text-secondary hover:text-white transition-colors p-1.5"
          >
            <Heart size={18} />
          </button>


          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
              style={
                profile?.avatar_url
                  ? {}
                  : {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    }
              }
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary text-sm font-semibold">{userInitial}</span>
              )}
            </button>


            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-[#0a0b0e] border border-secondary/10 rounded-xl shadow-2xl w-56 py-3 z-50">
                {menuItems.map((item) => {
                  const isSelected = selectedItem === item.label;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleMenuItem(item.label)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-primary text-white"
                          : "text-secondary hover:text-white hover:bg-secondary/5"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={isSelected ? "text-white" : "text-secondary"}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>


          <button className="md:hidden text-secondary hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

const navItems = [
  { label: "Home", path: "/home" },
  { label: "Explore", path: "/home/explore" },
  { label: "Communities", path: "/communities" },
  { label: "Map View", path: "/home/map" },
];

export default Navbar;
