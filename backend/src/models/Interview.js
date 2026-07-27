import mongoose from "mongoose";
const interviewSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scheduledAt: Date,
  status: { type: String, enum: ["Scheduled","Completed","Rescheduled","Cancelled"], default: "Scheduled" },
}, { timestamps: true });
export default mongoose.model("Interview", interviewSchema);
