import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import Pagination from "../../../components/Pagination";
import { OrganizerAttendee, organizerAttendeesApi } from "../../../services/organizer_attendees.service";

const PAGE_SIZE = 20;

const StatCard = ({ label, value, progress }: { label: string; value: string; progress?: number }) => (
  <div className="rounded-xl border border-secondary/10 bg-[#131418] p-5"><div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/50">{label}</p><Users size={20} className="text-secondary/20" /></div><span className="font-jakarta text-2xl font-bold text-white md:text-3xl">{value}</span>{progress !== undefined && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/10"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div>}</div>
);

const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const AttendeeList = () => {
  const [attendees, setAttendees] = useState<OrganizerAttendee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [metrics, setMetrics] = useState({ total_attendees: 0, checked_in: 0, check_in_rate: 0, registered_today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadAttendees = useCallback(async (requestedPage: number) => {
    setLoading(true); setError(false);
    const response = await organizerAttendeesApi.list(requestedPage, PAGE_SIZE);
    if (response.ok && response.data) {
      setAttendees(response.data.attendees); setMetrics(response.data.metrics); setTotal(response.data.pagination.total); setTotalPages(response.data.pagination.total_pages); setPage(response.data.pagination.page);
    } else setError(true);
    setLoading(false);
  }, []);

  useEffect(() => { void loadAttendees(page); }, [loadAttendees, page]);

  return <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-4 md:px-6 md:py-6">
    <div><h1 className="font-jakarta text-2xl font-bold text-white md:text-3xl">Attendee List</h1><p className="mt-1 max-w-xl text-sm text-secondary/60">Manage paid ticket holders and track check-in status across your events.</p></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><StatCard label="TOTAL ATTENDEES" value={metrics.total_attendees.toLocaleString()} /><StatCard label="CHECK-IN RATE" value={`${metrics.check_in_rate}%`} progress={metrics.check_in_rate} /><StatCard label="REGISTERED TODAY" value={metrics.registered_today.toLocaleString()} /></div>
    <div className="overflow-hidden rounded-xl border border-secondary/10 bg-[#131418]">
      <div className="flex items-center justify-between gap-3 p-5 md:p-6"><h2 className="font-jakarta text-lg font-bold text-white">Attendee Management</h2><span className="text-xs text-secondary">{metrics.checked_in.toLocaleString()} checked in</span></div>
      {loading ? <p className="p-6 text-sm text-secondary">Loading attendees...</p> : error ? <div className="flex items-center justify-between p-6"><p className="text-sm text-secondary">Unable to load attendees.</p><button onClick={() => void loadAttendees(page)} className="text-xs text-primary">Retry</button></div> : attendees.length === 0 ? <p className="p-6 text-sm text-secondary">No paid attendees found.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr className="border-y border-secondary/10"><th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-secondary/60 md:px-6">Attendee Name</th><th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-secondary/60">Email</th><th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-secondary/60">Event</th><th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-secondary/60">Ticket Type</th><th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-secondary/60">Status</th></tr></thead><tbody>{attendees.map((attendee) => <tr key={attendee.id} className="border-b border-secondary/5 hover:bg-secondary/5"><td className="px-5 py-3.5 md:px-6"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{initials(attendee.name)}</div><span className="text-sm font-medium text-white">{attendee.name}</span></div></td><td className="max-w-[220px] truncate px-4 py-3.5 text-sm text-secondary">{attendee.email}</td><td className="px-4 py-3.5 text-sm text-white">{attendee.event}</td><td className="px-4 py-3.5"><span className="rounded border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">{attendee.ticket_type}</span></td><td className="px-4 py-3.5"><span className={`flex items-center gap-1.5 text-sm font-medium ${attendee.status === "checked_in" ? "text-green-400" : "text-yellow-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${attendee.status === "checked_in" ? "bg-green-400" : "bg-yellow-400"}`} />{attendee.status === "checked_in" ? "Checked In" : "Pending"}</span></td></tr>)}</tbody></table></div>}
      {!loading && !error && total > 0 && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary/10 px-5 py-4 md:px-6"><p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/50">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} attendees</p><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
    </div>
  </div>;
};

export default AttendeeList;
