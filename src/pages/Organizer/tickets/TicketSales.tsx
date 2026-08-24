import { useState } from "react";
import {
  TrendingUp,
  Minus,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ── Types ───────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  customer: string;
  customerInitials: string;
  customerColor: string;
  email: string;
  eventName: string;
  tier: string;
  tierVariant: "vip" | "standard" | "early";
  price: number;
  status: "Completed" | "Refunded" | "Pending";
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const timeOptions = ["7D", "30D", "90D", "1Y"];

const salesVelocityData = [
  { date: "JUL 01", general: 120, vip: 40 },
  { date: "JUL 07", general: 250, vip: 65 },
  { date: "JUL 14", general: 380, vip: 90 },
  { date: "JUL 21", general: 620, vip: 130 },
  { date: "JUL 28", general: 890, vip: 175 },
  { date: "AUG 01", general: 1200, vip: 210 },
];

const transactions: Transaction[] = [
  {
    id: "#TXN-82910",
    customer: "Jordan Davies",
    customerInitials: "JD",
    customerColor: "bg-primary/20 text-primary",
    email: "jordan.d@gmail.com",
    eventName: "Midnight City Festival",
    tier: "VIP ACCESS",
    tierVariant: "vip",
    price: 149.0,
    status: "Completed",
  },
  {
    id: "#TXN-82908",
    customer: "Sarah Chen",
    customerInitials: "SC",
    customerColor: "bg-secondary/20 text-secondary",
    email: "s.chen@techvco",
    eventName: "Modern Leadership Summit",
    tier: "STANDARD",
    tierVariant: "standard",
    price: 45.0,
    status: "Completed",
  },
  {
    id: "#TXN-82905",
    customer: "Marcus Knight",
    customerInitials: "MK",
    customerColor: "bg-secondary/20 text-secondary",
    email: "markus@getmuse.com",
    eventName: "Midnight City Festival",
    tier: "STANDARD",
    tierVariant: "standard",
    price: 89.0,
    status: "Refunded",
  },
  {
    id: "#TXN-82899",
    customer: "Elena Lopez",
    customerInitials: "EL",
    customerColor: "bg-primary/20 text-primary",
    email: "elena.1@outlook.com",
    eventName: "AI Future Expo",
    tier: "EARLY BIRD",
    tierVariant: "early",
    price: 120.0,
    status: "Completed",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  change,
  changeType,
  sub,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  sub?: string;
  icon?: React.ReactNode;
}) => (
  <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
    <div className="flex items-center justify-between mb-2">
      <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </p>
      {icon}
    </div>
    <div className="flex items-end gap-2 mb-1">
      <span className="text-2xl md:text-3xl font-bold text-white font-jakarta break-all">
        {value}
      </span>
      <span
        className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${
          changeType === "up"
            ? "text-green-400"
            : changeType === "down"
              ? "text-red-400"
              : "text-secondary/60"
        }`}
      >
        {changeType === "up" && <TrendingUp size={12} />}
        {changeType === "neutral" && <Minus size={12} />}
        {change}
      </span>
    </div>
    {sub && <p className="text-secondary/40 text-[10px]">{sub}</p>}
  </div>
);

const TierBadge = ({
  variant,
}: {
  variant: "vip" | "standard" | "early";
}) => {
  const styles = {
    vip: "bg-primary/15 text-primary border border-primary/30",
    standard: "bg-secondary/10 text-secondary border border-secondary/20",
    early: "bg-primary/10 text-primary border border-primary/20",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {variant === "vip" ? "VIP ACCESS" : variant === "early" ? "EARLY BIRD" : "STANDARD"}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Completed: "text-green-400",
    Refunded: "text-yellow-400",
    Pending: "text-secondary/60",
  };
  const dots: Record<string, string> = {
    Completed: "bg-green-400",
    Refunded: "bg-yellow-400",
    Pending: "bg-secondary/40",
  };
  return (
    <span className={`flex items-center gap-1.5 text-sm font-medium ${styles[status] || "text-secondary"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || "bg-secondary"}`} />
      {status}
    </span>
  );
};

// ─ Page Component ──────────────────────────────────────────────────────────

const TicketSales = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30D");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const totalRevenue = 142850.0;
  const ticketsSold = 4285;
  const avgTicketPrice = 33.34;
  const netProfit = 128565.0;

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <p className="text-secondary/60 text-sm mb-1">
          Tickets &rsaquo; <span className="text-secondary">Ticket Sales</span>
        </p>
        <h1 className="font-jakarta text-2xl md:text-3xl font-bold text-white">
          Ticket Sales
        </h1>
      </div>

      {/* ── Period Selector ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#131418] border border-secondary/10 rounded-lg p-1">
          {timeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedPeriod(opt)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === opt
                  ? "bg-secondary/20 text-white"
                  : "text-secondary/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#131418] border border-secondary/10 rounded-lg text-sm text-secondary hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Last 30 Days
            <ChevronRight size={12} className="rotate-90" />
          </button>
          {showPeriodDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPeriodDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
                {["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year"].map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick={() => setShowPeriodDropdown(false)}
                      className="block w-full text-left px-4 py-2.5 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors"
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─ Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REVENUE"
          value={formatCurrency(totalRevenue)}
          change="+12.5% vs prev month"
          changeType="up"
        />
        <StatCard
          label="TICKETS SOLD"
          value={ticketsSold.toLocaleString()}
          change="+8.2% vs prev month"
          changeType="up"
        />
        <StatCard
          label="AVG. TICKET PRICE"
          value={`$${avgTicketPrice.toFixed(2)}`}
          change="Steady since June"
          changeType="neutral"
        />
        <StatCard
          label="NET PROFIT"
          value={formatCurrency(netProfit)}
          change="+14.1% vs prev month"
          changeType="up"
        />
      </div>

      {/* ── Sales Velocity Chart ─────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h2 className="font-jakarta text-lg font-bold text-white">
              Sales Velocity
            </h2>
            <p className="text-secondary/50 text-xs mt-0.5">
              Real-time tracking of ticket purchasing trends across all active events.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-secondary text-xs">General Admission</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
              <span className="text-secondary text-xs">VIP Access</span>
            </div>
            <button className="text-secondary/60 hover:text-white transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div className="h-56 md:h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesVelocityData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGeneral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e50a15" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e50a15" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e9bcb6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#e9bcb6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={{ stroke: "#1f2937" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1c22",
                  border: "1px solid #292a2b",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="general"
                stroke="#e50a15"
                strokeWidth={2.5}
                fill="url(#colorGeneral)"
                dot={{ r: 4, fill: "#e50a15", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#e50a15", stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="vip"
                stroke="#6b7280"
                strokeWidth={1.5}
                fill="url(#colorVip)"
                dot={{ r: 3, fill: "#6b7280", stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#6b7280", stroke: "#fff", strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent Transactions ──────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 md:p-6 pb-4">
          <h2 className="font-jakarta text-lg font-bold text-white">
            Recent Transactions
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 border border-secondary/20 rounded-lg text-sm text-secondary hover:text-white hover:border-secondary/40 transition-colors"
              >
                <Filter size={14} /> Filter
              </button>
              {showFilterDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
                    {["All Statuses", "Completed", "Refunded", "Pending"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => setShowFilterDropdown(false)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors"
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-secondary/20 rounded-lg text-sm text-secondary hover:text-white hover:border-secondary/40 transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-t border-b border-secondary/10">
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-5 md:px-6">
                  Order ID
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Customer
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Event Name
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Tier
                </th>
                <th className="text-right text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Price
                </th>
                <th className="text-center text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4 md:px-6">
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
                  <td className="py-3.5 px-5 md:px-6 text-secondary text-sm font-mono font-medium">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${tx.customerColor}`}
                      >
                        {tx.customerInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {tx.customer}
                        </p>
                        <p className="text-secondary/40 text-[10px] truncate">
                          {tx.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-white text-sm">
                    {tx.eventName}
                  </td>
                  <td className="py-3.5 px-4">
                    <TierBadge variant={tx.tierVariant} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-white text-sm font-semibold">
                    ${tx.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-center">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-secondary/10">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold">
            Showing 1–10 of 4,285 transactions
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/10 text-secondary/60 hover:text-white hover:border-secondary/30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/10 text-secondary/60 hover:text-white hover:border-secondary/30 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-4">
        <p className="text-secondary/30 text-[10px] uppercase tracking-wider">
          MSquared Operating System v2.4.0
        </p>
        <div className="flex items-center gap-3 text-secondary/30 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Sales Feed
          </span>
          <span className="text-secondary/20">|</span>
          <span>Last sync 12 seconds ago</span>
        </div>
      </div>
    </div>
  );
};

export default TicketSales;
