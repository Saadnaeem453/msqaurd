import { Fragment, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard,
  FiCreditCard,
  FiFileText,
  FiPenTool,
  FiShield,
  FiUser,
  FiX,
  FiCheckCircle,
  FiClock,
  FiMaximize,
} from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { FaGem, FaMosque } from "react-icons/fa";

interface HeaderStat {
  id: string;
  value: string;
  label: string;
  tone: "primary" | "bgray";
}

interface FilterChip {
  id: string;
  label: string;
  removable: boolean;
}

type EntityTone = "info" | "grape" | "amber";
type ThumbnailTone = "greenish" | "secondary" | "info";

interface VerificationDoc {
  id: string;
  label: string;
  icon: IconType;
}

interface VerificationRequest {
  id: string;
  name: string;
  submittedLabel: string;
  requestId: string;
  entityLabel: string;
  entityTone: EntityTone;
  thumbnailIcon: IconType;
  thumbnailTone: ThumbnailTone;
  docs: VerificationDoc[];
}

const TOTAL_REQUESTS = 48;
const REQUESTS_PAGE_SIZE = 12;

const headerStats: HeaderStat[] = [
  { id: "pending", value: "12", label: "Pending Reviews", tone: "primary" },
  { id: "trust", value: "98.2%", label: "Trust Rating", tone: "bgray" },
];

const initialFilterChips: FilterChip[] = [
  { id: "type", label: "Type: All Organizers", removable: true },
  { id: "status", label: "Status: Pending", removable: false },
  { id: "region", label: "Region: Global", removable: false },
  { id: "date", label: "Submission Date", removable: false },
];

const verificationRequests: VerificationRequest[] = [
  {
    id: "VR-9021",
    name: "London Central Masjid",
    submittedLabel: "4h ago",
    requestId: "VR-9021",
    entityLabel: "Masjid / Religious Center",
    entityTone: "info",
    thumbnailIcon: FaMosque,
    thumbnailTone: "greenish",
    docs: [
      { id: "deed", label: "Registration deed", icon: FiFileText },
      { id: "identity", label: "Identity card", icon: FiCreditCard },
      { id: "charter", label: "Governance charter", icon: FiBookOpen },
    ],
  },
  {
    id: "VR-9045",
    name: "UCL Islamic Society",
    submittedLabel: "12h ago",
    requestId: "VR-9045",
    entityLabel: "Student Organization",
    entityTone: "grape",
    thumbnailIcon: FaGem,
    thumbnailTone: "secondary",
    docs: [
      { id: "union", label: "Student union accreditation", icon: MdSchool },
      { id: "safeguarding", label: "Safeguarding policy", icon: FiShield },
    ],
  },
  {
    id: "VR-8992",
    name: "Humanity First Foundation",
    submittedLabel: "1d ago",
    requestId: "VR-8992",
    entityLabel: "Registered Charity",
    entityTone: "amber",
    thumbnailIcon: FiUser,
    thumbnailTone: "info",
    docs: [
      { id: "mandate", label: "Signed mandate", icon: FiPenTool },
      { id: "filing", label: "Charity commission filing", icon: FiClipboard },
    ],
  },
];

const ENTITY_TONE_CLASSES: Record<EntityTone, string> = {
  info: "bg-bgray/10 text-bgray",
  grape: "bg-secondary/10 text-secondary",
  amber: "bg-secondary/15 text-secondary",
};

const THUMBNAIL_TONE_CLASSES: Record<ThumbnailTone, string> = {
  greenish: "text-green",
  secondary: "text-secondary",
  info: "text-bgray",
};

const CriticalAlertCard = () => (
  <section className="relative overflow-hidden rounded-md border border-bgray/10 bg-lightgrayblue/70 p-4">

    <div className="absolute right-12 top-2 flex flex-col gap-1.5" aria-hidden="true">
      <span className="h-2 w-2 rounded-full bg-bgray/20" />
      <span className="h-2 w-2 rounded-full bg-bgray/20" />
    </div>

    <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
      Critical Alert
    </p>
    <h2 className="admin-section-title mt-1 max-w-[200px] font-jakarta text-base font-semibold leading-5 text-bgray">
      3 High-Urgency Requests
    </h2>
    <p className="mt-2 text-xs leading-5 text-secondary/80">
      Applications from large-scale ISOCs pending over 48 hours. High risk of event
      scheduling delays.
    </p>
    <button
      type="button"
      className="mt-4 flex items-center gap-1 text-sm font-semibold text-secondary transition hover:text-bgray"
    >
      Prioritize Queue
      <FiArrowRight size={15} />
    </button>
  </section>
);

interface ActiveFiltersCardProps {
  chips: FilterChip[];
  onRemoveChip: (id: string) => void;
  onClearAll: () => void;
}

const ActiveFiltersCard = ({ chips, onRemoveChip, onClearAll }: ActiveFiltersCardProps) => (
  <section className="rounded-md border border-secondary/20 bg-lightgrayblue p-4">
    <div className="flex items-center justify-between">
      <h2 className="admin-section-title font-jakarta text-xs font-semibold uppercase tracking-wider text-secondary">
        Active Filters
      </h2>
      <button
        type="button"
        onClick={onClearAll}
        className="text-[11px] text-secondary transition hover:text-bgray"
      >
        Clear all filters
      </button>
    </div>

    <div className="mt-2 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.removable ? () => onRemoveChip(chip.id) : undefined}
          className={`flex items-center gap-1 rounded-sm border bg-bgray/5 px-2.5 py-1.5 text-xs text-secondary transition hover:bg-bgray/10 ${
            chip.removable ? "border-secondary" : "border-secondary/30"
          }`}
        >
          {chip.label}
          {chip.removable && <FiX size={14} />}
        </button>
      ))}
    </div>
  </section>
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGE_WINDOW = 3;

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const windowStart = Math.min(
    Math.max(1, currentPage - 1),
    Math.max(1, totalPages - PAGE_WINDOW + 1),
  );
  const pages = Array.from(
    { length: Math.min(PAGE_WINDOW, totalPages) },
    (_, i) => windowStart + i,
  );

  const edgeButton =
    "flex h-6 w-6 items-center justify-center rounded-sm border border-secondary/20 text-bgray/80 transition hover:bg-bgray/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={edgeButton}
      >
        <FiChevronLeft size={12} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-6 w-6 items-center justify-center rounded-sm text-sm transition ${
            page === currentPage
              ? "bg-secondary font-semibold text-grayblue"
              : "border border-secondary/20 text-bgray/80 hover:bg-bgray/10"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={edgeButton}
      >
        <FiChevronRight size={12} />
      </button>
    </div>
  );
};

interface VerificationTableProps {
  rows: VerificationRequest[];
  rangeStart: number;
  rangeEnd: number;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VerificationTable = ({
  rows,
  rangeStart,
  rangeEnd,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: VerificationTableProps) => (
  <section className="overflow-hidden rounded-md border border-secondary/20 bg-lightgrayblue">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] table-fixed text-left">
        <thead>
          <tr className="bg-bgray/10">
            <th className="w-[33%] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Organizer Identity
            </th>
            <th className="w-[23%] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Entity Type
            </th>
            <th className="w-[32%] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Verification Docs
            </th>
            <th className="w-[12%] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const ThumbIcon = row.thumbnailIcon;
            return (
              <tr key={row.id} className="border-t border-secondary/20">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-secondary/20 bg-grayblue ${THUMBNAIL_TONE_CLASSES[row.thumbnailTone]}`}
                    >
                      <ThumbIcon size={18} />
                    </span>
                    <div>
                      <p className="font-jakarta text-sm font-semibold leading-5 text-bgray">
                        {row.name}
                      </p>
                      <p className="text-xs leading-4 text-secondary">
                        Submitted {row.submittedLabel} • ID: {row.requestId}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block max-w-[110px] rounded-sm px-2 py-1 text-[10px] font-bold uppercase leading-snug tracking-wide ${ENTITY_TONE_CLASSES[row.entityTone]}`}
                  >
                    {row.entityLabel}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {row.docs.map((doc) => {
                      const DocIcon = doc.icon;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          aria-label={doc.label}
                          title={doc.label}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-secondary/30 text-secondary transition hover:bg-bgray/10"
                        >
                          <DocIcon size={15} />
                        </button>
                      );
                    })}
                  </div>
                </td>

                <td className="px-4 py-4" />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <div className="flex flex-col gap-3 border-t border-secondary/20 bg-bgray/[0.03] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-secondary/80">
        Showing {rangeStart}-{rangeEnd} of {total} pending requests
      </p>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  </section>
);

const ReviewPreview = () => (
  <section aria-labelledby="review-preview-heading" className="mt-5 flex flex-col gap-4 rounded-md border border-secondary/20 bg-lightgrayblue p-5 sm:flex-row sm:items-start">
    <div aria-label="Dossier cover placeholder" role="img" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border border-secondary/30 bg-grayblue text-secondary/60">
      <FiBookOpen aria-hidden="true" size={30} />
    </div>
    <div className="min-w-0 flex-1">
      <h2 id="review-preview-heading" className="admin-section-title font-jakarta text-base font-semibold leading-6 text-bgray">Review Preview: Charity Commission Status</h2>
      <p className="mt-0.5 text-sm leading-4 text-secondary">
        Automatically cross-referenced with UK Charity Commission DB. Status: ACTIVE. Matching Address found. Verification Confidence: 94%.
      </p>
      <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
        <li className="flex items-center gap-1 text-green"><FiCheckCircle aria-hidden="true" size={10} />Match Found</li>
        <li className="flex items-center gap-1 text-green"><FiCheckCircle aria-hidden="true" size={10} />ID Validated</li>
        <li className="flex items-center gap-1 text-secondary"><FiClock aria-hidden="true" size={10} />Last review: Jan 2023</li>
      </ul>
    </div>
    <button type="button" disabled title="Full dossier document is not connected yet" className="flex shrink-0 items-center justify-center gap-4 self-start rounded-sm border border-secondary/20 bg-bgray/10 px-4 py-2 text-xs leading-4 text-bgray disabled:cursor-not-allowed">
      <FiMaximize aria-hidden="true" size={16} />
      <span>View Full<br />Dossier</span>
    </button>
  </section>
);

const VerificationRequestsPage = () => {
  const [chips, setChips] = useState<FilterChip[]>(initialFilterChips);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_REQUESTS / REQUESTS_PAGE_SIZE);
  const rangeStart = (currentPage - 1) * REQUESTS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * REQUESTS_PAGE_SIZE, TOTAL_REQUESTS);

  return (
    <div className="min-h-full border-t border-secondary/20 bg-grayblue text-bgray [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-secondary">
      <div className="admin-page ">

        <header className="flex flex-col gap-4 min-[600px]:flex-row min-[600px]:items-end min-[600px]:justify-between">
          <div className="max-w-xl min-[600px]:max-w-[68%]">
            <h1 className="admin-page-title">
              Verification Requests
            </h1>
            <p className="admin-page-description">
              Platform trust is critical. Review and verify the identity of community
              organizers to ensure the safety and authenticity of all events listed on
              EventOS.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {headerStats.map((stat, index) => (
              <Fragment key={stat.id}>
                {index > 0 && <div className="h-7 w-px bg-secondary/20" aria-hidden="true" />}
                <div className="text-center">
                  <p
                    className={`text-3xl font-semibold ${
                      stat.tone === "primary" ? "text-secondary" : "text-bgray"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase text-secondary/80">
                    {stat.label}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-4 min-[600px]:grid-cols-[minmax(0,1fr)_minmax(0,2.08fr)]">
          <CriticalAlertCard />
          <div className="min-w-0 [&>section]:h-full">
            <ActiveFiltersCard
              chips={chips}
              onRemoveChip={(id) => setChips((prev) => prev.filter((c) => c.id !== id))}
              onClearAll={() => setChips([])}
            />
          </div>
        </div>

        <div className="mt-5">
          <VerificationTable
            rows={verificationRequests}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            total={TOTAL_REQUESTS}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <ReviewPreview />
      </div>
    </div>
  );
};

export default VerificationRequestsPage;
