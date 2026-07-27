import mongoose from "mongoose";
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: [{ author: String, text: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
export default mongoose.model("Client", clientSchema);
