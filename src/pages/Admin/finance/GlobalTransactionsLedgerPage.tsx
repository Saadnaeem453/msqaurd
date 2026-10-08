import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiDownload,
  FiEye,
  FiFilter,
  FiFlag,
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";

interface FilterCard {
  id: string;
  label: string;
  value: string;
  icon: IconType;
  iconTone: "secondary" | "foreground";
}

type TxStatus = "success" | "failed" | "pending";

interface TransactionRow {
  id: string;
  rowIcon?: IconType;
  userName: string;
  initials: string;
  userMeta: string;
  amount: string;
  fee: string;
  status: TxStatus;
  timestamp: string;
  action: string;
  alert?: boolean;
}

interface PerfStat {
  id: string;
  label: string;
  value: string;
  valueTone: "foreground" | "secondary";
  footer: string;
  footerTone: "green" | "muted" | "secondary";
  footerIcon?: IconType;
}

interface AlertItem {
  id: string;
  icon: IconType;
  title: string;
  meta: string;
  time: string;
  highlighted: boolean;
}

const TOTAL_TRANSACTIONS = 12408;
const TOTAL_PAGES = 450;

const filterCards: FilterCard[] = [
  { id: "range", label: "Date Range", value: "Last 30 Days", icon: FiCalendar, iconTone: "secondary" },
  { id: "status", label: "Status", value: "All States", icon: FiFilter, iconTone: "foreground" },
  { id: "method", label: "Payment Method", value: "Visa / MC / Crypto", icon: FiCreditCard, iconTone: "secondary" },
  { id: "type", label: "Transaction Type", value: "Primary Sales", icon: FiShoppingBag, iconTone: "secondary" },
];

const transactionRows: TransactionRow[] = [
  {
    id: "#TRX-882190",
    rowIcon: FiEye,
    userName: "Elena L.",
    initials: "EL",
    userMeta: "Organizer: Neon Nights",
    amount: "$1,450.00",
    fee: "$43.50",
    status: "success",
    timestamp: "Oct 24, 14:02:11",
    action: "View Ledger Details",
  },
  {
    id: "#TRX-882188",
    rowIcon: FiAlertTriangle,
    userName: "Anonymous User",
    initials: "AU",
    userMeta: "IP: 192.168.1.1 (Proxy)",
    amount: "$5,000.00",
    fee: "$150.00",
    status: "failed",
    timestamp: "Oct 24, 13:58:45",
    action: "Review Risk",
    alert: true,
  },
  {
    id: "#TRX-882185",
    userName: "Marcus Chen",
    initials: "MC",
    userMeta: "General Entry Tier",
    amount: "$120.00",
    fee: "$3.60",
    status: "pending",
    timestamp: "Oct 24, 13:42:01",
    action: "View Ledger Details",
  },
  {
    id: "#TRX-882181",
    userName: "Sofia G.",
    initials: "SG",
    userMeta: "VIP All-Access Pass",
    amount: "$2,200.00",
    fee: "$66.00",
    status: "success",
    timestamp: "Oct 24, 13:15:30",
    action: "View Ledger Details",
  },
  {
    id: "#TRX-882179",
    userName: "Kevin Baker",
    initials: "KB",
    userMeta: "Backstage Premium",
    amount: "$850.00",
    fee: "$25.50",
    status: "success",
    timestamp: "Oct 24, 12:58:12",
    action: "View Ledger Details",
  },
];

const STATUS_CLASSES: Record<TxStatus, string> = {
  success: "border border-green/20 bg-green/10 text-green",
  failed: "bg-primary/15 text-secondary",
  pending: "bg-report-control text-bgray/80",
};

const perfStats: PerfStat[] = [
  {
    id: "volume",
    label: "Gross Volume",
    value: "$2.48M",
    valueTone: "foreground",
    footer: "+12.4%",
    footerTone: "green",
    footerIcon: FiTrendingUp,
  },
  {
    id: "fees",
    label: "Fees Collected",
    value: "$74,402",
    valueTone: "secondary",
    footer: "Base rate 3.0%",
    footerTone: "muted",
  },
  {
    id: "success",
    label: "Success Rate",
    value: "99.1%",
    valueTone: "foreground",
    footer: "0.9% Risk Flag",
    footerTone: "secondary",
    footerIcon: FiFlag,
  },
];

const alertItems: AlertItem[] = [
  {
    id: "a1",
    icon: FiAlertCircle,
    title: "High-Value Failed Transaction",
    meta: "TRX-882188: $5,000 flagged for manual review.",
    time: "2 mins ago",
    highlighted: true,
  },
  {
    id: "a2",
    icon: FiRefreshCw,
    title: "Payout Triggered",
    meta: "Batch #902 released to 14 organizers.",
    time: "45 mins ago",
    highlighted: false,
  },
  {
    id: "a3",
    icon: FiDownload,
    title: "Audit Export Generated",
    meta: "Quarterly Financial Ledger downloaded by Admin_01.",
    time: "2 hours ago",
    highlighted: false,
  },
];

const GlobalTransactionsLedgerPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const rangeStart = (currentPage - 1) * 5 + 1;
  const rangeEnd = currentPage * 5;

  const pageItems: (number | "ellipsis")[] =
    currentPage <= 3 ? [1, 2, 3, "ellipsis", TOTAL_PAGES] : currentPage >= TOTAL_PAGES - 2 ? [1, "ellipsis", TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES] : [1, "ellipsis", currentPage, "ellipsis", TOTAL_PAGES];

  return (
    <div className="min-h-full bg-grayblue font-jakarta font-normal text-bgray">
      <div className="admin-page ">

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="admin-page-title">
              Global Transactions Ledger
            </h1>
            <p className="admin-page-description">
              Real-time audit trail for all ecosystem payments and transfers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-report-control px-4 py-2 text-xs font-normal text-bgray transition hover:bg-report-control"
            >
              <FiDownload size={13} />
              Export CSV
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-normal text-bgray transition hover:bg-primary/90"
            >
              <FiPlus size={13} />
              Manual Entry
            </button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filterCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                className="flex items-center justify-between gap-3 rounded-[4px] border border-bgray/10 bg-report-head p-4 text-left transition hover:bg-report-panel"
              >
                <div>
                  <p className="text-xs font-normal uppercase tracking-wider text-bgray/80">
                    {card.label}
                  </p>
                  <p className="mt-2 text-xs text-bgray/90">{card.value}</p>
                </div>
                <Icon
                  size={16}
                  className={card.iconTone === "secondary" ? "text-secondary" : "text-bgray/70"}
                />
              </button>
            );
          })}
        </section>

        <section className="mt-5 overflow-hidden rounded-[4px] border border-bgray/5 bg-report-head">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] table-fixed text-left">
              <thead>
                <tr className="bg-report-panel">
                  <th className="w-[15%] px-5 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    Transaction ID
                  </th>
                  <th className="w-[22%] px-4 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    User / Organizer
                  </th>
                  <th className="w-[12%] px-4 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    Amount
                  </th>
                  <th className="w-[12%] px-4 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    Platform Fee
                  </th>
                  <th className="w-[12%] px-4 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    Status
                  </th>
                  <th className="w-[14%] px-4 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    Timestamp
                  </th>
                  <th className="w-[13%] px-4 py-3.5 text-xs font-normal uppercase tracking-wider text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionRows.map((row) => {
                  const RowIcon = row.rowIcon;
                  return (
                    <tr
                      key={row.id}
                      className={`border-t border-bgray/5 ${
                        row.alert ? "bg-primary/[0.035]" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2">
                          <span className="break-words text-sm font-normal text-secondary">{row.id}</span>
                          {RowIcon && <RowIcon size={12} className="text-secondary" />}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-report-control text-[10px] font-normal text-bgray/80">
                            {row.initials}
                          </span>
                          <div>
                            <p className="text-sm font-normal text-bgray">{row.userName}</p>
                            <p className="mt-0.5 max-w-[110px] text-xs leading-snug text-secondary/70">
                              {row.userMeta}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-normal text-bgray">{row.amount}</td>
                      <td className="px-4 py-4 text-xs text-bgray/80">{row.fee}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-sm px-2 py-1 text-[10px] font-normal uppercase tracking-wide ${STATUS_CLASSES[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block max-w-[64px] text-xs leading-snug text-bgray/80">
                          {row.timestamp}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="max-w-[90px] text-center text-sm font-normal leading-snug text-secondary transition hover:underline"
                        >
                          {row.action}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-bgray/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-secondary/70">
              Showing{" "}
              <span className="font-normal text-bgray">
                {rangeStart} - {rangeEnd}
              </span>{" "}
              of{" "}
              <span className="font-normal text-bgray">
                {TOTAL_TRANSACTIONS.toLocaleString("en-US")}
              </span>{" "}
              transactions
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-sm text-secondary/70 transition hover:text-bgray disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={13} />
              </button>
              {pageItems.map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-8 items-center justify-center text-xs text-secondary/70"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    aria-current={item === currentPage ? "page" : undefined}
                    className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs transition ${
                      item === currentPage
                        ? "bg-report-alert font-normal text-grayblue"
                        : item === TOTAL_PAGES
                          ? "border border-border_color text-bgray/80 hover:bg-report-control"
                          : "text-secondary/70 hover:text-bgray"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === TOTAL_PAGES}
                onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-sm text-bgray transition hover:bg-report-control disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

          <div className="relative min-h-[350px] overflow-hidden rounded-[4px] border border-bgray/5 bg-report-panel p-5 lg:col-span-2">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Net Platform Performance
            </h2>
            <FiCheck
              size={62}
              className="absolute right-5 top-4 text-bgray/10"
              aria-hidden="true"
            />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-bgray/10">
              {perfStats.map((stat) => {
                const FooterIcon = stat.footerIcon;
                return (
                  <div key={stat.id} className="sm:pl-4 sm:first:pl-0">
                    <p className="text-xs font-normal uppercase tracking-wider text-bgray/80">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-2 text-xl font-normal tracking-tight ${
                        stat.valueTone === "secondary" ? "text-secondary" : "text-bgray"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-xs ${
                        stat.footerTone === "green"
                          ? "font-normal text-green"
                          : stat.footerTone === "secondary"
                            ? "font-normal text-secondary"
                            : "text-secondary/70"
                      }`}
                    >
                      {FooterIcon && <FooterIcon size={11} />}
                      {stat.footer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[4px] border border-bgray/5 bg-report-panel p-5">
            <h2 className="admin-section-title font-jakarta text-base font-normal text-bgray">
              Critical Alerts
            </h2>
            <ul className="mt-4 space-y-3">
              {alertItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.id}
                    className={`flex items-start gap-3 rounded-sm p-3 ${
                      item.highlighted ? "bg-primary/10" : ""
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        item.highlighted
                          ? "bg-primary/20 text-secondary"
                          : "bg-report-control text-bgray/70"
                      }`}
                    >
                      <Icon size={12} />
                    </span>
                    <div>
                      <p className="max-w-[180px] text-sm font-normal leading-snug text-bgray">
                        {item.title}
                      </p>
                      <p className="mt-1 max-w-[220px] text-xs leading-snug text-secondary/70">
                        {item.meta}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-secondary/70">
                        {item.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GlobalTransactionsLedgerPage;
