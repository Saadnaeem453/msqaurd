import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Flashlight, ListChecks, UserRound } from "lucide-react";
import { eventApi, Event } from "../../../services/event.service";
import { organizerCheckInApi, CheckInStats } from "../../../services/organizer_checkin.service";

type Detector = { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> };
type DetectorConstructor = new (options?: { formats?: string[] }) => Detector;

const ScannerPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingRef = useRef(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState("");
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [manualId, setManualId] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error" | "info">("info");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    void eventApi.list({ status: "published", page: 1, limit: 100 }).then((result) => {
      if (result.ok && result.data?.data?.events) setEvents(result.data.data.events);
      else setMessage("Select an authorized event before scanning.");
    });
  }, []);

  useEffect(() => {
    if (!eventId) { setStats(null); return; }
    let active = true;
    const poll = async () => { const result = await organizerCheckInApi.stats(eventId); if (active && result.ok && result.data) setStats(result.data); };
    void poll(); const timer = window.setInterval(() => void poll(), 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [eventId]);

  const showResult = (text: string, nextTone: "success" | "error" | "info") => { setMessage(text); setTone(nextTone); };
  const submitQr = async (credential: string) => {
    if (!eventId || processingRef.current) return;
    processingRef.current = true; const result = await organizerCheckInApi.qr(credential, eventId); processingRef.current = false;
    showResult(result.ok ? "Check-in successful" : result.detail || "Invalid, already checked-in, or unauthorized ticket.", result.ok ? "success" : "error");
  };
  const submitManual = async () => {
    if (!eventId || !manualId.trim() || processingRef.current) return;
    processingRef.current = true; const result = await organizerCheckInApi.manual(manualId.trim(), eventId); processingRef.current = false;
    if (result.ok) setManualId("");
    showResult(result.ok ? "Check-in successful" : result.detail || "Invalid, already checked-in, or unauthorized ticket.", result.ok ? "success" : "error");
  };

  useEffect(() => {
    let active = true;
    const start = async () => {
      if (!eventId) return;
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { setCameraError("Camera scanning requires HTTPS."); return; }
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (!active || !videoRef.current) return;
        videoRef.current.srcObject = streamRef.current; await videoRef.current.play();
        const BarcodeDetector = (window as Window & { BarcodeDetector?: DetectorConstructor }).BarcodeDetector;
        if (!BarcodeDetector) { setCameraError("Automatic QR scanning is unavailable in this browser. Use manual ticket ID check-in."); return; }
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        const scan = async () => {
          if (!active || !videoRef.current) return;
          if (!processingRef.current) { const codes = await detector.detect(videoRef.current); if (codes[0]?.rawValue) await submitQr(codes[0].rawValue); }
          if (active) window.setTimeout(scan, 400);
        };
        void scan();
      } catch { setCameraError("Camera access was denied or unavailable."); }
    };
    void start();
    return () => { active = false; streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; };
  }, [eventId]);

  const rate = stats?.percentage ?? 0;
  return <div className="min-h-screen bg-[#111316] px-5 py-7 text-white md:px-8"><div className="mx-auto max-w-[1220px]"><header className="mb-6 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold tracking-tight text-[#f3f4f6]">QR Check-In Scanner</h1><span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">Organizer access</span></header><div className="mb-6 rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-4"><label className="text-xs uppercase tracking-[0.18em] text-secondary">Authorized event</label><select value={eventId} onChange={(e) => { setEventId(e.target.value); setMessage(""); }} className="mt-2 w-full rounded-lg border border-[#2a2d31] bg-[#0d1014] px-3 py-3 text-sm text-white outline-none md:max-w-xl"><option value="">Select an event before scanning</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></div><div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]"><section className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-3"><div className="relative overflow-hidden rounded-[18px] border border-[#2a2d31] bg-[#0d1014] p-4"><video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-black/35" /><div className="relative z-10 flex h-[420px] items-center justify-center"><div className="absolute inset-x-8 top-8 bottom-8 rounded-[14px] border border-white/10" /><div className="absolute left-6 top-7 h-6 w-6 border-l-2 border-t-2 border-secondary/90" /><div className="absolute right-6 top-7 h-6 w-6 border-r-2 border-t-2 border-secondary/90" /><div className="absolute bottom-6 left-6 h-6 w-6 border-l-2 border-b-2 border-secondary/90" /><div className="absolute bottom-6 right-6 h-6 w-6 border-r-2 border-b-2 border-secondary/90" /><div className="absolute left-8 right-8 top-8 h-0.5 bg-secondary/90 animate-scan" /><div className="absolute bottom-10 rounded-lg bg-[#111316]/80 px-5 py-2 text-sm text-[#f4d9d7]">{eventId ? "Position QR code within frame" : "Select an event to activate scanner"}</div></div></div><div className="mt-6 flex gap-2"><input value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder="Manual ticket ID" className="min-w-0 flex-1 rounded-md border border-[#2a2d31] bg-[#0d1014] px-3 py-2 text-sm outline-none" /><button type="button" onClick={() => void submitManual()} disabled={!eventId || !manualId.trim()} className="rounded-md bg-primary px-4 py-2 text-xs font-bold disabled:opacity-40">Check in</button></div>{cameraError && <p className="mt-4 text-center text-xs text-amber-300">{cameraError}</p>}{message && <p className={`mt-4 rounded-md p-3 text-center text-sm ${tone === "success" ? "bg-green-500/10 text-green-300" : tone === "error" ? "bg-red-500/10 text-red-300" : "bg-white/5 text-secondary"}`}>{message}</p>}<div className="mt-5 flex justify-center gap-8"><Flashlight size={18} /><ArrowLeftRight size={18} /><ListChecks size={18} /></div></section><aside className="rounded-[18px] border border-[#2a2d31] bg-[#171b1f] p-4"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold text-[#eef1f4]">Check-In Stats</h2><span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">Live</span></div><div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-[#1d2125] p-3"><p className="text-xl font-bold">{stats?.total_eligible ?? 0}</p><p className="text-[9px] text-secondary">Eligible</p></div><div className="rounded-lg bg-[#1d2125] p-3"><p className="text-xl font-bold text-green-300">{stats?.checked_in ?? 0}</p><p className="text-[9px] text-secondary">Checked in</p></div><div className="rounded-lg bg-[#1d2125] p-3"><p className="text-xl font-bold text-primary">{stats?.remaining ?? 0}</p><p className="text-[9px] text-secondary">Remaining</p></div></div><div className="mt-6 flex items-center justify-between"><span className="text-[11px] uppercase tracking-[0.18em] text-[#d0d3d7]">Check-in rate</span><span className="text-[12px] font-semibold">{rate}%</span></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#2a2d31]"><div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${Math.min(100, Math.max(0, rate))}%` }} /></div><div className="mt-6 space-y-3">{(stats?.recent || []).map((item, index) => <div key={index} className="flex items-center gap-3 rounded-xl border border-[#2a2d31] bg-[#1d2125] p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4a5058] bg-[#111619]"><UserRound size={16} /></div><p className="truncate text-xs text-[#f2f4f7]">{String(item.ticket_id || item.event_ticket_id || "Recent check-in")}</p></div>)}</div></aside></div></div><style>{`@keyframes scan{0%{top:8%}100%{top:88%}}.animate-scan{animation:scan 3s ease-in-out infinite alternate}`}</style></div>;
};

export default ScannerPage;
