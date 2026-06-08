const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const connectDB = require("./config/db");

const app = express();

// Trust proxy is required for rate limiting when behind Vercel/proxies
app.set("trust proxy", 1);

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001"
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
// app.options("*", cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Database connection middleware (Serverless safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection middleware error:", err);
    res.status(500).json({ message: "Database connection failed: " + (err.message || "Unknown error") });
  }
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window per IP
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: { status: "error", message: "Too many requests, please try again in 15 minutes." },
});
app.use("/api", limiter);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    status: "healthy"
  });
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRouter);
app.use("/api/orders", orderRoutes);

//==========================
// Catch-all 404 route
//==========================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

//==========================
// Error middleware
//==========================
app.use(errorHandler);

module.exports = app;
