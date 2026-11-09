import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiDownload,
  FiLock,
  FiMonitor,
  FiShield,
  FiSmartphone,
  FiTrash2,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface SessionRow {
  id: string;
  icon: IconType;
  device: string;
  meta: string;
  current?: boolean;
}

type ConfirmState =
  | { kind: "revoke"; sessionId: string; label: string }
  | { kind: "delete" }
  | null;

/* ================== Mock data (swap with real API later) ================== */

const sessionRows: SessionRow[] = [
  {
    id: "s1",
    icon: MdLaptop,
    device: 'MacBook Pro 16" • London, UK',
    meta: "IP: 185.12.44.199 | CHROME, MACOS",
    current: true,
  },
  {
    id: "s2",
    icon: FiSmartphone,
    device: "iPhone 15 Pro • New York, USA",
    meta: "IP: 72.44.102.1 | MOBILE APP | 2 HOURS AGO",
  },
  {
    id: "s3",
    icon: FiMonitor,
    device: "Windows Workstation • Singapore",
    meta: "IP: 103.22.201.5 | FIREFOX | YESTERDAY",
  },
];

const complianceChips = ["SOC2 Compliant", "GDPR Ready"];

/* ============================= Page ============================= */

const SecurityPrivacyPage = () => {
  const [sessions, setSessions] = useState<SessionRow[]>(sessionRows);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const handleConfirm = () => {
    if (confirm?.kind === "revoke") {
      setSessions((prev) => prev.filter((s) => s.id !== confirm.sessionId));
      toast.success("Session revoked.");
    } else if (confirm?.kind === "delete") {
      toast.success("Organization deletion initiated.");
    }
    setConfirm(null);
  };

  return (
    <div className="min-h-full font-jakarta text-bgray">
      {/* Top bar fragment per pixels — converges into AdminNavbar on integration */}
      <div className="mx-auto w-full max-w-[1600px] px-4 py-4">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10"><FiShield size={12} className="text-primary" /></span>
            <h1 className="text-xl font-semibold leading-6 tracking-tight text-bgray">Security &amp; Privacy</h1>
          </div>
          <p className="mt-1 max-w-[560px] text-[10px] leading-[1.4] text-bgray/55">
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
                <h2 className="text-sm font-semibold leading-4 text-bgray">Password</h2>
                <p className="mt-0.5 text-[9px] text-bgray/45">Last changed 4 months ago</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] leading-[1.5] text-bgray/60">
              Regularly updating your password helps keep your account secure from
              unauthorized access.
            </p>
            <button
              type="button"
              className="mt-2.5 w-full rounded-md bg-primary py-2 text-[9px] font-semibold text-white transition hover:bg-primary/90"
            >
              Change Password
            </button>
          </section>

          <section className="min-h-[148px] rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.1]">
                <FiSmartphone size={13} className="text-secondary" />
              </span>
              <div>
                <h2 className="text-sm font-semibold leading-4 text-bgray">Multi-Factor</h2>
                <p className="mt-0.5 flex items-center gap-1 text-[9px] text-green">
                  <span className="h-1 w-1 rounded-full bg-green" aria-hidden="true" />
                  Enabled
                </p>
              </div>
            </div>
            <p className="mt-3 text-[10px] leading-[1.5] text-bgray/60">
              Enhance your security by requiring a verification code from your authenticator
              app in addition to your password.
            </p>
            <button
              type="button"
              className="mt-2.5 w-full rounded-md bg-white/[0.16] py-2 text-[9px] font-medium text-bgray/80 transition hover:bg-white/20"
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
              <h2 className="text-sm font-semibold leading-4 text-bgray">Active Sessions</h2>
              <p className="mt-0.5 text-[9px] text-bgray/45">
                Locations and devices currently logged into MSQUARED
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {sessions.map((session) => {
              const SessionIcon = session.icon;
              return (
                <li
                  key={session.id}
                  className="flex min-h-10 items-center gap-2.5 rounded-lg bg-[#191a1c] px-2.5 py-2 sm:px-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.08]">
                    <SessionIcon size={12} className="text-bgray/65" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[9px] font-medium text-bgray/90">
                      {session.device}
                      {session.current && (
                        <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-secondary">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] uppercase text-bgray/40">{session.meta}</p>
                  </div>
                  {session.current ? (
                    <span className="shrink-0 text-[8px] text-bgray/35">This Device</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({ kind: "revoke", sessionId: session.id, label: session.device })
                      }
                      className="shrink-0 text-[9px] font-medium text-secondary transition hover:underline"
                    >
                      Revoke Access
                    </button>
                  )}
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
              <h2 className="text-sm font-semibold text-bgray">Data &amp; Privacy</h2>
            </div>

            <div className="mt-4 rounded-md bg-[#191a1c] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-medium text-bgray/90">Export My Data</p>
                <FiDownload size={13} className="text-bgray/70" />
              </div>
              <p className="mt-1.5 text-[9px] leading-[1.45] text-bgray/50">
                Download a complete JSON/CSV archive of your organizer activity and
                organizational details.
              </p>
              <button
                type="button"
                className="mt-2 rounded-md border border-secondary/20 px-2 py-1 text-[9px] font-medium text-secondary transition hover:bg-white/[0.03]"
              >
                Request Archive
              </button>
            </div>

            <div className="mt-3 rounded-md border border-primary/10 bg-primary/[0.04] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-medium text-secondary">Account Deletion</p>
                <FiTrash2 size={13} className="text-primary" />
              </div>
              <p className="mt-1.5 text-[9px] leading-[1.45] text-bgray/50">
                Permanently delete your account and all associated event data. This action is
                irreversible.
              </p>
              <button
                type="button"
                onClick={() => setConfirm({ kind: "delete" })}
                className="mt-2 rounded-md border border-primary/25 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-secondary transition hover:bg-primary/10"
              >
                Delete Organization
              </button>
            </div>
          </section>

          <section className="flex min-h-[257px] flex-col justify-end rounded-lg border border-white/[0.06] bg-[#090a0b] p-4">
            <h2 className="text-sm font-semibold text-bgray">Encryption Standards</h2>
            <p className="mt-2 text-[9px] leading-[1.5] text-bgray/55">
              All MSQUARED data is encrypted at rest using AES-256 and in transit via TLS 1.3.
              Your privacy is our architecture's foundation.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {complianceChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-sm bg-white/[0.08] px-2 py-0.5 text-[8px] font-medium uppercase tracking-wide text-bgray/50"
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
        onConfirm={handleConfirm}
        title={confirm?.kind === "delete" ? "Delete organization" : "Revoke session"}
        message={
          confirm?.kind === "delete"
            ? "Permanently delete this organization and all associated event data? This action is irreversible."
            : `Revoke access for ${confirm?.kind === "revoke" ? confirm.label : ""}? The device will be signed out immediately.`
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete Organization" : "Revoke Access"}
      />
    </div>
  );
};

export default SecurityPrivacyPage;
