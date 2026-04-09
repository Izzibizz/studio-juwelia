import type { PageEditorSchema } from "./types";

export const bookingEditorSchema: PageEditorSchema = {
  seo: {
    title: { label: "SEO Title", type: "plain" },
    description: { label: "SEO Description", type: "rich" },
  },
  intro: {
    title: { label: "Intro Title", type: "plain" },
    description: { label: "Intro Description", type: "rich" },
    ctaText: { label: "Intro CTA", type: "plain" },
    imageGallery: {
      label: "Intro Gallery JSON",
      type: "plain",
      multiline: true,
    },
  },
  form: {
    formTitle: { label: "Form Title", type: "plain" },
    fields: { label: "Fields JSON", type: "plain", multiline: true },
  },
};
