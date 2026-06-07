const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim() === "") {
  console.error(
    "Set JWT_SECRET in your .env file "
  );
  // Avoid process.exit(1) in a serverless context but log clearly
}

const app = require("./app");
const connectDB = require("./config/db");

// Vercel Serverless Handler
const handler = async (req, res) => {
  try {
    // Ensure DB connection is established before handling the request
    await connectDB();
    
    // Pass the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// If running locally (not on Vercel), start a standard Express server
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Local development server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error("Local DB connection failed:", err);
  });
}

module.exports = handler;
