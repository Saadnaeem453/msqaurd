import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Organizer/Navbar";
import Sidebar from "../../../components/Organizer/Sidebar";
import { OrganizationMemberBoundary, OrganizationProvider } from "../../../contexts/OrganizationContext";

const OrganizerDashboardLayout = () => {
  const [timeframe, setTimeframe] = useState("Last month");

  return (
    <OrganizationProvider>
    <div className="flex h-screen min-w-0 overflow-hidden bg-[#0a0b0e] text-white">

      <Sidebar />


      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          onTimeframeChange={(tf) => setTimeframe(tf)}
          currentTimeframe={timeframe}
        />
        <main className="flex-1 overflow-y-auto p-2 text-[13px] sm:p-4 lg:p-6 lg:text-base no-scrollbar">
          <OrganizationMemberBoundary><Outlet context={{ timeframe, setTimeframe }} /></OrganizationMemberBoundary>
        </main>
      </div>
    </div>
    </OrganizationProvider>
  );
};

export default OrganizerDashboardLayout;
