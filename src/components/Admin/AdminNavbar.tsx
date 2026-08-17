import { Bell, Search, Settings, LayoutGrid } from "lucide-react";

const AdminNavbar = () => {
  return (
    <header className="bg-[#0d0e12] border-b border-secondary/10 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
          <input
            type="text"
            placeholder="Search system entities, events, or users..."
            className="w-full bg-[#1a1b20] border border-secondary/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
      </div>

      {/* Right: Icons + System Live */}
      <div className="flex items-center gap-3 md:gap-4 ml-4">
        {/* Bell */}
        <button className="text-secondary/60 hover:text-white transition-colors p-1.5 relative">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="text-secondary/60 hover:text-white transition-colors p-1.5">
          <Settings size={20} />
        </button>

        {/* Layout Grid */}
        <button className="text-secondary/60 hover:text-white transition-colors p-1.5">
          <LayoutGrid size={20} />
        </button>

        {/* SYSTEM LIVE Badge */}
        <div className="flex items-center gap-2 bg-[#0f2a1a] border border-green-500/30 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-[10px] font-bold tracking-widest uppercase">
            System Live
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
