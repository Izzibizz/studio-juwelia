import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type ImageItem = {
  image: string;
  alt?: string;
  name?: string;
};

interface Props {
  images: ImageItem[];
  autoplayDelay?: number;
}

export function CenteredEmblaGallery({ images, autoplayDelay = 2500 }: Props) {
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
      const diff = Math.abs(index - selectedIndex);
      return Math.min(diff, length - diff);
    },
    [selectedIndex, length],
  );

  // 🎯 SCALE + DEPTH
  const getStyles = (index: number) => {
    const dist = getDistance(index);

    if (dist === 0) {
      return {
        scale: 1.2,
        opacity: 1,
        blur: 0,
        zIndex: 30,
        y: -10,
      };
    }

    if (dist === 1) {
      return {
        scale: 0.95,
        opacity: 0.75,
        blur: 1,
        zIndex: 20,
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
                className="flex-[0_0_33.333%] tablet:flex-[0_0_20%] flex justify-center px-2"
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
                    stiffness: 260,
                    damping: 25,
                  }}
                  style={{
                    zIndex: styles.zIndex,
                  }}
                  className="w-[200px] laptop:w-[250px] h-[300px] laptop:h-[360px] rounded-xl overflow-hidden shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.alt || item.name || ""}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
