const mongoose = require("mongoose");
const {
  introSectionSchema,
  contactFormSchema,
  seoSchema,
} = require("../components/reusableComponentSchemas");

const contactPageSchema = new mongoose.Schema(
  {
    seo: { type: seoSchema, required: false },
    intro: { type: introSectionSchema, required: false },
    contactForm: { type: contactFormSchema, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
  },
  { _id: false, strict: true },
);

module.exports = contactPageSchema;
