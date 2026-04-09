const mongoose = require("mongoose");
const { PAGE_KEYS } = require("./pageSchemas");

const pageSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      lowercase: true,
      enum: PAGE_KEYS,
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PageData", pageSchema);
