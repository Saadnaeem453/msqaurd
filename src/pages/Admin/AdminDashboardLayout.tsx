import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0a0b0e] text-white overflow-hidden">
      {/* Sidebar – full height, hidden on mobile */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Right column: Navbar + content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
