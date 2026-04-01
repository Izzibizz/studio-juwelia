const express = require("express");
const PageData = require("../models/PageData");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:page", async (req, res) => {
  const page = req.params.page.toLowerCase();
  const doc = await PageData.findOne({ page });
  if (!doc) return res.status(404).json({ message: "Page not found" });
  res.json(doc);
});

router.post("/:page", auth, async (req, res) => {
  const page = req.params.page.toLowerCase();
  const allowedPages = [
    "about",
    "art",
    "booking",
    "contact",
    "homepage",
    "tattoos",
  ];
  if (!allowedPages.includes(page))
    return res.status(400).json({ message: "Invalid page id" });

  const data = req.body.data || {};

  const updated = await PageData.findOneAndUpdate(
    { page },
    { data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.json(updated);
});

router.delete("/:page", auth, async (req, res) => {
  const page = req.params.page.toLowerCase();
  await PageData.findOneAndDelete({ page });
  res.json({ message: "Page data removed" });
});

router.get("/", async (req, res) => {
  const pages = await PageData.find({});
  res.json(pages);
});

module.exports = router;
