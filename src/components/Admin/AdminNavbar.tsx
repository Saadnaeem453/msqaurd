import { Bell, Search, Settings, LayoutGrid, Menu, PanelLeftClose } from "lucide-react";

interface AdminNavbarProps {
  compact?: boolean;
  onToggleSidebar?: () => void;
  desktopCollapsed?: boolean;
  mobileOpen?: boolean;
}

const AdminNavbar = ({ compact = false, onToggleSidebar, desktopCollapsed = false, mobileOpen = false }: AdminNavbarProps) => (
  <header className={`sticky top-0 z-20 flex shrink-0 flex-wrap items-center gap-2 border-b border-secondary/10 bg-grayblue px-3 py-2 sm:flex-nowrap sm:gap-3 md:px-6 ${compact ? "lg:py-1" : "lg:py-3"}`}>
    <button type="button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={onToggleSidebar} className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-secondary hover:bg-bgray/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary lg:hidden"><Menu size={21} /></button>
    <button type="button" aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-controls="admin-desktop-sidebar" aria-expanded={!desktopCollapsed} onClick={onToggleSidebar} className="hidden h-11 w-11 shrink-0 items-center justify-center rounded text-secondary hover:bg-bgray/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary lg:flex">{desktopCollapsed ? <Menu size={21} /> : <PanelLeftClose size={21} />}</button>

    <div className="relative order-last w-full min-w-0 sm:order-none sm:w-auto sm:max-w-xl sm:flex-1">
      <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
      <input type="search" aria-label="Search system resources" placeholder={compact ? "Search system resources..." : "Search system entities, events, or users..."} className="h-10 w-full min-w-0 rounded border border-secondary/10 bg-lightgrayblue pl-9 pr-3 text-sm text-bgray placeholder:text-bgray/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary" />
    </div>

    <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
      <button type="button" aria-label="Notifications, 3 unread" className="relative flex h-11 w-11 items-center justify-center rounded text-secondary hover:bg-bgray/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><Bell size={19} /><span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-bgray">3</span></button>
      <button type="button" aria-label="Settings" className="flex h-11 w-11 items-center justify-center rounded text-secondary hover:bg-bgray/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><Settings size={19} /></button>
      <button type="button" aria-label="System layout" className="flex h-11 w-11 items-center justify-center rounded text-secondary hover:bg-bgray/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><LayoutGrid size={19} /></button>
      <div role="status" aria-label="System live" className="ml-1 flex h-8 items-center gap-2 rounded-full border border-green/20 bg-green/10 px-2 sm:px-3">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green" />
        <span className="hidden whitespace-nowrap text-[10px] uppercase tracking-wide text-green md:inline">System Live</span>
      </div>
    </div>
  </header>
);

export default AdminNavbar;
