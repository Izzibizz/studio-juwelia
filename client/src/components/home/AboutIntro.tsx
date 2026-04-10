import type { AboutIntroData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { InlineUploadButton } from "./InlineUploadButton";

interface AboutIntroProps {
  data: AboutIntroData;
  isEditing?: boolean;
  onChange?: (nextData: AboutIntroData) => void;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onUploadImage?: (index: number, field: string, file: File) => Promise<void>;
}

export function AboutIntro({
  data,
  isEditing = false,
  onChange,
  onAddItem,
  onRemoveItem,
  onUploadImage,
}: AboutIntroProps) {
  const updateItem = (index: number, field: string, value: string) => {
    onChange?.({
      ...data,
      items: data.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    });
  };

  const getFieldValue = (
    item: AboutIntroData["items"][number],
    field: string,
  ) => (item as unknown as { [key: string]: string | undefined })[field] || "";

  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]">
      <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-4">
        A propos
      </h2>
      {isEditing && onAddItem && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center gap-2 rounded-full border border-darkBrown px-4 py-2 text-sm font-semibold text-darkBrown transition hover:bg-darkBrown hover:text-white"
          >
            <FiPlus size={16} />
            Add item
          </button>
        </div>
      )}
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
            {isEditing ? (
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-darkBrown">
                    About item {index + 1}
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
                  label="Title"
                  value={item.title}
                  onChange={(value) => updateItem(index, "title", value)}
                />
                <EditorField
                  type="rich"
                  label="Description"
                  value={item.description}
                  onChange={(value) => updateItem(index, "description", value)}
                />
                <EditorField
                  type="plain"
                  label="CTA text"
                  value={item.ctaText}
                  onChange={(value) => updateItem(index, "ctaText", value)}
                />
                <EditorField
                  type="plain"
                  label="CTA link"
                  value={getFieldValue(item, "ctaLink")}
                  onChange={(value) => updateItem(index, "ctaLink", value)}
                />
                {["image", "illustrationImage", "valuesImage"].map((field) => (
                  <div
                    key={field}
                    className="grid gap-3 rounded-xl border border-[#efe7dc] bg-[#f8f4ee] p-3"
                  >
                    {getFieldValue(item, field) ? (
                      <img
                        src={getFieldValue(item, field)}
                        alt={`${field} ${index + 1}`}
                        className="h-24 w-full rounded-xl object-cover"
                      />
                    ) : null}
                    <EditorField
                      type="plain"
                      label={field}
                      value={getFieldValue(item, field)}
                      onChange={(value) => updateItem(index, field, value)}
                    />
                    {onUploadImage && (
                      <InlineUploadButton
                        label={`Upload ${field}`}
                        onUpload={(file) => onUploadImage(index, field, file)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-darkBrown mb-2">
                  {item.title}
                </h3>
                <RichTextContent
                  html={item.description}
                  className="text-brownBlack mb-3"
                />
                <p className="text-darkRed font-semibold">{item.ctaText}</p>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
