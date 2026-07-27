import mongoose from "mongoose";
const dealSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  title: String,
  value: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stage: { type: String, enum: ["New","Proposal","Negotiation","Won","Lost"], default: "New" },
  lostReason: String,
}, { timestamps: true });
export default mongoose.model("Deal", dealSchema);
