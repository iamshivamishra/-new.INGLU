import mongoose from "mongoose";
const entrySchema = new mongoose.Schema({
  start: String, end: String, taskOrClient: String, hours: Number, notes: String,
});
const timesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  entries: [entrySchema],
  totalHours: { type: Number, default: 0 },
  submitted: { type: Boolean, default: false },
  submittedAt: Date,
  late: { type: Boolean, default: false },
}, { timestamps: true });
timesheetSchema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model("Timesheet", timesheetSchema);
