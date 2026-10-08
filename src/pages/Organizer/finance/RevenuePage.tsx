import { useState, useMemo, useCallback } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  Flag,
  Target,
  Settings2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";


interface Transaction {
  id: string;
  participant: string;
  participantInitials: string;
  participantColor: string;
  event: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

interface CategoryRevenue {
  name: string;
  amount: number;
  color: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}


const monthlyRevenueData: MonthlyRevenue[] = [
  { month: "JAN", revenue: 8500 },
  { month: "FEB", revenue: 12000 },
  { month: "MAR", revenue: 10500 },
  { month: "APR", revenue: 18000 },
  { month: "MAY", revenue: 16000 },
  { month: "JUN", revenue: 22000 },
  { month: "JUL", revenue: 28000 },
  { month: "AUG", revenue: 14000 },
  { month: "SEP", revenue: 13000 },
];

const categoryRevenueData: CategoryRevenue[] = [
  { name: "Spiritual Lectures", amount: 84000, color: "#ef4444" },
  { name: "Youth Workshops", amount: 42300, color: "#ffffff" },
  { name: "Community Gala", amount: 28150, color: "#ef4444" },
  { name: "Charity Run", amount: 8130, color: "#ef4444" },
];

const transactions: Transaction[] = [
  {
    id: "#UE-062104",
    participant: "Zaid Siddiqui",
    participantInitials: "ZS",
    participantColor: "bg-blue-500/20 text-blue-400",
    event: "Amn al Spiritual Gala",
    amount: 1200,
    status: "SUCCESS",
  },
  {
    id: "#UE-962099",
    participant: "Mariam Ali",
    participantInitials: "MA",
    participantColor: "bg-purple-500/20 text-purple-400",
    event: "Executive Leadership",
    amount: 850,
    status: "SUCCESS",
  },
  {
    id: "#UE-962087",
    participant: "Fahad Khan",
    participantInitials: "FK",
    participantColor: "bg-orange-500/20 text-orange-400",
    event: "Ummah Tech Expo",
    amount: 450,
    status: "PENDING",
  },
];


const quarters = [
  { label: "Q1 2024", value: "Q1 2024", months: ["JAN", "FEB", "MAR"] },
  { label: "Q2 2024", value: "Q2 2024", months: ["APR", "MAY", "JUN"] },
  { label: "Q3 2024", value: "Q3 2024", months: ["JUL", "AUG", "SEP"] },
  { label: "Q4 2024", value: "Q4 2024", months: ["OCT", "NOV", "DEC"] },
  { label: "Full Year 2024", value: "Full Year 2024", months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatCompact(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}k`;
  }
  return `$${amount}`;
}

function formatCompactShort(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}


const RevenuePage = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("Q3 2024");
  const [showQuarterPicker, setShowQuarterPicker] = useState(false);
  const [chartFilter, setChartFilter] = useState<"revenue" | "profit">("revenue");


  const stats = useMemo(() => {
    const totalRevenue = 142580;
    const netProfit = 98420.5;
    const avgTicketPrice = 45;
    const bookingFees = 12410;

    return { totalRevenue, netProfit, avgTicketPrice, bookingFees };
  }, []);


  const filteredMonthlyData = useMemo(() => {
    const q = quarters.find((q) => q.value === selectedQuarter);
    if (!q || q.months.length === 12) return monthlyRevenueData;
    return monthlyRevenueData.filter((d) => q.months.includes(d.month));
  }, [selectedQuarter]);


  const handleExportCSV = useCallback(() => {
    const headers = ["Transaction ID", "Participant", "Event", "Amount", "Status", "Date"];
    const rows = transactions.map((t) => [
      t.id,
      t.participant,
      t.event,
      t.amount.toFixed(2),
      t.status,
      new Date().toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `financial_overview_${selectedQuarter.replace(/\s/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [selectedQuarter]);


  const currentQuarterIdx = quarters.findIndex((q) => q.value === selectedQuarter);

  const goToPrevQuarter = () => {
    if (currentQuarterIdx > 0) {
      setSelectedQuarter(quarters[currentQuarterIdx - 1].value);
    }
  };

  const goToNextQuarter = () => {
    if (currentQuarterIdx < quarters.length - 1) {
      setSelectedQuarter(quarters[currentQuarterIdx + 1].value);
    }
  };

  const maxCategoryAmount = Math.max(...categoryRevenueData.map((c) => c.amount));

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-6">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-white">
            Financial Overview
          </h1>
          <p className="text-secondary text-sm mt-1 max-w-xl">
            Tracking performance and growth metrics across all community initiatives.
          </p>
        </div>
        <div className="flex items-center gap-2">

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>


          <div className="relative">
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevQuarter}
                disabled={currentQuarterIdx <= 0}
                className="p-2 text-secondary hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setShowQuarterPicker(!showQuarterPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Calendar size={14} />
                {selectedQuarter}
              </button>
              <button
                onClick={goToNextQuarter}
                disabled={currentQuarterIdx >= quarters.length - 1}
                className="p-2 text-secondary hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {showQuarterPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowQuarterPicker(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
                  {quarters.map((q) => (
                    <button
                      key={q.value}
                      onClick={() => {
                        setSelectedQuarter(q.value);
                        setShowQuarterPicker(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary/10 ${
                        q.value === selectedQuarter
                          ? "text-primary font-medium"
                          : "text-secondary hover:text-white"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          label="TOTAL REVENUE"
          value={formatCurrency(stats.totalRevenue)}
          change="+12.4% vs last mo"
          changeType="up"
        />


        <StatCard
          label="NET PROFIT"
          value={formatCurrency(stats.netProfit)}
          change="+8.2% vs last mo"
          changeType="up"
        />


        <StatCard
          label="AVG. TICKET PRICE"
          value={formatCurrency(stats.avgTicketPrice)}
          change="Steady trend"
          changeType="neutral"
        />


        <StatCard
          label="BOOKING FEES"
          value={formatCurrency(stats.bookingFees)}
          change="-2.1% (Optimized)"
          changeType="down"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-jakarta text-lg font-bold text-white">
              Monthly Revenue Growth
            </h2>
            <button
              onClick={() => setChartFilter(chartFilter === "revenue" ? "profit" : "revenue")}
              className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full hover:bg-secondary/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {chartFilter === "revenue" ? "Revenue" : "Profit"}
            </button>
          </div>
          <p className="text-secondary/60 text-xs mb-6">
            Performance trajectory across the calendar year
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredMonthlyData}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={{ stroke: "#1f2937" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c22",
                    border: "1px solid #292a2b",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {filteredMonthlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.revenue ===
                        Math.max(...filteredMonthlyData.map((d) => d.revenue))
                          ? "#fca5a5"
                          : "#374151"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <h2 className="font-jakarta text-lg font-bold text-white mb-5">
            By Category
          </h2>

          <div className="space-y-4">
            {categoryRevenueData.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-medium">
                    {cat.name}
                  </span>
                  <span className="text-white text-sm font-bold">
                    {formatCompactShort(cat.amount)}
                  </span>
                </div>
                <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${(cat.amount / maxCategoryAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>


          <div className="mt-5 pt-4 border-t border-secondary/10">
            <div className="flex items-center gap-2 bg-secondary/5 rounded-lg p-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Flag size={14} className="text-red-400" />
              </div>
              <div>
                <p className="text-secondary text-[10px] uppercase tracking-wider">
                  Top Performer
                </p>
                <p className="text-white text-sm font-semibold">
                  Youth Summit '24
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-jakarta text-lg font-bold text-white">
              High-Value Transactions
            </h2>
            <button className="text-secondry text-sm font-medium hover:text-primary/80 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary/10">
                  <th className="text-left text-secondary text-[10px] uppercase tracking-wider font-semibold pb-3 pr-4">
                    Transaction ID
                  </th>
                  <th className="text-left text-secondary text-[10px] uppercase tracking-wider font-semibold pb-3 pr-4">
                    Participant
                  </th>
                  <th className="text-left text-secondary text-[10px] uppercase tracking-wider font-semibold pb-3 pr-4">
                    Event
                  </th>
                  <th className="text-right text-secondary text-[10px] uppercase tracking-wider font-semibold pb-3 pr-4">
                    Amount
                  </th>
                  <th className="text-center text-secondary text-[10px] uppercase tracking-wider font-semibold pb-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-secondary/5 hover:bg-secondary/5 transition-colors"
                  >
                    <td className="py-3.5 pr-4 text-secondary text-sm font-mono">
                      {tx.id}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${tx.participantColor}`}
                        >
                          {tx.participantInitials}
                        </div>
                        <span className="text-white text-sm">{tx.participant}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-secondary text-sm">
                      {tx.event}
                    </td>
                    <td className="py-3.5 pr-4 text-right text-white text-sm font-semibold">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === "SUCCESS"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : tx.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Target size={18} className="text-red-400" />
            <h2 className="font-jakarta text-lg font-bold text-white">
              Monthly Goals
            </h2>
          </div>

          <div className="space-y-5">

            <GoalItem
              label="Revenue Target"
              achieved="78% ACHIEVED"
              current="$1.56K"
              target="$200K"
              percent={78}
            />


            <GoalItem
              label="Early Bird Target"
              achieved="92% ACHIEVED"
              current="4.6K"
              target="5K"
              percent={92}
            />


            <GoalItem
              label="Booking Fee Margin"
              achieved="63% ACHIEVED"
              current="2.5%"
              target="4%"
              percent={63}
            />
          </div>


          <button className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors">
            <Settings2 size={14} /> Adjust Forecasts
          </button>
        </div>
      </div>
    </div>
  );
};



const StatCard = ({
  label,
  value,
  change,
  changeType,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
}) => {
  return (
    <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
      <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-2">
        {label}
      </p>
      <p className="text-white text-3xl font-bold font-jakarta mb-2">{value}</p>
      <div className="flex items-center gap-1">
        {changeType === "up" && (
          <TrendingUp size={14} className="text-green-400" />
        )}
        {changeType === "down" && (
          <TrendingDown size={14} className="text-red-400" />
        )}
        {changeType === "neutral" && (
          <Minus size={14} className="text-secondary" />
        )}
        <span
          className={`text-xs font-medium ${
            changeType === "up"
              ? "text-green-400"
              : changeType === "down"
                ? "text-red-400"
                : "text-secondary"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};



const GoalItem = ({
  label,
  achieved,
  current,
  target,
  percent,
}: {
  label: string;
  achieved: string;
  current: string;
  target: string;
  percent: number;
}) => {
  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider">
            {achieved}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-bold">
            {current} <span className="text-secondary/50 font-normal">/ {target}</span>
          </p>
        </div>
      </div>
      <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percent >= 80 ? "bg-red-500" : percent >= 60 ? "bg-primary" : "bg-yellow-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default RevenuePage;
