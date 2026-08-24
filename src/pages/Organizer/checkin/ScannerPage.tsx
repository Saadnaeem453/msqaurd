import { ArrowLeftRight, Flashlight, ListChecks, UserRound } from "lucide-react";

const recentScans = [
  { name: "Marcus Holloway", type: "VIP ALL-ACCESS", time: "14:22:05" },
  { name: "Sarah Jenkins", type: "STANDARD ENTRY", time: "14:27:48" },
  { name: "David Chen", type: "EARLY BIRD", time: "15:25:33" },
];

const ScannerPage = () => {
  return (
    <div className="min-h-screen bg-[#111316] px-5 py-7 text-white md:px-8">
      <div className="mx-auto max-w-[1220px]">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[#f3f4f6]">QR Check-In Scanner</h1>
          <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
            LIVE: 1 SEC TO SKETCH 2024
          </span>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
          {/* Left - Scanner */}
          <section className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="relative overflow-hidden rounded-[18px] border border-[#2a2d31] bg-[#0d1014] p-4">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_rgba(255,255,255,0)_55%)]" />
              <div className="absolute inset-0 opacity-70" style={{ background: "linear-gradient(180deg, rgba(13,16,20,0.25), rgba(13,16,20,0.9)), linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0))" }} />

              {/* Scanner frame border */}
              <div className="absolute inset-x-4 top-5 bottom-4 rounded-[14px]  shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />

              {/* Corner brackets – top-left */}
              <div className="absolute left-6 top-7 h-6 w-6 border-l-2 border-t-2 border-secondary/90" />
              {/* Corner brackets – top-right */}
              <div className="absolute right-6 top-7 h-6 w-6 border-r-2 border-t-2 border-secondary/90" />
              {/* Corner brackets – bottom-left */}
              <div className="absolute bottom-6 left-6 h-6 w-6 border-l-2 border-b-2 border-secondary/90" />
              {/* Corner brackets – bottom-right */}
              <div className="absolute bottom-6 right-6 h-6 w-6 border-r-2 border-b-2 border-secondary/90" />

              {/* Scan line animation */}
              <div className="absolute left-8 right-8 top-8 z-20 h-0.5 bg-secondary/90 shadow-[0_0_12px_rgba(255,122,122,0.6)] animate-scan" />

              {/* Center area */}
              <div className="relative z-10 flex h-[420px] items-center justify-center">
                {/* Position text at bottom */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-lg bg-[#111316]/80 px-5 py-2 text-sm font-medium text-[#f4d9d7] shadow-[0_0_18px_rgba(255,122,122,0.25)]">
                  Position QR code within frame
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2 text-[#d7dbe0]">
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#262628] bg-[#0d0d10] text-[#f5d3d0] hover:bg-primary/10 transition-colors">
                  <Flashlight size={18} />
                </button>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-secondary">Flash</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-[#d7dbe0]">
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#262628] bg-[#0d0d10] text-[#f5d3d0] hover:bg-primary/10 transition-colors">
                  <ArrowLeftRight size={18} />
                </button>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-secondary">Switch</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-[#d7dbe0]">
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#262628] bg-[#0d0d10] text-[#f5d3d0] hover:bg-primary/10 transition-colors">
                  <ListChecks size={18} />
                </button>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-secondary">Logs</span>
              </div>
            </div>
          </section>

          {/* Right - Recent Scans */}
          <aside className="rounded-[18px] border border-[#2a2d31] bg-[#171b1f] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#eef1f4]">Recent Scans</h2>
              <span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
                Live
              </span>
            </div>

            <div className="mb-4 rounded-xl px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-secondary/60">
              Session: Morning check-in
            </div>

            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.name} className="flex items-center gap-3 rounded-xl border border-[#2a2d31] bg-[#1d2125] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4a5058] bg-[#111619] text-[#e9edf1]">
                    <UserRound size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-[#f2f4f7]">{scan.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-secondary">{scan.type}</p>
                  </div>

                  <div className="text-right text-[10px] font-medium text-secondary">{scan.time}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#d0d3d7]">Check-in rate</span>
                <span className="text-[12px] font-semibold text-[#f4f7fb]">82%</span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#2a2d31]">
                <div className="h-full w-[82%] rounded-full bg-secondary" />
              </div>

              <div className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-[#a7acb2]">
                Scanning active for 04h 22m
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Add the scan animation to your global CSS or use tailwind animate */}
      <style>{`
        @keyframes scan {
          0% { top: 8%; }
          100% { top: 88%; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;