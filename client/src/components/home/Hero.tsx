import type { HeroSectionData } from "../../api/contentAPI";
import { Link } from "react-router-dom";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { InlineUploadButton } from "./InlineUploadButton";

interface HeroProps {
  data: HeroSectionData;
  isEditing?: boolean;
  onChange?: (nextData: HeroSectionData) => void;
  onUploadImage?: (
    field: "imageLeft" | "imageRight",
    file: File,
  ) => Promise<void>;
}

export function Hero({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
}: HeroProps) {
  const updateField = (field: keyof HeroSectionData, value: string) => {
    onChange?.({ ...data, [field]: value });
  };

  return (
    <section className="rounded-2xl p-8 md:p-12 bg-darkBrown text-white">
      <div className="max-w-3xl">
        {isEditing ? (
          <div className="mb-8 grid gap-4 rounded-2xl border border-white/15 bg-white/10 p-4">
            <EditorField
              type="plain"
              label="Hero title"
              value={data.title}
              onChange={(value) => updateField("title", value)}
            />
            <EditorField
              type="rich"
              label="Hero subtitle"
              value={data.subtitle}
              onChange={(value) => updateField("subtitle", value)}
            />
            <EditorField
              type="rich"
              label="Hero description"
              value={data.description}
              onChange={(value) => updateField("description", value)}
            />
            <EditorField
              type="rich"
              label="Poem"
              value={data.poem}
              onChange={(value) => updateField("poem", value)}
            />
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {data.title}
            </h1>
            <RichTextContent
              html={data.subtitle}
              className="text-lg md:text-xl text-beige mb-4"
            />
            <RichTextContent
              html={data.description}
              className="text-beige mb-6"
            />
            <RichTextContent
              html={data.poem}
              className="italic text-beige/90 mb-8"
            />
          </>
        )}
        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <div className="grid w-full gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 md:max-w-lg">
              <EditorField
                type="plain"
                label="CTA text"
                value={data.primaryCtaText}
                onChange={(value) => updateField("primaryCtaText", value)}
              />
              <EditorField
                type="plain"
                label="CTA link"
                value={data.primaryCtaLink}
                onChange={(value) => updateField("primaryCtaLink", value)}
              />
            </div>
          ) : (
            <Link
              to={data.primaryCtaLink}
              className="px-5 py-3 rounded-full bg-white text-darkBrown font-semibold hover:opacity-90"
            >
              {data.primaryCtaText}
            </Link>
          )}
        </div>
        {(data.imageLeft || data.imageRight || isEditing) && (
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {(["imageLeft", "imageRight"] as const).map((field) => (
              <div
                key={field}
                className="grid gap-3 rounded-xl border border-white/15 bg-white/10 p-3"
              >
                {data[field] ? (
                  <img
                    src={data[field]}
                    alt={field === "imageLeft" ? "Hero left" : "Hero right"}
                    className="h-40 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/30 text-sm text-beige/80">
                    No image selected
                  </div>
                )}
                {isEditing && (
                  <>
                    <EditorField
                      type="plain"
                      label={
                        field === "imageLeft"
                          ? "Left image URL"
                          : "Right image URL"
                      }
                      value={data[field]}
                      onChange={(value) => updateField(field, value)}
                    />
                    {onUploadImage && (
                      <InlineUploadButton
                        label={
                          field === "imageLeft"
                            ? "Upload left image"
                            : "Upload right image"
                        }
                        onUpload={(file) => onUploadImage(field, file)}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
