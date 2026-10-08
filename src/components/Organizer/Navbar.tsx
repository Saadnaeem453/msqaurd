import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Calendar, Search, User, Settings, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accountType");
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("mh_token");
    localStorage.removeItem("initialLoaderShown");
    navigate("/login");
  };

  return (
    <header className="bg-[#111214] border-b border-secondary/10 px-6 py-5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-primary font-jakarta text-2xl font-semibold">Organizer Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60" size={18} />
          <input
            type="text"
            placeholder="Search metrics..."
            className="bg-secondary/5 border border-secondary/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary/50 transition-colors w-48 md:w-64"
          />
        </div>

        <button className="text-secondary hover:text-white transition-colors p-1 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <button className="text-secondary hover:text-white transition-colors p-1">
          <Calendar size={20} />
        </button>


        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 text-secondary hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold">
              <User size={18} />
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#1a1b1f] border border-secondary/15 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/organizer/settings");
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-secondary/10 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
