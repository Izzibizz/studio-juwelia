import { useMemo, useState } from "react";
import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { CenteredEmblaGallery } from "./CenteredEmblaCarousel";

interface ArtIntroProps {
  data: GalleryIntroSectionData;
  isEditing?: boolean;
  onChange?: (nextData: GalleryIntroSectionData) => void;
  onUploadImage?: (index: number, file: File) => Promise<void>;
  onAddImageUpload?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
}

export function ArtIntro({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
  onAddImageUpload,
  onRemoveImage,
}: ArtIntroProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const galleryImages = useMemo(
    () => data.imageGallery.filter((item) => Boolean(item.image)),
    [data.imageGallery],
  );

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

  const reorderGalleryImages = (fromIndex: number, toIndex: number) => {
    const newGallery = [...data.imageGallery];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);
    onChange?.({ ...data, imageGallery: newGallery });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
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

  return (
    <section
      id="artIntro"
      className="bg-darkBrown text-warmWhite flex flex-col gap-6 relative pt-14 laptop:pt-0 pb-[100px] laptop:pb-[350px]"
    >
      <div className="w-11/12 laptop:w-9/12 mx-auto">
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
          <div className="self-end text-end flex flex-col items-end">
            <h2 className="text-2xl md:text-3xl font-tropical mb-3">
              {data.title}
            </h2>
            <RichTextContent
              html={data.description}
              className=" mb-5 tablet:max-w-[500px] self-end"
            />
            <button className="font-semibold ">
              <Link to="/tatouages">{data.ctaText}</Link>
            </button>
          </div>
        )}

        {(data.imageGallery.length > 0 || isEditing) && (
          <div className="mt-4 grid gap-3">
            {isEditing && onAddImageUpload && (
              <div className="rounded-lg bg-white p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-darkBrown">
                  <FiPlus size={15} />
                  Add image to gallery
                </div>
                <ImageUploadDropzone
                  label="Drop image to add a new gallery item"
                  onUpload={onAddImageUpload}
                />
              </div>
            )}
            {isEditing ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                {data.imageGallery.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`grid gap-3 rounded-lg bg-white p-3 cursor-move transition-all ${
                      draggedIndex === index
                        ? "opacity-50"
                        : dragOverIndex === index
                          ? "ring-2 ring-blue-500 scale-105"
                          : ""
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.alt || item.name}
                        className="h-[400px] w-full rounded-lg object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[#d8cfc1] text-xs text-brown">
                        No image
                      </div>
                    )}
                    <div className="flex flex-col justify-between gap-2">
                      {onRemoveImage && (
                        <button
                          type="button"
                          onClick={() => onRemoveImage(index)}
                          className="text-darkRed transition hover:opacity-70 self-end p-4 cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
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
                      label="Nom/description"
                      value={item.name || ""}
                      onChange={(value) =>
                        updateGalleryField(index, "name", value)
                      }
                    />
                    {onUploadImage && (
                      <ImageUploadDropzone
                        label="Drop to replace this image"
                        onUpload={(file) => onUploadImage(index, file)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center overflow-hidden">
                <div className="w-full max-w-[1200px]">
                  <CenteredEmblaGallery images={galleryImages} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <svg
        viewBox="0 0 1920 373.98"
        className="w-[105%] laptop:w-[100%] absolute bottom-[-2px] left-1/2 laptop:left-0 -translate-x-1/2 laptop:translate-x-0 h-auto"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1920,373.98H0V108.08c32.78,15.23,66.3,29.8,100.48,43.51,135.74,54.47,275.03,98.59,417.57,132.15,142.47,33.55,289.71,56.06,435.89,62.73,131.04,5.98,261.46-1.8,389.82-28.81,139.91-29.44,275.24-81.52,394.95-159.91,66.11-43.29,131.62-97.22,181.28-157.75v373.98Z"
          fill="#793c29"
        />
      </svg>
    </section>
  );
}
