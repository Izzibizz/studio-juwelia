import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContactFormSection } from "../components/home/ContactFormSection";
import { FAQSection } from "../components/home/FAQSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { ContentSectionEditor } from "../components/editor";
import { RichTextContent } from "../components/RichTextContent";
import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";
import { tattoosEditorSchema } from "../editorSchemas/tattoosEditorSchema";
import {
  contentAPI,
  defaultTattoosContent,
  type TattoosPageContent,
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
      await contentAPI.savePageContent("tattoos", content, token ?? undefined);
    });

    return () => registerSaveAction(null);
  }, [content, isAuthenticated, isEditMode, registerSaveAction, token]);

  const hasContent =
    isSectionFilled(content.hero) ||
    isSectionFilled(content.introduction) ||
    isSectionFilled(content.techniques) ||
    isSectionFilled(content.details);

  const techniquesCategoriesJson = JSON.stringify(
    content.techniques?.categories || [],
    null,
    2,
  );

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14 text-darkBrown">
      {isAuthenticated && isEditMode ? (
        <div className="grid gap-10">
          <ContentSectionEditor
            title="SEO"
            fields={tattoosEditorSchema.seo}
            value={{
              title: content.seo?.title ?? "",
              description: content.seo?.description ?? "",
            }}
            onChange={(nextValue) =>
              setContent((current) => ({
                ...current,
                seo: {
                  ...current.seo,
                  title: nextValue.title,
                  description: nextValue.description,
                },
              }))
            }
          />

          <ContentSectionEditor
            title="Hero section"
            fields={tattoosEditorSchema.hero}
            value={{
              title: content.hero?.title ?? "",
              subtitle: content.hero?.subtitle ?? "",
              description: content.hero?.description ?? "",
              primaryCtaText: content.hero?.primaryCtaText ?? "",
              primaryCtaLink: content.hero?.primaryCtaLink ?? "",
              imageLeft: content.hero?.imageLeft ?? "",
              imageRight: content.hero?.imageRight ?? "",
              poem: content.hero?.poem ?? "",
            }}
            onChange={(nextValue) =>
              setContent((current) => ({
                ...current,
                hero: {
                  ...current.hero,
                  title: nextValue.title,
                  subtitle: nextValue.subtitle,
                  description: nextValue.description,
                  primaryCtaText: nextValue.primaryCtaText,
                  primaryCtaLink: nextValue.primaryCtaLink,
                  imageLeft: nextValue.imageLeft,
                  imageRight: nextValue.imageRight,
                  poem: nextValue.poem,
                },
              }))
            }
          />

          <ContentSectionEditor
            title="Introduction"
            fields={tattoosEditorSchema.introduction}
            value={{
              h2: content.introduction?.h2 ?? "",
              h3: content.introduction?.h3 ?? "",
              description: content.introduction?.description ?? "",
              introImage: content.introduction?.introImage ?? "",
            }}
            onChange={(nextValue) =>
              setContent((current) => ({
                ...current,
                introduction: {
                  ...current.introduction,
                  h2: nextValue.h2,
                  h3: nextValue.h3,
                  description: nextValue.description,
                  introImage: nextValue.introImage,
                },
              }))
            }
          />

          <ContentSectionEditor
            title="Techniques"
            fields={tattoosEditorSchema.techniques}
            value={{
              h2: content.techniques?.h2 ?? "",
              h3: content.techniques?.h3 ?? "",
              description: content.techniques?.description ?? "",
              categories: techniquesCategoriesJson,
            }}
            onChange={(nextValue) =>
              setContent((current) => ({
                ...current,
                techniques: {
                  ...current.techniques,
                  h2: nextValue.h2,
                  h3: nextValue.h3,
                  description: nextValue.description,
                  categories: (() => {
                    if (!nextValue.categories?.trim())
                      return current.techniques?.categories ?? [];
                    try {
                      const parsed = JSON.parse(nextValue.categories);
                      return Array.isArray(parsed)
                        ? parsed
                        : (current.techniques?.categories ?? []);
                    } catch {
                      return current.techniques?.categories ?? [];
                    }
                  })(),
                },
              }))
            }
          />

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
        <div className="space-y-12">
          {content.hero?.title && (
            <section className="space-y-4">
              <h1 className="text-4xl font-semibold">{content.hero.title}</h1>
              {content.hero.subtitle && (
                <RichTextContent
                  html={content.hero.subtitle}
                  className="text-lg text-darkBrown"
                />
              )}
              {content.hero.description && (
                <RichTextContent
                  html={content.hero.description}
                  className="text-base text-brown"
                />
              )}
            </section>
          )}

          {isSectionFilled(content.introduction) && (
            <section className="rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-8 shadow-sm">
              {content.introduction?.h2 && (
                <h2 className="text-3xl font-semibold">
                  {content.introduction.h2}
                </h2>
              )}
              {content.introduction?.h3 && (
                <h3 className="mt-2 text-xl text-darkRed">
                  {content.introduction.h3}
                </h3>
              )}
              {content.introduction?.description && (
                <RichTextContent
                  html={content.introduction.description}
                  className="mt-4 text-brown"
                />
              )}
              {content.introduction?.introImage && (
                <img
                  src={content.introduction.introImage}
                  alt={content.introduction.h2 || "Tattoo introduction image"}
                  className="mt-6 w-full rounded-3xl object-cover"
                />
              )}
            </section>
          )}

          {isSectionFilled(content.techniques) && (
            <section className="space-y-6">
              {content.techniques?.h2 && (
                <h2 className="text-3xl font-semibold">
                  {content.techniques.h2}
                </h2>
              )}
              {content.techniques?.h3 && (
                <h3 className="text-xl text-darkRed">
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

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-8 shadow-sm">
              <h2 className="text-2xl font-semibold">Prendre rendez-vous</h2>
              <p className="mt-3 text-brown">
                Découvrez nos tatouages et réservez votre séance en ligne.
              </p>
              <Link
                to="/prendre-rendez-vous"
                className="mt-6 inline-flex rounded-full bg-darkBrown px-6 py-3 text-sm font-semibold text-white hover:bg-brown"
              >
                Réserver maintenant
              </Link>
            </div>

            {(content.contactForm || isAuthenticated) && (
              <ContactFormSection
                data={content.contactForm ?? defaultTattoosContent.contactForm!}
                isEditing={isAuthenticated && isEditMode}
                onChange={(nextData) =>
                  setContent((current) => ({
                    ...current,
                    contactForm: nextData,
                  }))
                }
              />
            )}
          </div>

          {(content.testimonials?.items.length || isAuthenticated) && (
            <TestimonialsSection
              data={content.testimonials ?? defaultTattoosContent.testimonials!}
              isEditing={isAuthenticated && isEditMode}
              onChange={(nextData) =>
                setContent((current) => ({
                  ...current,
                  testimonials: nextData,
                }))
              }
              onAddItem={() =>
                setContent((current) => ({
                  ...current,
                  testimonials: {
                    ...current.testimonials,
                    items: [
                      ...(current.testimonials?.items ?? []),
                      { name: "", quote: "", role: "" },
                    ],
                  },
                }))
              }
              onRemoveItem={(index) =>
                setContent((current) => ({
                  ...current,
                  testimonials: {
                    ...current.testimonials,
                    items: (current.testimonials?.items ?? []).filter(
                      (_, i) => i !== index,
                    ),
                  },
                }))
              }
            />
          )}

          {(content.faq?.items.length || isAuthenticated) && (
            <FAQSection
              data={content.faq ?? defaultTattoosContent.faq!}
              isEditing={isAuthenticated && isEditMode}
              onChange={(nextData) =>
                setContent((current) => ({
                  ...current,
                  faq: nextData,
                }))
              }
              onAddItem={() =>
                setContent((current) => ({
                  ...current,
                  faq: {
                    ...current.faq,
                    items: [
                      ...(current.faq?.items ?? []),
                      { question: "", answer: "" },
                    ],
                  },
                }))
              }
              onRemoveItem={(index) =>
                setContent((current) => ({
                  ...current,
                  faq: {
                    ...current.faq,
                    items: (current.faq?.items ?? []).filter((_, i) => i !== index),
                  },
                }))
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
