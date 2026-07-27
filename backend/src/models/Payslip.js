import mongoose from "mongoose";
const payslipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // "2026-07"
  base: Number,
  deductions: Number,
  deductionNotes: String,
  bonus: Number,
  netPay: Number,
  status: { type: String, enum: ["Draft","Finalized"], default: "Draft" },
}, { timestamps: true });
payslipSchema.index({ user: 1, month: 1 }, { unique: true });
export default mongoose.model("Payslip", payslipSchema);
