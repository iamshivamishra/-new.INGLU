import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { listEmployees, getEmployee, createEmployee, updateEmployee, removeEmployee, getEmployeeMeta } from "../controllers/employeeController.js";
const router = express.Router();
router.use(protect);
router.get("/", listEmployees);
router.get("/meta", getEmployeeMeta); // must come before "/:id" or "meta" gets treated as an id
router.get("/:id", getEmployee);
router.post("/", allowRoles("Founder","Super Admin","HR"), createEmployee);
router.patch("/:id", allowRoles("Founder","Super Admin","HR","Finance"), updateEmployee);
router.delete("/:id", allowRoles("Founder","Super Admin","HR"), removeEmployee);
export default router;