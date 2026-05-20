import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LiaCopyright } from "react-icons/lia";
import { TermsModal } from "./TermsModal";

import { ContentSectionEditor } from "./editor";

import { contactEditorSchema } from "../editorSchemas/contactEditorSchema";

import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";

import { contentAPI, type ContactPageContent } from "../api/contentAPI";

export const Footer: React.FC = () => {
  const location = useLocation();

  const isContactPage = location.pathname === "/contact";

  const { isEditMode, registerSaveAction } = useAdminStore();

  const { isAuthenticated, token } = useAuthStore();

  const [showTerms, setShowTerms] = useState(false);

  const [contactInfo, setContactInfo] = useState<ContactPageContent | null>(
    null,
  );

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await contentAPI.getContactPageContent();

        setContactInfo(data);
        console.log(data)
      } catch (error) {
        console.error("Failed loading contact information:", error);
      }
    };

    loadContactInfo();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isEditMode || isContactPage || !contactInfo) {
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

  const instagramName = contactInfo?.instagramName?.trim();

  const instagramLink =
    contactInfo?.instagramLink?.trim() ||
    (instagramName
      ? `https://www.instagram.com/${instagramName.replace(/^@/, "")}`
      : "");

  const email = contactInfo?.email?.trim();

  const address = contactInfo?.address?.trim();

  const googleMapsLink = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address,
      )}`
    : undefined;

    console.log( contactInfo)

  return (
    <footer className="bg-darkBrown text-warmWhite pt-[200px] pb-[180px] tablet:pb-[300px] relative">
      <svg
        viewBox="0 0 504 109.41"
        className="w-[105%] laptop:w-[100%] absolute top-[-2px] left-1/2 laptop:left-0 -translate-x-1/2 laptop:translate-x-0 h-auto"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0h504v95.15c-56.38,15.18-124.74,20.64-180.95,4.33-20.31-5.89-39.28-14.27-56.12-27.08-17.04-12.95-34.33-24.05-53.78-33.14-19.84-9.27-39.81-16.4-61.06-22.14C117.47,7.97,82.65,2.88,46.89,1.11L0,.7v-.7Z"
          fill="#e4ddd3"
        />
      </svg>

      {!isContactPage && (
        <div className="w-2/3 mx-auto flex flex-col gap-16 laptop:gap-48">
          {/* CONTACT INFO */}
          {(instagramName || email || address || isEditMode) && (
            <div className="flex flex-col gap-4 text-lg">
              {isEditMode && isAuthenticated ? (
                <div className="w-full rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-6">
                  <h2 className="mb-4 text-xl font-semibold text-darkBrown">
                    Modifier les informations de contact du footer
                  </h2>

                  <ContentSectionEditor
                    title="Footer contact details"
                    fields={contactEditorSchema.contactDetails}
                    value={{
                      email: contactInfo?.email ?? "",
                      instagramName: contactInfo?.instagramName ?? "",
                      instagramLink: contactInfo?.instagramLink ?? "",
                      phone: contactInfo?.phone ?? "",
                      address: contactInfo?.address ?? "",
                    }}
                    onChange={(nextValue) =>
                      setContactInfo((current) => ({
                        ...(current ?? {}),
                        ...nextValue,
                      }))
                    }
                  />
                </div>
              ) : (
                <>
                  {instagramName && instagramLink && (
                    <a
                      href={instagramLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:text-darkRed transition"
                    >
                      <img
                        src="/insta.png"
                        alt="Instagram"
                        className="w-[20px] h-[20px] laptop:w-[26px] laptop:h-[26px]"
                      />

                      {instagramName}
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 hover:text-darkRed transition"
                    >
                      <img
                        src="/mail.png"
                        alt="Email"
                        className="w-[20px] h-[17px] laptop:w-[26px] laptop:h-[22px]"
                      />

                      {email}
                    </a>
                  )}

                  {address && (
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-base hover:text-brown transition"
                    >
                      <img
                        src="/position.png"
                        alt="Location"
                        className="w-[20px] h-[27px] laptop:w-[26px] laptop:h-[34px]"
                      />

                      {address}
                    </a>
                  )}
                </>
              )}
            </div>
          )}

          {/* LINKS */}
          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-10">
            {/* QUICK LINKS */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold uppercase tracking-wide">
                Accès rapide
              </h3>

              <div className="flex flex-col gap-3 text-base">
                <NavLink to="/faq" className="transition hover:text-darkRed">
                  FAQ
                </NavLink>

                <NavLink
                  to="/a-propos"
                  className="transition hover:text-darkRed"
                >
                  À propos
                </NavLink>
              </div>
            </div>

            {/* RESERVATION */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold uppercase tracking-wide">
                Réservation
              </h3>

              <div className="flex flex-col gap-3 text-base">
                <NavLink
                  to="/prendre-rendez-vous"
                  className="transition"
                >
                  Formulaire de contact
                </NavLink>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-left"
                  >
                    Consentement & politique de confidentialité
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COPYRIGHT */}
      <div className="absolute bottom-6 right-4 flex gap-8 justify-center tablet:justify-end px-4 text-beige mt-8">
        <p className="font-body flex gap-1 items-center">
          <LiaCopyright className="w-3" />

          <span className="text-[12px] leading-none tracking-tight select-none">
            Studio Juwelia 2026
          </span>
        </p>

        <a
          href="http://izabellind.com"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex gap-2 items-center text-[12px] after:content-[''] after:block after:w-0 after:h-[1px] after:bg-stone-600 after:absolute after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
        >
          Design & développement 2026 | itFlows
        </a>
      </div>

      {/* TERMS MODAL */}
      {showTerms && (
        <TermsModal
          isOpen={showTerms}
          content={contactInfo?.contactForm?.termsAndConditions || ""}
          onClose={() => setShowTerms(false)}
        />
      )}
    </footer>
  );
};
