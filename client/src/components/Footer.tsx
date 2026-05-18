import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoLogoInstagram } from "react-icons/io";
import { MdOutlineMailOutline, MdOutlineLocationOn } from "react-icons/md";
import { ContentSectionEditor } from "./editor";
import { contactEditorSchema } from "../editorSchemas/contactEditorSchema";
import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";
import { contentAPI, type ContactPageContent } from "../api/contentAPI";

const defaultFooterContent: ContactPageContent = {
  instagramName: "@studiojuwelia",
  instagramLink: "https://www.instagram.com/studiojuwelia",
  email: "contact@studiojuwelia.com",
  address: "Paris, France",
  phone: "",
};

export const Footer: React.FC = () => {
  const location = useLocation();
  const isContactPage = location.pathname === "/contact";
  const { isEditMode, registerSaveAction } = useAdminStore();
  const { isAuthenticated, token } = useAuthStore();
  const [contactInfo, setContactInfo] =
    useState<ContactPageContent>(defaultFooterContent);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await contentAPI.getContactPageContent();
        setContactInfo({ ...defaultFooterContent, ...data });
      } catch (error) {
        console.error("Failed loading contact information:", error);
      }
    };

    loadContactInfo();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isEditMode || isContactPage) {
      registerSaveAction(null);
      return;
    }

    const saveFooterContent = async () => {
      await contentAPI.savePageContent(
        "contact",
        contactInfo,
        token ?? undefined,
      );
    };

    registerSaveAction(saveFooterContent);
    return () => registerSaveAction(null);
  }, [
    contactInfo,
    isAuthenticated,
    isEditMode,
    isContactPage,
    registerSaveAction,
    token,
  ]);

  const instagramName = contactInfo.instagramName?.trim() || "@studiojuwelia";
  const instagramLink =
    contactInfo.instagramLink?.trim() ||
    (contactInfo.instagramName
      ? `https://www.instagram.com/${contactInfo.instagramName.replace(/^@/, "")}`
      : "https://www.instagram.com/studiojuwelia");
  const email = contactInfo.email?.trim() || "contact@studiojuwelia.com";
  const address = contactInfo.address?.trim() || "Paris, France";
  const googleMapsLink = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address,
      )}`
    : undefined;

  return (
    <footer className="bg-darkBrown text-warmWhite py-8">
      {!isContactPage ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-lg">
          {isEditMode && isAuthenticated ? (
            <div className="w-full rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-6">
              <h2 className="mb-4 text-xl font-semibold text-darkBrown">
                Modifier les informations de contact du footer
              </h2>
              <ContentSectionEditor
                title="Footer contact details"
                fields={contactEditorSchema.contactDetails}
                value={{
                  email: contactInfo.email,
                  instagramName: contactInfo.instagramName,
                  instagramLink: contactInfo.instagramLink,
                  phone: contactInfo.phone,
                  address: contactInfo.address,
                }}
                onChange={(nextValue) =>
                  setContactInfo((current) => ({
                    ...current,
                    ...nextValue,
                  }))
                }
              />
            </div>
          ) : (
            <>
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-darkRed"
              >
                <IoLogoInstagram />
                {instagramName}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-darkRed"
              >
                <MdOutlineMailOutline />
                {email}
              </a>
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-base text-warmWhite hover:text-brown"
              >
                <MdOutlineLocationOn />
                {address}
              </a>
            </>
          )}
        </div>
      ) : null}

      <p className="mt-8 text-center text-sm text-gray-700">
        &copy; 2026 Studio Juwelia
      </p>
    </footer>
  );
};
