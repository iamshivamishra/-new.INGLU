import DailyReport from "../models/DailyReport.js";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export async function submitReport(req, res) {
  const date = req.body.date || todayStr();
  const payload = { ...req.body, user: req.user._id, date };
  const report = await DailyReport.findOneAndUpdate(
    { user: req.user._id, date },
    payload,
    { new: true, upsert: true }
  );
  res.status(201).json(report);
}

export async function listReports(req, res) {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;
  if (req.query.userId) filter.user = req.query.userId;
  const reports = await DailyReport.find(filter).populate("user", "name employeeId department").sort({ createdAt: -1 });
  res.json(reports);
}

export async function reviewReport(req, res) {
  const report = await DailyReport.findByIdAndUpdate(
    req.params.id,
    { reviewed: true, reviewedBy: req.user._id },
    { new: true }
  );
  if (!report) return res.status(404).json({ message: "Not found" });
  res.json(report);
}
