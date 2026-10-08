import { useState } from "react";
import { ChevronDown } from "lucide-react";


const DashboardOverview = () => {
  const [timeframe, setTimeframe] = useState("Last month");



  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-jakarta font-bold">Dashboard Overview</h1>
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => {
              // Handle dropdown toggle
            }}
          >
            {timeframe} <ChevronDown size={16} />
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
            {["Last week", "Last month", "Last year"].map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => setTimeframe(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-4">
        <div className="bg-gray-800 h-64 rounded">Chart 1 Placeholder</div>
        <div className="bg-gray-800 h-64 rounded">Chart 2 Placeholder</div>
        <div className="bg-gray-800 h-64 rounded">Chart 3 Placeholder</div>
      </div>
    </div>
  )
};

export default DashboardOverview;