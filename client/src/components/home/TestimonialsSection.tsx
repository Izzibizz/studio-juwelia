import type { TestimonialsSectionData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface TestimonialsSectionProps {
  data?: TestimonialsSectionData;
  isEditing?: boolean;
  onChange?: (nextData: TestimonialsSectionData) => void;
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onUploadImage?: (field: string, file: File) => Promise<void>;
}

export function TestimonialsSection({
  data,
  isEditing = false,
  onChange,
  onAddItem,
  onRemoveItem,
  onUploadImage,
}: TestimonialsSectionProps) {
  const updateField = (field: keyof TestimonialsSectionData, value: string) => {
    onChange?.({ ...(data || { items: [] }), [field]: value });
  };

  const updateItem = (
    index: number,
    field: "name" | "quote" | "typeOfClient",
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
    <section className="p-6  pb-20 laptop:pb-[350px] bg-lightBrown relative">
      <div className={`flex flex-col ${!isEditing ? 'laptop:flex-row' : ''} w-11/12 mx-auto gap-6`}>
        {data?.decorImage && !isEditing && (
          <img
            src={data.decorImage}
            alt="decor"
            className="w-[400px] laptop:w-[600px] object-cover pointer-events-none"
          />
        )}
        <div className="flex flex-col gap-10">
        {isEditing ? (
          <div className="mb-6 grid gap-4 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
            <EditorField
              type="plain"
              label="Section title"
              value={data?.title || ""}
              onChange={(value) => updateField("title", value)}
            />
            <EditorField
              type="plain"
              label="Section subTitle"
              value={data?.subTitle || ""}
              onChange={(value) => updateField("subTitle", value)}
            />
            <div className="space-y-3 flex flex-col">
              {data?.decorImage && (
                <img
                  src={data.decorImage}
                  alt="decor"
                  className="w-full max-w-[400px] rounded-xl object-cover self-center"
                />
              )}

              {onUploadImage && (
                <ImageUploadDropzone
                  label="Upload decor image"
                  onUpload={(file) => onUploadImage("decorImage", file)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-warmWhite">
            <h2 className="text-2xl md:text-3xl font-tropical mb-6">
              {data?.title || ""}
            </h2>
            <h3 className="text-lg max-w-[500px]">{data?.subTitle || ""}</h3>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4">
          {(data?.items ?? []).map((item, index) => (
            <article
              key={index}
              className="p-8 rounded-4xl bg-pinkBeige"
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
                    label="Type of Client"
                    value={item.typeOfClient}
                    onChange={(value) =>
                      updateItem(index, "typeOfClient", value)
                    }
                  />
                </div>
              ) : (
                <>
                  <RichTextContent
                    html={item.quote}
                    className="text-brownBlack mb-3"
                  />
                  <p className="text-darkBrown">- {item.name}</p>
                  <p className="text-sm text-brown">{item.typeOfClient}</p>
                </>
              )}
            </article>
          ))}
        </div>
        </div>
        {isEditing && onAddItem && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onAddItem}
              className="inline-flex items-center gap-2 rounded-full bg-warmWhite px-4 py-2 text-sm font-semibold text-darkBrown transition hover:bg-darkBrown hover:text-white"
            >
              <FiPlus size={16} />
              Add testimonial
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
