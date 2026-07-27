import mongoose from "mongoose";
const offerSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  role: String,
  department: String,
  stipendOrCtc: String,
  joiningDate: Date,
  template: String,
  status: { type: String, enum: ["Draft","Sent","Accepted","Rejected"], default: "Draft" },
}, { timestamps: true });
export default mongoose.model("Offer", offerSchema);
