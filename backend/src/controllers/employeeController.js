import User from "../models/User.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(User, { populate: ["reportingManager"] });

export const listEmployees = base.list;
export const getEmployee = base.getOne;
export const updateEmployee = base.update;
export const removeEmployee = base.remove;

// Employee creation is via onboarding, but allow direct HR create too.
export async function createEmployee(req, res) {
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
}
