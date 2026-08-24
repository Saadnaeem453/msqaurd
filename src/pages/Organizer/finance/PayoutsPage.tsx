import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  Repeat,
  Banknote,
  Building2,
  ExternalLink,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface Payout {
  id: string;
  date: string;
  amount: number;
  destination: string;
  accountLast4: string;
  status: "COMPLETED" | "IN PROGRESS" | "PENDING" | "FAILED";
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const allPayouts: Payout[] = [
  { id: "PYT-9283-001", date: "Oct 17, 2023", amount: 4250.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-002", date: "Oct 10, 2023", amount: 2100.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-003", date: "Oct 03, 2023", amount: 8900.5, destination: "HSBC", accountLast4: "8829", status: "IN PROGRESS" },
  { id: "PYT-9283-004", date: "Sep 26, 2023", amount: 1500.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-005", date: "Sep 19, 2023", amount: 12300.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-006", date: "Sep 12, 2023", amount: 3400.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-007", date: "Sep 05, 2023", amount: 7800.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-008", date: "Aug 29, 2023", amount: 5600.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-009", date: "Aug 22, 2023", amount: 2900.0, destination: "HSBC", accountLast4: "8829", status: "FAILED" },
  { id: "PYT-9283-010", date: "Aug 15, 2023", amount: 11200.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-011", date: "Aug 08, 2023", amount: 6700.0, destination: "HSBC", accountLast4: "8829", status: "COMPLETED" },
  { id: "PYT-9283-012", date: "Aug 01, 2023", amount: 4100.0, destination: "HSBC", accountLast4: "8829", status: "PENDING" },
];

// Generate more mock payouts
const generateMockPayouts = (): Payout[] => {
  const payouts = [...allPayouts];
  const statuses: Payout["status"][] = ["COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "IN PROGRESS", "COMPLETED"];
  for (let i = 13; i <= 42; i++) {
    const day = 25 - ((i - 13) * 7) % 30;
    const monthOffset = Math.floor(((i - 13) * 7) / 30);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = (9 - monthOffset + 12) % 12;
    const actualDay = day > 0 ? day : 28 + day;
    payouts.push({
      id: `PYT-9283-${String(i).padStart(3, "0")}`,
      date: `${months[monthIdx]} ${actualDay}, 2023`,
      amount: Math.round((1000 + Math.random() * 12000) * 100) / 100,
      destination: "HSBC",
      accountLast4: "8829",
      status: statuses[i % statuses.length],
    });
  }
  return payouts;
};

const mockPayouts = generateMockPayouts();

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ── Schedule Option ─────────────────────────────────────────────────────────

const ScheduleOption = ({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
      selected
        ? "border-red-500/30 bg-red-500/5"
        : "border-secondary/10 bg-transparent hover:border-secondary/20"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        selected ? "bg-red-500/10" : "bg-secondary/5"
      }`}
    >
      <Icon size={18} className={selected ? "text-red-400" : "text-secondary"} />
    </div>
    <span
      className={`text-sm font-medium flex-1 text-left ${
        selected ? "text-white" : "text-secondary"
      }`}
    >
      {label}
    </span>
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        selected ? "border-red-500 bg-red-500" : "border-secondary/30"
      }`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  </button>
);

// ── Component ───────────────────────────────────────────────────────────────

const PayoutsPage = () => {
  const [schedule, setSchedule] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const totalPages = Math.max(1, Math.ceil(mockPayouts.length / perPage));
  const paginatedPayouts = mockPayouts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const showingFrom = (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, mockPayouts.length);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const headers = ["Payout ID", "Date", "Amount", "Destination", "Account", "Status"];
    const rows = mockPayouts.map((p) => [
      p.id,
      p.date,
      p.amount.toFixed(2),
      p.destination,
      `****${p.accountLast4}`,
      p.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payouts_history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-white">Payouts</h1>
          <p className="text-secondary text-sm mt-2 max-w-lg leading-relaxed">
            Manage your earnings, configure settlement schedules, and monitor your community impact revenue.
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <ShieldCheck size={14} className="text-green-400" />
          <div>
            <p className="text-green-400/60 text-[9px] uppercase tracking-wider font-semibold">Security Status</p>
            <p className="text-green-400 text-sm font-semibold">Account Verified</p>
          </div>
        </div>
      </div>

      {/* ── Top Row: Available + Linked Account ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Available for Payout */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6 relative overflow-hidden">
          {/* Wallet icon background */}
          <div className="absolute top-6 right-6 opacity-10">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>

          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-3">
            Available for Payout
          </p>

          <div className="flex items-end gap-3 mb-6">
            <span className="font-jakarta text-5xl font-bold text-white">
              £12,450<span className="text-3xl">.80</span>
            </span>
            <span className="flex items-center gap-1 text-green-400 text-sm font-medium mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              +12.5%
            </span>
          </div>

          <div className="flex items-center gap-8 mb-6">
            <div>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider">Pending Balance</p>
              <p className="text-white text-lg font-bold">£3,120.00</p>
            </div>
            <div>
              <p className="text-secondary/40 text-[10px] uppercase tracking-wider">Next Payout Date</p>
              <p className="text-white text-lg font-bold">Oct 24, 2023</p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
            <Zap size={16} /> Request Instant Payout
          </button>
        </div>

        {/* Linked Account */}
        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-secondary/60" />
            <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold">
              Linked Account
            </p>
          </div>

          {/* Stripe Connect */}
          <div className="bg-secondary/5 rounded-xl p-4 mb-4 border border-secondary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#635BFF] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">STRIPE</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Stripe Connect</p>
                <p className="text-secondary/50 text-xs">Connected since Jan 2023</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary/50">Bank Name:</span>
                <span className="text-white font-medium">HSBC UK PLC</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary/50">Account:</span>
                <span className="text-white font-medium">•••• 8829</span>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors">
            Manage Payment Method
          </button>
        </div>
      </div>

      {/* ── Bottom Row: Schedule + Historical Payouts ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Payout Schedule */}
        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold mb-4">
            Payout Schedule
          </p>

          <div className="space-y-2.5">
            <ScheduleOption
              icon={CalendarDays}
              label="Daily"
              selected={schedule === "Daily"}
              onClick={() => setSchedule("Daily")}
            />
            <ScheduleOption
              icon={Repeat}
              label="Weekly"
              selected={schedule === "Weekly"}
              onClick={() => setSchedule("Weekly")}
            />
            <ScheduleOption
              icon={Banknote}
              label="Monthly"
              selected={schedule === "Monthly"}
              onClick={() => setSchedule("Monthly")}
            />
          </div>

          <p className="text-secondary/40 text-xs mt-5 leading-relaxed italic">
            * Changes to settlement schedules may take up to 48 hours to reflect. High volume organizers may be eligible for custom cycles.
          </p>

          {/* Support Card */}
          <div className="mt-5 pt-5 border-t border-secondary/10">
            <p className="text-white text-sm font-semibold mb-1">Need help with payouts?</p>
            <p className="text-secondary/50 text-xs leading-relaxed mb-3">
              Our dedicated financial support team is available 24/7 for organization partners.
            </p>
            <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/80 transition-colors">
              Contact Support <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Historical Payouts */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold">
              Historical Payouts
            </p>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-xs transition-colors"
            >
              <Download size={12} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary/10">
                  <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold pb-3 pr-3">
                    Payout ID
                  </th>
                  <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold pb-3 pr-3">
                    Date
                  </th>
                  <th className="text-right text-secondary/40 text-[10px] uppercase tracking-wider font-semibold pb-3 pr-3">
                    Amount
                  </th>
                  <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold pb-3 pr-3">
                    Destination
                  </th>
                  <th className="text-left text-secondary/40 text-[10px] uppercase tracking-wider font-semibold pb-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayouts.map((payout, idx) => (
                  <tr
                    key={payout.id}
                    className={`border-b border-secondary/5 hover:bg-secondary/5 transition-colors ${
                      idx % 2 === 1 ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    <td className="py-3.5 pr-3 text-primary text-sm font-mono">
                      {payout.id}
                    </td>
                    <td className="py-3.5 pr-3 text-secondary text-sm">{payout.date}</td>
                    <td className="py-3.5 pr-3 text-right text-white text-sm font-bold">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-secondary/40" />
                        <div>
                          <p className="text-white text-xs font-medium">{payout.destination}</p>
                          <p className="text-secondary/40 text-[10px]">•••• {payout.accountLast4}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      {payout.status === "COMPLETED" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[10px] font-bold text-green-400 uppercase tracking-wider">
                          {payout.status}
                        </span>
                      ) : payout.status === "IN PROGRESS" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                          {payout.status}
                        </span>
                      ) : payout.status === "PENDING" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-400/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
                          {payout.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase tracking-wider">
                          {payout.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary/10">
            <p className="text-secondary/40 text-xs">
              Showing {showingFrom} of {mockPayouts.length} payouts
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-secondary/15 text-secondary hover:text-white hover:border-secondary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
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
    </div>
  );
};

export default PayoutsPage;
