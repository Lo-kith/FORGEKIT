import mongoose from "mongoose";
import { logError } from "../utils/logger.js";

export async function connectDatabase(uri: string | undefined): Promise<void> {
  if (!uri) {
    console.warn("MONGODB_URI is not configured; the API is starting without a database.");
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.info("Connected to MongoDB.");
  } catch (error) {
    logError("MongoDB connection failed; the API will continue without the database.", error);
  }
}

export function databaseStatus(): "connected" | "connecting" | "disconnected" {
  switch (mongoose.connection.readyState) {
    case 1:
      return "connected";
    case 2:
      return "connecting";
    default:
      return "disconnected";
  }
}
