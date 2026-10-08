import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (open) {
      setTimeout(() => confirmBtnRef.current?.focus(), 100);
    }
  }, [open]);


  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);


  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-400",
      bg: "bg-red-500/10",
      btn: "bg-red-600 hover:bg-red-700 text-white",
      border: "border-red-500/20",
    },
    warning: {
      icon: "text-yellow-400",
      bg: "bg-yellow-500/10",
      btn: "bg-yellow-600 hover:bg-yellow-700 text-white",
      border: "border-yellow-500/20",
    },
    info: {
      icon: "text-blue-400",
      bg: "bg-blue-500/10",
      btn: "bg-primary hover:bg-primary/90 text-white",
      border: "border-primary/20",
    },
  };

  const v = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />


      <div className="relative bg-[#131418] border border-secondary/15 rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-in zoom-in-95 fade-in duration-150">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-secondary/40 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X size={16} />
        </button>


        <div className="p-6">

          <div className={`w-12 h-12 rounded-full ${v.bg} flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className={v.icon} size={24} />
          </div>


          {title && (
            <h3 className="text-white text-lg font-semibold text-center mb-2">
              {title}
            </h3>
          )}


          <p className="text-secondary text-sm text-center leading-relaxed">
            {message}
          </p>


          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-secondary/20 text-secondary hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmBtnRef}
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${v.btn}`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
