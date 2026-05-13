const mongoose = require("mongoose");

const plainTextField = () => ({
  type: String,
  default: "",
  trim: true,
});

// Rich text is stored as HTML from the frontend editor.
const richTextHtmlField = (required = true) => ({
  type: String,
  required,
  default: "",
});

const heroSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    subtitle: richTextHtmlField(),
    description: richTextHtmlField(),
    primaryCtaText: plainTextField(),
    primaryCtaLink: plainTextField(),
    imageRight: plainTextField(),
    imageLeft: plainTextField(),
    poem: richTextHtmlField(),
  },
  { _id: false },
);

const imageGalleryItemSchema = new mongoose.Schema(
  {
    image: plainTextField(),
    alt: plainTextField(),
    name: plainTextField(),
  },
  { _id: false },
);

const introSectionSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    description: richTextHtmlField(),
    ctaText: plainTextField(),
    imageGallery: { type: [imageGalleryItemSchema], default: [] },
  },
  { _id: false },
);

const paintingsIntroSchema = new mongoose.Schema({
  title: plainTextField(),
  description: richTextHtmlField(),
  ctaText: plainTextField(),
  imageGallery: { type: [imageGalleryItemSchema], default: [] },
});

const tattoosIntroSchema = new mongoose.Schema({
  title: plainTextField(),
  subtitle: richTextHtmlField(),
  description: richTextHtmlField(),
  ctaText: plainTextField(),
  imageGallery: { type: [imageGalleryItemSchema], default: [] },
});
const valuesSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    description: richTextHtmlField(),
    ctaText: plainTextField(),
    ctaLink: plainTextField(),
    illustrationImage: plainTextField(),
    valuesImage: plainTextField(),
  },
  { _id: false },
);

const profileIntroSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    description: richTextHtmlField(),
    ctaText: plainTextField(),
    ctaLink: plainTextField(),
    profileImage: plainTextField(),
    decorImage: plainTextField(),
    listTitle: plainTextField(),
    list: { type: [String], default: [] },
  },
  { _id: false },
);

const aboutIntroSchema = new mongoose.Schema(
  {
    values: valuesSchema,
    profile: profileIntroSchema,
  },
  { _id: false },
);

const contactFormSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    subtitle: richTextHtmlField(),
    buttonText: plainTextField(),
    successMessage: plainTextField(),
    termsAndConditions: richTextHtmlField(),
  },
  { _id: false },
);

const testimonialItemSchema = new mongoose.Schema(
  {
    name: plainTextField(),
    quote: richTextHtmlField(),
    role: plainTextField(),
  },
  { _id: false },
);

const testimonialsSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    items: { type: [testimonialItemSchema], default: [] },
  },
  { _id: false },
);

const faqItemSchema = new mongoose.Schema(
  {
    question: plainTextField(),
    answer: richTextHtmlField(),
  },
  { _id: false },
);

const faqSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    items: { type: [faqItemSchema], default: [] },
  },
  { _id: false },
);

const seoSchema = new mongoose.Schema(
  {
    title: plainTextField(),
    description: richTextHtmlField(),
  },
  { _id: false },
);

module.exports = {
  plainTextField,
  richTextHtmlField,
  heroSchema,
  introSectionSchema,
  paintingsIntroSchema,
  tattoosIntroSchema,
  aboutIntroSchema,
  contactFormSchema,
  testimonialItemSchema,
  testimonialsSchema,
  faqItemSchema,
  faqSchema,
  seoSchema,
};
