import { EventFormData } from "../../../pages/Organizer/events/CreateEvent";
import { useState, useRef, useMemo, useEffect } from "react";
import { Users, Plus, Calendar, MoreVertical, UserPlus, Lightbulb, User, Clock, X } from "lucide-react";
import CustomDropdown from "../../ui/CustomDropdown";

interface Props {
  data: EventFormData;
  updateData: (data: Partial<EventFormData>) => void;
}

const PLACEHOLDER_SPEAKER_PHOTO = "https://via.placeholder.com/60";

const resolveSpeakerPhotoSrc = (
  speaker: EventFormData["speakers"][number]
): string | null => {
  if (speaker.photo instanceof Blob) {
    return URL.createObjectURL(speaker.photo);
  }
  if (typeof speaker.photo_url === "string" && speaker.photo_url.trim()) {
    return speaker.photo_url;
  }
  return null;
};

const SpeakersStep = ({ data, updateData }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState<number | null>(null);
  const [showAddAgendaForm, setShowAddAgendaForm] = useState(false);

  const speakerPhotoSrcs = useMemo(
    () =>
      data.speakers.map((speaker) => {
        return resolveSpeakerPhotoSrc(speaker) ?? PLACEHOLDER_SPEAKER_PHOTO;
      }),
    [data.speakers]
  );

  useEffect(() => {
    const blobUrls = data.speakers
      .map((speaker, index) =>
        speaker.photo instanceof Blob ? speakerPhotoSrcs[index] : null
      )
      .filter((url): url is string => url !== null);

    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [data.speakers, speakerPhotoSrcs]);

  const [newAgenda, setNewAgenda] = useState({
    time: "",
    duration: "",
    title: "",
    type: "Lecture",
    speaker: "",
    description: "",
  });


  const addSpeaker = () => {
    updateData({
      speakers: [...data.speakers, { name: "", title: "", bio: "", photo: null }],
    });
    setEditingSpeakerIndex(data.speakers.length);
  };

  const updateSpeaker = (index: number, field: string, value: string) => {
    const updated = [...data.speakers];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ speakers: updated });
  };

  const removeSpeaker = (index: number) => {
    const updated = data.speakers.filter((_, i) => i !== index);
    updateData({ speakers: updated });
    if (editingSpeakerIndex === index) setEditingSpeakerIndex(null);
  };

  const saveSpeaker = (index: number) => {
    setEditingSpeakerIndex(null);
  };

  const handlePhotoUpload = (index: number, file: File) => {
    const updated = [...data.speakers];
    updated[index] = { ...updated[index], photo: file };
    updateData({ speakers: updated });
  };


  const addAgendaItem = () => {
    if (newAgenda.title && newAgenda.time) {
      updateData({ agenda: [...data.agenda, newAgenda] });
      setNewAgenda({ time: "", duration: "", title: "", type: "Lecture", speaker: "", description: "" });
      setShowAddAgendaForm(false);
    }
  };

  const removeAgendaItem = (index: number) => {
    const updated = data.agenda.filter((_, i) => i !== index);
    updateData({ agenda: updated });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const typeColors: Record<string, string> = {
    Lecture: "text-primary bg-primary/10 border-primary/20",
    Workshop: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Networking: "text-green-400 bg-green-400/10 border-green-400/20",
    Panel: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    Break: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white">Speaker & Agenda</h3>
        <p className="text-gray-400 text-sm mt-1">
          Define the core content of your event. Add session details and guest speaker profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-[#131418] border border-[#292a2b] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h4 className="text-white font-semibold text-lg">Guest Speakers</h4>
            </div>
            <button
              onClick={addSpeaker}
              className="flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="space-y-3">
            {data.speakers.map((speaker, idx) => (
              <div
                key={idx}
                className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-3 relative group"
              >
                {editingSpeakerIndex === idx ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={speakerPhotoSrcs[idx]}
                          alt="Speaker"
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#292a2b]"
                        />
                        <label className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer border-2 border-[#0d0e12]">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(idx, file);
                            }}
                          />
                          <Plus className="w-3 h-3 text-white" />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Speaker name"
                          value={speaker.name}
                          onChange={(e) => updateSpeaker(idx, "name", e.target.value)}
                          className="w-full bg-transparent border border-[#292a2b] rounded px-3 py-1.5 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Title / Role"
                          value={speaker.title}
                          onChange={(e) => updateSpeaker(idx, "title", e.target.value)}
                          className="w-full bg-transparent border border-[#292a2b] rounded px-3 py-1.5 text-primary text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Speaker bio"
                      value={speaker.bio}
                      onChange={(e) => updateSpeaker(idx, "bio", e.target.value)}
                      className="w-full bg-transparent border border-[#292a2b] rounded px-3 py-1.5 text-gray-400 text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveSpeaker(idx)}
                        className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition-colors"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => removeSpeaker(idx)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => setEditingSpeakerIndex(idx)}
                  >
                    <img
                      src={speakerPhotoSrcs[idx]}
                      alt={speaker.name || "Speaker"}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#292a2b]"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {speaker.name || "Unnamed Speaker"}
                          </p>
                          <p className="text-primary text-xs font-medium">
                            {speaker.title || "Title not set"}
                          </p>
                        </div>
                        <button
                          className="text-gray-500 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {speaker.bio || "Click to add profile"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addSpeaker}
              className="w-full border-2 border-dashed border-[#292a2b] rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors group"
            >
              <UserPlus className="w-8 h-8 text-gray-500 group-hover:text-primary transition-colors" />
              <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                Click to add profile
              </span>
            </button>
          </div>

          <div className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-500 text-xs font-semibold uppercase tracking-wider">
                  Pro Tip
                </p>
                <p className="text-gray-400 text-sm">
                  Adding speaker photos increases registration rates by 40%. High-resolution headshots with plain backgrounds work best.
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-[#1a1b1f] border border-[#292a2b] rounded-lg p-6 space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <h4 className="text-white font-semibold text-lg">Event Agenda</h4>
                {data.eventDate && (
                  <p className="text-gray-400 text-xs">
                    {formatDate(data.eventDate)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-gray-400 text-xs bg-transparent border border-[#292a2b] hover:bg-[#292a2b] transition-colors px-3 py-1.5 rounded">
                Auto-Align
              </button>
              <button
                onClick={() => setShowAddAgendaForm(true)}
                className="flex items-center gap-1 bg-primary hover:bg-primary/80 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Session
              </button>
            </div>
          </div>


          <div className="space-y-0 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.agenda.map((item, idx) => (
              <div key={idx} className="flex gap-4 relative">

                <div className="flex flex-col items-center min-w-[75px] relative">
                  <div className="text-white text-sm font-semibold">{item.time}</div>
                  <div className="text-gray-400 text-[11px] font-medium">{item.duration}</div>

                  {idx < data.agenda.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%+4px)] bg-[#292a2b]"></div>
                  )}

                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 border-2 border-[#1a1b1f] relative z-10 mt-0.5"></div>
                </div>


                <div className="flex-1 bg-[#0d0e12] border border-[#292a2b] rounded-lg p-3.5 relative group mb-1">
                  <div className="flex items-start justify-between">
                    <h5 className="text-white font-semibold text-sm">{item.title}</h5>
                    <button
                      onClick={() => removeAgendaItem(idx)}
                      className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {item.type && (
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${typeColors[item.type] || typeColors.Lecture}`}>
                        {item.type}
                      </span>
                    )}
                    {item.speaker && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <User className="w-3 h-3" />
                        {item.speaker}
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {data.agenda.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-12 border-2 border-dashed border-[#292a2b] rounded-lg">
                <Clock className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                No sessions added yet.
                <br />
                <button
                  onClick={() => setShowAddAgendaForm(true)}
                  className="text-primary text-sm hover:underline mt-1"
                >
                  Click to add your first session
                </button>
              </div>
            )}
          </div>


          {showAddAgendaForm && (
            <div className="bg-[#0d0e12] border border-primary/30 rounded-lg p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <h5 className="text-white text-sm font-semibold">New Session</h5>
                <button
                  onClick={() => setShowAddAgendaForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Time (e.g. 09:00 AM)"
                  value={newAgenda.time}
                  onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
                  className="bg-transparent border border-[#292a2b] rounded px-3 py-2 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 45 min)"
                  value={newAgenda.duration}
                  onChange={(e) => setNewAgenda({ ...newAgenda, duration: e.target.value })}
                  className="bg-transparent border border-[#292a2b] rounded px-3 py-2 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Session Title"
                  value={newAgenda.title}
                  onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
                  className="bg-transparent border border-[#292a2b] rounded px-3 py-2 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <CustomDropdown
                  options={[
                    { value: "Lecture", label: "Lecture" },
                    { value: "Workshop", label: "Workshop" },
                    { value: "Networking", label: "Networking" },
                    { value: "Panel", label: "Panel" },
                    { value: "Break", label: "Break" },
                  ]}
                  value={newAgenda.type}
                  onChange={(value) => setNewAgenda({ ...newAgenda, type: value })}
                />
                <input
                  type="text"
                  placeholder="Speaker (optional)"
                  value={newAgenda.speaker}
                  onChange={(e) => setNewAgenda({ ...newAgenda, speaker: e.target.value })}
                  className="bg-transparent border border-[#292a2b] rounded px-3 py-2 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
              </div>
              <textarea
                placeholder="Session description..."
                value={newAgenda.description}
                onChange={(e) => setNewAgenda({ ...newAgenda, description: e.target.value })}
                className="w-full bg-transparent border border-[#292a2b] rounded px-3 py-2 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={addAgendaItem}
                  className="flex-1 py-2 bg-primary hover:bg-primary/80 text-white text-sm font-medium rounded transition-colors"
                >
                  Add to Agenda
                </button>
                <button
                  onClick={() => setShowAddAgendaForm(false)}
                  className="px-4 py-2 border border-[#292a2b] text-gray-400 hover:text-white rounded transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakersStep;