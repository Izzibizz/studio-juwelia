import type {
  AboutIntroData,
  ValuesIntroItem,
  ProfileIntroItem,
} from "../../api/contentAPI";

import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface AboutIntroProps {
  data: AboutIntroData;
  isEditing?: boolean;
  onChange?: (nextData: AboutIntroData) => void;

  onAddValueItem?: () => void;
  onRemoveValueItem?: (index: number) => void;

  onAddProfileItem?: () => void;
  onRemoveProfileItem?: (index: number) => void;

  onUploadImage?: (
    index: number,
    field: string,
    file: File,
    type: "values" | "profile",
  ) => Promise<void>;
}

export function AboutIntro({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
}: AboutIntroProps) {
  const updateValues = <K extends keyof ValuesIntroItem>(
    field: K,
    value: ValuesIntroItem[K],
  ) => {
    onChange?.({
      ...data,
      values: {
        ...data.values,
        [field]: value,
      },
    });
  };

  const updateProfile = <K extends keyof ProfileIntroItem>(
    field: K,
    value: ProfileIntroItem[K],
  ) => {
    onChange?.({
      ...data,
      profile: {
        ...data.profile,
        [field]: value,
      },
    });
  };

  console.log("AboutIntro data:", data);

  return (
    <section className="p-6 bg-beige rounded-2xl">

      {/* VALUES */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Values</h3>

        {isEditing ? (
          <>
            <EditorField
              type="plain"
              label="Title"
              value={data.values.title}
              onChange={(v) => updateValues("title", v)}
            />

            <EditorField
              type="rich"
              label="Description"
              value={data.values.description}
              onChange={(v) => updateValues("description", v)}
            />

            <EditorField
              type="plain"
              label="CTA"
              value={data.values.ctaText}
              onChange={(v) => updateValues("ctaText", v)}
            />

            <EditorField
              type="plain"
              label="Link"
              value={data.values.ctaLink}
              onChange={(v) => updateValues("ctaLink", v)}
            />

            <EditorField
              type="plain"
              label="Illustration"
              value={data.values.illustrationImage}
              onChange={(v) => updateValues("illustrationImage", v)}
            />

            {onUploadImage && (
              <ImageUploadDropzone
                label="Upload illustration"
                onUpload={(file) =>
                  onUploadImage(0, "illustrationImage", file, "values")
                }
              />
            )}
          </>
        ) : (
          <>
            <h4>{data.values.title}</h4>
            <RichTextContent html={data.values.description} />
          </>
        )}
      </div>

      {/* PROFILE */}
      <div>
        <h3 className="text-xl font-bold mb-4">Profile</h3>

        {isEditing ? (
          <>
            <EditorField
              type="plain"
              label="Title"
              value={data.profile.title}
              onChange={(v) => updateProfile("title", v)}
            />

            <EditorField
              type="rich"
              label="Description"
              value={data.profile.description}
              onChange={(v) => updateProfile("description", v)}
            />

            <EditorField
              type="plain"
              label="Image"
              value={data.profile.image}
              onChange={(v) => updateProfile("image", v)}
            />

            {onUploadImage && (
              <ImageUploadDropzone
                label="Upload image"
                onUpload={(file) =>
                  onUploadImage(0, "image", file, "profile")
                }
              />
            )}
          </>
        ) : (
          <>
            <h4>{data.profile.title}</h4>
            <RichTextContent html={data.profile.description} />
          </>
        )}
      </div>
    </section>
  );
}