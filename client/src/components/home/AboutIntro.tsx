import type { AboutIntroData } from "../../api/contentAPI";
import { RichTextContent } from "../RichTextContent";

interface AboutIntroProps {
  data: AboutIntroData;
}

export function AboutIntro({ data }: AboutIntroProps) {
  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]">
      <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-4">
        A propos
      </h2>
      {data.items.length === 0 && (
        <p className="text-brown">
          Aucun contenu configure pour cette section.
        </p>
      )}
      <div className="grid gap-4">
        {data.items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="rounded-xl border border-[#efe7dc] bg-white p-4"
          >
            <h3 className="text-lg font-semibold text-darkBrown mb-2">
              {item.title}
            </h3>
            <RichTextContent
              html={item.description}
              className="text-brownBlack mb-3"
            />
            <p className="text-darkRed font-semibold">{item.ctaText}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
