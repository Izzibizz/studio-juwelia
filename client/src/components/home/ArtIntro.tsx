import { useMemo } from "react";
import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageGallerySwiper } from "./ImageGallerySwiper";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

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

  return (
    <section
      id="artIntro"
      className="bg-darkBrown text-warmWhite flex flex-col gap-6"
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
          <p className="font-semibold ">{data.ctaText}</p>
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
            <div className=" w-11/12 laptop:w-9/12 mx-auto">
            <ImageGallerySwiper images={galleryImages} variant="art" />
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
