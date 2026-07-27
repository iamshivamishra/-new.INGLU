import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ROLES = ["Founder","Super Admin","HR","Finance","Dept Head","Team Lead","Employee","Intern"];

const userSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, required: true }, // EMP-2026-0001 / INT-2026-0001
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, required: true, default: "Employee" },
    department: { type: String, default: "Unassigned" },
    designation: { type: String, default: "" },
    employmentType: { type: String, enum: ["Full-Time", "Intern"], default: "Full-Time" },
    status: { type: String, enum: ["Active", "Inactive", "Onboarding", "Exited"], default: "Onboarding" },
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    joinedOn: { type: Date, default: Date.now },
    dob: { type: Date },
    address: { type: String },
    emergencyContact: { type: String },
    bloodGroup: { type: String },
    bankDetails: {
      accountNumber: String,
      ifsc: String,
      bankName: String,
      pan: String,
      uan: String,
    },
    firstLogin: { type: Boolean, default: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

export const ROLES_LIST = ROLES;
export default mongoose.model("User", userSchema);
