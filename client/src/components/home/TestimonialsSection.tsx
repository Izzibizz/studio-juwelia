import type { TestimonialsSectionData } from "../../api/contentAPI";
import { RichTextContent } from "../RichTextContent";

interface TestimonialsSectionProps {
  data: TestimonialsSectionData;
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]">
      <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">
        {data.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.items.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className="p-4 rounded-xl bg-white border border-[#efe7dc]"
          >
            <RichTextContent
              html={item.quote}
              className="text-brownBlack mb-3"
            />
            <p className="font-semibold text-darkBrown">{item.name}</p>
            <p className="text-sm text-brown">{item.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
