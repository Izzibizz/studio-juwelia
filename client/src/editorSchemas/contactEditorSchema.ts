import type { PageEditorSchema } from "./types";

export const contactEditorSchema: PageEditorSchema = {
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
  contactForm: {
    title: { label: "Title", type: "plain" },
    subtitle: { label: "Subtitle", type: "rich" },
    buttonText: { label: "Button Text", type: "plain" },
    successMessage: { label: "Success Message", type: "plain" },
    termsAndConditions: { label: "Terms and Conditions", type: "rich" },
  },
  contactDetails: {
    email: { label: "Email", type: "plain" },
    instagramName: { label: "Instagram Name", type: "plain" },
    instagramLink: { label: "Instagram Link", type: "plain" },
    phone: { label: "Phone", type: "plain" },
    address: { label: "Address", type: "plain", multiline: true },
  },
};
