import SocialSubmission from "../models/SocialSubmission.js";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export async function submit(req, res) {
  const date = req.body.date || todayStr();
  const sub = await SocialSubmission.create({ ...req.body, user: req.user._id, date });
  res.status(201).json(sub);
}

export async function todaySubmissions(req, res) {
  const date = todayStr();
  const subs = await SocialSubmission.find({ user: req.user._id, date });
  res.json(subs);
}

export async function pending(req, res) {
  const subs = await SocialSubmission.find({ status: "Pending" }).populate("user", "name employeeId department");
  res.json(subs);
}

export async function review(req, res) {
  const sub = await SocialSubmission.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, reviewedBy: req.user._id },
    { new: true }
  );
  if (!sub) return res.status(404).json({ message: "Not found" });
  res.json(sub);
}
