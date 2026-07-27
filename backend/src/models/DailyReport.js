import mongoose from "mongoose";
const dailyReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  summary: String,
  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  pendingTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  tomorrowPlan: String,
  challenges: String,
  attachments: [String],
  reviewed: { type: Boolean, default: false },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
dailyReportSchema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model("DailyReport", dailyReportSchema);
