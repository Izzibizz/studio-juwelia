import type { FaqSectionData } from "../../api/contentAPI";
import { RichTextContent } from "../RichTextContent";

interface FAQSectionProps {
  data: FaqSectionData;
}

export function FAQSection({ data }: FAQSectionProps) {
  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]">
      <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">
        {data.title}
      </h2>
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <details
            key={`${item.question}-${index}`}
            className="rounded-lg bg-white border border-[#efe7dc] p-4"
          >
            <summary className="cursor-pointer font-semibold text-darkBrown">
              {item.question}
            </summary>
            <RichTextContent
              html={item.answer}
              className="mt-2 text-brownBlack"
            />
          </details>
        ))}
      </div>
    </section>
  );
}
