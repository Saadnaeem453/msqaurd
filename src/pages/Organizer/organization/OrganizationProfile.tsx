import {
  Globe,
  AtSign,
  Linkedin,
  MapPin,
  CalendarDays,
  Users,
  ShieldCheck,
  ArrowRight,
  Clock,
  ChevronRight,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { organizerApi, OrganizationData } from "../../../services/organizer.service";
import { eventApi, Event } from "../../../services/event.service";
import { Link } from "react-router-dom";
import { useOrganization } from "../../../contexts/OrganizationContext";

const FOCUS_OPTIONS = ["Education", "Community", "Youth", "Faith", "Arts & Culture", "Professional Development", "Sports", "Charity", "Family", "Entrepreneurship"];
const LEGAL_OPTIONS = ["Registered Charity", "Nonprofit Organization", "Community Interest Company", "Private Organization", "Unregistered Community Group"];
const SOCIAL_DOMAINS = { instagram: "instagram.com", facebook: "facebook.com", twitter: "x.com", threads: "threads.com", linkedin: "linkedin.com" } as const;
const URL_RULES = {
  handle: /^[a-zA-Z0-9._-]{1,50}(?:\/[a-zA-Z0-9._-]{1,50})*$/,
};
const socialPath = (value?: string) => value?.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
const isValidHttpsUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
};
const utcDateString = (date: Date) => date.toISOString().slice(0, 10);
const latestPastDate = () => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return utcDateString(date);
};
const isPastDateOnly = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && utcDateString(parsed) === value && value < utcDateString(new Date());
};


const OrganizationProfile = () => {
  const { role: organizationRole } = useOrganization();
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<OrganizationData | null>(null);
  const [members, setMembers] = useState<Array<{ id: string; name?: string; email: string; role: string; is_active: boolean }>>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [focusOpen, setFocusOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const clearFieldError = (field: string) => {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setSaveNotice(null);
  };

  useEffect(() => { (async () => { const list = await organizerApi.getOrganizations(); if (!list.ok || !list.data?.[0]) { setLoadError("We couldn't load your organization. Please refresh and try again."); setLoading(false); return; } const orgId = list.data[0].id; const [result, memberResult, eventResult] = await Promise.all([organizerApi.getOrganization(orgId), organizerApi.getMembers(orgId), eventApi.list({ page: 1, limit: 100 })]); if (result.ok && result.data) { setOrganization(result.data); setDraft(result.data); } else setLoadError("We couldn't load your organization. Please refresh and try again."); if (memberResult.ok) { const rows = Array.isArray(memberResult.data) ? memberResult.data : memberResult.data?.members || []; setMembers(rows.map((m) => ({ id: m.user_id || m.user?.id || m.id, name: m.user?.full_name || m.full_name || m.name || m.user?.email || m.email, email: m.user?.email || m.email, role: m.role, is_active: m.is_active }))); } if (eventResult.ok && eventResult.data) setEvents(eventResult.data.events.filter((event) => event.organization_id === orgId)); setLoading(false); })(); }, []);

  useEffect(() => {
    const logoUrl = logoFile ? URL.createObjectURL(logoFile) : null;
    const bannerUrl = bannerFile ? URL.createObjectURL(bannerFile) : null;
    setLogoPreview(logoUrl);
    setBannerPreview(bannerUrl);
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      if (bannerUrl) URL.revokeObjectURL(bannerUrl);
    };
  }, [logoFile, bannerFile]);

  const selectImage = (kind: "logo" | "banner", file?: File) => {
    setUploadErrors((current) => ({ ...current, [kind]: "" }));
    if (!file) {
      if (kind === "logo") setLogoFile(null);
      else setBannerFile(null);
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setUploadErrors((current) => ({ ...current, [kind]: "Choose a PNG, JPG, or WebP image." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((current) => ({ ...current, [kind]: "Choose an image smaller than 5 MB." }));
      return;
    }
    if (kind === "logo") setLogoFile(file);
    else setBannerFile(file);
  };

  const saveOrganization = async () => {
    if (!organization || !draft) return;
    const nextErrors: Record<string, string> = {};
    if (!draft.name.trim()) nextErrors.name = "Add an organization name.";
    if (!draft.description?.trim()) nextErrors.description = "Add a short bio.";
    if (draft.website && !isValidHttpsUrl(draft.website)) nextErrors.website = "Use a valid HTTPS address, for example https://example.org.";
    if (draft.established_date && !isPastDateOnly(draft.established_date)) nextErrors.established_date = "Choose a valid date in the past.";
    if ((draft.focus_areas || []).length > 10) nextErrors.focus_areas = "Choose up to 10 focus areas.";
    const links = draft.social_links || {};
    const socialValues = ["instagram", "facebook", "twitter", "threads", "linkedin"] as const;
    socialValues.forEach((network) => { if (links[network] && !URL_RULES.handle.test(links[network]!.replace(/^https?:\/\/[^/]+\//, ""))) nextErrors[network] = "Enter only the username or profile path."; });
    if (Object.keys(nextErrors).length || Object.values(uploadErrors).some(Boolean)) { setFieldErrors(nextErrors); setSaveNotice("Please review the highlighted fields."); return; }
    const payload = new FormData();
    payload.append("name", draft.name.trim()); payload.append("description", draft.description?.trim() || "");
    if (draft.website) payload.append("website", draft.website); if (draft.established_date) payload.append("established_date", draft.established_date); if (draft.legal_status) payload.append("legal_status", draft.legal_status); if (draft.logo_url === "") payload.append("logo_url", ""); if (draft.banner_url === "") payload.append("banner_url", ""); payload.append("focus_areas", JSON.stringify(draft.focus_areas || []));
    const normalizedLinks = Object.fromEntries(socialValues.filter((network) => links[network]).map((network) => [network, `https://${SOCIAL_DOMAINS[network]}/${links[network]!.replace(/^https?:\/\/[^/]+\//, "")}`]));
    payload.append("social_links", JSON.stringify(normalizedLinks)); if (logoFile) payload.append("logo", logoFile); if (bannerFile) payload.append("banner", bannerFile);
    setSaving(true); const result = await organizerApi.updateOrganization(organization.id, payload); setSaving(false); if (result.ok && result.data) { setOrganization(result.data); setDraft(result.data); setEditing(false); setSaveNotice(null); setFieldErrors({}); setLogoFile(null); setBannerFile(null); setUploadErrors({}); } else {
      const messages: Record<string, string> = { established_date: "Choose a valid date in the past.", website: "Enter a valid HTTPS website address.", focus_areas: "Choose up to 10 focus areas.", social_links: "Check the social media details and try again.", name: "Add a valid organization name.", description: "Add a short organization bio." };
      const apiErrors = result.errors || [];
      const mapped = Object.fromEntries(apiErrors.flatMap((item) => messages[item.field] ? [[item.field, messages[item.field]]] : []));
      setFieldErrors(mapped); setSaveNotice(Object.keys(mapped).length ? "Please review the highlighted fields." : "We couldn't save your changes. Please try again.");
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-12 text-secondary">Loading organization...</div>;
  if (loadError) return <div role="alert" className="max-w-7xl mx-auto px-6 py-12 text-sm text-secondary">{loadError}</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">

      <div className="relative">

        <div className="h-32 rounded-t-xl bg-cover bg-center bg-gradient-to-r from-red-900/30 via-[#131418] to-[#131418]" style={organization?.banner_url ? { backgroundImage: `url(${organization.banner_url})` } : undefined} />


        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 px-6 -mt-10 relative z-10">

          <div className="w-20 h-20 rounded-xl bg-[#1a1c22] border border-secondary/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {organization?.logo_url ? <img src={organization.logo_url} alt="Organization logo" className="h-full w-full object-cover" /> : <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-6h6v6" />
            </svg></>}
          </div>


          <div className="flex-1">
            <h1 className="font-jakarta text-3xl font-bold text-white">
              {organization?.name || "Organization"}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-2.5 py-0.5 bg-secondary/10 border border-secondary/15 rounded text-[10px] text-secondary font-medium uppercase tracking-wider">
                {(organization?.type || "Organization").replaceAll("_", " ")}
              </span>
              <span className="flex items-center gap-1 text-secondary/60 text-xs">
                <MapPin size={12} /> London, United Kingdom
              </span>
            </div>
          </div>


          <div className="flex items-center gap-2">
            {(organizationRole === "owner" || organizationRole === "admin") && <button onClick={() => { if (editing) { setLogoFile(null); setBannerFile(null); setUploadErrors({}); setFocusOpen(false); setLegalOpen(false); } setDraft(organization); setFieldErrors({}); setSaveNotice(null); setEditing((value) => !value); }} className="flex items-center gap-2 px-5 py-2 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm font-medium transition-colors">
              <Pencil size={14} />
              {editing ? "Cancel" : "Edit Profile"}
            </button>}
            <button className="px-5 py-2 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm font-medium transition-colors">
              Follow
            </button>
            <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
              Contact Society
            </button>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {editing && draft && <div className="lg:col-span-3 rounded-xl border border-red-500/20 bg-[#131418] p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-xs text-secondary">Organization name<input value={draft.name} onChange={(e) => { setDraft({ ...draft, name: e.target.value }); clearFieldError("name"); }} className="mt-1 w-full rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-2 text-sm text-white" />{fieldErrors.name && <small className="text-rose-300/80">{fieldErrors.name}</small>}</label>
            <label className="text-xs text-secondary">Bio<textarea value={draft.description || ""} onChange={(e) => { setDraft({ ...draft, description: e.target.value }); clearFieldError("description"); }} className="mt-1 w-full rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-2 text-sm text-white" rows={2} />{fieldErrors.description && <small className="text-rose-300/80">{fieldErrors.description}</small>}</label>
            <label className="text-xs text-secondary">Banner image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => selectImage("banner", e.target.files?.[0])} className="mt-1 block w-full rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-2 text-sm text-secondary file:mr-3 file:rounded file:border-0 file:bg-red-600 file:px-3 file:py-1 file:text-white" />{(bannerPreview || draft.banner_url) && <img src={bannerPreview || draft.banner_url} alt="Banner preview" className="mt-2 h-16 w-full rounded-lg object-cover" />}{uploadErrors.banner && <small className="mt-1 block text-rose-300/80">{uploadErrors.banner}</small>}{draft.banner_url && <button type="button" onClick={() => { setDraft({ ...draft, banner_url: "" }); setBannerFile(null); }} className="mt-1 text-xs text-red-400">Remove current banner</button>}</label>
            <label className="text-xs text-secondary">Logo image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => selectImage("logo", e.target.files?.[0])} className="mt-1 block w-full rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-2 text-sm text-secondary file:mr-3 file:rounded file:border-0 file:bg-red-600 file:px-3 file:py-1 file:text-white" />{(logoPreview || draft.logo_url) && <img src={logoPreview || draft.logo_url} alt="Logo preview" className="mt-2 h-16 w-16 rounded-lg object-cover" />}{uploadErrors.logo && <small className="mt-1 block text-rose-300/80">{uploadErrors.logo}</small>}{draft.logo_url && <button type="button" onClick={() => { setDraft({ ...draft, logo_url: "" }); setLogoFile(null); }} className="mt-1 text-xs text-red-400">Remove current logo</button>}</label>
            <label className="text-xs text-secondary">Website (HTTPS)<input value={draft.website || ""} onChange={(e) => { setDraft({ ...draft, website: e.target.value }); clearFieldError("website"); }} placeholder="https://example.org" className="mt-1 w-full rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-2 text-sm text-white" />{fieldErrors.website && <small className="text-rose-300/80">{fieldErrors.website}</small>}</label>
            <label className="text-xs text-secondary">Established date<input type="date" max={latestPastDate()} value={draft.established_date || ""} onChange={(e) => { setDraft({ ...draft, established_date: e.target.value }); clearFieldError("established_date"); }} className="mt-1 w-full rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-2 text-sm text-white" />{fieldErrors.established_date && <small className="text-rose-300/80">{fieldErrors.established_date}</small>}</label>
            <div className="relative text-xs text-secondary">
              <span>Legal status</span>
              <button type="button" aria-expanded={legalOpen} onClick={() => { setLegalOpen(!legalOpen); setFocusOpen(false); }} className="mt-1 flex w-full items-center justify-between rounded-lg border border-secondary/15 bg-[#1a1c22] px-3 py-2 text-left text-sm text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                {draft.legal_status || "Select legal status"}<ChevronRight size={14} className="rotate-90" />
              </button>
              {legalOpen && <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-secondary/20 bg-[#1a1c22] p-1 shadow-xl" style={{ scrollbarColor: "#555b65 #1a1c22", scrollbarWidth: "thin" }}>
                {LEGAL_OPTIONS.map((option) => <button type="button" key={option} onClick={() => { setDraft({ ...draft, legal_status: option }); setLegalOpen(false); }} className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary/10 ${draft.legal_status === option ? "bg-secondary/10 text-white" : "text-secondary"}`}>{option}</button>)}
              </div>}
            </div>
            <div className="relative text-xs text-secondary">
              <span>Focus areas (select up to 10)</span>
              <button type="button" aria-expanded={focusOpen} onClick={() => { setFocusOpen(!focusOpen); setLegalOpen(false); }} className="mt-1 flex w-full items-center justify-between rounded-lg border border-secondary/15 bg-[#1a1c22] px-3 py-2 text-left text-sm text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                <span className="truncate">{draft.focus_areas?.length ? draft.focus_areas.join(", ") : "Select focus areas"}</span><ChevronRight size={14} className="shrink-0 rotate-90" />
              </button>
              {focusOpen && <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-secondary/20 bg-[#1a1c22] p-1 shadow-xl" style={{ scrollbarColor: "#555b65 #1a1c22", scrollbarWidth: "thin" }}>
                {FOCUS_OPTIONS.map((option) => <label key={option} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-secondary hover:bg-secondary/10 hover:text-white">
                  <input type="checkbox" checked={draft.focus_areas?.includes(option) || false} onChange={(e) => setDraft({ ...draft, focus_areas: e.target.checked ? [...(draft.focus_areas || []), option] : (draft.focus_areas || []).filter((area) => area !== option) })} className="accent-red-600" />{option}
                </label>)}
              </div>}
              {fieldErrors.focus_areas && <small className="text-rose-300/80">{fieldErrors.focus_areas}</small>}
            </div>
            {(["instagram", "facebook", "twitter", "threads", "linkedin"] as const).map((network) => { const prefix = network === "twitter" ? "x.com/" : `${network}.com/`; return <label key={network} className="text-xs capitalize text-secondary">{network}<span className="mt-1 flex overflow-hidden rounded-lg border border-secondary/15 bg-secondary/5"><span className="shrink-0 bg-secondary/10 px-2 py-2 text-secondary/70">{prefix}</span><input value={(draft.social_links?.[network] || "").replace(/^https?:\/\/[^/]+\//, "")} onChange={(e) => { setDraft({ ...draft, social_links: { ...(draft.social_links || {}), [network]: e.target.value } }); clearFieldError(network); clearFieldError("social_links"); }} placeholder="username or path" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none" /></span>{(fieldErrors[network] || fieldErrors.social_links) && <small className="text-rose-300/80">{fieldErrors[network] || fieldErrors.social_links}</small>}</label>; })}
          </div>
          {saveNotice && <p role="status" className="rounded-lg border border-secondary/10 bg-secondary/5 px-3 py-2 text-sm text-secondary">{saveNotice}</p>}
          <button onClick={saveOrganization} disabled={saving} className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
        </div>}

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h2 className="font-jakarta text-lg font-bold text-white">
                About the Organization
              </h2>
            </div>

            <p className="text-secondary/70 text-sm leading-relaxed mb-5">
              {organization?.description || "Build meaningful experiences and bring your community together through MSQUARED events."}
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoCard
                label="Focus Areas"
                value={(organization?.focus_areas || []).join(", ") || "Not set"}
              />
              <InfoCard
                label="Established"
                value={organization?.established_date ? new Date(organization.established_date).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Not set"}
              />
              <InfoCard
                label="Legal Status"
                value={organization?.legal_status || "Not set"}
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard icon={CalendarDays} value={events.filter((event) => event.status === "completed").length} label="Events hosted" />
            <StatCard icon={Users} value={members.filter((member) => member.is_active).length} label="Active team members" />
            <StatCard icon={ShieldCheck} value={members.filter((member) => member.role === "admin").length} label="Admins" />
            <StatCard icon={Users} value={members.filter((member) => member.role === "moderator").length} label="Moderators" />
          </div>
        </div>


        <div className="space-y-5">

          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
            <p className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-bold mb-4">
              Connect With Us
            </p>
            <div className="space-y-2.5">
              <ConnectLink icon={Globe} label={organization?.website || "Official Website"} href={organization?.website} />
              <ConnectLink icon={AtSign} label={organization?.social_links?.twitter ? `@${socialPath(organization.social_links.twitter)}` : "Twitter username"} href={organization?.social_links?.twitter ? `https://${SOCIAL_DOMAINS.twitter}/${socialPath(organization.social_links.twitter)}` : undefined} />
              <ConnectLink icon={Linkedin} label={organization?.social_links?.linkedin ? `LinkedIn / ${socialPath(organization.social_links.linkedin)}` : "LinkedIn Profile"} href={organization?.social_links?.linkedin ? `https://${SOCIAL_DOMAINS.linkedin}/${socialPath(organization.social_links.linkedin)}` : undefined} />
            </div>
          </div>


          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-bold">
                Active team members
              </p>
              <Link to="/organizer/organization/team" className="text-primary text-[10px] font-medium flex items-center gap-0.5 hover:text-primary/80 transition-colors">
                View All <ChevronRight size={10} />
              </Link>
            </div>

            <div className="space-y-3">
              {members.filter((member) => member.is_active).map((member) => {
                const org = { name: member.name || member.email, role: member.role, initials: (member.name || member.email).slice(0, 2).toUpperCase(), color: "bg-secondary/10 text-secondary", online: true };
                return (
                <div key={org.name} className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold ${org.color}`}
                    >
                      {org.initials}
                    </div>
                    {org.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#131418]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{org.name}</p>
                    <p className="text-secondary/50 text-[10px] truncate">{org.role}</p>
                  </div>
                </div>
              ); })}
            </div>

            <Link to="/organizer/organization/team" className="block w-full mt-4 py-2 text-center border border-secondary/15 text-secondary/60 hover:text-white hover:border-secondary/30 rounded-lg text-xs transition-colors">
              Manage Team
            </Link>
          </div>


        </div>
      </div>


      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-jakarta text-xl font-bold text-white">
            Organization Events
          </h2>
          {(organizationRole === "owner" || organizationRole === "admin") && <Link to="/organizer/events/create" className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">Create event</Link>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group"
            >

              <div className="relative h-36 bg-cover bg-center bg-gradient-to-br from-secondary/10 to-[#0d0e12]" style={event.hero_image ? { backgroundImage: `url(${event.hero_image})` } : undefined}>
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white ${event.status === "published" ? "bg-green-600" : "bg-secondary/70"}`}
                >
                  {event.status}
                </span>
              </div>


              <div className="p-4">
                <div className="flex items-center gap-1.5 text-secondary/50 text-[10px] mb-2">
                  <Clock size={10} />
                  {new Date(`${event.event_date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <h3 className="text-white font-bold text-base mb-2 leading-tight">
                  {event.title}
                </h3>
                <p className="text-secondary/50 text-xs leading-relaxed line-clamp-2 mb-4">
                  {event.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-secondary/40 text-[10px] flex items-center gap-1">
                    <Users size={10} /> {event.category}
                  </span>
                  <Link to={`/organizer/events/${event.id}`} className="flex items-center gap-1 text-primary text-xs font-medium hover:text-primary/80 transition-colors">
                    View Details <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}


          {events.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-secondary/15 px-6 py-12 text-center"><p className="text-sm text-secondary">No organization events yet.</p><p className="mt-1 text-xs text-secondary/50">Events created for this organization will appear here.</p></div>}
        </div>
      </div>
    </div>
  );
};


const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary/5 rounded-lg p-3.5 border border-secondary/5">
    <p className="text-secondary/40 text-[9px] uppercase tracking-wider font-semibold mb-1">
      {label}
    </p>
    <p className="text-white text-xs font-medium">{value}</p>
  </div>
);

const StatCard = ({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) => (
  <div className="rounded-xl border border-secondary/10 bg-[#131418] p-5"><Icon size={17} className="mb-3 text-red-400" /><p className="font-jakarta text-3xl font-bold text-white">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-secondary/50">{label}</p></div>
);


const ConnectLink = ({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
}) => (
  <a href={href} target={href ? "_blank" : undefined} rel={href ? "noreferrer" : undefined} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/5 transition-colors text-left">
    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-secondary" />
    </div>
    <span className="text-secondary text-sm">{label}</span>
  </a>
);

export default OrganizationProfile;
