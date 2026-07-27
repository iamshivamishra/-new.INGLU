import mongoose from "mongoose";
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  pinned: { type: Boolean, default: false },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: String,
}, { timestamps: true });
export default mongoose.model("Announcement", announcementSchema);
