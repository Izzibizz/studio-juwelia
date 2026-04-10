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

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

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

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();
