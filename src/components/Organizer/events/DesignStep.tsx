import { EventFormData } from "../../../pages/Organizer/events/CreateEvent";
import { Plus, CloudUpload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  data: EventFormData;
  updateData: (data: Partial<EventFormData>) => void;
}

const DesignStep = ({ data, updateData }: Props) => {
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Local preview state — derived from formData
  const [heroPreview, setHeroPreview] = useState<string | null>(
    data.heroImageUrl || null
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    data.galleryUrls || []
  );

  // Sync previews when formData changes externally (e.g. edit mode)
  useEffect(() => {
    if (data.heroImageUrl && !heroPreview) {
      setHeroPreview(data.heroImageUrl);
    }
    if (data.galleryUrls && data.galleryUrls.length > 0 && galleryPreviews.length === 0) {
      setGalleryPreviews(data.galleryUrls);
    }
  }, [data.heroImageUrl, data.galleryUrls]);

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the File in formData
      updateData({ heroImage: file });

      // Generate preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setHeroPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHero = () => {
    updateData({ heroImage: null, heroImageUrl: undefined });
    setHeroPreview(null);
    if (heroInputRef.current) heroInputRef.current.value = "";
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      // Append to existing gallery files in formData
      updateData({ gallery: [...data.gallery, ...newFiles] });

      // Generate previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setGalleryPreviews((prev) => [...prev, ev.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    // Remove from formData files
    const updatedFiles = data.gallery.filter((_, i) => {
      // Account for existing URLs that come before new files
      const fileIndex = i - (data.galleryUrls?.length || 0);
      return fileIndex !== index;
    });
    updateData({ gallery: updatedFiles });

    // Remove preview
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(updatedPreviews);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left column – 65% */}
      <div className="lg:col-span-3 space-y-6">
        {/* Hero Image */}
        <div>
          <label className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
            HERO IMAGE
          </label>
          <div
            onClick={() => !heroPreview && heroInputRef.current?.click()}
            className={`bg-[#0d0e12] border border-[#292a2b] rounded-lg p-10 text-center hover:border-primary/50 transition-colors ${
              !heroPreview ? "cursor-pointer" : ""
            }`}
          >
            <input
              type="file"
              ref={heroInputRef}
              onChange={handleHeroUpload}
              accept="image/*"
              className="hidden"
            />
            {heroPreview ? (
              <div className="relative">
                <img
                  src={heroPreview}
                  alt="Hero"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHero();
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <CloudUpload size={40} className="text-primary mx-auto mb-2" />
                <p className="text-white text-sm font-medium">
                  Click to upload Hero Image
                </p>
                <p className="text-secondary text-xs mt-1">
                  Recommended size: 1920×1080px. High resolution JPG or PNG works best.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold">
              IMAGE GALLERY
            </label>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors text-sm"
            >
              <Plus size={16} /> Add more
            </button>
          </div>
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleGalleryUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            {galleryPreviews.map((img, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-lg overflow-hidden border border-[#292a2b] relative group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {galleryPreviews.length === 0 && (
              <div className="text-gray-500 text-sm">No images uploaded yet</div>
            )}
          </div>
        </div>

        {/* Promotional Video */}
        <div>
          <label className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold block mb-1.5">
            PROMOTIONAL VIDEO
          </label>
          <input
            type="url"
            value={data.videoUrl}
            onChange={(e) => updateData({ videoUrl: e.target.value })}
            placeholder="Paste YouTube or Vimeo URL"
            className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-3 py-2.5 text-white text-sm outline-none placeholder:text-gray-400 focus:border-primary/50 transition-colors"
          />
          <p className="text-gray-400 text-xs mt-1">
            Include a video to increase engagement by up to 40%.
          </p>
        </div>
      </div>

      {/* Right column – 35% */}
      <div className="lg:col-span-2">
        {/* Attendee Preview Card */}
        <div className="bg-[#0d0e12] border border-[#292a2b] rounded-lg p-4">
          <h4 className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold mb-3">
            ATTENDEE PREVIEW
          </h4>
          <div className="bg-[#080809] rounded-lg overflow-hidden border border-[#292a2b]">
            {/* Image placeholder */}
            <div className="w-full h-32 bg-gray-800 flex items-center justify-center">
              {heroPreview ? (
                <img
                  src={heroPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">No image</span>
              )}
            </div>
            <div className="p-4">
              {/* Category badges */}
              <div className="flex gap-2 mb-2">
                <span className="text-primary text-xs font-medium uppercase tracking-wider border border-primary px-2 py-0.5 rounded">
                  {data.category || "COMMUNITY"}
                </span>
                <span className="text-white text-xs font-medium uppercase tracking-wider bg-gray-700 px-2 py-0.5 rounded">
                  ANNUAL
                </span>
              </div>
              {/* Title */}
              <h3 className="text-white text-lg font-semibold">
                {data.title || "Event Title"}
              </h3>
              {/* Date & Location */}
              <p className="text-gray-400 text-sm">
                {data.eventDate || "Oct 24, 2024"} |{" "}
                {data.venueName || "Central London"}
              </p>
              {/* Description */}
              <p className="text-gray-400 text-sm mt-2">
                {data.description ||
                  "Join us for a transformative day of learning and networking."}
              </p>
              {/* Get Tickets Button */}
              <button className="mt-3 w-full bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStep;
