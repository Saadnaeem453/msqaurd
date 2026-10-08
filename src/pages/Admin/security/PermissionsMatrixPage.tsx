import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiCheck,
  FiClipboard,
  FiCreditCard,
  FiFilter,
  FiHexagon,
  FiRotateCcw,
  FiSave,
  FiShare2,
  FiShield,
} from "react-icons/fi";
import { FaGavel } from "react-icons/fa";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

type RoleId = "owner" | "super" | "moderator" | "finance" | "analytics";

interface RoleColumn {
  id: RoleId;
  name: string;
  sub: string;
}

interface PermissionRowData {
  id: string;
  title: string;
  description: string;
  access: Record<RoleId, boolean>;
}

interface ModuleGroup {
  id: string;
  label: string;
  icon: IconType;
  rows: PermissionRowData[];
}

type MatrixState = Record<string, Record<RoleId, boolean>>;

/* ================== Mock data (swap with real API later) ================== */

const roleColumns: RoleColumn[] = [
  { id: "owner", name: "Owner", sub: "All Access" },
  { id: "super", name: "Super Admin", sub: "Tier 1" },
  { id: "moderator", name: "Moderator", sub: "Tier 2" },
  { id: "finance", name: "Finance", sub: "Tier 2" },
  { id: "analytics", name: "Analytics", sub: "Read Only" },
];

const moduleGroups: ModuleGroup[] = [
  {
    id: "finance",
    label: "Finance Module",
    icon: FiCreditCard,
    rows: [
      {
        id: "payouts",
        title: "Process Payouts",
        description: "Authorize manual withdrawal requests",
        access: { owner: true, super: true, moderator: false, finance: true, analytics: false },
      },
      {
        id: "fees",
        title: "Override Fees",
        description: "Modify commission structures per event",
        access: { owner: true, super: true, moderator: false, finance: false, analytics: false },
      },
    ],
  },
  {
    id: "moderation",
    label: "Moderation Module",
    icon: FaGavel,
    rows: [
      {
        id: "shadow",
        title: "Shadow Ban",
        description: "Restrict visibility without notifying user",
        access: { owner: true, super: true, moderator: true, finance: false, analytics: false },
      },
      {
        id: "audit",
        title: "Access Audit Logs",
        description: "View historical admin actions",
        access: { owner: true, super: true, moderator: false, finance: false, analytics: true },
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics Module",
    icon: FiBarChart2,
    rows: [
      {
        id: "export",
        title: "Export Raw Data",
        description: "Download CSV/JSON of system metrics",
        access: { owner: true, super: true, moderator: false, finance: false, analytics: true },
      },
    ],
  },
];

const buildMatrix = (): MatrixState =>
  Object.fromEntries(
    moduleGroups.flatMap((group) => group.rows.map((row) => [row.id, { ...row.access }])),
  );

/* ============================= Page ============================= */

const PermissionsMatrixPage = () => {
  const [matrix, setMatrix] = useState<MatrixState>(buildMatrix);
  const [saveOpen, setSaveOpen] = useState(false);

  const toggle = (rowId: string, role: RoleId) => {
    if (role === "owner") return; // Owner column is inherited/locked per design (dimmed checks)
    setMatrix((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [role]: !prev[rowId][role] },
    }));
  };

  const handleSave = () => {
    setSaveOpen(false);
    toast.success("Permission matrix saved across all roles.");
  };

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">Permissions Matrix</h1>
            <p className="mt-2 text-sm leading-relaxed text-secondary/80">
              Granular access control management. Configure module-specific capabilities across
              system roles following the Principle of Least Privilege.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-bgray/10 px-5 py-2.5 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
            >
              <FiRotateCcw size={13} />
              Audit Log
            </button>
            <button
              type="button"
              onClick={() => setSaveOpen(true)}
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiSave size={13} />
              Save Changes
            </button>
          </div>
        </header>

        {/* Matrix table */}
        <section className="mt-6 overflow-hidden rounded-md bg-[#151c24]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className="w-[28%] px-6 py-4 text-left">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                        Modules &amp; Capabilities
                      </span>
                      <FiFilter size={13} className="text-bgray/60" />
                    </span>
                  </th>
                  {roleColumns.map((role) => (
                    <th key={role.id} className="w-[14.4%] border-l border-bgray/5 px-4 py-4 text-center">
                      <span className="block text-xs font-bold text-bgray">{role.name}</span>
                      <span className="mt-1 block text-[10px] text-bgray/60">{role.sub}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleGroups.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <>
                      <tr key={group.id} className="border-t border-bgray/5">
                        <td colSpan={6} className="px-6 py-3">
                          <span className="flex items-center gap-2">
                            <GroupIcon size={13} className="text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                              {group.label}
                            </span>
                          </span>
                        </td>
                      </tr>
                      {group.rows.map((row) => (
                        <tr key={row.id} className="border-t border-bgray/5">
                          <td className="px-6 py-5">
                            <p className="text-xs font-bold text-bgray">{row.title}</p>
                            <p className="mt-1 text-[10px] text-bgray/60">{row.description}</p>
                          </td>
                          {roleColumns.map((role) => {
                            const checked = matrix[row.id]?.[role.id] ?? false;
                            const locked = role.id === "owner";
                            return (
                              <td key={role.id} className="border-l border-bgray/5 px-4 py-5 text-center">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={checked}
                                  aria-label={`${row.title} — ${role.name}`}
                                  disabled={locked}
                                  onClick={() => toggle(row.id, role.id)}
                                  className={`inline-flex h-5 w-5 items-center justify-center rounded-sm transition ${
                                    checked
                                      ? locked
                                        ? "bg-primary/50"
                                        : "bg-primary"
                                      : "bg-bgray/20 hover:bg-bgray/30"
                                  } ${locked ? "cursor-not-allowed" : ""}`}
                                >
                                  {checked && <FiCheck size={12} className="text-bgray" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom cards */}
        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Security score */}
          <div className="rounded-md bg-[#151c24] p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-bgray">
                <FiShield size={14} className="text-secondary" />
                Security Score
              </span>
              <span className="text-sm font-bold text-green">92%</span>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-bgray/20">
              <div className="h-full rounded-full bg-secondary" style={{ width: "92%" }} />
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-bgray/60">
              Configurations align with institutional least-privilege standards.
            </p>
          </div>

          {/* Pending requests */}
          <div className="rounded-md bg-[#151c24] p-5">
            <span className="flex items-center gap-2 text-sm font-medium text-bgray">
              <FiClipboard size={14} className="text-secondary" />
              Pending Requests
            </span>
            <div className="mt-4 flex items-start gap-3">
              <span className="rounded-sm bg-bgray/10 px-2.5 py-1.5 text-sm font-bold text-bgray">3</span>
              <p className="max-w-[220px] text-[10px] leading-relaxed text-bgray/60">
                Elevated access requests awaiting administrator review.
              </p>
            </div>
          </div>

          {/* Active sessions */}
          <div className="relative overflow-hidden rounded-md bg-[#151c24] p-5">
            <FiShare2
              size={72}
              className="absolute -bottom-2 -right-2 text-bgray/10"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-bgray">
              <FiHexagon size={14} className="text-secondary" />
              Active Sessions
            </span>
            <p className="mt-3 text-3xl font-bold text-bgray">124</p>
            <p className="mt-2 text-[10px] text-bgray/60">Across 5 global administrative tiers.</p>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onConfirm={handleSave}
        title="Save permission matrix"
        message="Apply capability changes across all system roles? Changes take effect immediately for active sessions."
        confirmLabel="Save Changes"
      />
    </div>
  );
};

export default PermissionsMatrixPage;