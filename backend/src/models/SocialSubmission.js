import mongoose from "mongoose";
const socialSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  platform: { type: String, enum: ["Instagram","LinkedIn","Twitter/X","YouTube","Facebook","Other"], default: "Instagram" },
  postType: String,
  postLink: String,
  driveLink: String,
  screenshotUrl: String,
  caption: String,
  status: { type: String, enum: ["Pending","Approved","Rejected","Late"], default: "Pending" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("SocialSubmission", socialSubmissionSchema);
