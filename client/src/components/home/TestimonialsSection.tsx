import type { TestimonialsSectionData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";

interface TestimonialsSectionProps {
  data?: TestimonialsSectionData;
  isEditing?: boolean;
  onChange?: (nextData: TestimonialsSectionData) => void;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
}

export function TestimonialsSection({
  data,
  isEditing = false,
  onChange,
  onAddItem,
  onRemoveItem,
}: TestimonialsSectionProps) {
  const updateField = (field: keyof TestimonialsSectionData, value: string) => {
    onChange?.({ ...(data || { items: [] }), [field]: value });
  };

  const updateItem = (
    index: number,
    field: "name" | "quote" | "role",
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
    <section className="p-6 md:p-8 bg-lightCream">
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
                Add testimonial
              </button>
            </div>
          )}
        </div>
      ) : (
        <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">
          {data?.title || ""}
        </h2>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {(data?.items ?? []).map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className="p-4 rounded-xl bg-white border border-[#efe7dc]"
          >
            {isEditing ? (
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-darkBrown">
                    Testimonial {index + 1}
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
                  type="rich"
                  label="Quote"
                  value={item.quote}
                  onChange={(value) => updateItem(index, "quote", value)}
                />
                <EditorField
                  type="plain"
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateItem(index, "name", value)}
                />
                <EditorField
                  type="plain"
                  label="Role"
                  value={item.role}
                  onChange={(value) => updateItem(index, "role", value)}
                />
              </div>
            ) : (
              <>
                <RichTextContent
                  html={item.quote}
                  className="text-brownBlack mb-3"
                />
                <p className="font-semibold text-darkBrown">{item.name}</p>
                <p className="text-sm text-brown">{item.role}</p>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
