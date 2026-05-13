import type {
  AboutIntroData,
  ValuesIntroItem,
  ProfileIntroItem,
} from "../../api/contentAPI";

import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface AboutIntroProps {
  data: AboutIntroData;
  isEditing?: boolean;
  onChange?: (next: AboutIntroData) => void;

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

  // LIST
  const updateList = (list: string[]) => {
    onChange?.({
      ...data,
      profile: {
        ...data.profile,
        list,
      },
    });
  };

  const addListItem = () => {
    updateList([...(data.profile.list ?? []), ""]);
  };

  const updateListItem = (index: number, value: string) => {
    const next = [...(data.profile.list ?? [])];
    next[index] = value;
    updateList(next);
  };

  const removeListItem = (index: number) => {
    updateList((data.profile.list ?? []).filter((_, i) => i !== index));
  };

  return (
    <section className="p-6 bg-beige rounded-2xl space-y-10 relative">
      {/* ================= VALUES ================= */}
      <div>
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

            {/* VALUES IMAGE */}
            <div className="space-y-2 mt-4">
              <EditorField
                type="plain"
                label="Values image"
                value={data.values.valuesImage}
                onChange={(v) => updateValues("valuesImage", v)}
              />

              {data.values.valuesImage && (
                <img
                  src={data.values.valuesImage}
                  className="w-full max-h-64 object-cover rounded"
                />
              )}

              {onUploadImage && (
                <ImageUploadDropzone
                  label="Upload values image"
                  onUpload={(file) =>
                    onUploadImage(0, "valuesImage", file, "values")
                  }
                />
              )}
            </div>

            {/* ILLUSTRATION */}
            <div className="space-y-2 mt-4">
              <EditorField
                type="plain"
                label="Illustration image"
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
            </div>
          </>
        ) : (
          <>
            <h4 className="text-3xl">{data.values.title}</h4>
            <RichTextContent html={data.values.description} />
          </>
        )}
      </div>

      {/* ================= PROFILE ================= */}
      <div>
        <h3 className="text-xl font-bold mb-4">Profile</h3>

        {isEditing ? (
          <div className="space-y-4">
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
              label="List title"
              value={data.profile.listTitle}
              onChange={(v) => updateProfile("listTitle", v)}
            />

            {/* LIST */}
            <div className="space-y-2">
              {data.profile.list?.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="border p-2 flex-1 rounded"
                    value={item}
                    onChange={(e) => updateListItem(i, e.target.value)}
                  />
                  <button onClick={() => removeListItem(i)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <button onClick={addListItem} className="flex gap-2 mt-2">
                <FiPlus /> Add item
              </button>
            </div>

            {/* PROFILE IMAGE */}
            {data.profile.profileImage && (
              <img
                src={data.profile.profileImage}
                className="w-full max-h-[500px] max-w-[500px] object-cover rounded"
              />
            )}
            {onUploadImage && (
              <ImageUploadDropzone
                label="Upload profile image"
                onUpload={(file) =>
                  onUploadImage(0, "profileImage", file, "profile")
                }
              />
            )}

            {/* DECOR IMAGE */}
            {data.profile.decorImage && (
              <img
                src={data.profile.decorImage}
                className="w-full max-h-[500px] max-w-[500px] object-cover rounded"
              />
            )}
            {onUploadImage && (
              <ImageUploadDropzone
                label="Upload decor image"
                onUpload={(file) =>
                  onUploadImage(0, "decorImage", file, "profile")
                }
              />
            )}
          </div>
        ) : (
          <div className="flex gap-10">
            <img
              src={data.profile.profileImage}
              className="w-[300px] rounded"
            />

            <div>
              <h4>{data.profile.title}</h4>
              <RichTextContent html={data.profile.description} />

              {data.profile.list?.length > 0 && (
                <>
                  <h5>{data.profile.listTitle}</h5>
                  <ul>
                    {data.profile.list.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DECOR */}
      {data.profile.decorImage && !isEditing && (
      <img
        src={data.profile.decorImage}
        className="absolute bottom-0 right-0 w-[250px]"
      />
      )}
    </section>
  );
}
