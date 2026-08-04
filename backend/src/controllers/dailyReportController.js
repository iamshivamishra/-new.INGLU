import DailyReport from "../models/DailyReport.js";
import User from "../models/User.js";
import { sendReportReminderEmail } from "../utils/mailer.js";

const MANAGER_ROLES = ["Team Lead", "Dept Head", "HR", "Founder", "Super Admin"];
// Reports for a given day are considered "on time" until this hour (24h clock),
// mirroring the PRD's 6:00 PM daily-report deadline.
const DEADLINE_HOUR = 18;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isManagerRole(role) {
  return MANAGER_ROLES.includes(role);
}

// Who a manager is allowed to see reports/status for:
// - HR / Founder / Super Admin: everyone
// - Dept Head / Team Lead: their own department (reportingManager isn't
//   consistently seeded in this demo, so department is the reliable scope)
async function scopedTeamFilter(req) {
  const { role, department, _id } = req.user;
  if (["Founder", "Super Admin", "HR"].includes(role)) return {};
  if (["Dept Head", "Team Lead"].includes(role)) return { department, _id: { $ne: _id } };
  return { _id }; // fallback: self only
}

/* ============================== SUBMIT / UPDATE (self) ============================== */

export async function submitReport(req, res) {
  const date = req.body.date || todayStr();
  const isBackfill = date < todayStr(); // filing for a past day
  const now = new Date();
  const isPastDeadlineToday = date === todayStr() && now.getHours() >= DEADLINE_HOUR;

  const existing = await DailyReport.findOne({ user: req.user._id, date });
  if (existing && existing.reviewed) {
    return res.status(403).json({
      message: "This report has already been reviewed by your manager and is locked for edits.",
    });
  }

  const payload = {
    summary: req.body.summary,
    completedTasks: req.body.completedTasks || [],
    pendingTasks: req.body.pendingTasks || [],
    tomorrowPlan: req.body.tomorrowPlan,
    challenges: req.body.challenges,
    attachments: req.body.attachments || [],
    user: req.user._id,
    date,
    submittedAt: now,
    late: isBackfill || isPastDeadlineToday,
  };

  const report = await DailyReport.findOneAndUpdate(
    { user: req.user._id, date },
    payload,
    { new: true, upsert: true, runValidators: true }
  );
  res.status(201).json(report);
}

/* ============================== READ ============================== */

export async function listReports(req, res) {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;
  if (req.query.userId) filter.user = req.query.userId;

  // Non-managers may only ever see their own reports, regardless of what
  // userId they pass in.
  if (!isManagerRole(req.user.role)) {
    filter.user = req.user._id;
  }

  const reports = await DailyReport.find(filter)
    .populate("user", "name employeeId department role")
    .populate("completedTasks", "title status")
    .populate("pendingTasks", "title status")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 });
  res.json(reports);
}

export async function getMyToday(req, res) {
  const date = req.query.date || todayStr();
  const report = await DailyReport.findOne({ user: req.user._id, date })
    .populate("completedTasks", "title status")
    .populate("pendingTasks", "title status");
  res.json(report || null);
}

/* ============================== MANAGER: TEAM STATUS ============================== */
// Drives the "Manager Review Queue" screen: every teammate, whether they've
// submitted today's (or a chosen date's) report, and whether it's been reviewed.

export async function teamStatus(req, res) {
  if (!isManagerRole(req.user.role)) {
    return res.status(403).json({ message: "Not permitted to view team report status" });
  }
  const date = req.query.date || todayStr();
  const teamFilter = await scopedTeamFilter(req);
  const teammates = await User.find({ ...teamFilter, status: "Active" }).select(
    "name employeeId department role"
  );

  const reports = await DailyReport.find({
    date,
    user: { $in: teammates.map((t) => t._id) },
  });
  const byUser = new Map(reports.map((r) => [String(r.user), r]));

  const rows = teammates.map((t) => {
    const r = byUser.get(String(t._id));
    return {
      userId: t._id,
      name: t.name,
      employeeId: t.employeeId,
      department: t.department,
      submitted: !!r,
      reportId: r?._id || null,
      submittedAt: r?.submittedAt || null,
      late: r?.late || false,
      reviewed: r?.reviewed || false,
    };
  });

  res.json({ date, rows });
}

/* ============================== MANAGER: REVIEW ============================== */

export async function reviewReport(req, res) {
  if (!isManagerRole(req.user.role)) {
    return res.status(403).json({ message: "Not permitted to review reports" });
  }
  const report = await DailyReport.findByIdAndUpdate(
    req.params.id,
    {
      reviewed: true,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      ...(req.body.managerComments !== undefined ? { managerComments: req.body.managerComments } : {}),
    },
    { new: true }
  )
    .populate("user", "name employeeId department")
    .populate("completedTasks", "title status")
    .populate("pendingTasks", "title status");
  if (!report) return res.status(404).json({ message: "Not found" });
  res.json(report);
}

/* ============================== MANAGER: NUDGE (manual reminder) ============================== */

export async function nudge(req, res) {
  if (!isManagerRole(req.user.role)) {
    return res.status(403).json({ message: "Not permitted to send reminders" });
  }
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "Employee not found" });

  const date = req.body.date || todayStr();
  const existing = await DailyReport.findOne({ user: user._id, date });
  if (existing) {
    return res.status(400).json({ message: `${user.name} has already submitted today's report.` });
  }

  const sent = await sendReportReminderEmail({ to: user.email, name: user.name });
  if (!sent) {
    console.log(`[REMINDER] Daily report nudge for ${user.name} (${user.email}) — SMTP not configured, logging only.`);
  }
  res.json({ message: `Reminder sent to ${user.name}.` });
}
