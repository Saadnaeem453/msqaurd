import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { IconType } from "react-icons";
import {
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMonitor,
  FiShield,
  FiSmartphone,
  FiTrash2,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { authApi, clearLocalAuthState, type AuthSession } from "../../../services/auth_service";
import { toast } from "sonner";

/* ============================= Types ============================= */

type ConfirmState =
  | { kind: "revoke"; sessionIds: string[]; count: number; current: boolean }
  | { kind: "delete" }
  | null;

const complianceChips = ["SOC2 Compliant", "GDPR Ready"];

const getSessionIcon = (deviceType: string): IconType => {
  const type = deviceType.toLowerCase();
  if (type.includes("mobile") || type.includes("tablet")) return FiSmartphone;
  if (type.includes("desktop") || type.includes("laptop")) return MdLaptop;
  return FiMonitor;
};

const formatSessionDate = (value: string | null | undefined) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
};

type PasswordField = "current_password" | "new_password" | "confirm_password";
type PasswordForm = Record<PasswordField, string>;

const emptyPasswordForm: PasswordForm = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

/* ============================= Page ============================= */

const SecurityPrivacyPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [sessionActionMessage, setSessionActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [isRevokingSession, setIsRevokingSession] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(emptyPasswordForm);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<PasswordField, boolean>>({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<PasswordField, string>>>({});
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const refreshSessions = useCallback(async (showLoading = true): Promise<AuthSession[] | null> => {
    if (showLoading) setSessionsLoading(true);
    setSessionsError("");
    const result = await authApi.getSessions();
    if (result.ok && result.data) {
      setSessions(result.data);
      setSelectedSessionIds((previous) => previous.filter((id) =>
        result.data?.some((session) => session.id === id && session.status.toLowerCase() === "active"),
      ));
      setSessionsLoading(false);
      return result.data;
    }

    if (result.status === 401) {
      clearLocalAuthState();
      navigate("/login", { replace: true });
    } else {
      setSessionsError(result.detail || "Unable to load active sessions. Please try again.");
    }
    setSessionsLoading(false);
    return null;
  }, [navigate]);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  const togglePasswordForm = () => {
    setShowPasswordForm((open) => !open);
    setPasswordForm(emptyPasswordForm);
    setPasswordErrors({});
    setPasswordMessage(null);
  };

  const submitPasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: Partial<Record<PasswordField, string>> = {};
    if (!passwordForm.current_password) errors.current_password = "Enter your current password.";
    if (passwordForm.new_password.length < 6) errors.new_password = "Use at least 6 characters.";
    if (passwordForm.confirm_password !== passwordForm.new_password) {
      errors.confirm_password = "New passwords do not match.";
    }
    setPasswordErrors(errors);
    setPasswordMessage(null);
    if (Object.keys(errors).length) return;

    setIsChangingPassword(true);
    try {
      const result = await authApi.changePassword(passwordForm);
      if (!result.ok) {
        setPasswordMessage({ type: "error", text: result.detail || "Unable to change your password." });
        return;
      }
      if (result.token) localStorage.setItem("token", result.token);
      setSessions((previous) => previous.filter((session) => session.current));
      setPasswordForm(emptyPasswordForm);
      setPasswordMessage({
        type: "success",
        text: result.detail || "Password changed successfully. Other sessions have been signed out.",
      });
    } catch {
      setPasswordMessage({ type: "error", text: "Unable to change your password. Please try again." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const result = await authApi.logout();
    if (result.ok || result.status === 401) {
      clearLocalAuthState();
      navigate("/login", { replace: true });
    } else {
      toast.error(result.detail || "Unable to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  const revokeSessions = async (sessionIds: string[]) => {
    const orderedIds = [...sessionIds].sort((left, right) =>
      Number(Boolean(sessions.find((session) => session.id === left)?.current)) -
      Number(Boolean(sessions.find((session) => session.id === right)?.current)),
    );
    const removedIds: string[] = [];
    const failedIds: string[] = [];
    let currentRevoked = false;

    setIsRevokingSession(true);
    setSessionsError("");
    setSessionActionMessage(null);

    for (const sessionId of orderedIds) {
      const session = sessions.find((item) => item.id === sessionId);
      const result = await authApi.revokeSession(sessionId);
      if (result.ok) {
        removedIds.push(sessionId);
        if (session?.current || result.data?.current) {
          currentRevoked = true;
          break;
        }
      } else if (result.status === 401) {
        clearLocalAuthState();
        navigate("/login", { replace: true });
        setIsRevokingSession(false);
        return;
      } else {
        failedIds.push(sessionId);
      }
    }

    const refreshedSessions = await refreshSessions();
    const refreshFailed = refreshedSessions === null;
    const summary = failedIds.length === 0
      ? `Revoked ${removedIds.length} session${removedIds.length === 1 ? "" : "s"}.`
      : removedIds.length === 0
        ? `Could not revoke ${failedIds.length} selected session${failedIds.length === 1 ? "" : "s"}.`
        : `Revoked ${removedIds.length} session${removedIds.length === 1 ? "" : "s"}; ${failedIds.length} could not be revoked.`;
    const message = refreshFailed && !currentRevoked
      ? `${summary} The session list could not be refreshed.`
      : summary;
    const messageType = failedIds.length || (refreshFailed && !currentRevoked) ? "error" : "success";

    setSessionActionMessage({ type: messageType, text: message });
    if (messageType === "success") toast.success(message);
    else toast.error(message);

    setSelectedSessionIds(failedIds.filter((id) => refreshedSessions?.some((session) => session.id === id)));
    setConfirm(null);
    setIsRevokingSession(false);

    if (currentRevoked) {
      clearLocalAuthState();
      navigate("/login", { replace: true });
    }
  };

  const handleConfirm = async () => {
    const pending = confirm;
    if (pending?.kind === "revoke") {
      await revokeSessions(pending.sessionIds);
    } else if (pending?.kind === "delete") {
      toast.success("Organization deletion initiated.");
      setConfirm(null);
    }
  };

  const visibleSessions = showAllSessions ? sessions : sessions.slice(0, 3);
  const visibleActiveSessionIds = visibleSessions
    .filter((session) => session.status.toLowerCase() === "active")
    .map((session) => session.id);
  const allVisibleSessionsSelected = visibleActiveSessionIds.length > 0 &&
    visibleActiveSessionIds.every((id) => selectedSessionIds.includes(id));

  const toggleVisibleSessionSelection = (checked: boolean) => {
    setSelectedSessionIds((previous) => checked
      ? Array.from(new Set([...previous, ...visibleActiveSessionIds]))
      : previous.filter((id) => !visibleActiveSessionIds.includes(id)),
    );
  };

  return (
    <div className="min-h-full  font-jakarta text-bgray">
      {/* Top bar fragment per pixels — converges into AdminNavbar on integration */}
      <div className="mx-auto w-full max-w-[1600px] px-4 py-4">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10"><FiShield size={12} className="text-primary" /></span>
            <h1 className="text-2xl font-semibold leading-7 tracking-tight text-bgray">Security &amp; Privacy</h1>
          </div>
          <p className="mt-1 max-w-[560px] text-xs leading-[1.5] text-bgray/55">
            Manage your account protection, authentication methods, and data transparency.
            Ensuring your MSQUARED organization data remains impenetrable.
          </p>
        </header>

        {/* Row 1 — password + mfa */}
        <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          <section className="min-h-[148px] rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.1]">
                <FiLock size={13} className="text-secondary" />
              </span>
              <div>
                <h2 className="text-base font-semibold leading-5 text-bgray">Password</h2>
                <p className="mt-0.5 text-[10px] text-bgray/45">Last changed 4 months ago</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-[1.5] text-bgray/60">
              Regularly updating your password helps keep your account secure from
              unauthorized access.
            </p>
            <button
              type="button"
              onClick={togglePasswordForm}
              disabled={isChangingPassword}
              className="mt-2.5 w-full rounded-md bg-primary py-2 text-[11px] font-semibold text-white transition hover:bg-primary/90"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
            {showPasswordForm && (
              <form onSubmit={submitPasswordChange} className="mt-4 space-y-3" noValidate>
                {([
                  ["current_password", "Current Password"],
                  ["new_password", "New Password"],
                  ["confirm_password", "Confirm New Password"],
                ] as const).map(([field, label]) => (
                  <div key={field}>
                    <label htmlFor={field} className="mb-1 block text-xs font-medium text-bgray/75">
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        id={field}
                        name={field}
                        type={visiblePasswords[field] ? "text" : "password"}
                        autoComplete={field === "current_password" ? "current-password" : "new-password"}
                        value={passwordForm[field]}
                        onChange={(event) => {
                          setPasswordForm((form) => ({ ...form, [field]: event.target.value }));
                          setPasswordErrors((previous) => ({ ...previous, [field]: undefined }));
                          setPasswordMessage(null);
                        }}
                        aria-invalid={Boolean(passwordErrors[field])}
                        aria-describedby={passwordErrors[field] ? `${field}-error` : undefined}
                        className="w-full rounded-md border border-white/[0.08] bg-[#191a1c] px-3 py-2 pr-10 text-sm text-bgray outline-none transition placeholder:text-bgray/35 focus:border-secondary/60"
                      />
                      <button
                        type="button"
                        onClick={() => setVisiblePasswords((visible) => ({ ...visible, [field]: !visible[field] }))}
                        aria-label={`${visiblePasswords[field] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-bgray/45 transition hover:text-bgray"
                      >
                        {visiblePasswords[field] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                    {passwordErrors[field] && (
                      <p id={`${field}-error`} className="mt-1 text-xs text-primary" role="alert">
                        {passwordErrors[field]}
                      </p>
                    )}
                    {field === "new_password" && !passwordErrors.new_password && (
                      <p className="mt-1 text-xs text-bgray/40">Use at least 6 characters.</p>
                    )}
                  </div>
                ))}
                {passwordMessage && (
                  <p
                    className={`text-sm ${passwordMessage.type === "success" ? "text-green" : "text-primary"}`}
                    role={passwordMessage.type === "error" ? "alert" : "status"}
                  >
                    {passwordMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                >
                  {isChangingPassword ? "Updating Password…" : "Update Password"}
                </button>
              </form>
            )}
          </section>

          <section className="min-h-[148px] rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.1]">
                <FiSmartphone size={13} className="text-secondary" />
              </span>
              <div>
                <h2 className="text-base font-semibold leading-5 text-bgray">Multi-Factor</h2>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-green">
                  <span className="h-1 w-1 rounded-full bg-green" aria-hidden="true" />
                  Enabled
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-[1.5] text-bgray/60">
              Enhance your security by requiring a verification code from your authenticator
              app in addition to your password.
            </p>
            <button
              type="button"
              className="mt-2.5 w-full rounded-md bg-white/[0.16] py-2 text-[11px] font-medium text-bgray/80 transition hover:bg-white/20"
            >
              Manage 2FA Settings
            </button>
          </section>
        </div>

        {/* Row 2 — active sessions */}
        <section className="mt-4 min-h-[211px] rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.1]">
              <FiMonitor size={13} className="text-secondary" />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-5 text-bgray">Active Sessions</h2>
              <p className="mt-0.5 text-[10px] text-bgray/45">
                Locations and devices currently logged into MSQUARED
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-[10px] text-bgray/55">
              <input
                type="checkbox"
                checked={allVisibleSessionsSelected}
                disabled={visibleActiveSessionIds.length === 0 || sessionsLoading || Boolean(sessionsError) || isRevokingSession}
                onChange={(event) => toggleVisibleSessionSelection(event.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
                aria-label="Select all visible active sessions"
              />
              Select visible active sessions
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {sessions.length > 3 && (
                <button
                  type="button"
                  aria-expanded={showAllSessions}
                  onClick={() => setShowAllSessions((expanded) => !expanded)}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-bgray/60 transition hover:text-bgray"
                >
                  {showAllSessions ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                  {showAllSessions ? "Show fewer sessions" : `Show ${sessions.length - 3} more sessions`}
                </button>
              )}
              <button
                type="button"
                disabled={selectedSessionIds.length === 0 || isRevokingSession || sessionsLoading || Boolean(sessionsError)}
                onClick={() => {
                  const selectedSessions = sessions.filter((session) => selectedSessionIds.includes(session.id));
                  setConfirm({
                    kind: "revoke",
                    sessionIds: [...selectedSessionIds],
                    count: selectedSessionIds.length,
                    current: selectedSessions.some((session) => session.current),
                  });
                }}
                className="rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove selected{selectedSessionIds.length > 0 ? ` (${selectedSessionIds.length})` : ""}
              </button>
            </div>
          </div>

          {sessionActionMessage && (
            <p
              className={`mt-3 text-xs ${sessionActionMessage.type === "success" ? "text-green" : "text-primary"}`}
              role={sessionActionMessage.type === "error" ? "alert" : "status"}
            >
              {sessionActionMessage.text}
            </p>
          )}

          <ul className="mt-4 space-y-2" aria-live="polite">
            {sessionsLoading ? (
              <li className="rounded-lg bg-[#191a1c] px-3 py-4 text-sm text-bgray/55">Loading sessions…</li>
            ) : sessionsError ? (
              <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#191a1c] px-3 py-4" role="alert">
                <span className="text-sm text-primary">{sessionsError}</span>
                <button
                  type="button"
                  onClick={() => void refreshSessions()}
                  className="text-xs font-medium text-secondary hover:underline"
                >
                  Retry
                </button>
              </li>
            ) : sessions.length === 0 ? (
              <li className="rounded-lg bg-[#191a1c] px-3 py-4 text-sm text-bgray/55">No login sessions found.</li>
            ) : visibleSessions.map((session) => {
              const SessionIcon = getSessionIcon(session.device_type || "");
              const status = session.status.toLowerCase();
              const active = status === "active";
              const statusClass = active
                ? "bg-green/10 text-green"
                : status === "revoked"
                  ? "bg-primary/10 text-secondary"
                  : "bg-white/[0.08] text-bgray/50";
              const location = session.location == null || session.location === ""
                ? "Unknown location"
                : session.location;
              return (
                <li
                  key={session.id}
                  className="flex min-h-10 flex-wrap items-start gap-2.5 rounded-lg bg-[#191a1c] px-2.5 py-3 sm:px-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedSessionIds.includes(session.id)}
                    disabled={!active || isRevokingSession}
                    onChange={(event) => setSelectedSessionIds((previous) => event.target.checked
                      ? [...previous, session.id]
                      : previous.filter((id) => id !== session.id))}
                    className="mt-2 h-3.5 w-3.5 shrink-0 accent-primary disabled:opacity-25"
                    aria-label={`Select ${session.device_type || "unknown device"} session`}
                  />
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.08]">
                    <SessionIcon size={12} className="text-bgray/65" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-bgray/90">
                      {session.device_type || "Unknown device"}
                      {session.current && (
                        <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-secondary">
                          Current
                        </span>
                      )}
                      <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${statusClass}`}>
                        {session.status}
                      </span>
                    </p>
                    <p className="mt-1 text-[10px] text-bgray/55">
                      Browser: {session.browser || "Unknown"} · Operating system: {session.operating_system || "Unknown"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-bgray/55">Location: {location}</p>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] text-bgray/40">
                      <span>Signed in: {formatSessionDate(session.signed_in_at)}</span>
                      <span>Last activity: {formatSessionDate(session.last_activity_at)}</span>
                      <span>Expires: {formatSessionDate(session.expires_at)}</span>
                    </p>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-3 pl-8 sm:pl-0">
                    {session.current && active && (
                      <button
                        type="button"
                        onClick={() => void handleSignOut()}
                        disabled={isSigningOut}
                        className="text-[10px] font-medium text-bgray/55 transition hover:text-bgray disabled:opacity-50"
                      >
                        {isSigningOut ? "Signing out…" : "Sign Out"}
                      </button>
                    )}
                    {active && (
                      <button
                        type="button"
                        onClick={() => setConfirm({ kind: "revoke", sessionIds: [session.id], count: 1, current: session.current })}
                        disabled={isRevokingSession}
                        className="text-[10px] font-medium text-secondary transition hover:underline"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Row 3 — data & privacy + encryption */}
        <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          <section className="min-h-[257px] rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.1]">
                <FiShield size={13} className="text-secondary" />
              </span>
              <h2 className="text-base font-semibold text-bgray">Data &amp; Privacy</h2>
            </div>

            <div className="mt-4 rounded-md bg-[#191a1c] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-bgray/90">Export My Data</p>
                <FiDownload size={13} className="text-bgray/70" />
              </div>
              <p className="mt-1.5 text-[10px] leading-[1.45] text-bgray/50">
                Download a complete JSON/CSV archive of your organizer activity and
                organizational details.
              </p>
              <button
                type="button"
                className="mt-2 rounded-md border border-secondary/20 px-2 py-1 text-[10px] font-medium text-secondary transition hover:bg-white/[0.03]"
              >
                Request Archive
              </button>
            </div>

            <div className="mt-3 rounded-md border border-primary/10 bg-primary/[0.04] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-secondary">Account Deletion</p>
                <FiTrash2 size={13} className="text-primary" />
              </div>
              <p className="mt-1.5 text-[10px] leading-[1.45] text-bgray/50">
                Permanently delete your account and all associated event data. This action is
                irreversible.
              </p>
              <button
                type="button"
                onClick={() => setConfirm({ kind: "delete" })}
                className="mt-2 rounded-md border border-primary/25 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-secondary transition hover:bg-primary/10"
              >
                Delete Organization
              </button>
            </div>
          </section>

          <section className="flex min-h-[257px] flex-col justify-end rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
            <h2 className="text-base font-semibold text-bgray">Encryption Standards</h2>
            <p className="mt-2 text-[11px] leading-[1.5] text-bgray/55">
              All MSQUARED data is encrypted at rest using AES-256 and in transit via TLS 1.3.
              Your privacy is our architecture's foundation.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {complianceChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-sm bg-white/[0.08] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-bgray/50"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <ConfirmModal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => void handleConfirm()}
        title={confirm?.kind === "delete" ? "Delete organization" : confirm?.kind === "revoke" && confirm.count > 1 ? "Remove selected sessions" : "Revoke session"}
        message={
          confirm?.kind === "delete"
            ? "Permanently delete this organization and all associated event data? This action is irreversible."
            : `Revoke access for ${confirm?.kind === "revoke" ? `${confirm.count} selected session${confirm.count === 1 ? "" : "s"}` : "this session"}?${confirm?.kind === "revoke" && confirm.current ? " One is the current device, so you will be signed out." : ""}`
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete Organization" : confirm?.kind === "revoke" && confirm.count > 1 ? "Remove Selected" : "Revoke Access"}
        loading={isRevokingSession}
      />
    </div>
  );
};

export default SecurityPrivacyPage;
