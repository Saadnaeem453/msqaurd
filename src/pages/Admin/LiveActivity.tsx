import { useEffect, useState } from "react";
import { ShieldHalf, ShoppingCart, UserCheck, OctagonAlert, PlusCircle, SquarePen, CircleCheck, Gauge, Users, Ticket } from "lucide-react";
const transactionsData = [
  {
    id: "t1",
    icon: "cart" as const,
    description: "Alex M. bought 2 tickets",
    sub: "Cyberpunk Neon Festival 2024",
    amount: "$142.00",
    time: "JUST NOW",
    timeHighlight: true,
  },
  {
    id: "t2",
    icon: "entry" as const,
    description: "User #8291 Checked In",
    sub: "London Underground: Bass Session",
    amount: "ENTRY",
    time: "1M AGO",
    timeHighlight: false,
  },
  {
    id: "t3",
    icon: "cart" as const,
    description: "Sarah K. bought 1 ticket",
    sub: "Sunset Beach Party – VIP",
    amount: "$85.00",
    time: "2M AGO",
    timeHighlight: false,
  },
  {
    id: "t4",
    icon: "entry" as const,
    description: "User #1102 Checked In",
    sub: "Global Dev Summit 2024",
    amount: "ENTRY",
    time: "3M AGO",
    timeHighlight: false,
  },
];

const moderationData = [
  {
    id: "m1",
    icon: "alert" as const,
    title: "Inappropriate Content Report",
    priority: "URGENT",
    description:
      'Event: "Wild Night Out" contains unverified imagery. Reported by User #120.',
    actions: ["Review", "Dismiss"],
  },
  {
    id: "m2",
    icon: "event" as const,
    title: "New Event Created",
    priority: null,
    description:
      '"Quantum Computing Expo" created by Microsoft Org.',
    time: "5M AGO",
  },
  {
    id: "m3",
    icon: "venue" as const,
    title: "Venue Changed",
    priority: null,
    description:
      '"Jazz on the Hill" moved to "Indoor Amphitheater" due to weather.',
    time: "12M AGO",
  },
];

const mapDots = [
  { x: 20.4, y: 35.2 }, { x: 52.3, y: 30.3 },
  { x: 75.3, y: 40.3 }, { x: 45.2, y: 55.5 },
  { x: 15.4, y: 70 }, { x: 82.2, y: 65.5 },
];

const MapVisualization = () => (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-grayblue">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_34%,var(--tw-gradient-from),var(--tw-gradient-to)_75%)] from-bgray/25 to-grayblue" />
    {mapDots.map((dot, index) => (
      <span key={index} className="absolute h-[3px] w-[3px] rounded-full bg-secondary/60" style={{ left: `${dot.x}%`, top: `${dot.y}%` }} />
    ))}
  </div>
);

const localTime = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

const LiveActivity = () => {
  const [currentTime, setCurrentTime] = useState(localTime);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(localTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="admin-page bg-grayblue text-bgray">
      <header className="mb-[23px] flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Live Activity Monitor</h1>
          <p className="admin-page-description">Real-time ecosystem pulse and system performance metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 items-center gap-2 rounded-[3px] bg-lightgrayblue px-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-secondary">Uptime</span>
            <span className="text-[12px] text-secondary">99.998%</span>
          </div>
          <div className="flex h-7 items-center gap-2 rounded-[3px] bg-lightgrayblue px-3">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-secondary">Local Time</span>
            <time className="text-[12px] tabular-nums">{currentTime}</time>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 min-[680px]:grid-cols-[minmax(0,2.05fr)_minmax(0,1fr)]">
        <section aria-labelledby="attendance-heading" className="relative h-[310px] overflow-hidden rounded-[5px] border border-border_color/40">
          <MapVisualization />
          <div className="absolute left-3 top-[10px]">
            <h2 id="attendance-heading" className="admin-section-title font-jakarta text-[16px] font-semibold leading-6">Live Attendance Map</h2>
            <p className="mt-1 inline-flex items-center gap-[5px] bg-lightgrayblue/60 px-[6px] py-[2px] text-[10px] leading-4 text-secondary">
              <span className="h-[6px] w-[6px] rounded-full bg-secondary" />Real-time geo-clustering active
            </p>
          </div>
          <dl className="absolute bottom-3 right-3 flex gap-[6px]">
            <div className="rounded-[3px] border border-bgray/5 bg-lightgrayblue px-2 py-[6px]">
              <dt className="text-[10px] font-semibold uppercase leading-[14px] text-secondary">Top Region</dt>
              <dd className="text-[12px] font-medium leading-[18px]">North America</dd>
            </div>
            <div className="rounded-[3px] border border-bgray/5 bg-lightgrayblue px-2 py-[6px]">
              <dt className="text-[10px] font-semibold uppercase leading-[14px] text-secondary">Active Clusters</dt>
              <dd className="text-[12px] font-medium leading-[18px]">1,242</dd>
            </div>
          </dl>
        </section>

        <div className="grid grid-cols-1 gap-3 min-[680px]:block">
          <section aria-labelledby="requests-heading" className="min-h-[105px] rounded-md bg-lightgrayblue p-[15px]">
            <div className="flex items-center justify-between gap-1">
              <h2 id="requests-heading" className="admin-section-title font-jakarta text-[10px] font-medium uppercase leading-4 text-secondary">Requests Per Second</h2>
              <Gauge aria-hidden="true" size={14} className="text-secondary" />
            </div>
            <p className="flex items-baseline gap-1 leading-[27px]"><span className="text-[20px] font-medium">12,841</span><span className="text-[12px] text-green">+4.2%</span></p>
            <div role="img" aria-label="Requests per second over seven intervals" className="flex h-[29px] items-end gap-[3px]">
              {[15, 22, 10, 25, 20, 29, 23].map((height, index) => <span key={index} className="flex-1 rounded-t-[1px] bg-secondary/10" style={{ height }} />)}
            </div>
          </section>
          <section aria-labelledby="payment-heading" className="min-h-[83px] rounded-md bg-lightgrayblue p-[15px] min-[680px]:mt-3">
            <div className="flex items-center justify-between gap-1">
              <h2 id="payment-heading" className="admin-section-title font-jakarta text-[10px] font-medium uppercase leading-4 text-secondary">Payment Success Rate</h2>
              <CircleCheck aria-hidden="true" size={14} className="text-green" />
            </div>
            <p className="flex items-baseline gap-1 leading-[27px]"><span className="text-[20px] font-medium">98.4%</span><span className="text-[12px] text-secondary">Stable</span></p>
            <div role="progressbar" aria-label="Payment success rate" aria-valuemin={0} aria-valuemax={100} aria-valuenow={98.4} className="h-[5px] overflow-hidden rounded-full bg-green/10">
              <div className="h-full w-[98.4%] bg-green" />
            </div>
          </section>
          <section aria-labelledby="sessions-heading" className="min-h-[89px] rounded-md bg-lightgrayblue p-[15px] min-[680px]:mt-3">
            <div className="flex items-center justify-between gap-1">
              <h2 id="sessions-heading" className="admin-section-title font-jakarta text-[10px] font-medium uppercase leading-4 text-secondary">Active Sessions</h2>
              <Users aria-hidden="true" size={14} className="text-secondary" />
            </div>
            <p className="text-[20px] font-medium leading-[27px]">142,009</p>
            <p className="text-[10px] leading-[15px] text-secondary">Across 14 regions and 200+ organizations.</p>
          </section>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 min-[680px]:grid-cols-2">
        <section aria-labelledby="transactions-heading" className="overflow-hidden rounded-[5px] bg-lightgrayblue">
          <header className="flex min-h-11 flex-wrap items-center justify-between gap-2 bg-bgray/5 px-4 py-3">
            <h2 id="transactions-heading" className="admin-section-title flex items-center gap-[6px] font-jakarta text-[16px] font-semibold leading-6"><Ticket aria-hidden="true" size={13} className="text-secondary" />Live Transaction Feed</h2>
            <span className="text-[10px] uppercase text-secondary">Streaming Live</span>
          </header>
          <ul className="space-y-3 p-3">
            {transactionsData.map((tx) => (
              <li key={tx.id} className="flex min-h-[46px] items-center gap-3 rounded-[2px] bg-grayblue/40 px-2 py-[9px]">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] ${tx.icon === "cart" ? "bg-green/10 text-green" : "bg-secondary/10 text-secondary"}`}>
                  {tx.icon === "cart" ? <ShoppingCart aria-hidden="true" size={16} /> : <UserCheck aria-hidden="true" size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium leading-[17px]">{tx.description}</p>
                  <p className="text-[11px] leading-4 text-secondary">{tx.sub}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-[12px] leading-[17px] ${tx.icon === "entry" ? "text-green" : "text-secondary"}`}>{tx.amount}</p>
                  <p className="text-[10px] leading-[14px] text-secondary">{tx.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="moderation-heading" className="overflow-hidden rounded-[5px] bg-lightgrayblue">
          <header className="flex min-h-11 flex-wrap items-center justify-between gap-2 bg-bgray/5 px-4 py-3">
            <h2 id="moderation-heading" className="admin-section-title flex items-center gap-[6px] font-jakarta text-[16px] font-semibold leading-6"><ShieldHalf aria-hidden="true" size={13} className="text-secondary" />Moderation Queue</h2>
            <span className="rounded-[2px] bg-secondary/20 px-[6px] py-[2px] text-[10px] font-medium uppercase text-secondary">2 Pending Reports</span>
          </header>
          <ul className="space-y-3 p-3">
            {moderationData.map((item) => (
              <li key={item.id} className={`rounded-[2px] bg-grayblue/40 px-[9px] py-[9px] ${item.priority ? "border-l-[3px] border-secondary" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-secondary/10 text-secondary">
                    {item.icon === "alert" ? <OctagonAlert aria-hidden="true" size={15} /> : item.icon === "event" ? <PlusCircle aria-hidden="true" size={15} /> : <SquarePen aria-hidden="true" size={15} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-jakarta text-[11px] font-bold leading-[18px]">{item.title}</h3>
                      {item.priority && <span className="text-[10px] leading-[18px] text-secondary">{item.priority}</span>}
                    </div>
                    <p className="mt-[2px] text-[11px] leading-4 text-secondary">{item.description}</p>
                    {item.actions && <div className="mt-2 flex gap-[5px]">
                      {item.actions.map((action) => <button key={action} type="button" className="rounded-[2px] bg-bgray/10 px-[9px] py-[3px] text-[11px] leading-4 transition-colors hover:bg-bgray/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">{action}</button>)}
                    </div>}
                    {item.time && <p className="mt-[6px] text-[10px] leading-[14px] text-secondary">{item.time}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LiveActivity;
