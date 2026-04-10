import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { InlineUploadButton } from "./InlineUploadButton";

interface SectionIntroProps {
  data: GalleryIntroSectionData;
  isEditing?: boolean;
  onChange?: (nextData: GalleryIntroSectionData) => void;
  onUploadImage?: (index: number, file: File) => Promise<void>;
  onAddImage?: () => void;
  onRemoveImage?: (index: number) => void;
}

export function SectionIntro({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
  onAddImage,
  onRemoveImage,
}: SectionIntroProps) {
  const updateField = (field: keyof GalleryIntroSectionData, value: string) => {
    onChange?.({ ...data, [field]: value });
  };

  const updateGalleryField = (
    index: number,
    field: "image" | "alt" | "name",
    value: string,
  ) => {
    onChange?.({
      ...data,
      imageGallery: data.imageGallery.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    });
  };

  return (
    <section className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]">
      {isEditing ? (
        <div className="grid gap-4">
          <EditorField
            type="plain"
            label="Title"
            value={data.title}
            onChange={(value) => updateField("title", value)}
          />
          <EditorField
            type="rich"
            label="Description"
            value={data.description}
            onChange={(value) => updateField("description", value)}
          />
          <EditorField
            type="plain"
            label="CTA text"
            value={data.ctaText}
            onChange={(value) => updateField("ctaText", value)}
          />
        </div>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-3">
            {data.title}
          </h2>
          <RichTextContent
            html={data.description}
            className="text-brownBlack mb-5"
          />
          <p className="text-darkRed font-semibold">{data.ctaText}</p>
        </>
      )}

      {(data.imageGallery.length > 0 || isEditing) && (
        <div className="mt-4 grid gap-3">
          {isEditing && onAddImage && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onAddImage}
                className="inline-flex items-center gap-2 rounded-full border border-darkBrown px-4 py-2 text-sm font-semibold text-darkBrown transition hover:bg-darkBrown hover:text-white"
              >
                <FiPlus size={16} />
                Add image
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {data.imageGallery.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="grid gap-3 rounded-lg bg-white p-3"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.alt || item.name}
                    className="h-20 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[#d8cfc1] text-xs text-brown">
                    No image
                  </div>
                )}
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-darkBrown">
                        Image {index + 1}
                      </span>
                      {onRemoveImage && (
                        <button
                          type="button"
                          onClick={() => onRemoveImage(index)}
                          className="text-darkRed transition hover:opacity-70"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                    <EditorField
                      type="plain"
                      label="Image URL"
                      value={item.image}
                      onChange={(value) =>
                        updateGalleryField(index, "image", value)
                      }
                    />
                    <EditorField
                      type="plain"
                      label="Alt text"
                      value={item.alt}
                      onChange={(value) =>
                        updateGalleryField(index, "alt", value)
                      }
                    />
                    <EditorField
                      type="plain"
                      label="Name"
                      value={item.name}
                      onChange={(value) =>
                        updateGalleryField(index, "name", value)
                      }
                    />
                    {onUploadImage && (
                      <InlineUploadButton
                        label="Upload image"
                        onUpload={(file) => onUploadImage(index, file)}
                      />
                    )}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
