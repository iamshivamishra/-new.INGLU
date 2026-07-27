import mongoose from "mongoose";
const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Laptop","SIM","Access Card","Other"], default: "Other" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  issuedOn: Date,
  status: { type: String, enum: ["In Stock","Issued","Returned","Damaged"], default: "In Stock" },
  history: [{ action: String, by: String, at: { type: Date, default: Date.now }, notes: String }],
}, { timestamps: true });
export default mongoose.model("Asset", assetSchema);
