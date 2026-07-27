import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";

function daysBetween(from, to) {
  const ms = new Date(to) - new Date(from);
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

export async function applyLeave(req, res) {
  const { type, from, to, halfDay, reason } = req.body;
  let balance = await LeaveBalance.findOne({ user: req.user._id });
  if (!balance) balance = await LeaveBalance.create({ user: req.user._id });

  const requestedDays = halfDay ? 0.5 : daysBetween(from, to);
  const key = type.toLowerCase();
  const available = balance[key] ?? 0;
  const isLOP = requestedDays > available;

  const leave = await Leave.create({
    user: req.user._id, type, from, to, halfDay, reason, isLOP,
    status: "Pending",
  });
  res.status(201).json({ leave, isLOP, balance });
}

export async function myBalance(req, res) {
  let balance = await LeaveBalance.findOne({ user: req.user._id });
  if (!balance) balance = await LeaveBalance.create({ user: req.user._id });
  res.json(balance);
}

export async function myLeaves(req, res) {
  const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
}

export async function pendingApprovals(req, res) {
  // In production this filters by team/dept scope of req.user; kept simple here.
  const leaves = await Leave.find({ status: "Pending" }).populate("user", "name employeeId department");
  res.json(leaves);
}

export async function decideLeave(req, res) {
  const { decision, comment } = req.body; // "Approved" | "Rejected"
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });

  leave.status = decision;
  leave.approver = req.user._id;
  leave.approverComment = comment;
  await leave.save();

  if (decision === "Approved" && !leave.isLOP) {
    const key = leave.type.toLowerCase();
    const balance = await LeaveBalance.findOne({ user: leave.user });
    if (balance && balance[key] !== undefined) {
      const days = leave.halfDay ? 0.5 : daysBetween(leave.from, leave.to);
      balance[key] = Math.max(0, balance[key] - days);
      await balance.save();
    }
  }
  res.json(leave);
}
