import { useState } from "react";
import type { ContactFormSectionData } from "../../api/contentAPI";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { useNotificationStore } from "../../stores/notificationStore";

import { TermsModal } from "../TermsModal";

interface ContactFormSectionProps {
  data?: ContactFormSectionData;
  isEditing?: boolean;
  onChange?: (nextData: ContactFormSectionData) => void;
  onUploadImage?: (field: string, file: File) => Promise<void>;
}

export function ContactFormSection({
  data,
  isEditing = false,
  onChange,
  onUploadImage,
}: ContactFormSectionProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const updateField = (field: keyof ContactFormSectionData, value: string) => {
    onChange?.({ ...data, [field]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot
    if (formData.get("website")) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/xjgzvjbg", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l’envoi.");
      }

      form.reset();
      setAcceptedTerms(false);
      setProjectType("");

      addNotification(
        data?.successMessage || "Message envoyé avec succès",
        "success",
      );
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : "Une erreur est survenue",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("ContactFormSection data:", data); // Debug log to check the data structure
  return (
    <section className="p-6 py-20 laptop:pt-[200px] laptop:pb-[350px] bg-lightCream relative ">
      <div className="flex flex-col w-11/12 max-w-[1300px] mx-auto gap-6">
        {isEditing ? (
          <div className="mb-6 grid gap-4 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
            <EditorField
              type="plain"
              label="Title"
              value={data?.title || ""}
              onChange={(value) => updateField("title", value)}
            />
            <EditorField
              type="rich"
              label="Subtitle"
              value={data?.subtitle || ""}
              onChange={(value) => updateField("subtitle", value)}
            />
            <EditorField
              type="plain"
              label="Button text"
              value={data?.buttonText || ""}
              onChange={(value) => updateField("buttonText", value)}
            />
            <EditorField
              type="plain"
              label="Success message"
              value={data?.successMessage || ""}
              onChange={(value) => updateField("successMessage", value)}
            />
            <EditorField
              type="rich"
              label="Terms and conditions"
              value={data?.termsAndConditions || ""}
              onChange={(value) => updateField("termsAndConditions", value)}
            />
            <div className="space-y-3 flex flex-col">
              {data?.decorImage && (
                <img
                  src={data.decorImage}
                  alt="decor"
                  className="w-full max-w-[400px] rounded-xl object-cover self-center"
                />
              )}

              {onUploadImage && (
                <ImageUploadDropzone
                  label="Upload decor image"
                  onUpload={(file) => onUploadImage("decorImage", file)}
                />
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-tropical text-darkBrown">
                {data?.title || ""}
              </h2>
              <RichTextContent html={data?.subtitle || ""} className="text-lg" />
            </div>
            <div className="flex flex-col laptop:flex-row laptop:justify-between gap-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 laptop:w-1/2">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="prenom"
                    className="px-4 py-3 rounded-full border h-14"
                    placeholder="Prénom"
                    required
                  />

                  <input
                    name="nom"
                    className="px-4 py-3 rounded-full border h-14"
                    placeholder="Nom"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="email"
                    type="email"
                    className="px-4 py-3 rounded-full border h-14"
                    placeholder="Email"
                    required
                  />

                  <input
                    name="telephone"
                    type="tel"
                    className="px-4 py-3 rounded-full border h-14"
                    placeholder="Téléphone"
                    required
                  />
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />
                </div>

                <select
                  name="typeProjet"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="px-4 py-3 rounded-full border bg-warmWhite h-14"
                  required
                >
                  <option value="">Type de projet</option>
                  <option value="tatouage">Tatouage</option>
                  <option value="illustration">Illustration</option>
                  <option value="collaboration">Collaboration</option>
                </select>

                <div
                  className={`grid gap-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    projectType === "tatouage"
                      ? "max-h-[500px] opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <select
                    name="zoneCorps"
                    className="px-4 py-3 rounded-full border bg-warmWhite h-14"
                    required={projectType === "tatouage"}
                  >
                    <option value="">Zone du corps</option>
                    <option>Bras</option>
                    <option>Jambe</option>
                    <option>Dos</option>
                    <option>Poitrine</option>
                    <option>Main</option>
                    <option>Cou</option>
                    <option>Autre</option>
                  </select>

                  <select
                    name="taille"
                    className="px-4 py-3 rounded-full border bg-warmWhite h-14"
                    required={projectType === "tatouage"}
                  >
                    <option value="">Taille approximative</option>
                    <option>Petite (5-10 cm)</option>
                    <option>Moyenne (10-15 cm)</option>
                    <option>Grande (15-25 cm)</option>
                    <option>Très grande (+25 cm)</option>
                  </select>
                </div>
                <textarea
                  name="description"
                  className="px-4 py-4 rounded-3xl border min-h-[180px]"
                  placeholder="Décrivez votre projet..."
                  required
                />

                <div className="flex items-center justify-end gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="hover:scale-110 transition cursor-pointer w-4 h-4 bg-green-500 checked:bg-green-700 rounded focus:ring-0"
                  />

                  <p className="text-brownBlack">
                    J’ai lu et accepté les{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="underline font-semibold cursor-pointer hover:scale-105 transition"
                    >
                      conditions générales
                    </button>
                    .
                  </p>
                </div>

                <button
                  disabled={!acceptedTerms || isSubmitting}
                  className="w-fit justify-self-end px-6 py-2 rounded-full bg-darkBrown text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:opacity-90 transition"
                  type="submit"
                >
                  {isSubmitting
                    ? "Envoi en cours..."
                    : data?.buttonText || "Envoyer"}
                </button>
              </form>

              {data?.decorImage && !isEditing && (
                <img
                  src={data.decorImage}
                  alt="Décoration"
                  className=" w-[300px] laptop:w-[500px] object-cover pointer-events-none"
                />
              )}
            </div>
          </>
        )}

        <svg
          viewBox="0 0 590.34 74.98"
          className="w-[105%] laptop:w-[100%] absolute bottom-[-2px] left-1/2 laptop:left-0 -translate-x-1/2 laptop:translate-x-0 h-auto block"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M590.33,42.26v32.72H0L.2,7.75C24.32,2.41,48.14.96,72.24.3c6.54-.18,12.68-.57,19.04-.02,5.17.6,9.96.28,15.45.51,36.82,1.55,72.86,7.06,108.84,15.35,43.03,9.92,84,24.58,124.44,41.98,16.87,7.26,34.65,10.08,52.83,11.76,62.13,5.74,137.96-9.94,197.49-27.62Z"
            fill="#8a5138"
          />
        </svg>
      </div>
      <TermsModal
        isOpen={showTerms}
        content={data?.termsAndConditions || ""}
        onClose={() => setShowTerms(false)}
      />
    </section>
  );
}
