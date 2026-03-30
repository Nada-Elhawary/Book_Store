const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRoutes");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(userRoutes);
app.use("/api/books", bookRouter);
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
