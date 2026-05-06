import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageGalleryItemData } from "../../api/contentAPI";
import { ImageLightbox } from "./ImageLightbox";

interface ImageGallerySwiperProps {
  images: ImageGalleryItemData[];
  variant?: "art" | "default";
}

type ImageItem = ImageGalleryItemData;

interface CenteredGalleryProps {
  images: ImageItem[];
  interval?: number;
  onItemClick?: (index: number) => void;
}

function CenteredGallery({
  images,
  interval = 2500,
  onItemClick,
}: CenteredGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const length = images.length;
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef(0);

  useEffect(() => {
    if (!length) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, interval);

    return () => clearInterval(id);
  }, [length, interval]);

  const nextSlide = () =>
    setActiveIndex((prev) => (((prev + 1) % length) + length) % length);
  const prevSlide = () =>
    setActiveIndex((prev) => (((prev - 1) % length) + length) % length);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
    deltaXRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || startXRef.current === null) return;
    deltaXRef.current = event.clientX - startXRef.current;
  };

  const resetDrag = () => {
    startXRef.current = null;
    deltaXRef.current = 0;
    setIsDragging(false);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const delta = deltaXRef.current;
    if (delta > 80) {
      prevSlide();
    } else if (delta < -80) {
      nextSlide();
    }
    resetDrag();
  };

  const visibleSlides = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((offset) => {
      const rawIndex = activeIndex + offset;
      const index = ((rawIndex % length) + length) % length;
      return {
        ...images[index],
        index,
        offset,
      };
    });
  }, [activeIndex, images, length]);

  if (!length) return null;

  return (
    <div className="w-full flex flex-col items-center overflow-hidden p-10">
      <div
        className="flex items-center justify-center gap-3"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {visibleSlides.map((item, i) => {
          const isCenter = item.offset === 0;

          return (
            <button
              key={`${item.index}-${i}`}
              type="button"
              onClick={() => onItemClick?.(item.index)}
              className="relative transition-all duration-700 ease-out rounded-xl overflow-hidden"
              style={{
                width: "220px",
                height: "320px",
                transform: isCenter ? "scale(1.3)" : "scale(0.7)",
              }}
            >
              <div
                className={`relative rounded-xl overflow-hidden ${
                  isCenter ? "z-20" : "opacity-70 z-10"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.name || ""}
                  className="w-full h-full object-cover aspect-[3/4] transition-transform duration-700 ease-out"
                  draggable={false}
                />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prevSlide}
          className="p-3 shadow-lg transition object-cover"
        >
          <img src="/arrow-left.png" alt="Previous" className="w-full" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="p-3 shadow-lg transition object-cover"
        >
          <img src="/arrow-right.png" alt="Next" className="w-full" />
        </button>
      </div>
    </div>
  );
}

export function ImageGallerySwiper({ images }: ImageGallerySwiperProps) {
  const galleryImages = useMemo(
    () => images.filter((item) => Boolean(item.image)),
    [images],
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (galleryImages.length === 0) return null;

  return (
    <>
      <div className="mt-4 w-full max-w-full overflow-hidden p-3">
        <CenteredGallery
          images={galleryImages}
          interval={2500}
          onItemClick={(index) => setLightboxIndex(index)}
        />
      </div>

      <ImageLightbox
        isOpen={lightboxIndex !== null}
        images={galleryImages}
        activeIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((prev) => {
            if (prev === null) return 0;
            return (prev - 1 + galleryImages.length) % galleryImages.length;
          })
        }
        onNext={() =>
          setLightboxIndex((prev) => {
            if (prev === null) return 0;
            return (prev + 1) % galleryImages.length;
          })
        }
      />
    </>
  );
}
