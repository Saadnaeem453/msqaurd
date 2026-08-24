import { useState, useMemo } from "react";
import { Download, MessageSquare, Users, QrCode, Pencil } from "lucide-react";
import Pagination from "../../../components/Pagination";

// ── Types ───────────────────────────────────────────────────────────────────

interface Attendee {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  event: string;
  ticketType: "vip" | "standard";
  status: "Checked In" | "Pending";
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const allAttendees: Attendee[] = [
  {
    id: "MSQ-4835-X",
    name: "Sarah Jenkins",
    initials: "SJ",
    color: "bg-primary/20 text-primary",
    email: "s.jenkins@university.edu",
    event: "Winter Gala 2024",
    ticketType: "vip",
    status: "Checked In",
  },
  {
    id: "MSQ-4102-K",
    name: "Marcus Chen",
    initials: "MC",
    color: "bg-secondary/20 text-secondary",
    email: "m.chen88@gmail.com",
    event: "Tech Summit: GenAI",
    ticketType: "standard",
    status: "Pending",
  },
  {
    id: "MSQ-4037-Z",
    name: "David Rodriguez",
    initials: "DR",
    color: "bg-primary/15 text-primary",
    email: "d.rodriguez@outlook.com",
    event: "Annual Sports Day",
    ticketType: "standard",
    status: "Checked In",
  },
  {
    id: "MSQ-2245-L",
    name: "Elena Petrova",
    initials: "EP",
    color: "bg-secondary/15 text-secondary",
    email: "elena.p@designstudio.co",
    event: "Winter Gala 2024",
    ticketType: "vip",
    status: "Checked In",
  },
  {
    id: "MSQ-5512-A",
    name: "James Wilson",
    initials: "JW",
    color: "bg-primary/20 text-primary",
    email: "j.wilson@techcorp.io",
    event: "Tech Summit: GenAI",
    ticketType: "standard",
    status: "Pending",
  },
  {
    id: "MSQ-3098-B",
    name: "Aisha Patel",
    initials: "AP",
    color: "bg-secondary/20 text-secondary",
    email: "a.patel@university.edu",
    event: "Annual Sports Day",
    ticketType: "standard",
    status: "Checked In",
  },
  {
    id: "MSQ-6701-C",
    name: "Tom Bradley",
    initials: "TB",
    color: "bg-primary/15 text-primary",
    email: "t.bradley@gmail.com",
    event: "Winter Gala 2024",
    ticketType: "vip",
    status: "Pending",
  },
  {
    id: "MSQ-1843-D",
    name: "Nina Kowalski",
    initials: "NK",
    color: "bg-secondary/15 text-secondary",
    email: "n.kowalski@outlook.com",
    event: "Tech Summit: GenAI",
    ticketType: "standard",
    status: "Checked In",
  },
  {
    id: "MSQ-7722-E",
    name: "Carlos Mendez",
    initials: "CM",
    color: "bg-primary/20 text-primary",
    email: "c.mendez@techcorp.io",
    event: "Annual Sports Day",
    ticketType: "standard",
    status: "Checked In",
  },
  {
    id: "MSQ-9901-F",
    name: "Priya Sharma",
    initials: "PS",
    color: "bg-secondary/20 text-secondary",
    email: "p.sharma@designstudio.co",
    event: "Winter Gala 2024",
    ticketType: "vip",
    status: "Pending",
  },
];

const ITEMS_PER_PAGE = 10;
const TOTAL_ATTENDEES = 4281;
const TOTAL_PAGES = Math.ceil(TOTAL_ATTENDEES / ITEMS_PER_PAGE);

// ── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
  subColor,
  icon,
  progress,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
  progress?: number;
}) => (
  <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </p>
      <span className="text-secondary/20">{icon}</span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl md:text-3xl font-bold text-white font-jakarta">
        {value}
      </span>
      {sub && (
        <span
          className={`text-xs font-medium mb-1 ${subColor || "text-secondary/60"}`}
        >
          {sub}
        </span>
      )}
    </div>
    {progress !== undefined && (
      <div className="mt-3 h-1.5 bg-secondary/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
  </div>
);

const TicketTypeBadge = ({ variant }: { variant: "vip" | "standard" }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
      variant === "vip"
        ? "bg-primary/15 text-primary border border-primary/30"
        : "bg-secondary/10 text-secondary border border-secondary/20"
    }`}
  >
    {variant === "vip" ? "VIP ACCESS" : "STANDARD"}
  </span>
);

const StatusDot = ({ status }: { status: string }) => (
  <span
    className={`flex items-center gap-1.5 text-sm font-medium ${
      status === "Checked In" ? "text-green-400" : "text-yellow-400"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        status === "Checked In" ? "bg-green-400" : "bg-yellow-400"
      }`}
    />
    {status}
  </span>
);

// ── Page Component ──────────────────────────────────────────────────────────

const AttendeeList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedAttendees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allAttendees.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
      {/* ─ Header ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl md:text-3xl font-bold text-white">
            Attendee List
          </h1>
          <p className="text-secondary/60 text-sm mt-1 max-w-xl">
            Manage ticket holders, track check-in real-time status, and oversee community
            distribution across all active events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#131418] border border-secondary/10 text-secondary hover:text-white hover:border-secondary/30 rounded-lg text-sm font-medium transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#131418] border border-secondary/10 text-secondary hover:text-white hover:border-secondary/30 rounded-lg text-sm font-medium transition-colors">
            <MessageSquare size={14} /> Bulk Message
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="TOTAL ATTENDEES"
          value="4,281"
          sub="+12%"
          subColor="text-primary"
          icon={<Users size={20} />}
        />
        <StatCard
          label="CHECK-IN RATE"
          value="68.4%"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-secondary/20"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          progress={68.4}
        />
        <StatCard
          label="REGISTERED TODAY"
          value="152"
          sub="Live Tracking"
          subColor="text-primary"
          icon={<Users size={20} />}
        />
      </div>

      {/* ── Attendee Table ─────────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 md:p-6 pb-4">
          <h2 className="font-jakarta text-lg font-bold text-white">
            Attendee Management
          </h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Checked In
            </span>
            <span className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Pending
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-t border-b border-secondary/10">
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-5 md:px-6">
                  Attendee Name
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Email
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Event
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Ticket Type
                </th>
                <th className="text-left text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4">
                  Status
                </th>
                <th className="text-center text-secondary/60 text-[10px] uppercase tracking-wider font-semibold py-3 px-4 md:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttendees.map((att) => (
                <tr
                  key={att.id}
                  className="border-b border-secondary/5 hover:bg-secondary/5 transition-colors"
                >
                  <td className="py-3.5 px-5 md:px-6">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${att.color}`}
                      >
                        {att.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {att.name}
                        </p>
                        <p className="text-secondary/40 text-[10px]">
                          ID: {att.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-secondary text-sm truncate max-w-[180px]">
                    {att.email}
                  </td>
                  <td className="py-3.5 px-4 text-white text-sm">
                    {att.event}
                  </td>
                  <td className="py-3.5 px-4">
                    <TicketTypeBadge variant={att.ticketType} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusDot status={att.status} />
                  </td>
                  <td className="py-3.5 px-4 md:px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg text-secondary/60 hover:text-white hover:bg-white/5 transition-colors" title="Check-in QR">
                        <QrCode size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg text-secondary/60 hover:text-white hover:bg-white/5 transition-colors" title="Edit attendee">
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-secondary/10">
          <p className="text-secondary/50 text-[10px] uppercase tracking-wider font-semibold">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, TOTAL_ATTENDEES)} of{" "}
            {TOTAL_ATTENDEES.toLocaleString()} attendees
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendeeList;
