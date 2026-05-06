import type { HeroSectionData } from "../../api/contentAPI";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { motion } from "framer-motion";
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
    <section className="flex flex-col gap-6 relative">
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
        <div className="grid tablet:grid-cols-5 tablet:justify-between  w-11/12 mx-auto tablet:w-full">
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
                  className="px-5 py-3 rounded-full border border-darkBrown text-darkBrown font-semibold hover:border-mediumGreen hover:text-mediumGreen transition cursor-pointer hover:scale-105"
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
              <motion.img
                src={data.imageLeft}
                alt="Hero left"
                className="object-cover tablet:mt-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            )}
          </div>
          <div className="flex flex-col tablet:flex-row tablet:col-span-2 gap-4 ">
            <RichTextContent
              html={data.poem}
              className="px-4 tablet:self-end tablet:mb-8 tablet:ml-22 laptop:self-center"
            />
            {data.imageRight && (
              <motion.img
                src={data.imageRight}
                alt="Hero right"
                className="object-cover tablet:absolute tablet:right-0 tablet:top-0 tablet:w-1/3 tablet:max-w-[500px] laptop:max-w-[700px]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              />
            )}
          </div>
        </div>
      )}
      <svg
        viewBox="0 0 5483.08 1501.25"
        className="w-[105%] laptop:w-[100%] absolute bottom-[-2px] left-1/2 laptop:left-0 -translate-x-1/2 laptop:translate-x-0 h-auto"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5374.56,65.36c-1.5.85,4.84,2.73,7.07,2.74l61.16.4,40.29,2.58v1430.17H0v-276.36c68.7,21.72,136.75,42.05,208.4,60.46,330.31,84.86,685.78,133.61,1026.93,126.81,340.88-6.79,677.88-67.86,986.51-215.59,153.75-73.59,293.61-168.83,421.03-281.79,142.41-126.26,299.5-234.42,464.67-329.06,344.43-197.35,733.7-330.52,1121.88-411.86,272.29-57.05,547.51-89.51,824.43-103.15l29.66-1.46,82.58-3.89h208.47Z"
          fill="rgb(91, 44, 36)"
        />
      </svg>
    </section>
  );
}
