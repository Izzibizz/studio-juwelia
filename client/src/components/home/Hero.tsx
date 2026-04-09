import type { HeroSectionData } from "../../api/contentAPI";
import { Link } from "react-router-dom";
import { RichTextContent } from "../RichTextContent";

interface HeroProps {
  data: HeroSectionData;
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="rounded-2xl p-8 md:p-12 bg-darkBrown text-white">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.title}</h1>
        <RichTextContent
          html={data.subtitle}
          className="text-lg md:text-xl text-beige mb-4"
        />
        <RichTextContent html={data.description} className="text-beige mb-6" />
        <RichTextContent
          html={data.poem}
          className="italic text-beige/90 mb-8"
        />
        <div className="flex flex-wrap gap-3">
          <Link
            to={data.primaryCtaLink}
            className="px-5 py-3 rounded-full bg-white text-darkBrown font-semibold hover:opacity-90"
          >
            {data.primaryCtaText}
          </Link>
        </div>
        {(data.imageLeft || data.imageRight) && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {data.imageLeft && (
              <img
                src={data.imageLeft}
                alt="Hero left"
                className="h-40 w-full rounded-xl object-cover"
              />
            )}
            {data.imageRight && (
              <img
                src={data.imageRight}
                alt="Hero right"
                className="h-40 w-full rounded-xl object-cover"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
