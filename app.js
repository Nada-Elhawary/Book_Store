const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const app = express();


app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});

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