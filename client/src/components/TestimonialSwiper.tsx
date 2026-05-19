import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { RichTextContent } from "./RichTextContent";

interface TestimonialItem {
  quote: string;
  name: string;
  typeOfClient: string;
}

interface Props {
  items: TestimonialItem[];
}

export function TestimonialSwiper({ items }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
    },
    [
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateButtons();

    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi]);

  if (!items.length) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                min-w-0
                flex-[0_0_100%]
                tablet:flex-[0_0_50%]
                laptop:flex-[0_0_25%]
                px-3
              "
            >
              <article className="h-full min-h-[320px] rounded-4xl bg-pinkBeige p-8 flex flex-col">
                <div className="flex-1">
                  <RichTextContent
                    html={item.quote}
                    className="text-brownBlack mb-6 leading-relaxed"
                  />
                </div>

                <div className="mt-auto">
                  <p className="text-darkBrown font-medium">
                    — {item.name}
                  </p>

                  <p className="text-sm text-brown">
                    {item.typeOfClient}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="
            h-12 w-12
            rounded-full
            border border-darkBrown
            text-darkBrown
            transition
            hover:bg-darkBrown
            hover:text-white
            cursor-pointer
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
          aria-label="Previous testimonials"
        >
          ←
        </button>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="
            h-12 w-12
            rounded-full
            border border-darkBrown
            text-darkBrown
            transition
            hover:bg-darkBrown
            hover:text-white
            cursor-pointer
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
          aria-label="Next testimonials"
        >
          →
        </button>
      </div>
    </div>
  );
}