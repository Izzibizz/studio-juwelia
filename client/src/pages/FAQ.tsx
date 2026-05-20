import { useEffect, useRef, useState } from "react";

import { FAQSection } from "../components/home/FAQSection";

import {
  contentAPI,
  defaultHomeContent,
  type HomePageContent,
} from "../api/contentAPI";

import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";

export const FAQ: React.FC = () => {
  const [content, setContent] = useState<HomePageContent>(defaultHomeContent);

  const [isLoading, setIsLoading] = useState(true);

  const faqRef = useRef<HTMLElement>(null);

  const { isEditMode, registerSaveAction } = useAdminStore();

  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentAPI.getHomePageContent();

        setContent(data);
      } catch (error) {
        console.error("Failed loading FAQ content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const saveFAQContent = async (nextContent: HomePageContent) => {
    try {
      await contentAPI.savePageContent(
        "homepage",
        nextContent,
        token ?? undefined,
      );
    } catch (error) {
      console.error("Failed saving FAQ content:", error);

      throw error;
    }
  };

  const uploadFaqImage = async (file: File, alt?: string) => {
    const uploadedImages = await contentAPI.uploadImages(
      [file],
      token ?? undefined,
      {
        alt: alt || "FAQ image",
        caption: alt || "FAQ image",
      },
    );

    const uploaded = uploadedImages[0];

    if (!uploaded?.url) {
      throw new Error("Failed uploading FAQ image");
    }

    const nextContent = {
      ...content,

      faq: {
        ...content.faq,

        images: [
          ...(content.faq.images || []),

          {
            id: uploaded.id,
            image: uploaded.url,
            alt: uploaded.alt || "",
            name: uploaded.caption || "",
          },
        ],
      },
    };

    setContent(nextContent);

    await saveFAQContent(nextContent);
  };

  useEffect(() => {
    if (!isAuthenticated || !isEditMode) {
      registerSaveAction(null);

      return;
    }

    registerSaveAction(async () => {
      await saveFAQContent(content);
    });

    return () => {
      registerSaveAction(null);
    };
  }, [content, isAuthenticated, isEditMode, registerSaveAction, token]);

  if (isLoading) {
    return (
      <section className="py-20 bg-beige">
        <div className="w-11/12 mx-auto">
          <p className="text-brown">Chargement du contenu...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-beige relative animate-fadeIn">
      <FAQSection
        data={content.faq}
        isEditing={isAuthenticated && isEditMode}
        currentPage="homepage"
        faqRef={faqRef}
        onChange={(faq) =>
          setContent((current) => ({
            ...current,

            faq,
          }))
        }
        onAddItem={() =>
          setContent((current) => ({
            ...current,

            faq: {
              ...current.faq,

              items: [
                ...current.faq.items,

                {
                  question: "",
                  answer: "",
                },
              ],
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
        onAddImageUpload={uploadFaqImage}
      />
    </section>
  );
};
