const mongoose = require("mongoose");
const {
  heroSchema,
  introSectionSchema,
  seoSchema,
  plainTextField,
  richTextHtmlField,
} = require("../components/reusableComponentSchemas");

const techniqueImageSchema = new mongoose.Schema(
  {
    image: plainTextField(true),
    alt: plainTextField(false),
    text: richTextHtmlField(false),
  },
  { _id: false },
);

const techniqueCategorySchema = new mongoose.Schema(
  {
    title: plainTextField(false),
    mainImage: {
      type: new mongoose.Schema(
        {
          image: plainTextField(true),
          alt: plainTextField(false),
          description: richTextHtmlField(false),
        },
        { _id: false },
      ),
      required: false,
    },
    description: richTextHtmlField(false),
    contentText: richTextHtmlField(false),
    images: { type: [techniqueImageSchema], default: [] },
  },
  { _id: false },
);

const tattoosPageSchema = new mongoose.Schema(
  {
    seo: { type: seoSchema, required: false },
    hero: { type: heroSchema, required: false },
    introduction: {
      type: new mongoose.Schema(
        {
          h2: plainTextField(false),
          h3: plainTextField(false),
          description: richTextHtmlField(false),
          introImage: plainTextField(false),
        },
        { _id: false },
      ),
      required: false,
    },
    techniques: {
      type: new mongoose.Schema(
        {
          h2: plainTextField(false),
          h3: plainTextField(false),
          description: richTextHtmlField(false),
          categories: { type: [techniqueCategorySchema], default: [] },
        },
        { _id: false },
      ),
      required: false,
    },
    details: {
      type: new mongoose.Schema(
        {
          decorImage: plainTextField(false),
          h2: plainTextField(false),
          cta: plainTextField(false),
          h3: plainTextField(false),
          description: richTextHtmlField(false),
          contentText: richTextHtmlField(false),
        },
        { _id: false },
      ),
      required: false,
    },
  },
  { _id: false, strict: true },
);

module.exports = tattoosPageSchema;
