import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { eventApi, Event } from "../../../services/event.service";
import { organizerCheckInApi, CheckInStats } from "../../../services/organizer_checkin.service";

type ScanState = "ready" | "verifying" | "success" | "already" | "rejected" | "network";

const ScannerPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const busyRef = useRef(false);
  const cooldownRef = useRef(new Map<string, number>());
  const timerRef = useRef<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState("");
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualId, setManualId] = useState("");
  const [state, setState] = useState<ScanState>("ready");
  const [resultText, setResultText] = useState("");
  const [resultDetail, setResultDetail] = useState("");

  useEffect(() => {
    void eventApi.list({ page: 1, limit: 100 }).then((result) => {
      const payload = result.data as { events?: Event[]; data?: { events?: Event[] } } | undefined;
      const rows = payload?.events || payload?.data?.events || [];
      setEvents(rows.filter((event) => event.is_active && !["cancelled", "completed"].includes(event.status)));
    });
  }, []);

  useEffect(() => {
    if (!eventId) { setStats(null); return; }
    let active = true;
    const poll = async () => { const result = await organizerCheckInApi.stats(eventId); if (active && result.ok && result.data) setStats(result.data); };
    void poll(); const id = window.setInterval(() => void poll(), 5000);
    return () => { active = false; window.clearInterval(id); };
  }, [eventId]);

  const dismiss = () => { if (timerRef.current) window.clearTimeout(timerRef.current); setState("ready"); setResultText(""); setResultDetail(""); };
  const result = (next: ScanState, title: string, detail = "") => { setState(next); setResultText(title); setResultDetail(detail); if (timerRef.current) window.clearTimeout(timerRef.current); timerRef.current = window.setTimeout(dismiss, 1500); };
  const submit = async (credential: string) => {
    if (!eventId || busyRef.current) return;
    const now = Date.now(); const previous = cooldownRef.current.get(credential); if (previous && now - previous < 3000) return; cooldownRef.current.set(credential, now);
    busyRef.current = true; setState("verifying");
    try {
      const response = await organizerCheckInApi.qr(credential, eventId);
      if (response.ok) result("success", "CHECK-IN SUCCESSFUL");
      else if ((response.detail || "").toLowerCase().includes("already") || (response.detail || "").toLowerCase().includes("checked in")) result("already", "ALREADY CHECKED IN", response.detail);
      else result("rejected", "ENTRY DENIED", response.detail || "Invalid or unauthorized ticket.");
    } catch { result("network", "CONNECTION ERROR — TRY AGAIN"); }
    finally { busyRef.current = false; }
  };

  const stopCamera = () => { controlsRef.current?.stop(); controlsRef.current = null; setCameraActive(false); };
  const startCamera = async () => {
    if (!eventId || cameraActive || !videoRef.current) return;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { setCameraError("Camera scanning requires HTTPS."); return; }
    setCameraError("");
    try {
      const reader = new BrowserMultiFormatReader();
      controlsRef.current = await reader.decodeFromConstraints({ video: { facingMode: { ideal: "environment" } }, audio: false }, videoRef.current, (decoded) => { const value = decoded?.getText(); if (value && !busyRef.current) void submit(value); });
      setCameraActive(true);
    } catch { setCameraError("Camera permission was denied, no camera was found, or this browser cannot access the camera."); stopCamera(); }
  };
  useEffect(() => () => { stopCamera(); if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const overlay = state !== "ready";
  const icon = state === "success" ? <Check size={44} /> : state === "already" ? <AlertTriangle size={42} /> : <X size={44} />;
  const color = state === "success" ? "border-green-400/40 bg-green-950/95 text-green-300" : state === "already" ? "border-orange-400/40 bg-orange-950/95 text-orange-300" : state === "verifying" ? "border-white/20 bg-[#111316]/95 text-white" : "border-red-400/40 bg-red-950/95 text-red-300";
  const rate = stats?.percentage ?? 0;

  return <div className="min-h-screen bg-[#111316] px-3 py-4 text-white sm:px-5 sm:py-7 md:px-8"><div className="mx-auto max-w-[1220px]"><header className="mb-4 flex flex-wrap items-center gap-3 sm:mb-6"><h1 className="text-2xl font-bold sm:text-3xl">QR Check-In Scanner</h1><span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">Organizer access</span></header><div className="mb-4 rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-3 sm:mb-6 sm:p-4"><label className="text-[10px] uppercase tracking-widest text-secondary">Authorized event</label><select value={eventId} onChange={(e) => { stopCamera(); dismiss(); setEventId(e.target.value); }} className="mt-2 w-full rounded-lg border border-[#2a2d31] bg-[#0d1014] px-3 py-3 text-sm text-white outline-none"><option value="">Select an event before scanning</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></div><div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_360px]"><section className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-2 sm:p-3"><div className="relative overflow-hidden rounded-[18px] border border-[#2a2d31] bg-[#0d1014]"><video ref={videoRef} muted playsInline className={`absolute inset-0 h-full w-full object-cover ${cameraActive ? "opacity-60" : "opacity-0"}`} /><div className="absolute inset-0 bg-black/35" /><div className="relative flex h-[300px] items-center justify-center sm:h-[420px]"><div className="absolute inset-6 rounded-[14px] border border-white/10" />{cameraActive && <div className="absolute left-8 right-8 top-8 h-0.5 animate-scan bg-secondary" />}<div className="absolute bottom-6 rounded-lg bg-black/60 px-4 py-2 text-center text-xs">{cameraActive ? state === "verifying" ? "Verifying ticket..." : "Position QR code within frame" : eventId ? "Tap Start Camera to scan" : "Select an event to activate scanner"}</div>{overlay && <button type="button" onClick={dismiss} className={`absolute inset-x-5 top-1/2 z-20 -translate-y-1/2 rounded-2xl border p-6 text-center shadow-2xl ${color}`}><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-current">{state === "verifying" ? <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}</div><p className="mt-4 text-lg font-black sm:text-2xl">{state === "verifying" ? "VERIFYING" : resultText}</p>{resultDetail && <p className="mt-2 text-xs opacity-90">{resultDetail}</p>}<p className="mt-3 text-[10px] opacity-70">Tap to dismiss</p></button>}</div></div><div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" onClick={() => void startCamera()} disabled={!eventId || cameraActive} className="rounded-full bg-primary px-5 py-3 text-xs font-bold disabled:opacity-40">{cameraActive ? "Camera active" : "Start Camera"}</button>{cameraActive && <button type="button" onClick={stopCamera} className="rounded-full border border-white/10 px-5 py-3 text-xs text-secondary">Stop Camera</button>}</div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder="Manual ticket ID" className="min-w-0 flex-1 rounded-md border border-[#2a2d31] bg-[#0d1014] px-3 py-2 text-sm outline-none" /><button type="button" onClick={() => { if (manualId.trim()) { void submit(manualId.trim()); setManualId(""); } }} disabled={!eventId || !manualId.trim() || state === "verifying"} className="rounded-md bg-primary px-4 py-2 text-xs font-bold disabled:opacity-40">Check in</button></div>{cameraError && <p className="mt-4 text-center text-xs text-amber-300">{cameraError}</p>}</section><aside className="rounded-[18px] border border-[#2a2d31] bg-[#171b1f] p-3 sm:p-4"><h2 className="mb-4 text-xl font-semibold sm:text-2xl">Check-In Stats</h2><div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-[#1d2125] p-2"><p className="text-lg font-bold">{stats?.total_eligible ?? 0}</p><p className="text-[9px] text-secondary">Eligible</p></div><div className="rounded-lg bg-[#1d2125] p-2"><p className="text-lg font-bold text-green-300">{stats?.checked_in ?? 0}</p><p className="text-[9px] text-secondary">Checked in</p></div><div className="rounded-lg bg-[#1d2125] p-2"><p className="text-lg font-bold text-primary">{stats?.remaining ?? 0}</p><p className="text-[9px] text-secondary">Remaining</p></div></div><div className="mt-5 flex justify-between text-xs"><span className="uppercase tracking-widest text-secondary">Check-in rate</span><span>{rate}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#2a2d31]"><div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, Math.max(0, rate))}%` }} /></div></aside></div></div><style>{`@keyframes scan{0%{top:8%}100%{top:88%}}.animate-scan{animation:scan 3s ease-in-out infinite alternate}`}</style></div>;
};

export default ScannerPage;
