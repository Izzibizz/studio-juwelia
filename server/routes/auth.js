const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendResetPasswordMail } = require("../utils/email");

const router = express.Router();

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  return User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
  });
};

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_here";
  return jwt.sign({ id: user._id, name: user.name }, secret, {
    expiresIn: "7d",
  });
};

router.post("/signup", async (req, res) => {
  const { name, password, email } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const existing = await findUserByEmail(normalizedEmail);
  if (existing)
    return res.status(400).json({ message: "Email is already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name || normalizedEmail.split("@")[0],
    password: hashed,
    email: normalizedEmail,
  });

  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ id: user._id, name: user.name, email: user.email, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await findUserByEmail(email);
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

router.get("/users", auth, async (req, res) => {
  const users = await User.find({}, { password: 0, resetPasswordToken: 0 })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ count: users.length, users });
});

router.delete("/delete", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.clearCookie("token");
  res.json({ message: "User deleted" });
});

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await findUserByEmail(email);
  if (!user) {
    return res.json({ message: "Reset email sent if user exists" });
  }

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
