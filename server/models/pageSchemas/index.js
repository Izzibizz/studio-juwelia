const mongoose = require("mongoose");
const homepageSchema = require("./homepageSchema");
const sharedComponentsSchema = require("./sharedComponentsSchema");
const aboutPageSchema = require("./aboutPageSchema");
const artPageSchema = require("./artPageSchema");
const bookingPageSchema = require("./bookingPageSchema");
const contactPageSchema = require("./contactPageSchema");
const tattoosPageSchema = require("./tattoosPageSchema");

const PAGE_SCHEMA_MAP = {
  homepage: homepageSchema,
  shared: sharedComponentsSchema,
  about: aboutPageSchema,
  art: artPageSchema,
  booking: bookingPageSchema,
  contact: contactPageSchema,
  tattoos: tattoosPageSchema,
};

const PAGE_KEYS = Object.keys(PAGE_SCHEMA_MAP);

const compileValidationModel = (schema) =>
  mongoose.model(
    `PageValidation_${Math.random().toString(36).slice(2)}`,
    new mongoose.Schema({ data: schema }, { _id: false }),
  );

const validatorCache = new Map();

const validatePageData = (page, data) => {
  const pageSchema = PAGE_SCHEMA_MAP[page];
  if (!pageSchema) return `Unknown page schema: ${page}`;

  const payload = data || {};
  if (typeof payload !== "object" || Array.isArray(payload)) {
    return "Page data must be an object";
  }

  let validatorModel = validatorCache.get(page);
  if (!validatorModel) {
    validatorModel = compileValidationModel(pageSchema);
    validatorCache.set(page, validatorModel);
  }

  const doc = new validatorModel({ data: payload });
  const err = doc.validateSync();
  return err ? err.message : null;
};

module.exports = {
  PAGE_SCHEMA_MAP,
  PAGE_KEYS,
  validatePageData,
};
