import mongoose from "mongoose";
const componentSchema = new mongoose.Schema({
  name: String, type: { type: String, enum: ["Earning","Deduction"] }, amount: Number,
});
const salaryStructureSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  ctcAnnual: Number,
  components: [componentSchema],
  netPayableMonthly: Number,
}, { timestamps: true });
export default mongoose.model("SalaryStructure", salaryStructureSchema);
