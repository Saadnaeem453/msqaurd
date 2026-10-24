import { useEffect, useState } from "react";
import { FiArrowLeft, FiDownload, FiMapPin, FiShare2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { attendeeTicketApi, AttendeeTicket } from "../../services/attendee_ticket.service";
import { attendeeEventsApi, AttendeeEvent } from "../../services/attendee_events.service";

const DigitalTicketPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<AttendeeTicket | null>(null);
  const [event, setEvent] = useState<AttendeeEvent | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticketId) return;
    let active = true;
    void attendeeTicketApi.list({ page: 1, limit: 100 }).then(async (result) => {
      const found = result.data?.find((item) => item.id === ticketId);
      if (!active || !result.ok || !found) {
        setError(result.detail || "This ticket is unavailable or has not been issued yet.");
        return;
      }
      setTicket(found);
      const eventResult = await attendeeEventsApi.get(found.event.id);
      if (active && eventResult.ok && eventResult.data) setEvent(eventResult.data);
      if (found.status === "valid" || found.status === "checked_in") {
        const blob = await attendeeTicketApi.qr(ticketId);
        if (active) setQrUrl(URL.createObjectURL(blob));
      }
    }).catch(() => setError("Unable to load this ticket."));
    return () => { active = false; };
  }, [ticketId]);

  useEffect(() => () => { if (qrUrl) URL.revokeObjectURL(qrUrl); }, [qrUrl]);

  const download = async () => {
    if (!ticketId) return;
    const blob = await attendeeTicketApi.downloadQr(ticketId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `ticket-${ticketId}.png`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    navigate(`/home/tickets/${ticketId}/wallet`);
  };

  if (error) return <div className="min-h-screen bg-[#101114] p-8 text-center text-sm text-[#aaaab0]">{error}</div>;
  if (!ticket) return <div className="min-h-screen bg-[#101114] p-8 text-center text-sm text-[#aaaab0]">Loading your digital ticket...</div>;

  const active = ticket.status === "valid" || ticket.status === "checked_in";
  return (
    <div className="min-h-screen bg-[#101114] px-4 py-10 font-inter text-[#e8e8eb]">
      <div className="mx-auto max-w-[720px]">
        <button type="button" onClick={() => navigate("/home/tickets")} className="mb-8 flex items-center gap-2 text-xs text-[#aaaab0] hover:text-white"><FiArrowLeft /> Back to My Tickets</button>
        <div className="mx-auto max-w-[294px] overflow-hidden rounded-lg border border-white/10 bg-[#151619] shadow-2xl">
          <div className="relative h-32 bg-gradient-to-br from-[#13252a] via-[#32151a] to-[#17191d] p-5">
            <p className="text-[8px] font-bold uppercase tracking-widest text-[#f20d22]">● Entry Pass Valid</p>
            <h1 className="mt-2 text-lg font-semibold">{event?.title || ticket.event.title}</h1>
          </div>
          <div className="p-5">
            <div className="flex justify-between text-[9px] uppercase tracking-wider text-[#aaaab0]"><span>Ticket Type</span><span>Status</span></div>
            <div className="mt-1 flex justify-between text-xs font-semibold"><span>{ticket.tier.name}</span><span className={active ? "text-green-400" : "text-[#aaaab0]"}>{ticket.status.replace("_", " ")}</span></div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-[10px]"><div><p className="uppercase text-[#77777d]">Date & Time</p><p className="mt-1">{new Date(`${ticket.event.event_date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p><p className="text-[#aaaab0]">{ticket.event.start_time || "Time unavailable"}</p></div><div><p className="uppercase text-[#77777d]">Reference</p><p className="mt-1 break-all">{ticket.ticket_code}</p></div></div>
            <div className="my-6 border-t border-dashed border-white/15 pt-6 text-center">{active && qrUrl ? <img src={qrUrl} alt="Digital ticket QR code" className="mx-auto h-44 w-44 rounded-lg bg-white p-2" /> : <p className="text-xs text-[#77777d]">QR unavailable for this ticket.</p>}<p className="mt-3 font-mono text-[9px] tracking-widest text-[#aaaab0]">{ticket.ticket_code}</p></div>
          </div>
          <div className="flex items-center justify-between bg-[#2a2b2f] px-5 py-4"><button type="button" className="flex items-center gap-2 rounded-full bg-[#f20d22] px-4 py-2 text-[10px] font-bold"><FiShare2 /> Share Pass</button>{active && <button type="button" onClick={() => void download()} className="flex items-center gap-2 text-xs font-semibold"><FiDownload /> Wallet</button>}</div>
        </div>
        <div className="mx-auto mt-5 flex max-w-[294px] items-center gap-3 rounded-lg border border-white/5 bg-[#151619] p-4 text-xs"><FiMapPin className="text-[#f20d22]" /><div><p>{event?.venue_name || event?.venue_type || "Event location"}</p><p className="text-[10px] text-[#77777d]">{event?.street_address || "Event venue"}</p></div></div>
      </div>
    </div>
  );
};

export default DigitalTicketPage;
