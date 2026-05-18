import { useEffect, useState } from "react";
import { ContactFormSection } from "../components/home/ContactFormSection";
import { FAQSection } from "../components/home/FAQSection";
import { ImageUploadDropzone } from "../components/home/ImageUploadDropzone";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { ContentSectionEditor, EditorField } from "../components/editor";
import { RichTextContent } from "../components/RichTextContent";
import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";
import { tattoosEditorSchema } from "../editorSchemas/tattoosEditorSchema";
import {
  contentAPI,
  defaultTattoosContent,
  type ImageGalleryItemData,
  type TattoosPageContent,
  type TattoosTechniquesData,
  type TechniqueCategory,
} from "../api/contentAPI";

const isSectionFilled = (section: unknown) => {
  if (!section || typeof section !== "object" || Array.isArray(section)) {
    return false;
  }

  return !!Object.values(section as Record<string, unknown>).some((value) =>
    typeof value === "string"
      ? value.trim().length > 0
      : Array.isArray(value)
        ? value.length > 0
        : !!value,
  );
};

export const Tattoos: React.FC = () => {
  const [content, setContent] = useState<TattoosPageContent>(
    defaultTattoosContent,
  );
  const [isLoading, setIsLoading] = useState(true);
  const { isEditMode, registerSaveAction } = useAdminStore();
  const { isAuthenticated, token } = useAuthStore();

  const emptyTechniqueCategory: TechniqueCategory = {
    title: "",
    mainImage: { image: "", alt: "", description: "" },
    description: "",
    contentText: "",
    images: [],
  };

  const uploadSingleImage = async (file: File, caption: string) => {
    const uploadedImages = await contentAPI.uploadImages(
      [file],
      token ?? undefined,
      { alt: caption, caption },
    );

    const imageUrl = uploadedImages[0]?.url;
    if (!imageUrl) {
      throw new Error("Image upload did not return a URL");
    }

    return imageUrl;
  };

  const saveTattoosPageContent = async (nextContent: TattoosPageContent) => {
    if (!token) return;

    const { introduction, techniques, details } = nextContent;
    await contentAPI.savePageContent(
      "tattoos",
      { introduction, techniques, details },
      token,
    );
  };

  const uploadIntroductionImage = async (file: File, alt: string) => {
    const imageUrl = await uploadSingleImage(file, alt);
    const nextContent = {
      ...content,
      introduction: {
        ...content.introduction,
        introImage: imageUrl,
        introImageAlt: alt,
        introImageDescription:
          content.introduction?.introImageDescription || "",
      },
    };
    setContent(nextContent);
    await saveTattoosPageContent(nextContent);
  };

  const updateTechniques = (nextTechniques: TattoosTechniquesData) => {
    setContent((current) => ({
      ...current,
      techniques: nextTechniques,
    }));
  };

  const updateTechniqueCategory = (
    categoryIndex: number,
    nextCategory: TechniqueCategory,
  ) => {
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      const categories = techniques.categories ?? [];
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: categories.map((category, index) =>
            index === categoryIndex ? nextCategory : category,
          ),
        },
      };
    });
  };

  const addTechniqueCategory = () => {
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: [
            ...(techniques.categories ?? []),
            emptyTechniqueCategory,
          ],
        },
      };
    });
  };

  const removeTechniqueCategory = (categoryIndex: number) => {
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      const categories = techniques.categories ?? [];
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: categories.filter((_, index) => index !== categoryIndex),
        },
      };
    });
  };

  const addTechniqueImageItem = (categoryIndex: number) => {
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      const categories = techniques.categories ?? [];
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: categories.map((category, index) => {
            if (index !== categoryIndex) return category;
            return {
              ...category,
              images: [
                ...(category.images ?? []),
                { image: "", alt: "", name: "", text: "" },
              ],
            };
          }),
        },
      };
    });
  };

  const removeTechniqueImageItem = (
    categoryIndex: number,
    imageIndex: number,
  ) => {
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: (techniques.categories ?? []).map((category, index) => {
            if (index !== categoryIndex) return category;
            return {
              ...category,
              images: (category.images ?? []).filter(
                (_, imageIndexItem) => imageIndexItem !== imageIndex,
              ),
            };
          }),
        },
      };
    });
  };

  const updateTechniqueImageItem = (
    categoryIndex: number,
    imageIndex: number,
    field: keyof ImageGalleryItemData,
    value: string,
  ) => {
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: (techniques.categories ?? []).map((category, index) => {
            if (index !== categoryIndex) return category;
            return {
              ...category,
              images: (category.images ?? []).map(
                (imageItem, imageItemIndex) =>
                  imageItemIndex === imageIndex
                    ? { ...imageItem, [field]: value }
                    : imageItem,
              ),
            };
          }),
        },
      };
    });
  };

  const uploadTechniqueCategoryImage = async (
    categoryIndex: number,
    imageIndex: number,
    file: File,
  ) => {
    const imageUrl = await uploadSingleImage(
      file,
      `Technique category image ${categoryIndex + 1}-${imageIndex + 1}`,
    );
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: (techniques.categories ?? []).map((category, index) => {
            if (index !== categoryIndex) return category;
            return {
              ...category,
              images: (category.images ?? []).map(
                (imageItem, imageItemIndex) =>
                  imageItemIndex === imageIndex
                    ? { ...imageItem, image: imageUrl }
                    : imageItem,
              ),
            };
          }),
        },
      };
    });
  };

  const uploadTechniqueCategoryMainImage = async (
    categoryIndex: number,
    file: File,
  ) => {
    const imageUrl = await uploadSingleImage(
      file,
      `Technique category main image ${categoryIndex + 1}`,
    );
    setContent((current) => {
      const techniques = current.techniques ?? {
        h2: "",
        h3: "",
        description: "",
        categories: [],
      };
      return {
        ...current,
        techniques: {
          ...techniques,
          categories: (techniques.categories ?? []).map((category, index) =>
            index !== categoryIndex
              ? category
              : {
                  ...category,
                  mainImage: {
                    ...category.mainImage,
                    image: imageUrl,
                  },
                },
          ),
        },
      };
    });
  };

  const uploadFaqImage = async (file: File, alt?: string) => {
    const uploadedImages = await contentAPI.uploadImages(
      [file],
      token ?? undefined,
      {
        alt: alt || file.name,
        caption: alt || file.name,
      },
    );

    const uploaded = uploadedImages[0];

    if (!uploaded?.url) {
      throw new Error("FAQ image upload failed");
    }

    const newImage: ImageGalleryItemData = {
      id: crypto.randomUUID(),
      image: uploaded.url,
      alt: alt || "",
    };

    setContent(
      (current): TattoosPageContent => ({
        ...current,

        faq: {
          title: current.faq?.title ?? defaultTattoosContent.faq?.title ?? "",

          items: current.faq?.items ?? defaultTattoosContent.faq?.items ?? [],

          images: [...(current.faq?.images ?? []), newImage],

          pageImageMap: current.faq?.pageImageMap ?? {},
        },
      }),
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await contentAPI.getTattoosPageContent();
        setContent({ ...defaultTattoosContent, ...data });
      } catch (error) {
        console.error("Failed loading tattoos page content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isEditMode) {
      registerSaveAction(null);
      return;
    }

    registerSaveAction(async () => {
      const { contactForm, testimonials, faq, ...tattoosData } = content;
      await Promise.all([
        contentAPI.savePageContent("tattoos", tattoosData, token ?? undefined),
        contentAPI.saveSharedPageContent(
          { contactForm, testimonials, faq },
          token ?? undefined,
        ),
      ]);
    });

    return () => registerSaveAction(null);
  }, [content, isAuthenticated, isEditMode, registerSaveAction, token]);

  const hasContent =
    isSectionFilled(content.introduction) ||
    isSectionFilled(content.techniques) ||
    isSectionFilled(content.details);

  const hasBookingOrExtraSections =
    isSectionFilled(content.contactForm) ||
    isSectionFilled(content.testimonials) ||
    isSectionFilled(content.faq);

  if (!isLoading && !isEditMode && !hasContent && !hasBookingOrExtraSections) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-darkBrown">
        <p>Le contenu des tatouages n’est pas encore disponible.</p>
      </div>
    );
  }

  console.log("Current tattoos page content:", content);

  return (
    <section className="flex flex-col gap-16 py-12 animate-fadeIn">
      {isAuthenticated && isEditMode ? (
        <div className="grid gap-10">
          <ContentSectionEditor
            title="Introduction"
            fields={tattoosEditorSchema.introduction}
            value={{
              h2: content.introduction?.h2 ?? "",
              h3: content.introduction?.h3 ?? "",
              description: content.introduction?.description ?? "",
              introImageDescription:
                content.introduction?.introImageDescription ?? "",
            }}
            onChange={(nextValue) =>
              setContent((current) => ({
                ...current,
                introduction: {
                  ...current.introduction,
                  h2: nextValue.h2,
                  h3: nextValue.h3,
                  description: nextValue.description,
                  introImageDescription: nextValue.introImageDescription,
                },
              }))
            }
          />

          <div className="rounded-2xl border border-[#e7dfd5] bg-[#f8f4ee] p-5">
            <h3 className="mb-4 text-lg font-bold text-darkBrown">
              Introduction Image
            </h3>
            <div className="flex flex-col tablet:flex-row tablet:items-center gap-6">
              {content.introduction?.introImage ? (
                <img
                  src={content.introduction.introImage}
                  alt={
                    content.introduction.introImageAlt ||
                    content.introduction.h2 ||
                    "Tattoo introduction image"
                  }
                  className="mb-4 w-[300px] object-cover"
                />
              ) : null}
              <ImageUploadDropzone
                label="Drop introduction image here or click to upload"
                onUpload={uploadIntroductionImage}
                initialAlt={content.introduction?.introImageAlt || ""}
              />
            </div>
          </div>

          <section className="rounded-2xl border border-[#e7dfd5] bg-[#f8f4ee] p-5">
            <h3 className="mb-4 text-lg font-bold text-darkBrown">
              Techniques
            </h3>
            <div className="grid gap-4">
              <EditorField
                type="plain"
                label="Techniques H2"
                value={content.techniques?.h2 ?? ""}
                onChange={(value) =>
                  updateTechniques({
                    ...(content.techniques ?? {
                      h2: "",
                      h3: "",
                      description: "",
                      categories: [],
                    }),
                    h2: value,
                  })
                }
              />
              <EditorField
                type="plain"
                label="Techniques H3"
                value={content.techniques?.h3 ?? ""}
                onChange={(value) =>
                  updateTechniques({
                    ...(content.techniques ?? {
                      h2: "",
                      h3: "",
                      description: "",
                      categories: [],
                    }),
                    h3: value,
                  })
                }
              />
              <EditorField
                type="rich"
                label="Techniques Description"
                value={content.techniques?.description ?? ""}
                onChange={(value) =>
                  updateTechniques({
                    ...(content.techniques ?? {
                      h2: "",
                      h3: "",
                      description: "",
                      categories: [],
                    }),
                    description: value,
                  })
                }
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h4 className="text-base font-semibold text-darkBrown">
                  Technique Categories
                </h4>
                <button
                  type="button"
                  className="rounded-full border border-darkBrown bg-white px-4 py-2 text-sm font-semibold text-darkBrown hover:bg-[#f3ede6]"
                  onClick={addTechniqueCategory}
                >
                  Add category
                </button>
              </div>

              {(content.techniques?.categories ?? []).length === 0 ? (
                <p className="text-sm text-brown">
                  No technique categories yet. Add one to start.
                </p>
              ) : null}

              {(content.techniques?.categories ?? []).map(
                (category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="rounded-3xl border border-[#d8cfc1] bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h5 className="text-base font-semibold text-darkBrown">
                        Category {categoryIndex + 1}
                      </h5>
                      <button
                        type="button"
                        className="text-sm font-semibold text-darkRed hover:opacity-80"
                        onClick={() => removeTechniqueCategory(categoryIndex)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4">
                      <EditorField
                        type="plain"
                        label="Title"
                        value={category.title ?? ""}
                        onChange={(value) =>
                          updateTechniqueCategory(categoryIndex, {
                            ...category,
                            title: value,
                          })
                        }
                      />
                      <EditorField
                        type="rich"
                        label="Description"
                        value={category.description ?? ""}
                        onChange={(value) =>
                          updateTechniqueCategory(categoryIndex, {
                            ...category,
                            description: value,
                          })
                        }
                      />
                      <EditorField
                        type="rich"
                        label="Content Text"
                        value={category.contentText ?? ""}
                        onChange={(value) =>
                          updateTechniqueCategory(categoryIndex, {
                            ...category,
                            contentText: value,
                          })
                        }
                      />
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#e7dfd5] bg-[#faf7f2] p-4">
                      <h6 className="mb-3 font-semibold text-darkBrown">
                        Main Image
                      </h6>
                      <div className="grid gap-4 md:grid-cols-2">
                        <EditorField
                          type="plain"
                          label="Image URL"
                          value={category.mainImage?.image ?? ""}
                          onChange={(value) =>
                            updateTechniqueCategory(categoryIndex, {
                              ...category,
                              mainImage: {
                                ...category.mainImage,
                                image: value,
                              },
                            })
                          }
                        />
                        <EditorField
                          type="plain"
                          label="Alt text"
                          value={category.mainImage?.alt ?? ""}
                          onChange={(value) =>
                            updateTechniqueCategory(categoryIndex, {
                              ...category,
                              mainImage: {
                                ...category.mainImage,
                                alt: value,
                              },
                            })
                          }
                        />
                      </div>
                      <EditorField
                        type="rich"
                        label="Main image description"
                        value={category.mainImage?.description ?? ""}
                        onChange={(value) =>
                          updateTechniqueCategory(categoryIndex, {
                            ...category,
                            mainImage: {
                              ...category.mainImage,
                              description: value,
                            },
                          })
                        }
                      />
                      <ImageUploadDropzone
                        label="Upload main image"
                        onUpload={async (file) =>
                          await uploadTechniqueCategoryMainImage(
                            categoryIndex,
                            file,
                          )
                        }
                      />
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h6 className="font-semibold text-darkBrown">
                          Gallery items
                        </h6>
                        <button
                          type="button"
                          className="rounded-full border border-darkBrown bg-white px-4 py-2 text-sm font-semibold text-darkBrown hover:bg-[#f3ede6]"
                          onClick={() => addTechniqueImageItem(categoryIndex)}
                        >
                          Add item
                        </button>
                      </div>

                      {(category.images ?? []).map((imageItem, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="rounded-2xl border border-[#e7dfd5] bg-[#fff8f0] p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <span className="font-semibold text-darkBrown">
                              Item {imageIndex + 1}
                            </span>
                            <button
                              type="button"
                              className="text-sm font-semibold text-darkRed hover:opacity-80"
                              onClick={() =>
                                removeTechniqueImageItem(
                                  categoryIndex,
                                  imageIndex,
                                )
                              }
                            >
                              Remove item
                            </button>
                          </div>
                          <div className="grid gap-4">
                            <EditorField
                              type="plain"
                              label="Image URL"
                              value={imageItem.image ?? ""}
                              onChange={(value) =>
                                updateTechniqueImageItem(
                                  categoryIndex,
                                  imageIndex,
                                  "image",
                                  value,
                                )
                              }
                            />
                            <EditorField
                              type="plain"
                              label="Alt text"
                              value={imageItem.alt ?? ""}
                              onChange={(value) =>
                                updateTechniqueImageItem(
                                  categoryIndex,
                                  imageIndex,
                                  "alt",
                                  value,
                                )
                              }
                            />
                            <EditorField
                              type="plain"
                              label="Name"
                              value={imageItem.name ?? ""}
                              onChange={(value) =>
                                updateTechniqueImageItem(
                                  categoryIndex,
                                  imageIndex,
                                  "name",
                                  value,
                                )
                              }
                            />
                            <EditorField
                              type="rich"
                              label="Text"
                              value={imageItem.text ?? ""}
                              onChange={(value) =>
                                updateTechniqueImageItem(
                                  categoryIndex,
                                  imageIndex,
                                  "text",
                                  value,
                                )
                              }
                            />
                          </div>
                          <ImageUploadDropzone
                            label="Upload item image"
                            onUpload={async (file) =>
                              await uploadTechniqueCategoryImage(
                                categoryIndex,
                                imageIndex,
                                file,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          <ContentSectionEditor
            title="Details"
            fields={tattoosEditorSchema.details}
            value={{
              decorImage: content.details?.decorImage ?? "",
              h2: content.details?.h2 ?? "",
              cta: content.details?.cta ?? "",
              h3: content.details?.h3 ?? "",
              description: content.details?.description ?? "",
              contentText: content.details?.contentText ?? "",
            }}
            onChange={(nextValue) =>
              setContent((current) => ({
                ...current,
                details: {
                  ...current.details,
                  decorImage: nextValue.decorImage,
                  h2: nextValue.h2,
                  cta: nextValue.cta,
                  h3: nextValue.h3,
                  description: nextValue.description,
                  contentText: nextValue.contentText,
                },
              }))
            }
          />
        </div>
      ) : (
        <div className="space-y-12 w-9/12 mx-auto flex flex-col">
          {isSectionFilled(content.introduction) && (
            <section className="flex flex-col laptop:flex-row laptop:justify-between">
              <div className="flex flex-col gap-4">
                {content.introduction?.h2 && (
                  <h2 className="text-3xl font-juwelia">
                    {content.introduction.h2}
                  </h2>
                )}
                {content.introduction?.h3 && (
                  <h3 className="mt-2 text-4xl text-darkRed font-tropical max-w-[800px]">
                    {content.introduction.h3}
                  </h3>
                )}
                {content.introduction?.description && (
                  <RichTextContent
                    html={content.introduction.description}
                    className="mt-4 text-brown max-w-[800px]"
                  />
                )}
              </div>
              <div className="flex flex-col gap-4 items-center">
                {content.introduction?.introImage && (
                  <img
                    src={content.introduction.introImage}
                    alt={content.introduction.h2 || "Tattoo introduction image"}
                    className="mt-6 w-full tablet:max-w-[400px] object-cover "
                  />
                )}
                {content.introduction?.introImageDescription && (
                  <RichTextContent
                    html={content.introduction.introImageDescription}
                    className="mt-3 text-brown max-w-[800px] font-tropical"
                  />
                )}
              </div>
            </section>
          )}

          {isSectionFilled(content.techniques) && (
            <section className="space-y-6">
              {content.techniques?.h2 && (
                <h2 className="text-3xl font-juwelia">
                  {content.techniques.h2}
                </h2>
              )}
              {content.techniques?.h3 && (
                <h3 className="text-darkRed font-tropical text-4xl">
                  {content.techniques.h3}
                </h3>
              )}
              {content.techniques?.description && (
                <RichTextContent
                  html={content.techniques.description}
                  className="text-brown"
                />
              )}
              {content.techniques?.categories?.map((category, index) => (
                <article
                  key={index}
                  className="rounded-3xl border border-[#e7dfd5] bg-[#fff8f0] p-6 shadow-sm"
                >
                  {category.title && (
                    <h3 className="text-2xl font-semibold">{category.title}</h3>
                  )}
                  {category.mainImage?.image && (
                    <div className="mt-4">
                      <img
                        src={category.mainImage.image}
                        alt={
                          category.mainImage.alt ||
                          category.title ||
                          "Technique image"
                        }
                        className="w-full rounded-3xl object-cover"
                      />
                      {category.mainImage.description && (
                        <RichTextContent
                          html={category.mainImage.description}
                          className="mt-3 text-brown"
                        />
                      )}
                    </div>
                  )}
                  {category.description && (
                    <RichTextContent
                      html={category.description}
                      className="mt-4 text-brown"
                    />
                  )}
                  {category.contentText && (
                    <RichTextContent
                      html={category.contentText}
                      className="mt-4 text-brown"
                    />
                  )}
                  {category.images?.length ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {category.images.map((imageItem, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="rounded-3xl border border-[#e7dfd5] overflow-hidden"
                        >
                          <img
                            src={imageItem.image || ""}
                            alt={
                              imageItem.alt ||
                              `Technique photo ${imageIndex + 1}`
                            }
                            className="h-56 w-full object-cover"
                          />
                          {imageItem.text && (
                            <div className="p-4 text-brown">
                              <RichTextContent html={imageItem.text} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </section>
          )}

          {isSectionFilled(content.details) && (
            <section className="rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-8 shadow-sm">
              {content.details?.decorImage && (
                <img
                  src={content.details.decorImage}
                  alt={content.details.h2 || "Décor image"}
                  className="w-full rounded-3xl object-cover"
                />
              )}
              {content.details?.h2 && (
                <h2 className="mt-6 text-3xl font-semibold">
                  {content.details.h2}
                </h2>
              )}
              {content.details?.cta && (
                <p className="mt-3 text-lg text-darkRed">
                  {content.details.cta}
                </p>
              )}
              {content.details?.h3 && (
                <h3 className="mt-4 text-xl">{content.details.h3}</h3>
              )}
              {content.details?.description && (
                <RichTextContent
                  html={content.details.description}
                  className="mt-4 text-brown"
                />
              )}
              {content.details?.contentText && (
                <RichTextContent
                  html={content.details.contentText}
                  className="mt-4 text-brown"
                />
              )}
            </section>
          )}
        </div>
      )}

      {(content.contactForm?.title || isAuthenticated) && (
        <ContactFormSection
          data={content.contactForm}
          isEditing={isAuthenticated && isEditMode}
          onChange={(contactForm) =>
            setContent((current) => ({ ...current, contactForm }))
          }
        />
      )}

      {(content.testimonials?.items?.length || isAuthenticated) && (
        <TestimonialsSection
          data={{
            ...(content.testimonials ??
              defaultTattoosContent.testimonials ?? {
                title: "",
                items: [],
              }),
          }}
          isEditing={isAuthenticated && isEditMode}
          onChange={(testimonials) =>
            setContent((current) => ({
              ...current,
              testimonials,
            }))
          }
          onAddItem={() =>
            setContent((current) => ({
              ...current,
              testimonials: {
                ...(current.testimonials ??
                  defaultTattoosContent.testimonials ?? {
                    title: "",
                    items: [],
                  }),

                items: [
                  ...(current.testimonials?.items ?? []),
                  {
                    name: "",
                    quote: "",
                    typeOfClient: "",
                  },
                ],
              },
            }))
          }
          onRemoveItem={(index) =>
            setContent((current) => ({
              ...current,
              testimonials: {
                ...(current.testimonials ??
                  defaultTattoosContent.testimonials ?? {
                    title: "",
                    items: [],
                  }),

                items: (current.testimonials?.items ?? []).filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              },
            }))
          }
        />
      )}
      {(content.faq?.items?.length || isAuthenticated) && (
        <FAQSection
          data={{
            ...(content.faq ??
              defaultTattoosContent.faq ?? {
                title: "",
                items: [],
                images: [],
                pageImageMap: {},
              }),

            images: content.faq?.images ?? [],
            pageImageMap: content.faq?.pageImageMap ?? {},
          }}
          isEditing={isAuthenticated && isEditMode}
          onChange={(nextData) =>
            setContent((current) => ({
              ...current,
              faq: {
                ...nextData,
                images: nextData.images ?? [],
                pageImageMap: nextData.pageImageMap ?? {},
              },
            }))
          }
          onAddItem={() =>
            setContent((current) => ({
              ...current,
              faq: {
                ...(current.faq ??
                  defaultTattoosContent.faq ?? {
                    title: "",
                    items: [],
                    images: [],
                    pageImageMap: {},
                  }),

                items: [
                  ...(current.faq?.items ?? []),
                  {
                    question: "",
                    answer: "",
                  },
                ],

                images: current.faq?.images ?? [],
                pageImageMap: current.faq?.pageImageMap ?? {},
              },
            }))
          }
          currentPage="tattoo"
          onAddImageUpload={uploadFaqImage}
          onRemoveItem={(index) =>
            setContent((current) => ({
              ...current,
              faq: {
                ...(current.faq ??
                  defaultTattoosContent.faq ?? {
                    title: "",
                    items: [],
                    images: [],
                    pageImageMap: {},
                  }),

                items: (current.faq?.items ?? []).filter((_, i) => i !== index),

                images: current.faq?.images ?? [],
                pageImageMap: current.faq?.pageImageMap ?? {},
              },
            }))
          }
        />
      )}
    </section>
  );
};
