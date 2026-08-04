import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  submitReport,
  listReports,
  getMyToday,
  teamStatus,
  reviewReport,
  nudge,
} from "../controllers/dailyReportController.js";

const router = express.Router();
router.use(protect);

const MANAGER_ROLES = ["Team Lead", "Dept Head", "HR", "Founder", "Super Admin"];

router.get("/", listReports);
router.get("/mine/today", getMyToday);
router.get("/team-status", allowRoles(...MANAGER_ROLES), teamStatus);
router.post("/", submitReport);
router.post("/:id/review", allowRoles(...MANAGER_ROLES), reviewReport);
router.post("/nudge/:userId", allowRoles(...MANAGER_ROLES), nudge);

// Attachment upload for a report (screenshot, doc, etc). Returns {name, url};
// the frontend appends this to the `attachments` array before submitting.
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(201).json({
    name: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
  });
});

export default router;
