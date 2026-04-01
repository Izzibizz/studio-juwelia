const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, trim: true, lowercase: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
