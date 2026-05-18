import type {
  FaqSectionData,
  ImageGalleryItemData,
} from "../../api/contentAPI";

import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { useState } from "react";

interface FAQSectionProps {
  data?: FaqSectionData;
  isEditing?: boolean;
  onChange?: (nextData: FaqSectionData) => void;

  currentPage: "homepage" | "about" | "tattoo" | "art" | "contact";

  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onAddImageUpload?: (file: File, alt?: string) => Promise<void>;

  faqRef?: React.RefObject<HTMLElement | null>;
}

const emptyFaqData: FaqSectionData = {
  title: "",
  images: [],
  items: [],
  pageImageMap: {
    homepage: [],
    about: [],
    tattoo: [],
    art: [],
    contact: [],
  },
};

export function FAQSection({
  data,
  isEditing = false,
  onChange,
  onAddItem,
  onRemoveItem,
  onAddImageUpload,
  faqRef,
  currentPage,
}: FAQSectionProps) {
  const [isAddingImage, setIsAddingImage] = useState(false);

  const faqData = data || emptyFaqData;

  const updateField = (field: keyof FaqSectionData, value: string) => {
    onChange?.({
      ...faqData,
      [field]: value,
    });
  };

  const updateItem = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    onChange?.({
      ...faqData,

      items: faqData.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    });
  };

  const handleAddImage = async (file: File, alt: string) => {
    if (!onAddImageUpload) return;

    setIsAddingImage(true);

    try {
      await onAddImageUpload(file, alt);
    } finally {
      setIsAddingImage(false);
    }
  };

  const toggleSelectedImage = (id?: string) => {
    if (!id) return;

    const currentPageImages =
      faqData.pageImageMap?.[currentPage] || [];

    const exists = currentPageImages.includes(id);

    const nextPageImages = exists
      ? currentPageImages.filter((i) => i !== id)
      : [...currentPageImages, id];

    onChange?.({
      ...faqData,

      pageImageMap: {
        ...faqData.pageImageMap,

        [currentPage]: nextPageImages,
      },
    });
  };

  const selectedImages = faqData.images.filter((img) =>
    (faqData.pageImageMap?.[currentPage] || []).includes(
      img.id || "",
    ),
  );

  return (
    <section
      className="rounded-2xl p-6 md:p-8 bg-warmWhite border border-[#e7dfd5]"
      ref={faqRef}
    >
      {isEditing ? (
        <div className="mb-6 grid gap-4 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
          <EditorField
            type="plain"
            label="Section title"
            value={faqData.title || ""}
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
          {faqData.title || ""}
        </h2>
      )}

      <div className="space-y-3">
        {faqData.items.map((item, index) => (
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
                  onChange={(value) =>
                    updateItem(index, "question", value)
                  }
                />

                <EditorField
                  type="rich"
                  label="Answer"
                  value={item.answer}
                  onChange={(value) =>
                    updateItem(index, "answer", value)
                  }
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

  {!isEditing && selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {selectedImages.map((img) => (
            <img
              key={img.id || img.image}
              src={img.image}
              alt={img.alt}
              className="rounded-xl object-cover w-full h-[400px] w-auto"
            />
          ))}
        </div>
      )} 

      {isEditing && (
        <div className="mt-6 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
          <h4 className="text-sm font-semibold mb-3">
            FAQ images ({currentPage})
          </h4>

          <div className="mb-3">
            <ImageUploadDropzone
              label={
                isAddingImage
                  ? "Uploading..."
                  : "Upload image for FAQ"
              }
              onUpload={(file, alt) =>
                handleAddImage(file, alt)
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {faqData.images.map((img: ImageGalleryItemData) => (
              <label
                key={img.id || img.image}
                className="flex flex-col items-center gap-2 p-2 border rounded-lg"
              >
                <img
                  src={img.image}
                  alt={img.alt}
                  className="w-full h-[400px] w-auto object-cover rounded"
                />

                <div className="flex items-center gap-2 text-lg">
                  <input
                    type="checkbox"
                    checked={(
                      faqData.pageImageMap?.[currentPage] || []
                    ).includes(img.id || "")}
                    onChange={() =>
                      toggleSelectedImage(img.id)
                    }
                    className="w-6 h-6 accent-mediumGreen cursor-pointer"
                  />

                  <span className="text-darkBrown">
                    Show
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}