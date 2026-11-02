import { useCallback, useEffect, useState } from "react";
import { Clock, Mail, MoreVertical, ShieldCheck, UserPlus, X } from "lucide-react";
import { useOrganization } from "../../../contexts/OrganizationContext";
import { OrganizationInvitation, OrganizationMemberRole, organizerApi } from "../../../services/organizer.service";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: Exclude<OrganizationMemberRole, "owner">;
  is_active: boolean;
};

type Confirmation = { title: string; description: string; confirmText: string; action: () => Promise<void> } | null;

const actionError = (status?: number) => {
  if (status === 403) return "You don't have permission to make that team change.";
  if (status === 404) return "That team item is no longer available. Refresh the list and try again.";
  if (status === 409) return "This email already has an active membership or pending invitation.";
  if (status === 422) return "Check the email and role, then try again.";
  if (status === 502) return "The invitation email could not be delivered. You can retry from Pending invitations.";
  return "We couldn't complete that action. Please try again.";
};

const TeamPage = () => {
  const { organization, role, loading: organizationLoading } = useOrganization();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "moderator">("moderator");
  const [inviteError, setInviteError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const canManageTeam = role === "owner" || role === "admin";
  const canInviteAdmin = role === "owner";

  const loadTeam = useCallback(async () => {
    if (!organization?.id) return;
    setLoading(true);
    const [memberResult, invitationResult] = await Promise.all([
      organizerApi.getMembers(organization.id),
      organizerApi.getInvitations(organization.id),
    ]);
    if (!memberResult.ok) setError(actionError(memberResult.status));
    else {
      const rows = Array.isArray(memberResult.data) ? memberResult.data : memberResult.data?.members || [];
      setMembers(rows.map((member) => ({
        id: member.user_id || member.id,
        name: member.user?.full_name || member.full_name || member.name || member.user?.email || member.email,
        email: member.user?.email || member.email,
        avatar: member.user?.avatar_url || member.avatar_url,
        role: member.role === "admin" ? "admin" : "moderator",
        is_active: member.is_active,
      })));
      setError(null);
    }
    if (invitationResult.ok) setInvitations(invitationResult.data || []);
    else if (invitationResult.status !== 403) setNotice("Pending invitations could not be loaded. You can still manage team members.");
    setLoading(false);
  }, [organization?.id]);

  useEffect(() => { if (!organizationLoading && organization?.id) void loadTeam(); else if (!organizationLoading) setLoading(false); }, [organizationLoading, organization?.id, loadTeam]);

  const sendInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setInviteError(""); setNotice(null);
    if (!organization?.id || !inviteEmail.trim()) { setInviteError("Enter the member's email address."); return; }
    setBusy(true);
    const result = await organizerApi.inviteMember(organization.id, { email: inviteEmail.trim(), role: inviteRole });
    setBusy(false);
    if (!result.ok) { setInviteError(actionError(result.status)); return; }
    setInviteEmail(""); setNotice("Invitation sent. It expires in 48 hours."); await loadTeam();
  };

  const updateMember = async (member: TeamMember, changes: { role?: "admin" | "moderator"; is_active?: boolean }) => {
    if (!organization?.id) return;
    setBusy(true);
    const result = await organizerApi.updateMember(organization.id, member.id, changes);
    setBusy(false); setOpenMenu(null); setConfirmation(null);
    if (!result.ok) { setNotice(actionError(result.status)); return; }
    setNotice("Team member updated."); await loadTeam();
  };

  const removeMember = async (member: TeamMember) => {
    if (!organization?.id) return;
    setBusy(true);
    const result = await organizerApi.removeMember(organization.id, member.id);
    setBusy(false); setOpenMenu(null); setConfirmation(null);
    if (!result.ok) { setNotice(actionError(result.status)); return; }
    setNotice("Team member removed."); await loadTeam();
  };

  const resend = async (invitation: OrganizationInvitation) => {
    if (!organization?.id) return;
    setBusy(true); const result = await organizerApi.resendInvitation(organization.id, invitation.id); setBusy(false);
    if (!result.ok) { setNotice(actionError(result.status)); return; }
    setNotice("Invitation resent."); await loadTeam();
  };

  const cancelInvitation = async (invitation: OrganizationInvitation) => {
    if (!organization?.id) return;
    setBusy(true); const result = await organizerApi.cancelInvitation(organization.id, invitation.id); setBusy(false); setConfirmation(null);
    if (!result.ok) { setNotice(actionError(result.status)); return; }
    setNotice("Invitation cancelled."); await loadTeam();
  };

  const adminCount = members.filter((member) => member.role === "admin").length;
  const moderatorCount = members.filter((member) => member.role === "moderator").length;
  const activeCount = members.filter((member) => member.is_active).length;

  if (organizationLoading || loading) return <div className="mx-auto max-w-[1500px] px-4 py-12 text-center text-sm text-secondary">Loading your organization team...</div>;
  if (!organization) return <div role="alert" className="mx-auto max-w-[1500px] px-4 py-12 text-center text-sm text-secondary">No organization is connected to this account yet.</div>;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 md:px-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-white">Team Management</h1>
          <p className="mt-1.5 text-sm text-secondary">Team and invitations for {organization.name}.</p>
        </div>
        <a href="#invite-member" className={`inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 ${canManageTeam ? "" : "hidden"}`}><UserPlus size={16} /> Invite Member</a>
      </header>

      {(error || notice) && <p role={error ? "alert" : "status"} className="rounded-lg border border-secondary/10 bg-[#131418] px-4 py-3 text-sm text-secondary">{error || notice}</p>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-secondary/10 bg-[#131418] lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary/10 p-5">
            <div><h2 className="text-sm font-bold text-white">Team members</h2><p className="mt-1 text-xs text-secondary/50">{activeCount} active of {members.length}</p></div>
            <div className="flex gap-4 text-[10px] uppercase tracking-wider text-secondary/50"><span>Admins <b className="ml-1 text-white">{adminCount}</b></span><span>Moderators <b className="ml-1 text-white">{moderatorCount}</b></span></div>
          </div>
          <div className="hidden grid-cols-12 gap-3 border-b border-secondary/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-secondary/40 sm:grid">
            <span className="col-span-5">Member</span><span className="col-span-3">Role</span><span className="col-span-2">Status</span><span className="col-span-2">Actions</span>
          </div>
          {error ? null : members.length === 0 ? <div className="px-5 py-12 text-center"><p className="text-sm text-secondary">No team members yet.</p><p className="mt-1 text-xs text-secondary/50">Invite an admin or moderator to collaborate.</p></div> : <div className="divide-y divide-secondary/5">
            {members.map((member) => {
              const canManageMember = role === "owner" || (role === "admin" && member.role === "moderator");
              return <div key={member.id} className="grid grid-cols-1 items-center gap-3 px-5 py-4 sm:grid-cols-12 sm:gap-3">
                <div className="flex min-w-0 items-center gap-3 sm:col-span-5">
                  {member.avatar ? <img src={member.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">{member.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div>}
                  <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{member.name}</p><p className="truncate text-xs text-secondary/50">{member.email}</p></div>
                </div>
                <div className="flex items-center justify-between sm:col-span-3 sm:block"><span className="mr-2 text-[10px] uppercase text-secondary/40 sm:hidden">Role</span><span className={`inline-flex rounded border px-2.5 py-1 text-xs font-semibold capitalize ${member.role === "admin" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-secondary/15 bg-secondary/10 text-secondary"}`}>{member.role}</span></div>
                <div className="flex items-center justify-between sm:col-span-2 sm:block"><span className="mr-2 text-[10px] uppercase text-secondary/40 sm:hidden">Status</span><span className={`inline-flex items-center gap-1.5 text-xs ${member.is_active ? "text-white" : "text-secondary/50"}`}><i className={`h-1.5 w-1.5 rounded-full ${member.is_active ? "bg-green-400" : "bg-secondary/40"}`} />{member.is_active ? "Active" : "Inactive"}</span></div>
                <div className="relative flex justify-end sm:col-span-2 sm:justify-start">
                  {canManageMember && <button type="button" aria-label={`Manage ${member.name}`} aria-expanded={openMenu === member.id} onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)} className="rounded p-2 text-secondary/60 hover:bg-secondary/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"><MoreVertical size={16} /></button>}
                  {openMenu === member.id && <div className="absolute right-0 top-10 z-30 w-44 rounded-lg border border-secondary/20 bg-[#1a1c22] py-1 shadow-xl sm:left-0 sm:right-auto">
                    {role === "owner" && <button type="button" onClick={() => updateMember(member, { role: member.role === "admin" ? "moderator" : "admin" })} disabled={busy} className="block w-full px-3 py-2 text-left text-sm text-secondary hover:bg-secondary/10 hover:text-white">Change role to {member.role === "admin" ? "moderator" : "admin"}</button>}
                    <button type="button" onClick={() => member.is_active ? setConfirmation({ title: "Deactivate team member?", description: `${member.name} will lose access to this organization's team and event tools.`, confirmText: "Deactivate", action: () => updateMember(member, { is_active: false }) }) : updateMember(member, { is_active: true })} disabled={busy} className="block w-full px-3 py-2 text-left text-sm text-secondary hover:bg-secondary/10 hover:text-white">{member.is_active ? "Deactivate" : "Activate"}</button>
                    <button type="button" onClick={() => setConfirmation({ title: "Remove team member?", description: `${member.name} will be removed from ${organization.name}.`, confirmText: "Remove member", action: () => removeMember(member) })} disabled={busy} className="block w-full px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/10">Remove member</button>
                  </div>}
                </div>
              </div>;
            })}
          </div>}
        </section>

        <aside className="space-y-5">
          {canManageTeam && <form id="invite-member" onSubmit={sendInvite} className="space-y-4 rounded-xl border border-secondary/10 bg-[#131418] p-5">
            <div className="flex items-center gap-2"><Mail size={15} className="text-red-400" /><h2 className="text-sm font-bold text-white">Invite a member</h2></div>
            <label className="block text-xs text-secondary">Email address<input type="email" value={inviteEmail} onChange={(event) => { setInviteEmail(event.target.value); setInviteError(""); }} required autoComplete="email" placeholder="member@example.com" className="mt-1.5 w-full rounded-lg border border-secondary/15 bg-[#0d0e12] px-3 py-2.5 text-sm text-white outline-none focus:border-red-500/50" />{inviteError && <span className="mt-1 block text-xs text-rose-300/90">{inviteError}</span>}</label>
            <label className="block text-xs text-secondary">Role<select value={inviteRole} onChange={(event) => setInviteRole(event.target.value as "admin" | "moderator")} className="mt-1.5 w-full rounded-lg border border-secondary/15 bg-[#1a1c22] px-3 py-2.5 text-sm text-secondary outline-none focus:border-red-500/50"><option value="moderator" className="bg-[#1a1c22] text-secondary">Moderator</option>{canInviteAdmin && <option value="admin" className="bg-[#1a1c22] text-secondary">Admin</option>}</select></label>
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"><UserPlus size={15} />{busy ? "Sending..." : "Send invitation"}</button>
            <p className="text-[11px] leading-relaxed text-secondary/50">Invitations expire after 48 hours and can be resent.</p>
          </form>}

          {canManageTeam && <section className="rounded-xl border border-secondary/10 bg-[#131418] p-5">
            <div className="mb-4 flex items-center gap-2"><Clock size={14} className="text-secondary/60" /><h2 className="text-sm font-bold text-white">Pending invitations</h2><span className="ml-auto text-xs text-secondary/50">{invitations.length}</span></div>
            {invitations.length === 0 ? <p className="py-4 text-center text-xs text-secondary/50">No pending invitations.</p> : <div className="space-y-3">
              {invitations.map((invitation) => <div key={invitation.id} className="rounded-lg border border-secondary/10 bg-secondary/[0.03] p-3">
                <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm text-white">{invitation.email}</p><p className="mt-1 text-xs capitalize text-secondary/60">{invitation.role}</p></div><span className="shrink-0 rounded bg-secondary/10 px-2 py-1 text-[10px] text-secondary">Pending</span></div>
                <p className="mt-2 text-[10px] text-secondary/40">Expires {new Date(invitation.expires_at).toLocaleString()}</p>
                <div className="mt-3 flex gap-2"><button type="button" onClick={() => void resend(invitation)} disabled={busy || (invitation.role === "admin" && !canInviteAdmin)} className="flex-1 rounded border border-secondary/15 px-2 py-1.5 text-xs text-secondary hover:text-white disabled:opacity-40">Resend</button><button type="button" onClick={() => setConfirmation({ title: "Cancel invitation?", description: `The invitation to ${invitation.email} will no longer work.`, confirmText: "Cancel invitation", action: () => cancelInvitation(invitation) })} disabled={busy || (invitation.role === "admin" && !canInviteAdmin)} className="flex-1 rounded border border-rose-500/20 px-2 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-40">Cancel</button></div>
              </div>)}
            </div>}
          </section>}

          <div className="relative overflow-hidden rounded-xl border border-secondary/10 bg-[#131418] p-5"><ShieldCheck size={54} className="absolute right-3 top-3 text-white opacity-[0.04]" /><p className="relative text-sm font-bold text-white">Organization access</p><p className="relative mt-2 text-xs leading-relaxed text-secondary/60">You are viewing {organization.name} as <span className="font-semibold capitalize text-secondary">{role || "member"}</span>.</p></div>
        </aside>
      </div>

      <div className="rounded-xl border border-secondary/10 bg-[#131418] p-5"><div className="flex items-start gap-3"><Mail size={19} className="mt-0.5 text-red-400" /><div><p className="text-sm font-semibold text-white">Grow your impact</p><p className="mt-1 text-xs leading-relaxed text-secondary/60">Invite team members to collaborate on events and community operations.</p></div></div></div>

      {confirmation && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmation(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="confirmation-title" className="w-full max-w-md rounded-xl border border-secondary/15 bg-[#17191e] p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-3"><div><h2 id="confirmation-title" className="font-jakarta text-lg font-bold text-white">{confirmation.title}</h2><p className="mt-2 text-sm leading-relaxed text-secondary/70">{confirmation.description}</p></div><button type="button" onClick={() => setConfirmation(null)} aria-label="Close dialog" className="rounded p-1 text-secondary hover:text-white"><X size={18} /></button></div>
          <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setConfirmation(null)} className="rounded-lg border border-secondary/15 px-4 py-2 text-sm text-secondary hover:text-white">Keep</button><button type="button" disabled={busy} onClick={() => void confirmation.action()} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{confirmation.confirmText}</button></div>
        </section>
      </div>}
    </div>
  );
};

export default TeamPage;
