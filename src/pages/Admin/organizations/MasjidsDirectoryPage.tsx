import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowUp,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiDownload,
  FiFilter,
  FiMinus,
  FiMoreVertical,
  FiPlus,
  FiStar,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";

/* ============================= Types ============================= */

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  iconTone: "primary" | "greenish" | "neutral";
  delta?: { text: string; icon: IconType };
  note?: string;
}

type Verification = "verified" | "pending";
type MasjidStatus = "active" | "pending";

interface MasjidRow {
  id: string;
  name: string;
  verified: Verification;
  location: string;
  area: string;
  imam: string;
  imamInitials: string;
  capacity: string;
  rating: string;
  reviews: string;
  status: MasjidStatus;
}

type TabId = "all" | "verified" | "pending";

/* ================== Mock data (swap with real API later) ================== */

const statItems: StatItem[] = [
  {
    id: "masjids",
    label: "Total Masjids",
    value: "1,284",
    icon: MdBusiness,
    iconTone: "primary",
    delta: { text: "+12%", icon: FiTrendingUp },
  },
  {
    id: "imams",
    label: "Active Imams",
    value: "942",
    icon: FiUserCheck,
    iconTone: "neutral",
    note: "88% Coverage",
  },
  {
    id: "capacity",
    label: "Total Capacity",
    value: "412.5k",
    icon: FiUsers,
    iconTone: "neutral",
    note: "Global Aggregate",
  },
  {
    id: "verification",
    label: "Verification Rate",
    value: "76.2%",
    icon: FiCheckCircle,
    iconTone: "greenish",
    delta: { text: "+4%", icon: FiArrowUp },
  },
];

const ICON_TONES: Record<StatItem["iconTone"], string> = {
  primary: "bg-secondary/10 text-secondary",
  greenish: "bg-green/10 text-green",
  neutral: "bg-[#181f27] text-bgray/70",
};

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "verified", label: "Verified" },
  { id: "pending", label: "Pending" },
];

const masjidRows: MasjidRow[] = [
  {
    id: "MAS-10294",
    name: "Grand Mosque of London",
    verified: "verified",
    location: "London, UK",
    area: "Regent's Park",
    imam: "Sheikh Ahmed Sulaiman",
    imamInitials: "SA",
    capacity: "5,000",
    rating: "4.9",
    reviews: "(3.1k)",
    status: "active",
  },
  {
    id: "MAS-10442",
    name: "Al-Azhar Center",
    verified: "pending",
    location: "Cairo, Egypt",
    area: "Old City District",
    imam: "Dr. Yusuf Al-Qari",
    imamInitials: "YA",
    capacity: "12,500",
    rating: "4.8",
    reviews: "(5.6k)",
    status: "pending",
  },
  {
    id: "MAS-09821",
    name: "Istanbul Blue Masjid",
    verified: "verified",
    location: "Istanbul, TR",
    area: "Sultanahmet",
    imam: "Sheikh Murat Ozcan",
    imamInitials: "MO",
    capacity: "10,000",
    rating: "5.0",
    reviews: "(12k)",
    status: "active",
  },
  {
    id: "MAS-11200",
    name: "Islamic Unity Center",
    verified: "verified",
    location: "Toronto, CA",
    area: "Downtown Hub",
    imam: "Sheikh Omar Farouk",
    imamInitials: "OF",
    capacity: "2,800",
    rating: "4.7",
    reviews: "(840)",
    status: "active",
  },
];

const STATUS_BADGES: Record<MasjidStatus, { label: string; classes: string }> = {
  active: { label: "Active", classes: "bg-green/15 text-green" },
  pending: { label: "Pending Audit", classes: "bg-yellow-400/10 text-yellow-400" },
};

const TOTAL_ENTRIES = 1284;
const PAGE_SIZE = 4; // matches "Showing 1-4" in the design

/* ============================= Page ============================= */

const MasjidsDirectoryPage = () => {
  const detailDialog = useRef<HTMLDialogElement>(null);
  const [selectedMasjid, setSelectedMasjid] = useState<MasjidRow | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const visibleRows = useMemo(
    () =>
      masjidRows.filter((row) =>
        activeTab === "all" ? true : row.verified === activeTab,
      ),
    [activeTab],
  );

  useEffect(() => {
    if (selectedMasjid) detailDialog.current?.showModal();
    else detailDialog.current?.close();
  }, [selectedMasjid]);

  const totalPages = Math.ceil(TOTAL_ENTRIES / PAGE_SIZE);
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, TOTAL_ENTRIES);

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-bgray lg:text-3xl">
                Masjids Directory
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-secondary">
                Manage global mosque organizations and community verified centers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-sm bg-[#252c36] px-5 py-2.5 text-xs font-normal text-bgray transition hover:bg-bgray/15"
              >
                <FiDownload size={13} />
                Export
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-normal text-bgray transition hover:bg-primary/90"
              >
                <FiPlus size={13} />
                Add New Masjid
              </button>
            </div>
          </header>

          {/* Stat cards */}
          <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => {
              const Icon = item.icon;
              const DeltaIcon = item.delta?.icon;
              return (
                <div key={item.id} className="min-h-[110px] rounded-md border border-bgray/[0.02] bg-[#151c24] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-medium uppercase tracking-wider text-secondary/70">
                      {item.label}
                    </span>
                    <span className={`rounded-sm p-1 ${ICON_TONES[item.iconTone]}`}><Icon size={14} /></span>
                  </div>
                  <p className="mt-2 flex flex-wrap items-baseline gap-2 text-2xl font-semibold tracking-tight text-bgray">
                    {item.value}
                    {item.delta && DeltaIcon && (
                      <span className="flex items-center gap-0.5 text-[9px] font-semibold text-green">
                        <DeltaIcon size={10} />
                        {item.delta.text}
                      </span>
                    )}
                    {item.note && (
                      <span className="max-w-[70px] text-[9px] font-normal leading-snug text-secondary/50">
                        {item.note}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Directory table */}
          <section className="mt-7 overflow-hidden rounded-md border border-bgray/[0.02] bg-[#151c24]">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1b232b] px-5 py-5">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-base font-medium text-bgray">
                  Registered Masjids
                </h2>
                <div className="flex items-center gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                      aria-pressed={activeTab === tab.id}
                      className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide transition ${
                        activeTab === tab.id
                          ? "bg-[#303741] text-secondary"
                          : "text-secondary/50 hover:text-bgray"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Filter" className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                  <FiFilter size={14} />
                </button>
                <button type="button" aria-label="More options" className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                  <FiMoreVertical size={14} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] table-fixed text-left">
                <thead>
                  <tr className="bg-[#181f27]">
                    <th className="w-[22%] px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Masjid Name
                    </th>
                    <th className="w-[14%] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Location
                    </th>
                    <th className="w-[16%] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Imam / POC
                    </th>
                    <th className="w-[10%] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Capacity
                    </th>
                    <th className="w-[12%] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Rating
                    </th>
                    <th className="w-[14%] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Status
                    </th>
                    <th className="w-[8%] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-secondary/60">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => {
                    const badge = STATUS_BADGES[row.status];
                    return (
                      <tr key={row.id} className="border-t border-bgray/[0.015] transition hover:bg-bgray/[0.02]">
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2.5">
                            {/* Photo placeholder — swap for <img> on API integration */}
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-bgray/10 text-secondary">
                              <MdBusiness size={14} />
                            </span>
                            <div>
                              <p className="flex items-center gap-1.5 text-xs font-normal leading-snug text-bgray">
                                {row.name}
                                {row.verified === "verified" ? (
                                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-secondary" title="Verified">
                                    <FiCheck size={8} className="text-grayblue" />
                                  </span>
                                ) : (
                                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-bgray/20" title="Pending verification">
                                    <FiMinus size={8} className="text-bgray/70" />
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 text-[9px] text-secondary/50">
                                ID: {row.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span className="block max-w-[70px] text-xs leading-snug text-bgray/90">
                            {row.location}
                          </span>
                          <span className="mt-0.5 block max-w-[70px] text-[9px] leading-snug text-secondary/50">
                            {row.area}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bgray/10 text-[7px] font-bold text-bgray/80">
                              {row.imamInitials}
                            </span>
                            <span className="block max-w-[80px] text-xs leading-snug text-bgray/90">
                              {row.imam}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-5 text-xs text-bgray">{row.capacity}</td>
                        <td className="px-4 py-5">
                          <span className="flex items-baseline gap-1">
                            <FiStar size={11} className="fill-secondary text-secondary" />
                            <span className="text-xs font-normal text-bgray">{row.rating}</span>
                            <span className="text-[9px] text-secondary/50">{row.reviews}</span>
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`inline-block rounded-none px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <button
                            type="button"
                            aria-label={`Open ${row.name}`}
                            onClick={() => setSelectedMasjid(row)}
                            className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray"
                          >
                            <FiChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
              <p className="text-xs text-secondary/50">
                Showing{" "}
                <span className="font-bold text-bgray">
                  {(currentPage - 1) * PAGE_SIZE + 1}-{rangeEnd}
                </span>{" "}
                of <span className="font-bold text-bgray">{TOTAL_ENTRIES.toLocaleString("en-US")}</span>{" "}
                entries
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-secondary/50 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft size={13} />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition ${
                      page === currentPage
                        ? "bg-primary font-bold text-bgray"
                        : "text-secondary/50 hover:text-bgray"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 3 && (
                  <span className="flex h-7 w-7 items-center justify-center text-xs text-secondary/50">
                    …
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-bgray transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronRight size={13} />
                </button>
              </div>
            </div>
          </section>
      </div>
      <dialog ref={detailDialog} aria-labelledby="masjid-detail-title" onClose={() => setSelectedMasjid(null)} className="w-[calc(100%-2rem)] max-w-lg rounded-md border border-bgray/10 bg-[#151c24] p-6 text-bgray shadow-xl backdrop:bg-black/70">
        {selectedMasjid && <>
          <div className="flex items-start justify-between gap-4"><h2 id="masjid-detail-title" className="text-xl">{selectedMasjid.name}</h2><button autoFocus type="button" aria-label="Close masjid details" onClick={() => setSelectedMasjid(null)}><FiX size={20} /></button></div>
          <p className="mt-2 text-xs text-secondary">ID: {selectedMasjid.id}</p>
          <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">{[["Location", `${selectedMasjid.location}, ${selectedMasjid.area}`], ["Imam / POC", selectedMasjid.imam], ["Capacity", selectedMasjid.capacity], ["Rating", `${selectedMasjid.rating} ${selectedMasjid.reviews}`], ["Verification", selectedMasjid.verified], ["Status", STATUS_BADGES[selectedMasjid.status].label]].map(([label, value]) => <div key={label}><dt className="text-xs text-secondary/60">{label}</dt><dd className="mt-1 capitalize">{value}</dd></div>)}</dl>
        </>}
      </dialog>
    </div>
  );
};

export default MasjidsDirectoryPage;
