import type { IconType } from "react-icons";
import {
  FiCheck,
  FiCreditCard,
  FiHeadphones,
  FiPlus,
  FiPlusSquare,
  FiShield,
} from "react-icons/fi";
import { FaGavel } from "react-icons/fa";
import { HiOutlineNoSymbol } from "react-icons/hi2";

/* ============================= Types ============================= */

interface RoleCardData {
  id: string;
  icon: IconType;
  level: string;
  title: string;
  description: string;
  avatars: string[];
  extra?: number;
  assigned: string;
}

interface PermissionRow {
  id: string;
  label: string;
  access: [boolean, boolean, boolean, boolean];
}

/* ================== Mock data (swap with real API later) ================== */

const roleCards: RoleCardData[] = [
  {
    id: "super",
    icon: FiShield,
    level: "LVL 100",
    title: "Super Admin",
    description:
      "Full system access including infrastructure settings, financial records, and user management.",
    avatars: ["AL", "MK"],
    extra: 1,
    assigned: "3 Users assigned",
  },
  {
    id: "finance",
    icon: FiCreditCard,
    level: "LVL 80",
    title: "Finance Manager",
    description:
      "Access to payment gateways, transaction logs, refunds, and financial reporting dashboards.",
    avatars: ["SR", "TD"],
    assigned: "2 Users assigned",
  },
  {
    id: "moderator",
    icon: FaGavel,
    level: "LVL 40",
    title: "Moderator",
    description:
      "Manage event listings, review reported content, and moderate community discussion threads.",
    avatars: ["JK", "RA", "EW"],
    extra: 5,
    assigned: "8 Users assigned",
  },
  {
    id: "support",
    icon: FiHeadphones,
    level: "LVL 20",
    title: "Support Agent",
    description:
      "View user profiles, transaction history for troubleshooting, and manage support tickets.",
    avatars: ["PL", "NM"],
    extra: 10,
    assigned: "12 Users assigned",
  },
];

const permissionColumns = ["Super Admin", "Finance", "Moderator", "Support"];

const permissionRows: PermissionRow[] = [
  { id: "p1", label: "Can Edit Platform Settings", access: [true, false, false, false] },
  { id: "p2", label: "Can Issue Refunds", access: [true, true, false, false] },
  { id: "p3", label: "Can Delete Events", access: [true, false, true, false] },
  { id: "p4", label: "Can View Private User Data", access: [true, false, false, true] },
];

/* ============================= Page ============================= */

const AccessRolesPage = () => (
  <div className="min-h-full bg-grayblue font-jakarta text-bgray">
    <div className="admin-page">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-medium tracking-tight text-bgray">Access Roles</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary/80">
            Define and manage system-wide administrative permissions and hierarchical levels.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold text-bgray transition hover:bg-primary/90"
        >
          <FiPlus size={14} />
          Create New Role
        </button>
      </header>

      {/* Role cards */}
      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {roleCards.map((role) => {
          const RoleIcon = role.icon;
          return (
            <article key={role.id} className="flex flex-col rounded-md bg-[#151c24] p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15">
                  <RoleIcon size={16} className="text-primary" />
                </span>
                <span className="rounded-sm bg-bgray/10 px-2 py-1 text-[10px] font-bold text-bgray/80">
                  {role.level}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-medium text-bgray">{role.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-secondary/70">{role.description}</p>

              <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                <span className="flex items-center">
                  {role.avatars.map((initials, index) => (
                    <span
                      key={initials}
                      className={`flex h-6 w-6 items-center justify-center rounded-full border border-[#151c24] bg-bgray/20 text-[10px] font-bold text-bgray/80 ${
                        index > 0 ? "-ml-1.5" : ""
                      }`}
                    >
                      {initials}
                    </span>
                  ))}
                  {role.extra !== undefined && (
                    <span className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-bgray/30 text-[10px] font-bold text-bgray">
                      +{role.extra}
                    </span>
                  )}
                </span>
                <span className="text-xs font-semibold text-bgray">{role.assigned}</span>
              </div>
            </article>
          );
        })}

        {/* Custom role placeholder */}
        <button
          type="button"
          className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-bgray/20 p-5 text-center transition hover:border-bgray/40 hover:bg-bgray/5"
        >
          <FiPlusSquare size={20} className="text-bgray/70" />
          <span className="text-sm font-medium text-bgray">Define a new Custom Role</span>
          <span className="text-xs text-bgray/60">Configure unique permissions</span>
        </button>
      </section>

      {/* Permissions audit */}
      <section className="mt-6 overflow-hidden rounded-md bg-[#151c24]">
        <div className="flex flex-wrap items-start justify-between gap-3 bg-bgray/5 px-6 py-5">
          <div>
            <h2 className="text-lg font-medium text-bgray">System-Level Permissions Audit</h2>
            <p className="mt-1 text-xs text-secondary/70">
              Overview of permission distribution across active roles.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md border border-bgray/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-bgray transition hover:bg-bgray/10"
          >
            Export Map
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="border-b border-bgray/10">
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-secondary/80">
                  Permission Node
                </th>
                {permissionColumns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-secondary/80"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionRows.map((row) => (
                <tr key={row.id} className="border-b border-bgray/5 last:border-0">
                  <td className="px-6 py-5 text-xs font-medium text-bgray">{row.label}</td>
                  {row.access.map((granted, index) => (
                    <td key={index} className="px-4 py-5">
                      {granted ? (
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary"
                          title="Granted"
                        >
                          <FiCheck size={11} className="text-grayblue" />
                        </span>
                      ) : (
                        <HiOutlineNoSymbol size={18} className="text-bgray/40" title="Denied" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
);

export default AccessRolesPage;