import type { PageEditorSchema } from "./types";

export const aboutEditorSchema: PageEditorSchema = {
  seo: {
    title: { label: "SEO Title", type: "plain" },
    description: { label: "SEO Description", type: "rich" },
  },
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
  intro: {
    items: { label: "Intro Items JSON", type: "plain", multiline: true },
  },
  sections: {
    items: { label: "Sections JSON", type: "plain", multiline: true },
  },
};
