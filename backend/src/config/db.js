import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inglu_ems";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.error("\n❌ MongoDB connection failed:", err.message);
    console.error(
      "\nCheck that:\n" +
      "  1. MongoDB is installed and running locally (or MONGO_URI in backend/.env points to a valid Atlas cluster)\n" +
      "  2. backend/.env exists (copy backend/.env.example to backend/.env if missing)\n" +
      "  3. The connection string / credentials in MONGO_URI are correct\n"
    );
    process.exit(1);
  }
}
