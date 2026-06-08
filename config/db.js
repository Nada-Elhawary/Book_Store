const mongoose = require("mongoose");

// Global cache for serverless environment to prevent multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4, // Force IPv4 to prevent IPv6 DNS issues on serverless platforms
    };

    console.log("Creating new MongoDB connection");
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  } catch (error) {
    cached.promise = null;
    console.error("DB Error:", error.message);
    throw error; // Throw error instead of process.exit(1) in serverless context
  }

  return cached.conn;
};

module.exports = connectDB;