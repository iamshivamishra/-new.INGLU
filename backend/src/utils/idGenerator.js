import User from "../models/User.js";

// Generates EMP-YYYY-#### or INT-YYYY-#### per the PRD's ID automation rule (Section 11.1)
export async function generateEmployeeId(employmentType) {
  const prefix = employmentType === "Intern" ? "INT" : "EMP";
  const year = new Date().getFullYear();
  const count = await User.countDocuments({
    employeeId: { $regex: `^${prefix}-${year}-` },
  });
  const next = String(count + 1).padStart(4, "0");
  return `${prefix}-${year}-${next}`;
}
