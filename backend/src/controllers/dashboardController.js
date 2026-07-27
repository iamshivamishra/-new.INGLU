import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Lead from "../models/Lead.js";
import Invoice from "../models/Invoice.js";
import Leave from "../models/Leave.js";
import Task from "../models/Task.js";
import Candidate from "../models/Candidate.js";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export async function founderSummary(req, res) {
  const headcount = await User.countDocuments({ status: "Active" });
  const presentToday = await Attendance.countDocuments({ date: todayStr(), status: { $in: ["Present", "Late"] } });
  const openLeads = await Lead.countDocuments({ status: { $nin: ["Converted", "Lost"] } });
  const invoices = await Invoice.find({ status: { $in: ["Paid"] } });
  const revenueMTD = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  res.json({ headcount, attendanceToday: presentToday, openLeads, revenueMTD });
}

export async function hrSummary(req, res) {
  const openRoles = await Candidate.distinct("role", { stage: { $ne: "Rejected" } });
  const pendingInterviews = await Candidate.countDocuments({ stage: "Interview" });
  const leaveRequests = await Leave.countDocuments({ status: "Pending" });
  const onboarding = await User.countDocuments({ status: "Onboarding" });
  res.json({ openRoles: openRoles.length, pendingInterviews, leaveRequests, onboardingInProgress: onboarding });
}

export async function managerSummary(req, res) {
  const teamSize = await User.countDocuments({ reportingManager: req.user._id });
  const attendanceToday = await Attendance.countDocuments({ date: todayStr(), status: { $in: ["Present","Late"] } });
  const pendingApprovals = await Leave.countDocuments({ status: "Pending" });
  res.json({ teamSize, attendanceToday, pendingApprovals });
}

export async function selfSummary(req, res) {
  const att = await Attendance.findOne({ user: req.user._id, date: todayStr() });
  const tasksDue = await Task.countDocuments({ assignee: req.user._id, status: { $ne: "Done" } });
  res.json({ attendance: att, tasksDueToday: tasksDue });
}
