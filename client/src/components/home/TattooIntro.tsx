import { useMemo, useState, useEffect } from "react";
import type { GalleryIntroSectionData } from "../../api/contentAPI";
import {  FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { SplitRevealSlider } from "./SplitRevealSlider";
import { NavLink } from "react-router-dom";

interface TattooIntroProps {
  data: GalleryIntroSectionData;
  isEditing?: boolean;
  onChange?: (nextData: GalleryIntroSectionData) => void;
  onUploadImage?: (index: number, file: File) => Promise<void>;
  onAddImageUpload?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
}

export function TattooIntro({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
  onRemoveImage,
}: TattooIntroProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);

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

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 1280);
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

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

  console.log("Rendering TattooIntro with data:", data);

  return (
    <section className=" bg-brown text-warmWhite flex flex-col gap-6 relative pb-22">
      <div className={`${isEditing || isMobile ? "flex-col w-10/12 my-24" : "flex-row w-9/12 justify-between my-32"} mx-auto flex`}>
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
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{data.title}</h2>
          <RichTextContent html={data.description} className="mb-5" />
           <button className="px-5 py-3 rounded-full w-fit border border-warmWhite text-warmWhite font-semibold transition cursor-pointer hover:scale-105">
                <NavLink to="/tatouages">{data.ctaText}</NavLink>
              </button>
        </div>
      )}

      {(data.imageGallery.length > 0 || isEditing) && (
        <div className="mt-4 grid gap-3">
          {isEditing ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {data.imageGallery.map((item, index) => (
                <div
                  key={`${index}`}
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
                      className="h-20 w-full rounded-lg object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[#d8cfc1] text-xs">
                      No image
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">
                      Image {index + 1}
                    </span>
                    {onRemoveImage && (
                      <button
                        type="button"
                        onClick={() => onRemoveImage(index)}
                        className=" transition hover:opacity-70"
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
            <div className="flex flex-col items-center gap-6">
              {galleryImages.length > 1 && (
                <SplitRevealSlider
                  left={{
                    image: galleryImages[0]?.image,
                    alt: galleryImages[0]?.alt || "Before tattoo",
                    name: galleryImages[0]?.name || "Avant",
                  }}
                  right={{
                    image: galleryImages[1]?.image,
                    alt: galleryImages[1]?.alt || "After tattoo",
                    name: galleryImages[1]?.name || "Après",
                  }}
                />
              )}
              <p>Glissez pour révéler l’illustration et le tatouage final</p>
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
