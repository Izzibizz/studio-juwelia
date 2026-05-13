import { animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiMaximize2 } from "react-icons/fi";

type SlideImage = {
  image: string;
  alt?: string;
  name?: string;
};

interface Props {
  left: SlideImage;
  right: SlideImage;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

export function SplitRevealSlider({
  left,
  right,
  onLeftClick,
  onRightClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // divider position in %
  const [divider, setDivider] = useState(50);

  const draggingRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  // mobile scroll helpers
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalDragRef = useRef(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = clientX - rect.left;

    let percent = (x / rect.width) * 100;

    percent = Math.max(10, Math.min(90, percent));

    setDivider(percent);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    // detect direction
    if (!isHorizontalDragRef.current) {
      // vertical scroll -> allow page scroll
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      // horizontal drag detected
      if (Math.abs(deltaX) > 8) {
        isHorizontalDragRef.current = true;
      }
    }

    // only drag slider horizontally
    if (!isHorizontalDragRef.current) return;

    updatePosition(e.clientX);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    draggingRef.current = true;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;

    isHorizontalDragRef.current = false;
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;

    setIsDragging(false);
    draggingRef.current = false;

    isHorizontalDragRef.current = false;

    animate(divider, 50, {
      duration: 0.45,
      ease: "easeOut",
      onUpdate: (latest) => setDivider(latest),
    });
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  });

  // diagonal cut
  const clipPath = `
    polygon(
      ${divider - 8}% 0%,
      100% 0%,
      100% 100%,
      ${divider + 8}% 100%
    )
  `;

  return (
    <div className="w-full flex justify-center">
      <div
        ref={containerRef}
        className="relative w-full w-[200px] h-[500px] laptop:w-[500px] laptop:h-[750px] overflow-hidden rounded-3xl select-none touch-pan-y"
      >
        {/* LEFT IMAGE */}
        <div className="absolute inset-0">
          <img
            src={left.image}
            alt={left.alt || left.name || ""}
            className="w-full h-full object-cover"
            draggable={false}
          />

          <button
            onClick={onLeftClick}
            className="absolute top-4 left-4 z-20 rounded-full bg-brown/40 p-2 text-white opacity-0 laptop:hover:opacity-100 transition"
          >
            <FiMaximize2 size={18} />
          </button>

          {left.name && (
            <div className="absolute bottom-4 left-4 rounded-full bg-brown/40 px-4 py-2 text-sm text-white">
              {left.name}
            </div>
          )}
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          animate={{
            clipPath,
          }}
          transition={
            isDragging
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 20 }
          }
          className="absolute inset-0"
        >
          <img
            src={right.image}
            alt={right.alt || right.name || ""}
            className="w-full h-full object-cover"
            draggable={false}
          />

          <button
            onClick={onRightClick}
            className="absolute top-4 right-4 z-20 rounded-full bg-brown/40 p-2 text-white opacity-0 laptop:hover:opacity-100 transition"
          >
            <FiMaximize2 size={18} />
          </button>

          {right.name && (
            <div className="absolute bottom-4 right-4 rounded-full bg-brown/40 px-4 py-2 text-sm text-white">
              {right.name}
            </div>
          )}
        </motion.div>

        {/* DIVIDER */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute top-0 bottom-0 z-30 cursor-ew-resize"
          style={{
            left: `${divider}%`,
            transform: "translateX(-50%)",
          }}
        >
          {/* diagonal line */}
          <div className="relative h-full">
            {/* handle */}
            <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rotate-45 border-4 border-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}