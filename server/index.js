const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("express-async-errors");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const pageDataRoutes = require("./routes/pageData");

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/page", pageDataRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Studio-Juwelia backend is running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
