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

const app = express();

// Trust proxy is required for rate limiting when behind Vercel/proxies
app.set("trust proxy", 1);

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
// app.options("*", cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

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
  res.send("API is running...");
});

app.use(userRoutes);
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
