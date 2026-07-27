import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  department: String,
  email: String,
  phone: String,
  college: String,
  appliedVia: String,
  resumeUrl: String,
  stage: { type: String, enum: ["Applied","Screened","Interview","Assignment","Offer","Hired","Rejected"], default: "Applied" },
  score: Number,
  evaluation: [{ criterion: String, rating: Number }],
  notes: [{ author: String, text: String, at: { type: Date, default: Date.now } }],
  convertedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
export default mongoose.model("Candidate", candidateSchema);
