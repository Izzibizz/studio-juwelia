import { useEffect, useState, useRef } from "react";
import { AboutIntro } from "../components/home/AboutIntro";
import { ArtIntro } from "../components/home/ArtIntro";
import { ContactFormSection } from "../components/home/ContactFormSection";
import { FAQSection } from "../components/home/FAQSection";
import { Hero } from "../components/home/Hero";
import { TattooIntro } from "../components/home/TattooIntro";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { contentAPI, defaultHomeContent } from "../api/contentAPI";
import type { HomePageContent } from "../api/contentAPI";
import type { HomeGallerySectionKey } from "../api/contentAPI";
import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";

export const HomePage: React.FC = () => {
  const [content, setContent] = useState<HomePageContent>(defaultHomeContent);
  const [isLoading, setIsLoading] = useState(true);
  const [, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [, setSaveMessage] = useState<string | null>(null);
  const { isEditMode, registerSaveAction } = useAdminStore();
  const { isAuthenticated, token } = useAuthStore();
  const faqRef = useRef<HTMLElement>(null);

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

  const saveHomePageContent = async (nextContent: HomePageContent) => {
    setSaveState("saving");
    setSaveMessage("Sauvegarde en cours...");

    try {
      await contentAPI.savePageContent(
        "homepage",
        nextContent,
        token ?? undefined,
      );
      setSaveState("saved");
      setSaveMessage("Modifications enregistrees.");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(
        error instanceof Error ? error.message : "La sauvegarde a echoue.",
      );
      throw error;
    }
  };

  const uploadHeroImage = async (
    field: "imageLeft" | "imageRight",
    file: File,
  ) => {
    const imageUrl = await uploadSingleImage(file, field);
    const nextContent = {
      ...content,
      hero: {
        ...content.hero,
        [field]: imageUrl,
      },
    };
    setContent(nextContent);
    await saveHomePageContent(nextContent);
  };

  const uploadGalleryImage = async (
    section: "artIntro" | "tattooIntro",
    index: number,
    file: File,
  ) => {
    const imageUrl = await uploadSingleImage(file, `${section}-${index + 1}`);
    const nextContent = {
      ...content,
      [section]: {
        ...content[section],
        imageGallery: content[section].imageGallery.map((item, itemIndex) =>
          itemIndex === index ? { ...item, image: imageUrl } : item,
        ),
      },
    };
    setContent(nextContent);
    await saveHomePageContent(nextContent);
  };

  const addGalleryImage = async (
    section: HomeGallerySectionKey,
    file: File,
  ) => {
    const response = await contentAPI.addHomepageGalleryImage(
      section,
      file,
      token ?? undefined,
    );

    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...response.data?.[section],
      },
    }));
  };

  const removeGalleryImage = async (
    section: HomeGallerySectionKey,
    index: number,
  ) => {
    const response = await contentAPI.removeHomepageGalleryImage(
      section,
      index,
      token ?? undefined,
    );

    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...((response.data as Record<string, unknown>)?.[section] ?? {}),
      },
    }));
  };

  const uploadAboutImage = async (
    index: number,
    field: string,
    file: File,
    type: "values" | "profile",
  ) => {
    const imageUrl = await uploadSingleImage(file, `${field}-${index + 1}`);

    const nextContent = {
      ...content,
      aboutIntro: {
        ...content.aboutIntro,
        [type]: {
          ...content.aboutIntro[type],
          [field]: imageUrl,
        },
      },
    };

    setContent(nextContent);
    await saveHomePageContent(nextContent);
  };

  useEffect(() => {
    const run = async () => {
      try {
        const data = await contentAPI.getHomePageContent();
        setContent(data);
      } catch (error) {
        console.error("Failed loading homepage content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    registerSaveAction(async () => {
      await saveHomePageContent(content);
    });

    return () => {
      registerSaveAction(null);
    };
  }, [content, registerSaveAction]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-brown">Chargement du contenu...</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col py-8 md:py-10 animate-fadeIn">
      <Hero
        data={content.hero}
        isEditing={isAuthenticated && isEditMode}
        onChange={(hero) => setContent((current) => ({ ...current, hero }))}
        onUploadImage={uploadHeroImage}
      />

      <ArtIntro
        data={content.artIntro}
        isEditing={isAuthenticated && isEditMode}
        onChange={(artIntro) =>
          setContent((current) => ({ ...current, artIntro }))
        }
        onAddImageUpload={(file) => addGalleryImage("artIntro", file)}
        onRemoveImage={(index) => removeGalleryImage("artIntro", index)}
        onUploadImage={(index, file) =>
          uploadGalleryImage("artIntro", index, file)
        }
      />
      <TattooIntro
        data={content.tattooIntro}
        isEditing={isAuthenticated && isEditMode}
        onChange={(tattooIntro) =>
          setContent((current) => ({ ...current, tattooIntro }))
        }
        onAddImageUpload={(file) => addGalleryImage("tattooIntro", file)}
        onRemoveImage={(index) => removeGalleryImage("tattooIntro", index)}
        onUploadImage={(index, file) =>
          uploadGalleryImage("tattooIntro", index, file)
        }
      />
      <AboutIntro
        data={content.aboutIntro}
        isEditing={isAuthenticated && isEditMode}
        onChange={(aboutIntro) =>
          setContent((current) => ({ ...current, aboutIntro }))
        }
        onUploadImage={uploadAboutImage}
        faqRef={faqRef}
      />
            <ContactFormSection
        data={content.contactForm}
        isEditing={isAuthenticated && isEditMode}
        onChange={(contactForm) =>
          setContent((current) => ({ ...current, contactForm }))
        }
      />
      <TestimonialsSection
        data={content.testimonials}
        isEditing={isAuthenticated && isEditMode}
        onChange={(testimonials) =>
          setContent((current) => ({ ...current, testimonials }))
        }
        onAddItem={() =>
          setContent((current) => ({
            ...current,
            testimonials: {
              ...current.testimonials,
              items: [
                ...current.testimonials.items,
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
              items: current.testimonials.items.filter(
                (_, itemIndex) => itemIndex !== index,
              ),
            },
          }))
        }
      />

      <FAQSection
        data={content.faq}
        isEditing={isAuthenticated && isEditMode}
        onChange={(faq) => setContent((current) => ({ ...current, faq }))}
        onAddItem={() =>
          setContent((current) => ({
            ...current,
            faq: {
              ...current.faq,
              items: [...current.faq.items, { question: "", answer: "" }],
            },
          }))
        }
        onRemoveItem={(index) =>
          setContent((current) => ({
            ...current,
            faq: {
              ...current.faq,
              items: current.faq.items.filter(
                (_, itemIndex) => itemIndex !== index,
              ),
            },
          }))
        }
        faqRef={faqRef}
      />
    </section>
  );
};
