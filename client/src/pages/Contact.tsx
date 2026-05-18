import { useEffect, useState } from "react";
import { IoLogoInstagram } from "react-icons/io";
import { MdOutlineMailOutline, MdOutlineLocationOn } from "react-icons/md";

import { ContactFormSection } from "../components/home/ContactFormSection";
import { ContentSectionEditor } from "../components/editor";

import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";

import { contactEditorSchema } from "../editorSchemas/contactEditorSchema";

import { contentAPI, type ContactPageContent } from "../api/contentAPI";

const defaultContactData: ContactPageContent = {
  intro: {
    title: "Contact",
    description:
      "<p>Contact us to book your next tattoo or ask any questions.</p>",
    ctaText: "",
    imageGallery: [],
  },

  contactForm: {
    title: "Book an appointment",
    subtitle: "Tell us about your tattoo idea and we’ll get back to you.",
    buttonText: "Envoyer",
    successMessage: "Merci, votre message a été envoyé.",
    termsAndConditions: "",
  },

  email: "contact@studiojuwelia.com",
  instagramName: "@studiojuwelia",
  instagramLink: "https://www.instagram.com/studiojuwelia",
  address: "Paris, France",
  phone: "",
};

export const Contact: React.FC = () => {
  const [contactData, setContactData] =
    useState<ContactPageContent>(defaultContactData);

  const [isLoading, setIsLoading] = useState(true);

  const { isEditMode, registerSaveAction } = useAdminStore();

  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await contentAPI.getContactPageContent();

        setContactData({
          ...defaultContactData,
          ...data,
        });
      } catch (error) {
        console.error("Failed loading contact page content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isEditMode) {
      registerSaveAction(null);
      return;
    }

    registerSaveAction(async () => {
      await contentAPI.savePageContent(
        "contact",
        contactData,
        token ?? undefined,
      );
    });

    return () => registerSaveAction(null);
  }, [
    contactData,
    isAuthenticated,
    isEditMode,
    registerSaveAction,
    token,
  ]);

  const mapSource = contactData.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        contactData.address,
      )}&output=embed`
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-darkBrown space-y-10">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold">
          {contactData.intro?.title || "Contact"}
        </h1>

        <div
          className="prose max-w-none text-lg leading-8"
          dangerouslySetInnerHTML={{
            __html:
              contactData.intro?.description ||
              "<p>Contact us to book your next tattoo or ask any questions.</p>",
          }}
        />
      </div>

      {isAuthenticated && isEditMode && (
        <div className="grid gap-10 lg:grid-cols-2">
          <ContentSectionEditor
            title="Contact intro"
            fields={contactEditorSchema.intro}
            value={{
              title: contactData.intro?.title ?? "",
              description: contactData.intro?.description ?? "",
              ctaText: contactData.intro?.ctaText ?? "",
              imageGallery: JSON.stringify(
                contactData.intro?.imageGallery ?? [],
                null,
                2,
              ),
            }}
            onChange={(nextValue) =>
              setContactData((current) => ({
                ...current,

                intro: {
                  ...current.intro,

                  title: nextValue.title,

                  description: nextValue.description,

                  ctaText: nextValue.ctaText,

                  imageGallery:
                    nextValue.imageGallery.length > 0
                      ? (() => {
                          try {
                            return JSON.parse(nextValue.imageGallery);
                          } catch {
                            return current.intro?.imageGallery ?? [];
                          }
                        })()
                      : current.intro?.imageGallery ?? [],
                },
              }))
            }
          />

          <ContentSectionEditor
            title="Contact details"
            fields={contactEditorSchema.contactDetails}
            value={{
              email: contactData.email ?? "",
              instagramName: contactData.instagramName ?? "",
              instagramLink: contactData.instagramLink ?? "",
              phone: contactData.phone ?? "",
              address: contactData.address ?? "",
            }}
            onChange={(nextValue) =>
              setContactData((current) => ({
                ...current,
                ...nextValue,
              }))
            }
          />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <a
              href={contactData.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-xl font-medium text-darkRed hover:text-brown"
            >
              <IoLogoInstagram />
              {contactData.instagramName}
            </a>

            <a
              href={`mailto:${contactData.email}`}
              className="flex items-center gap-3 text-xl font-medium text-darkRed hover:text-brown"
            >
              <MdOutlineMailOutline />
              {contactData.email}
            </a>

            {contactData.phone && (
              <div className="flex items-center gap-3 text-xl font-medium text-darkRed">
                <span className="font-semibold">Phone:</span>
                <span>{contactData.phone}</span>
              </div>
            )}

            <a
              href={
                contactData.address
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      contactData.address,
                    )}`
                  : "#"
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-xl font-medium text-darkRed hover:text-brown"
            >
              <MdOutlineLocationOn className="mt-1" />

              <span>{contactData.address}</span>
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7dfd5] bg-[#fff8f0] p-6 shadow-sm">
          {isLoading ? (
            <p className="text-center text-lg text-darkBrown">
              Loading map…
            </p>
          ) : contactData.address ? (
            <iframe
              title="Studio Juwelia location"
              src={mapSource}
              className="h-96 w-full rounded-3xl border border-gray-200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-96 items-center justify-center text-center text-lg text-darkBrown">
              Adresse introuvable. Ajoutez une adresse dans le backend pour
              afficher la carte.
            </div>
          )}
        </div>
      </div>

        {contactData.contactForm || isAuthenticated ? (
          <ContactFormSection
            data={
              contactData.contactForm ??
              defaultContactData.contactForm!
            }
            isEditing={isAuthenticated && isEditMode}
            onChange={(nextData) =>
              setContactData((current) => ({
                ...current,
                contactForm: nextData,
              }))
            }
          />
        ) : null}
      </div>
  );
};