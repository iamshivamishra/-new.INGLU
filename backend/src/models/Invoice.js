import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  deal: { type: mongoose.Schema.Types.ObjectId, ref: "Deal" },
  invoiceNo: { type: String, required: true, unique: true },
  amount: Number,
  dueDate: Date,
  status: { type: String, enum: ["Draft","Sent","Paid","Overdue"], default: "Draft" },
}, { timestamps: true });
export default mongoose.model("Invoice", invoiceSchema);
