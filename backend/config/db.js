import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("Missing MONGODB_URI in environment");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1);
  }
};

