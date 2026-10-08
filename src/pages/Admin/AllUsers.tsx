import { useEffect, useState } from "react";
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
  X,
  Save,
} from "lucide-react";
import {
  adminApi,
  AdminUser,
  AdminUserRole,
  AdminUsersPagination,
} from "../../services/admin_service";

type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

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

const roleBadge = (role: AdminUserRole) => {
  if (role === "admin") return "bg-primary text-white border border-primary/30";
  return "bg-gray-700/20 text-gray-400 border border-gray-600/30";
};

const userDot = (status: UserStatus) => {
  if (status === "SUSPENDED") return "bg-red-500";
  return "bg-green-500";
};

const formatDate = (value: string | null) => {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const displayRole = (role: AdminUserRole) => role.toUpperCase();

const statusPayload = (status: UserStatus) => ({
  is_active: status !== "SUSPENDED",
  email_verified: status === "ACTIVE",
});

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
  <div className="bg-[#151c25] rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <p className="text-bgray/50 text-[11px] uppercase tracking-[0.15em] font-semibold">
        {label}
      </p>
      <span className="text-bgray/30">{icon}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-bgray font-jakarta">{value}</span>
      {change && <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>}
    </div>
    {sub && <p className="text-bgray/40 text-xs mt-1">{sub}</p>}
  </div>
);

const ModalShell = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button aria-label="Close modal" className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-border_color border border-bgray/20 shadow-2xl">
      <div className="flex items-center justify-between border-b border-bgray/10 px-6 py-4">
        <h2 className="admin-section-title font-jakarta text-lg font-semibold text-bgray">{title}</h2>
        <button onClick={onClose} className="text-bgray/60 hover:text-bgray" aria-label="Close">
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const AllUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AdminUserRole>("all");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<"details" | "edit" | null>(null);
  const [editStatus, setEditStatus] = useState<UserStatus>("ACTIVE");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      const result = await adminApi.getUsers({
        page,
        limit: perPage,
        role: roleFilter,
        search: search.trim() || undefined,
      });

      if (result.ok && Array.isArray(result.data)) {
        const pagination = result.pagination as Partial<AdminUsersPagination> | undefined;
        setUsers(result.data);
        setTotalUsers(pagination?.total ?? result.data.length);
        setTotalPages(pagination?.total_pages ?? (result.data.length ? 1 : 0));
      } else {
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(0);
        setError(result.detail || "Failed to load users.");
      }

      setLoading(false);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [page, perPage, roleFilter, search]);

  const getStatus = (user: AdminUser): UserStatus => {
    if (!user.is_active) return "SUSPENDED";
    if (!user.email_verified) return "PENDING";
    return "ACTIVE";
  };

  const openDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode("details");
  };

  const openEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setEditStatus(getStatus(user));
    setModalMode("edit");
  };

  const closeModal = () => {
    if (!saving) {
      setSelectedUser(null);
      setModalMode(null);
    }
  };

  const saveUser = async () => {
    if (!selectedUser) return;

    setSaving(true);
    const result = await adminApi.updateUser(selectedUser.id, {
      ...statusPayload(editStatus),
    });
    setSaving(false);

    if (!result.ok) {
      setError(result.detail || "Failed to update user.");
      return;
    }

    if (result.data) {
      setUsers((currentUsers) => currentUsers.map((user) => (
        user.id === result.data?.id ? result.data : user
      )));
    }
    setModalMode(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const status = getStatus(user);
    return statusFilter === "ALL" || status === statusFilter;
  });
  const startIdx = totalUsers === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalUsers);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="admin-page space-y-6">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">
            All Users Directory
          </h1>
          <p className="admin-page-description">
            Manage platform accounts across the global MSQUARED ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1b20] border border-bgray/15 text-bgray/70 hover:text-bgray rounded-lg text-sm font-medium transition-colors">
            <Download size={14} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-gray-100 rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
            <UserPlus size={14} />
            Create User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={totalUsers.toLocaleString()}
          sub="Matching current filters"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Active Now"
          value={users.filter((user) => getStatus(user) === "ACTIVE").length.toLocaleString()}
          sub="On current page"
          icon={<Signal size={16} />}
        />
        <StatCard
          label="Verification"
          value={users.filter((user) => getStatus(user) === "PENDING").length.toLocaleString()}
          sub="Pending on current page"
          changeColor="text-red-400"
          icon={<Shield size={16} />}
        />
        <StatCard
          label="Suspended"
          value={users.filter((user) => getStatus(user) === "SUSPENDED").length.toLocaleString()}
          sub="On current page"
          icon={<Clock size={16} />}
        />
      </div>

      <div className="bg-[#151c25] rounded-xl p-4 mb-0">
        <div className="flex flex-wrap items-center gap-3">

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bgray/30" size={16} />
            <input
              type="text"
              placeholder="Search name, username or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0f1014] border border-bgray/10 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 placeholder:text-bgray/30 focus:outline-none focus:border-bgray/30 transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as "all" | AdminUserRole);
              setPage(1);
            }}
            className="bg-[#0f1014] border border-bgray/10 rounded-lg py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-bgray/30 transition-colors cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="attendee">Attendee</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#0f1014] border border-bgray/10 rounded-lg py-2 px-3 text-sm text-gray-300 focus:outline-none focus:border-bgray/30 transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <span className="text-bgray/50 text-xs ml-auto hidden md:block">
            Displaying {startIdx}-{endIdx} of {totalUsers.toLocaleString()}
          </span>

          <div className="flex items-center gap-1 bg-[#0f1014] rounded-lg p-1 border border-bgray/10">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-bgray/20 text-bgray" : "text-bgray/40 hover:text-gray-300"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-bgray/20 text-bgray" : "text-bgray/40 hover:text-gray-300"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#151c25]  rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#202630]">
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  User ID
                </th>
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  Full Name
                </th>
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4 hidden md:table-cell">
                  Email Address
                </th>
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  Role
                </th>
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4">
                  Status
                </th>
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-left py-3 px-4 hidden lg:table-cell">
                  Joined Date
                </th>
                <th className="text-bgray/60 text-[11px] uppercase tracking-wider font-medium text-center py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-bgray/50 text-sm">Loading users...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-red-400 text-sm">{error}</td>
                </tr>
              )}
              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-bgray/50 text-sm">No users found.</td>
                </tr>
              )}
              {!loading && !error && filteredUsers.map((user) => {
                const status = getStatus(user);
                return (
                <tr key={user.id} className="border-b border-bgray/5 hover:bg-white/[0.01] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${userDot(status)}`} />
                      <span className="text-bgray/60  text-sm font-mono">{user.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-bgray/80 text-sm font-medium">{user.full_name}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-bgray/60  text-sm">{user.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${roleBadge(user.role)}`}>
                      {displayRole(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(status)}`} />
                      <span className={`text-sm font-medium ${statusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-bgray/60  text-sm">{formatDate(user.created_at)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-bgray/50 hover:text-bgray transition-colors"
                        aria-label={`Edit ${user.full_name}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => openDetails(user)}
                        className="text-bgray/50 hover:text-bgray transition-colors"
                        aria-label={`View ${user.full_name}`}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-bgray/10 bg-[#15161a]">

          <div className="flex items-center gap-2">
            <span className="text-bgray/50 text-xs">Rows per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#0f1014] border border-bgray/10 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={page === 1}
              className="p-1.5 rounded text-bgray/40 hover:text-bgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded text-bgray/40 hover:text-bgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

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
                  className={`w-7 h-7 rounded text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-primary text-gray-100"
                      : "text-bgray/50 hover:text-bgray hover:bg-bgray/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && page < totalPages - 2 && (
              <span className="text-bgray/30 text-xs px-1">...</span>
            )}
            {totalPages > 5 && (
              <button
                onClick={() => goToPage(totalPages)}
                className={`w-7 h-7 rounded text-sm font-medium transition-colors ${
                  page === totalPages
                    ? "bg-primary text-gray-100"
                    : "text-bgray/50 hover:text-bgray hover:bg-bgray/10"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded text-bgray/40 hover:text-bgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={page === totalPages}
              className="p-1.5 rounded text-bgray/40 hover:text-bgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {selectedUser && modalMode === "details" && (
        <ModalShell title="User Details" onClose={closeModal}>
          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2 flex items-center gap-4">
              {selectedUser.avatar_url ? (
                <img src={selectedUser.avatar_url} alt={selectedUser.full_name} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-bgray">
                  {selectedUser.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-base font-semibold text-bgray">{selectedUser.full_name}</h3>
                <p className="text-sm text-bgray/60">@{selectedUser.username}</p>
              </div>
            </div>
            {[
              ["User ID", selectedUser.id],
              ["Email", selectedUser.email],
              ["Role", displayRole(selectedUser.role)],
              ["Status", getStatus(selectedUser)],
              ["Email Verified", selectedUser.email_verified ? "Yes" : "No"],
              ["Auth Provider", selectedUser.auth_provider],
              ["Last Login", formatDate(selectedUser.last_login_at)],
              ["Created", formatDate(selectedUser.created_at)],
              ["Updated", formatDate(selectedUser.updated_at)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-bgray/[0.04] px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-bgray/50">{label}</p>
                <p className="mt-1 break-words text-sm text-bgray">{value}</p>
              </div>
            ))}
          </div>
        </ModalShell>
      )}

      {selectedUser && modalMode === "edit" && (
        <ModalShell title={`Edit ${selectedUser.full_name}`} onClose={closeModal}>
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-bgray/70" htmlFor="user-status">Status</label>
              <select
                id="user-status"
                value={editStatus}
                onChange={(event) => setEditStatus(event.target.value as UserStatus)}
                className="w-full rounded-lg border border-bgray/15 bg-border_color px-3 py-2.5 text-sm text-bgray outline-none focus:border-secondary"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 border-t border-bgray/10 pt-5">
              <button onClick={closeModal} disabled={saving} className="rounded-lg border border-bgray/15 px-4 py-2.5 text-sm text-bgray/70 hover:text-bgray disabled:opacity-50">
                Cancel
              </button>
              <button onClick={saveUser} disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bgray hover:bg-primary/90 disabled:opacity-50">
                <Save size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

export default AllUsers;
