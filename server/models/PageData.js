const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["about", "art", "booking", "contact", "homepage", "tattoos"],
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PageData", pageSchema);
