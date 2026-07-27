import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateToken } from "../utils/generateToken.js";
import { generateEmployeeId } from "../utils/idGenerator.js";
import { sendOtpEmail } from "../utils/mailer.js";

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_WINDOW_MS = 30 * 1000;

function sanitize(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

function makeOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

/* ============================== LOGIN ============================== */

export async function login(req, res) {
  const { identifier, password } = req.body; // identifier = email or employeeId
  if (!identifier || !password) {
    return res.status(400).json({ message: "Email/Employee ID and password are required" });
  }
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { employeeId: identifier }],
  }).select("+password");

  if (!user) return res.status(401).json({ message: "Incorrect email or password" });

  if (user.isLocked()) {
    return res.status(423).json({ message: "Account locked due to too many failed attempts. Try again later." });
  }

  const match = await user.comparePassword(password);
  if (!match) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      user.loginAttempts = 0;
    }
    await user.save();
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  const token = generateToken(user._id);
  res.json({ token, user: sanitize(user) });
}

export async function me(req, res) {
  res.json({ user: sanitize(req.user) });
}

export async function setFirstTimePassword(req, res) {
  const { password, phone, emergencyContact, address } = req.body;
  const user = req.user;
  if (password) user.password = password;
  if (phone) user.phone = phone;
  if (emergencyContact) user.emergencyContact = emergencyContact;
  if (address) user.address = address;
  user.firstLogin = false;
  if (user.status === "Onboarding") user.status = "Active";
  await user.save();
  res.json({ user: sanitize(user) });
}

/* ============================== SIGNUP ============================== */
// Self-service signup. In the PRD, employees are normally created via HR
// onboarding — this endpoint is a lightweight public registration path so
// the product can be demoed/used without an HR-driven pipeline. New signups
// land as "Employee" by default and Active immediately (no email verification
// service configured in this project yet).

export async function signup(req, res) {
  const { name, email, phone, password, department, designation, employmentType } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const type = employmentType === "Intern" ? "Intern" : "Full-Time";
  const employeeId = await generateEmployeeId(type);

  const user = await User.create({
    employeeId,
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role: type === "Intern" ? "Intern" : "Employee",
    department: department || "Unassigned",
    designation: designation || (type === "Intern" ? "Intern" : "Employee"),
    employmentType: type,
    status: "Active",
    firstLogin: false,
  });

  const token = generateToken(user._id);
  res.status(201).json({ token, user: sanitize(user) });
}

/* ============================== OTP LOGIN ============================== */
// No SMS/email provider is wired up yet, so in development the generated
// code is returned directly in the API response (and logged server-side) so
// the flow is fully testable end-to-end. Swap `devCode` out once an SMS/email
// provider (e.g. MSG91, Twilio, SES) is connected per the PRD's tech stack.

export async function sendOtp(req, res) {
  const { identifier } = req.body; // email or employeeId or phone
  if (!identifier) return res.status(400).json({ message: "Email or Employee ID is required" });

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { employeeId: identifier }, { phone: identifier }],
  });
  if (!user) return res.status(404).json({ message: "No account found with that email / employee ID" });

  const recent = await Otp.findOne({ identifier: user.email, purpose: "login" }).sort({ createdAt: -1 });
  if (recent && Date.now() - new Date(recent.createdAt).getTime() < OTP_RESEND_WINDOW_MS) {
    return res.status(429).json({ message: "Please wait before requesting another OTP" });
  }

  const code = makeOtpCode();
  await Otp.create({
    identifier: user.email,
    code,
    purpose: "login",
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  const emailSent = await sendOtpEmail({ to: user.email, code, purpose: "login" });

  if (!emailSent) {
    // SMTP not configured — log it so the flow is still testable locally.
    console.log(`[OTP] Login code for ${user.email} (${user.employeeId}): ${code}`);
  }

  res.json({
    message: emailSent ? "OTP sent to your email" : "OTP generated (email not configured, check server logs)",
    // Only exposed when SMTP isn't set up, so local/dev testing still works without a mail provider.
    devCode: emailSent ? undefined : code,
  });
}

export async function verifyOtp(req, res) {
  const { identifier, code } = req.body;
  if (!identifier || !code) return res.status(400).json({ message: "Identifier and OTP are required" });

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { employeeId: identifier }, { phone: identifier }],
  });
  if (!user) return res.status(404).json({ message: "No account found with that email / employee ID" });

  const otp = await Otp.findOne({ identifier: user.email, purpose: "login", consumed: false }).sort({ createdAt: -1 });
  if (!otp || otp.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
  }
  if (otp.attempts >= 3) {
    return res.status(429).json({ message: "Too many incorrect attempts. Please request a new OTP." });
  }
  if (otp.code !== code) {
    otp.attempts += 1;
    await otp.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  otp.consumed = true;
  await otp.save();

  const token = generateToken(user._id);
  res.json({ token, user: sanitize(user) });
}

/* ============================== FORGOT / RESET PASSWORD ============================== */

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  // Always respond success-shaped to avoid leaking which emails exist.
  if (!user) return res.json({ message: "If that email exists, a reset code has been sent." });

  const code = makeOtpCode();
  await Otp.create({
    identifier: user.email,
    code,
    purpose: "reset",
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  const emailSent = await sendOtpEmail({ to: user.email, code, purpose: "reset" });

  if (!emailSent) {
    console.log(`[RESET] Password reset code for ${user.email}: ${code}`);
  }

  res.json({
    message: "If that email exists, a reset code has been sent.",
    // Only exposed when SMTP isn't set up, so local/dev testing still works without a mail provider.
    devCode: emailSent ? undefined : code,
  });
}

export async function resetPassword(req, res) {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Email, code and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ message: "Invalid code or email" });

  const otp = await Otp.findOne({ identifier: user.email, purpose: "reset", consumed: false }).sort({ createdAt: -1 });
  if (!otp || otp.expiresAt < new Date() || otp.code !== code) {
    return res.status(400).json({ message: "Invalid or expired reset code" });
  }

  otp.consumed = true;
  await otp.save();

  user.password = newPassword;
  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  res.json({ message: "Password updated. You can now log in." });
}
