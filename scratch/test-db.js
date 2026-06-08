const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const uri = process.env.MONGO_URI;

console.log("Connecting...");
mongoose.connect(uri, { family: 4 })
  .then(async () => {
    console.log("Connected successfully! Trying to ping...");
    try {
      const adminDb = mongoose.connection.db.admin();
      const result = await adminDb.ping();
      console.log("Ping result:", result);
      process.exit(0);
    } catch (queryErr) {
      console.error("Query failed:", queryErr);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
