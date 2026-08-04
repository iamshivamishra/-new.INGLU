import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Casual","Sick","Earned","LOP"], default: "Casual" },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  halfDay: { type: Boolean, default: false },
  reason: String,
  documentUrl: String,
  status: { type: String, enum: ["Pending","Approved","Rejected"], default: "Pending" },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approverComment: String,
  isLOP: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model("Leave", leaveSchema);
