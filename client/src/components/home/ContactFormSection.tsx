import { useState } from "react";
import type { ContactFormSectionData } from "../../api/contentAPI";
import { RichTextContent } from "../RichTextContent";

interface ContactFormSectionProps {
  data: ContactFormSectionData;
}

export function ContactFormSection({ data }: ContactFormSectionProps) {
  const [sent, setSent] = useState(false);

  return (
    <section className="rounded-2xl p-6 md:p-8 bg-beige border border-[#e7dfd5]">
      <h2 className="text-2xl md:text-3xl font-bold text-darkBrown mb-2">
        {data.title}
      </h2>
      <RichTextContent html={data.subtitle} className="text-brownBlack mb-6" />
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
