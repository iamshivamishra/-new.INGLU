import Timesheet from "../models/Timesheet.js";
import Attendance from "../models/Attendance.js";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export async function upsertTimesheet(req, res) {
  const date = req.body.date || todayStr();
  const { entries } = req.body;
  const totalHours = (entries || []).reduce((sum, e) => sum + (Number(e.hours) || 0), 0);

  let ts = await Timesheet.findOne({ user: req.user._id, date });
  if (!ts) {
    ts = await Timesheet.create({ user: req.user._id, date, entries, totalHours });
  } else {
    ts.entries = entries;
    ts.totalHours = totalHours;
    await ts.save();
  }
  res.json(ts);
}

export async function submitTimesheet(req, res) {
  const ts = await Timesheet.findById(req.params.id);
  if (!ts) return res.status(404).json({ message: "Timesheet not found" });
  if (String(ts.user) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

  const att = await Attendance.findOne({ user: req.user._id, date: ts.date });
  ts.late = !!(att && !att.clockOut && new Date().toISOString().slice(0,10) !== ts.date);
  ts.submitted = true;
  ts.submittedAt = new Date();
  await ts.save();
  res.json(ts);
}

export async function reopenTimesheet(req, res) {
  // Team Lead / HR only (route-level RBAC enforces this)
  const ts = await Timesheet.findById(req.params.id);
  if (!ts) return res.status(404).json({ message: "Timesheet not found" });
  ts.submitted = false;
  await ts.save();
  res.json(ts);
}

export async function myTimesheet(req, res) {
  const date = req.query.date || todayStr();
  const ts = await Timesheet.findOne({ user: req.user._id, date });
  res.json(ts || { entries: [], totalHours: 0, submitted: false, date });
}

export async function teamTimesheetStatus(req, res) {
  const date = req.query.date || todayStr();
  const records = await Timesheet.find({ date }).populate("user", "name employeeId department");
  res.json(records);
}
