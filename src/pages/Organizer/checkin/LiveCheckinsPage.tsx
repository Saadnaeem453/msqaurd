import { Download, Plus, Check, TriangleAlert, Clock3, MapPin, AlertCircle } from "lucide-react";

const attendees = [
  {
    name: "Elena Rodriguez",
    email: "elena.r@example.com",
    type: "VIP TIER",
    time: "19:41:02",
    tone: "normal",
    status: "checked",
  },
  {
    name: "Unknown Attendee",
    email: "INVALID TICKET CODE: RX2F1",
    type: "INVALID",
    time: "19:40:55",
    tone: "danger",
    status: "alert",
  },
  {
    name: "Marcus Chen",
    email: "m.chen@studio.io",
    type: "STANDARD",
    time: "19:40:18",
    tone: "normal",
    status: "checked",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.j@example.co",
    type: "STANDARD",
    time: "19:39:45",
    tone: "normal",
    status: "checked",
  },
];

const gateData = [
  { label: "Main Entrance (A)", value: 782 },
  { label: "East Wing (B)", value: 425 },
  { label: "VIP Skybox (C)", value: 275 },
];

const LiveCheckinsPage = () => {
  return (
    <div className="min-h-screen bg-[#0d0f12] px-5 py-7 text-white md:px-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Live Session Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#2a2d31] bg-[#171b1f] px-4 py-2.5 text-sm font-medium text-[#f0f2f5] transition hover:border-[#3a3d42] hover:bg-[#1d2125]">
              <Download size={15} />
              Export List
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_18px_rgba(239,70,70,0.25)] transition hover:bg-[#ff5b5b]">
              <Plus size={16} />
              Manual Check-In
            </button>
          </div>
        </header>

        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[#f3f4f6]">Summer Solstice Gala 2024</h1>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_430px]">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)]">
              <div className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-secondary">Total Checked In</div>
                  <div className="flex items-center justify-center rounded-full border border-primary/70 bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">
                    74%
                  </div>
                </div>

                <div className="mb-4 flex items-end gap-2">
                  <div className="text-4xl font-black font-  text-[#f4f6f8]">1,482</div>
                  <div className=" text-sm font-medium text-secondary">/ 2,000</div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#2a2d31]">
                  <div className="h-full w-[74%] rounded-full bg-primary" />
                </div>
              </div>

              <div className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-secondary">Check-In Rate</div>
                  <div className="text-[12px] font-bold text-[#f4f6f8]">24</div>
                </div>

                <div className="mb-4 flex items-end justify-between">
                  <div className="text-[46px] font-black leading-none tracking-[-0.06em] text-[#f4f6f8]">24</div>
                  <div className="mb-1 text-[16px] font-medium text-secondary">attendees per minute</div>
                </div>

                <div className="mt-4 flex items-end gap-[6px] h-16">
                  {[28, 32, 22, 42, 35, 48, 30].map((value, idx) => (
                    <div key={idx} className="flex-1 rounded-t-md bg-gradient-to-t from-[#4b1d1d] via-[#7a2a2a] to-[#c65454] opacity-90" style={{ height: `${value}%` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#f0f3f5]">Real-Time Activity</h2>
              </div>

              <div className="space-y-3">
                {attendees.map((attendee, idx) => {
                  const isAlert = attendee.tone === "danger";
                  return (
                    <div
                      key={attendee.name}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
                        isAlert
                          ? "border-[#5a2a2a] bg-[#2f1b1b]"
                          : "border-[#2a2d31] bg-[#1d2125]"
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#f3c0a0] via-[#d67d7d] to-[#7d1b1b] text-sm font-bold text-white">
                        {attendee.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-[15px] font-medium text-[#f5f7f9]">{attendee.name}</div>
                          {!isAlert && (
                            <span className="rounded-full border border-[#3a444f] bg-[#111719] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#dfe5ea]">
                              {attendee.type}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#a9afb8]">
                          <span className="truncate">{attendee.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[12px] text-[#d1d7de]">
                        <span className={isAlert ? "text-[#ff8d82]" : "text-[#dfe5ea]"}>{attendee.time}</span>
                        {isAlert ? (
                          <TriangleAlert size={16} className="text-primary" />
                        ) : (
                          <Check size={16} className="text-[#a7d9b0]" />
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between rounded-xl border border-[#2a2d31] bg-[#1b1d20] px-3 py-3 text-[#dfe5ea]">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md border border-[#464b52] bg-[#111517] p-1 text-primary">
                      <AlertCircle size={14} />
                    </div>
                    <div>
                      <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#f3f5f7]">Duplicate Attempt</div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#bac2c9]">Ticket already checked in</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] font-medium text-[#dfe5ea]">
                    <Clock3 size={14} className="text-[#d9dee4]" />
                    19:38:12
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.18em] text-secondary">Pending Entry</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-secondary">09:42:05</div>
              </div>

              <div className="flex items-end justify-between">
                <div className="text-[52px] font-black leading-none tracking-[-0.06em] text-[#f4f6f8]">518</div>
                <div className="mb-1 text-[13px] uppercase tracking-[0.16em] text-secondary">Projected arrival in 45m</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-secondary">Gate Breakdown</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="text-[10px] uppercase tracking-[0.18em] text-secondary">Auto-update</div>
                </div>
              </div>

              <div className="space-y-4">
                {gateData.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#dfe5ea]">
                      <span>{item.label}</span>
                      <span className="font-semibold text-[#f3f5f7]">{item.value}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#2a2d31]">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, (item.value / 782) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#2a2d31] bg-[#171b1f] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-secondary">Venue Heatmap</h3>
                <div className="text-[10px] uppercase tracking-[0.14em] text-secondary">Concert at Main Entrance (A)</div>
              </div>

              <div className="flex flex-col gap-2 text-[11px] text-secondary">
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-16 justify-end text-secondary">Redirect</span>
                  <span className="font-medium text-[#eef2f6]">Staff to East Wing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-16 justify-end text-secondary">Status</span>
                  <span className="font-medium text-[#f0f3f5]">High Traffic</span>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary shadow-[0_0_20px_rgba(239,70,70,0.2)]">
                  <MapPin size={22} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LiveCheckinsPage;
