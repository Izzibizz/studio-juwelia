const PageData = require("../models/PageData");
const { PAGE_KEYS } = require("../models/pageSchemas");
const testPageData = require("../data/testPageData.json");

const toBoolean = (value, defaultValue = true) => {
  if (value === undefined) return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  return !["false", "0", "no", "off"].includes(normalized);
};

const seedPageDataIfMissing = async () => {
  const shouldSeed = toBoolean(process.env.SEED_PAGE_DATA_ON_STARTUP, true);
  if (!shouldSeed) {
    return { inserted: 0, skipped: Object.keys(testPageData).length };
  }

  const entries = Object.entries(testPageData).filter(([page]) =>
    PAGE_KEYS.includes(page),
  );

  if (entries.length === 0) {
    return { inserted: 0, skipped: 0 };
  }

  const operations = entries.map(([page, data]) => ({
    updateOne: {
      filter: { page },
      update: {
        $setOnInsert: { page, data },
      },
      upsert: true,
    },
  }));

  const result = await PageData.bulkWrite(operations, { ordered: false });

  return {
    inserted: result.upsertedCount || 0,
    skipped: entries.length - (result.upsertedCount || 0),
  };
};

module.exports = {
  seedPageDataIfMissing,
};
