import type { FaqSectionData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";

interface FAQSectionProps {
  data?: FaqSectionData;
  isEditing?: boolean;
  onChange?: (nextData: FaqSectionData) => void;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  faqRef: React.RefObject<HTMLElement | null>;
}

export function FAQSection({
  data,
  isEditing = false,
  onChange,
  onAddItem,
  onRemoveItem,
  faqRef,
}: FAQSectionProps) {
  const updateField = (field: keyof FaqSectionData, value: string) => {
    onChange?.({ ...(data || { items: [] }), [field]: value });
  };

  const updateItem = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    onChange?.({
      ...(data || { items: [] }),
      items: (data?.items ?? []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    });
  };

  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]" ref={faqRef}>
      {isEditing ? (
        <div className="mb-6 grid gap-4 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
          <EditorField
            type="plain"
            label="Section title"
            value={data?.title || ""}
            onChange={(value) => updateField("title", value)}
          />
          {onAddItem && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onAddItem}
                className="inline-flex items-center gap-2 rounded-full border border-darkBrown px-4 py-2 text-sm font-semibold text-darkBrown transition hover:bg-darkBrown hover:text-white"
              >
                <FiPlus size={16} />
                Add FAQ item
              </button>
            </div>
          )}
        </div>
      ) : (
        <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">
          {data?.title || ""}
        </h2>
      )}
      <div className="space-y-3">
        {(data?.items ?? []).map((item, index) => (
          <details
            key={`${item.question}-${index}`}
            className="rounded-lg bg-white border border-[#efe7dc] p-4"
            open={isEditing ? true : undefined}
          >
            {isEditing ? (
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-darkBrown">
                    FAQ item {index + 1}
                  </span>
                  {onRemoveItem && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="text-darkRed transition hover:opacity-70"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                <EditorField
                  type="plain"
                  label="Question"
                  value={item.question}
                  onChange={(value) => updateItem(index, "question", value)}
                />
                <EditorField
                  type="rich"
                  label="Answer"
                  value={item.answer}
                  onChange={(value) => updateItem(index, "answer", value)}
                />
              </div>
            ) : (
              <>
                <summary className="cursor-pointer font-semibold text-darkBrown">
                  {item.question}
                </summary>
                <RichTextContent
                  html={item.answer}
                  className="mt-2 text-brownBlack"
                />
              </>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
