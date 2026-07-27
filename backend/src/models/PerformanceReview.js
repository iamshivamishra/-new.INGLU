import mongoose from "mongoose";
const keyResultSchema = new mongoose.Schema({ label: String, target: Number, current: Number });
const performanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cycle: { type: String, required: true }, // "Q3 2026"
  objective: String,
  keyResults: [keyResultSchema],
  kpiScore: Number,
  okrCompletion: Number,
  managerComments: String,
  promotionRecommendation: { type: Boolean, default: false },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("PerformanceReview", performanceSchema);
