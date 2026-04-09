const mongoose = require("mongoose");
const {
  heroSchema,
  introSectionSchema,
  seoSchema,
} = require("../components/reusableComponentSchemas");

const contentBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: false, default: "" },
    ctaText: { type: String, required: false, default: "" },
    ctaLink: { type: String, required: false, default: "" },
  },
  { _id: false },
);

const aboutPageSchema = new mongoose.Schema(
  {
    seo: { type: seoSchema, required: false },
    hero: { type: heroSchema, required: false },
    intro: { type: introSectionSchema, required: false },
    sections: { type: [contentBlockSchema], default: [] },
  },
  { _id: false, strict: true },
);

module.exports = aboutPageSchema;
