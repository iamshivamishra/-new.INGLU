import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { applyLeave, myBalance, myLeaves, pendingApprovals, decideLeave } from "../controllers/leaveController.js";
const router = express.Router();
router.use(protect);
router.post("/apply", applyLeave);
router.get("/balance", myBalance);
router.get("/mine", myLeaves);
router.get("/pending", allowRoles("Team Lead","Dept Head","HR","Founder","Super Admin"), pendingApprovals);
router.patch("/:id/decide", allowRoles("Team Lead","Dept Head","HR","Founder","Super Admin"), decideLeave);

// Supporting document upload for a leave application. Returns {name, url};
// frontend saves the url on the form as `documentUrl` before posting /apply.
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(201).json({
    name: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
  });
});

export default router;
