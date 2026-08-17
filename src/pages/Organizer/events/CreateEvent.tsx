import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BasicsStep from "../../../components/Organizer/events/BasicsStep";
import VenueStep from "../../../components/Organizer/events/VenueStep";
import TicketsStep from "../../../components/Organizer/events/TicketsStep";
import DesignStep from "../../../components/Organizer/events/DesignStep";
import SpeakersStep from "../../../components/Organizer/events/SpeakersStep";
import ReviewStep from "../../../components/Organizer/events/ReviewStep";
import Stepper from "../../../components/Organizer/events/Stepper";
import {
  useCreateEventWithFiles,
  useUpdateEventWithFiles,
} from "../../../hooks/useEvents";
import {
  EventFormData,
  initialFormData,
  formToFormData,
  validateEventForm,
  ValidationErrors,
} from "../../../utils/eventMapper";

// Re-export so step components can import from here (backwards compatible)
export type { EventFormData } from "../../../utils/eventMapper";

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAFT_STORAGE_KEY = "msquard_event_draft";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_GALLERY_FILES = 10;

const steps = [
  { label: "Basics" },
  { label: "Venue" },
  { label: "Tickets" },
  { label: "Design" },
  { label: "Speakers" },
  { label: "Review" },
];

interface CreateEventProps {
  /** If provided, the page operates in "edit" mode */
  editEventId?: string;
  /** Pre-populated form data (for edit mode) */
  initialData?: EventFormData;
}

const CreateEvent = ({ editEventId, initialData }: CreateEventProps = {}) => {
  const navigate = useNavigate();

  // ─── Restore draft from localStorage (only for create mode) ──────
  const getInitialFormData = (): EventFormData => {
    if (initialData) return initialData;
    if (editEventId) return { ...initialFormData };

    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults so new fields don't break
        return { ...initialFormData, ...parsed };
      }
    } catch {
      // Corrupt data — ignore
    }
    return { ...initialFormData };
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>(getInitialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const { createEventWithFiles } = useCreateEventWithFiles();
  const { updateEventWithFiles } = useUpdateEventWithFiles();

  // ─── Persist draft to localStorage (create mode only) ────────────
  useEffect(() => {
    if (editEventId) return; // Don't persist edit mode drafts

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // Storage full — silent fail
    }
  }, [formData, editEventId]);

  const clearDraft = () => {
    if (!editEventId) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  };

  const updateFormData = useCallback(
    (data: Partial<EventFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
      // Clear errors for updated fields
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(data).forEach((k) => delete next[k]);
        return next;
      });
    },
    []
  );

  // ─── File validation ─────────────────────────────────────────────
  const validateFiles = (): string | null => {
    // Hero image size
    if (formData.heroImage instanceof File) {
      if (formData.heroImage.size > MAX_FILE_SIZE) {
        return `Hero image "${formData.heroImage.name}" exceeds 5 MB limit.`;
      }
    }

    // Gallery count
    if (formData.gallery.length > MAX_GALLERY_FILES) {
      return `Maximum ${MAX_GALLERY_FILES} gallery images allowed.`;
    }

    // Gallery file sizes
    for (const file of formData.gallery) {
      if (file.size > MAX_FILE_SIZE) {
        return `Gallery image "${file.name}" exceeds 5 MB limit.`;
      }
    }

    // Speaker photo sizes
    for (const speaker of formData.speakers) {
      if (speaker.photo instanceof File && speaker.photo.size > MAX_FILE_SIZE) {
        return `Speaker photo "${speaker.photo.name}" exceeds 5 MB limit.`;
      }
    }

    return null;
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors = validateEventForm(formData);

    // Only show errors relevant to the current step
    const stepFields: Record<number, string[]> = {
      0: ["title", "category", "description"],
      1: ["eventDate", "startTime", "endTime", "venueName"],
      2: [], // tiers are optional, validate individually if present
      3: [], // design is optional
      4: [], // speakers are optional
      5: [], // review
    };

    const relevantFields = stepFields[currentStep] || [];
    const relevantErrors: ValidationErrors = {};

    if (currentStep === 5) {
      // On review, validate everything
      Object.assign(relevantErrors, stepErrors);
    } else {
      for (const field of relevantFields) {
        if (stepErrors[field]) {
          relevantErrors[field] = stepErrors[field];
        }
      }
    }

    setErrors(relevantErrors);
    return Object.keys(relevantErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before continuing");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    // Full validation before submission
    const allErrors = validateEventForm(formData);
    if (Object.keys(allErrors).length > 0 && status === "published") {
      setErrors(allErrors);
      toast.error("Please fix all errors before publishing");
      return;
    }

    // Validate file sizes
    const fileError = validateFiles();
    if (fileError) {
      toast.error(fileError);
      return;
    }

    setSubmitting(true);

    try {
      // Build FormData (includes files + text fields)
      const fd = formToFormData(formData, status);

      let event;
      if (editEventId) {
        event = await updateEventWithFiles(editEventId, fd);
      } else {
        event = await createEventWithFiles(fd);
      }

      if (event) {
        toast.success(
          editEventId
            ? "Event updated successfully!"
            : status === "published"
              ? "Event published successfully!"
              : "Event saved as draft!"
        );
        clearDraft();
        navigate("/organizer/events");
      } else {
        toast.error("Failed to save event. Please try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      // Handle file size error from API
      if (message.includes("File too large") || message.includes("5 MB")) {
        toast.error("One or more files exceed the 5 MB size limit. Please compress or use smaller images.");
      } else if (message.includes("gallery")) {
        toast.error("Too many gallery images. Maximum 10 allowed.");
      } else if (message.includes("image") || message.includes("file")) {
        toast.error("Invalid file type. Only image files (JPG, PNG, GIF, WebP) are allowed.");
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => handleSubmit("draft");
  const handlePublish = () => handleSubmit("published");

  const isLoading = submitting;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicsStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      case 1:
        return (
          <VenueStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return <TicketsStep data={formData} updateData={updateFormData} />;
      case 3:
        return <DesignStep data={formData} updateData={updateFormData} />;
      case 4:
        return <SpeakersStep data={formData} updateData={updateFormData} />;
      case 5:
        return (
          <ReviewStep
            data={formData}
            updateData={updateFormData}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {editEventId ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-secondary text-sm mt-1">
            {editEventId
              ? "Update your event details"
              : "Fill in the details to create your event"}
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-primary text-sm">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step content */}
      <div className="mt-8 p-6 md:p-8">{renderStep()}</div>

      {/* Navigation buttons — publish/save live in Review step sidebar */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 0 || isLoading}
          className="px-6 py-2 text-secondary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {currentStep < steps.length - 1 && (
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              onClick={nextStep}
              disabled={isLoading}
              className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: {steps[currentStep + 1]?.label} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
