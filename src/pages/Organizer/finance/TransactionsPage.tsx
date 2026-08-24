import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  CreditCard,
  BarChart3,
  CheckCircle2,
  Megaphone,
  Search,
  X,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  date: string;
  time: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeInitials: string;
  attendeeColor: string;
  event: string;
  eventBadge?: string;
  amount: number;
  method: string;
  status: "Completed" | "Pending" | "Refunded" | "Failed";
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const allTransactions: Transaction[] = [
  {
    id: "#UE-98231",
    date: "Oct 23, 2023",
    time: "14:22 PM",
    attendeeName: "Zaid Yousuf",
    attendeeEmail: "zaid@example.com",
    attendeeInitials: "ZY",
    attendeeColor: "bg-purple-500/20 text-purple-400",
    event: "Youth Gala '23",
    eventBadge: "red",
    amount: 125.0,
    method: "Stripe",
    status: "Completed",
  },
  {
    id: "#UE-98230",
    date: "Oct 24, 2023",
    time: "13:10 PM",
    attendeeName: "Mariam Ali",
    attendeeEmail: "m.ali@example.com",
    attendeeInitials: "MA",
    attendeeColor: "bg-blue-500/20 text-blue-400",
    event: "Lecture Series",
    eventBadge: "gray",
    amount: 45.0,
    method: "Apple Pay",
    status: "Pending",
  },
  {
    id: "#UE-98229",
    date: "Oct 23, 2023",
    time: "23:05 PM",
    attendeeName: "Sami Khan",
    attendeeEmail: "s.khan@email.com",
    attendeeInitials: "SK",
    attendeeColor: "bg-indigo-500/20 text-indigo-400",
    event: "Youth Gala '23",
    eventBadge: "red",
    amount: 250.0,
    method: "Stripe",
    status: "Refunded",
  },
  {
    id: "#UE-98228",
    date: "Oct 23, 2023",
    time: "16:44 PM",
    attendeeName: "Omar Farooq",
    attendeeEmail: "omar@domain.com",
    attendeeInitials: "OF",
    attendeeColor: "bg-emerald-500/20 text-emerald-400",
    event: "Youth Gala '23",
    eventBadge: "red",
    amount: 125.0,
    method: "Stripe",
    status: "Completed",
  },
  {
    id: "#UE-98227",
    date: "Oct 23, 2023",
    time: "16:15 PM",
    attendeeName: "Fatima Aziz",
    attendeeEmail: "f.aziz@email.org",
    attendeeInitials: "FA",
    attendeeColor: "bg-amber-500/20 text-amber-400",
    event: "Lecture Series",
    eventBadge: "gray",
    amount: 45.0,
    method: "Stripe",
    status: "Completed",
  },
  {
    id: "#UE-98226",
    date: "Oct 22, 2023",
    time: "11:30 AM",
    attendeeName: "Ahmed Raza",
    attendeeEmail: "a.raza@mail.com",
    attendeeInitials: "AR",
    attendeeColor: "bg-rose-500/20 text-rose-400",
    event: "Community Run",
    eventBadge: "gray",
    amount: 30.0,
    method: "Card",
    status: "Completed",
  },
  {
    id: "#UE-98225",
    date: "Oct 22, 2023",
    time: "09:15 AM",
    attendeeName: "Ayesha Noor",
    attendeeEmail: "a.noor@mail.com",
    attendeeInitials: "AN",
    attendeeColor: "bg-cyan-500/20 text-cyan-400",
    event: "Youth Gala '23",
    eventBadge: "red",
    amount: 125.0,
    method: "Stripe",
    status: "Completed",
  },
  {
    id: "#UE-98224",
    date: "Oct 21, 2023",
    time: "18:45 PM",
    attendeeName: "Bilal Hussain",
    attendeeEmail: "b.hussain@mail.com",
    attendeeInitials: "BH",
    attendeeColor: "bg-violet-500/20 text-violet-400",
    event: "Tech Workshop",
    eventBadge: "gray",
    amount: 75.0,
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "#UE-98223",
    date: "Oct 21, 2023",
    time: "15:20 PM",
    attendeeName: "Hina Malik",
    attendeeEmail: "h.malik@mail.com",
    attendeeInitials: "HM",
    attendeeColor: "bg-pink-500/20 text-pink-400",
    event: "Lecture Series",
    eventBadge: "gray",
    amount: 45.0,
    method: "Stripe",
    status: "Failed",
  },
  {
    id: "#UE-98222",
    date: "Oct 21, 2023",
    time: "10:00 AM",
    attendeeName: "Usman Tariq",
    attendeeEmail: "u.tariq@mail.com",
    attendeeInitials: "UT",
    attendeeColor: "bg-teal-500/20 text-teal-400",
    event: "Youth Gala '23",
    eventBadge: "red",
    amount: 250.0,
    method: "Stripe",
    status: "Completed",
  },
];

// Generate more mock transactions for pagination demo
const generateMockTransactions = (): Transaction[] => {
  const names = [
    { name: "Zaid Yousuf", email: "zaid@example.com", initials: "ZY", color: "bg-purple-500/20 text-purple-400" },
    { name: "Mariam Ali", email: "m.ali@example.com", initials: "MA", color: "bg-blue-500/20 text-blue-400" },
    { name: "Sami Khan", email: "s.khan@email.com", initials: "SK", color: "bg-indigo-500/20 text-indigo-400" },
    { name: "Omar Farooq", email: "omar@domain.com", initials: "OF", color: "bg-emerald-500/20 text-emerald-400" },
    { name: "Fatima Aziz", email: "f.aziz@email.org", initials: "FA", color: "bg-amber-500/20 text-amber-400" },
    { name: "Ahmed Raza", email: "a.raza@mail.com", initials: "AR", color: "bg-rose-500/20 text-rose-400" },
    { name: "Ayesha Noor", email: "a.noor@mail.com", initials: "AN", color: "bg-cyan-500/20 text-cyan-400" },
    { name: "Bilal Hussain", email: "b.hussain@mail.com", initials: "BH", color: "bg-violet-500/20 text-violet-400" },
    { name: "Hina Malik", email: "h.malik@mail.com", initials: "HM", color: "bg-pink-500/20 text-pink-400" },
    { name: "Usman Tariq", email: "u.tariq@mail.com", initials: "UT", color: "bg-teal-500/20 text-teal-400" },
  ];
  const events = ["Youth Gala '23", "Lecture Series", "Community Run", "Tech Workshop", "Spiritual Summit"];
  const methods = ["Stripe", "Apple Pay", "Card", "PayPal"];
  const statuses: Transaction["status"][] = ["Completed", "Completed", "Completed", "Pending", "Refunded", "Completed"];

  const transactions: Transaction[] = [...allTransactions];
  for (let i = 11; i <= 1284; i++) {
    const n = names[i % names.length];
    const day = 20 - Math.floor((i - 11) / 50);
    const month = day > 0 ? "Oct" : "Sep";
    const actualDay = day > 0 ? day : 30 + day;
    transactions.push({
      id: `#UE-${98231 - i + 1}`,
      date: `${month} ${actualDay}, 2023`,
      time: `${String(8 + (i % 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")} ${i % 2 === 0 ? "AM" : "PM"}`,
      attendeeName: n.name,
      attendeeEmail: n.email,
      attendeeInitials: n.initials,
      attendeeColor: n.color,
      event: events[i % events.length],
      eventBadge: events[i % events.length] === "Youth Gala '23" ? "red" : "gray",
      amount: [45, 75, 125, 250, 30][i % 5],
      method: methods[i % methods.length],
      status: statuses[i % statuses.length],
    });
  }
  return transactions;
};

const mockTransactions = generateMockTransactions();

// ─── Filter Options ──────────────────────────────────────────────────────────

const dateFilters = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Month", "Custom Range"];
const eventFilters = ["All Events", "Youth Gala '23", "Lecture Series", "Community Run", "Tech Workshop", "Spiritual Summit"];
const amountFilters = ["Any Amount", "Under $50", "$50 – $100", "$100 – $250", "$250+"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Custom Dropdown ─────────────────────────────────────────────────────────

const FilterDropdown = ({
  icon: Icon,
  label,
  options,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-colors ${
          open
            ? "border-primary/50 bg-primary/5 text-white"
            : "border-secondary/15 bg-[#131418] text-secondary hover:text-white hover:border-secondary/30"
        }`}
      >
        <Icon size={14} className="text-secondary" />
        <span className="text-secondary/60 text-xs mr-1">{label}</span>
        <span className="text-white text-sm">{value}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary/10 ${
                  opt === value ? "text-primary font-medium bg-primary/5" : "text-secondary hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const TransactionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [eventFilter, setEventFilter] = useState("All Events");
  const [amountFilter, setAmountFilter] = useState("Any Amount");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const perPage = 25;

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = mockTransactions;

    // Event filter
    if (eventFilter !== "All Events") {
      result = result.filter((t) => t.event === eventFilter);
    }

    // Amount filter
    if (amountFilter === "Under $50") {
      result = result.filter((t) => t.amount < 50);
    } else if (amountFilter === "$50 – $100") {
      result = result.filter((t) => t.amount >= 50 && t.amount < 100);
    } else if (amountFilter === "$100 – $250") {
      result = result.filter((t) => t.amount >= 100 && t.amount < 250);
    } else if (amountFilter === "$250+") {
      result = result.filter((t) => t.amount >= 250);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.attendeeName.toLowerCase().includes(q) ||
          t.attendeeEmail.toLowerCase().includes(q) ||
          t.event.toLowerCase().includes(q)
      );
    }

    return result;
  }, [dateFilter, eventFilter, amountFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / perPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const showingFrom = (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, filteredTransactions.length);

  // Stats
  const totalVolume = filteredTransactions.length;
  const completedCount = filteredTransactions.filter((t) => t.status === "Completed").length;
  const successfulRate = totalVolume > 0 ? ((completedCount / totalVolume) * 100).toFixed(1) : "0.0";
  const grossRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const headers = ["Order ID", "Date", "Time", "Attendee", "Email", "Event", "Amount", "Method", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.time,
      t.attendeeName,
      t.attendeeEmail,
      t.event,
      t.amount.toFixed(2),
      t.method,
      t.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${dateFilter.replace(/\s/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [filteredTransactions, dateFilter]);

  // Pagination range
  const getPaginationRange = (): (number | "...")[] => {
    const range: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 2) range.push("...");
      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/organizer/finance/revenue" className="text-secondary hover:text-white transition-colors">
          Finance
        </Link>
        <span className="text-secondary/40">›</span>
        <span className="text-primary font-medium">Transactions</span>
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-white">Transaction History</h1>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* ─ Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <BarChart3 size={48} className="text-white" />
          </div>
          <p className="text-secondary/60 text-xs font-medium mb-3">Total Volume</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{totalVolume.toLocaleString()}</span>
            <span className="flex items-center gap-0.5 text-green-400 text-sm font-medium mb-1">
              +12%
            </span>
          </div>
        </div>

        {/* Successful Rate */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <p className="text-secondary/60 text-xs font-medium mb-3">Successful Rate</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-white">{successfulRate}%</span>
            <div className="text-right mb-1">
              <p className="text-secondary/40 text-[10px]">Global Avg:</p>
              <p className="text-secondary/60 text-xs">95%</p>
            </div>
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <CreditCard size={48} className="text-white" />
          </div>
          <p className="text-secondary/60 text-xs font-medium mb-3">Gross Revenue</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-red-400">${grossRevenue.toLocaleString()}</span>
            <span className="text-secondary/40 text-sm mb-1">USD</span>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Megaphone size={48} className="text-white" />
          </div>
          <p className="text-secondary/60 text-xs font-medium mb-3">Active Events</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">08</span>
            <span className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">LIVE</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          icon={Calendar}
          label="calendar_month"
          options={dateFilters}
          value={dateFilter}
          onChange={setDateFilter}
        />
        <FilterDropdown
          icon={Filter}
          label="filter_list"
          options={eventFilters}
          value={eventFilter}
          onChange={setEventFilter}
        />
        <FilterDropdown
          icon={CreditCard}
          label="payments"
          options={amountFilters}
          value={amountFilter}
          onChange={setAmountFilter}
        />

        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-1 bg-[#131418] border border-secondary/15 rounded-lg px-3 py-2">
            <Search size={14} className="text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search transactions..."
              className="bg-transparent text-white text-sm outline-none w-48 placeholder:text-secondary/50"
              autoFocus
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="text-secondary hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2.5 border border-secondary/15 bg-[#131418] text-secondary hover:text-white hover:border-secondary/30 rounded-lg transition-colors"
          >
            <Search size={14} />
          </button>
        )}

        {/* Count */}
        <span className="text-secondary/40 text-xs ml-auto">
          Showing {showingFrom} of {filteredTransactions.length.toLocaleString()} Transactions
        </span>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary/10">
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-5">
                  Order ID
                </th>
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Date & Time
                </th>
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Attendee
                </th>
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Event
                </th>
                <th className="text-right text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Amount
                </th>
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Method
                </th>
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Status
                </th>
                <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold py-4 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx, idx) => (
                <tr
                  key={tx.id}
                  className={`border-b border-secondary/5 hover:bg-secondary/5 transition-colors ${
                    idx % 2 === 1 ? "bg-white/[0.01]" : ""
                  }`}
                >
                  {/* Order ID */}
                  <td className="py-4 px-5 text-white text-sm font-mono font-medium">
                    {tx.id}
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 text-secondary px-4">
                    <p className="text-white text-sm">{tx.date}</p>
                    <p className="text-xs">{tx.time}</p>
                  </td>

                  {/* Attendee */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${tx.attendeeColor}`}
                      >
                        {tx.attendeeInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{tx.attendeeName}</p>
                        <p className="text-secondary/40 text-xs truncate">{tx.attendeeEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* Event */}
                  <td className="py-4 px-4">
                    {tx.eventBadge === "red" ? (
                      <span className="inline-flex items-center px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase tracking-wider">
                        {tx.event}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 bg-secondary/5 border border-secondary/10 rounded text-[10px] font-medium text-secondary/60">
                        {tx.event}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right text-white text-sm font-bold">
                    {formatCurrency(tx.amount)}
                  </td>

                  {/* Method */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-secondary text-sm">
                      <CreditCard size={12} />
                      {tx.method}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === "Completed"
                            ? "bg-green-400"
                            : tx.status === "Pending"
                              ? "bg-yellow-400"
                              : tx.status === "Refunded"
                                ? "bg-red-400"
                                : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={
                          tx.status === "Completed"
                            ? "text-green-400"
                            : tx.status === "Pending"
                              ? "text-yellow-400"
                              : tx.status === "Refunded"
                                ? "text-red-400"
                                : "text-gray-400"
                        }
                      >
                        {tx.status}
                      </span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <button className="text-secondary/40 hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-secondary/10">
          <p className="text-secondary/50 text-sm">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/15 text-secondary hover:text-white hover:border-secondary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {getPaginationRange().map((page, idx) =>
              page === "..." ? (
                <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-secondary/40 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-red-600 text-white"
                      : "border border-secondary/15 text-secondary hover:text-white hover:border-secondary/30"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/15 text-secondary hover:text-white hover:border-secondary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
