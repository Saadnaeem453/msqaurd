import { useState, useMemo } from "react";
import {
  Users,
  Signal,
  Shield,
  Clock,
  Search,
  Download,
  UserPlus,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  LayoutGrid,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type UserRole = "ADMIN" | "ORGANIZER" | "ATTENDEE";
type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  active: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const generateUsers = (): User[] => {
  const firstNames = ["Felix", "Sarah", "Marco", "Elena", "Ahmad", "Fatima", "Omar", "Aisha", "Hassan", "Maryam", "Yusuf", "Zainab", "Ibrahim", "Khadija", "Ali", "Safiya"];
  const lastNames = ["Vought", "Jennings", "Belmonte", "Rodriguez", "Khan", "Al-Rashid", "Hassan", "Ibrahim", "Omar", "Siddiqui", "Farooq", "Nakamura", "Chen", "Patel", "Singh", "Williams"];
  const roles: UserRole[] = ["ADMIN", "ORGANIZER", "ATTENDEE", "ATTENDEE", "ATTENDEE", "ORGANIZER", "ATTENDEE", "ATTENDEE"];
  const statuses: UserStatus[] = ["ACTIVE", "ACTIVE", "ACTIVE", "PENDING", "SUSPENDED", "ACTIVE", "ACTIVE", "ACTIVE"];
  const domains = ["msquared.io", "isoc.net", "gmail.com", "outlook.com", "yahoo.com", "proton.me"];

  const users: User[] = [];
  for (let i = 0; i < 250; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const role = roles[i % roles.length];
    const status = statuses[i % statuses.length];
    const domain = domains[i % domains.length];

    users.push({
      id: `user-${i + 1}`,
      userId: `#USR-${String(1000 + i).padStart(4, "0")}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      role,
      status,
      joinedDate: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      active: status === "ACTIVE",
    });
  }
  return users;
};

const allUsers = generateUsers();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusColor = (status: UserStatus) => {
  if (status === "ACTIVE") return "text-green-400";
  if (status === "PENDING") return "text-yellow-400";
  return "text-red-400";
};

const statusDot = (status: UserStatus) => {
  if (status === "ACTIVE") return "bg-green-400";
  if (status === "PENDING") return "bg-yellow-400";
  return "bg-red-400";
};

const roleBadge = (role: UserRole) => {
  if (role === "ADMIN") return "bg-primary/20 text-primary border border-primary/30";
  return "bg-gray-700/20 text-gray-400 border border-gray-600/30";
};

const userDot = (status: UserStatus) => {
  if (status === "SUSPENDED") return "bg-red-500";
  return "bg-green-500";
};

// ── Stat Card ───────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  change,
  changeColor,
  sub,
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  changeColor?: string;
  sub?: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <p className="text-secondary/50 text-[9px] uppercase tracking-[0.15em] font-semibold">
        {label}
      </p>
      <span className="text-secondary/30">{icon}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-gray-200 font-jakarta">{value}</span>
      {change && <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>}
    </div>
    {sub && <p className="text-secondary/40 text-[10px] mt-1">{sub}</p>}
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const AllUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Filter users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.userId.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, filteredUsers.length);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-xl md:text-2xl font-bold text-gray-200">
            All Users Directory
          </h1>
          <p className="text-secondary/60 text-sm mt-1">
            Manage platform accounts across the global MSQUARED ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1b20] border border-secondary/15 text-secondary/70 hover:text-gray-200 rounded-lg text-xs font-medium transition-colors">
            <Download size={14} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-gray-100 rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
            <UserPlus size={14} />
            Create User
          </button>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value="12,482"
          change="+2.4%"
          changeColor="text-greenish"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Active Now"
          value="1,842"
          sub="Platform Peak"
          icon={<Signal size={16} />}
        />
        <StatCard
          label="Verification"
          value="128"
          sub="Pending"
          changeColor="text-red-400"
          icon={<Shield size={16} />}
        />
        <StatCard
          label="Suspended"
          value="34"
          sub="Compliance"
          icon={<Clock size={16} />}
        />
      </div>

      {/* ─ Filters ───────────────────────────────────────── */}
      <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
            <input
              type="text"
              placeholder="Filter by Name, Email or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0f1014] border border-secondary/10 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 placeholder:text-secondary/30 focus:outline-none focus:border-secondary/30 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#0f1014] border border-secondary/10 rounded-lg py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-secondary/30 transition-colors cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="ORGANIZER">Organizer</option>
            <option value="ATTENDEE">Attendee</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#0f1014] border border-secondary/10 rounded-lg py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-secondary/30 transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {/* Count */}
          <span className="text-secondary/50 text-xs ml-auto hidden md:block">
            Displaying {startIdx}-{endIdx} of {filteredUsers.length.toLocaleString()}
          </span>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-[#0f1014] rounded-lg p-1 border border-secondary/10">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-secondary/20 text-gray-200" : "text-secondary/40 hover:text-gray-300"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-secondary/20 text-gray-200" : "text-secondary/40 hover:text-gray-300"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="bg-[#1a1b20] border border-secondary/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary/10 bg-[#15161a]">
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  User ID
                </th>
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  Full Name
                </th>
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-left py-3 px-4 hidden md:table-cell">
                  Email Address
                </th>
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  Role
                </th>
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  Status
                </th>
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-left py-3 px-4 hidden lg:table-cell">
                  Joined Date
                </th>
                <th className="text-gray-500 text-[9px] uppercase tracking-wider font-medium text-center py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-secondary/5 hover:bg-white/[0.01] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${userDot(user.status)}`} />
                      <span className="text-gray-600 text-xs font-mono">{user.userId}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-400 text-xs font-medium">{user.name}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-500 text-xs">{user.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${roleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(user.status)}`} />
                      <span className={`text-xs font-medium ${statusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-gray-500 text-xs">{user.joinedDate}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-gray-500 hover:text-gray-300 transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button className="text-gray-500 hover:text-gray-300 transition-colors">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-secondary/10 bg-[#15161a]">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-secondary/50 text-xs">Rows per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#0f1014] border border-secondary/10 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Page controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={page === 1}
              className="p-1.5 rounded text-secondary/40 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded text-secondary/40 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    page === pageNum
                      ? "bg-primary text-gray-100"
                      : "text-secondary/50 hover:text-gray-200 hover:bg-secondary/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && page < totalPages - 2 && (
              <span className="text-secondary/30 text-xs px-1">...</span>
            )}
            {totalPages > 5 && (
              <button
                onClick={() => goToPage(totalPages)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  page === totalPages
                    ? "bg-primary text-gray-100"
                    : "text-secondary/50 hover:text-gray-200 hover:bg-secondary/10"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded text-secondary/40 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={page === totalPages}
              className="p-1.5 rounded text-secondary/40 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
