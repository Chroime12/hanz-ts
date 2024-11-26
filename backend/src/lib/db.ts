import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB");
  }
};
