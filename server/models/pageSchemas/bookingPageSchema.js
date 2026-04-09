const mongoose = require("mongoose");
const {
  introSectionSchema,
  seoSchema,
} = require("../components/reusableComponentSchemas");

const bookingFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
  { _id: false },
);

const bookingPageSchema = new mongoose.Schema(
  {
    seo: { type: seoSchema, required: false },
    intro: { type: introSectionSchema, required: false },
    formTitle: { type: String, required: false },
    fields: { type: [bookingFieldSchema], default: [] },
  },
  { _id: false, strict: true },
);

module.exports = bookingPageSchema;
