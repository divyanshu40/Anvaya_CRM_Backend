const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

// Global cache to prevent multiple connections in Vercel
let isConnected = false;

const initializeDatabase = async () => {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = true;
    console.log("=> New database connection established");
  } catch (error) {
    console.error("=> MongoDB connection error:", error);
    throw error; // so your serverless function fails gracefully
  }
};

module.exports = { initializeDatabase };
