import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Organizer/Navbar";
import Sidebar from "../../../components/Organizer/Sidebar";

const OrganizerDashboardLayout = () => {
  const [timeframe, setTimeframe] = useState("Last month");

  return (
    <div className="flex h-screen bg-[#0a0b0e] text-white overflow-hidden">
      {/* Sidebar – full height */}
      <Sidebar />

      {/* Right column: Navbar + content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onTimeframeChange={(tf) => setTimeframe(tf)}
          currentTimeframe={timeframe}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
          <Outlet context={{ timeframe, setTimeframe }} />
        </main>
      </div>
    </div>
  );
};

export default OrganizerDashboardLayout;