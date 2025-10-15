import mongoose from "mongoose";

type Connection = {
    isConnected?: number;
}
const connection: Connection = {};

export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return;
    }
   try {
     const db = await mongoose.connect(process.env.MONGODB_URI || "");
     connection.isConnected = db.connections[0].readyState;
     console.log("MongoDB connected");
   } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
        process.exit(1);
   }
}