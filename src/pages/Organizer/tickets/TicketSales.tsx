import { useEffect, useMemo, useState } from "react";
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
import { organizerTicketSalesApi, RevenueOverview, RevenueTransaction } from "../../../services/organizer_ticket_sales.service";


interface Transaction {
  id: string;
  customer: string;
  customerInitials: string;
  customerColor: string;
  email: string;
  eventName: string;
  tier: string;
  price: number;
  status: "pending" | "succeeded" | "failed" | "refunded";
}


const timeOptions = ["7D", "30D", "90D", "1Y"];



function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}


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
      <span className={`text-2xl md:text-3xl font-bold font-jakarta break-all ${label === "NET PROFIT" ? "text-primary" : "text-white"}`}>
        {value}
      </span>
      <span
        className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${
          changeType === "up"
            ? "text-green"
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
  label,
}: {
  variant: "vip" | "standard" | "premium" | "early";
  label: string;
}) => {
  const styles = {
    vip: "bg-primary/15 text-primary border border-primary/30",
    standard: "bg-secondary/10 text-secondary border border-secondary/20",
    premium: "bg-purple-500/15 text-purple-300 border border-purple-400/30",
    early: "bg-primary/10 text-primary border border-primary/20",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    succeeded: "text-green",
    refunded: "text-yellow-400",
    pending: "text-yellow-400",
    failed: "text-red-400",
  };
  const dots: Record<string, string> = {
    succeeded: "bg-green",
    refunded: "bg-yellow-400",
    pending: "bg-yellow-400",
    failed: "bg-red-400",
  };
  const label = status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : "Unknown";
  return (
    <span className={`flex items-center gap-1.5 text-sm font-medium ${styles[status] || "text-secondary"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || "bg-secondary"}`} />
      {label}
    </span>
  );
};

const getTierVariant = (tier: string): "vip" | "standard" | "premium" | "early" => {
  const value = tier.toLowerCase();
  if (value.includes("vip")) return "vip";
  if (value.includes("premium")) return "premium";
  if (value.includes("early")) return "early";
  return "standard";
};


const TicketSales = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30D");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [apiTransactions, setApiTransactions] = useState<RevenueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const period = ({ "7D": "7d", "30D": "30d", "90D": "90d", "1Y": "1y" } as const)[selectedPeriod as "7D" | "30D" | "90D" | "1Y"];

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      organizerTicketSalesApi.overview({ period }),
      organizerTicketSalesApi.transactions({ period, page: 1, limit: 10, sort: "newest" }),
    ]).then(([summary, rows]) => {
      if (!active) return;
      if (!summary.ok || !summary.data || !rows.ok || !rows.data) {
        setError(summary.detail || rows.detail || "Unable to load ticket sales.");
        return;
      }
      setOverview(summary.data);
      setApiTransactions(rows.data.transactions);
    }).catch(() => active && setError("Unable to load ticket sales.")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [period]);

  const totalRevenue = overview?.kpis.total_revenue || 0;
  const ticketsSold = overview?.kpis.tickets_sold || 0;
  const avgTicketPrice = overview?.kpis.average_ticket_price || 0;
  const netProfit = overview?.kpis.net_profit || 0;
  const salesVelocityData = useMemo(() => (overview?.sales_velocity || []).map((point) => ({ date: point.date, general: Object.values(point.tiers)[0] || 0, vip: Object.values(point.tiers)[1] || 0 })), [overview]);
  const velocityTierNames = useMemo(() => Array.from(new Set((overview?.sales_velocity || []).flatMap((point) => Object.keys(point.tiers || {})))), [overview]);
  const displayTransactions = useMemo(() => apiTransactions.map((tx) => ({ id: tx.order_id, customer: tx.purchaser?.full_name || "Attendee", customerInitials: (tx.purchaser?.full_name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2), customerColor: "bg-secondary/20 text-secondary", email: tx.purchaser?.email || "", eventName: tx.event || "—", tier: (tx.tier || "—").toUpperCase(), tierVariant: getTierVariant(tx.tier || ""), price: tx.transaction_total_minor / 100, status: tx.payment_status as "pending" | "succeeded" | "failed" | "refunded" })), [apiTransactions]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

      <div>
        <p className="text-secondary/60 text-sm mb-1">
          Tickets &rsaquo; <span className="text-secondary">Ticket Sales</span>
        </p>
        <h1 className="font-jakarta text-2xl md:text-3xl font-bold text-white">
          Ticket Sales
        </h1>
      </div>


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


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REVENUE"
          value={formatCurrency(totalRevenue)}
          change={`${overview?.kpis.percentage_changes.total_revenue ?? 0}% vs previous period`}
          changeType="up"
        />
        <StatCard
          label="TICKETS SOLD"
          value={ticketsSold.toLocaleString()}
          change={`${overview?.kpis.percentage_changes.tickets_sold ?? 0}% vs previous period`}
          changeType="up"
        />
        <StatCard
          label="AVG. TICKET PRICE"
          value={`$${avgTicketPrice.toFixed(2)}`}
          change="Current period average"
          changeType="neutral"
        />
        <StatCard
          label="NET PROFIT"
          value={formatCurrency(netProfit)}
          change={`${overview?.kpis.percentage_changes.net_profit ?? 0}% vs previous period`}
          changeType="up"
        />
      </div>


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
              <span className="text-secondary text-xs">{velocityTierNames[0] || "General Admission"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
              <span className="text-secondary text-xs">{velocityTierNames[1] || "VIP Access"}</span>
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
                    {["All Statuses", "succeeded", "Refunded", "Pending"].map(
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
              {displayTransactions.map((tx) => (
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
                    <TierBadge variant={tx.tierVariant} label={tx.tier} />
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


      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-4">
        <p className="text-secondary/30 text-[10px] uppercase tracking-wider">
          MSquared Operating System v2.4.0
        </p>
        <div className="flex items-center gap-3 text-secondary/30 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
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
