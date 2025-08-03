import mongoose from 'mongoose';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;