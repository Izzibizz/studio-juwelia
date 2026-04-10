import { useState } from "react";
import type { ContactFormSectionData } from "../../api/contentAPI";
import { EditorField } from "../editor";
import { RichTextContent } from "../RichTextContent";

interface ContactFormSectionProps {
  data: ContactFormSectionData;
  isEditing?: boolean;
  onChange?: (nextData: ContactFormSectionData) => void;
}

export function ContactFormSection({
  data,
  isEditing = false,
  onChange,
}: ContactFormSectionProps) {
  const [sent, setSent] = useState(false);

  const updateField = (field: keyof ContactFormSectionData, value: string) => {
    onChange?.({ ...data, [field]: value });
  };

  return (
    <section className="rounded-2xl p-6 md:p-8 bg-beige border border-[#e7dfd5]">
      {isEditing ? (
        <div className="mb-6 grid gap-4 rounded-2xl border border-[#d8cfc1] bg-white/80 p-4">
          <EditorField
            type="plain"
            label="Title"
            value={data.title}
            onChange={(value) => updateField("title", value)}
          />
          <EditorField
            type="rich"
            label="Subtitle"
            value={data.subtitle}
            onChange={(value) => updateField("subtitle", value)}
          />
          <EditorField
            type="plain"
            label="Button text"
            value={data.buttonText}
            onChange={(value) => updateField("buttonText", value)}
          />
          <EditorField
            type="plain"
            label="Success message"
            value={data.successMessage}
            onChange={(value) => updateField("successMessage", value)}
          />
          <EditorField
            type="rich"
            label="Terms and conditions"
            value={data.termsAndConditions}
            onChange={(value) => updateField("termsAndConditions", value)}
          />
        </div>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-2">
            {data.title}
          </h2>
          <RichTextContent
            html={data.subtitle}
            className="text-brownBlack mb-6"
          />
        </>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="grid gap-3"
      >
        <input
          className="px-4 py-3 rounded-lg border"
          placeholder="Nom"
          required
        />
        <input
          className="px-4 py-3 rounded-lg border"
          type="email"
          placeholder="Email"
          required
        />
        <textarea
          className="px-4 py-3 rounded-lg border min-h-[120px]"
          placeholder="Votre message"
          required
        />
        <button
          className="w-fit px-5 py-3 rounded-full bg-darkBrown text-white hover:opacity-90"
          type="submit"
        >
          {data.buttonText}
        </button>
      </form>
      <RichTextContent
        html={data.termsAndConditions}
        className="mt-4 text-xs text-brown"
      />
      {sent && <p className="mt-3 text-green-700">{data.successMessage}</p>}
    </section>
  );
}
