import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import "../../components/Admin/admin-page.css";

const AdminDashboardLayout = () => {
  const { pathname } = useLocation();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (mobileOpen && !drawer.open) drawer.showModal();
    if (!mobileOpen && drawer.open) drawer.close();
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (media.matches) setMobileOpen(false); };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setDesktopCollapsed((value) => !value);
    else setMobileOpen((value) => !value);
  };
  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-grayblue text-bgray">

      <div id="admin-desktop-sidebar" className={desktopCollapsed ? "hidden" : "hidden shrink-0 lg:block"}>
        <AdminSidebar />
      </div>

      <dialog ref={drawerRef} aria-label="Admin navigation" onCancel={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setMobileOpen(false); }} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-bgray backdrop:bg-grayblue/70">
        <div className="relative h-full w-64 max-w-[calc(100vw-48px)] shadow-xl">
          <button autoFocus type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded bg-lightgrayblue text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><X size={20} /></button>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </div>
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminNavbar compact={pathname.replace(/\/$/, "") === "/admin/users/suspended"} onToggleSidebar={toggleSidebar} desktopCollapsed={desktopCollapsed} mobileOpen={mobileOpen} />
        <main className="admin-content min-h-0 min-w-0 flex-1 overflow-auto bg-grayblue no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
