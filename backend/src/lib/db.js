import mongoose from 'mongoose';

export const connectDB=async() => {
  try{
    // Connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MOGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error",error);
  }
};
