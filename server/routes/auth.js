const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendResetPasswordMail } = require("../utils/email");

const router = express.Router();

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_here";
  return jwt.sign({ id: user._id, name: user.name }, secret, {
    expiresIn: "7d",
  });
};

router.post("/signup", async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password)
    return res.status(400).json({ message: "Name and password are required" });

  const existing = await User.findOne({ name });
  if (existing)
    return res.status(400).json({ message: "User name is already taken" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, password: hashed, email });

  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ id: user._id, name: user.name, email: user.email, token });
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password)
    return res.status(400).json({ message: "Name and password are required" });

  const user = await User.findOne({ name });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ id: user._id, name: user.name, email: user.email, token });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.delete("/delete", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.clearCookie("token");
  res.json({ message: "User deleted" });
});

router.post("/request-reset", async (req, res) => {
  const { name, email } = req.body;
  if (!name && !email)
    return res.status(400).json({ message: "Provide name or email" });

  const query = name ? { name } : { email };
  const user = await User.findOne(query);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.email)
    return res.status(400).json({ message: "User has no email configured" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  await sendResetPasswordMail(user.email, token);
  res.json({ message: "Reset email sent if user exists" });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res
      .status(400)
      .json({ message: "Token and new password are required" });

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});

module.exports = router;
