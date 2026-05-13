import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import leftarrow from "/arrow-left.png";
import arrowright from "/arrow-right.png";

type ImageItem = {
  image: string;
  alt?: string;
  name?: string;
};

interface Props {
  images: ImageItem[];
  autoplayDelay?: number;
  onItemClick?: (index: number) => void;
}

export function CenteredEmblaGallery({
  images,
  autoplayDelay = 2500,
  onItemClick,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const length = images.length;

  // 🔥 LOOP-SAFE distance (fixar glitch vid loop)
  const getDistance = useCallback(
    (index: number) => {
      let diff = index - selectedIndex;

      if (diff > length / 2) diff -= length;
      if (diff < -length / 2) diff += length;

      return diff;
    },
    [selectedIndex, length],
  );

  // 🎯 SCALE + DEPTH
  const getStyles = (index: number) => {
    const dist = Math.abs(getDistance(index));

    if (dist === 0) {
      return {
        scale: 1.27,
        opacity: 1,
        blur: 0,
        zIndex: 999,
        y: -10,
      };
    }

    if (dist === 1) {
      return {
        scale: 0.95,
        opacity: 0.75,
        blur: 1,
        zIndex: 500,
        y: 0,
      };
    }

    if (dist === 2) {
      return {
        scale: 0.8,
        opacity: 0.5,
        blur: 2,
        zIndex: 10,
        y: 5,
      };
    }

    return {
      scale: 0.7,
      opacity: 0.3,
      blur: 3,
      zIndex: 0,
      y: 10,
    };
  };

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // ✅ STABIL select handler
  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // ✅ INIT + SUBSCRIBE (utan React warning)
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    // defer initial state sync
    const raf = requestAnimationFrame(() => {
      handleSelect();
    });

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
      cancelAnimationFrame(raf);
    };
  }, [emblaApi, handleSelect]);

  // ✅ AUTOPLAY (stabil + cleanup)
  useEffect(() => {
    if (!emblaApi || paused) return;

    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, autoplayDelay, paused]);

  if (!images?.length) return null;

  return (
    <div
      className="w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden py-20 ">
        <div className="flex items-center ">
          {images.map((item, index) => {
            const styles = getStyles(index);

            return (
              <div
                key={index}
                className="flex-[0_0_33.333%] tablet:flex-[0_0_24%] flex justify-center px-2"
              >
                <button
                  type="button"
                  onClick={() => onItemClick?.(index)}
                  className="cursor-pointer"
                >
                  <motion.div
                    animate={{
                      scale: styles.scale,
                      opacity: styles.opacity,
                      y: styles.y,
                      filter: `blur(${styles.blur}px)`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 60,
                      damping: 30,
                    }}
                    style={{
                      zIndex: styles.zIndex,
                      backfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                    }}
                    className="w-[200px] laptop:w-[250px] h-[300px] laptop:h-[360px] rounded-xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={item.image}
                      alt={item.alt || item.name || ""}
                      className="w-full h-full object-cover cursor-pointer "
                      draggable={false}
                    />
                  </motion.div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={scrollPrev}
          className="transition hover:scale-110 active:scale-95 z-30"
          aria-label="Previous"
        >
          <img
            src={leftarrow}
            alt="Previous"
            className="w-full cursor-pointer"
          />
        </button>

        <button
          onClick={scrollNext}
          className="transition hover:scale-110 active:scale-95 cursor-pointer z-30"
          aria-label="Next"
        >
          <img src={arrowright} alt="Next" className="w-full" />
        </button>
      </div>
    </div>
  );
}
