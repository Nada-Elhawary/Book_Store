const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim() === "") {
  console.error(
    "Set JWT_SECRET in your .env file "
  );
  process.exit(1);
}

const app = require("./app");
const connectDB = require("./config/db");


const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

startServer();
