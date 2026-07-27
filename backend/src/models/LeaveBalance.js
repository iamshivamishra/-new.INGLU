import mongoose from "mongoose";
const balanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  casual: { type: Number, default: 12 },
  sick: { type: Number, default: 8 },
  earned: { type: Number, default: 15 },
}, { timestamps: true });
export default mongoose.model("LeaveBalance", balanceSchema);
