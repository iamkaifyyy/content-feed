import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  const conn = await mongoose.connect(uri);
  console.log(`Connected to MongoDB (${conn.connection.host})`);
};

export default connectDB;
