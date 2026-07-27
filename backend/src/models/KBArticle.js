import mongoose from "mongoose";
const kbSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["Policies","SOPs","Training Videos","Brand Decks","FAQs"], default: "Policies" },
  content: String,
  fileUrl: String,
}, { timestamps: true });
export default mongoose.model("KBArticle", kbSchema);
