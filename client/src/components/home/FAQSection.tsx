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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

    const currentPageImages = faqData.pageImageMap?.[currentPage] || [];

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

  const reorderGalleryImages = (fromIndex: number, toIndex: number) => {
    const newGallery = [...faqData.images];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);
    onChange?.({ ...faqData, images: newGallery });
  };

  const updateGalleryField = (
    index: number,
    field: "image" | "alt" | "name",
    value: string,
  ) => {
    onChange?.({
      ...faqData,
      images: faqData.images.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    });
  };

  const removeGalleryImage = (index: number) => {
    onChange?.({
      ...faqData,
      images: faqData.images.filter((_, i) => i !== index),
      pageImageMap: {
        ...faqData.pageImageMap,
        [currentPage]: (faqData.pageImageMap?.[currentPage] || []).filter(
          (id) => id !== faqData.images[index]?.id,
        ),
      },
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      reorderGalleryImages(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const selectedImages = faqData.images.filter((img) =>
    (faqData.pageImageMap?.[currentPage] || []).includes(img.id || ""),
  );

  return (
    <section className="py-20 bg-beige relative" ref={faqRef}>
      <div className="w-11/12 mx-auto max-w-[1100px] flex flex-col ">
        {isEditing ? (
          <div className="mb-6 grid gap-4 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
            <EditorField
              type="plain"
              label="Section title"
              value={faqData.title || ""}
              onChange={(value) => updateField("title", value)}
            />
          </div>
        ) : (
          <h2 className="text-2xl md:text-3xl font-tropical text-darkBrown mb-6">
            {faqData.title || ""}
          </h2>
        )}

        <div className="space-y-3">
          {faqData.items.map((item, index) => (
            <details
              key={index}
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
                  <summary className="cursor-pointer font-tropical text-darkBrown">
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
        {isEditing && onAddItem && (
              <div className="flex justify-end mt-4">
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
        {isEditing && (
          <div className="mt-6 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
            <h4 className="text-sm font-semibold mb-3">
              FAQ images ({currentPage})
            </h4>

            <div className="mb-3">
              <ImageUploadDropzone
                label={isAddingImage ? "Uploading..." : "Upload image for FAQ"}
                onUpload={(file, alt) => handleAddImage(file, alt)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {faqData.images.map(
                (img: ImageGalleryItemData, index: number) => (
                  <div
                    key={img.id || img.image}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 border rounded-lg transition-all cursor-move ${
                      draggedIndex === index
                        ? "opacity-50"
                        : dragOverIndex === index
                          ? "ring-2 ring-blue-500 scale-105"
                          : ""
                    }`}
                  >
                    <div className="relative mb-3">
                      <img
                        src={img.image}
                        alt={img.alt}
                        className="w-full h-32 object-cover rounded"
                      />

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded p-1 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <EditorField
                        type="plain"
                        label="Image URL"
                        value={img.image || ""}
                        onChange={(value) =>
                          updateGalleryField(index, "image", value)
                        }
                      />

                      <EditorField
                        type="plain"
                        label="Alt text"
                        value={img.alt || ""}
                        onChange={(value) =>
                          updateGalleryField(index, "alt", value)
                        }
                      />

                      <EditorField
                        type="plain"
                        label="Name"
                        value={img.name || ""}
                        onChange={(value) =>
                          updateGalleryField(index, "name", value)
                        }
                      />

                      <label className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          checked={(
                            faqData.pageImageMap?.[currentPage] || []
                          ).includes(img.id || "")}
                          onChange={() => toggleSelectedImage(img.id)}
                          className="w-4 h-4 accent-mediumGreen cursor-pointer"
                        />

                        <span className="text-sm text-darkBrown">
                          Show on page
                        </span>
                      </label>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
      {!isEditing && selectedImages.length > 0 && (
<>
          {/* 1 IMAGE */}
          {selectedImages.length === 1 && (
            <img
              src={selectedImages[0].image}
              alt={selectedImages[0].alt}
              className="
          absolute
          right-0
          top-0
          w-[500px]
          h-[700px]
          object-cover
        "
            />
          )}

          {/* 2 IMAGES */}
          {selectedImages.length === 2 && (
            <>
              <img
                src={selectedImages[0].image}
                alt={selectedImages[0].alt}
                className="
            absolute
            left-0
            top-10
            w-[380px]
            h-[500px]
            object-cover
          "
              />

              <img
                src={selectedImages[1].image}
                alt={selectedImages[1].alt}
                className="
            absolute
            right-0
            top-40
            w-[420px]
            h-[580px]
            object-cover
          "
              />
            </>
          )}

          {/* 3 IMAGES */}
          {selectedImages.length >= 3 && (
            <>
              <img
                src={selectedImages[0].image}
                alt={selectedImages[0].alt}
                className="
            absolute
            left-0
            top-10
            w-[320px]
            h-[440px]
            object-cover
            z-10
          "
              />

              <img
                src={selectedImages[1].image}
                alt={selectedImages[1].alt}
                className="
            absolute
            left-1/2
            top-0
            -translate-x-1/2
            w-[420px]
            h-[600px]
            object-cover
            z-20
          "
              />

              <img
                src={selectedImages[2].image}
                alt={selectedImages[2].alt}
                className="
            absolute
            right-0
            top-32
            w-[320px]
            h-[440px]
            object-cover
            z-10
          "
              />
            </>
          )}
        </>
      )}
     {/*  <svg
        viewBox="0 0 502.42 114.03"
        className="w-[105%] laptop:w-[100%] absolute bottom-[-2px] left-1/2 laptop:left-0 -translate-x-1/2 laptop:translate-x-0 h-auto"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M502.42,93.17v20.86s-502.39,0-502.39,0L0,0l45.47.28c35.8,2.03,70.68,6.81,105.32,16.04,21.28,5.66,41.28,12.77,61.14,21.97s36.79,20.05,53.86,32.92c16.87,12.72,35.86,21.05,56.2,26.9,56.53,16.28,124.32,9.99,180.44-4.95Z"
          fill="#5b2c24"
        />
      </svg> */}
    </section>
  );
}
