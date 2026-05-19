import type {
  AboutIntroData,
  ValuesIntroItem,
  ProfileIntroItem,
} from "../../api/contentAPI";
import { EditorField } from "../editor";
import { NavLink } from "react-router-dom";
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
  faqRef: React.RefObject<HTMLElement | null>;
}

export function AboutIntro({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
  faqRef,
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

  // LIST HELPERS
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
    <section className="p-6 bg-beige rounded-2xl space-y-10 relative pb-20 laptop:pb-38">
      <div className="w-11/12 mx-auto max-w-[1100px] flex flex-col gap-6 laptop:gap-38">
        <img
          src={data.values.valuesImage}
          alt="Values illustration"
          className="w-full z-10 h-auto laptop:absolute top-10 left-[-130px] max-w-[600px] max-h-[700px] object-cover rounded-lg"
        />
        {/* ================= VALUES ================= */}
        <div>
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
                label="CTA text for button of Values section"
                value={data.values.ctaText}
                onChange={(v) => updateValues("ctaText", v)}
              />

              {/* ================= VALUES IMAGE (NEW) ================= */}
              <div className="space-y-2 mt-4">
                <EditorField
                  type="plain"
                  label="Values Image URL"
                  value={data.values.valuesImage}
                  onChange={(v) => updateValues("valuesImage", v)}
                />

                {data.values.valuesImage && (
                  <img
                    src={data.values.valuesImage}
                    alt="values"
                    className="w-full max-h-48 object-cover rounded-lg"
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

              {/* ================= ILLUSTRATION IMAGE ================= */}
              <div className="space-y-2 mt-4 flex flex-col">
                <EditorField
                  type="plain"
                  label="Illustration image URL"
                  value={data.values.illustrationImage}
                  onChange={(v) => updateValues("illustrationImage", v)}
                />

                {data.values.illustrationImage && (
                  <img
                    src={data.values.illustrationImage}
                    alt="illustration"
                    className="w-full max-h-[500px] max-w-[400px] self-center object-cover rounded-lg"
                  />
                )}

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
            <div className="flex flex-col laptop:flex-row laptop:justify-between laptop:max-w-[900px] mx-auto relative z-20 gap-6 bg-beige laptop:p-8 rounded-2xl">
              <div className="flex flex-col gap-6">
                <h4 className="font-tropical text-4xl">{data.values.title}</h4>
                <RichTextContent
                  html={data.values.description}
                  className="laptop:max-w-[400px]"
                />
                <button
                  onClick={() => {
                    if (faqRef.current) {
                      const y =
                        faqRef.current.getBoundingClientRect().top +
                        window.pageYOffset -
                        100;

                      window.scrollTo({
                        top: y,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-fit inline-block px-5 py-3 rounded-full border border-darkBrown text-darkBrown font-semibold  transition cursor-pointer hover:scale-105"
                >
                  {data.values.ctaText}
                </button>
              </div>
              <img
                src={data.values.illustrationImage}
                alt="illustration"
                className="w-full max-h-[500px] max-w-[400px] self-center object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* ================= PROFILE ================= */}
        <div>
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
              <EditorField
                type="plain"
                label="Call to action text"
                value={data.profile.ctaText}
                onChange={(v) => updateProfile("ctaText", v)}
              />
              {/* ================= LIST ================= */}
              <div className="mt-6">
                {(data.profile.list ?? []).map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      className="flex-1 border p-2 rounded"
                      value={item}
                      onChange={(e) => updateListItem(index, e.target.value)}
                    />

                    <button
                      onClick={() => removeListItem(index)}
                      className="text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={addListItem}
                    className="flex items-center gap-1 text-sm border rounded-4xl px-4 py-2 my-8 cursor-pointer hover:scale-105 transition"
                  >
                    <FiPlus /> Add list item
                  </button>
                </div>
                {data.profile.profileImage && (
                  <img
                    src={data.profile.profileImage}
                    alt="profile"
                    className="w-full max-h-[700px] max-w-[600px] object-cover rounded-lg"
                  />
                )}

                {onUploadImage && (
                  <ImageUploadDropzone
                    label="Upload profile image"
                    onUpload={(file) =>
                      onUploadImage(0, "image", file, "profile")
                    }
                  />
                )}
                {data.profile.decorImage && (
                  <img
                    src={data.profile.decorImage}
                    alt="decor"
                    className="w-full max-h-[700px] max-w-[600px] object-cover rounded-lg"
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
            </div>
          ) : (
            <div className="flex flex-col laptop:flex-row gap-6 laptop:gap-12">
              <img
                src={data.profile.profileImage}
                alt="portrait Juwelia Joelle artiste"
                className="w-full max-w-[400px] self-center object-cover rounded-lg"
              />
              <div className="flex flex-col gap-4">
                <h4 className="font-tropical text-4xl">{data.profile.title}</h4>
                <RichTextContent
                  html={data.profile.description}
                  className="max-w-[400px]"
                />

                {(data.profile.list?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2">
                      {data.profile.listTitle}
                    </h5>

                    <ul className="list-disc ml-5">
                      {data.profile.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <NavLink
                  to="/a-propos"
                  className="mt-4 z-70 w-fit inline-block px-5 py-3 rounded-full border border-darkBrown text-darkBrown font-semibold  transition cursor-pointer hover:scale-105 cursor-pointer"
                >
                  {data.profile.ctaText}
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
      {data.profile.decorImage && !isEditing && (
        <img
          src={data.profile.decorImage}
          alt="decor"
          className="laptop:absolute bottom-0 right-[-50px] w-[600px] h-auto object-cover"
        />
      )}

      <svg
        viewBox="0 0 712.7 125.09"
        className="w-[105%] laptop:w-[100%] absolute bottom-[-2px] left-1/2 laptop:left-0 -translate-x-1/2 laptop:translate-x-0 h-auto block"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M435.13,122.02c94.17,2.35,185.11-11.42,277.56-26.79v29.86H0V75.48c36.81-.95,366.35,45.09,421.43,46.47Z"
          fill="#fefaf0"
        />
      </svg>
    </section>
  );
}
