import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { RichTextContent } from "../RichTextContent";

interface SectionIntroProps {
  data: GalleryIntroSectionData;
}

export function SectionIntro({ data }: SectionIntroProps) {
  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]">
      <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-3">
        {data.title}
      </h2>
      <RichTextContent
        html={data.description}
        className="text-brownBlack mb-5"
      />
      <p className="text-darkRed font-semibold">{data.ctaText}</p>
      {data.imageGallery.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {data.imageGallery.slice(0, 3).map((item, index) => (
            <img
              key={`${item.name}-${index}`}
              src={item.image}
              alt={item.alt || item.name}
              className="h-20 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </section>
  );
}
