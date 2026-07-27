import SalaryStructure from "../models/SalaryStructure.js";
import Payslip from "../models/Payslip.js";
import User from "../models/User.js";

export async function saveSalaryStructure(req, res) {
  const { userId, ctcAnnual, components } = req.body;
  const netPayableMonthly = (components || []).reduce(
    (sum, c) => sum + (c.type === "Earning" ? c.amount : -c.amount), 0
  );
  const structure = await SalaryStructure.findOneAndUpdate(
    { user: userId },
    { user: userId, ctcAnnual, components, netPayableMonthly },
    { new: true, upsert: true }
  );
  res.json(structure);
}

export async function getSalaryStructure(req, res) {
  const structure = await SalaryStructure.findOne({ user: req.params.userId });
  res.json(structure);
}

export async function runPayroll(req, res) {
  const { month } = req.body; // "2026-07"
  const structures = await SalaryStructure.find().populate("user", "name employeeId");
  const results = [];
  for (const s of structures) {
    const base = s.netPayableMonthly || 0;
    const deductions = 0; // In production: computed from Attendance + SocialSubmission exception tables
    const bonus = 0;
    const netPay = base - deductions + bonus;
    const payslip = await Payslip.findOneAndUpdate(
      { user: s.user._id, month },
      { user: s.user._id, month, base, deductions, bonus, netPay, status: "Draft" },
      { new: true, upsert: true }
    );
    results.push(payslip);
  }
  res.json(results);
}

export async function finalizePayslip(req, res) {
  const payslip = await Payslip.findByIdAndUpdate(req.params.id, { status: "Finalized" }, { new: true });
  if (!payslip) return res.status(404).json({ message: "Not found" });
  res.json(payslip);
}

export async function myPayslips(req, res) {
  const payslips = await Payslip.find({ user: req.user._id }).sort({ month: -1 });
  res.json(payslips);
}

export async function listPayslips(req, res) {
  const filter = {};
  if (req.query.month) filter.month = req.query.month;
  const payslips = await Payslip.find(filter).populate("user", "name employeeId");
  res.json(payslips);
}
