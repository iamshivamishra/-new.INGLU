import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true }, // email or phone
    code: { type: String, required: true },
    purpose: { type: String, enum: ["login", "signup", "reset"], default: "login" },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);
