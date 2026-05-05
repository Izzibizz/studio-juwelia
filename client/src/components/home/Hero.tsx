import type { HeroSectionData } from "../../api/contentAPI";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
/* import { InlineUploadButton } from "./InlineUploadButton"; */

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
  /*   onUploadImage, */
}: HeroProps) {
  const updateField = (field: keyof HeroSectionData, value: string) => {
    onChange?.({ ...data, [field]: value });
  };

  return (
    <section className="flex flex-col w-11/12 mx-auto tablet:w-full gap-6">
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
        </div>
      ) : (
        <div className="grid tablet:grid-cols-5 tablet:justify-between">
          <div className="flex flex-col gap-4 tablet:col-span-2">
            <div className="flex flex-col gap-8 tablet:ml-38 tablet:mt-14">
              <h1 className="text-3xl font-juwelia">{data.title}</h1>
              <RichTextContent
                html={data.subtitle}
                className="text-4xl font-tropical"
              />
              <RichTextContent html={data.description} className="" />
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-5 py-3 rounded-full bg-white text-darkBrown font-semibold hover:opacity-90"
                  onClick={() =>
                    document
                      .getElementById("artIntro")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {data.primaryCtaText}
                </button>
              </div>
            </div>
            {data.imageLeft && (
              <img
                src={data.imageLeft}
                alt="Hero left"
                className="object-cover tablet:mt-2"
              />
            )}
          </div>
          <div className="flex flex-col tablet:flex-row tablet:col-span-2 gap-4 ">
            <RichTextContent html={data.poem} className="self-end" />
            {data.imageRight && (
              <img
                src={data.imageRight}
                alt="Hero right"
                className="object-cover tablet:absolute tablet:right-[-100px] tablet:top-0 tablet:max-w-[500px] laptop:max-w-[800px]"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
