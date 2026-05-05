import { useMemo, useState } from "react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { ImageGalleryItemData } from "../../api/contentAPI";
import { ImageLightbox } from "./ImageLightbox";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface ImageGallerySwiperProps {
  images: ImageGalleryItemData[];
  variant?: "art" | "default";
}

export function ImageGallerySwiper({
  images,
  variant = "default",
}: ImageGallerySwiperProps) {
  const galleryImages = useMemo(
    () => images.filter((item) => Boolean(item.image)),
    [images],
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (galleryImages.length === 0) return null;

  const isArt = variant === "art";

  return (
    <>
      <div className="mt-4 w-full max-w-full overflow-hidden rounded-xl bg-white p-3">
        {isArt ? (
          <Swiper
            modules={[EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            centeredSlidesBounds={false}
            loop
            loopAdditionalSlides={Math.max(galleryImages.length, 5)}
            initialSlide={2}
            slidesPerView={5}
            spaceBetween={12}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 60,
              modifier: 1,
              scale: 0.8,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            className="home-art-swiper w-full max-w-full"
          >
            {galleryImages.map((item, index) => (
              <SwiperSlide
                key={`${item.name}-${index}`}
                className="transition-transform duration-300"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group block w-full max-w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.alt || item.name}
                    className="h-56 w-full rounded-xl object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={12}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.1 },
              900: { slidesPerView: 1.25 },
            }}
            className="home-art-swiper w-full max-w-full"
          >
            {galleryImages.map((item, index) => (
              <SwiperSlide key={`${item.name}-${index}`}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group block w-full max-w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.alt || item.name}
                    className="h-56 w-full rounded-xl object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
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
