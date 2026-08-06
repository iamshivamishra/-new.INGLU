import User from "../models/User.js";
import { crudFactory } from "../utils/crudFactory.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const base = crudFactory(User, { populate: ["reportingManager"] });

export const listEmployees = base.list;
export const getEmployee = base.getOne;
export const updateEmployee = base.update;
export const removeEmployee = base.remove;

const ROLES = ["Founder", "Super Admin", "HR", "Finance", "Dept Head", "Team Lead", "Employee", "Intern"];
const EMPLOYMENT_TYPES = ["Full-Time", "Intern"];
const STATUSES = ["Active", "Inactive", "Onboarding", "Exited"];

// Dropdown/meta data for the Employee Directory add/edit form.
export const getEmployeeMeta = asyncHandler(async function getEmployeeMeta(req, res) {
  const [departments, managers] = await Promise.all([
    User.distinct("department"),
    User.find({ role: { $in: ["Founder", "Super Admin", "HR", "Dept Head", "Team Lead"] } }).select("name role"),
  ]);
  res.json({
    roles: ROLES,
    departments: departments.filter(Boolean),
    managers,
    statuses: STATUSES,
    employmentTypes: EMPLOYMENT_TYPES,
  });
});

// Employee creation is via onboarding, but allow direct HR create too.
export const createEmployee = asyncHandler(async function createEmployee(req, res) {
  const { employeeId, name, email, password, role, department, designation, employmentType } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
  if (exists) return res.status(400).json({ message: "Employee ID or email already exists" });
  const user = await User.create({
    employeeId, name, email, password: password || "Welcome@123",
    role, department, designation, employmentType,
  });
  const obj = user.toObject();
  delete obj.password;
  res.status(201).json(obj);
});