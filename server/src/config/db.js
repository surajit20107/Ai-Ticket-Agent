import mongoose from "mongoose";

export const connectDB = async () => {
  const { MONGO_URI } = process.env
  if (!MONGO_URI) {
    throw new Error("❌ Database connection string not found...!!");
  }
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✅ Database connected successfully...!!");
    })
    .catch((err) => {
      throw new Error("❌ Database connection failed", err.message);
    });
};
