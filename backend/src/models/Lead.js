import mongoose from "mongoose";
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: String,
  score: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["New","Contacted","Qualified","Converted","Lost"], default: "New" },
  nextFollowUp: Date,
  timeline: [{ label: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
export default mongoose.model("Lead", leadSchema);
