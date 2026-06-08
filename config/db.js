const mongoose = require("mongoose");

// Global cache for serverless environment to prevent multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Check if we have an active connection
  if (mongoose.connection.readyState === 1) {
    console.log("Using active cached MongoDB connection");
    return mongoose.connection;
  }

  // If connection is in the process of connecting, await the existing promise
  if (cached.promise && mongoose.connection.readyState === 2) {
    console.log("Awaiting existing MongoDB connection promise");
    return cached.promise;
  }

  const opts = {
    bufferCommands: false,
    family: 4, // Force IPv4 to prevent IPv6 DNS issues on serverless platforms
  };

  console.log("Creating new MongoDB connection");
  cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
    return mongooseInstance.connection;
  });

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error("DB Error:", error.message);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;