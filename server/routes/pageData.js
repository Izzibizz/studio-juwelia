const express = require("express");
const multer = require("multer");
const { randomUUID } = require("crypto");
const PageData = require("../models/PageData");
const auth = require("../middleware/auth");
const { PAGE_KEYS, validatePageData } = require("../models/pageSchemas");
const { uploadImageBuffer } = require("../lib/cloudinary");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

router.post(
  "/homepage/gallery/:section/add",
  auth,
  upload.single("image"),
  async (req, res) => {
    const section = req.params.section;
    if (section !== "artIntro" && section !== "tattooIntro") {
      return res.status(400).json({ message: "Invalid gallery section" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image was uploaded." });
    }

    const altText = typeof req.body.alt === "string" ? req.body.alt.trim() : "";
    const nameText =
      typeof req.body.name === "string" ? req.body.name.trim() : "";
    const fallbackName = file.originalname.replace(/\.[^.]+$/, "") || "image";

    const uploaded = await uploadImageBuffer(
      file.buffer,
      nameText || altText || fallbackName,
    );

    const newGalleryItem = {
      image: uploaded.url,
      alt: altText || nameText || fallbackName,
      name: nameText || altText || fallbackName,
    };

    const existingDoc = await PageData.findOne({ page: "homepage" });
    const existingData =
      existingDoc && existingDoc.data && typeof existingDoc.data === "object"
        ? existingDoc.data
        : {};
    const existingSection =
      existingData[section] && typeof existingData[section] === "object"
        ? existingData[section]
        : {};
    const existingGallery = Array.isArray(existingSection.imageGallery)
      ? existingSection.imageGallery
      : [];

    const nextData = {
      ...existingData,
      [section]: {
        ...existingSection,
        imageGallery: [...existingGallery, newGalleryItem],
      },
    };

    const validationError = validatePageData("homepage", nextData);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updated = await PageData.findOneAndUpdate(
      { page: "homepage" },
      { data: nextData },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(201).json({
      page: "homepage",
      section,
      item: newGalleryItem,
      data: updated.data,
    });
  },
);

router.get("/:page", async (req, res) => {
  const page = req.params.page.toLowerCase();
  const doc = await PageData.findOne({ page });
  if (!doc) return res.status(404).json({ message: "Page not found" });
  res.json(doc);
});

router.post("/:page", auth, async (req, res) => {
  const page = req.params.page.toLowerCase();
  if (!PAGE_KEYS.includes(page))
    return res.status(400).json({ message: "Invalid page id" });

  const data = req.body.data || {};

  const validationError = validatePageData(page, data);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const updated = await PageData.findOneAndUpdate(
    { page },
    { data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.json(updated);
});

router.post(
  "/media/upload",
  auth,
  upload.array("images", 10),
  async (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];

    if (files.length === 0) {
      return res.status(400).json({ message: "No images were uploaded." });
    }

    const altText = typeof req.body.alt === "string" ? req.body.alt.trim() : "";
    const captionText =
      typeof req.body.caption === "string" ? req.body.caption.trim() : "";
    const uploadedAt = new Date().toISOString();

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const fallbackAlt =
          file.originalname.replace(/\.[^.]+$/, "") || "image";
        const uploaded = await uploadImageBuffer(file.buffer, fallbackAlt);

        return {
          id: randomUUID(),
          publicId: uploaded.publicId,
          url: uploaded.url,
          thumbnailUrl: uploaded.thumbnailUrl,
          alt: altText || captionText || fallbackAlt,
          caption: captionText || altText || fallbackAlt,
          uploadedAt,
        };
      }),
    );

    res.status(201).json({ images: uploadedImages });
  },
);

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
