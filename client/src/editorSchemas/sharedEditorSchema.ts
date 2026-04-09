import type { PageEditorSchema } from "./types";

export const sharedEditorSchema: PageEditorSchema = {
  hero: {
    title: { label: "Hero Title", type: "plain" },
    subtitle: { label: "Hero Subtitle", type: "rich" },
    description: { label: "Hero Description", type: "rich" },
    primaryCtaText: { label: "Primary CTA Text", type: "plain" },
    primaryCtaLink: { label: "Primary CTA Link", type: "plain" },
    imageLeft: { label: "Left Image URL", type: "plain" },
    imageRight: { label: "Right Image URL", type: "plain" },
    poem: { label: "Poem", type: "rich" },
  },
  artIntro: {
    title: { label: "Title", type: "plain" },
    description: { label: "Description", type: "rich" },
    ctaText: { label: "CTA Text", type: "plain" },
    imageGallery: {
      label: "Image Gallery JSON",
      type: "plain",
      multiline: true,
    },
  },
  tattooIntro: {
    title: { label: "Title", type: "plain" },
    description: { label: "Description", type: "rich" },
    ctaText: { label: "CTA Text", type: "plain" },
    imageGallery: {
      label: "Image Gallery JSON",
      type: "plain",
      multiline: true,
    },
  },
  aboutIntro: {
    items: { label: "About Intro Items JSON", type: "plain", multiline: true },
  },
  contactForm: {
    title: { label: "Title", type: "plain" },
    subtitle: { label: "Subtitle", type: "rich" },
    buttonText: { label: "Button Text", type: "plain" },
    successMessage: { label: "Success Message", type: "plain" },
    termsAndConditions: { label: "Terms and Conditions", type: "rich" },
  },
  testimonials: {
    title: { label: "Section Title", type: "plain" },
    items: { label: "Testimonials JSON", type: "plain", multiline: true },
  },
  faq: {
    title: { label: "Section Title", type: "plain" },
    items: { label: "FAQ JSON", type: "plain", multiline: true },
  },
};
