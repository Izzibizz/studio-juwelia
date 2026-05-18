import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { RichTextContent } from "./RichTextContent";

interface TermsModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
}

export function TermsModal({
  isOpen,
  content,
  onClose,
}: TermsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-lightCream w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-darkBrown cursor-pointer hover:scale-110 transition"
        >
          <FiX size={24} />
        </button>

        <h3 className="font-tropical text-3xl mb-6 text-darkBrown">
          Conditions générales
        </h3>

        <RichTextContent
          html={content}
          className="text-sm text-brownBlack space-y-4"
        />
      </div>
    </div>,
    document.body
  );
}