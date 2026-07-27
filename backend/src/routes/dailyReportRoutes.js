import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { submitReport, listReports, reviewReport } from "../controllers/dailyReportController.js";
const router = express.Router();
router.use(protect);
router.post("/", submitReport);
router.get("/", listReports);
router.post("/:id/review", allowRoles("Team Lead","Dept Head","HR","Founder","Super Admin"), reviewReport);
export default router;
