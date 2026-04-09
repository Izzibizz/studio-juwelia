const mongoose = require("mongoose");
const {
  heroSchema,
  introSectionSchema,
  seoSchema,
} = require("../components/reusableComponentSchemas");

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: false, default: "" },
  },
  { _id: false },
);

const artPageSchema = new mongoose.Schema(
  {
    seo: { type: seoSchema, required: false },
    hero: { type: heroSchema, required: false },
    intro: { type: introSectionSchema, required: false },
    gallery: { type: [galleryItemSchema], default: [] },
  },
  { _id: false, strict: true },
);

module.exports = artPageSchema;
