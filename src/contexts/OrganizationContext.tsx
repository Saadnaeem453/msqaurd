import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { organizerApi, OrganizationData, OrganizationMemberRole } from "../services/organizer.service";

interface OrganizationContextValue {
  organizations: OrganizationData[];
  organization: OrganizationData | null;
  role: OrganizationMemberRole | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await organizerApi.getOrganizations();
    if (result.ok && result.data) {
      setOrganizations(result.data);
      setError(null);
    } else {
      setOrganizations([]);
      setError("We couldn't load your organization access. Please refresh and try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, []);

  const value = useMemo(() => ({
    organizations,
    organization: organizations[0] || null,
    role: organizations[0]?.access_role || null,
    loading,
    error,
    refresh,
  }), [organizations, loading, error, refresh]);

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error("useOrganization must be used inside OrganizationProvider");
  return context;
};

export const OrganizationMemberBoundary = ({ children }: { children: ReactNode }) => {
  const { role, loading } = useOrganization();
  const location = useLocation();
  const personalOrganizer = typeof window !== "undefined" && localStorage.getItem("accountType") === "organizer" && !role;
  if (personalOrganizer || role === "owner") return <>{children}</>;
  if (loading) return <div className="p-8 text-sm text-secondary">Loading organization access...</div>;

  const path = location.pathname;
  const isOrganizationPage = path === "/organizer/organization/profile" || path === "/organizer/organization/team";
  const isEventPage = path.startsWith("/organizer/events");
  const isCreateEvent = path === "/organizer/events/create";
  const isCheckInPage = path.startsWith("/organizer/checkin/");
  const allowed = (path === "/organizer/organization/profile")
    || (role === "admin" && (isEventPage || path === "/organizer/organization/team"))
    || (role === "moderator" && isEventPage && !isCreateEvent)
    || (role === "moderator" && isCheckInPage);

  if (!allowed) return <Navigate to="/organizer/organization/profile" replace />;
  return <>{children}</>;
};
