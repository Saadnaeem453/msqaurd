import { useState } from "react";
import {
  UserPlus,
  Mail,
  Download,
  ShieldCheck,
  Clock,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

type Role = "Owner" | "Admin" | "Moderator" | "Staff" | "Volunteer";
type Status = "Active" | "Inactive";

interface Member {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: Role;
  status: Status;
}

interface ActivityEntry {
  text: string;
  time: string;
  timeAgo: string;
}


const allMembers: Member[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@msquared.io",
    initials: "AH",
    color: "bg-red-500/20 text-red-400",
    role: "Owner",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    email: "s.jenkins@msquared.io",
    initials: "SJ",
    color: "bg-blue-500/20 text-blue-400",
    role: "Admin",
    status: "Active",
  },
  {
    id: "3",
    name: "Marcus Chen",
    email: "m.chen@msquared.io",
    initials: "MC",
    color: "bg-purple-500/20 text-purple-400",
    role: "Moderator",
    status: "Inactive",
  },
];

const activityLog: ActivityEntry[] = [
  {
    text: "Ahmed Hassan updated organization settings.",
    time: "2 MIN AGO",
    timeAgo: "2 min ago",
  },
  {
    text: 'Marcus Chen joined the "Volunteer" group.',
    time: "4 HOURS AGO",
    timeAgo: "4 hours ago",
  },
  {
    text: "Sarah Jenkins invited Leo Richards to Staff.",
    time: "YESTERDAY",
    timeAgo: "Yesterday",
  },
];

const roleBadgeColors: Record<Role, string> = {
  Owner: "bg-red-500/15 text-red-400 border-red-500/25",
  Admin: "bg-secondary/10 text-secondary border-secondary/15",
  Moderator: "bg-secondary/10 text-secondary border-secondary/15",
  Staff: "bg-secondary/10 text-secondary border-secondary/15",
  Volunteer: "bg-secondary/10 text-secondary border-secondary/15",
};


const tabs = ["All Members", "Staff", "Volunteers"] as const;
type Tab = (typeof tabs)[number];

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All Members");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredMembers = (() => {
    if (activeTab === "Staff")
      return allMembers.filter(
        (m) => m.role === "Admin" || m.role === "Moderator"
      );
    if (activeTab === "Volunteers")
      return allMembers.filter((m) => m.role === "Volunteer");
    return allMembers;
  })();

  const memberCount = filteredMembers.length;

  const adminCount = allMembers.filter(
    (m) => m.role === "Owner" || m.role === "Admin"
  ).length;
  const pendingCount = 1;

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-6">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-white">
            Team Management
          </h1>
          <p className="text-secondary text-sm mt-1.5 max-w-lg">
            Manage permissions, roles, and collaboration for your MSQUARED
            organization.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
          <UserPlus size={16} /> Invite Member
        </button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-5">

          <div className="flex items-center justify-between border-b border-secondary/10 pb-0 mb-4">
            <div className="flex items-center gap-4">
              {tabs.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setOpenMenuId(null);
                    }}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      isActive
                        ? "text-white"
                        : "text-secondary/60 hover:text-secondary"
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
            <span className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold">
              {memberCount} Members
            </span>
          </div>


          <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-secondary/10">
            <div className="col-span-5">
              <span className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold">
                Member
              </span>
            </div>
            <div className="col-span-3">
              <span className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold">
                Role
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold">
                Status
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-secondary/40 text-[10px] uppercase tracking-wider font-semibold">
                Actions
              </span>
            </div>
          </div>


          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary/50 text-sm">No members in this group</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 items-center border-b border-secondary/5 hover:bg-secondary/5 transition-colors"
              >

                <div className="col-span-5 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${member.color}`}
                  >
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {member.name}
                    </p>
                    <p className="text-secondary/40 text-xs truncate">
                      {member.email}
                    </p>
                  </div>
                </div>


                <div className="col-span-3">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-semibold border ${
                      roleBadgeColors[member.role]
                    }`}
                  >
                    {member.role}
                  </span>
                </div>


                <div className="col-span-2">
                  <span className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member.status === "Active"
                          ? "bg-green-400"
                          : "bg-secondary/40"
                      }`}
                    />
                    <span
                      className={
                        member.status === "Active"
                          ? "text-white"
                          : "text-secondary/50"
                      }
                    >
                      {member.status}
                    </span>
                  </span>
                </div>


                <div className="col-span-2 relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === member.id ? null : member.id
                      )
                    }
                    className="p-1.5 text-secondary/40 hover:text-white transition-colors rounded hover:bg-secondary/10"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === member.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-8 w-36 bg-[#1a1c22] border border-secondary/20 rounded-lg shadow-xl z-50 py-1">
                        <button className="w-full text-left px-3 py-2 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors">
                          Edit Role
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-secondary hover:text-white hover:bg-secondary/10 transition-colors">
                          View Profile
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>


        <div className="space-y-5">

          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-secondary/60" />
                <span className="text-white text-sm font-bold">Activity Log</span>
              </div>
              <button className="text-[10px] text-red-400 font-semibold uppercase tracking-wider hover:text-red-300 transition-colors">
                Clear
              </button>
            </div>

            <div className="space-y-4">
              {activityLog.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-secondary text-xs leading-relaxed">
                      {entry.text}
                    </p>
                    <p className="text-secondary/30 text-[9px] uppercase tracking-wider font-semibold mt-1">
                      {entry.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-5">
              <ShieldCheck size={64} className="text-white" />
            </div>

            <p className="text-white text-sm font-bold mb-4">Quick Stats</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-3.5">
                <p className="text-secondary/40 text-[9px] uppercase tracking-wider font-semibold">
                  Admins
                </p>
                <p className="text-red-400 text-2xl font-bold font-jakarta mt-0.5">
                  {String(adminCount).padStart(2, "0")}
                </p>
              </div>
              <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-3.5">
                <p className="text-secondary/40 text-[9px] uppercase tracking-wider font-semibold">
                  Pending
                </p>
                <p className="text-white text-2xl font-bold font-jakarta mt-0.5">
                  {String(pendingCount).padStart(2, "0")}
                </p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-secondary/15 text-secondary hover:text-white hover:border-secondary/30 rounded-lg text-xs transition-colors">
              Manage All Permissions <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>


      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5">

        <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
          <Mail size={22} className="text-red-400" />
        </div>


        <div className="flex-1">
          <p className="text-white text-sm font-semibold mb-1">
            Grow your impact.
          </p>
          <p className="text-secondary/60 text-xs leading-relaxed">
            Adding team members allows you to delegate ticket management,
            volunteer coordination, and organization analytics effortlessly.
          </p>
        </div>


        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm transition-colors">
            <Download size={14} /> Download Log
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
            Invite Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
