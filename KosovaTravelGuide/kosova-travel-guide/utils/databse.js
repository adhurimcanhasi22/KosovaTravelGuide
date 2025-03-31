import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // Set strictQuery to true to avoid deprecation warning

  if (isConnected) {
    // If already connected, return
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect("");

    isConnected = true; // Update the connection status
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};
