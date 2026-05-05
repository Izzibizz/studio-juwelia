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
    <section className="flex flex-col gap-6 w-screen max-w-screen">
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
          <div className="min-h-screen">
            <h1 className="text-3xl font-juwelia">
              {data.title}
            </h1>
            <RichTextContent
              html={data.subtitle}
              className="text-4xl mb-4 font-tropical"
            />
            <RichTextContent
              html={data.description}
              className=""
            />
            <RichTextContent
              html={data.poem}
              className="italic mb-8"
            />
             {(data.imageLeft || data.imageRight || isEditing) && (
          <div className="">
            {(["imageLeft", "imageRight"] as const).map((field) => (
              <div
                key={field}
                className=""
              >
                {data[field] && (
                  <img
                    src={data[field]}
                    alt={field === "imageLeft" ? "Hero left" : "Hero right"}
                    className={` ${field === "imageLeft" ? "left-0 bottom-0" : "right-0 top-4"} absolute object-cover`}
                  />
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
    </section>
  );
}
