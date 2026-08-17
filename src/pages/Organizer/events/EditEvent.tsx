import { useParams, Navigate } from "react-router-dom";
import { useEvent } from "../../../hooks/useEvents";
import { eventToForm } from "../../../utils/eventMapper";
import CreateEvent from "./CreateEvent";

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/organizer/events" replace />;
  }

  return <EditEventContent eventId={id} />;
};

interface EditEventContentProps {
  eventId: string;
}

const EditEventContent = ({ eventId }: EditEventContentProps) => {
  const { event, loading, error } = useEvent(eventId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondary text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-white text-lg font-semibold">
            Failed to load event
          </h2>
          <p className="text-secondary text-sm">{error || "Event not found"}</p>
          <a
            href="/organizer/events"
            className="inline-block mt-4 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to Events
          </a>
        </div>
      </div>
    );
  }

  const formData = eventToForm(event);

  return <CreateEvent editEventId={eventId} initialData={formData} />;
};

export default EditEvent;
