import type { PageEditorSchema } from "./types";

export const tattoosEditorSchema: PageEditorSchema = {
  introduction: {
    h2: { label: "Introduction H2", type: "plain" },
    h3: { label: "Introduction H3", type: "plain" },
    description: { label: "Introduction Description", type: "rich" },
    introImage: { label: "Introduction Image URL", type: "plain" },
  },
  techniques: {
    h2: { label: "Techniques H2", type: "plain" },
    h3: { label: "Techniques H3", type: "plain" },
    description: { label: "Techniques Description", type: "rich" },
    categories: {
      label: "Technique Categories JSON",
      type: "plain",
      multiline: true,
    },
  },
  details: {
    decorImage: { label: "Décor Image URL", type: "plain" },
    h2: { label: "Details H2", type: "plain" },
    cta: { label: "Details CTA", type: "plain" },
    h3: { label: "Details H3", type: "plain" },
    description: { label: "Details Description", type: "rich" },
    contentText: { label: "Details Content Text", type: "rich" },
  },
};
