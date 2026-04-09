const mongoose = require("mongoose");
const {
  heroSchema,
  introSectionSchema,
  aboutIntroSchema,
  contactFormSchema,
  testimonialsSchema,
  faqSchema,
} = require("../components/reusableComponentSchemas");

const sharedComponentsSchema = new mongoose.Schema(
  {
    hero: { type: heroSchema, required: false },
    artIntro: { type: introSectionSchema, required: false },
    tattooIntro: { type: introSectionSchema, required: false },
    aboutIntro: { type: aboutIntroSchema, required: false },
    contactForm: { type: contactFormSchema, required: false },
    testimonials: { type: testimonialsSchema, required: false },
    faq: { type: faqSchema, required: false },
  },
  { _id: false, strict: true },
);

module.exports = sharedComponentsSchema;
