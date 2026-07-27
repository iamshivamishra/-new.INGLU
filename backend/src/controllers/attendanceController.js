import Attendance from "../models/Attendance.js";
import Timesheet from "../models/Timesheet.js";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function clockIn(req, res) {
  const date = todayStr();
  let att = await Attendance.findOne({ user: req.user._id, date });
  if (att && att.clockIn) return res.status(400).json({ message: "Already clocked in today" });

  const now = new Date();
  const officeStart = new Date(now); officeStart.setHours(10, 15, 0, 0); // grace period 15 min
  const status = now > officeStart ? "Late" : "Present";

  if (!att) {
    att = await Attendance.create({ user: req.user._id, date, clockIn: now, status });
  } else {
    att.clockIn = now;
    att.status = status;
    await att.save();
  }
  res.json(att);
}

export async function clockOut(req, res) {
  const date = todayStr();
  const att = await Attendance.findOne({ user: req.user._id, date });
  if (!att || !att.clockIn) return res.status(400).json({ message: "You have not clocked in today" });
  if (att.clockOut) return res.status(400).json({ message: "Already clocked out today" });

  // HARD GATE: timesheet must be submitted before clock-out (enforced server-side)
  const ts = await Timesheet.findOne({ user: req.user._id, date });
  if (!ts || !ts.submitted) {
    return res.status(428).json({
      message: "You must submit today's Timesheet before you can clock out.",
      code: "TIMESHEET_REQUIRED",
    });
  }

  att.clockOut = new Date();
  await att.save();
  res.json(att);
}

export async function todayStatus(req, res) {
  const date = todayStr();
  const att = await Attendance.findOne({ user: req.user._id, date });
  const ts = await Timesheet.findOne({ user: req.user._id, date });
  res.json({ attendance: att, timesheetSubmitted: !!(ts && ts.submitted) });
}

export async function calendar(req, res) {
  const { userId, month } = req.query; // month = "2026-07"
  const uid = userId || req.user._id;
  const regex = new RegExp(`^${month || todayStr().slice(0, 7)}`);
  const records = await Attendance.find({ user: uid, date: { $regex: regex } });
  res.json(records);
}

export async function teamStatus(req, res) {
  // For managers: all attendance for today across users they can see (frontend passes explicit user ids or dept scope is applied by role in real deployment)
  const date = req.query.date || todayStr();
  const records = await Attendance.find({ date }).populate("user", "name employeeId department");
  res.json(records);
}
