import { useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import type { ImageGalleryItemData } from "../../api/contentAPI";

interface ImageLightboxProps {
  isOpen: boolean;
  images: ImageGalleryItemData[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ImageLightbox({
  isOpen,
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const selectedImage = images[activeIndex];
  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/50 p-2 text-white transition hover:bg-black/70"
      >
        <FiX size={22} />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(event) => {
            event.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/50 p-3 text-white transition hover:bg-black/70"
        >
          <FiChevronLeft size={24} />
        </button>
      )}

      <figure
        className="max-h-[90vh] max-w-[92vw]"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={selectedImage.image}
          alt={selectedImage.alt || selectedImage.name}
          className="max-h-[80vh] w-auto rounded-2xl object-contain"
        />
        {(selectedImage.name || selectedImage.alt) && (
          <figcaption className="mt-3 text-center text-sm text-white/85">
            {selectedImage.name || selectedImage.alt}
          </figcaption>
        )}
      </figure>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/50 p-3 text-white transition hover:bg-black/70"
        >
          <FiChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
