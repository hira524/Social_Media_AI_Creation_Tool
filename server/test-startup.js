// Simple test to check what's causing the hang
console.log("Starting test...");

// Test dotenv
console.log("Testing dotenv...");
import "dotenv/config";
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

// Test express
console.log("Testing express...");
import express from "express";
const app = express();
console.log("Express loaded");

// Test mongoose
console.log("Testing mongoose connection...");
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
  return true;
};

// Test the connection
connectDB().then((success) => {
  if (success) {
    console.log("MongoDB connection test passed");
    // Start a simple server
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    const port = 5000;
    app.listen(port, () => {
      console.log(`Test server running on port ${port}`);
    });
  } else {
    console.log("MongoDB connection test failed");
    process.exit(1);
  }
}).catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
