import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Opens a connection to MongoDB. Fatal on failure — a server without a
 * working database cannot serve correct responses, so we crash early
 * rather than serve degraded traffic.
 */
export const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`\u2713 MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("\u2717 MongoDB connection failed:", err);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("\u2713 MongoDB disconnected");
};
