const mongoose = require("mongoose");
const {
  heroSchema,
  introSectionSchema,
  seoSchema,
} = require("../components/reusableComponentSchemas");

const tattooItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    style: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
  },
  { _id: false },
);

const tattoosPageSchema = new mongoose.Schema(
  {
    seo: { type: seoSchema, required: false },
    hero: { type: heroSchema, required: false },
    intro: { type: introSectionSchema, required: false },
    tattoos: { type: [tattooItemSchema], default: [] },
  },
  { _id: false, strict: true },
);

module.exports = tattoosPageSchema;
